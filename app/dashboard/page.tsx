'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  User,
  ArrowRight,
  Network,
  Gauge,
  BookOpen,
  Calendar,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { useAuth, getUserMetadata } from '@/components/AuthProvider';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Band = 'Foundation' | 'Building' | 'Established' | 'Anchor' | null;

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name?: string;
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
    profile?.full_name || getUserMetadata(user)?.full_name || 'Member';
  const tier =
    profile?.training_tier === 'intermediate' ||
    profile?.training_tier === 'advanced'
      ? profile.training_tier
      : 'basic';

  const readinessScore = 62;
  const band: Band = readinessScore >= 90 ? 'Anchor' : readinessScore >= 70 ? 'Established' : readinessScore >= 40 ? 'Building' : 'Foundation';

  return (
    <div className="space-y-8">
      <OnboardingChecklist profileComplete={Boolean(profile?.full_name || getUserMetadata(user)?.full_name)} />
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {band ? `You&apos;re in the ${band} band — here&apos;s what&apos;s next.` : "Here's your overview of the Tentmakers Network."}
        </p>
        {profileError ? (
          <p role="alert" className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-foreground">
            Profile data is unavailable, so this overview is using your sign-in record.
          </p>
        ) : null}
      </div>

      {/* Readiness Score + Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber/30 bg-amber/[0.04] p-6 sm:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Readiness Score
              </p>
              <p className="text-sm font-bold text-foreground">
                {readinessScore} / 100
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{band} band</span> · Tier 2 eligible
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Next milestone: Complete Protection Enrollment (+8 pts)
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Training
              </p>
              <p className="text-sm font-bold capitalize text-foreground">
                {tier}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
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
                  Training
                </p>
                <p className="text-sm text-muted-foreground">
                  Tier modules and assessments
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
                  Ventures
                </p>
                <p className="text-sm text-muted-foreground">
                  Explore the five ventures
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard/mentorship"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <MessageSquare className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  Mentorship
                </p>
                <p className="text-sm text-muted-foreground">
                  Your mentor and sessions
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard/events"
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  Events
                </p>
                <p className="text-sm text-muted-foreground">
                  Upcoming and past events
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Site + Mentorship + Events panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Business Foundation Site</p>
              <p className="text-xs text-muted-foreground">Last updated 14 days ago — sites updated monthly earn Site Engagement points.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/site" className="rounded-lg bg-amber px-3 py-1.5 text-xs font-bold text-navy">Edit My Site</Link>
            <Link href="/dashboard/site" className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">View Live Site</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Your mentor</p>
              <p className="text-xs text-muted-foreground">Next session: [Date]</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/mentorship" className="rounded-lg bg-amber px-3 py-1.5 text-xs font-bold text-navy">Book a Session</Link>
            <Link href="/dashboard/mentorship" className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">Message Mentor</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Upcoming</p>
              <p className="text-xs text-muted-foreground">Tier 2 Completion Workshop — Roxas City</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/events" className="rounded-lg bg-amber px-3 py-1.5 text-xs font-bold text-navy">RSVP</Link>
          </div>
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
