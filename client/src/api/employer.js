import api from './axios.js';

export const getProfile = () => api.get('/api/employer/profile');
export const createProfile = (data) => api.post('/api/employer/profile', data);
export const updateProfile = (data) => api.put('/api/employer/profile', data);
export const getEmployerStats = () => api.get('/api/employer/stats');
export const getRecentEmployerJobs = () => api.get('/api/employer/jobs/recent');
