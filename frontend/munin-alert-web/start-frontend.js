// Start script for Munin Alert frontend
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Munin Alert frontend application...');

// Function to check if a port is in use
function isPortInUse(port) {
  try {
    execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

// Kill any process using port 3000 if needed
if (isPortInUse(3000)) {
  console.log('Port 3000 is already in use. Attempting to free it...');
  try {
    execSync('npx kill-port 3000', { stdio: 'inherit' });
    console.log('Port 3000 has been freed.');
  } catch (e) {
    console.log('Could not automatically free port 3000. You may need to close the application using it manually.');
  }
}

// Create temporary .env.local to override any problematic settings
const envContent = `
BROWSER=none
PORT=3000
FAST_REFRESH=true
DISABLE_ESLINT_PLUGIN=true
`;

fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
console.log('Created temporary .env.local configuration');

// Start the development server with specific options
console.log('Starting React development server...');
try {
  // Use cross-env to set environment variables that work on all platforms
  execSync('npx cross-env REACT_APP_DISABLE_WATCHER=true PORT=3000 BROWSER=none react-scripts start', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3000',
      BROWSER: 'none'
    }
  });
} catch (e) {
  console.error('Error starting the development server:', e.message);
  process.exit(1);
}