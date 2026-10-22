import json
from pathlib import Path

root=Path(__file__).parent
core=(root/'studies.mjs').read_text().replace('export ', '')
atlas=(root/'glyphs.json').read_text()
photo_data=json.loads((root/'photos.json').read_text())
origins=json.loads((root/'asset-origins.json').read_text())
for name in ['adobe-courtyard.webp','sunset-viewpoint.webp','canyon-creek.webp']:
    photo_data[name]=origins[name]
photos=json.dumps(photo_data,separators=(',', ':'))
runtime=r'''
const kind=document.body.dataset.kind,stage=document.querySelector('main'),visual=document.querySelector('#visual'),controls=document.querySelector('#controls'),status=document.querySelector('#status');
const narrowQuery=matchMedia('(max-width: 640px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const choices=kind==='chroma'?CONFIG.colors:CONFIG.projects;
let narrow=narrowQuery.matches,selected=0,animation=null,pending=null,frame=0,lastKey='',demo=new URLSearchParams(location.search).get('demo')==='1'&&!reduced.matches,demoStart=performance.now(),copied=false,copyTimer=0,disposed=false,lastAnnounced=0;
const buttons=choices.map((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=kind==='chroma'?`Choose ${item.name}, ${item.hex}`:`Show project ${i+1}: ${item.title}`;b.addEventListener('click',()=>{stopDemo();request(i);});controls.append(b);return b;});
let copyButton=null;if(kind==='chroma'){copyButton=document.createElement('button');copyButton.type='button';copyButton.addEventListener('click',async()=>{stopDemo();const value=CONFIG.colors[currentIndex()].hex;try{await navigator.clipboard.writeText(value);copied=true;status.textContent=`Copied ${value} to clipboard.`;clearTimeout(copyTimer);copyTimer=setTimeout(()=>{copied=false;paint(getState(performance.now()),true);},1400);paint(getState(performance.now()),true);}catch{copied=false;status.textContent=`Copy failed. Select and copy this value: ${value}`;document.querySelector('#copy-fallback').textContent=value;document.querySelector('#copy-fallback').hidden=false;}});controls.append(copyButton);}
function getState(now){if(demo)return fixture((now-demoStart)/1000);if(!animation)return {from:selected,to:selected,progress:0};return{from:animation.from,to:animation.to,progress:clamp((now-animation.start)/(CONFIG.transition*1000))};}
function currentIndex(){const s=getState(performance.now());return s.from!==s.to&&s.progress>=.5?s.to:s.from;}
function positionButtons(){const l=layout(kind,narrow);stage.style.aspectRatio=`${l.w}/${l.h}`;for(let i=0;i<buttons.length;i++)place(buttons[i],l.selectors[i],l);if(copyButton)place(copyButton,l.copy,l);}
function place(el,b,l){const[x,y,w,h]=b;Object.assign(el.style,{left:`${x/l.w*100}%`,top:`${y/l.h*100}%`,width:`${w/l.w*100}%`,height:`${h/l.h*100}%`});}
function paint(s,force=false){const key=[narrow,s.from,s.to,s.progress.toFixed(5),copied].join('|');if(!force&&key===lastKey)return;lastKey=key;visual.innerHTML=render(kind,s,atlas,photos,narrow,copied);const i=s.from!==s.to&&s.progress>=.5?s.to:s.from;buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));if(copyButton)copyButton.setAttribute('aria-label',`Copy ${CONFIG.colors[i].hex}`);stage.dataset.selected=String(i);stage.dataset.animating=String(s.from!==s.to&&s.progress<1);if(lastAnnounced!==i){lastAnnounced=i;const item=choices[i];status.textContent=kind==='chroma'?`${item.name}, ${item.hex}`:`Project ${i+1} of 3: ${item.title}. ${item.place}.`;stage.dispatchEvent(new CustomEvent(kind==='chroma'?'palettechange':'projectchange',{bubbles:true,detail:{index:i,...item}}));}}
function stopDemo(){if(!demo)return;const s=getState(performance.now());selected=s.progress>=.5?s.to:s.from;demo=false;animation=s.from===s.to?null:{from:s.from,to:s.to,start:performance.now()-s.progress*CONFIG.transition*1000};document.querySelector('#demo-label').hidden=true;}
function request(i){copied=false;document.querySelector('#copy-fallback').hidden=true;if(reduced.matches){animation=null;pending=null;selected=i;paint(getState(performance.now()),true);return;}if(animation){pending=i;return;}if(i===selected){paint(getState(performance.now()),true);return;}animation={from:selected,to:i,start:performance.now()};wake();}
function tick(now){frame=0;if(disposed)return;let s=getState(now);paint(s);if(!demo&&animation&&s.progress>=1){selected=animation.to;animation=null;if(pending!==null){const next=pending;pending=null;request(next);}}if(demo||animation)wake();}
function wake(){if(!frame)frame=requestAnimationFrame(tick);}
stage.addEventListener('keydown',e=>{if(e.target===copyButton||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();stopDemo();const current=pending??animation?.to??selected;const next=e.key==='Home'?0:e.key==='End'?2:(current+(e.key==='ArrowRight'?1:2))%3;request(next);buttons[next].focus();});
narrowQuery.addEventListener('change',()=>{narrow=narrowQuery.matches;positionButtons();paint(getState(performance.now()),true);});
reduced.addEventListener('change',()=>{if(reduced.matches){stopDemo();selected=pending??animation?.to??selected;animation=null;pending=null;cancelAnimationFrame(frame);frame=0;paint(getState(performance.now()),true);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{if(demo)demoStart=performance.now();wake();}});
window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);clearTimeout(copyTimer);},{once:true});
if(kind==='fieldnotes')for(const project of CONFIG.projects){const image=new Image();image.addEventListener('error',()=>{document.querySelector('#copy-fallback').textContent='A photograph could not be loaded. Check the supplied asset URL and try again.';document.querySelector('#copy-fallback').hidden=false;});image.src=photos[project.file];}
document.querySelector('#demo-label').hidden=!demo;positionButtons();paint(getState(performance.now()),true);if(demo)wake();
'''
for kind,title in [('chroma','CHROMA — Iris Palette'),('fieldnotes','FIELDNOTES — Pull-Out Project Index')]:
    # Font paths are source geometry; photographs retain their existing pinned URLs.
    data_photos=photos if kind=='fieldnotes' else '{}'
    html='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'''+title+'''</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:16px;background:VAR_BG;font-family:system-ui,sans-serif}main{position:relative;width:min(1080px,100%);isolation:isolate}#visual{width:100%;line-height:0}svg{display:block;width:100%;height:auto}#controls{position:absolute;inset:0}#controls button{position:absolute;min-height:44px;background:transparent;color:transparent;border:0;padding:0;border-radius:10px;cursor:pointer;touch-action:manipulation;overflow:hidden;white-space:nowrap}#controls button:focus-visible{outline:2px solid VAR_FOCUS;outline-offset:3px}#controls button:hover{box-shadow:inset 0 0 0 1px VAR_HOVER}.sr-only{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}#demo-label{position:fixed;right:12px;bottom:8px;padding:6px 10px;background:#F1F0E8;color:#272C27;border:1px solid #7775;border-radius:20px;font-size:10px;z-index:5}#copy-fallback{position:fixed;bottom:36px;left:16px;background:#fff;color:#222;padding:12px;user-select:all;z-index:6}@media(max-width:640px){body{padding:12px}}
</style></head><body data-kind="VAR_KIND"><main aria-label="VAR_TITLE interactive reference"><h1 class="sr-only">VAR_TITLE</h1><div id="visual" aria-hidden="true"></div><div id="controls" role="group" aria-label="Choose VAR_CHOICE"></div><p id="status" class="sr-only" aria-live="polite" aria-atomic="true"></p></main><div id="demo-label" hidden>Animation preview · choose an item to interact</div><output id="copy-fallback" hidden></output><script type="module">
'''+core+'\nconst atlas='+atlas+';\nconst photos='+data_photos+';\n'+runtime+'\n</script></body></html>\n'
    html=html.replace('VAR_BG','#181B18' if kind=='chroma' else '#ECE9DF').replace('VAR_FOCUS','#E2E8C5' if kind=='chroma' else '#B95435').replace('VAR_HOVER','#F1F0E830' if kind=='chroma' else '#272C2730').replace('VAR_KIND',kind).replace('VAR_TITLE',title).replace('VAR_CHOICE','a colour' if kind=='chroma' else 'a place')
    (root/f'{kind}.html').write_text(html)
print('Interactive references built with exact font paths and pinned photographs')
