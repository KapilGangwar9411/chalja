const fs = require('fs');
const path = require('path');
const ttf2woff2 = require('ttf2woff2');

// Install ttf2woff2 first: npm install ttf2woff2

const fontDir = path.join(__dirname, 'src', 'assets', 'Fonts');

const convertToWoff2 = (inputFile) => {
  try {
    const input = fs.readFileSync(inputFile);
    const output = ttf2woff2(input);
    const outputFile = inputFile.replace('.ttf', '.woff2');
    fs.writeFileSync(outputFile, output);
    console.log(`Converted ${inputFile} to ${outputFile}`);
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
  }
};

// Convert all TTF fonts
const fonts = [
  path.join(fontDir, 'bricolage.ttf'),
  path.join(fontDir, 'anton.ttf'),
  path.join(fontDir, 'FiraSans-Bold.ttf'),
  path.join(fontDir, 'August.ttf')
];

console.log('Starting font conversion...');
fonts.forEach(convertToWoff2);
console.log('Font conversion complete!'); 