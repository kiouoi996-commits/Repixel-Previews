// Pure authored scene functions. The live references and the videos share these exact coordinates.
export const CONFIG={version:1,width:1080,height:810,fps:30,duration:10,transition:1.1,
 finishes:[{name:'Graphite',hex:'#54616A'},{name:'Chalk',hex:'#D7D8CD'},{name:'Seafoam',hex:'#94B9AA'}],
 themes:[
  {name:'Clay',photo:'clay',light:{canvas:'#F0E4D7',surface:'#FFF8EE',accent:'#A24730',ink:'#332B28',muted:'#817064'},dark:{canvas:'#2A2525',surface:'#3C3230',accent:'#EBA781',ink:'#F6EAE0',muted:'#BCA89D'}},
  {name:'Moss',photo:'moss',light:{canvas:'#E5E9D8',surface:'#F8F9EC',accent:'#3B5C45',ink:'#273B2D',muted:'#6E7C67'},dark:{canvas:'#142A24',surface:'#253F33',accent:'#BCD78D',ink:'#F2F5E6',muted:'#AFBDA6'}},
  {name:'Dusk',photo:'dusk',light:{canvas:'#E3E9EC',surface:'#F5F8F8',accent:'#326A83',ink:'#213642',muted:'#6D8088'},dark:{canvas:'#142A35',surface:'#243F4A',accent:'#AED1E0',ink:'#ECF3F5',muted:'#AABFC8'}}
 ]};
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{x=clamp(x);return x<.5?4*x*x*x:1-((-2*x+2)**3)/2;};
const lerp=(a,b,p)=>a+(b-a)*p;
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const hex=a=>'#'+a.map(x=>Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,'0')).join('').toUpperCase();
export const blend=(a,b,p)=>hex(rgb(a).map((x,i)=>lerp(x,rgb(b)[i],p)));
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const rect=(x,y,w,h,c,rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}" ${extra}/>`;
const circle=(x,y,r,c,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${extra}/>`;
const line=(d,c,width=1,extra='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
export function text(atlas,content,x,y,size,c,font='sans',spacing=0,anchor='start',opacity=1){
 const f=atlas[font],scale=size/f.units,chars=[...content],width=chars.reduce((a,k)=>a+(f.glyphs[k]?.advance||f.units*.5)*scale+spacing,0)-spacing;
 let at=anchor==='end'?-width:anchor==='middle'?-width/2:0,s='';for(const char of chars){const g=f.glyphs[char];if(g){s+=`<path d="${g.d}" transform="translate(${at} 0) scale(${scale} ${-scale})"/>`;at+=g.advance*scale+spacing;}}
 return`<g fill="${c}" opacity="${opacity}" transform="translate(${x} ${y})" aria-label="${xml(content)}">${s}</g>`;
}
export function layout(kind,narrow=false){
 if(kind==='orbital')return narrow?{w:560,h:1160,open:[28,900,504,66],finishes:Array.from({length:3},(_,i)=>[28+i*174,998,156,68]),rotation:[72,802,416,62],object:[280,541,.88]}:{w:1080,h:810,open:[48,592,318,64],finishes:Array.from({length:3},(_,i)=>[48+i*112,704,106,54]),rotation:[612,731,360,54],object:[765,402,1]};
 const s=504/642;
 return narrow?{w:560,h:1350,source:[28,294,504,380],sample:[28,694,504,480*s],presets:Array.from({length:3},(_,i)=>[52+i*100,530,88,70]),upload:[364,532,144,66],modes:[[28,210,252,64],[280,210,252,64]],copy:[350,32,182,64],sampleCopy:[28+28*s,694+300*s,230*s,52*s]}:{w:1080,h:810,source:[48,192,318,480],sample:[390,192,642,480],presets:Array.from({length:3},(_,i)=>[70+i*92,510,86,70]),upload:[70,606,274,46],modes:[[832,118,100,46],[932,118,100,46]],copy:[848,34,184,46],sampleCopy:[418,492,230,52]};
}
export const view=(i,dark=false)=>({theme:CONFIG.themes[i],dark});
export function fixture(t,kind='orbital'){
 t=((t%10)+10)%10;
 if(kind==='orbital'){
  const open=t<1?0:t<2.2?ease((t-1)/1.2):t<6.3?1:t<7.5?1-ease((t-6.3)/1.2):0;
  const finish=t<4?{from:0,to:0,progress:0}:t<4.8?{from:0,to:2,progress:ease((t-4)/.8)}:t<8.2?{from:2,to:2,progress:0}:t<9?{from:2,to:0,progress:ease((t-8.2)/.8)}:{from:0,to:0,progress:0};
  return{open,finishFrom:finish.from,finishTo:finish.to,finishProgress:finish.progress,rotation:-24};
 }
 const states=[view(0),view(1),view(2),view(2,true),view(0)],cues=[1,3.6,6.1,8];
 for(let i=0;i<cues.length;i++){if(t<cues[i])return{from:states[i],to:states[i],progress:0};if(t<cues[i]+1.1)return{from:states[i],to:states[i+1],progress:(t-cues[i])/1.1};}
 return{from:states[4],to:states[4],progress:0};
}
function rounded(hx,hz,r,n=8){const p=[];for(const[cx,cz,start]of[[hx-r,hz-r,0],[-hx+r,hz-r,90],[-hx+r,-hz+r,180],[hx-r,-hz+r,270]])for(let i=0;i<=n;i++){const a=(start+i*90/n)*Math.PI/180;p.push([cx+r*Math.cos(a),cz+r*Math.sin(a)]);}return p;}
export function finishColor(state){return blend(state.finishColorFrom||CONFIG.finishes[state.finishFrom||0].hex,CONFIG.finishes[state.finishTo||0].hex,clamp(state.finishProgress||0));}
function speaker(state,L,narrow){
 const opening=clamp(state.open||0),[cx,cy,mobileScale]=L.object,scale=(1.25-.27*opening)*mobileScale;
 const yaw=(state.rotation??-24)*Math.PI/180,pitch=22*Math.PI/180,sn=Math.sin(yaw),cs=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);
 const project=([x,y,z])=>[cx+(x*cs+z*sn)*scale,cy+(-y*cp+(-x*sn+z*cs)*sp)*scale,(-x*sn+z*cs)*cp+y*sp];
 const faces=[],color=finishColor(state);
 const shade=(base,n)=>{const light=clamp(n[0]*-.35+n[1]*.78+n[2]*.58);return blend(blend(base,'#0D1B20',.38*(1-light)),'#F1F5EB',.08+.18*light);};
 const add=(points,fill,normal=[0,1,0],extra='',bias=0,paint=true)=>{if(normal[0]*(-sn)*cp+normal[1]*sp+normal[2]*cs*cp<-.001)return;if(fill.startsWith('url('))paint=false;const p=points.map(project),dep=p.reduce((a,p)=>a+p[2],0)/p.length+bias;faces.push({dep,svg:`<polygon points="${p.map(v=>v.slice(0,2).join(',')).join(' ')}" fill="${paint?shade(fill,normal):fill}" stroke="${paint?shade(fill,normal):'none'}" stroke-width=".45" ${extra}/>`});};
 const poly=(profile,y0,y1,base,top=base)=>{
  for(let i=0;i<profile.length;i++){const a=profile[i],b=profile[(i+1)%profile.length],nx=b[1]-a[1],nz=a[0]-b[0],len=Math.hypot(nx,nz);add([[...a.slice(0,1),y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],base,[nx/len,0,nz/len]);}
  add(profile.map(([x,z])=>[x,y1,z]),top,[0,1,0]);
 };
 const box=(hx,hz,r,y0,y1,base,top=base)=>poly(rounded(hx,hz,r),y0,y1,base,top);
 const disc=(rad,y0,y1,base,top=base)=>poly(Array.from({length:48},(_,i)=>[Math.cos(i/48*Math.PI*2)*rad,Math.sin(i/48*Math.PI*2)*rad]),y0,y1,base,top);
 const topDecal=(points,fill,y,bias=1)=>add(points.map(([x,z])=>[x,y,z]),fill,[0,1,0],'',bias,false);
 // A weighted base, perforated acoustic chamber and lifted crown are actual projected geometry.
 const baseOffset=-160*opening;
 box(125,86,34,-95+baseOffset,-75+baseOffset,color,'url(#brushed-metal)');
 for(const x of[-78,78])for(const z of[-48,48]){
  const p=rounded(20,14,9).map(([a,b])=>[a+x,b+z]);poly(p,-106+baseOffset,-95+baseOffset,'#273137');
 }
 box(125,86,34,-75,55,color,blend(color,'#13212A',.65));
 const frontDepth=Math.max(...rounded(125,86,34).filter(p=>p[1]>80).map(([x,z])=>project([x,0,z])[2]))+1;
 let grille='';
 for(let row=0;row<9;row++)for(let col=0;col<17;col++){
  const x=-91+col*11.4+(row%2)*2.4,y=-41+row*8.4;
  const p=Array.from({length:8},(_,i)=>project([x+1.8*Math.cos(i*Math.PI/4),y+1.8*Math.sin(i*Math.PI/4),86.6]));
  grille+=`<polygon points="${p.map(v=>v.slice(0,2).join(',')).join(' ')}" fill="#18232A" fill-opacity=".77"/>`;
 }
 const led=project([-76,-59,87]);grille+=circle(led[0],led[1],2.3*scale,'#E9F5C1');
 faces.push({dep:frontDepth+8,svg:grille});
 if(opening>.04)topDecal(rounded(104,66,28),'url(#cavity)',55.6,10);
 const capOffset=160*opening;
 box(126,87,35,55+capOffset,78+capOffset,color,'url(#brushed-metal)');
 const capY=78.3+capOffset;
 for(let i=-1;i<=1;i++)topDecal(rounded(14,2,2,3).map(([x,z])=>[x+i*38,z]),'#47565A',capY,14);
 const ring=Array.from({length:64},(_,i)=>[Math.cos(i*Math.PI/32)*22,Math.sin(i*Math.PI/32)*22]);
 const pp=ring.map(([x,z])=>project([x,capY+.5,z-44]));faces.push({dep:project([0,capY,-44])[2]+6,svg:`<polygon points="${pp.map(p=>p.slice(0,2).join(',')).join(' ')}" fill="none" stroke="#E4EEE6" stroke-opacity=".7" stroke-width="${.9*scale}"/>`});
 if(opening>.015){
  const d=85*opening;
  disc(89,44+d,57+d,'#1D282E','#222E32');disc(78,57+d,61+d,'#616A66','#8C9A8F');disc(71,61+d,64+d,'#23302E','#202D2B');
  const cone=Array.from({length:64},(_,i)=>[Math.cos(i*Math.PI/32)*63,Math.sin(i*Math.PI/32)*63]);topDecal(cone,'url(#driver-cone)',64.4+d,4);
  disc(27,64.4+d,72+d,'#5D6B65','#B7C2B7');
  const boardOffset=-85*opening;
  box(104,68,13,-70+boardOffset,-64+boardOffset,'#214B3D','#346C56');
  for(const[z0,x0]of[[-38,-67],[-12,-58],[18,-72],[40,-60]]){
   const points=[[x0,z0],[x0+32,z0],[x0+32,z0+8],[x0+62,z0+8]].map(([x,z])=>project([x,-63+boardOffset,z]));
   faces.push({dep:project([x0+30,-63+boardOffset,z0])[2]+6,svg:line('M'+points.map(p=>p.slice(0,2).join(' ')).join('L'),'#D5BD7C',1.1*scale)});
  }
  const chip=rounded(25,21,3).map(([x,z])=>[x+24,z]);poly(chip,-63+boardOffset,-56+boardOffset,'#1B2829','#243136');
  for(const x of[-70,70])for(const z of[-40,40])poly(rounded(8,8,3).map(([a,b])=>[a+x,b+z]),-64+boardOffset,-51+boardOffset,'#C4C8B6');
 }
 faces.sort((a,b)=>a.dep-b.dep);
 const shadowY=lerp(595,706,opening)*mobileScale+(narrow?14:0),shadowX=cx;
 let s=`<defs><linearGradient id="brushed-metal" x2="1" y2="1"><stop stop-color="${blend(color,'#FFFFFF',.42)}"/><stop offset=".48" stop-color="${blend(color,'#FFFFFF',.13)}"/><stop offset="1" stop-color="${blend(color,'#11231C',.20)}"/></linearGradient><radialGradient id="cavity"><stop stop-color="#0D1C16"/><stop offset=".85" stop-color="#1A2F23"/><stop offset="1" stop-color="#617263"/></radialGradient><radialGradient id="contact"><stop stop-color="#29332C" stop-opacity="${.22-opening*.08}"/><stop offset="1" stop-color="#29332C" stop-opacity="0"/></radialGradient><radialGradient id="driver-cone"><stop stop-color="#718075"/><stop offset=".43" stop-color="#25342E"/><stop offset=".77" stop-color="#4C5B50"/><stop offset="1" stop-color="#15251F"/></radialGradient></defs>`;
 s+=`<ellipse cx="${shadowX}" cy="${narrow?lerp(715,792,opening):shadowY}" rx="${220*mobileScale}" ry="${32*mobileScale}" fill="url(#contact)"/>`;
 if(!narrow&&opening>.03){
  const ys=[78+capOffset,64+85*opening,4,-60-85*opening,-84+baseOffset];
  for(let i=0;i<5;i++){const a=project([-105,ys[i],40]),y=378+i*42;s+=`<g opacity="${ease((opening-.15-i*.03)/.65)*.8}">${line(`M328 ${y-4}H480L${a[0]-11} ${a[1]}H${a[0]}`,'#99A59A',.9)}${circle(a[0],a[1],2.5,'#637360')}</g>`;}
 }
 return s+faces.map(f=>f.svg).join('');
}
export const luminance=c=>rgb(c).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
export const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
export function palette(v){const p={...v.theme[v.dark?'dark':'light']};p.onAccent=contrast(p.accent,'#14241F')>=contrast(p.accent,'#FFFEF8')?'#14241F':'#FFFEF8';for(let i=0;i<12&&contrast(p.accent,p.onAccent)<4.5;i++)p.accent=blend(p.accent,p.onAccent==='#14241F'?'#FFFEF8':'#14241F',.06);return p;}
export function cssForView(v){const p=palette(v);return':root {\n'+Object.entries(p).map(([k,c])=>`  --theme-${k.replace('onAccent','on-accent')}: ${c};`).join('\n')+'\n  --theme-radius: 24px;\n}\n';}
export function extractTheme(pixels,name='Your image',photo='custom'){
 const bins=new Map();
 for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]<150)continue;const c=[pixels[i],pixels[i+1],pixels[i+2]],key=c.map(x=>Math.round(x/32)).join(',');let b=bins.get(key);if(!b){b={sum:[0,0,0],n:0};bins.set(key,b);}b.n++;c.forEach((v,j)=>b.sum[j]+=v);}
 const candidates=[...bins.values()].filter(b=>b.n>1).map(b=>({c:hex(b.sum.map(x=>x/b.n)),n:b.n}));
 if(!candidates.length)throw Error('This image has no visible colour pixels.');
 candidates.sort((a,b)=>b.n-a.n);
 const useful=candidates.filter(v=>{const l=luminance(v.c);return l>.025&&l<.83;});
 const ranked=(useful.length?useful:candidates).map(v=>{const a=rgb(v.c),sat=(Math.max(...a)-Math.min(...a))/255;return{...v,score:Math.sqrt(v.n)*(.35+sat)};}).sort((a,b)=>b.score-a.score);
 const base=ranked[0].c,accent=contrast(base,'#FFFDF8')>=4.6?base:blend(base,'#15231D',.45);
 return{name,photo,light:{canvas:blend(base,'#FFFDF8',.89),surface:blend(base,'#FFFDF8',.97),accent,ink:blend(base,'#14211C',.83),muted:blend(base,'#6C756D',.75)},dark:{canvas:blend(base,'#101C18',.91),surface:blend(base,'#263930',.8),accent:blend(base,'#F0F3D9',.62),ink:'#F1F4E9',muted:blend(base,'#B6C4B3',.78)}};
}
function themeSample(atlas,v,photos,slot='a'){
 const p=palette(v),tx=(...a)=>text(atlas,...a),url=photos[v.theme.photo]||'';
 let s=rect(0,0,642,480,p.canvas,32);
 s+=tx('STILL',28,46,18,p.ink,'medium',2.2)+tx('Places   /   Journal',614,44,10,p.ink,'sans',0,'end');
 s+=line('M28 64H614',p.ink,1,'stroke-opacity=".14"');
 s+=tx('A DIFFERENT WAY TO GET AWAY',28,111,8,p.muted,'medium',1.1);
 s+=tx('Leave room',26,170,50,p.ink,'serif',-.9)+tx('for wonder.',26,225,50,p.ink,'serif',-.9);
 s+=tx('Small escapes. A quieter pace.',28,264,11,p.muted)+tx('Find a place that feels like you.',28,282,11,p.muted);
 s+=rect(28,300,230,52,p.accent,26)+tx('Use this look',52,332,13,p.onAccent,'medium');
 s+=line('M222 335l12 -12m-12 0h12v12',p.onAccent,1.4);
 const shape='M372 88H492A122 122 0 0 1 614 210V378Q614 402 590 402H394Q370 402 370 378V210A122 122 0 0 1 492 88Z';
 // A symmetrical arch; the extra start point is outside the clipped photo only.
 s+='<defs><clipPath id="arch-'+slot+'">'+`<path d="M370 210A122 122 0 0 1 614 210V378Q614 402 590 402H394Q370 402 370 378Z"/>`+'</clipPath></defs>';
 s+=`<image href="${xml(url)}" x="370" y="88" width="244" height="314" preserveAspectRatio="xMidYMid slice" clip-path="url(#arch-${slot})"/>`;
 s+=rect(392,342,200,44,p.surface,22,'fill-opacity=".94"')+tx('01 / A softer pace',492,369,11,p.ink,'sans',0,'middle');
 s+=tx('A slower kind of discovery.',28,436,11,p.muted);
 s+=circle(598,435,17,p.surface)+line('M592 441l12 -12m-12 0h12v12',p.ink,1.1);
 return s;
}
export function render(kind,state,atlas,photos={},narrow=false){
 const L=layout(kind,narrow),{w,h}=L,tx=(...a)=>text(atlas,...a);let s='';
 if(kind==='orbital'){
  const ink='#202C27',muted='#778077',open=clamp(state.open||0),finishIndex=(state.finishProgress||0)>=.5?state.finishTo:state.finishFrom;
  s+=rect(0,0,w,h,'#E9ECE4');s+=tx('ORBITAL',narrow?28:48,64,24,ink,'medium',2.3);s+=tx('DESKTOP AUDIO / 01',w-(narrow?28:48),62,narrow?9:11,muted,'sans',1.3,'end');
  s+=tx('Sound,',narrow?28:48,narrow?151:199,narrow?62:70,ink,'sans',-3.5);s+=tx('unpacked.',narrow?28:48,narrow?216:272,narrow?62:70,ink,'sans',-3.5);
  s+=tx('Every detail has a purpose.',narrow?30:50,narrow?252:313,narrow?18:14,muted);
  if(!narrow){
   s+=line('M48 341H366','#C8D0C3',1);
   const labels=['Aluminium crown','Full-range driver','Acoustic chamber','Signal board','Weighted base'];
   for(let i=0;i<5;i++){const y=378+i*42,alpha=ease((open-.05-i*.035)/.7);s+=`<g opacity="${alpha}">${circle(61,y-5,12,'none','stroke="#ADB9A6"')}${tx('0'+(i+1),61,y-2,8,muted,'medium',0,'middle')}${tx(labels[i],84,y,13,ink)}</g>`;}
   s+=`<g opacity="${1-ease(open/.35)}">${tx('Small footprint.',48,397,24,ink,'sans',-.6)}${tx('Room-filling sound.',48,430,24,ink,'sans',-.6)}${tx('Made to be explored.',50,474,12,muted)}</g>`;
  }
  s+=speaker(state,L,narrow);
  if(narrow)s+=tx(open>.5?'Five parts. One considered object.':'Small footprint. Room-filling sound.',28,876,15,muted);
  const[bx,by,bw,bh]=L.open;s+=rect(bx,by,bw,bh,ink,bh/2)+tx(open>.5?'Put it together':'Explore inside',bx+27,by+bh/2+6,narrow?21:17,'#F2F5EC','medium');s+=circle(bx+bw-32,by+bh/2,18,'#435146');s+=line(`M${bx+bw-39} ${by+bh/2}h14`,'#EAF1E2',1.4);if(open<.5)s+=line(`M${bx+bw-32} ${by+bh/2-7}v14`,'#EAF1E2',1.4);
  s+=tx('FINISH',narrow?28:48,narrow?983:690,narrow?12:9,muted,'medium',1.6);
  CONFIG.finishes.forEach((f,i)=>{const[x,y,cw,ch]=L.finishes[i];s+=rect(x,y,cw,ch,i===finishIndex?'#F9FBF4':'none',ch/2,`stroke="${i===finishIndex?'#B8C4AE':'#C6CFC0'}"`)+circle(x+(narrow?24:19),y+ch/2,narrow?10:8,f.hex)+tx(f.name,x+(narrow?43:33),y+ch/2+(narrow?6:4),narrow?16:11,ink);});
  const[rx,ry,rw,rh]=L.rotation,thumb=rx+20+(rw-40)*clamp(((state.rotation??-24)+50)/100);
  s+=tx('ROTATE',rx,ry-9,narrow?12:9,muted,'medium',1.5)+tx(`${Math.round(state.rotation??-24)}°`,rx+rw,ry-9,narrow?13:10,muted,'sans',0,'end');
  s+=rect(rx,ry,rw,rh,'#DFE5D9',rh/2)+line(`M${rx+20} ${ry+rh/2}H${rx+rw-20}`,'#AFBDA5',1.2)+circle(thumb,ry+rh/2,narrow?16:12,ink)+line(`M${thumb-3} ${ry+rh/2-4}l-3 4 3 4m6 -8 3 4 -3 4`,'#F1F5E9',1);
  s+=tx('A LITTLE OBJECT. A NEW PERSPECTIVE.',narrow?28:48,h-28,narrow?10:9,muted,'sans',1.1);
 }else{
  const p=clamp(state.progress||0),changing=JSON.stringify(state.from)!==JSON.stringify(state.to),e=changing?ease(p):1,v=changing&&p<.5?state.from:state.to,ink='#252F29',muted='#7D8278';
  s+=rect(0,0,w,h,'#EEEDE6');s+=rect(narrow?28:48,43,23,23,'#B6CBA8',6)+rect(narrow?39:59,54,12,12,'#536D55',4)+tx('SWATCH',narrow?65:85,64,narrow?21:23,ink,'medium',1.5);
  if(!narrow)s+=tx('FROM A MOOD TO A SYSTEM',804,62,9,muted,'sans',1.4,'end');
  const[cx,cy,cw,ch]=L.copy;s+=rect(cx,cy,cw,ch,ink,ch/2)+tx(state.copied?'Copied!':'Copy CSS',cx+cw/2,cy+ch/2+(narrow?6:5),narrow?18:13,'#F4F6EA','medium',0,'middle');
  if(narrow){s+=tx('A mood.',28,147,53,ink,'serif',-.8);s+=tx('A whole new look.',28,195,46,ink,'serif',-.8);}else s+=tx('A mood. A whole new look.',48,151,52,ink,'serif',-.8);
  const modeIndex=v.dark?1:0,m=L.modes[0],n=L.modes[1];s+=rect(m[0],m[1],m[2]+n[2],m[3],'#DEDFD5',m[3]/2);
  [m,n].forEach(([x,y,mw,mh],i)=>{if(i===modeIndex)s+=rect(x+3,y+3,mw-6,mh-6,'#FAFCF2',(mh-6)/2);s+=tx(i?'Dark':'Light',x+mw/2,y+mh/2+(narrow?7:4),narrow?20:12,ink,i===modeIndex?'medium':'sans',0,'middle');});
  const[sx,sy,sw,sh]=L.source;s+=rect(sx,sy,sw,sh,'#FCFDF7',32,'stroke="#D8DDCF"');
  s+=tx(state.dragging?'DROP YOUR IMAGE':'THE REFERENCE',sx+24,sy+(narrow?31:37),narrow?13:10,muted,'medium',1.4);
  const imageBox=narrow?[52,350,208,154]:[70,254,274,168],ix=imageBox[0],iy=imageBox[1],iw=imageBox[2],ih=imageBox[3];s+=`<defs><clipPath id="source-photo">${rect(ix,iy,iw,ih,'white',22)}</clipPath></defs>`;
  for(const[item,alpha]of[[state.from,changing?1-e:1],[state.to,changing?e:0]])if(alpha>0)s+=`<image href="${xml(photos[item.theme.photo]||'')}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" clip-path="url(#source-photo)" opacity="${alpha}"/>`;
  const name=v.theme.name.length>16?v.theme.name.slice(0,15)+'...':v.theme.name;
  s+=tx(name,narrow?280:70,narrow?378:461,narrow?25:27,ink,'sans',-.7);
  s+=tx(state.extracting?'Reading colours...':'Five colours.',narrow?280:70,narrow?414:485,narrow?15:12,muted);
  if(narrow)s+=tx('A new direction.',280,438,15,muted);
  CONFIG.themes.forEach((theme,i)=>{const[x,y,pw,ph]=L.presets[i],selected=v.theme.name===theme.name;s+=`<defs><clipPath id="preset-${i}">${rect(x,y,pw,ph-20,'white',14)}</clipPath></defs><image href="${xml(photos[theme.photo]||'')}" x="${x}" y="${y}" width="${pw}" height="${ph-20}" preserveAspectRatio="xMidYMid slice" clip-path="url(#preset-${i})"/>`;s+=rect(x+.5,y+.5,pw-1,ph-21,'none',14,`stroke="${selected?'#294634':'#E0E4D7'}" stroke-width="${selected?2.2:1}"`)+tx(theme.name,x+pw/2,y+ph-3,narrow?14:11,selected?ink:muted,selected?'medium':'sans',0,'middle');});
  const[ux,uy,uw,uh]=L.upload;s+=rect(ux,uy,uw,uh,'#EDF1E4',uh/2)+tx(narrow?'Use image':'Use your own image',ux+uw/2,uy+uh/2+(narrow?6:4),narrow?17:12,ink,'medium',0,'middle');
  const[px,py,pw,ph]=L.sample,sc=pw/642;
  s+=`<defs><clipPath id="sample-clip">${rect(px,py,pw,ph,'white',32)}</clipPath><clipPath id="paint-reveal"><circle cx="0" cy="240" r="${e*810}"/></clipPath></defs><g clip-path="url(#sample-clip)"><g transform="translate(${px} ${py}) scale(${sc})">`;
  s+=themeSample(atlas,state.from,photos,'from');
  if(changing)s+=`<g clip-path="url(#paint-reveal)">${themeSample(atlas,state.to,photos,'to')}</g>`;
  s+='</g></g>'+rect(px+.5,py+.5,pw-1,ph-1,'none',32,'stroke="#B9C5B1" stroke-opacity=".65"');
  const pv=palette(v),ratio=contrast(pv.ink,pv.canvas),tokens=[['Canvas','canvas'],['Surface','surface'],['Accent','accent'],['Ink','ink'],['On accent','onAccent']];
  if(!narrow)s+=rect(48,696,984,72,'#FCFDF7',24,'stroke="#D8DDCF"');
  tokens.forEach(([label,key],i)=>{const x=narrow?28+(i%2)*260:48+i*196.8,y=narrow?1095+Math.floor(i/2)*73:696,tw=narrow?(i===4?504:244):196.8,th=narrow?61:72;
   if(narrow)s+=rect(x,y,tw,th,'#FCFDF7',21,'stroke="#D8DDCF"');const col=blend(palette(state.from)[key],palette(state.to)[key],e);
   s+=circle(x+(narrow?26:23),y+th/2,narrow?14:13,col,'stroke="#202C2720"');s+=tx(label,x+(narrow?51:45),y+(narrow?24:26),narrow?13:10,muted);s+=tx(pv[key],x+(narrow?51:45),y+(narrow?46:49),narrow?17:14,ink,'medium',-.3);
  });
  s+=tx(`Text contrast ${ratio.toFixed(1)}:1  /  ${ratio>=7?'AAA':ratio>=4.5?'AA':'Review'}`,narrow?28:48,narrow?1331:795,narrow?12:10,muted,'sans',.2);
  if(!narrow)s+=tx('YOUR IMAGE. YOUR COLOURS.',1032,795,9,muted,'sans',1.2,'end');
 }
 return`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${kind==='orbital'?'ORBITAL exploded product configurator':'SWATCH reference to UI palette studio'}">${s}</svg>`;
}
