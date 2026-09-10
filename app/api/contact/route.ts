import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  inquiryType: z.enum(['member', 'partner', 'general']),
  message: z.string().trim().min(10).max(5000),
});

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid inquiry.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    // No backend configured: let the client fall back to mailto.
    return NextResponse.json(
      { error: 'Contact backend not configured.', fallback: 'mailto' },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error } = await supabase.from('inquiries').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      inquiry_type: parsed.data.inquiryType,
      message: parsed.data.message,
    });
    if (error) {
      return NextResponse.json({ error: 'Could not save inquiry.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save inquiry.' }, { status: 500 });
  }
}
