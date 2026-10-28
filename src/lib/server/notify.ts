import "server-only";
import { emailEnv } from "@/lib/config/env";

type NotifyInput = {
  subject: string;
  reference: string;
  formLabel: string;
  fields: [label: string, value: unknown][];
  fileLink?: string | null;
  replyTo?: string | null;
};

export type NotifyOutcome = "sent" | "not-configured" | "failed";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const show = (v: unknown) => {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
};

/**
 * Sends an internal notification to the business through Resend's HTTP API.
 * Returns "sent" only when Resend accepts the message.
 */
export async function notifyBusiness(input: NotifyInput): Promise<NotifyOutcome> {
  const env = emailEnv();
  if (env.status === "incomplete") {
    console.error(`[notify] Email is only partly configured; missing ${env.missing.join(", ")}.`);
  }
  if (env.status !== "configured") return "not-configured";
  const { apiKey, to, from } = env.config;

  const rows = input.fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#46524f;vertical-align:top;white-space:nowrap">${escape(label)}</td><td style="padding:6px 0;color:#121c1f">${escape(show(value)).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const fileRow = input.fileLink
    ? `<p style="margin:16px 0"><a href="${escape(input.fileLink)}">View the uploaded file</a> (private link, expires in 7 days)</p>`
    : "";
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">
<h2 style="margin:0 0 4px;font-size:18px;color:#0155a8">${escape(input.formLabel)}</h2>
<p style="margin:0 0 16px;color:#46524f">Reference <strong style="color:#121c1f">${escape(input.reference)}</strong></p>
<table style="border-collapse:collapse">${rows}</table>${fileRow}
<p style="margin-top:24px;color:#8a948f;font-size:12px">Sent by the MaxxCity Mart website. Reply to contact the sender if they shared an email address.</p></div>`;
  const text = [
    `${input.formLabel} — ${input.reference}`,
    "",
    ...input.fields.map(([l, v]) => `${l}: ${show(v)}`),
    input.fileLink ? `\nUploaded file (expires in 7 days): ${input.fileLink}` : "",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: input.subject,
        html,
        text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[notify] Resend rejected ${input.reference}: ${res.status} ${await res.text().catch(() => "")}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error(`[notify] Resend request failed for ${input.reference}:`, err);
    return "failed";
  }
}
