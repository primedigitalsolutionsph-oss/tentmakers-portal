import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
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

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    // No backend configured: client shows a graceful success state.
    return NextResponse.json(
      { error: 'Newsletter backend not configured.', fallback: 'local' },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert({ email: parsed.data.email }, { onConflict: 'email' });
    if (error) {
      return NextResponse.json({ error: 'Could not save subscription.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save subscription.' }, { status: 500 });
  }
}
