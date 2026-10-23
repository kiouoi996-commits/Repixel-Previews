import * as base from './base.mjs';
import {roomHero} from './assets.mjs';
export const {names,categories,products,results,cartCount,subtotal,cartItems,esc,clamp,ease,productArt,logo,icon,C}=base;
const {r,text,panel}=base;
export const specs={split:{title:'Looma Living — Split Navigation Header',initial:2,seconds:12},floating:{title:'Looma Living — Floating Header',initial:0,seconds:12},transparent:{title:'Looma Living — Transparent over Hero',initial:2,seconds:12}};
export function initial(mode){const s=base.initial('classic');return {...s,mode,active:specs[mode].initial,marker:specs[mode].initial,ghost:specs[mode].initial,handoff:1,scroll:0,press:0};}
export function reduce(s,a){return a.type==='reset'?initial(s.mode):base.reduce(s,a.type==='cta'?{type:'catalog',index:1}:a);}
export const crossGroup=(mode,a,b)=>mode==='split'&&(a<4)!==(b<4);
export function geometry(mode,mobile=false,s=initial(mode),{documentFlow=false,pinned=false}={}){
 const floating=mode==='floating',transparent=mode==='transparent',c=floating?clamp((s.scroll-132)/140):0,solid=transparent?clamp((s.scroll-180)/200):1;
 const g={w:mobile?390:1440,h:mobile?760:810,mobile,mode,compact:c,solid,navCount:transparent?5:7};
 if(mobile){g.header={x:16+4*c,y:44,w:358-8*c,h:78-6*c};g.logo={x:83,y:63,scale:.62};g.icons=transparent?{search:288,bag:337}:{search:288,account:337};g.nav=[];g.cy=83-3*c;g.logo.y-=3*c;g.cta=null;g.fontSize=16;g.pillH=44;g.pillWidths=[80,90,110,100,80,88,80];}
 else if(mode==='split'){
  g.header={x:56,y:166,w:1328,h:110};g.logo={x:498,y:197,scale:.70};g.nav=[119,194,293,399,798,874,952];g.icons={search:1015,heart:1070,account:1123};g.cy=221;g.cta={x:1162,y:194,w:194,h:54};g.fontSize=15;g.pillH=50;g.pillWidths=[78,85,111,100,80,85,78];g.dividers=[464,745];
 }else if(floating){
  g.header={x:56+56*c,y:166,w:1328-112*c,h:116-28*c};const map=x=>g.header.x+(x-56)/1328*g.header.w;
  g.logo={x:map(104),y:196,scale:.82-.06*c};g.nav=[398,484,570,661,740,818,885].map(map);g.icons={search:map(1017),heart:map(1070),account:map(1123)};g.cy=g.header.y+g.header.h/2;g.cta={x:map(1162),y:g.cy-(56-8*c)/2,w:194*g.header.w/1328,h:56-8*c};g.fontSize=15-c;g.pillH=50-6*c;g.pillWidths=[80,88,110,94,80,86,78].map(w=>w*(1-.08*c));
 }else{
  g.header={x:202,y:65,w:1036,h:110};g.logo={x:235,y:91,scale:.70};g.nav=[526,600,703,803,883];g.icons={search:966,heart:1032,account:1098,bag:1164};g.cy=120;g.cta=null;g.fontSize=14;g.pillH=50;g.pillWidths=[74,82,112,94,76];
 }
 const normalY=g.header.y,pinY=mobile?18:floating?34:24;
 if(mode!=='split'){
  const dy=(documentFlow?(pinned?pinY:normalY):Math.max(pinY,normalY-s.scroll))-normalY;
  g.header.y+=dy;g.logo.y+=dy;g.cy+=dy;if(g.cta)g.cta.y+=dy;
 }
 if(floating&&!mobile)g.logo.y=g.cy-27*(g.logo.scale/.82);
 g.rightEdge=g.header.x+g.header.w;
 g.panel={x:mobile?16:g.rightEdge-738,y:g.header.y+g.header.h+17,w:mobile?358:738,h:408};
 g.search=mobile?{x:55,y:g.panel.y+62,w:275,h:46}:{x:g.panel.x+42,y:g.panel.y+62,w:g.panel.w-84,h:54};
 return g;
}
function defs(g){return `<defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#48adf3"/><stop offset="1" stop-color="#3999e9"/></linearGradient><linearGradient id="sun" x2="0" y2="1"><stop stop-color="#ffe18a"/><stop offset="1" stop-color="#ffd05b"/></linearGradient><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#a2dffc"/><stop offset="1" stop-color="#83cdf4"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#2b6c99" flood-opacity=".13"/></filter><clipPath id="heroClip">${r(g.mobile?0:180,g.mobile?0:30,g.mobile?390:1080,g.mobile?760:750,'#fff',g.mobile?0:44)}</clipPath></defs>`;}
function productRow(y,label,mobile=false){const x=mobile?24:104,gap=mobile?0:26,w=mobile?342:394;let out=text(x,y,label,mobile?27:39,600);products.slice(0,3).forEach((p,i)=>{const px=x+(mobile?0:i)*(w+gap),py=y+52+(mobile?i*230:0);out+=r(px,py,w,mobile?210:252,'#fff',28)+productArt(p.shape,px+20,py+18,mobile?136:155)+text(px+24,py+(mobile?174:208),p.name,mobile?16:19,600)+text(px+w-24,py+(mobile?174:208),'$'+p.price,mobile?16:19,600,C.ink,'end');});return out;}
function background(s,g,{hero=roomHero,documentFlow=false}={}){let out=r(0,0,g.w,g.h,'url(#sky)');const scroll=documentFlow?0:s.scroll;out+=`<g transform="translate(0 ${-scroll})">`;
 if(s.mode==='transparent'){
  out+=`<g clip-path="url(#heroClip)"><image href="${esc(hero)}" x="${g.mobile?0:180}" y="${g.mobile?0:30}" width="${g.mobile?390:1080}" height="${g.mobile?760:750}" preserveAspectRatio="xMidYMid slice"/></g>`;
  out+=r(g.mobile?0:56,g.mobile?800:810,g.mobile?390:1328,950,'#f3f8fb',36)+productRow(g.mobile?880:902,s.active===1?'New arrivals':'A little room to unwind',g.mobile);
 }else{
  out+=`<circle cx="${g.mobile?430:1170}" cy="180" r="510" fill="#fff" opacity=".13"/><circle cx="190" cy="1070" r="560" fill="#fff" opacity=".1"/>`;
  if(s.mode==='floating')out+=productRow(g.mobile?280:376,s.active===1?'Fresh finds for your home':'Room for what matters.',g.mobile)+productRow(g.mobile?1080:880,'Thoughtfully chosen.',g.mobile);
 }
 return out+'</g>';}
