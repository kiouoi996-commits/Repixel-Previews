# Three section studies — 3 October 2026

These previews use three supplied stills. The motion is newly authored. No
original HTML/CSS, clean separate photographs, font files or hidden interactions
were recovered. Screenshot crops retain their baked reference text; they are
only a deterministic gallery demonstration, not production image assets.

For study 156, three additional lossless WebPs isolate the unobstructed photo
windows visible in the reference. Their measured bounds and hashes are in
photo-assets.json. They are exact screenshot photo crops, not recovered larger
camera originals; they contain no interface headings or controls.

| Number | Section | Authored mechanism | Movie |
|---|---|---|---|
| 155 | Dark product storefront hero | One rigid product-rail step, with an inert cyclic clone and settled counter | 1080×608 |
| 156 | Interior project gallery | Staggered diagonal photograph masks; all non-photo pixels stay fixed | 1080×608 |
| 157 | Three-product collection | One local projective card hinge and clipped shadow; all its content moves together | 1080×810 |

Every movie is six seconds, 30 fps, 180 frames, silent H.264/yuv420p, CRF 18,
faststart. Raw first and last frames are equal. Reference WebPs are pixel
preserving lossless RGB copies of the supplied PNGs. Original attachment byte
counts, dimensions and SHA-256 are in attachments.json.

To reproduce: place attachments.json and the three pinned `*-reference.webp`
files next to render-section-previews.py. Use Python 3.11+, Pillow 12.3.0,
numpy 2.3.5, ffmpeg with libx264 and ffprobe, then run the Python script. It can
also make references from the original PNGs if those are locally available.
The tiny changed fixture counter uses Pillow's bundled default font, which is
a visual substitute, not an identified original font. The renderer checks
actual movement, endpoints, the photo-only invariant, duration and encoding.

Production implementation must have separate semantic headings, live data,
links/buttons and clean client photographs, real interactions, responsive
layout and reduced motion. Initial holds, resets and timed return paths are
only for the preview loop; they are not production timers.
