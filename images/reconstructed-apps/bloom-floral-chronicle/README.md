# Bloom — A Floral Chronicle

This is a **reconstruction of UI assets from a 941×1672 screenshot**, not original photography.

- Use the photographic WebP files as image elements, preserving their aspect ratio.
- Keep typography and controls in HTML/CSS; do not rasterize UI labels.
- `hero-bougainvillea-sky.webp` fills a 154×291 portrait at (391,97) of reference screenshot. It is a color/composition approximation, not the obscured original.
- `hero-floral-overhang.webp` is genuinely transparent, positioned at (268,0) and scaled to 546×401 in screenshot coordinates. It was recovered by color segmentation and has limitations where text obscures botanical detail.
- The remaining 11 photographs are pixel-faithful crops from the screenshot, upsampled 3× with Lanczos; there is no added original detail.
- Detailed use, coordinates in absolute px and %, composition notes, and SVG specs are in `manifest.json`.
- Full-bleed photographs are `object-fit:cover;object-position:center`; hero transparent decoration is `contain`.
