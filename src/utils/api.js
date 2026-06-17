import axios from 'axios';

// Define your backend URLs - Read from environment variables
const BACKENDS = {
  primary: process.env.REACT_APP_PRIMARY_BACKEND || 'https://task-recommendation-backend-production.up.railway.app',
  fallback: process.env.REACT_APP_FALLBACK_BACKEND || 'https://task-recommendation-backend.onrender.com'
};

// Track which backend is currently active
let currentBackend = BACKENDS.primary;
let currentBaseURL = BACKENDS.primary;

// Create axios instance function
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 8000, // 8 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - handle errors
  instance.interceptors.response.use(
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

  return instance;
};

let api = createAxiosInstance(BACKENDS.primary);

// Enhanced request function with fallback logic
const makeRequest = async (method, endpoint, data = null, config = {}) => {
  try {
    // Try primary backend
    if (method === 'get') {
      return await api.get(endpoint, config);
    } else if (method === 'post') {
      return await api.post(endpoint, data, config);
    } else if (method === 'put') {
      return await api.put(endpoint, data, config);
    } else if (method === 'delete') {
      return await api.delete(endpoint, config);
    }
  } catch (primaryError) {
    // If we haven't tried fallback yet and primary failed
    if (currentBackend === BACKENDS.primary) {
      console.warn('⚠️ Primary backend failed, attempting fallback...');
      currentBackend = BACKENDS.fallback;
      currentBaseURL = BACKENDS.fallback;
      api = createAxiosInstance(BACKENDS.fallback);

      try {
        // Retry with fallback backend
        if (method === 'get') {
          console.log(`✅ Using fallback backend: ${endpoint}`);
          return await api.get(endpoint, config);
        } else if (method === 'post') {
          console.log(`✅ Using fallback backend: ${endpoint}`);
          return await api.post(endpoint, data, config);
        } else if (method === 'put') {
          console.log(`✅ Using fallback backend: ${endpoint}`);
          return await api.put(endpoint, data, config);
        } else if (method === 'delete') {
          console.log(`✅ Using fallback backend: ${endpoint}`);
          return await api.delete(endpoint, config);
        }
      } catch (fallbackError) {
        console.error('❌ Both backends failed. Primary error:', primaryError.message, 'Fallback error:', fallbackError.message);
        throw new Error(`Both backends are unavailable. Primary: ${primaryError.message}`);
      }
    } else {
      // Already on fallback, just throw the error
      console.error('❌ Fallback backend error:', primaryError.message);
      throw primaryError;
    }
  }
};

// Get current active backend URL (useful for debugging)
export const getCurrentBackend = () => currentBaseURL;

// Reset to primary backend (call this on app startup or recovery attempts)
export const resetBackend = () => {
  currentBackend = BACKENDS.primary;
  currentBaseURL = BACKENDS.primary;
  api = createAxiosInstance(BACKENDS.primary);
  console.log('🔄 Backend reset to primary');
};

// Auth API with fallback
export const authApi = {
  login: (username, password) => 
    makeRequest('post', '/login', { username, password }),
  register: (username, password) => 
    makeRequest('post', '/register', { username, password }),
};

// Tasks API with fallback
export const tasksApi = {
  getAll: () => 
    makeRequest('get', '/tasks'),
  complete: (taskId) => 
    makeRequest('put', `/tasks/${taskId}/complete`),
  reset: () => 
    makeRequest('post', '/reset_tasks'),
};

// Recommendation API with fallback
export const recommendationApi = {
  get: () => 
    makeRequest('get', '/recommendation'),
};

// Profile API with fallback
export const profileApi = {
  get: () => 
    makeRequest('get', '/profile'),
};

export default api;
