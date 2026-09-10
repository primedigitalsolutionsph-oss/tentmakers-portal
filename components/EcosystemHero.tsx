'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/use-count-up';
import SplineHero from '@/components/SplineHero';
import { useRegisterModal } from '@/hooks/use-register-modal';

const ventures = [
  { name: 'Prime Digital Solutions', slug: 'prime-digital-solutions' },
  { name: 'Thrifty Tribe', slug: 'thrifty-tribe' },
  { name: 'ICKY', slug: 'icky' },
  { name: 'Prime Axis', slug: 'prime-axis' },
  { name: 'Tentmakers Network', slug: 'tentmakers-network' },
];

function Stat({ end, decimals = 0, suffix = '', label }: { end: number; decimals?: number; suffix?: string; label: string }) {
  const { ref, displayValue } = useCountUp({ end, decimals, duration: 1800 });
  return (
    <div>
      <p className="font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
        <span ref={ref}>{displayValue}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/50">{label}</p>
    </div>
  );
}

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
        className="relative z-10 mx-auto grid min-h-[100vh] w-full max-w-6xl content-center items-center gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8"
      >
        <div>
        {/* Badge */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15">
            <Image src="/logo.png" alt="Tentmakers Logo" width={36} height={36} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
            Tentmakers Ecosystem · Panay Island
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
        >
          Join the network that{' '}
          <span className="text-amber">turns members into operators</span> — and
          builds ventures that matter.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          Five ventures. One training hub. A 4.67-million-person market on Panay
          Island. Register as a member, progress through our training tiers, and
          build the skills to operate within the ecosystem.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={onOpen}
            className="group inline-flex items-center gap-2 rounded-xl bg-amber px-6 py-3.5 text-sm font-bold text-navy transition-all hover:bg-amber-soft hover:shadow-lg hover:shadow-amber/20"
          >
            Join the Network
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:border-amber/40 hover:text-white"
          >
            Explore Ventures
          </Link>
          <span className="w-full text-xs text-white/50 sm:w-auto sm:ml-2">
            No fees to start · 3-tier training · Value from day one
          </span>
        </motion.div>

        {/* Venture pills */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-2.5"
        >
          {ventures.map((v) => (
            <Link
              key={v.slug}
              href={`/ventures/${v.slug}`}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-amber/40 hover:bg-amber/[0.06] hover:text-amber"
            >
              {v.name}
            </Link>
          ))}
        </motion.div>
        </div>

        {/* Network diagram */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[440px] lg:mx-0 lg:justify-self-end"
        >
          <SplineHero />
        </motion.div>

        {/* Proof stats */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:col-span-2 lg:mt-4"
        >
          <Stat end={4.67} decimals={2} suffix="M" label="Market on Panay" />
          <Stat end={57469} label="MSMEs, Western Visayas (DTI)" />
          <Stat end={5} label="Ventures, one hub" />
          <Stat end={3} label="Training tiers" />
        </motion.div>
      </motion.div>
    </section>
  );
}
