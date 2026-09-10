import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  inquiryType: z.enum(['member', 'partner', 'general']),
  message: z.string().trim().min(10).max(5000),
  // Honeypot field. Legitimate clients leave this empty.
  company: z.string().max(100).optional().default(''),
});

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimit = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimit.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimit.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateLimit.set(ip, hits);
  return false;
}

function sanitizeLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid inquiry.' }, { status: 400 });
  }

  // Accept likely-bot submissions without revealing the honeypot.
  if (parsed.data.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many inquiries. Please try again later.' },
      { status: 429 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'primadigitalsolutions.ph@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!resendApiKey || !fromEmail) {
    return NextResponse.json(
      {
        error: 'Contact delivery is not configured.',
        contactEmail: toEmail,
      },
      { status: 503 }
    );
  }

  const subject = sanitizeLine(`[${parsed.data.inquiryType}] Inquiry from ${parsed.data.name}`).slice(0, 150);
  const text = [
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Inquiry Type: ${parsed.data.inquiryType}`,
    '',
    'Message:',
    parsed.data.message,
  ].join('\n');

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
        reply_to: parsed.data.email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not deliver your inquiry. Please email us directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Could not deliver your inquiry. Please email us directly.' },
      { status: 502 }
    );
  }
}
