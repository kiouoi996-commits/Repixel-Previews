export const WIDTH=1672,HEIGHT=941,FPS=30,DURATION=10,batch='gallery-studies-2026-10-27';
export const specs=[
 {number:195,slug:'paper-garden-print-gallery',title:'Paper Garden — Print Gallery',bg:'#f7f1e6',ink:'#11120f',accent:'#fa5c12',count:6,k:115,d:22,names:['Orange stem','Quiet leaves','Orange leaves','Seed branch','White bloom','Split leaf'],files:['paper-01-orange-stem.webp','paper-02-quiet-leaves.webp','paper-03-orange-leaves.webp','paper-04-seed-branch.webp','paper-05-white-bloom.webp','paper-06-split-leaf.webp'],beats:[[1.2,1],[3.2,2],[5.2,1],[7.2,0]],mechanism:'continuous-expanding-print-rail-with-clipped-artwork-parallax'},
 {number:196,slug:'object-index-focus-gallery',title:'Object Index — Focus Gallery',bg:'#070b13',ink:'#fbfbfc',accent:'#deff6b',count:4,k:165,d:25.7,names:['Resonant','Orbit','Echo','Pebble'],files:['object-01-resonant.webp','object-02-orbit.webp','object-03-echo.webp','object-04-pebble.webp'],beats:[[1.15,1],[3.15,2],[5.15,3],[7.15,0]],mechanism:'expanding-image-focus-transfer-with-continuous-thumbnail-indicator'}
];
export const mod=(n,m)=>(n%m+m)%m;
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const wrap=(v,n)=>mod(v+n/2,n)-n/2;
export function createState(){return {q:0,v:0,target:0,thumb:0,tv:0,age:2};}
export function select(state,spec,index){const normalized=mod(index,spec.count);if(mod(state.target,spec.count)===normalized)return;state.target=Math.round(state.q+wrap(normalized-state.q,spec.count));state.age=0;}
export function step(state,spec,dt){const count=Math.max(1,Math.ceil(Math.min(dt,.1)*120)),h=Math.min(dt,.1)/count;
 for(let i=0;i<count;i++){
  state.v+=(spec.k*(state.target-state.q)-spec.d*state.v)*h;state.q+=state.v*h;
  state.tv+=(180*(mod(state.target,spec.count)-state.thumb)-27*state.tv)*h;state.thumb+=state.tv*h;state.age+=h;
  if(state.age>1.2&&Math.abs(state.target-state.q)<.00002&&Math.abs(state.v)<.0001){state.q=state.target;state.v=0;}
  if(Math.abs(mod(state.target,spec.count)-state.thumb)<.00002&&Math.abs(state.tv)<.0001){state.thumb=mod(state.target,spec.count);state.tv=0;}
 }
}
export function calm(state,spec){state.q=state.target;state.v=0;state.thumb=mod(state.target,spec.count);state.tv=0;state.age=2;}
export function isMoving(state,spec){return state.v!==0||state.tv!==0||state.q!==state.target||state.thumb!==mod(state.target,spec.count);}
export function featherPhoto(photo,makeCanvas){const c=makeCanvas(photo.width,photo.height),x=c.getContext('2d');x.drawImage(photo,0,0);x.globalCompositeOperation='destination-in';for(const vertical of [false,true]){const g=x.createLinearGradient(0,0,vertical?0:photo.width,vertical?photo.height:0);g.addColorStop(0,'#0000');g.addColorStop(.025,'#000');g.addColorStop(.975,'#000');g.addColorStop(1,'#0000');x.fillStyle=g;x.fillRect(0,0,photo.width,photo.height);}return c;}
export function frameGeometry(spec,relative,mobile=false){
 const paper=spec.number===195;
 const slots=mobile
  ? [{x:-290,y:185,w:250,h:360},{x:18,y:185,w:318,h:360},{x:354,y:185,w:250,h:360},{x:622,y:185,w:250,h:360}]
  : paper
    ? [{x:-441,y:270,w:440,h:556},{x:87,y:270,w:893,h:556},{x:1024,y:270,w:440,h:556},{x:1508,y:270,w:440,h:556}]
    : [{x:-510,y:112,w:510,h:658},{x:44,y:112,w:1040,h:658},{x:1096,y:112,w:510,h:658},{x:1618,y:112,w:510,h:658}];
 if(relative< -1||relative>3)return null;
 const n=Math.min(2,Math.floor(relative+1)),p=relative+1-n,a=slots[n],b=slots[n+1];
 return {x:lerp(a.x,b.x,p),y:a.y,w:lerp(a.w,b.w,p),h:a.h,r:mobile?20:paper?18:58};
}
export function layout(spec,mobile=false){
 const paper=spec.number===195;
 return mobile?{width:375,height:paper?650:670,prev:{x:235,y:581,w:52,h:48},next:{x:293,y:581,w:52,h:48},thumbs:paper?[]:[0,1,2,3].map(i=>({x:20+i*54,y:583,w:48,h:48}))}
 :{width:WIDTH,height:HEIGHT,prev:paper?{x:1452,y:842,w:80,h:62}:{x:1014,y:806,w:62,h:62},next:paper?{x:1532,y:842,w:82,h:62}:{x:1089,y:806,w:62,h:62},thumbs:paper?[]:[0,1,2,3].map(i=>({x:512+i*122,y:790,w:112,h:98}))};
}
function round(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function image(ctx,img,x,y,w,h,fit='cover',dx=0,scale=1){const factor=(fit==='cover'?Math.max(w/img.width,h/img.height):Math.min(w/img.width,h/img.height))*scale,iw=img.width*factor,ih=img.height*factor;ctx.drawImage(img,x+(w-iw)/2+dx,y+(h-ih)/2,iw,ih);}
function arrow(ctx,cx,cy,dir,color,size=18){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(cx-dir*size*.7,cy);ctx.lineTo(cx+dir*size*.7,cy);ctx.moveTo(cx+dir*size*.1,cy-size*.5);ctx.lineTo(cx+dir*size*.7,cy);ctx.lineTo(cx+dir*size*.1,cy+size*.5);ctx.stroke();ctx.restore();}
function cursor(ctx,point,ink){if(!point||!point.alpha)return;ctx.save();ctx.globalAlpha=point.alpha;ctx.translate(point.x,point.y);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,24);ctx.lineTo(6,18);ctx.lineTo(11,29);ctx.lineTo(17,26);ctx.lineTo(12,16);ctx.lineTo(22,16);ctx.closePath();ctx.fillStyle=ink==='dark'?'#151713':'#fff';ctx.strokeStyle=ink==='dark'?'#fff':'#101319';ctx.lineWidth=1.4;ctx.fill();ctx.stroke();ctx.restore();}
export function paint(ctx,spec,state,assets,{mobile=false,pointer=null,focus=null}={}){
 const l=layout(spec,mobile),paper=spec.number===195;
 ctx.fillStyle=spec.bg;ctx.fillRect(0,0,l.width,l.height);
 if(paper&&assets.grain){ctx.save();ctx.globalAlpha=.6;const p=ctx.createPattern(assets.grain,'repeat');ctx.fillStyle=p;ctx.fillRect(0,0,l.width,l.height);ctx.restore();}
 ctx.fillStyle=spec.ink;ctx.textAlign='left';ctx.textBaseline='alphabetic';
 const selected=mod(state.target,spec.count),num=String(selected+1).padStart(2,'0');
 if(paper){
  ctx.fillStyle=spec.accent;ctx.font=`600 ${mobile?24:43}px "Gallery Hand"`;ctx.fillText('Selected prints',mobile?20:93,mobile?36:58);
  ctx.strokeStyle=spec.accent;ctx.lineWidth=mobile?1.7:3.2;ctx.beginPath();ctx.moveTo(mobile?20:93,mobile?43:80);ctx.bezierCurveTo(mobile?70:174,mobile?39:64,mobile?140:242,mobile?50:89,mobile?179:322,mobile?43:73);ctx.stroke();
  ctx.fillStyle=spec.ink;ctx.font=`400 ${mobile?64:119}px "Gallery Serif"`;ctx.fillText('Paper',mobile?18:91,mobile?102:177);ctx.fillText('Garden',mobile?18:91,mobile?159:264);
  ctx.font=`400 ${mobile?18:28}px "Gallery Serif"`;ctx.fillText(num,mobile?273:1517,mobile?81:136);ctx.fillStyle=spec.accent;ctx.fillText('/',mobile?303:1557,mobile?81:136);ctx.fillStyle='#8e8e87';ctx.fillText('06',mobile?321:1580,mobile?81:136);
 }else{
  ctx.font=`500 ${mobile?30:44}px "Gallery Sans"`;ctx.fillText('Object Index',mobile?18:49,mobile?62:80);
  ctx.font=`400 ${mobile?18:26}px "Gallery Sans"`;ctx.textAlign='right';const end=mobile?354:1623,cy=mobile?106:71;ctx.fillText('04',end,cy);ctx.fillText(num,end-(mobile?67:88),cy);ctx.strokeStyle=spec.ink;ctx.lineWidth=mobile?1:1.7;ctx.beginPath();ctx.moveTo(end-(mobile?49:69),cy-(mobile?6:8));ctx.lineTo(end-(mobile?29:42),cy-(mobile?6:8));ctx.stroke();ctx.textAlign='left';
 }
 const cards=[];
 for(let i=0;i<spec.count;i++){
  const relative=mod(i-state.q+1.5,spec.count)-1.5,g=frameGeometry(spec,relative,mobile);if(!g)continue;cards.push({i,relative,g});
 }
 cards.sort((a,b)=>b.relative-a.relative);
 for(const {i,g}of cards){
  ctx.save();
  if(paper){ctx.shadowColor='#b9a88b32';ctx.shadowBlur=15;ctx.shadowOffsetY=4;round(ctx,g.x,g.y,g.w,g.h,g.r);ctx.fillStyle='#f2e8d7';ctx.fill();ctx.shadowColor='transparent';
   const inset=mobile?8:18;round(ctx,g.x+inset,g.y+inset,g.w-inset*2,g.h-inset*2,Math.max(8,g.r-inset/2));ctx.clip();
   image(ctx,assets.photos[i],g.x+inset,g.y+inset,g.w-inset*2,g.h-inset*2,'cover',clamp(-state.v*4,-16,16),1+Math.min(.025,Math.abs(state.v)*.006));
  }else{
   round(ctx,g.x,g.y,g.w,g.h,g.r);ctx.clip();ctx.fillStyle=assets.colors[i];ctx.fillRect(g.x,g.y,g.w,g.h);
   const zoom=1+.18*clamp((1040-g.w)/530);image(ctx,(assets.fadedPhotos||assets.photos)[i],g.x,g.y,g.w,g.h,'contain',clamp(-state.v*3,-12,12),mobile?1:zoom);
   ctx.fillStyle='#060809';ctx.font=`500 ${mobile?21:31}px "Gallery Sans"`;ctx.fillText(String(i+1).padStart(2,'0')+' / '+spec.names[i],g.x+(mobile?17:40),g.y+(mobile?37:67));
  }
  ctx.restore();
  if(paper){ctx.save();ctx.beginPath();const cx=Math.max(0,g.x),right=mobile?l.width:l.prev.x-20;ctx.rect(cx,g.y+g.h,Math.max(0,Math.min(g.x+g.w,right)-cx),48);ctx.clip();ctx.fillStyle=spec.ink;ctx.font=`400 ${mobile?19:27}px "Gallery Serif"`;ctx.fillText(String(i+1).padStart(2,'0'),g.x+6,g.y+g.h+(mobile?30:43));ctx.fillText(spec.names[i],g.x+(mobile?40:61),g.y+g.h+(mobile?30:43));ctx.restore();}
 }
 if(paper){round(ctx,l.prev.x,l.prev.y,l.next.x+l.next.w-l.prev.x,l.prev.h,8);ctx.fillStyle='#131412';ctx.fill();}
 else{
  const dock=mobile?[12,571,351,72]:[490,771,692,134];
  round(ctx,...dock,mobile?30:66);ctx.fillStyle='#0e121bec';ctx.fill();ctx.strokeStyle='#ffffff0c';ctx.lineWidth=1.4;ctx.stroke();
  for(let i=0;i<l.thumbs.length;i++){const a=l.thumbs[i];ctx.save();round(ctx,a.x,a.y,a.w,a.h,mobile?12:20);ctx.clip();image(ctx,assets.photos[i],a.x,a.y,a.w,a.h,'cover');ctx.restore();}
  const a=l.thumbs[0],gap=mobile?54:122;
  round(ctx,a.x+state.thumb*gap-5,a.y-5,a.w+10,a.h+10,mobile?15:25);ctx.strokeStyle=spec.accent;ctx.lineWidth=mobile?1.7:2;ctx.stroke();
  for(const key of ['prev','next']){const a=l[key];round(ctx,a.x,a.y,a.w,a.h,a.h/2);ctx.fillStyle='#ffffff05';ctx.fill();ctx.strokeStyle='#ffffff20';ctx.lineWidth=1.5;ctx.stroke();}
 }
 for(const [key,dir]of [['prev',-1],['next',1]]){const a=l[key];arrow(ctx,a.x+a.w/2,a.y+a.h/2,dir,paper?(dir===1?spec.accent:'#fff9e9'):'#fff',mobile?13:paper?21:13);}
 if(focus){const a=typeof focus==='number'?l.thumbs[focus]:l[focus];if(a){round(ctx,a.x-5,a.y-5,a.w+10,a.h+10,12);ctx.strokeStyle=paper?spec.accent:'#fff';ctx.lineWidth=2;ctx.stroke();}}
 cursor(ctx,pointer,paper?'dark':'light');
 return l;
}
export function previewFrames(spec){const state=createState(),frames=[];let b=0;for(let n=0;n<DURATION*FPS;n++){const t=n/FPS;while(b<spec.beats.length&&spec.beats[b][0]<=t+1e-6)select(state,spec,spec.beats[b++][1]);if(n)step(state,spec,1/FPS);frames.push({...state});}return frames;}
export function previewPointer(spec,t){
 const l=layout(spec),targets=spec.number===195?[l.next,l.next,l.prev,l.prev]:[l.thumbs[1],l.thumbs[2],l.thumbs[3],l.thumbs[0]],home=spec.number===195?{x:1645,y:922}:{x:1190,y:920};
 let prev={...home},last=0;
 for(let i=0;i<spec.beats.length;i++){
  const click=spec.beats[i][0],a=targets[i],target={x:a.x+a.w*.55,y:a.y+a.h*.53};
  if(t<click-.5){return {...prev,alpha:t<.2?0:1};}
  if(t<click-.05){let p=clamp((t-(click-.5))/.45);p=p*p*(3-2*p);return {x:lerp(prev.x,target.x,p),y:lerp(prev.y,target.y,p)-Math.sin(p*Math.PI)*22,alpha:1};}
  if(t<click+.4)return {...target,alpha:1};prev=target;last=click+.4;
 }
 const p=clamp((t-8.5)/.7),smooth=p*p*(3-2*p);return {x:lerp(prev.x,home.x,smooth),y:lerp(prev.y,home.y,smooth)-Math.sin(p*Math.PI)*18,alpha:t>=9.5?0:1};
}
