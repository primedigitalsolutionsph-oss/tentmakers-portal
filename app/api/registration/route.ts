import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getPool } from '@/lib/db';
import { getClientIp, isRateLimited } from '@/lib/contact';

export const runtime = 'nodejs';

const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().default(''),
  inquiryType: z.enum(['member', 'partner', 'general']).default('member'),
  message: z.string().trim().max(5000).optional().default(''),
  company: z.string().max(100).optional().default(''),
});

// Public member registration -> MySQL registrations table (Hostinger).
// Mirrors /api/contact conventions: zod -> honeypot -> per-IP rate limit.
// 503 when DATABASE_URL unset (Supabase has no equivalent table yet).
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid registration.' }, { status: 400 });
  if (parsed.data.company.trim() !== '') return NextResponse.json({ ok: true });

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Registration storage is not configured.' }, { status: 503 });
  }
  try {
    const id = randomUUID();
    await pool.query(
      `INSERT INTO registrations (id, fullName, email, phone, inquiryType, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id,
        parsed.data.fullName,
        parsed.data.email.toLowerCase().trim(),
        parsed.data.phone || null,
        parsed.data.inquiryType,
        parsed.data.message || null,
      ]
    );
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not save registration.' }, { status: 500 });
  }
}
