const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Configuration
const config = {
  buildDir: './build',
  extensions: ['.js', '.css', '.html', '.json', '.svg'],
  compressionLevel: zlib.constants.Z_BEST_COMPRESSION,
  minSize: 1024 // Only compress files larger than 1KB
};

// Get all files in a directory recursively
function getAllFiles(dir, ext = null) {
  const files = [];
  
  function traverseDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverseDir(fullPath);
      } else if (!ext || ext.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }
  
  traverseDir(dir);
  return files;
}

// Compress a file using gzip and brotli
async function compressFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Skip small files
    if (fileContent.length < config.minSize) {
      console.log(`Skipping small file (${fileContent.length} bytes): ${filePath}`);
      return;
    }
    
    // Gzip compression
    const gzipOutput = path.join(filePath + '.gz');
    const gzipped = zlib.gzipSync(fileContent, { level: config.compressionLevel });
    fs.writeFileSync(gzipOutput, gzipped);
    
    // Brotli compression if available
    if (zlib.createBrotliCompress) {
      const brotliOutput = path.join(filePath + '.br');
      const brotliParams = {
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT
      };
      const brotlied = zlib.brotliCompressSync(fileContent, brotliParams);
      fs.writeFileSync(brotliOutput, brotlied);
      
      const originalSize = fileContent.length;
      const gzipSize = gzipped.length;
      const brotliSize = brotlied.length;
      
      console.log(`Compressed ${filePath}:
        Original: ${(originalSize / 1024).toFixed(2)} KB
        Gzip:     ${(gzipSize / 1024).toFixed(2)} KB (${(100 - (gzipSize / originalSize) * 100).toFixed(2)}% reduction)
        Brotli:   ${(brotliSize / 1024).toFixed(2)} KB (${(100 - (brotliSize / originalSize) * 100).toFixed(2)}% reduction)
      `);
    } else {
      const originalSize = fileContent.length;
      const gzipSize = gzipped.length;
      
      console.log(`Compressed ${filePath}:
        Original: ${(originalSize / 1024).toFixed(2)} KB
        Gzip:     ${(gzipSize / 1024).toFixed(2)} KB (${(100 - (gzipSize / originalSize) * 100).toFixed(2)}% reduction)
      `);
    }
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  console.log('Starting asset compression...');
  
  if (!fs.existsSync(config.buildDir)) {
    console.error(`Build directory not found: ${config.buildDir}`);
    return;
  }
  
  const files = getAllFiles(config.buildDir, config.extensions);
  console.log(`Found ${files.length} files to compress`);
  
  for (const file of files) {
    await compressFile(file);
  }
  
  console.log('Asset compression complete!');
}

// Run the script
main().catch(console.error); 