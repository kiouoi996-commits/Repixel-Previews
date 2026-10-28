import './action-button.mjs';import {receiveFile} from './core.mjs';
const action=document.querySelector('motion-action'),kind=action.getAttribute('kind'),params=new URL(location.href).searchParams;
let count=0,failOnce=params.get('fail')==='once';const pendingURLs=new Map();
const abortableWait=(ms,signal)=>new Promise((resolve,reject)=>{if(signal.aborted){reject(new DOMException('Aborted','AbortError'));return;}const stop=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',stop);resolve();},ms);signal.addEventListener('abort',stop,{once:true});});
await action.configure({onAction:async context=>{
 if(failOnce){failOnce=false;await abortableWait(250,context.signal);throw Error('The action could not be completed. Try again.');}
 if(kind==='bag'){await abortableWait(550,context.signal);return {count:++count};}
 const record=await(await fetch(new URL('file.json',import.meta.url),{signal:context.signal})).json();
 const result=await receiveFile({url:new URL(record.filename,import.meta.url),filename:record.filename,expectedBytes:record.bytes,sha256:record.sha256,...context});
 const url=URL.createObjectURL(result.blob),a=document.createElement('a');a.href=url;a.download=result.filename;document.body.append(a);a.click();a.remove();const timer=setTimeout(()=>{URL.revokeObjectURL(url);pendingURLs.delete(url);},60000);pendingURLs.set(url,timer);return result;
}});
document.querySelector('#replay').onclick=()=>action.replay();document.querySelector('#reset').onclick=()=>action.reset();
document.querySelector('#feedback').textContent=kind==='bag'?'Example bag · 0 items':'Download the button integration guide';
action.addEventListener('action:success',e=>{document.querySelector('#feedback').textContent=kind==='bag'?`Example bag · ${e.detail.count} item${e.detail.count===1?'':'s'}`:'Guide ready · browser download started';});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#replay'))action.cancelPreview();});document.addEventListener('keydown',()=>action.cancelPreview());
addEventListener('pagehide',()=>{for(const[url,timer]of pendingURLs){clearTimeout(timer);URL.revokeObjectURL(url);}pendingURLs.clear();});
if(params.get('demo')==='1')await action.replay();
