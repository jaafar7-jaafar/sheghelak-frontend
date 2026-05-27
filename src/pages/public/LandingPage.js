import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Users, BarChart2, Star, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../modules/dashboard/Hero';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MOCK_TESTIMONIALS } from '../../assets/mock/data';

const features = [
  {
    icon: BookOpen,
    title: 'Structured Learning Paths',
    description: 'Follow expertly designed paths with clear levels. No more wandering — every step builds on the last.',
  },
  {
    icon: CheckCircle,
    title: 'Real Project Reviews',
    description: 'Submit your work and get genuine feedback from instructors. Learn from doing, not just watching.',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    description: "See exactly how far you've come. Locked levels unlock as you prove mastery — momentum is built in.",
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join a focused Telegram community of learners on the same path. Accountability built in.',
  },
];

const howItWorks = [
  { step: '01', title: 'Pick Your Path', description: 'Choose from our structured learning paths matched to your goals.' },
  { step: '02', title: 'Complete Levels', description: 'Work through levels at your pace. Each unlocks the next.' },
  { step: '03', title: 'Submit Projects', description: 'Submit real projects for review. Get actionable feedback.' },
  { step: '04', title: 'Get Hired', description: 'Build a portfolio of reviewed, real-world projects employers trust.' },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 bg-primary/8 dark:bg-primary/15 text-primary px-3 py-1 rounded-full text-label-caps font-geist mb-4">
      {children}
    </span>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
  };
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" className="py-20 bg-surface-container-low dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl md:text-headline-lg font-bold text-on-surface dark:text-white mb-4">
              Everything you need to grow
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 max-w-lg mx-auto text-body-md">
              A platform built around how developers actually learn — by doing real work with real feedback.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.08)}>
                <Card className="p-6 h-full hover:shadow-card-hover hover:-translate-y-px transition-all duration-200">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center mb-4">
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-on-surface dark:text-white mb-2 text-sm">{f.title}</h3>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl md:text-headline-lg font-bold text-on-surface dark:text-white mb-4">
              Simple. Structured. Effective.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((h, i) => (
              <motion.div key={h.step} {...fadeUp(i * 0.1)} className="text-center">
                <div className="text-4xl font-black text-primary/20 dark:text-primary/30 font-geist mb-3">{h.step}</div>
                <h3 className="font-semibold text-on-surface dark:text-white mb-2">{h.title}</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-3xl md:text-headline-lg font-bold text-white mb-4">
              Learners that made it happen
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.map((t, i) => (
              <motion.div key={t.id} {...fadeUp(i * 0.1)}>
                <div className="glass-card p-6 rounded-lg h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build your future?
            </h2>
            <p className="text-white/70 text-body-md mb-8 max-w-md mx-auto">
              Join 1,200+ learners who chose structure over confusion.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="!bg-white !text-primary hover:!bg-white/90"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                className="!bg-transparent !text-white !border !border-white/30 hover:!bg-white/10"
                onClick={() => navigate('/paths')}
              >
                Browse Available Paths
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-sm text-on-surface dark:text-white">Sheghelak.com</span>
            </div>
            <div className="flex items-center gap-6">
              {['Terms', 'Privacy', 'Contact'].map(l => (
                <span key={l} className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
            <p className="text-xs text-outline dark:text-slate-500">© 2026 Sheghelak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
