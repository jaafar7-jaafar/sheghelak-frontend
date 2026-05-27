import api from './api';

const userService = {
  // Admin
  listUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  getUser: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  },

  // Own profile
  updateProfile: async (data) => {
    const res = await api.patch('/users/me', data);
    return res.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const res = await api.patch('/users/me/password', { currentPassword, newPassword });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  changeUserPath: async (userId, pathId) => {
    const res = await api.patch(`/users/${userId}/path`, { pathId });
    return res.data;
  },

  removeUserPath: async (userId) => {
    const res = await api.delete(`/users/${userId}/path`);
    return res.data;
  },

  // Avatar upload
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Remove avatar
  deleteAvatar: async () => {
    const res = await api.delete('/uploads/avatar');
    return res.data;
  },
};

export default userService;
