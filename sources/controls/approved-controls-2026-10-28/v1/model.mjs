export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
export const specs={
 solar:{number:206,slug:'solar-orbit-dial',title:'Solar — Cream Orbit Dial',w:680,h:950,bg:'#fcf8f1',category:'Controls & Selection'},
 bookmarks:{number:207,slug:'paper-bookmarks-popover',title:'Paper Bookmarks — Reading Popover',w:944,h:1130,bg:'#193e30',category:'Controls & Selection'},
 pocket:{number:208,slug:'file-pocket-dropzone',title:'File Pocket — Glass Dropzone',w:1000,h:800,bg:'#eaf0f4',category:'Controls & Selection'},
 dates:{number:209,slug:'trip-dates-range-picker',title:'Trip Dates — Coastal Range Picker',w:855,h:978,bg:'#d3e3ee',category:'Controls & Selection'}
};
export const bookmarks=[
 {id:'quiet',title:'The quiet morning',page:24,excerpt:'The morning had room for one small thought. I opened the window, put the kettle on and left the rest of the day unwritten.'},
 {id:'begin',title:'A place to begin',page:68,excerpt:'A beginning can be a quiet thing: one clear desk, one sentence, one step toward a place you have not yet been.'},
 {id:'little',title:'Little things',page:103,excerpt:'The little things were already here. A warm cup, a marked page, the light moving slowly across the floor.'}
];
export function volumeAt(x,y,previous=67){let a=(Math.atan2(y-395,x-340)*180/Math.PI+360)%360;if(a<135)a+=360;if(a>405)return a<450?100:0;return Math.round(clamp((a-135)/270)*100);}
export function setVolume(s,value){const n=Number(value);if(!Number.isFinite(n))return s;const v=Math.round(clamp(n,0,100));return {...s,value:v,lastNonzero:v||s.lastNonzero||67,muted:v===0};}
export function toggleMute(s){return s.muted?setVolume(s,s.lastNonzero||67):{...s,muted:true};}
export function selectBookmark(items,id){if(!items.some(x=>x.id===id))throw Error('Unknown bookmark.');return id;}
export function validItems(items){if(!Array.isArray(items)||!items.length||items.length>3||new Set(items.map(x=>x.id)).size!==items.length||items.some(x=>!x.id||!x.title||!Number.isInteger(x.page)||x.page<1))throw Error('Supply one to three unique bookmarks with a title and positive page.');return items.map(x=>({...x}));}
export const MAX_BYTES=20*1024*1024;
export async function inspectFiles(files){
 if(!files.length)throw Error('Choose a file first.');if(files.length>3)throw Error('Choose up to three files at a time.');
 const result=[];for(const f of files){if(!f.size||f.size>MAX_BYTES)throw Error(`${f.name}: use a non-empty file up to20 MB.`);const b=new Uint8Array(await f.slice(0,8).arrayBuffer()),ext=f.name.split('.').pop().toLowerCase();
  const type=ext==='pdf'&&[37,80,68,70,45].every((n,i)=>b[i]===n)?'application/pdf':ext==='png'&&[137,80,78,71,13,10,26,10].every((n,i)=>b[i]===n)?'image/png':['jpg','jpeg'].includes(ext)&&b[0]===255&&b[1]===216&&b[2]===255?'image/jpeg':null;
  if(!type||(f.type&&f.type!==type))throw Error(`${f.name}: choose a valid PDF, PNG or JPG.`);result.push({file:f,name:f.name,type,bytes:f.size});
 }return result;
}
const DAY=86400000;
export function day(key){if(!/^\d{4}-\d{2}-\d{2}$/.test(key))throw Error('Use an ISO calendar date.');const n=Date.parse(key+'T00:00:00Z')/DAY;if(!Number.isInteger(n)||keyOf(n)!==key)throw Error('Invalid date.');return n;}
export const keyOf=n=>new Date(n*DAY).toISOString().slice(0,10);
export const moveDay=(key,n)=>keyOf(day(key)+n);
export const weekOf=key=>{const n=day(key),weekday=(new Date(n*DAY).getUTCDay()+6)%7;return keyOf(n-weekday);};
export function chooseDate(s,key){day(key);if(!s.start||s.end)return {...s,start:key,end:null,error:''};if(s.start===key)return {...s,error:'Choose a different departure day.'};return {...s,start:key<s.start?key:s.start,end:key<s.start?s.start:key,error:''};}
export function commitRange(s){if(!s.start||!s.end||s.end<=s.start)throw Error('Choose both arrival and departure.');return {start:s.start,end:s.end,nights:day(s.end)-day(s.start)};}
export const initialState=kind=>kind==='solar'?{value:67,lastNonzero:67,muted:false}:kind==='bookmarks'?{selected:'begin',open:true,items:bookmarks}:kind==='pocket'?{phase:'idle',files:[],drag:false,error:'',progress:null}:{week:'2026-09-14',start:'2026-09-17',end:'2026-09-20',error:'',applied:null};
export function geometry(kind,narrow=false){if(kind==='pocket'&&narrow)return {...specs[kind],w:640,h:910,mobile:true,plus:{x:541,y:44,w:72,h:72},choose:{x:40,y:785,w:560,h:105}};if(kind==='dates'){const rows=narrow?2:1;return {...specs[kind],h:978+(rows-1)*160,rows,days:Array.from({length:7},(_,i)=>({x:narrow?55+(i%4)*187:55+i*112,y:723+Math.floor(i/(narrow?4:7))*160,w:96,h:96})),prev:{x:53,y:580,w:74,h:74},next:{x:731,y:580,w:74,h:74},apply:{x:630,y:874+(rows-1)*160,w:175,h:85}};}
 return {...specs[kind]};}
