// test-register.js - Utility to test registration directly
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegister() {
  const userData = {
    firstName: "Test",
    lastName: "User",
    username: "testuser" + Math.floor(Math.random() * 1000),
    email: "test" + Math.floor(Math.random() * 1000) + "@example.com",
    password: "password123",
    phoneNumber: "1234567890"
  };
  
  console.log("Attempting to register user:", userData);
  
  try {
    const response = await fetch("http://localhost:8081/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(userData)
    });
    
    console.log("Response status:", response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Registration successful:", data);
    } else {
      const errorText = await response.text();
      console.error("Registration failed:", errorText);
    }
  } catch (error) {
    console.error("Error during registration:", error.message);
  }
}

testRegister();