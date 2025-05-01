import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Loader from './components/Loader';

// Lazy load the main App component with higher priority
const App = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "app" */ './App'));

// Preload critical resources
const preloadResources = () => {
  // Prioritize critical resources
  const resources = [
    { rel: 'preload', href: './assets/styles.css', as: 'style' },
    // Add connection preload for API endpoints if using any
    { rel: 'preconnect', href: 'https://firebasestorage.googleapis.com' }
  ];
  
  // Add resource hints for routes likely to be visited
  const prefetchRoutes = [
    '/static/js/main.chunk.js',
    '/static/js/vendors.chunk.js'
  ];
  
  resources.forEach(({ rel, href, as }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.as = as;
    document.head.appendChild(link);
  });
  
  // Prefetch likely routes after critical resources load
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
};

// Inline critical CSS to avoid render-blocking
const injectCriticalCSS = () => {
  const criticalCSS = `
    body { margin: 0; padding: 0; background-color: #f8f8f8; }
    .loader { display: flex; align-items: center; justify-content: center; height: 100vh; }
  `;
  
  const style = document.createElement('style');
  style.innerHTML = criticalCSS;
  document.head.appendChild(style);
};

// Execute preloads before rendering
preloadResources();
injectCriticalCSS();

// Initialize app with priority tasks first
const initApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  // Register service worker for caching and offline support
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
  
  // Configure performance metrics
  const reportPerformanceMetrics = () => {
    // Measure and report first paint for analytics
    if (window.performance && window.performance.mark) {
      window.performance.mark('app_first_paint');
    }
    
    // Report core web vitals
    reportWebVitals(metric => {
      if (metric.name === 'FCP' || metric.name === 'LCP' || metric.name === 'CLS') {
        console.log(metric);
        // Send to analytics service
      }
    });
  };
  
  // Use strict mode only in development for better performance in production
  if (process.env.NODE_ENV === 'development') {
    root.render(
      <React.StrictMode>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </React.StrictMode>
    );
  } else {
    root.render(
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    );
  }
  
  // Run metrics reporting after render
  reportPerformanceMetrics();
};

// Start app initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
