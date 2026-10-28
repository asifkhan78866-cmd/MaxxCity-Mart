# Security

This site collects personal information (names, mobile numbers, sometimes email addresses), product photos and supplier catalogues. It has no user accounts and no payments. This document describes how that data is protected, and what still needs doing before launch.

## Public and private data

| Public (anyone can see) | Private (MaxxCity Mart staff only) |
| --- | --- |
| All website pages and their content | Every form submission |
| Store address, business phone, WhatsApp number | Uploaded product photos and catalogues |
| Logo, storefront photo, social image | Notification emails |
| `robots.txt`, `sitemap.xml` | Server logs |

A visitor who submits a form receives only their own reference number. **No API reads submissions back.** The only endpoint is `POST /api/forms/[form]`, which inserts and never selects anything except to de-duplicate its own retry.

## Database access (Supabase)

The migration `supabase/migrations/20261029000000_website_enquiries.sql`:

- enables **and forces** row-level security on all six tables;
- creates **no** RLS policies;
- **revokes all privileges** from the `anon` and `authenticated` roles;
- creates the `enquiry-uploads` storage bucket as **private** (4 MB limit, JPEG and PDF only), with no storage policies.

So the publishable/anon key, which is never used by this site anyway, cannot read or write any enquiry or file. Only the server, using the **secret (service-role) key**, can insert rows and upload files. Staff view submissions in the Supabase dashboard under their own accounts.

**Verified:** the migration was applied to a local PostgreSQL 16 instance with stand-ins for Supabase's `anon`, `authenticated` and `service_role` roles. `anon` and `authenticated` got "permission denied" for both reading and inserting. `service_role` could insert. A duplicate `submission_id` and an out-of-range quantity were rejected by the database.
**Not yet verified:** the same checks against the real Supabase project. Do this as part of the go-live checklist.

## Secrets

| Secret | Where it lives | Never |
| --- | --- | --- |
| `SUPABASE_SECRET_KEY` (service role) | Vercel environment variables (server) | in `NEXT_PUBLIC_*`, client code, Git, screenshots, email |
| `RESEND_API_KEY` | Vercel environment variables (server) | same |

- All server variables are read only in `src/lib/config/env.ts`, which starts with `import "server-only"`. Importing it into browser code fails the build.
- `.env*` files are git-ignored except `.env.example`, which holds placeholders only.
- Rotate a key immediately if it is ever exposed: generate a new one in Supabase or Resend, update Vercel, redeploy, then revoke the old one.

## Uploads

`src/lib/security/uploads.ts`, applied on the server to every file:

1. **Size**: 4 MB maximum, also enforced by the bucket. Requests over 4.5 MB are rejected from `Content-Length` before the body is read. Requests without `Content-Length` are rejected (411), so the limit cannot be bypassed with a streamed body.
2. **Type by content**: the first bytes must be a JPEG, PNG, WebP or PDF signature. The browser's claimed type and the file name are ignored.
3. **Images are decoded and re-encoded** with `sharp`. This rejects corrupt or disguised files, strips all metadata including GPS location, caps size at 2000 px, and flattens transparency onto white.
4. **PDFs** (catalogues only) are stored as received, privately. Staff links to them force a download rather than opening inline.
5. **Storage paths** contain only the form name, month, reference and a random UUID. Customer names, phone numbers and original file names are never part of a path or URL.
6. **Access**: files are never public. Notification emails contain a signed link that expires after **7 days**. Anyone holding the email can open the file within that window, so treat notification emails as confidential.

The browser also shrinks and re-encodes photos before upload. This is for speed only; the server repeats every check.

## Abuse protection

`src/lib/security/request-guards.ts` and `rate-limit.ts`:

