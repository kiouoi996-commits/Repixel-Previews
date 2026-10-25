import React,{Suspense,useMemo,useEffect} from 'react';
import {AbsoluteFill,Composition,Img,Easing,interpolate,staticFile,useCurrentFrame,useVideoConfig,delayRender,continueRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useLoader,useThree} from '@react-three/fiber';
import {Box3,Vector3,PMREMGenerator,SRGBColorSpace,ACESFilmicToneMapping} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import './style.css';
const file=(p:string)=>staticFile(p);
const products=[
 {id:'alpine-pro',name:'Alpine Pro',price:'$499.00',image:'board_alpine_pro.webp'},
 {id:'summit-boot',name:'Summit Boot',price:'$329.00',image:'boot_summit.webp'},
 {id:'trail-helmet',name:'Trail Helmet',price:'$189.00',image:'helmet_trail.webp'},
 {id:'polar-goggles',name:'Polar Goggles',price:'$149.00',image:'goggles_polar.webp'}
];
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const routeEase=Easing.bezier(.22,1,.36,1);
const smooth=(x:number)=>{const p=clamp(x);return p*p*(3-2*p)};
const phase=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
const DemoContext=React.createContext({t:0,count:3,favorite:false});
const useDemo=()=>React.useContext(DemoContext);
const tapPulse=(t:number,a:number,b:number)=>t<a||t>b?0:Math.sin(Math.PI*(t-a)/(b-a));
const buttonPulse=(t:number,starts:number[],duration=.20)=>Math.max(0,...starts.map(a=>tapPulse(t,a,a+duration)));
const cardPress=(t:number,id:string)=>1-.018*buttonPulse(t,id==='alpine-pro'?[1.40]:id==='trail-helmet'?[4.84]:id==='polar-goggles'?[7.64]:[]);

