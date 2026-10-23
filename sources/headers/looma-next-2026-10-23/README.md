# Looma headers 4–6

Authored reconstructions of the supplied split navigation, floating and transparent-over-hero stills. Original source code and hidden motion were not supplied. The first three published headers are preserved: this batch has its own derived base.mjs and implementation directory. Manrope 400/600 is a visual font match. The room background was restored with the built-in image generator from the supplied hero crop: baked-in UI and the rounded outer border were removed and obscured top artwork was reconstructed. It is not recovered original artwork. Navigation and text are separate native controls/vector geometry.

## Reproduction

Use Node 22+, npm install using the adjacent package.json, and FFmpeg on PATH. Download the pinned fonts below into fonts/ and the pinned room background into media/room-hero.webp. Set FONTCONFIG_FILE to the absolute fonts.conf path on Linux. Run node check.mjs. Run node render.mjs split --stills and node render.mjs split; repeat for floating and transparent. SHARP_MODULE optionally selects an already installed Sharp module. The renderer converts the WebP background to an in-memory PNG only for librsvg compatibility; the full public image remains WebP. Output is 1152×648, H.264/yuv420p, 30 fps, 360 frames, 12 seconds, faststart, no audio. First and last source PNGs match byte-for-byte; H.264 decoding is lossy.

## Behavior

Split navigation keeps the logo/dividers fixed. Selections within one group move for 320 ms; moving between groups crossfades two local capsules over 260 ms rather than sweeping under the logo. Its CTA selects New In. Floating observes actual document scroll, pins near the top and compacts from 1328×116 to1216×88 over logical scroll132..272, with a height-derived pill radius rather than an ellipse. Transparent pins at top24 and increases the same surface opacity from0.66 to0.98 over logical scroll180..380; the illustration stays behind the editable header. Returning upward restores both states. Input panels open260ms/close180ms. Automatic replay is opt-in; reduced motion retains functionality.

The shared sample catalog/cart/orders are fixtures, not authenticated commerce. Every example starts with a vase and shelf: 2 items, $166. Adding a $48 lamp yields3/$214. Header utilities differ faithfully: split/floating have search, saved pieces, account and CTA; transparent has five navigation links plus search/saved/account/bag and no CTA. Compact menus preserve available actions; dedicated mobile reference cards remain separate work.

Browser QA: real floating scroll pin and height change, CTA route/content, search in the pinned layer, transparent opacity change and restoration, cart total and Escape, split cross-group selection/CTA, 320px compact CTA and390px five-item transparent menu. Model checks cover routes, CTA, search results, totals/reset, handoff grouping, scroll geometry, control bounds and all360 timeline samples per mode. Source SVG/HTML contains no embedded media payload. Live source parity is recorded in the catalog.

## Resources

Room background: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/57a76e761faf29cedb3f498b2a046b9f6f12e98e/sources/headers/looma-next-2026-10-23/assets/room-hero.webp

- manrope-400.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-400.ttf
- manrope-600.ttf: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/manrope-600.ttf
- LICENSE-manrope.txt: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/51da09d7a0660996e82c8339d81715365efaac2b/sources/headers/looma-2026-10-23/assets/LICENSE-manrope.txt

The HTML files reference the unmodified pinned GSAP3.13.0 runtime with its original notice. See the font OFL and the asset NOTICE for provenance. Live pages use the remote image/font resources; source crops are evidence only.
