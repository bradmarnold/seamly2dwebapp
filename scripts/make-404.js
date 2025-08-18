// scripts/make-404.js
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const index = path.join(outDir, 'index.html');
const notFound = path.join(outDir, '404.html');

if (fs.existsSync(index)) {
  fs.copyFileSync(index, notFound);
  console.log('Created out/404.html from out/index.html');
}