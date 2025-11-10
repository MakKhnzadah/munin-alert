// Registration advanced debugging script
const fetch = require('node-fetch');
const https = require('https');

const API_BASE_URL = 'http://localhost:8081';
const REGISTER_ENDPOINT = '/api/auth/register';

// Create a custom agent that ignores SSL certificate issues (for local testing only)
const agent = new https.Agent({
    rejectUnauthorized: false
});

// Generate a unique username and email for testing
const timestamp = Date.now();
const username = `debug_user_${timestamp}`;
const email = `debug_${timestamp}@example.com`;

const userData = {
    firstName: 'Debug',
    lastName: 'User',
    username: username,
    email: email,
    password: 'password123'
};

console.log('====== ADVANCED REGISTRATION DEBUG SCRIPT ======');
console.log('Testing registration with the following data:');
console.log(userData);
console.log('\n');

// Step 1: Test basic connectivity with more details
console.log('Step 1: Testing basic connectivity...');
fetch(`${API_BASE_URL}/`)
    .then(response => {
        console.log(`Root endpoint status: ${response.status} ${response.statusText}`);
        console.log('Root endpoint headers:');
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        return testSecurityEndpoint();
    })
    .catch(error => {
        console.error('Error connecting to root endpoint:', error.message);
        return testSecurityEndpoint();
    });

// Step 2: Test a known security-related endpoint
function testSecurityEndpoint() {
    console.log('\nStep 2: Testing a security-related endpoint...');
    
    return fetch(`${API_BASE_URL}/api/public/health`, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    })
    .then(response => {
        console.log(`Security endpoint status: ${response.status} ${response.statusText}`);
        console.log('Response headers:');
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });
        
        return response.text();
    })
    .then(text => {
        console.log('Response body:', text || '(Empty response)');
        return performOptionsRequest();
    })
    .catch(error => {
        console.error('Error with security endpoint:', error.message);
        return performOptionsRequest();
    });
}

// Step 3: Perform OPTIONS request (CORS preflight) with detailed logging
function performOptionsRequest() {
    console.log('\nStep 3: Testing OPTIONS request...');
    
    return fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: 'OPTIONS',
        headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Accept'
        }
    })
    .then(response => {
        console.log(`OPTIONS request status: ${response.status} ${response.statusText}`);
        console.log('Response headers:');
        
        const headers = {};
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
            headers[name] = value;
        });
        
        // Analyze CORS headers
        console.log('\nCORS Header Analysis:');
        console.log(`Allow-Origin: ${headers['access-control-allow-origin'] || 'Not present'}`);
        console.log(`Allow-Methods: ${headers['access-control-allow-methods'] || 'Not present'}`);
        console.log(`Allow-Headers: ${headers['access-control-allow-headers'] || 'Not present'}`);
        console.log(`Allow-Credentials: ${headers['access-control-allow-credentials'] || 'Not present'}`);
        
        return performRegistration();
    })
    .catch(error => {
        console.error('Error with OPTIONS request:', error.message);
        return performRegistration();
    });
}

// Step 4: Perform registration with detailed request/response logging
function performRegistration() {
    console.log('\nStep 4: Testing actual registration...');
    console.log('Request details:');
    console.log('URL:', `${API_BASE_URL}${REGISTER_ENDPOINT}`);
    console.log('Method: POST');
    console.log('Headers:');
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
    };
    Object.entries(headers).forEach(([name, value]) => {
        console.log(`${name}: ${value}`);
    });
    console.log('Body:', JSON.stringify(userData, null, 2));
    
    return fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(userData)
    })
    .then(response => {
        console.log(`\nResponse status: ${response.status} ${response.statusText}`);
        console.log('Response headers:');
        
        const respHeaders = {};
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
            respHeaders[name] = value;
        });
        
        if (response.status === 200) {
            return response.json().then(data => {
                console.log('\nRegistration successful!');
                console.log('Response data:', data);
                
                if (data.token) {
                    console.log('\nJWT Token (first 20 chars):', data.token.substring(0, 20) + '...');
                }
                
                console.log('\nRegistration test PASSED ✅');
            });
        } else {
            return response.text().then(text => {
                console.error('\nRegistration failed!');
                try {
                    if (text && text.trim()) {
                        const json = JSON.parse(text);
                        console.error('Error details (JSON):', json);
                    } else {
                        console.error('Response body: (Empty response)');
                        
                        // Security analysis
                        console.log('\nSecurity Analysis:');
                        if (response.status === 403) {
                            console.log('403 Forbidden indicates a security policy is blocking the request.');
                            console.log('Possible reasons:');
                            console.log('1. CSRF protection is active but no token was provided');
                            console.log('2. Spring Security is blocking the request due to authorization rules');
                            console.log('3. A filter in the chain is rejecting the request');
                        }
                    }
                } catch (e) {
                    console.error('Response text:', text || '(Empty response)');
                }
                console.log('\nRegistration test FAILED ❌');
            });
        }
    })
    .catch(error => {
        console.error('Error with registration request:', error.message);
        console.log('\nRegistration test FAILED ❌');
    });
}