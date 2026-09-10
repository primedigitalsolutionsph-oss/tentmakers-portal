'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Quote, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const quotes = [
  {
    quote:
      'I joined for the training and stayed for the community. Within three months I was running my first storefront for a local MSME.',
    name: 'Maria S.',
    role: 'Member → Operator, Iloilo City',
  },
  {
    quote:
      'The paluwagan system we already trusted, finally with structure. Our group has saved consistently for 8 months straight.',
    name: 'Jonathan R.',
    role: 'Thrifty Tribe Member, Roxas City',
  },
  {
    quote:
      'Hiring used to take us weeks. Through ICKY we found trained staff in days — people who were ready on day one.',
    name: 'SME Owner',
    role: 'ICKY Partner, Panay',
  },
];

const faqs = [
  {
    q: 'How much does it cost to join?',
    a: 'Registration is free. You get value from day one — training access, community, and venture exposure. Advanced tiers and operator tracks unlock as you progress.',
  },
  {
    q: 'What is the 3-tier training progression?',
    a: 'Basic gives you foundations and community access. Intermediate adds hands-on venture skills. Advanced prepares you to operate or franchise a venture within the ecosystem.',
  },
  {
    q: 'Do I need a business to join?',
    a: 'No. Most members join as individuals. Operators run ventures, partners collaborate strategically — you choose your path at registration and can change later.',
  },
  {
    q: 'Where are you located?',
    a: 'Panay Island, Western Visayas, Philippines — serving a 4.67M-person market across Iloilo, Capiz, Antique, and Aklan.',
  },
];

export default function SocialProof() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="stories" className="relative w-full bg-background py-24 sm:py-32" aria-labelledby="stories-heading">
      <div
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
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
              Member Stories
            </span>
          </div>
          <h2 id="stories-heading" className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Operators are made here, <span className="text-amber">not born</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {quotes.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="spotlight-card flex h-full flex-col rounded-[28px] border border-border bg-card p-7"
            >
              <Quote className="h-6 w-6 text-amber" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="text-center font-display text-2xl font-bold text-foreground">
            Frequently asked questions
          </h3>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-foreground">{f.q}</span>
                    <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
