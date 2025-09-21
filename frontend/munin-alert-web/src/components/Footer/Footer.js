import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * 
 * This component renders the application footer with navigation links,
 * resources, contact information, and social media links.
 * 
 * The footer is organized into sections:
 * - About Us: Information about the application and team
 * - Contact Us: Ways to reach out for support
 * - Resources: Help and safety information
 * - Social Media: Links to social platforms
 * 
 * @returns {JSX.Element} The rendered footer component
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main link sections */}
        <div className="footer-links">
          {/* First column of links */}
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>About Us</h2>
              <a href="/about">How it works</a>
              <a href="/about">Team</a>
              <a href="/about">Terms of Service</a>
            </div>
            <div className="footer-link-items">
              <h2>Contact Us</h2>
              <a href="/contact">Contact</a>
              <a href="/support">Support</a>
              <a href="/sponsorships">Sponsorships</a>
            </div>
          </div>
          
          {/* Second column of links */}
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>Resources</h2>
              <a href="/resources">Help Center</a>
              <a href="/resources">Safety Tips</a>
              <a href="/resources">Emergency Services</a>
            </div>
            <div className="footer-link-items">
              <h2>Social Media</h2>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
        
        {/* Footer bottom section with logo and copyright */}
        <div className="social-media">
          <div className="social-media-wrap">
            <div className="footer-logo">
              <a href="/" className="social-logo">
                Munin Alert
              </a>
            </div>
            <small className="website-rights">Munin Alert © {new Date().getFullYear()}</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
