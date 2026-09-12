'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface ReadinessRingProps {
  score: number;
  band?: string;
  nextMilestone?: string;
  nextPoints?: number;
  size?: number;
  compact?: boolean;
  /** Render for a light surface (e.g. white card on a dark hero). */
  onLight?: boolean;
}

export default function ReadinessRing({
  score,
  band = 'Building band',
  nextMilestone = 'Complete Protection Enrollment',
  nextPoints = 8,
  size = 120,
  compact = false,
  onLight = false,
}: ReadinessRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const tone = {
    track: onLight ? 'stroke-navy/10' : 'stroke-white/10',
    strong: onLight ? 'text-navy' : 'text-foreground',
    soft: onLight ? 'text-navy/60' : 'text-muted-foreground',
    faint: onLight ? 'text-navy/50' : 'text-muted-foreground',
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Readiness Score ${clamped} out of 100, ${band}`}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={tone.track}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke="url(#readiness-gradient)"
            strokeDasharray={circumference}
            initial={prefersReducedMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
          <defs>
            <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(36 96% 52%)" />
              <stop offset="100%" stopColor="hsl(36 100% 62%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-2xl font-bold tabular-nums ${tone.strong}`}>
            {clamped}
          </span>
          <span className={`text-[11px] font-medium ${tone.soft}`}>/ 100</span>
        </div>
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${tone.faint}`}>
            Readiness Score
          </p>
          <p className={`mt-1 text-sm font-bold ${tone.strong}`}>{band}</p>
          <p className={`mt-1 text-xs leading-relaxed ${tone.soft}`}>
            Next milestone: {nextMilestone} (+{nextPoints} pts)
          </p>
        </div>
      )}
    </div>
  );
}
