import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
let sceneRoot=import.meta.dirname;
try{await fs.access(path.join(sceneRoot,'core.mjs'));}catch{sceneRoot=path.resolve(import.meta.dirname,'../../public/effects/cursor-studies-2026-10-26');}
const {specs,createState,update,scene,demoPointer}=await import(pathToFileURL(path.join(sceneRoot,'core.mjs')));
const require=createRequire(import.meta.url);
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp'):'sharp');
const root=path.resolve(import.meta.dirname,'../..'),output=path.resolve(process.argv[2]||path.join(root,'../cursor-media'));
await fs.mkdir(output,{recursive:true});
const fonts=JSON.parse(await fs.readFile(path.join(sceneRoot,'glyphs.json')));
const assets=JSON.parse(await fs.readFile(path.join(sceneRoot,'assets.json')));
const photos=[];
for(let i=0;i<assets.length;i++){
 let data;try{data=await fs.readFile(path.join(output,`photo-${i}.webp`));}catch{data=Buffer.from(await(await fetch(assets[i].url)).arrayBuffer());}
 if(crypto.createHash('sha256').update(data).digest('hex')!==assets[i].sha256)throw Error('Photo integrity mismatch');
 photos.push('data:image/jpeg;base64,'+(await sharp(data).resize({width:640,withoutEnlargement:true}).jpeg({quality:92}).toBuffer()).toString('base64'));
}
const only=Number(process.argv.find(x=>x.startsWith('--only='))?.split('=')[1]);
let results=[];if(only){try{results=JSON.parse(await fs.readFile(path.join(output,'render-results.json'))).filter(r=>r.number!==only);}catch{}}
for(const spec of specs.filter(s=>!only||s.number===only)){
 const s=createState(spec.number);let ptr;
 // Warm the same live integrator at 60 Hz before recording a periodic gesture.
 for(let n=-960;n<0;n++){ptr=demoPointer(n/60,spec.number);update(s,ptr,1/60);}
 const file=path.join(output,`${spec.number}-${spec.slug}-2026-10-26-v2.mp4`);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate','30','-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:['pipe','inherit','inherit']});
 const done=once(ff,'close');ff.stdin.on('error',()=>{});let first,lastFrame;const unique=new Set();
 for(let n=0;n<240;n++){
  for(let j=0;j<2;j++){ptr=demoPointer((n*2+j)/60,spec.number);update(s,ptr,1/60);}
  const svg=scene(spec.number,s,{fonts,photos,pointer:ptr});
  const png=await sharp(Buffer.from(svg)).png().toBuffer();if(n===0)first=png;lastFrame=png;
  unique.add(crypto.createHash('sha256').update(png).digest('hex'));
  if([0,45,90,150,210,239].includes(n))await fs.writeFile(path.join(output,`${spec.number}-qa-${n}.png`),png);
  if(n===(spec.number===188?60:spec.number===187?100:spec.number===186?0:0))await fs.writeFile(path.join(output,`${spec.number}-${spec.slug}-2026-10-26-v2.webp`),await sharp(png).webp({quality:88}).toBuffer());
  if(!ff.stdin.write(png))await once(ff.stdin,'drain');
 }
 ff.stdin.end();const [code]=await done;if(code)throw Error('Video encoding failed');
 results.push({number:spec.number,file,width:spec.width,height:spec.height,uniqueSourceFrames:unique.size,loopEndpointPixelsEqual:first.equals(lastFrame),humanGesture:true});
 console.log(JSON.stringify(results.at(-1)));
}
await fs.writeFile(path.join(output,'render-results.json'),JSON.stringify(results,null,2)+'\n');
