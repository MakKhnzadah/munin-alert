/**
 * Backend Connection Checker
 * 
 * Utility to test and diagnose backend connection issues.
 * It can help users identify and fix common problems that prevent
 * the frontend from connecting to the backend server.
 */

import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from '../config/apiConfig';

/**
 * Check if backend is reachable
 * @returns {Promise<Object>} - Connection status details
 */
export const checkBackendConnection = async () => {
  try {
    console.log(`Checking backend connection to ${API_BASE_URL}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Check multiple endpoints to provide better diagnostics
    console.log('Testing connection to root endpoint:', API_BASE_URL);
    console.log('Testing connection to auth endpoint:', `${API_BASE_URL}/api/auth/register`);
    
    // Try the root endpoint first (which we confirmed is working)
    const rootResponse = await fetch(API_BASE_URL, {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }).catch(error => {
      if (error.name === 'AbortError') {
        throw new Error('Connection timed out');
      }
      console.error('Error connecting to root endpoint:', error);
      throw error;
    });
    
    console.log('Root endpoint response:', rootResponse.status, rootResponse.statusText);
    
    // Check the registration endpoint with OPTIONS method to avoid actually registering a user
    const authResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      signal: controller.signal,
      method: 'OPTIONS',
      headers: { 'Accept': 'application/json' }
    }).catch(error => {
      console.error('Error checking auth endpoint:', error);
      // Don't throw here, continue to health check
    });
    
    if (authResponse) {
      console.log('Auth endpoint response:', authResponse.status, authResponse.statusText);
    } else {
      console.log('Auth endpoint check failed');
    }
    
    // Now try the health endpoint
    const response = await fetch(getApiUrl(API_ENDPOINTS.HEALTH), {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }).catch(error => {
      if (error.name === 'AbortError') {
        throw new Error('Connection timed out');
      }
      console.error('Error connecting to health endpoint:', error);
      throw error;
    });
    
    clearTimeout(timeoutId);
    
    // Even if we get a non-200 response, the server is responding
    console.log(`Backend responded with status ${response.status}`);
    
    return {
      connected: response.ok,
      status: response.status,
      statusText: response.statusText,
      serverReachable: true
    };
  } catch (error) {
    console.error('Backend connection check failed:', error);
    
    // Determine if this is a CORS issue or server unreachable
    const isCorsError = error.message.includes('CORS') || error.message.includes('cross-origin');
    const isNetworkError = error.message.includes('Network') || 
                          error.message.includes('Failed to fetch') ||
                          error.message.includes('timed out');
    
    return {
      connected: false,
      serverReachable: !isNetworkError,
      corsIssue: isCorsError,
      errorType: isCorsError ? 'CORS' : isNetworkError ? 'NETWORK' : 'UNKNOWN',
      errorMessage: error.message,
      troubleshooting: getTroubleshootingSteps(isCorsError, isNetworkError)
    };
  }
};

/**
 * Get troubleshooting steps based on error type
 * @param {boolean} isCorsError - If the issue is related to CORS
 * @param {boolean} isNetworkError - If the issue is a network error
 * @returns {Array<string>} - List of troubleshooting steps
 */
const getTroubleshootingSteps = (isCorsError, isNetworkError) => {
  const commonSteps = [
    `Make sure the backend server is running on ${API_BASE_URL}`,
    'Check that the backend application has started successfully without errors'
  ];
  
  const corsSteps = [
    'Verify CORS configuration in the backend',
    'Add the frontend origin to the allowed origins in backend CORS configuration',
    `Example Spring configuration: @CrossOrigin(origins = "http://localhost:3000")`
  ];
  
  const networkSteps = [
    'Check if the backend server is running',
  `Verify you can access the API at ${API_BASE_URL}/api/public/health in your browser`,
    'Ensure firewall settings allow connections to the backend port',
    'Verify the PORT environment variable is set correctly for the backend'
  ];
  
  if (isCorsError) {
    return [...commonSteps, ...corsSteps];
  } else if (isNetworkError) {
    return [...commonSteps, ...networkSteps];
  }
  
  return [
    ...commonSteps,
    ...networkSteps,
    ...corsSteps
  ];
};

/**
 * Check backend startup status
 * @returns {Object} - Backend status information
 */
export const getBackendStatus = async () => {
  const connection = await checkBackendConnection();
  
  return {
    ...connection,
    tips: connection.connected ? [] : getBackendStartupTips()
  };
};

/**
 * Get tips for starting the backend
 * @returns {Array<string>} - List of tips
 */
const getBackendStartupTips = () => [
  'Start the backend server with: `cd ../backend && ./gradlew bootRun` or `cd ../backend && mvn spring-boot:run`',
  'Check for error messages in the backend console',
  'Verify the backend is configured to run on port 8081',
  'If needed, adjust the API_BASE_URL in the frontend config file'
];

/**
 * Format console messages for better visibility
 * @param {string} message - Message to display
 * @param {string} type - Message type (info, error, success, warning)
 * @returns {string} - Formatted message
 */
export const formatConsoleMessage = (message, type = 'info') => {
  const styles = {
    info: 'background: #0077cc; color: white; padding: 2px 5px; border-radius: 3px;',
    error: 'background: #cc0000; color: white; padding: 2px 5px; border-radius: 3px;',
    success: 'background: #00cc77; color: white; padding: 2px 5px; border-radius: 3px;',
    warning: 'background: #ff9900; color: white; padding: 2px 5px; border-radius: 3px;'
  };
  
  console.log(`%c ${type.toUpperCase()} `, styles[type], message);
  return message;
};