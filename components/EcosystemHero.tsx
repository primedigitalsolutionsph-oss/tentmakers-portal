'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/use-count-up';
import { useRegisterModal } from '@/hooks/use-register-modal';
import ReadinessRing from '@/components/ReadinessRing';

const ventures = [
  { name: 'Prime Digital Solutions', slug: 'prime-digital-solutions' },
  { name: 'Thrifty Tribe', slug: 'thrifty-tribe' },
  { name: 'ICKY', slug: 'icky' },
  { name: 'Prime Axis', slug: 'prime-axis' },
  { name: 'Tentmakers Network', slug: 'tentmakers-network' },
];

const trustPoints = ['No fees to start', '3-tier training', 'Readiness Score from day one'];

function Stat({ end, decimals = 0, suffix = '', label, format = false }: { end: number; decimals?: number; suffix?: string; label: string; format?: boolean }) {
  const { ref, displayValue } = useCountUp({ end, decimals, duration: 1800 });
  const formatted = format
    ? Number(displayValue).toLocaleString('en-US')
    : displayValue;
  return (
    <div>
      <p className="font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
        <span ref={ref}>{formatted}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/60">{label}</p>
    </div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EcosystemHero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { onOpen } = useRegisterModal();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Delays are applied per-motion via `transition.delay`; the helper only
  // centralizes the reduced-motion-aware initial state.
  const anim = () =>
    prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 0, y: 24 };

  return (
    <section
      ref={sectionRef}
      className="noise-overlay relative w-full min-h-[100vh] overflow-hidden bg-navy text-white"
    >
      {/* Parallax decorative grid */}
      <motion.div
        style={prefersReducedMotion ? {} : { y }}
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </motion.div>

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber/10 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 h-[400px] w-[400px] rounded-full bg-forest/10 blur-[130px]"
        aria-hidden="true"
      />

      <motion.div
        style={prefersReducedMotion ? {} : { opacity }}
        className="relative z-10 mx-auto grid min-h-[100vh] w-full max-w-6xl content-center gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8"
      >
        <div>
          {/* Badge */}
          <motion.div
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [...EASE] }}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15">
              <Image src="/logo.png" alt="Tentmakers Logo" width={36} height={36} />
            </span>
            <span className="section-eyebrow">
              Tentmakers Ecosystem · Panay Island
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [...EASE] }}
            className="mt-8 max-w-2xl font-display text-display font-bold"
          >
            Turn your hustle{' '}
            <span className="text-amber">into a company.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [...EASE] }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-balance text-white/80 sm:text-xl"
          >
            Tentmakers prepares Panay entrepreneurs for the real business world —
            structured training, mentorship, and five portfolio companies. Your
            Readiness Score proves capability across training, savings, site,
            protection, and mentorship.
          </motion.p>

          {/* Trust points */}
          <motion.ul
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [...EASE] }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-[13px] font-medium text-white/70">
                <Check className="h-3.5 w-3.5 text-amber" aria-hidden="true" />
                {point}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: [...EASE] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button onClick={onOpen} className="btn-primary group">
              Join the Network
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <Link href="/about" className="btn-ghost">
              Explore the Program
            </Link>
          </motion.div>

          {/* Company pills */}
          <motion.div
            initial={anim()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: [...EASE] }}
            className="mt-10 flex flex-wrap items-center gap-2.5"
          >
            {ventures.map((v) => (
              <Link
                key={v.slug}
                href={`/ventures/${v.slug}`}
                className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white/85 transition-all duration-300 hover:border-amber/40 hover:bg-amber/[0.06] hover:text-amber"
              >
                {v.name}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Live readiness preview — condensed on mobile, full on desktop */}
        <motion.div
          initial={anim()}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [...EASE] }}
          className="block"
        >
          <div className="spotlight-card rounded-[20px] border border-white/10 bg-white/[0.04] p-7 shadow-lift backdrop-blur-sm">
            <p className="section-eyebrow">Live preview · Member portal</p>
            <div className="mt-5 text-navy [color-scheme:dark]">
              <div className="rounded-2xl bg-white p-5">
                <ReadinessRing
                  score={62}
                  band="Building band · Tier 2 eligible"
                  nextMilestone="Protection Enrollment"
                  nextPoints={8}
                  size={120}
                  onLight
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-navy-light px-5 py-4">
              <div>
                <p className="text-sm font-bold text-white">Training · Tier 2</p>
                <p className="text-xs text-white/60">3 modules in progress</p>
              </div>
              <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">
                5 companies
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Every operator gets a Readiness Score from day one — training, savings, site, protection, mentorship.
            </p>
          </div>
          {/* Mobile condensed strip */}
          <div className="mt-4 flex items-center gap-3 lg:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1.5 text-xs font-bold text-amber">
              Readiness 62 · Building band
            </span>
            <span className="text-xs text-white/60">Tier 2 eligible</span>
          </div>
        </motion.div>

        {/* Proof stats */}
        <motion.div
          initial={anim()}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.58, ease: [...EASE] }}
          className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:col-span-2"
        >
          <Stat end={4.67} decimals={2} suffix="M" label="Market on Panay" />
          <Stat end={57469} format label="MSMEs, Western Visayas (DTI)" />
          <Stat end={5} label="Companies, one hub" />
          <Stat end={3} suffix="" label="Training tiers + Anchor band" />
        </motion.div>
      </motion.div>
    </section>
  );
}
