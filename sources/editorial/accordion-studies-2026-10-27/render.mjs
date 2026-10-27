import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {specs,paint,previewFrames,previewPointer} from '../../public/effects/accordion-studies-2026-10-27/scene.mjs';
const require=createRequire(import.meta.url),deps=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const {createCanvas,loadImage,GlobalFonts}=require(deps?path.join(deps,'@napi-rs/canvas'):'@napi-rs/canvas'),sharp=require(deps?path.join(deps,'sharp'):'sharp');
const out=path.resolve(process.argv[2]||'../accordion-media/render'),a=path.join(out,'assets');await fs.mkdir(out,{recursive:true});
const manifest=JSON.parse(await fs.readFile(new URL('../../public/effects/accordion-studies-2026-10-27/assets.json',import.meta.url))),results=[];
await fs.mkdir(a,{recursive:true});
for(const asset of manifest){const file=path.join(a,asset.filename);let bytes;try{bytes=await fs.readFile(file);}catch{const response=await fetch(asset.url);if(!response.ok)throw Error('Cannot fetch '+asset.filename);bytes=Buffer.from(await response.arrayBuffer());await fs.writeFile(file,bytes);}if(bytes.length!==asset.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error('Asset integrity mismatch: '+asset.filename);}
for(const[file,name]of [['DMSans-Medium.ttf','Accordion Medium'],['DMSans-Bold.ttf','Accordion Bold']])if(!GlobalFonts.registerFromPath(path.join(a,file),name))throw Error('Cannot load font '+file);
for(const spec of specs.filter(s=>!process.argv[3]||s.number===Number(process.argv[3]))){
 const assets={photos:await Promise.all(spec.files.map(f=>loadImage(path.join(a,f)))),colors:spec.files.map(f=>manifest.find(x=>x.filename===f).color)};
 const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d');ctx.setTransform(1280/1672,0,0,720/941,0,0);
 const file=path.join(out,`${spec.number}-${spec.slug}-2026-10-27.mp4`),poster=path.join(out,`${spec.number}-${spec.slug}-2026-10-27.webp`),frames=previewFrames(spec);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate','30','-threads','1','-i','-','-an','-c:v','libx264','-threads','1','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:['pipe','inherit','inherit']});const done=once(ff,'close');ff.stdin.on('error',()=>{});
 let first,last;const unique=new Set();
 for(let n=0;n<frames.length;n++){
  paint(ctx,spec,frames[n],assets,{pointer:previewPointer(spec,n/30)});const png=await canvas.encode('png'),hash=crypto.createHash('sha256').update(png).digest('hex');if(!n)first=hash;last=hash;unique.add(hash);
  if([0,41,85,131,191,239,299].includes(n))await fs.writeFile(path.join(out,`${spec.number}-qa-${n}.png`),png);
  if(!n)await fs.writeFile(poster,await sharp(png).webp({quality:93}).toBuffer());
  if(!ff.stdin.write(png))await once(ff.stdin,'drain');
 }
 ff.stdin.end();const[code,signal]=await done;if(code!==0)throw Error('Video encoding failed: '+(signal||code));
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_frames:format=duration','-of','json',file],{encoding:'utf8'}));
 if(probe.streams.length!==1||probe.streams[0].codec_name!=='h264'||Number(probe.streams[0].nb_frames)!==300||Number(probe.format.duration)!==10)throw Error('Invalid final video');
 const r={number:spec.number,video:file,poster,width:1280,height:720,fps:30,frames:300,durationSeconds:10,audio:false,faststart:true,loopEndpointPixelsEqual:first===last,uniqueSourceFrames:unique.size,posterTimeSeconds:0,humanGesture:true};
 if(!r.loopEndpointPixelsEqual)throw Error('Loop endpoint mismatch for '+spec.number);results.push(r);console.log(JSON.stringify(r));
 const mobileCanvas=createCanvas(375,spec.number===199?875:850);paint(mobileCanvas.getContext('2d'),spec,frames[0],assets,{mobile:true});await fs.writeFile(path.join(out,`${spec.number}-mobile-qa.png`),await mobileCanvas.encode('png'));
}
let previous=[];try{previous=JSON.parse(await fs.readFile(path.join(out,'render-results.json')));}catch{}
await fs.writeFile(path.join(out,'render-results.json'),JSON.stringify([...previous.filter(x=>!results.some(r=>r.number===x.number)),...results].sort((a,b)=>a.number-b.number),null,2)+'\n');
