import React from 'react';
import '../assets/styles.css';

const EventsContainer = () => {
  const handleEventsClick = () => {
    window.location.href = '/events'; // Navigate to the Events page
  };

  return (
    <section
      className="events-section2"
      id="events"
      style={{ backgroundImage: 'url(/images/background1.png)' }} // Direct URL reference
    >
      <div className="events-container">
        <h2 className="events-title">Upcoming Events</h2>
        <p className="events-description">Join us for our exciting events and bookings!</p>
        <button className="events-button" onClick={handleEventsClick}>
          Events & Bookings
        </button>
      </div>
    </section>
  );
}

export default EventsContainer;
