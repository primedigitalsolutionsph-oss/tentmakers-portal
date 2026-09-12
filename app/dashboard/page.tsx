'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  GraduationCap,
  Briefcase,
  User,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import ReadinessRing from '@/components/ReadinessRing';
import {
  trainingActivities,
  tierOrder,
  TIER_DISPLAY,
  type Tier,
} from '@/app/dashboard/training/page';

// Score bands from the program design (see app/about/page.tsx). The score
// itself is a placeholder until GET /api/profile serves it.
const BANDS = [
  { name: 'Foundation', min: 0, max: 39 },
  { name: 'Building', min: 40, max: 69 },
  { name: 'Established', min: 70, max: 89 },
  { name: 'Anchor', min: 90, max: 100 },
];

const TRACK: { key: Tier | 'anchor'; tier: string; name: string; goal: string }[] = [
  { key: 'basic', tier: 'Tier 1', name: 'Foundation', goal: 'Online presence live, savings habit started.' },
  { key: 'intermediate', tier: 'Tier 2', name: 'Building', goal: 'Protection enrolled, consistency proven.' },
  { key: 'advanced', tier: 'Tier 3', name: 'Established', goal: 'Ready to hire and operate with less hand-holding.' },
  { key: 'anchor', tier: 'Anchor', name: 'Mentor track', goal: 'Sustained excellence — eligible to mentor others.' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [tier, setTier] = useState<Tier>('basic');
  const [completed, setCompleted] = useState<string[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [missionsError, setMissionsError] = useState(false);

  const readinessScore = 62;

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        if (data?.training_tier === 'intermediate' || data?.training_tier === 'advanced') {
          setTier(data.training_tier);
        } else {
          setTier('basic');
        }
        if (Array.isArray(data?.completed_activities)) {
          setCompleted(data.completed_activities.filter((v: unknown): v is string => typeof v === 'string'));
        }
      } catch {
        setMissionsError(true);
      } finally {
        setMissionsLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const fullName = user.name || 'Member';
  const bandIndex = BANDS.findIndex((b) => readinessScore >= b.min && readinessScore <= b.max);
  const band = BANDS[bandIndex] ?? BANDS[0];
  const nextBand = BANDS[bandIndex + 1] ?? null;
  const bandProgress = Math.min(
    100,
    Math.max(0, ((readinessScore - band.min) / Math.max(1, band.max - band.min)) * 100)
  );
  const pointsToNext = nextBand ? nextBand.min - readinessScore : 0;

  const tierIndex = tierOrder.indexOf(tier);
  const upNext = trainingActivities
    .filter((a) => tierOrder.indexOf(a.tier) <= tierIndex && !completed.includes(a.id))
    .slice(0, 3);
  const doneCount = trainingActivities.filter((a) => completed.includes(a.id)).length;

  return (
    <div className="space-y-8">
      <OnboardingChecklist profileComplete={Boolean(user.name)} />

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your operator journey, {fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {TIER_DISPLAY[tier]} · {band.name} band — here&apos;s what&apos;s next.
        </p>
      </div>

      {/* Score hero */}
      <div className="relative overflow-hidden rounded-[20px] border border-amber/30 bg-amber/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ReadinessRing
            score={readinessScore}
            band={`${band.name} band · ${nextBand ? `${nextBand.name} at ${nextBand.min}` : 'Top band reached'}`}
            nextMilestone="Protection Enrollment"
            nextPoints={Math.max(0, pointsToNext)}
            size={132}
          />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber">
              Readiness Score
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {nextBand
                ? `${pointsToNext} points to the ${nextBand.name} band. Protection Enrollment is your highest-leverage mission.`
                : 'Top band reached — Anchor mentor track is open.'}
            </p>
            <div
              className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={readinessScore}
              aria-valuemin={band.min}
              aria-valuemax={band.max}
              aria-label={`Progress through the ${band.name} band`}
            >
              <div
                className="h-full rounded-full bg-amber transition-all duration-500"
                style={{ width: `${bandProgress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{band.name} · {band.min}</span>
              <span>{nextBand ? `${nextBand.name} · ${nextBand.min}` : `${band.max} · max`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier track */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Your path
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {TRACK.map((node, i) => {
            const isAnchor = node.key === 'anchor';
            const nodeIndex = isAnchor ? tierOrder.length : tierOrder.indexOf(node.key as Tier);
            const done = isAnchor ? readinessScore >= 90 : nodeIndex < tierIndex;
            const current =
              (!isAnchor && nodeIndex === tierIndex) ||
              (isAnchor && tierIndex === tierOrder.length - 1 && readinessScore < 90);
            return (
              <li
                key={node.key}
                aria-current={current ? 'step' : undefined}
                className={`rounded-2xl border p-4 transition-colors ${
                  current
                    ? 'border-amber/50 bg-amber/[0.06]'
                    : done
                      ? 'border-forest/25 bg-forest/[0.04]'
                      : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? 'bg-forest text-white'
                        : current
                          ? 'bg-amber text-navy'
                          : 'bg-muted text-muted-foreground'
                    }`}
                    aria-hidden="true"
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : !current && !done ? <Lock className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {node.tier}
                  </p>
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">{node.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{node.goal}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Up next missions */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Up next
          </h2>
          <p className="text-xs font-medium tabular-nums text-muted-foreground">
            {doneCount} of {trainingActivities.length} missions complete
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {missionsLoading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-card" />
            ))
          ) : missionsError ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">
                Couldn&apos;t load your missions. Continue on the training page instead.
              </p>
              <Link
                href="/dashboard/training"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:text-foreground"
              >
                Open training <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : upNext.length === 0 ? (
            <div className="rounded-2xl border border-forest/25 bg-forest/[0.04] p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-forest" aria-hidden="true" />
                All missions complete
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hold your score above 90 to enter the Anchor mentor track — or explore the portfolio.
              </p>
            </div>
          ) : (
            upNext.map((mission) => {
              const Icon = mission.icon;
              return (
                <Link
                  key={mission.id}
                  href="/dashboard/training"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-amber/30 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {mission.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {mission.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-amber" aria-hidden="true" />
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { href: '/dashboard/training', icon: GraduationCap, label: 'Training', hint: 'Tiers & missions' },
          { href: '/dashboard/ventures', icon: Briefcase, label: 'Portfolio', hint: 'The 5 companies' },
          { href: '/dashboard/profile', icon: User, label: 'Profile', hint: 'Details & mentor' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:border-amber/30 hover:shadow-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <link.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold text-foreground">{link.label}</span>
              <span className="block text-xs text-muted-foreground">{link.hint}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
