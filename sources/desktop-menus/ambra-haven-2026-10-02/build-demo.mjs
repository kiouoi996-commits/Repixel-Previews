import fs from 'node:fs';
import path from 'node:path';
import {scene} from './effects.mjs';
const root=import.meta.dirname;
const geometry=JSON.parse(fs.readFileSync(path.join(root,'geometry.json'),'utf8'));
const code=fs.readFileSync(path.join(root,'effects.mjs'),'utf8').replaceAll('export ','');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Desktop navigation hover studies</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#11121B;color:#e6e7eb;font:14px system-ui,sans-serif}main{width:min(1080px,100%);margin:0 auto;padding:24px 0}header,footer{padding:0 24px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}h1{font-size:18px;font-weight:500;margin:0 auto 0 0}select,header button{font:inherit;background:#242631;color:inherit;border:1px solid #484b59;border-radius:8px;padding:9px 12px}button,select,a{touch-action:manipulation}.stage{position:relative;width:100%;aspect-ratio:1080/608;isolation:isolate;background:#11121B;overflow:hidden}.art,.hits{position:absolute;inset:0}.art svg{display:block;width:100%;height:100%}.hits button,.hits a{position:absolute;background:transparent;border:0;color:transparent;font:inherit;cursor:pointer;padding:0;outline-offset:4px;border-radius:4px;text-decoration:none}.hits :focus-visible{outline:2px solid #ece7de}.hits [data-role=logo]{border-radius:8px}footer{font-size:12px;line-height:1.7;color:#9399a9}#status{min-height:20px;margin-left:auto}
</style></head><body><main><header><h1>Desktop navigation hover studies</h1><select id="variant" aria-label="Hover effect"></select><button id="replay" type="button">Replay preview</button><button id="interact" type="button">Try the menu</button></header><section class="stage" aria-label="Centered desktop menu"><div class="art" aria-hidden="true"></div><nav class="hits" aria-label="Primary navigation"></nav></section><footer><span>Hover or focus a navigation item. Each preview lasts eight seconds.</span><span id="status" role="status" aria-live="polite"></span></footer></main>
<script type="module">
${code}
const geometry=${JSON.stringify(geometry)};
const stage=document.querySelector('.stage'),art=document.querySelector('.art'),hits=document.querySelector('.hits'),select=document.querySelector('#variant'),status=document.querySelector('#status');
for(const s of studies){const o=document.createElement('option');o.value=s.number;o.textContent=s.title;select.append(o)}
let study=studies[0],mode='showcase',elapsed=0,last=0,raf=0,visible=true,disposed=false;
let slots=[];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const proportions=box=>({left:100*box[0]/1080+'%',top:100*box[1]/608+'%',width:100*box[2]/1080+'%',height:100*box[3]/608+'%'});
function interactive(){mode='interactive';status.textContent='';last=0;wake()}
function target(index,on){interactive();const now=performance.now()/1000,s=slots[index];s.from=s.p;s.to=on?1:0;s.transition=now;if(on){s.enter=now;s.age=0}wake()}
function dispatch(action,label){stage.dispatchEvent(new CustomEvent('navigation-action',{bubbles:true,detail:{menu:study.menu,action,label}}));const messages={contact:'Contact inquiry requested',reserve:'Reservation requested',login:'Login requested','toggle-language':'Language change requested','open-menu':'Menu requested','scene-01':'Interiors requested','scene-02':'Projects requested','scene-03':'About requested',home:'Home requested'};status.textContent=messages[action]||label+' requested'}
function hit(label,box,action,index,role='item'){
 const button=document.createElement(action.startsWith('scene-')||action==='home'?'a':'button');
 if(button.tagName==='A')button.href=action==='home'?'#':'#'+action;else button.type='button';
 button.textContent=label;button.setAttribute('aria-label',label);button.dataset.role=role;Object.assign(button.style,proportions(box));
 button.addEventListener('click',e=>{e.preventDefault();interactive();if(action!=='placeholder-logo')dispatch(action,label)});
 if(index!==undefined){let pointer=false,focus=false;const update=()=>target(index,pointer||focus);button.addEventListener('pointerenter',()=>{pointer=true;update()});button.addEventListener('pointerleave',()=>{pointer=false;update()});button.addEventListener('focus',()=>{focus=true;update()});button.addEventListener('blur',()=>{focus=false;update()})}
 hits.append(button);
}
function reset(){
 study=studies.find(s=>s.number===Number(select.value));slots=Array.from({length:4},()=>({p:0,from:0,to:0,transition:0,enter:0,age:0}));hits.replaceChildren();const menu=geometry.menus[study.menu];
 menu.items.forEach((item,i)=>hit(item.text,item.hitBox,item.action,i));
 if(study.menu==='ambra'){hit('AMBRA home',[60,286,160,40],'scene-01',undefined,'logo');hit('EN / FR',[880,286,96,40],'toggle-language');hit('Open menu',[980,281,48,46],'open-menu')}
 else{hit('Haven logo',[160,284,133,40],'placeholder-logo',undefined,'logo');hit('Login',menu.loginBox,'login')}
 mode='showcase';elapsed=0;last=0;status.textContent='';paint();wake();
}
function states(now){return slots.map(s=>{const q=smooth((now-s.transition)/(s.to?smoothDuration.enter:smoothDuration.leave));s.p=s.from+(s.to-s.from)*q;s.age=Math.max(0,now-s.enter);return{strength:reduce.matches?s.to:s.p,age:reduce.matches?10:s.age}})}
const smoothDuration={enter:.32,leave:.25};
function paint(now=performance.now()/1000){art.innerHTML=mode==='showcase'?scene(study.number,reduce.matches?0:elapsed,geometry,{pointer:!reduce.matches}):scene(study.number,0,geometry,{states:states(now),pointer:false})}
function tick(ts){raf=0;if(disposed||document.hidden||!visible){last=0;return}const now=ts/1000;if(mode==='showcase'&&!reduce.matches&&last)elapsed=(elapsed+Math.min(now-last,.1))%8;last=now;paint(now);raf=requestAnimationFrame(tick)}
function wake(){if(!raf&&!disposed&&!document.hidden&&visible)raf=requestAnimationFrame(tick)}
select.addEventListener('change',reset);document.querySelector('#replay').addEventListener('click',reset);document.querySelector('#interact').addEventListener('click',interactive);
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();else{cancelAnimationFrame(raf);raf=0}},{threshold:.01});observer.observe(stage);
reduce.addEventListener('change',()=>{last=0;paint();wake()});window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect()},{once:true});
reset();
</script></body></html>`;
fs.writeFileSync(path.join(root,'demo.html'),html);
const repo=path.resolve(root,'../../..');
const vectorDir=path.join(repo,'images/menus/vectors');fs.mkdirSync(vectorDir,{recursive:true});
for(const [menu,id]of [['ambra',145],['haven',148]])fs.writeFileSync(path.join(vectorDir,`${menu}-desktop-navbar-2026-10-02.svg`),scene(id,0,geometry,{pointer:false,transparent:true}));
fs.writeFileSync(path.join(vectorDir,'desktop-menu-pointer-2026-10-02.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0L0 18L4.9 13.8L8.4 21.4L11.7 19.8L8.2 12.3L14.8 12.1Z" fill="#FFF" stroke="#090B10" stroke-width="1.2" stroke-linejoin="round"/></svg>\n');
console.log('Built standalone semantic demo and three vector resources.');
