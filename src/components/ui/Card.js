import React from 'react';

export default function Card({ children, className = '', glass = false, hover = false, ...props }) {
  return (
    <div
      className={`
        ${glass ? 'glass-card' : 'bg-white dark:bg-slate-800 border border-outline-variant/50 dark:border-white/5'}
        rounded-lg shadow-card
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-px transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
