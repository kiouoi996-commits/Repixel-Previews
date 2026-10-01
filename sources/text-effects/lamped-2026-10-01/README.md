# Lamped heading studies 132–137

Six different new effects use three actual headings from `шрифты-анимации.zip` in Drive folder «Коды моих сайтов». Archive identity and source-file hashes are in `source-provenance.json`. The motions are newly authored; they are not attributed to the original archive.

The immutable WOFF files freeze Manrope 650/350, Cormorant Garamond regular/italic 400 and Bodoni Moda 400 at optical size 96. Latin glyph outlines were shaped with HarfBuzz, kerning enabled and ligatures disabled; no text is painted with a fallback system font. The isolated preview positions and raised trademark placement are recorded in `geometry.json`.

| Study | Motion | Heading |
|---|---|---|
| 132 | Two diagonal light sweeps inside stationary glyphs | Lighting Up / Creative Minds |
| 133 | Curved movement and rotation of intact glyphs | Lighting Up / Creative Minds |
| 134 | Staggered circular ink masks, expanding from lower stems | SPACE / OF QUALITY / INTERIOR |
| 135 | Alternating line translation, rotation and shear | SPACE / OF QUALITY / INTERIOR |
| 136 | Identical line copies roll through three independent apertures | THE / INSIDE / LOOK® |
| 137 | Symmetric tracking expansion and a small return overshoot | THE / INSIDE / LOOK® |

`effects.mjs` is the single scene implementation used both in the self-contained `demo.html` and by `render.mjs`. Open `demo.html?effect=132` through `?effect=137`, or use its effect selector. It needs no network requests. It runs one pass, supports replay, settles on Escape and shows a static heading for reduced motion. The exported gallery previews demonstrate the same six-second pass; infinite autoplay is not required for a customer website.

From this directory:

```sh
npm ci
node build-demo.mjs
node render.mjs --stills
node render.mjs
```

FFmpeg must be installed for MP4/WebP output. Exports are 1080×608, 30 fps, exactly 180 frames, H.264/yuv420p, silent and faststart. Posters are lossless WebP. Uncompressed first and last frames are byte-identical. QA stills and the rendering manifest go outside the repository, to `../repixel-text-qa` relative to its root.

`build-geometry.py` rebuilds outlines from the original variable font files listed in the provenance. It needs fonttools and uharfbuzz and takes the upstream font directory, original ZIP and extracted source directory as arguments. The published WOFF/SVG/JSON files already contain the frozen resources needed for faithful reproduction; reconstructing the original page or finding the ZIP is not required.
