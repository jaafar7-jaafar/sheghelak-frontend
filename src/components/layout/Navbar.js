import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../modules/auth/AuthContext';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features',        href: '#features' },
    { label: 'How It Works',    href: '#how-it-works' },
    { label: 'Available Paths', href: '/paths', isRoute: true },
    { label: 'Testimonials',    href: '#testimonials' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Sheghelak" className="h-9 w-auto object-contain" />
          <span className="font-bold text-base text-on-surface dark:text-white tracking-tight">Sheghelak</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => l.isRoute ? (
            <Link
              key={l.label}
              to={l.href}
              className="text-sm font-medium text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ) : (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                className="flex items-center gap-2 text-sm font-medium text-on-surface dark:text-white hover:text-primary transition-colors"
              >
                <Avatar name={user.name} size="sm" />
                Dashboard
              </button>
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggle} className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant dark:text-slate-400">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileOpen(p => !p)} className="w-9 h-9 rounded flex items-center justify-center text-on-surface dark:text-white">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden glass-nav border-t border-outline-variant/30 dark:border-white/5 px-6 py-4 flex flex-col gap-3"
          >
            {navLinks.map(l => l.isRoute ? (
              <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-primary py-1">{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-on-surface-variant dark:text-slate-300 py-1">
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30 dark:border-white/5">
              {user ? (
                <>
                  <Button variant="secondary" size="sm" onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/dashboard'); setMobileOpen(false); }}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</Button>
                  <Button variant="primary" size="sm" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Get Started</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
