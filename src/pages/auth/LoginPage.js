import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-primary p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-white">Sheghelak</span>
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

          {/* Mock stats */}
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

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
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

        {/* Form */}
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

            {/* Demo credentials hint */}
            <div className="bg-accent-blue-soft dark:bg-primary/10 rounded-lg p-3 mb-6 text-xs text-primary dark:text-primary space-y-0.5">
              <p><strong>User:</strong> jaafar@sheghelak.com / User@1234</p>
              <p><strong>Admin:</strong> admin@sheghelak.com / Admin@1234</p>
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
                <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
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
    </div>
  );
}