function selection(g,index,alpha=1){if(!g.nav.length||!Number.isFinite(index))return '';const i=Math.max(0,Math.min(g.nav.length-1,Math.floor(index))),j=Math.min(i+1,g.nav.length-1),f=index-i,w=g.pillWidths[i]+(g.pillWidths[j]-g.pillWidths[i])*f,x=g.nav[i]+(g.nav[j]-g.nav[i])*f;return `<g opacity="${alpha}">${r(x-w/2,g.cy-g.pillH/2,w,g.pillH,'url(#blue)',20)}</g>`;}
function header(s,g,native){const h=g.header;let out='';
 if(s.mode==='floating')out+=r(h.x-8,h.y-8,h.w+16,h.h+16,'#fff',(h.h+16)/2,'opacity=".26"');
 out+=r(h.x,h.y,h.w,h.h,s.mode==='transparent'?`rgba(255,255,255,${.66+.32*g.solid})`:'#fff',s.mode==='floating'?h.h/2:g.mobile?27:40,`data-part="header-surface" ${s.mode==='transparent'?'stroke="#fff" stroke-width="1.5"':''}${g.compact>.05||s.mode==='transparent'&&g.solid>.05?' filter="url(#shadow)"':''}`);
 if(s.mode==='split'&&!g.mobile)for(const x of g.dividers)out+=r(x,h.y+26,1,h.h-52,'#d9e5ed');
 out+=logo(g.logo.x,g.logo.y,g.logo.scale);
 if(g.mobile)out+=icon('menu',47,g.cy,23);
 if(!g.mobile){if(s.handoff<.999)out+=selection(g,s.ghost,1-s.handoff);out+=selection(g,s.marker,s.handoff);names.slice(0,g.navCount).forEach((name,i)=>out+=text(g.nav[i],g.cy+5,name,g.fontSize,400,i===s.active?'#fff':C.ink,'middle'));}
 if(g.cta){const b=g.cta,cx=b.x+b.w/2,cy=b.y+b.h/2,k=1-.025*s.press;out+=`<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${r(b.x,b.y,b.w,b.h,'url(#sun)',26)}${text(cx,cy+6,'Shop New Arrivals',15,600,C.ink,'middle')}</g>`;}
 for(const[name,x]of Object.entries(g.icons)){out+=icon(name,x,g.cy,g.mobile?24:26);if(name==='bag'&&cartCount(s))out+=`<circle cx="${x+13}" cy="${g.cy-17}" r="10" fill="#ffb600"/>${text(x+13,g.cy-13,String(cartCount(s)),11,600,'#fff','middle')}`;}
 const pg={...g,native};out+=panel(s,pg);
 if(g.mobile&&g.cta===null&&s.mode!=='transparent'&&s.panel==='mobilemenu'&&s.reveal>.001){const p=base.panelGeometry(s,g);out+=`<g opacity="${s.reveal}">${r(p.x+20,p.y+385,p.w-40,52,'url(#sun)',24)}${text(p.x+p.w/2,p.y+418,'Shop New Arrivals',16,600,C.ink,'middle')}</g>`;}
 return out;
}
export function svg(s,{mobile=false,native=false,hero=roomHero,layer='all',documentFlow=false,pinned=false}={}){const g=geometry(s.mode,mobile,s,{documentFlow,pinned});let out=defs(g);if(layer!=='header')out+=background(s,g,{hero,documentFlow});if(layer!=='body')out+=header(s,g,native);if(s.cursorA>0&&layer!=='body')out+=`<g opacity="${s.cursorA}" transform="translate(${s.cursorX} ${s.cursorY})">${s.click>0?`<circle r="${12+12*(1-s.click)}" fill="none" stroke="#275778" stroke-width="2" opacity="${s.click*.35}"/>`:''}<path d="m0 0 4 24 5-8 9 1Z" fill="#183c57" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></g>`;return `<svg xmlns="http://www.w3.org/2000/svg" width="${g.w}" height="${g.h}" viewBox="0 0 ${g.w} ${g.h}" aria-hidden="true">${out}</svg>`;}
export function controls(s,g){const out=base.controls(s,g).filter(b=>[b.x,b.y,b.w,b.h].every(Number.isFinite));if(g.mobile){const menu=out.find(b=>b.key==='menu');if(menu)menu.y=g.cy-22;}if(g.cta)out.push({key:'cta',...g.cta,label:'Shop New Arrivals',action:{type:'cta'}});if(g.mobile&&s.mode!=='transparent'&&s.panel==='mobilemenu'&&s.reveal>.05){const p=base.panelGeometry(s,g);out.push({key:'cta',x:p.x+20,y:p.y+385,w:p.w-40,h:52,label:'Shop New Arrivals',action:{type:'cta'}});}return out;}
function change(s,a,b,t,at){s.active=b;if(crossGroup(s.mode,a,b)){s.marker=b;s.ghost=a;s.handoff=ease((t-at)/.26);}else{s.marker=a+(b-a)*ease((t-at)/.32);s.handoff=1;}}
function show(s,p,t,at){s.panel=p;s.reveal=ease((t-at)/.26);}
function close(s,t,at){s.reveal=1-ease((t-at)/.18);if(t>=at+.18)s.panel='';}
function scrollAt(mode,t){if(mode==='floating'){if(t<.8)return 0;if(t<2)return 300*ease((t-.8)/1.2);if(t<7.6)return 300;if(t<9.3)return 300*(1-ease((t-7.6)/1.7));return 0;}if(mode==='transparent'){if(t<3)return 0;if(t<5)return 540*ease((t-3)/2);if(t<7.4)return 540;if(t<9.7)return 540*(1-ease((t-7.4)/2.3));return 0;}return 0;}
function pointer(s,t,cues){if(t<.4||t>11.55)return;let previous={t:.4,x:cues[0][1],y:cues[0][2]};for(const[at,x,y]of cues){if(t<at){const f=ease((t-previous.t)/Math.max(.1,at-previous.t));s.cursorX=previous.x+(x-previous.x)*f;s.cursorY=previous.y+(y-previous.y)*f;break;}previous={t:at,x,y};s.cursorX=x;s.cursorY=y;}s.cursorA=Math.min(ease((t-.4)/.2),1-ease((t-11.35)/.2));for(const[at]of cues)if(t>=at&&t<at+.24)s.click=1-(t-at)/.24;}
export function demo(mode,t){const s=initial(mode);s.scroll=scrollAt(mode,t);if(mode==='split'){
 if(t>=.9)change(s,2,0,t,.9);if(t>=2.3)change(s,0,4,t,2.3);if(t>=3.8){change(s,4,1,t,3.8);s.press=Math.sin(clamp((t-3.8)/.22)*Math.PI);}if(t>=5)show(s,'search',t,5);if(t>=5.5)s.query='vase'.slice(0,Math.min(4,1+Math.floor((t-5.5)/.16)));if(t>=7.2){s.selected='sunrise-vase';s.query='Sunrise Vase';show(s,'product',t,7.2);}if(t>=8.6)close(s,t,8.6);if(t>=10.2)change(s,1,2,t,10.2);
 pointer(s,t,[[.9,119,221],[2.3,798,221],[3.8,1259,221],[5,1015,221],[5.5,860,373],[7.2,930,461],[8.6,1354,339],[10.2,293,221]]);
 }else if(mode==='floating'){
 if(t>=2.8){change(s,0,1,t,2.8);s.press=Math.sin(clamp((t-2.8)/.22)*Math.PI);}if(t>=4.1)show(s,'search',t,4.1);if(t>=4.7)s.query='vase'.slice(0,Math.min(4,1+Math.floor((t-4.7)/.16)));if(t>=6.5)close(s,t,6.5);if(t>=10)change(s,1,0,t,10);
 const g=geometry(mode,false,{...s,scroll:300}),cx=g.cta.x+g.cta.w/2;pointer(s,t,[[.8,720,510],[2.8,cx,g.cy],[4.1,g.icons.search,g.cy],[4.7,g.search.x+140,g.search.y+25],[6.5,g.rightEdge-30,g.panel.y+30],[7.6,720,510],[10,398,224]]);
 }else{
 if(t>=.7)change(s,2,3,t,.7);if(t>=1.9)change(s,3,4,t,1.9);if(t>=5.8)show(s,'wishlist',t,5.8);if(t>=6.9)close(s,t,6.9);if(t>=10.3)change(s,4,2,t,10.3);
 const g=geometry(mode,false,{...s,scroll:540});pointer(s,t,[[.7,803,120],[1.9,883,120],[3,730,550],[5.8,1032,g.cy],[6.9,g.rightEdge-30,g.panel.y+30],[7.4,730,550],[10.3,703,120]]);
 }return s;}
