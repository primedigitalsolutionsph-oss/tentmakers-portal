# Tentmakers Network — Member Portal

Marketing site + member dashboard for the Tentmakers Ecosystem (Panay Island):
five ventures, one training hub, 300-member Q4 2026 target.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS ·
shadcn/ui + Radix · Supabase (auth + Postgres) · Resend (email delivery).

## Prerequisites

- Node.js 22 LTS (`node --version`)
- A Supabase project (URL + anon key)
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
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL for metadata/OG |
| `RESEND_API_KEY` | For email delivery | Contact + newsletter via Resend |
| `CONTACT_FROM_EMAIL` | With Resend | Verified sender address |
| `CONTACT_TO_EMAIL` | No (defaults to support@tentmakers.ph) | Inquiry inbox |

Without Supabase keys the app runs in demo mode (marketing pages work,
dashboard shows demo state). Without Resend keys, contact/newsletter degrade
gracefully instead of failing silently.

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (also the Netlify/CI gate) |
| `npm run start` | Serve a production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config; see note below) |
| `npm test` | Vitest unit tests (`lib/__tests__/`) |

CI (`.github/workflows/ci.yml`) runs install → typecheck → lint → test → build on
push to `main` and on PRs.

## Supabase setup (run once, in this order)

Supabase Dashboard → SQL Editor, run each file in `supabase/migrations/`:

1. `20260910000000_tentmakers_core.sql` — `profiles` + `ventures` tables, RLS,
   new-user trigger
2. `20260911000001_ventures_content.sql` — venture long-form content
3. `20260911000002_training_progress.sql` — `completed_activities` column
4. `0002_newsletter.sql` — `newsletter_subscriptions` table

Then **Authentication → Providers → Google → Enable** (paste the Google Cloud
Client ID + Secret; callback URL is `https://<project-ref>.supabase.co/auth/v1/callback`),
and **Authentication → URL Configuration**: Site URL = production URL, plus
Redirect URLs for `http://localhost:3000/**` and `https://<domain>/**`
(the app sends `redirectTo: <origin>/dashboard`).

Without the Google provider enabled, Google sign-in fails with
`Unsupported provider: provider is not enabled` — the button explains this.

## Deploy (Netlify)

- Build command: `npx next build`, publish `.next`, plugin
  `@netlify/plugin-nextjs` (already in `netlify.toml`).
- Set the env vars above in Site settings → Environment variables.
- `NODE_VERSION` is pinned to `22` in `netlify.toml`.

## Conventions (read before editing)

- **Venture copy is canonical in `lib/ventures-data.ts`**, grounded in
  `Documents/Business Plan/Tentmakers_Ecosystem_Business_Plan.docx`. The
  `public.ventures` table mirrors it for future CMS use — edit the TS file
  first, then mirror into the seed migrations.
- **API routes** (`app/api/*/route.ts`): zod validation → honeypot
  (`company`) → per-IP rate limit → Resend primary → Supabase backup →
  graceful JSON error. New endpoints should follow the same shape.
- **Auth**: cookie-based Supabase SSR. Route guard lives in `middleware.ts`
  (classic edge-middleware convention — `proxy.ts` is avoided because the
  Netlify Next.js plugin's Node-middleware bundling is broken upstream;
  revisit once fixed) with a client-side counterpart in
  `app/dashboard/layout.tsx`. Registration is currently closed
  (`/register` redirects home); access requests flow through the register
  modal → `POST /api/contact`.
- **ESLint** runs on a minimal flat config (`eslint.config.mjs`) because
  `eslint-config-next`'s bundled plugins crash ESLint 10. Restore the Next
  config once it supports ESLint 10.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Unsupported provider` on Google sign-in | Enable Google provider + save in Supabase dashboard |
| Contact/newsletter 503 | Resend keys missing (or tables unapplied) — by design |
| Dashboard bounces to `/login` in a loop | Proxy can't read session: check Supabase URL/anon key |
| `tsc` error in `.next/types/validator.ts` | Stale Next typegen cache: restart dev or delete `.next/types` |
| `npm install` EPERM/EBUSY on Windows | Stop the dev server first (it locks native binaries) |
