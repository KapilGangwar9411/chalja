import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles.css';
import Home from './components/Home';
import ShortFilms from './components/Short-Films/shortfilms';
import Events from './components/Events';
import AboutFilmscreening from './components/About-Events/FimlScreening/AboutFilmscreening';
import EventPopup from './components/Event-Popup/EventPopup';
import ArambhEvent from './components/About-Events/Arambh/ArambhEvent';
import LightsCameraDiwali from './components/About-Events/Lights-Camera-Diwali/LightsCameraDiwali';
import Footer from './components/Footer';
import Nightphoto from './components/About-Events/Night-Photowalks/nightphoto';
import Food from './components/About-Events/Food-donations/Food';

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
          <Route path="/events/2" element={<AboutFilmscreening />} />
          <Route path="/events/1" element={<ArambhEvent />} />
          <Route path="/events/3" element={<LightsCameraDiwali />} />
          <Route path="/events/4" element={<Nightphoto />} />
          <Route path="/events/5" element={<Food />} />
        </Routes>
      </Router>
      {showPopup && <EventPopup onClose={closePopup} />}
    </div>
  );
}

export default App;
