# VELORA typography studies — 30 September 2026

Three newly authored motions for the real RETURN / WILD heading in velora.zip from the selected Drive folder. Source provenance and source-file hashes are in source-provenance.json. The original source supplies text, Inter 700 metrics, tracking and the white/gray gradient; it does not contain these three motions.

Each preview is 1080×608, 30 fps, 180 frames, silent H.264. The first and last uncompressed frames are pixel identical. Background #050505. The SVG has no background and glyph holes are transparent.

These files form a flat Remotion project. Download the folder without changing file names, run npm install, then npm run dev. Composition IDs: Velora-contour, Velora-hinge, Velora-glass. Render with npx remotion render index.ts Velora-contour out/contour.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --image-format=png --concurrency=1 --disallow-parallel-encoding. Inter paths are already embedded in geometry.json, so render does not depend on Google Fonts requests. The static Inter 700 WOFF and OFL live under fonts/text-effects/velora-2026-09-30/.

Effects.tsx is the frame-based rendering reference. Repixel's Apply prompts describe integration into an existing heading with its own text, font and paint; Recreate prompts describe this isolated demo. The six-second loop is for the gallery video, not a compulsory infinite animation for a production heading.
