import fs from 'node:fs';
const geometry = JSON.parse(fs.readFileSync(new URL('./geometry.json', import.meta.url)));
const params = JSON.parse(fs.readFileSync(new URL('./parameters.json', import.meta.url)));
const moduleText = fs.readFileSync(new URL('./effect.mjs', import.meta.url), 'utf8').replaceAll('export ', '');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${params.title}</title>
<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:${geometry.background}}body{display:grid;place-items:center}#scene{width:100%;max-width:1080px;aspect-ratio:1080/608}svg{display:block;width:100%;height:100%}.replay{position:fixed;right:20px;bottom:20px;border:1px solid #f4f2f155;border-radius:100px;padding:10px 16px;background:#121018;color:#F4F2F1;cursor:pointer}.replay:focus-visible{outline:2px solid #F4F2F1;outline-offset:4px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}</style></head>
<body><h1 class="sr-only">THE INSIDE LOOK®</h1><main id="scene" aria-hidden="true"></main><button class="replay" type="button">Replay</button>
<script type="module">
${moduleText}
const geometry=${JSON.stringify(geometry)};
const params=${JSON.stringify(params)};
const scene=document.querySelector('#scene');
const query=new URLSearchParams(location.search);
const mode=query.get('mode')==='entry'?'entry':'gallery';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let frame=0,started=performance.now(),paused=false;
const paint=seconds=>{scene.innerHTML=renderSvg(geometry,params,seconds,mode,reduced.matches)};
function tick(now){if(paused)return; const t=(now-started)/1000; paint(t); if(mode==='gallery'||t<params.entryDuration+2*params.lineDelay)frame=requestAnimationFrame(tick)}
function replay(){cancelAnimationFrame(frame);started=performance.now();paused=false;if(reduced.matches){paint(0);return}frame=requestAnimationFrame(tick)}
window.seek=seconds=>{cancelAnimationFrame(frame);paused=true;paint(seconds)};
document.querySelector('.replay').addEventListener('click',replay);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame)}else if(!paused){replay()}});
reduced.addEventListener('change',replay);
if(query.has('t')){document.querySelector('.replay').hidden=true;window.seek(Number(query.get('t')))}else replay();
</script></body></html>`;
fs.writeFileSync(new URL('./demo.html',import.meta.url), html);
console.log('Built self-contained demo.html from shared geometry, parameters and effect.');
