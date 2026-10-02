// Authored hover studies. All text uses the exact frozen outline geometry.
export const studies=[
 {number:145,menu:'ambra',mechanism:'rail',slug:'145-ambra-copper-rail-sweep',title:'AMBRA — Copper Rail Sweep',description:'A fine copper rail draws beneath the hovered link while a small ivory highlight travels along its leading edge.'},
 {number:146,menu:'ambra',mechanism:'roll',slug:'146-ambra-vertical-label-roll',title:'AMBRA — Vertical Label Roll',description:'The complete label rolls upward through a narrow aperture and is replaced by the same lettering in warm ivory.'},
 {number:147,menu:'ambra',mechanism:'corners',slug:'147-ambra-corner-frame-draw',title:'AMBRA — Corner Frame Draw',description:'Four delicate corner brackets draw around the hovered label without moving the typography or its neighbors.'},
 {number:148,menu:'haven',mechanism:'split',slug:'148-haven-split-capsule-reveal',title:'Haven — Split Capsule Reveal',description:'Two opposing halves reveal a softly lit hover capsule from left and right while the label stays perfectly still.'},
 {number:149,menu:'haven',mechanism:'wave',slug:'149-haven-ocean-wave-underline',title:'Haven — Ocean Wave Underline',description:'A teal underline travels beneath the link as a small ocean wave, then gently settles into a straight rule.'},
 {number:150,menu:'haven',mechanism:'buoy',slug:'150-haven-letter-buoy-lift',title:'Haven — Letter Buoy Lift',description:'Letters make one small, staggered buoyant lift on hover, returning to their exact baselines before the pointer leaves.'},
];
export const clamp=v=>Math.max(0,Math.min(1,v));
export const smooth=v=>{const p=clamp(v);return p*p*(3-2*p)};
export const outCubic=v=>1-(1-clamp(v))**3;
export const n=v=>Number(v.toFixed(5));
const paths=(text,color,alpha=1)=>`<g fill="${color}" opacity="${n(alpha)}">${text.glyphs.map(g=>`<path d="${g.d}"/>`).join('')}</g>`;
const ambraInk=p=>`rgb(${[161,157,150].map((v,i)=>Math.round(v+([236,231,222][i]-v)*p)).join(',')})`;
export const hoverWindows=[0,1,2,3].map(i=>({start:.65+1.3*i,end:1.75+1.3*i}));
export function hoverState(t){return hoverWindows.map(w=>{const age=t-w.start;return {age:Math.max(0,age),strength:age<0?0:t<=w.end?smooth(age/.32):1-smooth((t-w.end)/.25)}})};
const cursorPath='M0 0 L0 18 L4.9 13.8 L8.4 21.4 L11.7 19.8 L8.2 12.3 L14.8 12.1 Z';
export function pointerAt(t,menu){
 const rest=[230,390],points=[{t:0,p:rest},{t:.4,p:rest}];
 for(const [i,w]of hoverWindows.entries()){points.push({t:w.start,p:[menu.items[i].centerX,304]},{t:w.end,p:[menu.items[i].centerX,304]})}
 points.push({t:5.9,p:rest},{t:8,p:rest});
 for(let i=1;i<points.length;i++)if(t<=points[i].t){const a=points[i-1],b=points[i],q=smooth((t-a.t)/(b.t-a.t));return a.p.map((v,j)=>v+(b.p[j]-v)*q)}
 return rest;
}

