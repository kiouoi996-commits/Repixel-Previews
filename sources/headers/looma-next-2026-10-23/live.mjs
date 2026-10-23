import {initial,reduce,specs,names,categories,products,results,svg,geometry,controls,cartCount,subtotal,demo,productArt,esc,crossGroup} from './core.mjs';
const bodyScene=document.querySelector('#body-scene'),headerLayer=document.querySelector('#header-layer');
const mode=document.body.dataset.mode||'classic',stage=document.querySelector('#stage'),scene=document.querySelector('#scene'),overlay=document.querySelector('#overlay'),search=document.querySelector('#search'),status=document.querySelector('#status'),collection=document.querySelector('#collection');
let s=initial(mode),mobile=false,trigger=null,playing=null,lastPanel='',lastContent='',restoring=false;
const gsap=window.gsap,media=matchMedia('(prefers-reduced-motion: reduce)'),nodes=new Map();
document.title=specs[mode].title+' · Repixel';
const announce=message=>{status.textContent=message;};
function tween(target,values,duration=.26){if(!gsap||media.matches){Object.assign(target,values);draw();return;}gsap.to(target,{...values,duration,ease:'power3.out',overwrite:'auto',onUpdate:draw,onComplete:draw});}
function stopPreview(){if(!playing)return;playing.kill();playing=null;gsap?.killTweensOf(s);s=initial(mode);document.querySelector('#preview').textContent='Play preview';}
function apply(action,el){stopPreview();if(s.closing){s.panel='';s.reveal=0;delete s.closing;}const previous=s.panel,previousActive=s.active,next=reduce(s,action),marker=s.marker,reveal=s.reveal;gsap?.killTweensOf(s);s=next;s.marker=marker;delete s.closing;
 if(['nav','catalog','cta'].includes(action.type)){
  history.replaceState(null,'','#'+names[s.active].toLowerCase().replace(/\s+/g,'-'));
  announce('Viewing '+(s.category?categories[s.category]:names[s.active]));
 }
 if(['add','qty','remove'].includes(action.type)){
  announce(`${cartCount(s)} items in bag. Subtotal $${subtotal(s)}.`);s.pulse=1;tween(s,{pulse:0},.38);
 }
 if(['query','category'].includes(action.type))announce(`${results(s).length} matching pieces${s.category?' in '+categories[s.category]:''}.`);
 if(action.type==='product')announce((products.find(p=>p.id===s.selected)?.name||'Product')+' details');
 if(action.type==='panel'&&s.panel==='cart')announce(`${cartCount(s)} items in bag. Subtotal $${subtotal(s)}.`);
 if(s.panel!==previous){
  if(s.panel){trigger=el||trigger;s.reveal=0;tween(s,{reveal:1},.26);}
  else{s.panel=previous;s.reveal=reveal;tween(s,{reveal:0},.18);s.closing=true;if(trigger&&document.activeElement!==search){restoring=true;trigger.focus({preventScroll:true});restoring=false;}}
 }else s.reveal=reveal;
 if(crossGroup(mode,previousActive,s.active)){s.ghost=marker;s.marker=s.active;s.handoff=0;tween(s,{handoff:1},.26);}else{s.handoff=1;tween(s,{marker:s.active},.32);}if(action.type==='cta'){s.press=1;tween(s,{press:0},.18);}draw();
 if(action.type==='panel'&&action.panel==='search'&&s.panel==='search')search.focus({preventScroll:true});
 if(action.type==='query'&&action.value==='')search.focus({preventScroll:true});
 if(action.type==='category')search.focus({preventScroll:true});
}
function pos(el,b,g){Object.assign(el.style,{left:b.x/g.w*100+'%',top:b.y/g.h*100+'%',width:b.w/g.w*100+'%',height:b.h/g.h*100+'%'});}
function draw(){
 if(s.closing&&s.reveal<=.0001){s.panel='';delete s.closing;}
 mobile=stage.clientWidth<760;const logicalWidth=mobile?390:1440,scale=stage.clientWidth/logicalWidth,box=stage.getBoundingClientRect();let pinned=false;
 if(!playing&&mode!=='split'){
  s.scroll=Math.max(0,-box.top/scale);const normal=geometry(mode,mobile,initial(mode)),pinY=mobile?18:mode==='floating'?34:24;
  pinned=box.top+(normal.header.y-pinY)*scale<=0;
 }
 const g=geometry(mode,mobile,s,{documentFlow:!playing,pinned});stage.style.aspectRatio=`${g.w}/${g.h}`;
 headerLayer.style.cssText=pinned?`position:fixed;left:${box.left}px;top:0;width:${stage.clientWidth}px;height:${stage.clientWidth/g.w*g.h}px;`:'position:absolute;inset:0;width:100%;height:100%;';
 headerLayer.dataset.pinned=String(pinned);stage.dataset.scroll=String(Math.round(s.scroll));stage.dataset.compact=String(g.compact);stage.dataset.solid=String(g.solid);
 bodyScene.innerHTML=svg(s,{mobile,layer:'body',documentFlow:!playing});scene.innerHTML=svg(s,{mobile,native:true,layer:'header',documentFlow:!playing,pinned});
 const active=new Set(),list=controls(s,g);overlay.setAttribute('aria-label','Interactive '+specs[mode].title);document.querySelector('#panel-label').textContent=s.panel?s.panel==='search'?'Search suggestions':s.panel==='cart'?'Shopping bag':s.panel==='wishlist'?'Saved pieces':'Header '+s.panel:'';
 list.forEach(b=>{
  active.add(b.key);let n=nodes.get(b.key);if(!n){n=document.createElement('button');n.type='button';n.className='hit';n.dataset.control=b.key;(b.option!==undefined?document.querySelector('#suggestions'):overlay).append(n);nodes.set(b.key,n);n.addEventListener('click',()=>{const current=n.action;if(current)apply(current,n);});}
  n.action=b.action;pos(n,b,g);n.setAttribute('aria-label',b.label);n.disabled=!!b.disabled;n.hidden=false;
  if(b.panel){n.setAttribute('aria-expanded',String(s.panel===b.panel&&!s.closing));n.setAttribute('aria-controls','panel-label');}else{n.removeAttribute('aria-expanded');n.removeAttribute('aria-controls');}
  if(b.nav!==undefined){if(s.active===b.nav)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');}
  if(b.option!==undefined){n.id='option-'+b.option;n.role='option';n.tabIndex=-1;n.setAttribute('aria-selected',String(b.selected));}else{n.removeAttribute('role');n.removeAttribute('aria-selected');n.removeAttribute('tabindex');}
  if(b.key.startsWith('cat-'))n.setAttribute('aria-pressed',String(b.selected));
 });
 nodes.forEach((n,key)=>{if(!active.has(key)){n.hidden=true;n.action=null;}});
 document.querySelector('#suggestions').hidden=s.panel!=='search';const show=s.panel==='search'&&s.reveal>.05;search.hidden=!show;search.disabled=!show||!!playing;
 if(show){const input={...g.search};if(mode!=='search'){input.x+=26;input.w-=40;}if(mode==='search')input.w-=s.query?42:4;pos(search,input,g);search.style.fontSize=(mobile?13:17)*(stage.clientWidth/g.w)+'px';if(search.value!==s.query)search.value=s.query;search.setAttribute('aria-expanded',String(s.panel==='search'));search.setAttribute('aria-label','Search products');search.setAttribute('aria-activedescendant',s.highlight>=0?'option-'+s.highlight:'');}
 const stamp=s.active+'|'+s.selected+'|'+s.category;if(lastContent!==stamp){lastContent=stamp;const label=s.category?categories[s.category]:names[s.active],filtered=s.category?products.filter(p=>p.category===categories[s.category]):s.active===3?products.filter(p=>p.category==='Lighting'):s.active===4?products.filter(p=>p.category==='Decor'):products.slice(0,3);collection.innerHTML=`<div class="collection-heading"><p class="eyebrow">SAMPLE COLLECTION</p><h1>${esc(label==='Shop'?'Pieces for everyday living':label)}</h1><p>This small local catalog lets you try the header. Products, saved pieces and orders are sample data.</p></div><div class="pieces">${filtered.map(p=>`<article><svg viewBox="0 0 100 100" aria-hidden="true">${productArt(p.shape,0,0,100)}</svg><h2>${esc(p.name)}</h2><p>$${p.price}</p><button type="button" data-product="${p.id}">View piece</button></article>`).join('')}</div>`;}
 lastPanel=s.panel;
}
search.addEventListener('focus',()=>{if(!playing&&!restoring&&s.panel!=='search')apply({type:'query',value:search.value},search);});
search.addEventListener('input',()=>apply({type:'query',value:search.value},search));
search.addEventListener('keydown',event=>{
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(s.panel!=='search')apply({type:'query',value:s.query},search);const next=s.highlight<0?(event.key==='ArrowDown'?0:Math.min(4,results(s).length)-1):s.highlight+(event.key==='ArrowDown'?1:-1);apply({type:'highlight',index:next},search);}
 if(event.key==='Enter'){event.preventDefault();const found=results(s),p=found[Math.max(0,s.highlight)];if(p)apply({type:'product',id:p.id},search);else announce('No matching pieces. Try another search.');}
 if(event.key==='Escape'){event.preventDefault();search.blur();apply({type:'close'},search);}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&s.panel){event.preventDefault();apply({type:'close'},trigger);}});
