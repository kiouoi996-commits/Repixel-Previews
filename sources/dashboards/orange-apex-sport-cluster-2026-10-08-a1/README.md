# Orange Apex Sport Cluster — authored dashboard demonstration

Supplied assets: 65e9759ddad33685ab4ddb6c6981c257e1544ab6.
Supplied approximate geometry manifest: 47d997d6d448bb9aa317ba92552e19ceb1104a9c.
Native composition: 1448×1086. These resources are reconstructed artwork, not recovered original code or source font.

Serve this folder over HTTP, then open index.html. Every control works; press and hold Accelerate/Brake, shift with Gear −/+, pause/resume or reset. Arrow keys operate the same controls. Buttons are companion simulator controls below the reference cluster, newly authored for testing and absent from the supplied still.

Run demo invokes one 16-second deterministic sequence. Manual input cancels the demo. The default dashboard does not start an automatic demo. The moving rim markers and tiny brake-lamp glow are authored additions; supplied gauge shells remain stationary. model.mjs drives both the working demo and the video, using the same gear ratios, state and time integration.

?capture=1 hides companion controls and disables the real-time clock. Await dashboard.ready, then call dashboard.renderAt(seconds) before each screenshot. The renderer uses 1080×810, 30 fps, 480 frames and silent H.264/yuv420p/faststart.

The supplied PNG attachment was unavailable to the publishing environment. Geometry is taken from the supplied measured manifest; label angles, font metrics and new movement are reconstruction choices, not verified original values.

To reproduce: install requirements.txt, run python -m playwright install chromium, serve this folder with python -m http.server 4175 --bind 127.0.0.1, then run python render.py. FFmpeg and ffprobe are also required. The export caches the opening reference pixels for the explicitly reset final hold, avoiding browser compositing differences across identical states. test.py verifies the controls, keyboard input and responsive behavior.
