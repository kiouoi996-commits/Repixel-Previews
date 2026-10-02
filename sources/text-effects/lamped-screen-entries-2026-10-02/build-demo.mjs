import fs from 'node:fs/promises';
import path from 'node:path';
const here=import.meta.dirname;
const geometry=await fs.readFile(path.join(here,'geometry.json'),'utf8');
const core=(await fs.readFile(path.join(here,'effects.mjs'),'utf8')).replace(/export /g,'');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lamped — Screen Edge Entries</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;background:#121018;color:#F4F2F1;font-family:system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center}main{width:100%;max-width:1080px;margin:auto}#scene svg{width:100%;height:auto;display:block}nav{display:flex;justify-content:center;gap:12px;padding:20px;flex-wrap:wrap}button,select{color:inherit;background:#211e29;border:1px solid #48424f;border-radius:6px;padding:10px;font:inherit}button:focus-visible,select:focus-visible,main:focus-visible{outline:2px solid #DCB440;outline-offset:4px}p{text-align:center;font-size:12px;color:#aaa;margin:0 12px 20px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}</style></head>
<body><main tabindex="0" aria-label="Animation demo. Space or Enter replays; Escape shows the completed heading."><h1 id="heading" class="sr"></h1><div id="scene" aria-hidden="true"></div></main><nav aria-label="Demo controls"><label class="sr" for="study">Text effect</label><select id="study"></select><button id="replay" type="button">Replay</button></nav><p>Three authored screen-boundary entry effects from the actual Lamped typography. One pass per replay. Reduced motion shows the completed heading.</p>
<script type="module">
const geometry=${geometry.replace(/</g,'\\u003c')};
${core}
const select=document.querySelector('#study'),output=document.querySelector('#scene'),heading=document.querySelector('#heading'),main=document.querySelector('main');
select.innerHTML=studies.map(s=>'<option value="'+s.number+'">'+s.title+'</option>').join('');
const requested=Number(new URLSearchParams(location.search).get('effect'));
select.value=studies.some(s=>s.number===requested)?String(requested):'142';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),lifecycle=new AbortController();
let frame=0,elapsed=0,start=0,running=false,inViewport=true;
function draw(t,rest=false){const id=Number(select.value),s=studies.find(s=>s.number===id);heading.textContent=geometry.compositions[s.composition].label;output.innerHTML=scene(id,t,geometry,{rest});}
function settle(){cancelAnimationFrame(frame);frame=0;running=false;elapsed=6;draw(6,true);}
function tick(now){elapsed=Math.min(6,(now-start)/1000);draw(elapsed);if(elapsed<6)frame=requestAnimationFrame(tick);else{frame=0;running=false;}}
function sync(){if(frame){elapsed=Math.min(6,(performance.now()-start)/1000);cancelAnimationFrame(frame);frame=0;}if(running&&!document.hidden&&inViewport&&!reduced.matches){start=performance.now()-elapsed*1000;frame=requestAnimationFrame(tick);}}
function replay(){if(reduced.matches){settle();return;}elapsed=0;running=true;cancelAnimationFrame(frame);frame=0;draw(0);sync();}
select.addEventListener('change',replay,{signal:lifecycle.signal});document.querySelector('#replay').addEventListener('click',replay,{signal:lifecycle.signal});
main.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();settle();}else if(e.key===' '||e.key==='Enter'){e.preventDefault();replay();}},{signal:lifecycle.signal});
document.addEventListener('visibilitychange',sync,{signal:lifecycle.signal});reduced.addEventListener('change',settle,{signal:lifecycle.signal});
const observer=new IntersectionObserver(entries=>{inViewport=entries[0].isIntersecting;sync();});observer.observe(main);
addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();lifecycle.abort();},{once:true});
replay();
</script></body></html>\n`;
await fs.writeFile(path.join(here,'demo.html'),html);
console.log('Built self-contained demo:',Buffer.byteLength(html),'bytes');
