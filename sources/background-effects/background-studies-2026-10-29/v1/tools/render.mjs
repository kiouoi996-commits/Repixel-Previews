import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
let sceneRoot=path.resolve(import.meta.dirname,'..');
try{await fs.access(path.join(sceneRoot,'scene.mjs'));}catch{sceneRoot=path.resolve(import.meta.dirname,'../../public/effects/background-studies-2026-10-29');}
const {drawScene,makeResources,previewState,studies}=await import(pathToFileURL(path.join(sceneRoot,'scene.mjs')));
const require=createRequire(import.meta.url);
const {createCanvas}=require(process.env.BACKGROUND_CANVAS_MODULE||'@napi-rs/canvas');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp'):'sharp');
const output=path.resolve(process.argv[2]||'../background-media');
const still=process.argv.includes('--stills');
const only=process.argv.find(a=>a.startsWith('--only='))?.split('=')[1];
await fs.mkdir(output,{recursive:true});
const records=[];
for(const study of studies.filter(s=>!only||s.kind===only)) {
  const width=1280,height=720,canvas=createCanvas(width,height),ctx=canvas.getContext('2d');
  const resources=makeResources(createCanvas),frames=study.duration*30;
  const file=path.join(output,`${study.number}-${study.slug}-2026-10-29-v1.mp4`);
  const encoder=still?null:spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate','30','-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:['pipe','inherit','inherit']});
  const done=encoder?once(encoder,'close'):null;
  encoder?.stdin.on('error',()=>{});
  const unique=new Set();let first,last;
  const sampled=still?[0,Math.round(frames*.24),Math.round(frames*.48),Math.round(frames*.7),frames-1]:Array.from({length:frames},(_,i)=>i);
  for(const n of sampled) {
    const s=previewState(study.kind,n/(frames-1)*study.duration,width,height);
    drawScene(ctx,s,resources,{showPointer:!still});
    const png=canvas.toBuffer('image/png');
    if(!n){first=png;await fs.writeFile(path.join(output,`${study.number}-poster.webp`),await sharp(png).webp({quality:91}).toBuffer());}
    last=png;unique.add(crypto.createHash('sha256').update(png).digest('hex'));
    if(still||[0,Math.round(frames*.24),Math.round(frames*.48),Math.round(frames*.7),frames-1].includes(n))await fs.writeFile(path.join(output,`${study.number}-qa-${n}.png`),png);
    if(encoder&&!encoder.stdin.write(png))await once(encoder.stdin,'drain');
  }
  if(encoder){encoder.stdin.end();const[code]=await done;if(code)throw Error('Video encoder failed');}
  const record={number:study.number,kind:study.kind,file,width,height,fps:30,frames,durationSeconds:study.duration,audio:false,faststart:true,loopEndpointPixelsEqual:first.equals(last),uniqueSourceFrames:unique.size,humanGesture:true};
  records.push(record);console.log(JSON.stringify(record));
}
await fs.writeFile(path.join(output,still?'still-results.json':only?`${only}-render-results.json`:'render-results.json'),JSON.stringify(records,null,2)+'\n');
