import React, { useState, useEffect, useRef } from 'react';
import './filmSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExpand, faCompress, faTimes } from '@fortawesome/free-solid-svg-icons';
import VimeoPlayer from './VimeoPlayer';

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
            <VimeoPlayer
              videoId={film.vimeoId}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onReady={handlePlayerReady}
              onError={handlePlayerError}
            />
          </div>
          
          {/* Video Controls */}
          <div className={`netflix-video-controls ${showControls ? 'visible' : 'hidden'}`}>
            <div className="netflix-top-controls">
              <h2 className="netflix-video-title">{film.title}</h2>
              <button className="netflix-close-button" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="netflix-center-controls">
              <button 
                className="netflix-play-button" 
                onClick={togglePlay}
                disabled={!playerReady || videoError}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
            </div>
            
            <div className="netflix-bottom-controls">
              <div 
                className="netflix-progress-bar" 
                onClick={handleProgressClick}
              >
                <div className="netflix-progress-background"></div>
                <div 
                  className="netflix-progress-filled" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="netflix-controls-buttons">
                <button 
                  className="netflix-control-button" 
                  onClick={togglePlay}
                  disabled={!playerReady || videoError}
                >
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                
                <button 
                  className="netflix-control-button" 
                  onClick={toggleMute}
                  disabled={!playerReady || videoError}
                >
                  <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                </button>
                
                <div className="netflix-film-info">
                  <span className="netflix-title-small">{film.title}</span>
                  <span className="netflix-duration">{film.duration}</span>
                </div>
                
                <button 
                  className="netflix-control-button" 
                  onClick={toggleFullscreen}
                >
                  <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Dedicated Exit Fullscreen Button (always visible in fullscreen) */}
          {isFullscreen && (
            <button 
              className="fullscreen-exit-button" 
              onClick={exitFullscreen}
              aria-label="Exit fullscreen"
              title="Exit fullscreen"
            >
              <FontAwesomeIcon icon={faCompress} />
            </button>
          )}
          
          {!playerReady && !videoError && (
            <div className="netflix-loading">
              <div className="netflix-spinner"></div>
            </div>
          )}
          
          {videoError && (
            <div className="netflix-error-message">
              <p>Error loading video: {videoError}</p>
              <p>Please try again later or contact support.</p>
            </div>
          )}
        </div>
        
        <div className="netflix-film-details">
          <div className="netflix-details-header">
            <div>
              <h2>{film.title}</h2>
              <div className="netflix-meta-info">
                <span className="netflix-year">{film.year}</span>
                <span className="netflix-age-rating">{film.ageRating}</span>
                <span className="netflix-duration">{film.duration}</span>
              </div>
            </div>
          </div>
          
          <p className="netflix-description">{film.description}</p>
          
          <div className="netflix-additional-info">
            <p><strong>Director:</strong> {film.director}</p>
            <p><strong>Languages:</strong> {film.languages}</p>
            <p><strong>Genre:</strong> {film.genre.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetflixModal; 