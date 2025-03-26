import React, { useState } from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  const [videoError, setVideoError] = useState(false);
  
  // SharePoint video embed URL from the provided embed code
  const embedUrl = "https://noidainstituteofengtech-my.sharepoint.com/personal/0221cse182_niet_co_in/_layouts/15/embed.aspx?UniqueId=9b9f2922-7365-49a6-bc0e-983fd8ce884a&embed=%7B%22af%22%3Atrue%2C%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create";

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
            <p>Unable to access the video. Please make sure:</p>
            <ul>
              <li>You are logged into your NIET account</li>
              <li>You have permission to view this content</li>
              <li>You have a stable internet connection</li>
            </ul>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <div className="responsive-iframe-container">
            <iframe
              src={embedUrl}
              className="showcase-video"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title="final.mp4"
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