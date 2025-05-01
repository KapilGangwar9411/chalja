import React, { useState, useEffect, useRef } from 'react';
import './filmSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExpand, faCompress, faTimes } from '@fortawesome/free-solid-svg-icons';
import YoutubePlayer from './YoutubePlayer';

const NetflixModal = ({ film, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  
  const modalRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Auto-hide controls
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
  
  const handlePlayerReady = (player) => {
    playerRef.current = player;
    setPlayerReady(true);
    setVideoError(null);
    
    // Simulate progress for demo purposes
    const progressInterval = setInterval(() => {
      if (!isPlaying) return;
      
      setProgress(prev => {
        const newProgress = prev + 0.2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsPlaying(false);
          return 0;
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  };
  
  const handlePlayerError = (errorMessage) => {
    setVideoError(errorMessage);
    setPlayerReady(false);
  };
  
  const togglePlay = () => {
    if (!playerReady) return;
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    try {
      if (!newPlayState) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    } catch (err) {
      console.log('Error with player controls:', err);
    }
  };
  
  const toggleMute = () => {
    if (!playerReady) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    try {
      playerRef.current.setVolume(newMuteState ? 0 : 1);
    } catch (err) {
      console.log('Error with volume control:', err);
    }
  };
  
  const toggleFullscreen = () => {
    try {
      if (!isFullscreen) {
        if (playerRef.current && playerRef.current.enterFullscreen) {
          playerRef.current.enterFullscreen();
        } else if (modalRef.current.requestFullscreen) {
          modalRef.current.requestFullscreen();
        } else if (modalRef.current.webkitRequestFullscreen) {
          modalRef.current.webkitRequestFullscreen();
        } else if (modalRef.current.msRequestFullscreen) {
          modalRef.current.msRequestFullscreen();
        }
      } else {
        exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };
  
  const exitFullscreen = () => {
    try {
      if (playerRef.current && playerRef.current.exitFullscreen) {
        playerRef.current.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
  };
  
  // Detect fullscreen changes
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
  
  const handleProgressClick = (e) => {
    if (!playerReady) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    setProgress(clickPosition * 100);
    
    try {
      // Estimate video duration as 60 seconds for demo purposes
      // In a real app, you would get actual duration from the player
      playerRef.current.setCurrentTime(clickPosition * 60);
    } catch (err) {
      console.log('Error seeking video:', err);
    }
  };
  
  return (
    <div 
      className={`netflix-film-modal ${isFullscreen ? 'fullscreen' : ''}`} 
      ref={modalRef}
      onMouseMove={handleMouseMove}
    >
      <div className="netflix-modal-backdrop" onClick={onClose}></div>
      <div className="netflix-modal-content">
        <div className="netflix-video-container">
          <div className="netflix-video-wrapper">
            <YoutubePlayer
              videoId={film.youtubeId}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onReady={handlePlayerReady}
              onError={handlePlayerError}
            />
            
            {/* Video overlay for controls */}
            <div className={`netflix-video-overlay ${showControls ? 'show-controls' : ''}`}>
              <button className="netflix-close-button" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              
              <div className="netflix-controls-container">
                <div className="netflix-progress-bar" onClick={handleProgressClick}>
                  <div className="netflix-progress-bar-filled" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="netflix-controls">
                  <button className="netflix-control-button" onClick={togglePlay}>
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                  </button>
                  
                  <button className="netflix-control-button" onClick={toggleMute}>
                    <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                  </button>
                  
                  <div className="netflix-film-title">
                    {film.title}
                  </div>
                  
                  <button className="netflix-control-button" onClick={toggleFullscreen}>
                    <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="netflix-film-info">
          <div className="netflix-film-meta">
            <div className="netflix-film-meta-row">
              <div className="netflix-film-year">{film.year}</div>
              <div className="netflix-film-duration">{film.duration}</div>
              <div className="netflix-film-rating">{film.ageRating}</div>
            </div>
            
            <div className="netflix-film-description">
              {film.description}
            </div>
            
            <div className="netflix-film-details">
              <div className="netflix-film-detail">
                <span className="detail-label">Director:</span> {film.director}
              </div>
              <div className="netflix-film-detail">
                <span className="detail-label">Languages:</span> {film.languages}
              </div>
              <div className="netflix-film-detail">
                <span className="detail-label">Genre:</span> {film.genre.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetflixModal; 