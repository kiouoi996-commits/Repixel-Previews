import {createState,update,scene,specs,targets} from './core.mjs';
const number=Number(document.body.dataset.study),spec=specs.find(s=>s.number===number);
const host=document.querySelector('#scene'),pause=document.querySelector('#pause'),status=document.querySelector('#status');
const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(any-hover: hover) and (any-pointer: fine)');
const fonts=await fetch('./glyphs.json').then(r=>{if(!r.ok)throw Error('Outline geometry unavailable');return r.json();});
const photos=await fetch('./assets.json').then(r=>{if(!r.ok)throw Error('Photo manifest unavailable');return r.json();});
await Promise.all(photos.map(a=>new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src=a.url;})));
let s=createState(number),input={x:540,y:420,active:false,pressed:false},raf=0,last=0,paused=false,motionOptIn=false;
const enabled=()=>(!motion.matches||motionOptIn)&&fine.matches&&!paused&&!document.hidden;
function paint(){host.innerHTML=scene(number,s,{fonts,photos:photos.map(a=>a.url),pointer:input.active?input:null});}
function tick(now){raf=0;const dt=Math.min((now-last)/1000||1/60,.05);last=now;update(s,input,dt);paint();
  if(enabled()&&(input.active||s.a>.002||s.trails.length))raf=requestAnimationFrame(tick);
}
function wake(){if(enabled()&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}}
function reset(){cancelAnimationFrame(raf);raf=0;s=createState(number);input.active=false;input.pressed=false;paint();host.parentElement.classList.remove('custom-active');}
function sync(){if(!enabled())reset();pause.disabled=!fine.matches;pause.textContent=motion.matches&&!motionOptIn?'Enable preview motion':paused?'Resume effect':'Pause effect';pause.setAttribute('aria-pressed',String(paused));
  status.textContent=!fine.matches?'Static example on touch screens.':motion.matches&&!motionOptIn?'Reduced motion: static example. Enable preview motion to try it.':paused?'Effect paused.':motionOptIn?'Preview motion enabled. Move your mouse inside the example.':'Move your mouse inside the example.';
}
function point(event){const b=host.getBoundingClientRect();input.x=(event.clientX-b.left)*1080/b.width;input.y=(event.clientY-b.top)*810/b.height;}
const surface=document.querySelector('#surface');
surface.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!enabled())return;point(e);input.active=true;if(number===186)surface.classList.add('custom-active');wake();});
surface.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||!enabled())return;point(e);input.active=true;input.pressed=true;wake();});
window.addEventListener('pointerup',()=>{input.pressed=false;wake();});
surface.addEventListener('pointerleave',()=>{input.active=false;input.pressed=false;surface.classList.remove('custom-active');wake();});
surface.addEventListener('pointercancel',reset);window.addEventListener('blur',reset);window.addEventListener('resize',reset);
surface.addEventListener('focusin',()=>{input.active=false;surface.classList.remove('custom-active');wake();});
document.addEventListener('visibilitychange',sync);motion.addEventListener('change',()=>{motionOptIn=false;reset();sync();});fine.addEventListener('change',sync);
pause.addEventListener('click',()=>{if(motion.matches&&!motionOptIn){motionOptIn=true;paused=false;}else paused=!paused;reset();sync();});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);});
if(number===186){for(const r of targets){const a=document.createElement('a');a.href=r.href;a.textContent=r.label;a.className='scene-link';
  Object.assign(a.style,{left:r.x/10.8+'%',top:r.y/8.1+'%',width:r.w/10.8+'%',height:r.h/8.1+'%'});surface.append(a);}}
document.querySelector('#title').textContent=spec.title;paint();sync();document.body.dataset.ready='true';
