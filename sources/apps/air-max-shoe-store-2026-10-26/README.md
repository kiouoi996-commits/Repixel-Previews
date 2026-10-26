# Air Max — Sneaker Collection

An authored 2.5D reconstruction of a supplied three-view sneaker-shopping design. Catalog, Product and Air Max Series are successive states of one420×860 app viewport. Source code and original photo/font identities are unconfirmed. Inter is an explicitly disclosed visual typeface match. Photography is newly generated, not official product photography.

## Run

Serve `shoe-app.html` from any static HTTP server. The same document is published at https://repixel.pro/demos/air-max-shoe-store/ . `?app` removes the comparison frame and presentation shadow. Individual images, SVGs and Inter/OFL load from immutable public URLs. Verified GSAP code is embedded with its license header intact; raw GitHub JavaScript is a reproducibility resource, not an executable cross-origin script URL.

The catalog shows Pulse $160, React Infinity $140, KD16 $170 and Pegasus40 $130. The collection shows Pulse $160,270 $150 and97 $170. Large cards open a persistent shoe actor. The dark card expands, the shoe moves/scales, individual title words move from one line into two, the price relocates and the round arrow expands into Add to Cart. The reverse lands in the actual originating tile. Detail swipes follow the pointer, settle or cancel, and cycle the three Air Max products; auxiliary product views use the same composition. The product photographs are2D alpha layers; no real3D model or unseen-axis rotation is claimed.

Add to Cart adds one actual local unit and returns to the corresponding collection/catalog card. The collection + controls add one. The initial cart is empty. The film reaches the observed badge2 by one Pulse add followed by one Pulse quick-add. `shoeApp.reference('series',0,true)` is an explicit comparison fixture with two Pulse units; normal navigation never fabricates a remote cart.

The Step Faster banner has a separate macro heel and concrete layer. Its expansion aligns the air chamber, changes the clipping window, mixes the registered shoe images locally, and reveals the product controls. Back reverses the same route into the banner. Search, categories, saved filtering, per-product hearts and a local basket are functional authored extensions. Training has a truthful empty state. Basket totals use integer cents. Continue emits `sneakers:checkout-request` with actual items, quantities, unitCents and totalCents. It does not place an order or take payment. No reviews, ratings, nutritional/product-performance claims, sizes or unseen inventory are invented.

## Assets

Built-in ImageGen produced six independent shoe cutouts, one matching heel macro and one dark concrete plinth. All eight WebPs preserve their generated PNG alpha channels byte-for-byte. `asset-generation.json` records the prompt set and stable filenames. Thirteen matching SVGs distinguish the collection chevron from the product's full back arrow. Inter-variable.woff covers weights100–900 and optical sizes14–32; the supplied OFL accompanies it. Fonts and the unchanged GSAP distribution reuse existing immutable Repixel-Previews resources. `production-assets.json` records paths, URLs, dimensions, byte lengths and SHA-256 values.

## Render

Save the exported HTML as `index.html` beside `serve.cjs` and `render.cjs`. Install Playwright and its Chromium browser. Run `node render.cjs`; optionally set `CHROMIUM_EXECUTABLE_PATH`. The renderer waits for images/fonts, invokes the same pure pose/render functions used by live transitions, and captures420 PNGs at30fps on a1536×1024 canvas. Optional `RENDER_START_FRAME`/`RENDER_END_FRAME` can rebuild a checked contiguous segment while retaining an existing first source PNG.

Encode: `ffmpeg -framerate 30 -i frames/frame-%04d.png -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -an -movflags +faststart air-max-shoe-store.mp4`.

The14-second film shows Catalog→Pulse→270→97→Pulse→Add→Series→quick-add/badge2→banner expansion→Pulse→reverse banner→Catalog. One app view is visible at a time. Motion, extended product detail states and utility panels are authored. The final twelve source PNGs reuse the first idle source PNG; decoded lossy H.264 endpoints are not claimed equal.

Verification exercised genuine pointer cancellation/commit/reversal, keyboard wraparound, per-shoe saves, unit prices,320/470/310/160 dollar basket calculations, removal and checkout payload, banner reversal, reopening four different products without stale title/price/image layers, search/focus restoration, truthful empty categories, all three routes at390×844 and360×780, reduced motion and zero browser errors. Every new public resource is anonymously fetched and compared by bytes/SHA-256 before catalog publication.
