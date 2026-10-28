import type { NextConfig } from "next";

/**
 * Content-Security-Policy for production builds.
 * - Scripts, styles, fonts and images load from this site only, plus the
 *   optional analytics providers (loaded only after visitor consent) and the
 *   Vercel preview toolbar.
 * - 'unsafe-inline' is required for Next.js's inline bootstrap scripts and
 *   the JSON-LD blocks without per-request nonces, which would force every
 *   page to render dynamically.
 * - blob: images are the local preview of a photo before upload.
 * Development is left without a CSP because Next.js dev tooling needs eval.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://vercel.live https://vercel.com",
  "font-src 'self' https://vercel.live",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://plausible.io https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://vercel.live",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production"
    ? [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      ]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    // Friendly and legacy URLs. Add an entry here whenever a page moves.
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/franchise-enquiry", destination: "/franchise#apply", permanent: true },
      { source: "/apply", destination: "/franchise#apply", permanent: true },
      { source: "/request", destination: "/request-product", permanent: true },
      { source: "/product-request", destination: "/request-product", permanent: true },
      { source: "/store", destination: "/stores", permanent: true },
      { source: "/locations", destination: "/stores", permanent: true },
      { source: "/partners", destination: "/partner-with-us", permanent: true },
      { source: "/suppliers", destination: "/manufacturers", permanent: true },
      { source: "/distributors", destination: "/retailers", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/privacy-policy", destination: "/legal/privacy", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/legal", destination: "/legal/privacy", permanent: false },
    ];
  },
};

export default nextConfig;
