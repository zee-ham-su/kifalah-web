# Kifalah Foundation Ghana: website

Public website and admin area for Kifalah Foundation Ghana. It shares information, collects volunteer,
partnership, contact and newsletter sign-ups, and lets supporters **record a pledge**.

**This site does not process payments.** Supporters give to the Foundation's official bank or Mobile Money
accounts shown on the Support Us page; the pledge form only records intent. Online payments are planned for a
later phase.

## What's in it

**Public pages:** Home, About, Programmes (+ detail), Impact, Get Involved (volunteer, partner, newsletter),
News and Stories (+ article), Transparency (reports and policies), Support Us, Contact, Privacy Notice.

**Admin area (`/admin`):** manage programmes, news, impact numbers and documents; read contact messages,
volunteer applications, partnership enquiries and newsletter subscribers; follow up on pledges
(Pledged / Received / Follow up); export pledges and subscribers as CSV.

## Stack

| Part | Tech |
|---|---|
| Frontend | React, Vite, Tailwind, shadcn/ui, wouter, TanStack Query |
| API | Express 5, Zod validation |
| Database | PostgreSQL via Drizzle ORM |
| Admin sign-in | Clerk, plus an email allowlist (`ADMIN_EMAILS`) |
| Email alerts | Resend (optional) |
| Tooling | pnpm workspace, OpenAPI -> generated client and validators (Orval) |

## Layout

```
artifacts/
  kifalah-foundation/   React app (public site + lazily loaded admin in src/AdminApp.tsx)
  api-server/           Express API (src/routes, src/middlewares, test/smoke.ts)
lib/
  api-spec/             openapi.yaml: the API contract (edit this first)
  api-client-react/     generated React Query hooks
  api-zod/              generated Zod schemas
  db/                   Drizzle schema (src/schema)
doc/                    CHANGELOG.md and NEXT-STEPS.md
```

Site content that staff should not need a developer for lives in the admin. Official contact details, bank and
Mobile Money accounts and social links live in **`artifacts/kifalah-foundation/src/config/site.ts`**. Anything left
empty is hidden or shown as "coming soon"; the site never invents details.

## Getting started

Requires Node 24, pnpm and PostgreSQL. It is set up to run on Replit (see `.replit`).

```bash
pnpm install
cp .env.example .env        # then fill it in (see Environment)
pnpm --filter @workspace/db run push     # create/update database tables
pnpm run typecheck
pnpm run build
```

Run the pieces in separate terminals. The API uses port `5000`; the frontend uses `5173`.

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/kifalah-foundation run dev
```

The Vite dev server proxies `/api` requests to the local API on port `5000`. On Replit, the router serves both
together.

## Environment

See `.env.example`. The important ones:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` | Admin sign-in |
| `ADMIN_EMAILS` | Comma-separated **verified** emails allowed into the admin. Empty = nobody. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | Email alert to staff on each new form submission (optional) |
| `CORS_ORIGINS` | Leave empty unless the API is on a different origin |
| `FORM_RATE_LIMIT` | Submissions per IP per 15 minutes across public forms (default 10) |

**Admin security:** signing in is not enough. Turn off sign-ups in the Clerk dashboard and list staff emails in
`ADMIN_EMAILS`; the server checks that list on every admin request.

## Common tasks

```bash
# Change the API: edit lib/api-spec/openapi.yaml, then regenerate hooks + validators
pnpm --filter @workspace/api-spec run codegen

# Change the database: edit lib/db/src/schema/*, then
pnpm --filter @workspace/db run push

# API smoke test (41 checks against a real Postgres, Clerk sign-in stubbed)
DATABASE_URL=postgresql://... pnpm --filter @workspace/api-server run smoke
```

`db push` syncs the schema directly (no migration files). Review its prompts before running it on live data.

## Before going live

See **`doc/NEXT-STEPS.md`** for the full list. The essentials: disable Clerk sign-ups and set `ADMIN_EMAILS`, fill
in `src/config/site.ts` with confirmed official details, run the database push, add real content and reports,
and have the Privacy Notice reviewed.

## Docs

- [`doc/CHANGELOG.md`](doc/CHANGELOG.md): what changed and why
- [`doc/NEXT-STEPS.md`](doc/NEXT-STEPS.md): what to do next
