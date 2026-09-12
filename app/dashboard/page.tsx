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
import { computeReadiness } from '@/lib/readiness';

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
  const readiness = computeReadiness({
    completedActivities: completed,
    totalActivities: trainingActivities.length,
  });
  const { band, nextBand } = readiness;
  const bandProgress = Math.min(
    100,
    Math.max(0, ((readiness.total - band.min) / Math.max(1, band.max - band.min)) * 100)
  );

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
        {missionsLoading ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center" aria-label="Loading readiness score">
            <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-border/70" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-border/70" />
              <div className="h-4 w-full animate-pulse rounded bg-border/50" />
              <div className="h-2 w-full animate-pulse rounded-full bg-border/50" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ReadinessRing
              score={readiness.total}
              band={`${band.name} band · ${nextBand ? `${nextBand.name} at ${nextBand.min}` : 'Top band reached'}`}
              nextMilestone={upNext[0]?.label ?? nextBand?.name ?? 'Anchor achieved'}
              nextPoints={readiness.pointsToNextBand}
              size={132}
            />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber">
                Readiness Score · {readiness.trackedCount} of {readiness.components.length} signals connected
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {nextBand
                  ? `${readiness.pointsToNextBand} points to the ${nextBand.name} band. Only training is measured so far — savings, site, protection, and mentorship connect as you reach their companies.`
                  : 'Top band reached — Anchor mentor track is open.'}
              </p>
              <div
                className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuenow={readiness.total}
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
        )}
      </div>

      {/* Score breakdown */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Score breakdown
        </h2>
        <div className="mt-4 space-y-3">
          {readiness.components.map((component) => (
            <Link
              key={component.key}
              href={component.href}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-amber/30 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-foreground">{component.label}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      component.status === 'tracked'
                        ? 'bg-forest/10 text-forest'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {component.status === 'tracked' ? 'Live' : 'Soon'}
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={component.points}
                  aria-valuemin={0}
                  aria-valuemax={component.max}
                  aria-label={`${component.label}: ${component.points} of ${component.max} points`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${component.status === 'tracked' ? 'bg-amber' : 'bg-border'}`}
                    style={{ width: `${(component.points / component.max) * 100}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {component.status === 'tracked'
                    ? `${component.points} of ${component.max} points from training missions.`
                    : `Not measured yet — connects via ${component.source}.`}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                {component.points}
                <span className="font-medium text-muted-foreground">/{component.max}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-amber" aria-hidden="true" />
            </Link>
          ))}
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
            const done = isAnchor ? readiness.total >= 90 : nodeIndex < tierIndex;
            const current =
              (!isAnchor && nodeIndex === tierIndex) ||
              (isAnchor && tierIndex === tierOrder.length - 1 && readiness.total < 90);
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
