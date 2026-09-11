import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

const createSchema = z.object({
  tier: z.enum(['network', 'accelerator', 'thrifty-tribe', 'icky', 'prime-axis', 'prime-digital']),
  provider: z.string().max(50).optional(),
  providerRef: z.string().max(255).optional(),
});

// Member subscriptions (new — no Supabase equivalent yet).
// GET lists the caller's own rows; POST creates a pending row that a
// payment webhook (Xendit/Stripe) later marks active.
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: 'MySQL not configured' }, { status: 503 });
  const [rows] = await pool.query(
    'SELECT * FROM subscriptions WHERE userId = ? ORDER BY createdAt DESC',
    [userId]
  );
  return NextResponse.json({ subscriptions: rows });
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: 'MySQL not configured' }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 });

  const id = randomUUID();
  await pool.query(
    "INSERT INTO subscriptions (id, userId, tier, status, provider, providerRef) VALUES (?, ?, ?, 'pending', ?, ?)",
    [id, userId, parsed.data.tier, parsed.data.provider ?? null, parsed.data.providerRef ?? null]
  );
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ? LIMIT 1', [id]);
  return NextResponse.json({ subscription: (rows as unknown[])[0] }, { status: 201 });
}
