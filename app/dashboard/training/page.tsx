'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users2, ClipboardList, Lightbulb, CalendarDays, TrendingUp } from 'lucide-react';
import TrainingProgress from '@/components/TrainingProgress';
import { useAuth } from '@/components/AuthProvider';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const activities = [
  { icon: BookOpen, label: 'Mentorships', description: 'One-on-one guidance from experienced operators', tier: 'basic' },
  { icon: ClipboardList, label: 'Business Plan Training', description: 'Structured curriculum for turning ideas into ventures', tier: 'basic' },
  { icon: Users2, label: 'Mastermind Groups', description: 'Peer advisory circles for accountability and growth', tier: 'intermediate' },
  { icon: Lightbulb, label: 'Group Events', description: 'Workshops, pitch nights, and collaborative sessions', tier: 'intermediate' },
  { icon: CalendarDays, label: 'Speaking Engagements', description: 'Platform to build authority and public presence', tier: 'advanced' },
  { icon: TrendingUp, label: 'Advanced Venture Tracks', description: 'Deep-dive programs for operating within the ecosystem', tier: 'advanced' },
];

export default function TrainingPage() {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [tierError, setTierError] = useState(false);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('training_tier')
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
      } catch {
        setTierError(true);
      }
    };

    fetchProfile();
  }, [user]);

  const tierOrder = ['basic', 'intermediate', 'advanced'];
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

            return (
              <div
                key={activity.label}
                className={`rounded-2xl border p-5 transition-all ${
                  isUnlocked
                    ? 'border-border bg-card hover:border-amber/30 hover:shadow-lg'
                    : 'border-border bg-secondary/30 opacity-60'
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
                  <div>
                    <p className="text-sm font-bold text-foreground">{activity.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {activity.tier} tier
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {activity.description}
                </p>
                {!isUnlocked && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Complete {tierOrder[activityIndex - 1]} tier to unlock
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
