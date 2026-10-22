# ORBITAL and SWATCH — original flagship interactions

Two original, working components authored after reviewing the current Repixel catalog and website. They extend the existing collection with a procedural exploded product configurator and a local image-to-theme workbench. Visual references inform the restrained sage/ivory palette, broad rounded containers, light typography, capsules and material treatment. No supplied screenshot is presented as an original animation.

## ORBITAL — Exploded Product Studio

An orthographic projected three-dimensional speaker model is composed of an aluminium crown, full-range driver, acoustic chamber, signal board and weighted base. Rounded extruded polygons are projected, culled, shaded and depth-sorted into SVG. The driver, cavity, board traces, grille and feet are geometric details. The horizontal range rotates the object around its vertical axis between -50 and +50 degrees. Three finishes change the materials. The primary button separates and reassembles five parts through GSAP. Product selection can be consumed through the productchange event.

This is an original concept product and procedural SVG mesh; it does not claim to be a manufacturer's real product, acoustic simulation or supplied GLB file. Exact insertion can reuse the provided renderer or HTML. Adaptation to a different real product must retain that product's identity and host commerce actions.

Open animation:1200ms, GSAP power2.inOut. Finish:800ms, same ease. Finish interruption starts from the actual current blended color. Opening reverses from its current position. The draw state excludes GSAP's circular private cache before serialization. Do not serialize the tween target wholesale.

## SWATCH — Reference-to-UI Studio

Three curated image palettes and light/dark modes feed a complete live interface sample. An expanding circular reveal travels from the left edge of the sample. The token strip, image reference, selected state and contrast badge update from the same data. Copy CSS and the sample's Use this look button export the currently requested theme tokens. Export prefers navigator.clipboard.write with a text/plain ClipboardItem/Blob, then uses writeText when ClipboardItem is unavailable. Failed clipboard writes reveal a real selectable CSS textarea and do not claim success.

The image chooser and reference-panel drop zone accept PNG, JPEG and WebP up to10MiB. createImageBitmap resizes to64x64 for local Canvas2D color sampling. Alpha below150 is ignored, RGB channels quantize in32-value bins, each bin stores a count and channel means. Candidate bins favor non-extreme luminance and the square root of population weighted by saturation. A selected accent drives paired light/dark token sets. palette(view) chooses on-accent text and adjusts accent toward its opposite surface until contrast is at least4.5:1. The visible contrast badge uses ink against canvas and the actual WCAG relative-luminance formula. It describes those two colors only, not a full-page accessibility certification.

Preset colors are curated interpretations of the linked images; custom uploads use the actual extraction algorithm. Files remain browser-local, are represented by object URLs and are not sent to a service or added to this repository. Late image results are canceled by a monotonically increasing request id. Superseded object URLs are revoked after they are no longer in the current or pending transition.

Theme changes:1100ms, a linear GSAP progress clock with cubic ease-in-out applied by the scene. Circle center(0,240), final radius810 on the sample's642x480 local plane. Pending-last queue completes the current reveal then applies only the latest requested view. The normal component starts idle and reacts to input. Explicit ?demo=1 opts into the film fixture; interaction preserves the current scene and hands the clock to live GSAP motion. Reduced motion applies final states without animation. Native buttons, a range, focus outlines, polite status and error messages are provided. All mobile hit regions have at least44 CSS-pixel height at390px viewport width.

## Exact scene contract

studies.mjs exports CONFIG, layout(kind,narrow), fixture(seconds,kind), render(kind,state,atlas,photos,narrow), finishColor(state), palette(view), cssForView(view), extractTheme(pixels,name,photo), contrast(a,b), luminance(color), blend(a,b,p) and view(index,dark).

Kind is orbital or swatch. Always pass kind to fixture. render returns a complete SVG and reads no clock, randomness or global state. atlas is the parsed glyphs.json with exact Inter400/600 and Instrument Serif outlines. photos contains keys clay, moss and dusk from photos.json. For a custom upload, add its object URL under the key in theme.photo.

An orbital state has open [0,1], finishFrom/finishTo integer indices0..2, finishProgress [0,1] already eased, rotation degrees[-50,50]. Optional finishColorFrom contains a current interpolated color during interruption. Render uses it as the starting color. A swatch state has from and to view objects, progress[0,1] linear, and optional copied/extracting/dragging booleans. Each view is {theme,dark}; a theme has name, photo, light and dark token objects. For a settled view, from and to are identical, progress0. light/dark contain canvas, surface, accent, ink and muted; palette derives onAccent.

Browser code uses the same module inlined with the outline atlas. Buttons remain semantic HTML outside the decorative SVG. Download raw modules into the project before browser import: GitHub's raw text MIME is not a browser module host. The full HTML references include pinned GSAP3.13.0 inline with its original license header. Vendor README preserves the package's license link. Inter and Instrument Serif use their accompanying SIL OFL resources. No fonts or imagery are regenerated for an exact repeat.

Desktop plane:1080x810. At viewport width<=640, the explicit mobile planes are560x1160 and560x1350. layout gives the actual hit rectangles. The scene scales uniformly to width; mobile reflows instead of shrinking a desktop grid. Page scroll remains native, so these isolated components do not initialize Lenis or SplitType. Host pages may keep their own scroll/text orchestration.

## Reproduce previews

Node20+, Python3 with Pillow/fontTools, ffmpeg. Install @resvg/resvg-js2.6.2 using package.json. Run prepare-assets.py, build-glyphs.py and build-demos.py, then node render-video.mjs orbital and node render-video.mjs swatch. Data URIs in photos-raster.json are generated local renderer intermediates and are not distributed as application source. The supplied fonts and vendor sources are already in the kit.

Both videos are1080x810, 300frames, 30fps, ten seconds, silent H.264/yuv420p/faststart. ORBITAL opens during1..2.2sec, changes finish during4..4.8, closes during6.3..7.5 and restores its finish during8.2..9. SWATCH changes ClayLight -> MossLight -> DuskLight -> DuskDark -> ClayLight, with1100ms transitions at1,3.6,6.1,8sec. First/last source pixels match. ORBITAL's poster shows the separated state at3sec; SWATCH's poster shows frame zero. Visible geometry is deterministic; final encoded bytes depend on ffmpeg version.
