# MaxxCity Mart — official website

The public website for **MaxxCity Mart** — *Maxx Saving • Maxx Value*.

It explains the ₹99 fixed-price retail concept, shows the Adilabad store, and takes four kinds of enquiry:
franchise (FOFO) applications, customer product requests with photo upload, manufacturer and retailer
partnership enquiries, and general contact. It is **not** a shop, POS, billing, inventory or accounting system:
no products are sold and no payments are taken.

- **Framework:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4
- **Forms:** server-side validation with Zod · Supabase Postgres + private Storage · optional Resend email
- **Icons:** Lucide · **Images:** `next/image` + `sharp`

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

```bash
npm run lint         # ESLint
npx tsc --noEmit     # type check
npm run build        # production build
npm start            # serve the production build
```

**Without Supabase configured**, development mode saves submissions to newline-delimited JSON in `.data/`
(uploads in `.data/uploads/`). That folder is git-ignored. In production, forms refuse submissions with a
clear "please call or WhatsApp us" message rather than pretending to save them.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. Never commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Live URL, no trailing slash. Drives canonical URLs, sitemap, social previews. |
| `SUPABASE_URL` | Production | Supabase project URL. |
| `SUPABASE_SECRET_KEY` | Production | Supabase secret (service-role) key. Server-only. `SUPABASE_SERVICE_ROLE_KEY` is also accepted. |
| `SUPABASE_STORAGE_BUCKET` | No | Defaults to `enquiry-uploads`. |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | No | Email the business on each submission. All three must be set. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Analytics, loaded only after the visitor accepts. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console HTML-tag verification. |

---

## Supabase setup

1. Create a Supabase project (choose the Mumbai region for Indian visitors).
2. Open **SQL Editor** and run [`supabase/migrations/20261029000000_website_enquiries.sql`](supabase/migrations/20261029000000_website_enquiries.sql)
   (or `supabase db push` if you use the Supabase CLI). It creates:
   - `franchise_enquiries`, `product_requests`, `manufacturer_enquiries`, `retailer_enquiries`,
     `contact_enquiries`, `location_interest`;
   - a **private** storage bucket `enquiry-uploads` (4 MB, JPEG/PDF only).
3. Copy the project URL and the **secret** key (Project Settings → API Keys) into your environment.

**Security model.** Row-level security is enabled on every table with no policies, and all privileges are revoked
from the `anon` and `authenticated` roles. The public cannot read or write anything directly; only the website's
server route (`/api/forms/[form]`), using the secret key, can insert rows and upload files. Uploaded files are
never public — the notification email contains a signed link that expires after 7 days. Each row has a
`status` (`new`, `in_review`, `contacted`, `approved`, `declined`, `closed`) and an `internal_notes` column for
the team to use in the Supabase Table Editor.

There is intentionally no admin panel: review submissions in the Supabase dashboard. Give team members their own
Supabase dashboard accounts instead of sharing keys.

---

## Email notifications (Resend)

1. Create a Resend account and verify your sending domain.
2. Set `RESEND_API_KEY`, `NOTIFY_EMAIL_TO` (comma-separated) and `NOTIFY_EMAIL_FROM` (an address on the verified domain).

Emails are sent only after the submission is saved. If Resend is not configured or rejects a message, the
submission is still saved and the visitor still gets their reference — the server logs the notification outcome.
The website never tells visitors that an email was sent.

---

## How the forms are protected

