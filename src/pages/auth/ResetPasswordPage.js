import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import usePageTitle from '../../hooks/usePageTitle';
import authService from '../../services/authService';

export default function ResetPasswordPage() {
  usePageTitle('Reset Password');

  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const { isDark }     = useTheme();
  const token          = params.get('token');

  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState('');
  const [countdown, setCountdown]     = useState(5);

  // If no token in URL, show invalid state immediately
  const noToken = !token;

  // Countdown redirect after success
  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(t); navigate('/login'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [success, navigate]);

  const validate = () => {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background dark:bg-slate-900 flex flex-col items-center justify-center px-4 ${isDark ? 'dark' : ''}`}>
      {/* Back to home */}
      <div className="absolute top-5 left-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Sheghelak" className="h-8 w-auto object-contain" />
          <span className="font-bold text-sm text-on-surface dark:text-white group-hover:text-primary transition-colors">
            Sheghelak
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* ── No token ── */}
        {noToken && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-error/10 dark:bg-error/20 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-error" />
            </div>
            <h1 className="text-xl font-bold text-on-surface dark:text-white mb-2">Invalid Link</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
              This password reset link is missing or invalid. Please request a new one.
            </p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/login')}>
              Back to Sign In
            </Button>
          </div>
        )}

        {/* ── Success ── */}
        {!noToken && success && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle size={30} className="text-tertiary" />
            </motion.div>
            <h1 className="text-xl font-bold text-on-surface dark:text-white mb-2">Password Updated!</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
              Your password has been changed successfully. All other sessions have been signed out for your security.
            </p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/login')}>
              Sign In Now
            </Button>
            <p className="text-xs text-outline dark:text-slate-500 mt-3">
              Redirecting automatically in {countdown}s…
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {!noToken && !success && (
          <>
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-1.5">
                Set New Password
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-error/10 border border-error/20 rounded-lg px-4 py-3 text-sm text-error mb-5 flex items-start gap-2"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                icon={Lock}
                rightIcon={showPass ? EyeOff : Eye}
                onRightIconClick={() => setShowPass(p => !p)}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="new-password"
              />
              <Input
                label="Confirm New Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat your password"
                icon={Lock}
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(''); }}
                autoComplete="new-password"
              />

              {/* Password strength hint */}
              {password.length > 0 && (
                <div className="space-y-1">
                  {[
                    { label: 'At least 8 characters', ok: password.length >= 8 },
                    { label: 'Contains a number', ok: /\d/.test(password) },
                    { label: 'Passwords match', ok: confirm.length > 0 && password === confirm },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center ${ok ? 'bg-tertiary' : 'bg-outline-variant dark:bg-white/15'}`}>
                        {ok && <svg viewBox="0 0 10 10" className="w-2 h-2 text-white" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>}
                      </div>
                      <span className={`text-xs ${ok ? 'text-tertiary' : 'text-outline dark:text-slate-500'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full !mt-5">
                {loading ? 'Updating…' : 'Update Password'}
              </Button>
            </form>

            <p className="text-center text-sm text-on-surface-variant dark:text-slate-400 mt-5">
              Remember it?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
