# MCP Bridge — Connected AI Agents Dashboard

Reconstructed assets separated from UI based on one 1446×1088 raster screenshot. This is not the source design.

- `icons/logo-*.svg`: transparent service glyphs; **do not add rounded-square gradient backgrounds inside these SVGs**. Use `.mcp-logo-tile` and per-service CSS in `styles.css`.
- `icons/brand-mcp-bridge.svg`: transparent native-gradient M logomark. The words **MCP Bridge** remain live HTML text.
- Other `icons/*.svg`: transparent interface icons drawn with `currentColor`. SVG loaded via `<img>` does not inherit CSS `color`, so either use inline SVG, CSS mask-image, or filter where needed.
- `avatar-olivia-parker.webp`: a circularly masked, source-faithful 50px screenshot crop exported at 150×150 pixels, transparent outside circle. The photo detail cannot be recovered from the 50px screenshot.
- `styles.css`: approximate UI backgrounds, button states, gradients, status badges, circular backdrops and layout example.
- `manifest.json`: screen-space bounds and percentage measurements, source status, per-file SHA-256, use and CSS rules.

All dimensional/color measurements are estimates from the screenshot; `object-fit: contain` for SVG glyphs, `object-fit: cover` for the avatar. CSS creates all card/drop shadows and geometric button backdrops. The icon set uses no decorative OS status bar assets.
