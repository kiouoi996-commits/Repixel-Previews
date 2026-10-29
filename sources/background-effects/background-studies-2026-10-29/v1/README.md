# Procedural background studies

Two original backgrounds developed from approved generated stills. The live examples contain only the artwork; no heading, navigation, button, counter or control panel is drawn.

- **Copper Current:** a perspective field of copper filaments on deep navy. A fine pointer displaces nearby line vertices with a bounded curl and the field settles smoothly after pointer leave.
- **Paper Relief:** seven continuous yellow paper bands on warm ivory. A genuine pointer press or touch starts a travelling, damped ripple. Adjacent bands share boundary geometry, so their surfaces and cast shadows move together.

The approved generated images are visual references. Runtime artwork is an independently authored procedural reconstruction. No original 3D model or hidden source animation is claimed.

## Integration

Copy `background.mjs` and `scene.mjs` together. Import and mount within the actual existing section:

```js
import {mountBackground} from './background.mjs';
const background = mountBackground(document.querySelector('#existing-hero'), {
  kind: 'copper', // or 'paper'
  ambient: true,
});
// On component unmount:
background.dispose();
```

The host supplies its own height. The module creates one `aria-hidden` canvas with `pointer-events:none`, establishes a local stacking context and places the canvas behind existing content. Existing text, navigation, CTA actions and focus remain owned by the host. Preserve the returned controller and call `dispose()` on unmount. `pause()` and `resume()` let an application control playback without adding visible controls.

Both kinds accept a `palette` object. For copper use `background`, `accent`, `mid`, `shadow`; for paper use `background`, `accent`, `mid`, `deep`, `shadow`. All entries are CSS colour strings. The paper `shadow` entry may contain alpha. Use colours derived from the target site's design system when adapting. `anchorX` between 0 and 1 chooses the crop alignment for narrow hosts.

The canvas uses a cover composition in a 1600×900 design coordinate system. It caps device pixel ratio at 1.6 and the backing store at approximately 2.6 million pixels. A narrower host or sustained slow draw reduces copper density from 210 to 132 filaments; the scene remains bounded. Rendering is capped at 30 fps while input is integrated at display cadence. A ResizeObserver follows the host, and an IntersectionObserver pauses work offscreen. Hidden documents stop requesting animation frames. Under `prefers-reduced-motion: reduce`, render the still composition, ignore decorative input and request no continuing frames. A missing Canvas 2D context falls back to the base surface colour.

Paper observes `pointerdown` without cancelling the event, taking pointer capture or setting `touch-action:none`. Normal scrolling and existing actions stay usable. At most three ripple fronts remain alive for 2.7 seconds each. Copper ignores coarse touch movement; it never replaces the system cursor or emits a cursor trail. The normal pointer seen in the recorded demonstration is a recording aid only.

## Live examples

Serve this directory through a normal static HTTP server and open `211-copper-current.html` or `212-mera-paper-relief.html`. Do not add the demo's full-viewport CSS to an existing client site; use the mounting API inside that site's section instead.

## Reproducing the previews

The `tools/render.mjs` source uses the same `drawScene` and preview director as the artwork. Install `@napi-rs/canvas` and `sharp`, then run:

```sh
node tools/render.mjs ./output
node tools/verify.mjs ./output
```

FFmpeg and FFprobe must be on PATH. The outputs are silent H.264/yuv420p MP4s, 1280×720 at 30 fps, with `faststart`. The copper demonstration lasts 8 seconds; paper lasts 10 seconds. Every source frame is rendered separately. Preview gestures use curved transfers, variable durations, pauses and a settling tail. The first and final uncompressed frames are identical. A periodic demonstration timeline is used only by the renderer; live interaction follows actual input.

The visual approval references, preview posters, videos and portable source files are hosted separately in Repixel-Previews at immutable commit URLs. English insert/adapt/effect prompts remain in the website repository.
