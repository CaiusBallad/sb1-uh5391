import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCopy = [
  'manifest.json',
  'icon16.png',
  'icon48.png',
  'icon128.png'
];

filesToCopy.forEach(file => {
  const sourcePath = path.resolve(__dirname, file);
  const destPath = path.resolve(__dirname, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} successfully.`);
  } else {
    console.warn(`Warning: ${file} not found. Skipping.`);
  }
});

console.log('File copying process completed.');