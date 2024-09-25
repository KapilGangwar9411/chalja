
import React, { useState } from 'react';
import './shortfilms.css';
import FilmSection from './FilmSection';

const ShortFilms = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email submitted: ${email}`);
  };

  return (
    <div 
      className="netflix-landing-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/film1.png)` }} // Your custom background image
    >
      <header className="netflix-header">
        <img
          src="images/white.png"
          alt="Netflix Logo"
          className="netflix-logo"
        />
        <div className="header-controls">
          <select className="language-selector">
            <option value="en">English</option>
          </select>
          <button className="sign-in-btn">Join Us</button>
        </div>
      </header>

      {/* Hero section */}
      <div className="hero-section">
        <h1>Unlimited films, cinematography events, and more</h1>
        <h2>Explore our captivating short films.</h2>
        <p>Ready to explore? Enter your email to join Spectrum and kickstart your journey in the world of films.</p>

        {/* Email form */}
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="email-input"
            placeholder="Email address"
            value={email}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="get-started-btn">
            Get Started
          </button>
        </form>
      </div>
      <div>
      <FilmSection />
      </div>
    </div>
  );
};

export default ShortFilms;
