import axios from 'axios';

// API base URL
const API_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User-related API calls
export const userService = {
  // Get current user
  getCurrentUser: () => apiClient.get('/users/current'),
  
  // Get user by ID
  getUserById: (userId) => apiClient.get(`/users/${userId}`),
  
  // Update user profile
  updateProfile: (userData) => apiClient.put('/users/profile', userData),
  
  // Update user location
  updateLocation: (location) => apiClient.post('/users/location', location),
  
  // Get user's groups
  getUserGroups: () => apiClient.get('/users/groups'),
};

// Group-related API calls
export const groupService = {
  // Get all groups
  getAllGroups: () => apiClient.get('/groups'),
  
  // Get group by ID
  getGroupById: (groupId) => apiClient.get(`/groups/${groupId}`),
  
  // Create new group
  createGroup: (groupData) => apiClient.post('/groups', groupData),
  
  // Update group
  updateGroup: (groupId, groupData) => apiClient.put(`/groups/${groupId}`, groupData),
  
  // Delete group
  deleteGroup: (groupId) => apiClient.delete(`/groups/${groupId}`),
  
  // Add user to group
  addUserToGroup: (groupId, userId) => apiClient.post(`/groups/${groupId}/users/${userId}`),
  
  // Remove user from group
  removeUserFromGroup: (groupId, userId) => apiClient.delete(`/groups/${groupId}/users/${userId}`),
};

// Alert-related API calls
export const alertService = {
  // Get all alerts
  getAllAlerts: () => apiClient.get('/alerts'),
  
  // Get user's alerts
  getUserAlerts: () => apiClient.get('/alerts/user'),
  
  // Get group alerts
  getGroupAlerts: (groupId) => apiClient.get(`/alerts/group/${groupId}`),
  
  // Get alert by ID
  getAlertById: (alertId) => apiClient.get(`/alerts/${alertId}`),
  
  // Create new alert
  createAlert: (alertData) => apiClient.post('/alerts', alertData),
  
  // Update alert
  updateAlert: (alertId, alertData) => apiClient.put(`/alerts/${alertId}`, alertData),
  
  // Update alert status
  updateAlertStatus: (alertId, status) => apiClient.put(`/alerts/${alertId}/status`, { status }),
  
  // Delete alert
  deleteAlert: (alertId) => apiClient.delete(`/alerts/${alertId}`),
  
  // Get alerts near location
  getAlertsNearLocation: (lat, lng, radius) => 
    apiClient.get(`/alerts/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`),
};
