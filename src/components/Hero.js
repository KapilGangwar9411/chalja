import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';

const Hero = ({ openForm }) => {
  return (
    <div className="hero-container">
      <section className="hero">
        <section className="hero-text-container">
          <div className="hero-text">
            <h1 className="Unleash">unleash</h1>
            <span className="Creativity">Creativity</span>
            <span className="with">with</span>
            <h1 className="highlight-text">Spectrum</h1>
            <div className="find-passion">
              <span>Join us in Our Creative Journey</span>
              <button className="go-button" onClick={openForm}>Join Now</button>
            </div>
          </div>
        </section>

        <div className="image-container">
          <div className="image-wrapper">
            <img src="images/cinematography.png" alt="Writing Course" />
            <div className="image-info">
              <h2>Cinematography</h2>
            </div>
          </div>
          <div className="image-wrapper expanded">
            <img src="images/film-making.png" alt="Business" />
            <div className="image-info">
              <Link to="/short-films">
                <h2>Film Making</h2>
              </Link>
            </div>
          </div>
          <div className="image-wrapper">
            <img src="images/editing.png" alt="Placeholder" />
            <div className="image-info">
              <h2>Video Editing</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
