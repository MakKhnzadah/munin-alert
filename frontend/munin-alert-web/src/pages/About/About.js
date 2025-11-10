import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Munin Alert</h1>
        <p>Munin Alert is a safety platform designed to help individuals and groups stay connected and informed during emergencies.</p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>To empower people with real-time alerting, location awareness, and coordinated group safety tools.</p>
      </section>

      <section className="about-section">
        <h2>Core Features</h2>
        <ul className="features-list">
          <li>Instant emergency alerts to trusted contacts</li>
          <li>Live location sharing during active alerts</li>
          <li>Group safety coordination and roles</li>
          <li>Secure profile-based access with privacy controls</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Roadmap Preview</h2>
        <ul className="features-list">
          <li>Geo-fenced smart alerts</li>
          <li>Offline fallback messaging</li>
          <li>Advanced analytics for group coordinators</li>
          <li>Multi-language accessibility</li>
        </ul>
      </section>

      <section className="about-section contact">
        <h2>Get Involved</h2>
        <p>Have ideas or want to contribute? Reach out to the team and help shape the future of safety technology.</p>
      </section>
    </div>
  );
};

export default About;
