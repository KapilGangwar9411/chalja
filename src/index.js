import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
