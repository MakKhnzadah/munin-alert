import React, { useState } from 'react';
import { testRegistrationApi, getCsrfToken } from '../../utils/BackendTest';

/**
 * Backend Test Component
 * 
 * A utility component for directly testing backend API endpoints
 */
const BackendTest = () => {
  const [testData, setTestData] = useState({
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '1234567890'
  });
  
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({ ...prev, [name]: value }));
  };

  const runRegistrationTest = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      // First try to get CSRF token
      const csrfResult = await getCsrfToken();
      console.log('CSRF Token Result:', csrfResult);
      
      // Now test registration
      const result = await testRegistrationApi(testData);
      setTestResults(result);
      console.log('Registration Test Result:', result);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Backend API Test</h2>
      <p>Use this page to directly test API endpoints</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Registration API</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={testData.firstName} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={testData.lastName} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={testData.username} 
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={testData.email} 
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <input 
            type="text" 
            name="password" 
            value={testData.password} 
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Phone Number</label>
          <input 
            type="text" 
            name="phoneNumber" 
            value={testData.phoneNumber} 
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          onClick={runRegistrationTest}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Registration API'}
        </button>
      </div>
      
      {testResults && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: testResults.success ? '#d4edda' : '#f8d7da',
          borderRadius: '4px'
        }}>
          <h3>Test Results</h3>
          <pre style={{ overflow: 'auto', maxHeight: '400px', backgroundColor: '#f5f5f5', padding: '10px' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BackendTest;