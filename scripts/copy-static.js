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

  const localWm5Path = path.resolve(process.cwd(), 'node_modules/@qlik-oss/geo-webmap/Wm5Local.js');
  // make local webmap loadable as a module
  var data = fs.readFileSync(localWm5Path, 'utf8');
  fs.writeFileSync(
    path.resolve(process.cwd(), 'src/static/Wm5Local.js'),
    'const load=(idevio)=>{\n' + data.toString() + '\n};export default load;'
  );
}

if (require.main === module) {
  // execute if running directly from CLI
  copyExt();
}

module.exports = copyExt;
