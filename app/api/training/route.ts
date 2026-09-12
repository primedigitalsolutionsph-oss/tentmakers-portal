import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

const trainingSchema = z.object({
  trainingTier: z.enum(['basic', 'intermediate', 'advanced']),
  completedActivities: z.array(z.string().max(100)).max(50),
});

// MySQL-backed training progress. Monotonic promotion is enforced
// client-side (see app/dashboard/training/page.tsx); the API only persists
// the caller's own row. 503 when MySQL/Auth is unconfigured.
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: 'MySQL not configured' }, { status: 503 });
  const [rows] = await pool.query(
    'SELECT trainingTier, completedActivities FROM profiles WHERE id = ? LIMIT 1',
    [userId]
  );
  const row = (rows as { trainingTier: string; completedActivities: unknown }[])[0];
  let completed: string[] = [];
  const raw = row?.completedActivities;
  if (Array.isArray(raw)) completed = raw.filter((v): v is string => typeof v === 'string');
  else if (typeof raw === 'string') {
    try {
      const p: unknown = JSON.parse(raw);
      if (Array.isArray(p)) completed = p.filter((v): v is string => typeof v === 'string');
    } catch {
      completed = [];
    }
  }
  return NextResponse.json({
    trainingTier: row?.trainingTier ?? 'basic',
    completedActivities: completed,
  });
}

export async function PATCH(request: Request) {
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
  const parsed = trainingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid progress.' }, { status: 400 });

  await pool.query(
    `INSERT INTO profiles (id, role, trainingTier, completedActivities)
     VALUES (?, 'member', ?, CAST(? AS JSON))
     ON DUPLICATE KEY UPDATE trainingTier = VALUES(trainingTier), completedActivities = VALUES(completedActivities)`,
    [userId, parsed.data.trainingTier, JSON.stringify(parsed.data.completedActivities)]
  );
  return NextResponse.json({
    trainingTier: parsed.data.trainingTier,
    completedActivities: parsed.data.completedActivities,
  });
}
