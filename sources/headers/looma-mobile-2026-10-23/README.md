# Looma dedicated mobile headers

Classic Mobile and Large Search Mobile are the final two standalone designs from the supplied header board, distinct from the desktop cards' compact fallbacks. Original code, confirmed font identity and hidden interactions were not supplied. The mobile controls, panels, sample catalog artwork and motion are authored editable reconstructions. Manrope Regular/SemiBold is the supplied visual match. The reference crops are comparison evidence only, never flattened runtime headers. No phone bezel or status bar is added.

## Reproduction

Use Node 22+, install the adjacent package.json and put FFmpeg on PATH. Download the pinned Manrope files below into fonts/. Set FONTCONFIG_FILE to the absolute path of fonts.conf on Linux. Run node check.mjs. Run node render.mjs classic-mobile --stills, then node render.mjs classic-mobile; repeat for large-search-mobile. SHARP_MODULE can select an existing Sharp module entry. The videos are 780×1280, H.264/yuv420p, 30fps, 360frames, 12seconds, faststart and silent. First and last source PNG bytes match exactly; lossy H.264 decoding is not claimed to be pixel-identical. Serve this directory over HTTP to run either HTML example; fonts and GSAP are pinned remote resources. Place the five live source files together. Sources use no embedded raster payloads.

## Composition and state

The comparison canvas is390×640. The white header begins16,44, width358, radius26. Classic is80high and contains hamburger, house/wordmark, search and bag. Large Search is140high; its upper row uses hamburger, house/wordmark, heart and bag, with an independent search field32,120,326×48 below. It has no category dropdown. At320–430px real parent widths, layout remeasures instead of shrinking a desktop strip. There is also a compact305px accommodation for desktop scrollbar space in a320px iframe. Header targets are at least44CSSpixels and do not overlap in the tested widths.

Both menus expose all seven sample destinations. A selection updates the sample collection label and URL fragment. Classic discloses its search input; Large Search keeps its native field visible. Queries trim/case-normalize and normalize lamps/vases/shelves. Up to four actual results are keyboard reachable; ArrowUp from no highlight selects the last visible result, Enter opens its detail and focuses Add to bag. Empty results are explicit. Large Search's heart shows saved pieces; transferring the sample lamp confirms Added to bag.

The initial fixture bag contains a vase and shelf:2items/$166. Adding a lamp produces3/$214, increasing it produces4/$262, removal restores2/$166. All totals derive from line quantities, including other cart pages. Removal, empty state, quantity changes and paging work. This is an identified local fixture, not a live commerce backend.

## Motion

Disclosure opacity and an8px upward settle open over260ms with power3.out and close over180ms. The menu's three strokes morph into a close glyph using the same reveal progress. A confirmed cart edit settles bag scale1.10→1 over380ms; the badge uses real quantities. Keep brand, header and input geometry stationary. New actions interrupt overlapping tweens; focus returns to a visible trigger. Closed controls leave interaction and accessibility trees. Reduced motion completes state changes immediately and disables replay. Native actions work without GSAP. An explicit Play preview button runs the12second comparison; normal examples start idle.

Classic timeline: menu0.8s, Lighting2.0, search3.1, lamp typing3.65, detail5.1, add6.25, bag7.35, remove8.6, close9.6, menu10.2, Shop10.9. Large Search: focus0.8, vase typing1.2, close3.0, saved4.1, transfer5.3, bag6.5, remove7.8, close8.8, clear query9.3, menu9.7, close10.4. Both settle to the initial visible state before the endpoint. Taps, typing and data edits are confined to this opt-in fixture timeline.

## Verification

Model checks cover query/empty/highlight/product state, routes, cart arithmetic/removal/empty/paging/reset, all seven links,305/320/360/390/430px geometry,44px targets, panel bounds and all360timeline samples. Browser QA covered actual menu selection, native query and ArrowUp/Down/Enter, detail action focus, cart add/remove/quantity, Escape/focus return, saved transfer and320/390px frames. SVG source stills and representative panels were visually inspected.

## Shared pinned resources

- manrope-400.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-400.ttf
- manrope-600.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-600.ttf
- LICENSE-manrope.txt: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/LICENSE-manrope.txt
- gsap.min.js: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/gsap.min.js
- logo.svg: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/logo.svg
- icons.svg: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/icons.svg

Retain the font OFL and existing vector/GSAP notices. The source crop NOTICE records reconstruction provenance.
