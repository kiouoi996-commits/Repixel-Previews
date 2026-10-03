# Caldera Journey Mobile — screenshot reconstruction analysis

Source screenshot: **1536×1024 px**. All measurements below are estimates measured from the raster screenshot, not authoritative source-layout values. Generated files are reconstructions, not original assets.

## Screen segmentation
- **Discover**: x=69, y=57, w=439, h=938 px (4.49%, 5.57%, 28.58%, 91.6% of screenshot).
- **Santorini detail**: x=560, y=58, w=417, h=937 px (36.46%, 5.66%, 27.15%, 91.5% of screenshot).
- **Plan your trip**: x=1028, y=57, w=440, h=938 px (66.93%, 5.57%, 28.65%, 91.6% of screenshot).

## Raster assets
### santorini-hero.webp
- Role/location: Shared Santorini master photo for discovery hero card and detail hero; center screen hero; reused on left hero card.
- Visible screenshot region: x=561, y=58, w=415, h=534 px = 36.52%, 5.66%, 27.02%, 52.15% of full screenshot.
- Export: 1245×1602 px; aspect 0.7772:1; alpha: no.
- Main subject occupancy (visual estimate): ~56% width × ~76% height; church cluster right/bottom; caldera left.
- Display: object-fit: cover; center screen position 50% 50%; left discovery card position about 50% 47%.
- Separation/reconstruction: UI overlays removed by screenshot-based inpainting; portions under original labels/buttons are reconstructed, not source pixels.

### gallery-bougainvillea.webp
- Role/location: Santorini gallery photo; center screen 2x2 gallery.
- Visible screenshot region: x=589, y=692, w=175, h=145 px = 38.35%, 67.58%, 11.39%, 14.16% of full screenshot.
- Export: 525×435 px; aspect 1.2069:1; alpha: no.
- Main subject occupancy (visual estimate): ~55% width × ~90% height; varies by tile.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Rounded clipping belongs to UI; file corners reconstructed to rectangular source. 

### gallery-caldera.webp
- Role/location: Santorini gallery photo; center screen 2x2 gallery.
- Visible screenshot region: x=774, y=692, w=177, h=145 px = 50.39%, 67.58%, 11.52%, 14.16% of full screenshot.
- Export: 531×435 px; aspect 1.2207:1; alpha: no.
- Main subject occupancy (visual estimate): ~55% width × ~90% height; varies by tile.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Rounded clipping belongs to UI; file corners reconstructed to rectangular source. Play button removed/reconstructed.

### gallery-sunset.webp
- Role/location: Santorini gallery photo; center screen 2x2 gallery.
- Visible screenshot region: x=589, y=849, w=175, h=139 px = 38.35%, 82.91%, 11.39%, 13.57% of full screenshot.
- Export: 525×417 px; aspect 1.259:1; alpha: no.
- Main subject occupancy (visual estimate): ~55% width × ~90% height; varies by tile.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Rounded clipping belongs to UI; file corners reconstructed to rectangular source. 

### gallery-blue-dome.webp
- Role/location: Santorini gallery photo; center screen 2x2 gallery.
- Visible screenshot region: x=774, y=849, w=177, h=139 px = 50.39%, 82.91%, 11.52%, 13.57% of full screenshot.
- Export: 531×417 px; aspect 1.2734:1; alpha: no.
- Main subject occupancy (visual estimate): ~55% width × ~90% height; varies by tile.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Rounded clipping belongs to UI; file corners reconstructed to rectangular source. 

### destination-dolomites.webp
- Role/location: Popular destination thumbnail: Dolomites; left screen popular destinations, card 1.
- Visible screenshot region: x=96, y=765, w=158, h=122 px = 6.25%, 74.71%, 10.29%, 11.91% of full screenshot.
- Export: 474×366 px; aspect 1.2951:1; alpha: no.
- Main subject occupancy (visual estimate): ~86% width × ~86% height; mountain massif centered.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Heart button removed; rounded top corners belong to UI.

### destination-phuket.webp
- Role/location: Popular destination thumbnail: Phuket; left screen popular destinations, card 2.
- Visible screenshot region: x=267, y=765, w=152, h=122 px = 17.38%, 74.71%, 9.9%, 11.91% of full screenshot.
- Export: 456×366 px; aspect 1.2459:1; alpha: no.
- Main subject occupancy (visual estimate): ~92% width × ~86% height; limestone cliffs left/right, turquoise water lower half.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Heart button removed; rounded top corners belong to UI.

