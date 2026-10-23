import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {demo} from './model.mjs';
import {svg} from './scene.mjs';

const {default: sharp} = await import(process.env.SHARP_MODULE || 'sharp');
const images = {};
const manifest = JSON.parse(await fs.readFile(new URL('./asset-manifest.json', import.meta.url)));
for (const asset of manifest.filter(asset => asset.width)) {
  images[asset.name] = 'data:image/png;base64,' + (await sharp(new URL('./assets/' + asset.name, import.meta.url).pathname).png().toBuffer()).toString('base64');
}

// The presentation changes; the original app scene and eight-second model do not.
const WIDTH = 1440, HEIGHT = 810, SCALE = .9;
const app = {x: (WIDTH - 390 * SCALE) / 2, y: 36, width: 390 * SCALE, height: 820 * SCALE, radius: 32};
if (app.y + app.height !== HEIGHT - app.y || app.x < 0) throw Error('App must be centered and fully visible');
const background = `<defs>
  <linearGradient id="wide-sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b3e4ff"/><stop offset=".53" stop-color="#85ceff"/><stop offset="1" stop-color="#a6defa"/></linearGradient>
  <radialGradient id="wide-glow"><stop stop-color="#d3f0ff" stop-opacity=".52"/><stop offset="1" stop-color="#d3f0ff" stop-opacity="0"/></radialGradient>
  <filter id="wide-shadow" x="-35%" y="-15%" width="170%" height="140%"><feGaussianBlur stdDeviation="15"/></filter>
  <clipPath id="wide-app-clip"><rect width="390" height="820" rx="${app.radius / SCALE}"/></clipPath>
</defs>
<rect width="1440" height="810" fill="url(#wide-sky)"/>
<ellipse cx="210" cy="130" rx="670" ry="470" fill="url(#wide-glow)"/>
<path d="M-100 41C35 111 116-57 264-42S359 77 471 39 601-60 729-15 822 95 935 44 1047-40 1150-28 1284 79 1520 14V-100H-100Z" fill="#d8f2ff" opacity=".29"/>
<path d="M-70 729C128 697 143 542 312 583S413 844 587 786 704 713 828 761 983 838 1114 758 1315 693 1496 752V900H-70Z" fill="#d1eeff" opacity=".27"/>
<path d="M-44 383C53 357 120 439 135 525 61 514-4 462-44 383Z" fill="#4cb6d6" opacity=".34"/>
<path d="M72 550C138 481 207 479 222 492 213 559 156 593 72 550Z" fill="#64c7dd" opacity=".22"/>
<path d="M1250 102C1255 43 1310-7 1340 5 1347 49 1312 99 1250 102Z" fill="#45b8d6" opacity=".38"/>
<path d="M1360 479C1354 421 1401 382 1479 383 1471 444 1429 480 1360 479Z" fill="#48b8d1" opacity=".29"/>
<path d="M1123 819C1196 713 1292 714 1336 732 1298 809 1226 839 1123 819Z" fill="#5cc0dd" opacity=".23"/>
<rect x="${app.x}" y="${app.y + 12}" width="${app.width}" height="${app.height}" rx="${app.radius}" fill="#3b9cce" opacity=".17" filter="url(#wide-shadow)"/>`;

async function draw(state) {
  const content = svg(state, {images}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${background}<g transform="translate(${app.x} ${app.y}) scale(${SCALE})"><g clip-path="url(#wide-app-clip)">${content}</g></g><rect x="${app.x}" y="${app.y}" width="${app.width}" height="${app.height}" rx="${app.radius}" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="1"/></svg>`;
  return sharp(Buffer.from(frame)).png().toBuffer();
}

const first = await draw(demo(0));
if (!first.equals(await draw(demo(8)))) throw Error('Wide loop source endpoints differ');
await fs.mkdir(new URL('./qa/wide-v2/', import.meta.url), {recursive: true});
if (process.argv.includes('--stills')) {
  for (const time of [0, 1.6, 3.3, 4.6, 5.5, 6.4, 7.5]) {
    await fs.writeFile(new URL(`./qa/wide-v2/frame-${time}.png`, import.meta.url), await draw(demo(time)));
  }
  await sharp(first).webp({quality: 94}).toFile(new URL('./preview-wide-v2.webp', import.meta.url).pathname);
  console.log('Wide Home poster and seven timeline stills complete. App bounds:', app);
} else {
  const ff = spawn('ffmpeg', ['-v', 'error', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', '30', '-i', '-', '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', new URL('./plant-explorer-wide-v2.mp4', import.meta.url).pathname], {stdio: ['pipe', 'inherit', 'inherit']});
  const done = once(ff, 'close');
  ff.stdin.on('error', () => {});
  for (let index = 0; index < 240; index++) {
    const bytes = await draw(demo(index === 239 ? 8 : index / 30));
    if (!ff.stdin.write(bytes)) await once(ff.stdin, 'drain');
  }
  ff.stdin.end();
  const [code] = await done;
  if (code) throw Error('ffmpeg ' + code);
  console.log('1440×810, 240 frames, 30 fps, 8 seconds; one rounded app viewport on sky blue. Source endpoint PNGs match.');
}
