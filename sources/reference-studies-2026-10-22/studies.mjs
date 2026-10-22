// Original interactions inspired by the supplied visual references.
// Scene coordinates and glyph paths are shared by the browser and video renderer.
export const CONFIG={version:1,width:1080,height:810,fps:30,duration:10,transition:1.1,cues:[1,4,7],
 days:[
  {day:'Mon',date:'12',hours:4.5,percent:64,tasks:['Design exploration','Team catch-up','Prototype review'],times:['09:00','11:30','14:00'],minutes:['90 min','30 min','60 min']},
  {day:'Tue',date:'13',hours:3.0,percent:46,tasks:['Research synthesis','Product sync','Sketch new ideas'],times:['09:30','12:00','15:00'],minutes:['60 min','45 min','75 min']},
  {day:'Wed',date:'14',hours:5.5,percent:82,tasks:['Build the prototype','Design critique','Refine the details'],times:['09:00','13:00','15:30'],minutes:['120 min','45 min','90 min']},
  {day:'Thu',date:'15',hours:3.5,percent:58,tasks:['Explore directions','Weekly check-in','Test with people'],times:['10:00','12:30','14:30'],minutes:['90 min','30 min','60 min']},
  {day:'Fri',date:'16',hours:2.5,percent:38,tasks:['Polish the experience','Share the progress','Make room for next'],times:['09:30','11:00','14:00'],minutes:['60 min','30 min','60 min']}
 ],
 routes:[
  {name:'Ridge loop',distance:'5.2',duration:'1 h 20',pace:'Moderate',rise:'240 m',points:[[558,662],[631,625],[689,583],[720,532],[704,488],[758,446],[807,402],[786,355],[849,306],[874,264]]},
  {name:'Valley walk',distance:'3.4',duration:'55 min',pace:'Easy',rise:'80 m',points:[[558,662],[609,626],[643,579],[626,532],[659,496],[711,474],[751,440],[767,398],[805,361],[854,340]]},
  {name:'Lake circuit',distance:'7.8',duration:'2 h 10',pace:'Moderate',rise:'320 m',points:[[558,662],[638,618],[705,570],[751,511],[799,459],[847,418],[911,389],[954,355],[936,314],[874,291]]}
 ]};
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{x=clamp(x);return x<.5?4*x*x*x:1-((-2*x+2)**3)/2;};
const mix=(a,b,t)=>a+(b-a)*t;
export function fixture(t,kind='kite'){
 t=((t%10)+10)%10;let from=0;const targets=kind==='kite'?[2,4,0]:[1,2,0];
 for(let i=0;i<3;i++){if(t<CONFIG.cues[i])return{from,to:from,progress:0};if(t<CONFIG.cues[i]+1.1)return{from,to:targets[i],progress:(t-CONFIG.cues[i])/1.1};from=targets[i];}
 return{from,to:from,progress:0};
}
const rect=(x,y,w,h,fill,rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const path=(d,stroke,width=1,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function text(atlas,content,x,y,size,fill,font='sans',spacing=0,anchor='start',opacity=1){
 const f=atlas[font],scale=size/f.units,chars=[...content],width=chars.reduce((a,c)=>a+(f.glyphs[c]?.advance||f.units*.5)*scale+spacing,0)-spacing;
 let cursor=anchor==='end'?-width:anchor==='middle'?-width/2:0,body='';
 for(const c of chars){const g=f.glyphs[c];if(g){body+=`<path d="${g.d}" transform="translate(${cursor} 0) scale(${scale} ${-scale})"/>`;cursor+=g.advance*scale+spacing;}}
 return`<g fill="${fill}" opacity="${opacity}" transform="translate(${x} ${y})" aria-label="${xml(content)}">${body}</g>`;
}
export function layout(kind,narrow=false){
 if(kind==='kite')return narrow?{w:560,h:1190,selectors:Array.from({length:5},(_,i)=>[42+i*96,462,86,110]),save:null,next:[470,100,64,64]}:{w:1080,h:810,selectors:Array.from({length:5},(_,i)=>[540+i*94,278,78,116]),save:null,next:[430,128,64,64]};
 return narrow?{w:560,h:1120,selectors:Array.from({length:3},(_,i)=>[48,768+i*82,464,72]),save:[414,548,74,74]}:{w:1080,h:810,selectors:Array.from({length:3},(_,i)=>[72,421+i*94,336,80]),save:[944,602,60,60]};
}
function smoothPoints(points){
 const a=[];for(let i=0;i<points.length-1;i++){const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];for(let j=0;j<12;j++){const t=j/12,t2=t*t,t3=t2*t;a.push([0,1].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)));}}a.push(points.at(-1));return a;
}
export function render(kind,state,atlas,photos={},narrow=false,saved=false){
 const L=layout(kind,narrow),{w,h}=L,tx=(...a)=>text(atlas,...a),changing=state.from!==state.to,p=changing?clamp(state.progress):1,e=ease(p),index=changing&&p<.45?state.from:state.to;
 let out='';
 if(kind==='kite'){
  const ink='#101410',muted='#697268',lime='#E4FF5E',sage='#B6BEB4',white='#F7F9F3';
  out+=rect(0,0,w,h,sage);
  out+=path(`M${narrow?28:52} 57l12 -14 12 14 -12 14Z`,ink,1.7)+path(`M${narrow?40:64} 43v28`,ink,1.2);
  out+=tx('KITE',narrow?65:90,64,22,ink,'medium',2.1);
  out+=rect(w-(narrow?172:192),34,narrow?144:144,42,'none',21,'stroke="#7F897C"');out+=tx('WEEK 42',w-(narrow?100:120),60,12,ink,'sans',1,'middle');
  const ax=narrow?24:48,ay=narrow?102:130,aw=narrow?512:448,ah=narrow?290:302;
  // A rounded concave cut-out creates space for the separate circular arrow.
  out+=`<path d="M${ax+44} ${ay}H${ax+aw-118}Q${ax+aw-88} ${ay} ${ax+aw-88} ${ay+30}V${ay+38}Q${ax+aw-88} ${ay+76} ${ax+aw-50} ${ay+76}H${ax+aw-44}Q${ax+aw} ${ay+76} ${ax+aw} ${ay+120}V${ay+ah-44}Q${ax+aw} ${ay+ah} ${ax+aw-44} ${ay+ah}H${ax+44}Q${ax} ${ay+ah} ${ax} ${ay+ah-44}V${ay+44}Q${ax} ${ay} ${ax+44} ${ay}Z" fill="${lime}"/>`;
  out+=circle(ax+aw-34,ay+30,32,white);out+=path(`M${ax+aw-45} ${ay+41}l21 -21m-21 0h21v21`,ink,1.7);
  out+=tx('MAKE ROOM FOR GOOD WORK',ax+28,ay+38,11,ink,'medium',1.4);
  out+=tx('A little focus.',ax+28,ay+101,narrow?45:43,ink,'sans',-1.9);
  out+=tx('A better week.',ax+28,ay+151,narrow?45:43,ink,'sans',-1.9);
  const pct=mix(CONFIG.days[state.from].percent,CONFIG.days[state.to].percent,e);
  out+=tx('Daily capacity',ax+28,ay+215,14,'#4F5D30');out+=tx(`${Math.round(pct)}%`,ax+aw-28,ay+215,14,ink,'medium',0,'end');
  out+=rect(ax+28,ay+235,aw-56,10,white,5);out+=rect(ax+28,ay+235,(aw-56)*pct/100,10,ink,5);
  out+=tx('More space for your best ideas.',ax+28,ay+276,12,'#4F5D30');
  const bx=narrow?24:516,by=narrow?412:130,bw=narrow?512:516,bh=narrow?184:302;
  out+=rect(bx,by,bw,bh,white,44);
  if(!narrow){out+=tx('Your week,',bx+28,by+60,39,ink,'sans',-1.6);out+=tx('in balance.',bx+28,by+104,39,ink,'sans',-1.6);out+=rect(bx+bw-134,by+27,106,38,'none',19,'stroke="#B9C1B5"');out+=tx('October',bx+bw-81,by+51,12,ink,'sans',0,'middle');}
  else out+=tx('Your week',bx+24,by+32,22,ink,'medium',-.7);
  for(let i=0;i<5;i++){const[x,y,sw,sh]=L.selectors[i];out+=rect(x,y,sw,sh,'#EBEFE7',sw/2);}
  const a=L.selectors[state.from],b=L.selectors[state.to],hx=mix(a[0],b[0],e),hy=mix(a[1],b[1],e);
  out+=rect(hx,hy,a[2],a[3],lime,a[2]/2);
  for(let i=0;i<5;i++){const[x,y,sw,sh]=L.selectors[i];out+=tx(CONFIG.days[i].date,x+sw/2,y+49,29,ink,'sans',-1,'middle');out+=tx(CONFIG.days[i].day,x+sw/2,y+79,narrow?18:14,ink,'sans',0,'middle');out+=circle(x+sw/2,y+sh-18,3.2,i===index?ink:'#BEC7B8');}
  const cx=narrow?24:48,cy=narrow?616:452,cw=narrow?512:640,ch=narrow?332:310;
  out+=rect(cx,cy,cw,ch,white,44);out+=tx('Daily flow',cx+28,cy+55,narrow?33:36,ink,'sans',-1.3);
  const d=CONFIG.days[index],fade=changing?(p<.45?1-clamp(p/.28):clamp((p-.45)/.3)):1;
  out+=rect(cx+cw-135,cy+27,107,35,'#E7ECE1',18);out+=tx(`${d.day}, ${d.date}`,cx+cw-81,cy+49,12,ink,'sans',0,'middle');
  for(let i=0;i<3;i++){const yy=cy+94+i*65,phase=changing?(p<.45?-24*ease(p/.45):24*(1-ease((p-.45-i*.035)/.4))):0;out+=tx(d.times[i],cx+28,yy+27,narrow?16:12,muted);const rowX=cx+(narrow?92:104),rowW=cw-(narrow?120:132);out+=`<g transform="translate(0 ${phase})" opacity="${fade}">`;out+=rect(rowX,yy,rowW,52,i===2?lime:i===0?'#899582':'#E7ECE3',26);out+=tx(d.tasks[i],rowX+18,yy+21,narrow?18:15,i===0?white:ink,'medium',-.2);out+=tx(d.minutes[i],rowX+18,yy+39,narrow?14:10,i===0?'#E4E9DD':muted);out+='</g>';}
  const dx=narrow?24:708,dy=narrow?968:452,dw=narrow?512:324,dh=narrow?196:310;
  out+=`<defs><linearGradient id="area" x2="0" y2="1"><stop stop-color="${lime}" stop-opacity=".35"/><stop offset="1" stop-color="${lime}" stop-opacity="0"/></linearGradient><clipPath id="focus-clip">${rect(dx,dy,dw,dh,'white',44)}</clipPath></defs>`;
  out+=rect(dx,dy,dw,dh,ink,44);out+=tx('Focus time',dx+26,dy+47,25,white,'sans',-.8);
  out+=tx(mix(CONFIG.days[state.from].hours,CONFIG.days[state.to].hours,e).toFixed(1),dx+26,dy+(narrow?121:132),narrow?66:77,white,'sans',-3.6);out+=tx('h',dx+(narrow?140:154),dy+(narrow?121:132),28,'#8C9785');
  out+=tx('Planned for today',dx+26,dy+(narrow?153:162),12,'#A7B39D');
  const gx=narrow?dx+230:dx,gy=narrow?dy+50:dy+174,gw=narrow?282:324,gh=narrow?146:136,level=mix(CONFIG.days[state.from].hours,CONFIG.days[state.to].hours,e)/6;
  const graph=`M${gx} ${gy+gh*.76}C${gx+gw*.16} ${gy+gh*.4} ${gx+gw*.24} ${gy+gh*.94} ${gx+gw*.38} ${gy+gh*.65}S${gx+gw*.48} ${gy+gh*(1-level)} ${gx+gw*.61} ${gy+gh*.29}S${gx+gw*.84} ${gy+gh*.63} ${gx+gw} ${gy+gh*.32}`;
  out+=`<g clip-path="url(#focus-clip)"><path d="${graph}L${gx+gw} ${gy+gh}H${gx}Z" fill="url(#area)"/>${path(graph,lime,3)}</g>`;
 }else{
  const image=photos.landscape||'',white='#F7FAF0';
  const frost=photos.frostedLandscape||image;
  const bg=`<image href="${xml(image)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;
  out+=`<defs><g id="land">${bg}</g><g id="frost-land"><image href="${xml(frost)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g><filter id="frost" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="14"/></filter><linearGradient id="shade"><stop stop-color="#0C211D" stop-opacity=".50"/><stop offset="1" stop-color="#0C211D" stop-opacity=".02"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#EFF5DB" stop-opacity=".28"/><stop offset="1" stop-color="#C6D6B3" stop-opacity=".13"/></linearGradient><linearGradient id="orb"><stop stop-color="#FFFFFF" stop-opacity=".50"/><stop offset=".5" stop-color="#9CB8B0" stop-opacity=".25"/><stop offset="1" stop-color="#F3E8B8" stop-opacity=".50"/></linearGradient></defs>`;
  out+='<use href="#land"/>'+rect(0,0,w,h,'url(#shade)');
  const glass=(id,x,y,gw,gh,rad=42)=>`<defs><clipPath id="${id}">${rect(x,y,gw,gh,'white',rad)}</clipPath></defs><g clip-path="url(#${id})"><use href="#frost-land"/>${rect(x,y,gw,gh,'#455842',rad,'opacity=".15"')}${rect(x,y,gw,gh,'url(#glass)',rad)}</g>${rect(x+.5,y+.5,gw-1,gh-1,'none',rad,'stroke="#F7FAF0" stroke-opacity=".30"')}`;
  out+=tx('MOSS',narrow?28:48,63,24,white,'medium',4);out+=tx('A LITTLE FURTHER. A LITTLE SLOWER.',w-(narrow?28:48),61,narrow?7.4:10,white,'sans',1,'end',.85);
  out+=tx('Take the',narrow?28:48,narrow?131:157,narrow?58:62,white,'sans',-2.7);out+=tx('scenic route.',narrow?28:48,narrow?194:220,narrow?58:62,white,'medium',-2.7);
  const transformPoint=([x,y])=>narrow?[(x-480)*.95+70,(y-230)*.9+215]:[x,y];
  const drawRoute=(id,amount,opacity)=>{const points=smoothPoints(CONFIG.routes[id].points).map(transformPoint),count=Math.max(2,Math.ceil((points.length-1)*amount)+1),visible=points.slice(0,count);const poly=visible.map(v=>v.join(',')).join(' '),last=visible.at(-1);let s=`<g opacity="${opacity}"><polyline points="${poly}" fill="none" stroke="#183C27" stroke-opacity=".35" stroke-width="8" stroke-linejoin="round"/><polyline points="${poly}" fill="none" stroke="#F2F8D3" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>`;
   s+=circle(...points[0],5,'#F4F9DD');
   for(let k=20;k<visible.length-10;k+=22)s+=circle(...points[k],2.5,'#F4F9DD');
   s+=circle(...last,31,'url(#orb)','stroke="#F7FAF0" stroke-opacity=".6" stroke-width="1.2"');
   s+=circle(...last,24,'none','stroke="#D6E9BC" stroke-opacity=".35"');
   s+=path(`M${last[0]-6} ${last[1]+11}v-22l16 3 -16 8`,white,1.8);return s+'</g>';};
  if(changing&&p<.26)out+=drawRoute(state.from,1,1-p/.26);
  out+=drawRoute(state.to,changing?ease((p-.12)/.76):1,changing?clamp(p/.2):1);
  const px=narrow?24:48,py=narrow?730:284,pw=narrow?512:384,ph=narrow?304:470;
  out+=glass('route-panel',px,py,pw,ph,48);
  if(!narrow){out+=tx('CHOOSE YOUR PACE',px+26,py+41,10,white,'sans',1.6);out+=tx('Three ways',px+26,py+86,33,white,'sans',-1.1);out+=tx('out there.',px+26,py+124,33,white,'medium',-1.1);}
  else out+=tx('CHOOSE YOUR PACE',px+24,py+28,11,white,'sans',1.4);
  const a=L.selectors[state.from],b=L.selectors[state.to],selectorY=mix(a[1],b[1],e);
  for(const[x,y,sw,sh]of L.selectors)out+=rect(x,y,sw,sh,'#F7FAF0',sh/2,'opacity=".065"');
  out+=rect(a[0],selectorY,a[2],a[3],'#EDF5DA',a[3]/2,'fill-opacity=".22" stroke="#F7FAF0" stroke-opacity=".48"');
  CONFIG.routes.forEach((route,i)=>{const[x,y,sw,sh]=L.selectors[i];out+=tx(route.name,x+22,y+31,narrow?23:21,white,'sans',-.6);out+=tx(`${route.distance} km  /  ${route.duration}`,x+22,y+55,11,white,'sans',.1,'start',.75);out+=circle(x+sw-39,y+sh/2,22,i===index?'#F7FAF0':'#F7FAF0',`fill-opacity="${i===index?.85:.1}"`);out+=path(`M${x+sw-45} ${y+sh/2+6}l12 -12m-12 0h12v12`,i===index?'#31482E':white,1.4);});
  const sx=narrow?24:648,sy=narrow?510:568,sw=narrow?512:384,sh=190;
  out+=glass('stats-panel',sx,sy,sw,sh,42);
  const route=CONFIG.routes[index],contentOpacity=changing?(p<.45?1-clamp(p/.3):clamp((p-.45)/.3)):1,shift=changing?(p<.45?-18*ease(p/.45):18*(1-ease((p-.45)/.4))):0;
  out+=`<g opacity="${contentOpacity}" transform="translate(0 ${shift})">`;
  out+=tx(route.name,sx+26,sy+37,16,white,'medium',-.2);out+=tx(route.distance,sx+24,sy+118,74,white,'sans',-4.0);out+=tx('km',sx+160,sy+115,21,white,'sans',-.4,'start',.7);
  out+=tx(`${route.duration}  /  ${route.rise} ascent`,sx+28,sy+155,12,white,'sans',.1,'start',.85);out+='</g>';
  const[saveX,saveY,saveW,saveH]=L.save;
  out+=circle(saveX+saveW/2,saveY+saveH/2,saveW/2,'url(#orb)','stroke="#F7FAF0" stroke-opacity=".6"');
  const hx=saveX+saveW/2,hy=saveY+saveH/2;
  out+=`<path d="M${hx} ${hy+10}C${hx-21} ${hy-2} ${hx-12} ${hy-20} ${hx} ${hy-9}C${hx+12} ${hy-20} ${hx+21} ${hy-2} ${hx} ${hy+10}Z" fill="${saved?white:'none'}" stroke="${white}" stroke-width="1.7"/>`;
  out+=tx(saved?'Saved':'Save route',hx,saveY+saveH+20,10,white,'sans',0,'middle');
  out+=tx('An imagined landscape. A real moment of pause.',narrow?28:48,h-25,narrow?10:11,white,'sans',.15,'start',.7);
 }
 return`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${kind==='kite'?'KITE weekly planner':'MOSS glass trail selector'}">${out}</svg>`;
}
