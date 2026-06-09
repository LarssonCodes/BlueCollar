import api from './axios.js';

export const createJob = (data) => api.post('/api/jobs', data);
export const getEmployerJobs = () => api.get('/api/employer/jobs');
export const getJobById = (id) => api.get(`/api/jobs/${id}`);
export const getJobs = (params) => api.get('/api/jobs', { params });
export const updateJob = (id, data) => api.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);
export const fillJob = (id) => api.put(`/api/jobs/${id}/fill`);
