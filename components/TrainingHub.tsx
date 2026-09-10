'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Users2,
  ClipboardList,
  Lightbulb,
  CalendarDays,
  TrendingUp,
  Mic,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface Activity {
  icon: React.ElementType;
  label: string;
  description: string;
  level: Level;
}

const activities: Activity[] = [
  {
    icon: BookOpen,
    label: 'Mentorships',
    description: 'One-on-one guidance from experienced operators',
    level: 'Basic',
  },
  {
    icon: ClipboardList,
    label: 'Business plan training',
    description: 'Structured curriculum for turning ideas into ventures',
    level: 'Basic',
  },
  {
    icon: Users2,
    label: 'Mastermind Groups',
    description: 'Peer advisory circles for accountability and growth',
    level: 'Intermediate',
  },
  {
    icon: Lightbulb,
    label: 'Group events',
    description: 'Workshops, pitch nights, and collaborative sessions',
    level: 'Intermediate',
  },
  {
    icon: CalendarDays,
    label: 'Speaking engagements',
    description: 'Platform to build authority and public presence',
    level: 'Advanced',
  },
  {
    icon: TrendingUp,
    label: 'Advanced venture tracks',
    description: 'Deep-dive programs for operating within the ecosystem',
    level: 'Advanced',
  },
];

const levels: { name: Level; color: 'navy' | 'forest' | 'amber'; number: string }[] = [
  { name: 'Basic', color: 'navy', number: '01' },
  { name: 'Intermediate', color: 'forest', number: '02' },
  { name: 'Advanced', color: 'amber', number: '03' },
];

const levelColorMap = {
  navy: {
    bg: 'bg-foreground text-background dark:bg-amber dark:text-navy',
    text: 'text-foreground dark:text-amber',
    border: 'border-border dark:border-amber/30',
    dot: 'bg-foreground dark:bg-amber',
    light: 'bg-card/60 dark:bg-card',
    ring: 'ring-border dark:ring-amber/20',
  },
  forest: {
    bg: 'bg-forest',
    text: 'text-forest',
    border: 'border-forest/40',
    dot: 'bg-forest',
    light: 'bg-forest/[0.04] dark:bg-card',
    ring: 'ring-forest/20',
  },
  amber: {
    bg: 'bg-amber text-navy',
    text: 'text-amber',
    border: 'border-amber/40',
    dot: 'bg-amber',
    light: 'bg-amber/[0.04] dark:bg-card',
    ring: 'ring-amber/20',
  },
};

export default function TrainingHub() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="training-hub"
      className="relative w-full bg-secondary/30 py-24 sm:py-32"
      aria-labelledby="training-hub-heading"
    >
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
              The Training Hub
            </span>
          </div>
          <h2
            id="training-hub-heading"
            className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            Members do not just join.{' '}
            <span className="text-amber">They grow — level by level.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            At its core, Tentmakers is a training hub. Registered members progress
            from basic to advanced through mentorships, business plan training,
            Mastermind Groups, group events, speaking engagements, and more —
            building the skills and network to eventually operate within the
            ecosystem itself.
          </p>
        </motion.div>

        {/* Progression track — desktop horizontal */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
          }
          whileInView={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 lg:mt-16"
        >
          {/* Desktop: horizontal track */}
          <div className="relative hidden lg:block">
            <div
              className="absolute left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] top-6 h-0.5 bg-border"
              aria-hidden="true"
            />
            <div className="relative flex justify-between">
              {levels.map((level, i) => {
                const colors = levelColorMap[level.color];
                return (
                  <motion.div
                    key={level.name}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    whileInView={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1 }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: prefersReducedMotion ? 0 : i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white ring-4 ring-background',
                        colors.bg
                      )}
                    >
                      {level.number}
                    </span>
                    <span
                      className={cn(
                        'mt-3 text-sm font-semibold uppercase tracking-wide',
                        colors.text
                      )}
                    >
                      {level.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical track */}
          <div className="relative mb-8 lg:hidden">
            {levels.map((level, i) => {
              const colors = levelColorMap[level.color];
              return (
                <div key={level.name} className="flex items-center gap-4">
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      colors.bg
                    )}
                  >
                    {level.number}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-semibold uppercase tracking-wide',
                      colors.text
                    )}
                  >
                    {level.name}
                  </span>
                  {i < levels.length - 1 && (
                    <div
                      className="ml-5 h-6 w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Activity cards grouped by level */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {levels.map((level, levelIdx) => {
              const colors = levelColorMap[level.color];
              const levelActivities = activities.filter(
                (a) => a.level === level.name
              );

              return (
                <motion.div
                  key={level.name}
                  initial={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
                  }
                  whileInView={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: prefersReducedMotion ? 0 : levelIdx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    'rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg',
                    colors.border,
                    colors.light
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn('h-2 w-2 rounded-full', colors.dot)}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-[0.14em]',
                        colors.text
                      )}
                    >
                      {level.name}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {levelActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={activity.label}
                          className="group rounded-lg bg-card/80 p-3.5 transition-colors duration-200 hover:bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0',
                                colors.text
                              )}
                              aria-hidden="true"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-foreground">
                                {activity.label}
                              </span>
                              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                            <ChevronRight
                              className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground/60"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pipeline callout */}
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
          }
          whileInView={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 rounded-2xl border border-border bg-card p-7 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber">
              <Mic className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              This is where the founder community becomes a genuine pipeline.
              Members do not just attend — they progress, level by level, until
              they have the skills and network to{' '}
              <span className="font-semibold text-foreground">
                eventually operate within the ecosystem itself.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
