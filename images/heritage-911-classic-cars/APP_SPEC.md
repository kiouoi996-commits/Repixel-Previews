# Heritage 911 — app integration specification

Use only the following committed media source for both hero images and cards:

`https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/`

Example paths (direct immutable links):

- Home rear hero: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/home_hero_porsche_911_rear.webp
- Detail 1964 hero: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/detail_hero_porsche_911_1964.webp
- 1967 timeline card: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/timeline_porsche_911s_1967.webp
- 911 badge thumbnail: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/detail_911_emblem.webp
- Chevron SVG: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/805d8a44e220da863ec29320cc7f5d9fcabacb6e/images/heritage-911-classic-cars/icons/chevron_left.svg

## Layout skeleton

Three 433–438px wide rounded panels at (82,63), (550,63), (1023,63) within a 1536×1024 preview. Panel corner radius about 42px. All values are screenshot-derived estimates. Build these as independent responsive screens in production.

**Home**: photograph is a full hero layer behind live Classic Cars text, overlaid filters and below card grid; four distinct catalog car photographs. Bottom nav overlay is fixed within panel and conceals parts of the lower two cards. Do not crop/carve nav bar into car photos.

**Details**: full height image at top behind live PORSCHE 911, 1964, back arrow, bookmark and pagination. A separate glass-light rounded stats strip overlays its lower edge; row of 4 detail WebPs; bottom contact CTA.

**Timeline**: live years 1960, 1964, 1967, 1970, 1973; live model labels and years; four photos, each 292px wide; right info portion as CSS/card with separate circular arrow.

## CSS essentials

```css
.preview-stage { background: radial-gradient(ellipse at 50% 43%, #C4C5BF 0%, #B5B7B0 65%, #AAAFA9 100%); }
.phone-screen { background: #F5F4F0; border-radius: 42px; overflow:hidden; box-shadow: 0 23px 52px rgba(46,47,42,.13); }
.car-photo { display:block; width:100%; height:100%; object-fit:cover; object-position:center; }
.gallery-thumb { border-radius:11px; }
.timeline-car-photo { border-radius:18px; }
.active-pill { background:#1A1B19; color:#fff; border-radius:999px; }
.bottom-nav { background:rgba(253,252,249,.95); border-radius:30px; backdrop-filter:blur(16px); }
.secondary-arrow { width:51px; height:51px; border-radius:50%; background:#F1F0ED; }
.black-cta { background:#191B19; border-radius:21px; color:white; }
```

Icon glyphs should be sized 24×24 CSS pixels (or reduced within stats strip); scale evenly and set CSS `color` for `currentColor` icons. Do not include circles in SVGs.

The screenshots have no status bars to reproduce. The hero title, navigation, card labels, prices and pagination are rendered as actual text or CSS rather than burned into photos.

Each asset's exact screenshot coordinates, aspect ratio, cropping, object coverage and use-site are in `manifest.json` and `ANALYSIS.md`.
