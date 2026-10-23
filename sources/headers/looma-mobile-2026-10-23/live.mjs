import {initial,reduce,specs,names,products,results,cartCount,subtotal,geometry,panelGeometry,svg,controls,demo} from './core.mjs';
const mode=document.body.dataset.mode,stage=document.querySelector('#stage'),scene=document.querySelector('#scene'),overlay=document.querySelector('#overlay'),search=document.querySelector('#search'),suggestions=document.querySelector('#suggestions'),status=document.querySelector('#status');
const gsap=window.gsap,media=matchMedia('(prefers-reduced-motion: reduce)'),nodes=new Map();
let s=initial(mode),trigger=null,playing=null,restoring=false,lastRoute='';
const announce=message=>{status.textContent=message;};
const tween=(target,values,duration)=>{if(!gsap||media.matches){Object.assign(target,values);draw();return;}gsap.to(target,{...values,duration,ease:'power3.out',overwrite:'auto',onUpdate:draw,onComplete:draw});};
function stopPreview(){if(!playing)return;playing.kill();playing=null;s=initial(mode);document.querySelector('#preview').textContent='Play preview';}
function apply(action,el){
 stopPreview();if(s.closing){s.panel='';s.reveal=0;delete s.closing;}
 const previous=s.panel,reveal=s.reveal;gsap?.killTweensOf(s);s=reduce(s,action);
 if(action.type==='catalog'){
  const slug=names[s.active].toLowerCase().replace(/\s+/g,'-');history.replaceState(null,'','#'+slug);announce('Viewing '+names[s.active]);
 }
 if(['add','qty','remove'].includes(action.type)){announce(`${cartCount(s)} items in bag. Subtotal $${subtotal(s)}.`);s.pulse=1;tween(s,{pulse:0},.38);}
 if(action.type==='panel'&&s.panel==='cart')announce(`${cartCount(s)} items in bag. Subtotal $${subtotal(s)}.`);
 if(action.type==='query')announce(`${results(s).length} matching pieces.`);
 if(action.type==='product')announce((products.find(p=>p.id===s.selected)?.name||'Product')+' details');
 if(s.panel!==previous){
  if(s.panel){if(!previous||el===search||el?.matches('[data-control=menu],[data-control=search],[data-control=heart],[data-control=bag]'))trigger=el||trigger;s.reveal=0;tween(s,{reveal:1},.26);}
  else{
   s.panel=previous;s.reveal=reveal;s.closing=true;tween(s,{reveal:0},.18);
   if(trigger&&document.activeElement!==search){restoring=true;trigger.focus({preventScroll:true});restoring=false;}
  }
 }else s.reveal=reveal;
 draw();
 if(action.type==='panel'&&action.panel==='search'&&s.panel==='search')search.focus({preventScroll:true});
 if(action.type==='query'&&action.value==='')search.focus({preventScroll:true});
 if(action.type==='product')nodes.get('product-add')?.focus({preventScroll:true});
 if(action.type==='catalog')document.querySelector('[data-control="menu"]')?.focus({preventScroll:true});
}
function pos(el,b,g){Object.assign(el.style,{left:b.x/g.w*100+'%',top:b.y/g.h*100+'%',width:b.w/g.w*100+'%',height:b.h/g.h*100+'%'});}
function draw(){
 if(s.closing&&s.reveal<=.0001){s.panel='';delete s.closing;}
 const g=geometry(mode,stage.clientWidth);stage.style.aspectRatio=`${g.w}/640`;scene.innerHTML=svg(s,{width:g.w,native:true});
 const shown=new Set();for(const b of controls(s,g)){
  shown.add(b.key);let n=nodes.get(b.key);if(!n){n=document.createElement('button');n.type='button';n.className='hit';n.dataset.control=b.key;(b.option!==undefined?suggestions:overlay).append(n);nodes.set(b.key,n);n.addEventListener('click',()=>{if(n.action)apply(n.action,n);});}
  n.hidden=false;n.action=b.action;n.disabled=!!b.disabled;pos(n,b,g);n.setAttribute('aria-label',b.label);
  if(b.panel){n.setAttribute('aria-expanded',String(s.panel===b.panel&&!s.closing));n.setAttribute('aria-controls','panel-label');}else{n.removeAttribute('aria-expanded');n.removeAttribute('aria-controls');}
  if(b.nav!==undefined&&s.active===b.nav)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
  if(b.option!==undefined){n.id='option-'+b.option;n.role='option';n.tabIndex=-1;n.setAttribute('aria-selected',String(b.selected));}else{n.removeAttribute('role');n.removeAttribute('aria-selected');n.removeAttribute('tabindex');}
 }
 nodes.forEach((n,key)=>{if(!shown.has(key)){n.hidden=true;n.action=null;}});
 const show=g.large||s.panel==='search'&&s.reveal>.05;search.hidden=!show;search.disabled=!show||!!playing;suggestions.hidden=s.panel!=='search';
 if(show){const b={...g.search};if(g.large&&s.query)b.w-=22;pos(search,b,g);search.style.fontSize='12px';if(search.value!==s.query)search.value=s.query;search.setAttribute('aria-expanded',String(s.panel==='search'&&!s.closing));search.setAttribute('aria-activedescendant',s.highlight>=0?'option-'+s.highlight:'');}
 const selected=products.find(p=>p.id===s.selected);
 document.querySelector('#panel-label').textContent=s.panel==='mobilemenu'?'Site navigation':s.panel==='search'?`${results(s).length} matching pieces. Search suggestions.`:s.panel==='cart'?`Shopping bag. ${products.filter(p=>s.cart[p.id]).map(p=>`${p.name}, quantity ${s.cart[p.id]}, $${p.price} each`).join('. ')}. Subtotal $${subtotal(s)}.`:s.panel==='product'&&selected?`${selected.name}. ${selected.category}. $${selected.price}.`:s.panel==='wishlist'?'Saved pieces. Arc Table Lamp, $48.':s.panel;
 const route=names[s.active];if(route!==lastRoute){lastRoute=route;document.querySelector('#destination').textContent=route;}
}
search.addEventListener('focus',()=>{if(!playing&&!restoring&&s.panel!=='search')apply({type:'query',value:search.value},search);});
search.addEventListener('input',()=>apply({type:'query',value:search.value},search));
search.addEventListener('keydown',event=>{
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(s.panel!=='search')apply({type:'query',value:s.query},search);const n=s.highlight<0?(event.key==='ArrowDown'?0:Math.min(4,results(s).length)-1):s.highlight+(event.key==='ArrowDown'?1:-1);apply({type:'highlight',index:n},search);}
 if(event.key==='Enter'){event.preventDefault();const p=results(s)[Math.max(0,s.highlight)];if(p)apply({type:'product',id:p.id},search);else announce('No matching pieces. Try another search.');}
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();restoring=true;search.blur();restoring=false;apply({type:'close'},trigger);document.querySelector('[data-control="'+(mode==='classic-mobile'?'search':'menu')+'"]')?.focus({preventScroll:true});}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&s.panel){event.preventDefault();apply({type:'close'},trigger);}});
document.addEventListener('pointerdown',event=>{if(playing||!s.panel||event.target.closest('[data-control],#search,.aux'))return;const g=geometry(mode,stage.clientWidth),p=panelGeometry(s,g),b=stage.getBoundingClientRect(),x=(event.clientX-b.left)*g.w/b.width,y=(event.clientY-b.top)*g.h/b.height;if(x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h)return;apply({type:'close'},trigger);});
document.querySelector('#reset').addEventListener('click',()=>{stopPreview();gsap?.killTweensOf(s);s=initial(mode);history.replaceState(null,'',location.pathname);announce('Header reset. Two sample items in bag.');draw();});
document.querySelector('#preview').addEventListener('click',()=>{if(playing){stopPreview();draw();return;}if(!gsap){announce('Preview animation unavailable. Header controls remain usable.');return;}if(media.matches){announce('Reduced motion enabled. Use the header controls to inspect its states.');return;}gsap.killTweensOf(s);const clock={time:0};document.querySelector('#preview').textContent='Stop preview';playing=gsap.to(clock,{time:specs[mode].seconds,duration:specs[mode].seconds,ease:'none',onUpdate:()=>{s=demo(mode,clock.time);draw();},onComplete:()=>{playing=null;s=initial(mode);document.querySelector('#preview').textContent='Play preview';draw();}});});
media.addEventListener('change',()=>{stopPreview();gsap?.killTweensOf(s);s.reveal=s.panel?1:0;s.pulse=0;draw();});
const resizeObserver=new ResizeObserver(draw);resizeObserver.observe(stage);
window.addEventListener('pagehide',()=>{playing?.kill();gsap?.killTweensOf(s);resizeObserver.disconnect();},{once:true});
await document.fonts.ready;draw();document.querySelector('#loading').hidden=true;
