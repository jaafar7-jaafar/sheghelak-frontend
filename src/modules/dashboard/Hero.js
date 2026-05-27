import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart2, Users } from 'lucide-react';
import Button from '../../components/ui/Button';

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl blur-3xl scale-90" />

      {/* Window frame */}
      <div className="relative rounded-2xl border border-outline-variant/50 dark:border-white/10 bg-white dark:bg-slate-800 shadow-glass overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/30 dark:border-white/5 bg-surface-container-low dark:bg-slate-900">
          <div className="w-3 h-3 rounded-full bg-error/70" />
          <div className="w-3 h-3 rounded-full bg-amber-400/70" />
          <div className="w-3 h-3 rounded-full bg-tertiary/70" />
          <div className="flex-1 mx-4">
            <div className="h-5 bg-surface-container dark:bg-white/5 rounded-full w-48 mx-auto flex items-center justify-center">
              <span className="text-xs text-outline dark:text-slate-500">sheghelak.com/dashboard</span>
            </div>
          </div>
        </div>

        {/* Mock dashboard content */}
        <div className="flex h-[340px]">
          {/* Mini sidebar */}
          <div className="w-14 bg-surface-container-low dark:bg-slate-900 border-r border-outline-variant/20 dark:border-white/5 flex flex-col items-center py-4 gap-4">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-7 h-7 rounded-lg ${i === 0 ? 'bg-primary/10' : 'bg-transparent'} flex items-center justify-center`}>
                <div className={`w-4 h-0.5 ${i === 0 ? 'bg-primary' : 'bg-outline-variant dark:bg-white/20'} rounded`} />
              </div>
            ))}
          </div>

          {/* Mock content */}
          <div className="flex-1 p-4 space-y-3 overflow-hidden bg-surface-container-lowest dark:bg-slate-800">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Progress', val: '38%', color: 'bg-primary' },
                { label: 'Tasks Done', val: '24', color: 'bg-tertiary' },
                { label: 'Streak', val: '7d', color: 'bg-secondary' },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-outline-variant/30 dark:border-white/5">
                  <div className={`w-6 h-1.5 ${s.color} rounded-full mb-2`} />
                  <p className="text-sm font-bold text-on-surface dark:text-white">{s.val}</p>
                  <p className="text-xs text-outline dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-outline-variant/30 dark:border-white/5">
              <div className="flex justify-between mb-2">
                <p className="text-xs font-semibold text-on-surface dark:text-white">Node.js & Express</p>
                <p className="text-xs text-primary font-semibold">Level 4</p>
              </div>
              <div className="h-1.5 bg-surface-container dark:bg-white/10 rounded-full">
                <div className="h-full bg-primary rounded-full w-[44%]" />
              </div>
            </div>

            {/* Task list */}
            <div className="bg-white dark:bg-slate-700 rounded-lg border border-outline-variant/30 dark:border-white/5 overflow-hidden">
              {[
                { title: 'Set up Express server', done: true },
                { title: 'Build CRUD REST API', done: true },
                { title: 'Implement JWT Auth', done: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-outline-variant/20 dark:border-white/5 last:border-0">
                  <div className={`w-4 h-4 rounded flex-shrink-0 border ${t.done ? 'bg-primary border-primary' : 'border-outline-variant dark:border-white/20'}`}>
                    {t.done && <svg viewBox="0 0 16 16" className="w-full h-full text-white" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                  </div>
                  <span className={`text-xs ${t.done ? 'line-through text-outline dark:text-slate-500' : 'text-on-surface dark:text-white'}`}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Active Learners', value: '1,200+' },
    { icon: BarChart2, label: 'Paths Completed', value: '340+' },
    { icon: Zap, label: 'Tasks Reviewed', value: '4,800+' },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden hero-glow">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(0,80,203,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/8 dark:bg-primary/15 text-primary px-3 py-1.5 rounded-full mb-6"
          >
            <Zap size={13} />
            <span className="text-label-caps font-geist">Structured Learning Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-display-lg font-bold text-on-surface dark:text-white leading-tight tracking-tight mb-5"
          >
            Build Your Career with{' '}
            <span className="text-gradient">Structured Paths</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-body-md text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto mb-8"
          >
            Sheghelak gives you clear learning paths, real project reviews, and a community that keeps you accountable. Stop guessing — start building.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button variant="primary" size="lg" onClick={() => navigate('/register')} icon={ArrowRight}>
              Start Learning Free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/paths')}>
              Browse Paths
            </Button>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <DashboardMockup />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-14 pt-10 border-t border-outline-variant/30 dark:border-white/5"
        >
          {stats.map(s => (
            <div key={s.label} className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                <s.icon size={17} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-on-surface dark:text-white leading-none">{s.value}</p>
                <p className="text-xs text-outline dark:text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
