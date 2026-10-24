# Brewly catalog film — reference proportions

The corrected film uses a 1448×1086 canvas matching the supplied board, a single 430×870 app viewport at 496×1004 displayed pixels, and the reference dark charcoal background. The old blue 1440×810 composition and compressed 430×800 outer viewport are superseded. Text, cards and icons keep their original proportions; they are not vertically stretched. A 430×800 internal content layer begins 60 px below the top of the tall viewport, leaving the original top spacing while omitting all fake OS/status icons. The single presentation mask has 50 px native corner radius; it does not introduce device hardware.

The background is an ImageGen edit of the exact user-selected source image, with both reference phones removed. It is an opaque presentation plate only, not part of the live app or product photography.

film-scene-v 2.html loads the same four independent photographic reconstructions, nineteen SVGs and complete matched Inter font weights from immutable URLs. It is an authored comparison scene, not recovered original application code or a complete commerce backend.

The eight-second 30 fps timeline remains Home → product → Oat → quantity two → Add ($11.80) → Home → favorite on/off → Home. For reproduction, serve the HTML over local HTTP, open a 1448×1086 viewport at deviceScaleFactor 1, await window.ready and render window.renderAt(frame/30), frames 0–239. Hold the initial PNG for frames 222–239 to avoid compositor antialiasing differences at the seam. Encode silent H.264/yuv 420p with faststart. The final source PNG matches frame zero exactly; decoded H.264 equality is not claimed.
