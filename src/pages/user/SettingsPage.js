import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Moon, Sun, Save } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import userService from '../../services/userService';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { isDark, toggle }   = useTheme();

  const [form, setForm]           = useState({ name: user?.name || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving]       = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileMsg, setProfileMsg]   = useState('');
  const [passMsg, setPassMsg]         = useState('');
  const [profileError, setProfileError] = useState('');
  const [passError, setPassError]       = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setProfileError('Name cannot be empty.'); return; }
    setSaving(true); setProfileError(''); setProfileMsg('');
    try {
      const res = await userService.updateProfile({ name: form.name.trim() });
      updateUser(res.data);
      setProfileMsg('Profile saved successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current)              { setPassError('Current password is required.'); return; }
    if (passwords.newPass.length < 8)    { setPassError('New password must be at least 8 characters.'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError('Passwords do not match.'); return; }
    setSavingPass(true); setPassError(''); setPassMsg('');
    try {
      await userService.updatePassword(passwords.current, passwords.newPass);
      setPassMsg('Password updated successfully.');
      setPasswords({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to update password.');
    } finally { setSavingPass(false); }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-on-surface dark:text-white mb-6">Settings</h1>

          {/* ── Profile ── */}
          <Card className="p-6 mb-5">
            <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-5">PROFILE</p>

            {/* Avatar display only — no upload */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={user?.name || ''} src={user?.avatarUrl} size="xl" />
              <div>
                <p className="font-semibold text-on-surface dark:text-white">{user?.name}</p>
                <p className="text-sm text-outline dark:text-slate-500">{user?.email}</p>
              </div>
            </div>

            {profileMsg && (
              <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg px-3 py-2 mb-4 text-sm text-tertiary">{profileMsg}</div>
            )}
            {profileError && (
              <div className="bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-4 text-sm text-error">{profileError}</div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                icon={User}
                value={form.name}
                onChange={e => setForm({ name: e.target.value })}
                placeholder="Your full name"
              />
              <Input
                label="Email address"
                type="email"
                value={user?.email || ''}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-outline dark:text-slate-500 -mt-2">Email cannot be changed.</p>
              <Button type="submit" variant="primary" size="sm" icon={Save} loading={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>

          {/* ── Password ── */}
          <Card className="p-6 mb-5">
            <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-5">CHANGE PASSWORD</p>
            {passMsg && (
              <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg px-3 py-2 mb-4 text-sm text-tertiary">{passMsg}</div>
            )}
            {passError && (
              <div className="bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-4 text-sm text-error">{passError}</div>
            )}
            <form onSubmit={handleSavePassword} className="space-y-4">
              <Input label="Current password" type="password" icon={Lock} placeholder="••••••••"
                value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                autoComplete="current-password" />
              <Input label="New password" type="password" icon={Lock} placeholder="Min. 8 characters"
                value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                autoComplete="new-password" />
              <Input label="Confirm new password" type="password" icon={Lock} placeholder="Repeat new password"
                value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                autoComplete="new-password" />
              <Button type="submit" variant="primary" size="sm" loading={savingPass}>Update Password</Button>
            </form>
          </Card>

          {/* ── Appearance ── */}
          <Card className="p-6">
            <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-5">APPEARANCE</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-on-surface dark:text-white">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-500">Toggle interface theme</p>
                </div>
              </div>
              <button onClick={toggle} aria-label="Toggle theme"
                className={`w-11 h-6 rounded-full transition-all duration-200 relative ${isDark ? 'bg-primary' : 'bg-outline-variant'}`}>
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                  style={{ left: isDark ? '22px' : '2px' }} />
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
