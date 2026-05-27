import api from './api';

const authService = {
  // Returns { user, accessToken }
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data; // { success, message, data: { user, accessToken } }
  },

  // Returns { user, accessToken }
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { success, message, data: { user, accessToken } }
  },

  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  // Returns { accessToken }
  refresh: async () => {
    const res = await api.post('/auth/refresh');
    return res.data;
  },

  // Returns user object
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data; // { success, message, data: user }
  },
};

export default authService;
