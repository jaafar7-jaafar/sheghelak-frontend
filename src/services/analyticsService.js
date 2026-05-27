import api from './api';

const analyticsService = {
  getOverview: async () => {
    const res = await api.get('/analytics/overview');
    return res.data;
  },
};

export default analyticsService;
