# Changelog

Newest first. Update this file with every meaningful change (add the commit hash).

## 2026-11-11: Donation receipts (`8448055`)
- Added `src/lib/notify.ts`: Resend email + Hubtel SMS senders, receipt templates (HTML-escaped), Ghana phone normalisation (`024...`/`+233...` -> `233...`).
- `settleDonation.ts` now sends a receipt once per donation. The claim is an atomic update of `receiptSentAt`, so the webhook and the thank-you redirect cannot double-send.
- If sending fails, or email is not configured, the claim is released and the next webhook/redirect retries.
- SMS failure is non-fatal (email is the primary receipt).
- New env vars: `RESEND_API_KEY`, `EMAIL_FROM`, `HUBTEL_CLIENT_ID`, `HUBTEL_CLIENT_SECRET`, `HUBTEL_SENDER_ID`.
- Not verified against live services (no network from the build environment). Hubtel endpoint written from memory: confirm in their docs.

## 2026-11-11: Initial scaffold (`5d11548`)
- Stack: Next.js 16, Payload CMS 3.93, PostgreSQL, Tailwind-free plain CSS, pnpm.
- Collections: Pages, Posts (stories need a consent tick to publish), Media (WebP variants), Documents (Transparency Hub PDFs), Donations, Applications, Inbox (form submissions), Users. Global: Site settings (impact counters, contact, legal/bank).
- Roles: super-admin, editor, finance, programme-officer, reviewer (`src/lib/access.ts`). The first account created becomes super-admin; only super-admins can grant roles.
- Donations: `/donate` -> `POST /api/donate/initialize` (saves a `pending` row first) -> Paystack hosted checkout -> `POST /api/paystack/webhook` (HMAC-SHA512 verified) -> `settleDonation()` re-verifies amount and currency with Paystack. Donations cannot be created, edited or deleted through the public API or the admin UI.
- Public pages: `/`, `/donate`, `/donate/thanks`, `/transparency`. `POST /api/contact` with a honeypot.
- Uploads go to Cloudflare R2 when `S3_BUCKET` is set, otherwise local disk.
- DB migrations: `src/migrations/` (initial). Production applies them on boot (`prodMigrations`).
- Verified locally: typecheck, production build, first-user bootstrap, access rules (403s), webhook bad-signature (401), pending donation row, contact inbox row.

## Decisions worth remembering
- One codebase (Payload inside Next.js) instead of the PRD's separate NestJS API. Revisit only if Phase 2 (donor accounts, Waqf dashboard) outgrows it.
- Currencies: GHS and USD only. GBP (PRD DN-3) waits for Paystack to confirm it on the Foundation's account.
- Zakat is deliberately not a fund option until the Foundation decides labelling and separation (PRD section 7, open question 4).
- Donor email is required (Paystack needs one).
- Payload does not auto-sync the schema in production. After changing any collection: `pnpm payload migrate:create <name>`, commit the migration, then `pnpm generate:types`.
