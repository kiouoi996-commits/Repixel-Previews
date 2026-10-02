// Deterministic entry animations over the original frozen Lamped glyph outlines.
// Both the HTML demo and video export call this exact scene function.
export const studies = [
  {number:138,composition:'lighting',slug:'138-lamped-chromatic-focus-reveal',title:'Lamped — Chromatic Focus Reveal',mechanism:'focus',description:'Soft cyan and rose text echoes converge into the sharp original white and gold heading, with a short stagger between its two lines.'},
  {number:139,composition:'space',slug:'139-space-woven-slice-reveal',title:'Space of Quality — Woven Slice Reveal',mechanism:'weave',description:'Six alternating horizontal slices of each serif line slide together from opposite directions, becoming one perfectly aligned headline.'},
  {number:140,composition:'inside',slug:'140-inside-elastic-baseline-reveal',title:'The Inside Look — Elastic Baseline Reveal',mechanism:'elastic',description:'Mixed-font glyphs rise from their baselines by unfolding vertically, briefly stretching before settling into their exact original proportions.'},
  {number:141,composition:'lighting',slug:'141-lamped-editorial-block-reveal',title:'Lamped — Editorial Block Reveal',mechanism:'block',description:'Gold and ivory blocks expand across the two lines, then pull away from left to right to reveal the original lettering underneath.'},
];
export const clamp=v=>Math.min(1,Math.max(0,v));
export const smooth=v=>{const p=clamp(v);return p*p*(3-2*p);};
export const outCubic=v=>1-(1-clamp(v))**3;
export const inOutCubic=v=>{const p=clamp(v);return p<.5?4*p**3:1-(-2*p+2)**3/2;};
export const elasticOut=v=>{const p=clamp(v)-1;return 1+3.6*p**3+2.6*p**2;};
const n=v=>Number(v.toFixed(5));
const glyph=(g,fill=g.fill)=>`<path d="${g.d}" fill="${fill}"/>`;
const linePaths=(line,fill)=>line.glyphs.map(g=>glyph(g,fill)).join('');
const allPaths=comp=>comp.lines.map(l=>linePaths(l)).join('');
const ghost=(comp,t)=>t<.85?`<g opacity="${n(1-smooth((t-.45)/.4))}">${allPaths(comp)}</g>`:'';

export function scene(number,seconds,geometry,options={}) {
  const study=studies.find(s=>s.number===Number(number));
  if(!study)throw Error('Unknown study: '+number);
  const comp=geometry.compositions[study.composition],t=clamp(seconds/6)*6;
  let defs='',body='';
  if(options.rest||t>=5.6)body=allPaths(comp);
  else {
    body=ghost(comp,t);
    if(study.mechanism==='focus')for(const [l,line]of comp.lines.entries()) {
      const p=clamp((t-.98-.18*l)/1.65);
      if(p===0)continue;
      if(p===1){body+=linePaths(line);continue;}
      const q=outCubic(p),f=1-q,alpha=smooth(p/.22),dx=18*f,dy=3*f,blur=9*f;
      const id='focus-'+l;
      defs+=`<filter id="${id}" filterUnits="userSpaceOnUse" x="80" y="80" width="930" height="460" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${n(blur)}"/></filter>`;
      body+=`<g opacity="${n(alpha)}" filter="url(#${id})"><g opacity="${n(.7*f)}" transform="translate(${n(-dx)} ${n(-dy)})">${linePaths(line,'#83D7E4')}</g><g opacity="${n(.7*f)}" transform="translate(${n(dx)} ${n(dy)})">${linePaths(line,'#F29AAA')}</g><g opacity="${n(.4+.6*q)}" transform="translate(0 ${n(12*f)})">${linePaths(line)}</g></g>`;
    }
    else if(study.mechanism==='weave')for(const [l,line]of comp.lines.entries()) {
      const [x0,y0,x1,y1]=line.bounds,top=y0-2,height=y1-y0+4,strip=height/6;
      for(let j=0;j<6;j++) {
        const p=clamp((t-.96-.16*l-.055*j)/1.15);
        if(p===0)continue;
        const q=outCubic(p),dx=(j%2===0?-1:1)*120*(1-q),id=`weave-${l}-${j}`;
        defs+=`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="50" y="${n(top+j*strip)}" width="980" height="${n(strip+.035)}"/></clipPath>`;
        body+=`<g clip-path="url(#${id})"><g opacity="${n(smooth(p/.18))}" transform="translate(${n(dx)} 0)">${linePaths(line)}</g></g>`;
      }
      if(t>=.96+.16*l+.055*5+1.15){
        // Replace the completed six strips with the original, eliminating seams.
        const start=body.lastIndexOf('<g clip-path="url(#weave-'+l+'-0)');
        body=body.slice(0,start)+linePaths(line);
      }
    }
    else if(study.mechanism==='elastic')for(const [l,line]of comp.lines.entries()) {
      const count=line.glyphs.filter(g=>!g.attachedToPreviousGlyph).length;
      for(const g of line.glyphs) {
        const i=g.attachedToPreviousGlyph?count-1:g.indexInLine;
        const p=clamp((t-.98-.19*l-.048*i)/1.3);
        if(p===0)continue;
        if(p===1){body+=glyph(g);continue;}
        const scale=.035+.965*elasticOut(p),pivot=line.baseline;
        body+=`<g opacity="${n(smooth(p/.16))}" transform="translate(0 ${pivot}) scale(1 ${n(scale)}) translate(0 ${-pivot})">${glyph(g)}</g>`;
      }
    }
    else if(study.mechanism==='block')for(const [l,line]of comp.lines.entries()) {
      const a=t-.98-.2*l,[x0,y0,x1,y1]=line.bounds,left=x0-8,top=y0-6,width=x1-x0+16,height=y1-y0+12,color=l===0?'#DCB440':'#F4F2F1';
      if(a<0)continue;
      if(a<.58) {
        body+=`<rect x="${n(left)}" y="${n(top)}" width="${n(width*inOutCubic(a/.58))}" height="${n(height)}" fill="${color}"/>`;
      } else if(a<.73)body+=`<rect x="${n(left)}" y="${n(top)}" width="${n(width)}" height="${n(height)}" fill="${color}"/>`;
      else if(a<1.58) {
        const q=inOutCubic((a-.73)/.85),edge=left+width*q,id='block-'+l;
        defs+=`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="${n(left)}" y="${n(top)}" width="${n(width*q)}" height="${n(height)}"/></clipPath>`;
        body+=`<g clip-path="url(#${id})">${linePaths(line)}</g><rect x="${n(edge)}" y="${n(top)}" width="${n(width*(1-q))}" height="${n(height)}" fill="${color}"/>`;
      } else body+=linePaths(line);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="608" viewBox="0 0 1080 608" role="img" aria-label="${comp.label}"><defs>${defs}</defs><rect width="1080" height="608" fill="${geometry.background}"/>${body}</svg>`;
}
