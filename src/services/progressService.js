import api from './api';

const progressService = {
  getMyProgress: async () => {
    const res = await api.get('/progress/me');
    return res.data;
  },
};

export default progressService;
