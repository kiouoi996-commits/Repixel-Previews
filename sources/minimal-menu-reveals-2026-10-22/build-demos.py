from pathlib import Path
import json

root=Path(__file__).resolve().parent
module=(root/'motion.mjs').read_text().replace('export const ','const ').replace('export function ','function ')
atlas=(root/'glyphs.json').read_text().strip()
template=r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>__TITLE__</title>
<style>
@font-face{font-family:Manrope;src:url('https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/b7df5b80a0f43bbf7167126b7fd1d33adad793a7/fonts/text-effects/lamped-2026-10-01/Manrope-350.woff') format('woff');font-weight:350;font-display:swap}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:#0a0a0a;background:#f2f3f6;font-family:Manrope,Arial,sans-serif;font-weight:350}.sr-only{position:absolute;top:0;left:0;margin:0;padding:0;border:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}button,input,a{-webkit-tap-highlight-color:transparent}button,a{touch-action:manipulation}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #121212;outline-offset:3px}#page{padding:48px clamp(24px,7vw,120px)}#page header{font-size:22px;letter-spacing:1px}#page section{max-width:740px;min-height:80svh;padding-top:15svh}#page h1{font-size:clamp(38px,6vw,80px);font-weight:350;line-height:1.12;letter-spacing:-2px}#page h2{font-size:40px;font-weight:350}#page p{line-height:1.7;max-width:45ch}#toggle{position:fixed;z-index:2;right:30px;top:28px;display:flex;align-items:center;gap:18px;background:transparent;border:0;padding:12px;color:#111;font:350 20px Manrope,Arial,sans-serif;letter-spacing:1px}#toggle[hidden]{display:none}#toggle svg{width:28px;height:28px}#menu-dialog{position:fixed;inset:0 0 0 auto;margin:0;border:0;padding:0;width:min(100vw,460px);height:100dvh;max-width:100vw;max-height:none;overflow-y:auto;overflow-x:hidden;background:transparent;color:#111;box-shadow:-20px 0 60px #747b8722}#menu-dialog::backdrop{background:#f2f3f6dd;backdrop-filter:blur(5px)}#art{display:block;width:100%;height:100%;overflow:hidden;pointer-events:none}#close{position:absolute;border:0;padding:0;background:transparent;color:transparent;min-width:44px;min-height:44px;z-index:2;border-radius:8px}#links a{position:absolute;display:grid;place-items:center;text-decoration:none;background:transparent;border-radius:10px;color:transparent;min-height:44px}#links a[hidden]{display:none}#search{position:absolute;display:flex;align-items:center;min-height:44px}#query{height:44px;min-width:0;width:calc(100% - 44px);background:transparent;color:#111;border:0;padding:0 8px;font:350 16px Manrope,Arial,sans-serif;border-radius:4px;outline-offset:1px}#search button{position:absolute;right:0;width:44px;height:44px;background:transparent;border:0;color:transparent;border-radius:8px}#preview{max-width:1080px;margin:auto;line-height:0}#preview svg{display:block;width:100%;height:auto}#demo-note{position:fixed;left:12px;bottom:12px;background:#fff;border:1px solid #ddd;padding:8px 12px;border-radius:20px;font:12px Arial,sans-serif}#preview[hidden],#demo-note[hidden],#page[hidden]{display:none}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body data-kind="__KIND__">
<main id="page"><header>studio</header><section id="about"><h1>Thoughtful design<br>for modern brands.</h1><p>Independent design with a considered point of view.</p></section><section id="home"><h2>Home</h2><p>A place for thoughtful ideas and clear expression.</p></section><section id="works"><h2>Works</h2><p>Selected design projects and visual studies.</p></section><section id="studio"><h2>Studio</h2><p>We bring clarity, craft and curiosity to every project.</p></section><section id="contact"><h2>Contact</h2><a href="mailto:hello@example.com">hello@example.com</a><p>This example address is a placeholder. Replace it with your own contact.</p></section></main>
<button id="toggle" type="button" aria-haspopup="dialog" aria-controls="menu-dialog" aria-expanded="false"><span>menu</span><svg aria-hidden="true" viewBox="0 0 30 30"><path d="M2 9H28M2 21H28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="sr-only">Open menu</span></button>
<dialog id="menu-dialog" aria-labelledby="menu-title"><h2 id="menu-title" class="sr-only">Site navigation</h2><svg id="art" aria-hidden="true"></svg><button id="close" type="button" aria-label="Close menu"></button><nav id="links" aria-label="Main menu"></nav><form id="search" role="search"><label class="sr-only" for="query">Search menu</label><input id="query" type="search" autocomplete="off"><button type="submit" aria-label="Search">Search</button></form><p id="search-status" class="sr-only" role="status" aria-live="polite"></p><p class="sr-only">Thoughtful design for modern brands. Language: English.</p></dialog>
<div id="preview" hidden aria-label="Animated menu preview"></div><p id="demo-note" hidden>Animation preview · click to use the menu</p>
<script>__GSAP__</script>
<script>
__MODULE__
const ATLAS=__ATLAS__;
const kind=document.body.dataset.kind,variant=CONFIG.variants[kind];
const dialog=document.querySelector('#menu-dialog'),art=document.querySelector('#art'),toggle=document.querySelector('#toggle'),closeButton=document.querySelector('#close'),nav=document.querySelector('#links'),search=document.querySelector('#search'),query=document.querySelector('#query'),status=document.querySelector('#search-status'),page=document.querySelector('#page'),preview=document.querySelector('#preview'),note=document.querySelector('#demo-note');
const state={p:0},reduced=matchMedia('(prefers-reduced-motion: reduce)');
let animation=null,targetOpen=false,generation=0,afterClose=null,previousOverflow='',previousFocus=null,raf=0,demo=false,selected=CONFIG.items.find(item=>location.hash==='#'+item.toLowerCase())||'About';
for(const name of CONFIG.items){const link=document.createElement('a');link.href='#'+name.toLowerCase();link.setAttribute('aria-label',name);link.innerHTML='<span class="sr-only">'+name+'</span>';link.dataset.name=name;link.addEventListener('click',event=>{event.preventDefault();selected=name;afterClose=()=>{history.pushState(null,'',link.hash);document.querySelector(link.hash)?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});};setOpen(false);});nav.append(link);}
function measure(){const rect=dialog.getBoundingClientRect();return layout(dialog.clientWidth||rect.width||Math.min(innerWidth,460),Math.max(700,rect.height||innerHeight));}
function paint(){
 if(!dialog.open)return;
 const L=measure(),{w,h,scale,sx,sy}=L;
 art.setAttribute('viewBox',`0 0 ${w} ${h}`);art.style.height=h+'px';
 art.innerHTML=renderPanel(kind,state.p,ATLAS,{width:w,height:h,selected,query:query.value,shadow:false});
 const enabled=targetOpen&&state.p>=.999;
 nav.inert=!enabled;search.inert=!enabled;
 closeButton.style.cssText=`left:${w-160*sx}px;top:${L.close.y-24}px;width:${140*sx}px;height:48px`;
 for(const [i,link] of [...nav.children].entries()){
  const name=link.dataset.name,visible=!query.value||name.toLowerCase().includes(query.value.toLowerCase());
  link.hidden=!visible;link.style.cssText=`left:${w*.16}px;top:${L.rows[i]-L.font*.92}px;width:${w*.68}px;height:${Math.max(44,L.font*1.35)}px`;
  if(selected===name)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 }
 search.style.cssText=`left:${L.search.x}px;top:${L.search.y}px;width:${L.search.w}px;height:${Math.max(44,L.search.h)}px`;
}
function finish(token){
 if(token!==generation)return;
 if(targetOpen){state.p=1;paint();}
 else{state.p=0;dialog.close();document.body.style.overflow=previousOverflow;toggle.hidden=false;toggle.setAttribute('aria-expanded','false');(previousFocus?.isConnected?previousFocus:toggle).focus({preventScroll:true});const action=afterClose;afterClose=null;action?.();}
}
function setOpen(open){
 generation++;const token=generation;animation?.kill();animation=null;targetOpen=open;
 if(open){afterClose=null;if(!dialog.open){previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();toggle.hidden=true;toggle.setAttribute('aria-expanded','true');closeButton.focus({preventScroll:true});}}
 if(!dialog.open)return;
 nav.inert=true;search.inert=true;
 const duration=(open?variant.open:variant.close)/1000*Math.abs((open?1:0)-state.p);
 if(reduced.matches||!window.gsap||duration<.001){state.p=open?1:0;paint();finish(token);return;}
 animation=gsap.to(state,{p:open?1:0,duration,ease:'none',onUpdate:paint,onComplete:()=>finish(token)});
 paint();
}
toggle.addEventListener('click',()=>setOpen(true));closeButton.addEventListener('click',()=>setOpen(false));
dialog.addEventListener('cancel',event=>{event.preventDefault();setOpen(false);});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)setOpen(false);});
query.addEventListener('input',()=>{paint();status.textContent=[...nav.children].filter(link=>!link.hidden).length+' matching links';});
search.addEventListener('submit',event=>{event.preventDefault();if(!query.value){query.focus();return;}const first=[...nav.children].find(link=>!link.hidden);if(first)first.click();else status.textContent='No matching menu links.';});
addEventListener('resize',paint);addEventListener('hashchange',()=>{selected=CONFIG.items.find(item=>location.hash==='#'+item.toLowerCase())||selected;paint();});
reduced.addEventListener('change',()=>{if(dialog.open)setOpen(targetOpen);});
function stopPreview(){demo=false;cancelAnimationFrame(raf);preview.hidden=true;note.hidden=true;page.hidden=false;toggle.hidden=false;setOpen(true);}
if(new URLSearchParams(location.search).get('demo')==='1'){
 demo=true;page.hidden=true;toggle.hidden=true;preview.hidden=false;note.hidden=false;const start=performance.now();
 const tick=now=>{if(!demo)return;preview.innerHTML=renderFrame(kind,reduced.matches?3:(now-start)/1000,ATLAS);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);preview.addEventListener('pointerdown',stopPreview,{once:true});note.addEventListener('click',stopPreview,{once:true});
}
addEventListener('pagehide',()=>{animation?.kill();cancelAnimationFrame(raf);document.body.style.overflow=previousOverflow;});
</script></body></html>
'''
variants={'iris':(182,'corner-iris-menu-reveal','Corner Iris Menu Reveal'),'seam':(183,'center-seam-menu-reveal','Center Seam Menu Reveal'),'ribbons':(184,'ribbon-cascade-menu-reveal','Ribbon Cascade Menu Reveal'),'curtain':(185,'elastic-curtain-menu-reveal','Elastic Curtain Menu Reveal')}
for kind,(number,slug,title) in variants.items():
    html=template.replace('__TITLE__',title).replace('__KIND__',kind).replace('__MODULE__',module).replace('__ATLAS__',atlas).replace('__GSAP__',(root/'vendor/gsap.min.js').read_text())
    (root/f'{number}-{slug}.html').write_text(html)
print('Built four interactive menus with shared geometry and reversible GSAP transitions.')
