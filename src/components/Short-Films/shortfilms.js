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
        <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
      </header>

      {/* Hero section */}
      <div className="hero-section">
        <h1>Feature Your Film on Our Website</h1>
        <h2>Have a captivating short film? Submit it now!</h2>
        <p>Ready to showcase your film? Enter your email to begin the submission process and be part of our exclusive collection of short films.</p>

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
            Submit Your Film
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
