import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  score: number;
  className?: string;
}

export const ConfidenceBadge: React.FC<BadgeProps> = ({ score, className }) => {
  const percentage = Math.round(score * 100);
  
  let colorClass = 'bg-zinc-800 text-zinc-400 border-zinc-700'; // Default/Low
  
  if (score >= 0.9) {
    colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 0.7) {
    colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', colorClass, className)}>
      {percentage}% Match
    </span>
  );
};