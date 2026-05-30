import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import usePageTitle from '../../hooks/usePageTitle';
import authService from '../../services/authService';

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-glass border border-outline-variant/30 dark:border-white/8 p-6"
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white">
          <X size={18} />
        </button>

        {sent ? (
          /* ── Success state ── */
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-tertiary" />
            </div>
            <h3 className="font-bold text-on-surface dark:text-white mb-2">Check your inbox</h3>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed mb-5">
              If <span className="font-semibold text-on-surface dark:text-white">{email}</span> is registered,
              you'll receive a reset link shortly. It expires in <strong>1 hour</strong>.
            </p>
            <p className="text-xs text-outline dark:text-slate-500 mb-5">
              Don't see it? Check your spam folder.
            </p>
            <Button variant="primary" size="sm" className="w-full" onClick={onClose}>
              Back to Sign In
            </Button>
          </div>
        ) : (
          /* ── Email input state ── */
          <>
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
              <Mail size={22} className="text-primary" />
            </div>
            <h3 className="font-bold text-on-surface dark:text-white mb-1 text-base">Reset your password</h3>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-5 leading-relaxed">
              Enter your account email and we'll send you a secure reset link.
            </p>

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg px-3 py-2 text-sm text-error mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full" loading={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  usePageTitle('Sign In');

  const { login } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-primary p-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Sheghelak" className="h-9 w-auto object-contain" />
          <span className="font-bold text-white text-base">Sheghelak</span>
        </Link>

        <div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              Your path to a dev career starts here.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Structured paths, real project reviews, and a community that holds you accountable.
            </p>
          </motion.div>

          <div className="flex gap-6 mt-10">
            {[{ val: '1,200+', label: 'Learners' }, { val: '8', label: 'Active Paths' }, { val: '4,800+', label: 'Reviews Done' }].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.val}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">© 2026 Sheghelak. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img src="/logo.png" alt="Sheghelak" className="h-8 w-auto object-contain" />
            <span className="font-bold text-sm text-on-surface dark:text-white">Sheghelak</span>
          </Link>
          <div className="lg:ml-auto flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-white/5">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="text-sm text-on-surface-variant dark:text-slate-400">
              No account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-1.5">Welcome back</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">Sign in to continue your learning journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                rightIcon={showPass ? EyeOff : Eye}
                onRightIconClick={() => setShowPass(p => !p)}
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
              />

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error bg-error-container dark:bg-error/10 rounded px-3 py-2">
                  {error}
                </motion.p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-on-surface-variant dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
}
