'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Network, Globe, PiggyBank, Users2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ventures as defaultVentures } from '@/lib/ventures-data';

interface DashboardVenture {
  slug: string;
  name: string;
  stage: string;
  gap: string;
  offering: string;
}

function isDashboardVenture(value: unknown): value is DashboardVenture {
  if (!value || typeof value !== 'object') return false;
  const venture = value as Record<string, unknown>;
  return (
    typeof venture.slug === 'string' &&
    typeof venture.name === 'string' &&
    typeof venture.stage === 'string' &&
    typeof venture.gap === 'string' &&
    typeof venture.offering === 'string'
  );
}

const ventureIcons: Record<string, React.ElementType> = {
  'prime-digital-solutions': Globe,
  'thrifty-tribe': PiggyBank,
  'icky': Users2,
  'prime-axis': ShieldCheck,
  'tentmakers-network': Network,
};

const stageColors: Record<string, string> = {
  Active: 'bg-forest/15 text-forest',
  Scaling: 'bg-amber/15 text-amber',
  Early: 'bg-muted text-muted-foreground',
};

export default function VenturesAccessPage() {
  const { user } = useAuth();
  const [ventureList, setVentureList] = useState<DashboardVenture[]>(defaultVentures);
  const [venturesError, setVenturesError] = useState(false);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const fetchVentures = async () => {
      try {
        const { data, error } = await supabase
          .from('ventures')
          .select('*')
          .order('name');
        if (error) {
          setVenturesError(true);
          return;
        }
        setVenturesError(false);
        if (Array.isArray(data)) {
          const sanitized = data.filter(isDashboardVenture);
          if (sanitized.length > 0) {
            setVentureList(sanitized);
          }
        }
      } catch {
        setVenturesError(true);
      }
    };

    fetchVentures();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Ventures
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore the five ventures within the Tentmakers ecosystem.
        </p>
        {venturesError ? (
          <p role="alert" className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-foreground">
            Live venture data is unavailable, so the built-in venture directory is shown.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ventureList.map((venture) => {
          const Icon = ventureIcons[venture.slug] || Network;

          return (
            <Link
              key={venture.slug}
              href={`/ventures/${venture.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground group-hover:text-amber">
                    {venture.name}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${stageColors[venture.stage] || ''}`}>
                    {venture.stage}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-amber">
                  {venture.gap}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {venture.offering}
                </p>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-amber" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
