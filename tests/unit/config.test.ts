import { afterEach, describe, expect, it, vi } from "vitest";
import { emailEnv, localStoreEnv, supabaseEnv } from "@/lib/config/env";
import { resolveSiteUrl } from "@/lib/config/public-env";
import { storageMode } from "@/lib/storage/submissions";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const clearSupabase = () => {
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SECRET_KEY", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("SUPABASE_STORAGE_BUCKET", "");
};

describe("supabaseEnv", () => {
  it("is missing when nothing is set", () => {
    clearSupabase();
    expect(supabaseEnv()).toEqual({ status: "missing" });
  });

  it("is incomplete when only some variables are set", () => {
    clearSupabase();
    vi.stubEnv("SUPABASE_URL", "https://x.supabase.co");
    expect(supabaseEnv()).toEqual({ status: "incomplete", missing: ["SUPABASE_SECRET_KEY"] });
  });

  it("accepts the legacy service-role key name and defaults the bucket", () => {
    clearSupabase();
    vi.stubEnv("SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "legacy");
    expect(supabaseEnv()).toEqual({
      status: "configured",
      config: { url: "https://x.supabase.co", secretKey: "legacy", bucket: "enquiry-uploads" },
    });
  });

  it("treats whitespace-only values as unset", () => {
    clearSupabase();
    vi.stubEnv("SUPABASE_URL", "   ");
    expect(supabaseEnv().status).toBe("missing");
  });
});

describe("emailEnv", () => {
  it("splits multiple recipients", () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("NOTIFY_EMAIL_TO", "a@example.com, b@example.com,");
    vi.stubEnv("NOTIFY_EMAIL_FROM", "Site <site@example.com>");
    const env = emailEnv();
    expect(env.status === "configured" && env.config.to).toEqual(["a@example.com", "b@example.com"]);
  });

  it("flags a partial setup", () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    vi.stubEnv("NOTIFY_EMAIL_TO", "");
    vi.stubEnv("NOTIFY_EMAIL_FROM", "");
    expect(emailEnv()).toEqual({ status: "incomplete", missing: ["NOTIFY_EMAIL_TO", "NOTIFY_EMAIL_FROM"] });
  });
});

describe("storageMode", () => {
  it("uses the local file store only in development and tests", () => {
    clearSupabase();
    vi.stubEnv("NODE_ENV", "development");
    expect(storageMode()).toBe("local");
    vi.stubEnv("NODE_ENV", "test");
    expect(storageMode()).toBe("local");
    vi.stubEnv("NODE_ENV", "production");
    expect(storageMode()).toBe("unavailable");
    expect(localStoreEnv().allowed).toBe(false);
  });

  it("never falls back to local files when Supabase is half-configured", () => {
    clearSupabase();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("SUPABASE_SECRET_KEY", "secret-without-url");
    expect(storageMode()).toBe("unavailable");
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/missing SUPABASE_URL/));
  });
});

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.com/");
    expect(resolveSiteUrl()).toBe("https://www.example.com");
  });

  it("falls back to the Vercel production domain, then localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "maxxcity.vercel.app");
    expect(resolveSiteUrl()).toBe("https://maxxcity.vercel.app");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(resolveSiteUrl()).toBe("http://localhost:3000");
  });

  it("warns when a production build would publish localhost URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    resolveSiteUrl();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/NEXT_PUBLIC_SITE_URL is not set/));
  });
});