function Icon({name,size=24,style={}}:{name:string;size?:number;style?:React.CSSProperties}){return <Img src={file('assets/icons/'+name+'.svg')} style={{width:size,height:size,display:'block',...style}}/>}
function Picture({name,style={}}:{name:string;style?:React.CSSProperties}){return <Img src={file('assets/'+name)} style={{objectFit:'contain',...style}}/>}
function Circle({name,left,top,size=48,white=false}:{name:string;left:number;top:number;size?:number;white?:boolean}){
 const {t}=useDemo();
 const press=buttonPulse(t,name==='back'?[4.18,7.0,11.82]:name.startsWith('heart')?[10.60]:[]);
 return <div className="circle" style={{left,top,width:size,height:size,scale:1-.07*press}}><Icon name={name} style={white?{filter:'brightness(0) invert(1)'}:{}}/></div>
}
function Lighting(){const {gl,scene}=useThree();useEffect(()=>{const pmrem=new PMREMGenerator(gl);const room=new RoomEnvironment();const target=pmrem.fromScene(room,.04);scene.environment=target.texture;scene.environmentIntensity=.7;gl.outputColorSpace=SRGBColorSpace;gl.toneMapping=ACESFilmicToneMapping;gl.toneMappingExposure=.88;return()=>{scene.environment=null;target.dispose();room.dispose();pmrem.dispose()};},[gl,scene]);return <><ambientLight intensity={.25}/><directionalLight position={[-3,5,5]} intensity={1.5}/><directionalLight position={[4,2,2]} intensity={.6}/></>}
function ProductModel({id,yaw,pitch,onReady}:{id:string;yaw:number;pitch:number;onReady:()=>void}){const {scene}=useLoader(GLTFLoader,file('models/'+id+'.glb'));const {advance}=useThree();useEffect(()=>{const a=requestAnimationFrame(()=>{advance(performance.now());onReady()});return()=>cancelAnimationFrame(a)},[scene,advance,onReady]);const fit=useMemo(()=>{const object=scene.clone(true);object.updateMatrixWorld(true);const box=new Box3().setFromObject(object),s=box.getSize(new Vector3()),center=box.getCenter(new Vector3());const scale=id==='alpine-pro'?2.65/s.y:2.4/Math.max(s.x,s.y,s.z);object.position.sub(center);return {object,scale};},[scene,id]);return <group rotation={[(id==='alpine-pro'?0:.03)+pitch,yaw,id==='alpine-pro'?.31:0]} scale={fit.scale}><primitive object={fit.object}/></group>}
function Viewer({id,yaw,pitch}:{id:string;yaw:number;pitch:number}){const [ready]=React.useState(()=>delayRender('Load genuine GLB '+id));const onReady=React.useCallback(()=>continueRender(ready),[ready]);return <div className="model" style={id==='alpine-pro'?{left:88,top:9,width:342,height:539}:{left:28,top:98,width:390,height:348}}><ThreeCanvas width={id==='alpine-pro'?342:390} height={id==='alpine-pro'?539:348} camera={{position:[0,.04,id==='alpine-pro'?5.45:5.25],fov:30}} gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}}><Lighting/><Suspense fallback={null}><ProductModel id={id} yaw={yaw} pitch={pitch} onReady={onReady}/></Suspense></ThreeCanvas></div>}
function Home(){const {t}=useDemo();return <div className="screen home"><Img className="home-photo" src={file('assets/hero_left.webp')}/><div style={{position:'absolute',left:31,top:48}}><Icon name="menu" style={{filter:'brightness(0) invert(1)'}}/></div><Circle name="search" left={351} top={35} size={53}/><h1>Ride<br/>Beyond</h1><p className="home-copy">Gear up for bigger<br/>mountain days.</p><div className="home-categories">{['Boards','Boots','Bindings','Outerwear'].map((x,i)=><div key={x} className={'home-chip '+(i===0?'selected':'')}>{i===0?<Icon name="board-category" size={42}/>:<Picture name={['','boot_summit.webp','bindings-reference.webp','jacket_navy.webp'][i]} style={{width:37,height:38}}/>}<span>{x}</span></div>)}</div><div className="wave"><svg viewBox="0 0 434 252" preserveAspectRatio="none"><defs><linearGradient id="wave" x2="1" y2="1"><stop stopColor="#078cdc"/><stop offset=".46" stopColor="#057aca"/><stop offset="1" stopColor="#0654a8"/></linearGradient></defs><path d="M0 36 C30 -12 70 -10 119 12 C198 52 243 52 322 12 C370 -8 413 -10 434 36 V252 H0Z" fill="url(#wave)"/></svg><div className="popular-heading">Popular Boards <span>See All</span></div><div className="popular">{['board_alpine_pro.webp','board_fire.webp','board_white_blue.webp'].map(x=><div key={x}><Picture name={x} style={{width:62,height:157,marginTop:7}}/></div>)}<div className="arrow" style={{scale:1-.055*buttonPulse(t,[.56])}}><Icon name="arrow-right" size={29}/></div></div><div className="pagination"><b/><i/><i/></div></div></div>}
function Catalog({count=3}:{count?:number}){const {t,favorite}=useDemo();return <div className="screen catalog"><div style={{position:'absolute',left:33,top:49}}><Icon name="menu"/></div><div className="catalog-cart"><Icon name="cart" size={29}/><b style={{scale:1+.12*buttonPulse(t,[12.38],.30)}}>{count}</b></div><Picture name="avatar-reference.webp" style={{position:'absolute',left:345,top:40,width:49,height:49,borderRadius:'50%'}}/><h2 className="explore">Explore Gear</h2><div className="search"><Icon name="search" size={19}/><span>Search snowboards, boots...</span></div><Circle name="sliders" left={362} top={168} size={47}/><div className="catalog-categories">{['Boards','Boots','Helmets','Goggles','Jackets'].map((x,i)=><div key={x}><div className={i===0?'active':''}>{i===0?<Icon name="board-category" size={48}/>:<Picture name={['','boot_summit.webp','helmet_trail.webp','goggles_polar.webp','jacket_orange.webp'][i]} style={{width:i===3?51:43,height:49}}/>}</div><span>{x}</span></div>)}</div><div className="grid">{products.map((p,i)=><div className="product" key={p.id} style={{scale:cardPress(t,p.id)}}><div className="product-heart"><Icon name={favorite&&p.id==='polar-goggles'?'heart-filled':'heart'} size={20}/></div><div className={'product-picture p'+i}><Picture name={p.image}/></div><b>{p.name}</b><span className="product-price">{p.price}</span><div className="product-plus"><Icon name="plus" size={23}/></div></div>)}</div></div>}
function Detail({id,yaw,pitch,added=false}:{id:string;yaw:number;pitch:number;added?:boolean}){const {t,favorite}=useDemo();const p=products.find(x=>x.id===id)!;return <div className="screen detail"><Img className="mountains" src={file('images/detail-mountains-clean.png')}/><div className="glass"/><div className="sheet"/><Viewer key={id} id={id} yaw={yaw} pitch={pitch}/><Circle name="back" left={28} top={41}/><Circle name={favorite&&id==='polar-goggles'?'heart-filled':'heart'} left={358} top={39}/><div className="gallery"><b>1/4</b><i className="on"/><i/><i/></div><div className="handle"/><h2 className="detail-name">{p.name}</h2><div className="detail-price">{p.price}</div>{id==='alpine-pro'&&<div className="rating">{[0,1,2,3,4].map(n=><Icon key={n} name="star" size={17}/>)}<span>4.8 (124)</span></div>}<div className="quantity"><Icon name="minus" size={21}/><span>1</span><div><Icon name="plus-dark" size={22}/></div></div><div className={'add '+(added?'added':'')} style={{scale:1-.035*buttonPulse(t,[10.98])}}><Icon name="cart" size={24} style={{filter:'brightness(0) invert(1)'}}/><span style={{opacity:added?.78+.22*phase(t,11.10,11.28):1}}>{added?'Added to Cart':'Add to Cart'}</span></div><div className="related-heading">You may also like <span>See All</span></div><div className="related">{[{name:'Summit Boot',price:'$329.00',image:'boot_summit.webp'},{name:'Polar Goggles',price:'$149.00',image:'goggles_polar.webp'},{name:'Freeride Helmet',price:'$189.00',image:'helmet_freeride.webp'}].map(x=><div key={x.name}><div className="related-heart"><Icon name="heart-muted" size={18}/></div><Picture name={x.image} style={{width:100,height:91,marginTop:11}}/><b>{x.name}</b><span>{x.price}</span></div>)}</div></div>}