### destination-barcelona.webp
- Role/location: Popular destination thumbnail: Barcelona; left screen popular destinations, partially offscreen card 3.
- Visible screenshot region: x=432, y=765, w=75, h=122 px = 28.12%, 74.71%, 4.88%, 11.91% of full screenshot.
- Export: 456×366 px; aspect 1.2459:1; alpha: no.
- Main subject occupancy (visual estimate): ~65% width × ~78% height; Sagrada Familia towers near left-center of visible slice.
- Display: object-fit: cover; object-position: left center.
- Separation/reconstruction: Only left 75 px of a nominal ~152 px image is visible in the screenshot. Hidden right ~50.7% is deliberately low-detail extrapolation; visible slice is preserved.

### hotel-caldera-view.webp
- Role/location: Hotel room thumbnail; right screen hotel card.
- Visible screenshot region: x=1068, y=699, w=184, h=174 px = 69.53%, 68.26%, 11.98%, 16.99% of full screenshot.
- Export: 552×522 px; aspect 1.0575:1; alpha: no.
- Main subject occupancy (visual estimate): ~88% width × ~86% height; bed/sofa foreground, sea-view window center.
- Display: object-fit: cover; object-position: center.
- Separation/reconstruction: Rounded corners belong to UI; screenshot-derived rectangular reconstruction.

### profile-avatar.webp
- Role/location: User profile portrait; left screen top-right avatar.
- Visible screenshot region: x=430, y=91, w=48, h=48 px = 27.99%, 8.89%, 3.12%, 4.69% of full screenshot.
- Export: 144×144 px; aspect 1.0:1; alpha: no.
- Main subject occupancy (visual estimate): ~52% width × ~86% height; face centered.
- Display: object-fit: cover; border-radius: 50% in UI.
- Separation/reconstruction: Circular screenshot clipping is not baked in; square corners are background continuation and are hidden by UI mask.

## SVG icons
- **icons/brand-mark.svg** — App mark; first visible region x=104, y=101, w=36, h=25 px (2.34%×2.44% of screenshot). render 36×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/search.svg** — Search; first visible region x=116, y=304, w=24, h=25 px (1.56%×2.44% of screenshot). render ~24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/filter-sliders.svg** — Filters; first visible region x=442, y=304, w=24, h=24 px (1.56%×2.34% of screenshot). render ~24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/mountains.svg** — Mountains category; first visible region x=181, y=381, w=24, h=24 px (1.56%×2.34% of screenshot). render 22–24 px. Transparent background; button/chip/circle is separate UI.
- **icons/beach-palm.svg** — Beach category; first visible region x=324, y=380, w=23, h=25 px (1.5%×2.44% of screenshot). render 22–24 px. Transparent background; button/chip/circle is separate UI.
- **icons/city.svg** — City category; first visible region x=435, y=381, w=24, h=24 px (1.56%×2.34% of screenshot). render 22–24 px. Transparent background; button/chip/circle is separate UI.
- **icons/chevron-left.svg** — Back; first visible region x=595, y=108, w=23, h=24 px (1.5%×2.34% of screenshot). render 24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/arrow-right.svg** — Forward / continue; first visible region x=433, y=643, w=21, h=21 px (1.37%×2.05% of screenshot). render 22–24 px. Transparent background; button/chip/circle is separate UI.
- **icons/route-arrow-right.svg** — Flight route arrow; first visible region x=1234, y=429, w=22, h=16 px (1.43%×1.56% of screenshot). render ~22×16 px. Transparent background; button/chip/circle is separate UI.
- **icons/heart.svg** — Favorite; first visible region x=919, y=107, w=25, h=28 px (1.63%×2.73% of screenshot). render 22–24 px. Transparent background; button/chip/circle is separate UI.
- **icons/calendar.svg** — Calendar; first visible region x=1403, y=106, w=25, h=25 px (1.63%×2.44% of screenshot). render 24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/star.svg** — Rating star; first visible region x=885, y=535, w=21, h=22 px (1.37%×2.15% of screenshot). render 16–20 px. Transparent background; button/chip/circle is separate UI.
- **icons/photos.svg** — Photos tab; first visible region x=640, y=617, w=23, h=24 px (1.5%×2.34% of screenshot). render 24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/map.svg** — Map tab; first visible region x=757, y=617, w=24, h=24 px (1.56%×2.34% of screenshot). render 24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/reviews.svg** — Reviews tab; first visible region x=873, y=619, w=26, h=23 px (1.69%×2.25% of screenshot). render 24×24 px. Transparent background; button/chip/circle is separate UI.
- **icons/play.svg** — Play glyph; first visible region x=910, y=789, w=20, h=20 px (1.3%×1.95% of screenshot). render 18–20 px; dark circular UI substrate separate. Transparent background; button/chip/circle is separate UI.
- **icons/flight-blue.svg** — Blue carrier glyph; first visible region x=1081, y=413, w=25, h=25 px (1.63%×2.44% of screenshot). render 24×24 px; blue circle separate. Transparent background; button/chip/circle is separate UI.
- **icons/flight-red.svg** — Red carrier glyph; first visible region x=1080, y=513, w=27, h=25 px (1.76%×2.44% of screenshot). render 24×24 px; red circle separate. Transparent background; button/chip/circle is separate UI.
- **icons/flight-yellow.svg** — Yellow carrier glyph; first visible region x=1081, y=615, w=26, h=23 px (1.69%×2.25% of screenshot). render 24×24 px; yellow circle separate. Transparent background; button/chip/circle is separate UI.

