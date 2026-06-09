import api from './axios.js';

export const applyToJob = (jobId, data) => api.post(`/api/jobs/${jobId}/apply`, data);
export const getWorkerApplications = () => api.get('/api/worker/applications');
export const getJobApplications = (jobId) => api.get(`/api/jobs/${jobId}/applications`);
export const shortlistApplication = (appId) => api.put(`/api/applications/${appId}/shortlist`);
export const rejectApplication = (appId) => api.put(`/api/applications/${appId}/reject`);
