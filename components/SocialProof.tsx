'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Quote, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import * as Accordion from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

const quotes = [
  {
    quote:
      'I joined for the training and stayed for the community. Within three months I was running my first storefront for a local MSME.',
    name: 'Maria S.',
    role: 'Member → Operator, Iloilo City',
    initials: 'MS',
  },
  {
    quote:
      'The paluwagan system we already trusted, finally with structure. Our group has saved consistently for 8 months straight.',
    name: 'Jonathan R.',
    role: 'Thrifty Tribe Member, Roxas City',
    initials: 'JR',
  },
  {
    quote:
      'Hiring used to take us weeks. Through Prime Axis we found trained staff in days — people who were ready on day one.',
    name: 'SME Owner',
    role: 'Prime Axis Partner, Panay',
    initials: 'SO',
  },
];

const faqs = [
  {
    q: 'How much does it cost to join?',
      a: 'Registration is free. You get value from day one — training access, community, and company exposure. Higher tiers and operator tracks unlock as your Readiness Score grows.',
  },
  {
    q: 'What are the three training tiers?',
      a: 'Tier 1 Foundation covers the basics and community access. Tier 2 Building adds hands-on company skills. Tier 3 Established prepares you to operate a company within the ecosystem — each unlocked by your Readiness Score, not course-clicking.',
  },
  {
    q: 'Do I need a business to join?',
      a: 'No. Most members join as individuals. Operators run companies, partners collaborate strategically — you choose your path when you request access and can change later.',
  },
  {
    q: 'Where are you located?',
    a: 'Panay Island, Western Visayas, Philippines — serving a 4.67M-person market across Iloilo, Capiz, Antique, and Aklan.',
  },
];

export default function SocialProof() {
  const prefersReducedMotion = useReducedMotion();

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
            <span className="section-eyebrow">
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
              className="spotlight-card flex h-full flex-col rounded-[20px] border border-border bg-card p-7"
            >
              <Quote className="h-6 w-6 text-amber" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber"
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-[20px] border border-border bg-card p-7 text-center sm:flex-row sm:p-8 sm:text-left"
        >
          <Image
            src="/founder-rogie.jpg"
            alt="Rogie, founder of Tentmakers Network"
            width={88}
            height={88}
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-amber/30"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber">
              From the founder
            </p>
            <blockquote className="mt-2 text-sm leading-relaxed text-foreground sm:text-base">
              “We turn members into operators — a website, savings habit, and
              protection from day one, then real company access as your
              Readiness Score grows.”
            </blockquote>
            <p className="mt-2 text-xs text-muted-foreground">
              Rogie · Tentmakers Network, Panay Island
            </p>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="text-center font-display text-2xl font-bold text-foreground">
            Frequently asked questions
          </h3>
          <Accordion.Root
            type="single"
            collapsible
            defaultValue="item-0"
            className="mt-8 space-y-3"
          >
            {faqs.map((f, i) => (
              <Accordion.Item
                key={f.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-colors data-[state=open]:border-amber/30"
              >
                <Accordion.Header asChild>
                  <h4>
                    <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left [&[data-state=open]>svg]:rotate-180">
                      <span className="text-sm font-semibold text-foreground">{f.q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
                    </Accordion.Trigger>
                  </h4>
                </Accordion.Header>
                <Accordion.Content
                  className={cn(
                    'overflow-hidden text-sm leading-relaxed text-muted-foreground',
                    prefersReducedMotion
                      ? 'data-[state=open]:animate-none'
                      : 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
                  )}
                >
                  <p className="px-6 pb-5">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