## UI-only primitives (not baked into images)
- page-bg: approx #FAF6F4 — warm off-white phone background; slight lighting variation in screenshot
- search-chip-bg: approx #F1ECE8 — search field/inactive category chips
- card-bg: approx #FEFDFC — 
- active-chip: approx #2A2A2A — 
- primary-text: approx #111317 — 
- secondary-text: approx #8A8F98 — 
- accent-muted-blue: approx #75899F — 
- flight-blue: approx #2B76AD — 
- flight-red: approx #E64646 — 
- flight-yellow: approx #F6B630 — 
- dark-action: approx #292D38 — 
- phone shells: `box-shadow: 0 18px 45px rgba(61,45,38,.12); border-radius: ~48px`
- round icon buttons: `background: rgba(255,255,255,.78); backdrop-filter: blur(10px); border-radius: 999px`
- center bottom sheet: `background: rgba(250,247,245,.96); border-radius: 44px 44px 0 0`
- image corners: `discovery hero ~26px; gallery ~22px; destination card image top ~18px; hotel image ~18px`
- outer screenshot backdrop: `soft warm gray radial/linear wash around #ECE5E2; not an app asset`
- dark continue button: `linear-gradient(135deg, #343A49 0%, #1E222C 100%)`

## Reuse map
- `santorini-hero.webp` is the single shared Santorini source for the left discovery hero and the center detail hero. Use CSS `object-fit: cover` and different `object-position`; do not duplicate the bitmap.
- `heart.svg`, `star.svg`, `arrow-right.svg`, and `chevron-left.svg` are reused across screens. Their circular/rounded substrates are UI shapes, not part of the SVG.
- The circular video play substrate and flight-carrier colored circles are UI shapes; only glyphs are files.## Publication map

- GitHub repository: `kiouoi996-commits/Repixel-Previews` (the repository README describes it as the public media repository for Repixel previews).
- Project folder: `images/caldera-journey-mobile`.
- Asset commit pinned for stable direct URLs: `d501c243fd47a6698e96a6e7c3a605201611175f`.
- All raster and SVG asset URLs below are commit-pinned; `manifest.json` and this analysis are uploaded in a later documentation commit.

- `santorini-hero.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/santorini-hero.webp
- `gallery-bougainvillea.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/gallery-bougainvillea.webp
- `gallery-caldera.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/gallery-caldera.webp
- `gallery-sunset.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/gallery-sunset.webp
- `gallery-blue-dome.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/gallery-blue-dome.webp
- `destination-dolomites.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/destination-dolomites.webp
- `destination-phuket.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/destination-phuket.webp
- `destination-barcelona.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/destination-barcelona.webp
- `hotel-caldera-view.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/hotel-caldera-view.webp
- `profile-avatar.webp` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/profile-avatar.webp
- `icons/brand-mark.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/brand-mark.svg
- `icons/search.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/search.svg
- `icons/filter-sliders.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/filter-sliders.svg
- `icons/mountains.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/mountains.svg
- `icons/beach-palm.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/beach-palm.svg
- `icons/city.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/city.svg
- `icons/chevron-left.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/chevron-left.svg
- `icons/arrow-right.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/arrow-right.svg
- `icons/route-arrow-right.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/route-arrow-right.svg
- `icons/heart.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/heart.svg
- `icons/calendar.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/calendar.svg
- `icons/star.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/star.svg
- `icons/photos.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/photos.svg
- `icons/map.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/map.svg
- `icons/reviews.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/reviews.svg
- `icons/play.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/play.svg
- `icons/flight-blue.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/flight-blue.svg
- `icons/flight-red.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/flight-red.svg
- `icons/flight-yellow.svg` — https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d501c243fd47a6698e96a6e7c3a605201611175f/images/caldera-journey-mobile/icons/flight-yellow.svg
