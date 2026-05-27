import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Main axios instance — attaches access token automatically
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends HttpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach access token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — auto-refresh on 401 ───────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Redirect to login — the auth context will handle redirect
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Token storage (memory + sessionStorage fallback) ────────────────────────
// Access tokens live in memory (not localStorage — XSS protection)
// SessionStorage is only a tab-level fallback for page refresh
let _accessToken = null;

export const setAccessToken = (token) => {
  _accessToken = token;
  sessionStorage.setItem('_at', token);
};

export const getAccessToken = () => {
  return _accessToken || sessionStorage.getItem('_at') || null;
};

export const clearAccessToken = () => {
  _accessToken = null;
  sessionStorage.removeItem('_at');
};

export default api;
