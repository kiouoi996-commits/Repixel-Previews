// Pure SVG scenes shared by the interactive demo and every exported video frame.
// Coordinates are canonical 1080×608 pixels. Geometry contains real font outlines.
export const studies = [
  {number:132, composition:'lighting', slug:'132-lamped-gold-light-sweep', title:'Lamped — Gold Light Sweep', mechanism:'shine', description:'Two diagonal light bands sweep through the original white and gold letter surfaces while the heading remains still.'},
  {number:133, composition:'lighting', slug:'133-lamped-orbital-glyph-assembly', title:'Lamped — Orbital Glyph Assembly', mechanism:'orbit', description:'Whole Manrope glyphs travel along short curved paths and rotate gently into the original two-line headline.'},
  {number:134, composition:'space', slug:'134-space-radial-ink-bloom', title:'Space of Quality — Radial Ink Bloom', mechanism:'bloom', description:'Circular masks grow from the lower stems of real serif glyphs, revealing the three editorial lines from their centers outward.'},
  {number:135, composition:'space', slug:'135-space-editorial-fan-in', title:'Space of Quality — Editorial Fan-In', mechanism:'fan', description:'Three complete serif lines enter from alternating sides, unwinding their rotation and shear into the original layout.'},
  {number:136, composition:'inside', slug:'136-inside-baseline-roller', title:'The Inside Look — Baseline Roller', mechanism:'roller', description:'Each mixed-font line rolls upward through its own narrow aperture and is replaced by an identical copy, including the raised trademark.'},
  {number:137, composition:'inside', slug:'137-inside-tracking-accordion', title:'The Inside Look — Tracking Accordion', mechanism:'tracking', description:'Letter spacing opens across the three fashion-editorial lines and settles with a small overshoot; the actual glyph shapes stay unchanged.'},
];

const clamp = value => Math.min(1, Math.max(0, value));
const smooth = value => { const p=clamp(value); return p*p*(3-2*p); };
const outCubic = value => 1-Math.pow(1-clamp(value),3);
const inOutCubic = value => {const p=clamp(value); return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;};
const inOutSine = value => (1-Math.cos(Math.PI*clamp(value)))/2;
const backOut = value => {const p=clamp(value)-1; return 1+2.25*p*p*p+1.25*p*p;};
const num = value => Number(value.toFixed(5));
const path = (g, extra='') => `<path d="${g.d}" fill="${g.fill}" ${extra}/>`;
const linePaths = line => line.glyphs.map(g=>path(g)).join('');
const allPaths = comp => comp.lines.map(linePaths).join('');
const ghost = (comp,t) => t<.9 ? `<g opacity="${num(1-smooth((t-.5)/.4))}">${allPaths(comp)}</g>` : '';

