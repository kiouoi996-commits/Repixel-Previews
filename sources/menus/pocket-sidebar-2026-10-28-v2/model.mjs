export const products = [
 {id:'arc-chair',name:'Arc chair',price:280,category:'Seating',material:'Boucle',dimensions:'82 × 78 × 72 cm',finish:'Natural ivory',file:'arc-chair.webp',color:'#dedbd7',description:'A soft, sculptural seat for unhurried everyday living.'},
 {id:'loop-lamp',name:'Loop lamp',price:160,category:'Lighting',material:'Steel',dimensions:'22 × 18 × 42 cm',finish:'Matte black',file:'loop-lamp.webp',color:'#d5d0c9',description:'An arched metal task lamp with a warm, focused glow.'},
 {id:'stone-vase',name:'Stone vase',price:48,category:'Objects',material:'Stoneware',dimensions:'18 × 18 × 25 cm',finish:'Speckled cream',file:'stone-vase.webp',color:'#dcdad5',description:'Textured stoneware, shaped to hold a stem or stand alone.'}
];
export const money = n => '$'+n.toLocaleString('en-US');
export const initial = (records=products) => ({saved:records.slice(0,3).map(p=>p.id),bag:{},open:true,mode:'Saved'});
export function hydrate(raw,records=products){
 const state=initial(records),ids=new Set(records.map(p=>p.id));
 if(!raw||raw.version!==1)return state;
 if(Array.isArray(raw.saved))state.saved=[...new Set(raw.saved.filter(id=>ids.has(id)))].slice(0,32);
 if(raw.bag&&typeof raw.bag==='object')state.bag=Object.fromEntries(Object.entries(raw.bag).filter(([id,n])=>ids.has(id)&&Number.isInteger(n)&&n>0&&n<=99));
 return state;
}
export const serialise=s=>JSON.stringify({version:1,saved:s.saved,bag:s.bag});
export const countBag=s=>Object.values(s.bag).reduce((a,n)=>a+n,0);
export const totalBag=(s,records=products)=>records.reduce((sum,p)=>sum+(s.bag[p.id]||0)*p.price,0);
export function reduce(s,a,records=products){
 const valid=records.some(p=>p.id===a.id);
 switch(a.type){
  case 'save': return !valid||s.saved.includes(a.id)||s.saved.length>=32?s:{...s,saved:[...s.saved,a.id]};
  case 'remove': return {...s,saved:s.saved.filter(id=>id!==a.id)};
  case 'open': return {...s,open:true,mode:['Saved','Compare','Bag'].includes(a.mode)?a.mode:s.mode};
  case 'close': return {...s,open:false};
  case 'mode': return ['Saved','Compare','Bag'].includes(a.mode)?{...s,mode:a.mode,open:true}:s;
  case 'bag-add': return valid?{...s,bag:{...s.bag,[a.id]:Math.min(99,(s.bag[a.id]||0)+1)}}:s;
  case 'bag-qty': {
   if(!valid||!Number.isInteger(a.quantity)||a.quantity<0||a.quantity>99)return s;
   const bag={...s.bag};if(a.quantity)bag[a.id]=a.quantity;else delete bag[a.id];return {...s,bag};
  }
  case 'reset': return initial(records);
  default:return s;
 }
}
export const springStep=(p,v,target,dt,k=220,d=30)=>{v+=(k*(target-p)-d*v)*dt;p+=v*dt;return Math.abs(p-target)<.0001&&Math.abs(v)<.001?[target,0]:[p,v];};
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
export const previewActions=[
 {t:.8,type:'remove',id:'stone-vase'},
 {t:2.9,type:'save',id:'stone-vase'},
 {t:3.6,type:'mode',mode:'Compare'},
 {t:5.2,type:'mode',mode:'Saved'},
 {t:6.4,type:'close'},
 {t:7.8,type:'open',mode:'Saved'}
];
const waypoints=[[0,990,956],[.48,990,956],[.75,505,649],[1.03,504,649],[1.42,1350,850],[1.8,1352,850],[2.18,1120,660],[2.57,688,680],[2.9,350,811],[3.18,350,811],[3.55,384,250],[3.93,384,250],[4.75,390,535],[5.16,238,250],[5.52,238,250],[6.36,501,76],[6.72,501,76],[7.75,76,409],[8.15,76,409],[8.9,990,956],[10,990,956]];
export function pointerAt(t){
 let i=waypoints.findIndex(p=>p[0]>=t);if(i<1)return{x:waypoints[0][1],y:waypoints[0][2],pressed:false};
 const a=waypoints[i-1],b=waypoints[i],q=smooth((t-a[0])/(b[0]-a[0])),bow=Math.sin(q*Math.PI);
 return{x:a[1]+(b[1]-a[1])*q+bow*(b[2]-a[2])*.11,y:a[2]+(b[2]-a[2])*q-bow*(b[1]-a[1])*.09,pressed:t>=1.8&&t<=2.9};
}
export function previewFrames(fps=30){
 let s=initial(),p=1,v=0,ind=2,iv=0,modeMix=0,mv=0,actionIndex=0;const frames=[];
 for(let n=0;n<fps*10;n++){
  const t=n/fps;while(actionIndex<previewActions.length&&previewActions[actionIndex].t<=t){s=reduce(s,previewActions[actionIndex++]);}
  for(let k=0;k<4;k++){
   [p,v]=springStep(p,v,s.open?1:0,1/(fps*4));
   [ind,iv]=springStep(ind,iv,s.mode==='Compare'?3:s.mode==='Bag'?4:2,1/(fps*4),250,32);
   [modeMix,mv]=springStep(modeMix,mv,s.mode==='Compare'?1:0,1/(fps*4),240,31);
  }
  if(t>=9.45){p=1;v=0;ind=2;iv=0;modeMix=0;mv=0;}
  frames.push({state:structuredClone(s),open:p,indicator:ind,compare:modeMix,t,pointer:pointerAt(t),drag:t>=1.8&&t<2.9?'stone-vase':null});
 }
 return frames;
}
