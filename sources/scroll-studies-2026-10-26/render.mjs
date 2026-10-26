import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const sharp = require('sharp');
const root = path.resolve(import.meta.dirname, '../..');
let sceneRoot = path.join(root, 'public/effects/scroll-studies-2026-10-26');
try { await fs.access(path.join(sceneRoot, 'scene.mjs')); } catch { sceneRoot = import.meta.dirname; }
const { WIDTH, HEIGHT, specs, previewProgress, makeTextures, renderScene } = await import(pathToFileURL(path.join(sceneRoot, 'scene.mjs')));
const output = path.resolve(process.argv[2] || path.join(root, '../scroll-media'));
await fs.mkdir(output, { recursive: true });
const sources = JSON.parse(await fs.readFile(path.join(sceneRoot, 'assets.json')));
for (const resource of [...sources.photos, ...sources.fonts]) {
  const cached = path.join(output, resource.file);
  try { await fs.access(cached); } catch {
    const response = await fetch(resource.url); if (!response.ok) throw new Error('Asset download failed');
    await fs.writeFile(cached, Buffer.from(await response.arrayBuffer()));
  }
  const data = await fs.readFile(cached);
  if (data.length !== resource.bytes || crypto.createHash('sha256').update(data).digest('hex') !== resource.sha256) throw new Error('Asset integrity mismatch: ' + resource.file);
}
for (const font of sources.fonts) {
  const file = path.join(output, font.file);
  if (!GlobalFonts.registerFromPath(file, font.family)) throw new Error('Font registration failed: ' + file);
}
const photos = await Promise.all(sources.photos.map(a => loadImage(path.join(output, a.file))));
const assets = { photos, textures: makeTextures(createCanvas) }, results = [];
for (const spec of specs) {
  const canvas = createCanvas(WIDTH, HEIGHT), ctx = canvas.getContext('2d');
  const file = path.join(output, `${spec.number}-${spec.slug}-2026-10-26-a1.mp4`);
  const encoder = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', '30', '-i', '-', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const completion = once(encoder, 'close'); encoder.stdin.on('error', () => {});
  const unique = new Set(); let first, last;
  for (let frame = 0; frame < 300; frame++) {
    const p = previewProgress(frame / 30); renderScene(ctx, spec.number, p, assets);
    const png = await canvas.encode('png'); const hash = crypto.createHash('sha256').update(png).digest('hex');
    if (!frame) first = hash; last = hash; unique.add(hash);
    if (!encoder.stdin.write(png)) await once(encoder.stdin, 'drain');
  }
  encoder.stdin.end(); const [code] = await completion; if (code) throw new Error('Encoding failed');
  for (const p of [0, .25, .5, .75, 1]) {
    renderScene(ctx, spec.number, p, assets); await fs.writeFile(path.join(output, `${spec.number}-qa-${Math.round(p * 100)}.png`), await canvas.encode('png'));
  }
  renderScene(ctx, spec.number, spec.number === 190 ? .39 : .20, assets);
  const poster = path.join(output, `${spec.number}-${spec.slug}-2026-10-26-a1.webp`);
  await fs.writeFile(poster, await sharp(await canvas.encode('png')).webp({ quality: 90 }).toBuffer());
  const result = { number: spec.number, video: file, poster, width: WIDTH, height: HEIGHT, fps: 30, frames: 300, durationSeconds: 10, audio: false, faststart: true, loopEndpointPixelsEqual: first === last, uniqueSourceFrames: unique.size, previewScrollGestures: true, posterProgress: spec.number === 190 ? .39 : .20 };
  results.push(result); console.log(JSON.stringify(result));
}
await fs.writeFile(path.join(output, 'render-results.json'), JSON.stringify(results, null, 2) + '\n');
