import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import TeamSection from './TeamSection';
import JoinNowForm from './JoinNowForm';
import Loader from './Loader';
import MovingText from './MovingText';
import EventsContainer from './EventsContainer';
import SocialMedia from './Social-Media/SocialMedia';
import Footer from './Footer';
import PhotoGallery from './PhotoGallery';
import GalleryShowcase from './GalleryShowcase';

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const openForm = () => {
    setIsFormOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Add scroll event listener for section detection
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="main-container">
      <Header openForm={openForm} activeSection={activeSection} />
      
      {/* Hero Section */}
      <section id="hero" className="section-container">
        <Hero openForm={openForm} />
      </section>

      {/* About Section */}
      <section id="about" className="section-container">
        <About />
      </section>

      {/* Video Showcase Section */}
      <section id="video-showcase" className="section-container">
        <GalleryShowcase />
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="section-container">
        <PhotoGallery />
      </section>

      {/* Team Section */}
      <section id="team" className="section-container">
        <TeamSection />
      </section>

      {/* Events Section */}
      <section id="events" className="section-container">
        <EventsContainer />
      </section>

      {/* Moving Text Section */}
      <section id="highlights" className="section-container">
        <MovingText />
      </section>

      {/* Social Media Section */}
      <section id="social" className="section-container">
        <SocialMedia />
      </section>

      {/* Join Form Modal */}
      <JoinNowForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
