/**
 * Backend Test Utility
 * 
 * This file contains functions to test and debug the backend connection.
 * It provides direct fetch calls to the backend to verify endpoints.
 */

/**
 * Test the registration API with a direct fetch call
 * @param {Object} userData - User data for registration
 * @returns {Promise} - Promise resolving to registration response
 */
export const testRegistrationApi = async (userData) => {
  try {
    const response = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    // Get response data
    const data = await response.json().catch(e => ({}));
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Network error when testing registration API'
    };
  }
};

/**
 * Get CSRF token if Spring Security requires it
 * @returns {Promise} - Promise resolving to CSRF token
 */
export const getCsrfToken = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/csrf', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        token: data.token,
        headerName: data.headerName || 'X-CSRF-TOKEN'
      };
    }
    
    return {
      success: false,
      error: `Failed to get CSRF token: ${response.status} ${response.statusText}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error when getting CSRF token: ${error.message}`
    };
  }
};