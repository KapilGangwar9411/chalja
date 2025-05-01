#!/bin/bash

# Create required directories
mkdir -p scripts
mkdir -p public/images/optimized

# Install production dependencies
npm install --save node-cache spdy workbox-webpack-plugin

# Install development dependencies
npm install --save-dev compression-webpack-plugin webpack-bundle-analyzer critters terser-webpack-plugin react-app-rewired

# Create certificates for HTTP/2 (for local development)
npm run generate-certs

# Make scripts executable
chmod +x scripts/optimize-images.js
chmod +x scripts/compress-assets.js
chmod +x server.js

# Optimize all images
npm run optimize-images

echo "✅ Extreme optimization setup complete!"
echo "📦 To build with maximum optimization: npm run build:production"
echo "🔍 To analyze bundle sizes: ANALYZE=true npm run build:production"
echo "🔥 To serve optimized production build with HTTP/2: npm run serve:prod"
echo ""
echo "⚡ With these optimizations, your site should now load in under 1 second!" 