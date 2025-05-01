import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import JoinNowForm from './JoinNowForm';
import '../assets/styles.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path is the short films page
    const isShortFilmsPage = location.pathname.includes('/short-films');
    setIsDarkTheme(isShortFilmsPage);
  }, [location.pathname]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    document.body.style.overflow = !isNavOpen ? 'hidden' : 'auto';
  };

  const closeNav = () => {
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openForm = () => {
    closeNav();
    setIsFormOpen(true);
  };

  const scrollToTeam = (e) => {
    e.preventDefault();
    closeNav();
    
    // If we're on the home page, scroll to the team section
    if (location.pathname === '/') {
      const teamSection = document.getElementById('team');
      if (teamSection) {
        window.scrollTo({
          top: teamSection.offsetTop,
          behavior: 'smooth'
        });
      }
    } else {
      // If not on home page, navigate to home and then scroll to team section
      navigate('/');
      // We need to wait for the page to load before scrolling
      setTimeout(() => {
        const teamSection = document.getElementById('team');
        if (teamSection) {
          window.scrollTo({
            top: teamSection.offsetTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <>
      <header className={`header ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={closeNav}>
            <img 
              src={isDarkTheme ? "/images/logo2.png" : "/images/logooo.png"} 
              alt="Spectrum Logo" 
              className="logo-image" 
            />
          </Link>
        </div>

        <nav className={isNavOpen ? 'show' : ''}>
          <ul>
            <li><Link to="/" onClick={closeNav}>Home</Link></li>
            <li><Link to="/events" onClick={closeNav}>Events</Link></li>
            <li><Link to="/short-films" onClick={closeNav}>Short Films</Link></li>
            <li><a href="#team" onClick={scrollToTeam}>Team</a></li>
          </ul>
        </nav>

        <div className="header-buttons">
          <button className="admin-login-btn" onClick={() => { closeNav(); navigate('/admin-login'); }}>
            Admin Login
          </button>
          <button className="join-btn" onClick={openForm}>
            Join Now
          </button>
        </div>

        <div className={`hamburger ${isNavOpen ? 'active' : ''}`} onClick={toggleNav}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>
      <JoinNowForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />
    </>
  );
};

export default Header;
