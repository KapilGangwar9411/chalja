const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Compress all responses
app.use(compression({ level: 6, threshold: 0 }));

// Security headers
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - adjust as needed for your app
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebasestorage.googleapis.com;");
  
  next();
});

// Serve brotli compressed files if available and supported
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

// Set caching headers based on file type
app.use((req, res, next) => {
  const url = req.url;
  
  // Set long-term caching for static assets with hashed filenames (1 year)
  if (url.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2)(\?.*)?$/)) {
    const hasVersioning = url.includes('?v=') || url.match(/\.[0-9a-f]{8,}\./);
    
    if (hasVersioning) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      // For non-versioned assets, use shorter cache time (1 day)
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  } else if (url === '/' || url.includes('index.html')) {
    // Never cache the main HTML file
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build'), {
  etag: true,
  lastModified: true,
  maxAge: '30d' // Default fallback
}));

// Handle client-side routing - redirect all non-asset requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 