# Alpine Ride — natural touch preview, V2

An authored 14-second mobile-app walkthrough at 1448 × 1086 and 30 fps. The app geometry, photography, font, palette and three supplied GLBs are retained. The sequence uses real route pushes and pops instead of cutting directly between product IDs.

Home → tap the catalog arrow → tap Alpine Pro → drag to the rear and back → Back → tap Trail Helmet → drag → Back → tap Polar Goggles → drag and return → favorite → Add to Cart → Back with cart count 4 → edge-back gesture → the same Home state.

A subtle touch indicator appears only during contact. Its movement follows the recorded drag trajectory. Hermite curves keep angular position and velocity continuous through the release, followed by a short inertial settle and a pause. The information panel stays fixed while each actual GLB changes pose. Product choices always pass through the catalog. The final Home hold matches the first Home state; the animation is a preview-only authored demonstration, not automatic navigation required in a working shop.

## Reproduce

Run `npm ci`, `node prepare-assets.mjs`, then `npm run studio`. Run `npm run render` to export. The tested Linux renderer used `--gl=swangle`; an installed Chrome Headless Shell can be selected with `--browser-executable`. All 41 immutable source resources, exact byte counts and SHA-256 values are in asset-manifest.json. The three genuine models contain their PBR textures; no Tripo account or generation request is needed. Retain the font's OFL license.
