import api from './api';

const cheatsheetService = {
  getByLevel: async (levelId) => {
    const res = await api.get(`/cheatsheets/level/${levelId}`);
    return res.data;
  },

  createUrl: async (levelId, title, url) => {
    const res = await api.post(`/cheatsheets/level/${levelId}`, { title, url });
    return res.data;
  },

  uploadFile: async (levelId, file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    const res = await api.post(`/cheatsheets/level/${levelId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/cheatsheets/${id}`);
    return res.data;
  },
};

export default cheatsheetService;
