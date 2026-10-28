# Updating website content

Business details live in plain TypeScript files in `src/content/`. Edit the text between the quotes, run `npm run check`, commit, and push. Vercel redeploys automatically. No database or admin panel is involved.

> Only publish details that are confirmed. Leave unknown values as `null` or empty; the site hides them rather than guessing.

## Where everything lives

| What you want to change | File | Notes |
| --- | --- | --- |
| Phone number, WhatsApp number, prefilled WhatsApp messages | `src/content/contact.ts` → `contact` | Update all three phone formats together: `phoneDisplay` (shown), `phoneE164` (`+91…`, for calls), `whatsappNumber` (digits only). |
| Contact form topics | `src/content/contact.ts` → `contactTopics` | Changing a `value` invalidates links like `/contact?topic=property`. Change only the `label` unless needed. |
| Brand name, tagline, promise, site description | `src/content/site.ts` → `site` | `description` is the default search/social description. |
| Registered company name (privacy policy) | `src/content/site.ts` → `site.legalName` | Set it once the legal entity is confirmed. |
| **₹99 copy**: headline, body, fine print, promo line | `src/content/site.ts` → `pricing` | `promo` shows a dark pill above the price band; leave `""` to hide it. Keep claims to what the store actually offers. |
| **Founder** message and photo | `src/content/site.ts` → `site.founder` | Put an approved photo at `public/images/founder/<name>.jpg` (portrait, at least 800×1000) and set `photo: "/images/founder/<name>.jpg"`. Until then an "SA" monogram is shown. |
| **Franchise** support list, responsibilities, process steps | `src/content/franchise.ts` | |
| Franchise form options (investment readiness, property) | `src/content/franchise.ts` → `franchise.investmentReadiness`, `franchise.propertyOptions` | Labels can change freely. Changing a `value` affects how new submissions are stored. |
| **Approved commercial terms** (fee, investment, area, term) | `src/content/franchise.ts` → `franchise.figures` | Hidden until you fill them in **and** set `published: true`. Do not publish figures the business has not approved. |
| **Product categories** (home and About) | `src/content/categories.ts` → `productCategories` | `icon` is a [Lucide](https://lucide.dev/icons) icon name. A new icon must also be added to `src/components/sections/category-grid.tsx`. |
| Manufacturer categories | `src/content/categories.ts` → `supplierCategories` | |
| Manufacturer process, retailer partnership types | `src/content/partnerships.ts` | |
| Product-request steps, price ranges | `src/content/product-requests.ts` | |
| **FAQs** | `src/content/faqs.ts` | Add `home: true` to show a question on the homepage too. Keep answers factual; for commercial questions with no approved answer, say the team will confirm directly. |
| Header, footer and legal links | `src/content/navigation.ts` | A new page also needs an entry in `src/app/sitemap.ts`. |
| States list | `src/content/regions.ts` | |
| Legal page wording | `src/app/legal/<policy>/page.tsx` | Update `legalLastUpdated` in `src/content/site.ts` whenever a policy changes. Legal changes need business/legal approval. |
| Page titles and search descriptions | the `metadata` export at the top of each `src/app/<page>/page.tsx` | Keep descriptions under about 160 characters. |
| Social sharing image | `public/social/og-default.jpg` | 1200×630 JPEG. |

## Stores and collection points

`src/content/stores.ts`. One entry per store. **Add a store only once it is open and its details are verified.**

```ts
{
  slug: "nirmal-main-road",            // unique, lowercase, used in links (/stores#nirmal-main-road)
  name: "MaxxCity Mart Nirmal",
  status: "open",                      // or "coming-soon" (shown in a separate section; not a collection point)
  city: "Nirmal",
  locality: "…",
  state: "Telangana",
  postalCode: "…",
  premises: "…",                       // door number, or null
  street: "…",
  landmark: null,                      // e.g. "Opposite …", or null
  phoneE164: null,                     // branch phone, or null to show the main line
  phoneDisplay: null,
  mapsUrl: "https://maps.app.goo.gl/…",
  hours: null,                         // e.g. [{ days: "Mon–Sun", hours: "10:00 am – 10:00 pm" }] once confirmed
  acceptsProductRequestCollection: false,  // true only once the branch agrees to handle collections
  photo: null,                         // { src: "/images/storefront/<file>.jpg", alt: "…" }
}
```

What updates automatically: the store directory, the homepage and footer address, the contact page, the **Request a Product** branch list (only `open` stores with `acceptsProductRequestCollection: true`), the server-side check of which branches are allowed, and the `Store` structured data for search engines.

Fields left as `null` are simply not shown. Hours, for example, display "please call ahead" until set. Never fill them with estimates.

## Social links and site metadata

- Default title, description and social image: `src/app/layout.tsx` and `src/lib/seo/metadata.ts`.
- The site has no social-media profile links yet. When accounts exist, add them to `src/content/site.ts` (e.g. `social: { instagram: "https://…" }`), show them in `src/components/layout/site-footer.tsx`, and add them as `sameAs` in `organizationJsonLd()` in `src/lib/seo/json-ld.ts`.

## Images

- Use **real** photographs of MaxxCity Mart: stores, products and people, with permission. Do not use generated or stock storefronts presented as ours.
- Never redraw or recolour the logo. The original is `public/brand/maxxcity-mart-logo.png`.
- Every image needs descriptive `alt` text, written where the image is used.
- Large photos are fine: `next/image` resizes and converts them to AVIF/WebP automatically.

## After editing

```bash
npm run check          # lint, types, tests (the tests catch e.g. a page missing from the sitemap)
git add -A && git commit -m "content: update store hours"
git push               # Vercel redeploys main
```
