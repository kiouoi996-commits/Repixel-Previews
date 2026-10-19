# Sakura Voyage — visual asset inventory (reconstructed from 941×1672 screenshot)

Source screenshot is a raster composite, not an original design file. Dimensions and colors are estimates measured against the screenshot. Photography files are extracted and retouched from visible screenshot regions, not independently generated original photographs. Upscaling ×3 improves physical pixel dimensions but cannot restore detail absent in the screenshot. Decorative illustrations and icons are original vector approximations. This is a provisional reference pack, not a pixel-identical original asset export.

## Layer split
- UI text stays HTML: Sakura Voyage logo wordmark, nav, JAPAN, Think Japan Think Again, Iconic Destinations, section body text, cards titles/descriptions, Seasons, Touch the Spring, Our Routes, CTAs, footer addresses.
- Borders, rounded pills, season timeline circles, arrows button backgrounds, translucent labels, card shadows, section separator lines: CSS.
- The hero image includes the woman/parasol in front of the giant JAPAN text, but text behind MUST be an independent HTML layer. The silhouette asset has a hand-traced alpha approximation; some letter fragments may remain.
- Main source image x0..940, y0..1671. All coordinates inclusive/exclusive [x0,y0,x1,y1].

## Main areas
1. Hero: x0-941 y0-558, W100%, H33.4%. Hero visual collage / sky, Fuji peak upper-middle, Kyoto Tower at x150-210 y220-450, pagoda x519-668 y291-498, kimono woman+umbrella x276-499 y81-493. Sakura branch ornaments x0-125 y160-270, top-right x811-941 y80-225, dense foreground blossoms y417-504. Large lettering x224-776 y103-382 is HTML. Decorative first-screen depth requires independent z-indexes.
2. Destination feature: x52-324 y573-858, W28.9%, H17.0% of whole screenshot, portrait gate image. Border and rounded corners from CSS.
3. Destination cards: x347-474 x485-615 x627-752 x763-890, y683-815. Image area approx 128×132px. Captions underneath are HTML.
4. Experience cards: x253-485 and x488-675, y884-1070. Labels at bottom inside are UI overlay, removed approximately.
5. Route tile stack: castle x341-441 y1269-1369; street x408-524 y1321-1408; ramen x371-474 y1412-1496; torii x418-540 y1481-1583. Tile borders are CSS.
6. Background footer landscape x0-941 y1100-1672 should be redrawn/recreated as custom illustration, because it is occluded by multiple large text blocks and cannot be reconstructed accurately through extraction alone.

## Color estimates
BG #30183f; sky #4b295a; mid plum #63366c; sakura pink #e2a9d7; warm highlighted pink #ffd2ef; text #f6e7f7; dark branches #1f112a. Radial/vertical background CSS samples only, NOT exact design tokens.

## Fonts
Screenshot uses contrasting high-contrast editorial serif for large headings, sans serif for navigation and captions, and handwritten brush/script for accent typography. Exact typefaces cannot be verified from raster alone; keep them as live text and identify fonts separately before claiming a match.
