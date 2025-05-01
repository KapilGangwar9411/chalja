#!/bin/bash

# Install optimization dependencies
npm install --save-dev critters cross-env

# Install required dependencies for image optimization
npm install --save sharp

# Create directories needed for the build
mkdir -p public/images/optimized

# Optimize critical CSS
echo "Setting up critical CSS inlining with critters..."

# Make sure environment variables are set
export GENERATE_SOURCEMAP=false
export INLINE_RUNTIME_CHUNK=true

# Run main build
echo "Running optimized build..."
npm run build

echo "✅ Build complete with performance optimizations!" 