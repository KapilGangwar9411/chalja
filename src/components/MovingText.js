import React, { useEffect, useRef } from "react";
import '../assets/styles.css';


const MovingText = () => {
  const textLineRef = useRef(null);

  useEffect(() => {
    const textLine = textLineRef.current;
    const textContent = textLine.innerHTML;
    textLine.innerHTML = textContent + textContent;

  
    const textWidth = textLine.scrollWidth;
    textLine.style.animationDuration = `${textWidth / 80}s`;
  }, []);

  return (
    <div className="moving-text-container">
      <div className="text-line" ref={textLineRef}>
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
        Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum Spectrum
      </div>
    </div>
  );
};

export default MovingText;
