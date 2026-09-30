import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import geometry from "./geometry.json";

export type EffectKind = "contour" | "hinge" | "glass";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const t = clamp(v); return t*t*(3-2*t); };
const outCubic = (v: number) => 1-(1-clamp(v))**3;
const easeInOut = (v: number) => { const t=clamp(v); return t<.5 ? 4*t**3 : 1-(-2*t+2)**3/2; };

const Gradients: React.FC<{prefix: string}> = ({prefix}) => <>
  {geometry.words.map((word,i) => <linearGradient key={i} id={prefix+i}
    gradientUnits="userSpaceOnUse" x1={word.x} x2={word.x+word.width} y1={0} y2={0}>
    <stop offset="0" stopColor="#FFFFFF"/><stop offset=".5" stopColor="#FCFCFC"/><stop offset="1" stopColor="#D8D8D8"/>
  </linearGradient>)}
</>;
const Paths: React.FC<{prefix: string}> = ({prefix}) => <>
  {geometry.glyphs.map((g,i) => <path key={i} d={g.path} fill={"url(#"+prefix+g.line+")"}/>)}
</>;
export const StillHeading: React.FC<{opacity?: number}> = ({opacity=1}) =>
  <svg width={1080} height={608} viewBox="0 0 1080 608" style={{position:"absolute",inset:0,opacity}}>
    <defs><Gradients prefix="still-"/></defs><Paths prefix="still-"/>
  </svg>;
const Contour: React.FC<{time: number}> = ({time}) => {
  if (time<.4 || time>=3.15) return <StillHeading/>;
  const oldText=1-smooth((time-.4)/.2);
  return <svg width={1080} height={608} style={{position:"absolute",inset:0}}>
    <defs><Gradients prefix="ink-"/></defs>
    {geometry.glyphs.map((g,i) => {
      const start=.62+i*.055;
      const draw=easeInOut((time-start)/1.35);
      const fill=smooth((time-start-1.1)/.6);
      const opacity=Math.max(oldText,.025+.975*fill);
      return <g key={i}>
        <path d={g.path} fill={"url(#ink-"+g.line+")"} opacity={opacity}/>
        <path d={g.path} fill="none" stroke={"url(#ink-"+g.line+")"}
          strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round"
          pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-draw}
          opacity={.95*(1-fill)*(1-oldText)}/>
      </g>;
    })}
  </svg>;
};
const Hinge: React.FC<{time: number}> = ({time}) => {
  if (time<.4 || time>=2.9) return <StillHeading/>;
  const oldText=1-smooth((time-.4)/.2);
  return <>
    <StillHeading opacity={Math.max(.018,oldText)}/>
    {geometry.glyphs.map((g,i) => {
      const [minX,minY,maxX,maxY]=g.bounds;
      const x=minX-.7,top=minY-.5,width=maxX-minX+1.4;
      const bandHeight=(maxY-minY+1)/3;
      return [0,1,2].map(band => {
        const y=top+band*bandHeight;
        const progress=outCubic((time-(.64+i*.07+band*.09))/1.15);
        const angle=(band===1 ? 86 : -86)*(1-progress);
        return <div key={i+"-"+band} style={{
          position:"absolute",left:x,top:y,width,height:bandHeight+.25,
          perspective:600,perspectiveOrigin:"50% 100%",opacity:(1-oldText)*smooth(progress/.12)
        }}>
          <div style={{
            position:"absolute",inset:0,overflow:"hidden",backfaceVisibility:"hidden",
            transformOrigin:"50% 100%",transform:"rotateX("+angle+"deg)",
            filter:"brightness("+(.42+.58*progress)+")"
          }}>
            <svg width={1080} height={608} style={{position:"absolute",left:-x,top:-y}}>
              <defs><Gradients prefix={"fold-"+i+"-"+band+"-"}/></defs>
              <path d={g.path} fill={"url(#fold-"+i+"-"+band+"-"+g.line+")"}/>
            </svg>
          </div>
        </div>;
      });
    })}
  </>;
};
const Glass: React.FC<{time: number}> = ({time}) => {
  const travel=easeInOut((time-.6)/3.6);
  const cx=-150+1380*travel,cy=304;
  const a=cx-96,b=cx+96;
  return <svg width={1080} height={608} style={{position:"absolute",inset:0}}>
    <defs>
      <Gradients prefix="glass-"/>
      <linearGradient id="band" gradientUnits="userSpaceOnUse" x1={a} x2={b} y1={0} y2={0}>
        <stop offset="0" stopColor="black"/><stop offset=".14583333" stopColor="white"/>
        <stop offset=".85416667" stopColor="white"/><stop offset="1" stopColor="black"/>
      </linearGradient>
      <linearGradient id="inverse-band" gradientUnits="userSpaceOnUse" x1={a} x2={b} y1={0} y2={0}>
        <stop offset="0" stopColor="white"/><stop offset=".14583333" stopColor="black"/>
        <stop offset=".85416667" stopColor="black"/><stop offset="1" stopColor="white"/>
      </linearGradient>
      <mask id="lens-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={608}>
        <rect width={1080} height={608} fill="black"/>
        <rect x={a} y={0} width={192} height={608} fill="url(#band)"/>
      </mask>
      <mask id="outside-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={608}>
        <rect width={1080} height={608} fill="white"/>
        <rect x={a} y={0} width={192} height={608} fill="url(#inverse-band)"/>
      </mask>
    </defs>
    <g mask="url(#outside-mask)"><Paths prefix="glass-"/></g>
    <g mask="url(#lens-mask)">
      <g transform={"translate("+cx+" "+cy+") scale(1.16 1.07) translate("+(-cx)+" "+(-cy)+")"}>
        <Paths prefix="glass-"/>
      </g>
    </g>
  </svg>;
};
export const TextEffect: React.FC<{kind: EffectKind}> = ({kind}) => {
  const time=useCurrentFrame()/30;
  return <AbsoluteFill style={{backgroundColor:"#050505",overflow:"hidden"}}>
    {kind==="contour" ? <Contour time={time}/> : kind==="hinge" ? <Hinge time={time}/> : <Glass time={time}/>}
  </AbsoluteFill>;
};
