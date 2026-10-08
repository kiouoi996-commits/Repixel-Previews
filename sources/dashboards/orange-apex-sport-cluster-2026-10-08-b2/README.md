# Orange Apex Sport Cluster — authored dashboard demonstration

Supplied artwork commit: 65e9759ddad33685ab4ddb6c6981c257e1544ab6. Supplied approximate geometry manifest: 47d997d6d448bb9aa317ba92552e19ceb1104a9c. Native composition: 1448×1086. The original PNG attachment was unavailable to the publishing environment; geometry follows the supplied measured manifest, while label angles, font metrics and movement are authored reconstruction choices.

Serve this folder over HTTP, then open index.html. Hold Accelerate/Brake, use Gear −/+, Pause/Resume and Reset. Arrow keys operate the same controls. These companion controls appear below the cluster and are absent from the video. Run demo starts one deterministic 16-second sequence; manual input takes over. Nothing starts automatically.

The wide yellow/orange ribbons now grow clockwise along their calibrated arcs. The speed ribbon uses speed/200; the RPM ribbon uses the smoothed engine speed/8000. Their tracks, ticks, shells and car stay fixed. Accelerating extends both ribbons; braking contracts them. An upshift contracts only the RPM ribbon while road speed stays continuous. Pause freezes both; Reset restores 64% speed and 70% RPM. No independent CSS animation or decorative motion controls their fill.

Speed arc: local centre (370,370), radius 315.5, stroke width 35, start 140°, sweep 160°. RPM arc: local centre (176,370), radius 313.5, width 33, start 245°, sweep 165°. Both SVG paths use pathLength=1, butt caps and stroke-dasharray="fraction 1". At zero the active stroke is hidden; at maximum it spans the full track. gauges.mjs embeds exactly the two adjacent derived SVG files, retaining the supplied rail, tick and gradient artwork while replacing its static filled polygons with a dark track and live ribbon. model.mjs remains the single state model for both controls and video.

?capture=1 hides controls and disables the real-time clock. Await dashboard.ready and call dashboard.renderAt(seconds) for deterministic frames. dashboard.renderState(values) is capture-only fixture support for boundary checks. The renderer exports 1080×810, 30 fps, 480 frames, silent H.264/yuv420p with faststart. Its explicit final reset hold reuses opening pixels for an exact loop endpoint.

To reproduce: install requirements.txt and FFmpeg/ffprobe, run python -m playwright install chromium, serve this folder with python -m http.server 4177 --bind 127.0.0.1, then run python test.py, python test-bands.py and python render.py. asset_routes.py downloads and hash-verifies the pinned original assets once, then supplies those exact bytes to Playwright. Set APEX_ASSET_CACHE for an existing cache or APEX_RENDER_OUTPUT for another output folder. No browser login or API credentials are required. The browser demo itself loads the public pinned car/icon URLs directly.

interaction-checks.json, band-visual-checks.json and verification.json record control, rendered ribbon and final media verification.
