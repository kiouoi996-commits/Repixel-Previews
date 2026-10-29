import {mountBackground} from './background.mjs';
const host=document.querySelector('main');
const effect=mountBackground(host,{kind:host.dataset.kind});
window.addEventListener('pagehide',event=>event.persisted?effect.pause():effect.dispose());
window.addEventListener('pageshow',event=>{if(event.persisted)effect.resume();});
