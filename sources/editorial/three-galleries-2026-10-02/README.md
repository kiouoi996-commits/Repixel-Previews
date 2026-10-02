# Three authored editorial gallery previews

These studies use three user-supplied 1448×1086 stills. Original site code, separate photographs, original font files and hidden interactions were not supplied. The stills are visual references; the animation is newly authored. Screenshot viewports are for preview rendering, not a production substitute for semantic text, clean photography and real links.

All movies are 1080×810, 30fps, 210 frames/seven seconds, silent H.264/yuv420p with faststart.

- Perspective Story Focus: CreativeCircle in creative-circle-preview.tsx, rendered with Remotion 4.0.530 and React 19.1.0. Photo, label and action crops stay together while the ceramic/lamp wrappers hinge and a four-step marker moves. Register the exported Root in a blank Remotion project. Place creative-circle.webp in its public directory.
- Featured Card Carousel: render-gallery-frames.py, DestinationCarousel. One real record becomes featured while the rail slides. The inert cyclic clone repeats a known record. Destination names use DejaVu Serif as a disclosed visual match; it is not an identified original font.
- Torn Paper Photo Reveal: render-gallery-frames.py, MomentsReveal. Only the five photo masks change; the rest of the still is preserved. Fixed paper grain uses seed 22. The initial closing pass exists solely for the demonstration loop.

For Python rendering, install Pillow and NumPy, provide FFmpeg and DejaVu fonts, place destinations.webp and moments.webp in bundle/public beside the script, then run python render-gallery-frames.py. It writes MP4s and sampled PNG frames to out. The two raw endpoint frames are equal. In a working component, use actual selection for the first two studies and a once-only viewport entrance for the third, with reduced-motion support and immediately usable real actions.

Frozen visual references:
- creative-circle.webp: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/288c8c24edafe572d3ca478f6efb66ccaeedf402/images/editorial/references/151-creative-circle-perspective-focus-2026-10-02-a1-reference.webp
- destinations.webp: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/288c8c24edafe572d3ca478f6efb66ccaeedf402/images/editorial/references/152-destinations-featured-carousel-2026-10-02-a1-reference.webp
- moments.webp: https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/288c8c24edafe572d3ca478f6efb66ccaeedf402/images/editorial/references/153-moments-torn-photo-reveal-2026-10-02-a1-reference.webp