export function scene(number, seconds, geometry, options={}) {
  const study=studies.find(s=>s.number===Number(number));
  if(!study) throw new Error('Unknown study: '+number);
  const comp=geometry.compositions[study.composition];
  const t=Math.max(0,Math.min(6,seconds));
  let definitions='', body='';
  if(options.rest || t>=5.7) body=allPaths(comp);
  else if(study.mechanism==='shine') {
    body=allPaths(comp);
    let center, halfWidth, strength;
    if(t>=.85&&t<=3.15) {center=-140+1360*inOutCubic((t-.85)/2.3);halfWidth=105;strength=.95;}
    else if(t>=3.85&&t<=5.15) {center=1220-1360*inOutCubic((t-3.85)/1.3);halfWidth=70;strength=.68;}
    if(center!==undefined) {
      definitions=`<linearGradient id="shine" gradientUnits="userSpaceOnUse" x1="${num(center-halfWidth)}" y1="330" x2="${num(center+halfWidth)}" y2="278"><stop stop-color="#FFF5CF" stop-opacity="0"/><stop offset=".38" stop-color="#FFF5CF" stop-opacity=".16"/><stop offset=".5" stop-color="#FFF5CF" stop-opacity="${strength}"/><stop offset=".61" stop-color="#FFF5CF" stop-opacity=".12"/><stop offset="1" stop-color="#FFF5CF" stop-opacity="0"/></linearGradient>`;
      body+=comp.lines.flatMap(l=>l.glyphs).map(g=>`<path d="${g.d}" fill="url(#shine)"/>`).join('');
    }
  } else if(study.mechanism==='orbit') {
    body=ghost(comp,t);
    for(const line of comp.lines) for(const g of line.glyphs) {
      const p=clamp((t-1-g.index*.018-g.lineIndex*.1)/1.15);
      if(p===0) continue;
      if(p===1) {body+=path(g);continue;}
      const q=outCubic(p), r=64*Math.pow(1-q,1.3);
      const angle=g.index*.8+g.lineIndex*Math.PI/2+(1-q)*1.4;
      const dx=Math.cos(angle)*r,dy=Math.sin(angle)*r*.7;
      const rotation=21*Math.sin(angle)*(1-q),scale=.7+.3*q;
      const [x0,y0,x1,y1]=g.bounds,cx=(x0+x1)/2,cy=(y0+y1)/2;
      body+=`<g opacity="${num(smooth(p/.25))}" transform="translate(${num(cx+dx)} ${num(cy+dy)}) rotate(${num(rotation)}) scale(${num(scale)}) translate(${num(-cx)} ${num(-cy)})">${path(g)}</g>`;
    }
  } else if(study.mechanism==='bloom') {
    body=ghost(comp,t);
    for(const line of comp.lines) for(const g of line.glyphs) {
      const distance=Math.abs(g.indexInLine-(line.glyphs.length-1)/2);
      const p=clamp((t-1-g.lineIndex*.22-distance*.045)/1);
      if(p===0) continue;
      if(p===1) {body+=path(g);continue;}
      const [x0,y0,x1,y1]=g.bounds,cx=x0+.2*(x1-x0),cy=y1-.15*(y1-y0);
      const maxRadius=Math.max(...[[x0,y0],[x1,y0],[x0,y1],[x1,y1]].map(([x,y])=>Math.hypot(x-cx,y-cy)))+2;
      const id='bloom-'+g.index;
      definitions+=`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><circle cx="${num(cx)}" cy="${num(cy)}" r="${num(maxRadius*outCubic(p))}"/></clipPath>`;
      body+=`<g clip-path="url(#${id})">${path(g)}</g>`;
    }
  } else if(study.mechanism==='fan') {
    body=ghost(comp,t);
    for(const [i,line] of comp.lines.entries()) {
      const p=clamp((t-.98-i*.2)/1.2);
      if(p===0) continue;
      if(p===1) {body+=linePaths(line);continue;}
      const q=outCubic(p),f=1-q,cx=540,cy=line.baseline-.32*line.fontSize;
      const dx=[-84,112,-64][i]*f,dy=[24,18,16][i]*f,angle=[-8,7,-5][i]*f,skew=[12,-10,7][i]*f;
      body+=`<g opacity="${num(smooth(p/.25))}" transform="translate(${num(cx+dx)} ${num(cy+dy)}) rotate(${num(angle)}) skewX(${num(skew)}) translate(${num(-cx)} ${num(-cy)})">${linePaths(line)}</g>`;
    }
  } else if(study.mechanism==='roller') {
    for(const [i,line] of comp.lines.entries()) {
      const p=clamp((t-.65-i*.16)/1.25);
      if(p===0||p===1) {body+=linePaths(line);continue;}
      const [x0,y0,x1,y1]=line.bounds,top=y0-3,height=y1-y0+6,d=Math.ceil(y1-y0)+18,q=inOutSine(p),id='roll-'+i;
      definitions+=`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="50" y="${num(top)}" width="980" height="${num(height)}"/></clipPath>`;
      body+=`<g clip-path="url(#${id})"><g transform="translate(0 ${num(-d*q)})">${linePaths(line)}</g><g transform="translate(0 ${num(d*(1-q))})">${linePaths(line)}</g></g>`;
    }
  } else if(study.mechanism==='tracking') {
    for(const [i,line] of comp.lines.entries()) {
      const a=t-.65-i*.16;
      let extra=a<=0?0:a<.8?34*inOutSine(a/.8):a<2.2?34*(1-backOut((a-.8)/1.4)):0;
      if(Math.abs(extra)<1e-8) {body+=linePaths(line);continue;}
      const n=line.glyphs.filter(g=>!g.attachedToPreviousGlyph).length;
      for(const g of line.glyphs) {
        const index=g.attachedToPreviousGlyph?n-1:g.indexInLine;
        body+=`<g transform="translate(${num(extra*(index-(n-1)/2))} 0)">${path(g)}</g>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 608" width="1080" height="608" role="img" aria-label="${comp.label}"><defs>${definitions}</defs><rect width="1080" height="608" fill="${geometry.background}"/>${body}</svg>`;
}
