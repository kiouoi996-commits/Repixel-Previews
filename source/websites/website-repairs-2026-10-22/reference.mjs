
const stage=document.querySelector('main');const reduced=matchMedia('(prefers-reduced-motion:reduce)');let motionLenis=null,cleanupMotion=()=>{};
const menu=document.querySelector('#navigation');
document.querySelectorAll('[data-action="menu"]').forEach(b=>b.addEventListener('click',()=>{motionLenis?.stop();menu.showModal();b.setAttribute('aria-expanded','true');}));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
menu.addEventListener('close',()=>{motionLenis?.start();document.querySelectorAll('[data-action="menu"]').forEach(b=>b.setAttribute('aria-expanded','false'));});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
document.querySelectorAll('[data-action="trip"]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#trip-form').showModal()));
document.querySelectorAll('[data-action="cart"]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.querySelector('#cart-dialog').showModal();}));
const form=document.querySelector('#plan-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();try{localStorage.setItem('sakura-trip-draft',JSON.stringify(Object.fromEntries(new FormData(form))));form.querySelector('[role="status"]').textContent='Your draft is saved on this device.';}catch{form.querySelector('[role="status"]').textContent='This device cannot save the draft. Keep the form open to retain your entries.';}});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();if(motionLenis)motionLenis.scrollTo(t,{duration:.85});else t.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});history.replaceState(null,'',a.getAttribute('href'));t.setAttribute('tabindex','-1');t.focus({preventScroll:true});}));
function startMotion(){
 cleanupMotion();if(reduced.matches||!window.gsap)return;
 const splits=[];const context=gsap.context(()=>{gsap.from('#hero .display',{opacity:0,y:12,duration:.85,stagger:.06,ease:'power3.out',clearProps:'transform,opacity'});});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;let targets=[e.target];if(window.SplitType){const split=new SplitType(e.target,{types:'lines',lineClass:'motion-line'});splits.push(split);targets=split.lines;}gsap.from(targets,{opacity:0,y:14,duration:.75,stagger:.08,ease:'power3.out',clearProps:'transform,opacity'});io.unobserve(e.target);}),{threshold:.12});
 document.querySelectorAll('section:not(#hero) h2:not(.sr-only)').forEach(n=>io.observe(n));
 let ticker=null;if(window.Lenis&&innerWidth>900){motionLenis=new Lenis({autoRaf:false,duration:1.05,smoothWheel:true});ticker=t=>motionLenis?.raf(t*1000);gsap.ticker.add(ticker);}
 cleanupMotion=()=>{io.disconnect();if(ticker)gsap.ticker.remove(ticker);motionLenis?.destroy();motionLenis=null;context.revert();for(const split of splits)split.revert();gsap.killTweensOf('.motion-line');};
}
Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>{document.documentElement.dataset.ready='true';startMotion();});
reduced.addEventListener('change',startMotion);addEventListener('pagehide',()=>cleanupMotion(),{once:true});
