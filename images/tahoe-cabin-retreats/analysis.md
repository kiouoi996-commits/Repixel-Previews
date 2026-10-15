# Tahoe Cabin Retreats: screenshot reference analysis

Source screenshot: 1448 x 1086 px. Coordinates refer to raster screenshot, not guaranteed original layout.

## Screen segmentation

Home screen approximated at x=61..489, y=92..1021: avatar, four category photos and two featured cards. Detail screen x=523..928, y=85..1020: one hero photograph plus a row of four thumbnails (first reuses hero). Search x=963..1387, y=92..1021: three property photographs.

## Source regions / occupancy

| Asset | Screenshot bbox (x1,y1,x2,y2) | Screenshot (x%,y%,w%,h%) | Estimated object margins (left/top/right/bottom %) | Export px |
|---|---|---|---|---|
| avatar-guest.webp | [410, 143, 459, 192] | [28.31, 13.17, 3.38, 4.51] | {'left': 29, 'top': 5, 'right': 28, 'bottom': 1} | [147, 147] |
| category-cabins.webp | [108, 382, 171, 440] | [7.46, 35.17, 4.35, 5.34] | {'left': 11, 'top': 9, 'right': 8, 'bottom': 5} | [189, 174] |
| category-lakeside.webp | [210, 382, 274, 440] | [14.5, 35.17, 4.42, 5.34] | {'left': 0, 'top': 4, 'right': 0, 'bottom': 0} | [192, 174] |
| category-mountain.webp | [314, 382, 383, 440] | [21.69, 35.17, 4.77, 5.34] | {'left': 14, 'top': 2, 'right': 3, 'bottom': 2} | [207, 174] |
| category-forest.webp | [414, 382, 479, 440] | [28.59, 35.17, 4.49, 5.34] | {'left': 0, 'top': 0, 'right': 0, 'bottom': 0} | [195, 174] |
| featured-pine-ridge.webp | [87, 553, 294, 781] | [6.01, 50.92, 14.3, 20.99] | {'left': 8, 'top': 8, 'right': 12, 'bottom': 7} | [621, 684] |
| featured-meadow-house.webp | [310, 553, 487, 781] | [21.41, 50.92, 12.22, 20.99] | {'left': 18, 'top': 34, 'right': 9, 'bottom': 6} | [531, 684] |
| hero-pine-ridge.webp | [524, 84, 927, 591] | [36.19, 7.73, 27.83, 46.69] | {'left': 0, 'top': 13, 'right': 30, 'bottom': 9} | [1209, 1521] |
| gallery-living.webp | [637, 606, 720, 689] | [43.99, 55.8, 5.73, 7.64] | {'left': 12, 'top': 24, 'right': 7, 'bottom': 11} | [249, 249] |
| gallery-bedroom.webp | [731, 606, 814, 689] | [50.48, 55.8, 5.73, 7.64] | {'left': 16, 'top': 49, 'right': 14, 'bottom': 5} | [249, 249] |
| gallery-lake-view.webp | [825, 606, 909, 689] | [56.98, 55.8, 5.8, 7.64] | {'left': 0, 'top': 22, 'right': 0, 'bottom': 0} | [252, 249] |
| cedar-lake-house.webp | [989, 311, 1359, 456] | [68.3, 28.64, 25.55, 13.35] | {'left': 7, 'top': 14, 'right': 33, 'bottom': 9} | [1110, 435] |
| willow-cabin-bedroom.webp | [989, 538, 1359, 681] | [68.3, 49.54, 25.55, 13.17] | {'left': 17, 'top': 50, 'right': 21, 'bottom': 0} | [1110, 429] |
| summit-retreat.webp | [989, 759, 1359, 865] | [68.3, 69.89, 25.55, 9.76] | {'left': 17, 'top': 6, 'right': 12, 'bottom': 4} | [1110, 318] |
| icons/arrow-left.svg | vector | vector | vector | [24, 24] |
| icons/search.svg | vector | vector | vector | [24, 24] |
| icons/heart.svg | vector | vector | vector | [24, 24] |
| icons/sliders.svg | vector | vector | vector | [24, 24] |
| icons/map-fold.svg | vector | vector | vector | [24, 24] |
| icons/close.svg | vector | vector | vector | [24, 24] |
| icons/chevron-down.svg | vector | vector | vector | [24, 24] |
| icons/map-pin.svg | vector | vector | vector | [24, 24] |
| icons/star-filled.svg | vector | vector | vector | [24, 24] |
| icons/bed-double.svg | vector | vector | vector | [24, 24] |
| icons/users.svg | vector | vector | vector | [24, 24] |
| icons/shower.svg | vector | vector | vector | [24, 24] |
| icons/pine-tree.svg | vector | vector | vector | [24, 24] |
| icons/home.svg | vector | vector | vector | [24, 24] |
| icons/home-filled.svg | vector | vector | vector | [24, 24] |
| icons/user-round.svg | vector | vector | vector | [24, 24] |

## Background and interface-only effects

{
  "background": "linear-gradient(180deg,#F2F3F0 0%,#E7E9E2 100%)",
  "phone_fill": "#FCFCFB",
  "nav_fill": "#35382F",
  "soft_surface": "#F4F4F2",
  "accent_sage": "#909982",
  "text": "#292B27",
  "subtitle": "#90918E",
  "main_device_radius_approx_px": 54,
  "image_cover": "object-fit:cover;object-position:center center",
  "hero_overlay_gradient": "linear-gradient(180deg,rgba(10,12,10,0) 56%,rgba(10,12,10,.53) 100%)",
  "phone_shadow": "0 18px 48px rgba(37,42,31,.09)",
  "filter_background": "#535B4B",
  "button_circle_background": "rgba(255,255,255,.87)",
  "featured_border_radius": "22px",
  "result_image_border_radius": "18px"
}

Photos are reference-based inpainted/upscaled screenshot crops; the original source files were not available. Repeated images are reused; icons contain no button backgrounds. UI labels, controls and drop-shadows belong in CSS.
