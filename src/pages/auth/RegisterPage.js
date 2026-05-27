import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

function validate(form) {
  if (!form.name.trim()) return 'Name is required.';
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'A valid email is required.';
  if (form.password.length < 8) return 'Password must be at least 8 characters.';
  if (form.password !== form.confirm) return 'Passwords do not match.';
  return null;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-slate-900 dark:bg-slate-950 p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-white">Sheghelak</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Stop tutorial hell.<br />Start building real projects.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Follow a structured path, submit real projects, get reviewed, and build a portfolio that gets you hired.
          </p>

          {[
            'Structured learning paths with clear levels',
            'Real project submissions reviewed by instructors',
            'Locked levels that unlock as you progress',
            'Private Telegram community for accountability',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 mb-3">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </motion.div>

        <p className="text-slate-600 text-xs">© 2026 Sheghelak. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col">
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
              Already a member?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-1.5">Create your account</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">Free to get started. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Your name"
                icon={User}
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
              />
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
                placeholder="Min. 8 characters"
                icon={Lock}
                rightIcon={showPass ? EyeOff : Eye}
                onRightIconClick={() => setShowPass(p => !p)}
                value={form.password}
                onChange={set('password')}
              />
              <Input
                label="Confirm password"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat your password"
                icon={Lock}
                value={form.confirm}
                onChange={set('confirm')}
              />

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error bg-error-container dark:bg-error/10 rounded px-3 py-2">
                  {error}
                </motion.p>
              )}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-on-surface-variant dark:text-slate-500 mt-5 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{' '}
              and{' '}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
