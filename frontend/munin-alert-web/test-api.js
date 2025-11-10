const fetch = require('node-fetch');

async function testRegistration() {
  try {
    const response = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'password123',
        phoneNumber: '1234567890'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegistration();
