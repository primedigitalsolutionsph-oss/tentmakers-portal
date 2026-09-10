import { z } from 'zod';

// Single source of truth for the public contact address.
// Operational override lives in CONTACT_TO_EMAIL (server-side).
export const CONTACT_EMAIL = 'primadigitalsolutions.ph@gmail.com';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  inquiryType: z.enum(['member', 'partner', 'general']),
  message: z.string().trim().min(10).max(5000),
  // Honeypot field. Legitimate clients leave this empty.
  company: z.string().max(100).optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function sanitizeLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// In-memory per-instance rate limiting. Adequate as a first layer;
// a distributed limiter (e.g. Upstash) is needed for multi-instance prod.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export function clearRateLimits(): void {
  hits.clear();
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
