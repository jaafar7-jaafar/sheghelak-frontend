import api from './api';

const submissionService = {
  listSubmissions: async (params = {}) => {
    const res = await api.get('/submissions', { params });
    return res.data;
  },

  getSubmission: async (id) => {
    const res = await api.get(`/submissions/${id}`);
    return res.data;
  },

  createSubmission: async (data) => {
    const res = await api.post('/submissions', data);
    return res.data;
  },

  reviewSubmission: async (id, status, feedback = '') => {
    const res = await api.patch(`/submissions/${id}/review`, { status, feedback });
    return res.data;
  },
};

export default submissionService;
