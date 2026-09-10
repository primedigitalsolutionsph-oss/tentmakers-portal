'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Store, QrCode, CarFront, HardHat, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Satellite {
  name: string;
  short: string;
  icon: React.ElementType;
  /** Badge center in the 400x400 diagram grid. */
  x: number;
  y: number;
  /** Elbow connector from the hub to just under the badge. */
  path: string;
  pulseDur: string;
  pulseBegin: string;
}

const HUB = { x: 200, y: 190 };

const satellites: Satellite[] = [
  {
    name: 'Prime Digital Solutions',
    short: 'Prime Digital',
    icon: Store,
    x: 92,
    y: 82,
    path: 'M160,152 L92,152 L92,108',
    pulseDur: '2.8s',
    pulseBegin: '0s',
  },
  {
    name: 'Thrifty Tribe',
    short: 'Thrifty Tribe',
    icon: QrCode,
    x: 308,
    y: 72,
    path: 'M240,152 L308,152 L308,98',
    pulseDur: '3.2s',
    pulseBegin: '-1.1s',
  },
  {
    name: 'ICKY',
    short: 'ICKY',
    icon: CarFront,
    x: 78,
    y: 302,
    path: 'M160,228 L78,228 L78,276',
    pulseDur: '3s',
    pulseBegin: '-2s',
  },
  {
    name: 'Prime Axis',
    short: 'Prime Axis',
    icon: HardHat,
    x: 318,
    y: 308,
    path: 'M240,228 L318,228 L318,282',
    pulseDur: '2.6s',
    pulseBegin: '-0.6s',
  },
];

/**
 * Isometric ecosystem diagram: glowing Tentmakers hub with four venture
 * satellites joined by animated connectors. Decorative (aria-hidden) —
 * the same relationships are described in text elsewhere on the page.
 */
export default function EcosystemNetwork() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[440px] select-none"
    >
      {/* Dot field */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 75%)',
        }}
      />

      {/* Connectors */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {satellites.map((s) => (
          <g key={s.short}>
            <path
              d={s.path}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
            />
            {!prefersReducedMotion && (
              <>
                <path
                  d={s.path}
                  stroke="rgba(232,160,32,0.65)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="5 11"
                  className="connector-flow"
                />
                <circle r="3.5" fill="#E8A020">
                  <animateMotion dur={s.pulseDur} begin={s.pulseBegin} repeatCount="indefinite" path={s.path} />
                </circle>
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Hub glow */}
      <motion.div
        className="absolute rounded-full bg-amber/25 blur-3xl"
        style={{
          left: `${(HUB.x / 400) * 100}%`,
          top: `${(HUB.y / 400) * 100}%`,
          width: '34%',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
        }}
        animate={prefersReducedMotion ? {} : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.12, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Hub hexagon */}
      <div
        className="absolute"
        style={{
          left: `${(HUB.x / 400) * 100}%`,
          top: `${(HUB.y / 400) * 100}%`,
          width: '30%',
          aspectRatio: '1.08',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="absolute inset-0 bg-amber/20"
          style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)' }}
        />
        <div
          className="absolute bg-navy-light"
          style={{
            inset: '3.5%',
            clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Network className="h-7 w-7 text-amber" />
          <span className="px-2 text-center text-[9px] font-bold uppercase leading-tight tracking-[0.14em] text-white/80">
            Tentmakers
          </span>
        </div>
      </div>

      {/* Satellites */}
      {satellites.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.short}
            className="absolute flex flex-col items-center"
            style={{
              left: `${(s.x / 400) * 100}%`,
              top: `${(s.y / 400) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="relative flex items-center justify-center">
              <span className="absolute h-[74px] w-[74px] rotate-45 rounded-[10px] border border-white/10 bg-white/[0.02]" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-navy-light/80 shadow-lg shadow-black/40 backdrop-blur-sm">
                <Icon className="h-6 w-6 text-amber" />
              </span>
            </span>
            <span className="mt-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
              {s.short}
            </span>
            <span className="sr-only">{s.name}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
