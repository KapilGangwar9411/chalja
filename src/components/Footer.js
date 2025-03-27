import React from 'react';
import '../assets/styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-tagline">
          <span className="tagline-first">fading moments, </span>
          <span className="tagline-second">eternal frames.</span>
        </h2>
        <div className="footer-credit">
          Developed with<span className="footer-heart">♥</span>by
          <a 
            href="https://brandupcreatives.in/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            brandupcreatives.in👋
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
