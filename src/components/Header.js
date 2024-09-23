import React, { useState, useEffect } from 'react';
import '../assets/styles.css';

const Header = ({ openForm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.getElementById('hamburger');

    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header id="main-header" className="header">
      <div className="logo-container">
        <img src="images/black.png" alt="Spectrum Logo" className="logo" />
      </div>
      <nav>
        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="/events">Events & Bookings</a></li>
        </ul>
      </nav>
      <button className="join-btn" onClick={openForm}>Join Now</button>
      <div className="hamburger" id="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
};

export default Header;
