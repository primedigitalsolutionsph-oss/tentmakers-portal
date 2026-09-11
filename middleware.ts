import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes('placeholder') &&
      !url.includes('your-project-url') &&
      !key.includes('placeholder') &&
      !key.includes('your-anon-key')
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Demo mode is opt-in and off by default. When Supabase is unconfigured
  // and demo mode is disabled, protected routes fail closed to /login.
  // NOTE: keep this file edge-safe (Supabase SSR only). Do NOT import
  // Node-only modules (next-auth, mysql2, lib/auth, lib/db) here — Netlify
  // bundles proxy.ts as an edge function and Node imports break the build.
  const demoAuthAllowed =
    process.env.NEXT_PUBLIC_ALLOW_DEMO_AUTH === 'true';
  if (!isConfigured()) {
    if (isDashboard && !demoAuthAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'auth-unavailable');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
