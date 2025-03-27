import React, { useState, useEffect, useRef } from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(0.7); // Initial scale
  const videoRef = useRef(null);
  
  const videoId = '1069577133';
  const embedUrl = `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&autopause=0&muted=1&controls=0&quality=4k&playsinline=1&dnt=1`;
  const directVideoUrl = `https://vimeo.com/${videoId}`;

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      
      const rect = videoRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      
      // Scale from 0.7 to 1 based on scroll progress
      const newScale = 0.7 + (scrollProgress * 0.3);
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleRetry = () => {
    setVideoError(false);
    setIsLoading(true);
    // Force iframe refresh
    const iframe = document.querySelector('.showcase-video');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="video-showcase" ref={videoRef}>
      <div className="heading-container">
        <h2 className="video-heading">Highlights of our recent event</h2>
        <img 
          src="/images/curved-line.png" 
          alt="decorative curved line"
          className="curved-line"
          style={{
            width: '300px',
            height: '40px',
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(3410%) hue-rotate(308deg) brightness(96%) contrast(96%)'
          }}
        />
      </div>
      <div className="video-wrapper" style={{ transform: `scale(${scale})` }}>
        {isLoading && !videoError && (
          <div className="video-loading">
            <div className="loading-content">
              <div className="loading-icon">🌟</div>
              <p className="loading-text">Improve your internet connection to see the video</p>
              <p className="loading-subtext">Till then, feel free to scroll down! ✨</p>
              <div className="loading-animation">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
          </div>
        )}
        {videoError ? (
          <div className="video-error">
            <p>Unable to load the video.</p>
            <ul>
              <li>This may be due to your internet connection</li>
              <li>The video might be temporarily unavailable</li>
            </ul>
            <div className="error-buttons">
              <button onClick={handleRetry} className="retry-button">
                Try Again
              </button>
              <a 
                href={directVideoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="watch-link"
              >
                Watch on Vimeo
              </a>
            </div>
          </div>
        ) : (
          <div className="responsive-iframe-container">
            <iframe
              src={embedUrl}
              className="showcase-video"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Showcase Video"
              loading="eager"
              onError={handleVideoError}
              onLoad={handleVideoLoad}
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: '100%',
                maxWidth: '100%'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryShowcase; 