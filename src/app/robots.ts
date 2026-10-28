import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo/metadata";
import { vercelEnv } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed.
  const deployment = vercelEnv();
  const isProduction = deployment ? deployment === "production" : true;
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
