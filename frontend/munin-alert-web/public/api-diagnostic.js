// api-diagnostic.js
// A tool to diagnose API connectivity issues

document.addEventListener('DOMContentLoaded', () => {
  // Create diagnostic UI
  const diagContainer = document.createElement('div');
  diagContainer.style.position = 'fixed';
  diagContainer.style.bottom = '10px';
  diagContainer.style.right = '10px';
  diagContainer.style.zIndex = '9999';
  diagContainer.style.backgroundColor = '#f0f0f0';
  diagContainer.style.border = '1px solid #ccc';
  diagContainer.style.padding = '10px';
  diagContainer.style.borderRadius = '5px';
  diagContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
  diagContainer.style.maxWidth = '400px';
  diagContainer.style.maxHeight = '300px';
  diagContainer.style.overflow = 'auto';
  diagContainer.style.display = 'flex';
  diagContainer.style.flexDirection = 'column';
  diagContainer.style.gap = '10px';

  const title = document.createElement('h3');
  title.textContent = 'API Diagnostics';
  title.style.margin = '0';
  title.style.padding = '0';
  diagContainer.appendChild(title);

  const testButtons = [
    {
      label: 'Test Root Endpoint',
      endpoint: '',
      method: 'GET'
    },
    {
      label: 'Test API Health',
      endpoint: '/api/public/health',
      method: 'GET'
    },
    {
      label: 'Test Register Endpoint',
      endpoint: '/api/auth/register',
      method: 'OPTIONS'
    }
  ];

  const resultDiv = document.createElement('div');
  resultDiv.style.fontSize = '12px';
  resultDiv.style.fontFamily = 'monospace';
  resultDiv.style.whiteSpace = 'pre-wrap';
  resultDiv.style.overflow = 'auto';
  resultDiv.style.maxHeight = '200px';
  resultDiv.style.border = '1px solid #ddd';
  resultDiv.style.padding = '5px';
  resultDiv.style.backgroundColor = '#fff';

  testButtons.forEach(test => {
    const button = document.createElement('button');
    button.textContent = test.label;
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => runTest(test.endpoint, test.method, resultDiv));
    diagContainer.appendChild(button);
  });

  diagContainer.appendChild(resultDiv);
  document.body.appendChild(diagContainer);
});

async function runTest(endpoint, method, resultDiv) {
  resultDiv.innerHTML = `Running ${method} test for endpoint: ${endpoint || '/'} ...`;

  const baseUrl = 'http://localhost:8081';
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const options = {
      method: method,
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    };

    const startTime = performance.now();
    const response = await fetch(url, options);
    const endTime = performance.now();

    let responseData = '';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        responseData = JSON.stringify(responseData, null, 2);
      } else {
        responseData = await response.text();
      }
    } catch (e) {
      responseData = '(No response body or not parseable)';
    }

    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result = `
Status: ${response.status} ${response.statusText}
Time: ${Math.round(endTime - startTime)}ms
Headers: ${JSON.stringify(headers, null, 2)}

Response: 
${responseData}
`;

    resultDiv.innerHTML = response.ok ? 
      `✅ Success!\n${result}` : 
      `❌ Error!\n${result}`;

    resultDiv.style.color = response.ok ? 'green' : 'red';
    
  } catch (error) {
    resultDiv.innerHTML = `❌ Connection Error!\n\n${error.message}\n\nThis usually indicates a CORS issue or the server is not running.`;
    resultDiv.style.color = 'red';
    console.error('API Test Error:', error);
  }
}