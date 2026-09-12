'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-navy py-20 sm:py-28"
    >
      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Glows */}
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-forest/8 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left: copy */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }
            }
            whileInView={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
              <span className="section-eyebrow">
                Join the Ecosystem
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Join Tentmakers Network —{' '}
              <span className="text-amber">training, mentorship, and real tools</span> to help you build something that lasts.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Sign up with Google or email. No fees to join. Track your Readiness
              Score as you go — it&apos;s not a test, it&apos;s a map of what you&apos;ve built.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="btn-primary group"
              >
                Request Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/ventures"
                className="btn-ghost"
              >
                Explore Portfolio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Right: summary card */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 32 }
            }
            whileInView={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
                  <Image src="/logo.png" alt="Tentmakers Logo" width={44} height={44} />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">
                    Tentmakers Network
                  </p>
                  <p className="text-xs text-white/40">
                    Member Portal
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/8" />

              <div className="space-y-4">
                {[
                  { label: 'Market', value: '4.67M people, Panay Island' },
                  { label: 'Portfolio', value: '5 companies, member-operated' },
                  { label: 'Training Hub', value: '3 training tiers + Anchor band' },
                  { label: 'MSMEs', value: '57,469 establishments' },
                  { label: 'Stage', value: 'Active & Scaling' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/35">
                      {item.label}
                    </span>
                    <span className="text-right text-sm font-medium text-white/70">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/8" />

              <div className="flex items-center gap-2 text-xs text-white/35">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Panay Island, Western Visayas, Philippines</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
