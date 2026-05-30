import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Zap, Code2, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';

const AVATARS = [
  'https://i.pravatar.cc/100?img=47',
  'https://i.pravatar.cc/100?img=12',
  'https://i.pravatar.cc/100?img=33',
  'https://i.pravatar.cc/100?img=68',
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden">

      {/* ── Aurora background ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(rgba(0,80,203,0.18) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Aurora blobs */}
        <div className="absolute -top-[30%] left-[20%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,80,203,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -top-[10%] right-[5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(70,72,212,0.14) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[10%] -left-[10%] w-[450px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,80,203,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }} />

        {/* Subtle top gradient */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative w-full">

        {/* ── Mobile logo ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex lg:hidden justify-center mb-10"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-52 h-52 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,80,203,0.35) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-48 h-48 rounded-full border border-dashed border-primary/25"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute w-36 h-36 rounded-full border border-primary/15"
            />
            <img src="/logo.png" alt="Sheghelak"
              className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl" />
          </div>
        </motion.div>

        {/* ── Two‑column grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="text-center lg:text-left">

            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-primary/8 dark:bg-primary/15 border border-primary/15 text-primary px-4 py-2 rounded-full mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-label-caps font-geist tracking-wider">Structured Learning Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[38px] sm:text-[52px] lg:text-[60px] font-black text-on-surface dark:text-white leading-[1.08] tracking-tight mb-6"
            >
              Build Your{' '}
              <span className="text-gradient">Dev Career</span>
              <br />
              <span className="text-on-surface dark:text-white">with Structure</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-[17px] text-on-surface-variant dark:text-slate-400 mb-10 leading-[1.75] mx-auto lg:mx-0 max-w-[490px]"
            >
              Clear learning paths, real project reviews, and a community
              that holds you accountable. Stop guessing —{' '}
              <span className="text-on-surface dark:text-white font-semibold">start building</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10 justify-center lg:justify-start"
            >
              {/* Primary CTA with outer glow */}
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-0 rounded-lg bg-primary/40 blur-lg scale-105 opacity-60" />
                <Button
                  variant="primary" size="lg"
                  onClick={() => navigate('/register')}
                  icon={ArrowRight}
                  className="relative w-full sm:w-auto"
                >
                  Start Learning Free
                </Button>
              </div>
              <Button
                variant="secondary" size="lg"
                onClick={() => navigate('/paths')}
                className="w-full sm:w-auto"
              >
                Browse Paths
              </Button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-x-6 gap-y-2.5 justify-center lg:justify-start"
            >
              {[
                '1,200+ Active Learners',
                'Real Project Reviews',
                'Free to Start',
              ].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-on-surface-variant dark:text-slate-400">
                  <CheckCircle size={14} className="text-primary flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — logo visual (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center relative py-16"
          >
            {/* Glow stack */}
            <div className="absolute w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,80,203,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(70,72,212,0.18) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            {/* Orbital rings */}
            <div className="absolute flex items-center justify-center" style={{ width: '380px', height: '380px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute w-full h-full rounded-full border border-dashed border-primary/15"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[300px] h-[300px] rounded-full border border-primary/10"
              />
              {/* Ring dot — orbiting */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute w-full h-full rounded-full"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,80,203,0.8)]" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[300px] h-[300px] rounded-full"
              >
                <div className="absolute bottom-0 right-6 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(70,72,212,0.8)]" />
              </motion.div>
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <img src="/logo.png" alt="Sheghelak"
                className="w-72 h-72 object-contain drop-shadow-2xl" />

              {/* Floating card: Level complete */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-10 -right-16 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 z-20 min-w-[172px]"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,80,203,0.08)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface dark:text-white leading-tight">Level Completed!</p>
                    <p className="text-[11px] text-outline dark:text-slate-500 mt-0.5">Node.js & Express</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card: Learners */}
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute -bottom-10 -left-16 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 z-20"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,80,203,0.08)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2 flex-shrink-0">
                    {AVATARS.map((url, i) => (
                      <img key={i} src={url} alt="learner"
                        className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface dark:text-white">1,200+ Learners</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card: Code tag */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 -right-24 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 z-20"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,80,203,0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-primary" />
                  <span className="text-xs font-bold text-on-surface dark:text-white whitespace-nowrap">Code. Build. Ship.</span>
                </div>
              </motion.div>

              {/* Floating card: Job ready */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-1/3 -left-20 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 z-20"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,130,89,0.12)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-tertiary/15 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={11} className="text-tertiary" />
                  </div>
                  <span className="text-xs font-bold text-tertiary whitespace-nowrap">Job Ready</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-16 pt-10 border-t border-outline-variant/20 dark:border-white/5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 sm:gap-0">
            {[
              { value: '1,200+', label: 'Active Learners' },
              { value: '340+',   label: 'Paths Completed' },
              { value: '4,800+', label: 'Tasks Reviewed' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.62 + i * 0.09 }}
                  className="text-center px-8"
                >
                  <p className="text-3xl sm:text-4xl font-black text-on-surface dark:text-white tracking-tight">{s.value}</p>
                  <p className="text-xs sm:text-sm text-outline dark:text-slate-500 mt-1 font-medium">{s.label}</p>
                </motion.div>
                {i < 2 && (
                  <div className="hidden sm:block h-10 w-px bg-outline-variant/30 dark:bg-white/8" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
