import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import "./ArambhEvent.css";

const ArambhEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);

    const countdownDate = new Date("September 28, 2024 00:00:00").getTime();
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

  const handleRegisterClick = () => {
    const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSd1qJ5jFgtGPoXuNDG8RK5r7y9gRJJfiUJKK38UYW4zdv8SWg/viewform?usp=pp_url"; // Replace with your actual Google Form link
    window.open(formLink, "_blank");
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="hero-section2" style={{ backgroundImage: "url('/images/Arambh-Workshop.png')" }}>
      <div className="overlay"></div>
      <header className="navbar"></header>
      <button className="back-button" onClick={handleBackClick}>Back</button>
      <div className="content">
        <p className="subtitle">Join Us for an Exciting Workshop</p>
        <h1 className="title">Arambh <br /> <span>A Workshop by Students, for Students</span></h1>
        <p className="details">September 28, 2024 | Venue TBD</p>
        <button className="register-btn" onClick={handleRegisterClick}>Register Now</button>
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

export default ArambhEvent;
