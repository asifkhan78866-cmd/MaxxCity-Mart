import "server-only";
import { contact } from "@/content/contact";
import { notifyBusiness } from "@/lib/email/notify-business";
import { type FormDefinition, notificationFields } from "@/lib/forms/define-form";
import type { SubmitResult } from "@/lib/forms/types";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { checkDeclaredSize, checkHuman, checkSameOrigin, readSubmissionId } from "@/lib/security/request-guards";
import { type PreparedFile, prepareUpload, UploadError } from "@/lib/security/uploads";
import { persistSubmission, storageMode } from "@/lib/storage/submissions";

const RATE_LIMIT = { max: 10, windowMs: 10 * 60 * 1000 };
const SERVICE_DOWN = `Online submissions are temporarily unavailable. Please call or WhatsApp us on ${contact.phoneDisplay}.`;

export const reply = (body: SubmitResult, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const reject = (r: { status: number; message: string }) => reply({ ok: false, message: r.message }, r.status);

type Options = {
  /** Runs work after the response is sent — Next.js after() in the route, immediate in tests. */
  defer: (task: () => Promise<void>) => void;
};

/**
 * The full lifecycle of one enquiry:
 * request checks → rate limit → read body → spam checks → validate → upload
 * → save → respond → (after responding) notify the business.
 */
export async function submitForm(definition: FormDefinition, request: Request, { defer }: Options) {
  const rejected = checkSameOrigin(request.headers) ?? checkDeclaredSize(request.headers);
  if (rejected) return reject(rejected);

  const limit = rateLimit(`${definition.id}:${clientIp(request.headers)}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (!limit.ok) {
    return reply(
      {
        ok: false,
        message: "We've received several submissions from you in a short time. Please wait a few minutes and try again.",
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  if (storageMode() === "unavailable") {
    console.error("[forms] Submission storage is not configured; refusing submission.");
    return reply({ ok: false, message: SERVICE_DOWN }, 503);
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return reply({ ok: false, message: "We couldn't read the form. Please refresh the page and try again." }, 400);
  }

  const notHuman = checkHuman(fd);
  if (notHuman) return reject(notHuman);
  const submissionId = readSubmissionId(fd);
  if (!submissionId) return reply({ ok: false, message: "Please refresh the page and try again." }, 400);

  // Plain fields; underscore-prefixed fields are internal, and empty values count as absent.
  const raw: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (key.startsWith("_") || typeof value !== "string") continue;
    if (definition.arrays?.includes(key)) {
      raw[key] = [...((raw[key] as string[] | undefined) ?? []), value];
    } else if (value !== "") {
      raw[key] = value;
    }
  }
  for (const key of definition.arrays ?? []) raw[key] ??= [];

  const parsed = definition.schema.safeParse(raw);
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
  }

  let prepared: PreparedFile | null = null;
  const upload = definition.file ? fd.get(definition.file.field) : null;
  if (definition.file && upload instanceof File && upload.size > 0) {
    try {
      prepared = await prepareUpload(upload, definition.file.kind);
    } catch (err) {
      if (!(err instanceof UploadError)) throw err;
      fieldErrors[definition.file.field] = err.message;
    }
  }

  if (parsed.success && definition.check) {
    Object.assign(fieldErrors, definition.check(parsed.data, Boolean(prepared)) ?? {});
  }
  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return reply({ ok: false, message: "Please correct the highlighted fields.", fieldErrors }, 422);
  }
  const data = parsed.data;

  let saved;
  try {
    saved = await persistSubmission({
      form: definition.id,
      table: definition.table,
      prefix: definition.prefix,
      submissionId,
      data,
      file: prepared && definition.file ? { column: definition.file.column, prepared } : null,
    });
  } catch (err) {
    console.error(`[forms] Failed to save ${definition.id} submission:`, err);
    return reply({ ok: false, message: `We couldn't save your submission. ${SERVICE_DOWN}` }, 500);
  }

  if (!saved.duplicate) {
    const { reference, fileLink } = saved;
    // Already saved: email the business after responding, so the visitor is not kept waiting.
    defer(async () => {
      const outcome = await notifyBusiness({
        subject: definition.subject(data, reference),
        formLabel: definition.label,
        reference,
        fields: notificationFields(definition, data),
        fileLink,
        replyTo: typeof data.email === "string" ? data.email : null,
      });
      if (outcome !== "sent") console.warn(`[forms] ${reference} saved; notification ${outcome}.`);
    });
  }

  return reply({ ok: true, reference: saved.reference }, saved.duplicate ? 200 : 201);
}
