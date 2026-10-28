import type { Metadata } from "next";
import { site } from "@/content/site";
import { contact } from "@/content/contact";
import { openStores, type Store } from "@/content/stores";
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

/* ---------- Structured data ---------- */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    logo: absoluteUrl("/brand/maxxcity-mart-logo.png"),
    slogan: site.promise,
    founder: { "@type": "Person", name: site.founder.name },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contact.phoneE164,
        contactType: "customer service",
        areaServed: "IN",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-IN",
  };
}

/** LocalBusiness (Store) markup — only for verified open branches, only with fields we actually know. */
export function storeJsonLd(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${siteUrl}/stores#${store.slug}`,
    name: store.name,
    url: absoluteUrl(`/stores#${store.slug}`),
    image: store.photo ? absoluteUrl(store.photo.src) : undefined,
    telephone: store.phoneE164 ?? contact.phoneE164,
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: [store.premises, store.street, store.landmark, store.locality].filter(Boolean).join(", "),
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: "IN",
    },
    hasMap: store.mapsUrl ?? undefined,
  };
}

export const allStoresJsonLd = () => openStores.map(storeJsonLd);

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
