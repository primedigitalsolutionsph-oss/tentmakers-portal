import { NextResponse } from 'next/server';
import { getPool, type VentureRow } from '@/lib/db';
import { ventures as fallbackVentures } from '@/lib/ventures-data';

export const runtime = 'nodejs';

// Public venture directory. MySQL first, static lib/ventures-data.ts fallback
// (same fallback pattern as app/dashboard/ventures/page.tsx Supabase read).
export async function GET() {
  const pool = getPool();
  if (!pool) return NextResponse.json({ ventures: fallbackVentures, source: 'static' });
  try {
    const [rows] = await pool.query('SELECT * FROM ventures ORDER BY name ASC');
    const list = rows as VentureRow[];
    if (list.length === 0) {
      return NextResponse.json({ ventures: fallbackVentures, source: 'static' });
    }
    return NextResponse.json({ ventures: list, source: 'mysql' });
  } catch {
    return NextResponse.json({ ventures: fallbackVentures, source: 'static' });
  }
}
