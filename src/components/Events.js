import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles.css';

const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      title: "Arambh",
      date: "September 28, 2024",
      time: "10:00 AM",
      venue: "Main Auditorium",
      category: "Workshop",
      description: "A workshop by the students, for the students.",
      image: "images/workshop.png",
      registrationFee: "Free",
      seats: 100
    },
    {
      id: 2,
      title: "Film Screening",
      date: "October 10, 2024",
      time: "6:00 PM",
      venue: "Open Air Theatre",
      category: "Entertainment",
      description: "Join us for a screening of short films.",
      image: "images/filmscreening.png",
      registrationFee: "₹50",
      seats: 200
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Lights, Camera, Diwali",
      date: "November 12, 2023",
      venue: "College Campus",
      category: "Competition",
      description: "Video making competition.",
      image: "images/lcdposter.png",
      participants: 150
    },
    {
      id: 4,
      title: "Night Photowalks",
      date: "March 4, 2023",
      venue: "City Streets",
      category: "Photography",
      description: "Capture the streets in chaos.",
      image: "images/PhotoWalks.png",
      participants: 75
    },
    {
      id: 5,
      title: "Food Donations",
      date: "January 26, 2023",
      venue: "Community Center",
      category: "Social",
      description: "Learn editing techniques from professionals.",
      image: "images/fooddonation.png",
      participants: 200
    },
    {
      id: 6,
      title: "Aarambh (Entrepreneurship Session)",
      date: "January 20, 2023",
      venue: "Seminar Hall",
      category: "Workshop",
      description: "Learn editing techniques from professionals.",
      image: "images/entreprenuer.png",
      participants: 120
    }
  ];

  const renderEventCard = (event, isPast = false) => (
    <div className="event-card-bms" key={event.id}>
      <div className="event-image-container">
        <img src={event.image} alt={event.title} className="event-image-bms" />
        <div className="event-category">{event.category}</div>
      </div>
      <div className="event-details-bms">
        <h3 className="event-title-bms">{event.title}</h3>
        <div className="event-info">
          <div className="info-item">
            <i className="far fa-calendar"></i>
            <span>{event.date}</span>
          </div>
          {!isPast && (
            <div className="info-item">
              <i className="far fa-clock"></i>
              <span>{event.time}</span>
            </div>
          )}
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.venue}</span>
          </div>
          {!isPast ? (
            <div className="event-registration">
              <div className="registration-info">
                <span className="fee">{event.registrationFee}</span>
                <span className="seats">{event.seats} seats available</span>
              </div>
              <button 
                className="register-button"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="past-event-stats">
              <span>{event.participants} Participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="events-page-bms">
        <div className="events-header">
          <button className="back-button-bms" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Events</h1>
        </div>

        <div className="events-filter">
          <button 
            className={`filter-button ${activeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`filter-button ${activeFilter === 'past' ? 'active' : ''}`}
            onClick={() => setActiveFilter('past')}
          >
            Past Events
          </button>
        </div>

        <div className="events-container-bms">
          {activeFilter === 'upcoming' ? (
            upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => renderEventCard(event))
            ) : (
              <div className="no-events">No upcoming events at the moment</div>
            )
          ) : (
            pastEvents.length > 0 ? (
              pastEvents.map(event => renderEventCard(event, true))
            ) : (
              <div className="no-events">No past events to show</div>
            )
          )}
        </div>
      </div>
      <footer className="footer-section">
        <div className="footer-content">
          <p>
            Designed and developed by
            <a 
              href="https://brandupcreatives.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-link"
            >
              <br></br>
              brandupcreatives.in👋
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Events;
