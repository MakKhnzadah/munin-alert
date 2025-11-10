// diagnostic-test.js - Complete registration flow tester
// Run with: node diagnostic-test.js

const fetch = require('node-fetch');

// Configuration
const BACKEND_URL = 'http://localhost:8081';
const REGISTER_ENDPOINT = '/api/auth/register';
const HEALTH_ENDPOINT = '/api/public/health';
const ROOT_ENDPOINT = '/';

// Test user data
const testUser = {
  firstName: "Diagnostic",
  lastName: "Test",
  username: "diagtest" + Date.now().toString().slice(-4),
  email: "diagtest" + Date.now().toString().slice(-4) + "@example.com",
  password: "password123",
  phoneNumber: "1234567890"
};

// Console formatting
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

function logStep(step) {
  console.log(colors.blue + "\n=== " + step + " ===" + colors.reset);
}

function logSuccess(message) {
  console.log(colors.green + "✓ " + message + colors.reset);
}

function logWarning(message) {
  console.log(colors.yellow + "⚠ " + message + colors.reset);
}

function logError(message) {
  console.log(colors.red + "✗ " + message + colors.reset);
}

function logInfo(message) {
  console.log(colors.cyan + "ℹ " + message + colors.reset);
}

// Test functions
async function testBackendConnection() {
  logStep("Testing Backend Connection");
  
  try {
    const response = await fetch(BACKEND_URL + ROOT_ENDPOINT);
    
    if (response.ok) {
      logSuccess(`Backend server is running. Status: ${response.status}`);
      const body = await response.text();
      logInfo(`Response: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
      return true;
    } else {
      logError(`Backend server returned error status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to connect to backend: ${error.message}`);
    return false;
  }
}

async function testHealthEndpoint() {
  logStep("Testing Health Endpoint");
  
  try {
    const response = await fetch(BACKEND_URL + HEALTH_ENDPOINT);
    
    if (response.ok) {
      logSuccess(`Health endpoint is working. Status: ${response.status}`);
      const body = await response.text();
      logInfo(`Response: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
      return true;
    } else {
      logError(`Health endpoint returned error status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to connect to health endpoint: ${error.message}`);
    return false;
  }
}

async function testRegisterEndpointOptions() {
  logStep("Testing Register Endpoint with OPTIONS");
  
  try {
    const response = await fetch(BACKEND_URL + REGISTER_ENDPOINT, {
      method: 'OPTIONS'
    });
    
    // OPTIONS should return either 200 or 204
    if (response.status === 200 || response.status === 204) {
      logSuccess(`Register endpoint accepts OPTIONS. Status: ${response.status}`);
      
      // Check CORS headers
      const allowOrigin = response.headers.get('access-control-allow-origin');
      const allowMethods = response.headers.get('access-control-allow-methods');
      const allowHeaders = response.headers.get('access-control-allow-headers');
      
      if (allowOrigin) {
        logSuccess(`CORS Origin: ${allowOrigin}`);
      } else {
        logWarning("Missing CORS Access-Control-Allow-Origin header");
      }
      
      if (allowMethods) {
        logSuccess(`CORS Methods: ${allowMethods}`);
      } else {
        logWarning("Missing CORS Access-Control-Allow-Methods header");
      }
      
      if (allowHeaders) {
        logSuccess(`CORS Headers: ${allowHeaders}`);
      } else {
        logWarning("Missing CORS Access-Control-Allow-Headers header");
      }
      
      return true;
    } else {
      logError(`Register endpoint OPTIONS returned error status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to send OPTIONS to register endpoint: ${error.message}`);
    return false;
  }
}

async function testRegisterEndpoint() {
  logStep("Testing Register Endpoint with POST");
  
  try {
    const response = await fetch(BACKEND_URL + REGISTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    logInfo(`Request body: ${JSON.stringify(testUser, null, 2)}`);
    
    if (response.ok) {
      logSuccess(`Registration successful! Status: ${response.status}`);
      const body = await response.json();
      logInfo(`Response: ${JSON.stringify(body, null, 2)}`);
      return true;
    } else {
      logError(`Registration failed with status: ${response.status}`);
      
      try {
        const errorBody = await response.text();
        logInfo(`Error response: ${errorBody}`);
      } catch (e) {
        logInfo("No response body available");
      }
      
      return false;
    }
  } catch (error) {
    logError(`Failed to send registration request: ${error.message}`);
    logInfo("This might indicate a CORS issue or another network problem");
    return false;
  }
}

// Run all tests
async function runAllTests() {
  logStep("STARTING DIAGNOSTIC TESTS");
  logInfo(`Backend URL: ${BACKEND_URL}`);
  logInfo(`Test User: ${testUser.username} / ${testUser.email}`);
  
  const connectionOk = await testBackendConnection();
  const healthOk = await testHealthEndpoint();
  const optionsOk = await testRegisterEndpointOptions();
  const registerOk = await testRegisterEndpoint();
  
  logStep("DIAGNOSTIC SUMMARY");
  console.log("Backend Connection: " + (connectionOk ? colors.green + "OK" : colors.red + "FAILED"));
  console.log("Health Endpoint: " + (healthOk ? colors.green + "OK" : colors.red + "FAILED"));
  console.log("Register OPTIONS: " + (optionsOk ? colors.green + "OK" : colors.red + "FAILED"));
  console.log("Registration: " + (registerOk ? colors.green + "OK" : colors.red + "FAILED") + colors.reset);
  
  if (registerOk) {
    logSuccess("Registration works! The issue might be in your browser or frontend code.");
    logInfo("Try using the standalone test page at: http://localhost:3000/api-test.html");
  } else {
    if (!connectionOk) {
      logError("Backend server connection issue detected. Make sure the server is running on port 8081.");
    } else if (!healthOk) {
      logError("Health endpoint issue detected. The server is running but the health endpoint is not accessible.");
    } else if (!optionsOk) {
      logError("CORS issue detected. The server needs proper CORS configuration.");
    } else {
      logError("Registration endpoint issue detected. Check the backend logs for details.");
    }
  }
}

// Execute all tests
runAllTests().catch(error => {
  logError(`Unexpected error during diagnostics: ${error.message}`);
});