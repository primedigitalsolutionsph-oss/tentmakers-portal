import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ventures } from '@/lib/ventures-data';

function readRepo(relativePath: string): string {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
}

const hostinger = readRepo('db/hostinger.sql');
const prisma = readRepo('prisma/schema.prisma');

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

describe('required MySQL tables', () => {
  it.each(['profiles', 'ventures', 'newsletter_subscriptions'])(
    'table %s exists in db/hostinger.sql',
    (table) => {
      expect(hostinger.toLowerCase()).toContain(`create table if not exists ${table} (`);
    }
  );
});

describe('venture seed parity (canonical: lib/ventures-data.ts)', () => {
  it('every venture slug is seeded in MySQL', () => {
    for (const v of ventures) {
      expect(hostinger, `mysql:${v.slug}`).toContain(`'${v.slug}'`);
    }
  });

  it('seeded name + stage match the canonical copy in MySQL', () => {
    for (const v of ventures) {
      expect(
        hostinger.includes(`('${v.slug}','${v.name}','${v.stage}',`),
        `mysql:${v.slug}`
      ).toBe(true);
    }
  });

  it('every canonical industry is seeded in MySQL', () => {
    for (const v of ventures) {
      for (const industry of v.industries) {
        expect(hostinger, `mysql:${v.slug}:${industry}`).toContain(`'${industry}'`);
      }
    }
  });
});
