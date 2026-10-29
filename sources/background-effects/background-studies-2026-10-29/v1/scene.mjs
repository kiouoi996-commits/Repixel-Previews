/** Shared procedural artwork. No bitmap is translated or stretched to create motion. */
export const DESIGN = {width:1600, height:900};
export const studies = [
  {number:211, kind:'copper', slug:'copper-current', title:'Copper Current — Flowing Background', duration:8},
  {number:212, kind:'paper', slug:'mera-paper-relief', title:'MERA — Paper Relief', duration:10},
];
export const TAU = Math.PI*2;
export const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
export const smooth = v => {v=clamp(v);return v*v*(3-2*v);};
const mix=(a,b,t)=>a+(b-a)*t;

export function viewport(width,height,kind,anchorX) {
  const scale=Math.max(width/DESIGN.width,height/DESIGN.height);
  return {scale,x:(width-DESIGN.width*scale)*(anchorX??(kind==='paper'?.83:.66)),y:(height-DESIGN.height*scale)*.5};
}

export function makeResources(makeCanvas) {
  const grain=makeCanvas(256,256),c=grain.getContext('2d'),data=c.createImageData(256,256);
  let seed=1987241;
  for(let i=0;i<data.data.length;i+=4) {
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const value=seed>>>24;
    data.data[i]=data.data[i+1]=data.data[i+2]=value;
    data.data[i+3]=255;
  }
  c.putImageData(data,0,0);
  return {grain,geometries:new Map()};
}

function copperGeometry(resources,quality) {
  const count=quality<.8?132:210,key='copper-'+count;
  if(resources.geometries.has(key))return resources.geometries.get(key);
  const lines=[];
  for(let i=0;i<count;i++) {
    const q=-3+i/(count-1)*6;
    const points=[];
    for(let j=0;j<=240;j++) {
      const depth=j/240*48;
      const x=200+depth*58+120*Math.sin(depth*.2)+q*1500/(1+.12*depth);
      const height=(50*Math.sin(depth*.26+q*2)+70*Math.cos(depth*.47+q*1.4))/(1+depth*.035);
      const y=1200/(1+depth*.09)-depth*5+height+q*50;
      points.push({x,y,u:depth/48,q});
    }
    lines.push({q,points,opacity:.98*Math.exp(-q*q*.7),width:1.05+.2*Math.exp(-q*q*.5)});
  }
  resources.geometries.set(key,lines);return lines;
}

