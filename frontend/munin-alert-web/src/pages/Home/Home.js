import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-container">
        <h1>Munin Alert</h1>
        <p>Your comprehensive safety solution</p>
        <div className="hero-btns">
          <button className="btn btn-primary">GET STARTED</button>
          <button className="btn btn-outline">LEARN MORE</button>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Real-time Alerts</h3>
            <p>Instantly notify your trusted contacts in case of emergency</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location Tracking</h3>
            <p>Share your location with trusted contacts for safety</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Group Safety</h3>
            <p>Create safety groups for family, friends, or team members</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Emergency Messaging</h3>
            <p>Quick communication during critical situations</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up and set up your safety profile</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add Trusted Contacts</h3>
            <p>Create groups with family and friends</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Enable Location Sharing</h3>
            <p>Share your location with your trusted contacts</p>
          </div>
          
          <div className="step">
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
