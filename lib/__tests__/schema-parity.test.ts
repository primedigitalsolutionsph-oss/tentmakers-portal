import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ventures } from '@/lib/ventures-data';

function readRepo(relativePath: string): string {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
}

const hostinger = readRepo('db/hostinger.sql');
const prisma = readRepo('prisma/schema.prisma');
const coreMigration = readRepo('supabase/migrations/20260910000000_tentmakers_core.sql');
const industriesMigration = readRepo(
  'supabase/migrations/20260911000003_venture_industries.sql'
);

/** Collapse all whitespace so multiline SQL seeds compare reliably. */
function flat(sql: string): string {
  return sql.replace(/\s+/g, ' ');
}

describe('Prisma <-> MySQL schema parity', () => {
  it('every Prisma model has a matching CREATE TABLE in db/hostinger.sql', () => {
    const models = [...prisma.matchAll(/^model (\w+) \{[^}]*@@map\("([^"]+)"\)/gm)];
    expect(models.length).toBeGreaterThan(0);
    for (const [, model, table] of models) {
      expect(
        hostinger.toLowerCase().includes(`create table if not exists ${table} (`),
        `${model} -> ${table}`
      ).toBe(true);
    }
  });
});

describe('Supabase <-> MySQL table parity', () => {
  it.each(['profiles', 'ventures', 'newsletter_subscriptions'])(
    'Supabase table %s exists in db/hostinger.sql',
    (table) => {
      expect(hostinger.toLowerCase()).toContain(`create table if not exists ${table} (`);
    }
  );
});

describe('venture seed parity (canonical: lib/ventures-data.ts)', () => {
  it('every venture slug is seeded in both databases', () => {
    for (const v of ventures) {
      expect(hostinger, `mysql:${v.slug}`).toContain(`'${v.slug}'`);
      expect(coreMigration, `supabase:${v.slug}`).toContain(`'${v.slug}'`);
    }
  });

  it('seeded name + stage match the canonical copy in both databases', () => {
    for (const v of ventures) {
      expect(
        hostinger.includes(`('${v.slug}','${v.name}','${v.stage}',`),
        `mysql:${v.slug}`
      ).toBe(true);
      expect(
        flat(coreMigration).includes(`'${v.slug}', '${v.name}', '${v.stage}',`),
        `supabase:${v.slug}`
      ).toBe(true);
    }
  });

  it('every canonical industry is seeded in both databases', () => {
    for (const v of ventures) {
      for (const industry of v.industries) {
        expect(hostinger, `mysql:${v.slug}:${industry}`).toContain(`'${industry}'`);
        expect(industriesMigration, `supabase:${v.slug}:${industry}`).toContain(
          `'${industry}'`
        );
      }
    }
  });
});
