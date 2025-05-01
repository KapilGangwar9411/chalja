import React, { useState, useEffect, useRef } from 'react';
import './player.css'; // Use the new player CSS file

const YoutubePlayer = ({ videoId, isPlaying, isMuted, onReady, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  
  // Function to extract YouTube ID from URL or use ID directly
  const getYoutubeId = (idOrUrl) => {
    if (!idOrUrl) return null;
    
    // If it doesn't contain '/' or ':', it's probably already an ID
    if (!/[/:.]/.test(idOrUrl)) {
      return idOrUrl;
    }
    
    // Extract ID from various YouTube URL formats
    const match = idOrUrl.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Get proper ID
  const youtubeId = getYoutubeId(videoId);
  
  // Create embed URL with parameters
  const embedUrl = youtubeId 
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&enablejsapi=1&modestbranding=1&playsinline=1&rel=0&showinfo=0`
    : '';
  
  // Handle iframe load and error
  useEffect(() => {
    if (!embedUrl) {
      setError('Invalid YouTube ID');
      setLoading(false);
      if (onError) onError('Invalid YouTube ID');
      return;
    }
    
    setLoading(true);
    
    const handleLoad = () => {
      setLoaded(true);
      setLoading(false);
      setError(null);
      
      // Create simple interface for controlling the iframe
      if (iframeRef.current) {
        playerRef.current = {
          play: () => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
              }
            } catch (err) {
              console.error('Error calling play:', err);
            }
          },
          pause: () => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              }
            } catch (err) {
              console.error('Error calling pause:', err);
            }
          },
          setCurrentTime: (seconds) => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${seconds}, true]}`, '*');
              }
            } catch (err) {
              console.error('Error setting current time:', err);
            }
          },
          setVolume: (volume) => {
            try {
              if (iframeRef.current.contentWindow) {
                const volumePercent = volume * 100;
                iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${volumePercent}]}`, '*');
              }
            } catch (err) {
              console.error('Error setting volume:', err);
            }
          },
          enterFullscreen: () => {
            try {
              if (containerRef.current) {
                if (containerRef.current.requestFullscreen) {
                  containerRef.current.requestFullscreen();
                } else if (containerRef.current.webkitRequestFullscreen) {
                  containerRef.current.webkitRequestFullscreen();
                } else if (containerRef.current.msRequestFullscreen) {
                  containerRef.current.msRequestFullscreen();
                }
              }
            } catch (err) {
              console.error('Error entering fullscreen:', err);
            }
          },
          exitFullscreen: () => {
            try {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
              }
            } catch (err) {
              console.error('Error exiting fullscreen:', err);
            }
          }
        };
        
        if (onReady) {
          onReady(playerRef.current);
        }
      }
    };
    
    const handleError = () => {
      setError('Failed to load video');
      setLoading(false);
      setLoaded(false);
      if (onError) onError('Failed to load video');
    };
    
    const iframe = iframeRef.current;
    
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      // Set a timeout to handle cases where the iframe never fires the load event
      const timeoutId = setTimeout(() => {
        if (!loaded) {
          handleError();
        }
      }, 10000); // 10 seconds timeout
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        clearTimeout(timeoutId);
      };
    }
  }, [embedUrl, onReady, onError, loaded]);
  
  // Handle play/pause changes after loaded
  useEffect(() => {
    if (loaded && playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying, loaded]);
  
  // Handle mute changes after loaded
  useEffect(() => {
    if (loaded && playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : 1);
    }
  }, [isMuted, loaded]);
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement;
      
      if (containerRef.current) {
        if (isFullscreen) {
          containerRef.current.classList.add('fullscreen-mode');
        } else {
          containerRef.current.classList.remove('fullscreen-mode');
        }
      }
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
  
  return (
    <div 
      ref={containerRef}
      className={`youtube-player-container ${loading ? 'loading' : ''}`}
    >
      {loading && (
        <div className="video-loader">
          <div className="loader-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="video-error">
          <p>{error}</p>
        </div>
      )}
      
      {embedUrl && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          className="youtube-iframe"
        ></iframe>
      )}
    </div>
  );
};

export default YoutubePlayer; 