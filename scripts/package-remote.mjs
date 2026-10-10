import {readFileSync, writeFileSync, existsSync, renameSync, readdirSync} from 'node:fs';
const root = 'dist/web-remote';
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
writeFileSync(`${root}/assets/version.js`, `window.appVersion = "${version}";\n`);
if (existsSync(`${root}/media`)) renameSync(`${root}/media`, `${root}/assets/media`);
for (const file of readdirSync(root).filter(name => name.startsWith('styles-') && name.endsWith('.css'))) {
  const path = `${root}/${file}`;
  writeFileSync(path, readFileSync(path, 'utf8').replaceAll('./media/', './assets/media/'));
}
if (!existsSync(`${root}/index.html`) || !existsSync(`${root}/assets/favicon.ico`)) throw Error('Incomplete remote build');
