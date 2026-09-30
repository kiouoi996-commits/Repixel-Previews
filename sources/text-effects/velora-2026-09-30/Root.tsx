import React from "react";
import {Composition} from "remotion";
import {TextEffect} from "./Effects";
import type {EffectKind} from "./Effects";
export const RemotionRoot: React.FC = () => <>
  {(["contour","hinge","glass"] as EffectKind[]).map(kind =>
    <Composition key={kind} id={"Velora-"+kind} component={TextEffect}
      durationInFrames={180} fps={30} width={1080} height={608} defaultProps={{kind}}/>
  )}
</>;
