import api from './axios.js';

export const getProfile = () => api.get('/api/worker/profile');
export const createProfile = (data) => api.post('/api/worker/profile', data);
export const updateProfile = (data) => api.put('/api/worker/profile', data);
export const getWorkerStats = () => api.get('/api/worker/stats');
export const getRecentWorkerApplications = () => api.get('/api/worker/applications/recent');
