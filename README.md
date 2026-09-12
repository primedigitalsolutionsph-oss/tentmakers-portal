# Tentmakers Network — Member Portal

Marketing site + member dashboard for the Tentmakers Ecosystem (Panay Island):
five ventures, one training hub, 300-member Q4 2026 target.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS ·
shadcn/ui + Radix · Hostinger MySQL (auth + data) · Resend (email delivery).

Deploy target is **Hostinger only** (Node.js app + MySQL). No Netlify, no VPS,
no Supabase.

## Prerequisites

- Node.js 22 LTS (`node --version`)
- A Hostinger MySQL database (hPanel → Databases)
- (Optional) Resend API key for contact/newsletter delivery
- (Optional) Google Cloud OAuth client for Google sign-in

## Setup

```bash
npm install --legacy-peer-deps   # .npmrc already sets this; plain `npm install` also works
cp .env.local.example .env.local # then fill in values (table below)
npm run dev                       # http://localhost:3000 (Turbopack)
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL for metadata/OG |
| `DATABASE_URL` | Yes | Hostinger MySQL connection string (`mysql://user:password@host:3306/tentmakers`) |
| `AUTH_SECRET` | Yes | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes (prod) | Canonical auth URL so callbacks resolve to the domain, not localhost |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google sign-in | Google Cloud OAuth client |
| `RESEND_API_KEY` | For email delivery | Contact + newsletter via Resend |
| `CONTACT_FROM_EMAIL` | With Resend | Verified sender address |
| `CONTACT_TO_EMAIL` | No (defaults to support@tentmakers.ph) | Inquiry inbox |

Without `DATABASE_URL` the app runs in degraded mode (marketing pages work,
API routes return the static venture fallback or a clear 503). Without Resend
keys, contact/newsletter degrade gracefully instead of failing silently.

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (also the pre-deploy gate) |
| `npm run start` | Serve a production build (`next start`, respects `PORT`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config; see note below) |
| `npm test` | Vitest unit tests (`lib/__tests__/`) |

## Database setup (run once)

Import `db/hostinger.sql` via hPanel → Databases → phpMyAdmin → Import
(click the database name in the left sidebar first; do NOT run
CREATE DATABASE). Tables: `users`, `accounts`, `sessions`,
`verification_tokens` (NextAuth), `profiles`, `ventures`,
`newsletter_subscriptions`, `registrations`, `subscriptions`.

For Google sign-in, add this Authorized redirect URI in the Google Cloud
Console (Credentials → OAuth client):

`https://<domain>/api/auth/callback/google`

## Deploy (Hostinger)

Full runbook: `deploy/HOSTINGER.md`. Short version:

1. Import `db/hostinger.sql` (see above).
2. hPanel → Node.js app (v22), upload project, copy `deploy/hostinger.env`
   to `.env.local` and fill in values.
3. `npm install --omit=dev`, then `npm run build`, then start via `npm start`.
4. Enable SSL and verify: `/`, `/login` → `/dashboard`, training progress
   persists, contact/newsletter deliver.

## Conventions (read before editing)

- **Venture copy is canonical in `lib/ventures-data.ts`**, grounded in
  `Documents/Business Plan/Tentmakers_Ecosystem_Business_Plan.docx`. The
  MySQL `ventures` table mirrors it for future CMS use — edit the TS file
  first, then mirror into `db/hostinger.sql`.
- **Schema parity** is guarded by `lib/__tests__/schema-parity.test.ts`
  (Prisma models ↔ `db/hostinger.sql` tables, venture slugs/stages/industries
  in the seed). Known gaps it does NOT cover, by decision:
  `db/hostinger.sql` venture long-form copy (offering/description/signals) is
  abbreviated vs the TS canonical copy, so MySQL-first reads
  (`GET /api/ventures`) serve shorter copy. `registrations`/`subscriptions`
  are MySQL-only by design (503 without `DATABASE_URL`).
- **API routes** (`app/api/*/route.ts`): zod validation → honeypot
  (`company`) → per-IP rate limit → Resend primary → MySQL backup →
  graceful JSON error. New endpoints should follow the same shape.
- **Auth**: NextAuth v4 (JWT strategy, MySQL adapter tables) + Google +
  credentials. Route guard lives in `middleware.ts` (next-auth/jwt) with a
  client-side counterpart in `app/dashboard/layout.tsx`. Registration is
  currently closed (`/register` redirects home); access requests flow through
  the register modal → `POST /api/contact`.
- **ESLint** (v10, flat `eslint.config.mjs`): Next `core-web-vitals` +
  `react-hooks` flat recommended + `typescript-eslint` recommended, wired
  directly — no `npm install` needed. The `react` / `jsx-a11y` / `import`
  rules from `eslint-config-next` are still excluded: that package ships no
  flat entry point and its plugins peer-cap at ESLint 9 (verified up to
  `16.4.0-canary`; `@eslint/eslintrc` isn't installed). Either downgrade to
  ESLint 9 or restore the wrapper once upstream ships a flat ESLint-10 config.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Google sign-in error | Check Client ID/Secret + redirect URI `https://<domain>/api/auth/callback/google` |
| Contact/newsletter 503 | Resend keys or `DATABASE_URL` missing (newsletter falls back to MySQL when Resend is unset) |
| Dashboard bounces to `/login` in a loop | `DATABASE_URL`/`AUTH_SECRET` missing or wrong; check env |
| `tsc` error in `.next/types/validator.ts` | Stale Next typegen cache: restart dev or delete `.next/types` |
| `npm install` EPERM/EBUSY on Windows | Stop the dev server first (it locks native binaries) |
