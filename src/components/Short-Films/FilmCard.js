// src/FilmCard.js
import React from 'react';
import './filmcard.css';

const FilmCard = ({ film, onClick }) => {
  return (
    <div className="film-card" onClick={() => onClick(film)}>
      <img src={film.thumbnail} alt={film.title} className="film-thumbnail" />
      <h3 className="film-title">{film.title}</h3>
      <p className="film-description">{film.description}</p>
    </div>
  );
};

export default FilmCard;
