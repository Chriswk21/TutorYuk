import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor untuk handle token expired (401) atau unauthorized (403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Hanya redirect jika bukan sedang di halaman login/register
      if (!window.location.pathname.match(/^\/(login|register)/)) {
        localStorage.clear();
        window.$toast?.('Sesi Anda telah berakhir atau akses ditolak. Silakan login kembali.', 'error');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
