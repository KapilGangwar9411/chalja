// AboutFilmscreening.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import "./AboutFilmscreening.css";

const AboutFilmscreening = () => {
  // Initialize navigation
  const navigate = useNavigate();
  
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    const countdownDate = new Date("October 23, 2024 00:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days > 0 ? days : 0,
        hours: hours > 0 ? hours : 0,
        minutes: minutes > 0 ? minutes : 0,
        seconds: seconds > 0 ? seconds : 0,
      });
    };
    
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="hero-section3" style={{ backgroundImage: "url('/images/background1.png')" }}>
      <div className="overlay"></div>
      <header className="navbar">
      </header>
      
      <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Back Button */}

      <div className="content">
        <p className="subtitle">Hurry Up! Battle Start Soon</p>
        <h1 className="title">Film Screening Festival <br /> <span>Cinematography Challenges</span></h1>
        <p className="details">October 23-26, 2024 | NIET GROUND | Greater NOIDA, UP</p>
        <button className="festival-btn">Register Now</button>
        <div className="countdown">
          <div className="time-box">
            <span>{timeLeft.days}</span>
            <p>Days</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.hours}</span>
            <p>Hours</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.minutes}</span>
            <p>Minutes</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFilmscreening;
