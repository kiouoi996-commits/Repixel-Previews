import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { renderSvg } from './effect.mjs';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', {paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || process.cwd()]}));
const geometry = JSON.parse(fs.readFileSync(new URL('./geometry.json', import.meta.url)));
const params = JSON.parse(fs.readFileSync(new URL('./parameters.json', import.meta.url)));
const out = new URL('./render/', import.meta.url);
fs.mkdirSync(out, {recursive:true});
for (let frame=0; frame<params.frames; frame++) {
  const svg = renderSvg(geometry,params,frame/params.fps);
  await sharp(Buffer.from(svg)).png().toFile(new URL(`frame-${String(frame).padStart(3,'0')}.png`,out).pathname);
}
await sharp(Buffer.from(renderSvg(geometry,params,4))).webp({lossless:true}).toFile(new URL('./154-inside-liquid-ink-reveal-2026-10-03-a1.webp',import.meta.url).pathname);
for(const t of [0.9,1.3,1.7,2.1,2.5,3]) await sharp(Buffer.from(renderSvg(geometry,params,t))).png().toFile(new URL(`sample-${t}.png`,out).pathname);
const mp4=new URL('./154-inside-liquid-ink-reveal-2026-10-03-a1.mp4',import.meta.url).pathname;
execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-y','-framerate',String(params.fps),'-i',new URL('frame-%03d.png',out).pathname,'-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-an','-movflags','+faststart',mp4]);
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',mp4],{encoding:'utf8'}));
if(probe.streams.length!==1||probe.streams[0].codec_name!=='h264'||Number(probe.streams[0].nb_frames)!==params.frames||Number(probe.format.duration)!==params.durationSeconds)throw new Error('Video export failed integrity check');
console.log('Rendered 180 exact SVG frames and silent faststart H.264 preview.');
