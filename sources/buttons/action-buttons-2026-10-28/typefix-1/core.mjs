export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
export class ActionMachine{
 constructor(kind,{clock=()=>performance.now(),onChange=()=>{},onSuccess=()=>{}}={}){this.kind=kind;this.clock=clock;this.onChange=onChange;this.onSuccess=onSuccess;this.sequence=0;this.state={status:'idle',count:0,progress:0,known:false,startedAt:0,finishedAt:0,error:''};}
 emit(){this.onChange({...this.state});}
 async start(action){
  if(this.state.status==='pending')return false;
  const generation=++this.sequence;this.abort=new AbortController();const previousCount=this.state.count;
  this.state={...this.state,status:'pending',progress:0,known:false,startedAt:this.clock(),finishedAt:0,error:''};this.emit();
  try{
   const result=await action({signal:this.abort.signal,operationId:'action-'+generation,onProgress:(received,total)=>{
    if(generation!==this.sequence||this.state.status!=='pending')return;
    if(!Number.isFinite(received)||received<0)return;
    const known=Number.isFinite(total)&&total>0;
    this.state.known=known;this.state.progress=known?Math.max(this.state.progress,clamp(received/total)):0;this.emit();
   }});
   if(generation!==this.sequence)return false;
   if(this.kind==='bag'&&(!Number.isInteger(result?.count)||result.count<0))throw Error('The cart handler must return its confirmed item count.');
   this.state={...this.state,status:'success',progress:1,count:this.kind==='bag'?result.count:previousCount,finishedAt:this.clock(),error:''};this.emit();this.onSuccess(result);return true;
  }catch(error){
   if(generation!==this.sequence)return false;
   this.state={...this.state,status:'error',count:previousCount,finishedAt:this.clock(),error:error?.name==='AbortError'?'Action cancelled.':error?.message||'The action could not be completed.'};this.emit();return false;
  }
 }
 reset(){this.sequence++;this.abort?.abort();this.state={...this.state,status:'idle',progress:0,known:false,error:'',startedAt:0,finishedAt:0};this.emit();}
 destroy(){this.sequence++;this.abort?.abort();this.onChange=()=>{};this.onSuccess=()=>{};}
}
export async function receiveFile({url,filename='download.txt',expectedBytes,sha256,signal,onProgress=()=>{}}){
 const response=await fetch(url,{signal});if(!response.ok)throw Error('The file is unavailable ('+response.status+').');
 const length=expectedBytes||(response.headers.get('content-encoding')?0:Number(response.headers.get('content-length')))||0;
 const chunks=[];let received=0;
 if(response.body){const reader=response.body.getReader();try{while(true){const {done,value}=await reader.read();if(done)break;if(signal?.aborted)throw new DOMException('Aborted','AbortError');chunks.push(value);received+=value.byteLength;onProgress(received,length);}}catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}}
 else{const bytes=new Uint8Array(await response.arrayBuffer());chunks.push(bytes);received=bytes.length;onProgress(received,length);}
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 if(expectedBytes&&received!==expectedBytes)throw Error('The file is incomplete. Please try again.');
 const blob=new Blob(chunks,{type:response.headers.get('content-type')||'application/octet-stream'});
 if(sha256){const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');if(actual!==sha256)throw Error('File verification failed. Please try again.');}
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 return {blob,bytes:received,filename};
}
export const specs={
 bag:{number:204,slug:'bag-drop-action',title:'Bag Drop — Confirmed Add to Bag',label:'Add to bag',box:[346,378,894,236],background:'#6eabc0',ink:'#1b2033',font:'Button Bag'},
 download:{number:205,slug:'download-rail-action',title:'Download Rail — Stream to Check',label:'Download',box:[307,364,972,264],background:'#000000',ink:'#000000',font:'Button Download'}
};
export function visual(state,now,reduced=false){
 const elapsed=(now-state.startedAt)/1000,after=state.finishedAt?(now-(reduced?state.finishedAt:Math.max(state.finishedAt,state.startedAt+1000)))/1000:0;
 return {...state,phase:state.status==='success'&&after<0?'pending':state.status,elapsed,after,reduced,enter:reduced?1:ease(elapsed/.35),finish:state.status==='success'?(reduced?1:ease(after/.72)):0};
}
export const pointerAt=t=>{
 const pts=[[0,1230,820],[.4,1230,820],[.95,840,515],[1.25,840,515],[5.25,845,510],[6.2,1160,754],[7.35,1230,820],[9,1230,820]];
 let i=pts.findIndex(p=>p[0]>=t);if(i<1||t>=7.35)return{x:pts[0][1],y:pts[0][2],pressed:false};const a=pts[i-1],b=pts[i],u=ease((t-a[0])/(b[0]-a[0])),arc=(a[1]===b[1]&&a[2]===b[2])?0:Math.sin(Math.PI*u);return{x:a[1]+(b[1]-a[1])*u+arc*28,y:a[2]+(b[2]-a[2])*u-arc*22,pressed:t>=1.04&&t<1.18};
};
export function previewState(kind,t){
 const state={status:'idle',count:0,progress:0,known:true,startedAt:1000,finishedAt:0,error:''};
 if(t>=1&&t<3){state.status='pending';state.progress=ease((t-1)/2);}
 else if(t>=3&&t<6.35){state.status='success';state.progress=1;state.count=kind==='bag'?1:0;state.finishedAt=3000;}
 else if(t>=6.35&&t<7.15){state.status='success';state.count=kind==='bag'?1:0;state.finishedAt=3000;state.reset=1-ease((t-6.35)/.8);}
 return visual(state,t*1000);
}
