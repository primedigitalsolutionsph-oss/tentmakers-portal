import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// CSRF token utilities for form protection

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

export function verifyCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;
  // Timing-safe comparison
  if (token.length !== sessionToken.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
}

// Generate a CSRF token pair for server-side storage and client cookie
export function createCsrfPair(): { token: string; cookie: string } {
  const token = generateCsrfToken();
  const cookie = `csrf_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`;
  return { token, cookie };
}

// Extract CSRF token from request headers or body
export function extractCsrfToken(request: Request): string | null {
  // Check header first (for fetch/AJAX)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) return headerToken;

  // Check cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

// Middleware helper for CSRF protection on mutating routes
export function createCsrfMiddleware(exemptPaths: string[] = ['/api/health']) {
  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url);
    
    // Skip for exempt paths
    if (exemptPaths.some(path => url.pathname.startsWith(path))) {
      return null;
    }

    // Only check mutating methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      return null;
    }

    const token = extractCsrfToken(request);
    const cookieToken = request.headers.get('cookie')?.match(/csrf_token=([^;]+)/)?.[1];

    if (!token || !cookieToken || token !== cookieToken) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return null;
  };
}

// Client-side helper to get CSRF token from cookie
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

// Client-side helper to add CSRF token to fetch requests
export function withCsrfToken(init: RequestInit = {}): RequestInit {
  const token = getCsrfTokenFromCookie();
  if (!token) return init;

  return {
    ...init,
    headers: {
      ...init.headers,
      'x-csrf-token': token,
    },
  };
}