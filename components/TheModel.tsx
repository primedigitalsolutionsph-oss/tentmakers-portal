'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Globe,
  PiggyBank,
  ShieldCheck,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberBenefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

const memberBenefits: MemberBenefit[] = [
  {
    icon: Globe,
    title: 'A website',
    description: 'Digital presence from day one — no build cost, no waiting.',
  },
  {
    icon: PiggyBank,
    title: 'Savings tools',
    description: 'Structured savings through Thrifty Tribe, built into membership.',
  },
  {
    icon: ShieldCheck,
    title: 'Driver protection',
    description: 'Insurance coverage through Prime Axis, not an afterthought.',
  },
  {
    icon: Briefcase,
    title: 'Staffing access',
    description: 'Direct pipeline to ICKY for hiring, without the sourcing cost.',
  },
];

interface VentureGain {
  venture: string;
  channel: string;
}

const ventureGains: VentureGain[] = [
  {
    venture: 'Prime Digital Solutions',
    channel: 'Founders needing digital storefronts',
  },
  {
    venture: 'Thrifty Tribe',
    channel: 'Savers building financial habits',
  },
  {
    venture: 'ICKY',
    channel: 'SMEs scaling their headcount',
  },
  {
    venture: 'Prime Axis',
    channel: 'Drivers and families needing protection',
  },
  {
    venture: 'Tentmakers Network',
    channel: 'The connective tissue across all of the above',
  },
];

export default function TheModel() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="the-model"
      className="relative w-full bg-background py-24 sm:py-32"
      aria-labelledby="the-model-heading"
    >
      {/* Top divider */}
      <div
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Section header */}
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
              The Model
            </span>
          </div>
          <h2
            id="the-model-heading"
            className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            Members get value from day one.{' '}
            <span className="text-amber">Ventures get a warm channel</span> into
            exactly who they serve.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            It is a two-sided flywheel. Registered members receive a website,
            savings, driver protection, and staffing access from the start. Each
            affiliated venture, in turn, gains a high-trust channel into exactly
            the founders, students, and SMEs it is built to serve.
          </p>
        </motion.div>

        {/* Two-column flywheel */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {/* Members side */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -28 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-[28px] border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-navy/[0.04] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                What members receive
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              From day one — not after months of onboarding.
            </p>

            <div className="mt-6 space-y-3">
              {memberBenefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 16 }
                    }
                    whileInView={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: prefersReducedMotion ? 0 : 0.15 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-4 rounded-xl bg-secondary/60 p-4 transition-colors duration-200 hover:bg-secondary"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {benefit.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Ventures side */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-[28px] border border-navy/10 bg-navy p-7 text-white transition-shadow duration-300 hover:shadow-xl hover:shadow-black/10 sm:p-8"
          >
            {/* Subtle grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">
                What each venture gains
              </h3>
            </div>
            <p className="relative z-10 mt-3 text-sm leading-relaxed text-white/70">
              A warm, high-trust channel — not a cold lead.
            </p>

            <div className="relative z-10 mt-6 space-y-2.5">
              {ventureGains.map((gain, i) => (
                <motion.div
                  key={gain.venture}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 16 }
                  }
                  whileInView={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : 0.25 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all duration-200 hover:border-amber/30 hover:bg-white/[0.05]"
                >
                  <div>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        i === 4 ? 'text-amber' : 'text-white'
                      )}
                    >
                      {gain.venture}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                      {gain.channel}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Franchise pipeline callout */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 overflow-hidden rounded-2xl border border-amber/20 bg-amber/[0.04] p-7 sm:mt-8 sm:p-10"
        >
          <div
            className="absolute left-0 top-0 h-full w-1 bg-amber"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-amber">
                The long game
              </span>
            </div>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-foreground sm:text-lg">
              Over time, our strongest members become the future franchise and
              regional-operator candidates for these ventures in their own
              chapters —{' '}
              <span className="text-muted-foreground">
                turning the accelerator into a talent pipeline for regional
                expansion, not just a training program.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
