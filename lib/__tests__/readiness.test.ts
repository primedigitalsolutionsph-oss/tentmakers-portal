import { describe, expect, it } from 'vitest';
import { bandForScore, computeReadiness } from '@/lib/readiness';

describe('bandForScore', () => {
  it.each([
    [0, 'Foundation', 'Building'],
    [39, 'Foundation', 'Building'],
    [40, 'Building', 'Established'],
    [62, 'Building', 'Established'],
    [70, 'Established', 'Anchor'],
    [89, 'Established', 'Anchor'],
    [90, 'Anchor', null],
    [100, 'Anchor', null],
  ])('score %i -> %s band, next %s', (score, band, next) => {
    const result = bandForScore(score);
    expect(result.band.name).toBe(band);
    expect(result.nextBand?.name ?? null).toBe(next);
  });

  it('clamps out-of-range scores', () => {
    expect(bandForScore(-5).band.name).toBe('Foundation');
    expect(bandForScore(140).band.name).toBe('Anchor');
  });
});

describe('computeReadiness', () => {
  it('weights sum to 100', () => {
    const result = computeReadiness({ completedActivities: [], totalActivities: 6 });
    expect(result.components.reduce((sum, c) => sum + c.max, 0)).toBe(100);
  });

  it('scores training proportionally and leaves the rest pending', () => {
    const result = computeReadiness({
      completedActivities: ['a', 'b', 'c'],
      totalActivities: 6,
    });
    expect(result.total).toBe(15);
    expect(result.components[0]).toMatchObject({
      key: 'training',
      points: 15,
      max: 30,
      status: 'tracked',
    });
    for (const component of result.components.slice(1)) {
      expect(component.status).toBe('pending');
      expect(component.points).toBe(0);
    }
    expect(result.trackedCount).toBe(1);
  });

  it('caps at full training completion', () => {
    const result = computeReadiness({
      completedActivities: ['a', 'b', 'c', 'd', 'e', 'f', 'stale-id'],
      totalActivities: 6,
    });
    expect(result.total).toBe(30);
    expect(result.band.name).toBe('Foundation');
    expect(result.nextBand?.name).toBe('Building');
    expect(result.pointsToNextBand).toBe(10);
  });

  it('ignores non-string entries', () => {
    const result = computeReadiness({
      completedActivities: ['a', null as unknown as string],
      totalActivities: 6,
    });
    expect(result.total).toBe(5);
  });

  it('empty training starts at zero in the Foundation band', () => {
    const result = computeReadiness({ completedActivities: [], totalActivities: 6 });
    expect(result.total).toBe(0);
    expect(result.band.name).toBe('Foundation');
    expect(result.pointsToNextBand).toBe(40);
  });
});
