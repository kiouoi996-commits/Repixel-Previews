import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
import {CONFIG,renderFrame} from './motion.mjs';

const root=path.dirname(new URL(import.meta.url).pathname);
const require=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/package.json':import.meta.url);
const sharp=require('sharp');
sharp.concurrency(1);
const atlas=JSON.parse(await fs.readFile(path.join(root,'glyphs.json'),'utf8'));
const kind=process.argv[2];if(!CONFIG.variants[kind])throw new Error('Pass iris, seam, ribbons or curtain');
const target=path.resolve(process.argv[3]||path.join(root,'../media'));await fs.mkdir(target,{recursive:true});
const variant=CONFIG.variants[kind],name=`${variant.number}-${variant.slug}`;
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(CONFIG.fps),'-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path.join(target,name+'.mp4')],{stdio:['pipe','ignore','inherit']});
let first,last;const hashes=new Set();
for(let frame=0;frame<CONFIG.frames;frame++){
 const svg=renderFrame(kind,frame/CONFIG.fps,atlas);
 const png=await sharp(Buffer.from(svg)).png().toBuffer();
 const hash=crypto.createHash('sha256').update(png).digest('hex');hashes.add(hash);
 if(frame===0)first=hash;if(frame===CONFIG.frames-1)last=hash;
 if(frame%15===0)await fs.writeFile(path.join(target,name+`-sample-${String(frame).padStart(3,'0')}.png`),png);
 if(!ff.stdin.write(png))await once(ff.stdin,'drain');
}
ff.stdin.end();const [code]=await once(ff,'exit');if(code)throw new Error('ffmpeg failed: '+code);
const openSVG=renderFrame(kind,3,atlas);await fs.writeFile(path.join(target,name+'-open.svg'),openSVG);
await sharp(Buffer.from(openSVG)).png().toFile(path.join(target,name+'-open.png'));
const posterSVG=renderFrame(kind,1.45,atlas);
await sharp(Buffer.from(posterSVG)).webp({quality:94}).toFile(path.join(target,name+'.webp'));
const video=await fs.readFile(path.join(target,name+'.mp4')),poster=await fs.readFile(path.join(target,name+'.webp'));
const info={kind,name,width:CONFIG.width,height:CONFIG.height,fps:CONFIG.fps,frames:CONFIG.frames,durationSeconds:CONFIG.duration,audio:false,faststart:true,loopEndpointPixelsEqual:first===last,uniqueSourceFrames:hashes.size,posterTimeSeconds:1.45,video:{bytes:video.length,sha256:crypto.createHash('sha256').update(video).digest('hex')},poster:{bytes:poster.length,sha256:crypto.createHash('sha256').update(poster).digest('hex')}};
if(first!==last)throw new Error('Loop endpoints differ');
await fs.writeFile(path.join(target,name+'-verification.json'),JSON.stringify(info,null,2)+'\n');
console.log(JSON.stringify(info));
