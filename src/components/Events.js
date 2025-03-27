import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import './Events.css';
import Loader from './Loader';
import Header from './Header';
import Footer from './Footer';

const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
              status: eventDate >= now ? 'upcoming' : 'past',
              formattedDate: eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            };
          });

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

  const filterEvents = (eventsList) => {
    return eventsList.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getUniqueCategories = () => {
    const allEvents = [...events.upcoming, ...events.past];
    return ['all', ...new Set(allEvents.map(event => event.category))];
  };

  const renderEventCard = (event, isPast = false) => (
    <div className="spec_event_card" key={event.id}>
      <div className="spec_event_image_wrap">
        <img 
          src={event.image} 
          alt={event.title} 
          className="spec_event_image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-event.png';
          }}
        />
        <div className="spec_event_overlay">
          <span className="spec_event_category">{event.category}</span>
          {!isPast && event.availableSeats > 0 && (
            <span className="spec_seats_badge">
              {event.availableSeats} seats left
            </span>
          )}
        </div>
      </div>
      <div className="spec_event_details">
        <h3 className="spec_event_title">{event.title}</h3>
        <div className="spec_event_info">
          <div className="spec_info_item">
            <i className="far fa-calendar"></i>
            <span>{event.formattedDate}</span>
          </div>
          {!isPast && (
            <div className="spec_info_item">
              <i className="far fa-clock"></i>
              <span>{event.time}</span>
            </div>
          )}
          <div className="spec_info_item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.venue}</span>
          </div>
          {!isPast ? (
            <div className="spec_registration_wrap">
              <div className="spec_price_info">
                <span className="spec_price">
                  {event.registrationFee === 0 ? 'Free Entry' : `₹${event.registrationFee}`}
                </span>
                {event.availableSeats <= 5 && event.availableSeats > 0 && (
                  <span className="spec_limited_seats">Limited seats!</span>
                )}
              </div>
              <button 
                className={`spec_register_btn ${event.availableSeats <= 0 ? 'spec_sold_out' : ''}`}
                onClick={() => navigate(`/events/${event.id}`)}
                disabled={event.availableSeats <= 0}
              >
                {event.availableSeats <= 0 ? 'Sold Out' : 'Register Now'}
              </button>
            </div>
          ) : (
            <div className="spec_past_event">
              <i className="fas fa-users"></i>
              <span>{event.participants || 0} Participants attended</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="spec_loader_container">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="spec_error_container">
          <i className="fas fa-exclamation-circle spec_error_icon"></i>
          <p className="spec_error_message">{error}</p>
          <button onClick={() => window.location.reload()} className="spec_retry_btn">
            <i className="fas fa-redo"></i> Try Again
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const currentEvents = activeFilter === 'upcoming' ? events.upcoming : events.past;
  const filteredEvents = filterEvents(currentEvents);

  return (
    <>
      <Header />
      <main className="spec_events_page">
        <div className="spec_events_content">
          <div className="spec_events_header">
            <button className="spec_back_btn" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>Discover Events</h1>
            <button 
              className="spec_filter_toggle" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
            </button>
          </div>

          <div className={`spec_filters_section ${showFilters ? 'show' : ''}`}>
            <div className="spec_search_wrap">
              <i className="fas fa-search spec_search_icon"></i>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="spec_search_input"
              />
            </div>

            <div className="spec_filter_controls">
              <div className="spec_filter_buttons">
                <button 
                  className={`spec_filter_btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('upcoming')}
                >
                  <i className="fas fa-calendar-alt"></i> Upcoming
                </button>
                <button 
                  className={`spec_filter_btn ${activeFilter === 'past' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('past')}
                >
                  <i className="fas fa-history"></i> Past Events
                </button>
              </div>

              <select 
                className="spec_category_select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="spec_events_grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => renderEventCard(event, activeFilter === 'past'))
            ) : (
              <div className="spec_no_events">
                <i className="fas fa-calendar-times"></i>
                <p>
                  {searchTerm || selectedCategory !== 'all'
                    ? "No events found matching your criteria"
                    : activeFilter === 'upcoming'
                    ? "No upcoming events at the moment"
                    : "No past events to show"}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button 
                    className="spec_clear_filters"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Events;
