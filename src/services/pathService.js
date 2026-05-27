import api from './api';

const pathService = {
  listPaths: async (params = {}) => {
    const res = await api.get('/paths', { params });
    return res.data;
  },

  getPath: async (id) => {
    const res = await api.get(`/paths/${id}`);
    return res.data;
  },

  createPath: async (data) => {
    const res = await api.post('/paths', data);
    return res.data;
  },

  toggleLevelLock: async (levelId, lock) => {
    const res = await api.post(`/paths/levels/${levelId}/toggle-lock`, { lock });
    return res.data;
  },

  updateLevel: async (levelId, data) => {
    const res = await api.patch(`/paths/levels/${levelId}`, data);
    return res.data;
  },

  deleteLevel: async (levelId) => {
    const res = await api.delete(`/paths/levels/${levelId}`);
    return res.data;
  },

  updatePath: async (id, data) => {
    const res = await api.patch(`/paths/${id}`, data);
    return res.data;
  },

  deletePath: async (id) => {
    const res = await api.delete(`/paths/${id}`);
    return res.data;
  },

  createLevel: async (pathId, data) => {
    const res = await api.post(`/paths/${pathId}/levels`, data);
    return res.data;
  },

  assignPath: async (userId, pathId) => {
    const res = await api.post('/paths/assign', { userId, pathId });
    return res.data;
  },
};

export default pathService;
