import {products,money,clamp} from './model.mjs';
import {paths} from './icons.mjs';
export const W=1600,H=1000;
const ink='#10162b';
function round(c,x,y,w,h,r,fill){if(w<=0||h<=0)return;c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}}
function text(c,s,x,y,size=16,color=ink,bold=false,align='left'){c.fillStyle=color;c.font=`${bold?'700':'500'} ${size}px "Pocket Sans"`;c.textBaseline='top';c.textAlign=align;c.fillText(s,x,y);}
function glyph(c,name,x,y,size=24,color=ink){c.save();c.translate(x,y);c.scale(size/24,size/24);const p=new Path2D(paths[name]||paths.Objects);c.strokeStyle=color;c.fillStyle=color;c.lineWidth=1.6;c.lineCap='round';c.lineJoin='round';if(name==='star')c.fill(p);else c.stroke(p);c.restore();}
function image(c,im,x,y,w,h,bg,r=20){c.save();round(c,x,y,w,h,r,bg);c.clip();const k=Math.min(w/im.width,h/im.height),iw=im.width*k,ih=im.height*k;c.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);c.restore();}
function pill(c,label,x,y,w,h,arrow=false){round(c,x,y,w,h,h/2,'#fff');text(c,label,x+w/2-(arrow?8:0),y+(h-16)/2,15,ink,true,'center');if(arrow)glyph(c,'diagonal',x+w-35,y+(h-18)/2,18);}
export function paint(c,frame,assets,{pointer=true}={}){
 c.clearRect(0,0,W,H);c.fillStyle='#f3f5f6';c.fillRect(0,0,W,H);
 const p=clamp(frame.open),main=584-432*(1-p),mw=W-main-28;
 glyph(c,'star',main+2,42,30);text(c,'F O R M A',main+48,43,22,ink,true);
 text(c,'Objects',W-445,46,17);text(c,'Collections',W-324,46,17);text(c,'About',W-183,46,17);round(c,W-90,22,60,60,30,'#ebeff2');glyph(c,'search',W-72,41,22);
 round(c,main+17,124,6,132,3,'#ffd57f');text(c,'Objects for',main+45,116,80,ink,true);text(c,'everyday living.',main+45,191,80,ink,true);text(c,'Thoughtfully made. Quietly distinctive.',main+45,283,25,'#8190a7');
 c.save();round(c,main,348,mw,362,28);c.clip();const hg=c.createLinearGradient(main,348,W,650);hg.addColorStop(0,'#5b8d9d');hg.addColorStop(.55,'#86afba');hg.addColorStop(1,'#c3d4d2');c.fillStyle=hg;c.fillRect(main,348,mw,362);const fg=c.createLinearGradient(0,634,0,710);fg.addColorStop(0,'#c1c9c6');fg.addColorStop(1,'#d4d7d2');c.fillStyle=fg;c.fillRect(main,634,mw,76);const chairW=mw*.57;image(c,assets['arc-chair'],main+mw-chairW-mw*.02,348-362*.18,chairW,362*1.15);c.restore();
 text(c,'THE EVERYDAY COLLECTION',main+50,428,12,'#fff',true);text(c,'A little more',main+50,467,50,'#fff',true);text(c,'room to unwind.',main+50,516,50,'#fff',true);pill(c,'Explore objects',main+50,592,220,56);glyph(c,'arrow',main+230,610,20);
 const gap=16,cw=(mw-2*gap)/3;
 products.forEach((r,i)=>{const x=main+i*(cw+gap),y=726;round(c,x,y,cw,254,24,'#fff');image(c,assets[r.id],x,y,cw,190,r.color,24);text(c,r.category,x+24,y+211,20,ink,true);round(c,x+cw-65,y+198,44,44,22,'#eff2f5');glyph(c,'Saved',x+cw-53,y+210,20);if(frame.state.saved.includes(r.id)){c.save();c.translate(x+cw-53,y+210);c.scale(20/24,20/24);c.fillStyle=ink;c.fill(new Path2D(paths.Saved));c.restore();}});
 // The navigation and expanded collection use the same canonical dimensions as the native component.
 round(c,28,18,94,964,28,'#fff');glyph(c,'star',60,53,30);round(c,32,18+124+frame.indicator*112,86,112,27,ink);
 const names=['Discover','Objects','Saved','Compare','Bag'];names.forEach((name,i)=>{const active=(frame.state.mode==='Saved'&&i===2)||(frame.state.mode==='Compare'&&i===3)||(frame.state.mode==='Bag'&&i===4),color=active?'#fff':'#1a2440',y=18+124+i*112;glyph(c,name,61,y+24,29,color);text(c,name,75,y+63,13,color,false,'center');if(name==='Saved')text(c,String(frame.state.saved.length).padStart(2,'0'),75,y+82,13,color,false,'center');});
 round(c,53,824,44,44,22,'#f1f3f5');glyph(c,'back',65,836,20);glyph(c,'help',65,904,21,'#748198');text(c,'Help',75,937,12,'#748198',false,'center');
 c.save();round(c,132,18,420*p,964,28);c.clip();c.translate(-24*(1-p),0);c.globalAlpha=clamp(p*2);
 const pg=c.createLinearGradient(132,18,552,982);pg.addColorStop(0,'#59bcd1');pg.addColorStop(.48,'#67b3c3');pg.addColorStop(1,'#a8cdc4');round(c,132,18,420,964,28,pg);
 text(c,'Y O U R  S P A C E',166,63,12,'#fff',true);text(c,'Your',164,88,60,'#fff',true);text(c,'collection',164,144,60,'#fff',true);round(c,474,48,52,52,26,'#ffffff28');glyph(c,'close',490,64,20,'#fff');
 c.strokeStyle='#ffffff94';c.lineWidth=1;round(c,164,226,300,50,25);c.stroke();round(c,164+150*frame.compare,226,150,50,25,'#fff');text(c,'Saved',239,243,15,frame.compare>.5?'#fff':ink,true,'center');text(c,'Compare',389,243,15,frame.compare>.5?ink:'#fff',false,'center');
 const saved=frame.state.saved.map(id=>products.find(r=>r.id===id));
 c.save();c.globalAlpha*=1-clamp(frame.compare);saved.forEach((r,i)=>{const y=300+i*158;round(c,152,y,380,148,24,'#fff');image(c,assets[r.id],166,y+14,150,122,r.color,19);text(c,r.name,334,y+51,20,ink,true);text(c,money(r.price),334,y+79,18,'#68758e');glyph(c,'close',498,y+14,16,'#68758e');});
 c.strokeStyle='#ffffffdd';c.lineWidth=1;c.setLineDash([5,5]);round(c,154,781,376,102,23);c.stroke();c.setLineDash([]);round(c,324,795,34,34,17,'#ffffff22');glyph(c,'plus',329,800,24,'#fff');text(c,'Drop an object here',342,846,14,'#fff',false,'center');c.restore();
 c.save();c.globalAlpha*=clamp(frame.compare);round(c,152,300,380,568,24,'#fff');const cols=saved.length||1,tw=352/cols;saved.forEach((r,i)=>{const x=166+i*tw;image(c,assets[r.id],x+3,314,tw-6,100,r.color,12);text(c,r.name,x+tw/2,427,13,ink,true,'center');text(c,money(r.price),x+tw/2,448,13,ink,false,'center');});[['MATERIAL','material',487],['DIMENSIONS','dimensions',581],['FINISH','finish',675]].forEach(([label,key,y])=>{text(c,label,168,y,11,'#718096');saved.forEach((r,i)=>text(c,r[key],166+i*tw+tw/2,y+35,12,ink,false,'center'));c.strokeStyle='#e8ecee';c.beginPath();c.moveTo(166,y+69);c.lineTo(518,y+69);c.stroke();});saved.forEach((r,i)=>text(c,'Remove',166+i*tw+tw/2,791,11,'#68758e',false,'center'));c.restore();
 pill(c,'Open collection',156,904,372,56,true);c.restore();
 const po=frame.pointer;if(frame.drag){c.save();c.globalAlpha=.88;round(c,po.x-40,po.y-38,80,80,18,'#fff');image(c,assets[frame.drag],po.x-36,po.y-34,72,72,'#eeeae4',14);c.restore();}
 if(pointer){c.save();c.translate(po.x,po.y);c.shadowColor='#10162b55';c.shadowBlur=4;c.shadowOffsetY=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,25);c.lineTo(7,18);c.lineTo(13,29);c.lineTo(17,27);c.lineTo(11,17);c.lineTo(21,17);c.closePath();c.fillStyle=po.pressed?'#dff7ff':'#fff';c.fill();c.strokeStyle=ink;c.lineWidth=1.5;c.stroke();c.restore();}
}
