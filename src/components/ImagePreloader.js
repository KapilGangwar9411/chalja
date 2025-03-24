import React, { useEffect } from 'react';

const ImagePreloader = () => {
  useEffect(() => {
    const criticalImages = [
      'images/cinematography.webp',
      'images/film-making.webp',
      'images/editing.webp'
    ];

    // Create preload links in the head
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = 'image/webp';
      document.head.appendChild(link);
    });

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('link[rel="preload"][as="image"]')
        .forEach(link => link.remove());
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ImagePreloader; 