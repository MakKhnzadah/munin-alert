import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import LogoShield from '../../assets/images/LogoShield.svg';
import { useI18n } from '../../i18n/I18nContext';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

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
          <h1 className="hero-title">{t('brand.name')}</h1>
          <p className="hero-tagline">{t('brand.tagline')}</p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={handleGetStarted}>{t('home.getStarted')}</button>
            <button className="btn btn-outline" onClick={handleLearnMore}>{t('home.learnMore')}</button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
  <h2>{t('home.keyFeatures')}</h2>
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
            <h3>{t('home.features.alerts.title')}</h3>
            <p>{t('home.features.alerts.desc')}</p>
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
            <h3>{t('home.features.location.title')}</h3>
            <p>{t('home.features.location.desc')}</p>
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
            <h3>{t('home.features.groups.title')}</h3>
            <p>{t('home.features.groups.desc')}</p>
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
            <h3>{t('home.features.messaging.title')}</h3>
            <p>{t('home.features.messaging.desc')}</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
  <h2>{t('home.howItWorks')}</h2>
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
            <h3>{t('home.steps.1.title')}</h3>
            <p>{t('home.steps.1.desc')}</p>
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
            <h3>{t('home.steps.2.title')}</h3>
            <p>{t('home.steps.2.desc')}</p>
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
            <h3>{t('home.steps.3.title')}</h3>
            <p>{t('home.steps.3.desc')}</p>
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
            <h3>{t('home.steps.4.title')}</h3>
            <p>{t('home.steps.4.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
