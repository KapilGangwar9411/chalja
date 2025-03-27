import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import '../assets/styles.css';
import Loader from './Loader';

const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const eventsRef = ref(database, 'events');
      const unsubscribe = onValue(eventsRef, (snapshot) => {
        if (snapshot.exists()) {
          const eventsData = snapshot.val();
          const eventsArray = Object.entries(eventsData).map(([id, data]) => {
            const eventDate = new Date(data.date);
            const now = new Date();
            
            return {
              id,
              ...data,
              availableSeats: data.seats - (data.participants || 0),
              status: eventDate >= now ? 'upcoming' : 'past'
            };
          });

          // Sort events by date
          const upcoming = eventsArray
            .filter(event => event.status === 'upcoming')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          const past = eventsArray
            .filter(event => event.status === 'past')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setEvents({ upcoming, past });
        } else {
          setEvents({ upcoming: [], past: [] });
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up events listener:', err);
      setError('Failed to initialize events. Please try again later.');
      setLoading(false);
    }
  }, []);

  const renderEventCard = (event, isPast = false) => (
    <div className="event-card-bms" key={event.id}>
      <div className="event-image-container">
        <img 
          src={event.image} 
          alt={event.title} 
          className="event-image-bms"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-event.png';
          }}
        />
        <div className="event-category">{event.category}</div>
      </div>
      <div className="event-details-bms">
        <h3 className="event-title-bms">{event.title}</h3>
        <div className="event-info">
          <div className="info-item">
            <i className="far fa-calendar"></i>
            <span>{new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
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
                <span className="fee">
                  {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                </span>
                <span className="seats">
                  {event.availableSeats} seats available
                </span>
              </div>
              <button 
                className="register-button"
                onClick={() => navigate(`/events/${event.id}`)}
                disabled={event.availableSeats <= 0}
              >
                {event.availableSeats <= 0 ? 'Sold Out' : 'Register Now'}
              </button>
            </div>
          ) : (
            <div className="past-event-stats">
              <span>{event.participants || 0} Participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

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
            events.upcoming && events.upcoming.length > 0 ? (
              events.upcoming.map(event => renderEventCard(event))
            ) : (
              <div className="no-events">No upcoming events at the moment</div>
            )
          ) : (
            events.past && events.past.length > 0 ? (
              events.past.map(event => renderEventCard(event, true))
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
