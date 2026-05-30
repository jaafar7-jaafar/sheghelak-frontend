import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Users, ArrowRight, Layers,
  ChevronRight, Search, Zap, DollarSign
} from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../modules/auth/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';

// ─── Difficulty badge colors ──────────────────────────────────────────────────
const DIFF_COLOR  = { Beginner: 'green', Intermediate: 'blue', Advanced: 'red' };
const DIFF_ORDER  = { Beginner: 1, Intermediate: 2, Advanced: 3 };

// ─── Category icon colors ─────────────────────────────────────────────────────
const CAT_COLORS = {
  Development: 'bg-primary/10 dark:bg-primary/20 text-primary',
  Design:      'bg-secondary/10 dark:bg-secondary/20 text-secondary',
  DevOps:      'bg-tertiary/10 dark:bg-tertiary/20 text-tertiary',
  Data:        'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Mobile:      'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  Other:       'bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-slate-400',
};

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
  };
}

// ─── Path Card ────────────────────────────────────────────────────────────────
function PathCard({ path, index, userPathId }) {
  const navigate = useNavigate();
  const levels   = path.levels || [];
  const taskCount = levels.reduce((sum, l) => sum + (l._count?.tasks || 0), 0);
  const isEnrolled = !!userPathId && userPathId === path.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Card
        className="p-6 h-full flex flex-col hover:shadow-card-hover hover:-translate-y-px transition-all duration-200 cursor-pointer group"
        onClick={() => navigate('/register')}
      >
        {/* Top: category + difficulty + price + enrolled */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${CAT_COLORS[path.category] || CAT_COLORS.Other}`}>
            <Zap size={11} />
            {path.category}
          </span>
          <div className="flex items-center gap-2">
            {isEnrolled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-tertiary/10 text-tertiary border border-tertiary/20">
                ✓ Enrolled
              </span>
            )}
            {path.price && !isEnrolled && (
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white">
                <DollarSign size={11} />{parseFloat(path.price).toFixed(0)}
              </span>
            )}
            <Badge color={DIFF_COLOR[path.difficulty] || 'blue'}>
              {path.difficulty}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-on-surface dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors">
          {path.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed mb-5 flex-1 line-clamp-3">
          {path.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-outline dark:text-slate-500 mb-5 border-t border-outline-variant/20 dark:border-white/5 pt-4">
          <span className="flex items-center gap-1.5">
            <Layers size={13} className="text-primary/60" />
            {path._count?.levels || levels.length} level{(path._count?.levels || levels.length) !== 1 ? 's' : ''}
          </span>
          {taskCount > 0 && (
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-primary/60" />
              {taskCount} tasks
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary/60" />
            {path.estimatedWeeks} weeks
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-primary/60" />
            {path._count?.userPaths?.toLocaleString() || 0} enrolled
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); navigate('/register'); }}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-primary/6 dark:bg-primary/12 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors font-semibold text-sm"
        >
          <span>Enroll Now</span>
          <ChevronRight size={16} />
        </button>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PathsPage() {
  usePageTitle('Learning Paths');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paths, setPaths]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [catFilter, setCatFilter]   = useState('All');

  useEffect(() => {
    api.get('/paths', { params: { limit: 50 } })
      .then(res => setPaths(res.data?.data?.paths || []))
      .catch(() => setError('Could not load paths. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Filters
  const categories  = ['All', ...Array.from(new Set(paths.map(p => p.category))).sort()];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = paths
    .filter(p => diffFilter === 'All' || p.difficulty === diffFilter)
    .filter(p => catFilter  === 'All' || p.category  === catFilter)
    .filter(p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (DIFF_ORDER[a.difficulty] || 2) - (DIFF_ORDER[b.difficulty] || 2));

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Navbar />

      {/* Hero section */}
      <section className="pt-32 pb-14 relative overflow-hidden hero-glow">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(0,80,203,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div {...fade(0)} className="max-w-2xl mb-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant dark:text-slate-400 mb-5">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-on-surface dark:text-white font-medium">Available Paths</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-on-surface dark:text-white leading-tight tracking-tight mb-4">
              Choose Your{' '}
              <span className="text-gradient">Learning Path</span>
            </h1>
            <p className="text-body-md text-on-surface-variant dark:text-slate-400 leading-relaxed">
              Every path is structured with clear levels, real project tasks, and instructor reviews.
              Pick the one that matches your goal and start building today.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div {...fade(0.1)} className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-outline-variant/20 dark:border-white/5">
            {[
              { label: 'Active Paths',   value: paths.length || '—' },
              { label: 'Total Levels',   value: paths.reduce((s, p) => s + (p._count?.levels || 0), 0) || '—' },
              { label: 'Learners',       value: '1,200+' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-on-surface dark:text-white">{s.value}</p>
                <p className="text-xs text-outline dark:text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Search + Filters ──────────────────────────────────────────── */}
          <motion.div {...fade(0.15)} className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search paths..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 w-full"
              />
            </div>

            {/* Difficulty filter */}
            <div className="flex gap-1.5 flex-wrap">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    diffFilter === d
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-slate-800 border-outline-variant/40 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex gap-1.5 flex-wrap">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      catFilter === c
                        ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white'
                        : 'bg-white dark:bg-slate-800 border-outline-variant/40 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:border-outline-variant dark:hover:border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Paths Grid ────────────────────────────────────────────────────── */}
      <section className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-5 text-sm text-error text-center mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-primary" />
              </div>
              <p className="font-semibold text-on-surface dark:text-white text-lg mb-2">
                {search || diffFilter !== 'All' || catFilter !== 'All' ? 'No paths match your filters' : 'No paths available yet'}
              </p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6">
                {search || diffFilter !== 'All' || catFilter !== 'All'
                  ? 'Try adjusting your search or filters.'
                  : 'Check back soon — new paths are being added.'}
              </p>
              {(search || diffFilter !== 'All' || catFilter !== 'All') && (
                <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setDiffFilter('All'); setCatFilter('All'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-on-surface-variant dark:text-slate-400">
                  <span className="font-semibold text-on-surface dark:text-white">{filtered.length}</span>
                  {' '}path{filtered.length !== 1 ? 's' : ''} available
                  {(search || diffFilter !== 'All' || catFilter !== 'All') && (
                    <button onClick={() => { setSearch(''); setDiffFilter('All'); setCatFilter('All'); }}
                      className="ml-3 text-primary hover:underline text-xs font-medium">Clear filters</button>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((path, i) => (
                  <PathCard key={path.id} path={path} index={i} userPathId={user?.pathId} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to pick your path?
            </h2>
            <p className="text-white/70 mb-8 text-sm leading-relaxed">
              Create a free account and get assigned to your first path by an instructor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="!bg-white !text-primary hover:!opacity-95"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                className="!bg-transparent !text-white !border !border-white/30 hover:!bg-white/10"
                onClick={() => navigate('/login')}
              >
                Already a member? Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-bold text-sm text-on-surface dark:text-white">Sheghelak.com</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors">Home</Link>
            <Link to="/paths" className="text-sm text-primary font-medium">Paths</Link>
            <button onClick={() => navigate('/login')} className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors">Sign In</button>
          </div>
          <p className="text-xs text-outline dark:text-slate-500">© 2026 Sheghelak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
