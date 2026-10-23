# Looma header references — first three variants

Authored vector reconstruction of three desktop headers from the supplied still. The motion, product drawings, sample catalog, hidden panels and responsive fallback are newly authored. Manrope 400/600 is visually matched, not a confirmed original typeface. Reference crops never act as runtime backgrounds.

The three HTML files, core.mjs and live.mjs are also published unchanged in Repixel under public/headers/looma-2026-10-23/. They start idle and react to real controls. Play preview is a deliberate, optional fixture replay; there is no automatic navigation, typing or cart update in the functioning header. Reduced motion turns off this replay and completes state changes immediately.

## Reproduce the media

Use Node 22 or newer and npm install with the adjacent package.json. Save the two pinned TTF files below into an assets directory next to fonts.conf. Use FONTCONFIG_FILE set to the absolute fonts.conf path when running the renderer on Linux. Run node check.mjs, then node render.mjs classic --stills and node render.mjs classic; repeat for search and minimal. FFmpeg must be on PATH. Output is written into media/; stills into qa/.

The renderer calls the same core.mjs geometry and pure fixture timeline as the live preview. Output: 1152×648, 30 fps, H.264/yuv420p, faststart, no audio. Classic and search: 360 frames / 12 seconds. Minimal: 300 frames / 10 seconds. First and last source PNGs are byte-identical; this does not claim lossless H.264 decoding. The final encoded frame samples the exact closed endpoint.

## Functional sample data

Classic and large search start with one Sunrise Vase ($38) and one Orbit Shelf ($128): quantity 2, subtotal $166. Adding Arc Table Lamp ($48) produces quantity 3 and $214; another increases quantity 4 and subtotal $262. Removing the lamp returns quantity 2 and $166. Minimal starts with an empty bag and no badge, as in its still. Search and category matching operate on six local products. Suggestions show the first four matches; keyboard focus cycles only visible suggestions. More than three distinct bag products can be paged without hiding their contribution to the subtotal. The example has no checkout or authentication backend.

## Verification

Model checks cover search/category matching, an empty result, keyboard selection, product details, cart arithmetic, removal, pagination, reset, all sampled loop frames and control bounds. Browser QA covered catalog navigation, saved piece transfer, cart increase/removal, Escape and focus return, category mismatch, ArrowDown/Enter product selection, Minimal active state, and narrow layouts at 320/390 CSS pixels. The working site should integrate its own real router, catalog, cart, account and saved-product flows. The exact, adapt and animation-only requirements are independently authored Markdown, not source listings.

## Font and library resources

- manrope-400.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-400.ttf
- manrope-600.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-600.ttf
- LICENSE-manrope.txt: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/LICENSE-manrope.txt
- NOTICE.txt: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/NOTICE.txt

GSAP is the unmodified pinned 3.13.0 runtime; its license URL and notice remain at the top of the file. Manrope has the supplied OFL text. The logo asset contains editable wordmark text: inline it with the delivered font, or build the wordmark as native text beside the house geometry. Do not rasterize a full header.
