import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {scene,studies} from './effects.mjs';
const here=import.meta.dirname,root=path.resolve(here,'../../..'),qa=path.resolve(root,'../desktop-menus-qa');
const geometry=JSON.parse(await fs.readFile(path.join(here,'geometry.json'),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
async function run(command,args,stdin){const p=spawn(command,args,{stdio:[stdin?'pipe':'ignore','inherit','inherit']});const done=once(p,'close');if(stdin)p.stdin.end(stdin);const [code]=await done;if(code)throw Error(command+' failed')}
await fs.mkdir(qa,{recursive:true});await fs.mkdir(path.join(root,'videos/menus'),{recursive:true});await fs.mkdir(path.join(root,'images/menus/posters'),{recursive:true});
const output=[];
for(const s of studies){
 const frames=path.join(qa,String(s.number));await fs.mkdir(frames,{recursive:true});const jobs=[];
 const samples=[0,.85,1.03,1.3,2.3,3.6,4.9,6.2,239/30];
 for(const t of samples){const name=t.toFixed(3),svg=path.join(frames,'sample-'+name+'.svg'),png=path.join(frames,'sample-'+name+'.png');await fs.writeFile(svg,scene(s.number,t,geometry));jobs.push({svg,png})}
 if(!process.argv.includes('--stills'))for(let f=0;f<240;f++){const name=String(f).padStart(3,'0'),svg=path.join(frames,name+'.svg'),png=path.join(frames,name+'.png');await fs.writeFile(svg,scene(s.number,f/30,geometry));jobs.push({svg,png})}
 await run('python',[path.join(here,'render-svg.py')],JSON.stringify(jobs));
 const first=await fs.readFile(path.join(frames,'sample-0.000.png')),last=await fs.readFile(path.join(frames,'sample-7.967.png'));if(!first.equals(last))throw Error('Loop endpoints differ: '+s.number);
 if(process.argv.includes('--stills')){console.log('Stills',s.number);continue}
 const name=s.slug+'-2026-10-02-b1',video='videos/menus/'+name+'.mp4',poster='images/menus/posters/'+name+'.webp';
 await run('ffmpeg',['-y','-loglevel','error','-framerate','30','-i',path.join(frames,'%03d.png'),'-frames:v','240','-an','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',path.join(root,video)]);
 await run('ffmpeg',['-y','-loglevel','error','-i',path.join(frames,s.mechanism==='buoy'?'sample-0.850.png':'sample-1.030.png'),'-c:v','libwebp','-lossless','1',path.join(root,poster)]);
 const vb=await fs.readFile(path.join(root,video)),pb=await fs.readFile(path.join(root,poster));output.push({...s,video,poster,videoBytes:vb.length,videoSha256:sha(vb),posterBytes:pb.length,posterSha256:sha(pb),previewRender:{width:1080,height:608,fps:30,frames:240,durationSeconds:8,audio:false,loopEndpointPixelsEqual:true}});console.log(JSON.stringify({number:s.number,videoBytes:vb.length,posterBytes:pb.length,endpointPixelsEqual:true}));
}
if(!process.argv.includes('--stills'))await fs.writeFile(path.join(qa,'render-manifest.json'),JSON.stringify(output,null,2)+'\n');
