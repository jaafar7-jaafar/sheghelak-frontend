import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
let _id = 0;

const CONFIGS = {
  success: { icon: CheckCircle, border: 'border-tertiary/30', iconClass: 'text-tertiary' },
  error:   { icon: AlertCircle, border: 'border-error/30',   iconClass: 'text-error' },
  info:    { icon: Info,        border: 'border-primary/30', iconClass: 'text-primary' },
};

function ToastItem({ toast, onDismiss }) {
  const c = CONFIGS[toast.type] || CONFIGS.info;
  const Icon = c.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{    opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border ${c.border} shadow-glass min-w-[260px] max-w-sm pointer-events-auto`}
    >
      <Icon size={16} className={`${c.iconClass} flex-shrink-0`} />
      <p className="text-sm font-medium text-on-surface dark:text-white flex-1 leading-snug">{toast.message}</p>
      <button onClick={onDismiss} className="text-outline dark:text-slate-500 hover:text-on-surface dark:hover:text-white flex-shrink-0 ml-1">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++_id;
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="sync">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
