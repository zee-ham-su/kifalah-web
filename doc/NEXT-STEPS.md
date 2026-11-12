# Next steps

**Rule:** when a change adds or renames an env var, update `.env.example`, your real environment (Replit Secrets or `.env`), and `doc/CHANGELOG.md`.

## Do these before launch (not code)
1. **Clerk dashboard: turn OFF sign-ups**, then set `ADMIN_EMAILS` to the real staff emails. Without `ADMIN_EMAILS` nobody can use the admin.
2. **Fill in `src/config/site.ts`** with the Foundation's confirmed address, phones, emails, bank account (account name must be the registered name) and Mobile Money numbers.
3. Run `pnpm --filter @workspace/db run push` against the live database (adds the pledge columns).
4. Set email alerts: `RESEND_API_KEY`, `EMAIL_FROM` (verified domain), `NOTIFY_EMAIL`.
5. Replace placeholder text, stock photos and logo with the Foundation's real content (programme pages, About, news, impact numbers, leadership).
6. Foundation decides how gifts are labelled (General, Zakat, Sadaqah, Waqf, programme) and publishes simple rules for each; scholars review the wording. Then add it to the Support Us page.
7. Get the Privacy Notice (`src/pages/Privacy.tsx`) reviewed by the Foundation's legal adviser; confirm Data Protection Commission registration.
8. Upload real reports and policies on the Transparency page via Admin > Documents.

## Build next
- **Page weight**: the main JavaScript bundle is about 700 kB before compression. Add route-level code splitting (`React.lazy`) so phones on mobile data load less; compress the large JPEGs (some are 150-180 kB).
- **CAPTCHA** (Cloudflare Turnstile is free) if spam still gets through the rate limit.
- **SEO**: per-page titles and descriptions, social preview image, sitemap.xml.
- **Social share** buttons on news articles (F10).
- **Backups and uptime** monitoring for the database.
- Footer social icons: check that they link to the Foundation's real accounts.

## Later (out of scope now)
Online payments (Paystack/Hubtel/Flutterwave), donor and applicant accounts, scholarship portal, Hausa and other languages.

## Open questions for the Foundation
Official bank/MoMo details; registration status and whether to show it; logo, colours, domain; who manages admin content after launch; when payment integration is wanted so the build leaves room for it.
