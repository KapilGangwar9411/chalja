import React from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  const videoUrl = "https://noidainstituteofengtech-my.sharepoint.com/personal/0221cse182_niet_co_in/_layouts/15/embed.aspx?UniqueId=9b9f2922-7365-49a6-bc0e-983fd8ce884a&embed=%7B%22af%22%3Atrue%2C%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create";

  return (
    <div className="video-showcase">
      <div className="video-wrapper">
        <iframe
          src={`${videoUrl}&autoplay=1&mute=1`}
          className="showcase-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="final.mp4"
          frameBorder="0"
          scrolling="no"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default GalleryShowcase; 