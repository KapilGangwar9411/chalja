import React, { useState } from 'react';
import './filmSection.css';

const filmsData = [
  {
    title: 'Babli Bouncer',
    image: `${process.env.PUBLIC_URL}/images/film1.png`,
    year: '2022',
    duration: '1h 57m',
    languages: '3 Languages',
    ageRating: 'U/A 16+',
    description: "A first-of-its-kind for her village, Babli takes up a bouncer's job to win over her love, leading to a series of funny and heart-warming events.",
    videoUrl: 'videos/showreel.mp4', // Sample video URL
  },
  {
    title: 'Sarabhai vs Sarabhai',
    image: `${process.env.PUBLIC_URL}/images/film1.png`,
    year: '2004',
    duration: '2 Seasons',
    languages: 'Hindi',
    ageRating: 'U',
    description: "A comedy series that revolves around the lives of the members of an upper-class Gujarati family in Mumbai.",
    videoUrl: 'videos/showreel.mp4', // Sample video URL
  },
  {
    title: 'Kya Haal Mr. Panchaal?',
    image: `${process.env.PUBLIC_URL}/images/film1.png`,
    year: '2017',
    duration: '1 Season',
    languages: 'Hindi',
    ageRating: 'U',
    description: "A hilarious comedy about a man dealing with the eccentricities of his five wives, each with distinct personalities.",
    videoUrl: 'videos/showreel.mp4',
  },
  {
    title: 'Kya Haal Mr. Panchaal?',
    image: `${process.env.PUBLIC_URL}/images/film1.png`,
    year: '2017',
    duration: '1 Season',
    languages: 'Hindi',
    ageRating: 'U',
    description: "A hilarious comedy about a man dealing with the eccentricities of his five wives, each with distinct personalities.",
    videoUrl: 'videos/showreel.mp4', // Sample video URL
  },
  // Add more films with their respective video URLs
];

const FilmSection = () => {
  const [hoveredFilm, setHoveredFilm] = useState(null);
  const [modalFilm, setModalFilm] = useState(null); // State to handle modal

  const handleMouseEnter = (film) => {
    setHoveredFilm(film);
  };

  const handleMouseLeave = () => {
    setHoveredFilm(null);
  };

  const openModal = (film) => {
    setModalFilm(film);
  };

  const closeModal = () => {
    setModalFilm(null);
  };

  return (
    <div className="films-page-container">
      <div className="films-section">
        <h1>Our Latest Films</h1>
        <div className="films-grid">
          {filmsData.map((film, index) => (
            <div
              key={index}
              className="film-card"
              onMouseEnter={() => handleMouseEnter(film)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={film.image} alt={film.title} />
              {hoveredFilm === film && (
                <div className="film-info">
                  <h2>{film.title}</h2>
                  <p>{film.year}</p>
                  <p>{film.duration}</p>
                  <p>{film.languages}</p>
                  <p>{film.ageRating}</p>
                  <p>{film.description}</p>
                  <button onClick={() => openModal(film)}>Watch Now</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalFilm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{modalFilm.title}</h2>
              <iframe
                width="100%"
                height="400"
                src={modalFilm.videoUrl}
                title={modalFilm.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmSection;
