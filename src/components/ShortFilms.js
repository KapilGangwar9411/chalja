import React from 'react';
import '../assets/styles.css';

const ShortFilms = () => {
  const shortFilms = [
    { id: 1, src: 'path-to-your-video1.mp4', title: 'Film 1' },
    { id: 2, src: 'path-to-your-video2.mp4', title: 'Film 2' },
    { id: 3, src: 'path-to-your-video3.mp4', title: 'Film 3' }
  ];

  return (
    <div className="short-films-container">
      <h1 className="title">Our Short Films</h1>
      <div className="films-wrapper">
        {shortFilms.map((film) => (
          <div className="film-item" key={film.id}>
            <video
              className="film-video"
              src={film.src}
              title={film.title}
              controls
              autoPlay
              loop
              muted
            />
            <p className="film-title">{film.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortFilms;
