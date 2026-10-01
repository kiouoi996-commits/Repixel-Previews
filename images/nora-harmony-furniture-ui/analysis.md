# Nora Harmony Furniture UI — reconstruction analysis

Source screenshot: 1448×1086 px. All measurements below are derived from the raster screenshot and should be treated as estimates, not authoritative source-layout values.

## Screen-by-screen structure

**Home/catalog screen (left):** white/ivory app surface; top logo + notification + bag controls; search/filter row; a photographic editorial hero with UI copy and CTA over it; four icon category tabs; 2×2 curated-product grid; persistent cart summary. The hero copy/CTA are UI overlays and therefore excluded from `home-hero.webp`.

**Product detail screen (center):** tall lifestyle photo with floating back/favorite UI controls, collection copy and carousel count; four gallery thumbnails; title/description; four feature chips; quantity control and CTA. `harmony-main.webp` contains only the lifestyle scene. The first gallery thumbnail reuses `harmony-main.webp` with a tighter cover crop.

**Cart screen (right):** three item rows with square product imagery, text/prices, trash actions and steppers; promo row; totals card; checkout CTA. `chair-pink.webp`, `rye-side-table.webp` and `arc-table-lamp.webp` are reused here.

## Asset measurement table

| File | Visible bbox in screenshot (x,y,w,h) | % of screenshot (x,y,w,h) | Main object occupancy estimate | Crop / fit |
|---|---:|---:|---|---|
| `home-hero.webp` | 86,226,356,211 | 5.94%, 20.81%, 24.59%, 19.43% | ~44% W × 72% H | object-fit: cover; object-position: 52% 50% |
| `chair-sage.webp` | 87,595,172,110 | 6.01%, 54.79%, 11.88%, 10.13% | ~74% W × 82% H | object-fit: cover; object-position: 50% 53% |
| `chair-oak.webp` | 270,595,171,110 | 18.65%, 54.79%, 11.81%, 10.13% | ~68% W × 86% H | object-fit: cover; object-position: 50% 52% |
| `rye-side-table.webp` | 87,788,172,111 | 6.01%, 72.56%, 11.88%, 10.22% | ~48% W × 83% H | tile: cover 50% 52%; cart square: cover 50% 50% |
| `arc-table-lamp.webp` | 270,788,171,111 | 18.65%, 72.56%, 11.81%, 10.22% | ~49% W × 87% H | tile: cover 50% 48%; cart square: cover 50% 50% |
| `chair-pink.webp` | 973,198,98,98 | 67.2%, 18.23%, 6.77%, 9.02% | ~74% W × 77% H | object-fit: cover; object-position: 50% 50% |
| `harmony-main.webp` | 510,79,383,502 | 35.22%, 7.27%, 26.45%, 46.22% | ~67% W × 51% H | object-fit: cover; object-position: 50% 49% |
| `gallery-neutral-interior.webp` | 621,593,78,78 | 42.89%, 54.6%, 5.39%, 7.18% | ~82% W × 80% H | object-fit: cover; object-position: 50% 50% |
| `gallery-fabric-closeup.webp` | 712,593,79,78 | 49.17%, 54.6%, 5.46%, 7.18% | ~100% W × 100% H | object-fit: cover; object-position: 48% 50% |
| `gallery-plant-vase.webp` | 804,593,78,78 | 55.52%, 54.6%, 5.39%, 7.18% | ~58% W × 84% H | object-fit: cover; object-position: 50% 52% |

## Separation of graphics from UI

The raster files do **not** contain product names, prices, quantity controls, delete icons, favorite/back controls, search/filter UI, category-tab backgrounds, promo-code UI, CTA buttons, collection count badge, or card borders/shadows. These stay as app UI. The generated SVGs have transparent backgrounds; button/pill backgrounds are intentionally not included.

## UI colors/effects to implement outside images

- App/page background: `#FAF9F8` (estimated).
- White cards/surfaces: `#FFFFFF`.
- Search/promo soft fill: `#F1EFEF`.
- Product-photo neutral backdrop: approximately `#EAE4DE`.
- Primary text: `#19181D`; secondary text: `#6C6873`.
- Main CTA: `linear-gradient(135deg, #5A576B 0%, #343242 100%)`.
- Typical card radius: ~16 px; photo radius: ~14–18 px; full pills: `999px`.
- Card shadow: `0 10px 30px rgba(55,45,38,.06)`; floating circular control shadow: `0 4px 14px rgba(55,45,38,.08)`.
- Do not duplicate photo-internal contact shadows in CSS.

## Notes on reconstruction fidelity

The original source assets were not available. The delivered files are reconstructions from the screenshot. The two large editorial photographs and the clean pink-chair/gallery reconstructions were regenerated from the screenshot reference; the four catalog packshots preserve the screenshot-visible product silhouettes via screenshot-derived reconstruction/upscale. Invisible areas are therefore approximate where the screenshot did not contain recoverable source pixels.
