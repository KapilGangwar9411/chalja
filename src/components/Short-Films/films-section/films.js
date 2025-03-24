import React from 'react';
import Slider from 'react-slick';
import './films.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const films = () => {
  const shortFilms = [
    { 
      id: 1, 
      src: '/images/sector36.jpg', // Replace with actual image path
      title: 'Sector 36',
      description: 'Recently added',
    },
    { 
      id: 2, 
      src: '/images/mrBachchan.jpg', 
      title: 'Mr. Bachchan',
      description: 'Recently added',
    },
    { 
      id: 3, 
      src: '/images/badBoys.jpg', 
      title: 'Bad Boys: Ride or Die',
      description: 'Recently added',
    },
    { 
      id: 4, 
      src: '/images/rebelRidge.jpg', 
      title: 'Rebel Ridge',
      description: 'Recently added',
    },
    { 
      id: 5, 
      src: '/images/aay.jpg', 
      title: 'Aay',
      description: 'Recently added',
    },
    { 
      id: 6, 
      src: '/images/film6.jpg', 
      title: 'Film 6',
      description: 'Recently added',
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="short-films-container">
      <h1 className="title">Trending Now</h1>
      <Slider {...settings}>
        {shortFilms.map((film, index) => (
          <div className="film-item" key={film.id}>
            <div className="thumbnail-wrapper">
              <span className="film-number">{index + 1}</span>
              <img
                className="film-thumbnail"
                src={film.src}
                alt={film.title}
              />
              <div className="recently-added-badge">{film.description}</div>
            </div>
            <div className="film-info">
              <p className="film-title">{film.title}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default films;
