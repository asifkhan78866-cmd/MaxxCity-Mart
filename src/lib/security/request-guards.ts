import "server-only";

/**
 * Checks applied to every form submission before (and right after) the body
 * is read. Each returns null when the request passes, or a status and a
 * visitor-facing message when it does not.
 */

type Rejection = { status: number; message: string };

/** Largest request body accepted; Vercel caps function bodies at 4.5 MB. */
export const MAX_BODY_BYTES = 4.5 * 1024 * 1024;
/** Faster than this between page load and submit is treated as automated. */
export const MIN_FILL_MS = 2500;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Browsers always send Origin on cross-site POSTs, so a mismatch means
 * another website is submitting the form. Behind a proxy the public host
 * arrives in x-forwarded-host. Requests without Origin (non-browser clients)
 * pass here and rely on the other checks.
 */
export function checkSameOrigin(headers: Headers): Rejection | null {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (origin && URL.parse(origin)?.host !== host) {
    return { status: 403, message: "This form can only be submitted from the MaxxCity Mart website." };
  }
  return null;
}

/**
 * Browsers always declare the body size for form uploads. Requiring it means
 * the limit cannot be sidestepped with a streamed (chunked) body.
 */
export function checkDeclaredSize(headers: Headers): Rejection | null {
  const declared = headers.get("content-length");
  if (declared === null) return { status: 411, message: "Please refresh the page and try again." };
  const length = Number(declared);
  if (!Number.isFinite(length) || length > MAX_BODY_BYTES) {
    return { status: 413, message: "The upload is too large. Please choose a file under 4 MB." };
  }
  return null;
}

/**
 * Spam checks: a hidden field people never see, and a minimum time on the
 * form. The start time must be present and plausible: a missing value would
 * otherwise read as 0 (1970) and pass the timing check.
 */
export function checkHuman(fd: FormData, now = Date.now()): Rejection | null {
  const rejection = { status: 400, message: "Please check your details and press submit again." };
  if (fd.get("_website")) return rejection;
  const raw = fd.get("_startedAt");
  const startedAt = typeof raw === "string" && /^\d{13}$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isFinite(startedAt) || startedAt > now + 60_000 || now - startedAt < MIN_FILL_MS) return rejection;
  return null;
}

/** The one-time id the browser generates per submission, used to de-duplicate retries. */
export function readSubmissionId(fd: FormData): string | null {
  const id = fd.get("_submissionId");
  return typeof id === "string" && UUID.test(id) ? id : null;
}
