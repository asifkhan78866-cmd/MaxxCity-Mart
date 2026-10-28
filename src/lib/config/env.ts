import "server-only";

/**
 * Server-only configuration. Every server-side environment variable is read
 * here, at call time (not import time), so tests and deployments see the
 * current values. Secrets never leave this module's callers on the server.
 *
 * Browser-visible values live in ./public-env.ts.
 */

const read = (name: string) => process.env[name]?.trim() || undefined;

type Integration<T> =
  | { status: "configured"; config: T }
  | { status: "missing" }
  /** Some, but not all, of the variables are set — almost always a deployment mistake. */
  | { status: "incomplete"; missing: string[] };

function integration<T>(vars: Record<string, string | undefined>, build: (v: Record<string, string>) => T): Integration<T> {
  const missing = Object.entries(vars)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length === Object.keys(vars).length) return { status: "missing" };
  if (missing.length > 0) return { status: "incomplete", missing };
  return { status: "configured", config: build(vars as Record<string, string>) };
}

export function supabaseEnv() {
  return integration(
    {
      SUPABASE_URL: read("SUPABASE_URL"),
      // The newer "secret" key and the legacy service-role key are interchangeable here.
      SUPABASE_SECRET_KEY: read("SUPABASE_SECRET_KEY") ?? read("SUPABASE_SERVICE_ROLE_KEY"),
    },
    (v) => ({
      url: v.SUPABASE_URL!,
      secretKey: v.SUPABASE_SECRET_KEY!,
      bucket: read("SUPABASE_STORAGE_BUCKET") ?? "enquiry-uploads",
    }),
  );
}

export function emailEnv() {
  return integration(
    {
      RESEND_API_KEY: read("RESEND_API_KEY"),
      NOTIFY_EMAIL_TO: read("NOTIFY_EMAIL_TO"),
      NOTIFY_EMAIL_FROM: read("NOTIFY_EMAIL_FROM"),
    },
    (v) => ({
      apiKey: v.RESEND_API_KEY!,
      to: v.NOTIFY_EMAIL_TO!.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      from: v.NOTIFY_EMAIL_FROM!,
    }),
  );
}

/**
 * The JSON-file submission store exists only for local development and tests.
 * It is never used when NODE_ENV is "production" — which includes every
 * Vercel deployment, previews too.
 */
export function localStoreEnv() {
  const env = process.env.NODE_ENV;
  return {
    allowed: env === "development" || env === "test",
    dir: read("LOCAL_SUBMISSIONS_DIR"),
  };
}

/** "production" | "preview" | "development" on Vercel; undefined elsewhere. */
export const vercelEnv = () => read("VERCEL_ENV");
