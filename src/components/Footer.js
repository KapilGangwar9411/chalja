import React from 'react';
import '../assets/styles.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <p>
          Designed and developed by
          <a 
            href="https://brandupcreatives.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            <br></br>
            brandupcreatives.in👋
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
