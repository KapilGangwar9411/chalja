import React, { useState } from 'react';
import './GalleryShowcase.css';

const GalleryShowcase = () => {
  // Set initial activeIndex to 2 (middle image)
  const [activeIndex, setActiveIndex] = useState(2);

  // Photo data using images from public/images folder
  const photos = [
    {
      id: 1,
      title: 'Film Making Workshop',
      location: 'Film Production',
      imageUrl: '/images/img3.JPG',
      date: 'March 2024'
    },
    {
      id: 2,
      title: 'Cinematography',
      location: 'Camera Workshop',
      imageUrl: '/images/cinematography.png',
      date: 'March 2024'
    },
    {
      id: 3,
      title: 'Photo Walks',
      location: 'Photography',
      imageUrl: '/images/img3.JPG',
      date: 'March 2024'
    },
    {
      id: 4,
      title: 'Video Editing',
      location: 'Post Production',
      imageUrl: '/images/editing.png',
      date: 'March 2024'
    },
    {
      id: 5,
      title: 'Night Photo Walks',
      location: 'Photography',
      imageUrl: '/images/img3.JPG',
      date: 'March 2024'
    }
  ];

  const handleSlitClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-slits">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`gallery-slit ${activeIndex === index ? 'active' : ''} ${activeIndex !== null && activeIndex !== index ? 'inactive' : ''}`}
            onClick={() => handleSlitClick(index)}
            style={{
              '--delay': `${index * 0.1}s`,
              '--index': index
            }}
          >
            <div className="slit-content">
              <div className="slit-image">
                <img src={photo.imageUrl} alt={photo.title} />
              </div>
              <div className="slit-info">
                <h3>{photo.title}</h3>
                <p>{photo.location}</p>
                <span>{photo.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryShowcase; 