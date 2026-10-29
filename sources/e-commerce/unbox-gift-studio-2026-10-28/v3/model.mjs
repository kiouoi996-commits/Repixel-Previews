// Integer-money commerce state. The presentation never owns a transaction.
export const COLORS={ink:'#4b0828',wine:'#790a38',cream:'#fffaf6',blush:'#f9e8e3',peach:'#ffc28e',line:'#ebd9d3',muted:'#956c79'};
export const PRODUCTS=[
 {id:'candle',name:'Citrus & Cedar',detail:'Amber glass candle · 140 g',price:2400,stock:8,spaces:2,category:'Rituals',asset:'candle'},
 {id:'mug',name:'The little cup',detail:'Speckled ceramic · 180 ml',price:1800,stock:5,spaces:2,category:'Objects',asset:'mug'},
 {id:'coffee',name:'Morning Ritual',detail:'Whole bean coffee · 250 g',price:1600,stock:12,spaces:1,category:'Pantry',asset:'coffee'},
 {id:'chocolate',name:'A sweet moment',detail:'Dark chocolate · 70% cacao',price:900,stock:16,spaces:1,category:'Pantry',asset:'chocolate'},
 {id:'balm',name:'Santal hand balm',detail:'Soft hands, slow days · 60 ml',price:1400,stock:10,spaces:1,category:'Rituals',asset:'balm'},
 {id:'tea',name:'Jasmine green tea',detail:'Loose leaf tea · 60 g',price:1200,stock:0,spaces:1,category:'Pantry',asset:'tea'}
];
export const RULES={version:1,currency:'USD',capacity:6,minItems:2,maxPerProduct:3,boxPrice:800,discountAt:4,discountBps:1000};
export const BUDGETS=Object.freeze([5000,7000,10000]);
export const BOXES={merlot:{name:'Merlot',color:'#790a38'},petal:{name:'Petal',color:'#d79c9b'},sage:{name:'Sage',color:'#75836b'}};
export const RIBBONS={peach:{name:'Peach satin',color:'#ffc28e',price:0},wine:{name:'Wine satin',color:'#510a2b',price:0},gold:{name:'Gold edition',color:'#d4aa59',price:400}};
export const money=(n,currency='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency}).format(n/100);
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number(v)||0));
export const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export const cleanText=(v,max=120)=>Array.from(String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'')).slice(0,max).join('');
export function requestId(source=globalThis.crypto){if(typeof source?.randomUUID==='function')return source.randomUUID();if(typeof source?.getRandomValues!=='function')throw Error('Your browser cannot create a safe cart request identity.');const b=new Uint8Array(16);source.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}
export function validateCatalog(products,rules=RULES){
 if(!Array.isArray(products)||products.length>100)throw Error('Provide at most 100 products.');
 const ids=new Set();for(const p of products){if(!/^[a-zA-Z0-9_-]{1,64}$/.test(p.id)||ids.has(p.id)||['__proto__','constructor','prototype'].includes(p.id)||!p.name)throw Error('Each product needs a unique safe ID and a name.');ids.add(p.id);for(const k of ['price','stock','spaces'])if(!Number.isSafeInteger(p[k])||p[k]<(k==='spaces'?1:0))throw Error('Invalid '+k);if(p.price>100000000||p.stock>100000||p.spaces>rules.capacity)throw Error('Catalog bounds exceeded.');}
 for(const k of ['capacity','minItems','maxPerProduct','boxPrice','discountAt','discountBps'])if(!Number.isSafeInteger(rules[k])||rules[k]<0)throw Error('Invalid rule '+k);
 if(rules.capacity>12||rules.minItems<1||rules.maxPerProduct>10||rules.discountBps>10000||!/^[A-Z]{3}$/.test(rules.currency))throw Error('Invalid rules.');
 return true;
}
export function initialState(){return {version:1,items:{},box:'merlot',ribbon:'peach',message:'For your slow mornings.',signature:'With love',budget:7000,step:0,view:'exploded'}};
export function setBudget(state,budget){return BUDGETS.includes(budget)&&state.budget!==budget?{...state,budget}:state;}
export function quote(state,products=PRODUCTS,rules=RULES){
 let subtotal=0,count=0,spaces=0,valid=true;const lines=[];
 for(const[id,qty]of Object.entries(state.items||{})){const p=products.find(p=>p.id===id);if(!p||!Number.isSafeInteger(qty)||qty<1||qty>Math.min(p.stock,rules.maxPerProduct)){valid=false;continue;}const amount=p.price*qty;subtotal+=amount;count+=qty;spaces+=p.spaces*qty;lines.push({...p,qty,amount});}
 const discount=count>=rules.discountAt?Math.round(subtotal*rules.discountBps/10000):0,packaging=rules.boxPrice+(RIBBONS[state.ribbon]?.price||0),total=subtotal-discount+packaging;
 return {lines,subtotal,count,spaces,discount,packaging,total,valid:valid&&count>=rules.minItems&&spaces<=rules.capacity&&Boolean(BOXES[state.box])&&Boolean(RIBBONS[state.ribbon]),capacity:rules.capacity,currency:rules.currency};
}
export function changeQuantity(state,id,delta,products=PRODUCTS,rules=RULES){
 const p=products.find(p=>p.id===id);if(!p||!Number.isInteger(delta))return {state,error:'This product is unavailable.'};const qty=(state.items[id]||0)+delta,items={...state.items};if(qty<=0)delete items[id];else items[id]=qty;
 if(qty>p.stock)return {state,error:p.stock?'No more units available.':'This item is restocking.'};if(qty>rules.maxPerProduct)return {state,error:`Maximum ${rules.maxPerProduct} of each item.`};
 const next={...state,items},q=quote(next,products,rules);if(q.spaces>rules.capacity)return {state,error:'Your box is full. Remove an item to make room.'};return {state:next,error:''};
}
export function restore(input,products=PRODUCTS,rules=RULES,{includeMessage=false,includeBudget=false}={}){
 const s=initialState();if(!input||input.version!==1||!input.items||typeof input.items!=='object'||Array.isArray(input.items))return s;
 if(BOXES[input.box])s.box=input.box;if(RIBBONS[input.ribbon])s.ribbon=input.ribbon;
 for(const p of products){const n=input.items[p.id];if(Number.isSafeInteger(n)&&n>0)for(let k=0;k<Math.min(n,p.stock,rules.maxPerProduct);k++){const result=changeQuantity(s,p.id,1,products,rules);s.items=result.state.items;}}
 if(includeMessage){s.message=cleanText(input.message);s.signature=cleanText(input.signature,32);}if(includeBudget&&BUDGETS.includes(input.budget))s.budget=input.budget;s.step=0;s.view='exploded';return s;
}
export function shareToken(state){const publicState={version:1,items:state.items,box:state.box,ribbon:state.ribbon};return encodeURIComponent(JSON.stringify(publicState));}
export function parseToken(token,products=PRODUCTS,rules=RULES){try{if(token.length>4096)return null;const s=JSON.parse(decodeURIComponent(token));if(s.version!==1)return null;return restore(s,products,rules);}catch{return null}}
export function curate(budget,products=PRODUCTS,rules=RULES,ribbon='peach'){
 if(!Number.isSafeInteger(budget)||budget<rules.boxPrice||budget>100000000)return null;
 // Bounded knapsack: prefer variety, then a fuller box, then budget usage.
 let best=null,score=-1;const available=products.filter(p=>p.stock>0).slice(0,14);
 function visit(i,s){const q=quote(s,products,rules);if(q.valid&&q.total<=budget){const rank=q.lines.length*10000000+q.spaces*100000+q.total;if(rank>score){best=s;score=rank;}}if(i>=available.length)return;
 const p=available[i];visit(i+1,s);const next=changeQuantity(s,p.id,1,products,rules);if(!next.error)visit(i+1,next.state);}
 visit(0,{...initialState(),message:'For your slow mornings.',ribbon});return best;
}
export function cartPayload(state,products=PRODUCTS,rules=RULES){const q=quote(state,products,rules);if(!q.valid)throw Error('Choose at least two items within the box capacity.');return {version:1,currency:q.currency,items:q.lines.map(p=>({id:p.id,variantId:p.variantId??null,quantity:p.qty})),packaging:{box:state.box,ribbon:state.ribbon},gift:{message:cleanText(state.message),signature:cleanText(state.signature,32)},estimate:{subtotal:q.subtotal,discount:q.discount,packaging:q.packaging,total:q.total},priceAuthority:'estimate',shippingAndTax:'calculated-by-host'};}
export function timeline(t,seed={...initialState(),items:{candle:1,mug:1,coffee:1}},{catalogFilm=false}={}){
 const s=structuredClone(seed),u=((t%12)+12)%12;s.step=u<3.6||u>=9.5?0:u<5.7?1:2;
 if(catalogFilm){s.items={candle:1,mug:1,coffee:1};if(u>=1.8&&u<10.5)s.items.chocolate=1;}
 // The composition closes, wraps, reveals and reopens. No business mutations.
 const packing=ease((u-2.2)/1.5)*(1-ease((u-10.0)/1.0));
 const closure=ease((u-6.0)/1.15)*(1-ease((u-9.7)/.8));
 const ribbon=ease((u-7.1)/.9)*(1-ease((u-9.4)/.5));
 return {state:s,packing,closure,ribbon,card:ease((u-3.6)/.7)*(1-ease((u-9.7)/.5)),turn:Math.sin(u/12*Math.PI*2)*.08,...(catalogFilm&&u>=1.8&&u<2.5?{itemProgress:{'chocolate:0':ease((u-1.8)/.7)}}:{}),phase:u<2.2?'A gift, made by you.':u<3.6?'Every little thing. In its place.':u<6?'A few words. All the feeling.':u<7.8?'The finishing touch.':'Ready to make their day.'};
}
export function pointerAt(t){const points=[[0,1025,665],[.6,1080,505],[1.5,1210,463],[1.8,1210,463],[2.25,1210,463],[3.4,1170,738],[3.6,1170,738],[4.2,1080,473],[5.5,1170,738],[5.7,1170,738],[6.4,1170,738],[8.2,965,290],[9.3,885,122],[9.5,885,122],[10.35,1156,463],[10.5,1156,463],[11.25,1120,640],[12,1025,665]];let a=points[0],b=points[1];for(let i=1;i<points.length;i++)if(t<=points[i][0]){a=points[i-1];b=points[i];break;}const p=ease((t-a[0])/(b[0]-a[0])),arc=Math.sin(p*Math.PI)*20;return{x:a[1]+(b[1]-a[1])*p+arc,y:a[2]+(b[2]-a[2])*p-arc,press:[1.8,3.6,5.7,9.5,10.5].some(v=>Math.abs(t-v)<.09)};}