function drawCopper(ctx,s,resources,quality) {
  const palette=s.palette||{};
  ctx.fillStyle=palette.background||'#07131e';ctx.fillRect(-1000,-1000,3600,2900);
  const atmosphere=ctx.createRadialGradient(1110,500,40,850,350,1150);
  atmosphere.addColorStop(0,'rgba(30,42,49,.46)');atmosphere.addColorStop(1,'rgba(5,15,24,0)');
  ctx.fillStyle=atmosphere;ctx.fillRect(0,0,1600,900);
  const pointer=s.pointer||{x:0,y:0,strength:0};
  const px=pointer.x*1600,py=pointer.y*900,phase=s.phase||0;
  const highlight=palette.accent||'#f6ad67';
  for(const line of copperGeometry(resources,quality)) {
    const gradient=ctx.createLinearGradient(0,0,1600,0);
    gradient.addColorStop(0,palette.shadow||'#1a242a');
    gradient.addColorStop(.28,palette.mid||'#a45a31');
    gradient.addColorStop(.59,highlight);
    gradient.addColorStop(.73,palette.mid||'#cf7b41');
    gradient.addColorStop(1,palette.accent||'#d88746');
    ctx.beginPath();
    for(let j=0;j<line.points.length;j++) {
      const p=line.points[j];
      let x=p.x,y=p.y;
      y+=Math.sin(phase+p.u*5.1+line.q*.7)*(4+3*Math.exp(-line.q*line.q));
      y+=Math.sin(phase*2-p.u*8.4+line.q)*2.2;
      if(pointer.strength>.0001) {
        const dx=x-px,dy=y-py,r=215;
        const field=Math.exp(-(dx*dx+dy*dy)/(r*r))*pointer.strength;
        x+=(-dy/r*26+Math.sin(phase+line.q)*5)*field;
        y+=(dx/r*42+Math.sin(p.u*14+phase)*5)*field;
      }
      if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.globalAlpha=line.opacity;ctx.lineWidth=line.width;ctx.strokeStyle=gradient;
    ctx.shadowColor='rgba(241,136,67,.22)';ctx.shadowBlur=Math.abs(line.q)<.45?1.25:0;ctx.stroke();
  }
  ctx.shadowColor='transparent';ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  // A second distant sheet keeps the top-right contour of the approved composition.
  for(let i=0;i<72;i++) {
    const q=i/71;
    ctx.beginPath();
    for(let j=0;j<=100;j++) {
      const u=j/100;
      const ridge=.29-.17*smooth((u-.5)/.52)+.09*Math.sin(u*6-1.2);
      let y=(ridge+(q-.5)*(.12+.22*Math.abs(u-.71)))*900;
      y+=3*Math.sin(phase+u*6+q*2);
      const x=u*1600,dx=x-px,dy=y-py;
      y+=pointer.strength*22*Math.exp(-(dx*dx+dy*dy)/50000)*Math.sin(u*7+phase);
      if(!j)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.lineWidth=.5;ctx.strokeStyle=palette.mid||'#b97043';
    ctx.globalAlpha=(.035+.13*Math.sin(q*Math.PI))*.78;ctx.stroke();
  }
  ctx.globalAlpha=1;
  const shade=ctx.createRadialGradient(900,550,100,650,350,1250);
  shade.addColorStop(0,'rgba(3,10,18,0)');shade.addColorStop(1,'rgba(3,10,18,.58)');
  ctx.fillStyle=shade;ctx.fillRect(0,0,1600,900);
  ctx.globalAlpha=.019;ctx.fillStyle=ctx.createPattern(resources.grain,'repeat');ctx.fillRect(0,0,1600,900);ctx.globalAlpha=1;
}

// Seven independently deformable boundaries. Adjacent bands share the same edge.
export function paperEdges(s,quality=1) {
  const result=[],n=quality<.8?74:116;
  const segments=[
    [[-100,880],[140,600],[550,720],[820,650]],
    [[820,650],[1030,600],[1010,300],[1190,200]],
    [[1190,200],[1330,140],[1510,150],[1680,20]],
  ];
  const base=[];
  for(const points of segments)for(let j=base.length?1:0;j<=Math.ceil(n/3);j++) {
    const t=j/Math.ceil(n/3),a=1-t;
    base.push({x:a*a*a*points[0][0]+3*a*a*t*points[1][0]+3*a*t*t*points[2][0]+t*t*t*points[3][0],y:a*a*a*points[0][1]+3*a*a*t*points[1][1]+3*a*t*t*points[2][1]+t*t*t*points[3][1]});
  }
  for(let k=0;k<7;k++) {
    const points=[];
    for(const p of base) {
      const x=p.x,u=x/1600;
      const offset=k*(24+84*smooth((u-.4)/.6));
      let y=p.y+offset;
      // A broad underfold at the bottom-left differs from the right-hand contour stack.
      y+=(k*k*5+k*7*Math.sin(u*5.3-.65))*Math.exp(-Math.pow((u-.12)/.42,2));
      const envelope=smooth((u+.05)/.6);
      y+=(s.ambient===false?0:1)*Math.sin((s.phase||0)+k*.43+u*2.2)*(2.8+k*.58)*envelope;
      for(const wave of s.waves||[]) {
        const ox=wave.x*1600,oy=wave.y*900;
        const dx=x-ox,dy=y-oy,dist=Math.hypot(dx,dy);
        const front=wave.age*820-k*13;
        const ring=Math.exp(-Math.pow((dist-front)/205,2));
        const decay=Math.exp(-wave.age*1.45)*smooth(wave.age/.15);
        y+=Math.sin((dist-front)/92)*ring*decay*(26+k*2.1)*(wave.strength??1);
      }
      points.push({x,y});
    }
    result.push(points);
  }
  return result;
}

function pathBand(ctx,upper,lower) {
  ctx.beginPath();ctx.moveTo(upper[0].x,upper[0].y);
  for(let j=1;j<upper.length;j++)ctx.lineTo(upper[j].x,upper[j].y);
  if(lower)for(let j=lower.length-1;j>=0;j--)ctx.lineTo(lower[j].x,lower[j].y);
  else {ctx.lineTo(1800,1200);ctx.lineTo(-200,1200);}
  ctx.closePath();
}

function drawPaper(ctx,s,resources,quality) {
  const palette=s.palette||{};
  ctx.fillStyle=palette.background||'#faf9f5';ctx.fillRect(-1000,-1000,3600,2900);
  const light=ctx.createLinearGradient(0,0,1600,900);
  light.addColorStop(0,'rgba(255,255,255,.42)');light.addColorStop(1,'rgba(209,192,148,.045)');
  ctx.fillStyle=light;ctx.fillRect(0,0,1600,900);
  const edges=paperEdges(s,quality);
  for(let k=edges.length-1;k>=0;k--) {
    // Paint back to front so the upper paper band casts a real shadow on the next band.
    pathBand(ctx,edges[k],edges[k+1]);
    ctx.shadowColor=palette.shadow||'rgba(121,79,0,.33)';
    ctx.shadowBlur=22-k*.6;ctx.shadowOffsetY=15+k*.8;ctx.shadowOffsetX=-3;
    const yellow=ctx.createLinearGradient(180,100,1280,920);
    yellow.addColorStop(0,palette.accent||'#ffe23b');
    yellow.addColorStop(.6,palette.mid||'#ffdc26');
    yellow.addColorStop(1,palette.deep||'#ffd421');
    ctx.fillStyle=yellow;ctx.fill();
    ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.shadowOffsetX=0;
    // Minute edge light catches the top fibre, without outlining the whole illustration.
    ctx.beginPath();for(let j=0;j<edges[k].length;j++){const p=edges[k][j];if(!j)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
    ctx.strokeStyle='rgba(255,250,167,.35)';ctx.lineWidth=.65;ctx.stroke();
  }
  ctx.globalAlpha=.16;ctx.globalCompositeOperation='soft-light';
  ctx.fillStyle=ctx.createPattern(resources.grain,'repeat');ctx.fillRect(0,0,1600,900);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
}

function drawCursor(ctx,pointer,kind) {
  if(!pointer?.visible)return;
  ctx.save();ctx.translate(pointer.x*1600,pointer.y*900);
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,25);ctx.lineTo(6.8,19.2);ctx.lineTo(12,30);ctx.lineTo(16,28);ctx.lineTo(11.2,17.5);ctx.lineTo(21,17);ctx.closePath();
  ctx.fillStyle=kind==='paper'?'#20252a':'#f4f4f3';ctx.strokeStyle=kind==='paper'?'rgba(255,255,255,.9)':'rgba(4,11,18,.9)';ctx.lineWidth=1.2;ctx.fill();ctx.stroke();
  ctx.restore();
}

export function drawScene(ctx,s,resources,{quality=1,showPointer=false,anchorX}={}) {
  const v=viewport(s.width,s.height,s.kind,anchorX);
  ctx.save();ctx.clearRect(0,0,s.width,s.height);ctx.translate(v.x,v.y);ctx.scale(v.scale,v.scale);
  if(s.kind==='copper')drawCopper(ctx,s,resources,quality);else drawPaper(ctx,s,resources,quality);
  if(showPointer)drawCursor(ctx,s.pointer,s.kind);
  ctx.restore();
}

function pathPointer(time,keys) {
  let a=keys[0],b=keys.at(-1);
  for(let i=0;i<keys.length-1;i++)if(time>=keys[i].t&&time<=keys[i+1].t){a=keys[i];b=keys[i+1];break;}
  const u=smooth((time-a.t)/Math.max(.001,b.t-a.t)),arc=Math.sin(u*Math.PI);
  return {x:mix(a.x,b.x,u)+arc*(b.arcX||0),y:mix(a.y,b.y,u)+arc*(b.arcY||0),strength:mix(a.s??1,b.s??1,u),visible:time>.8&&time<keys.at(-1).t-.7};
}

export function previewState(kind,time,width=1280,height=720) {
  const duration=kind==='copper'?8:10,t=clamp(time,0,duration);
  const phase=t===duration?0:t/duration*TAU;
  const keys=kind==='copper' ? [
    {t:0,x:.9,y:.74,s:0},{t:.75,x:.9,y:.74,s:0},
    {t:1.5,x:.79,y:.58,arcY:-.035},{t:2.25,x:.67,y:.6,arcY:.028},
    {t:2.65,x:.665,y:.605},{t:3.65,x:.46,y:.72,arcY:-.045},
    {t:4.1,x:.48,y:.705},{t:5.35,x:.76,y:.33,arcX:.04},
    {t:5.75,x:.755,y:.335},{t:6.6,x:.92,y:.23,s:0,arcY:.02},
    {t:8,x:.9,y:.74,s:0},
  ] : [
    {t:0,x:.93,y:.82,s:0},{t:.8,x:.93,y:.82,s:0},
    {t:1.6,x:.69,y:.72,arcY:-.025},{t:2.5,x:.69,y:.72},
    {t:3.9,x:.85,y:.39,arcX:-.035},{t:5.35,x:.85,y:.39},
    {t:6.4,x:.55,y:.82,arcX:.03},{t:7.4,x:.55,y:.82},
    {t:8.1,x:.92,y:.92,s:0,arcY:-.02},{t:10,x:.93,y:.82,s:0},
  ];
  const pointer=pathPointer(t,keys);
  const waves=[];
  if(kind==='paper')for(const w of [{t:1.85,x:.69,y:.72},{t:4.5,x:.85,y:.39},{t:6.8,x:.55,y:.82}]) {
    const age=t-w.t;if(age>=0&&age<2.7)waves.push({...w,age,strength:1});
  }
  return {kind,width,height,phase,pointer,waves,ambient:true};
}
