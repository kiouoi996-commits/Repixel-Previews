# Lamped — screen boundary entries

Three new authored entry motions over the real typography from the previously verified Drive archive `шрифты-анимации.zip`. Heading text, frozen font weights, palette and glyph geometry reuse the original Lamped studies. These motions are new work, not behavior found in the archive.

- 142: two complete lines enter from opposite horizontal screen edges with a restrained overshoot.
- 143: individual serif glyphs enter from below the bottom screen edge, staggered by line and visible glyph.
- 144: the complete three-line heading enters as one rigid group from beyond both top and right edges along a quadratic path while a −12° tilt unwinds. Internal line spacing stays intact throughout.

All moving ink starts outside the **1080×608 screen**, not behind a local text aperture. `effects.mjs` uses a single clip rectangle covering that screen. Letter shapes, colors and proportions stay intact. The JSON includes the actual glyph bounds and paths; line bounds include the attached ®.

`scene()` is shared by the standalone demo and video renderer. Its six-second gallery sequence holds the complete heading until 0.45 seconds, fades that preparation to zero at 0.85 seconds, performs the entry, then holds the complete heading. Gallery preparation is omitted for production: use `entryOnly:true` with time `u+0.98` for 142/143 or `u+1.00` for 144. Here `u` is the time since the one-time entry trigger. Reduced motion is `rest:true`.

Run with Node 22+ and FFmpeg on PATH:

```sh
npm ci
npm run demo
npm run stills
npm run render
```

Open `demo.html` directly. `?effect=142`, `143` or `144` selects a study. Replay, Space/Enter and Escape are available. Reduced motion shows the final heading. The demo pauses while hidden or outside the viewport and cleans up on pagehide. The downloadable HTML is self-contained and does not load a CDN.

Export: silent H.264/yuv420p, faststart, 1080×608, 30 fps, 180 frames, six seconds; lossless WebP posters. The renderer verifies identical first/last uncompressed frames before export. Original archive code is not embedded in the implementation or English prompts. Font provenance is in `source-provenance.json`; fixed font/vector resources are linked separately by the Repixel prompt.
