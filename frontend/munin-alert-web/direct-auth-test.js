// Direct authentication test script
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:8081';
const REGISTER_ENDPOINT = '/api/auth/register';
const LOGIN_ENDPOINT = '/api/auth/login';

// Function to register a new user
async function registerUser() {
    const timestamp = Date.now();
    const username = `test_user_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    
    const userData = {
        firstName: 'Test',
        lastName: 'User',
        username: username,
        email: email,
        password: 'password123'
    };
    
    console.log('====== DIRECT REGISTRATION TEST ======');
    console.log('Registering new user with data:', userData);
    
    try {
        console.log('Sending request to:', `${API_BASE_URL}${REGISTER_ENDPOINT}`);
        console.log('With headers:', {
            'Content-Type': 'application/json',
        });
        console.log('And body:', JSON.stringify(userData, null, 2));
        
        const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        console.log(`Registration status: ${response.status} ${response.statusText}`);
        console.log('Response headers:');
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            return { username, password: 'password123', token: data.token };
        } else {
            const text = await response.text();
            console.error('Registration failed:', text || '(Empty response)');
            return null;
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
        return null;
    }
}

// Function to login with existing credentials
async function loginUser(username, password) {
    console.log('\n====== DIRECT LOGIN TEST ======');
    console.log(`Logging in with username: ${username}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        console.log(`Login status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            return data.token;
        } else {
            const text = await response.text();
            console.error('Login failed:', text || '(Empty response)');
            return null;
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return null;
    }
}

// Function to test access to protected endpoints with token
async function testProtectedEndpoint(token) {
    if (!token) {
        console.log('\nSkipping protected endpoint test - no token available');
        return;
    }
    
    console.log('\n====== PROTECTED ENDPOINT TEST ======');
    console.log('Testing access to a protected endpoint with token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`Protected endpoint status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Protected endpoint data:', data);
        } else {
            const text = await response.text();
            console.error('Protected endpoint access failed:', text || '(Empty response)');
        }
    } catch (error) {
        console.error('Error accessing protected endpoint:', error.message);
    }
}

// Main execution flow
async function runTests() {
    // Step 1: Register a new user
    const registrationResult = await registerUser();
    
    // Step 2: Login with the new user (if registration succeeded)
    if (registrationResult) {
        const token = await loginUser(registrationResult.username, registrationResult.password);
        
        // Step 3: Test access to a protected endpoint
        await testProtectedEndpoint(token || registrationResult.token);
    }
}

// Run all tests
runTests();