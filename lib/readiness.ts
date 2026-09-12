// Readiness Score v1 — honest accounting, not a black box.
//
// Weights match the published program design (see app/about/page.tsx):
// training 30, savings 20, site engagement 20, protection 15, mentorship 15.
//
// Only the training signal is measurable today (completed_activities via
// GET /api/profile). The other four components score 0 and are explicitly
// marked "pending" so members see what is — and isn't — feeding their
// score. As each signal comes online, extend ScoreInput and flip the
// corresponding component to "tracked". Bands stay fixed.

export interface ScoreBand {
  name: string;
  min: number;
  max: number;
}

export const SCORE_BANDS: ScoreBand[] = [
  { name: 'Foundation', min: 0, max: 39 },
  { name: 'Building', min: 40, max: 69 },
  { name: 'Established', min: 70, max: 89 },
  { name: 'Anchor', min: 90, max: 100 },
];

export type ComponentStatus = 'tracked' | 'pending';

export interface ScoreComponent {
  key: 'training' | 'savings' | 'site' | 'protection' | 'mentorship';
  label: string;
  points: number;
  max: number;
  status: ComponentStatus;
  /** Where the signal will come from once connected. */
  source: string;
  /** In-app route that moves this component. */
  href: string;
}

export interface ScoreInput {
  /** Activity ids marked complete (see trainingActivities). */
  completedActivities: string[];
  /** Total trackable training activities. */
  totalActivities: number;
}

export interface ReadinessScore {
  total: number;
  components: ScoreComponent[];
  band: ScoreBand;
  nextBand: ScoreBand | null;
  pointsToNextBand: number;
  /** Share of components actually measured (1 of 5 today). */
  trackedCount: number;
}

export function bandForScore(score: number): { band: ScoreBand; nextBand: ScoreBand | null } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const index = SCORE_BANDS.findIndex((b) => clamped >= b.min && clamped <= b.max);
  const safeIndex = index === -1 ? 0 : index;
  return {
    band: SCORE_BANDS[safeIndex],
    nextBand: SCORE_BANDS[safeIndex + 1] ?? null,
  };
}

export function computeReadiness(input: ScoreInput): ReadinessScore {
  const validDone = input.completedActivities.filter(
    (v): v is string => typeof v === 'string'
  ).length;
  const total = Math.max(1, input.totalActivities);
  const trainingPoints = Math.round((Math.min(validDone, total) / total) * 30);

  const components: ScoreComponent[] = [
    {
      key: 'training',
      label: 'Training Completion',
      points: trainingPoints,
      max: 30,
      status: 'tracked',
      source: 'Training missions',
      href: '/dashboard/training',
    },
    {
      key: 'savings',
      label: 'Savings Consistency',
      points: 0,
      max: 20,
      status: 'pending',
      source: 'Thrifty Tribe',
      href: '/ventures/thrifty-tribe',
    },
    {
      key: 'site',
      label: 'Site Engagement',
      points: 0,
      max: 20,
      status: 'pending',
      source: 'Prime Digital Solutions',
      href: '/ventures/prime-digital-solutions',
    },
    {
      key: 'protection',
      label: 'Protection Enrollment',
      points: 0,
      max: 15,
      status: 'pending',
      source: 'ICKY',
      href: '/ventures/icky',
    },
    {
      key: 'mentorship',
      label: 'Mentorship Participation',
      points: 0,
      max: 15,
      status: 'pending',
      source: 'Mentor check-ins',
      href: '/dashboard/profile',
    },
  ];

  const totalPoints = components.reduce((sum, c) => sum + c.points, 0);
  const { band, nextBand } = bandForScore(totalPoints);

  return {
    total: totalPoints,
    components,
    band,
    nextBand,
    pointsToNextBand: nextBand ? Math.max(0, nextBand.min - totalPoints) : 0,
    trackedCount: components.filter((c) => c.status === 'tracked').length,
  };
}
