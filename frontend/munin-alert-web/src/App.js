import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import NetworkDiagnostic from './components/NetworkDiagnostic/NetworkDiagnostic';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AlertPage from './pages/Alert/AlertPage';
import GroupsPage from './pages/Groups/GroupsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import NotFound from './pages/NotFound/NotFound';
import BackendTest from './pages/BackendTest/BackendTest';
import SettingsPage from './pages/Settings/SettingsPage';
import ActivateAlarmPage from './pages/Alarm/ActivateAlarmPage';
import AlarmCountdownPage from './pages/Alarm/AlarmCountdownPage';
import MapPage from './pages/Map/MapPage';



import About from './pages/About/About';

/**
 * App Component
 * 
 * The main application component that sets up the routing structure
 * and provides the overall layout (Navbar, main content area, Footer).
 * 
 * Features:
 * - Routing with react-router-dom
 * - Authentication-based route protection
 * - Redirects for authenticated/unauthenticated users
 * - Consistent layout across all pages
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // Get authentication status from context
  const { user } = useAuth();

  return (
    <div className="app">
      {/* Global navigation */}
      <Navbar />
      
      {/* Network Diagnostic Tool (only in development mode) */}
      {process.env.NODE_ENV === 'development' && <NetworkDiagnostic />}
      
      {/* Main content area */}
      <main className="main-content">
        <Routes>
          {/* Public routes - accessible to all users */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Guest-only routes - redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/alerts" 
            element={user ? <AlertPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups" 
            element={user ? <GroupsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <SettingsPage /> : <Navigate to="/login" />} 
          />
          <Route
            path="/alarm"
            element={user ? <ActivateAlarmPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/alarm/countdown"
            element={user ? <AlarmCountdownPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/map"
            element={user ? <MapPage /> : <Navigate to="/login" />}
          />
          
          
          {/* Utilities */}
          <Route path="/backend-test" element={<BackendTest />} />


          {/* Fallback route for non-existent paths */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Global footer */}
      <Footer />
    </div>
  );
}

export default App;
