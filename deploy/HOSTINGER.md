# Deploy — Hostinger (Node.js + MySQL)

Single target. No Netlify, no VPS, no Supabase.

## 1. Database (hPanel → Databases → phpMyAdmin)

1. Create the MySQL database + user in hPanel.
2. Click the database name in the phpMyAdmin left sidebar first.
3. Import `db/hostinger.sql` (do NOT run CREATE DATABASE — the Hostinger
   MySQL user has no privilege for it).
4. Copy the connection string:
   `mysql://<user>:<password>@<host>:3306/<database>`

## 2. Node.js app (hPanel → Websites → Node.js)

1. Upload the project (File Manager or Git) and select **Node.js 22**.
2. Application startup: `npm start` (the app serves via `next start`,
   which respects the `PORT` env Hostinger assigns).
3. Copy `deploy/hostinger.env` to `.env.local` in the app root and fill in:
   `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL` (same domain — required in
   production so auth callbacks resolve correctly), `DATABASE_URL`,
   `AUTH_SECRET` (generate: `openssl rand -base64 32`), Google OAuth keys,
   Resend keys.
4. Install + build:
   `npm install --omit=dev`
   `npm run build`
5. Start the app from the hPanel Node.js panel and enable SSL for the domain.

## 3. Google OAuth (Google Cloud Console → Credentials)

Authorized redirect URI (NextAuth):

`https://<domain>/api/auth/callback/google`

Paste the Client ID + Secret into `GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_SECRET` and restart the app.

## 4. Verify

- `/` marketing pages render (hero, ventures, training, market, stories).
- `/login` → Google + credentials both reach `/dashboard`.
- `/dashboard/training` persists progress (MySQL `profiles` row).
- `/contact` delivers via Resend; `/api/newsletter` stores to MySQL
  `newsletter_subscriptions` even when Resend is unset.
- Without `DATABASE_URL`, API routes degrade gracefully (static venture
  fallback, 503 with a clear message) instead of 500ing.
