# Original Repixel studies — October 22, 2026

Two original interactive studies: CHROMA — Iris Palette and FIELDNOTES — Pull-Out Project Index.

The two HTML documents are the live interaction references. Open them from an HTTP server, and use HTTPS for Clipboard API success. Normal mode waits for input. `?demo=1` runs the explicitly labelled ten-second demonstration; any selection or copy action exits it. Reduced motion disables the demonstration and swaps states directly.

`studies.mjs` is a dependency-free SVG scene module shared by the live HTML and the offline video renderer. `glyphs.json` contains outlines derived from the exact OFL fonts in `asset-origins.json`. The two font licences accompany these outlines. Reusing the module and outlines preserves the exact geometry and lettering while semantic HTML buttons provide input and accessibility. The prose prompts also describe the geometry for a native implementation.

## Rebuild the reference

Install the packages declared in `package.json`. The asset preparation and glyph builder require Pillow and fontTools. Run:

1. `python prepare-assets.py`
2. `python build-glyphs.py`
3. `python build-demos.py`
4. Create the `qa` directory.
5. `node render-video.mjs chroma`
6. `node render-video.mjs fieldnotes`

The renderer requires FFmpeg and produces 1080 × 810, 30 fps, 300-frame, silent H.264/yuv420p faststart MP4s. Each frame samples the same geometry and state function as the live demo. First and last source pixels match. Render reports record exact byte hashes. Codec output can vary with FFmpeg versions; the scene is deterministic.

The gallery photographs reuse the existing generated replacement photographs from the Sedona study, pinned at their original commit; there is no new claim of photographic authorship or location verification. The colours, typography composition, sleeve and aperture mechanics are original to these studies. The ten-second autoplay belongs only to the explicit preview; user-facing integrations respond to input.

No API keys, service accounts, tracking, login, purchase or audio are required. The main site and all existing prompts are outside the scope of these studies.
