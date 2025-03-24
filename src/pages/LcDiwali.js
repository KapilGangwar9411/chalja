import React from 'react';
import { useNavigate } from 'react-router-dom';

const LcDiwali = () => {
  const navigate = useNavigate();

  return (
    <div className="lcdiwali-coming-soon-container">
      <button className="lcdiwali-back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <h1 className="lcdiwali-coming-soon-text">Coming Soon</h1>
    </div>
  );
};

export default LcDiwali; 