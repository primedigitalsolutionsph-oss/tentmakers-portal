'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  Store,
  QrCode,
  CarFront,
  HardHat,
  Network,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'Active' | 'Scaling' | 'Early';
type Filter = 'All' | Stage;

interface Venture {
  id: string;
  name: string;
  tagline: string;
  gap: string;
  offering: string;
  marketSignal: string;
  metric: string;
  metricLabel: string;
  stage: Stage;
  icon: React.ElementType;
  span: 'wide' | 'normal';
  anchor?: boolean;
}

const ventures: Venture[] = [
  {
    id: 'prime-digital-solutions',
    name: 'Prime Digital Solutions',
    tagline: 'Websites, apps, and automation for MSMEs',
    gap: 'The storefront gap',
    offering:
      'Website and app development plus business automation — the technology backbone discounting dev services for member founders.',
    marketSignal:
      '90.8% of establishments own computers, yet real digital-tool adoption lags far behind.',
    metric: '57,469',
    metricLabel: 'MSMEs in Western Visayas',
    stage: 'Active',
    icon: Store,
    span: 'wide',
  },
  {
    id: 'thrifty-tribe',
    name: 'Thrifty Tribe',
    tagline: 'QR deals and cashback for members',
    gap: 'The discount gap',
    offering:
      'A smart savings membership — QR-code deals and cashback at partner merchants, and a day-one member perk.',
    marketSignal:
      '57.4% of retail volume is digital — QR spending members already understand.',
    metric: 'Members-only',
    metricLabel: 'QR deals & cashback',
    stage: 'Early',
    icon: QrCode,
    span: 'normal',
  },
  {
    id: 'icky',
    name: 'ICKY',
    tagline: 'Road safety, literacy, and 24/7 SOS',
    gap: 'The protection gap',
    offering:
      'Insurance literacy, road-safety education, 3D driving simulation, and 24/7 SOS — with discounted plans for members and riders.',
    marketSignal:
      '31,000+ accidents in 2024, 2,747 deaths — 87% from reckless driving.',
    metric: '~1.79%',
    metricLabel: 'insurance penetration (2025)',
    stage: 'Early',
    icon: CarFront,
    span: 'normal',
  },
  {
    id: 'prime-axis',
    name: 'Prime Axis',
    tagline: 'Skilled and general labor marketplace',
    gap: 'The staffing gap',
    offering:
      'A labor marketplace staffing Tentmakers events today — and growing into the hiring resource for members’ businesses.',
    marketSignal:
      '41% of SMEs grew headcount in 2024; 57% planned further hiring in 2025.',
    metric: '41%',
    metricLabel: 'of SMEs grew headcount in 2024',
    stage: 'Early',
    icon: HardHat,
    span: 'normal',
  },
  {
    id: 'tentmakers-network',
    name: 'Tentmakers Network',
    tagline: 'Founder Circles, accelerator, Demo Day',
    gap: 'The trust gap',
    offering:
      'A pre-launch founder community targeting 300 members by Q4 2026 — open membership plus selective 12-week accelerator cohorts.',
    marketSignal:
      '4 chapters: Iloilo HQ 150, Capiz 60, Aklan 50, Antique 40.',
    metric: '300',
    metricLabel: 'member target, Q4 2026',
    stage: 'Early',
    icon: Network,
    span: 'wide',
    anchor: true,
  },
];

const stageStyles: Record<Stage, string> = {
  Active: 'bg-forest/10 text-forest border-forest/20',
  Scaling: 'bg-amber/10 text-amber border-amber/20',
  Early: 'bg-muted text-muted-foreground border-border',
};

