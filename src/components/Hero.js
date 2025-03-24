import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';
import Loader from './Loader';

const Hero = ({ openForm }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const imageSources = [
    { 
      src: 'images/cinematography.png',
      webp: 'images/cinematography.webp',
      alt: 'Writing Course',
      title: 'Cinematography'
    },
    { 
      src: 'images/film-making.png',
      webp: 'images/film-making.webp',
      alt: 'Business',
      title: 'Film Making'
    },
    { 
      src: 'images/editing.png',
      webp: 'images/editing.webp',
      alt: 'Placeholder',
      title: 'Video Editing'
    }
  ];

  useEffect(() => {
    // Preload images
    const promises = imageSources.map(({ src, webp }) => {
      return new Promise((resolve) => {
        const img = new Image();
        // Try loading WebP first if available
        img.src = webp || src;
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
              {imageSources.map((image, index) => (
                <div key={index} className={`image-wrapper ${index === 1 ? 'expanded' : ''}`}>
                  <picture>
                    {image.webp && <source srcSet={image.webp} type="image/webp" />}
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      width="400"
                      height="300"
                      fetchpriority={index === 0 ? "high" : "auto"}
                    />
                  </picture>
                  <div className="image-info">
                    {index === 1 ? (
                      <Link to="/short-films">
                        <h2>{image.title}</h2>
                      </Link>
                    ) : (
                      <h2>{image.title}</h2>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <Loader />
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;
