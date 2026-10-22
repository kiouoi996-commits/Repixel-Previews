import json
from pathlib import Path

root=Path(__file__).parent
core=(root/'studies.mjs').read_text().replace('export ','')
atlas=(root/'glyphs.json').read_text()
photos=(root/'photos.json').read_text()
runtime=r'''
const kind=document.body.dataset.kind,stage=document.querySelector('main'),visual=document.querySelector('#visual'),controls=document.querySelector('#controls'),status=document.querySelector('#status');
const mobile=matchMedia('(max-width:640px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),items=kind==='kite'?CONFIG.days:CONFIG.routes;
let narrow=mobile.matches,selected=0,animation=null,pending=null,frame=0,last='',disposed=false,demo=new URLSearchParams(location.search).get('demo')==='1'&&!reduced.matches,demoStart=performance.now(),announced=-1;
const saved=new Set();
function state(now){return demo?fixture((now-demoStart)/1000,kind):animation?{from:animation.from,to:animation.to,progress:clamp((now-animation.start)/1100)}:{from:selected,to:selected,progress:0};}
function active(s){return s.from!==s.to&&s.progress<.45?s.from:s.to;}
const buttons=items.map((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=kind==='kite'?`Show ${item.day}, October ${item.date}`:`Choose ${item.name}, ${item.distance} kilometers`;b.addEventListener('click',()=>{stopDemo();request(i);});controls.append(b);return b;});
let nextButton=null;if(kind==='kite'){nextButton=document.createElement('button');nextButton.type='button';nextButton.textContent='Next day';nextButton.addEventListener('click',()=>{stopDemo();request(((pending??animation?.to??selected)+1)%items.length);});controls.append(nextButton);}
let saveButton=null;if(kind==='moss'){saveButton=document.createElement('button');saveButton.type='button';saveButton.addEventListener('click',()=>{stopDemo();const i=active(state(performance.now()));saved.has(i)?saved.delete(i):saved.add(i);paint(state(performance.now()),true);status.textContent=`${items[i].name} ${saved.has(i)?'saved':'removed from saved routes'}.`;stage.dispatchEvent(new CustomEvent('routesave',{bubbles:true,detail:{index:i,saved:saved.has(i),...items[i]}}));});controls.append(saveButton);}
function place(b,a,l){Object.assign(b.style,{left:`${a[0]/l.w*100}%`,top:`${a[1]/l.h*100}%`,width:`${a[2]/l.w*100}%`,height:`${a[3]/l.h*100}%`});}
function resize(){const l=layout(kind,narrow);stage.style.aspectRatio=`${l.w}/${l.h}`;buttons.forEach((b,i)=>place(b,l.selectors[i],l));if(saveButton)place(saveButton,l.save,l);if(nextButton)place(nextButton,l.next,l);}
function paint(s,force=false){const i=active(s),key=[narrow,s.from,s.to,s.progress.toFixed(5),saved.has(i)].join('|');if(!force&&key===last)return;last=key;visual.innerHTML=render(kind,s,atlas,photos,narrow,saved.has(i));buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));if(saveButton){saveButton.setAttribute('aria-pressed',String(saved.has(i)));saveButton.setAttribute('aria-label',`${saved.has(i)?'Unsave':'Save'} ${items[i].name}`);}stage.dataset.selected=String(i);stage.dataset.animating=String(s.from!==s.to&&s.progress<1);if(i!==announced){announced=i;const item=items[i];status.textContent=kind==='kite'?`${item.day}, October ${item.date}. ${item.hours} hours planned. ${item.percent} percent capacity.`:`${item.name}. ${item.distance} kilometers. ${item.duration}. ${item.rise} ascent.`;stage.dispatchEvent(new CustomEvent(kind==='kite'?'daychange':'routechange',{bubbles:true,detail:{index:i,...item}}));}}
function stopDemo(){if(!demo)return;const now=performance.now(),s=state(now);selected=active(s);demo=false;animation=s.from===s.to?null:{from:s.from,to:s.to,start:now-s.progress*1100};document.querySelector('#demo-label').hidden=true;}
function request(i){if(reduced.matches){animation=null;pending=null;selected=i;paint(state(performance.now()),true);return;}if(animation){pending=i;return;}if(i===selected)return;animation={from:selected,to:i,start:performance.now()};wake();}
function tick(now){frame=0;if(disposed)return;const s=state(now);paint(s);if(!demo&&animation&&s.progress>=1){selected=animation.to;animation=null;if(pending!==null){const next=pending;pending=null;request(next);}}if(demo||animation)wake();}
function wake(){if(!frame)frame=requestAnimationFrame(tick);}
stage.addEventListener('keydown',e=>{if(e.target===saveButton||e.target===nextButton||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();stopDemo();const i=pending??animation?.to??selected,next=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:items.length-1))%items.length;request(next);buttons[next].focus();});
mobile.addEventListener('change',()=>{narrow=mobile.matches;resize();paint(state(performance.now()),true);});
reduced.addEventListener('change',()=>{if(reduced.matches){stopDemo();selected=pending??animation?.to??selected;animation=null;pending=null;cancelAnimationFrame(frame);frame=0;paint(state(performance.now()),true);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{if(demo)demoStart=performance.now();wake();}});
window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);},{once:true});
if(kind==='moss')for(const url of Object.values(photos)){const img=new Image();img.addEventListener('error',()=>{const error=document.querySelector('#asset-error');error.hidden=false;error.textContent='The landscape could not be loaded. Check the supplied image URLs.';});img.src=url;}
resize();paint(state(performance.now()),true);document.querySelector('#demo-label').hidden=!demo;if(demo)wake();
'''
for kind,title in [('kite','KITE — Elastic Week Planner'),('moss','MOSS — Glass Trail Selector')]:
    data_photos=photos if kind=='moss' else '{}'
    html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VAR_TITLE</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;background:VAR_BG;font-family:system-ui,sans-serif}main{width:min(1080px,100%);position:relative;isolation:isolate}#visual{line-height:0}svg{display:block;width:100%;height:auto}#controls{position:absolute;inset:0}button{position:absolute;min-height:44px;background:transparent;color:transparent;border:0;padding:0;cursor:pointer;touch-action:manipulation;border-radius:50px;overflow:hidden;white-space:nowrap}button:focus-visible{outline:3px solid VAR_FOCUS;outline-offset:4px}button:hover{box-shadow:inset 0 0 0 1px #ffffff70}.sr-only{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}#demo-label{position:fixed;right:12px;bottom:8px;background:#f7faf0e8;color:#162717;padding:6px 10px;border-radius:20px;font-size:10px;z-index:5}#asset-error{position:fixed;bottom:35px;left:12px;right:12px;padding:12px;background:#fff;color:#222;z-index:6}
</style></head><body data-kind="VAR_KIND"><main aria-label="VAR_TITLE interactive reference"><h1 class="sr-only">VAR_TITLE</h1><div id="visual" aria-hidden="true"></div><div id="controls" role="group" aria-label="VAR_GROUP"></div><p id="status" class="sr-only" aria-live="polite" aria-atomic="true"></p></main><div id="demo-label" hidden>Animation preview · choose an item to interact</div><output id="asset-error" hidden></output><script type="module">
'''+core+'\nconst atlas='+atlas+';\nconst photos='+data_photos+';\n'+runtime+'\n</script></body></html>\n'
    html=html.replace('VAR_TITLE',title).replace('VAR_KIND',kind).replace('VAR_BG','#B6BEB4' if kind=='kite' else '#122922').replace('VAR_FOCUS','#35472D' if kind=='kite' else '#E4FF5E').replace('VAR_GROUP','Choose a day' if kind=='kite' else 'Choose a trail')
    (root/f'{kind}.html').write_text(html)
print('Two accessible interactive references built')
