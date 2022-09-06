/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');

function copyExt() {
  // copying static files to sn-map-ext
  let targetPath = [process.cwd(), 'sn-map-ext/static'];
  let target = path.resolve(...targetPath);
  fs.copySync(path.resolve(process.cwd(), 'src/static'), target);
  console.log('Copied static files into ext!');

  // copying static files to dist
  targetPath = [process.cwd(), 'dist/static'];
  target = path.resolve(...targetPath);
  fs.copySync(path.resolve(process.cwd(), 'src/static'), target);
  console.log('Copied static files into build!');
}

if (require.main === module) {
  // execute if running directly from CLI
  copyExt();
}

module.exports = copyExt;
