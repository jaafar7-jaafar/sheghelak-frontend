import api from './api';

const taskService = {
  getTasksByLevel: async (levelId) => {
    const res = await api.get(`/tasks/level/${levelId}`);
    return res.data;
  },

  createTask: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  updateTask: async (id, data) => {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  completeTask: async (id) => {
    const res = await api.post(`/tasks/${id}/complete`);
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  addResource: async (taskId, data) => {
    const res = await api.post(`/tasks/${taskId}/resources`, data);
    return res.data;
  },

  uploadResourceFile: async (taskId, file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    const res = await api.post(`/tasks/${taskId}/resources/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteResource: async (resourceId) => {
    const res = await api.delete(`/tasks/resources/${resourceId}`);
    return res.data;
  },
};

export default taskService;
