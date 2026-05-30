import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pin } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import announcementService from '../../services/announcementService';
import notificationService from '../../services/notificationService';
import usePageTitle from '../../hooks/usePageTitle';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function AnnouncementsPage() {
  usePageTitle('Announcements');

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await announcementService.listAnnouncements({ limit: 50 });
      setAnnouncements(res.data?.announcements || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto mark all as read when page opens — update UI only on success
  useEffect(() => {
    notificationService.markAllRead()
      .then(() => setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true }))))
      .catch(() => null);
  }, []);

  const unread = announcements.filter(a => !a.isRead).length;

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-on-surface dark:text-white">Announcements</h1>
              {unread > 0 && <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">{unread} unread</p>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-sm text-primary hover:underline font-medium">Mark all as read</button>
            )}
          </div>

          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error">{error}</div>}

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : announcements.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-on-surface dark:text-white font-medium">No announcements yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`p-5 transition-all duration-200 hover:shadow-card-hover ${!a.isRead ? 'border-primary/20 dark:border-primary/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      {!a.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className={`text-sm font-semibold ${!a.isRead ? 'text-on-surface dark:text-white' : 'text-on-surface-variant dark:text-slate-300'} leading-snug flex-1`}>
                            {a.isPinned && <Pin size={12} className="inline-block mr-1.5 text-primary -mt-0.5" />}
                            {a.title}
                          </h3>
                          <span className="text-xs text-outline dark:text-slate-500 flex-shrink-0">{timeAgo(a.createdAt)}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">{a.body}</p>
                        <div className="flex items-center gap-2 mt-3">
                          {a.isPinned && <Badge color="blue"><Pin size={10} /> Pinned</Badge>}
                          {!a.isRead && <Badge color="blue">New</Badge>}
                        </div>
                      </div>
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
