import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { stores } from "@/content/stores";
import { breadcrumbJsonLd, organizationJsonLd, storeJsonLd } from "@/lib/seo/json-ld";
import { defaultOgImage, pageMetadata, siteUrl } from "@/lib/seo/metadata";

/** Every public page route under src/app, e.g. "/legal/privacy". */
function pageRoutes(dir = path.resolve("src/app"), prefix = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "api" || entry.startsWith("_") || entry.startsWith("(")) continue;
      routes.push(...pageRoutes(full, `${prefix}/${entry}`));
    } else if (entry === "page.tsx") {
      routes.push(prefix || "/");
    }
  }
  return routes.sort();
}

afterEach(() => vi.unstubAllEnvs());

describe("sitemap", () => {
  it("lists exactly the public pages", () => {
    const listed = sitemap()
      .map((e) => e.url.replace(siteUrl, "") || "/")
      .sort();
    expect(listed).toEqual(pageRoutes());
  });
});

describe("robots", () => {
  it("allows the site, hides the API and points to the sitemap in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/", disallow: ["/api/"] });
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(r).not.toHaveProperty("host");
  });

  it("blocks preview deployments from indexing", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
});

describe("page metadata", () => {
  it("sets the canonical URL and social previews", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/franchise" });
    expect(meta.alternates?.canonical).toBe("/franchise");
    expect(meta.openGraph).toMatchObject({ url: "/franchise", title: "T", description: "D" });
    expect(meta.robots).toBeUndefined();
    expect(pageMetadata({ title: "T", description: "D", path: "/x", noindex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });
});

describe("referenced images", () => {
  it("exist in public/", () => {
    const paths = [defaultOgImage.url, ...stores.flatMap((s) => (s.photo ? [s.photo.src] : []))];
    for (const p of paths) expect(existsSync(path.join("public", p)), p).toBe(true);
  });
});

describe("structured data", () => {
  it("describes stores only with verified facts", () => {
    for (const store of stores) {
      const ld = storeJsonLd(store);
      expect(ld["@type"]).toBe("Store");
      expect(ld.address.postalCode).toBe(store.postalCode);
      for (const invented of ["aggregateRating", "review", "priceRange", "geo", "openingHoursSpecification"]) {
        expect(ld).not.toHaveProperty(invented);
      }
    }
  });

  it("names the organisation and founder", () => {
    expect(organizationJsonLd()).toMatchObject({ "@type": "Organization", name: "MaxxCity Mart", founder: { name: "Syed Asif" } });
  });

  it("numbers breadcrumbs from 1 with absolute URLs", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Stores", path: "/stores" },
    ]);
    expect(ld.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, siteUrl],
      [2, `${siteUrl}/stores`],
    ]);
  });
});
