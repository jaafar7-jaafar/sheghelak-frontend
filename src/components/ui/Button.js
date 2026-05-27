import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 select-none';

  const variants = {
    primary: 'bg-primary text-white hover:shadow-card-hover hover:-translate-y-px active:translate-y-0',
    secondary: 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container dark:border-white/10 dark:text-white dark:hover:bg-white/5',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container dark:text-slate-400 dark:hover:bg-white/5',
    danger: 'bg-error text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
