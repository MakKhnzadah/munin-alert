/**
 * Debug Helper Utility
 * 
 * Provides functions for debugging API requests and responses.
 * Helps identify issues with backend communication.
 */

/**
 * Log API request details
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 */
export const logApiRequest = (endpoint, data) => {
  console.group('🔷 API Request');
  console.log('Endpoint:', endpoint);
  console.log('Request Data:', data);
  console.groupEnd();
};

/**
 * Log API response details
 * @param {string} endpoint - API endpoint
 * @param {Object} response - Response data
 */
export const logApiResponse = (endpoint, response) => {
  console.group('🔶 API Response');
  console.log('Endpoint:', endpoint);
  console.log('Response:', response);
  console.groupEnd();
};

/**
 * Log API error details
 * @param {string} endpoint - API endpoint
 * @param {Error} error - Error object
 */
export const logApiError = (endpoint, error) => {
  console.group('❌ API Error');
  console.log('Endpoint:', endpoint);
  console.log('Error:', error);
  
  // Additional error details
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Status Text:', error.response.statusText);
    console.log('Headers:', error.response.headers);
    console.log('Data:', error.response.data);
  } else if (error.request) {
    console.log('No response received:', error.request);
  } else {
    console.log('Error setting up request:', error.message);
  }
  
  console.log('Error Config:', error.config);
  console.groupEnd();
};

/**
 * Test the backend connection
 * @returns {Promise} - Promise resolving to connection status
 */
export const testBackendConnection = async () => {
  try {
    // Use the public health endpoint exposed by backend WelcomeController
    const response = await fetch('/api/public/health');
    return {
      status: response.ok ? 'connected' : 'error',
      statusCode: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      status: 'failed',
      error: error.message
    };
  }
};