export function scene(number,time,geometry,options={}){
 const study=studies.find(s=>s.number===Number(number));if(!study)throw Error('Unknown study');
 const menu=geometry.menus[study.menu],t=clamp(time/8)*8;
 const states=options.states||hoverState(t);let defs='',under='',labels='',staticBody='';
 if(study.menu==='ambra'){
  staticBody+=paths(menu.logo,'#ECE7DE')+paths(menu.language,'#A19D96')+paths(menu.separator,'#5E5A54')+paths(menu.otherLanguage,'#5E5A54');
  staticBody+='<path d="M992 298.5H1019.5M1000.75 306H1019.5" fill="none" stroke="#ECE7DE" stroke-width="1.25"/>';
  const active=menu.items[0];staticBody+=`<path d="M${n(active.originX)} 326H${n(active.originX+active.advanceWidth)}" stroke="#ECE7DE" stroke-opacity=".65" stroke-width="1.25"/>`;
 }else{
  defs+='<filter id="panel-shadow" x="-15%" y="-90%" width="130%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>';
  staticBody+='<rect x="155" y="299" width="770" height="40" rx="20" fill="#000" opacity=".6" filter="url(#panel-shadow)"/><rect x="140" y="269" width="800" height="70" rx="35" fill="#000" opacity=".45"/>';
  staticBody+='<g transform="translate(177.5 304) rotate(12) translate(-177.5 -304)"><rect x="165" y="291.5" width="25" height="25" rx="7.5" fill="#FFF" opacity=".7"/><g transform="translate(177.5 304) rotate(-12) translate(-177.5 -304)"><path d="M171.25 309L177.5 298.5L183.75 309ZM175.8 301.3L177.5 303L179.2 301.3" fill="none" stroke="#000" stroke-opacity=".9" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g></g>';
  staticBody+=paths(menu.logo,'#FFF',.9);
  const [x,y,w,h,r]=menu.loginBox;staticBody+=`<rect x="${n(x)}" y="${y}" width="${n(w)}" height="${h}" rx="${r}" fill="#FFF" opacity=".49"/>`+paths(menu.login,'#000',.7);
 }
 for(const [i,item]of menu.items.entries()){
  const {strength:p,age}=states[i],q=outCubic(p),[x,y,w,h]=item.hitBox;
  const base=study.menu==='ambra'?(i===0?'#ECE7DE':ambraInk(p)):'#FFF';
  const alpha=study.menu==='haven'?.7+.3*p:1;
  let label=paths(item,base,alpha);
  if(study.mechanism==='rail'&&p>0){
   const end=item.originX+item.advanceWidth*q,glint=12*Math.sin(Math.PI*p);
   under+=`<path d="M${n(item.originX)} 332H${n(end)}" stroke="#D5B88F" stroke-width="1.5"/><path d="M${n(Math.max(item.originX,end-glint))} 332H${n(end)}" stroke="#ECE7DE" stroke-width="1.5"/>`;
  }else if(study.mechanism==='roll'){
   defs+=`<clipPath id="roll-${i}"><rect x="${n(item.originX-2)}" y="294" width="${n(item.advanceWidth+4)}" height="23"/></clipPath>`;
   label=`<g clip-path="url(#roll-${i})"><g transform="translate(0 ${n(-24*q)})">${paths(item,base)}</g><g transform="translate(0 ${n(24*(1-q))})">${paths(item,'#F3D9B0')}</g></g>`;
  }else if(study.mechanism==='corners'&&p>0){
   const left=item.originX-9,right=item.originX+item.advanceWidth+9,top=292,bottom=322,L=8;
   under+=`<g fill="none" stroke="#D5B88F" stroke-width="1.25" stroke-dasharray="16" stroke-dashoffset="${n(16*(1-q))}">${[
    `M${n(left)} ${top+L}V${top}H${n(left+L)}`,`M${n(right-L)} ${top}H${n(right)}V${top+L}`,
    `M${n(left+L)} ${bottom}H${n(left)}V${bottom-L}`,`M${n(right)} ${bottom-L}V${bottom}H${n(right-L)}`,
   ].map(d=>`<path d="${d}"/>`).join('')}</g>`;
  }else if(study.mechanism==='split'&&p>0){
   defs+=`<clipPath id="capsule-${i}"><rect x="${n(x)}" y="${y}" width="${n(w)}" height="${h}" rx="20"/></clipPath>`;
   under+=p===1?`<rect x="${n(x)}" y="${y}" width="${n(w)}" height="${h}" rx="20" fill="#FFF" opacity=".12"/>`:`<g clip-path="url(#capsule-${i})" fill="#FFF" opacity=".12"><rect x="${n(x)}" y="${y}" width="${n(w*q)}" height="20"/><rect x="${n(x+w*(1-q))}" y="${y+20}" width="${n(w*q)}" height="20"/></g>`;
  }else if(study.mechanism==='wave'&&p>0){
   const A=3.2*p*(1-smooth((age-.38)/.85));let d='';
   for(let j=0;j<=32;j++){const u=q*j/32;const px=item.originX+item.advanceWidth*u,py=331.5+A*Math.sin(2*Math.PI*1.25*u-8*age)*Math.sin(Math.PI*u);d+=(j?'L':'M')+n(px)+' '+n(py)}
   under+=`<path d="${d}" fill="none" stroke="#9ADBD7" stroke-width="1.5" stroke-linecap="round"/>`;
  }else if(study.mechanism==='buoy'&&p>0){
   label=`<g fill="#FFF" opacity="${n(alpha)}">${item.glyphs.map((g,j)=>{const z=clamp((age-.025*j)/.52),dy=-4.5*Math.sin(Math.PI*z)*p;return `<path d="${g.d}" transform="translate(0 ${n(dy)})"/>`}).join('')}</g>`;
  }
  labels+=label;
 }
 const point=options.pointer===false?null:options.pointer||pointerAt(t,menu);
 const cursor=point?`<path d="${cursorPath}" transform="translate(${n(point[0])} ${n(point[1])})" fill="#FFF" stroke="#090B10" stroke-width="1.2" stroke-linejoin="round"/>`:'';
 const bg=options.transparent?'':`<rect width="1080" height="608" fill="${geometry.background}"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="608" viewBox="0 0 1080 608"><defs>${defs}</defs>${bg}${staticBody}${under}${labels}${cursor}</svg>`;
}
