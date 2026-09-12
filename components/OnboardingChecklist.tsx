'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  hint: string;
  href: string;
}

const STEPS: Step[] = [
  { id: 'profile', label: 'Complete your profile', hint: 'Add your name and contact details', href: '/dashboard/profile' },
  { id: 'training', label: 'Start Tier 1 training', hint: 'Foundations + community access', href: '/dashboard/training' },
  { id: 'venture', label: 'Explore one venture', hint: 'Pick where you want to operate', href: '/dashboard/ventures' },
];

const KEY = 'tm-onboarding';

export default function OnboardingChecklist({ profileComplete }: { profileComplete: boolean }) {
  // Read persisted state lazily instead of syncing it in an effect:
  // SSR-safe (localStorage only exists in the browser) and avoids a
  // cascading render. profileComplete is still honored at render time
  // (see `completed` below), so a late profile load is reflected.
  const [done, setDone] = useState<string[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as string[];
    } catch { /* ignore corrupt storage */ }
    return [];
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
    } catch { /* ignore */ }
  }, [done]);

  if (dismissed) return null;
  const completed = STEPS.filter((s) => done.includes(s.id) || (s.id === 'profile' && profileComplete)).length;
  if (completed >= STEPS.length) return null;
  const pct = Math.round((completed / STEPS.length) * 100);

  const toggle = (id: string) =>
    setDone((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-amber/25 bg-gradient-to-br from-amber/[0.08] to-transparent p-6 sm:p-7">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss onboarding checklist"
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">Getting started</p>
          <h2 className="mt-1 font-display text-xl font-bold text-foreground">
            Your first 3 steps as a member
          </h2>
        </div>
        <span className="text-sm font-bold tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {STEPS.map((s) => {
          const isDone = done.includes(s.id) || (s.id === 'profile' && profileComplete);
          return (
            <li key={s.id}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-3.5 transition-colors',
                  isDone ? 'border-forest/25 bg-forest/5' : 'border-border bg-card hover:border-amber/30'
                )}
              >
                <button onClick={() => toggle(s.id)} aria-label={isDone ? `Mark ${s.label} incomplete` : `Mark ${s.label} complete`}>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-forest" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={cn('text-sm font-semibold', isDone ? 'text-muted-foreground line-through' : 'text-foreground')}>
                    {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.hint}</p>
                </div>
                <Link
                  href={s.href}
                  className="flex items-center gap-1 text-xs font-semibold text-amber hover:underline"
                >
                  Go <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
