import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles.css';

const Events = () => {
  const navigate = useNavigate();

  const upcomingEvents = [
    {
      id: 1,
      title: "Arambh",
      date: "September 28, 2024",
      description: "A workshop by the students, for the students.",
      image: "images/workshop.png"
    },
    {
      id: 2,
      title: "Film Screening",
      date: "October 10, 2024",
      description: "Join us for a screening of short films.",
      image: "images/filmscreening.png"
    },
    // Add other upcoming events here...
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Lights, Camera, Diwali",
      date: "November 12, 2023",
      description: "Video making competition.",
      image: "images/lcdposter.png"
    },
    {
      id: 4,
      title: "Night Photowalks",
      date: "4 March 2023",
      description: "Capture the streets in chaos.",
      image: "images/PhotoWalks.png"
    },
    {
      id: 5,
      title: "Food Donations",
      date: "January 26, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/fooddonation.png"
    },
    {
      id: 6,
      title: "Aarambh (Entrepreneurship Session)",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/entreprenuer.png"
    },
    {
      id: 7,
      title: "Debug-e-Palooza",
      date: "January 20, 2023",
      description: "Contribution through high-quality video recording and coverage.",
      image: "images/coding.png"
    },
    {
      id: 8,
      title: "Video Walks",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/videowalks.png"
    },
    // Add other past events here...
  ];

  return (
    <div className="my-events-page">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Back Button */}
      
      <h1>Upcoming Events</h1>
      <div className="events-container">
        {upcomingEvents.map((event) => (
          <div className="event-card fade-in" key={event.id}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-details">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date}</p>
              <p>{event.description}</p>
              <div className="event-buttons">
                <button onClick={() => navigate(`/events/${event.id}`)}>More Details & Bookings</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1>Past Events</h1>
      <div className="events-container">
        {pastEvents.map((event) => (
          <div className="event-card fade-in" key={event.id}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-details">
              <h2>{event.title}</h2>
              <p className="event-date">{event.date}</p>
              <p>{event.description}</p>
              <div className="event-buttons">
                <button onClick={() => navigate(`/events/${event.id}`)}>More Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
