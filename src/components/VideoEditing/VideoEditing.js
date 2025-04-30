import React from 'react';
import './VideoEditing.css';
import '../../assets/styles.css';
import SEOHead from '../SEO/SEOHead';

const VideoEditing = () => {
  const videoEditingSchemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Video Editing Services - Coming Soon",
    "description": "Our video editing services page is coming soon. Stay tuned for professional video editing solutions.",
    "url": "https://spectrumclub.vercel.app/video-editing"
  };

  return (
    <>
      <SEOHead
        title="Video Editing Services - Coming Soon"
        description="Our video editing services page is coming soon. Stay tuned for professional video editing solutions."
        keywords="video editing, professional editing, post-production, coming soon"
        url="https://spectrumclub.vercel.app/video-editing"
        schemaData={videoEditingSchemaData}
      />

      <div className="coming-soon-container">
        <h1 className="coming-soon-text">Coming Soon</h1>
      </div>
    </>
  );
};

export default VideoEditing; 