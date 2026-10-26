# Repixel cursor studies — reference redesign

Four pointer interactions, revised October 26, 2026. Existing card IDs and live URLs remain stable. ELASTIC uses a 1440 × 810 light panel with yellow magnetic cursor outlines; SILK now uses a white triangle and same-shape echoes; FIELD uses a solid black canvas without its main headline; LENS uses charcoal, cream typography, a yellow-edged reveal mask and sunlit chair photography.

Keep all four HTML files, core.mjs, interactive.mjs, glyphs.json, assets.json and both font license notices together. Serve through HTTP. The live examples and offline renderer share geometry and state integration. Geometry includes actual Inter 400 and 900 weights for the reference redesign plus the earlier licensed Inter/Cormorant outlines. Preserve both SIL Open Font License notices.

The photo manifest pins three existing generated Sedona photographs and one newly generated sunlit chair image to immutable public URLs with byte lengths and SHA-256. FIELD uses the first three; LENS uses the fourth.

Run `node tools/cursor-studies/create-pages.mjs` to rebuild HTML. For offline footage use Node.js 22+, sharp and ffmpeg, then run `node tools/cursor-studies/render.mjs /absolute/output-directory`. Portable render.mjs also works beside core.mjs. Optional `--only=188` renders one study. The renderer produces eight-second silent H.264/faststart video and WebP posters; ELASTIC is 16:9 and the other scenes are 4:3.

Preview gestures include unequal durations, curved aimed transfers, acceleration, braking, short corrections, target hovers and exact pauses. Every frame is rendered from real state; no endpoint frame is replaced to fake a seamless loop. The state settles before the repeat. Live pages follow the actual pointer.

Motion starts only on fine hover input when preferences permit it. Reduced-motion users start with a static composition and can explicitly enable this demonstration temporarily. Pause, cancellation, blur, visibility and resize restore native pointer behavior. Real links and keyboard focus remain functional. Settled or hidden examples stop drawing. Triangular echoes disappear within 550 ms; photo stamps disappear within 1.25 seconds. Large input jumps cannot create an idle emission backlog.

Publish new media under versioned paths in Repixel-Previews and verify exact bytes before updating cards. Rebuild their English specifications using build-cards.mjs with the verified publication manifest, then run scripts/build-animations.mjs and the normal project checks.
