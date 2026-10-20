# Forno Pizza Delivery — detailed screenshot asset reconstruction

Source: **1536 × 1024 pixels**. Rectangles, background colors and object percentages are **image-derived estimates**, not source Figma/CSS specifications.

- **8** distinct raster reconstructions; 2 photographs with their own backgrounds and 6 PNG alpha cutouts.
- **17** vector SVG icons, 24 × 24 viewBox, no baked circles/rectangles; browser CSS controls selected states.
- The same Margherita/Pepperoni assets are reused on home and cart screens. No 9:41, Wi-Fi or battery in assets.

## Exact asset mapping

| Asset | Screen(s): approximate bounding rect (x1,y1,x2,y2), px | Output px | Ratio | Alpha | Subject occupancy / margins % | Fit | Repo |
|---|---|---|---|---|---|---|---|
| `pizza-margherita.png` | home: [95, 631, 267, 800]; cart: [1064, 210, 1177, 325] | 534×528 | 534:528 | yes | 98.9% × 97.7%; L0.0 T2.3 R1.1 B0.0 | `contain` | published to GitHub |
| `pizza-pepperoni.png` | home: [302, 628, 480, 802]; cart: [1065, 361, 1178, 478] | 567×552 | 567:552 | yes | 94.7% × 97.3%; L3.2 T2.7 R2.1 B0.0 | `contain` | published to GitHub |
| `ingredient-tomato.png` | product_detail: [588, 691, 683, 769] | 330×327 | 330:327 | yes | 83.9% × 76.5%; L7.6 T4.0 R8.5 B19.6 | `contain` | published to GitHub |
| `ingredient-mozzarella.png` | product_detail: [718, 691, 824, 779] | 357×339 | 357:339 | yes | 86.6% × 85.8%; L8.4 T6.2 R5.0 B8.0 | `contain` | published to GitHub |
| `ingredient-basil.png` | product_detail: [849, 683, 960, 772] | 372×357 | 372:357 | yes | 91.4% × 75.1%; L5.1 T12.0 R3.5 B12.9 | `contain` | published to GitHub |
| `drink-cola.png` | cart: [1083, 521, 1156, 623] | 267×345 | 267:345 | yes | 72.3% × 89.0%; L12.7 T3.8 R15.0 B7.2 | `contain` | published to GitHub |
| `hero-margherita.webp` | product_detail: [562, 88, 974, 533] | 1236×1335 | 1236:1335 | no | 83.3% × 82.8%; L9.7 T14.2 R7.0 B3.0 | `cover` | published to GitHub |
| `promo-pizza-slice.webp` | home: [80, 370, 490, 554] | 1230×552 | 1230:552 | no | 50.0% × 100.0%; L50.0 T0.0 R0.0 B0.0 | `cover` | published to GitHub |
| `icons/menu-grid.svg` | home: [95, 123, 117, 147] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/menu-grid.svg |
| `icons/search.svg` | home: [449, 130, 470, 150] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/search.svg |
| `icons/arrow-back.svg` | product_detail: [585, 150, 606, 170]; cart: [1070, 137, 1092, 158] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/arrow-back.svg |
| `icons/arrow-right.svg` | home: [227, 503, 245, 521] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/arrow-right.svg |
| `icons/heart.svg` | home: [243, 636, 267, 662]; home: [453, 635, 477, 661]; home: [222, 919, 250, 946]; product_detail: [928, 147, 955, 174] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/heart.svg |
| `icons/home.svg` | home: [124, 920, 149, 944] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/home.svg |
| `icons/bag.svg` | home: [320, 918, 347, 945] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/bag.svg |
| `icons/user.svg` | home: [421, 918, 447, 947] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/user.svg |
| `icons/plus.svg` | home: [228, 813, 252, 838]; product_detail: [666, 888, 692, 914]; cart: [1412, 285, 1434, 308] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/plus.svg |
| `icons/minus.svg` | product_detail: [597, 891, 624, 913]; cart: [1342, 291, 1365, 307] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/minus.svg |
| `icons/trash.svg` | cart: [1414, 132, 1438, 161] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/trash.svg |
| `icons/tag.svg` | cart: [1073, 668, 1097, 693] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/tag.svg |
| `icons/pizza.svg` | home: [105, 269, 137, 303] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/pizza.svg |
| `icons/burger.svg` | home: [190, 272, 224, 309] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/burger.svg |
| `icons/pasta.svg` | home: [276, 273, 309, 306] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/pasta.svg |
| `icons/salad.svg` | home: [360, 272, 393, 306] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/salad.svg |
| `icons/drinks.svg` | home: [447, 268, 473, 305] | 24×24 | 1:1 | yes | drawn within 24×24 SVG | `contain` | verified https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/icons/drinks.svg |

## Backgrounds and UI effects

| Element | Suggested CSS / color, estimated |
|---|---|
| screen_bg | `#F7F3ED` |
| card_bg | `#FFFCF9` |
| category_selected | `#FFD5B3` |
| brown | `#89482E` |
| banner_base | `#A9573B` |
| sage | `#71866B` |
| warm_shadow | `rgba(66,45,29,0.10)` |
| muted_text | `#898783` |
| black | `#171614` |
| gradient screen | `linear-gradient(160deg,#F6F0E9 0%,#FCF9F5 54%,#F6F1EA 100%)` |
| gradient banner | `linear-gradient(110deg,#A55239 0%,#AE603D 55%,#BC6A40 100%)` |
| gradient checkout | `linear-gradient(105deg,#72866A 0%,#71856B 100%)` |

### UI-only elements
- Screen rounded corners ~49 px; white near-translucent cards; soft warm brown outer shadows.
- Category buttons ~77–82×96 px with ~21 px radius; active peach behind pizza icon; other states white.
- Banner wrapper ~410×184 px, ~25 px border radius, `overflow:hidden`; warm gradient is reconstructed into photo and must not be duplicated by CSS on top.
- Price typography and hero title remain live serif text, no baked words or prices in photos.
- Background ingredient cards ~114×108 px, pale #f5f2ec, corners ~19 px; photographs use `contain`.
- Navigation pill ~420×70 px at bottom of home screen. Text and quantity numbers always browser-rendered.
- Photo/cutout shadows are within assets; avoid extra CSS shadow on food assets unless comparing visually at runtime.

### Limitations
- Raster images are **reconstructions extracted from the supplied screenshot**, not original photographs or eight independent photographic source generations.
- Main product scene uses inpainting to remove top back/heart buttons and OS status icons. Banner left side color is reconstructed to remove title and CTA.
- PNG alpha edges are estimated from one low-resolution composite; fine shadows and mozzarella edges are approximate.
- Files are upscaled 3× by interpolation, not new high-frequency photographic detail.
- Icon URLs point to commit-locked GitHub media; eight raster files are available in GitHub media..

### GitHub public reference
https://github.com/kiouoi996-commits/Repixel-Previews/tree/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery
https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/f6b29a173d432588ebb9510819f361423d109c68/images/forno-pizza-delivery/manifest.json