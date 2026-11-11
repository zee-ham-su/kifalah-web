# Kifalah Foundation Ghana: website

Next.js 16 + Payload CMS 3 + PostgreSQL + Paystack. One codebase, one deploy.
Admin panel lives at `/admin`; public site at `/`.

## Run locally
1. `cp .env.example .env` and fill in `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYSTACK_SECRET_KEY` (test key).
2. `pnpm install`
3. `pnpm dev` then open http://localhost:3000/admin. The **first account you create becomes Super Admin**.
   Dev mode syncs the DB schema automatically.

## Changing the data model (IMPORTANT)
After editing any collection/global: `pnpm payload migrate:create <name>`, commit the new file in `src/migrations`.
Production applies pending migrations on boot. Then `pnpm generate:types`.

## Deploy (single VPS, e.g. Coolify, or Railway/Render)
- Env vars: everything in `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the live URL.
- Set the Paystack webhook URL to `https://YOUR-DOMAIN/api/paystack/webhook` (dashboard > Settings > API & Webhooks).
- Set the R2 `S3_*` vars so uploads survive redeploys. Put Cloudflare in front for the CDN.
- Schedule a daily `pg_dump` and test a restore.

## What is built
- Collections: Pages, Posts (stories need a consent tick to publish), Media, Documents (Transparency Hub), Donations, Applications, Inbox (form submissions), Users; Global: Site settings (impact counters, contact, legal/bank).
- Roles: super-admin, editor, finance, programme-officer, reviewer (see `src/lib/access.ts`).
- Giving: `/donate` > Paystack hosted checkout (MoMo/card) > webhook is the source of truth (`src/lib/settleDonation.ts`, idempotent, re-verifies amount and currency).
- Public pages: `/`, `/donate`, `/donate/thanks`, `/transparency`; `POST /api/contact` (honeypot).

## Not built yet (next)
Receipt email/SMS (stub in settleDonation), recurring giving (Paystack Plans), scholarship multi-step form + save-and-resume + uploads with virus scan, admin 2FA, rate limiting, page/post/about/programme routes, CSV export + donation dashboard, SEO metadata/sitemap, GBP (confirm with Paystack), Zakat labelling (needs the Foundation's decision).
