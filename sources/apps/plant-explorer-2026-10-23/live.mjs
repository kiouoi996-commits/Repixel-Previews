import {ASSETS} from './assets.mjs';import {initial,reduce,matches,PLANTS,FILTERS,NAV,demo,W,H} from './model.mjs';import {svg,controls} from './scene.mjs';
const stage=document.querySelector('#stage'),scene=document.querySelector('#scene'),overlay=document.querySelector('#controls'),search=document.querySelector('#search'),suggestions=document.querySelector('#suggestions'),status=document.querySelector('#status'),description=document.querySelector('#description');
const media=matchMedia('(prefers-reduced-motion: reduce)'),gsap=window.gsap,nodes=new Map(),selects=new Map(),storageKey='repixel-plant-explorer-v1';
let s=initial(),playing=null,before=null,toastTimer=null,overlayTrigger=null,restoring=false;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&Array.isArray(saved.collection)&&Array.isArray(saved.favorites)&&Array.isArray(saved.done)&&typeof saved.reminders==='boolean'){s={...s,...saved,route:'home',motion:1,from:null,overlay:'',toast:''};s.collection=s.collection.filter(id=>PLANTS.some(p=>p.id===id));s.favorites=s.favorites.filter(id=>PLANTS.some(p=>p.id===id));}}catch{}
const announce=v=>{status.textContent=v;};
const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify({collection:s.collection,favorites:s.favorites,reminders:s.reminders,done:s.done,bookmarkedGuide:s.bookmarkedGuide}));}catch{}};
function position(el,b){Object.assign(el.style,{left:b.x/W*100+'%',top:b.y/H*100+'%',width:b.w/W*100+'%',height:b.h/H*100+'%'});}
function stopPreview(){if(!playing)return;playing.kill();playing=null;s=before||initial('home');before=null;document.querySelector('#preview').textContent='Play 8-second demo';}
function apply(a,el){
 stopPreview();toastTimer?.kill();gsap?.killTweensOf(s);const old=s,next=reduce(s,a),changed=old.route!==next.route,opening=!old.overlay&&next.overlay;
 if(opening)overlayTrigger=el||document.activeElement;
 s=next;if(changed){s.from=old;s.motion=media.matches?1:0;if(gsap&&!media.matches)gsap.to(s,{motion:1,duration:s.route==='detail'?.38:.3,ease:'power3.out',onUpdate:draw,onComplete:()=>{s.from=null;draw();}});else{s.motion=1;s.from=null;}history.replaceState(null,'','#'+s.route);}
 persist();draw();
 if(a.type==='reset'){try{localStorage.removeItem(storageKey);}catch{}history.replaceState(null,'',location.pathname);announce('Plant Explorer reset.');}
 else if(a.type==='add')announce(`${s.toast}. ${s.collection.length} of 5 plants in your collection.`);
 else if(a.type==='collection')announce(`${s.collection.length} of 5 plants in your collection.`);
 else if(['query','filter','category','resetFilters','quiz'].includes(a.type))announce(`${matches(s).length} matching plants.`);
 else if(a.type==='plant')announce(PLANTS.find(p=>p.id===s.selected).full+' details.');
 else if(a.type==='water'||a.type==='reminders')announce(s.toast);
 else if(changed)announce(s.route==='home'?'Plant Explorer home':s.route==='collection'?'My Plant Collection':s.route==='care'?'Plant Care':s.route);
 if(a.type==='plant')nodes.get('detail-add')?.focus({preventScroll:true});
 if(opening)nodes.get('overlay-close')?.focus({preventScroll:true});
 if(old.overlay&&!s.overlay&&a.type==='close'&&overlayTrigger&&!overlayTrigger.hidden){restoring=true;overlayTrigger.focus({preventScroll:true});restoring=false;}
 if(changed&&s.route==='discover'&&['query','category','quiz'].includes(a.type))search.focus({preventScroll:true});
 if(s.toast&&gsap)toastTimer=gsap.delayedCall(1.6,()=>{s.toast='';draw();});
}
function draw(){
 scene.innerHTML=svg(s,{native:true});const active=new Set();for(const b of controls(s)){
  active.add(b.key);let el=nodes.get(b.key);if(!el){el=document.createElement('button');el.type='button';el.className='hit';el.dataset.control=b.key;(b.option!==undefined?suggestions:overlay).append(el);nodes.set(b.key,el);el.addEventListener('click',()=>{if(el.action)apply(el.action,el);});}
  el.action=b.action;el.hidden=false;position(el,b);el.setAttribute('aria-label',b.label);
  if(b.option!==undefined){el.id='result-'+b.option;el.role='option';el.tabIndex=-1;el.setAttribute('aria-selected',String(b.selected));}else if(b.switch){el.role='switch';el.setAttribute('aria-checked',String(b.checked));}else if(b.checked!==undefined){el.role='checkbox';el.setAttribute('aria-checked',String(b.checked));}else{el.removeAttribute('role');el.removeAttribute('aria-checked');el.removeAttribute('aria-selected');el.removeAttribute('tabindex');}
  if(b.pressed!==undefined)el.setAttribute('aria-pressed',String(b.pressed));else el.removeAttribute('aria-pressed');
  if(b.current)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  if(b.expanded!==undefined)el.setAttribute('aria-expanded',String(b.expanded));else el.removeAttribute('aria-expanded');
 }
 nodes.forEach((el,key)=>{if(!active.has(key)){el.hidden=true;el.action=null;}});
 const showSearch=!s.overlay&&['home','discover'].includes(s.route);search.hidden=!showSearch;search.disabled=!!playing;
 if(showSearch){const home=s.route==='home';position(search,home?{x:74,y:95,w:238,h:44}:{x:68,y:60,w:244,h:44});const value=home?'':s.query;if(search.value!==value)search.value=value;search.placeholder=home?'Search plants, care tips...':'Search for plants, tips, or more...';search.setAttribute('aria-expanded',String(!home));search.setAttribute('aria-activedescendant',!home&&s.highlight>=0?'result-'+s.highlight:'');}
 suggestions.hidden=s.route!=='discover'||!!s.overlay;
 FILTERS.forEach(([key,label,options],i)=>{let el=selects.get(key);if(!el){el=document.createElement('select');el.className='select';el.setAttribute('aria-label',label);for(const value of options){const option=document.createElement('option');option.value=value;option.textContent=value;el.append(option);}el.addEventListener('change',()=>apply({type:'filter',key,value:el.value},el));overlay.append(el);selects.set(key,el);}el.hidden=s.route!=='discover'||!s.filtersOpen||!!s.overlay;el.disabled=!!playing;el.value=s.filters[key];position(el,{x:198,y:297+i*45,w:156,h:44});});
 const plant=PLANTS.find(p=>p.id===s.selected);
 description.textContent=s.route==='onboarding'?'Bring More Green Into Your Life. Discover beautiful plants, learn how to care for them, and create a happier home.':s.route==='detail'?`${plant.full}. ${plant.kind} plant. Water ${plant.water}. Light ${plant.light}. Temperature ${plant.temp}. ${s.collection.includes(plant.id)?'In your collection.':'Not yet in your collection.'}`:s.route==='collection'?`My Plant Collection. ${s.collection.length} of 5 plants. ${s.collection.map(id=>PLANTS.find(p=>p.id===id).full).join(', ')}. Seven day growing streak.`:s.route==='home'?'Plant Explorer. Small Steps, Greener Days. Popular Plants: Monstera, Snake Plant, Pothos. Browse by Category: Succulents, Tropical, Cactus, Herbs.':s.route==='care'?'Today’s Care. Water your plants. Mark each task when watering is complete.':s.route==='discover'?`${matches(s).length} matching plants. Use search, category and filters together.`:'Your Green Space. Plant story, reminders, quiz and care guide.';
 stage.dataset.route=s.route;stage.dataset.collection=String(s.collection.length);document.querySelector('#label').textContent=s.overlay||'';
}
search.addEventListener('focus',()=>{if(!restoring&&!playing&&s.route==='home')apply({type:'query',value:s.query},search);});
search.addEventListener('input',()=>apply({type:'query',value:search.value},search));
search.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();const index=s.highlight<0?(event.key==='ArrowDown'?0:Math.min(matches(s).length,3)-1):s.highlight+(event.key==='ArrowDown'?1:-1);apply({type:'highlight',index},search);}if(event.key==='Enter'){event.preventDefault();const p=matches(s)[Math.max(0,s.highlight)];if(p)apply({type:'plant',id:p.id},search);else announce('No plants match. Reset the filters or change your search.');}if(event.key==='Escape'){event.preventDefault();apply({type:'nav',route:'home'},search);nodes.get('nav-discover')?.focus({preventScroll:true});}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&s.overlay){event.preventDefault();apply({type:'close'},overlayTrigger);}});
stage.addEventListener('pointerdown',event=>{if(!s.overlay||event.target.closest('[data-control]'))return;const b=stage.getBoundingClientRect(),x=(event.clientX-b.left)/b.width*390,y=(event.clientY-b.top)/b.height*820;if(x<22||x>368||y<185||y>627)apply({type:'close'},overlayTrigger);});
document.querySelector('#reset').addEventListener('click',()=>apply({type:'reset'}));
document.querySelector('#preview').addEventListener('click',()=>{if(playing){stopPreview();draw();return;}if(media.matches){announce('Reduced motion is enabled. Use the app controls to explore.');return;}if(!gsap){announce('Demo playback is unavailable. All app controls remain usable.');return;}gsap.killTweensOf(s);toastTimer?.kill();before=s;const clock={time:0};document.querySelector('#preview').textContent='Stop demo';playing=gsap.to(clock,{time:8,duration:8,ease:'none',onUpdate:()=>{s=demo(clock.time);draw();},onComplete:()=>{playing=null;s=before;before=null;document.querySelector('#preview').textContent='Play 8-second demo';draw();}});});
const motionChange=()=>{stopPreview();gsap?.killTweensOf(s);s.from=null;s.motion=1;draw();};media.addEventListener('change',motionChange);
window.addEventListener('pagehide',()=>{playing?.kill();toastTimer?.kill();gsap?.killTweensOf(s);media.removeEventListener('change',motionChange);},{once:true});
await Promise.allSettled([document.fonts.ready,...Object.entries(ASSETS).filter(([name])=>name.endsWith('.webp')).map(([,url])=>{const img=new Image();img.src=url;return img.decode();})]);draw();document.querySelector('#loading').hidden=true;
