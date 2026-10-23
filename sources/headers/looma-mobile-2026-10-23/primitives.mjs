// Authored reconstruction from a supplied still. No original source was supplied.
export const names=['Shop','New In','Room Sets','Lighting','Decor','Journal','About'];
export const categories=['All categories','Lighting','Decor','Furniture'];
export const products=[
 {id:'arc-lamp',name:'Arc Table Lamp',category:'Lighting',price:48,shape:'lamp'},
 {id:'sunrise-vase',name:'Sunrise Vase',category:'Decor',price:38,shape:'vase'},
 {id:'orbit-shelf',name:'Orbit Shelf',category:'Furniture',price:128,shape:'shelf'},
 {id:'linen-shade',name:'Linen Shade',category:'Lighting',price:64,shape:'lamp'},
 {id:'pebble-vase',name:'Pebble Vase',category:'Decor',price:32,shape:'vase'},
 {id:'halo-pendant',name:'Halo Pendant',category:'Lighting',price:96,shape:'lamp'},
];
export const specs={classic:{title:'Looma Living — Classic Header',seconds:12,initial:0},search:{title:'Looma Living — Large Search Header',seconds:12,initial:0},minimal:{title:'Looma Living — Minimal Header',seconds:10,initial:1}};
export const C={ink:'#10113f',muted:'#637391',blue:'#42a3ed',pale:'#e1f3ff',yellow:'#ffd464',field:'#eaf0f8',bg:'#97d8fa',house:'#235b7b'};
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=v=>1-(1-clamp(v))**4;
export const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function initial(mode){return {mode,active:specs[mode].initial,marker:specs[mode].initial,panel:'',reveal:0,query:'',category:0,highlight:-1,selected:'',cart:mode==='minimal'?{}:{'sunrise-vase':1,'orbit-shelf':1},cartPage:0,pulse:0,hover:-1,cursorA:0,cursorX:0,cursorY:0,click:0};}
export const cartCount=s=>Object.values(s.cart).reduce((n,v)=>n+v,0);
export const subtotal=s=>products.reduce((n,p)=>n+p.price*(s.cart[p.id]||0),0);
export const cartItems=s=>{const all=products.filter(p=>s.cart[p.id]),pages=Math.max(1,Math.ceil(all.length/3));return all.slice((s.cartPage%pages)*3,(s.cartPage%pages)*3+3);};
export function results(s){const q=s.query.toLowerCase().trim().replace(/lamps/g,'lamp').replace(/vases/g,'vase').replace(/shelves/g,'shelf');return products.filter(p=>(!s.category||p.category===categories[s.category])&&(!q||q.split(/\s+/).every(w=>(p.name+' '+p.category).toLowerCase().includes(w))));}
export function reduce(s,a){const n={...s,cart:{...s.cart}};switch(a.type){
 case 'panel':n.panel=s.panel===a.panel?'':a.panel;n.highlight=-1;break;
 case 'close':n.panel='';n.highlight=-1;break;
 case 'nav':n.active=a.index;n.category=0;n.panel=a.index===0&&s.mode==='classic'?(s.panel==='catalog'?'':'catalog'):'';n.selected='';break;
 case 'catalog':n.active=a.index;n.category=a.category||0;n.panel='';n.selected='';break;
 case 'query':n.query=a.value;n.panel='search';n.highlight=-1;n.selected='';break;
 case 'category':n.category=a.index;n.panel='search';n.highlight=-1;break;
 case 'highlight':{const len=Math.min(4,results(n).length);n.highlight=len?((a.index%len)+len)%len:-1;break;}
 case 'product':n.selected=a.id;n.query=products.find(p=>p.id===a.id)?.name||'';n.panel='product';n.highlight=-1;break;
 case 'add':n.cart[a.id]=(n.cart[a.id]||0)+1;break;
 case 'qty':n.cart[a.id]=Math.max(0,(n.cart[a.id]||0)+a.delta);if(!n.cart[a.id])delete n.cart[a.id];break;
 case 'remove':delete n.cart[a.id];break;
 case 'cartpage':n.cartPage++;break;
 case 'reset':return initial(s.mode);
 }return n;}
const r=(x,y,w,h,fill,rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const text=(x,y,str,size=16,weight=400,fill=C.ink,anchor='start',extra='')=>`<text x="${x}" y="${y}" font-family="${weight>=600?'Manrope SemiBold':'Manrope'}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(str)}</text>`;
export function logo(x=0,y=0,k=1,wordmark=true){return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M5 62V28Q5 19 12 14L29 1Q34-3 40 2L57 15Q64 20 64 29V62" fill="none" stroke="${C.house}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 62Q9 45 17 28Q34 32 35 62Z" fill="#45a4e3"/><path d="M39 62Q36 36 67 35L67 48Q67 62 54 62Z" fill="url(#sun)"/>${wordmark?text(83,47,'Looma Living',33,600):''}</g>`;}
export function icon(name,x,y,size=28,fill='none'){const paths={search:'<circle cx="11" cy="11" r="7.5"/><path d="m16.8 16.8 5 5"/>',heart:'<path d="M12 21S2 14.8 2 8.3C2 2.2 9.3 1 12 6c2.7-5 10-3.8 10 2.3C22 14.8 12 21 12 21Z"/>',account:'<circle cx="12" cy="6.5" r="4"/><path d="M3.2 21v-1.7c0-7 17.6-7 17.6 0V21Z"/>',bag:'<path d="M4.5 7.5h15L21 21H3L4.5 7.5Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',arrow:'<path d="m8 5 7 7-7 7"/>',menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',check:'<path d="m4 12 5 5 11-11"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',down:'<path d="m5 9 7 7 7-7"/>'};return `<g transform="translate(${x-size/2} ${y-size/2}) scale(${size/24})" fill="${fill}" stroke="${C.ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths[name]||''}</g>`;}
export function productArt(shape,x,y,size=80){return `<g transform="translate(${x} ${y}) scale(${size/100})">${r(0,0,100,100,'#f2f6fa',18)}${shape==='lamp'?'<ellipse cx="51" cy="85" rx="28" ry="5" fill="#dae0e8"/><path d="M48 44h7v36h-7z" fill="#c58d3b"/><path d="M22 47Q24 12 51 12Q78 12 81 47Z" fill="#edc46b"/><path d="M26 47h51" stroke="#b88734" stroke-width="3"/><ellipse cx="52" cy="79" rx="23" ry="5" fill="#ddb463"/>':shape==='vase'?'<ellipse cx="51" cy="87" rx="26" ry="4" fill="#dae0e8"/><path d="M41 15h21l-4 19q22 21 15 44q-2 11-22 11T28 78q-7-22 16-44Z" fill="#f5ddab"/><path d="M42 17h19M35 60q15-9 32 0" fill="none" stroke="#dfbd84" stroke-width="3"/>':'<path d="M19 24h65v58H19z" fill="#c79058"/><path d="M24 29h55v48H24z" fill="#efd7b3"/><path d="M24 52h55M51 29v48" stroke="#c79058" stroke-width="5"/><path d="M24 82v9m54-9v9" stroke="#876344" stroke-width="5"/>'}</g>`;}

export {r,text};
