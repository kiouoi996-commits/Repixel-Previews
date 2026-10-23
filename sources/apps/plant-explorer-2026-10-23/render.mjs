import fs from 'node:fs/promises';import {spawn} from 'node:child_process';import {once} from 'node:events';import {demo,initial} from './model.mjs';import {svg} from './scene.mjs';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp'),images={};const manifest=JSON.parse(await fs.readFile(new URL('./asset-manifest.json',import.meta.url)));
for(const a of manifest.filter(a=>a.width))images[a.name]='data:image/png;base64,'+(await sharp(new URL('./assets/'+a.name,import.meta.url).pathname).png().toBuffer()).toString('base64');
const draw=s=>sharp(Buffer.from(svg(s,{images}))).resize(780,1640).png().toBuffer();
await fs.mkdir(new URL('./qa/',import.meta.url),{recursive:true});
if(process.argv.includes('--stills')){
 for(const t of [0,1.6,3.3,4.6,5.5,6.4,7.5])await fs.writeFile(new URL(`./qa/frame-${t}.png`,import.meta.url),await draw(demo(t)));
 for(const route of ['onboarding','discover','care','profile'])await fs.writeFile(new URL(`./qa/${route}.png`,import.meta.url),await draw(initial(route)));
 await sharp(await draw(demo(0))).webp({quality:94}).toFile(new URL('./preview.webp',import.meta.url).pathname);console.log('App stills and one-screen Home poster complete.');
}else{
 const ff=spawn('ffmpeg',['-v','error','-f','image2pipe','-vcodec','png','-framerate','30','-i','-','-an','-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-y',new URL('./plant-explorer.mp4',import.meta.url).pathname],{stdio:['pipe','inherit','inherit']});const done=once(ff,'close');ff.stdin.on('error',()=>{});
 for(let i=0;i<240;i++){const b=await draw(demo(i===239?8:i/30));if(!ff.stdin.write(b))await once(ff.stdin,'drain');}ff.stdin.end();const[code]=await done;if(code)throw Error('ffmpeg '+code);if(!(await draw(demo(0))).equals(await draw(demo(8))))throw Error('Loop endpoints differ');console.log('780×1640, 240 frames, 30fps, 8 seconds; source endpoint PNGs match.');
}
