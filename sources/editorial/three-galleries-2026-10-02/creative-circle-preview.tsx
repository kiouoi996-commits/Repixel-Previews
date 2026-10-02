import React from 'react';
import { AbsoluteFill, Img, Composition, Easing, interpolate, staticFile, useCurrentFrame } from 'remotion';

const W = 1448, H = 1086;
const smooth = Easing.bezier(.33, 0, .67, 1);
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing:smooth} as const;
type CropProps = {src:string; x:number; y:number; w:number; h:number; width?:number; height?:number; shape?:string; style?:React.CSSProperties};

// Crops stay as viewports over the supplied reference. No isolated photograph
// or original typeface is represented as an independently supplied source asset.
const Crop = ({src,x,y,w,h,width=w,height=h,shape,style}:CropProps) => (
  <div style={{position:'absolute',width,height,overflow:'hidden',clipPath:shape,...style}}>
    <Img src={staticFile(src)} style={{position:'absolute',left:-x*width/w,top:-y*height/h,width:W*width/w,height:H*height/h,maxWidth:'none'}}/>
  </div>
);
const Reference = ({src,clip}:{src:string;clip?:string}) => <Img src={staticFile(src)} style={{position:'absolute',width:W,height:H,clipPath:clip}}/>;
const Scene = ({children,background}:{children:React.ReactNode;background:string}) => <AbsoluteFill style={{background,overflow:'hidden'}}><div style={{position:'absolute',width:W,height:H,transform:'scale('+1080/W+')',transformOrigin:'0 0'}}>{children}</div></AbsoluteFill>;

export const CreativeCircle = () => {
  const f = useCurrentFrame();
  const p = interpolate(f,[0,24,54,99,129,209],[0,0,1,1,0,0],clamp);
  return <Scene background="#edf1f7">
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 65%,#dce2ec 0%,#eff2f8 55%,#f5f7fa 100%)'}}/>
    <Reference src="creative-circle.webp" clip="inset(0 0 816px 0)"/>
    <Reference src="creative-circle.webp" clip="inset(900px 0 0 0)"/>
    <Crop src="creative-circle.webp" x={0} y={300} w={223} h={563} shape="polygon(0 0,100% 6.93%,100% 95.38%,0 100%)" style={{left:0,top:300}}/>
    <Crop src="creative-circle.webp" x={239} y={306} w={272} h={559} shape="polygon(0 5.9%,100% 0,100% 100%,0 95%)" style={{left:239,top:306}}/>
    <div style={{position:'absolute',left:532,top:282,width:384,height:602,transform:`perspective(1300px) rotateY(${-6*p}deg)`,translate:`0px ${8*p}px`,scale:1-.025*p,transformOrigin:'50% 50%',filter:`drop-shadow(0 ${7*p}px ${13*p}px rgba(42,47,60,${.1*p}))`}}>
      <Crop src="creative-circle.webp" x={532} y={282} w={384} h={602}/>
    </div>
    <div style={{position:'absolute',left:939,top:305,width:271,height:562,transform:`perspective(1300px) rotateY(${8*p}deg)`,translate:`0px ${-20*p}px`,scale:1+.055*p,transformOrigin:'50% 50%',filter:`drop-shadow(0 ${16*p}px ${19*p}px rgba(42,47,60,${.19*p}))`}}>
      <Crop src="creative-circle.webp" x={939} y={305} w={271} h={562} shape="polygon(0 0,100% 6.05%,100% 94.84%,0 100%)"/>
    </div>
    <Crop src="creative-circle.webp" x={1227} y={296} w={221} h={569} shape="polygon(0 7.73%,100% 0,100% 100%,0 95.08%)" style={{left:1227,top:296}}/>
    <div style={{position:'absolute',left:596,top:963,width:259,height:14,background:'#edf0f6'}}>
      {[0,68,136,204].map(x=><div key={x} style={{position:'absolute',left:x,top:6,width:54,height:2,background:'#cfd5df'}}/>)}
      <div style={{position:'absolute',left:68,top:6,width:54,height:2,background:'#f5464a',translate:`${68*p}px 0px`}}/>
    </div>
  </Scene>;
};


export const Root = () => <Composition id="CreativeCircle" component={CreativeCircle} width={1080} height={810} fps={30} durationInFrames={210}/>;
