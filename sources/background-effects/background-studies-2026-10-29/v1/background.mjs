import {drawScene,makeResources,viewport,clamp,TAU} from './scene.mjs';

/** Mount a decorative layer without intercepting the host's controls or touch scrolling. */
export function mountBackground(host,{kind='copper',ambient=true,palette,anchorX}={}) {
  if(!host||!['copper','paper'].includes(kind))throw new TypeError('A host and a supported background kind are required.');
  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');canvas.dataset.backgroundStudy=kind;
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none'});
  const previous={position:host.style.position,isolation:host.style.isolation,background:host.style.backgroundColor};
  if(getComputedStyle(host).position==='static')host.style.position='relative';
  host.style.isolation='isolate';host.append(canvas);
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){canvas.remove();host.style.backgroundColor=palette?.background||(kind==='paper'?'#faf9f5':'#07131e');return {dispose(){host.style.position=previous.position;host.style.isolation=previous.isolation;host.style.backgroundColor=previous.background;},pause(){},resume(){}};}
  const resources=makeResources((w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h}));
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(any-pointer: fine)');
  const state={kind,width:0,height:0,phase:0,pointer:{x:.5,y:.5,strength:0},waves:[],ambient,palette};
  let target={x:.5,y:.5,strength:0},raf=0,last=0,elapsed=0,visible=true,manual=false,disposed=false,pixelRatio=1;
  let quality=1,lastPaint=0,frameCost=0;
  const duration=kind==='paper'?10:8;
  const canAnimate=()=>!disposed&&!manual&&!reduce.matches&&!document.hidden&&visible&&state.width>0&&state.height>0;
  const active=()=>ambient||state.waves.length>0||target.strength>0||state.pointer.strength>.001;
  function paint(){if(state.width>0&&state.height>0){ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);drawScene(ctx,state,resources,{quality,anchorX});}}
  function queue(){if(canAnimate()&&active()&&!raf)raf=requestAnimationFrame(tick);}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;lastPaint=0;}
  function tick(now){
    raf=0;if(!canAnimate())return;
    const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;elapsed+=dt;
    const ease=1-Math.exp(-dt*11),fade=1-Math.exp(-dt*7);
    state.pointer.x+=(target.x-state.pointer.x)*ease;state.pointer.y+=(target.y-state.pointer.y)*ease;
    state.pointer.strength+=(target.strength-state.pointer.strength)*fade;
    for(const wave of state.waves)wave.age+=dt;
    state.waves=state.waves.filter(w=>w.age<2.7);
    state.phase=ambient?(elapsed%duration)/duration*TAU:0;
    // Bound rendering to 30 fps; pointer integration still follows display cadence.
    if(!lastPaint||now-lastPaint>=31){const before=performance.now();paint();frameCost=frameCost*.9+(performance.now()-before)*.1;lastPaint=now;if(frameCost>23)quality=.68;}
    queue();
  }
  function resize(){
    const box=host.getBoundingClientRect();state.width=Math.max(0,box.width);state.height=Math.max(0,box.height);
    pixelRatio=Math.min(devicePixelRatio||1,1.6,Math.sqrt(2600000/Math.max(1,box.width*box.height)));
    canvas.width=Math.max(1,Math.round(box.width*pixelRatio));canvas.height=Math.max(1,Math.round(box.height*pixelRatio));
    quality=box.width<700?.68:1;paint();queue();
  }
  function point(event){const box=host.getBoundingClientRect(),v=viewport(box.width,box.height,kind,anchorX);return {x:clamp((event.clientX-box.left-v.x)/v.scale/1600,-.5,1.5),y:clamp((event.clientY-box.top-v.y)/v.scale/900,-.5,1.5)};}
  function move(event){if(reduce.matches||event.pointerType==='touch'||!fine.matches)return;target={...point(event),strength:1};queue();}
  function leave(){target.strength=0;queue();}
  function press(event){
    if(reduce.matches||kind!=='paper'||event.button>0)return;
    // Press is observational: never preventDefault, capture a pointer, or change the host action.
    state.waves.push({...point(event),age:0,strength:event.pointerType==='touch'?.8:1});
    if(state.waves.length>3)state.waves.splice(0,state.waves.length-3);queue();
  }
  function visibility(){stop();if(document.hidden){target.strength=0;state.pointer.strength=0;state.waves=[];}queue();}
  function motionChange(){stop();state.waves=[];state.pointer.strength=0;target.strength=0;if(reduce.matches)state.phase=0;paint();queue();}
  const ro=new ResizeObserver(resize);ro.observe(host);
  const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;stop();queue();});io.observe(host);
  host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave,{passive:true});host.addEventListener('pointerdown',press,{passive:true});
  document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',leave);reduce.addEventListener('change',motionChange);fine.addEventListener('change',leave);
  resize();
  return {
    pause(){manual=true;stop();},
    resume(){manual=false;queue();},
    dispose(){if(disposed)return;disposed=true;stop();ro.disconnect();io.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('pointerdown',press);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',leave);reduce.removeEventListener('change',motionChange);fine.removeEventListener('change',leave);canvas.remove();host.style.position=previous.position;host.style.isolation=previous.isolation;host.style.backgroundColor=previous.background;resources.geometries.clear();},
  };
}
