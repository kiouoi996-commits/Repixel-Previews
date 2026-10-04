# Workly Flexspace Booking — reconstruction analysis

**Project:** `workly-flexspace-booking-2026-10-04`  
**Source screenshot:** 1448×1086 px.

This package is a **reconstruction from the screenshot**, not a recovery of original design or photography. Pixel coordinates below are measured/estimated on the supplied raster and therefore must not be treated as verified source-layout constraints.

## Screen-by-screen reading

- **Left / Home:** approximately `x=50..462, y=55..1003` (28.45% × 87.29% of the screenshot). Contains the Workly logo, search/filter controls, category pills, one hero photo, four popular-space thumbnails and bottom navigation.
- **Middle / Detail:** approximately `x=505..910, y=80..1017`. One large Meeting Room A photograph is the only raster scene; back/favorite/share, carousel indicators, title/rating, chips, time slots, room row and CTA are UI.
- **Right / Booking:** approximately `x=952..1361, y=56..987`. Reuses Meeting Room A as the summary thumbnail. The location block uses a separate stylized map background plus a separate blue pin icon.

System status indicators are not present in the reference and were not created.

## Graphic/interface separation

Text, prices, ratings, buttons, badges, white circular control backplates, card borders, selection backgrounds, navigation labels and hero readability overlay are **not baked into the photos**. The map pin is separate from the map background. The red bell badge is CSS/UI rather than part of `bell.svg`.

## Raster reconstruction notes

The four Popular Space thumbnails retain supplied screenshot pixels wherever visible; only the favorite-button area and pixels hidden by rounded clipping are reconstructed. The hero and large detail images require broader reconstruction because UI obscures material portions of the source photo. Their delivered files are therefore screenshot-guided reconstructions; invisible/obscured areas are inferential.

All raster assets are exported at approximately **3× their measured on-screen slot size** and remain opaque WebP because the pictured scenes have their own backgrounds.

## Vector/icon notes

Icons use transparent SVG backgrounds. Most outline icons use a 24×24 viewBox with ≈1.8 px rounded strokes. Filled states use the measured/reconstructed blue `#2F64F1`; rating star uses `#FFAB0A`. Button backplates must be created by the app/CSS.

## UI fills and effects

See `ui-effects.css`. Important estimated tokens include:

- Primary blue: `#2F64F1`
- Primary CTA: `linear-gradient(90deg,#235DEC 0%,#2B65EC 55%,#2F68EC 100%)`
- Confirmation CTA: `linear-gradient(90deg,#B6F33B 0%,#C7F33E 100%)`
- Hero readability overlay (UI, not photo): `linear-gradient(90deg, rgba(0,0,0,.52) 0%, rgba(0,0,0,.34) 26%, rgba(0,0,0,.12) 48%, rgba(0,0,0,0) 72%)`
- Neutral chip: `#F3F3F5`
- Border: `rgba(17,19,24,.08)`
- White circular button backplate: `rgba(255,255,255,.95)` + soft shadow
- Popular-card favorite backplate: `rgba(80,76,69,.38)` + light backdrop blur

Exact per-asset screenshot boxes, subject-coverage estimates, reconstruction prompts and rendering instructions are in `manifest.json`.
