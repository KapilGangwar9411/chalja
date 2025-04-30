import React, { useState, useEffect, useRef } from 'react';
import './filmSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStar, faCalendarDay, faClock, faGlobe, faVolumeUp, faVolumeMute, faExpand, faPause } from '@fortawesome/free-solid-svg-icons';
import VimeoPlayer from './VimeoPlayer';
import NetflixModal from './NetflixModal';

// Sample film data with Vimeo links
const filmsData = [
  {
    id: 1,
    title: 'Safar',
    image: `${process.env.PUBLIC_URL}/images/Safar.png`,
    year: '2024',
    duration: '8 min',
    languages: 'Hindi, English',
    ageRating: 'U/A 13+',
    director: 'Saksham Patel',
    rating: 4.8,
    genre: ['Drama', 'Coming of Age'],
    description: "A young photographer discovers herself through a soul-searching journey across rural India, capturing the essence of humanity along the way.",
    vimeoId: '1080297620',
    featured: true
  },
  {
    id: 2,
    title: 'Alumni Meet',
    image: `${process.env.PUBLIC_URL}/images/Safar.png`,
    year: '2022',
    duration: '22 min',
    languages: 'English',
    ageRating: 'U/A 16+',
    director: 'Alok Kumar',
    rating: 4.5,
    genre: ['Sci-Fi', 'Thriller'],
    description: "When a sound engineer discovers a frequency that allows him to hear conversations from the past, he becomes obsessed with changing history.",
    vimeoId: 'https://vimeo.com/1080297620/bec13abdfe',
    featured: true
  },
  {
    id: 3,
    title: 'The Journey Within',
    image: `${process.env.PUBLIC_URL}/images/Safar.png`,
    year: '2023',
    duration: '18 min',
    languages: 'Hindi, English',
    ageRating: 'U/A 13+',
    director: 'Aisha Sharma',
    rating: 4.8,
    genre: ['Drama', 'Coming of Age'],
    description: "A young photographer discovers herself through a soul-searching journey across rural India, capturing the essence of humanity along the way.",
    vimeoId: '76979871',
    featured: true
  }
];

const FilmSection = () => {
  const [hoveredFilm, setHoveredFilm] = useState(null);
  const [modalFilm, setModalFilm] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [displayFilms, setDisplayFilms] = useState(filmsData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const modalRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressRef = useRef(null);
  
  // Filter films based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setDisplayFilms(filmsData);
    } else if (activeTab === 'featured') {
      setDisplayFilms(filmsData.filter(film => film.featured));
    } else if (activeTab === 'latest') {
      setDisplayFilms([...filmsData].sort((a, b) => parseInt(b.year) - parseInt(a.year)));
    }
  }, [activeTab]);

  const handleMouseEnter = (film) => {
    setHoveredFilm(film);
  };

  const handleMouseLeave = () => {
    setHoveredFilm(null);
  };

  const openModal = (film) => {
    setModalFilm(film);
    setProgress(0);
    setPlayerReady(false);
    setIsPlaying(false); // Start paused and wait for player to be ready
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    if (playerRef.current) {
      try {
        playerRef.current.pause();
      } catch (err) {
        console.error("Error pausing player before close:", err);
      }
    }
    setIsPlaying(false);
    setModalFilm(null);
    setPlayerReady(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    setPlayerReady(true);
    
    // Since we're not getting progress events from the iframe method,
    // use an interval to simulate progress
    const progressInterval = setInterval(() => {
      // If video isn't playing, don't update progress
      if (!isPlaying) return;
      
      // Increment progress by a small amount (simulate 60s video)
      setProgress(prev => {
        const newProgress = prev + 0.2; // Increment by 0.2% every 100ms
        
        // If we reach 100%, reset progress and clear interval
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsPlaying(false);
          return 0;
        }
        
        return newProgress;
      });
    }, 100);
    
    // Clear interval when component unmounts
    return () => clearInterval(progressInterval);
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;
    
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e) => {
    if (!playerReady) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Update progress immediately
    const newProgress = clickPosition * 100;
    setProgress(newProgress);
    
    // With iframe approach, we don't have reliable seeking, 
    // but we can simulate it by updating our progress tracking
    if (playerRef.current) {
      try {
        // Try to use the seek functionality if available
        playerRef.current.setCurrentTime(newProgress);
      } catch (err) {
        console.log('Simulating seek in iframe mode');
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (modalRef.current.requestFullscreen) {
        modalRef.current.requestFullscreen();
      } else if (modalRef.current.webkitRequestFullscreen) {
        modalRef.current.webkitRequestFullscreen();
      } else if (modalRef.current.msRequestFullscreen) {
        modalRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && modalFilm) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [modalFilm]);

  return (
    <div className="films-container">
      <div className="films-header-section">
        <h1 className="films-main-title">Explore Our <span className="accent-text">Collection</span></h1>
        <p className="films-subtitle">Discover captivating stories crafted by talented filmmakers</p>
        
        <div className="films-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            All Films
          </button>
          <button 
            className={`tab-button ${activeTab === 'featured' ? 'active' : ''}`} 
            onClick={() => setActiveTab('featured')}
          >
            Featured
          </button>
          <button 
            className={`tab-button ${activeTab === 'latest' ? 'active' : ''}`} 
            onClick={() => setActiveTab('latest')}
          >
            Latest
          </button>
        </div>
      </div>

        <div className="films-grid">
        {displayFilms.map((film) => (
            <div
            key={film.id}
              className="film-card"
              onMouseEnter={() => handleMouseEnter(film)}
              onMouseLeave={handleMouseLeave}
            >
            <div className="film-poster">
              <img src={film.image} alt={film.title} />
              {film.featured && <div className="featured-badge">Featured</div>}
              <div className="film-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>{film.rating}</span>
              </div>
            </div>
            
            <div className="film-basic-info">
              <h3>{film.title}</h3>
              <div className="film-tags">
                {film.genre.map((tag, index) => (
                  <span key={index} className="film-tag">{tag}</span>
                ))}
              </div>
            </div>

              {hoveredFilm === film && (
              <div className="film-hover-info">
                  <h2>{film.title}</h2>
                <div className="film-meta">
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <span>{film.year}</span>
                  </div>
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{film.duration}</span>
                  </div>
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>{film.languages}</span>
                  </div>
                </div>
                <p className="film-director">Directed by: {film.director}</p>
                <p className="film-description">{film.description}</p>
                <button className="watch-button" onClick={() => openModal(film)}>
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Watch Now</span>
                </button>
                </div>
              )}
            </div>
          ))}
        </div>

      {/* Netflix-style Film Modal */}
        {modalFilm && (
          <NetflixModal 
            film={modalFilm} 
            onClose={closeModal} 
          />
        )}
    </div>
  );
};

export default FilmSection;
