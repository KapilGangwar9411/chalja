import React, { useState, useEffect } from 'react';
import './shortfilms.css';
import FilmSection from './FilmSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faPlay, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';
import Loader from '../Loader';
import FilmSubmissionModal from './FilmSubmissionModal';

const ShortFilms = () => {
  const [email, setEmail] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const scrollToFilms = () => {
    document.getElementById('film-gallery').scrollIntoView({ 
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = `${process.env.PUBLIC_URL}/images/film1.png`;
    bgImage.onload = () => {
      setImageLoaded(true);
    };

    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="films-page">
      {!imageLoaded ? (
        <Loader />
      ) : (
        <>
          <div className="cinema-hero-section">
            <div className="overlay"></div>
            <video
              className={`background-video ${isVideoPlaying ? 'playing' : ''}`}
              loop
              muted={!isVideoPlaying}
              autoPlay
              playsInline
              src={`${process.env.PUBLIC_URL}/videos/C0232.MP4`}
            ></video>
            
            <header className="films-header">
              <button className="back-btn" onClick={() => window.history.back()}>
                <span className="back-icon">←</span> <span className="back-text">Back</span>
              </button>
              <button className="sound-toggle" onClick={toggleVideo}>
                {isVideoPlaying ? 'Mute' : 'Unmute'}
              </button>
            </header>

            <div className="hero-content">
              <h1 className="hero-title">Showcase Your Cinematic Vision</h1>
              <h2 className="hero-subtitle">Submit your film and join our curated collection</h2>
              <p className="hero-description">
                We're looking for unique storytellers with powerful voices. Get your short film featured on our platform and reach a wider audience.
              </p>

              <div className="cta-container">
                <button className="submit-film-btn" onClick={handleSubmit}>
                  <FontAwesomeIcon icon={faPlay} className="submit-icon" />
                  <span>Submit Your Film</span>
                </button>
                <a href="#film-gallery" className="explore-btn">Explore Films</a>
              </div>

              <div className="scroll-indicator" onClick={scrollToFilms}>
                <p>Discover our collection</p>
                <div className="chevron-container">
                  <FontAwesomeIcon icon={faChevronDown} className="chevron chevron-1" />
                  <FontAwesomeIcon icon={faChevronDown} className="chevron chevron-2" />
                  <FontAwesomeIcon icon={faChevronDown} className="chevron chevron-3" />
                </div>
              </div>
            </div>
          </div>
          
          <div id="film-gallery" className="film-gallery-section">
            <FilmSection />
          </div>
          
          <Footer />

          {showModal && <FilmSubmissionModal onClose={closeModal} />}
        </>
      )}
    </div>
  );
};

export default ShortFilms;
