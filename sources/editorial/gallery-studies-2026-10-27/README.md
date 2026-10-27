# Approved gallery blocks

Paper Garden and Object Index were first generated as complete visual designs using the user's requested reference-to-screen workflow, then approved before implementation. Approved reference exports, independent gallery images, fonts and their licenses are listed in assets.json. Private Drive style references are not distributed.

Paper Garden retains exact visible artwork windows for Orange stem and Quiet leaves. Four additional prints complete the six-item collection. Object Index uses a generated clean four-cell product atlas preserving the approved subject designs, then exact quarter extraction. No gallery controls or captions are baked into these item images. Opaque studio photo edges are feathered within a 2.5% perimeter at runtime, over the matching colored surface; object silhouettes and contact shadows remain inside that perimeter.

The normal examples are idle until input. Native previous/next controls, click-to-focus images, touch drag, Arrow keys, Home/End, reduced motion and the optional four-thumbnail control all update the same selected item. Preview replay is opt-in. The Canvas is a visual renderer with semantic HTML controls and a text alternative for the image sequence; do not use the entire approved screenshot as an uninteractive component.

The same scene module renders live examples and all video source frames. Recordings are 1280×720, 30fps, 300 frames, ten seconds, silent H.264/yuv420p with faststart. Raw first/last source frames match. The pointer path has pauses and eased curved transfers.

To record again, install @napi-rs/canvas and sharp in the authoring environment, place render.mjs under tools/gallery-studies with scene.mjs and assets.json at their documented public paths, then run node tools/gallery-studies/render.mjs OUTPUT_FOLDER. It downloads missing pinned assets and verifies all bytes before rendering. CODEX_PRIMARY_RUNTIME_NODE_MODULES is supported when present.
