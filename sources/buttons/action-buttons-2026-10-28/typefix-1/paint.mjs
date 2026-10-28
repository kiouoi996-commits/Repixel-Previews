import {specs,clamp,ease} from './core.mjs';
export const width=1586,height=992;
const pill=(c,x,y,w,h,r,color)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill();};
function line(c,points,stroke=6){c.beginPath();for(let i=0;i<points.length;i++)c[i?'lineTo':'moveTo'](...points[i]);c.lineWidth=stroke;c.lineCap=c.lineJoin='round';c.stroke();}
export function background(c,kind,w=width,h=height){if(kind==='bag'){const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#6fa7bb');g.addColorStop(.5,'#6baac0');g.addColorStop(1,'#6fa7bb');c.fillStyle=g;}else c.fillStyle='#000';c.fillRect(0,0,w,h);}
function referenceLabel(c,kind,geometry,alpha=1,dy=0){if(alpha<=0)return;const g=geometry[kind];c.save();c.globalAlpha*=alpha;c.translate(g.x,g.y+dy);c.fill(new Path2D(g.d),'evenodd');c.restore();}
// The static Download font already contains the approved 350-weight outlines.
// Use a standard canvas weight: native Skia parses a leading "350" as a size.
function label(c,kind,value,alpha=1,dy=0){if(alpha<=0)return;const bag=kind==='bag',x=bag?196:174,max=bag?397:488;let size=bag?74:106;c.save();c.globalAlpha*=alpha;while(size>32){c.font=`${bag?600:400} ${size}px "${specs[kind].font}"`;if(c.measureText(value).width<=max)break;size--;}const m=c.measureText(value),y=(specs[kind].box[3]-(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent))/2+m.actualBoundingBoxAscent+dy;c.textAlign='center';c.textBaseline='alphabetic';c.fillText(value,x+max/2,y);c.restore();}
function cube(c,x,y){c.save();c.translate(x,y);c.rotate(-.12);c.fillStyle='#fff';c.lineWidth=4;c.beginPath();c.moveTo(0,-17);c.lineTo(17,-8);c.lineTo(17,10);c.lineTo(0,20);c.lineTo(-17,10);c.lineTo(-17,-8);c.closePath();c.fill();c.stroke();line(c,[[-17,-8],[0,1],[17,-8]],3);line(c,[[0,1],[0,20]],3);c.restore();}
function bag(c,v){const f=v.finish||0,hit=v.phase==='success'?Math.sin(Math.PI*clamp(f/.7))*Math.exp(-3*f):0;c.save();c.translate(674,130);c.scale(1+hit*.10,1-hit*.11);c.translate(-674,-130);c.lineWidth=6;c.lineCap=c.lineJoin='round';c.beginPath();c.moveTo(658,105);c.lineTo(658,93);c.bezierCurveTo(658,67,690,67,690,93);c.lineTo(690,105);c.stroke();
 if((v.phase==='pending'||v.phase==='success')&&!v.reduced){const enter=v.enter,drop=v.phase==='success'?ease(f/.58):0,x=610+(674-610)*enter,y=55-16*Math.sin(Math.PI*enter)+(v.phase==='pending'?Math.sin(v.elapsed*5)*3:0)+100*drop;c.save();c.beginPath();c.rect(625,20,110,82);c.clip();cube(c,x,y);c.restore();}
 c.fillStyle='#fff';c.beginPath();c.roundRect(641,100,65,59,7);c.fill();c.stroke();c.restore();
 if(v.phase==='success'&&f>.65){const a=ease((f-.65)/.35);c.save();c.globalAlpha*=a;pill(c,694,57,42,42,21,specs.bag.ink);c.fillStyle='#fff';c.font='600 25px "Button Bag"';c.textAlign='center';c.textBaseline='middle';c.fillText(v.count>99?'99+':String(v.count).padStart(2,'0'),715,79);c.restore();}
 if(v.phase==='error'){line(c,[[664,122],[684,142]],4);line(c,[[684,122],[664,142]],4);}
}
function arrow(c,alpha=1,dy=0){c.save();c.globalAlpha*=alpha;c.translate(0,dy);line(c,[[763,86],[763,149]],8);line(c,[[735,122],[763,150],[791,122]],8);c.beginPath();c.moveTo(718,157);c.lineTo(718,171);c.quadraticCurveTo(718,178,726,178);c.lineTo(801,178);c.quadraticCurveTo(809,178,809,171);c.lineTo(809,157);c.lineWidth=8;c.stroke();c.restore();}
function ring(c,p,alpha=1,rotation=0){c.save();c.globalAlpha*=alpha;c.beginPath();c.arc(763,132,47,-Math.PI/2+rotation,-Math.PI/2+rotation+Math.PI*2*clamp(p,.03,1));c.lineWidth=8;c.lineCap='round';c.stroke();c.restore();}
function check(c,p){const a=[734,133],b=[755,154],d=[796,108],l1=29.7,l2=61.6,L=(l1+l2)*p;c.beginPath();c.moveTo(...a);if(L<=l1)c.lineTo(a[0]+(b[0]-a[0])*L/l1,a[1]+(b[1]-a[1])*L/l1);else{c.lineTo(...b);const q=(L-l1)/l2;c.lineTo(b[0]+(d[0]-b[0])*q,b[1]+(d[1]-b[1])*q);}c.lineWidth=8;c.lineCap=c.lineJoin='round';c.stroke();}
function content(c,kind,v,g){c.fillStyle=c.strokeStyle=specs[kind].ink;
 if(kind==='bag'){
  if(v.phase==='idle')referenceLabel(c,kind,g);
  else if(v.phase==='pending'){referenceLabel(c,kind,g,1-v.enter,-18*v.enter);label(c,kind,'Adding',v.enter,18*(1-v.enter));}
  else if(v.phase==='success'){const a=ease((v.finish-.4)/.4);label(c,kind,'Adding',1-a,-16*a);label(c,kind,'Added to bag',a,16*(1-a));}
  else label(c,kind,'Try again');bag(c,v);
 }else{
  if(v.phase==='idle'){referenceLabel(c,kind,g);arrow(c);}
  else if(v.phase==='pending'){
   referenceLabel(c,kind,g,1-v.enter,-28*v.enter);arrow(c,1-v.enter,22*v.enter);
   c.save();c.globalAlpha*=v.enter;pill(c,174,128,488,8,4,'#e5e5e5');if(v.known)pill(c,174,128,488*v.progress,8,4,'#000');else{c.beginPath();c.rect(174,128,488,8);c.clip();pill(c,174+((v.elapsed*.45)%1)*610-122,128,122,8,4,'#000');}c.restore();ring(c,v.known?v.progress:.27,v.enter,v.reduced||v.known?0:v.elapsed*3.5);
  }else if(v.phase==='success'){const a=ease(v.finish);label(c,kind,'Downloaded',a,16*(1-a));ring(c,1,1-a);check(c,a);}
  else{label(c,kind,'Try again');arrow(c);}
 }
}
export function paintButton(c,kind,v,geometry){const s=specs[kind],w=s.box[2],h=s.box[3];pill(c,0,0,w,h,h/2,'#fff');if(v.reset!==undefined){c.save();c.globalAlpha=v.reset;content(c,kind,{...v,reset:undefined},geometry);c.restore();c.save();c.globalAlpha=1-v.reset;content(c,kind,{...v,phase:'idle'},geometry);c.restore();}else content(c,kind,v,geometry);}
export function paintScene(c,kind,v,geometry,pointer){background(c,kind);const s=specs[kind];c.save();c.translate(s.box[0],s.box[1]);paintButton(c,kind,v,geometry);c.restore();if(pointer){c.save();c.translate(pointer.x,pointer.y);c.beginPath();c.moveTo(0,0);c.lineTo(0,27);c.lineTo(8,20);c.lineTo(14,31);c.lineTo(18,29);c.lineTo(12,18);c.lineTo(23,18);c.closePath();c.fillStyle=pointer.pressed?'#e2eff5':'#fff';c.fill();c.strokeStyle='#141924';c.lineWidth=1.6;c.stroke();c.restore();}}
