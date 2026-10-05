# orbit-kids-astronomy-2026-10-05 — asset reconstruction analysis

> All dimensions and percentages below are measurements/estimates taken from the provided 1448×1086 raster screenshot, not original design-file values. Generated files are reconstructions from the screenshot; hidden pixels removed by UI or viewport clipping are not claimed to be original source art.

## Screen regions

- **Home**: ≈ `71,80–474,966` px, `403×886` px; ≈ `27.8% × 81.6%` of screenshot.
- **Discover**: ≈ `506,104–906,1000` px, `400×896` px; ≈ `27.6% × 82.5%` of screenshot.
- **Lesson detail**: ≈ `964,80–1339,967` px, `375×887` px; ≈ `25.9% × 81.7%` of screenshot.

The outer sky-blue presentation background and phone/mockup chrome are not application assets. System chrome/indicators are excluded.

## Screen-by-screen separation

**Home.** Raster art consists of the Liam avatar, the large Explore-the-Universe hero, the Solar System thumbnail and the visible Life-in-Space card fragment. Headline/subtitle/CTA, search field, chips, card copy, play buttons and bottom navigation are UI and are not embedded in the rasters.

**Discover.** Raster art consists of the reused Liam avatar, Amazing Earth, visible Galaxies fragment, Stars & Constellations and visible Mars fragment. Search, category chips, section titles, lesson-count copy, play controls and bottom navigation remain UI.

**Lesson detail.** Raster art consists of the Journey-to-the-Moon hero plus three lesson thumbnails. Back/bookmark/heart, metadata pills, lesson titles, durations, lock/play controls and CTA remain UI/SVG/CSS.

## Raster assets

### `hero-explore-universe.webp`

