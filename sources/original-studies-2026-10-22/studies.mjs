// Original Repixel studies. All coordinates are in the declared SVG viewBox.
export const CONFIG = {
  version: 1, width: 1080, height: 810, duration: 10, fps: 30,
  transition: 1.1, cues: [1, 4, 7],
  colors: [
    { name: 'Cobalt', hex: '#5068F5', note: 'A little electric. Entirely alive.' },
    { name: 'Persimmon', hex: '#E36A44', note: 'Warmth with a point of view.' },
    { name: 'Lichen', hex: '#B5BE8A', note: 'A quieter kind of statement.' },
  ],
  projects: [
    { title: 'Desert House', place: 'SEDONA, ARIZONA', file: 'adobe-courtyard.webp', crop: [0.5, 0.48], note: 'Architecture / 01' },
    { title: 'Golden Hour', place: 'RED ROCK COUNTRY', file: 'sunset-viewpoint.webp', crop: [0.5, 0.45], note: 'Observation / 02' },
    { title: 'Canyon Walk', place: 'OAK CREEK, ARIZONA', file: 'canyon-creek.webp', crop: [0.5, 0.52], note: 'Landscape / 03' },
  ],
};
export const clamp = x => Math.max(0, Math.min(1, x));
export const ease = x => { x = clamp(x); return x < .5 ? 4*x*x*x : 1 - ((-2*x+2)**3)/2; };
export function fixture(t) {
  t = ((t % CONFIG.duration) + CONFIG.duration) % CONFIG.duration;
  let from = 0;
  for (let n = 0; n < CONFIG.cues.length; n++) {
    const start = CONFIG.cues[n], target = (n+1)%3;
    if (t < start) return { from, to: from, progress: 0 };
    if (t < start + CONFIG.transition) return { from, to: target, progress: (t-start)/CONFIG.transition };
    from = target;
  }
  return { from, to: from, progress: 0 };
}
const xml = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const r = (x,y,w,h,fill,rx=0,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const circle = (x,y,rad,fill,extra='') => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${extra}/>`;
const line = (x1,y1,x2,y2,color,width=1) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
export function text(atlas, content, x, y, size, fill, font='sans', spacing=0, anchor='start', opacity=1) {
  const f=atlas[font], scale=size/f.units;
  const chars=[...content], width=chars.reduce((a,c)=>a+(f.glyphs[c]?.advance||f.units*.5)*scale+spacing,0)-spacing;
  let cursor=anchor==='end'?-width:anchor==='middle'?-width/2:0;
  let body='';
  for(const c of chars){const g=f.glyphs[c];if(g){body+=`<path d="${g.d}" transform="translate(${cursor} 0) scale(${scale} ${-scale})"/>`;cursor+=g.advance*scale+spacing;}}
  return `<g fill="${fill}" opacity="${opacity}" transform="translate(${x} ${y})" aria-label="${xml(content)}">${body}</g>`;
}
export function layout(kind,narrow=false) {
  if(kind==='chroma') return narrow ? {w:560,h:1020,dial:[280,442,196],selectors:[[32,802,154,68],[203,802,154,68],[374,802,154,68]],copy:[32,904,496,64]} : {w:1080,h:810,dial:[752,353,220],selectors:[[64,622,124,62],[202,622,142,62],[358,622,110,62]],copy:[64,539,284,54]};
  return narrow ? {w:560,h:1100,selectors:[[32,834,496,72],[32,916,496,72],[32,998,496,72]],paper:[64,264,432,438],sleeve:[32,622,496,172]} : {w:1080,h:810,selectors:[[64,424,316,66],[64,498,316,66],[64,572,316,66]],paper:[490,176,456,468],sleeve:[450,532,540,176]};
}
export function render(kind, state, atlas, photos={}, narrow=false, copied=false) {
  const L=layout(kind,narrow), {w,h}=L;
  const tx=(...args)=>text(atlas,...args);
  let out='';
  if(kind==='chroma'){
    const ink='#F1F0E8',muted='#92998F', border='#41473F';
    out+=r(0,0,w,h,'#181B18');
    out+=r(24,24,w-48,h-48,'none',24,`stroke="${border}"`);
    out+=tx('CHROMA',narrow?32:64,narrow?69:81,22,ink,'medium',3);
    out+=tx('COLOUR STUDY / 01',w-(narrow?32:64),narrow?68:80,narrow?10:11,muted,'sans',1.2,'end');
    if(narrow){out+=tx('Colour,',32,145,58,ink,'serif');out+=tx('in motion.',32,204,58,ink,'serif');}
    else{out+=tx('Colour,',64,220,80,ink,'serif');out+=tx('in motion.',64,298,80,ink,'serif');out+=tx('A palette with a different perspective.',66,348,14,muted);out+=tx('Choose a hue. Watch it unfold.',66,372,14,muted);}
    const [cx,cy,R]=L.dial, scale=R/220;
    out+=`<g transform="translate(${cx} ${cy}) scale(${scale})">`;
    out+=circle(0,10,220,'#0C0F0D');
    out+=circle(0,0,220,'#2C322C',`stroke="#555C51" stroke-width="1"`);
    out+=circle(0,0,211,'#171D18',`stroke="#40473D" stroke-width="1"`);
    for(let i=0;i<60;i++){
      const a=i*Math.PI/30,major=i%5===0,inner=major?193:199;
      out+=line(Math.sin(a)*inner,-Math.cos(a)*inner,Math.sin(a)*206,-Math.cos(a)*206,major?'#B5BDAB':'#67715F',major?1.7:1);
    }
    const p=state.progress, switching=state.from!==state.to;
    const closed=switching?(p<=.5?ease(p/.5):1-ease((p-.5)/.5)):0;
    const index=switching&&p>=.5?state.to:state.from, color=CONFIG.colors[index];
    const aperture=150*(1-closed), turn=-14+28*closed;
    out+=`<defs><clipPath id="iris"><circle r="180"/></clipPath></defs><g clip-path="url(#iris)">`;
    out+=circle(0,0,180,color.hex);
    const dialInk=index===0?'#FFFFFF':'#263021';
    out+=tx(color.hex,0,9,29,dialInk,'medium',.7,'middle');
    out+=tx('PURE PIGMENT',0,34,9,dialInk,'sans',2,'middle',.85);
    out+=`<g transform="rotate(${turn})">`;
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3, b=a+Math.PI/3;
      const pt=(rad,t)=>[rad*Math.cos(t),rad*Math.sin(t)].join(' ');
      const d=`M${pt(aperture,a)}L${pt(330,a+.38)}A330 330 0 0 1 ${pt(330,b+.38)}L${pt(aperture,b)}Q${pt(aperture*.94,(a+b)/2)} ${pt(aperture,a)}Z`;
      out+=`<path d="${d}" fill="${i%2?'#30392F':'#374032'}" stroke="#5E6A54" stroke-width="1"/>`;
    }
    out+='</g></g>';
    out+=circle(0,0,181,'none','stroke="#080D08" stroke-width="3"');
    out+=`<path d="M0 -228l-5 -9h10Z" fill="${ink}"/>`;
    out+='</g>';
    const textOpacity=switching?Math.abs(2*p-1):1;
    const infoY=narrow?702:465;
    out+=tx(`0${index+1} / 03`,narrow?32:66,infoY-41,11,muted,'sans',1.3);
    out+=tx(color.name,narrow?32:64,infoY,narrow?48:45,ink,'serif',0,'start',textOpacity);
    out+=tx(color.note,narrow?32:66,infoY+31,narrow?22:13,muted,'sans',0,'start',textOpacity);
    const [bx,by,bw,bh]=L.copy;
    out+=r(bx,by,bw,bh,'#F1F0E8',bh/2);
    out+=tx(copied?'Copied!':`Copy ${color.hex}`,bx+24,by+bh/2+5,narrow?18:14,'#222820','medium');
    if(copied) out+=tx('OK',bx+bw-24,by+bh/2+6,narrow?16:13,'#222820','sans',0,'end');
    else out+=`<path d="M${bx+bw-34} ${by+bh/2+6}l13 -13m-12 0h12v12" fill="none" stroke="#222820" stroke-width="1.5"/>`;
    for(let i=0;i<3;i++){
      const [x,y,bw,bh]=L.selectors[i],col=CONFIG.colors[i],active=i===index;
      out+=r(x,y,bw,bh,active?'#293026':'none',13,active?'stroke="#707A66"':'');
      out+=circle(x+20,y+bh/2,narrow?8:6,col.hex);
      out+=tx(col.name,x+36,y+bh/2+(narrow?7:4),narrow?19:12,active?ink:muted,'sans');
    }
    if(!narrow){out+=line(64,723,1016,723,border);out+=tx('THREE HUES. ENDLESS POSSIBILITIES.',64,756,10,muted,'sans',1.5);out+=tx('APERTURE / 06 BLADES',1016,756,10,muted,'sans',1.5,'end');out+=tx('TURN A NEW SHADE',752,631,11,muted,'sans',2,'middle');}
  }else{
    const ink='#272C27',muted='#75786B',rule='#C9C7B7',accent='#B95435';
    out+=r(0,0,w,h,'#ECE9DF');
    out+=r(24,24,w-48,h-48,'none',20,`stroke="${rule}"`);
    out+=tx('FIELDNOTES®',narrow?32:64,narrow?69:81,20,ink,'medium',1.4);
    out+=tx('AN INDEX OF PLACES',w-(narrow?32:64),narrow?69:80,narrow?9:10,muted,'sans',1.2,'end');
    out+=tx('Open a new',narrow?32:64,narrow?147:203,narrow?53:60,ink,'serif');
    out+=tx('perspective.',narrow?32:64,narrow?201:263,narrow?53:60,ink,'serif');
    if(!narrow){out+=tx('Small discoveries, kept close.',66,315,14,muted);out+=tx('Three places worth pulling out.',66,340,14,muted);out+=tx('CHOOSE A PLACE',66,399,10,muted,'sans',1.7);}
    const [sx,sy,sw,sh]=L.sleeve;
    const [px,py,pw,ph]=L.paper;
    out+=r(sx+4,sy+8,sw-8,sh,'#D5D0BE',14);
    out+=r(sx,sy-6,sw,sh,'#B9AE8F',14);
    // Two fixed paper corners supply depth while the active page travels.
    out+=`<g transform="rotate(-4 ${px+pw/2} ${py+ph/2})">${r(px-10,py+16,pw,ph,'#D6D3C5',4)}</g>`;
    out+=`<g transform="rotate(2 ${px+pw/2} ${py+ph/2})">${r(px+6,py+8,pw,ph,'#E3E0D4',4)}</g>`;
    const switching=state.from!==state.to,p=state.progress,half=.5;
    const offset=!switching?0:p<half?396*ease(p/half):396*(1-ease((p-half)/half));
    const index=switching&&p>=half?state.to:state.from,project=CONFIG.projects[index];
    // Clip the moving sheet to the sleeve width. The sleeve front occludes its lower half.
    out+=`<defs><clipPath id="sheet-region"><rect x="${sx-10}" y="${py-16}" width="${sw+20}" height="${sh+sy-py+16}"/></clipPath><clipPath id="photo"><rect x="${px+18}" y="${py+18}" width="${pw-36}" height="272" rx="1"/></clipPath></defs>`;
    out+=`<g clip-path="url(#sheet-region)"><g transform="translate(0 ${offset})">`;
    out+=r(px+3,py+8,pw,ph,'#D3CFBF',4);
    out+=r(px,py,pw,ph,'#FAF8F0',4,'stroke="#D2CDBF"');
    const image=photos[project.file];
    const ih=272;
    if(image){
      const imgW=pw-36,imgX=px+18,imgY=py+18;
      // Portrait originals fill the photo box via an explicit contain-then-crop transform.
      const dimensions=photos[project.file+':dimensions']||[1080,1080];
      const sc=Math.max(imgW/dimensions[0],ih/dimensions[1]);
      const dw=dimensions[0]*sc,dh=dimensions[1]*sc;
      out+=`<image href="${xml(image)}" x="${imgX-(dw-imgW)*project.crop[0]}" y="${imgY-(dh-ih)*project.crop[1]}" width="${dw}" height="${dh}" clip-path="url(#photo)"/>`;
    }
    out+=tx(project.place,px+20,py+ih+43,9,muted,'sans',1.1);
    out+=tx(project.title,px+18,py+ih+72,narrow?28:31,ink,'serif');
    out+=tx(`0${index+1}`,px+pw-20,py+ih+69,25,accent,'serif',0,'end');
    out+='</g></g>';
    const tabPath=`M${sx} ${sy+sh-12}V${sy+10}Q${sx} ${sy-2} ${sx+12} ${sy-2}H${sx+134}L${sx+156} ${sy+14}H${sx+sw-12}Q${sx+sw} ${sy+14} ${sx+sw} ${sy+26}V${sy+sh-12}Q${sx+sw} ${sy+sh} ${sx+sw-12} ${sy+sh}H${sx+12}Q${sx} ${sy+sh} ${sx} ${sy+sh-12}Z`;
    out+=`<path d="${tabPath}" fill="#C9BE9E" stroke="#AEA385" stroke-width="1"/>`;
    out+=line(sx+1,sy+24,sx+sw-1,sy+24,'#DCD2B8');
    out+=tx('SELECTED PLACES',sx+30,sy+63,10,'#625E4E','sans',1.6);
    out+=tx('Collected, not scrolled.',sx+28,sy+107,narrow?28:30,'#373E32','serif');
    out+=tx('EST. 2026',sx+30,sy+143,9,'#736D5B','sans',1.2);
    out+=r(sx+sw-72,sy+53,40,57,'none',3,'stroke="#8C846E"');
    out+=line(sx+sw-60,sy+69,sx+sw-44,sy+69,'#8C846E');
    out+=line(sx+sw-60,sy+78,sx+sw-44,sy+78,'#8C846E');
    out+=line(sx+sw-60,sy+87,sx+sw-49,sy+87,'#8C846E');
    for(let i=0;i<3;i++){
      const [x,y,bw,bh]=L.selectors[i],active=i===index;
      out+=r(x,y,bw,bh,active?'#E1DECF':'none',7);
      out+=tx(`0${i+1}`,x+14,y+bh/2+5,narrow?14:12,active?accent:muted,'sans');
      out+=tx(CONFIG.projects[i].title,x+54,y+bh/2+6,narrow?22:19,ink,'serif');
      if(active){out+=circle(x+bw-24,y+bh/2,3.5,accent);}
      out+=line(x,y+bh+4,x+bw,y+bh+4,rule);
    }
    if(!narrow){out+=line(64,738,1016,738,rule);out+=tx('A SMALL ARCHIVE OF SOMEWHERE ELSE.',64,770,9,muted,'sans',1.5);out+=tx('03 PLACES / ONE PERSPECTIVE AT A TIME',1016,770,9,muted,'sans',1.2,'end');}
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${kind==='chroma'?'A mechanical aperture reveals one of three colours':'A paper project card slides out of a portfolio sleeve'}</title>${out}</svg>`;
}
