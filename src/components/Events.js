import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles.css'; // Ensure this contains the animations

const Events = () => {
  const navigate = useNavigate();

  const upcomingEvents = [
    {
      id: 1,
      title: "Arambh",
      date: "September 28, 2024",
      description: "A workshop by students, for students.",
      image: "images/event2.png"
    },
    {
      id: 2,
      title: "Film Screening",
      date: "October 10, 2024",
      description: "Join us for a screening of award-winning short films.",
      image: "images/event1.png"
    },
    // Add other upcoming events here...
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Director's Talk",
      date: "December 5, 2023",
      description: "An insightful talk with renowned filmmakers.",
      image: "images/event3.png"
    },
    {
      id: 4,
      title: "Editing Masterclass",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    {
      id: 5,
      title: "Editing Masterclass",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    {
      id: 6,
      title: "Editing Masterclass",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    {
      id: 7,
      title: "Editing Masterclass",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    {
      id: 8,
      title: "Editing Masterclass",
      date: "January 20, 2023",
      description: "Learn editing techniques from professionals.",
      image: "images/event4.png"
    },
    // Add other past events here...
  ];

  return (
    <div className="my-events-page">
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
