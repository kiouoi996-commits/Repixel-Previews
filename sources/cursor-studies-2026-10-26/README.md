# Original cursor studies

Four authored pointer interactions, published October 26, 2026. Live examples and video rendering share `core.mjs`, outline geometry and state integration.

Keep each HTML file, `core.mjs`, `interactive.mjs`, `glyphs.json`, `assets.json` and both font licenses in one directory. Serve through HTTP; opening ES modules from a file URL is not supported. Images reuse three verified existing assets from Repixel-Previews, with immutable URLs, byte lengths and SHA-256 in `assets.json`.

For offline video rendering, place the published `render.mjs` in the same directory. It also supports its original location under `tools/cursor-studies/` in the Repixel repository. Use Node.js 22+, the `sharp` package and an installed `ffmpeg` command. Run `node render.mjs /absolute/output-directory`. Optional `--only=188` renders one study. The default output is intended for a scratch directory. It fetches and verifies the source photographs, creates 240 source frames per study at 30 fps, and produces silent H.264 MP4 with faststart plus WebP posters. No browser automation is needed for the renderer.

The live page starts with a static composition. Pointer input activates the effect only when fine hover input and motion preferences permit it. When reduced motion is requested, an explicit “Enable preview motion” action allows a temporary opt-in for this demonstration; it does not change the browser or operating system setting. Pause/resume, visibility, blur, cancellation and resize restore native pointer behavior. The two controls in the magnetic example are genuine keyboard-accessible anchors.

Numbers 186–189: magnetic outline morph; continuous tapered ribbon; distance-triggered photo stamps; aligned image-and-typography reveal mask. Photo trail spacing is 78 scene pixels with at most six stamps and 1.25-second lifetimes. Gallery footage is a scripted gesture, while live pages respond to the real pointer.

Inter and Cormorant Garamond outline geometry is derived from existing project font resources. Preserve the included SIL Open Font License notices when redistributing the geometry. Photographs are existing generated Repixel assets, not newly claimed reference photography.
