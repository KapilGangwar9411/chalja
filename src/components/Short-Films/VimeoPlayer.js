import React, { useState, useEffect, useRef } from 'react';
import './VimeoPlayer.css';

const VimeoPlayer = ({ videoId, isPlaying, isMuted, onReady, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  
  // Function to extract Vimeo ID from URL or use ID directly
  const getVimeoId = (idOrUrl) => {
    if (!idOrUrl) return null;
    
    // If it's a number or numeric string, it's already an ID
    if (/^\d+$/.test(idOrUrl)) {
      return idOrUrl;
    }
    
    // Extract ID from URL
    const match = idOrUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : idOrUrl;
  };

  // Get proper ID
  const vimeoId = getVimeoId(videoId);
  
  // Create embed URL with parameters
  const embedUrl = vimeoId 
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=${isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}&controls=1&responsive=1&dnt=1&portrait=0&title=0&byline=0&transparent=1&quality=auto&maxheight=100%&badge=0&autopause=0&background=1&playsinline=1&pip=0`
    : '';
  
  // Detect if on desktop browser
  const isDesktop = typeof window !== 'undefined' && 
    !(navigator.userAgent.match(/Android/i) || 
      navigator.userAgent.match(/webOS/i) || 
      navigator.userAgent.match(/iPhone/i) || 
      navigator.userAgent.match(/iPad/i) || 
      navigator.userAgent.match(/iPod/i) || 
      navigator.userAgent.match(/BlackBerry/i) || 
      navigator.userAgent.match(/Windows Phone/i));
  
  // Handle iframe load and error
  useEffect(() => {
    if (!embedUrl) {
      setError('Invalid Vimeo ID');
      setLoading(false);
      if (onError) onError('Invalid Vimeo ID');
      return;
    }
    
    setLoading(true);
    
    const handleLoad = () => {
      setLoaded(true);
      setLoading(false);
      setError(null);
      
      // Create simple interface for controlling the iframe
      // This ensures compatibility with desktop and mobile
      if (iframeRef.current) {
        playerRef.current = {
          play: () => {
            try {
              // Some browsers may block this method without user interaction
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ method: 'play', value: '' }, '*');
              }
            } catch (err) {
              console.error('Error calling play:', err);
            }
          },
          pause: () => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ method: 'pause', value: '' }, '*');
              }
            } catch (err) {
              console.error('Error calling pause:', err);
            }
          },
          setCurrentTime: (seconds) => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ method: 'setCurrentTime', value: seconds }, '*');
              }
            } catch (err) {
              console.error('Error setting current time:', err);
            }
          },
          setVolume: (volume) => {
            try {
              if (iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ method: 'setVolume', value: volume }, '*');
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
  
  // On desktop browsers, we need to ensure proper aspect ratio
  // and handle fullscreen mode properly
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
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // Set a key attribute to force iframe refresh when needed on desktop
    if (isDesktop && iframeRef.current) {
      const refreshInterval = setInterval(() => {
        if (iframeRef.current && document.visibilityState === 'visible' && !isPlaying) {
          const currentSrc = iframeRef.current.src;
          iframeRef.current.src = '';
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.src = currentSrc;
            }
          }, 50);
        }
      }, 300000); // Every 5 minutes, only when page is visible and video is paused
      
      return () => {
        clearInterval(refreshInterval);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      };
    }
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isDesktop, isPlaying]);
  
  return (
    <div 
      ref={containerRef}
      className={`vimeo-player-container ${isDesktop ? 'desktop' : 'mobile'} aspect-16-9`}
      style={{height: '100%', paddingBottom: 0}}
    >
      {!error ? (
        <>
          {loading && (
            <div className="vimeo-loading">
              <div className="spinner"></div>
              <p>Loading video...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="vimeo-iframe"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo Player"
            loading="lazy"
          />
        </>
      ) : (
        <div className="vimeo-error">
          <h3>Video Unavailable</h3>
          <p>{error}</p>
          <p>Please try again later or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
};

export default VimeoPlayer; 