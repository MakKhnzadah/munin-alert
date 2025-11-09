import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlarmProvider } from './context/AlarmContext';
import setupHealthCheckEndpoint from './utils/HealthCheck';
import axios from 'axios';
import { getBaseConfig, API_BASE_URL } from './config/apiConfig';

// Configure Axios with settings from config
const axiosConfig = getBaseConfig();
axios.defaults.baseURL = axiosConfig.baseURL;
axios.defaults.timeout = axiosConfig.timeout;
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  ...axiosConfig.headers
};
axios.defaults.withCredentials = axiosConfig.withCredentials;

// Set up health check endpoint mock
setupHealthCheckEndpoint();

// Log startup information
console.log(`
🚀 Munin Alert Frontend
====================
✅ Frontend running at: ${window.location.origin}
🔌 Connecting to backend at: ${API_BASE_URL}
⚙️ Environment: ${process.env.NODE_ENV}
`);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AlarmProvider>
          <App />
        </AlarmProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
