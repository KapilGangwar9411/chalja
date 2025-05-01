const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const spdy = require('spdy'); // HTTP/2 support
const NodeCache = require('node-cache');

// Initialize memory cache with 10 minute TTL
const memCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const app = express();
const PORT = process.env.PORT || 5000;

// Super aggressive compression
app.use(compression({ 
  level: 9, 
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Memory caching middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = memCache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        memCache.set(key, body, duration);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Apply cache middleware to routes
app.use('/', cacheMiddleware(60)); // 1 minute cache for dynamic routes
app.use('/static', cacheMiddleware(86400)); // 24 hour cache for static assets

// Security headers
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - adjust as needed for your app
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebasestorage.googleapis.com;");
  
  // Set keep-alive for faster subsequent requests
  res.setHeader('Connection', 'keep-alive');
  
  next();
});

// Prioritize brotli over gzip for better compression ratios
app.get('*.js', (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const jsFile = path.join(__dirname, 'build', req.path);
  
  if (acceptEncoding.includes('br') && fs.existsSync(jsFile + '.br')) {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript');
  } else if (acceptEncoding.includes('gzip') && fs.existsSync(jsFile + '.gz')) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/javascript');
  }
  
  next();
});

// Serve brotli compressed CSS files if available and supported
app.get('*.css', (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const cssFile = path.join(__dirname, 'build', req.path);
  
  if (acceptEncoding.includes('br') && fs.existsSync(cssFile + '.br')) {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'text/css');
  } else if (acceptEncoding.includes('gzip') && fs.existsSync(cssFile + '.gz')) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
  }
  
  next();
});

// HTML compression for direct HTML responses
app.get('*.html', (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const htmlFile = path.join(__dirname, 'build', req.path);
  
  if (acceptEncoding.includes('br') && fs.existsSync(htmlFile + '.br')) {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'text/html');
  } else if (acceptEncoding.includes('gzip') && fs.existsSync(htmlFile + '.gz')) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/html');
  }
  
  next();
});

// Set caching headers based on file type
app.use((req, res, next) => {
  const url = req.url;
  
  // Set long-term caching for static assets with hashed filenames (2 years)
  if (url.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2)(\?.*)?$/)) {
    const hasVersioning = url.includes('?v=') || url.match(/\.[0-9a-f]{8,}\./);
    
    if (hasVersioning) {
      res.setHeader('Cache-Control', 'public, max-age=63072000, immutable');
    } else {
      // For non-versioned assets, use shorter cache time (7 days)
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  } else if (url === '/' || url.includes('index.html')) {
    // Never cache the main HTML file
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Serve static files from the build directory with aggressive caching
app.use(express.static(path.join(__dirname, 'build'), {
  etag: true,
  lastModified: true,
  maxAge: '30d',
  immutable: true
}));

// Handle client-side routing - redirect all non-asset requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create HTTP/2 server options
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8')
};

// Comment out these lines if you don't have certificates yet
// Start HTTP/2 server
/*
spdy.createServer(options, app).listen(PORT, () => {
  console.log(`HTTP/2 Server running on port ${PORT}`);
});
*/

// Fallback to HTTP/1.1 if no certificates
app.listen(PORT, () => {
  console.log(`HTTP/1.1 Server running on port ${PORT}`);
}); 