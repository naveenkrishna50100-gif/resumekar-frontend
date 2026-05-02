import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('rk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (fullName, email, password) =>
  api.post('/api/auth/signup', { fullName, email, password });

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const getProfile = () => api.get('/api/profile');
export const updateProfile = (data) => api.put('/api/profile', data);
export const saveCV = (cvText, cvFilename) =>
  api.post('/api/profile/cv', { cvText, cvFilename });

export const evaluateJob = (jobDescription, jobUrl) =>
  api.post('/api/evaluate', { jobDescription, jobUrl });

export const getHistory = () => api.get('/api/evaluate/history');
export const getPaymentStatus = () => api.get('/api/payments/status');

export const createSubscription = (plan) =>
  api.post('/api/payments/create-subscription', { plan });

export const verifyPayment = (data) =>
  api.post('/api/payments/verify', data);
export default api;
