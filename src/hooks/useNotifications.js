import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await notificationService.listNotifications({ limit: 20 });
      setNotifications(res.data?.notifications || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      // silent — notifications are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, loading, refetch: fetch, markRead, markAllRead };
}
