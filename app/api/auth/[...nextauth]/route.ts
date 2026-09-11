import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions, isMysqlAuthConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

// MySQL/Auth.js auth is optional (Supabase is primary). When it is not
// configured, return the same empty-session shape NextAuth uses for an
// unauthenticated session instead of invoking the full handler, which
// 500s in production without AUTH_SECRET.
export async function GET(request: Request) {
  if (!isMysqlAuthConfigured) return NextResponse.json({});
  return handler(request);
}

export async function POST(request: Request) {
  if (!isMysqlAuthConfigured) return NextResponse.json({});
  return handler(request);
}
