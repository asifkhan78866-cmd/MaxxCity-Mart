import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
