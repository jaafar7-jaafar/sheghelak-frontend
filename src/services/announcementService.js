import api from './api';

const announcementService = {
  listAnnouncements: async (params = {}) => {
    const res = await api.get('/announcements', { params });
    return res.data;
  },

  createAnnouncement: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },
};

export default announcementService;
