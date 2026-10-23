// npm install sharp; SHARP_MODULE may point to an already installed module.
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {svg,demo,specs} from './core.mjs';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp');
const mode=process.argv[2]||'classic',only=process.argv.includes('--stills'),out=new URL('./media/',import.meta.url);
await fs.mkdir(out,{recursive:true});await fs.mkdir(new URL('./qa/',import.meta.url),{recursive:true});
const draw=t=>sharp(Buffer.from(svg(demo(mode,t)))).resize(1152,648).png().toBuffer();
if(only){for(const t of [0,1.6,3.7,5.9,7.5,9.7])await fs.writeFile(new URL(`./qa/${mode}-${t}.png`,import.meta.url),await draw(t));await sharp(await draw(0)).webp({quality:93}).toFile(new URL(`./media/${mode}-poster.webp`,import.meta.url).pathname);console.log(mode,'stills complete');}
else{const frames=specs[mode].seconds*30,ff=spawn('ffmpeg',['-v','error','-f','image2pipe','-vcodec','png','-framerate','30','-i','-','-c:v','libx264','-crf','19','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-an','-y',new URL(`./media/${mode}.mp4`,import.meta.url).pathname],{stdio:['pipe','inherit','inherit']});const done=once(ff,'close');ff.stdin.on('error',()=>{});for(let i=0;i<frames;i++){const t=i===frames-1?specs[mode].seconds:i/30;if(!ff.stdin.write(await draw(t)))await once(ff.stdin,'drain');}ff.stdin.end();const[code]=await done;if(code)throw Error('ffmpeg exited '+code);const a=await draw(0),b=await draw(specs[mode].seconds);if(!a.equals(b))throw Error('Loop endpoints differ');console.log(mode,frames,'frames; source endpoints identical');}
