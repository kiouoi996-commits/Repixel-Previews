# Causal loading mechanisms — October 5, 2026

Three supplied 1254-by-1254 PNGs are still references. Motion is authored for Repixel. Original animation code, vectors, font identity and hidden art were not supplied. Prepared alpha artwork and traced contours preserve visible source geometry; attachments.json records original file identities and hashes.

172 uses eleven individually outlined green pixel cells. Eight discrete upward rows complete each cell in left-to-right acknowledgment order; prior cells retain their fill. Only the newly completed cell flashes briefly. The original eight baked fills were separated from the connected stationary border. Both pixel labels and the stepped border remain fixed. Filled layers fade before their invisible reset.

173 separates a sleeping snail, rounded empty bar, snore marks and three Z glyphs. The largest connected bar outline preserves both original round end caps. The shell radius and foot contact have zero warp weight; only the soft head/body breathes. Z glyphs rise and fade before their phase wraps. Diagonal white stripes move within a fixed rounded extent and never imply a measured fraction. The character does not crawl.

174 links lever depression/release to a parabolic bread ejection through the slot. Bread is clipped behind the stationary toaster front, with registered speckle texture and a true pivot. Each of eight ejection apices commits exactly one tile; prior tiles remain filled. Unseen empty/filled states reuse source patches. The first five empty templates are resized to their filled slot dimensions so outlines do not intersect. Rays emphasize the raised pose and velocity marks appear only during ascent. Filled patches and crumbs fade before an invisible batch reset.

These previews are decorative fixtures. Working implementations must follow actual host pending/ready/error/cancel state and exit immediately when work ends. The preview clock never fabricates synchronization acknowledgments, completed host items, progress, baking time or food temperature. If a real acknowledgment/completion contract exists, preserve it as the authority for discrete counts. Respect reduced motion and expose one meaningful accessible host status.

## Reproduce

Use Python 3 with Pillow, numpy, scipy, contourpy and ffmpeg on PATH. Download the pinned renderer and prepared WebP layers into one folder. Run `python3 render-loaders.py --render 172`, `--render 173`, or `--render 174`. Prepared packages are sufficient. Optional `--prepare` requires the original supplied PNGs named reference-1.png, reference-2.png and reference-3.png.

Parameter JSONs specify native boxes, clips, formulas and timing. Artwork alpha extraction normalizes source RGB by its maximum channel, with a cleaned matte from `(maximum-8)*255/247` above threshold 16. Contours trace the alpha threshold and are reproduction assets, not original vectors. Colored bread/crumb layers remain WebP to preserve texture and color.

The renderer uses a 1254-unit stage and 2x supersampling before silent 900-by-900 H.264/yuv420p faststart output at 30 fps. Pixel and snail previews have 240 samples across eight seconds; the toaster has 300 across ten seconds. Closed sampling is `t=duration*frameIndex/(frameCount-1)`. A component uses actual elapsed seconds. Initial and final source pixels match. Rendering checks stationary typography, protected shell/contact samples, the toaster front and acknowledgment ordering. MP4s are visual acceptance references, not operational timers.
