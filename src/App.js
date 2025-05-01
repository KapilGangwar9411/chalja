import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './assets/styles.css';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { setupSuperAdmin } from './utils/setupSuperAdmin';
import { HelmetProvider } from 'react-helmet-async';
import ImagePreloader from './components/ImagePreloader';
import FontPreloader from './components/FontPreloader';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const ShortFilms = lazy(() => import('./components/Short-Films/shortfilms'));
const Events = lazy(() => import('./components/Events'));
const AboutFilmscreening = lazy(() => import('./components/About-Events/FimlScreening/AboutFilmscreening'));
const ArambhEvent = lazy(() => import('./components/About-Events/Arambh/ArambhEvent'));
const LightsCameraDiwali = lazy(() => import('./components/About-Events/Lights-Camera-Diwali/LightsCameraDiwali'));
const Nightphoto = lazy(() => import('./components/About-Events/Night-Photowalks/nightphoto'));
const Food = lazy(() => import('./components/About-Events/Food-donations/Food'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const LcDiwali = lazy(() => import('./pages/LcDiwali'));
const Signup = lazy(() => import('./pages/Signup'));
const VideoEditing = lazy(() => import('./components/VideoEditing/VideoEditing'));

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

    // Use requestIdleCallback for non-critical tasks
    const loadNonCriticalResources = () => {
      // You can load non-critical resources here
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNonCriticalResources);
    } else {
      setTimeout(loadNonCriticalResources, 2000);
    }

    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduced from 2000ms to 1000ms

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
                <Route path="/" element={
                  <Suspense fallback={<Loader />}>
                    <Home />
                  </Suspense>
                } />
                <Route path="/short-films" element={
                  <Suspense fallback={<Loader />}>
                    <ShortFilms />
                  </Suspense>
                } />
                <Route path="/events" element={
                  <Suspense fallback={<Loader />}>
                    <Events />
                  </Suspense>
                } />
                <Route path="/events/2" element={
                  <Suspense fallback={<Loader />}>
                    <AboutFilmscreening />
                  </Suspense>
                } />
                <Route path="/events/1" element={
                  <Suspense fallback={<Loader />}>
                    <ArambhEvent />
                  </Suspense>
                } />
                <Route path="/events/3" element={
                  <Suspense fallback={<Loader />}>
                    <LightsCameraDiwali />
                  </Suspense>
                } />
                <Route path="/events/4" element={
                  <Suspense fallback={<Loader />}>
                    <Nightphoto />
                  </Suspense>
                } />
                <Route path="/events/5" element={
                  <Suspense fallback={<Loader />}>
                    <Food />
                  </Suspense>
                } />
                <Route path="/admin-login" element={
                  <Suspense fallback={<Loader />}>
                    <AdminLogin />
                  </Suspense>
                } />
                <Route path="/signup" element={
                  <Suspense fallback={<Loader />}>
                    <Signup />
                  </Suspense>
                } />
                <Route path="/admin/dashboard" element={
                  <Suspense fallback={<Loader />}>
                    <AdminDashboard />
                  </Suspense>
                } />
                <Route path="/admin/super-dashboard" element={
                  <Suspense fallback={<Loader />}>
                    <SuperAdminDashboard />
                  </Suspense>
                } />
                <Route path="/lcdiwali" element={
                  <Suspense fallback={<Loader />}>
                    <LcDiwali />
                  </Suspense>
                } />
                <Route path="/video-editing" element={
                  <Suspense fallback={<Loader />}>
                    <VideoEditing />
                  </Suspense>
                } />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Layout>
          </Router>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
