/* eslint-disable no-restricted-globals */
/* global self */

// Service Worker for aggressive caching and offline support
const CACHE_NAME = 'spectrum-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/vendors.chunk.js',
  '/static/css/main.chunk.css',
  '/images/logooo.png',
  '/fonts/bricolage.ttf',
  '/fonts/anton.ttf'
];

// Install event - precache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Runtime caching strategy - network first with cache fallback
const networkFirstWithCache = async (request) => {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Cache not available for this request
    throw error;
  }
};

// Stale-while-revalidate strategy for non-critical assets
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to get from cache first
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in the background
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Update cache
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('Failed to fetch:', error);
    });
  
  // Return cached response immediately or wait for network
  return cachedResponse || fetchPromise;
};

// Cache-first strategy for static assets
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch and cache:', error);
    throw error;
  }
};

// Fetch event - apply different strategies based on request type
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests like Google Analytics
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // For API requests, use network-first with cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }
  
  // For static assets, use cache-first
  if (
    request.url.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2)$/) ||
    request.url.includes('/static/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // For HTML navigation requests, use stale-while-revalidate
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default - use stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
}); 