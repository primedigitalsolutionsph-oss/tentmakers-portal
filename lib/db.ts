import mysql from 'mysql2/promise';

// Hostinger MySQL pool (mysql2 — no native engine binaries, Windows-safe).
// Returns null when DATABASE_URL is unset so the app keeps running on
// Supabase. DATABASE_URL: mysql://user:password@host:3306/tentmakers
// Schema: db/hostinger.sql (import via hPanel -> phpMyAdmin).
// prisma/schema.prisma is the typed reference for the same tables.

type Pool = mysql.Pool;

const globalForMysql = globalThis as unknown as { __mysqlPool?: Pool };

export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (globalForMysql.__mysqlPool) return globalForMysql.__mysqlPool;
  try {
    const pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 5,
      timezone: 'Z',
    });
    if (process.env.NODE_ENV !== 'production') globalForMysql.__mysqlPool = pool;
    return pool;
  } catch {
    return null;
  }
}

/** Back-compat alias: getDb() === getPool(). */
export function getDb(): Pool | null {
  return getPool();
}

export const isMysqlConfigured = Boolean(process.env.DATABASE_URL);

// --- Row types (mirror prisma/schema.prisma + db/hostinger.sql) ---

export interface UserRow {
  id: string;
  email: string;
  emailVerified: Date | null;
  passwordHash: string | null;
  fullName: string | null;
  phone: string | null;
  image: string | null;
}

export interface ProfileRow {
  id: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  requestedRole: string | null;
  trainingTier: string;
  completedActivities: string[] | null;
}

export interface VentureRow {
  slug: string;
  name: string;
  stage: string;
  gap: string;
  offering: string;
  description: string;
  marketSignals: unknown;
  fullDescription: unknown;
  metric: string;
  metricLabel: string;
  industries: unknown;
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === 'string');
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function normProfile(row: ProfileRow): {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  training_tier: string;
  completed_activities: string[];
} {
  return {
    id: row.id,
    full_name: row.fullName,
    phone: row.phone,
    role: row.role,
    training_tier: row.trainingTier,
    completed_activities: parseJsonArray(row.completedActivities),
  };
}
