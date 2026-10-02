# Four Lamped text entry studies — 2 October 2026

Cards 138–141: chromatic focus, woven slices, elastic baselines, editorial blocks.
The headings, frozen glyph geometry, fonts and palette reuse the verified source
archive `шрифты-анимации.zip`. The four motions are newly authored.

`effects.mjs` is the only scene implementation. Both the self-contained
`demo.html` and every exported video frame use it with the same `geometry.json`.
No system fonts, network requests, random values or browser layout enter rendering.

## Rebuild

Node 22+, ffmpeg (libx264, libwebp):

```sh
npm ci
node build-demo.mjs
node render.mjs
```

`node render.mjs --stills` writes only the inspection frames.
`node render.mjs --id=138` renders one study. Outputs are written to the public
repository's `videos/text-effects` and `images/text-effects/posters`; QA data goes
to a separate sibling scratch folder, not into the repository.

Videos are silent H.264/yuv420p, faststart, 1080×608, 30 fps, 180 frames / 6 s.
The full heading holds initially, fades out, reveals with the selected mechanism,
then holds again. First/last uncompressed frames must match byte for byte.
This gallery loop is not an instruction for infinite production autoplay.

Open `demo.html` locally. `?effect=139` selects another study. Replay runs one
pass; Space/Enter while the demo has focus replays it, Escape settles it.
Reduced motion stays static. Hidden/offscreen playback pauses without losing
elapsed time; pagehide cleans up animation, listeners and observer.

The exact fonts, OFL licenses and transparent original heading vectors remain at
Repixel-Previews commit `b7df5b80a0f43bbf7167126b7fd1d33adad793a7`, under
`fonts/text-effects/lamped-2026-10-01/` and
`images/text-effects/lamped-2026-10-01/`. Provenance records original file hashes.
New card prompts separately enumerate immutable resource URLs, byte counts,
SHA-256, composition tables and all motion formulas.
