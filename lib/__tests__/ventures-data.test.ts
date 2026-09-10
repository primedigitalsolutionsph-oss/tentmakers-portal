import { describe, expect, it } from 'vitest';
import { getVentureBySlug, ventures } from '@/lib/ventures-data';

const EXPECTED_SLUGS = [
  'prime-digital-solutions',
  'thrifty-tribe',
  'icky',
  'prime-axis',
  'tentmakers-network',
];

describe('venture directory integrity', () => {
  it('contains exactly the five expected ventures with unique slugs', () => {
    expect(ventures.map((v) => v.slug).sort()).toEqual(
      [...EXPECTED_SLUGS].sort()
    );
    expect(new Set(ventures.map((v) => v.slug)).size).toBe(ventures.length);
  });

  it('resolves every slug back to its venture', () => {
    for (const slug of EXPECTED_SLUGS) {
      expect(getVentureBySlug(slug)?.slug).toBe(slug);
    }
    expect(getVentureBySlug('does-not-exist')).toBeUndefined();
  });

  it('has complete display content for every venture', () => {
    for (const venture of ventures) {
      expect(venture.name.length).toBeGreaterThan(0);
      expect(['Active', 'Scaling', 'Early']).toContain(venture.stage);
      expect(venture.gap.length).toBeGreaterThan(0);
      expect(venture.offering.length).toBeGreaterThan(0);
      expect(venture.marketSignals.length).toBeGreaterThan(0);
      expect(venture.fullDescription.length).toBeGreaterThan(0);
      expect(venture.industries.length).toBeGreaterThan(0);
      expect(venture.metric.length).toBeGreaterThan(0);
      expect(venture.metricLabel.length).toBeGreaterThan(0);
    }
  });
});
