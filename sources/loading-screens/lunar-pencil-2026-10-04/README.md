# Lunar illumination and causal pencil hatching — October 4, 2026

Two supplied 1254×1254 PNGs are still references. The animation mechanisms are authored for Repixel; original animation code, vectors, font identity and hidden artwork were not supplied.

170 Lunar Phase Sequence Loader keeps five discs, their crater textures, ellipsis dots and lettering fixed. One eight-second light clock changes spherical terminators. Initial phase offsets are 2.55, 1.35, 0, -1.35, -2.55 radians; progression subtracts the common phase. The visible central full-moon crop is reused as a fixed texture on all discs. Unseen full surfaces of the source outer moons are not claimed as recovered. Rays emphasize the central full phase, using its illuminated-phase envelope.

171 Pencil Hatch Loader generates twenty-six continuous back-and-forth passes. The pencil's real source nib pivot and the revealed ink prefix share one path lookup. No ink exists ahead of the nib. After drawing, the nib lifts, the completed stroke remains still, and ink/pencil fade before an invisible reset. The bar is reconstructed from measured native outline points, independently of its original touching pencil. Source sparks and baked hatch are excluded from moving art. Lettering, empty bar and black field remain stationary.

Both are illustrative indeterminate loaders, never measured percentages or minimum waiting periods. Working implementations must exit immediately when real host work resolves, rejects or is canceled, and respect reduced motion. Lunar lighting is decorative, not an ephemeris. A genuine host progress contract may drive the pencil prefix only if actual progress data exists; the gallery uses the explicit decorative clock.

## Reproduce

Use Python 3 with Pillow, numpy, contourpy and ffmpeg on PATH. Download the pinned prepared alpha/texture files and renderer into one folder. Run `python3 render-lunar-pencil.py --render 170` and `--render 171`. `--prepare` is optional and requires copies of the originally supplied PNGs named reference-1.png/reference-2.png. Those user file identities are recorded in attachments.json; they are not required to render from the published prepared package.

The parameter JSONs describe native coordinates, clips, texture mapping, formulas and exact phase timing. Rendering uses a 1254-unit stage, 2× antialiasing before 900×900 output, silent H.264/yuv420p faststart, 30 fps and 240 closed samples t=8*i/239. The component uses real elapsed seconds. Original source frames 0 and 239 match exactly. Contours are traced reproduction resources, not recovered original SVGs.
