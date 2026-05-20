import axios from 'axios';

// Safe env detection: Vite uses import.meta.env, CRA uses process.env
const API_URL = (() => {
  try {
    // Vite
    if (import.meta?.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
  } catch (_) { /* not Vite */ }
  try {
    // CRA
    if (process?.env?.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  } catch (_) { /* not CRA */ }
  return 'http://localhost:5000/api';
})();

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// --- Request interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set Content-Type automatically for FormData
    // (it needs to include the multipart boundary — don't override it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (config.data !== undefined) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect on auth failure for protected routes, not login/register
      const url = error.config?.url || '';
      const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;