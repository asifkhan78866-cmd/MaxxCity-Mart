import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/franchise", priority: 0.9, changeFrequency: "monthly" },
  { path: "/request-product", priority: 0.9, changeFrequency: "monthly" },
  { path: "/stores", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/founder", priority: 0.6, changeFrequency: "yearly" },
  { path: "/manufacturers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/retailers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partner-with-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/product-request-terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/franchise-disclaimer", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/business-enquiry-disclaimer", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: r.changeFrequency, priority: r.priority }));
}
