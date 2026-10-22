from pathlib import Path

root=Path(__file__).parent
core=(root/'studies.mjs').read_text().replace('export ','')
atlas=(root/'glyphs.json').read_text()
photos=(root/'photos.json').read_text()
gsap=(root/'vendor/gsap.min.js').read_text()
runtime=r'''
const kind=document.body.dataset.kind,stage=document.querySelector('main'),visual=document.querySelector('#visual'),controls=document.querySelector('#controls'),status=document.querySelector('#status'),errorBox=document.querySelector('#error'),fallback=document.querySelector('#copy-fallback');
const mobile=matchMedia('(max-width:640px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let narrow=mobile.matches,disposed=false,demo=new URLSearchParams(location.search).get('demo')==='1'&&!reduced.matches,demoStart=performance.now(),last='',copied=false,copyTimer=0,extracting=false,dragging=false;
let product={open:0,finishFrom:0,finishTo:0,finishProgress:0,rotation:-24},openTarget=0,finishIndex=0,openTween=null,finishTween=null;
let currentView=view(0),animation=null,pending=null,themeTween=null,latestFile=0,announcement='';
const uploaded=new Map(),buttons=[];
const button=(label,handler)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',handler);controls.append(b);buttons.push(b);return b;};
const isChanging=()=>Boolean(openTween||finishTween||animation);
function getState(now=performance.now()){
 if(demo)return fixture((now-demoStart)/1000,kind);
 if(kind==='orbital')return {open:product.open,finishFrom:product.finishFrom,finishTo:product.finishTo,finishProgress:product.finishProgress,finishColorFrom:product.finishColorFrom,rotation:product.rotation};
 return{from:animation?.from??currentView,to:animation?.to??currentView,progress:animation?.progress??0,copied,extracting,dragging};
}
function shownView(){const s=getState();return s.progress>=.5?s.to:s.from;}
function targetView(){return pending??animation?.to??currentView;}
function announce(message){if(message!==announcement){announcement=message;status.textContent=message;}}
function paint(force=false){if(disposed)return;const s=getState(),key=JSON.stringify([s,narrow]);if(!force&&key===last)return;last=key;visual.innerHTML=render(kind,s,atlas,photos,narrow);stage.dataset.animating=String(demo||isChanging());
 if(kind==='orbital'){
  const index=s.finishProgress>=.5?s.finishTo:s.finishFrom;
  openButton.setAttribute('aria-label',s.open>.5?'Assemble the speaker':'Explore the speaker inside');openButton.setAttribute('aria-expanded',String(s.open>.5));finishButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(index===i)));rotation.value=String(s.rotation);rotation.setAttribute('aria-valuetext',`${Math.round(s.rotation)} degrees`);
  stage.dataset.finish=String(index);stage.dataset.open=s.open.toFixed(4);stage.dataset.rotation=s.rotation.toFixed(2);
 }else{
  const active=s.progress>=.5?s.to:s.from;themeButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(CONFIG.themes[i].name===active.theme.name)));modeButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(Number(active.dark)===i)));
  stage.dataset.theme=active.theme.name;stage.dataset.mode=active.dark?'dark':'light';stage.dataset.extracting=String(extracting);copyButton.setAttribute('aria-label',copied?'CSS copied':'Copy CSS tokens');
 }
}
function emitProduct(){stage.dispatchEvent(new CustomEvent('productchange',{bubbles:true,detail:{finish:CONFIG.finishes[finishIndex],open:openTarget===1,rotation:product.rotation}}));}
function stopDemo(){if(!demo)return;const s=getState();demo=false;gsap.ticker.remove(demoTick);document.querySelector('#demo-label').hidden=true;
 if(kind==='orbital'){product={...s};finishIndex=s.finishTo;openTarget=s.open>=.5?1:0;if(s.open>0&&s.open<1)openTween=gsap.to(product,{open:openTarget,duration:Math.max(.1,1.2*Math.abs(openTarget-s.open)),ease:'power2.inOut',onUpdate:()=>paint(),onComplete:()=>{openTween=null;paint(true);}});if(s.finishFrom!==s.finishTo&&s.finishProgress<1)finishTween=gsap.to(product,{finishProgress:1,duration:.8*(1-s.finishProgress),ease:'none',onUpdate:()=>paint(),onComplete:()=>{finishTween=null;paint(true);}});}
 else{currentView=s.from;if(JSON.stringify(s.from)!==JSON.stringify(s.to)&&s.progress<1){animation={from:s.from,to:s.to,progress:s.progress};runThemeAnimation(1.1*(1-s.progress));}else{currentView=s.to;animation=null;}pending=null;}
 paint(true);
}
function chooseFinish(i){stopDemo();finishTween?.kill();const previousColor=finishColor(product),from=product.finishProgress>=.5?product.finishTo:product.finishFrom;finishIndex=i;product.finishColorFrom=previousColor;product.finishFrom=from;product.finishTo=i;product.finishProgress=0;if(reduced.matches){product.finishFrom=i;product.finishProgress=1;finishTween=null;paint(true);}else{finishTween=gsap.to(product,{finishProgress:1,duration:.8,ease:'power2.inOut',onUpdate:()=>paint(),onComplete:()=>{finishTween=null;product.finishFrom=i;product.finishTo=i;product.finishProgress=0;delete product.finishColorFrom;paint(true);}});}announce(`${CONFIG.finishes[i].name} finish selected.`);emitProduct();}
function toggleOpen(){stopDemo();openTarget=openTarget?0:1;openTween?.kill();if(reduced.matches){product.open=openTarget;openTween=null;paint(true);}else openTween=gsap.to(product,{open:openTarget,duration:1.2,ease:'power2.inOut',onUpdate:()=>paint(),onComplete:()=>{openTween=null;paint(true);}});announce(openTarget?'Exploring five speaker components.':'Speaker assembled.');emitProduct();}
function cleanUploads(){const keep=new Set([currentView.theme.photo,animation?.from.theme.photo,animation?.to.theme.photo,pending?.theme.photo]);for(const[key,url]of uploaded)if(!keep.has(key)){URL.revokeObjectURL(url);delete photos[key];uploaded.delete(key);}}
function requestTheme(next){stopDemo();copied=false;fallback.hidden=true;clearTimeout(copyTimer);if(reduced.matches){themeTween?.kill();animation=null;pending=null;currentView=next;cleanUploads();paint(true);emitTheme(next);return;}if(animation){pending=next;cleanUploads();return;}if(JSON.stringify(currentView)===JSON.stringify(next)){paint(true);return;}animation={from:currentView,to:next,progress:0};runThemeAnimation();announce(`Applying ${next.theme.name}, ${next.dark?'dark':'light'} theme.`);}
function runThemeAnimation(duration=1.1){themeTween=gsap.to(animation,{progress:1,duration,ease:'none',onUpdate:()=>paint(),onComplete:()=>{currentView=animation.to;animation=null;themeTween=null;paint(true);emitTheme(currentView);if(pending){const next=pending;pending=null;requestTheme(next);}cleanUploads();}});}
function emitTheme(v){stage.dispatchEvent(new CustomEvent('themechange',{bubbles:true,detail:{name:v.theme.name,dark:v.dark,tokens:palette(v),css:cssForView(v)}}));announce(`${v.theme.name}, ${v.dark?'dark':'light'} theme ready.`);}
async function copyCSS(){stopDemo();const v=targetView(),css=cssForView(v);try{await navigator.clipboard.writeText(css);copied=true;announce(`Copied ${v.theme.name} ${v.dark?'dark':'light'} CSS tokens.`);stage.dispatchEvent(new CustomEvent('themeexport',{bubbles:true,detail:{tokens:palette(v),css}}));clearTimeout(copyTimer);copyTimer=setTimeout(()=>{copied=false;paint(true);},1800);paint(true);}catch{copied=false;fallback.hidden=false;fallback.querySelector('textarea').value=css;fallback.querySelector('textarea').focus();fallback.querySelector('textarea').select();announce('Automatic copy failed. Select and copy the CSS below.');paint(true);}}
async function acceptImage(file){if(!file)return;stopDemo();const token=++latestFile;errorBox.hidden=true;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)){showError('Choose a PNG, JPEG or WebP image.');return;}
 if(file.size>10*1024*1024){showError('Choose an image smaller than 10 MB.');return;}
 extracting=true;paint(true);announce('Reading colours from your image.');
 try{const bitmap=await createImageBitmap(file,{resizeWidth:64,resizeHeight:64,resizeQuality:'high'});const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0,64,64);bitmap.close();const pixels=context.getImageData(0,0,64,64).data;const key='upload-'+token,theme=extractTheme(pixels,'Your image',key);if(token!==latestFile||disposed)return;const url=URL.createObjectURL(file);photos[key]=url;uploaded.set(key,url);requestTheme({theme,dark:targetView().dark});announce('Colours extracted from your image.');}
 catch{if(token===latestFile)showError('This image could not be read. Choose another PNG, JPEG or WebP.');}
 finally{if(token===latestFile){extracting=false;paint(true);}fileInput.value='';}
}
function showError(message){errorBox.hidden=false;errorBox.textContent=message;announce(message);}
let openButton=null,finishButtons=[],rotation=null,themeButtons=[],modeButtons=[],copyButton=null,uploadButton=null,sampleButton=null,fileInput=null;
if(kind==='orbital'){
 openButton=button('Explore the speaker inside',toggleOpen);
 finishButtons=CONFIG.finishes.map((f,i)=>button(`Choose ${f.name} finish`,()=>chooseFinish(i)));
 rotation=document.createElement('input');rotation.type='range';rotation.min='-50';rotation.max='50';rotation.step='1';rotation.value='-24';rotation.setAttribute('aria-label','Rotate the speaker');rotation.addEventListener('input',()=>{const nextRotation=Number(rotation.value);stopDemo();product.rotation=nextRotation;paint(true);emitProduct();});controls.append(rotation);
}else{
 themeButtons=CONFIG.themes.map((theme,i)=>button(`Choose ${theme.name} palette`,()=>{latestFile++;extracting=false;requestTheme({theme,dark:targetView().dark});}));
 modeButtons=[false,true].map(dark=>button(dark?'Use dark theme':'Use light theme',()=>requestTheme({theme:targetView().theme,dark})));
 uploadButton=button('Use your own image',()=>{stopDemo();fileInput.click();});copyButton=button('Copy CSS tokens',copyCSS);sampleButton=button('Use this look and copy CSS',copyCSS);
 fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='image/png,image/jpeg,image/webp';fileInput.hidden=true;fileInput.setAttribute('aria-label','Choose reference image');fileInput.addEventListener('change',()=>acceptImage(fileInput.files?.[0]));controls.append(fileInput);
 stage.addEventListener('dragover',event=>{if(!event.dataTransfer?.types.includes('Files'))return;event.preventDefault();const b=stage.getBoundingClientRect(),l=layout(kind,narrow),x=(event.clientX-b.left)*l.w/b.width,y=(event.clientY-b.top)*l.h/b.height,[sx,sy,sw,sh]=l.source;dragging=x>=sx&&x<=sx+sw&&y>=sy&&y<=sy+sh;paint(true);});
 stage.addEventListener('dragleave',event=>{if(!stage.contains(event.relatedTarget)){dragging=false;paint(true);}});
 stage.addEventListener('drop',event=>{event.preventDefault();const accept=dragging;dragging=false;paint(true);if(accept)acceptImage(event.dataTransfer?.files?.[0]);else showError('Drop the image inside the reference panel.');});
 for(const url of Object.values(photos)){const img=new Image();img.addEventListener('error',()=>showError('A reference image could not be loaded. Check the supplied asset links.'));img.src=url;}
}
function place(el,a,l){Object.assign(el.style,{left:`${a[0]/l.w*100}%`,top:`${a[1]/l.h*100}%`,width:`${a[2]/l.w*100}%`,height:`${a[3]/l.h*100}%`});}
function resize(){const l=layout(kind,narrow);stage.style.aspectRatio=`${l.w}/${l.h}`;if(kind==='orbital'){place(openButton,l.open,l);finishButtons.forEach((b,i)=>place(b,l.finishes[i],l));place(rotation,l.rotation,l);}else{themeButtons.forEach((b,i)=>place(b,l.presets[i],l));modeButtons.forEach((b,i)=>place(b,l.modes[i],l));place(uploadButton,l.upload,l);place(copyButton,l.copy,l);place(sampleButton,l.sampleCopy,l);}}
function demoTick(){if(!document.hidden)paint();}
mobile.addEventListener('change',()=>{narrow=mobile.matches;resize();paint(true);});
reduced.addEventListener('change',()=>{if(!reduced.matches)return;stopDemo();openTween?.kill();finishTween?.kill();themeTween?.kill();openTween=finishTween=themeTween=null;if(kind==='orbital'){product.open=openTarget;product.finishFrom=finishIndex;product.finishTo=finishIndex;product.finishProgress=0;delete product.finishColorFrom;}else{currentView=pending??animation?.to??currentView;animation=null;pending=null;cleanUploads();}paint(true);});
document.addEventListener('visibilitychange',()=>{if(demo&&document.hidden)gsap.ticker.remove(demoTick);else if(demo){demoStart=performance.now();gsap.ticker.add(demoTick);}if(!document.hidden)paint(true);});
window.addEventListener('pagehide',()=>{disposed=true;latestFile++;openTween?.kill();finishTween?.kill();themeTween?.kill();gsap.ticker.remove(demoTick);clearTimeout(copyTimer);for(const url of uploaded.values())URL.revokeObjectURL(url);uploaded.clear();},{once:true});
document.querySelector('#demo-label').hidden=!demo;resize();paint(true);if(demo)gsap.ticker.add(demoTick);
'''
for kind,title in [('orbital','ORBITAL — Exploded Product Studio'),('swatch','SWATCH — Reference-to-UI Studio')]:
    template='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VAR_TITLE</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;background:VAR_BG;font-family:system-ui,sans-serif}main{position:relative;width:min(1080px,100%);isolation:isolate}#visual{line-height:0}svg{display:block;width:100%;height:auto}#controls{position:absolute;inset:0}button,input[type=range]{position:absolute;min-height:44px;border:0;padding:0;background:transparent;color:transparent;cursor:pointer;border-radius:40px;touch-action:manipulation}button{overflow:hidden;white-space:nowrap}button:focus-visible,input:focus-visible{outline:3px solid #708B57;outline-offset:4px}button:hover{box-shadow:inset 0 0 0 1px #253B3350}input[type=range]{appearance:none;outline-offset:4px}input[type=range]::-webkit-slider-thumb{appearance:none;width:32px;height:32px;background:transparent;border:0}input[type=range]::-moz-range-thumb{width:32px;height:32px;background:transparent;border:0}.sr-only{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;white-space:nowrap}#demo-label{position:fixed;bottom:8px;right:12px;background:#fbfcf1ed;color:#23372B;border-radius:20px;padding:6px 10px;font-size:10px;z-index:4}#error,#copy-fallback{position:fixed;left:16px;right:16px;bottom:42px;background:#fffdf3;color:#27372c;border:1px solid #829777;border-radius:16px;padding:16px;z-index:5;font-size:14px}#copy-fallback textarea{width:100%;min-height:180px;resize:vertical}
</style></head><body data-kind="VAR_KIND"><main aria-label="VAR_TITLE interactive reference"><h1 class="sr-only">VAR_TITLE</h1><div id="visual" aria-hidden="true"></div><div id="controls" role="group" aria-label="VAR_GROUP"></div><p id="status" class="sr-only" aria-live="polite" aria-atomic="true"></p></main><div id="demo-label" hidden>Animation preview · interact to take control</div><output id="error" role="alert" hidden></output><div id="copy-fallback" hidden><label for="css-fallback">CSS tokens — select and copy</label><textarea id="css-fallback" readonly></textarea></div><script>'''+gsap+'''</script><script type="module">
'''+core+'\nconst atlas='+atlas+';\nconst photos='+(photos if kind=='swatch' else '{}')+';\n'+runtime+'\n</script></body></html>\n'
    html=template.replace('VAR_TITLE',title).replace('VAR_KIND',kind).replace('VAR_BG','#E9ECE4' if kind=='orbital' else '#EEEDE6').replace('VAR_GROUP','Configure the speaker' if kind=='orbital' else 'Choose and export your theme')
    (root/f'{kind}.html').write_text(html)
print('Two GSAP-powered live references built with semantic controls and shared deterministic geometry')
