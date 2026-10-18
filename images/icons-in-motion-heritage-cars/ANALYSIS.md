# Icons in Motion — asset analysis

Source: 1448×1086 screenshot. All coordinates are **observations/estimates from raster**, not original layout measurements.

Photo contents are screenshot-derived reconstructions; exported 3× is upscaling, not genuinely resolved 3× source.

## Asset map

| File | Purpose | PNG/WebP/SVG size | Aspect | Alpha | Original screenshot observed bounding box and (% of screenshot) | Display |
|---|---|---:|---:|---|---|---|
| `porsche-911-hero.webp` | main image, screen 1 | 1173×1218 | 0.963 | none | 80,302 — 471,708 (5.52%,27.81%; 27.0% × 37.38%) | cover; use natural image crop, no stretching |
| `porsche-911-profile.png` | main side profile + reuse for first collection thumbnail | 1176×423 | 2.780 | yes | 514,472 — 906,613 (35.5%,43.46%; 27.07% × 12.98%) | contain, transparent background, no extra CSS shadow |
| `ferrari-250-gto-hero.webp` | auction screen hero | 1158×1398 | 0.828 | none | 967,226 — 1353,692 (66.78%,20.81%; 26.66% × 42.91%) | cover; crop right edge only as screenshot |
| `mercedes-300sl-thumb.png` | collection card 2 | 432×285 | 1.516 | yes | 240,810 — 384,905 (16.57%,74.59%; 9.94% × 8.75%) | contain, avoid background or second shadow |
| `jaguar-e-type-thumb-partial.png` | collection card 3, clipped | 243×267 | 0.910 | yes | 390,816 — 471,905 (26.93%,75.14%; 5.59% × 8.2%) | contain; the remaining off-screen Jaguar is deliberately not reconstructed |
| `porsche-crest.png` | secondary Porsche crest near bottom of timeline | 165×207 | 0.797 | yes | 846,905 — 901,974 (58.43%,83.33%; 3.8% × 6.35%) | contain; do not rasterize CSS text |
| `icons/menu.svg` | hamburger on screen 1 | 24×24 | 1.000 | yes | icon reused, see screen notes | inline SVG; CSS sets stroke-color and size |
| `icons/search.svg` | search on screens 1 and 2 | 24×24 | 1.000 | yes | icon reused, see screen notes | inline SVG; CSS sets stroke-color and size |
| `icons/chevron-left.svg` | back on screens 2 and 3 | 24×24 | 1.000 | yes | icon reused, see screen notes | inline SVG; CSS sets stroke-color and size |
| `icons/bookmark.svg` | outline bookmark on screen 3 | 24×24 | 1.000 | yes | icon reused, see screen notes | inline SVG; CSS sets stroke-color and size |
| `icons/arrow-right.svg` | collection and details CTA arrow | 24×24 | 1.000 | yes | icon reused, see screen notes | inline SVG; CSS sets stroke-color and size |

## Asset separation

- Screen 1: white VINTAGE wordmark, `Icons in Motion`, copy, collection counter, feature labels and years are **HTML text**. Two image layers: cropped Porsche photographic scene and individual cars in collection tiles. Card 1 reuses `porsche-911-profile.png` to avoid duplicate media.
- Screen 2: `Timeline`, years, `911`, `1968`, engine/production/body/class and footer copy are **HTML**. Car is transparent image; crest is independent PNG. Two crossing hairlines and footer rule are CSS.
- Screen 3: all auction text, price, chassis, location, divider rules, CTA, bookmark/button are **UI**; the Ferrari studio photograph contains none.
- Simple gradients, nav slots, 34px panel corners, 14px card corners, 1px separators, hover/focus states and rounded CTA background should be CSS.

## Visible car/object geometry (approximate)

- Large blue Porsche: visible part occupies ≈95–98% of the 391px cropped image width and ≈90–95% of its height including shadow. The nose and roof are cut at the right border. Top margin ≈5px, left margin ≈9px, bottom natural photo/shadow margin ≈5–15px.
- Profile Porsche: car bbox ≈(x=518–895,y=481–601), inside image bbox 514–906×472–613: ~96% of width and ~85% of height. Roof around 8–12px from crop top; contact shadow below at ~593–611.
- Ferrari: visible car covers ~90–95% of 386px image width and ~95% of height (right/body cropped); starts with roof near y240 and front fender around y355, shadow at y650–692.
- Mercedes thumbnail: vehicle appears around x247–377 (≈90% of 144px asset width), y820–892 (≈76% of 95px asset height). Cropped card backdrop is not part of the transparent PNG.
- Jaguar thumbnail: only x396–471 is visible (≈93% of 81px crop width), green rear and roof; visible fragment cropped by collection container on the right.
- Porsche crest: approximate body around x851–896 × y909–971 within a 55×69px raster canvas, original small detail limitations remain.

## CSS colors / effects (approximations)

Screen 1: `linear-gradient(180deg, #899FB8 0%, #9AB1CA 50%, #B5C6D9 100%)`; screen 2: `linear-gradient(180deg,#F4F4F3,#F9F9F8 43%,#F1F2F2)`; screen 3: `linear-gradient(180deg,#171717,#1D1D1D 65%,#131313)`; backdrop `radial-gradient(ellipse at 50% 30%,#EAEAEA,#D6D7D9 80%,#C4C7CA)`.
Panel corners approximately 34px; tiles ~14px; CTA white rounded pill ~22px radius; photographic shadows included in assets and should not be duplicated by CSS.
Icon strokes approximately 1.7px, `currentColor`; icon background must remain transparent.

## Limitations

Visible portions are obtained by careful screenshot-based processing. Original photo layers and SVG masters were unavailable; exact native detail or hidden car geometry cannot be guaranteed.
No artificially reconstructed content should be presented as official photographs or original design files.