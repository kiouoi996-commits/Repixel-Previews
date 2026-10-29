import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const {createCanvas}=require(process.env.BACKGROUND_CANVAS_MODULE||'@napi-rs/canvas');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp'):'sharp');
let sceneRoot=path.resolve(import.meta.dirname,'..');
try{await fs.access(path.join(sceneRoot,'scene.mjs'));}catch{sceneRoot=path.resolve(import.meta.dirname,'../../public/effects/background-studies-2026-10-29');}
const {drawScene,makeResources,previewState,studies}=await import(pathToFileURL(path.join(sceneRoot,'scene.mjs')));
const output=path.resolve(process.argv[2]||'../background-media');
const findings=[];
for(const spec of studies){
  let records;try{records=JSON.parse(await fs.readFile(path.join(output,`${spec.kind}-render-results.json`)));}catch{records=JSON.parse(await fs.readFile(path.join(output,'render-results.json')));}
  const record=records.find(r=>r.kind===spec.kind);assert(record);
  assert(record.loopEndpointPixelsEqual);assert(record.uniqueSourceFrames>record.frames*.9);
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',record.file],{encoding:'utf8'}));
  assert.equal(probe.streams.length,1);const stream=probe.streams[0];
  assert.equal(stream.codec_name,'h264');assert.equal(stream.pix_fmt,'yuv420p');assert.equal(stream.r_frame_rate,'30/1');
  assert.deepEqual([stream.width,stream.height],[1280,720]);assert(Math.abs(Number(probe.format.duration)-spec.duration)<.05);
  const mp4=await fs.readFile(record.file);assert(mp4.indexOf(Buffer.from('moov'))<mp4.indexOf(Buffer.from('mdat')));
  const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d'),resources=makeResources(createCanvas);
  const t=spec.kind==='copper'?2.25:2.35,s=previewState(spec.kind,t);
  drawScene(ctx,s,resources);const active=await sharp(canvas.toBuffer('image/png')).removeAlpha().raw().toBuffer();
  const calm={...s,pointer:{...s.pointer,strength:0},waves:[]};drawScene(ctx,calm,resources);
  const baseline=await sharp(canvas.toBuffer('image/png')).removeAlpha().raw().toBuffer();
  let changed=0,delta=0;for(let i=0;i<active.length;i+=3){const d=Math.abs(active[i]-baseline[i])+Math.abs(active[i+1]-baseline[i+1])+Math.abs(active[i+2]-baseline[i+2]);if(d>9)changed++;delta+=d;}
  const affected=changed/(1280*720);assert(affected>.006,'Input must visibly alter the artwork');assert(affected<.65,'Input must not translate the entire frame');
  const mobile=createCanvas(390,844),mobileCtx=mobile.getContext('2d');drawScene(mobileCtx,{...s,width:390,height:844},resources,{quality:.68});
  const info=await sharp(mobile.toBuffer('image/png')).stats();assert(info.channels.slice(0,3).some(c=>c.stdev>3));
  const result={kind:spec.kind,frames:record.frames,uniqueSourceFrames:record.uniqueSourceFrames,loopEndpointsEqual:true,inputAffectedPercent:Math.round(affected*1000)/10,averageChannelDelta:Math.round(delta/active.length*100)/100,videoBytes:mp4.length,mobile:'390x844 rendered',faststart:true,audio:false};
  findings.push(result);console.log(JSON.stringify(result));
}
await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(findings,null,2)+'\n');