// Authored, isolated video timelines. They never invoke component callbacks.
export function previewState(kind,t){const s=initialState(kind);if(t<1||t>=8.9)return s;const e=(a,b)=>ease((t-a)/(b-a));
 if(kind==='solar'){let value=67;if(t<2.8)value=67+25*e(1.2,2.8);else if(t<4.8)value=92-60*e(3.2,4.8);else if(t<6.3)value=32;else value=32+35*e(7,8.5);return {...s,value,muted:t>=5.25&&t<6.35};}
 if(kind==='bookmarks'){const selected=t<2?'begin':t<3.8?'quiet':t<5.7?'little':'begin',selectionIndex=t<2?1:t<2.65?1-e(2,2.65):t<3.8?0:t<4.45?2*e(3.8,4.45):t<5.7?2:t<6.35?2-e(5.7,6.35):1,openFraction=t<6.15?1:t<6.8?1-e(6.15,6.8):t<7.1?0:e(7.1,7.75);return {...s,selected,selectionIndex,open:!(t>=6.15&&t<7.1),openFraction};}
 if(kind==='pocket'){if(t<2)return {...s,drag:t>1.3};if(t<3.4)return {...s,phase:'checking',drop:e(2,2.7)};if(t<7.1)return {...s,phase:'ready',files:[{name:'Coastal notes.pdf',bytes:645,type:'application/pdf'}],drop:1};return {...s,reset:1-e(7.1,8.5)};}
 if(t<2)return s;if(t<3.2)return {...s,start:'2026-09-15',end:null};if(t<6.6)return {...s,start:'2026-09-15',end:'2026-09-19',rangeProgress:e(3.2,3.85),applyPulse:t>4.8&&t<5.45?Math.sin((t-4.8)/.65*Math.PI):0,applied:t>4.8?{start:'2026-09-15',end:'2026-09-19',nights:4}:null};return s;
}
export function pointerAt(kind,t){
 const s=specs[kind],scale=Math.min(1420/s.w,900/s.h),ox=(1600-s.w*scale)/2,oy=(1000-s.h*scale)/2,point=(x,y)=>[ox+x*scale,oy+y*scale],off=[1530,1030];
 const position=value=>point(340+300*Math.cos((135+2.7*value)*Math.PI/180),395+300*Math.sin((135+2.7*value)*Math.PI/180));
 if(kind==='solar'&&((t>=1.2&&t<=2.8)||(t>=3.2&&t<=4.8)||(t>=7&&t<=8.5))){const p=position(previewState(kind,t).value);return{x:p[0],y:p[1],pressed:true};}
 const handle=position(67),high=position(92),low=position(32),mute=point(340,855),row1=point(470,520),row3=point(470,870),read=point(700,1020),open=point(470,480),drop=point(500,350),review=point(780,700),date1=point(55+112+48,763),date2=point(55+5*112+48,763),apply=point(770,906);
 const paths={solar:[[.6,...off],[1.15,...handle],[2.85,...high],[3.15,...high],[4.85,...low],[5.2,...mute],[6.4,...mute],[7,...low],[8.45,...handle],[8.8,...off]],bookmarks:[[.6,...off],[1.8,...row1],[2.6,...row1],[3.6,...row3],[4.4,...row3],[5.5,...read],[6.4,...read],[7.1,...open],[7.6,...open],[8.8,...off]],pocket:[[.6,...off],[1.3,...point(700,180)],[2.25,...drop],[3.5,...review],[6.3,...review],[8.8,...off]],dates:[[.6,...off],[1.8,...date1],[2.4,...date1],[3,...date2],[3.7,...date2],[4.7,...apply],[5.6,...apply],[8.8,...off]]};
 if(t<=.6||t>=8.8)return{x:off[0],y:off[1],pressed:false};const a=paths[kind];let i=0;while(i<a.length-2&&t>a[i+1][0])i++;const p=a[i],q=a[i+1],f=ease((t-p[0])/(q[0]-p[0]));return{x:p[1]+(q[1]-p[1])*f,y:p[2]+(q[2]-p[2])*f-18*Math.sin(Math.PI*f),pressed:({solar:[5.4,6.4],bookmarks:[1.95,3.8,7.2],pocket:[2.25],dates:[2,3.2,4.9]}[kind]).some(v=>Math.abs(t-v)<.09)};
}
