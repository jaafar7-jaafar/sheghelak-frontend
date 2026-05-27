import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Send, Pin } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import announcementService from '../../services/announcementService';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', isPinned: false });
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await announcementService.listAnnouncements({ limit: 50 });
      setAnnouncements(res.data?.announcements || []);
    } catch {
      setError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    setSending(true);
    setError('');
    try {
      const res = await announcementService.createAnnouncement(form);
      setAnnouncements(prev => [res.data, ...prev]);
      setForm({ title: '', body: '', isPinned: false });
      setShowForm(false);
      setSuccess('Announcement sent to all users!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await announcementService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Failed to delete announcement.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-on-surface dark:text-white">Announcements</h1>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(p => !p)}>New Announcement</Button>
          </div>

          {success && <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg p-3 mb-4 text-sm text-tertiary">{success}</div>}
          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4 text-sm text-error">{error}</div>}

          {showForm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 mb-6 border-primary/20 dark:border-primary/30">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">CREATE ANNOUNCEMENT</p>
                <form onSubmit={handleCreate} className="space-y-3">
                  <input type="text" placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" required />
                  <textarea placeholder="Write the announcement body..." value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4} className="input-field resize-none" required />
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface dark:text-white">
                    <input type="checkbox" checked={form.isPinned} onChange={e => setForm(p => ({ ...p, isPinned: e.target.checked }))} className="rounded" />
                    Pin this announcement
                  </label>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" variant="primary" size="sm" icon={Send} loading={sending}>
                      {sending ? 'Sending...' : 'Send to All Users'}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : (
            <div className="space-y-3">
              {announcements.length === 0 && <Card className="p-8 text-center"><p className="text-sm text-outline dark:text-slate-500">No announcements yet.</p></Card>}
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-semibold text-on-surface dark:text-white">{a.title}</h3>
                          {a.isPinned && <Badge color="blue"><Pin size={10} /> Pinned</Badge>}
                        </div>
                        <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed mb-2">{a.body}</p>
                        <p className="text-xs text-outline dark:text-slate-500">{new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className={`text-outline dark:text-slate-600 hover:text-error transition-colors flex-shrink-0 p-1 ${deleting === a.id ? 'opacity-50' : ''}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