// A continuous touch session. Every route change has an explicit tap or back gesture.
type Route='home'|'catalog'|'alpine-pro'|'trail-helmet'|'polar-goggles';
type Layer={route:Route;x:number;front?:boolean};
const W=434;
const push=(t:number,a:number,b:number,from:Route,to:Route):Layer[]=>{
 const p=routeEase(clamp((t-a)/(b-a)));
 return [{route:from,x:-W*.22*p},{route:to,x:W*(1-p),front:true}];
};
const pop=(t:number,a:number,b:number,from:Route,to:Route):Layer[]=>{
 const p=routeEase(clamp((t-a)/(b-a)));
 return [{route:to,x:-W*.22*(1-p)},{route:from,x:W*p,front:true}];
};
const routesAt=(t:number):Layer[]=>{
 if(t<.78)return [{route:'home',x:0}];
 if(t<1.18)return push(t,.78,1.18,'home','catalog');
 if(t<1.65)return [{route:'catalog',x:0}];
 if(t<2.03)return push(t,1.65,2.03,'catalog','alpine-pro');
 if(t<4.36)return [{route:'alpine-pro',x:0}];
 if(t<4.72)return pop(t,4.36,4.72,'alpine-pro','catalog');
 if(t<5.10)return [{route:'catalog',x:0}];
 if(t<5.48)return push(t,5.10,5.48,'catalog','trail-helmet');
 if(t<7.16)return [{route:'trail-helmet',x:0}];
 if(t<7.52)return pop(t,7.16,7.52,'trail-helmet','catalog');
 if(t<7.90)return [{route:'catalog',x:0}];
 if(t<8.28)return push(t,7.90,8.28,'catalog','polar-goggles');
 if(t<12.00)return [{route:'polar-goggles',x:0}];
 if(t<12.38)return pop(t,12.00,12.38,'polar-goggles','catalog');
 if(t<12.68)return [{route:'catalog',x:0}];
 if(t<13.24){
  // Interactive native back gesture: the outgoing page follows the fingertip.
  const p=phase(t,12.68,13.24);
  return [{route:'home',x:-W*.22*(1-p)},{route:'catalog',x:W*p,front:true}];
 }
 return [{route:'home',x:0}];
};

// Hermite trajectories keep angular velocity continuous through release inertia.
const hermite=(t:number,a:number,b:number,y0:number,y1:number,v0=0,v1=0)=>{
 const u=clamp((t-a)/(b-a)),u2=u*u,u3=u2*u,d=b-a;
 return (2*u3-3*u2+1)*y0+(u3-2*u2+u)*d*v0+(-2*u3+3*u2)*y1+(u3-u2)*d*v1;
};
const dragPose=(t:number,start:number,end:number)=>{
 if(t<start)return 0;
 if(t<end)return hermite(t,start,end,0,3.00,0,1.2);
 if(t<end+.20)return hermite(t,end,end+.20,3.00,3.12,1.2,0);
 return 3.12;
};
const poseAt=(t:number,id:string)=>{
 let yaw=0,pitch=0;
 if(id==='alpine-pro'){
  yaw=dragPose(t,2.34,3.10);
  if(t>=3.52)yaw=t<3.98?hermite(t,3.52,3.98,3.12,.30,0,-1):t<4.18?hermite(t,3.98,4.18,.30,.20,-1,0):.20;
  pitch=-.06*phase(t,2.34,2.95)+.04*phase(t,3.52,4.18);
 }else if(id==='trail-helmet'){
  yaw=dragPose(t,5.74,6.50);
  pitch=-.055*phase(t,5.74,6.5)+.015*phase(t,6.5,6.70);
 }else{
  yaw=dragPose(t,8.58,9.32);
  if(t>=9.76)yaw=t<10.24?hermite(t,9.76,10.24,3.12,.10,0,-1):t<10.44?hermite(t,10.24,10.44,.10,0,-1,0):0;
  pitch=-.05*phase(t,8.58,9.32)+.05*phase(t,9.76,10.44);
 }
 return {yaw,pitch};
};

