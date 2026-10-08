import { SPEED_GAUGE_SVG, RPM_GAUGE_SVG } from './gauges.mjs';
import { referenceState, step, shift, canShift, clamp, demoAt, DEMO_DURATION } from './model.mjs';
const base = 'https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/65e9759ddad33685ab4ddb6c6981c257e1544ab6/images/orange-apex-sport-cluster/';
const files = { car:'car-top-view.webp', 'bracket-left':'icons/gear-bracket.svg', 'bracket-right':'icons/gear-bracket.svg', 'fuel-icon':'icons/fuel-pump.svg', 'coolant-icon':'icons/coolant-temperature.svg' };
const $ = id => document.getElementById(id);
$('speed-shell').innerHTML=SPEED_GAUGE_SVG;
$('rpm-shell').innerHTML=RPM_GAUGE_SVG;
function band(id,value,maximum) {
 const fraction=clamp(value/maximum,0,1),node=$(id);
 node.setAttribute('stroke-dasharray',fraction.toFixed(6)+' 1');
 node.setAttribute('data-fraction',String(fraction));node.setAttribute('data-value',String(value));
 node.style.opacity=fraction>0?'1':'0';
}
const capture = new URLSearchParams(location.search).has('capture');
if (capture) document.documentElement.classList.add('capture');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const polar = (cx,cy,r,degrees) => [cx+r*Math.cos(degrees*Math.PI/180),cy+r*Math.sin(degrees*Math.PI/180)];
const label = (value,cx,cy,r,angle) => {
 const [x,y] = polar(cx,cy,r,angle);
 const node=document.createElementNS('http://www.w3.org/2000/svg','text');
 node.setAttribute('x',x.toFixed(2));node.setAttribute('y',y.toFixed(2));node.setAttribute('text-anchor','middle');node.setAttribute('dominant-baseline','central');node.textContent=value;$('dial-labels').append(node);
};
for(const value of [0,40,80,120,160,200])label(value,385,480,253,140+value/200*160);
for(const value of [0,3,4,5,6,7,8])label(value,1022,480,255,245+value/8*165);
function marker(id,cx,cy,angle) {
 const a=polar(cx,cy,315,angle),b=polar(cx,cy,344,angle);
 for(const [key,val] of Object.entries({x1:a[0],y1:a[1],x2:b[0],y2:b[1]}))$(id).setAttribute(key,val.toFixed(3));
}
function resize(){ $('cluster').style.transform='scale('+($('viewport').getBoundingClientRect().width/1448)+')'; }
const resizeObserver = new ResizeObserver(resize);resizeObserver.observe($('viewport'));resize();
let state=referenceState(), input={throttle:false,brake:false}, runningDemo=false,demoTime=0,last=null,raf=0,lastGear=4;
const owners = { throttle:new Set(), brake:new Set() };
function paint(s,animate=false) {
 band('speed-band',s.speed,200);band('rpm-band',s.rpm,8000);
 $('speed').textContent=Math.round(s.speed);$('rpm').textContent=Math.round(s.rpm/10)*10;
 $('gear').textContent=s.gear;$('range').textContent=Math.round(s.range)+' mi';$('coolant').textContent=Math.round(s.coolant)+'°F';
 $('fuel-fill').style.width=(clamp(s.range/490,0,1)*100)+'%';
 $('coolant-fill').style.width=(clamp((s.coolant-100)/158,0,1)*100)+'%';
 marker('speed-marker',385,480,140+clamp(s.speed/200,0,1)*160);
 marker('rpm-marker',1022,480,245+clamp(s.rpm/8000,0,1)*165);
 $('brake-lamps').style.opacity=s.brake?'0.85':'0';
 lastGear=s.gear;
 $('accelerate').setAttribute('aria-pressed',String(s.throttle&&!s.brake));
 $('brake').setAttribute('aria-pressed',String(s.brake));$('pause').setAttribute('aria-pressed',String(s.paused));
 $('pause').textContent=s.paused?'Resume':'Pause';$('demo').setAttribute('aria-pressed',String(runningDemo));
 $('downshift').disabled=s.paused||!canShift(s,-1);$('upshift').disabled=s.paused||!canShift(s,1);
 $('accelerate').disabled=s.paused;$('brake').disabled=s.paused;
}
function announce(text){$('status').textContent=text;}
function releaseAll(){owners.throttle.clear();owners.brake.clear();input.throttle=input.brake=false;state.throttle=state.brake=false;}
function stopDemo(){if(runningDemo){runningDemo=false;releaseAll();announce('Demo stopped · Your controls are active.');}}
function activatePedal(key,owner){if(state.paused)return;stopDemo();owners[key].add(owner);input[key]=owners[key].size>0;}
function releasePedal(key,owner){owners[key].delete(owner);input[key]=owners[key].size>0;}
function frame(now){
 if(last!==null&&!capture&&!document.hidden&&!state.paused){
  const dt=Math.min((now-last)/1000,.05);
  if(runningDemo){demoTime=Math.min(DEMO_DURATION,demoTime+dt);state=demoAt(demoTime);if(demoTime>=DEMO_DURATION){runningDemo=false;state=referenceState();announce('Demo complete · Reference restored.');}}
  else state=step(state,dt,input);
  paint(state,true);
 }
 last=now;raf=requestAnimationFrame(frame);
}
for(const [id,key] of [['accelerate','throttle'],['brake','brake']]){
 const button=$(id);
 button.addEventListener('pointerdown',event=>{if(event.button!==0)return;button.setPointerCapture(event.pointerId);activatePedal(key,'pointer'+event.pointerId);announce(key==='brake'?'Braking · Speed and RPM decrease.':'Accelerating · Speed and RPM increase.');});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,event=>releasePedal(key,'pointer'+event.pointerId));
 button.addEventListener('keydown',event=>{if(event.code==='Space'||event.code==='Enter'){event.preventDefault();if(!event.repeat)activatePedal(key,'button'+event.code);}});
 button.addEventListener('keyup',event=>{if(event.code==='Space'||event.code==='Enter'){event.preventDefault();releasePedal(key,'button'+event.code);}});
 button.addEventListener('blur',()=>{owners[key].delete('buttonSpace');owners[key].delete('buttonEnter');input[key]=owners[key].size>0;});
}
function shiftBy(direction){if(state.paused)return;stopDemo();const next=shift(state,direction);if(next===state){announce('Shift unavailable · Keep RPM below 7600.');return;}state=next;paint(state,true);announce('Gear '+state.gear+' · RPM adjusts while road speed stays continuous.');}
$('upshift').addEventListener('click',()=>shiftBy(1));$('downshift').addEventListener('click',()=>shiftBy(-1));
$('pause').addEventListener('click',()=>{state.paused=!state.paused;releaseAll();last=null;paint(state);announce(state.paused?'Paused · All telemetry is frozen.':'Resumed · Pedals released.');});
$('reset').addEventListener('click',()=>{runningDemo=false;releaseAll();state=referenceState();demoTime=0;last=null;paint(state);announce('Reference restored · 128 mph, 5600 rpm, gear 4, 310 mi, 198°F.');});
$('demo').addEventListener('click',()=>{if(runningDemo){stopDemo();paint(state);return;}releaseAll();state=referenceState();demoTime=0;runningDemo=true;last=null;paint(state);announce('16-second demonstration · Accelerate, shift, brake and restore the reference.');});
document.addEventListener('keydown',event=>{
 if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
 event.preventDefault();if(event.repeat)return;
 if(event.code==='ArrowUp')activatePedal('throttle','keyboard-up');
 if(event.code==='ArrowDown')activatePedal('brake','keyboard-down');
 if(event.code==='ArrowLeft')shiftBy(-1);if(event.code==='ArrowRight')shiftBy(1);
});
document.addEventListener('keyup',event=>{if(event.code==='ArrowUp')releasePedal('throttle','keyboard-up');if(event.code==='ArrowDown')releasePedal('brake','keyboard-down');});
window.addEventListener('blur',()=>{releaseAll();last=null;paint(state);});
document.addEventListener('visibilitychange',()=>{releaseAll();last=null;paint(state);});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);resizeObserver.disconnect();releaseAll();});
const ready=Promise.all(Object.entries(files).map(async([id,file])=>{const el=$(id);el.src=base+file;await el.decode();})).then(()=>{paint(state);if(!capture)raf=requestAnimationFrame(frame);});
window.dashboard={ready,renderAt:seconds=>{state=demoAt(seconds);paint(state);return {...state};},getState:()=>({...state}),getBands:()=>({speed:Number($('speed-band').getAttribute('data-fraction')),rpm:Number($('rpm-band').getAttribute('data-fraction'))}),renderState:values=>{if(!capture)throw new Error('Fixture rendering is capture-only');state={...referenceState(),...values};paint(state);return {...state};},reset:()=>{$('reset').click();return {...state};}};
paint(state);
