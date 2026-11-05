
import axios from 'axios';

// Backend origin WITHOUT trailing slash
export const API_ORIGIN = 'https://scholl-backend-1.onrender.com';

// All API calls go through /api
export const API_URL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser/Axios set the correct multipart boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
