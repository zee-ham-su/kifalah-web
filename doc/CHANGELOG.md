# Changelog

Newest first. Add an entry with every meaningful change.

## 2026-11-11: Lite PRD changes (no online payments)
Implements section 10 of "Simple Website PRD (No Online Payments)".

**Support Us (replaces Donate)**
- `/support-us` replaces `/donate` (old URL redirects). Shows the required notice: "This form does not process payment. Please give only to the official accounts listed on this page."
- Bank and Mobile Money details are shown as plain information, read from `src/config/site.ts`. Empty = "will be published here soon". Nothing is invented.
- Pledge form: name, email, phone, amount **or** in-kind support, programme, message, consent. Records intent only. Thank-you message says the team will reach out and share a receipt after the gift is received.
- Statuses are now `pledged` / `received` / `follow_up` (was `pending` / `pending_payment`). The server always sets `pledged`; a client cannot choose a status.
- Admin "Pledges" page: change status, export CSV. New API: `PATCH /api/admin/donations/:id/status`, `GET /api/admin/donations/export.csv`, `GET /api/admin/newsletter/export.csv`.
- DB: `donations.amount` is now nullable; new column `in_kind_support`; status default `pledged`. Apply with `pnpm --filter @workspace/db run push`. Existing rows keep old status text and display as "pledged".

**Security**
- Admin access is now an allowlist (`ADMIN_EMAILS`, verified emails only, fails closed). Before, `requireAuth` admitted ANY signed-in Clerk user and the app exposed a public `/sign-up` page. `requireAuth` was renamed `requireAdmin`; all admin and write routes use it. Public `/sign-up` route removed. Non-admins who sign in see a "No access" screen. `GET /api/admin/me` backs that screen.
- CORS was `origin: true` with credentials (any website could make signed-in requests). Now off unless `CORS_ORIGINS` lists origins.
- Public forms rate limited (10 per IP per 15 min, `FORM_RATE_LIMIT`). `trust proxy` set so the real IP is used.
- CSV exports neutralise spreadsheet formulas (`=`, `+`, `-`, `@`).

**Bugs fixed that were already in the zip**
- Every route returning a database row responded 500 (Zod expected date strings, Drizzle returns Date objects). Rows were saved but the visitor saw an error. Fixed with `src/lib/wire.ts` on all routes.
- Newsletter duplicate email returned 500; now 409 "Email already subscribed".
- Footer newsletter form did nothing (`preventDefault` only). It now submits (name, email, consent).
- Admin Volunteers, Messages and Partnerships pages did not refresh after a status change (wrong cache key).
- Signed-out `/admin` used an inline `<script>` React never runs; now a real redirect to sign-in.

**Privacy, alerts, content**
- `/privacy` Privacy Notice page. Required consent checkbox on contact, volunteer, partnership, pledge and newsletter forms. Footer links to it.
- Email alert to staff on new contact, volunteer, partnership and pledge submissions (Resend; `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL`). Never blocks the visitor's request.
- Removed made-up phone numbers, emails and street addresses from the footer and Contact page; they now come from `src/config/site.ts`.
- Form error messages added to volunteer and partnership forms.

**Tests**
- `artifacts/api-server/test/smoke.ts` (41 checks, real Postgres, Clerk stubbed): `DATABASE_URL=... pnpm --filter @workspace/api-server run smoke`.

## Not verified
- Live Clerk sign-in, real email sending (Resend), and the deployed Replit environment were not available when this was built. The admin allowlist logic is tested with Clerk stubbed.
