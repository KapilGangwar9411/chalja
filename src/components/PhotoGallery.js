import React, { useState, useEffect } from 'react';
import './PhotoGallery.css';

const PhotoGallery = () => {
  // Sample data with imgbb URLs
  const photos = [
    {
      id: 1,
      src: 'https://i.ibb.co/0pCxtw64/DSC7758-1.jpg', // Replace with your actual imgbb URL
      alt: 'Tall redwood trees in a forest',
      height: 'tall',
      position: 'left',
      userName: 'Firstname Lastname',
      userAvatar: 'https://ui-avatars.com/api/?name=F+L&background=random',
      featured: true
    },
    {
      id: 2,
      src: 'https://i.ibb.co/kVcR9nSL/DSC-5987.jpg', // Replace with your actual imgbb URL
      alt: 'Waterfall in a forest',
      height: 'medium',
      position: 'left-center',
      userName: 'Firstname Lastname',
      userAvatar: 'https://ui-avatars.com/api/?name=F+L&background=random',
      featured: true
    },
    {
      id: 3,
      src: 'https://i.ibb.co/3yF6GyzD/LRM-EXPORT-20201219-175058jpg-0.jpg',
      alt: 'River flowing through a forest',
      height: 'large',
      position: 'center',
      userName: 'Firstname Lastname',
      userAvatar: 'https://ui-avatars.com/api/?name=F+L&background=random',
      featured: true
    },
    {
      id: 4,
      src: 'https://i.ibb.co/RTckMj81/DSC7862.jpg',
      alt: 'Sunlight through trees',
      height: 'medium',
      position: 'right-center',
      userName: 'Firstname Lastname',
      userAvatar: 'https://ui-avatars.com/api/?name=F+L&background=random',
      featured: true
    },
    {
      id: 5,
      src: 'https://i.ibb.co/Ndsh1wHw/DSC-5964.jpg',
      alt: 'Succulent plants',
      height: 'tall',
      position: 'right',
      featured: true
    }
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState(null);

  // Add animation when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const galleryElement = document.querySelector('.photo-gallery-container');
    if (galleryElement) observer.observe(galleryElement);

    return () => {
      if (galleryElement) observer.unobserve(galleryElement);
    };
  }, []);

  const handlePhotoHover = (id) => {
    setActivePhotoId(id);
  };

  const handlePhotoLeave = () => {
    setActivePhotoId(null);
  };

  return (
    <section className="photo-gallery-section">
      <div className="photo-gallery-header">
        <h2>Captured Moments</h2>
        <p>A visual journey through our lens</p>
      </div>
      
      <div className={`photo-gallery-container ${isVisible ? 'visible' : ''}`}>
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className={`photo-card ${photo.height} ${photo.position} ${activePhotoId === photo.id ? 'active' : ''} ${activePhotoId && activePhotoId !== photo.id ? 'inactive' : ''}`}
            onMouseEnter={() => handlePhotoHover(photo.id)}
            onMouseLeave={handlePhotoLeave}
          >
            <div className="photo-image">
              <img src={photo.src} alt={photo.alt} />
            </div>
            <div className="photo-info">
              <div className="user-profile">
                <img src={photo.userAvatar} alt={`${photo.userName}'s avatar`} className="user-avatar" />
                <span className="user-name">{photo.userName}</span>
              </div>
              {photo.featured && <div className="featured-badge">★</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery; 