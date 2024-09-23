import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles.css';
import Home from './components/Home';
import ShortFilms from './components/ShortFilms';
import Events from './components/Events';
import AboutFilmscreening from './components/About-Events/FimlScreening/AboutFilmscreening';
import EventPopup from './components/Event-Popup/EventPopup';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  // Log components to debug
  console.log('AboutFilmscreening:', AboutFilmscreening);
  console.log('EventPopup:', EventPopup);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/short-films" element={<ShortFilms />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<AboutFilmscreening />} />
        </Routes>
      </Router>
      {showPopup && <EventPopup onClose={closePopup} />}
    </div>
  );
}

export default App;
