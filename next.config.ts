import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
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