| Protection | Detail |
| --- | --- |
| Same-origin check | A browser POST from another website (`Origin` mismatch, with `x-forwarded-host` honoured behind proxies) gets 403. Cross-site requests with custom headers fail the browser's CORS preflight, since the route answers no `OPTIONS`. |
| Honeypot | A hidden `_website` field. If it is filled, the request gets 400. |
| Time on form | `_startedAt` must be a real millisecond timestamp, at least 2.5 s old and not in the future. |
| Duplicate protection | Each submission carries a browser-generated UUID. A retry returns the original reference, enforced by a unique database column, so double-clicks and network retries never create two rows. |
| Rate limiting | 10 submissions per form per IP per 10 minutes. |
| Validation | Every field is validated server-side by Zod. Option fields accept only listed values, the collection branch must be a verified store, URLs must be http(s), lengths are bounded, and phone numbers are normalised to `+91XXXXXXXXXX`. |

**Known limitation:** the rate limiter is held in memory per server instance. On Vercel, several instances may run, so the real limit can be higher. For a hard global limit, enable Vercel Firewall rate limiting on `/api/forms/*`, or move the counter to Upstash Redis (see [ROADMAP.md](ROADMAP.md)).

Behind Vercel, `x-forwarded-for` is set by the platform and is trustworthy. If you self-host, make sure your proxy overwrites it.

## HTTP security headers

Set in `next.config.ts` for every response:

- `Content-Security-Policy` (production): scripts, styles, fonts, images and connections only from this site, the optional analytics providers and the Vercel preview toolbar; `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`. `'unsafe-inline'` is allowed for scripts because Next.js's bootstrap and the JSON-LD blocks are inline. Nonces would make every page dynamic. Verified on a production build: no violations on page load, navigation, photo preview or form submission.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains` (production)
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy` disabling camera, microphone, geolocation and payment
- `X-Robots-Tag: noindex` on `/api/*`
- `X-Powered-By` removed

## Personal data handling

- **Collected only through forms**, only what each form needs. Optional fields are marked optional.
- **Consent**: every form has an unticked consent checkbox linking to the privacy policy. Without it, the submission is rejected. Consent is stored as `consent = true`, with the timestamp in `created_at`.
- **Analytics** loads only after the visitor accepts the consent banner, and only if an analytics ID is configured. Event payloads are limited to a placement label and a store slug. Names, numbers, form text and files are never sent (`lib/analytics/track.ts`).
- **Retention**: not yet automated. Decide a retention period (for example 24 months for closed enquiries) and delete older rows and files periodically. This is on the roadmap.
- **Requests to access or delete data**: find the row by reference or phone number in the Supabase dashboard. Delete the row and its file under `enquiry-uploads/<form>/<month>/<reference>/`.

## Logging

- The server logs failures with the form id, reference and error message: `[forms] Failed to save…`, `[storage] Could not remove orphaned upload…`, `[notify] Resend rejected…`.
- Logs **never** include the submitted field values, phone numbers or file contents. One exception: the email provider's own error text is logged if it rejects a message, and it can mention an address.
- Error pages show visitors a generic message. Next.js gives server errors a digest that matches the server log.

## Production security checks

Before launch and after any infrastructure change:

1. **Public key cannot read data.** With the project's anon/publishable key, run
   `curl "https://<project>.supabase.co/rest/v1/product_requests?select=*" -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"`. It must return a permission error, not rows.
2. **Bucket is private.** Opening `https://<project>.supabase.co/storage/v1/object/public/enquiry-uploads/<any path>` must fail.
3. **Secret key is not in the browser.** Search the deployed site's JavaScript (DevTools → Sources) for `sb_secret` or `service_role`. There must be no matches.
4. **Headers.** `curl -sI https://<domain>/` shows the CSP and HSTS headers above.
5. **Forms refuse other origins.** A POST with `Origin: https://example.com` returns 403.
6. **Uploads.** A renamed text file as `photo.jpg` is rejected. A phone photo is stored without GPS metadata (check with any EXIF viewer after downloading it from the dashboard).
