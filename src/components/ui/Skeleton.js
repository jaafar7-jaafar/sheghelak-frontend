import React from 'react';

export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div className={`${width} ${height} bg-surface-container-high dark:bg-white/10 rounded animate-pulse ${className}`} />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-6 space-y-3 ${className}`}>
      <SkeletonLine height="h-5" width="w-3/4" />
      <SkeletonLine height="h-3" />
      <SkeletonLine height="h-3" width="w-5/6" />
      <SkeletonLine height="h-2" className="mt-4" />
    </div>
  );
}

export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-surface-container-high dark:bg-white/10 rounded animate-pulse ${className}`} />
  );
}
