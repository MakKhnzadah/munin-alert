import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { logApiRequest, logApiResponse, logApiError } from '../utils/DebugHelper';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Set default auth header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch current user info
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout(); // Clear invalid token
      setLoading(false);
    }
  };

  /**
   * Authenticate user with credentials
   * 
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {boolean} - Success status
   */
  const login = async (identifier, password) => {
    try {
      setError(null);
      console.log('Login attempt with:', { identifier });
      const response = await axios.post('/api/auth/login', { identifier, password });
      const { token, userId, username: responseUsername } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set minimal user then enrich by fetching full profile
      setUser({ id: userId, username: responseUsername });

      // Fetch full current user profile immediately
      await fetchCurrentUser();
      
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        // No response received
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Other error
        setError('Login failed. Please try again.');
      }
      return false;
    }
  };

  /**
   * Register a new user
   * 
   * @param {Object} userData - User data including firstName, lastName, username, email, password
   * @returns {Promise} - Response data from the API
   * @throws {Error} - If registration fails
   */
  const register = async (userData) => {
    try {
      setError(null);
      
      // Ensure all required fields are present
      const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }
      
      // Log request data for debugging
      logApiRequest('/api/auth/register', userData);
      
      // Add explicit headers for better Spring Boot compatibility
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log('Making registration request to:', axios.defaults.baseURL + '/api/auth/register');
      
      const response = await axios.post('/api/auth/register', userData, config);
      
      // Log successful response
      logApiResponse('/api/auth/register', response.data);
      console.log('Registration successful:', response.data);
      
      return response.data;
    } catch (err) {
      // Log detailed error information
      logApiError('/api/auth/register', err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error details:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
        
        const serverError = err.response.data?.message || 
                           `Registration failed. Server error (${err.response.status}).`;
        setError(serverError);
        throw err; // Throw original error to preserve details
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Network error details:', {
          request: err.request,
          message: err.message
        });
        
        const networkError = 'Unable to connect to server. Please check your internet connection and ensure the backend is running on port 8081.';
        setError(networkError);
        throw err; // Throw original error to preserve details
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'Registration failed. Please try again.');
        throw err;
      }
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove default auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setUser, // expose for profile updates
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
