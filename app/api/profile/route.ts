import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { getPool, normProfile, type ProfileRow } from '@/lib/db';

export const runtime = 'nodejs';

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+()\-.\s\d]*$/, 'Invalid phone')
    .optional(),
});

// MySQL-backed profile (Hostinger). Requires Auth.js session; the session
// user id owns the row.
// Returns 503 when MySQL/Auth is unconfigured.
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: 'MySQL not configured' }, { status: 503 });
  const [rows] = await pool.query('SELECT * FROM profiles WHERE id = ? LIMIT 1', [userId]);
  const row = (rows as ProfileRow[])[0];
  return NextResponse.json({ profile: row ? normProfile(row) : null });
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
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid profile.' }, { status: 400 });

  await pool.query(
    `INSERT INTO profiles (id, fullName, phone, role, trainingTier, completedActivities)
     VALUES (?, ?, ?, 'member', 'basic', JSON_ARRAY())
     ON DUPLICATE KEY UPDATE fullName = VALUES(fullName), phone = VALUES(phone)`,
    [userId, parsed.data.fullName ?? null, parsed.data.phone ?? null]
  );
  await pool
    .query('UPDATE users SET fullName = ?, phone = ? WHERE id = ?', [
      parsed.data.fullName ?? null,
      parsed.data.phone ?? null,
      userId,
    ])
    .catch(() => undefined);
  const [rows] = await pool.query('SELECT * FROM profiles WHERE id = ? LIMIT 1', [userId]);
  const row = (rows as ProfileRow[])[0];
  return NextResponse.json({ profile: row ? normProfile(row) : null });
}
