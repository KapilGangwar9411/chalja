import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Loader from './components/Loader';

// Lazy load the main App component
const App = lazy(() => import('./App'));

// Preload critical CSS
const preloadCriticalCSS = () => {
  const links = [
    { rel: 'preload', href: './assets/styles.css', as: 'style' }
  ];
  
  links.forEach(({ rel, href, as }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

// Execute preload before rendering
preloadCriticalCSS();

const root = ReactDOM.createRoot(document.getElementById('root'));

// Use StrictMode only in development
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

// Configure web vitals reporting
reportWebVitals(metric => {
  // Only send critical metrics to improve performance
  if (metric.name === 'FCP' || metric.name === 'LCP' || metric.name === 'CLS') {
    console.log(metric);
    // You can send to an analytics endpoint here
  }
});
