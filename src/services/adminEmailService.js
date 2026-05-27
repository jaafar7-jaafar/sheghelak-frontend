import api from './api';

const adminEmailService = {
  send: async (data) => {
    const res = await api.post('/admin-emails/send', data);
    return res.data;
  },

  getLogs: async () => {
    const res = await api.get('/admin-emails/logs');
    return res.data;
  },

  getUsers: async (search = '') => {
    const res = await api.get('/admin-emails/users', { params: { search } });
    return res.data;
  },
};

export default adminEmailService;
