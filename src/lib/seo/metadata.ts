import type { Metadata } from "next";
import { site } from "@/content/site";
import { resolveSiteUrl } from "@/lib/config/public-env";

export const siteUrl = resolveSiteUrl();
export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

const ogImage = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "MaxxCity Mart logo beside the Adilabad storefront",
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Set for pages that should not appear in search results. */
  noindex?: boolean;
};

/** Per-page metadata with canonical URL and social previews. */
export function pageMetadata({ title, description, path, noindex }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export const defaultOgImage = ogImage;
