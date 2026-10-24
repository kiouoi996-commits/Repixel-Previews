# Brewly scene geometry and export plan

Reference screen is **1448 × 1086 px** containing two presentation devices. All locations below are approximate screenshot-derived bounding boxes, not recovered Figma properties.

## Standalone photo requirements

| Scene | x, y, width, height in original px | x, y, width, height as % of 1448×1086 | Subject left/top/width/height inside frame | 3× target px | Fit/position |
|---|---|---|---|---|---|
| caramel-latte-featured.webp | 215, 326, 443, 301 | 14.8%, 30%, 30.6%, 27.7% | 50.1%, 13%, 36.1%, 82.4% | 1329×903 | cover / 54% 50% |
| caramel-latte-detail.webp | 731, 35, 485, 515 | 50.5%, 3.2%, 33.5%, 47.4% | 28%, 18.4%, 50.1%, 67.8% | 1455×1545 | cover / 50% 27% |
| cold-brew.webp | 215, 662, 215, 200 | 14.8%, 61%, 14.8%, 18.4% | 44.7%, 44%, 56.3%, 59.5% | 645×600 | cover / 72% 56% |
| roasted-coffee-beans.webp | 443, 662, 216, 200 | 30.6%, 61%, 14.9%, 18.4% | 26.4%, 33.5%, 74.5%, 62.5% | 648×600 | cover / 67% 57% |

## Visual reconstruction specs
### caramel-latte-featured.webp

Glass on right, amber café background; whipped cream, caramel, beans; empty darker left for text.

Do not draw overlay text, navigation, pills, favorites, labels, buttons, borders, status bar, watermark, pricing or fake transparency inside scene.

### caramel-latte-detail.webp

Large central faceted latte glass, caramel topping; dramatic warm backlight, roasted beans; fade to near-black at bottom.

Do not draw overlay text, navigation, pills, favorites, labels, buttons, borders, status bar, watermark, pricing or fake transparency inside scene.

### cold-brew.webp

Iced black cold brew glass low-right, clipped bottom; dark teal background; decorative teal arcs via CSS, not in photo.

Do not draw overlay text, navigation, pills, favorites, labels, buttons, borders, status bar, watermark, pricing or fake transparency inside scene.

### roasted-coffee-beans.webp

Diagonal wooden scoop of glossy roasted beans with warm gold bokeh; clipped right.

Do not draw overlay text, navigation, pills, favorites, labels, buttons, borders, status bar, watermark, pricing or fake transparency inside scene.

## Interface implemented in CSS

- Base canvas: `#030405`. Main panels: `#191C1F`. Text: `#F7F7F8`, secondary `#A7A9AD`. Accent yellow `#FFD326`. Colors are visual estimates.
- Hero and mini cards have ~23–24 px corner radii; clip raster using `overflow:hidden`. Do not bake round corners in photos.
- Product photo uses a CSS bottom fade `linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(0,0,0,.65) 77%, #030405 100%)`, separate from photo.
- Featured card adds independent left-to-right text readability dark overlay; dark teal curved decoration on Cold Brew mini-card drawn as CSS pseudo-elements if desired.
- Border `rgba(255,255,255,0.10)`, shadows, selected chips, nav, cart and CTA are pure HTML/CSS/SVG. System bar is native/system, not an asset.
- Icon file shape is `24×24`, `viewBox=0 0 24 24`, transparent, `currentColor`. The yellow active color and white-cart pill state are CSS styling.

## Verification status

19 individually authored SVG icons and four provisional vector studies are committed; **no compliant photoreal photo assets** are committed. Two image generation attempts returned composite sheets; these were rejected rather than cut into final assets.

Hidden content, exact photo source, EXIF/focal lengths and exact typography are not knowable from a screenshot. Any image generation should be marked a visual reconstruction.
