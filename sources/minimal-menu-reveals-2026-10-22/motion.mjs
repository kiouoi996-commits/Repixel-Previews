// Four authored reveals share one unchanged open-state composition.
export const CONFIG = {
  version: 1, width: 1080, height: 1080, fps: 30, frames: 300, duration: 10,
  reference: { width: 941, height: 1672, panel: [187,248,568,1212] },
  panel: { width: 568, height: 1212, radius: 27, previewScale: .76 },
  colors: { canvas: '#F2F3F6', surface: '#FFFFFF', ink: '#0A0A0A', text: '#454545', muted: '#777777', line: '#A0A0A0' },
  items: ['Home','About','Works','Studio','Contact'],
  baselines: [296,392,488,584,680],
  variants: {
    iris: { number:182, slug:'corner-iris-menu-reveal', title:'Corner Iris Menu Reveal', open:1200, close:900 },
    seam: { number:183, slug:'center-seam-menu-reveal', title:'Center Seam Menu Reveal', open:1100, close:850 },
    ribbons: { number:184, slug:'ribbon-cascade-menu-reveal', title:'Ribbon Cascade Menu Reveal', open:1350, close:1000 },
    curtain: { number:185, slug:'elastic-curtain-menu-reveal', title:'Elastic Curtain Menu Reveal', open:1450, close:1100 },
  },
  cues: [{time:.65,open:true},{time:4.2,open:false},{time:5.8,open:true},{time:8.5,open:false}],
};
export const clamp = n => Math.max(0,Math.min(1,n));
export const outCubic = n => 1-(1-clamp(n))**3;
const f = n => Number(n.toFixed(4));
const xml = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function fixture(kind,time){
  const v=CONFIG.variants[kind];
  const t=((time%CONFIG.duration)+CONFIG.duration)%CONFIG.duration;
  let open=false;
  for(const cue of CONFIG.cues){
    if(t<cue.time)break;
    const d=(cue.open?v.open:v.close)/1000;
    if(t<cue.time+d){const k=(t-cue.time)/d;return cue.open?k:1-k;}
    open=cue.open;
  }
  return open?1:0;
}
export function layout(w=568,h=1212){
  const sx=w/568,sy=h/1212,scale=Math.min(sx,sy);
  return {w,h,sx,sy,scale,r:27*scale,center:w/2,
    close:{x:w-74*sx,y:74*sy},
    rows:CONFIG.baselines.map(y=>y*sy),font:Math.max(25,42*scale),
    search:{x:114*sx,y:780*sy,w:340*sx,h:66*sy},
    footer:[936*sy,966*sy,1006*sy,1128*sy]};
}
export function revealShape(kind,p,w=568,h=1212){
  p=clamp(p);
  if(p<=0)return '<rect width="0" height="0"/>';
  if(p>=1)return `<rect width="${w}" height="${h}"/>`;
  const e=outCubic(p);
  if(kind==='iris'){
    const cx=w*(494/568),cy=h*(74/1212);
    const radius=Math.max(Math.hypot(cx,cy),Math.hypot(w-cx,cy),Math.hypot(cx,h-cy),Math.hypot(w-cx,h-cy))+2;
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(radius*e)}"/>`;
  }
  if(kind==='seam'){
    const half=w/2*e;
    return `<rect x="${f(w/2-half)}" width="${f(half+.05)}" height="${h}"/><rect x="${w/2}" width="${f(half+.05)}" height="${h}"/>`;
  }
  if(kind==='ribbons'){
    const count=8,delay=.055,duration=1-(count-1)*delay;
    return Array.from({length:count},(_,i)=>{
      const q=outCubic((p-i*delay)/duration),width=w*q;
      return `<rect x="${f(i%2?w-width:0)}" y="${f(i*h/count)}" width="${f(width)}" height="${f(h/count+.5)}"/>`;
    }).join('');
  }
  if(kind==='curtain'){
    const edge=e*h,amplitude=.14*h*Math.sin(Math.PI*p)*(1-p),twist=.07*h*Math.sin(3*Math.PI*p)*(1-p)*Math.sin(Math.PI*p);
    return `<path d="M0 0H${w}V${f(edge-twist)}C${f(w*.74)} ${f(edge+amplitude)} ${f(w*.26)} ${f(edge+amplitude)} 0 ${f(edge+twist)}Z"/>`;
  }
  throw new Error('Unknown reveal: '+kind);
}
function lettering(atlas,value,x,y,size,color,weight='light',spacing=0,anchor='middle',opacity=1){
  const face=atlas[weight],scale=size/face.units;
  const chars=[...value];
  const width=chars.reduce((n,c)=>n+(face.glyphs[c]?.advance||0)*scale,0)+Math.max(0,chars.length-1)*spacing;
  let cursor=anchor==='middle'?-width/2:anchor==='end'?-width:0;
  let paths='';
  for(const c of chars){const g=face.glyphs[c];if(!g)continue;paths+=`<path d="${g.d}" transform="translate(${f(cursor)} 0) scale(${f(scale)} ${f(-scale)})"/>`;cursor+=g.advance*scale+spacing;}
  return `<g fill="${color}" opacity="${f(opacity)}" transform="translate(${f(x)} ${f(y)})" aria-label="${xml(value)}">${paths}</g>`;
}
export function renderPanel(kind,p,atlas,{width=568,height=1212,selected='About',query='',includeTrigger=true,shadow=true}={}){
  const L=layout(width,height),c=CONFIG.colors,{w,h,sx,sy,scale}=L;
  p=clamp(p);
  const tx=(...a)=>lettering(atlas,...a);
  const mask=revealShape(kind,p,w,h);
  let content=`<rect width="${w}" height="${h}" fill="${c.surface}"/>`;
  for(const [i,item]of CONFIG.items.entries()){
    if(query&&!item.toLowerCase().includes(query.toLowerCase()))continue;
    let dy=0,alpha=1;
    if(kind==='iris'){
      const row=outCubic((p-.16-i*.055)/.48);dy=24*scale*(1-row);alpha=row;
    }else if(kind==='seam'){
      const row=outCubic((p-.16-i*.035)/.55);dy=0;alpha=row;
    }
    content+=tx(item,L.center,L.rows[i]+dy,L.font,item===selected?c.ink:i===0?c.muted:c.text,item===selected?'bold':'light',0,'middle',alpha);
  }
  const searchY=844*sy;
  content+=`<path d="M${114*sx} ${searchY}H${454*sx}" stroke="${c.line}" stroke-width="${1.4*scale}"/>`;
  content+=`<g fill="none" stroke="${c.ink}" stroke-width="${2.1*scale}" stroke-linecap="round"><circle cx="${432*sx}" cy="${804*sy}" r="${10.5*scale}"/><path d="M${439.5*sx} ${811.5*sy}L${446*sx} ${818*sy}"/></g>`;
  content+=tx('Thoughtful design for',L.center,L.footer[0],22*scale,c.text,'light',1.45*scale);
  content+=tx('modern brands',L.center,L.footer[1],22*scale,c.text,'light',1.45*scale);
  content+=`<path d="M${L.center-15*scale} ${L.footer[2]}H${L.center+15*scale}" stroke="${c.text}" stroke-width="${scale}"/>`;
  content+=tx('EN',L.center,L.footer[3],18*scale,c.ink,'bold',1.4*scale);
  const defs=`<defs><clipPath id="frame"><rect width="${w}" height="${h}" rx="${L.r}"/></clipPath><clipPath id="reveal">${mask}</clipPath><filter id="shadow" x="-50%" y="-25%" width="200%" height="160%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="${16*scale}" stdDeviation="${22*scale}" flood-color="#747B87" flood-opacity=".18"/></filter></defs>`;
  let out=defs+`<g${shadow?' filter="url(#shadow)"':''}><g clip-path="url(#frame)"><g clip-path="url(#reveal)">${content}</g></g></g>`;
  if(includeTrigger){
    const transition=outCubic(p),closeOpacity=clamp((p-.25)/.35),menuOpacity=1-clamp(p/.3);
    const iconX=L.close.x,iconY=L.close.y,half=13.5*scale;
    out+=tx('menu',w-115*sx,82*sy,22*scale,c.ink,'light',1.8*scale,'end',menuOpacity);
    out+=tx('close',w-115*sx,82*sy,22*scale,c.ink,'light',1.8*scale,'end',closeOpacity);
    const a=6*scale*(1-transition),b=half*transition;
    out+=`<g fill="none" stroke="${c.ink}" stroke-width="${2.1*scale}" stroke-linecap="round"><path d="M${iconX-half} ${iconY-a-b}L${iconX+half} ${iconY-a+b}"/><path d="M${iconX-half} ${iconY+a+b}L${iconX+half} ${iconY+a-b}"/></g>`;
  }
  return out;
}
export function renderFrame(kind,time,atlas,{progress}={}){
  const p=progress??fixture(kind,time),{width:w,height:h}=CONFIG;
  const s=CONFIG.panel.previewScale,pw=568*s,ph=1212*s,x=(w-pw)/2,y=(h-ph)/2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${CONFIG.colors.canvas}"/><g transform="translate(${x} ${y}) scale(${s})">${renderPanel(kind,p,atlas)}</g></svg>`;
}
