import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-on-surface dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500">
            <Icon size={16} />
          </span>
        )}
        <input
          className={`
            input-field
            ${Icon ? 'pl-9' : ''}
            ${RightIcon ? 'pr-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
          `}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500 hover:text-on-surface dark:hover:text-white transition-colors"
          >
            <RightIcon size={16} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
