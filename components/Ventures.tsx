'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  Store,
  QrCode,
  CarFront,
  Network,
  ArrowRight,
  Globe,
  Smartphone,
  Settings,
  ShoppingCart,
  Wallet,
  PiggyBank,
  Gift,
  Shield,
  GraduationCap,
  Bell,
  Users,
  Briefcase,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'Active' | 'Scaling' | 'Early';

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
  industries: { icon: React.ElementType; label: string }[];
}

const ventures: Venture[] = [
  {
    id: 'prime-digital-solutions',
    name: 'Prime Digital Solutions',
    tagline: 'Websites, apps, and automation for MSMEs',
    gap: 'The Storefront Gap',
    offering:
      'Website and app development plus business automation — the technology backbone discounting dev services for member founders.',
    marketSignal:
      '90.8% of establishments own computers, yet real digital-tool adoption lags far behind.',
    metric: '57,469',
    metricLabel: 'MSMEs in Western Visayas',
    stage: 'Active',
    icon: Store,
    span: 'wide',
    industries: [
      { icon: Globe, label: 'Web' },
      { icon: Smartphone, label: 'App' },
      { icon: Settings, label: 'Automation' },
      { icon: ShoppingCart, label: 'E-commerce' },
    ],
  },
  {
    id: 'thrifty-tribe',
    name: 'Thrifty Tribe',
    tagline: 'Structured savings, QR deals, and cashback',
    gap: 'The Savings Gap',
    offering:
      'A smart savings membership — structured savings, QR-code deals, and cashback at partner merchants, built into Tentmakers membership from day one.',
    marketSignal:
      '57.4% of retail volume is digital — QR spending members already understand.',
    metric: 'Members-only',
    metricLabel: 'QR deals & cashback',
    stage: 'Early',
    icon: QrCode,
    span: 'normal',
    industries: [
      { icon: Wallet, label: 'Payments' },
      { icon: PiggyBank, label: 'Savings' },
      { icon: Gift, label: 'Cashback' },
    ],
  },
  {
    id: 'prime-axis',
    name: 'Prime Axis',
    tagline: 'SMEs scaling their headcount',
    gap: 'The Staffing Gap',
    offering:
      'A general and specialized labor marketplace — staffing for Tentmakers events today, and a hiring resource for members’ growing businesses.',
    marketSignal:
      '41% of SMEs grew headcount in 2024; 57% planned further hiring in 2025.',
    metric: '41%',
    metricLabel: 'of SMEs grew headcount in 2024',
    stage: 'Early',
    icon: Briefcase,
    span: 'normal',
    industries: [
      { icon: Users, label: 'Staffing' },
      { icon: Briefcase, label: 'Labor' },
    ],
  },
  {
    id: 'icky',
    name: 'ICKY',
    tagline: 'Drivers and families needing protection',
    gap: 'The Protection Gap',
    offering:
      'Insurance literacy, road-safety education, 3D driving simulation, and 24/7 SOS — with discounted plans for members and riders.',
    marketSignal:
      'Insurance penetration only ~1.79% in 2025, below the 2% national target.',
    metric: '~1.79%',
    metricLabel: 'insurance penetration (2025)',
    stage: 'Early',
    icon: CarFront,
    span: 'normal',
    industries: [
      { icon: Shield, label: 'Insurance' },
      { icon: CarFront, label: 'Road Safety' },
      { icon: GraduationCap, label: 'Education' },
      { icon: Bell, label: '24/7 SOS' },
    ],
  },
  {
    id: 'tentmakers-network',
    name: 'Tentmakers Network',
    tagline: 'Readiness Score, three tiers, real company access',
    gap: 'The Trust Gap',
    offering:
      'A member network with a Readiness Score gating three training tiers — Tier 1 Foundation, Tier 2 Building, Tier 3 Established — plus an Anchor band for mentor-track candidates.',
    marketSignal:
      '300-member target: Iloilo HQ 150, Capiz 60, Aklan 50, Antique 40.',
    metric: '300',
    metricLabel: 'member target, Q4 2026',
    stage: 'Early',
    icon: Network,
    span: 'wide',
    anchor: true,
    industries: [
      { icon: Users, label: 'Community' },
      { icon: Rocket, label: 'Training' },
      { icon: GraduationCap, label: 'Mentorship' },
    ],
  },
];

const stageStyles: Record<Stage, string> = {
  Active: 'bg-forest/10 text-forest border-forest/20',
  Scaling: 'bg-amber/10 text-amber border-amber/20',
  Early: 'bg-muted text-muted-foreground border-border',
};

export default function Ventures() {
  const prefersReducedMotion = useReducedMotion();

  const onSpotlight = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  // One half of the seamless loop. The duplicate half renders aria-hidden
  // with untabbable links so each company is met once by AT and keyboard.
  const renderCards = (interactive: boolean) => (
    <>
      {ventures.map((venture) => {
        const Icon = venture.icon;
        const isAnchor = venture.anchor;
        return (
          <Link
            key={`${venture.id}-${interactive ? 'a' : 'b'}`}
            href={`/ventures/${venture.id}`}
            onMouseMove={onSpotlight}
            tabIndex={interactive ? undefined : -1}
            className={cn(
              'spotlight-card group relative mr-5 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-[20px] border p-6 transition-colors duration-300 hover:border-amber/40 sm:w-[360px]',
              isAnchor
                ? 'border-navy/10 bg-navy text-white'
                : 'border-border bg-card'
            )}
          >
            {isAnchor && (
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber/12 blur-3xl"
                aria-hidden="true"
              />
            )}
            <div className="relative z-10 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  'ml-auto inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                  isAnchor
                    ? 'border-white/15 bg-white/[0.06] text-white/70'
                    : stageStyles[venture.stage]
                )}
              >
                {venture.stage}
              </span>
            </div>
            <p className="relative z-10 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-amber">
              {venture.gap}
            </p>
            <h3
              className={cn(
                'relative z-10 mt-2 text-lg font-bold tracking-tight transition-colors group-hover:text-amber',
                isAnchor ? 'text-white' : 'text-foreground'
              )}
            >
              {venture.name}
            </h3>
            <p
              className={cn(
                'relative z-10 mt-1 text-[13px] font-medium leading-relaxed',
                isAnchor ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              {venture.tagline} ·{' '}
              <span className="font-bold tabular-nums text-amber">{venture.metric}</span>{' '}
              <span className="font-normal">{venture.metricLabel}</span>
            </p>
            <span
              className={cn(
                'relative z-10 mt-5 inline-flex items-center gap-1.5 border-t pt-4 text-[13px] font-semibold',
                isAnchor ? 'border-white/10 text-white/70' : 'border-border text-muted-foreground'
              )}
            >
              View company
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-amber"
                aria-hidden="true"
              />
            </span>
          </Link>
        );
      })}
    </>
  );

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
            <span className="section-eyebrow">
              Our Portfolio
            </span>
          </div>
          <h2
            id="ventures-heading"
            className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            Five portfolio companies,{' '}
            <span className="text-amber">five ways to make an impact</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Each company is built to close a specific gap in the regional market.
            As a member, you&apos;ll gain access to these companies and the skills
            to operate within them.
          </p>
          <Link
            href="/ventures"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber transition-colors hover:text-foreground"
          >
            View all companies
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* Company marquee — full-bleed seamless loop */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12"
      >
        <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track flex w-max py-2">
            {renderCards(true)}
            <div className="contents" aria-hidden="true">
              {renderCards(false)}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
