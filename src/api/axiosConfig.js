import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token if exists in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gradeassure_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle JWT invalid / expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    if (response) {
      // Backend returns 502 (Bad Gateway) with message "Jwt invalid" or standard 401 (Unauthorized)
      const isJwtInvalid = response.status === 502 && response.data && typeof response.data === 'string' && response.data.includes('Jwt');
      const isUnauthorized = response.status === 401;

      if (isJwtInvalid || isUnauthorized) {
        localStorage.removeItem('gradeassure_token');
        localStorage.removeItem('gradeassure_role');
        localStorage.removeItem('gradeassure_email');
        
        // Redirect to login page if we are not already on an auth page
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