- Every field is validated on the server with Zod ([`src/lib/server/schemas.ts`](src/lib/server/schemas.ts)); the browser checks are only a convenience.
- Uploads are checked by size and by their actual file signature (not the browser's claim). Images are decoded and re-encoded with `sharp`, which rejects fake images and strips metadata such as GPS location. Phones also shrink photos before uploading.
- Spam: a hidden honeypot field, a minimum time-on-form, and a same-origin check.
- Duplicate submissions: each form sends a one-time submission ID; retries return the original reference (enforced by a unique column).
- Rate limiting: 10 submissions per form per IP per 10 minutes. This is held in memory per server instance — for a hard global limit add Vercel Firewall rate limiting on `/api/forms/*` or move the counter to Upstash Redis ([`src/lib/server/rate-limit.ts`](src/lib/server/rate-limit.ts)).
- References look like `PR-261029-K7Q2M` (`FR` franchise, `PR` product request, `MF` manufacturer, `RT` retailer, `GE` general, `LI` location interest). They contain no personal data.

---

## Updating business content

Most content is plain data — edit the file, commit, and redeploy.

| What | Where |
| --- | --- |
| Phone, WhatsApp number, prefilled WhatsApp messages | [`src/content/site.ts`](src/content/site.ts) → `contact` |
| ₹99 headline, body, fine print, optional promo line | `src/content/site.ts` → `pricing` |
| Founder photo and vision statement | `src/content/site.ts` → `site.founder` (put the photo in `public/images/` and set `photo`) |
| Franchise figures (fee, investment, area, term) | `src/content/site.ts` → `franchise.figures`; they stay hidden until filled **and** `published: true` |
| Investment-readiness and property options on the franchise form | `src/content/site.ts` → `franchise` |
| Product categories | `src/content/site.ts` → `productCategories` |
| FAQ | [`src/content/faqs.ts`](src/content/faqs.ts) |
| Franchise support list, process steps | [`src/content/journeys.ts`](src/content/journeys.ts) |
| Legal page wording | `src/app/legal/*/page.tsx`; update `legalLastUpdated` in `site.ts` |

### Adding a store

Add an entry to [`src/content/stores.ts`](src/content/stores.ts) **only once the branch is open and verified**.
Leave unknown fields as `null` — they are simply not shown (for example, hours show "please call ahead"
until set). Set `acceptsProductRequestCollection: true` to list the branch on the product-request form.
The store directory, homepage, footer, product-request form, `Store` structured data and server validation all
read from this one list.

---

## SEO

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards via `pageMetadata()` in [`src/lib/seo.ts`](src/lib/seo.ts).
- Social image: `public/social/og-default.jpg` (logo + real storefront, 1200×630).
- `/sitemap.xml`, `/robots.txt` (preview deployments on Vercel are `Disallow: /`), `/manifest.webmanifest`.
- Structured data: `Organization`, `WebSite`, `Store` (address and phone only — no invented hours, ratings or geo) and `BreadcrumbList`. `FAQPage` markup is deliberately not used: Google now limits FAQ rich results to authoritative government and health sites.
- Redirects for common/legacy URLs live in [`next.config.ts`](next.config.ts) — add one whenever a page moves.
- Search Console: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, verify, then submit `/sitemap.xml`. (Or verify by DNS.)

## Analytics

Analytics is off unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. When it is,
a consent banner appears and nothing loads until the visitor accepts. Tracked events
([`src/lib/analytics.ts`](src/lib/analytics.ts)): `franchise_cta_click`, `franchise_application_submit`,
`product_request_submit`, `product_image_added`, `manufacturer_enquiry_submit`, `retailer_enquiry_submit`,
`contact_enquiry_submit`, `location_interest_submit`, `store_directions_click`, `phone_click`, `whatsapp_click`.
Payloads are limited to a placement label and store slug — never names, numbers, form text or files.

---

## Deploying to Vercel

1. Push this repository to GitHub and import it in Vercel (framework preset: Next.js).
2. Add the environment variables above for **Production** (and Preview if you want forms to work there).
3. Deploy, then add your domain and set `NEXT_PUBLIC_SITE_URL` to it; redeploy.
4. Submit a test request on each form and confirm the row appears in Supabase (and the email arrives, if configured).
5. Verify the domain in Google Search Console and submit the sitemap.

Uploads are capped at 4 MB to stay within Vercel's request-body limit.

---

## Before going live — business checklist

- [ ] Founder approves the vision statement in `site.ts`, and supplies a photograph if wanted.
- [ ] Legal pages reviewed and approved (privacy, terms, product request terms, both disclaimers, cookies). Add the registered entity name to `site.legalName` and the policies once confirmed.
- [ ] Confirm the Adilabad address, and add opening hours and a branch phone if they should be shown.
- [ ] Confirm that the Adilabad store accepts product-request collections.
- [ ] Decide whether to publish any franchise figures.

## Project structure

```
src/
  app/                 Routes (one folder per page), sitemap, robots, API route
    api/forms/[form]/  The single POST endpoint for all six forms
  components/          Header, footer, page sections, form kit
  content/             Editable business content (site, stores, FAQ, journeys)
  lib/                 SEO helpers, analytics, links, form types
  lib/server/          Server-only: schemas, storage, uploads, email, rate limiting
supabase/migrations/   Database schema and storage bucket
public/brand, images   Original logo and store photograph
```
