import api from './axios.js';

export const getAdminStats = () => api.get('/api/admin/stats');

export const getAdminUsers = (params) => api.get('/api/admin/users', { params });

export const deleteAdminUser = (id) => api.delete(`/api/admin/users/${id}`);

export const getAdminJobs = (params) => api.get('/api/admin/jobs', { params });

export const deleteAdminJob = (id) => api.delete(`/api/admin/jobs/${id}`);
