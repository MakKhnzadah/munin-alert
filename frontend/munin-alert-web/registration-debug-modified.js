// Registration debugging script - Modified without phoneNumber
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:8081';
const REGISTER_ENDPOINT = '/api/auth/register';

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
    // Removed phoneNumber field
};

console.log('====== REGISTRATION DEBUG SCRIPT (MODIFIED) ======');
console.log('Testing registration with the following data:');
console.log(userData);
console.log('\n');

// Step 1: Test basic connectivity
console.log('Step 1: Testing basic connectivity...');
fetch(`${API_BASE_URL}/`)
    .then(response => {
        console.log(`Root endpoint status: ${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        return performOptionsRequest();
    })
    .catch(error => {
        console.error('Error connecting to root endpoint:', error.message);
        return performOptionsRequest();
    });

// Step 2: Perform OPTIONS request (CORS preflight)
function performOptionsRequest() {
    console.log('\nStep 2: Testing OPTIONS request...');
    
    return fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: 'OPTIONS',
        headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
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
        
        return performRegistration();
    })
    .catch(error => {
        console.error('Error with OPTIONS request:', error.message);
        return performRegistration();
    });
}

// Step 3: Perform actual registration
function performRegistration() {
    console.log('\nStep 3: Testing actual registration...');
    
    return fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        console.log(`Registration status: ${response.status} ${response.statusText}`);
        console.log('Response headers:');
        
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });
        
        if (response.status === 200) {
            return response.json().then(data => {
                console.log('\nRegistration successful!');
                console.log('Response data:', data);
                
                // Additional details for verification
                if (data.token) {
                    console.log('\nJWT Token (first 20 chars):', data.token.substring(0, 20) + '...');
                }
                
                console.log('\nRegistration test PASSED ✅');
            });
        } else {
            return response.text().then(text => {
                console.error('\nRegistration failed!');
                try {
                    const json = JSON.parse(text);
                    console.error('Error details:', json);
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