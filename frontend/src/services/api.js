import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true // Support session cookies
});

// Request Interceptor: Automatically attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    // Attempt to extract JWT token from local storage
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth failures globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // 401: Unauthorized (token expired or not provided)
    if (status === 401) {
      localStorage.removeItem('jwt_token');
      // Redirect to login page if we aren't already there or registering
      if (
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    
    // 403: Forbidden (incorrect role access permissions)
    if (status === 403) {
      console.error('Forbidden: You do not have permissions for this action.');
    }
    
    return Promise.reject(error.response?.data || error.message || error);
  }
);

export default api;
