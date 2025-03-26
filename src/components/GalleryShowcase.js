import React, { useState } from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  const [videoError, setVideoError] = useState(false);
  
  // SharePoint video embed URL from the provided embed code
  const embedUrl = "https://noidainstituteofengtech-my.sharepoint.com/personal/0221cse182_niet_co_in/_layouts/15/embed.aspx?UniqueId=9b9f2922-7365-49a6-bc0e-983fd8ce884a&embed=%7B%22af%22%3Atrue%2C%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create";
  
  // Updated public link to the video
  const directVideoUrl = "https://noidainstituteofengtech-my.sharepoint.com/:v:/g/personal/0221cse182_niet_co_in/ESIpn5tlc6ZJvA6YP9jOiEoBTZTZt7Rv0IbymDOjMbPRQQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=WyCAPS";

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
            <p>Unable to access the video directly within the page.</p>
            <ul>
              <li>This may be due to your institution's sharing policies</li>
              <li>You may need to be logged into your NIET account</li>
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
                Watch Video Directly
              </a>
            </div>
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