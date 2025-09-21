import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

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
      
      {/* Main content area */}
      <main className="main-content">
        <Routes>
          {/* Public routes - accessible to all users */}
          <Route path="/" element={<Home />} />
          
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
