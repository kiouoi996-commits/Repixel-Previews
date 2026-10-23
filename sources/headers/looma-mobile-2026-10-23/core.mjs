import {initial as baseInitial,reduce as baseReduce,names,products,results,cartCount,subtotal,cartItems,clamp,ease,esc,C,r,text,logo,icon,productArt} from './primitives.mjs';
export {names,products,results,cartCount,subtotal,cartItems,esc,productArt};
export const specs={
 'classic-mobile':{title:'Looma Living — Classic Mobile Header',seconds:12},
 'large-search-mobile':{title:'Looma Living — Large Search Mobile Header',seconds:12}
};
export function initial(mode){return {...baseInitial('classic'),mode};}
export function reduce(s,a){if(a.type==='reset')return initial(s.mode);return baseReduce(s,a);}
export function geometry(mode,width=390){
 const w=clamp(width,280,430),large=mode==='large-search-mobile',k=w<320?Math.min(.42,(w-194)/303):w<360?.42:.46;
 return {w,h:640,large,header:{x:16,y:44,w:w-32,h:large?140:80},cy:84,logo:{x:w<360?76:91,y:69,k},menu:47,utility:w-94,bag:w-50,panel:{x:16,y:large?200:140,w:w-32},search:large?{x:76,y:122,w:w-128,h:44}:{x:76,y:198,w:w-132,h:44}};
}
export function panelGeometry(s,g){const p={...g.panel};p.h=s.panel==='cart'?420:s.panel==='mobilemenu'?360:s.panel==='search'?(g.large?64:140)+Math.max(1,Math.min(4,results(s).length))*64+16:320;return p;}
function panel(s,g){
 if(!s.panel||s.reveal<.001)return '';const p=panelGeometry(s,g),x=p.x,y=p.y,w=p.w;
 let out=r(x,y,w,p.h,'#fff',26,'filter="url(#shadow)"');
 if(s.panel==='mobilemenu'){
  names.forEach((name,i)=>{const yy=y+12+i*48;out+=r(x+12,yy,w-24,44,s.active===i?'url(#blue)':'#fff',16)+text(x+28,yy+28,name,16,s.active===i?600:400,s.active===i?'#fff':C.ink)+icon('arrow',x+w-28,yy+22,17);});
 }else if(s.panel==='search'){
  if(!g.large){out+=text(x+24,y+34,'Find something lovely',18,600)+icon('close',x+w-28,y+28,19)+r(x+16,y+56,w-32,52,C.field,26)+icon('search',x+37,y+82,22);if(!g.native)out+=text(g.search.x,g.search.y+28,s.query||'Search lamps, vases, shelves…',12,400,s.query?C.ink:C.muted);}
  const top=y+(g.large?64:140);out+=text(x+22,top-16,s.query?`${results(s).length} matching pieces`:'Popular pieces',12,600,C.muted);
  const found=results(s).slice(0,4);
  if(!found.length)out+=text(x+22,top+30,'No pieces found. Try “lamp” or “vase”.',12,400,C.muted);
  found.forEach((a,i)=>{const yy=top+i*64;if(s.highlight===i)out+=r(x+10,yy-4,w-20,60,C.pale,16);out+=productArt(a.shape,x+18,yy+3,48)+text(x+80,yy+23,a.name,13,600)+text(x+80,yy+44,a.category,11,400,C.muted)+text(x+w-22,yy+30,`$${a.price}`,14,600,C.ink,'end');});
  if(g.large)out+=icon('close',x+w-28,y+24,18);
 }else if(s.panel==='wishlist'){
  out+=text(x+22,y+38,'Saved pieces',20,600)+icon('close',x+w-28,y+28,19)+productArt('lamp',x+22,y+64,92)+text(x+132,y+99,'Arc Table Lamp',14,600)+text(x+132,y+127,'$48',16,400,C.muted)+r(x+22,y+190,w-44,50,s.cart['arc-lamp']?C.pale:C.yellow,24)+text(x+w/2,y+222,s.cart['arc-lamp']?'Added to bag':'Move to bag',15,600,C.ink,'middle')+text(x+22,y+280,'Your favourites, in one place.',12,400,C.muted);
 }else if(s.panel==='cart'){
  out+=text(x+22,y+38,`Your bag · ${cartCount(s)}`,20,600)+icon('close',x+w-28,y+28,19);
  const list=cartItems(s);list.forEach((a,i)=>{const yy=y+66+i*84;out+=productArt(a.shape,x+18,yy,56)+text(x+86,yy+19,a.name,12,600)+text(x+86,yy+39,`$${a.price}`,12,400,C.muted)+icon('minus',x+102,yy+63,14)+text(x+140,yy+68,String(s.cart[a.id]),14,600,C.ink,'middle')+icon('plus',x+178,yy+63,14)+icon('close',x+w-26,yy+15,15);});
  if(!list.length)out+=text(x+22,y+110,'Your bag is empty.',16,400,C.muted);
  if(Object.keys(s.cart).length>3)out+=text(x+w-22,y+338,'Next items →',12,600,C.ink,'end');
  out+=r(x+22,y+348,w-44,1,'#e8edf3')+text(x+22,y+377,'Subtotal',14,400,C.muted)+text(x+w-22,y+377,`$${subtotal(s)}`,22,600,C.ink,'end')+text(x+22,y+405,'Sample bag · totals follow quantity',11,400,C.muted);
 }else if(s.panel==='product'){
  const a=products.find(a=>a.id===s.selected)||products[0];out+=text(x+22,y+36,'A little more detail',18,600)+icon('close',x+w-28,y+28,19)+productArt(a.shape,x+22,y+64,120)+text(x+158,y+98,a.name,12,600)+text(x+158,y+125,a.category,12,400,C.muted)+text(x+158,y+159,`$${a.price}`,23,600)+r(x+22,y+226,w-44,50,C.yellow,24)+text(x+w/2,y+258,'Add to bag',15,600,C.ink,'middle');
 }
 return `<g opacity="${s.reveal}" transform="translate(0 ${-8*(1-s.reveal)})">${out}</g>`;
}
export function svg(s,{width=390,native=false}={}){
 const g=geometry(s.mode,width);g.native=native;const h=g.header;
 let out=`<defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#a2dffc"/><stop offset="1" stop-color="#83cdf4"/></linearGradient><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#48adf3"/><stop offset="1" stop-color="#3999e9"/></linearGradient><linearGradient id="sun" x2="0" y2="1"><stop stop-color="#ffe18a"/><stop offset="1" stop-color="#ffd05b"/></linearGradient><filter id="shadow" x="-20%" y="-15%" width="140%" height="145%"><feDropShadow dy="10" stdDeviation="13" flood-color="#2b6c99" flood-opacity=".13"/></filter></defs>${r(0,0,g.w,g.h,'url(#sky)')}<circle cx="${g.w+55}" cy="370" r="260" fill="#fff" opacity=".13"/><circle cx="-40" cy="665" r="230" fill="#fff" opacity=".1"/>`;
 // These are sample page elements, not part of the header design.
 const by=g.large?227:167;out+=text(28,by+18,names[s.active],12,600,C.house)+text(28,by+50,'A little room for lovely.',21,600)+text(28,by+77,'Pieces for everyday living.',12,400,C.house);
 [products[0],products[1]].forEach((a,i)=>{const tw=(g.w-72)/2,xx=28+i*(tw+16);out+=r(xx,by+100,tw,208,'#ffffff',22,'opacity=".72"')+productArt(a.shape,xx+12,by+112,tw-24)+text(xx+12,by+271,a.name,11,600)+text(xx+12,by+293,`$${a.price}`,12,400,C.muted);});
 out+=r(h.x,h.y,h.w,h.h,'#fff',26)+logo(g.logo.x,g.logo.y,g.logo.k);
 const a=s.panel==='mobilemenu'?s.reveal:0;
 out+=`<g transform="translate(${g.menu} ${g.cy})" stroke="${C.ink}" stroke-width="1.9" stroke-linecap="round"><path d="M-9 -7L9 ${-7+14*a}"/><path d="M-9 0H9" opacity="${1-a}"/><path d="M-9 7L9 ${7-14*a}"/></g>`;
 out+=icon(g.large?'heart':'search',g.utility,g.cy,23)+`<g transform="translate(${g.bag} ${g.cy}) scale(${1+.1*s.pulse})">${icon('bag',0,0,24)}</g>`;
 if(cartCount(s))out+=`<circle cx="${g.bag+12}" cy="${g.cy-15}" r="9" fill="#ffb600"/>`+text(g.bag+12,g.cy-12,String(cartCount(s)),10,600,'#fff','middle');
 if(g.large){out+=r(32,120,g.w-64,48,C.field,24)+icon('search',53,144,22);if(!native)out+=text(g.search.x,149,s.query||'Search lamps, vases, shelves…',12,400,s.query?C.ink:C.muted);if(s.query)out+=icon('close',g.w-52,144,16);}
 out+=panel(s,g);
 // A touch ripple is evidence of each deliberate demonstration tap, not idle motion.
 if(s.click>0)out+=`<circle cx="${s.cursorX}" cy="${s.cursorY}" r="${12+14*(1-s.click)}" fill="${C.ink}" opacity="${s.click*.12}"/><circle cx="${s.cursorX}" cy="${s.cursorY}" r="4" fill="${C.ink}" opacity="${s.click*.5}"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${g.w}" height="${g.h}" viewBox="0 0 ${g.w} ${g.h}" aria-hidden="true">${out}</svg>`;
}
export function controls(s,g){
 const list=[],add=(key,x,y,w,h,label,action,extra={})=>list.push({key,x,y,w,h,label,action,...extra});
 add('home',g.logo.x-2,62,303*g.logo.k,44,'Looma Living home',{type:'catalog',index:0});
 add('menu',g.menu-22,g.cy-22,44,44,s.panel==='mobilemenu'?'Close navigation':'Open navigation',{type:'panel',panel:'mobilemenu'},{panel:'mobilemenu'});
 add(g.large?'heart':'search',g.utility-22,g.cy-22,44,44,g.large?'Saved pieces':'Open search',{type:'panel',panel:g.large?'wishlist':'search'},{panel:g.large?'wishlist':'search'});
 add('bag',g.bag-22,g.cy-22,44,44,`Your bag, ${cartCount(s)} items`,{type:'panel',panel:'cart'},{panel:'cart'});
 if(g.large&&s.query)add('clear',g.w-74,122,44,44,'Clear search',{type:'query',value:''});
 if(!s.panel||s.reveal<.05)return list;const p=panelGeometry(s,g),x=p.x,y=p.y,w=p.w;
 if(s.panel!=='mobilemenu')add('close',x+w-50,y+6,44,44,'Close '+s.panel,{type:'close'});
 if(s.panel==='mobilemenu')names.forEach((name,i)=>add('nav-'+i,x+12,y+12+i*48,w-24,44,name,{type:'catalog',index:i},{nav:i}));
 if(s.panel==='search'){const top=y+(g.large?64:140);results(s).slice(0,4).forEach((a,i)=>add('result-'+a.id,x+10,top-4+i*64,w-20,60,`${a.name}, $${a.price}`,{type:'product',id:a.id},{option:i,selected:s.highlight===i}));}
 if(s.panel==='wishlist')add('wishlist-add',x+22,y+190,w-44,50,s.cart['arc-lamp']?'Added to bag':'Move Arc Table Lamp to bag',{type:'add',id:'arc-lamp'},{disabled:!!s.cart['arc-lamp']});
 if(s.panel==='product')add('product-add',x+22,y+226,w-44,50,'Add '+(products.find(a=>a.id===s.selected)?.name||'piece')+' to bag',{type:'add',id:s.selected});
 if(s.panel==='cart'){
  cartItems(s).forEach((a,i)=>{const yy=y+66+i*84;add('minus-'+a.id,x+80,yy+41,44,44,'Decrease '+a.name,{type:'qty',id:a.id,delta:-1});add('plus-'+a.id,x+156,yy+41,44,44,'Increase '+a.name,{type:'qty',id:a.id,delta:1});add('remove-'+a.id,x+w-48,yy-7,44,44,'Remove '+a.name,{type:'remove',id:a.id});});
  if(Object.keys(s.cart).length>3)add('cart-page',x+w-164,y+320,142,44,'Show next items in bag',{type:'cartpage'});
 }
 return list;
}
const open=(s,p,t,at)=>{s.panel=p;s.reveal=ease((t-at)/.26);};
const close=(s,t,at)=>{s.reveal=1-ease((t-at)/.18);if(t>=at+.18)s.panel='';};
export function demo(mode,t){
 const s=initial(mode),large=mode==='large-search-mobile',g=geometry(mode),cues=[];
 if(!large){
  if(t>=.8)open(s,'mobilemenu',t,.8);cues.push([.8,g.menu,84]);
  if(t>=2){s.active=3;close(s,t,2);}cues.push([2,120,318]);
  if(t>=3.1)open(s,'search',t,3.1);cues.push([3.1,g.utility,84]);
  if(t>=3.65)s.query='lamp'.slice(0,Math.min(4,1+Math.floor((t-3.65)/.16)));
  if(t>=5.1){s.selected='arc-lamp';s.query='Arc Table Lamp';open(s,'product',t,5.1);}cues.push([5.1,156,287]);
  if(t>=6.25){s.cart['arc-lamp']=1;s.pulse=Math.sin(clamp((t-6.25)/.4)*Math.PI);}cues.push([6.25,195,391]);
  if(t>=7.35)open(s,'cart',t,7.35);cues.push([7.35,g.bag,84]);
  if(t>=8.6){delete s.cart['arc-lamp'];s.pulse=Math.sin(clamp((t-8.6)/.4)*Math.PI);}cues.push([8.6,348,221]);
  if(t>=9.6)close(s,t,9.6);cues.push([9.6,346,168]);
  if(t>=10.2)open(s,'mobilemenu',t,10.2);cues.push([10.2,g.menu,84]);
  if(t>=10.9){s.active=0;close(s,t,10.9);}cues.push([10.9,120,174]);
 }else{
  if(t>=.8)open(s,'search',t,.8);cues.push([.8,185,144]);
  if(t>=1.2)s.query='vase'.slice(0,Math.min(4,1+Math.floor((t-1.2)/.16)));
  if(t>=3)close(s,t,3);cues.push([3,345,224]);
  if(t>=4.1)open(s,'wishlist',t,4.1);cues.push([4.1,g.utility,84]);
  if(t>=5.3){s.cart['arc-lamp']=1;s.pulse=Math.sin(clamp((t-5.3)/.4)*Math.PI);}cues.push([5.3,195,417]);
  if(t>=6.5)open(s,'cart',t,6.5);cues.push([6.5,g.bag,84]);
  if(t>=7.8){delete s.cart['arc-lamp'];s.pulse=Math.sin(clamp((t-7.8)/.4)*Math.PI);}cues.push([7.8,348,281]);
  if(t>=8.8)close(s,t,8.8);cues.push([8.8,346,228]);
  if(t>=9.3){s.query='';open(s,'search',t,9.3);}cues.push([9.3,338,144]);
  if(t>=9.7)open(s,'mobilemenu',t,9.7);cues.push([9.7,g.menu,84]);
  if(t>=10.4)close(s,t,10.4);cues.push([10.4,g.menu,84]);
 }
 if(t>=11.2){s.active=0;s.query='';s.selected='';s.panel='';s.reveal=0;}
 for(const[at,x,y]of cues)if(t>=at&&t<at+.28){s.cursorX=x;s.cursorY=y;s.click=1-(t-at)/.28;}
 return s;
}
