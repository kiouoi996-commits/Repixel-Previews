// One drawing and motion implementation shared by the live examples and recordings.
export const WIDTH = 1200, HEIGHT = 676, FPS = 30, DURATION = 9;
export const batch = 'dock-studies-2026-10-27';
export const specs = [
  { number:192, slug:'lila-elastic-label-dock', title:'Lila — Elastic Label Dock', bg:'#efecff', ink:'#7c7995', accent:'#6236ff', initial:2,
    box:[121,226,958,209,104.5], centers:[252,476,711,950], iconY:309, iconSize:65,
    names:['Chats','Files','Saved','Profile'], icons:['chat','folder','bookmark','profile'], tile:[228,163,54], stiffness:390, damping:29,
    beats:[[1.10,0],[2.75,1],[4.35,3],[6.10,2]], mechanism:'velocity-stretched-capsule-with-damped-spring-and-label-color-handoff' },
  { number:193, slug:'ember-slanted-flow-dock', title:'Ember — Slanted Flow Dock', bg:'#acd3fc', ink:'#607087', accent:'#ff7838', initial:0,
    box:[128,247,946,181,70], centers:[233,437,615,792,975], iconY:338, iconSize:67,
    names:['Library','Explore','Create','Community','Settings'], icons:['book','compass','plus','users','gear'], tile:[180,181,23], stiffness:285, damping:30,
    beats:[[1.10,1],[2.60,2],[4.15,4],[5.75,3],[7.10,0]], mechanism:'single-sheared-orange-ribbon-with-velocity-led-edge-and-white-icon-handoff' },
  { number:194, slug:'aeris-glass-handoff-dock', title:'Aeris — Glass Handoff Dock', bg:'#e9e1fc', ink:'#7d7993', accent:'#7041ff', initial:0,
    box:[199,247,802,182,68], centers:[311,495,694,891], iconY:338, iconSize:63,
    names:['Home','Favorites','Messages','Profile'], icons:['home','heart','mail','profile'], tile:[173,130,40], stiffness:245, damping:27,
    beats:[[1.15,1],[2.95,2],[4.65,3],[6.50,0]], mechanism:'frosted-lens-handoff-with-compression-solid-glyph-crossfade-and-divider-occlusion' }
];
export const glyphs = {
  chat:'M18 91 L24 76 C15 67 10 58 10 45 C10 21 28 5 50 5 C74 5 92 23 92 47 C92 72 73 90 50 90 C45 90 40 89 35 87 M34 47 H67',
  folder:'M10 84 V20 Q10 10 20 10 H40 Q45 10 49 17 L56 27 H80 Q92 27 92 39 V79 Q92 90 81 90 H21 Q10 90 10 80',
  bookmark:'M17 13 Q17 5 26 5 H75 Q84 5 84 14 V88 Q84 96 77 91 L51 72 L26 92 Q17 96 17 87 Z',
  profile:'M50 48 A20 20 0 1 0 50 8 A20 20 0 0 0 50 48 M50 61 C25 61 9 76 9 94 H91 C91 76 75 61 65 61',
  book:'M50 20 Q30 7 7 19 V85 Q30 73 50 87 Q71 73 93 85 V19 Q70 7 50 20 V87',
  compass:'M50 94 A44 44 0 1 0 50 6 A44 44 0 0 0 50 94 M69 30 L58 59 L30 70 L42 41 Z',
  plus:'M28 7 H73 Q93 7 93 29 V72 Q93 93 72 93 H28 Q7 93 7 72 V28 Q7 7 28 7 M50 31 V69 M31 50 H69',
  users:'M50 45 A17 17 0 1 0 50 11 A17 17 0 0 0 50 45 M17 87 C17 51 83 51 83 87 M18 26 C8 27 7 45 20 47 M82 26 C92 27 93 45 80 47 M6 64 Q0 72 0 86 M94 64 Q100 72 100 86',
  gear:'M40 5 H60 L64 18 L76 22 L88 17 L98 34 L88 44 V56 L98 66 L88 83 L76 78 L64 82 L60 95 H40 L36 82 L24 78 L12 83 L2 66 L12 56 V44 L2 34 L12 17 L24 22 L36 18 Z M50 67 A17 17 0 1 0 50 33 A17 17 0 0 0 50 67',
  home:'M6 43 Q6 38 11 34 L44 6 Q50 1 56 6 L89 34 Q94 38 94 44 V88 Q94 95 87 95 H64 V72 Q64 66 58 66 H42 Q36 66 36 72 V95 H13 Q6 95 6 88 Z',
  heart:'M50 88 L12 51 C-10 23 27 -3 50 22 C73 -3 110 23 88 51 Z',
  mail:'M17 12 H83 Q94 12 94 24 V77 Q94 89 82 89 H18 Q6 89 6 77 V24 Q6 12 17 12 M9 26 L50 55 L91 26'
};
export const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
export function createState(spec) {
  return { x:spec.centers[spec.initial], v:0, selected:spec.initial, weights:spec.centers.map((_,i)=>+(i===spec.initial)), age:2, tilt:0 };
}
export function select(state, index) { if(index===state.selected)return; state.selected=index; state.age=0; }
export function settle(state, spec) { state.x=spec.centers[state.selected];state.v=0;state.weights=spec.centers.map((_,i)=>+(i===state.selected));state.age=2; }
export function update(state, spec, seconds) {
  const steps=Math.max(1,Math.ceil(Math.min(seconds,.1)*120)), dt=Math.min(seconds,.1)/steps;
  for(let j=0;j<steps;j++) {
    const target=spec.centers[state.selected];
    state.v+=(spec.stiffness*(target-state.x)-spec.damping*state.v)*dt;
    state.x+=state.v*dt; state.age+=dt;
    for(let i=0;i<state.weights.length;i++)state.weights[i]+=((i===state.selected?1:0)-state.weights[i])*(1-Math.exp(-20*dt));
    if(Math.abs(target-state.x)<.002&&Math.abs(state.v)<.02&&state.age>1)settle(state,spec);
  }
}
export function previewStates(spec) {
  const state=createState(spec), frames=[];let beat=0;
  for(let n=0;n<DURATION*FPS;n++) {
    const t=n/FPS;
    while(beat<spec.beats.length && spec.beats[beat][0]<=t+1e-6)select(state,spec.beats[beat++][1]);
    if(n)update(state,spec,1/FPS);
    frames.push({...state,weights:[...state.weights]});
  }
  return frames;
}
function rounded(ctx,x,y,w,h,r) { ctx.beginPath();ctx.roundRect(x,y,w,h,r); }
function mix(a,b,t) { const c=x=>x.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16));const aa=c(a),bb=c(b);return '#'+aa.map((v,i)=>Math.round(v+(bb[i]-v)*t).toString(16).padStart(2,'0')).join(''); }
function icon(ctx, spec, name, x,y, amount, scale, paths) {
  ctx.save();ctx.translate(x,y);const sizing=spec.iconSize*scale*(name==='bookmark'?1.15:1)/100;ctx.scale(sizing,sizing);ctx.translate(-50,-50);
  ctx.lineWidth=8.2;ctx.lineCap='round';ctx.lineJoin='round';
  const color=mix(spec.ink,spec.number===193?'#ffffff':spec.accent,amount);
  ctx.strokeStyle=color;ctx.fillStyle=color;
  if(name==='bookmark') {
    const g=ctx.createLinearGradient(10,0,85,95);g.addColorStop(0,amount>.5?'#7952ff':spec.ink);g.addColorStop(1,color);
    ctx.fillStyle=g;ctx.fill(paths[name]);ctx.strokeStyle=spec.bg;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(35,27);ctx.lineTo(68,27);ctx.stroke();
  } else if(name==='home') {
    ctx.fillStyle=color;ctx.fill(paths[name]);
  } else {
    ctx.stroke(paths[name]);
    if(spec.number===194&&amount>.001&&(name==='heart'||name==='profile')) {
      ctx.globalAlpha=amount;ctx.fillStyle=spec.accent;ctx.fill(paths[name]);
    }
  }
  ctx.restore();
}
export function renderScene(ctx, spec, state, {paths}, {background=true}={}) {
  const [x,y,w,h,r]=spec.box;
  if(background){ctx.fillStyle=spec.bg;ctx.fillRect(0,0,WIDTH,HEIGHT);}else ctx.clearRect(0,0,WIDTH,HEIGHT);
  ctx.save();
  // One stationary rail. Only the selected tile and departure/arrival emphasis move.
  ctx.shadowColor=spec.number===193?'#55769942':'#8c7bc536';ctx.shadowBlur=40;ctx.shadowOffsetY=24;
  rounded(ctx,x,y,w,h,r);ctx.fillStyle=spec.number===194?'#f8f5ff':'#fdfcff';ctx.fill();
  ctx.shadowColor='transparent';
  if(spec.number===194){rounded(ctx,x,y,w,h,r);ctx.strokeStyle='#ffffffc9';ctx.lineWidth=2;ctx.stroke();}
  const speed=Math.abs(state.v), stretch=clamp(speed/4000,0,.23), direction=Math.sign(state.v);
  let tw=spec.tile[0]*(1+stretch),th=spec.tile[1]*(1-stretch*.22),tx=state.x-tw/2,ty=y+(h-th)/2;
  let ribbonTrace;
  ctx.save();rounded(ctx,x,y,w,h,r);ctx.clip();
  if(spec.number===194) {
    for(const sx of [400,598,797]) {
      const distance=Math.abs(sx-state.x);
      ctx.globalAlpha=clamp((distance-tw/2-12)/14);
      ctx.fillStyle='#dacbff';ctx.fillRect(sx,y+52,1.8,78);
    }
    ctx.globalAlpha=1;
  }
  if(spec.number===193) {
    // Parallel diagonal edges; the first/last state extends into the rail clip.
    const skew=38+direction*clamp(speed/80,-15,15), left=state.x-tw/2,right=state.x+tw/2;
    const lead=clamp((state.x-spec.centers[0])/110),tail=clamp((spec.centers.at(-1)-state.x)/110);
    const lt=left+skew-110*(1-lead),lb=left-skew-40*(1-lead),rt=right+skew+40*(1-tail),rb=right-skew+110*(1-tail);
    ribbonTrace=()=>{ctx.beginPath();ctx.moveTo(lt+23,y);ctx.lineTo(rt-23,y);ctx.quadraticCurveTo(rt+3,y,rt-7,y+27);ctx.lineTo(rb+8,y+h-27);ctx.quadraticCurveTo(rb,y+h,rb-23,y+h);ctx.lineTo(lb+23,y+h);ctx.quadraticCurveTo(lb-3,y+h,lb+7,y+h-27);ctx.lineTo(lt-8,y+27);ctx.quadraticCurveTo(lt,y,lt+23,y);ctx.closePath();};ribbonTrace();
    const g=ctx.createLinearGradient(left,y,right,y+h);g.addColorStop(0,'#ff813d');g.addColorStop(1,'#ff6d36');ctx.fillStyle=g;ctx.fill();
  } else {
    if(spec.number===194) {
      const squeeze=1-.055*Math.exp(-state.age*8)*Math.sin(state.age*17);
      tw*=squeeze;tx=state.x-tw/2;
    }
    rounded(ctx,tx,ty,tw,th,spec.tile[2]);
    ctx.fillStyle=spec.number===194?'#e6dcff':'#eee9ff';ctx.fill();
  }
  ctx.restore();
  for(let i=0;i<spec.centers.length;i++) {
    const a=spec.number===193?0:state.weights[i], kick=i===state.selected ? .07*Math.exp(-state.age*8)*Math.sin(state.age*20) : 0;
    const lift=spec.number===194?-3*Math.exp(-state.age*7)*Math.sin(state.age*16)*a:0;
    icon(ctx,spec,spec.icons[i],spec.centers[i],spec.iconY+lift,a,1+kick,paths);
    if(spec.number===192) {
      ctx.font='32px "Dock Sans", Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle=mix(spec.ink,spec.accent,a);ctx.fillText(spec.names[i],spec.centers[i],383);
    }
  }
  if(ribbonTrace){
    ctx.save();rounded(ctx,x,y,w,h,r);ctx.clip();ribbonTrace();ctx.clip();
    for(let i=0;i<spec.centers.length;i++)icon(ctx,spec,spec.icons[i],spec.centers[i],spec.iconY,1,1,paths);
    ctx.restore();
  }
  ctx.restore();
}
