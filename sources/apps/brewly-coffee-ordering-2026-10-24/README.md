# Brewly catalog film

Authored comparison scene for a prompt catalog; the original source is a two-screen still, not original application code or motion.

The film is 1440×810, 30 fps, 240 frames, eight seconds. One 430×800 system-free app screen is shown at 90% on a flat #78B5EC blue canvas. The corner mask and blue background are catalog presentation only. Home → product → Oat → quantity two → Add ($11.80) → Home → favorite on/off → initial Home.

film-scene.html loads four separate opaque ImageGen photographic reconstructions, nineteen supplied SVG glyphs and matched complete Inter font weights from immutable public URLs. It contains a deterministic renderAt(seconds) for the film and real local handlers for the actions shown. Other destinations are placeholders for host handlers; this scene is not a complete commerce backend. The standalone English implementation specification is the product contract.

To reproduce, serve film-scene.html over local HTTP, install Playwright and Chromium, open it at 1440×810/deviceScaleFactor 1, await window.ready, then call window.renderAt(frame/30) before each PNG capture, frames 0–239. At 7.4–8 seconds the initial Home is held: reuse the original idle frame for this final hold to ensure an exact source-frame loop despite compositor antialiasing changes. Encode silent H.264/yuv420p at 30 fps with faststart. Use frame zero for the lossless WebP poster.

The source PNGs for the final hold and endpoint are pixel-identical. H.264 is lossy; decoded endpoint identity is not claimed. Generated photographs and the font family are reconstructions/matches, not source-verified original assets.
