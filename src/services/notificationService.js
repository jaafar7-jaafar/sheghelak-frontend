import api from './api';

const notificationService = {
  listNotifications: async (params = {}) => {
    const res = await api.get('/notifications', { params });
    return res.data;
  },

  markRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
};

export default notificationService;
