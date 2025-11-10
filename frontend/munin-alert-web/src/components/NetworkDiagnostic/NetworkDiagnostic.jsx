import React, { useState } from 'react';
import './NetworkDiagnostic.css';

/**
 * NetworkDiagnostic Component
 * 
 * A development tool to diagnose network connectivity issues between
 * the frontend and backend. This component provides a UI to test various
 * endpoints and inspect the responses.
 */
const NetworkDiagnostic = () => {
  const [visible, setVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = 'http://localhost:8081';

  const tests = [
    { name: 'Root Endpoint', url: '/', method: 'GET' },
    { name: 'Health Check', url: '/api/public/health', method: 'GET' },
    { name: 'Register Options', url: '/api/auth/register', method: 'OPTIONS' },
    { name: 'Register Test', url: '/api/auth/register', method: 'POST', body: {
      firstName: "Test",
      lastName: "User",
      username: `testuser${Math.floor(Math.random() * 1000)}`,
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: "password123",
      phoneNumber: "1234567890"
    }}
  ];

  const runTest = async (test) => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      console.log(`Testing ${test.method} ${baseUrl}${test.url}`, options);
      
      const response = await fetch(`${baseUrl}${test.url}`, options);
      const endTime = Date.now();
      
      let responseBody;
      let responseType = 'unknown';
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseBody = await response.json();
          responseType = 'json';
        } else {
          responseBody = await response.text();
          responseType = 'text';
        }
      } catch (e) {
        responseBody = `Error parsing response: ${e.message}`;
      }

      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      setResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: test.name,
        url: `${test.method} ${baseUrl}${test.url}`,
        status: response.status,
        statusText: response.statusText,
        time: endTime - startTime,
        headers: headers,
        body: responseBody,
        type: responseType,
        success: response.ok
      }, ...prev]);
    } catch (error) {
      const endTime = Date.now();
      setResults(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        test: test.name,
        url: `${test.method} ${baseUrl}${test.url}`,
        error: error.message,
        time: endTime - startTime,
        success: false
      }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = () => {
    tests.forEach(test => runTest(test));
  };

  const clearResults = () => {
    setResults([]);
  };

  if (!visible) {
    return (
      <button className="network-diagnostic-toggle" onClick={() => setVisible(true)}>
        🔍 Network
      </button>
    );
  }

  return (
    <div className="network-diagnostic">
      <div className="network-diagnostic-header">
        <h2>Network Diagnostic</h2>
        <button onClick={() => setVisible(false)}>Close</button>
      </div>
      <div className="network-diagnostic-actions">
        <button onClick={runAllTests} disabled={loading}>Run All Tests</button>
        <button onClick={clearResults}>Clear Results</button>
      </div>
      <div className="network-diagnostic-tests">
        {tests.map((test, index) => (
          <button 
            key={index} 
            onClick={() => runTest(test)} 
            disabled={loading} 
            className="test-button"
          >
            {test.name}
          </button>
        ))}
      </div>
      <div className="network-diagnostic-results">
        <h3>Results</h3>
        {results.length === 0 ? (
          <p>No tests run yet</p>
        ) : (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                <div className="result-header">
                  <span className="result-timestamp">{result.timestamp}</span>
                  <span className="result-test">{result.test}</span>
                  <span className={`result-status ${result.success ? 'success' : 'error'}`}>
                    {result.status ? `${result.status} ${result.statusText}` : result.error}
                  </span>
                  <span className="result-time">{result.time}ms</span>
                </div>
                <div className="result-url">{result.url}</div>
                {result.headers && (
                  <div className="result-details">
                    <strong>Headers:</strong>
                    <pre>{JSON.stringify(result.headers, null, 2)}</pre>
                  </div>
                )}
                {result.body && (
                  <div className="result-details">
                    <strong>Body:</strong>
                    <pre>{result.type === 'json' ? JSON.stringify(result.body, null, 2) : result.body}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDiagnostic;