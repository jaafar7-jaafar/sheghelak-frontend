import api from './api';

const telegramService = {
  getSettings: async () => {
    const res = await api.get('/telegram');
    return res.data;
  },

  updateSettings: async (data) => {
    const res = await api.put('/telegram', data);
    return res.data;
  },
};

export default telegramService;
