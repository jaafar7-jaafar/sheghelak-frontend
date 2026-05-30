import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, CheckCircle, Users, BarChart2, Star, ArrowRight,
  MessageCircle, Target, Trophy, Rocket,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../modules/dashboard/Hero';
import Button from '../../components/ui/Button';
import { MOCK_TESTIMONIALS } from '../../assets/mock/data';
import usePageTitle from '../../hooks/usePageTitle';

function InstagramIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ─── Static data ───────────────────────────────────────────────────────────────
const features = [
  {
    icon: BookOpen,
    bg: 'bg-primary/8 dark:bg-primary/15',
    text: 'text-primary',
    title: 'Structured Learning Paths',
    description: 'Follow expertly designed paths with clear levels. No more wandering — every step builds on the last.',
  },
  {
    icon: CheckCircle,
    bg: 'bg-secondary/8 dark:bg-secondary/15',
    text: 'text-secondary',
    title: 'Real Project Reviews',
    description: 'Submit your work and get genuine feedback from instructors. Learn from doing, not just watching.',
  },
  {
    icon: BarChart2,
    bg: 'bg-tertiary/8 dark:bg-tertiary/15',
    text: 'text-tertiary',
    title: 'Progress Tracking',
    description: "See exactly how far you've come. Locked levels unlock as you prove mastery — momentum is built in.",
  },
  {
    icon: Users,
    bg: 'bg-amber-50 dark:bg-amber-900/15',
    text: 'text-amber-600 dark:text-amber-400',
    title: 'Community Access',
    description: 'Join a focused Telegram community of learners on the same path. Accountability built in.',
  },
];

const howItWorks = [
  { step: '01', icon: Target,  title: 'Pick Your Path',    description: 'Choose from structured learning paths matched to your goals and current skill level.' },
  { step: '02', icon: BookOpen, title: 'Complete Levels',   description: 'Work through levels at your own pace. Each level unlocks the next when you\'re ready.' },
  { step: '03', icon: Trophy,  title: 'Submit Projects',   description: 'Build real projects and submit them for instructor review. Get actionable feedback.' },
  { step: '04', icon: Rocket,  title: 'Get Hired',         description: 'Build a portfolio of reviewed, real-world projects that employers and clients trust.' },
];

const testimonialAvatars = [
  'https://i.pravatar.cc/100?img=5',
  'https://i.pravatar.cc/100?img=52',
  'https://i.pravatar.cc/100?img=16',
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.52, delay },
  };
}

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/8 dark:bg-primary/15 text-primary px-3 py-1 rounded-full text-label-caps font-geist mb-4">
      {children}
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  usePageTitle('Sheghelak — Build Your Dev Career');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Navbar />
      <Hero />

      {/* ════════════════════════════════════════════════════
          FEATURES  — dark premium showcase
      ════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        {/* Background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,80,203,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

          {/* Section header */}
          <motion.div {...fadeUp()} className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Everything you need to grow
            </h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              A platform built around how developers actually learn — by doing real work with real feedback.
            </p>
          </motion.div>

          {/* Feature grid — 2 cols on mobile, 2 cols on desktop (larger cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.1)}>
                <div className="group relative p-6 sm:p-8 rounded-2xl border border-white/6 bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-300 overflow-hidden h-full">
                  {/* Hover corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(0,80,203,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />

                  {/* Number watermark */}
                  <span className="absolute bottom-4 right-6 text-[80px] font-black text-white/[0.03] font-geist leading-none select-none">
                    {i + 1}
                  </span>

                  <div className="flex items-start gap-5 relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.text} flex items-center justify-center flex-shrink-0`}
                      style={{ boxShadow: '0 0 24px rgba(0,80,203,0.15)' }}>
                      <f.icon size={24} />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">{f.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-headline-lg font-bold text-on-surface dark:text-white mb-4">
              Simple. Structured. Effective.
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 max-w-md mx-auto text-body-md">
              Four steps from where you are to where you want to be.
            </p>
          </motion.div>

          {/* Desktop: horizontal with connecting line */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/15 via-primary/40 to-primary/15" />
            {howItWorks.map((h, i) => (
              <motion.div key={h.step} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-outline-variant/40 dark:border-white/8 shadow-card flex flex-col items-center justify-center mb-5">
                  <span className="text-[10px] font-bold text-primary/50 font-geist mb-1 tracking-wider">{h.step}</span>
                  <h.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface dark:text-white mb-2">{h.title}</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">{h.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="sm:hidden relative pl-10">
            {/* Vertical line */}
            <div className="absolute left-4 top-3 bottom-3 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />
            <div className="space-y-8">
              {howItWorks.map((h, i) => (
                <motion.div key={h.step} {...fadeUp(i * 0.1)} className="relative flex gap-4">
                  {/* Circle on timeline */}
                  <div className="absolute -left-10 w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-outline-variant/40 dark:border-white/10 shadow-card flex items-center justify-center flex-shrink-0 z-10">
                    <h.icon size={15} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary/60 font-geist tracking-widest">{h.step}</span>
                      <h3 className="font-semibold text-on-surface dark:text-white text-sm">{h.title}</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">{h.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-20 md:py-28 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-primary/12 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-headline-lg font-bold text-white mb-4">
              Learners that made it happen
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-body-md">
              Real results from real people who chose structure over confusion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {MOCK_TESTIMONIALS.map((t, i) => (
              <motion.div key={t.id} {...fadeUp(i * 0.1)}>
                <div className="glass-card p-5 sm:p-6 rounded-xl h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <img
                      src={testimonialAvatars[i]}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div {...fadeUp()}>
            <img
              src="/logo.png"
              alt="Sheghelak"
              className="h-16 sm:h-20 w-auto object-contain mx-auto mb-6 drop-shadow-lg"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build your future?
            </h2>
            <p className="text-white/70 text-body-md mb-8 max-w-md mx-auto">
              Join 1,200+ learners who chose structure over confusion. Start your first path today — it's free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="!bg-white !text-primary hover:!bg-white/90 !shadow-glass w-full sm:w-auto"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                className="!bg-transparent !text-white !border !border-white/30 hover:!bg-white/10 w-full sm:w-auto"
                onClick={() => navigate('/paths')}
              >
                Browse Paths
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-10 pt-8 border-t border-white/20">
              {[
                { icon: Users, label: '1,200+ Learners' },
                { icon: CheckCircle, label: 'Free to Start' },
                { icon: MessageCircle, label: 'Community Support' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/70 text-sm">
                  <Icon size={14} className="text-white/50" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/5">
        {/* Main footer row */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Sheghelak" className="h-9 w-auto object-contain" />
                <span className="font-bold text-base text-on-surface dark:text-white">Sheghelak.com</span>
              </div>
              <p className="text-xs text-outline dark:text-slate-500 text-center md:text-left max-w-[200px]">
                Structured paths for the next generation of developers.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3">
              <div className="flex flex-col gap-2">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-1">Platform</p>
                <Link to="/paths"    className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors">Available Paths</Link>
                <Link to="/register" className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors">Sign Up Free</Link>
                <Link to="/login"    className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors">Sign In</Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-1">Legal</p>
                <span className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white cursor-pointer transition-colors">Terms of Use</span>
                <span className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/20 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-outline dark:text-slate-500">© 2026 Sheghelak. All rights reserved.</p>

            {/* Built by credit */}
            <a
              href="https://www.instagram.com/jaafar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-outline dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors group"
            >
              Built by
              <span className="font-semibold text-on-surface-variant dark:text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1">
                jaafarjaafar
                <InstagramIcon size={12} />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
