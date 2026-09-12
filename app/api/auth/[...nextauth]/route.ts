import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions, isMysqlAuthConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

// MySQL/NextAuth is the only auth provider. When it is not configured,
// return the same empty-session shape NextAuth uses for an unauthenticated
// session instead of invoking the full handler, which 500s in production
// without AUTH_SECRET.
type RouteContext = { params: Promise<{ nextauth?: string[] }> };

export async function GET(request: Request, context: RouteContext) {
  if (!isMysqlAuthConfigured) return NextResponse.json({});
  return handler(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  if (!isMysqlAuthConfigured) return NextResponse.json({});
  return handler(request, context);
}
