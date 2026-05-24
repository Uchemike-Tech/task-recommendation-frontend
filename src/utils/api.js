import axios from 'axios';

const API_URL = 'https://task-recommendation-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (username, password) => api.post('/login', { username, password }),
  register: (username, password) => api.post('/register', { username, password }),
};

export const tasksApi = {
  getAll: () => api.get('/tasks'),
  complete: (taskId) => api.put(`/tasks/${taskId}/complete`),
  reset: () => api.post('/reset_tasks'),
};

export const recommendationApi = {
  get: () => api.get('/recommendation'),
};

export const profileApi = {
  get: () => api.get('/profile'),
};

export default api;
