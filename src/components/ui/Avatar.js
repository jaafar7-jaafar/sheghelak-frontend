import React from 'react';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

function resolveAvatarUrl(src) {
  if (!src) return null;
  // Already a full URL (http/https)
  if (src.startsWith('http')) return src;
  // Relative path from backend (e.g. /uploads/avatars/file.jpg)
  return `${API_BASE}${src}`;
}

export default function Avatar({ name = '', src = null, size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const resolvedSrc = resolveAvatarUrl(src);

  return resolvedSrc ? (
    <img
      src={resolvedSrc}
      alt={name}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary/10 flex-shrink-0 ${className}`}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold flex items-center justify-center flex-shrink-0 ring-2 ring-primary/10 ${className}`}>
      {initials}
    </div>
  );
}
