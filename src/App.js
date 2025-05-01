import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './assets/styles.css';
import Home from './components/Home';
import ShortFilms from './components/Short-Films/shortfilms';
import Events from './components/Events';
import AboutFilmscreening from './components/About-Events/FimlScreening/AboutFilmscreening';
import ArambhEvent from './components/About-Events/Arambh/ArambhEvent';
import LightsCameraDiwali from './components/About-Events/Lights-Camera-Diwali/LightsCameraDiwali';
import Nightphoto from './components/About-Events/Night-Photowalks/nightphoto';
import Food from './components/About-Events/Food-donations/Food';
import ImagePreloader from './components/ImagePreloader';
import FontPreloader from './components/FontPreloader';
import Header from './components/Header';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LcDiwali from './pages/LcDiwali';
import Signup from './pages/Signup';
import { setupSuperAdmin } from './utils/setupSuperAdmin';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import VideoEditing from './components/VideoEditing/VideoEditing';
import { HelmetProvider } from 'react-helmet-async';

// Error Page component
const ErrorPage = () => (
  <div className="error-page">
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <a href="/">Go to Home</a>
  </div>
);

// Layout component to handle header visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = ['/admin-login', '/admin/dashboard', '/admin/super-dashboard', '/signup'].includes(location.pathname);

  return (
    <>
      {!isAdminPage && <Header />}
      {children}
    </>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize super admin account
    try {
      setupSuperAdmin();
    } catch (error) {
      console.error('Error setting up super admin:', error);
    }
  }, []);

  useEffect(() => {
    // Add error logging for debugging white screen
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error:', { message, source, lineno, colno, error });
    };

    // Add unhandled promise rejection handler
    window.onunhandledrejection = function(event) {
      console.error('Unhandled promise rejection:', event.reason);
    };

    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <ImagePreloader />
          <FontPreloader />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/short-films" element={<ShortFilms />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/2" element={<AboutFilmscreening />} />
                <Route path="/events/1" element={<ArambhEvent />} />
                <Route path="/events/3" element={<LightsCameraDiwali />} />
                <Route path="/events/4" element={<Nightphoto />} />
                <Route path="/events/5" element={<Food />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
                <Route path="/lcdiwali" element={<LcDiwali />} />
                <Route path="/video-editing" element={<VideoEditing />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Layout>
          </Router>
          <Analytics />
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
