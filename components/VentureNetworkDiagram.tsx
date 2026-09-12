'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { networkLayout, type NetworkNode } from '@/lib/ventures-data';

export default function VentureNetworkDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<NetworkNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const { width, height, center, satellites, colors } = networkLayout;
  const centerColor = colors[center.slug];
  const allNodes = [center, ...satellites];

  const handleMouseEnter = (node: NetworkNode) => {
    setHovered(node);
  };
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  const handleMouseLeave = () => {
    setHovered(null);
    setTooltipPos(null);
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.4,
      transition: {
        pathLength: { duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.3 + i * 0.15 },
      },
    }),
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto h-full w-full max-w-md"
        role="img"
        aria-label="Tentmakers venture network diagram showing five ventures connected to the central Tentmakers Network hub"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <title>Tentmakers Venture Network</title>
        <desc>
          Five ventures interconnected through the central Tentmakers Network hub,
          spanning staffing, fintech, insurance, digital solutions, and founder community.
        </desc>

        {/* Connection lines: center to each satellite */}
        {satellites.map((sat, i) => {
          const isActive = hovered?.slug === sat.slug || hovered?.slug === center.slug;
          const strokeColor = isActive ? '#ea8b1d' : '#9ca3af';
          const strokeWidth = isActive ? 2.5 : 1.5;
          const x1 = center.x;
          const y1 = center.y;
          const x2 = sat.x;
          const y2 = sat.y;

          if (prefersReducedMotion) {
            return (
              <line
                key={`line-${sat.slug}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.4}
              />
            );
          }

          return (
            <motion.line
              key={`line-${sat.slug}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial="hidden"
              animate="visible"
              custom={i}
              variants={lineVariants}
              style={{ transition: undefined }}
            />
          );
        })}

        {/* Satellite nodes */}
        {satellites.map((node, i) => {
          const isActive = hovered?.slug === node.slug;
          const fillColor = colors[node.slug] || '#9ca3af';

          return (
            <motion.g
              key={node.slug}
              initial="hidden"
              animate="visible"
              custom={i}
              variants={nodeVariants}
              style={{ transition: undefined }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 8 : 6}
                fill={fillColor}
                stroke={isActive ? '#fff' : 'transparent'}
                strokeWidth={2}
                className={cn('cursor-pointer transition-all', !prefersReducedMotion && isActive && 'animate-pulse-ring')}
                onMouseEnter={() => handleMouseEnter(node)}
              />
            </motion.g>
          );
        })}

        {/* Center node */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={hovered?.slug === center.slug ? 10 : 8}
          fill={centerColor}
          stroke={hovered?.slug === center.slug ? '#fff' : 'transparent'}
          strokeWidth={2}
          className="cursor-pointer"
          onMouseEnter={() => handleMouseEnter(center)}
          aria-label="Tentmakers Network"
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>

      {/* Tooltip */}
      {hovered && tooltipPos && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg opacity-100 transition-opacity"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 40,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-semibold text-foreground">{hovered.name}</p>
          <p className="text-xs text-muted-foreground">{hovered.gap}</p>
        </div>
      )}

      {/* Venture labels below the diagram */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:justify-center sm:gap-2">
        {allNodes.map((node) => {
          const isCenter = node.slug === center.slug;
          return (
            <Link
              key={node.slug}
              href={`/ventures/${node.slug}`}
              className={cn(
                'flex flex-col items-center gap-2 text-center transition-all hover:scale-105',
                isCenter ? 'text-amber' : 'text-muted-foreground'
              )}
            >
              <span
                className="flex h-3 w-3 rounded-full"
                style={{ backgroundColor: colors[node.slug] || '#9ca3af' }}
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{node.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="text-[10px] text-muted-foreground/60">{node.metric}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
