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
export function geometry(mode,mobile=false){
 const search=mode==='search',minimal=mode==='minimal';
 const g=mobile?{w:390,h:760,mobile:true,header:{x:16,y:44,w:358,h:search?142:78},logo:{x:83,y:63,scale:.62},icons:search?{bag:337}:{search:288,bag:337},nav:[],search:search?{x:69,y:142,w:175,h:42}:null,category:search?{x:252,y:142,w:104,h:42}:null}:{w:1440,h:810,mobile:false,header:{x:56,y:166,w:1328,h:minimal?114:126},logo:{x:minimal?98:104,y:minimal?193:196,scale:minimal?.94:1},icons:search?{heart:1208,account:1269,bag:1330}:minimal?{search:1210,heart:1274,bag:1338}:{search:1147,heart:1208,account:1269,bag:1330},nav:search?[]:(minimal?[460,558,687,811,919,1012,1112]:[470,552,666,774,868,956,1048]),search:search?{x:497,y:203,w:452,h:56}:null,category:search?{x:977,y:203,w:165,h:56}:null};
 g.cy=mobile?83:g.header.y+g.header.h/2;
 if(!search)g.search=mobile?{x:55,y:200,w:275,h:46}:{x:660,y:371,w:628,h:54};
 if(mobile)g.panel={x:16,y:search?202:138,w:358,h:480};
 else if(search)g.panel={x:420,y:309,w:735,h:402};
 else g.panel={x:Math.min(mode==='minimal'?650:590,970),y:g.header.y+g.header.h+17,w:738,h:408};
 if(!mobile&&g.panel.x+g.panel.w>1384)g.panel.x=1384-g.panel.w;
 return g;
}
const r=(x,y,w,h,fill,rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const text=(x,y,str,size=16,weight=400,fill=C.ink,anchor='start',extra='')=>`<text x="${x}" y="${y}" font-family="${weight>=600?'Manrope SemiBold':'Manrope'}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(str)}</text>`;
export function logo(x=0,y=0,k=1,wordmark=true){return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M5 62V28Q5 19 12 14L29 1Q34-3 40 2L57 15Q64 20 64 29V62" fill="none" stroke="${C.house}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 62Q9 45 17 28Q34 32 35 62Z" fill="#45a4e3"/><path d="M39 62Q36 36 67 35L67 48Q67 62 54 62Z" fill="url(#sun)"/>${wordmark?text(83,47,'Looma Living',33,600):''}</g>`;}
export function icon(name,x,y,size=28,fill='none'){const paths={search:'<circle cx="11" cy="11" r="7.5"/><path d="m16.8 16.8 5 5"/>',heart:'<path d="M12 21S2 14.8 2 8.3C2 2.2 9.3 1 12 6c2.7-5 10-3.8 10 2.3C22 14.8 12 21 12 21Z"/>',account:'<circle cx="12" cy="6.5" r="4"/><path d="M3.2 21v-1.7c0-7 17.6-7 17.6 0V21Z"/>',bag:'<path d="M4.5 7.5h15L21 21H3L4.5 7.5Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',arrow:'<path d="m8 5 7 7-7 7"/>',menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',check:'<path d="m4 12 5 5 11-11"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',down:'<path d="m5 9 7 7 7-7"/>'};return `<g transform="translate(${x-size/2} ${y-size/2}) scale(${size/24})" fill="${fill}" stroke="${C.ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths[name]||''}</g>`;}
export function productArt(shape,x,y,size=80){return `<g transform="translate(${x} ${y}) scale(${size/100})">${r(0,0,100,100,'#f2f6fa',18)}${shape==='lamp'?'<ellipse cx="51" cy="85" rx="28" ry="5" fill="#dae0e8"/><path d="M48 44h7v36h-7z" fill="#c58d3b"/><path d="M22 47Q24 12 51 12Q78 12 81 47Z" fill="#edc46b"/><path d="M26 47h51" stroke="#b88734" stroke-width="3"/><ellipse cx="52" cy="79" rx="23" ry="5" fill="#ddb463"/>':shape==='vase'?'<ellipse cx="51" cy="87" rx="26" ry="4" fill="#dae0e8"/><path d="M41 15h21l-4 19q22 21 15 44q-2 11-22 11T28 78q-7-22 16-44Z" fill="#f5ddab"/><path d="M42 17h19M35 60q15-9 32 0" fill="none" stroke="#dfbd84" stroke-width="3"/>':'<path d="M19 24h65v58H19z" fill="#c79058"/><path d="M24 29h55v48H24z" fill="#efd7b3"/><path d="M24 52h55M51 29v48" stroke="#c79058" stroke-width="5"/><path d="M24 82v9m54-9v9" stroke="#876344" stroke-width="5"/>'}</g>`;}
function marker(g,index){if(!g.nav.length)return '';const i=Math.floor(index),j=Math.min(i+1,g.nav.length-1),f=index-i;const widths=g.mobile?[]:[80,92,120,104,86,94,90];const w=widths[i]+((widths[j]||widths[i])-widths[i])*f,x=g.nav[i]+((g.nav[j]||g.nav[i])-g.nav[i])*f;return r(x-w/2,g.cy-28,w,56,g.mode==='minimal'?C.pale:'url(#blue)',22);}
function panelBox(s,g){const p={...g.panel};if(s.panel==='catalog'&&!g.mobile){p.x=430;p.w=720;p.h=340;}if(s.panel==='category'){p.x=g.mobile?80:977;p.w=g.mobile?294:230;p.h=234;}if(s.panel==='wishlist'||s.panel==='cart'||s.panel==='account'||s.panel==='orders'){p.x=g.mobile?16:(g.rightEdge||1384)-450;p.w=g.mobile?358:450;p.h=s.panel==='cart'?490:390;}if(s.panel==='mobilemenu')p.h=(g.navCount===5?292:458);if(s.panel==='search')p.h=(s.mode==='search'?58:156)+Math.max(1,Math.min(4,results(s).length))*(g.mobile?70:76)+28;return p;}
export function panelGeometry(s,g){return panelBox(s,g);}
function rowPositions(s,g){const p=panelBox(s,g),search=s.panel==='search',top=p.y+(search?(s.mode==='search'?58:156):70),rh=g.mobile?70:76;return {p,top,rh};}
function panel(s,g){if(!s.panel||s.reveal<.001)return '';const p=panelBox(s,g),m=g.mobile,px=p.x,py=p.y,w=p.w;let out=r(px,py,w,p.h,'#fff',28,'filter="url(#shadow)"');const close=()=>icon('close',px+w-30,py+30,20);
 if(s.panel==='catalog'){
  out+=text(px+28,py+38,'Find your next favourite',20,600)+close();
  const cats=['Lighting','Decor','Furniture'];const boxw=(w-72)/3;
  cats.forEach((name,i)=>{const x=px+24+i*(boxw+12);out+=productArt(['lamp','vase','shelf'][i],x,py+65,boxw)+text(x+8,py+65+boxw+32,name,16,600)+icon('arrow',x+boxw-16,py+65+boxw+26,18);});
 }else if(s.panel==='category'){
  categories.forEach((name,i)=>{const y=py+18+i*49;out+=r(px+10,y,w-20,44,s.category===i?C.pale:'#fff',14)+text(px+24,y+28,name,15,s.category===i?600:400);if(s.category===i)out+=icon('check',px+w-30,y+22,18);});
 }else if(s.panel==='search'){
  if(s.mode!=='search'){out+=text(px+24,py+36,'Find something lovely',19,600)+close()+r(g.search.x-18,g.search.y-2,g.search.w+36,g.search.h+4,C.field,25)+icon('search',g.search.x,g.search.y+g.search.h/2,22);if(!g.native)out+=text(g.search.x+26,g.search.y+g.search.h/2+6,s.query||'Search lamps, vases, shelves…',16,400,s.query?C.ink:C.muted);}
  const {top,rh}=rowPositions(s,g),found=results(s).slice(0,m?4:4);
  out+=text(px+24,top-16,s.query?`${results(s).length} matching pieces`:'Popular pieces',13,600,C.muted);
  if(!found.length)out+=text(px+24,top+44,'No pieces found. Try “lamp” or “vase”.',m?13:17,400,C.muted);
  found.forEach((item,i)=>{const y=top+i*rh;if(s.highlight===i)out+=r(px+12,y-5,w-24,rh-4,C.pale,16);out+=productArt(item.shape,px+24,y+3,54)+text(px+92,y+25,item.name,m?14:17,600)+text(px+92,y+48,item.category,12,400,C.muted)+text(px+w-28,y+33,`$${item.price}`,16,600,C.ink,'end');});
 }else if(s.panel==='wishlist'){
  out+=text(px+24,py+42,'Saved pieces',22,600)+close();const a=products[0];out+=productArt(a.shape,px+24,py+76,90)+text(px+134,py+107,a.name,m?15:17,600)+text(px+134,py+136,'$48',16,400,C.muted);out+=r(px+24,py+196,w-48,52,s.cart[a.id]?C.pale:C.yellow,22)+text(px+w/2,py+229,s.cart[a.id]?'Added to bag':'Move to bag',16,600,C.ink,'middle')+text(px+24,py+296,'Your favourites, in one place.',14,400,C.muted);
 }else if(s.panel==='cart'){
  out+=text(px+24,py+42,`Your bag · ${cartCount(s)}`,22,600)+close();const list=cartItems(s);
  list.forEach((item,i)=>{const y=py+76+i*91;out+=productArt(item.shape,px+24,y,65)+text(px+105,y+20,item.name,m?13:15,600)+text(px+105,y+44,`$${item.price}`,13,400,C.muted)+icon('minus',px+118,y+67,14)+text(px+150,y+72,String(s.cart[item.id]),14,600,C.ink,'middle')+icon('plus',px+182,y+67,14)+icon('close',px+w-28,y+17,16);});
  if(!list.length)out+=text(px+24,py+116,'Your bag is empty.',17,400,C.muted);
  if(Object.keys(s.cart).length>3)out+=text(px+w-24,py+372,'Next items →',13,600,C.ink,'end');
  out+=r(px+24,py+382,w-48,1,'#e8edf3')+text(px+24,py+418,'Subtotal',15,400,C.muted)+text(px+w-24,py+418,`$${subtotal(s)}`,23,600,C.ink,'end')+text(px+24,py+456,'Sample bag · totals update with quantity',m?11:13,400,C.muted);
 }else if(s.panel==='product'){
  const a=products.find(p=>p.id===s.selected)||products[0];out+=text(px+24,py+40,'A little more detail',20,600)+close();out+=productArt(a.shape,px+24,py+69,m?135:224)+text(px+(m?181:280),py+111,a.name,m?13:23,600)+text(px+(m?181:280),py+143,a.category,14,400,C.muted)+text(px+(m?181:280),py+184,`$${a.price}`,23,600);out+=r(px+24,py+(m?241:324),w-48,50,C.yellow,22)+text(px+w/2,py+(m?273:356),'Add to bag',16,600,C.ink,'middle');
 }else if(s.panel==='mobilemenu'){
  names.slice(0,g.navCount||7).forEach((name,i)=>{const y=py+20+i*48;out+=r(px+12,y,w-24,44,s.active===i?C.pale:'#fff',14)+text(px+28,y+28,name,16,s.active===i?600:400)+icon('arrow',px+w-30,y+22,17);});
 }else if(s.panel==='account'){
  out+=text(px+24,py+44,'Welcome home',23,600)+close()+text(px+24,py+82,'Your space at Looma Living',15,400,C.muted);['Saved pieces','Order LL–1024'].forEach((name,i)=>{out+=r(px+20,py+117+i*70,w-40,56,C.field,18)+text(px+38,py+152+i*70,name,16,600)+icon('arrow',px+w-40,py+146+i*70,18);});
 }else if(s.panel==='orders')out+=text(px+24,py+44,'Order LL–1024',22,600)+close()+productArt('vase',px+24,py+84,100)+text(px+147,py+119,'Sunrise Vase',16,600)+text(px+147,py+148,'On its way',15,400,C.muted)+text(px+24,py+245,'Sample order for this interactive reference.',m?12:14,400,C.muted);
 return `<g opacity="${s.reveal}" transform="translate(0 ${-10*(1-s.reveal)})">${out}</g>`;
}
export function svg(s,{mobile=false,native=false}={}){const g=geometry(s.mode,mobile);g.mode=s.mode;g.native=native;const {header:h}=g;let body=`<defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#48adf3"/><stop offset="1" stop-color="#3999e9"/></linearGradient><linearGradient id="sun" x2="0" y2="1"><stop stop-color="#ffe18a"/><stop offset="1" stop-color="#ffd05b"/></linearGradient><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#a2dffc"/><stop offset="1" stop-color="#83cdf4"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#2b6c99" flood-opacity=".12"/></filter></defs>${r(0,0,g.w,g.h,'url(#sky)')}<circle cx="${mobile?410:1170}" cy="${mobile?460:160}" r="${mobile?310:510}" fill="#fff" opacity=".13"/><circle cx="${mobile?-80:190}" cy="${mobile?740:1070}" r="${mobile?270:560}" fill="#fff" opacity=".10"/>${r(h.x,h.y,h.w,h.h,'#fff',mobile?27:40)}${logo(g.logo.x,g.logo.y,g.logo.scale)}`;
 if(mobile)body+=icon('menu',47,83,23);
 if(s.mode!=='search'&&!mobile){body+=marker(g,s.marker);names.forEach((name,i)=>body+=text(g.nav[i],g.cy+6,name,16,400,s.mode==='classic'&&Math.abs(s.marker-i)<.3?'#fff':C.ink,'middle'));}
 if(s.mode==='search'){body+=r(mobile?32:420,mobile?136:195,mobile?326:735,mobile?48:72,C.field,36)+icon('search',mobile?51:463,mobile?160:231,mobile?22:28);if(!native)body+=text(g.search.x,g.search.y+g.search.h/2+6,s.query||'Search lamps, vases, shelves…',mobile?13:17,400,s.query?C.ink:C.muted);body+=r(mobile?248:965,mobile?145:215,1,mobile?29:32,'#c9d8e8')+text(mobile?266:991,mobile?165:237,mobile?(s.category?categories[s.category]:'All'):categories[s.category],mobile?11:16)+icon('down',mobile?340:1130,mobile?160:231,mobile?12:16);if(s.query)body+=icon('close',mobile?225:933,mobile?160:231,mobile?15:17);}
 for(const [name,x]of Object.entries(g.icons)){const k=name==='bag'?1+.10*s.pulse:1;body+=`<g transform="translate(${x} ${g.cy}) scale(${k})">${icon(name,0,0,mobile?24:28)}</g>`;if(name==='bag'&&cartCount(s))body+=`<circle cx="${x+(mobile?12:15)}" cy="${g.cy-(mobile?15:20)}" r="${mobile?9:12}" fill="#ffb600"/>${text(x+(mobile?12:15),g.cy-(mobile?12:16),String(cartCount(s)),mobile?10:13,600,'#fff','middle')}`;}
 body+=panel(s,g);
 if(s.cursorA>0){body+=`<g opacity="${s.cursorA}" transform="translate(${s.cursorX} ${s.cursorY})">${s.click>0?`<circle r="${12+12*(1-s.click)}" fill="none" stroke="#275778" stroke-width="2" opacity="${s.click*.4}"/>`:''}<path d="m0 0 4 24 5-8 9 1Z" fill="#183c57" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></g>`;}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${g.w}" height="${g.h}" viewBox="0 0 ${g.w} ${g.h}" aria-hidden="true">${body}</svg>`;
}
export function controls(s,g){const out=[],add=(key,x,y,w,h,label,action,extra={})=>out.push({key,x,y,w,h,label,action,...extra});
 add('home',g.logo.x-2,g.logo.y-3,303*g.logo.scale,70*g.logo.scale,'Looma Living home',{type:'catalog',index:0});
 if(g.mobile)add('menu',25,61,44,44,'Open navigation',{type:'panel',panel:'mobilemenu'},{panel:'mobilemenu'});
 if(!g.mobile&&s.mode!=='search')names.forEach((name,i)=>add('nav-'+i,g.nav[i]-([80,84,120,104,86,94,90][i])/2,g.cy-28,[80,84,120,104,86,94,90][i],56,name,{type:'nav',index:i},{nav:i,panel:i===0&&s.mode==='classic'?'catalog':null}));
 for(const[name,x]of Object.entries(g.icons))add(name,x-22,g.cy-22,44,44,{search:'Open search',heart:'Saved pieces',bag:`Your bag, ${cartCount(s)} items`,account:'My account'}[name],{type:'panel',panel:{search:'search',heart:'wishlist',bag:'cart',account:'account'}[name]},{panel:{search:'search',heart:'wishlist',bag:'cart',account:'account'}[name]});
 if(s.mode==='search'){const b=g.category;add('category',b.x,b.y,b.w,b.h,`Category: ${categories[s.category]}`,{type:'panel',panel:'category'},{panel:'category'});if(s.query)add('clear',g.mobile?204:912,g.mobile?138:210,40,42,'Clear search',{type:'query',value:''});}
 if(!s.panel||s.reveal<.05)return out;const p=panelBox(s,g),m=g.mobile;
 if(!['mobilemenu','category'].includes(s.panel))add('close',p.x+p.w-52,p.y+8,44,44,'Close '+s.panel,{type:'close'});
 if(s.panel==='catalog'){
  const bw=(p.w-72)/3;['Lighting','Decor','Furniture'].forEach((name,i)=>add('catalog-'+i,p.x+24+i*(bw+12),p.y+65,bw,bw+48,name,{type:'catalog',index:i===0?3:i===1?4:0,category:i+1}));
 }
 if(s.panel==='category')categories.forEach((name,i)=>add('cat-'+i,p.x+10,p.y+18+i*49,p.w-20,44,name,{type:'category',index:i},{selected:s.category===i}));
 if(s.panel==='search'){const{top,rh}=rowPositions(s,g);results(s).slice(0,4).forEach((item,i)=>add('result-'+item.id,p.x+12,top-5+i*rh,p.w-24,rh-4,`${item.name}, $${item.price}`,{type:'product',id:item.id},{option:i,selected:s.highlight===i}));}
 if(s.panel==='wishlist')add('wishlist-add',p.x+24,p.y+196,p.w-48,52,s.cart['arc-lamp']?'Added to bag':'Move Arc Table Lamp to bag',{type:'add',id:'arc-lamp'},{disabled:!!s.cart['arc-lamp']});
 if(s.panel==='cart'){cartItems(s).forEach((item,i)=>{const y=p.y+76+i*91;add('minus-'+item.id,p.x+96,y+45,44,44,'Decrease '+item.name,{type:'qty',id:item.id,delta:-1});add('plus-'+item.id,p.x+160,y+45,44,44,'Increase '+item.name,{type:'qty',id:item.id,delta:1});add('remove-'+item.id,p.x+p.w-50,y-5,44,44,'Remove '+item.name,{type:'remove',id:item.id});});if(Object.keys(s.cart).length>3)add('cart-page',p.x+p.w-166,p.y+340,142,44,'Show next items in bag',{type:'cartpage'});}
 if(s.panel==='product')add('product-add',p.x+24,p.y+(m?241:324),p.w-48,50,'Add '+(products.find(p=>p.id===s.selected)?.name||'piece')+' to bag',{type:'add',id:s.selected});
 if(s.panel==='mobilemenu')names.slice(0,g.navCount||7).forEach((name,i)=>add('mobile-nav-'+i,p.x+12,p.y+20+i*48,p.w-24,44,name,{type:'catalog',index:i},{nav:i}));
 if(s.panel==='account'){add('account-saved',p.x+20,p.y+117,p.w-40,56,'Saved pieces',{type:'panel',panel:'wishlist'});add('account-order',p.x+20,p.y+187,p.w-40,56,'Order LL–1024',{type:'panel',panel:'orders'});}
 return out;
}
const open=(s,p,t,start)=>{s.panel=p;s.reveal=ease((t-start)/.26);};
const close=(s,t,start)=>{s.reveal=1-ease((t-start)/.18);if(t>=start+.18)s.panel='';};
const move=(s,a,b,t,start)=>{s.marker=a+(b-a)*ease((t-start)/.32);s.active=b;};
const pointer=(s,t,cues)=>{if(t<.4||t>specs[s.mode].seconds-.45)return;let prev={x:cues[0][1],y:cues[0][2],time:.4};for(const [at,x,y]of cues){if(t<at){const k=ease((t-prev.time)/Math.max(.1,at-prev.time));s.cursorX=prev.x+(x-prev.x)*k;s.cursorY=prev.y+(y-prev.y)*k;break;}prev={x,y,time:at};s.cursorX=x;s.cursorY=y;}s.cursorA=Math.min(ease((t-.4)/.2),1-ease((t-(specs[s.mode].seconds-.65))/.2));for(const[at]of cues)if(t>=at&&t<at+.24)s.click=1-(t-at)/.24;};
export function demo(mode,t){const s=initial(mode);if(mode==='classic'){
 if(t>=.9)open(s,'catalog',t,.9);if(t>=2.3){move(s,0,3,t,2.3);close(s,t,2.3);}if(t>=3.5)open(s,'wishlist',t,3.5);
 if(t>=4.7){s.cart['arc-lamp']=1;s.pulse=Math.sin(clamp((t-4.7)/.4)*Math.PI);}if(t>=5.8)open(s,'cart',t,5.8);if(t>=7.3){delete s.cart['arc-lamp'];s.pulse=Math.sin(clamp((t-7.3)/.4)*Math.PI);}if(t>=8.4)close(s,t,8.4);
 if(t>=9.6){move(s,3,0,t,9.6);open(s,'catalog',t,9.6);}if(t>=10.7)close(s,t,10.7);
 pointer(s,t,[[.9,470,229],[2.3,555,474],[3.5,1208,229],[4.7,1157,552],[5.8,1330,229],[7.3,1350,416],[8.4,1354,339],[9.6,470,229],[10.7,1122,339]]);
 }else if(mode==='search'){
 if(t>=.8)open(s,'search',t,.8);if(t>=1.2)s.query='lamp'.slice(0,Math.min(4,1+Math.floor((t-1.2)/.16)));
 if(t>=3)open(s,'category',t,3);if(t>=4.1){s.category=1;open(s,'search',t,4.1);}if(t>=5.4){s.query='Arc Table Lamp';s.selected='arc-lamp';open(s,'product',t,5.4);}
 if(t>=7.2){s.query='';s.selected='';open(s,'search',t,7.2);}if(t>=8.3)open(s,'category',t,8.3);if(t>=9.3){s.category=0;open(s,'search',t,9.3);}if(t>=10.4)close(s,t,10.4);
 pointer(s,t,[[.8,610,231],[1.2,610,231],[3,1080,231],[4.1,1070,403],[5.4,700,398],[7.2,933,231],[8.3,1080,231],[9.3,1070,354],[10.4,1200,600]]);
 }else{
 if(t>=1.2)move(s,1,2,t,1.2);if(t>=2.7)move(s,2,3,t,2.7);if(t>=4.1)move(s,3,4,t,4.1);if(t>=5.4)open(s,'wishlist',t,5.4);if(t>=6.8)close(s,t,6.8);if(t>=8.2)move(s,4,1,t,8.2);
 pointer(s,t,[[1.2,687,223],[2.7,811,223],[4.1,919,223],[5.4,1274,223],[6.8,1354,327],[8.2,558,223]]);
 }return s;}

export {panel,text,r};
