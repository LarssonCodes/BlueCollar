import api from './axios.js';

export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const googleAuth = (data) => api.post('/api/auth/google', data);
export const getMe = () => api.get('/api/auth/me');
export const updatePassword = (data) => api.put('/api/auth/password', data);
