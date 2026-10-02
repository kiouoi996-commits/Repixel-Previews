import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {Resvg} from '@resvg/resvg-js';
import {scene,studies} from './effects.mjs';

const here=import.meta.dirname,root=path.resolve(here,'../../..');
const geometry=JSON.parse(await fs.readFile(path.join(here,'geometry.json'),'utf8'));
const videos=path.join(root,'videos/text-effects'),posters=path.join(root,'images/text-effects/posters');
const qa=path.resolve(root,'../repixel-screen-entries-qa');
for(const dir of [videos,posters,qa]) await fs.mkdir(dir,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const render=(id,t)=>new Resvg(scene(id,t,geometry),{font:{loadSystemFonts:false}}).render().asPng();
const only=Number(process.argv.find(a=>a.startsWith('--id='))?.slice(5));
const results=[];
for(const study of studies.filter(s=>!only||only===s.number)) {
  const name=study.slug+'-2026-10-02-a1';
  const first=render(study.number,0),last=render(study.number,179/30);
  if(!first.equals(last)) throw new Error('Loop endpoints differ: '+study.number);
  for(const t of [0,.8,.98,1.08,1.2,1.4,1.65,2.15,2.8,3.9,179/30]) await fs.writeFile(path.join(qa,`${study.number}-${t.toFixed(3)}.png`),render(study.number,t));
  await fs.writeFile(path.join(qa,`${study.number}-poster.png`),render(study.number,3.9));
  if(process.argv.includes('--stills')) {console.log('Stills:',study.number);continue;}
  const output=path.join(videos,name+'.mp4');
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate','30','-i','-','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:['pipe','inherit','inherit']});
  const completed=once(ff,'close');ff.stdin.on('error',()=>{});
  for(let frame=0;frame<180;frame++) {
    const png=render(study.number,frame/30);
    if(!ff.stdin.write(png)) await once(ff.stdin,'drain');
  }
  ff.stdin.end();const [code]=await completed;
  if(code!==0) throw new Error('FFmpeg failed: '+study.number);
  const posterPath=path.join(posters,name+'.webp');
  const pf=spawn('ffmpeg',['-y','-loglevel','error','-i',path.join(qa,`${study.number}-poster.png`),'-c:v','libwebp','-lossless','1',posterPath],{stdio:'inherit'});
  const [posterCode]=await once(pf,'close');if(posterCode)throw new Error('Poster failed: '+study.number);
  const video=await fs.readFile(output),poster=await fs.readFile(posterPath);
  results.push({...study,video:path.relative(root,output),poster:path.relative(root,posterPath),videoBytes:video.length,videoSha256:sha(video),posterBytes:poster.length,posterSha256:sha(poster),previewRender:{width:1080,height:608,fps:30,frames:180,durationSeconds:6,audio:false,loopEndpointPixelsEqual:true}});
  console.log(JSON.stringify({number:study.number,videoBytes:video.length,posterBytes:poster.length,loopEndpointPixelsEqual:true}));
}
if(!process.argv.includes('--stills')) await fs.writeFile(path.join(qa,'render-manifest.json'),JSON.stringify(results,null,2)+'\n');
