# The Inside Look — Liquid Ink Reveal

One new entry animation using the THE / INSIDE / LOOK® heading from the verified Drive archive шрифты-анимации.zip. The heading's actual glyph geometry and raised trademark are preserved; the isolated preview enlarges everything uniformly by 1.35 around (540,304).

The browser demo and video renderer both call `renderSvg` from effect.mjs with geometry.json and parameters.json. This is a wave-shaped fill mask over stationary typography, preceded by fine outlines; no glyph is stretched or displaced.

Build the dependency-free standalone demo with `node build-demo.mjs` and open demo.html. `?mode=entry` runs the production entry once, `?t=1.7` shows an exact gallery timestamp. The preview loop is 6 seconds; the actual entry lasts 1.96 seconds. Reduced motion presents a static filled heading.

For video export install sharp from npm, then run `node render.mjs` with ffmpeg on PATH. This creates 1080×608, 30 fps, 180 frames, H.264/yuv420p, silent, faststart MP4 and a lossless WebP poster. First and last source frames are identical. The initial static hold and short reset exist only to demonstrate the effect in the catalog.

Source geometry and fonts are pinned to the existing first Lamped release; source-provenance.json records archive and source hashes. The new animation does not originate in that archive.
