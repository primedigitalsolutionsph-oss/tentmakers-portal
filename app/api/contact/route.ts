import { NextResponse } from 'next/server';
import {
  CONTACT_EMAIL,
  contactSchema,
  getClientIp,
  isRateLimited,
  sanitizeLine,
} from '@/lib/contact';
import { extractCsrfToken } from '@/lib/csrf';

export const runtime = 'nodejs';

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
  const toEmail = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
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
