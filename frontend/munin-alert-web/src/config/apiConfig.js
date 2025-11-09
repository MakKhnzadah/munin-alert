/**
 * Backend Configuration
 * 
 * This file contains configuration settings for connecting to the backend server.
 * Centralizing these settings makes it easier to switch between environments.
 */

// Backend server URL
export const API_BASE_URL = 'http://localhost:8081';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    FORGOT_USERNAME: '/api/auth/forgot-username',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  },
  
  // User endpoints
  USER: {
    CURRENT: '/api/users/current',
    PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password'
  },
  
  // Health check
  HEALTH: '/api/public/health'
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Get full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} - Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Get basic authentication configuration for axios
 * @returns {Object} - Axios configuration object
 */
export const getBaseConfig = () => {
  return {
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: DEFAULT_HEADERS,
    withCredentials: false  // Changed to false to avoid CORS credential issues
  };
};