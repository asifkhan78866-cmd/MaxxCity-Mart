/**
 * Browser-safe configuration.
 *
 * Next.js inlines NEXT_PUBLIC_* variables at build time, and only when they
 * are written out literally as process.env.NEXT_PUBLIC_NAME — so each one is
 * referenced explicitly below. Never put a secret in a NEXT_PUBLIC_ variable.
 */

export const publicEnv = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "",
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "",
};

export const analyticsConfigured = Boolean(publicEnv.gaMeasurementId || publicEnv.plausibleDomain);

let warnedAboutSiteUrl = false;

/**
 * Canonical origin of the site, without a trailing slash.
 * Server-side only falls back to Vercel's production domain, then localhost.
 */
export function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production" && typeof window === "undefined" && !warnedAboutSiteUrl) {
    warnedAboutSiteUrl = true;
    console.warn("[config] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, sitemap and social previews will point to localhost.");
  }
  return "http://localhost:3000";
}
