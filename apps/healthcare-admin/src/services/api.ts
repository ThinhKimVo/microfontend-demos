import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('healthcare-admin-auth');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthcare-admin-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
