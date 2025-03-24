const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'public', 'images');

const convertToWebP = async (inputFile) => {
  const outputFile = inputFile.replace('.png', '.webp');
  try {
    await sharp(inputFile)
      .webp({ quality: 80 }) // 80% quality for good balance between size and quality
      .toFile(outputFile);
    console.log(`Converted ${inputFile} to ${outputFile}`);
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
  }
};

// Convert all PNG images
const images = [
  path.join(imageDir, 'cinematography.png'),
  path.join(imageDir, 'film-making.png'),
  path.join(imageDir, 'editing.png')
];

Promise.all(images.map(convertToWebP))
  .then(() => console.log('All images converted successfully!'))
  .catch(error => console.error('Error during conversion:', error)); 