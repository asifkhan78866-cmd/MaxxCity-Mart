# Environment variables

All configuration comes from environment variables, read in exactly two files:

- `src/lib/config/env.ts`: **server-only** values, secrets included. Never reaches the browser.
- `src/lib/config/public-env.ts`: `NEXT_PUBLIC_*` values, **built into the browser JavaScript**. Never put a secret in a `NEXT_PUBLIC_` variable.

`.env.example` lists every variable with placeholders. Copy it to `.env.local` for local work. `.env.local` is git-ignored; never commit it, paste it into chat or email, or screenshot it.

## Reference

| Variable | Needed | Visibility | Where to get it | What happens without it |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Production** | Public | Your live domain, e.g. `https://www.example.com` (no trailing slash) | Canonical URLs, sitemap and social previews fall back to Vercel's production domain, or to `http://localhost:3000` with a build warning. |
| `SUPABASE_URL` | **Production** | Server | Supabase → Project Settings → API → Project URL | Production refuses submissions (503, "please call or WhatsApp us"). Development uses local JSON files. |
| `SUPABASE_SECRET_KEY` | **Production** | **Server — secret** | Supabase → Project Settings → API Keys → *Secret keys* (`sb_secret_…`). The legacy `service_role` key also works, under `SUPABASE_SERVICE_ROLE_KEY`. | Same as above. |
| `SUPABASE_STORAGE_BUCKET` | No | Server | Defaults to `enquiry-uploads`, created by the migration. | Default used. |
| `RESEND_API_KEY` | For email | **Server — secret** | resend.com → API Keys (sending access only) | No notification emails. Submissions are still saved, and the log says `notification not-configured`. |
| `NOTIFY_EMAIL_TO` | For email | Server | Who receives notifications; comma-separated | As above. |
| `NOTIFY_EMAIL_FROM` | For email | Server | An address on a domain verified in Resend, e.g. `MaxxCity Mart Website <website@yourdomain.com>` | As above. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Public | Google Analytics 4 → Admin → Data streams → Measurement ID (`G-…`) | No GA, and no consent banner unless Plausible is set. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Public | Your domain as registered in Plausible | No Plausible. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Public | Search Console → Add property → HTML tag → the `content` value only | No meta tag; verify by DNS instead. |
| `LOCAL_SUBMISSIONS_DIR` | No | Server, **dev only** | A folder path | Development saves to `.data/`. Ignored in production. |

Set automatically by Vercel, no action needed: `VERCEL_ENV` (keeps preview deployments out of search engines) and `VERCEL_PROJECT_PRODUCTION_URL` (fallback site URL).

### Partial configuration is an error

If only one of `SUPABASE_URL` / `SUPABASE_SECRET_KEY` is set, the site treats Supabase as **unavailable**: production refuses submissions, and development does too, rather than quietly saving to local files. The log names the missing variable. Partial email configuration is logged the same way.

## Local development

```bash
cp .env.example .env.local     # then edit .env.local
npm install
npm run dev
```

You can leave everything empty locally. Forms then save to `.data/`. To test against Supabase, create a separate development project, not production, and put its URL and secret key in `.env.local`.

## Vercel

Vercel → Project → Settings → Environment Variables:

1. Add each variable above for **Production**. Mark `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` as **Sensitive**.
2. For **Preview** deployments, either leave Supabase unset (forms show the "please call us" message), or point them at a separate staging Supabase project. Never use the production database for previews.
3. Redeploy after changing variables. `NEXT_PUBLIC_*` values are baked in at build time.

## Checking what is configured

After deploying, submit a test enquiry and check the Vercel function logs:

- `[forms] Submission storage is not configured` → Supabase variables missing.
- `[storage] Supabase is only partly configured; missing …` → one variable missing.
- `[forms] PR-… saved; notification not-configured` → saved; email not set up.
- `[notify] Resend rejected …` → email set up but refused, usually an unverified sending domain.
