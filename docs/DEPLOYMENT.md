# Deployment

Target: **Vercel** (Next.js preset) + **Supabase** (database and private file storage) + optionally **Resend** (email). Everything below uses the free tiers' standard features.

## 1. Development setup

Requirements: Node.js 22 or 24 and npm.

```bash
npm install
npm run dev                    # http://localhost:3000
npm run check                  # lint + type-check + tests (run before every commit)
npm run build && npm start     # production build locally
```

## 2. Supabase

1. Create a project at supabase.com. Choose **Mumbai (ap-south-1)** for Indian visitors and set a strong database password.
2. **SQL Editor** → paste and run `supabase/migrations/20261029000000_website_enquiries.sql`. If you use the CLI instead: `supabase link` then `supabase db push`. This creates the six enquiry tables (RLS forced, public roles revoked) and the private `enquiry-uploads` bucket.
3. **Project Settings → API Keys**: copy the Project URL and create or copy a **secret** key. You'll need them in step 4.
4. **Authentication → Users**: invite each staff member who needs to see submissions. Team members then use the **Table Editor** to read enquiries, set `status`, and write `internal_notes`.
5. Run the checks in [SECURITY.md → Production security checks](SECURITY.md#production-security-checks).

Never run `supabase db reset` against production. Schema changes are new migration files, applied in order.

## 3. Email (optional, recommended)

1. Create a Resend account and add your domain under **Domains**. Add the DNS records it shows (SPF, DKIM) at your domain registrar, then wait for **Verified**.
2. Create an API key with **Sending access**.
3. Choose `NOTIFY_EMAIL_FROM`, an address on the verified domain, and `NOTIFY_EMAIL_TO`, the team inbox(es).

## 4. Vercel

1. Import `asifkhan78866-cmd/MaxxCity-Mart` from GitHub. Framework preset: **Next.js**. The default build command (`next build`) and output are correct.
2. Add the environment variables from [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for **Production**.
3. Deploy. Every push to `main` redeploys production. Other branches get preview URLs, which are not indexed by search engines.
4. **Optional, recommended:** Vercel → Firewall → add a rate-limit rule for `/api/forms/*`, for example 20 requests per minute per IP. This makes the limit global across server instances.

## 5. Custom domain

1. Vercel → Project → Settings → **Domains** → add `www.yourdomain.in` and `yourdomain.in`. Redirect the bare domain to `www`, or the reverse; pick one.
2. At your registrar, add the DNS records Vercel shows (an `A` record for the apex and a `CNAME` for `www`). HTTPS is issued automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` address and **redeploy**, so canonical URLs, the sitemap and social previews use it.

## 6. Production verification

Run these after the first deployment and after any significant change.

```bash
# Pages, sitemap and robots
npm run check:links -- https://www.yourdomain.in
curl -s https://www.yourdomain.in/robots.txt
curl -sI https://www.yourdomain.in/ | grep -iE "content-security|strict-transport"
```

Then by hand, on a phone and on a desktop:

- [ ] Submit each of the six forms once (franchise, product request **with a photo**, manufacturer **with a PDF**, retailer, contact, store interest). Each shows a reference number.
- [ ] Each appears in the right Supabase table with `status = new`. The photo and PDF are in the `enquiry-uploads` bucket.
- [ ] If email is configured, each produces one email. The file link opens, and stops working after 7 days.
- [ ] Submitting the same form twice quickly creates **one** row.
- [ ] The Call and WhatsApp buttons open the dialler and WhatsApp with the prefilled message.
- [ ] Get directions opens the Adilabad store in Google Maps.
- [ ] Share the homepage link in WhatsApp: the preview shows the logo and storefront.
- [ ] The checks in [SECURITY.md](SECURITY.md#production-security-checks) all pass.

Then delete the test rows and files in Supabase.

## Rolling back

Vercel → Deployments → choose the last good deployment → **Promote to Production**. Database migrations are not rolled back automatically. Write a new migration to undo a schema change.
