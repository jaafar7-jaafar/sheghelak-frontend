import React from 'react';

export default function ProgressBar({ value = 0, max = 100, className = '', showLabel = false, size = 'md' }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 ${heights[size]} bg-surface-container-high dark:bg-white/10 rounded-full overflow-hidden`}>
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 min-w-[36px] text-right font-geist">
          {pct}%
        </span>
      )}
    </div>
  );
}
