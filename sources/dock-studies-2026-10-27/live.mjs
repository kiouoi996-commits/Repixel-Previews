import {WIDTH,HEIGHT,DURATION,specs,glyphs,createState,select,settle,update,previewStates,renderScene} from './scene.mjs';
const spec=specs.find(s=>s.number===Number(document.body.dataset.study));
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),nav=document.querySelector('nav'),status=document.querySelector('#status'),replay=document.querySelector('#replay');
const buttons=[...nav.querySelectorAll('button')],reduced=matchMedia('(prefers-reduced-motion: reduce)');
const assets={paths:Object.fromEntries(Object.entries(glyphs).map(([k,d])=>[k,new Path2D(d)]))};
let state=createState(spec),raf=0,last=0,demoStart=null,hiddenAt=0;
const frames=previewStates(spec);
function paint(){renderScene(ctx,spec,state,assets);}
function semantics(index){buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));status.textContent=`${spec.names[index]} selected · interaction example`;}
function stopReplay(){demoStart=null;replay.textContent='Replay preview';}
function needsMotion(){return Math.abs(state.v)>.02||Math.abs(state.x-spec.centers[state.selected])>.002||state.age<1.5;}
function tick(now){
  raf=0;if(document.hidden)return;
  if(demoStart!==null){const t=(now-demoStart)/1000;if(t>=DURATION){stopReplay();semantics(state.selected);}else {const f=frames[Math.min(frames.length-1,Math.floor(t*30))];state={...f,weights:[...f.weights]};semantics(state.selected);}}
  else if(last)update(state,spec,Math.min((now-last)/1000,.05));
  last=now;paint();if(demoStart!==null||needsMotion())raf=requestAnimationFrame(tick);
}
function request(){if(!raf&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick);}}
buttons.forEach((button,i)=>{
  const [x,y,w,h]=spec.box,slot=w/buttons.length;
  Object.assign(button.style,{left:`${(spec.centers[i]-slot/2)/WIDTH*100}%`,top:`${y/HEIGHT*100}%`,width:`${slot/WIDTH*100}%`,height:`${h/HEIGHT*100}%`});
  button.addEventListener('click',()=>{stopReplay();select(state,i);if(reduced.matches)settle(state,spec);semantics(i);paint();request();});
  button.addEventListener('keydown',event=>{
    const key=event.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;event.preventDefault();
    const next=key==='Home'?0:key==='End'?buttons.length-1:(i+(key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    buttons[next].focus();buttons[next].click();
  });
});
replay.addEventListener('click',()=>{if(demoStart!==null){stopReplay();return;}state=createState(spec);demoStart=performance.now();replay.textContent='Stop replay';request();});
reduced.addEventListener('change',()=>{if(reduced.matches){stopReplay();settle(state,spec);paint();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=performance.now();if(raf)cancelAnimationFrame(raf);raf=0;}else {if(demoStart!==null)demoStart+=performance.now()-hiddenAt;request();}});
const observer=new ResizeObserver(()=>{const rect=canvas.getBoundingClientRect(),scale=Math.max(.25,Math.min(2,rect.width*(devicePixelRatio||1)/WIDTH));canvas.width=Math.round(WIDTH*scale);canvas.height=Math.round(HEIGHT*scale);ctx.setTransform(canvas.width/WIDTH,0,0,canvas.height/HEIGHT,0,0);paint();});observer.observe(canvas);
addEventListener('pagehide',()=>{observer.disconnect();if(raf)cancelAnimationFrame(raf);});
semantics(state.selected);paint();
if(new URLSearchParams(location.search).get('demo')==='1'&&!reduced.matches)replay.click();
