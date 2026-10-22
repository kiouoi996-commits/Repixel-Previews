# Reference-inspired original interactions

Two new coded interactions for Repixel: KITE — Elastic Week Planner and MOSS — Glass Trail Selector. These are original compositions and authored motions, visually inspired by five supplied static references. They are not claims about those references' original behavior or font identities.

KITE takes the pale grey-sage canvas, acidic yellow-green, black/white contrast, oversized rounded bento cards, concave corner cut-out, slender sans headings and elongated day capsules from the project dashboard reference. Its moving selected capsule coordinates the capacity bar, daily rows, focus number and graph.

MOSS combines the landscape and translucent sage panels of the notes reference, the suspended glass controls of the furniture reference, aerial route annotation from the golf course reference and separate statistics from the golf dashboard reference. Its original generated landscape has no UI baked into it. Curves and distances are illustrative fixture data, not real geographic navigation. The chosen Inter 400/600 is a visual interpretation, not a confirmed font identification.

## Normative scene contract

`studies.mjs` exports CONFIG, layout(kind,narrow), fixture(seconds,kind), render(kind,state,atlas,photos,narrow,saved). Kind is kite or moss. State contains from/to integer selection indices and progress in [0,1]. The atlas is glyphs.json. The photos object for moss MUST have both landscape and frostedLandscape keys from photos.json. For kite it may be empty. The final boolean is saved status for the active route. render returns the entire SVG. It is pure: no clock, network, randomness or hidden global state.

The exact typography is Inter outline geometry in glyphs.json, so both raster render and live browser use identical advances and shapes. Interactive buttons and announcements remain semantic HTML over the decorative SVG. Atlas paths represent typography, not an embedded bitmap. Download the module into the project before importing it; GitHub raw URLs serve text/plain and should not be used as browser module imports.

Desktop: 1080 by 810. At viewport width <=640, use a separate 560 by 1190 (kite) or 560 by 1120 (moss) coordinate plane. Scale the complete plane uniformly to container width. Do not distort or shrink the desktop grid into a mobile column.

The glass source is the provided prefiltered background registered to the exact same object-fit cover frame as the sharp landscape. Its blur was rasterized once from the original landscape through SVG Gaussian blur at 14 units on a 1080 by 810 frame. Both asset files are normative; do not blur the already blurred asset again. Clip the frosted landscape to each rounded glass panel, then apply the documented tint/gradient/border. This avoids platform-specific backdrop blur differences in the exact version.

Browser examples are kite.html and moss.html. Normal mode waits for input. ?demo=1 is an explicit opt-in demo, stops when the user interacts and is disabled under reduced motion. No subscription, account, analytics, persistence or backend is added. Route saves are per-route component-session state. Next day cycles the five fixture days. Arrow-key, Home/End, rapid pending-last selection, responsive layout, reduced motion, error announcement and teardown are implemented in build-demos.py.

## Reproduce the videos

Node 20+, Python 3 with Pillow and fontTools, ffmpeg on PATH. Run npm install, python3 prepare-assets.py, python3 build-glyphs.py, python3 build-demos.py. Then run node render-video.mjs kite and node render-video.mjs moss. Rasterization uses @resvg/resvg-js 2.6.2 and no host fonts. Source PNG frames are fed directly to ffmpeg, H.264 CRF18, preset slow, yuv420p, no audio, faststart. Exact encoded MP4 bytes depend on ffmpeg version; normative visible states come from the pure scene function.

Each clip is 300 frames at 30fps, ten seconds, cues at 1,4,7 seconds, each 1100ms. Kite selects Mon -> Wed -> Fri -> Mon. Moss selects Ridge -> Valley -> Lake -> Ridge. Source first/last pixels are equal. Posters are lossless-geometry WebP exports of frame zero. Screenshots/PNGs and photos-raster.json are generated scratch intermediates, never source repository assets.

The natural background was generated using the built-in ImageGen tool. Prompt: "An original wide 4:3 atmospheric editorial aerial photograph of rolling Icelandic moss-green hills, a winding narrow cream footpath through the right half of a valley, small dark teal tarn at upper right, distant blue-grey mountains under overcast mist. Slightly oblique drone camera, lush textured grass and dark forest-green folds, soft diffuse evening light, moss and olive green, muted petrol-blue sky confined to top 15 percent, darker left third for glass UI, brighter ridge through middle/lower right. No UI, text, logos, people, buildings, vehicles, labels, markers or frame."

Inter is distributed under the accompanying SIL Open Font License. Do not regenerate the landscape or substitute a system font when matching the supplied preview.
