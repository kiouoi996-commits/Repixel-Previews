# Matcha Latte Shop — reconstruction analysis

Source screenshot: **1448 × 1086 px**. All coordinates below are measurements/estimates from the raster screenshot, not guaranteed source-layout values.

## Screen structure
- **Left phone shell**: x=64px (4.42%), y=135px (12.43%), w=405px (27.97%), h=841px (77.44%).
- **Center phone shell**: x=502px (34.67%), y=73px (6.72%), w=406px (28.04%), h=900px (82.87%).
- **Right phone shell**: x=938px (64.78%), y=134px (12.34%), w=407px (28.11%), h=842px (77.53%).
- **Strawberry hero photo visible area**: x=80px (5.52%), y=309px (28.45%), w=374px (25.83%), h=294px (27.07%).
- **Classic detail hero photo visible area**: x=508px (35.08%), y=77px (7.09%), w=394px (27.21%), h=520px (47.88%).
- **Classic Popular Picks photo**: x=88px (6.08%), y=663px (61.05%), w=174px (12.02%), h=127px (11.69%).
- **Hojicha Popular Picks photo**: x=274px (18.92%), y=663px (61.05%), w=173px (11.95%), h=127px (11.69%).
- **Cart thumbnail — classic**: x=969px (66.92%), y=262px (24.13%), w=87px (6.01%), h=94px (8.66%).
- **Cart thumbnail — strawberry**: x=969px (66.92%), y=388px (35.73%), w=87px (6.01%), h=94px (8.66%).
- **Cart thumbnail — hojicha**: x=969px (66.92%), y=516px (47.51%), w=87px (6.01%), h=94px (8.66%).
- **Decorative leaf — left**: x=507px (35.01%), y=620px (57.09%), w=60px (4.14%), h=80px (7.37%).
- **Decorative leaf — right**: x=842px (58.15%), y=620px (57.09%), w=60px (4.14%), h=80px (7.37%).

## Raster assets

### strawberry-matcha-hero.webp
- Role: left-screen featured product photography. UI text, price pill, arrow button, card radius and clipping are not baked into the image.
- Visible reference box: ~374×294 px (1.27:1). The exported reconstruction is 1600×1200 (4:3) and is intended for `object-fit: cover; object-position: 58% 50%`.
- Main cup in the screenshot occupies roughly 46% of photo width and 83% of photo height; approximate margins: left 50%, right 4%, top 8%, bottom 9%. The cup is essentially complete; strawberries/stone can be clipped by the container.
- Own photographic background: pale sage-green environment, shallow-focus leaves, warm stone plinth and strawberries. Soft front/upper-left light; gentle contact shadow belongs to the photo.
- Reconstruction prompt: photorealistic iced strawberry matcha latte in a clear takeaway cup, pink strawberry-milk marbling at the lower half, vivid green matcha above, white whipped cream topped with red strawberry crumbs and one strawberry slice, cup positioned strongly to the right, a few strawberries on a light porous stone plinth, muted sage-green botanical background with shallow depth of field, soft daylight from upper left, natural low-contrast shadows, no UI text/buttons/badges, wide 4:3 framing.

### classic-matcha-hero.webp
- Role: center-screen product-detail hero; also reused for the left Popular Picks card, cart thumbnail and mini-cart thumbnail.
- Visible reference box: ~394×520 px (0.76:1) before the lower white scalloped UI overlay. Export: 1200×1500 (4:5), `object-fit: cover; object-position: 50% 46%`.
- Main cup occupies roughly 53% of visible width and 65% of visible height; margins ~21% left, 26% right, 19% top, 16% bottom. Cup is complete; the stone plinth is partially hidden by UI at the bottom.
- Own background: pale sage/cream bokeh, blurred leaves at left, neutral bowl at right, warm limestone plinth, green leaf near lower-right. Photo shadow remains in the raster.
- Reconstruction prompt: photorealistic classic iced matcha latte in a clear plastic cup, milk-white lower third with soft green matcha diffusion and vivid green upper portion, small ice pieces, tall swirl of white whipped cream dusted with fine matcha powder, centered front view with slight downward camera angle, light limestone plinth, pale sage and warm cream background with blurred leaves and a soft neutral bowl, shallow depth of field, soft daylight, no UI overlays, portrait 4:5 framing.

### hojicha-latte.webp
- Role: Hojicha product photo, reused in Popular Picks, cart thumbnail and mini-cart.
- Reference card photo: ~173×127 px. Export: 900×900; use `object-fit: cover; object-position: 50% 46%` for the 4:3 card and `cover` for square thumbnails.
- In the Popular Picks crop the cup occupies about 61% of width and ~89% of height; lower cup edge is visually cropped by the card/image boundary.
- Own background: warm beige, shallow-focus green leaves, clear cup with milk at bottom and tan-brown hojicha above, cream topping with brown roasted-tea crumbs.
- Reconstruction prompt: photorealistic iced hojicha latte in a clear takeaway cup, creamy white milk base with tan roasted-tea layer and natural downward streaks, white whipped cream topped with crunchy brown hojicha crumbs, centered cup, warm beige studio-botanical background with blurred green leaves, soft diffused daylight, no UI overlays, square framing designed to crop cleanly to 4:3.

### decor-leaf-left.svg / decor-leaf-right.svg
- Role: botanical flourishes flanking the Classic Matcha Latte title on the detail screen.
- Visible reference boxes: ~60×80 px each. Export: transparent vector SVG, viewBox 100×100. Render around 56–64 px square and position partially outside the text block.
- These are decorative botanical elements, not container backgrounds; keep the SVG background transparent and do not add a separate CSS shadow.

## Icon system
- SVG viewBox: 24×24; transparent background. Most icons use #0B2D20, round caps/joins, stroke width ~1.8/24 (7.5% of viewBox). The crown is filled; ticket uses #F3A45B with a pale dashed cut line.
- UI button circles, category-chip fills, count badges, pagination dots and rounded containers are intentionally not inside the SVG files.

## UI-only geometry / fills / effects
- Off-white screens/cards: approximately #FDFBF5 / #F8F5EA.
- Primary dark green surfaces: approximately #243927 to #2B4C30; the cart panel and bottom CTAs use this family.
- Accent peach: approximately #FECD90; promo-ticket orange: #F3A45B.
- Category chips: warm ivory around #F8F5EA; active `All` chip is dark green with white text.
- Center detail lower panel uses an organic/scalloped white mask; implement as CSS/SVG clip-path rather than baking into the photo.
- Device shell: ~7 px pale border, ~54 px radius, soft green-gray drop shadow. Card/button shadows are UI effects, not raster shadows.
- Product photo corner rounding is container clipping. Keep source photos rectangular; use CSS radius on their containers.
- Outer presentation background is best reproduced with layered CSS gradients/circles; see `ui-tokens.css`.

## Reconstruction status
The supplied files are reconstructions from the screenshot, not the original design-source assets. Hidden/occluded photo areas and tiny brand printing were reconstructed approximately.