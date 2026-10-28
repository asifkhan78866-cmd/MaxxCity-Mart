# MaxxCity Mart — official website

The public website for **MaxxCity Mart**, *Maxx Saving • Maxx Value*, a fixed-price (₹99) variety retail brand in Adilabad, Telangana.

The site explains the concept, shows the verified store, and takes six kinds of enquiry:

| Form | Page | Stored in |
| --- | --- | --- |
| Franchise (FOFO) application | `/franchise` | `franchise_enquiries` |
| Product request, with photo | `/request-product` | `product_requests` |
| Manufacturer enquiry, with catalogue | `/manufacturers` | `manufacturer_enquiries` |
| Retailer / distributor enquiry | `/retailers` | `retailer_enquiries` |
| General contact | `/contact` | `contact_enquiries` |
| "Open a store in my town" | `/stores` | `location_interest` |

It is **not** a shop, POS, billing, inventory or accounting system. No products are sold and no payments are taken online.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod, Supabase (Postgres + private Storage), optional Resend email, Vitest.

## Quick start

```bash
npm install
npm run dev                 # http://localhost:3000 — forms save to .data/ until Supabase is configured
npm run check               # lint + type-check + tests
npm run build               # production build
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | development server |
| `npm run check` | lint, type-check and tests: run before every commit |
| `npm test` / `npm run test:watch` | unit and integration tests (Vitest) |
| `npm run build` / `npm start` | production build / serve it |
| `npm run check:links -- <url>` | crawl a running site for broken internal links and anchors |

## Documentation

| Guide | Read it to… |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | understand the folder structure and the form lifecycle, or add a page or form |
| [docs/CONTENT_MANAGEMENT.md](docs/CONTENT_MANAGEMENT.md) | change the phone number, ₹99 copy, founder message, FAQs, stores, franchise terms |
| [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) | configure every environment variable |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | set up Supabase, Resend, Vercel and the custom domain, and verify production |
| [docs/SECURITY.md](docs/SECURITY.md) | understand how enquiries, uploads and secrets are protected |
| [docs/GO_LIVE_CHECKLIST.md](docs/GO_LIVE_CHECKLIST.md) | see what remains before launch, and who has to do it |
| [docs/ROADMAP.md](docs/ROADMAP.md) | see prioritised next steps (P0–P3) |

## Status

The code is complete and tested locally. **The site is not yet production-ready.** Supabase and email are not connected, the legal pages await review, and several business details await confirmation. See [docs/GO_LIVE_CHECKLIST.md](docs/GO_LIVE_CHECKLIST.md).
