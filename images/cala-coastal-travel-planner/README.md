# Cala — Coastal Travel Planner

Asset reconstruction for a 1448 × 1086 screenshot of three phone screens. All photos originate from visible screenshot pixels, NOT from source photo files. See manifest.json for per-item geometry, percent measurements, prompts, retouch approximations, CSS geometry, alpha handling.

## Content
10 standalone WebP photo crops, 17 SVG icons, topographic map and separate route SVG, manifest.json, CSV asset table.

## Screenshot geometry
Left screen x=62..466, y=90..964 (~404×874 px); center x=503..904, y=90..964; right x=941..1350, y=90..965. Exact margins and radii estimated from visible pixels.

## Source limitations
Masked cutout photography and control-occluded areas are reconstructions. Upscaling does not produce real image detail. Small category cards have obscured bottoms; lower parts derive from clean upper area, not from a recovered original.

## Rendering
Use photo pixels as standalone <img> assets or CSS background-image, not a whole screenshot. UI text, button circles, active calendar, pagination, gradients, shadows, image clipping must be rendered by CSS and SVG icon overlay. The hero and cover images include alpha outside visually observed irregular photo silhouette; never stretch them independently on one axis.

## Icon conventions
SVG icons use 24×24, strokes 1.6–1.7px, currentColor, transparent background. Place inside CSS button surface. Use icons/home-filled.svg for selected nav state, outlined icons otherwise.

## Provenance
Reference screenshot supplied by user. No access to original project image sources; all files labeled screenshot-derived reconstructions or handmade vector approximations.