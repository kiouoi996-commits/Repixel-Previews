import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, Composition, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ClassicApp} from './app-core';
import './app.css';

export function ClassicFilm() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const host = useRef<HTMLDivElement>(null), app = useRef<ClassicApp | null>(null);
  const latestTime = useRef(0); latestTime.current = frame / fps;
  const [handle] = useState(() => delayRender('Load complete Porsche scene, fonts and photographic assets', {timeoutInMilliseconds: 120000}));
  useLayoutEffect(() => {
    const core = new ClassicApp(host.current!, {asset: path => staticFile(path), film: true});
    app.current = core;
    core.ready.then(() => {
      core.setFilmTime(latestTime.current);
      requestAnimationFrame(() => continueRender(handle));
    }).catch(error => cancelRender(error));
    return () => {app.current = null; core.dispose();};
  }, [handle]);
  useLayoutEffect(() => {app.current?.setFilmTime(frame / fps);}, [frame, fps]);
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 42% 38%,#e4e3df 0%,#d0cfca 44%,#b8b9b4 100%)',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{width:470,height:970,borderRadius:46,overflow:'hidden',position:'relative',boxShadow:'0 24px 60px rgba(32,34,28,.16)'}}>
      <div ref={host} style={{position:'relative',width:470,height:970}} />
    </div>
  </AbsoluteFill>;
}

export const RemotionRoot = () => <Composition id="ClassicPorsche" component={ClassicFilm} width={1448} height={1086} fps={30} durationInFrames={420}/>;
