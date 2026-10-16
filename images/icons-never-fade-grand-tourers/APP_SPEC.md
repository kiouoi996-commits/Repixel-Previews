# Repixel assembly notes

Reconstruct three 427–431px-wide mobile cards at 1448×1086 reference viewport. Use `manifest.json` for measured image regions, icon locations and backgrounds. Display each SVG with `currentColor`; draw circle buttons as CSS layers. The Mercedes and DB5 WebPs contain real alpha transparency and contact shadows; neither should receive an additional CSS drop shadow. Preserve right clipping in hero and auction. Images are reconstructed lookalikes, not exact originals.

At deployment, serve files from the verified, commit-pinned `raw.githubusercontent.com` URLs supplied with this release; do not embed the screenshot as a background. All editorial copy, auction data, year bar and page indicators must be native text/UI.

## Production image base (commit pinned)

`https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/900befecf5a1cd567ac5f69bdfe995e3066f0e20/images/icons-never-fade-grand-tourers/`

Use `manifest.json` asset entries and their `url` values directly in the application; do not use branch-relative media URLs.