type Contact={kind:'tap'|'drag';a:number;b:number;x0:number;y0:number;x1?:number;y1?:number};
const contacts:Contact[]=[
 {kind:'tap',a:.56,b:.75,x0:382,y0:821},
 {kind:'tap',a:1.40,b:1.61,x0:111,y0:458},
 {kind:'drag',a:2.34,b:3.10,x0:340,y0:240,x1:100,y1:266},
 {kind:'drag',a:3.52,b:3.98,x0:110,y0:267,x1:330,y1:245},
 {kind:'tap',a:4.18,b:4.36,x0:52,y0:65},
 {kind:'tap',a:4.84,b:5.04,x0:111,y0:717},
 {kind:'drag',a:5.74,b:6.50,x0:330,y0:268,x1:103,y1:283},
 {kind:'tap',a:7.00,b:7.16,x0:52,y0:65},
 {kind:'tap',a:7.64,b:7.84,x0:322,y0:717},
 {kind:'drag',a:8.58,b:9.32,x0:330,y0:267,x1:112,y1:283},
 {kind:'drag',a:9.76,b:10.24,x0:112,y0:283,x1:320,y1:267},
 {kind:'tap',a:10.60,b:10.80,x0:382,y0:65},
 {kind:'tap',a:10.98,b:11.18,x0:300,y0:666},
 {kind:'tap',a:11.82,b:12.00,x0:52,y0:65},
 {kind:'drag',a:12.68,b:13.24,x0:14,y0:442,x1:415,y1:442},
];
function TouchContact({t}:{t:number}){
 const c=contacts.find(c=>t>=c.a&&t<c.b+.13);
 if(!c)return null;
 const dt=t-c.a,duration=c.b-c.a;
 const progress=c.kind==='drag'?(c.a===12.68?phase(t,c.a,c.b):clamp(hermite(t,c.a,c.b,0,1,0,.4))):0;
 const x=c.x0+((c.x1??c.x0)-c.x0)*progress,y=c.y0+((c.y1??c.y0)-c.y0)*progress;
 const opacity=phase(t,c.a,c.a+.045)*(1-phase(t,c.b,c.b+.13));
 const ripple=c.kind==='tap'?clamp(dt/(duration+.10)):0;
 return <div className="touch-contact" style={{left:x,top:y,opacity}}>
  {c.kind==='tap'&&<div className="touch-ripple" style={{scale:1+1.0*ripple,opacity:1-ripple}}/>}
  <div className="touch-core" style={{scale:c.kind==='tap'?1-.15*tapPulse(t,c.a,c.b):.92}}/>
 </div>;
}

const AlpineRide=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const [fontReady]=React.useState(()=>delayRender('Load Inter before recording'));
 useEffect(()=>{
  const face=new FontFace('AlpineInter',`url(${file('fonts/Inter-variable.woff')})`,{weight:'100 900'});
  face.load().then(async f=>{document.fonts.add(f);await document.fonts.ready;requestAnimationFrame(()=>continueRender(fontReady))});
 },[fontReady]);
 const count=t>=11.10?4:3;
 return <DemoContext.Provider value={{t,count,favorite:t>=10.68}}>
  <AbsoluteFill className="board"><div className="app-frame">
   {routesAt(t).map((layer,i)=>{
    const pose=poseAt(t,layer.route);
    return <div className="route-layer" key={layer.route} style={{translate:`${layer.x}px 0`,zIndex:i,boxShadow:layer.front?'-12px 0 28px rgba(8,21,45,.12)':'none'}}>
     {layer.route==='home'?<Home/>:layer.route==='catalog'?<Catalog count={count}/>:<Detail id={layer.route} yaw={pose.yaw} pitch={pose.pitch} added={layer.route==='polar-goggles'&&t>=11.10}/>}
    </div>;
   })}
   <TouchContact t={t}/>
  </div></AbsoluteFill>
 </DemoContext.Provider>;
};

export const RemotionRoot=()=> <Composition id="AlpineRide" component={AlpineRide} durationInFrames={420} fps={30} width={1448} height={1086}/>;
