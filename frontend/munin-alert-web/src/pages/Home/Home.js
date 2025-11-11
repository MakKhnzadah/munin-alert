import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import LogoShield from '../../assets/images/LogoShield.svg';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register'); // or '/login'
  };

  const handleLearnMore = () => {
    navigate('/about'); // or any page you have
  };

  // Key Features navigation handlers
  const goToAlerts = () => navigate('/alerts');
  const goToMap = () => navigate('/map');
  const goToGroups = () => navigate('/groups');
  const goToMessaging = () => navigate('/dashboard');
  // How It Works steps
  const stepRegister = () => navigate('/register');
  const stepGroups = () => navigate('/groups');
  const stepMap = () => navigate('/map');
  const stepAlarm = () => navigate('/alarm');

  // Make feature cards keyboard-activatable (Enter/Space)
  const keyActivate = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };
  return (
    <div className="home">
      <div className="hero-container">
        <div className="hero-content" role="banner">
          <div className="hero-logo" aria-label="Munin Alert Logo">
            <img src={LogoShield} alt="Munin Alert shield logo" className="logo-img" />
          </div>
          <h1 className="hero-title">MUNIN ALERT</h1>
          <p className="hero-tagline">Your comprehensive safety solution</p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={handleGetStarted}>GET STARTED</button>
            <button className="btn btn-outline" onClick={handleLearnMore}>LEARN MORE</button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-container">
          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={goToAlerts}
            onKeyDown={keyActivate(goToAlerts)}
            aria-label="Go to Alerts"
          >
            <div className="feature-icon">🔔</div>
            <h3>Real-time Alerts</h3>
            <p>Instantly notify your trusted contacts in case of emergency</p>
          </div>
          
          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={goToMap}
            onKeyDown={keyActivate(goToMap)}
            aria-label="Open Map for Location Tracking"
          >
            <div className="feature-icon">📍</div>
            <h3>Location Tracking</h3>
            <p>Share your location with trusted contacts for safety</p>
          </div>
          
          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={goToGroups}
            onKeyDown={keyActivate(goToGroups)}
            aria-label="Manage Groups"
          >
            <div className="feature-icon">👥</div>
            <h3>Group Safety</h3>
            <p>Create safety groups for family, friends, or team members</p>
          </div>
          
          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={goToMessaging}
            onKeyDown={keyActivate(goToMessaging)}
            aria-label="Emergency Messaging"
          >
            <div className="feature-icon">💬</div>
            <h3>Emergency Messaging</h3>
            <p>Quick communication during critical situations</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div
            className="step"
            role="button"
            tabIndex={0}
            onClick={stepRegister}
            onKeyDown={keyActivate(stepRegister)}
            aria-label="Step 1: Create an Account"
          >
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up and set up your safety profile</p>
          </div>
          
          <div
            className="step"
            role="button"
            tabIndex={0}
            onClick={stepGroups}
            onKeyDown={keyActivate(stepGroups)}
            aria-label="Step 2: Add Trusted Contacts"
          >
            <div className="step-number">2</div>
            <h3>Add Trusted Contacts</h3>
            <p>Create groups with family and friends</p>
          </div>
          
          <div
            className="step"
            role="button"
            tabIndex={0}
            onClick={stepMap}
            onKeyDown={keyActivate(stepMap)}
            aria-label="Step 3: Enable Location Sharing"
          >
            <div className="step-number">3</div>
            <h3>Enable Location Sharing</h3>
            <p>Share your location with your trusted contacts</p>
          </div>
          
          <div
            className="step"
            role="button"
            tabIndex={0}
            onClick={stepAlarm}
            onKeyDown={keyActivate(stepAlarm)}
            aria-label="Step 4: Activate When Needed"
          >
            <div className="step-number">4</div>
            <h3>Activate When Needed</h3>
            <p>Trigger alerts in emergency situations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
