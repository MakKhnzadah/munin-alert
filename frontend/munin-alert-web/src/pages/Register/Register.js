import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logApiError } from '../../utils/DebugHelper';
import { checkBackendConnection, formatConsoleMessage } from '../../utils/BackendConnectionChecker';
import { API_BASE_URL } from '../../config/apiConfig';
import './Register.css';

/**
 * Register Component
 * 
 * Handles user registration with form validation and error handling
 */
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '', // Added username field to match backend requirements
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkBackendConnection();
      setBackendStatus(status);
      
      formatConsoleMessage(`Backend connection check: ${status.connected ? 'SUCCESS' : 'FAILED'}`, 
                         status.connected ? 'success' : 'error');
      
      if (!status.connected) {
        if (status.corsIssue) {
          setError(`CORS issue detected. The backend server is running but not accepting requests from this origin.`);
        } else if (!status.serverReachable) {
          setError(`Unable to connect to server. Please check your internet connection and make sure the backend is running on port 8081.`);
        } else {
          setError(`Backend connection issue: ${status.errorMessage || 'Unknown error'}`);
        }
        
        // Log troubleshooting steps
        if (status.troubleshooting) {
          console.group('🔧 Troubleshooting Steps');
          status.troubleshooting.forEach((step, index) => {
            console.log(`${index + 1}. ${step}`);
          });
          console.groupEnd();
        }
      }
    };
    
    checkConnection();
  }, []);

  /**
   * Updates form data state when input values change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }
    
    // If username isn't provided, generate one from email
    if (!formData.username) {
      formData.username = formData.email.split('@')[0];
    }
    
    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...userData } = formData;
      
      console.log('Sending registration data:', userData);
      
      // Display the exact data being sent to the backend
      console.group('📤 Registration Request');
      console.log('Request URL:', `${API_BASE_URL}/api/auth/register`);
      console.log('Request Body:', userData);
      console.groupEnd();
      
      // Use direct fetch with improved CORS handling
      console.log('Starting registration fetch with URL:', `${API_BASE_URL}/api/auth/register`);
      
      // First, test if CORS is correctly configured with an OPTIONS request
      console.log('Testing CORS with OPTIONS request...');
      try {
        const optionsResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
          }
        });
        
        console.log('OPTIONS response status:', optionsResponse.status);
        console.log('OPTIONS response headers:', Object.fromEntries([...optionsResponse.headers.entries()]));
        
        if (optionsResponse.status !== 200) {
          console.warn('OPTIONS request failed, but proceeding with registration attempt anyway');
        }
      } catch (optionsErr) {
        console.error('OPTIONS request failed:', optionsErr);
        // Continue with registration attempt even if OPTIONS fails
      }
      
      // Now send the actual registration request
      console.log('Registration request headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      console.log('Registration request body:', JSON.stringify(userData));
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        mode: 'cors'
      });
      
      console.log('Registration response status:', response.status);
      console.log('Registration response headers:', Object.fromEntries([...response.headers.entries()]));
      
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        
        // Show success message then redirect
        alert('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        const errorText = await response.text();
        console.error('Registration failed with status:', response.status, errorText);
        throw new Error(`Registration failed with status: ${response.status}`);
      }
    } catch (err) {
      // Use the debug helper for detailed error logging
      logApiError('/api/auth/register', err);
      
      // Handle network errors without response object
      if (err.message?.includes('NetworkError') || err.name === 'TypeError') {
        // Network connectivity issue
        setError('Unable to connect to server. Please check your internet connection and make sure the backend is running on port 8081.');
      } else if (err.message?.includes('Network Error')) {
        // Network connectivity issue
        setError('Unable to connect to server. Please check your internet connection and make sure the backend is running on port 8081.');
      } else if (err.message?.includes('CORS')) {
        // CORS issue
        setError('Cross-Origin Resource Sharing (CORS) issue detected. The backend server is running but not accepting requests from this origin. Please check CORS configuration on the server.');
        
        console.error('CORS ERROR DETECTED! Here are some troubleshooting steps:');
        console.log('1. Make sure your backend has proper CORS headers set');
        console.log('2. Check if the backend allows requests from this origin:', window.location.origin);
        console.log('3. Try accessing the API directly from an API client or test script');
      } else if (err.message) {
        // Other error with message
        setError(`${err.message} (Check browser console for details)`);
      } else {
        // Generic fallback
        setError('Registration failed. Please check browser console for details.');
      }
      
      // Provide detailed debug information in console
      console.error('=== REGISTRATION ERROR DETAILS ===');
      console.error('Error object:', err);
      console.error('API URL:', `${API_BASE_URL}/api/auth/register`);
      console.error('Origin:', window.location.origin);
      console.error('==============================');
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>
        
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={formData.username} 
              onChange={handleChange} 
              required
              minLength="3"
              maxLength="20"
            />
            <small>Username must be between 3-20 characters</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber"
              value={formData.phoneNumber} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required
              minLength="6"
            />
            <small>Password must be at least 6 characters</small>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
