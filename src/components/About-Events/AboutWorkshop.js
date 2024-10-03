import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AboutWorkshop.css"; // Make sure you create a corresponding CSS file for styling

const AboutWorkshop = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const countdownDate = new Date("November 12, 2024 00:00:00").getTime();
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
    <div className="hero-section" style={{ backgroundImage: "url('/images/background2.png')" }}>
      <div className="overlay"></div>
      <header className="navbar">
        {/* Optional Navbar */}
      </header>
      
      <div className="content">
        <p className="subtitle">Don't Miss Out! Workshop Starts Soon</p>
        <h1 className="title">Cinematography Workshop <br /> <span>Hands-on Experience</span></h1>
        <p className="details">November 12-14, 2024 | NIET LAB | Greater NOIDA, UP</p>
        <button className="workshop-btn">Register Now</button>
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

export default AboutWorkshop;
