#!/bin/bash

# Create required directories
mkdir -p scripts
mkdir -p public/images/optimized

# Install additional dependencies
npm install --save compression express
npm install --save-dev source-map-explorer cross-env

# Make scripts executable
chmod +x scripts/optimize-images.js
chmod +x scripts/compress-assets.js
chmod +x server.js

echo "✅ Setup complete! You can now run the optimization scripts."
echo "📦 To build with optimizations: npm run build"
echo "🔍 To analyze bundle sizes: npm run analyze"
echo "🏃‍♂️ To serve optimized production build: npm run serve" 