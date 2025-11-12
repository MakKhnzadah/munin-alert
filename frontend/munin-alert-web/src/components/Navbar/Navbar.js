import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import LogoShield from '../../assets/images/LogoShield.svg';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Navbar Component
 * 
 * This component renders the application's top navigation bar.
 * It displays different navigation options based on the user's authentication status:
 * - For logged-in users: Dashboard, Alerts, Groups, Profile, and Logout
 * - For guests: Home, Login, and Register
 * 
 * The component uses the AuthContext to access user information and logout functionality.
 * 
 * @returns {JSX.Element} The rendered navbar component
 */
const Navbar = () => {
  // Get authentication context and navigation function
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  /**
   * Handles user logout
   * Calls the logout function from AuthContext and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* App logo/name that links to home */}
        <Link to="/" className="navbar-logo">
          <img src={LogoShield} alt="Munin Alert" className="navbar-logo-img" />
          <span className="navbar-logo-text">Munin Alert</span>
        </Link>
        
        {/* Navigation menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">{t('nav.home')}</Link>
          </li>
          
          {/* Conditional rendering based on authentication status */}
          {user ? (
            // Navigation items for authenticated users
            <>
              <li className="nav-item"><Link to="/dashboard" className="nav-link">{t('nav.dashboard')}</Link></li>
              <li className="nav-item"><Link to="/alerts" className="nav-link">{t('nav.alerts')}</Link></li>
              <li className="nav-item"><Link to="/groups" className="nav-link">{t('nav.groups')}</Link></li>
              <li className="nav-item"><Link to="/settings" className="nav-link">{t('nav.settings')}</Link></li>
              <li className="nav-item"><Link to="/profile" className="nav-link">{t('nav.profile')}</Link></li>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-btn">{t('nav.logout')}</button>
              </li>
            </>
          ) : (
            // Navigation items for guests
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">{t('nav.register')}</Link>
              </li>
            </>
          )}
          <li className="nav-item"><LanguageSwitcher /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
