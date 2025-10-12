/**
 * Health Check Endpoint
 * 
 * This file sets up a mock health check endpoint to verify the backend connectivity.
 * It's a temporary solution to help debug API connection issues.
 */

import axios from 'axios';

/**
 * Set up a mock health check endpoint
 */
const setupHealthCheckEndpoint = () => {
  const mockAdapter = axios.interceptors.response.use(
    response => response,
    error => {
      // Check if this is a health check request
      if (error.config?.url === '/api/public/health') {
        // Return a mock health check response
        console.log('Mocking health check response');
        return Promise.resolve({
          status: 200,
          data: {
            status: 'up',
            timestamp: new Date().toISOString(),
            message: 'This is a mock health check response'
          }
        });
      }
      return Promise.reject(error);
    }
  );
  
  console.log('Health check endpoint mock configured');
  return mockAdapter;
};

export default setupHealthCheckEndpoint;