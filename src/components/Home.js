import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import TeamSection from './TeamSection';
import JoinNowForm from './JoinNowForm';
import Loader from './Loader';
import Footer from './Footer';
import MovingText from './MovingText';
import EventsContainer from './EventsContainer';
import EventPopup from './Event-Popup/EventPopup';

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const openForm = () => {
    setIsFormOpen(true);
  };

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Header openForm={openForm} />
      <Hero openForm={openForm} />
      <JoinNowForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />
      <About />
      <EventsContainer />
      <TeamSection />
      <MovingText />
      <Footer />
    </div>
  );
};

export default Home;
