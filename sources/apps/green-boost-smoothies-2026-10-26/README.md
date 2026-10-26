# Green Boost — Fresh Drinks

An authored, single-screen-at-a-time comparison app for the supplied smoothie design. The source app is not available. The layout and controls are reconstructed from visible pixels; photography is newly generated. Poppins is a visual match, not a verified original font identity.

## Run the app

Open `green-boost-app.html` through any local static HTTP server. It loads immutable public image, SVG and Poppins URLs. The verified GSAP distribution is embedded as executable text, with its license header intact: raw GitHub JavaScript cannot be relied on as a browser script because of its response MIME type. Add `?app` for the borderless mobile viewport. The same document is served at https://repixel.pro/demos/green-boost-smoothies/ . The mint canvas and rounded outer frame are presentation only.

Get Started opens the four-drink catalog. Tap a tile to expand its cup into Detail. Drag the hero left/right, use ArrowLeft/ArrowRight in the focused hero, or focus the Previous/Next controls to switch drinks. A short drag cancels; reversing direction uses the other adjacent drink. The four names and $5.00 unit prices come from the visible catalog. Other variants' detail states are authored extensions.

Save state is per drink. Quantity is 1–99 and resets on a product change. Add to Cart and tile + buttons update an in-memory basket. Basket totals use integer cents. Continue emits `fresh-drinks:checkout-request` with actual items and totalCents; it does not place an order or take payment. Profile emits `fresh-drinks:profile-request`. Bowls/Snacks have truthful empty states. No unseen products, reviews, nutritional claims or user accounts are fabricated.

## Asset production

The built-in ImageGen tool produced four independent cup PNGs, eight independent ingredient PNGs and one opaque mint background. Green/strawberry extraction passes kept the cup and removed only surrounding backdrop material. Final WebP conversion preserves each of the twelve alpha channels byte-for-byte. The transparent RGB preview can show a colored fringe where alpha is zero; compositing on white verified that these pixels are invisible.

`asset-generation.md` records the prompt set and stable filenames. All final asset URLs, dimensions, byte lengths and SHA-256 values are in `production-assets.json`. Twenty vectors comprise seventeen matching UI glyphs and three independently animated wave layers. Poppins Regular/Medium/SemiBold/Bold and OFL are supplied. Fonts and the original GSAP distribution retain immutable public URLs; the verified GSAP bytes from the previous Sculpt publication are embedded in the HTML so the live demo does not execute a raw-GitHub script URL.

## Reproduce the preview

Save this HTML as `index.html` beside `serve.cjs` and `render.cjs`. Install Playwright (`npm install playwright`) and its Chromium browser. Run `node render.cjs`, optionally setting `CHROMIUM_EXECUTABLE_PATH` to an installed compatible Chromium binary. The renderer waits for images/fonts and captures 360 deterministic 1448×1086 PNGs at 30 fps. It seeks the same GSAP scene used by the live app; no prerecorded board is used.

Encode with FFmpeg: `ffmpeg -framerate 30 -i frames/frame-%04d.png -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -an -movflags +faststart green-boost-smoothies.mp4`. The film lasts 12 seconds and shows Welcome → Catalog → Green Boost → Strawberry Smoothie → Mango Bliss → Berry Mix → Green Boost → add feedback → Welcome. These motions are authored, not recovered original behavior. Final six source frames reuse the first idle PNG; lossless source endpoints are identical. H.264 decoded endpoints need not be identical.

The interaction checks exercised shared-cup routes, genuine pointer drags and cancellation/reversal, keyboard cycling, saved filters, quantities, removal, checkout payload, empty categories, reduced motion and all three routes at 390×844 and 360×780. Public assets were anonymously downloaded, decoded where applicable, and checked by byte length and SHA-256.
