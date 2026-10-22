# Four minimal menu reveals

Authored navigation studies from one supplied still image. The final open scene is identical in all four variants. The original image did not contain motion or source code.

| Variant | Open / close | Mechanism |
|---|---|---|
| 182 Corner Iris | 1200 / 900 ms | Circle grows from the upper-right trigger; links rise with a stagger. |
| 183 Center Seam | 1100 / 850 ms | Two half-surfaces expand horizontally from the center seam. |
| 184 Ribbon Cascade | 1350 / 1000 ms | Eight horizontal bands alternate left/right; normalized band delay .055. |
| 185 Elastic Curtain | 1450 / 1100 ms | A cubic falling edge has a damped sag and alternating twist. |

`motion.mjs` owns geometry, progress, easings, native layouts and SVG rendering. `glyphs.json` preserves the frozen Manrope 350/650 outlines; full licensed fonts and license are supplied. Manrope is a visual match to the raster, not a recovered font identity. No raster artwork is used by the menus. Native links, search input and modal controls form a semantic hit layer over the shared visual.

Normal pages start closed. Open them and use menu/close, Escape, links or search. They attach to the right edge. Underlying sample sections are authored integration examples; the placeholder email address must be replaced before using the example as a real business site. Existing application routes and handlers must be preserved when integrating. Language EN is an informational marker in the reference.

`?demo=1` explicitly enables the ten-second gallery timeline. It never becomes a live-site timer. All MP4s are 1080x1080, 30 fps, 300 frames, H.264/yuv420p, silent, faststart. The first and last source PNG frames are byte-identical. Codec quantization is not part of that identity claim. Posters show t=1.45 seconds, complete open state is held after each reveal. Open cues .65 / 5.8 seconds, close cues 4.2 / 8.5 seconds.

The right-edge application panel uses current viewport dimensions. Height below 700px scrolls within the dialog so targets remain usable. Native dialog contains focus and background interaction. Escape/backdrop close, focus restoration, body-scroll restoration, generation guards, killing an interrupted tween, reduced-motion and missing-runtime immediate fallback are implemented. GSAP is embedded as text with its original copyright header to avoid external script MIME errors; the upstream runtime and README are also included.

Reproduce with Python + fontTools (`python3 build-glyphs.py`), then `python3 build-demos.py`. To render, install sharp from npm, provide ffmpeg, then `node render-video.mjs iris output` (or seam/ribbons/curtain). An optional CODEX_PRIMARY_RUNTIME_NODE_MODULES resolves an existing sharp installation. Preview PNG samples and verification JSON are intermediate QA products; only MP4, WebP, supplied still and source resources are published.
