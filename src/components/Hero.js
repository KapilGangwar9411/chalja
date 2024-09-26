import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';

const Hero = ({ openForm }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const imageSources = [
    'images/cinematography.png',
    'images/film-making.png',
    'images/editing.png'
  ];

  useEffect(() => {
    // Preload images
    const promises = imageSources.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
      });
    });

    Promise.all(promises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

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
          {imagesLoaded ? (
            <>
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
            </>
          ) : (
            <div className="loading-spinner">Loading...</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;
