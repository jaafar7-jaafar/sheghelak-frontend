import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Save, Link } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SkeletonLine } from '../../components/ui/Skeleton';
import telegramService from '../../services/telegramService';

export default function AdminSettingsPage() {
  usePageTitle('Platform Settings');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    telegramService.getSettings()
      .then(res => {
        setTelegramUrl(res.data?.communityUrl || '');
        setTelegramEnabled(res.data?.isEnabled ?? true);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load settings. Please refresh the page.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      await telegramService.updateSettings({ communityUrl: telegramUrl, isEnabled: telegramEnabled });
      setMsg('Settings saved successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-on-surface dark:text-white mb-6">Admin Settings</h1>

          <Card className="p-6 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
                <Send size={17} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-on-surface dark:text-white text-sm">Telegram Community</p>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">Manage the community link shown to all users</p>
              </div>
            </div>

            {msg && <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg p-3 mb-4 text-sm text-tertiary">{msg}</div>}
            {error && <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4 text-sm text-error">{error}</div>}

            {loading ? <SkeletonLine height="h-10" className="mb-3" /> : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-on-surface dark:text-slate-200">Community URL</label>
                  <div className="relative">
                    <Link size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
                    <input type="url" value={telegramUrl} onChange={e => setTelegramUrl(e.target.value)} placeholder="https://t.me/your_community" className="input-field pl-9" required />
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-slate-500">This URL is dynamically loaded in all user dashboards. Never hardcoded.</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container dark:bg-white/5">
                  <div>
                    <p className="text-sm font-medium text-on-surface dark:text-white">Show Community Button</p>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">Toggle visibility for all users</p>
                  </div>
                  <button type="button" onClick={() => setTelegramEnabled(p => !p)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative ${telegramEnabled ? 'bg-primary' : 'bg-outline-variant dark:bg-slate-600'}`}>
                    <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200" style={{ left: telegramEnabled ? '22px' : '2px' }} />
                  </button>
                </div>
                <Button type="submit" variant="primary" size="sm" icon={Save} loading={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            )}
          </Card>

          <Card className="p-6">
            <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">PLATFORM INFO</p>
            <div className="space-y-3">
              {[
                { label: 'Platform Name', value: 'Sheghelak.com' },
                { label: 'Version', value: 'v1.0.0' },
                { label: 'Environment', value: process.env.NODE_ENV || 'development' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-outline-variant/20 dark:border-white/5 last:border-0">
                  <span className="text-sm text-on-surface-variant dark:text-slate-400">{item.label}</span>
                  <span className="text-sm font-medium text-on-surface dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
