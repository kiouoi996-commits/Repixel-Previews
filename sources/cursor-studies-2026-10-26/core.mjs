export const specs = [
  {number:186,slug:'elastic-magnetic-cursor',title:'ELASTIC — Magnetic Cursor',short:'Magnetic cursor',bg:'#eeece6',ink:'#242622',accent:'#7d8872',mechanism:'velocity-stretched-follower-with-target-morph'},
  {number:187,slug:'silk-ribbon-cursor',title:'SILK — Ribbon Cursor',short:'Ribbon cursor',bg:'#111219',ink:'#eeece6',accent:'#c9b8f4',mechanism:'damped-point-chain-with-tapered-ribbon'},
  {number:188,slug:'field-image-trail',title:'FIELD — Image Trail',short:'Image trail',bg:'#f0ede5',ink:'#292c25',accent:'#847459',mechanism:'distance-triggered-photo-stamps-with-bounded-lifetime'},
  {number:189,slug:'lens-reveal-cursor',title:'LENS — Reveal Cursor',short:'Reveal cursor',bg:'#16231e',ink:'#dfebd8',accent:'#d9eea6',mechanism:'pointer-driven-circular-image-and-type-mask'},
];
export const targets = [
  {x:78,y:583,w:246,h:76,label:'EXPLORE',href:'#explore'},
  {x:344,y:583,w:216,h:76,label:'OUR WORK',href:'#work'},
];
export const clamp = (n,a,b)=>Math.min(b,Math.max(a,n));
const smooth=(dt,tau)=>1-Math.exp(-Math.min(dt,.05)/tau);
export function createState(number=186){return {number,x:540,y:420,w:46,h:46,a:0,angle:0,stretch:0,target:-1,points:Array.from({length:36},()=>({x:540,y:420})),trails:[],last:null,serial:0,time:0};}
export function update(s,input,dt){
  s.time+=dt;
  const speed=Math.hypot(input.x-s.x,input.y-s.y);
  s.target=input.active&&s.number===186?targets.findIndex(r=>input.x>=r.x-8&&input.x<=r.x+r.w+8&&input.y>=r.y-8&&input.y<=r.y+r.h+8):-1;
  const r=s.target<0?null:targets[s.target];
  const tx=r?r.x+r.w/2:input.x,ty=r?r.y+r.h/2:input.y;
  const f=smooth(dt,.075),shape=smooth(dt,.11);
  s.angle=Math.atan2(input.y-s.y,input.x-s.x)*180/Math.PI;
  s.stretch+=(clamp(speed/160,0,.38)-s.stretch)*shape;
  s.x+=(tx-s.x)*f;s.y+=(ty-s.y)*f;
  s.w+=((r?r.w+16:input.pressed?32:46)-s.w)*shape;
  s.h+=((r?r.h+16:input.pressed?32:46)-s.h)*shape;
  s.a+=((input.active?1:0)-s.a)*smooth(dt,.12);
  for(let i=0;i<s.points.length;i++){
    const p=s.points[i],q=i?s.points[i-1]:input;
    const k=smooth(dt,i?.055:.035);p.x+=(q.x-p.x)*k;p.y+=(q.y-p.y)*k;
  }
  if(input.active){
    if(!s.last)s.last={x:input.x,y:input.y};
    const distance=Math.hypot(input.x-s.last.x,input.y-s.last.y);
    if(distance>=78){
      s.trails.push({x:input.x,y:input.y,born:s.time,index:s.serial%3,angle:[-11,7,-5,10,-7,4][s.serial%6]});
      s.serial++;s.last={x:input.x,y:input.y};
    }
  }else s.last=null;
  s.trails=s.trails.filter(t=>s.time-t.born<1.25).slice(-6);
  return s;
}
export function demoPointer(t,number){
  const phase=((t%8)+8)%8;
  if(number===186){
    const keys=[[0,760,440],[1,412,300],[2,192,612],[3.4,205,621],[4.2,451,618],[5.6,469,626],[6.7,788,357],[8,760,440]];
    let k=0;while(k<keys.length-2&&phase>keys[k+1][0])k++;
    const a=keys[k],b=keys[k+1],u=(phase-a[0])/(b[0]-a[0]),v=u*u*(3-2*u);
    return {x:a[1]+(b[1]-a[1])*v,y:a[2]+(b[2]-a[2])*v,active:true,pressed:(phase>2.65&&phase<2.85)||(phase>4.8&&phase<5)};
  }
  const p=phase/8*Math.PI*2;
  return {x:540+310*Math.sin(p),y:425+165*Math.sin(p*2+.4),active:true,pressed:phase>3.3&&phase<4.1};
}
export function lettering(fonts,value,x,y,size,{font='sans',fill='#252823',spacing=0,anchor='start',stroke='',opacity=1}={}){
  const f=fonts[font],scale=size/f.units;
  const width=[...value].reduce((n,c)=>n+(f.glyphs[c]?.advance||0)*scale+spacing,0)-spacing;
  let cursor=anchor==='middle'?x-width/2:anchor==='end'?x-width:x;
  return `<g fill="${fill}" opacity="${opacity}"${stroke?` stroke="${stroke}" stroke-width="1.4"`:''}>`+[...value].map(c=>{
    const g=f.glyphs[c];if(!g)return '';const p=`<path d="${g.d}" transform="translate(${cursor.toFixed(3)} ${y}) scale(${scale} ${-scale})"/>`;cursor+=g.advance*scale+spacing;return p;
  }).join('')+'</g>';
}
function photo(href,x,y,w,h,id){return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath></defs><image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;}
export function scene(number,s,{fonts,photos=[],pointer=null}={}){
  const spec=specs.find(c=>c.number===number),t=(v,x,y,z,o={})=>lettering(fonts,v,x,y,z,o);
  let out=`<rect width="1080" height="810" fill="${spec.bg}"/>`;
  out+=t(number===186?'ELASTIC / STUDIO':number===187?'SILK / MOTION':number===188?'FIELD / ARCHIVE':'LENS / EXPLORATIONS',72,68,15,{fill:spec.ink,spacing:1.2});
  out+=t('0'+(number-185)+' — POINTER STUDY',1008,68,13,{fill:spec.ink,anchor:'end',opacity:.6,spacing:.6});
  if(number===186){
    out+=t('A LITTLE',70,289,146,{fill:spec.ink,spacing:-8});
    out+=t('PULL.',70,450,180,{fill:spec.ink,spacing:-10});
    out+=`<circle cx="891" cy="357" r="93" fill="#d4d7cc"/><circle cx="891" cy="357" r="50" fill="none" stroke="#a4ae96" stroke-width="1.5"/><path d="M857 357h68m-34-34v68" stroke="#69745f" stroke-width="2"/>`;
    targets.forEach((r,i)=>{out+=`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="38" fill="${i?'none':'#252823'}" stroke="#252823" stroke-width="1.5"/>`;out+=t(r.label,r.x+28,r.y+44,16,{fill:i?spec.ink:'#f4f1e9',spacing:.6});out+=`<path d="M${r.x+r.w-51} ${r.y+29}h18v18m-18 0 18-18" fill="none" stroke="${i?spec.ink:'#f4f1e9'}" stroke-width="1.5"/>`;});
    const morph=clamp((s.w-46)/130,0,1),rot=s.angle*(1-morph);
    out+=`<g opacity="${s.a}" transform="translate(${s.x} ${s.y}) rotate(${rot}) scale(${1+s.stretch*(1-morph)} ${1-s.stretch*.36*(1-morph)})"><rect x="${-s.w/2}" y="${-s.h/2}" width="${s.w}" height="${s.h}" rx="${Math.min(s.w,s.h)/2}" fill="none" stroke="#929d7b" stroke-width="2"/></g>`;
    if(pointer)out+=`<circle cx="${pointer.x}" cy="${pointer.y}" r="3.5" fill="${s.target===0?'#f4f1e9':'#283022'}"/>`;
  }
  if(number===187){
    out+=t('MAKE',68,290,156,{fill:spec.ink,spacing:-8});out+=t('YOUR MOVE.',68,442,124,{fill:spec.ink,spacing:-7});
    out+=`<circle cx="907" cy="607" r="34" fill="#d79f78"/><path d="M897 607h20m-10-10 10 10-10 10" stroke="#1b1b20" stroke-width="1.5" fill="none"/>`;
    const left=[],right=[];
    s.points.forEach((p,i)=>{const before=s.points[Math.max(0,i-1)],after=s.points[Math.min(s.points.length-1,i+1)],dx=after.x-before.x,dy=after.y-before.y,length=Math.hypot(dx,dy)||1,width=22*(1-i/(s.points.length-1));
      left.push({x:p.x-dy/length*width,y:p.y+dx/length*width});right.push({x:p.x+dy/length*width,y:p.y-dx/length*width});});
    const edge=(points)=>points.slice(1).map((p,i)=>`Q${points[i].x} ${points[i].y} ${(p.x+points[i].x)/2} ${(p.y+points[i].y)/2}`).join(' ')+`L${points.at(-1).x} ${points.at(-1).y}`;
    const head=s.points[0],tail=s.points.at(-1),back=right.reverse();
    out+=`<defs><linearGradient id="ribbon-gradient" gradientUnits="userSpaceOnUse" x1="${head.x}" y1="${head.y}" x2="${tail.x}" y2="${tail.y}"><stop stop-color="#d4d89b"/><stop offset=".25" stop-color="#d0bcfa"/><stop offset=".65" stop-color="#ae95dd"/><stop offset="1" stop-color="#7766a0"/></linearGradient></defs><g opacity="${s.a}" fill="url(#ribbon-gradient)"><path d="M${left[0].x} ${left[0].y}${edge(left)} L${back[0].x} ${back[0].y}${edge(back)}Z"/><circle cx="${head.x}" cy="${head.y}" r="22"/></g>`;
    out+=t('A CONTINUOUS GESTURE.',72,615,17,{fill:'#b9bac8',spacing:1});
    if(pointer)out+=`<circle cx="${pointer.x}" cy="${pointer.y}" r="3" fill="#fff"/>`;
  }
  if(number===188){
    out+=t('Outside',68,334,208,{font:'serif',fill:spec.ink,spacing:-5});out+=t('the lines.',68,490,208,{font:'serif',fill:spec.ink,spacing:-5});
    out+=t('WANDER. LEAVE A TRACE.',75,610,15,{fill:'#6b7061',spacing:1.3});
    for(const [index,p] of s.trails.entries()){
      const age=s.time-p.born,enter=1-Math.pow(1-clamp(age/.2,0,1),3),fade=1-clamp((age-.85)/.4,0,1),scale=.76+.24*enter;
      out+=`<g opacity="${enter*fade*s.a}" transform="translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${scale})"><rect x="-85" y="-109" width="170" height="218" rx="5" fill="#faf8f1"/>${photo(photos[p.index],-79,-103,158,194,'stamp'+index)}${t('0'+(p.index+1),-77,104,10,{fill:'#54564b',spacing:1})}</g>`;
    }
    if(pointer)out+=`<path d="M${pointer.x-7} ${pointer.y}h14m-7-7v14" stroke="#333a2a" stroke-width="1.2" opacity="${s.a}"/>`;
  }
  if(number===189){
    const radius=106+clamp((46-s.w)/14,0,1)*42;
    out+=`<defs><clipPath id="lens"><circle cx="${s.x}" cy="${s.y}" r="${radius}"/></clipPath></defs>`;
    for(let i=0;i<14;i++)out+=`<path d="M${100+i*61} 157C${-140+i*61} 310 ${530+i*61} 470 ${300+i*61} 680" fill="none" stroke="#33483a" stroke-width="1"/>`;
    out+=t('LOOK',66,337,198,{fill:'#879b82',spacing:-12});out+=t('CLOSER.',66,526,180,{fill:'#879b82',spacing:-12});
    out+=`<g clip-path="url(#lens)" opacity="${s.a}">${photo(photos[0],0,120,1080,580,'lens-photo')}<rect y="120" width="1080" height="580" fill="#22301b" opacity=".28"/>${t('LOOK',66,337,198,{fill:'#eff4de',spacing:-12})}${t('CLOSER.',66,526,180,{fill:'#eff4de',spacing:-12})}</g><circle cx="${s.x}" cy="${s.y}" r="${radius}" fill="none" stroke="#d3e5af" stroke-width="1.5" opacity="${s.a}"/>`;
    out+=t('MOVE TO DISCOVER / PRESS TO EXPAND',72,672,13,{fill:'#c1ceb3',spacing:1});
    if(pointer)out+=`<circle cx="${pointer.x}" cy="${pointer.y}" r="3" fill="#eff4de" opacity="${s.a}"/>`;
  }
  out+=`<path d="M72 731H1008" stroke="${spec.ink}" stroke-width="1" opacity=".2"/>`;
  out+=t(number===186?'MOVE / HOVER / RELEASE':number===187?'MOVE / FLOW / FADE':number===188?'MOVE / PAUSE / DISAPPEAR':'MOVE / PRESS / REVEAL',72,765,12,{fill:spec.ink,opacity:.6,spacing:.8});
  out+=t('REPIXEL — CURSOR COLLECTION',1008,765,11,{fill:spec.ink,anchor:'end',opacity:.6,spacing:.8});
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1080 810" width="1080" height="810" role="img" aria-label="${spec.short}"><title>${spec.title}</title>${out}</svg>`;
}
