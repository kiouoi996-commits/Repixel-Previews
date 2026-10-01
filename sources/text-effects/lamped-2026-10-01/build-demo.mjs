import fs from 'node:fs/promises';
import path from 'node:path';
const here=import.meta.dirname;
const geometry=await fs.readFile(path.join(here,'geometry.json'),'utf8');
const core=(await fs.readFile(path.join(here,'effects.mjs'),'utf8')).replace(/export /g,'');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lamped — Text Effects</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;background:#121018;color:#F4F2F1;font-family:system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center}main{width:100%;max-width:1080px;margin:auto}#scene svg{width:100%;height:auto;display:block}nav{display:flex;justify-content:center;gap:12px;padding:20px;flex-wrap:wrap}button,select{color:inherit;background:#211e29;border:1px solid #48424f;border-radius:6px;padding:10px;font:inherit}button:focus-visible,select:focus-visible{outline:2px solid #DCB440;outline-offset:4px}p{text-align:center;font-size:12px;color:#aaa;margin:0 12px 20px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}</style></head>
<body><main><h1 id="heading" class="sr"></h1><div id="scene" aria-hidden="true"></div></main><nav aria-label="Demo controls"><label class="sr" for="study">Text effect</label><select id="study"></select><button id="replay" type="button">Replay</button></nav><p>Six authored studies from the real Lamped typography archive. The video loop demonstrates one pass. Space or Enter replays; Escape settles.</p>
<script type="module">
const geometry=${geometry.replace(/</g,'\\u003c')};
${core}
const select=document.querySelector('#study'),output=document.querySelector('#scene'),heading=document.querySelector('#heading');
select.innerHTML=studies.map(s=>'<option value="'+s.number+'">'+s.title+'</option>').join('');
const requested=Number(new URLSearchParams(location.search).get('effect'));
select.value=studies.some(s=>s.number===requested)?String(requested):'132';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let start=0,frame=0,pausedAt=0;
function draw(t,rest=false){const id=Number(select.value),s=studies.find(s=>s.number===id);heading.textContent=geometry.compositions[s.composition].label;output.innerHTML=scene(id,t,geometry,{rest});}
function stop(){cancelAnimationFrame(frame);frame=0;draw(6,true);}
function animate(now){const t=(now-start)/1000;draw(Math.min(6,t));if(t<6)frame=requestAnimationFrame(animate);else frame=0;}
function replay(){cancelAnimationFrame(frame);if(reduced.matches){stop();return;}start=performance.now();frame=requestAnimationFrame(animate);}
select.addEventListener('change',replay);document.querySelector('#replay').addEventListener('click',replay);
document.addEventListener('keydown',e=>{if(e.key==='Escape')stop();else if((e.key===' '||e.key==='Enter')&&!['BUTTON','SELECT','INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();replay();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){pausedAt=performance.now();cancelAnimationFrame(frame);frame=0;}else if(!document.hidden&&pausedAt){start+=performance.now()-pausedAt;pausedAt=0;frame=requestAnimationFrame(animate);}});
reduced.addEventListener('change',stop);addEventListener('pagehide',()=>cancelAnimationFrame(frame));
replay();
</script></body></html>\n`;
await fs.writeFile(path.join(here,'demo.html'),html);
console.log('Built self-contained demo:',Buffer.byteLength(html),'bytes');