document.addEventListener('pointerdown',event=>{if(playing)return;if(s.panel&&!event.target.closest('[data-control],#search')&&!event.target.closest('.aux'))apply({type:'close'},trigger);});
collection.addEventListener('click',event=>{const button=event.target.closest('[data-product]');if(button){apply({type:'product',id:button.dataset.product},button);stage.scrollIntoView({behavior:media.matches?'instant':'smooth',block:'start'});}});
document.querySelector('#reset').addEventListener('click',()=>{stopPreview();gsap?.killTweensOf(s);s=initial(mode);history.replaceState(null,'',location.pathname);announce('Header reset. Two sample items in bag.');draw();});
document.querySelector('#preview').addEventListener('click',()=>{if(playing){stopPreview();draw();return;}if(!gsap){announce('Preview animation is unavailable. All header controls remain usable.');return;}if(media.matches){announce('Reduced motion is enabled. Use the header controls to inspect its states.');return;}const clock={time:0};document.querySelector('#preview').textContent='Stop preview';playing=gsap.to(clock,{time:specs[mode].seconds,duration:specs[mode].seconds,ease:'none',onUpdate:()=>{s=demo(mode,clock.time);draw();},onComplete:()=>{playing=null;s=initial(mode);document.querySelector('#preview').textContent='Play preview';announce('Preview finished. Header ready.');draw();}});});
media.addEventListener('change',()=>{stopPreview();gsap?.killTweensOf(s);s.marker=s.active;s.reveal=s.panel?1:0;draw();});
const resizeObserver=new ResizeObserver(draw);resizeObserver.observe(stage);
const onScroll=()=>{if(playing)stopPreview();draw();};window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('pagehide',()=>{playing?.kill();gsap?.killTweensOf(s);resizeObserver.disconnect();window.removeEventListener('scroll',onScroll);},{once:true});
await document.fonts.ready;draw();document.querySelector('#loading').hidden=true;
