# Go-live checklist

`[x]` = done and verified · `[ ]` = not done yet. Owner: **Eng** (developer) · **Biz** (business owner) · **Legal**.
Nothing marked `[ ]` should be assumed to work. Details for each item are in [ROADMAP.md](ROADMAP.md).

_Last reviewed: 29 October 2026._

## Engineering

- [x] All 17 public pages, 404 and error pages build as static pages (`npm run build`). — Eng
- [x] Lint (zero warnings), type-check and 110 unit/integration tests pass, locally and in a clean checkout. — Eng
- [x] CI workflow added to run the same checks on every push (`.github/workflows/ci.yml`). Simulated in a clean checkout. — Eng
- [x] All six forms validate, save, de-duplicate retries and show a reference, tested end to end with the local store and in the browser. — Eng
- [x] Production builds refuse submissions when Supabase is missing or half-configured, instead of losing them. — Eng
- [x] No horizontal scrolling on any page at 375, 768 or 1280 px. — Eng
- [x] axe-core accessibility scan: no violations on any page at 1280 and 375 px. — Eng
- [x] No broken internal links or anchors (`npm run check:links`, 416 links). — Eng
- [ ] Confirm the first GitHub Actions run passes. — Eng
- [ ] Test on real devices: iOS Safari, Android Chrome (photo upload from camera, WhatsApp link, call link). Only Chromium emulation has been used so far. — Eng + Biz

## Security

- [x] Database migration: RLS forced and public grants revoked on all tables; private bucket. Verified on local PostgreSQL with Supabase-style roles. — Eng
- [x] Server-side validation, upload signature checks and re-encoding, metadata stripping, size limits. — Eng
- [x] Spam checks, same-origin check, duplicate protection, per-instance rate limit. — Eng
- [x] CSP, HSTS and other security headers, verified on a production build. — Eng
- [ ] Repeat the RLS and bucket checks on the **real** Supabase project ([SECURITY.md](SECURITY.md#production-security-checks)). — Eng
- [ ] Enable Vercel Firewall rate limiting on `/api/forms/*`, so the limit is global. — Eng
- [ ] Confirm no secret appears in the deployed JavaScript. — Eng
- [ ] Decide a data-retention period for enquiries and uploads. — Biz

## Business details awaiting confirmation

- [ ] **Store address**: `10-193, Adilabad Main Road, Opposite Royal Enfield Showroom, Mavala, Adilabad, Telangana 504002`. It was taken from a supplier GST invoice; confirm it is the public store address. — Biz
- [ ] **Google Maps link** (`https://maps.app.goo.gl/QAeTHGgxasy1RFfd6`, taken from the inauguration invitation) points to the store. — Biz
- [ ] **+91 91007 70398** is the right number for calls **and** WhatsApp from customers, franchise applicants and suppliers. — Biz
- [ ] The Adilabad store **accepts product-request collections** (currently `true`). — Biz
- [ ] **Storefront photo** (opening day; shows identifiable people, including children) may be published. Otherwise supply another real photo. — Biz
- [ ] **Founder vision statement** approved as worded (`src/content/site.ts`). — Biz (Syed Asif)
- [ ] Founder photograph supplied, or keep the monogram. — Biz
- [ ] Opening hours, if they should be shown. — Biz
- [ ] ₹99 wording in `pricing` reflects what the store actually offers. — Biz
- [ ] Whether any franchise figures should be published. Currently none are, by design. — Biz

## External services

- [ ] Supabase project created, migration applied, staff accounts invited ([DEPLOYMENT.md §2](DEPLOYMENT.md#2-supabase)). — Eng + Biz (account owner)
- [ ] Resend domain verified, API key created, recipients chosen ([DEPLOYMENT.md §3](DEPLOYMENT.md#3-email-optional-recommended)). — Eng + Biz
- [ ] Vercel project imported with production environment variables ([ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)). — Eng + Biz
- [ ] Domain purchased or confirmed, and DNS pointed at Vercel. — Biz + Eng

## Legal review

- [ ] Privacy Policy — Legal
- [ ] Terms of Use — Legal
- [ ] Product Request Terms — Legal
- [ ] Franchise Enquiry Disclaimer: needs particular care, as franchise sales can be regulated. — Legal
- [ ] Supplier & Business Enquiry Disclaimer — Legal
- [ ] Cookie Notice (only matters once analytics is enabled) — Legal
- [ ] Registered entity name set in `site.legalName`; update `legalLastUpdated`. — Biz

## Deployment

- [ ] Production deployment from `main` on Vercel. — Eng
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final `https://` domain, then redeployed. — Eng
- [ ] One test submission per form on production: rows appear in Supabase, files in the bucket, and emails arrive if configured. Then delete them. — Eng
- [ ] Rollback path understood (Vercel → Promote previous deployment). — Eng

## SEO and analytics

- [x] Unique title, description, canonical, Open Graph and Twitter metadata on every page. — Eng
- [x] Sitemap lists exactly the public pages; robots allows the site, blocks `/api/`, and blocks preview deployments. — Eng
- [x] Structured data (Organization, WebSite, Store, BreadcrumbList) uses only verified facts; no ratings, reviews, prices or hours. — Eng
- [ ] Validate structured data on the live URL with Google's Rich Results Test and validator.schema.org. — Eng
- [ ] Google Search Console: verify the domain, submit `/sitemap.xml`. — Biz + Eng
- [ ] Google Business Profile for the Adilabad store, with the same name, address and phone as the site. — Biz
- [ ] Decide whether to use analytics. If yes, set the ID; the consent banner then appears automatically. — Biz
- [ ] Lighthouse run on the live site, mobile profile. — Eng

## Final acceptance testing

On the production URL, on one phone and one desktop:

- [ ] Every page loads; navigation and the mobile menu work.
- [ ] Each form: empty submit shows field errors; a valid submit shows a reference.
- [ ] Product request with a camera photo: the preview shows; replace and remove work; the submit succeeds.
- [ ] Submitting twice quickly creates one row.
- [ ] Call, WhatsApp and Get directions buttons work on the phone.
- [ ] The WhatsApp link preview of the homepage shows the logo and storefront.
- [ ] Business owner signs off the content.
