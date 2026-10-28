import type { NextRequest } from "next/server";
import { formIds, type FormId, type SubmitResult } from "@/lib/forms/types";
import { forms, displayValue } from "@/lib/server/registry";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { prepareUpload, UploadError, type PreparedFile } from "@/lib/server/files";
import { persistSubmission, storageMode } from "@/lib/server/storage";
import { notifyBusiness } from "@/lib/server/notify";
import { contact } from "@/content/site";

const MAX_BODY_BYTES = 4.5 * 1024 * 1024;
const MIN_FILL_MS = 2500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SERVICE_DOWN = `Online submissions are temporarily unavailable. Please call or WhatsApp us on ${contact.phoneDisplay}.`;

const reply = (body: SubmitResult, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: NextRequest, ctx: RouteContext<"/api/forms/[form]">) {
  const { form } = await ctx.params;
  if (!formIds.includes(form as FormId)) {
    return reply({ ok: false, message: "Unknown form." }, 404);
  }
  const config = forms[form as FormId];

  // Same-origin check: browsers always send Origin on cross-site POSTs.
  // Behind a proxy, the public host arrives in x-forwarded-host.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && URL.parse(origin)?.host !== host) {
    return reply({ ok: false, message: "This form can only be submitted from the MaxxCity Mart website." }, 403);
  }

  // Browsers always declare the body size for form uploads. Requiring it means
  // the size limit below cannot be sidestepped with a streamed (chunked) body.
  const declared = request.headers.get("content-length");
  if (declared === null) {
    return reply({ ok: false, message: "Please refresh the page and try again." }, 411);
  }
  const length = Number(declared);
  if (!Number.isFinite(length) || length > MAX_BODY_BYTES) {
    return reply({ ok: false, message: "The upload is too large. Please choose a file under 4 MB." }, 413);
  }

  const limit = rateLimit(`${form}:${clientIp(request.headers)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return reply(
      { ok: false, message: "We've received several submissions from you in a short time. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  if (storageMode() === "unavailable") {
    console.error("[forms] Supabase is not configured; refusing submission.");
    return reply({ ok: false, message: SERVICE_DOWN }, 503);
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return reply({ ok: false, message: "We couldn't read the form. Please refresh the page and try again." }, 400);
  }

  // Spam checks: a hidden field people never see, and a minimum time on the form.
  const startedAt = Number(fd.get("_startedAt"));
  if (fd.get("_website") || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return reply({ ok: false, message: "Please check your details and press submit again." }, 400);
  }
  const submissionId = String(fd.get("_submissionId") ?? "");
  if (!UUID.test(submissionId)) {
    return reply({ ok: false, message: "Please refresh the page and try again." }, 400);
  }

  // Collect plain fields.
  const raw: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (key.startsWith("_") || typeof value !== "string") continue;
    if (config.arrays?.includes(key)) {
      raw[key] = [...((raw[key] as string[]) ?? []), value];
    } else if (value !== "") {
      raw[key] = value;
    }
  }
  for (const key of config.arrays ?? []) raw[key] ??= [];

  const parsed = config.schema.safeParse(raw);
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
  }

  // Optional file.
  let prepared: PreparedFile | null = null;
  const upload = config.file ? fd.get(config.file.field) : null;
  if (config.file && upload instanceof File && upload.size > 0) {
    try {
      prepared = await prepareUpload(upload, config.file.kind);
    } catch (err) {
      if (!(err instanceof UploadError)) throw err;
      fieldErrors[config.file.field] = err.message;
    }
  }

  if (parsed.success && config.check) {
    Object.assign(fieldErrors, config.check(parsed.data, Boolean(prepared)) ?? {});
  }

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return reply({ ok: false, message: "Please correct the highlighted fields.", fieldErrors }, 422);
  }
  const data = parsed.data;

  let saved;
  try {
    saved = await persistSubmission({
      form,
      table: config.table,
      prefix: config.prefix,
      submissionId,
      data,
      file: prepared && config.file ? { column: config.file.column, prepared } : null,
    });
  } catch (err) {
    console.error(`[forms] Failed to save ${form} submission:`, err);
    return reply({ ok: false, message: `We couldn't save your submission. ${SERVICE_DOWN}` }, 500);
  }

  if (!saved.duplicate) {
    const outcome = await notifyBusiness({
      subject: config.subject(data, saved.reference),
      formLabel: config.label,
      reference: saved.reference,
      fields: config.fields.map(([key, label]) => [label, displayValue(key, data[key])]),
      fileLink: saved.fileLink,
      replyTo: typeof data.email === "string" ? data.email : null,
    });
    if (outcome !== "sent") console.warn(`[forms] ${saved.reference} saved; notification ${outcome}.`);
  }

  return reply({ ok: true, reference: saved.reference }, saved.duplicate ? 200 : 201);
}