- **Role/location:** Home hero illustration — home. Visible screenshot box ≈ `x=91, y=186, 378×253 px` (≈ `26.1% × 23.3%` of the full screenshot; top-left ≈ `6.28%, 17.13%`).
- **UI separation:** UI headline, subtitle, CTA removed; hidden background reconstructed
- **Primary object estimate:** boy astronaut occupies ≈ `43%` width and `72%` height; edge gaps ≈ top `17%`, bottom `5%`, left `52%`, right `5%`. No major character clipping; lunar surface is deliberately cropped by bottom/right frame.
- **Export/use:** `1134×759 px` (1.494:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct only the home hero artwork from the supplied screenshot: bright kid-friendly 3D/cartoon space scene, boy astronaut floating on the right, yellow cratered Moon entering from bottom-right, Saturn at top-right, small yellow/white stars, layered deep-to-electric-blue nebula background. Match the screenshot framing, scale and lighting. Remove all headline/subtitle/button UI and rebuild the obscured blue background. No text, badges, controls or frames.

### `course-solar-system.webp`

- **Role/location:** Solar System course thumbnail — home. Visible screenshot box ≈ `x=99, y=664, 203×125 px` (≈ `14.02% × 11.51%` of the full screenshot; top-left ≈ `6.84%, 61.14%`).
- **UI separation:** Play control removed
- **Primary object estimate:** Sun + six visible planets/orbits occupies ≈ `100%` width and `82%` height; edge gaps ≈ top `7%`, bottom `11%`, left `0%`, right `2%`. Sun is intentionally cropped by the left edge; composition spans the frame.
- **Export/use:** `609×375 px` (1.624:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the Solar System thumbnail exactly from the screenshot fragment: large glowing yellow Sun cropped at the left edge, six small planets along curved orbital lines across a dark navy star field, blue outer planet near the upper-right. Remove the circular play UI. Preserve the landscape crop and warm-left/cool-right lighting.

### `course-life-in-space.webp`

- **Role/location:** Life in Space course thumbnail (visible viewport fragment) — home. Visible screenshot box ≈ `x=319, y=664, 156×125 px` (≈ `10.77% × 11.51%` of the full screenshot; top-left ≈ `22.03%, 61.14%`).
- **UI separation:** Play control removed; right side is clipped by phone viewport
- **Primary object estimate:** boy astronaut over lunar surface occupies ≈ `62%` width and `88%` height; edge gaps ≈ top `7%`, bottom `0%`, left `29%`, right `0%`. Right arm/body and card continue beyond the phone viewport; exported asset is the visible screenshot fragment.
- **Export/use:** `468×375 px` (1.248:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the visible Life in Space thumbnail fragment: cheerful boy astronaut in white-and-blue suit floating above a warm lunar surface, deep blue star field with small stars, cropped by the phone viewport on the right. Remove the play control only. No text or card chrome.

### `course-amazing-earth.webp`

- **Role/location:** Our Amazing Earth course thumbnail — discover. Visible screenshot box ≈ `x=546, y=396, 202×159 px` (≈ `13.95% × 14.64%` of the full screenshot; top-left ≈ `37.71%, 36.46%`).
- **UI separation:** Play control removed
- **Primary object estimate:** smiling Earth globe occupies ≈ `68%` width and `84%` height; edge gaps ≈ top `8%`, bottom `5%`, left `15%`, right `17%`. Globe is essentially complete; small decorative planets sit at corners.
- **Export/use:** `606×477 px` (1.270:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the Our Amazing Earth thumbnail: centered cute smiling Earth with blue oceans and green continents, rosy cheeks, dark navy star field, small Moon upper-right and tiny purple planet lower-left. Remove the play control. Preserve the same rounded-card crop for cover usage but do not draw UI.

### `course-galaxies.webp`

- **Role/location:** Mysteries of Galaxies course thumbnail (visible viewport fragment) — discover. Visible screenshot box ≈ `x=765, y=396, 140×159 px` (≈ `9.67% × 14.64%` of the full screenshot; top-left ≈ `52.83%, 36.46%`).
- **UI separation:** Play control removed; right side is clipped by phone viewport
- **Primary object estimate:** spiral galaxy occupies ≈ `92%` width and `86%` height; edge gaps ≈ top `7%`, bottom `7%`, left `3%`, right `5%`. Right side of the original card is clipped by the phone viewport; exported asset is the visible fragment.
- **Export/use:** `420×477 px` (0.880:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the visible Mysteries of Galaxies thumbnail fragment: luminous purple/pink/yellow spiral galaxy on deep blue space, bright core slightly left of center, small stars. Remove the play control; no text/UI; preserve the fragment visible in the screenshot.

### `course-stars-constellations.webp`

- **Role/location:** Stars and Constellations course thumbnail — discover. Visible screenshot box ≈ `x=546, y=714, 190×119 px` (≈ `13.12% × 10.96%` of the full screenshot; top-left ≈ `37.71%, 65.75%`).
- **UI separation:** Play control removed
- **Primary object estimate:** observer silhouette + telescope occupies ≈ `77%` width and `88%` height; edge gaps ≈ top `9%`, bottom `0%`, left `9%`, right `14%`. Silhouette is intentionally cut by the lower edge.
- **Export/use:** `570×357 px` (1.597:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the Stars and Constellations thumbnail: dark child silhouette looking through a telescope from lower-left, violet/pink dusk sky, crescent Moon upper-right, small stars and thin constellation lines. Remove the play control. Keep the exact horizontal framing.

### `course-exploring-mars.webp`

- **Role/location:** Exploring Mars course thumbnail (visible viewport fragment) — discover. Visible screenshot box ≈ `x=750, y=714, 155×119 px` (≈ `10.7% × 10.96%` of the full screenshot; top-left ≈ `51.8%, 65.75%`).
- **UI separation:** Play control removed; right edge is clipped by phone viewport
- **Primary object estimate:** smiling Mars occupies ≈ `78%` width and `92%` height; edge gaps ≈ top `8%`, bottom `0%`, left `20%`, right `2%`. Mars is cropped by the right and lower edges; right side of card is also clipped by phone viewport.
- **Export/use:** `465×357 px` (1.302:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the visible Exploring Mars thumbnail fragment: large orange-red cute Mars with subtle smiling face and crater texture dominating the right, small purple Moon upper-left, dark blue star field and pale lunar ridge at bottom-left. Remove play UI, preserve crop.

### `hero-journey-moon.webp`

- **Role/location:** Journey to the Moon hero illustration — lesson-detail. Visible screenshot box ≈ `x=964, y=80, 375×366 px` (≈ `25.9% × 33.7%` of the full screenshot; top-left ≈ `66.57%, 7.37%`).
- **UI separation:** Back and bookmark controls removed; top corners reconstructed
- **Primary object estimate:** rocket with child astronaut occupies ≈ `67%` width and `61%` height; edge gaps ≈ top `20%`, bottom `19%`, left `19%`, right `14%`. Rocket is shown nearly complete; exhaust overlaps the lunar foreground by design.
- **Export/use:** `1125×1098 px` (1.025:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the lesson hero artwork: child astronaut riding a white rocket with orange fins diagonally up-right, bright exhaust, cratered Moon across the lower-left foreground, Earth lower-right/left-mid as visible, small orange planets and yellow stars on a deep navy space field. Remove back/bookmark controls and rebuild the star field beneath them. No text or UI.

### `lesson-moon-basics.webp`

- **Role/location:** Moon Basics lesson thumbnail — lesson-detail. Visible screenshot box ≈ `x=999, y=656, 70×57 px` (≈ `4.83% × 5.25%` of the full screenshot; top-left ≈ `68.99%, 60.41%`).
- **UI separation:** Container rounding removed from raster
- **Primary object estimate:** full Moon disc occupies ≈ `66%` width and `82%` height; edge gaps ≈ top `9%`, bottom `9%`, left `17%`, right `17%`. Moon is complete.
- **Export/use:** `210×171 px` (1.228:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the tiny Moon Basics thumbnail: full grey Moon disc centered on a deep navy field with a soft cool glow, matching the screenshot crop. No UI or text.

### `lesson-phases-moon.webp`

- **Role/location:** Phases of the Moon lesson thumbnail — lesson-detail. Visible screenshot box ≈ `x=999, y=726, 70×57 px` (≈ `4.83% × 5.25%` of the full screenshot; top-left ≈ `68.99%, 66.85%`).
- **UI separation:** Container rounding removed from raster
- **Primary object estimate:** half-lit Moon occupies ≈ `52%` width and `86%` height; edge gaps ≈ top `7%`, bottom `7%`, left `29%`, right `19%`. Moon is complete within the dark field.
- **Export/use:** `210×171 px` (1.228:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the tiny Phases of the Moon thumbnail: half-lit Moon with warm grey lit right side and deep shadow left, centered on a dark navy field. No UI or text.

### `lesson-moon-exploration.webp`

- **Role/location:** Moon Exploration lesson thumbnail — lesson-detail. Visible screenshot box ≈ `x=999, y=796, 70×49 px` (≈ `4.83% × 4.51%` of the full screenshot; top-left ≈ `68.99%, 73.3%`).
- **UI separation:** Container rounding removed from raster
- **Primary object estimate:** small astronaut on lunar surface occupies ≈ `58%` width and `83%` height; edge gaps ≈ top `12%`, bottom `0%`, left `25%`, right `17%`. Lower lunar surface/astronaut continues to the bottom edge.
- **Export/use:** `210×147 px` (1.429:1), alpha `no`; `object-fit: cover; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Reconstruct the tiny Moon Exploration thumbnail: small astronaut in white suit on a lunar surface against a dark blue star field, matching the screenshot crop. No lock/play/text UI.

### `avatar-liam.png`

- **Role/location:** Liam avatar illustration reused in header — home/discover. Visible screenshot box ≈ `x=395, y=112, 54×50 px` (≈ `3.73% × 4.6%` of the full screenshot; top-left ≈ `27.28%, 10.31%`).
- **UI separation:** Green online status dot removed; pale blue circular avatar background retained as artwork.
- **Primary object estimate:** boy head/shoulders inside pale blue avatar disc occupies ≈ `72%` width and `78%` height; edge gaps ≈ top `9%`, bottom `13%`, left `14%`, right `14%`. Hair/shoulders are intentionally cropped by the circular avatar composition.
- **Export/use:** `162×150 px` (1.080:1), alpha `yes`; `object-fit: contain; object-position: 50% 50%`. The export is 3× the measured screenshot crop using high-quality resampling; this increases delivery resolution but does not recover missing source detail.
- **Reconstruction prompt:** Extract/reconstruct the recurring Liam avatar only: cheerful brown-haired boy head and shoulders on the same pale blue circular avatar background; remove the green online-status dot and make pixels outside the avatar circle transparent.

## SVG icons

SVGs use transparent backgrounds and `viewBox="0 0 24 24"`. Monochrome UI glyphs use `currentColor` so active/inactive color is set by the interface; topic icons contain their visible blue/yellow/purple/red colors. Button circles/pills are deliberately not included in icon files.

- `icons/back.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/book-open.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/bookmark.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/chevron-right.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/clock.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/compass.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/heart.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/home-filled.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/home-outline.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/level-bars.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/lock.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/menu.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/play.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/profile.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/search.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/topic-galaxies.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/topic-planets.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/topic-spacecraft.svg` — reusable UI glyph; transparent SVG; no button background.
- `icons/topic-stars.svg` — reusable UI glyph; transparent SVG; no button background.

## UI primitives not baked into images

- App surface: `#FFFFFF`.
- Primary text/navy: approximately `#07183F`; secondary copy approximately `#6E84AE`.
- Search/input/lesson-row surface: approximately `#F1F6FC`; neutral chip surface approximately `#F6F8FC`.
- Active category chip: approximately `#DDEBFF`; primary blue approximately `#2F84F8`.
- Primary CTA: approximate left→right gradient `#3D94FF 0%` → `#2E7EF5 100%`.
- Heart/accent pink: approximately `#FF667F`; level green: approximately `#18C785`.
- Cards/controls: white or pale-blue rounded rectangles; common visual corner radii are roughly 14–28 px at screenshot scale. Use CSS clipping for the raster corners rather than baking container radius into the artwork.
- Approximate card/button shadow: `0 8px 24px rgba(24, 61, 113, 0.10)`; keep it in CSS, not in raster art.
- Avatar online state: separate small green circle (`#20C997`) with a white ring; not included in `avatar-liam.png`.
- Play buttons: blue or white circular UI backgrounds with the separate `icons/play.svg` glyph.
- Outer mockup backdrop (not part of the app): pale-sky gradient approximately `#A3DAFA` → `#B9E7FF` with translucent decorative blobs/stars.