export default function Ventures() {
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');
  const filtered = filter === 'All' ? ventures : ventures.filter((v) => v.stage === filter);

  const onSpotlight = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="ventures"
      className="relative w-full bg-background py-24 sm:py-32"
      aria-labelledby="ventures-heading"
    >
      <div
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              The Five Ventures
            </span>
          </div>
          <h2
            id="ventures-heading"
            className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            Five ventures,{' '}
            <span className="text-amber">five ways to make an impact</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Each venture is built to close a specific gap in the regional market.
            As a member, you&apos;ll gain access to these ventures and the skills
            to operate within them.
          </p>
          {/* Filter */}
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter ventures by stage">
            {(['All', 'Active', 'Early'] as Filter[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                  filter === f
                    ? 'border-amber bg-amber text-navy'
                    : 'border-border text-muted-foreground hover:border-amber/40 hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Venture cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-2 lg:gap-6">
          {filtered.map((venture, index) => {
            const Icon = venture.icon;
            const isAnchor = venture.anchor;
            const spanClass = venture.span === 'wide' ? 'lg:col-span-2' : '';

            return (
              <motion.div
                key={venture.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 28 }
                }
                whileInView={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={spanClass}
              >
                <Link
                  href={`/ventures/${venture.id}`}
                  onMouseMove={onSpotlight}
                  className={cn(
                    'spotlight-card group relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8',
                    isAnchor
                      ? 'border-navy/10 bg-navy text-white hover:border-amber/40 hover:shadow-navy/10'
                      : 'border-border bg-card hover:border-amber/40 hover:shadow-navy/[0.04]'
                  )}
                >
                  {/* Anchor card decorative */}
                  {isAnchor && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        aria-hidden="true"
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                          backgroundSize: '52px 52px',
                        }}
                      />
                      <div
                        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber/12 blur-3xl"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  {/* Illustrative industry watermark */}
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rotate-[-8deg] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110',
                      isAnchor ? 'text-white/[0.05]' : 'text-foreground/[0.05]'
                    )}
                  />

                  <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
                    {/* Icon + gap label */}
                    <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
                      <span
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                          isAnchor
                            ? 'bg-amber/15 text-amber'
                            : 'bg-amber/10 text-amber'
                        )}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                          isAnchor
                            ? 'border-white/15 bg-white/[0.06] text-white/70'
                            : stageStyles[venture.stage]
                        )}
                      >
                        {venture.stage}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">
                          {venture.gap}
                        </span>
                        <ArrowUpRight
                          className={cn(
                            'h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                            isAnchor ? 'text-white/40 group-hover:text-amber' : 'text-muted-foreground/40 group-hover:text-amber'
                          )}
                          aria-hidden="true"
                        />
                      </div>

                      <h3
                        className={cn(
                          'mt-2 text-xl font-bold tracking-tight transition-colors sm:text-2xl',
                          isAnchor ? 'text-white group-hover:text-amber' : 'text-foreground group-hover:text-amber'
                        )}
                      >
                        {venture.name}
                      </h3>
                      <p
                        className={cn(
                          'mt-1 text-sm font-medium',
                          isAnchor ? 'text-white/70' : 'text-muted-foreground'
                        )}
                      >
                        {venture.tagline} · <span className="font-bold tabular-nums text-amber">{venture.metric}</span>{' '}
                        <span className="font-normal">{venture.metricLabel}</span>
                      </p>

                      <p
                        className={cn(
                          'mt-4 text-sm leading-relaxed',
                          isAnchor ? 'text-white/65' : 'text-muted-foreground'
                        )}
                      >
                        {venture.offering}
                      </p>

                      {/* Market signal */}
                      <div
                        className={cn(
                          'mt-5 flex items-start gap-2.5 rounded-lg p-3.5',
                          isAnchor ? 'bg-white/[0.04]' : 'bg-secondary/60'
                        )}
                      >
                        <span className="mt-0.5 text-xs font-bold uppercase tracking-wide text-amber">
                          Why now
                        </span>
                        <span
                          className={cn(
                            'text-xs leading-relaxed',
                            isAnchor ? 'text-white/55' : 'text-muted-foreground'
                          )}
                        >
                          {venture.marketSignal}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
