import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles.css'; // Ensure this contains the animations

const Events = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const events = [
    {
      title: "Film Screening",
      date: "October 10, 2024",
      description: "Join us for a screening of award-winning short films.",
      image: "images/event1.png"
    },
    {
      title: "Cinematography Workshop",
      date: "November 12, 2024",
      description: "A hands-on workshop with industry experts.",
      image: "images/event2.png"
    },
    {
      title: "Director's Talk",
      date: "December 5, 2024",
      description: "An insightful talk with renowned filmmakers.",
      image: "images/event3.png"
    },
    {
      title: "Editing Masterclass",
      date: "January 20, 2025",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    {
      title: "Music in Cinema",
      date: "February 10, 2025",
      description: "A seminar on the importance of music in films.",
      image: "images/event5.png"
    },
    {
      title: "Camera Handling Workshop",
      date: "March 25, 2025",
      description: "Hands-on camera handling and cinematography tips.",
      image: "images/event6.png"
    }
  ];

  return (
    <div className="my-events-page">
      <h1>Upcoming Events</h1>
      <div className="events-container">
        {events.map((event, index) => (
          <div className="event-card fade-in" key={index}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-details">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date}</p>
              <p>{event.description}</p>
              <div className="event-buttons2">
                <button onClick={() => navigate('/about')}>More Details & Bookings</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
