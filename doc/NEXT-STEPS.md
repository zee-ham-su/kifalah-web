# Next steps

Ordered by what unblocks launch. P0/P1 refer to the PRD priorities.

## Before anything goes live (not code, start now)
- [ ] Open the Paystack business account (needs registration documents; the likeliest launch delay). Ask them to confirm MoMo (MTN, Telecel, AirtelTigo), USD, GBP and recurring card billing on the account.
- [ ] Register a Hubtel SMS sender ID; verify the sending domain in Resend.
- [ ] Get from the Foundation: logo and brand colours, photos, leadership bios, registration details, bank details, policy PDFs, reports.
- [ ] Foundation decides Zakat / Sadaqah / Waqf labelling and rules (scholars review wording), then add the funds in `src/lib/funds.ts`.
- [ ] Confirm Data Protection Commission registration with their legal adviser (Act 843). Write the privacy notice.
- [ ] Domain, Cloudflare account, R2 bucket (public for media, **separate private bucket** for applicant documents).

## Build: next up
1. **Scholarship portal** (AP-1 to AP-9, P0/P1)
   - Eligibility pages per category (Basic, SHS, TVET, tertiary, STEM).
   - Multi-step form with save-and-resume (draft keyed by reference + phone), zod validation per step.
   - Document upload to the private bucket: type and size limits, ClamAV scan (or scan queue), signed expiring URLs for reviewers.
   - Guardian consent when the applicant is a minor; restrict minors' data to authorised roles.
   - Confirmation by email + SMS with reference; status check by reference + phone.
   - Application windows (open/close dates) managed in admin; closed-state message.
   - Reviewer workflow: statuses, notes, scoring, bulk email.
2. **Admin 2FA** (AD-7, P0): Payload plugin/custom TOTP, or put `/admin` behind Cloudflare Access.
3. **Rate limiting + CAPTCHA** on `/api/donate/initialize`, `/api/contact`, application intake (Cloudflare Turnstile is free).
4. **Content pages**: `/about/*`, six programme pages, `/get-involved/*`, `/contact`, `/stories` and `/news` (collections already exist; routes do not).
5. **Donations dashboard + CSV export** (AD-3, DN-11): totals, trend by fund, filters by date/fund/channel.
6. **Recurring giving** (DN-4): Paystack Plans, card-first (recurring MoMo is patchy); reminder email before each charge.
7. **Waqf donation path** (DN-7) with explanatory content.
8. **SEO and analytics**: metadata, Open Graph, `NonprofitOrganization` structured data, sitemap, GA4 or Plausible.
9. **Pre-launch hardening**: security headers/HSTS, daily `pg_dump` plus a tested restore, Sentry, uptime monitor, Lighthouse mobile >= 85 and LCP < 2.5s on simulated 4G, WCAG 2.1 AA pass, Arabic font for RTL snippets.

## Known gaps in what exists
- Receipts and Paystack checkout have never run against live services. First task once keys exist: end-to-end test with Paystack test keys and a tunnel (cloudflared/ngrok) for the webhook.
- Hubtel SMS endpoint was written from memory; confirm against their docs.
- `Applications` and `Inbox` have no public intake UI yet (only `/api/contact`).
- The existing Playwright/Vitest tests are the template's; add tests for `settleDonation` (idempotency, amount mismatch) and the access rules.
- The homepage is a placeholder: no programme tiles, trust strip, newsletter or featured story yet.
- No newsletter provider chosen.

## Phase 2 (after launch)
Donor and applicant accounts, campaign pages with progress bars, Waqf investment dashboard, impact map, Hausa and other languages, corporate pledges.

## Open questions for the Foundation
Legal registration and documents; existing brand assets and domain; preferred payment providers and international cards; Zakat/Sadaqah/Waqf separation and reporting; who manages content and reviews applications after launch; Hausa at launch or Phase 2; budget and target date; intake only, or also awards and disbursement tracking.
