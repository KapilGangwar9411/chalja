import React, { useEffect, useState } from 'react';
import './EventPopup.css';

const EventPopup = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const popupLastShown = localStorage.getItem('popupLastShown');
    const now = new Date().getTime();
    const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour = 3600000 ms

    if (!popupLastShown || (now - popupLastShown) > oneHourInMilliseconds) {
      setTimeout(() => {
        setIsPopupVisible(true);
        localStorage.setItem('popupLastShown', now);  // Store current timestamp
      }, 5000);  // Delay the popup by 5 seconds
    }
  }, []);

  useEffect(() => {
    const countdownDate = new Date("September 24, 2024 00:00:00").getTime();
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

  const handleClose = () => {
    setIsPopupVisible(false);
    onClose();
  };

  const handleRegister = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSd1qJ5jFgtGPoXuNDG8RK5r7y9gRJJfiUJKK38UYW4zdv8SWg/viewform?usp=pp_url', '_blank'); // Replace with your Google Form link
  };

  if (!isPopupVisible) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>&times;</button>
        <h2 className="event-name">Aarambh: Workshop for the Students by the Students</h2>
        <p className="event-description">Join us for an engaging workshop led by students, aimed at enhancing skills and fostering collaboration.</p>
        <p className="event-details">Date: October 23, 2024</p>
        <p className="event-details">Time: 3:00 PM</p>
        <p className="event-details">Venue: SFS Lab, NIET Greater Noida</p>
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
        <button className="register-btn" onClick={handleRegister}>Register Now</button>
      </div>
    </div>
  );
};

export default EventPopup;
