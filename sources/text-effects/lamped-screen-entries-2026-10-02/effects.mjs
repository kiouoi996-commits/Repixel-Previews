// Exact glyph geometry; one deterministic scene shared by the demo and export.
export const studies = [
  {number:142,composition:'lighting',slug:'142-lamped-opposing-edge-sweep',title:'Lamped — Opposing Edge Sweep',mechanism:'sides',description:'Two intact lines enter from beyond opposite screen edges, glide past their final position and settle with a restrained editorial overshoot.'},
  {number:143,composition:'space',slug:'143-space-bottom-edge-cascade',title:'Space of Quality — Bottom Edge Cascade',mechanism:'bottom',description:'Individual serif letters rise from below the screen in a staggered cascade, gently overshooting before the three lines become perfectly aligned.'},
  {number:144,composition:'inside',slug:'144-inside-top-corner-flight',title:'The Inside Look — Top Corner Flight',mechanism:'corner',description:'The complete mixed-font heading flies in from beyond the top-right corner along a curved path, smoothly unwinding its tilt into the original composition.'},
];
export const clamp=v=>Math.min(1,Math.max(0,v));
export const smooth=v=>{const p=clamp(v);return p*p*(3-2*p);};
export const outCubic=v=>1-(1-clamp(v))**3;
export const back=v=>{const z=clamp(v)-1;return 1+2*z**3+z**2;};
export const rise=v=>{const z=clamp(v)-1;return 1+2.15*z**3+1.15*z**2;};
const n=v=>Number(v.toFixed(5));
const glyph=g=>`<path d="${g.d}" fill="${g.fill}"/>`;
const linePaths=line=>line.glyphs.map(glyph).join('');
const allPaths=comp=>comp.lines.map(linePaths).join('');

// Rotate a conservative ink box around an explicit scene pivot.
export function rotatedBounds(bounds,cx,cy,angle) {
  const a=angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),[x0,y0,x1,y1]=bounds;
  const corners=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([x,y])=>[cx+(x-cx)*c-(y-cy)*s,cy+(x-cx)*s+(y-cy)*c]);
  return [Math.min(...corners.map(v=>v[0])),Math.min(...corners.map(v=>v[1])),Math.max(...corners.map(v=>v[0])),Math.max(...corners.map(v=>v[1]))];
}

export function cornerPlacement(comp,p) {
  const cx=540,cy=304,angle=-12;
  const bounds=[Math.min(...comp.lines.map(l=>l.bounds[0])),Math.min(...comp.lines.map(l=>l.bounds[1])),Math.max(...comp.lines.map(l=>l.bounds[2])),Math.max(...comp.lines.map(l=>l.bounds[3]))];
  const box=rotatedBounds(bounds,cx,cy,angle);
  const startX=1080+32-box[0],startY=-32-box[3],q=outCubic(p),f=1-q;
  return {cx,cy,angle:angle*f,startX,startY,dx:f*f*startX+2*f*q*.14*startX,dy:f*f*startY+2*f*q*.55*startY};
}

export function scene(number,seconds,geometry,options={}) {
  const study=studies.find(s=>s.number===Number(number));
  if(!study)throw Error('Unknown study: '+number);
  const comp=geometry.compositions[study.composition],t=clamp(seconds/6)*6;
  let body='';
  if(options.rest||t>=5.6)body=allPaths(comp);
  else {
    // Preparation exists only to make the six-second gallery loop seamless.
    if(t<.85&&!options.entryOnly)body+=`<g opacity="${n(1-smooth((t-.45)/.4))}">${allPaths(comp)}</g>`;
    if(study.mechanism==='sides')for(const [l,line]of comp.lines.entries()) {
      const p=clamp((t-.98-.24*l)/1.55);
      if(p===0)continue;
      if(p===1){body+=linePaths(line);continue;}
      const start=l%2===0?-24-line.bounds[2]:1080+24-line.bounds[0];
      body+=`<g transform="translate(${n(start*(1-back(p)))} 0)">${linePaths(line)}</g>`;
    }
    else if(study.mechanism==='bottom')for(const [l,line]of comp.lines.entries()) {
      const count=line.glyphs.filter(g=>!g.attachedToPreviousGlyph).length;
      for(const g of line.glyphs) {
        const i=g.attachedToPreviousGlyph?count-1:g.indexInLine;
        const p=clamp((t-.98-.22*l-.065*i)/1.5);
        if(p===0)continue;
        if(p===1){body+=glyph(g);continue;}
        const start=608+32-g.bounds[1];
        body+=`<g transform="translate(0 ${n(start*(1-rise(p)))})">${glyph(g)}</g>`;
      }
    }
    else if(study.mechanism==='corner') {
      const p=clamp((t-1)/1.85);
      if(p===1)body+=allPaths(comp);
      else if(p>0){
        const v=cornerPlacement(comp,p);
        body+=`<g transform="translate(${n(v.dx)} ${n(v.dy)}) translate(${n(v.cx)} ${n(v.cy)}) rotate(${n(v.angle)}) translate(${n(-v.cx)} ${n(-v.cy)})">${allPaths(comp)}</g>`;
      }
    }
  }
  // Clip to the scene/screen, never to small text or line apertures.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="608" viewBox="0 0 1080 608" role="img" aria-label="${comp.label}"><defs><clipPath id="screen" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="1080" height="608"/></clipPath></defs><rect width="1080" height="608" fill="${geometry.background}"/><g clip-path="url(#screen)">${body}</g></svg>`;
}
