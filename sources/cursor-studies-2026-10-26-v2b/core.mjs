export const specs = [
  {number:186,slug:'elastic-magnetic-cursor',title:'ELASTIC — Magnetic Cursor',short:'Magnetic cursor',width:1440,height:810,bg:'#eef3f7',ink:'#10111b',accent:'#ffeb56',mechanism:'velocity-stretched-follower-with-target-morph'},
  {number:187,slug:'silk-ribbon-cursor',title:'SILK — Triangle Trail',short:'Triangle trail',width:1080,height:810,bg:'#111219',ink:'#eeece6',accent:'#ffffff',mechanism:'distance-sampled-white-triangle-echoes'},
  {number:188,slug:'field-image-trail',title:'FIELD — Image Trail',short:'Image trail',width:1080,height:810,bg:'#000000',ink:'#eeece6',accent:'#ffffff',mechanism:'distance-triggered-photo-stamps-with-bounded-lifetime'},
  {number:189,slug:'lens-reveal-cursor',title:'LENS — Reveal Cursor',short:'Reveal cursor',width:1080,height:810,bg:'#1b1d1c',ink:'#f3eade',accent:'#ffe66b',mechanism:'pointer-driven-circular-image-and-type-mask'},
];
export const targets = [
  {x:261,y:574,w:227,h:74,label:'EXPLORE',href:'#explore'},
  {x:526,y:574,w:229,h:74,label:'OUR WORK',href:'#work'},
];
export const clamp = (n,a,b)=>Math.min(b,Math.max(a,n));
const smooth=(dt,tau)=>1-Math.exp(-Math.min(dt,.05)/tau);
export function createState(number=186){
  const [x,y]=number===186?[898,532]:number===189?[875,434]:[825,365];
  return {number,x,y,w:46,h:46,a:0,angle:0,stretch:0,target:-1,trails:[],echoes:[],last:null,serial:0,time:0,seen:false};
}
export function update(s,input,dt){
  dt=clamp(dt,0,.05);s.time+=dt;
  if(input.active)s.seen=true;
  const distanceToFollower=Math.hypot(input.x-s.x,input.y-s.y);
  s.target=input.active&&s.number===186?targets.findIndex(r=>input.x>=r.x-8&&input.x<=r.x+r.w+8&&input.y>=r.y-8&&input.y<=r.y+r.h+8):-1;
  const r=s.target<0?null:targets[s.target];
  const tx=r?r.x+r.w/2:input.x,ty=r?r.y+r.h/2:input.y;
  const f=smooth(dt,.075),shape=smooth(dt,.11);
  s.angle=Math.atan2(input.y-s.y,input.x-s.x)*180/Math.PI;
  s.stretch+=(clamp(distanceToFollower/160,0,.38)-s.stretch)*shape;
  s.x+=(tx-s.x)*f;s.y+=(ty-s.y)*f;
  s.w+=((r?r.w+16:input.pressed?32:46)-s.w)*shape;
  s.h+=((r?r.h+16:input.pressed?32:46)-s.h)*shape;
  s.a+=((input.active?1:0)-s.a)*smooth(dt,.12);
  // Emit by travelled distance. Neither trail emits on an idle pointer.
  if(input.active&&(s.number===187||s.number===188)){
    if(!s.last)s.last={x:input.x,y:input.y};
    const dx=input.x-s.last.x,dy=input.y-s.last.y,distance=Math.hypot(dx,dy),spacing=s.number===187?14:78;
    const count=Math.min(Math.floor(distance/spacing),s.number===187?24:6);
    for(let i=1;i<=count;i++){
      const u=i*spacing/distance,x=s.last.x+dx*u,y=s.last.y+dy*u;
      if(s.number===187)s.echoes.push({x,y,born:s.time});
      else {s.trails.push({x,y,born:s.time,index:s.serial%3,angle:[-11,7,-5,10,-7,4][s.serial%6]});s.serial++;}
    }
    if(count){const u=count*spacing/distance;s.last={x:s.last.x+dx*u,y:s.last.y+dy*u};}
  }else s.last=null;
  s.echoes=s.echoes.filter(p=>s.time-p.born<.55).slice(-22);
  s.trails=s.trails.filter(p=>s.time-p.born<1.25).slice(-6);
  return s;
}
// Authored gestures have pauses, short corrections, unequal durations and curved
// aimed transfers. Minimum-jerk timing models hand acceleration and braking.
const gestures={
  186:[[0,898,532],[.3,898,532],[.95,689,380],[1.15,696,386],[1.75,378,611],[1.9,381,610],[2.4,381,610],[2.82,647,613],[3,640,610],[3.65,640,610],[4.15,1083,415],[4.4,1067,442],[4.85,1067,442],[5.45,846,497],[5.85,898,532],[8,898,532]],
  187:[[0,825,365],[.25,825,365],[.78,660,310],[1.12,565,440],[1.38,621,523],[1.72,776,505],[2.18,844,382],[2.65,844,382],[3.16,480,264],[3.6,261,351],[3.86,336,508],[4.2,560,550],[4.65,745,449],[5.25,784,351],[5.65,825,365],[8,825,365]],
  188:[[0,812,426],[.2,812,426],[.8,536,257],[1.2,299,357],[1.53,407,553],[1.92,647,483],[2.55,808,342],[2.85,808,342],[3.42,660,248],[3.8,396,307],[4.15,262,472],[4.5,492,547],[5,753,550],[5.6,812,426],[8,812,426]],
  189:[[0,875,434],[.25,875,434],[.82,667,368],[1.08,677,373],[1.5,677,373],[2.08,365,301],[2.28,371,306],[2.8,371,306],[3.45,531,471],[3.65,525,467],[4.2,525,467],[4.9,877,397],[5.12,869,432],[5.6,875,434],[8,875,434]],
};
export function demoPointer(t,number){
  const phase=((t%8)+8)%8,keys=gestures[number];
  let k=0;while(k<keys.length-2&&phase>keys[k+1][0])k++;
  const a=keys[k],b=keys[k+1],u=clamp((phase-a[0])/(b[0]-a[0]),0,1),v=u*u*u*(10+u*(-15+6*u));
  const dx=b[1]-a[1],dy=b[2]-a[2],distance=Math.hypot(dx,dy),len=distance||1;
  const bow=Math.sin(v*Math.PI)*Math.min(distance*.11,32)*(k%2?1:-1);
  const micro=Math.sin(u*Math.PI)*Math.sin(u*11.7+k)*Math.min(distance/140,1)*1.3;
  return {x:a[1]+dx*v-dy/len*bow+micro,y:a[2]+dy*v+dx/len*bow+micro*.48,active:true,pressed:number===186?phase>2.05&&phase<2.18:number===189?phase>2.4&&phase<2.68:false};
}
export function lettering(fonts,value,x,y,size,{font='sans',fill='#252823',spacing=0,anchor='start',opacity=1,width}={}){
  const f=fonts[font],scale=size/f.units;
  const natural=[...value].reduce((n,c)=>n+(f.glyphs[c]?.advance||0)*scale+spacing,0)-spacing;
  const start=anchor==='middle'?x-natural/2:anchor==='end'?x-natural:x;
  let cursor=start;
  const text=`<g fill="${fill}" opacity="${opacity}">`+[...value].map(c=>{
    const g=f.glyphs[c];if(!g)return '';const p=`<path d="${g.d}" transform="translate(${cursor.toFixed(3)} ${y}) scale(${scale} ${-scale})"/>`;cursor+=g.advance*scale+spacing;return p;
  }).join('')+'</g>';
  return width?`<g transform="translate(${start} 0) scale(${width/natural} 1) translate(${-start} 0)">${text}</g>`:text;
}
function photo(href,x,y,w,h,id){return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath></defs><image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;}
export function scene(number,s,{fonts,photos=[],pointer=null,pauseLabel='Pause effect'}={}){
  const spec=specs.find(c=>c.number===number),t=(v,x,y,z,o={})=>lettering(fonts,v,x,y,z,o);
  let out=`<rect width="${spec.width}" height="810" fill="${spec.bg}"/>`;
  if(number===186){
    out+=`<defs><radialGradient id="ambient"><stop stop-color="#fff"/><stop offset="1" stop-color="#eef3f7"/></radialGradient><linearGradient id="panel" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".73"/><stop offset="1" stop-color="#f8fafc" stop-opacity=".86"/></linearGradient><linearGradient id="dark" x2="1" y2="1"><stop stop-color="#252625"/><stop offset="1" stop-color="#131418"/></linearGradient></defs><rect width="1440" height="810" fill="url(#ambient)"/><path d="M-50 389Q330 111 706-24M944 841Q1150 605 1490 345M1160 80 1410-30M0 835 150 725" fill="none" stroke="#fff" stroke-width="2"/><rect x="104" y="74" width="1232" height="684" rx="33" fill="url(#panel)" stroke="#fff" stroke-width="2"/>`;
    out+=`<rect x="151" y="104" width="52" height="52" rx="20" fill="#fff"/><g fill="#101322"><path d="M170 122h9a6 6 0 0 1 0 12h-9z"/><rect x="170" y="133" width="6" height="7" rx="3"/><circle cx="183" cy="137" r="3.2"/></g><path d="M226 130h23" stroke="#9298a5" stroke-width="1.3"/>`;
    out+=t('Repixel',261,136,16,{font:'regular',fill:spec.ink,spacing:-.6});
    out+=t('ELASTIC — Magnetic Cursor',720,136,16,{font:'regular',fill:spec.ink,anchor:'middle',spacing:-.5});
    out+=`<rect x="1103" y="100" width="186" height="61" rx="31" fill="#fff" opacity=".9"/><circle cx="1137" cy="130" r="19" fill="#fff17a"/><path d="M1134 124v12m6-12v12" stroke="#11121b" stroke-width="3"/>`;
    out+=t(pauseLabel,1173,136,16,{font:'regular',fill:spec.ink,spacing:-.55});
    out+=t('ELASTIC / STUDIO',261,236,13,{font:'regular',fill:'#959ba8',spacing:2.7});
    out+=t('01 — POINTER STUDY',1179,237,12,{font:'regular',fill:'#959ba8',anchor:'end',spacing:.6});
    out+=t('A LITTLE',260,382,132,{font:'black',fill:'#080909',spacing:-5,width:560});
    out+=t('PULL',260,511,148,{font:'black',fill:'#10111b',spacing:-6,width:360});
    out+=`<circle cx="640" cy="500" r="13" fill="#ffec59"/><circle cx="1062" cy="443" r="106" fill="#fff079" opacity=".28"/><circle cx="1062" cy="443" r="62" fill="#fff" fill-opacity=".65" stroke="#ffea68" stroke-width="1.1"/><path d="M1030 443h64m-32-32v64" stroke="#171a2a" stroke-width="1.5"/>`;
    targets.forEach((r,i)=>{
      out+=`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="37" fill="${i?'#ffffff':'url(#dark)'}" fill-opacity="${i?.7:1}" stroke="${i?'#dce0e6':'#252625'}" stroke-width="1.4"/>`;
      out+=t(r.label,r.x+31,r.y+43,16,{fill:i?spec.ink:'#fff',spacing:.3});
      out+=`<circle cx="${r.x+r.w-45}" cy="${r.y+37}" r="27" fill="${i?'#f3f5f8':'#ffed62'}"/><path d="M${r.x+r.w-53} ${r.y+29}h15v15m-15 0 15-15" fill="none" stroke="#171a21" stroke-width="1.8"/>`;
    });
    const morph=clamp((s.w-46)/130,0,1),rot=s.stretch<.0001?0:s.angle*(1-morph),a=s.seen?s.a:1;
    out+=`<g opacity="${a}" transform="translate(${s.x} ${s.y}) rotate(${rot}) scale(${1+s.stretch*(1-morph)} ${1-s.stretch*.36*(1-morph)})"><rect x="${-s.w/2}" y="${-s.h/2}" width="${s.w}" height="${s.h}" rx="${Math.min(s.w,s.h)/2}" fill="none" stroke="#ffe760" stroke-width="1.5"/></g><circle cx="${pointer?.x??s.x}" cy="${pointer?.y??s.y}" r="3.8" fill="${s.target===0?'#fff':'#14162b'}" opacity="${a}"/>`;
    out+=`<path d="M261 690H1179" stroke="#d9dde3" stroke-width="1"/>`;
    out+=t('MOVE / HOVER / RELEASE',261,719,11,{font:'regular',fill:'#969dab',spacing:.8});
    out+=t('REPIXEL — CURSOR COLLECTION',1179,720,11,{font:'regular',fill:'#969dab',anchor:'end',spacing:.8});
  }else{
    if(number===189)out+=`<defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#c8b893" opacity=".16"/></pattern></defs><rect width="1080" height="810" fill="url(#dots)"/><circle cx="69" cy="60" r="5" fill="#ffe35b"/>`;
    out+=t(number===187?'SILK / MOTION':number===188?'FIELD / ARCHIVE':'LENS / EXPLORATIONS',number===189?85:64,64,12,{font:'regular',fill:spec.ink,spacing:2.6});
    out+=t('0'+(number-185)+' — POINTER STUDY',1016,64,11,{font:'regular',fill:spec.ink,anchor:'end',opacity:.95,spacing:2.2});
    if(number===187){
      out+=t('MAKE',68,290,156,{fill:spec.ink,spacing:-8});out+=t('YOUR MOVE.',68,442,124,{fill:spec.ink,spacing:-7});
      out+=t('A CONTINUOUS GESTURE.',72,615,17,{fill:'#b9bac8',spacing:1});
      const triangle=(x,y,scale,opacity,head=false)=>`<path ${head?'data-cursor-head="triangle"':'data-cursor-echo="triangle"'} d="M-11-16-7 17 15 4Z" transform="translate(${x} ${y}) scale(${scale})" fill="#fff" opacity="${opacity}"/>`;
      for(const p of s.echoes){const u=1-clamp((s.time-p.born)/.55,0,1);out+=triangle(p.x,p.y,.55+.45*u,u*u*.62*s.a);}
      out+=triangle(pointer?.x??s.x,pointer?.y??s.y,1,s.seen?s.a:1,true);
    }
    if(number===188){
      for(const [index,p] of s.trails.entries()){
        const age=s.time-p.born,enter=1-Math.pow(1-clamp(age/.2,0,1),3),fade=1-clamp((age-.85)/.4,0,1),scale=.76+.24*enter;
        out+=`<g data-photo-stamp="${index}" opacity="${enter*fade*s.a}" transform="translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${scale})"><rect x="-85" y="-109" width="170" height="218" rx="5" fill="#faf8f1"/>${photo(photos[p.index],-79,-103,158,194,'stamp'+index)}${t('0'+(p.index+1),-77,104,10,{fill:'#54564b',spacing:1})}</g>`;
      }
      if(pointer)out+=`<path d="M${pointer.x-7} ${pointer.y}h14m-7-7v14" stroke="#fff" stroke-width="1.2" opacity="${s.a}"/>`;
    }
    if(number===189){
      const radius=125+clamp((46-s.w)/14,0,1)*42,a=s.seen?s.a:1;
      out+=`<defs><clipPath id="lens"><circle cx="${s.x}" cy="${s.y}" r="${radius}"/></clipPath></defs>`;
      for(let i=0;i<14;i++)out+=`<path d="M${112+i*72} 134C${-161+i*72} 308 ${620+i*72} 462 ${439+i*72} 690" fill="none" stroke="#b19b6a" stroke-opacity=".19" stroke-width=".9"/>`;
      const headline=color=>t('LOOK',74,342,190,{font:'regular',fill:color,spacing:-11,width:508})+t('CLOSER.',74,504,177,{font:'regular',fill:color,spacing:-9,width:655});
      out+=headline('#f3eade');
      out+=`<g clip-path="url(#lens)" opacity="${a}">${photo(photos[0],0,-180,2000,1500,'lens-photo')}<rect width="1080" height="810" fill="#d5842e" opacity=".17"/>${headline('#fff6e7')}</g><circle cx="${s.x}" cy="${s.y}" r="${radius}" fill="none" stroke="#ffe66b" stroke-width="1.6" opacity="${a}"/>`;
      out+=`<circle cx="${pointer?.x??758}" cy="${pointer?.y??469}" r="${pointer?4:12}" fill="#ffe66b" opacity="${a}"/>`;
      out+=t('MOVE TO DISCOVER / PRESS TO EXPAND',85,658,11,{font:'regular',fill:spec.ink,spacing:2.4});
    }
    out+=`<path d="M64 721H1016" stroke="${spec.ink}" stroke-width=".8" opacity=".25"/>`;
    out+=t(number===187?'MOVE / TRACE / FADE':number===188?'MOVE / PAUSE / DISAPPEAR':'MOVE / PRESS / REVEAL',64,756,9,{font:'regular',fill:spec.ink,opacity:.95,spacing:1.7});
    out+=t('REPIXEL — CURSOR COLLECTION',1016,756,9,{font:'regular',fill:spec.ink,anchor:'end',opacity:.95,spacing:1.7});
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${spec.width} 810" width="${spec.width}" height="810" role="img" aria-label="${spec.short}"><title>${spec.title}</title>${out}</svg>`;
}
