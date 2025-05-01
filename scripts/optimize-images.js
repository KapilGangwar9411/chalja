const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  sourceDirs: ['./public/images'],
  outputDir: './public/images/optimized',
  sizes: [320, 640, 1024, 1280, 1920],
  quality: 80,
  skipExisting: true,
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Process an image file
async function processImage(filePath, fileName) {
  const fileExt = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, fileExt);
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  if (!supportedFormats.includes(fileExt)) {
    console.log(`Skipping unsupported file format: ${fileName}`);
    return;
  }

  console.log(`Processing: ${fileName}`);
  
  try {
    // Load the image
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Only process images that are larger than our smallest size
    if (metadata.width < config.sizes[0] || metadata.height < config.sizes[0]) {
      console.log(`Skipping small image: ${fileName} (${metadata.width}x${metadata.height})`);
      return;
    }
    
    // Create WebP original
    const webpOriginalPath = path.join(config.outputDir, `${baseName}.webp`);
    if (!fs.existsSync(webpOriginalPath) || !config.skipExisting) {
      await image
        .webp({ quality: config.quality })
        .toFile(webpOriginalPath);
    }
    
    // Create optimized original format
    const optimizedOriginalPath = path.join(config.outputDir, fileName);
    if (!fs.existsSync(optimizedOriginalPath) || !config.skipExisting) {
      await image
        .toFormat(fileExt === '.png' ? 'png' : 'jpeg', { quality: config.quality })
        .toFile(optimizedOriginalPath);
    }
    
    // Create resized versions for each size
    for (const size of config.sizes) {
      // Skip sizes larger than the original
      if (size >= metadata.width) {
        continue;
      }
      
      // Create resized WebP
      const webpResizedPath = path.join(config.outputDir, `${baseName}-${size}px.webp`);
      if (!fs.existsSync(webpResizedPath) || !config.skipExisting) {
        await image
          .resize(size)
          .webp({ quality: config.quality })
          .toFile(webpResizedPath);
      }
      
      // Create resized original format
      const resizedOriginalPath = path.join(config.outputDir, `${baseName}-${size}px${fileExt}`);
      if (!fs.existsSync(resizedOriginalPath) || !config.skipExisting) {
        await image
          .resize(size)
          .toFormat(fileExt === '.png' ? 'png' : 'jpeg', { quality: config.quality })
          .toFile(resizedOriginalPath);
      }
    }
    
    console.log(`Successfully processed: ${fileName}`);
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
}

// Recursively scan directories
async function scanDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath);
    } else {
      await processImage(fullPath, entry.name);
    }
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  // Process each source directory
  for (const sourceDir of config.sourceDirs) {
    if (fs.existsSync(sourceDir)) {
      await scanDirectory(sourceDir);
    } else {
      console.error(`Source directory not found: ${sourceDir}`);
    }
  }
  
  console.log('Image optimization complete!');
}

// Run the script
main().catch(console.error); 