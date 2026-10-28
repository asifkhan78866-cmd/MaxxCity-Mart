type FieldValue = string | string[] | File;

type Options = {
  /** Origin header; null omits it (as a non-browser client would). */
  origin?: string | null;
  host?: string;
  ip?: string;
  startedAt?: number;
  submissionId?: string;
  /** Extra hidden fields, e.g. the honeypot. */
  hidden?: Record<string, string>;
  omitContentLength?: boolean;
};

let ipCounter = 0;

/** Builds a multipart POST exactly as the browser form would send it. */
export async function formRequest(form: string, fields: Record<string, FieldValue>, opts: Options = {}) {
  const fd = new FormData();
  fd.set("_startedAt", String(opts.startedAt ?? Date.now() - 10_000));
  fd.set("_submissionId", opts.submissionId ?? crypto.randomUUID());
  for (const [k, v] of Object.entries(opts.hidden ?? {})) fd.set(k, v);
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) value.forEach((v) => fd.append(key, v));
    else fd.append(key, value);
  }

  // Serialise once so the request carries a real Content-Length, like a browser.
  const encoded = new Response(fd);
  const body = await encoded.arrayBuffer();
  const headers = new Headers({
    "content-type": encoded.headers.get("content-type") ?? "multipart/form-data",
    host: opts.host ?? "localhost:3000",
    "x-forwarded-for": opts.ip ?? `10.1.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}`,
  });
  if (!opts.omitContentLength) headers.set("content-length", String(body.byteLength));
  if (opts.origin !== null) headers.set("origin", opts.origin ?? "http://localhost:3000");

  return new Request(`http://${opts.host ?? "localhost:3000"}/api/forms/${form}`, { method: "POST", headers, body });
}

export const routeContext = (form: string) => ({ params: Promise.resolve({ form }) });
