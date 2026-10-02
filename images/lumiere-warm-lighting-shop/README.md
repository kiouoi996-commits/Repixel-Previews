# Lumiere Warm Lighting Shop — reconstructed assets

Source: provided 1448×1086 screenshot.

This package is a **reconstruction from a raster screenshot**, not the original design source or original product photography. UI text, prices, badges, buttons, frames, rounded-card backgrounds, and system status indicators are intentionally not baked into raster images. Simple controls are supplied as transparent 24×24 SVG icons.

## Display notes
- Hero and product/card photos: `object-fit: cover`.
- Category PNGs: true alpha; `object-fit: contain`.
- Button/container shadows and rounded corners belong to the UI layer.
- Approximate visual tokens and per-asset screenshot coordinates are in `manifest.json`.

## Raster QA
Category PNGs were checked against light and dark backdrops; the exported files contain alpha rather than a white/checkerboard background.