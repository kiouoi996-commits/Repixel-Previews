# Classic — Porsche 911 3D

An editable classic-car mobile app and a reproducible 14-second catalog film. Both use the same `ClassicApp` and the same continuously mounted Three.js renderer. Home and Detail are states of one application, with a real camera orbit, shared title/year, changing background and an overlapping information sheet.

## Run the app

Use Node.js 20 or newer. Run `npm ci`, `node scripts/fetch-assets.mjs`, then `npm run dev`. Open the Vite address printed by the command. The ready GLB is downloaded by checksum; there is no Tripo account, API key or new generation requirement.

`src/live.ts` mounts the app. `src/app-core.ts` owns navigation, drag/touch/keyboard manipulation, four camera presets, saved cars, local storage, menu, search, photo collection and a truthful local enquiry draft. It does not send messages or perform financial actions.

The red and black coupe images are supporting 2D collection photographs. The silver Porsche 911 is the provided 3D vehicle. Missing vehicle records are not fabricated.

## Render the catalog film

Run `npm run studio` to inspect `ClassicPorsche`, or `npm run render` to export the silent H.264 MP4. `src/Root.tsx` registers a 1448×1086 composition, 30fps, 420 frames. `src/timeline.ts` defines authored touch choreography and feeds the exact same scene used by the app. Film state is isolated from live local storage. It is not a recording of an original application or a requirement to autoplay a user's app.

In constrained Linux environments, the optional `runtime-net.cjs` shim supplies a loopback interface only when Node's interface enumeration fails. Set `NODE_OPTIONS=--require=./runtime-net.cjs` if needed. A local Chrome Headless Shell path can be supplied with Remotion's `--browser-executable` option.

The first and last uncompressed frames match exactly. H.264 is lossy; equality of decoded endpoint pixels is not implied. The MP4 is silent and has its `moov` atom before `mdat` for progressive playback.

## Assets and provenance

`published-assets.json` maps app paths to immutable public URLs. `asset-integrity.json` records lengths and SHA-256 values. All referenced files were fetched anonymously and verified. `scripts/fetch-assets.mjs` recreates the local `public/` tree without a generation service.

The model was generated with Tripo v3.1 from four reconstructed image views. The multiview-image task used 10 credits and the textured model task used 60. `model-manifest.json` records task identifiers, source/web checksums, 56,125 triangles, 37,754 vertices, texture dimensions and unchanged geometry-buffer hashes. The browser export uses embedded 2K WebP PBR maps and `EXT_texture_webp`; it has no Draco or Meshopt dependency. The original export retains 4K maps and has been preserved separately for the owner.

The browser GLB already has its orientation root applied: up +Y, forward +Z. Do not rotate it by another -90 degrees. Runtime computes a world-space bounding box and fits it uniformly to a 4.4-unit display length; these are presentation units, not certified manufacturer dimensions.

This is an image-based reconstructed car, not manufacturer CAD. The GLB is one combined mesh/material; wheels, badges and the interior are not separately controllable parts. Fine lettering, windows and hidden surfaces are reconstructed. Original application code and original font identities were unavailable; fonts are visual matches and their licenses are included through verified URLs.

The live app's document background follows its current route. The film alone uses an outer neutral presentation canvas, one rounded screen and a shadow. Operating-system bars and device framing are excluded from the app.

## Build the standalone example

Run `npm run build:demo`. It writes `out/classic-porsche-demo.html` containing the app logic and CSS with immutable external model/image/font resources. No raster payloads or credentials are embedded. Three.js's bundled loader contains generic support for data URIs; the actual app media always use pinned HTTPS URLs.
