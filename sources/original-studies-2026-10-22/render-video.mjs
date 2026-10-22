import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {Resvg} from '@resvg/resvg-js';
import crypto from 'node:crypto';
import {CONFIG,render,fixture,layout} from './studies.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const atlas=JSON.parse(fs.readFileSync(path.join(root,'glyphs.json')));
const photos=JSON.parse(fs.readFileSync(path.join(root,'photos-raster.json')));
const kind=process.argv[2];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const png=t=>new Resvg(render(kind,fixture(t),atlas,photos),{font:{loadSystemFonts:false}}).render().asPng();
fs.writeFileSync(path.join(root,'qa',kind+'-final.png'),png(0));
const mobile=layout(kind,true);fs.writeFileSync(path.join(root,'qa',kind+'-mobile-final.png'),new Resvg(render(kind,fixture(0),atlas,photos,true),{font:{loadSystemFonts:false}}).render().asPng());
const file=path.join(root,kind+'-2026-10-22-a1.mp4');
const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(CONFIG.fps),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:['pipe','inherit','inherit']});
const hashes=new Set();
for(let i=0;i<CONFIG.duration*CONFIG.fps;i++){
  const bytes=png(i/CONFIG.fps);hashes.add(digest(bytes));
  if(!ff.stdin.write(bytes))await new Promise(resolve=>ff.stdin.once('drain',resolve));
  if(i%90===0)process.stdout.write(`${kind}: ${i}/300 frames\n`);
}
ff.stdin.end();
const code=await new Promise(resolve=>ff.on('close',resolve));if(code!==0)throw Error('ffmpeg failed: '+code);
const first=png(0),last=png(CONFIG.duration-1/CONFIG.fps);
const b=fs.readFileSync(file);
const report={kind,width:1080,height:810,fps:30,frames:300,durationSeconds:10,audio:false,faststart:true,loopEndpointPixelsEqual:first.equals(last),uniqueSourceFrames:hashes.size,bytes:b.length,sha256:digest(b)};
fs.writeFileSync(path.join(root,kind+'-render.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
