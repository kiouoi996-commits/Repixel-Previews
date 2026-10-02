# Lumiere Warm Lighting Shop — screenshot analysis

**Source raster:** 1448×1086 px. Every coordinate and percentage below is an estimate read from the screenshot; it is not an original design-spec value.

## Screen 1 — Home / catalog
The visible phone body is roughly x=56–465, y=72–977. The main photographic hero occupies about x=76–450, y=231–470 (374×239 px, 25.83%×22.01% of the full screenshot). The headline, subheadline, CTA pill and chevron are UI overlays and are not baked into `hero-mushroom-room.webp`. The lamp is right-of-center and fully visible; the room, frame and plant are naturally cropped by the image container.

Category tiles occupy roughly 81×80 px each and use a pale warm-gray UI fill. Their lamp/vase imagery is therefore exported as transparent PNG cutouts. The card/tile background, radius and any container shadow stay in CSS/UI. Featured image regions are about 176×143 px and use photographic backgrounds; the circular favorite button is UI and the heart is a separate SVG.

Bottom cart-preview thumbnails are small crops of product photography; the count/price/arrow pill is entirely UI.

## Screen 2 — Product detail
The main photo is roughly x=511–904, y=91–497 (393×406 px; 27.14%×37.38% of the screenshot). Back, favorite and `1/4` controls are UI overlays and are excluded from the clean reconstructed photo. The lamp takes about 59% of the image width and 60% of the image height, with more environment visible on the right than on the left.

Four gallery thumbnails sit below at about 77–79×76 px each. The selected border on the first thumbnail is UI and not part of the bitmap. Product name, price, body copy and spec labels remain text. The spec pictograms (warm-light sun, layers/ceramic, bolt/E27 and height) are separate 24×24 SVGs.

The recommendation images begin around y≈884. The screenshot clips the lower portion of this section, so any off-screen lower content is not treated as known source content.

## Screen 3 — Cart
The three item images are approximately 108×113–114 px at x≈971. Product names, material labels, prices, quantity controls and trash buttons are UI. The promo-code row uses a separate tag SVG and chevron-right SVG. Subtotal/shipping/tax/total are text. The checkout button uses the same dark violet CTA treatment as the detail page.

## Icon geometry
All supplied UI icons use a 24×24 `viewBox` and transparent background. Most are outline icons around 1.6–2.0 px stroke with round caps/joins; `heart-filled.svg` is the filled active favorite state. Button circles, pills, badges and quantity-control backgrounds are intentionally excluded from the SVG files.

Approximate screenshot sizes: search/filter 18–22 px; bell and bag 20–24 px; back/chevron 10–18 px; hearts 15–18 px inside ~32–40 px circular UI buttons; trash 16–18 px; spec pictograms 15–18 px; +/- 12–14 px.

## UI-only visual tokens
- App surface: `#FAFAFB` (approx.)
- Category tile: `#F5F4F3` (approx.)
- Primary text: `#171721`; secondary: `#8A898D`
- Icon: `#1F2038`; badge/active heart: `#3B3654`
- CTA: `linear-gradient(135deg, #4B476D 0%, #2F2A44 100%)`
- Search/bordered controls: near-white with `#ECECEF–#F0F0F2` border and very soft violet-gray shadow
- Phone/device shadow: approximately `0 20px 50px rgba(60,52,45,.14)`

## Reconstruction / QA note
The raster deliverables are reconstructions from the screenshot. The image-generation tool did not expose a reliable standalone-per-asset generation mode in this run and repeatedly produced an asset-board composition; the final clean files were exported as separate standalone images from that reconstruction, using unobstructed screenshot crops for the cart thumbnails. Transparent category PNGs were checked on light and dark backgrounds for a real alpha channel.