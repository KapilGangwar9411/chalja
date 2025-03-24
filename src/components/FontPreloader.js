import React, { useEffect } from 'react';

const FontPreloader = () => {
  useEffect(() => {
    // Add preload links for fonts
    const fonts = [
      { href: './assets/Fonts/bricolage.ttf', type: 'font/ttf', family: 'Bricolage' },
      { href: './assets/Fonts/anton.ttf', type: 'font/ttf', family: 'Anton' },
      { href: './assets/Fonts/FiraSans-Bold.ttf', type: 'font/ttf', family: 'fira' },
      { href: './assets/Fonts/August.ttf', type: 'font/ttf', family: 'august' }
    ];

    // Create preload links in the head
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.href;
      link.as = 'font';
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // Also add font-face observer for faster loading
      const fontFaceObserver = `
        (function() {
          const font = new FontFace('${font.family}', 'url(${font.href})', {
            style: 'normal',
            weight: '${font.family === 'fira' ? 'bold' : 'normal'}',
            display: 'swap'
          });
          
          font.load().then(function() {
            document.fonts.add(font);
          }).catch(function(error) {
            console.error('Font loading failed:', error);
          });
        })();
      `;
      
      const script = document.createElement('script');
      script.textContent = fontFaceObserver;
      document.head.appendChild(script);
    });

    // Preload critical text
    const style = document.createElement('style');
    style.textContent = `
      .Unleash, .Creativity, .with, .highlight-text {
        font-family: 'Bricolage', 'Anton', sans-serif;
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('link[rel="preload"][as="font"]')
        .forEach(link => link.remove());
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FontPreloader; 