import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { extractCsrfToken } from '@/lib/csrf';

export const runtime = 'nodejs';

const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
  // Honeypot field. Legitimate clients leave this empty.
  company: z.string().max(100).optional().default(''),
});

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimit = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimit.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimit.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateLimit.set(ip, hits);
  return false;
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes('placeholder') &&
      !url.includes('your-project-url') &&
      !key.includes('placeholder') &&
      !key.includes('your-anon-key')
  );
}

async function storeInSupabase(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert({ email }, { onConflict: 'email' });
    return !error;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // CSRF protection
  const csrfToken = extractCsrfToken(request);
  const cookieToken = request.headers.get('cookie')?.match(/csrf_token=([^;]+)/)?.[1];
  
  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  // Accept likely-bot submissions without revealing the honeypot.
  if (parsed.data.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many signups. Please try again later.' },
      { status: 429 }
    );
  }

  const email = parsed.data.email;

  // Primary delivery: Resend notification (mirrors /api/contact).
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'primadigitalsolutions.ph@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (resendApiKey && fromEmail) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: 'New newsletter subscription',
          text: `New newsletter signup: ${email}`,
        }),
      });
      if (response.ok) {
        await storeInSupabase(email);
        return NextResponse.json({ ok: true });
      }
    } catch {
      /* fall through to Supabase backup */
    }
  }

  // Backup storage: Supabase table (supabase/migrations/0002_newsletter.sql).
  if (await storeInSupabase(email)) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: 'Newsletter signup is not configured yet.', fallback: 'local' },
    { status: 503 }
  );
}
