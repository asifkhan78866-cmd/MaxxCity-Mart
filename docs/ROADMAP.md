# Roadmap

Prioritised work from the current state (code complete, tested locally, not deployed) to launch and beyond.
Each item says **who** must act: **Eng** = developer work · **Biz** = only the business owner can decide or provide it.
Nothing here commits MaxxCity Mart to financial figures or claims; commercial questions stay with the business.

---

## P0 — Required before launch

### P0.1 Connect Supabase (real persistence) — Eng, needs Biz account
- **Why:** without it, production deliberately refuses every submission.
- **Involves:** Supabase project; `supabase/migrations/20261029000000_website_enquiries.sql`; Vercel env `SUPABASE_URL`, `SUPABASE_SECRET_KEY`.
- **Depends on:** a Supabase account owned by the business.
- **Steps:** create the project (Mumbai region) → run the migration → create a secret key → add both variables to Vercel Production → redeploy → invite staff to the dashboard.
- **Done when:** a test submission on production appears in the right table with `status = new`, and a photo appears in `enquiry-uploads`.
- **Needs:** Supabase account and credentials (Biz to create or own; Eng to configure).

### P0.2 Verify access controls on the real project — Eng
- **Why:** RLS was verified on local PostgreSQL only. The real project must prove the public key reads nothing.
- **Involves:** [SECURITY.md → Production security checks](SECURITY.md#production-security-checks).
- **Depends on:** P0.1.
- **Steps:** run the six checks (anon REST read, public bucket URL, secret not in JS bundle, headers, cross-origin POST, disguised upload).
- **Done when:** all six pass; record the date in GO_LIVE_CHECKLIST.md.
- **Needs:** the project's anon/publishable key, which is not secret.

### P0.3 Production environment configuration — Eng
- **Why:** canonical URLs, sitemap and social previews use `NEXT_PUBLIC_SITE_URL`; without it they point at the Vercel domain or localhost.
- **Involves:** Vercel env vars ([ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)).
- **Depends on:** the final domain (P1.1). Until then, the Vercel production URL is acceptable.
- **Steps:** set the variables for Production; set separate or empty values for Preview; redeploy.
- **Done when:** `view-source` of the homepage shows the correct canonical and `og:url`, and the build log has no `NEXT_PUBLIC_SITE_URL is not set` warning.
- **Needs:** domain decision (Biz).

### P0.4 Confirm business details — Biz
- **Why:** the site must not publish anything unverified.
- **Involves:** `src/content/stores.ts`, `src/content/contact.ts`, `src/content/site.ts`, `public/images/storefront/`.
- **Steps:** confirm or correct each item under "Business details awaiting confirmation" in [GO_LIVE_CHECKLIST.md](GO_LIVE_CHECKLIST.md): address (taken from a GST invoice), maps link, phone/WhatsApp number, collection availability, permission for the storefront photo (shows children), founder statement.
- **Done when:** every item is ticked by the business owner; Eng applies any corrections.
- **Needs:** the owner's confirmation.

### P0.5 Legal approval — Legal / Biz
- **Why:** the six policy pages are drafts written without legal advice. The franchise disclaimer especially needs review.
- **Involves:** `src/app/legal/*/page.tsx`, `site.legalName`, `legalLastUpdated`.
- **Steps:** have a lawyer review each page → apply edits → set the registered entity name → update the date.
- **Done when:** written sign-off for each page.
- **Needs:** a legal reviewer; registered entity details.

### P0.6 Global rate limiting — Eng
- **Why:** the built-in limiter is per server instance; public forms attract spam.
- **Involves:** Vercel → Firewall → Rate limiting.
- **Depends on:** Vercel project.
- **Steps:** add a rule for path prefix `/api/forms/` (for example 20 requests/minute/IP → deny), then test with repeated requests.
- **Done when:** a burst of requests from one IP receives 429 from the firewall.
- **Needs:** Vercel access. The firewall feature's availability depends on the plan; if unavailable, see P3.4.

### P0.7 Production smoke test of every form — Eng + Biz
- **Why:** the Supabase and email paths are tested only against an in-memory stand-in.
- **Steps:** follow [DEPLOYMENT.md §6](DEPLOYMENT.md#6-production-verification).
- **Done when:** all six forms save on production, duplicates collapse to one row, and test data is cleaned up.

---

## P1 — Required for a professional public launch

### P1.1 Custom domain — Biz + Eng
- **Why:** trust, email deliverability and SEO.
- **Steps:** buy or confirm the domain → add it in Vercel → set DNS → set `NEXT_PUBLIC_SITE_URL` → redeploy.
- **Done when:** `https://<domain>` serves the site with HTTPS, and the bare and `www` hosts redirect to one canonical host.
- **Needs:** domain registrar access (Biz).

### P1.2 Email notifications — Eng, needs Biz
- **Why:** otherwise staff must check the dashboard to notice new enquiries.
- **Involves:** Resend; `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM`.
- **Depends on:** P1.1, since the sending domain must be verified.
- **Done when:** each form produces one email with readable labels, Reply-To set when the visitor gave an email, and a working 7-day file link.
- **Needs:** Resend account, recipient addresses.

### P1.3 Final brand imagery — Biz
- **Why:** the site has one real photo. Authentic product and interior photos would strengthen every page.
- **Involves:** `public/images/`, `src/content/categories.ts` (categories currently use icons), `site.founder.photo`.
- **Steps:** photograph the store interior, category shelves and the founder → Eng adds them with alt text.
- **Done when:** the owner approves the photos; there is no stock or generated imagery.

### P1.4 Real-device and browser QA — Eng
- **Why:** only Chromium emulation has been tested.
- **Steps:** iPhone Safari and Android Chrome: camera upload (including HEIC conversion), WhatsApp and tel links, mobile menu, forms. Desktop Safari, Firefox and Edge: layout and forms.
- **Done when:** no blocking issues on the listed browsers.

### P1.5 SEO validation — Eng
- **Steps:** Rich Results Test and validator.schema.org on the live homepage and `/stores`; Lighthouse (mobile) on home, `/franchise` and `/request-product`; check the WhatsApp/Facebook link preview.
- **Done when:** no structured-data errors; Lighthouse SEO and Accessibility ≥ 95; issues fixed or logged.

### P1.6 Analytics and consent — Biz decides, Eng configures
- **Why:** needed to measure franchise and product-request conversions, but optional.
- **Involves:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; `src/lib/analytics/track.ts`; `/legal/cookies`.
- **Steps:** choose a provider (Plausible is simpler and cookieless; GA4 is free) → set the ID → confirm the banner appears and nothing loads before Accept → confirm events arrive without personal data.
- **Done when:** events such as `franchise_application_submit` appear in the dashboard after consent only.
- **Needs:** provider account.

### P1.7 Data retention — Biz decides, Eng implements
- **Why:** personal data should not be kept indefinitely.
- **Steps:** decide a period (for example 24 months after an enquiry is closed) → state it in the privacy policy → schedule periodic deletion. Manual at first; see P3.2 to automate.
- **Done when:** the policy states the period and a named person owns the deletion task.

---

## P2 — Growth improvements

### P2.1 Google Search Console — Biz + Eng
- Verify the domain (DNS, or `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) → submit `/sitemap.xml` → monitor coverage and queries monthly.
- **Done when:** the sitemap shows as "Success" and pages are indexed. Do not assume indexing until Search Console confirms it.

### P2.2 Verified local SEO — Biz
- Create or claim the **Google Business Profile** for the Adilabad store with exactly the same name, address and phone as `src/content/stores.ts`. Add real photos, and opening hours once confirmed (also add them to `stores.ts`).
- **Done when:** the profile is verified and its details match the site.

### P2.3 Franchise conversion tracking — Eng
- **Depends on:** P1.6.
- Mark `franchise_application_submit` as a key event or conversion; compare it with `franchise_cta_click` by `placement` to see which CTAs work.
- **Done when:** a monthly funnel report exists. No personal data is involved.

### P2.4 Manufacturer outreach content — Biz + Eng
- Add a short "what we look for" section (quality expectations, packaging, documents to send) to `/manufacturers`, using content the business approves. No purchase commitments.

### P2.5 Product-request demand analysis — Eng
- Saved SQL queries in Supabase for the most requested products and the towns asking for collection or a new store (`product_requests`, `location_interest`), reviewed monthly to inform sourcing and expansion.
- **Done when:** the queries are saved and shared with the team.

### P2.6 Automated end-to-end browser tests — Eng
- Add Playwright tests for the three key journeys (franchise, product request with photo, partnership) against a preview deployment backed by a staging Supabase. Run them in CI.

### P2.7 Content refinement — Biz
- Review FAQs, page copy and search queries quarterly; add questions customers actually ask.

---

## P3 — Future enhancements (only if a real need appears)

| Item | Build it only if… |
| --- | --- |
| **P3.1 Minimal staff view of enquiries** (authenticated, read and update status) | volume makes the Supabase dashboard impractical. Must stay a triage view; no POS, billing or inventory. |
| **P3.2 Automated retention** (scheduled deletion with pg_cron) | P1.7's manual process becomes a burden. |
| **P3.3 Telugu / Hindi pages** | visitor data or customer feedback shows English is a barrier. |
| **P3.4 Shared rate-limit store** (Upstash Redis) | Vercel Firewall rate limiting is unavailable on the plan, or spam gets through. |
| **P3.5 WhatsApp Business notifications** | the team works from WhatsApp rather than email. |
| **P3.6 Per-store pages** (`/stores/<slug>`) | there are several open stores worth ranking individually. |

---

## Business decisions and credentials needed

| From the business owner | For |
| --- | --- |
| Confirm address, maps link, phone/WhatsApp, collection availability | P0.4 |
| Permission for the storefront photo; founder statement approval; founder photo | P0.4, P1.3 |
| Registered entity name; legal reviewer | P0.5 |
| Supabase, Vercel, Resend and domain accounts, owned by the business | P0.1, P0.3, P1.1, P1.2 |
| Notification recipients | P1.2 |
| Analytics: yes/no and which provider | P1.6 |
| Data-retention period | P1.7 |
| Whether to publish franchise figures (and the approved figures) | optional |
| Opening hours | optional |
