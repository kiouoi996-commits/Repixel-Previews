# Plant Explorer — wide blue preview, version 2

This presentation replaces the original portrait catalog film. It uses exactly the same `model.mjs`, `scene.mjs`, source artwork and eight-second navigation fixture. The five live app files remain unchanged. The sky-blue presentation canvas is not part of the mobile application's layout.

The output is 1440×810 (16:9), 30 fps, 240 frames and 8 seconds. There is one stationary app screen: the complete 390×820 logical scene is rendered at 0.9 scale, producing a 351×738 screen centered at x544.5, y36. Its outer corners have a 32px radius. A light blue gradient, quiet organic shapes inspired by the supplied reference and a subtle stationary shadow surround it. No extra screens, device bezel, captions or camera movements appear. The poster uses the same full composition at the first Home state.

## Reproduce

Obtain the original twelve text sources from the immutable release at `e42e3181aab5a6ad0593920ea35ed6aa0ae8ccb1`, directory `sources/apps/plant-explorer-2026-10-23/` in the public `kiouoi996-commits/Repixel-Previews` repository. The source specification lists their complete URLs and SHA-256 hashes. Put this README and `render-wide-v2.mjs` beside those sources. The original `render.mjs` and `README.md` describe the earlier portrait output; use the commands here for the current catalog composition.

Use Node22+, Sharp (the pinned package.json provides the dependency), Python3 and FFmpeg. Run `npm install`, then `python download-assets.py` to download and verify the original artwork and complete Inter font files. On Linux set `FONTCONFIG_FILE` to the absolute path of `fonts.conf`. Run `node check.mjs`, `node render-wide-v2.mjs --stills`, then `node render-wide-v2.mjs`. If Sharp is already installed elsewhere, set `SHARP_MODULE` to its module entry. As in the original renderer, WebP resources become in-memory PNG solely for librsvg compatibility; no live app source embeds raster payloads.

Outputs are `preview-wide-v2.webp`, seven PNG checkpoints in `qa/wide-v2/`, and `plant-explorer-wide-v2.mp4`. The video is silent H.264/yuv420p with faststart. The renderer verifies centered, fully visible app geometry and equal first/last source PNG bytes. This does not assert lossless decoded H.264 frame identity. The timeline and touch cues remain Home → Monstera detail → add → Home → My Plants (3 of 5) → remove (2 of 5) → Home. No background or screen position animates independently of an application action.
