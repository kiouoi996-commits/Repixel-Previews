import {specs,createState,select,step,calm,isMoving,paint,layout,frameGeometry,mod,clamp,previewFrames,previewPointer,featherPhoto,DURATION} from './scene.mjs';
const spec=specs.find(s=>s.number===Number(document.body.dataset.study));
const region=document.querySelector('.gallery'),canvas=region.querySelector('canvas'),ctx=canvas.getContext('2d'),controls=region.querySelector('.controls'),status=document.querySelector('#status'),replay=document.querySelector('#replay'),reduce=document.querySelector('#reduce');
const manifest=await(await fetch(new URL('./assets.json',import.meta.url))).json(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state=createState(),mobile=false,raf=0,last=0,replaying=false,replayStart=0,replayElapsed=0,drag=null,loaded=false;
const assets={photos:[],colors:[]},frames=previewFrames(spec),buttons=new Map();
function announce(){const i=mod(state.target,spec.count);status.textContent=`${i+1} of ${spec.count}: ${spec.names[i]}`;for(const [key,b]of buttons)if(typeof key==='number')b.setAttribute('aria-pressed',String(key===i));}
function draw(pointer=null){if(loaded)paint(ctx,spec,state,assets,{mobile,pointer});}
function stopReplay(){replaying=false;replay.textContent='Replay preview';}
function request(){if(!raf&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick);}}
function go(index){stopReplay();select(state,spec,index);if(reduce.checked)calm(state,spec);announce();draw();request();}
function tick(now){raf=0;if(document.hidden||!loaded)return;
 if(replaying){replayElapsed=(now-replayStart)/1000;if(replayElapsed>=DURATION){stopReplay();state={...frames.at(-1)};announce();draw();}else{state={...frames[Math.min(frames.length-1,Math.floor(replayElapsed*30))]};announce();draw(mobile?null:previewPointer(spec,replayElapsed));}}
 else if(!drag){step(state,spec,Math.min((now-last)/1000,.05));draw();}
 last=now;if(replaying||(!drag&&isMoving(state,spec)))raf=requestAnimationFrame(tick);
}
for(const [key,label]of [['prev','Previous image'],['next','Next image'],...(spec.number===196?spec.names.map((n,i)=>[i,'Show '+n]):[])]){
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',label);if(typeof key==='number')button.setAttribute('aria-pressed',String(key===0));
 button.addEventListener('click',()=>go(typeof key==='number'?key:mod(state.target,spec.count)+(key==='next'?1:-1)));
 controls.append(button);buttons.set(key,button);
}
function resize(){const width=region.clientWidth;mobile=width<720;const l=layout(spec,mobile),dpr=Math.min(2,devicePixelRatio||1);region.style.aspectRatio=`${l.width}/${l.height}`;canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*l.height/l.width*dpr);ctx.setTransform(canvas.width/l.width,0,0,canvas.height/l.height,0,0);
 for(const[key,button]of buttons){const a=typeof key==='number'?l.thumbs[key]:l[key];Object.assign(button.style,{left:`${a.x/l.width*100}%`,top:`${a.y/l.height*100}%`,width:`${a.w/l.width*100}%`,height:`${a.h/l.height*100}%`});}
 draw();
}
region.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();go(event.key==='Home'?0:event.key==='End'?spec.count-1:mod(state.target,spec.count)+(event.key==='ArrowRight'?1:-1));});
canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;stopReplay();drag={id:event.pointerId,x:event.clientX,y:event.clientY,q:state.q,time:performance.now(),lastQ:state.q,moved:false};canvas.setPointerCapture(event.pointerId);});
canvas.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.moved&&(Math.abs(dx)<7||Math.abs(dx)<Math.abs(dy)))return;drag.moved=true;const now=performance.now(),scale=region.clientWidth/layout(spec,mobile).width,span=mobile?335:spec.number===195?937:1052;
 state.q=drag.q-dx/(scale*span);state.v=clamp((state.q-drag.lastQ)/Math.max(.008,(now-drag.time)/1000),-5,5);drag.lastQ=state.q;drag.time=now;draw();});
function finish(event,canceled=false){if(!drag||event.pointerId!==drag.id)return;const start=drag;drag=null;
 if(start.moved){state.target=Math.round(state.q+state.v*.12);state.age=0;if(reduce.checked)calm(state,spec);announce();request();}
 else if(!canceled){const r=canvas.getBoundingClientRect(),l=layout(spec,mobile),x=(event.clientX-r.left)/r.width*l.width,y=(event.clientY-r.top)/r.height*l.height;
  for(let i=0;i<spec.count;i++){const g=frameGeometry(spec,mod(i-state.q+1.5,spec.count)-1.5,mobile);if(g&&x>=g.x&&x<=g.x+g.w&&y>=g.y&&y<=g.y+g.h){go(i);break;}}
 }
 request();
}
canvas.addEventListener('pointerup',e=>finish(e));canvas.addEventListener('pointercancel',e=>finish(e,true));
replay.addEventListener('click',()=>{if(replaying){stopReplay();return;}if(reduce.checked)return;drag=null;state=createState();replaying=true;replayStart=performance.now();replayElapsed=0;replay.textContent='Stop replay';request();});
function setCalm(value){reduce.checked=value;replay.disabled=value||!loaded;if(value){stopReplay();calm(state,spec);draw();}else request();}
reduce.checked=reduced.matches;reduce.addEventListener('change',()=>setCalm(reduce.checked));reduced.addEventListener('change',e=>setCalm(e.matches));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else{if(replaying)replayStart=performance.now()-replayElapsed*1000;request();}});
const observer=new ResizeObserver(resize);observer.observe(region);addEventListener('pagehide',()=>{observer.disconnect();if(raf)cancelAnimationFrame(raf);});
async function photo(file){const item=manifest.find(f=>f.filename===file);if(!item)throw Error('Missing gallery resource '+file);const img=new Image();img.crossOrigin='anonymous';img.src=item.url;await img.decode();return img;}
try{
 await Promise.all([['Gallery Serif','DMSerifDisplay-Regular.ttf',400],['Gallery Hand','Caveat.ttf',600],['Gallery Sans','Inter-Latin.woff',400],['Gallery Sans','Inter-Latin.woff',500]].map(async([family,file,weight])=>{const font=new FontFace(family,`url(${manifest.find(f=>f.filename===file).url})`,{weight:String(weight)});await font.load();document.fonts.add(font);}));
 assets.photos=await Promise.all(spec.files.map(photo));assets.colors=spec.files.map(file=>manifest.find(f=>f.filename===file).color||spec.bg);
 if(spec.number===196)assets.fadedPhotos=assets.photos.map(photo=>featherPhoto(photo,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;}));
 if(spec.number===195)assets.grain=await photo('paper-grain.webp');
 loaded=true;replay.disabled=reduce.checked;announce();resize();
 if(new URLSearchParams(location.search).get('demo')==='1'&&!reduce.checked)replay.click();
}catch(error){status.textContent='The gallery resources could not load. Reload to try again.';console.error(error);}
