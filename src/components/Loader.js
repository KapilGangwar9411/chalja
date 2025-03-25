import React from 'react';
import '../assets/styles.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <img src="/images/lens.png" alt="Loading..." className="loader-logo" />
      </div>
    </div>
  );
};

export default Loader;
