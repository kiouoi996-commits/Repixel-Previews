# Alpine Ride — 3D app preview

An authored eight-second, 1448 × 1086, 30fps film for the Repixel Apps card. One tall application screen remains centered on the original pale blue presentation background. Home → Catalog → board Detail → blue helmet Detail → goggles Detail → board Add to Cart → identical Home endpoint.

The film renders the three actual supplied GLBs with Three.js/React Three Fiber through Remotion ThreeCanvas. Yaw changes use the composition frame. The models retain their embedded PBR textures and normalized node rotations; the board includes two bindings. The white information sheet, mountain background and controls remain fixed during inspection. The boot stays a 2D asset. These are reconstructions, not manufacturer CAD.

## Reproduce

Requires Node.js and npm. Run `npm ci`, `node prepare-assets.mjs`, then `npm run studio`. Export with `npm run render`; use `--gl=swangle` on a CPU-only Linux renderer if appropriate. All individual immutable public asset URLs, byte counts and SHA-256 values are in asset-manifest.json. No Tripo key is needed. Fonts retain the included OFL license.

The video choreography is an automatic demonstration, not the normal application's navigation behavior. The standalone published prompt specifies the complete editable app and manual pointer/touch/keyboard rotation. The source GLBs and assets remain in their existing Repixel-Previews locations.
