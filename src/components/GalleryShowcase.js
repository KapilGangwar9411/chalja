import React, { useState } from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  const [videoError, setVideoError] = useState(false);
  
  const videoId = '1069577133';
  const embedUrl = `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&autopause=0&muted=1&controls=0&quality=4k&playsinline=1&dnt=1`;
  
  const directVideoUrl = `https://vimeo.com/${videoId}`;

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleRetry = () => {
    setVideoError(false);
    // Force iframe refresh
    const iframe = document.querySelector('.showcase-video');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="video-showcase">
      <div className="video-wrapper">
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