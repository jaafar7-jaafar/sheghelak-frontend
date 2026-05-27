import React from 'react';

const colorMap = {
  blue: 'bg-primary/10 text-primary dark:bg-primary/20',
  green: 'bg-tertiary/10 text-tertiary dark:bg-tertiary/20',
  red: 'bg-error/10 text-error dark:bg-error/20',
  yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  gray: 'bg-surface-container text-on-surface-variant dark:bg-white/10 dark:text-slate-400',
  purple: 'bg-secondary/10 text-secondary dark:bg-secondary/20',
};

export default function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span className={`badge ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
}
