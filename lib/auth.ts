import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { compare } from 'bcryptjs';
import { getPool, type UserRow } from '@/lib/db';
import { randomUUID } from 'crypto';

const credentialsSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

// Hostinger MySQL auth (next-auth v4 stable, mysql2 pool — no Prisma engine).
// JWT strategy; MySQL rows are read/written in callbacks.
// Inactive unless DATABASE_URL + AUTH_SECRET/NEXTAUTH_SECRET are set.
// Schema: db/hostinger.sql.
export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const pool = getPool();
        if (!pool) return null;
        const [rows] = await pool.query(
          'SELECT id, email, passwordHash, fullName FROM users WHERE email = ? LIMIT 1',
          [parsed.data.email.toLowerCase().trim()]
        );
        const user = (rows as UserRow[])[0];
        if (!user?.passwordHash) return null;
        const ok = await compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.fullName ?? undefined };
      },
    }),
  ],
  callbacks: {
    // next-auth's own .d.ts surface is unreliable in the installed build
    // (root re-exports members with no backing declarations), so these
    // callbacks stay explicitly `any`-typed instead of pretending otherwise.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    // Mirror Supabase handle_new_user(): ensure users + profiles rows exist
    // for OAuth sign-ins (MySQL has no Postgres trigger).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: any) {
      try {
        const pool = getPool();
        if (!pool || !user.email) return true;
        const email = user.email.toLowerCase().trim();
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
        let userId = (rows as { id: string }[])[0]?.id;
        if (!userId) {
          userId = randomUUID();
          await pool.query(
            'INSERT INTO users (id, email, fullName, image) VALUES (?, ?, ?, ?)',
            [userId, email, user.name?.slice(0, 100) ?? null, user.image?.slice(0, 500) ?? null]
          );
        }
        await pool.query(
          "INSERT IGNORE INTO profiles (id, role, trainingTier, completedActivities) VALUES (?, 'member', 'basic', JSON_ARRAY())",
          [userId]
        );
        if (account?.provider === 'google' && account.providerAccountId) {
          await pool.query(
            'INSERT IGNORE INTO accounts (id, userId, type, provider, providerAccountId) VALUES (?, ?, ?, ?, ?)',
            [randomUUID(), userId, account.type, 'google', account.providerAccountId]
          );
        }
      } catch {
        // Never block sign-in on bookkeeping failures.
      }
      return true;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

export const isMysqlAuthConfigured = Boolean(
  process.env.DATABASE_URL && (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET)
);
