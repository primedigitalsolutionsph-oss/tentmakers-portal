'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';

type Tier = 'basic' | 'intermediate' | 'advanced';

interface TrainingProgressProps {
  currentTier: Tier;
}

const tiers: { key: Tier; label: string; number: string; color: string }[] = [
  { key: 'basic', label: 'Basic', number: '01', color: 'navy' },
  { key: 'intermediate', label: 'Intermediate', number: '02', color: 'forest' },
  { key: 'advanced', label: 'Advanced', number: '03', color: 'amber' },
];

const tierOrder: Tier[] = ['basic', 'intermediate', 'advanced'];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  navy: { bg: 'bg-navy', text: 'text-navy', ring: 'ring-navy/20' },
  forest: { bg: 'bg-forest', text: 'text-forest', ring: 'ring-forest/20' },
  amber: { bg: 'bg-amber', text: 'text-amber', ring: 'ring-amber/20' },
};

export default function TrainingProgress({ currentTier }: TrainingProgressProps) {
  const currentIndex = tierOrder.indexOf(currentTier);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute left-0 top-6 h-0.5 w-full bg-border" />
        <div
          className="absolute left-0 top-6 h-0.5 bg-amber transition-all duration-500"
          style={{ width: `${(currentIndex / (tiers.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {tiers.map((tier, i) => {
            const colors = colorMap[tier.color];
            const status =
              i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'locked';

            return (
              <div key={tier.key} className="flex flex-col items-center">
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white ring-4 ring-background',
                    status === 'locked' ? 'bg-muted' : colors.bg
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : status === 'locked' ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    tier.number
                  )}
                </span>
                <span
                  className={cn(
                    'mt-3 text-sm font-semibold uppercase tracking-wide',
                    status === 'locked' ? 'text-muted-foreground' : colors.text
                  )}
                >
                  {tier.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {status === 'completed'
                    ? 'Completed'
                    : status === 'current'
                    ? 'In Progress'
                    : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
