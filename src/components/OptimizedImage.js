import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage - A component for efficiently loading images with proper sizing and formats
 * 
 * @param {string} src - Original image source (fallback)
 * @param {string} webpSrc - WebP version source (if available)
 * @param {string} alt - Alt text for the image
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {Array} sizes - Array of responsive sizes [{ width, media }]
 * @param {string} className - CSS class names
 * @param {string} style - Inline styles
 * @param {boolean} lazy - Whether to use lazy loading (default: true)
 * @param {function} onLoad - Callback when image loads
 */
const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  width,
  height,
  sizes = [],
  className = '',
  style = {},
  lazy = true,
  onLoad = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = async () => {
      try {
        const webPImage = new Image();
        webPImage.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
        const result = await new Promise((resolve) => {
          webPImage.onload = () => resolve(true);
          webPImage.onerror = () => resolve(false);
        });
        setSupportsWebP(result);
      } catch (e) {
        setSupportsWebP(false);
      }
    };

    checkWebPSupport();
  }, []);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleImageError = () => {
    setIsError(true);
  };

  // Choose the appropriate source
  const imageSrc = (supportsWebP && webpSrc) ? webpSrc : src;

  // Generate srcSet for responsive loading
  const generateSrcSet = (baseSrc) => {
    if (!sizes || sizes.length === 0) return undefined;
    
    return sizes.map(size => `${baseSrc.replace(/\.\w+$/, `-${size.width}px$&`)} ${size.width}w`).join(', ');
  };

  // Generate sizes attribute for responsive loading
  const generateSizes = () => {
    if (!sizes || sizes.length === 0) return undefined;
    
    return sizes
      .map(size => size.media ? `(${size.media}) ${size.width}px` : `${size.width}px`)
      .join(', ');
  };

  const imageStyle = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    ...style
  };

  const placeholderStyle = {
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: '#f0f0f0',
    display: isLoaded ? 'none' : 'block'
  };

  return (
    <div className={`optimized-image-container ${className}`} style={{ position: 'relative' }}>
      {/* Placeholder while loading */}
      {!isLoaded && !isError && (
        <div style={placeholderStyle} aria-hidden="true"></div>
      )}
      
      {/* The actual image */}
      {!isError ? (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? "lazy" : "eager"}
          srcSet={generateSrcSet(imageSrc)}
          sizes={generateSizes()}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={imageStyle}
          {...props}
        />
      ) : (
        // Fallback for error
        <div 
          style={{
            width: width || '100%', 
            height: height || '200px',
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            border: '1px solid #ddd'
          }}
        >
          Image Not Available
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 