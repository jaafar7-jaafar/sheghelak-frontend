import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, Bell, Settings, LogOut, Moon, Sun, Menu, X, Send, ChevronRight, Users as UsersIcon, ListChecks, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../modules/auth/AuthContext';
import Avatar from '../components/ui/Avatar';
import telegramService from '../services/telegramService';

const USER_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'My Path', icon: BookOpen, to: '/dashboard/path' },
  { label: 'Tasks', icon: CheckSquare, to: '/dashboard/tasks' },
  { label: 'Announcements', icon: Bell, to: '/dashboard/announcements' },
  { label: 'Submissions', icon: Send, to: '/dashboard/submissions' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const ADMIN_NAV = [
  { label: 'Overview',       icon: LayoutDashboard, to: '/admin' },
  { label: 'Users',          icon: UsersIcon,        to: '/admin/users' },
  { label: 'Paths',          icon: BookOpen,         to: '/admin/paths' },
  { label: 'Tasks',          icon: ListChecks,       to: '/admin/tasks' },
  { label: 'Announcements',  icon: Bell,             to: '/admin/announcements' },
  { label: 'Submissions',    icon: Send,             to: '/admin/submissions' },
  { label: 'Emails',         icon: Mail,             to: '/admin/emails' },
  { label: 'Settings',       icon: Settings,         to: '/admin/settings' },
];

function SidebarContent({ nav, onClose }) {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [telegram, setTelegram] = useState({ isEnabled: false, communityUrl: '' });

  useEffect(() => {
    telegramService.getSettings()
      .then(res => setTelegram(res.data || { isEnabled: false, communityUrl: '' }))
      .catch(() => setTelegram({ isEnabled: false, communityUrl: '' }));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-outline-variant/30 dark:border-white/5">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Sheghelak" className="h-8 w-auto object-contain flex-shrink-0" />
          <span className="font-bold text-sm text-on-surface dark:text-white tracking-tight">Sheghelak</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-label-caps text-outline dark:text-slate-500 font-geist px-3 mb-3">NAVIGATION</p>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Telegram button (only for users, URL from settings) */}
      {user?.role !== 'admin' && telegram.isEnabled && (
        <div className="px-3 pb-3">
          <a
            href={telegram.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded bg-primary/8 dark:bg-primary/15 text-primary hover:bg-primary/12 dark:hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Send size={15} />
              <span className="text-sm font-semibold">Join Community</span>
            </div>
            <ChevronRight size={14} />
          </a>
        </div>
      )}

      {/* Bottom: user + theme */}
      <div className="px-3 pb-4 pt-3 border-t border-outline-variant/30 dark:border-white/5 space-y-1">
        <button
          onClick={toggle}
          className="sidebar-item w-full"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Avatar name={user?.name || ''} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-outline dark:text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-outline dark:text-slate-500 hover:text-error transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, isAdmin = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  return (
    <div className="flex h-screen bg-background dark:bg-slate-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] flex-shrink-0 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/30 dark:border-white/5">
        <SidebarContent nav={nav} />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/30 dark:border-white/5 md:hidden flex flex-col"
            >
              <SidebarContent nav={nav} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-outline-variant/30 dark:border-white/5 bg-surface-container-lowest dark:bg-slate-900 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="text-on-surface dark:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Sheghelak" className="h-7 w-auto object-contain" />
            <span className="font-bold text-sm text-on-surface dark:text-white">Sheghelak</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
