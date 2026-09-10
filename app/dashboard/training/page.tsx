'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users2, ClipboardList, Lightbulb, CalendarDays, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import TrainingProgress from '@/components/TrainingProgress';
import { useAuth } from '@/components/AuthProvider';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Tier = 'basic' | 'intermediate' | 'advanced';

const tierOrder: Tier[] = ['basic', 'intermediate', 'advanced'];

const activities = [
  { id: 'mentorships', icon: BookOpen, label: 'Mentorships', description: 'One-on-one guidance from experienced operators', tier: 'basic' as Tier },
  { id: 'business-plan-training', icon: ClipboardList, label: 'Business Plan Training', description: 'Structured curriculum for turning ideas into ventures', tier: 'basic' as Tier },
  { id: 'mastermind-groups', icon: Users2, label: 'Mastermind Groups', description: 'Peer advisory circles for accountability and growth', tier: 'intermediate' as Tier },
  { id: 'group-events', icon: Lightbulb, label: 'Group Events', description: 'Workshops, pitch nights, and collaborative sessions', tier: 'intermediate' as Tier },
  { id: 'speaking-engagements', icon: CalendarDays, label: 'Speaking Engagements', description: 'Platform to build authority and public presence', tier: 'advanced' as Tier },
  { id: 'advanced-venture-tracks', icon: TrendingUp, label: 'Advanced Venture Tracks', description: 'Deep-dive programs for operating within the ecosystem', tier: 'advanced' as Tier },
];

function tierComplete(tier: Tier, completed: string[]): boolean {
  const ids = activities.filter((a) => a.tier === tier).map((a) => a.id);
  return ids.length > 0 && ids.every((id) => completed.includes(id));
}

export default function TrainingPage() {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<Tier>('basic');
  const [completed, setCompleted] = useState<string[]>([]);
  const [tierError, setTierError] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('training_tier, completed_activities')
          .eq('id', user.id)
          .single();
        if (error) {
          setTierError(true);
          return;
        }
        setTierError(false);
        if (data?.training_tier === 'intermediate' || data?.training_tier === 'advanced') {
          setCurrentTier(data.training_tier);
        } else {
          setCurrentTier('basic');
        }
        if (Array.isArray(data?.completed_activities)) {
          setCompleted(data.completed_activities.filter((v): v is string => typeof v === 'string'));
        }
      } catch {
        setTierError(true);
      }
    };

    fetchProfile();
  }, [user]);

  const persist = async (nextCompleted: string[], nextTier: Tier) => {
    if (!user || !isSupabaseConfigured) return false;
    const { error } = await supabase.from('profiles').upsert(
      { id: user.id, completed_activities: nextCompleted, training_tier: nextTier },
      { onConflict: 'id' }
    );
    return !error;
  };

  const toggleActivity = async (id: string) => {
    if (!user || saving) return;
    const nextCompleted = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id];
    // Tiers are earned monotonically: completing a tier's activities promotes,
    // unmarking never demotes.
    let nextTier = currentTier;
    const idx = tierOrder.indexOf(currentTier);
    if (idx < tierOrder.length - 1 && tierComplete(currentTier, nextCompleted)) {
      nextTier = tierOrder[idx + 1] as Tier;
    }
    setCompleted(nextCompleted);
    setCurrentTier(nextTier);
    setSaving(id);
    const ok = await persist(nextCompleted, nextTier);
    setSaving(null);
    if (!ok) {
      toast.error('Could not save progress. Please try again.');
      return;
    }
    if (nextTier !== currentTier) {
      toast.success(`Promoted to ${nextTier} tier! New activities unlocked.`);
    }
  };

  const currentIndex = tierOrder.indexOf(currentTier);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Training Progress
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your progression through the Tentmakers training tiers.
        </p>
        {tierError ? (
          <p role="alert" className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-foreground">
            Saved training data is unavailable, so the basic tier is shown.
          </p>
        ) : null}
      </div>

      {/* Progress Tracker */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-foreground">Your Tier</h2>
        <div className="mt-6">
          <TrainingProgress currentTier={currentTier} />
        </div>
      </div>

      {/* Activities */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Available Activities</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Activities unlock as you progress through tiers.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const activityIndex = tierOrder.indexOf(activity.tier);
            const isUnlocked = activityIndex <= currentIndex;
            const isDone = completed.includes(activity.id);
            const isSaving = saving === activity.id;

            return (
              <div
                key={activity.id}
                className={`rounded-2xl border p-5 transition-all ${
                  !isUnlocked
                    ? 'border-border bg-secondary/30 opacity-60'
                    : isDone
                      ? 'border-forest/25 bg-forest/5'
                      : 'border-border bg-card hover:border-amber/30 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isUnlocked ? 'bg-amber/10 text-amber' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{activity.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {activity.tier} tier
                    </p>
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => toggleActivity(activity.id)}
                      disabled={isSaving || !user}
                      aria-label={isDone ? `Mark ${activity.label} incomplete` : `Mark ${activity.label} complete`}
                      aria-pressed={isDone}
                      className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-forest" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {activity.description}
                </p>
                {!isUnlocked && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Complete {tierOrder[activityIndex - 1]} tier to unlock
                  </p>
                )}
                {isUnlocked && !isDone && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Mark complete to progress toward the next tier
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
