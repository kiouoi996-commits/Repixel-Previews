# Four Loading Screens — 4 October 2026

Four user-supplied square 1254×1254 stills form the visual basis. Native geometry, palette, alpha layers and visible lettering derive from those stills; all motion is newly authored. Original code, fonts, loading lifecycle and hidden application behavior were not supplied.

163 — Liquid Cup Loader: fixed white cup, moving pink liquid contours, floating bubbles, gentle steam and sequential status dots.
164 — Sand Stream Loader: fixed white hourglass, slightly moving yellow sand contours and independently falling grains. No real completion percentage is inferred.
165 — Paper Plane Orbit Loader: the paper plane, dashed orbit and cyan trail rotate as one group counterclockwise around (612,575), once per six seconds; the loading label stays fixed.
166 — Rocket Orbit Loader: stationary rocket with a pulsing jet, rotating green trail around (650,618), a fixed dark track and twinkling stars. The rocket does not cross the status label.

Every MP4 is silent H.264/yuv420p, 900×900, 30 fps, 180 frames, six seconds, faststart. Raw first/last frames use the same supplied composition. Parameters describe all curves, bounds, colors and periods. Transparent WebP layers preserve visible white artwork and lettering. Colored fill mattes are cleaned; cup bubbles and the rocket trail are reconstructed from measured geometry to avoid moving baked shadows; SVG lettering is traced from the still rather than presented as a recovered font. Vector contours are optional geometry, not proof of original source vectors. Lettering and decorative dots must not create repeated screen-reader announcements.

The renderer creates the media, extracts visible layers and records immutable byte counts/SHA-256 in media-manifest.json. To reproduce: place the four exact source PNGs under reference-1.png..reference-4.png, install Pillow, numpy, scipy and contourpy and run python3 render-loaders.py with ffmpeg/ffprobe available. Attachment byte counts/hashes are in attachments.json. No original image attachment is modified.

Working loaders are controlled by actual application loading/success/error/canceled states, not a six-second timeout. They do not invent percentages, hold back ready content or report fake success. Stop requestAnimationFrame/animation on completion or unmount, show a still for reduced motion, keep a polite single status announcement and preserve host retry/cancel/focus behavior.
