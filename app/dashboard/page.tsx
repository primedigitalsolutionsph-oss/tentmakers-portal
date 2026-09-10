'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  User,
  ArrowRight,
  Network,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name?: string;
    role?: string;
    training_tier?: string;
  } | null>(null);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) {
          setProfileError(true);
          return;
        }
        setProfileError(false);
        if (data) setProfile(data);
      } catch {
        setProfileError(true);
      }
    };

    fetchProfile();
  }, [user]);

  const fullName =
    profile?.full_name || user?.user_metadata?.full_name || 'Member';
  const role = profile?.role || user?.user_metadata?.role || 'member';
  const tier =
    profile?.training_tier === 'intermediate' ||
    profile?.training_tier === 'advanced'
      ? profile.training_tier
      : 'basic';

  return (
    <div className="space-y-8">
      <OnboardingChecklist profileComplete={Boolean(profile?.full_name || user?.user_metadata?.full_name)} />
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your overview of the Tentmakers Network.
        </p>
        {profileError ? (
          <p role="alert" className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-foreground">
            Profile data is unavailable, so this overview is using your sign-in record.
          </p>
        ) : null}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Role
              </p>
              <p className="text-sm font-bold capitalize text-foreground">
                {role}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Training Tier
              </p>
              <p className="text-sm font-bold capitalize text-foreground">
                {tier}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ventures
              </p>
              <p className="text-sm font-bold text-foreground">5 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Quick Actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/training"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  Training Progress
                </p>
                <p className="text-sm text-muted-foreground">
                  View your tier and activities
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard/ventures"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                <Network className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  Explore Ventures
                </p>
                <p className="text-sm text-muted-foreground">
                  Access the five ventures
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Ecosystem overview */}
      <div className="rounded-2xl border border-navy/10 bg-navy p-6 text-white sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-amber">
            <Network className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Your Ecosystem</p>
            <p className="text-xs text-white/50">
              5 ventures, 1 training hub, 4.67M people on Panay Island
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            'Prime Digital Solutions',
            'Thrifty Tribe',
            'ICKY',
            'Prime Axis',
            'Tentmakers Network',
          ].map((v) => (
            <div
              key={v}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-xs font-medium text-white/70"
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
