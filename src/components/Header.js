import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JoinNowForm from './JoinNowForm';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <Link to="/" className="text-logo" onClick={closeNav}>
            SPECTRUM
          </Link>
        </div>

        <nav className={isNavOpen ? 'show' : ''}>
          <ul>
            <li><Link to="/" onClick={closeNav}>Home</Link></li>
            <li><Link to="/events" onClick={closeNav}>Events</Link></li>
            <li><Link to="/short-films" onClick={closeNav}>Short Films</Link></li>
            <li><Link to="/TeamSection" onClick={closeNav}>Team</Link></li>
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
