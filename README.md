# Repixel Previews

Public video previews, card images and posters for [repixel.pro](https://repixel.pro/). This repository is separate from the website source. Text prompts remain in the [Repixel](https://github.com/kiouoi996-commits/Repixel) repository.

## Publishing new media

1. Produce the final MP4 (H.264, web-optimized `faststart`) and/or WebP/PNG/JPEG image. Give every asset a unique path under `videos/<category>/` or `images/<category>/`; never overwrite a published file.
2. Commit the exact binary bytes here through the connected GitHub account with Base64 encoding. Record local byte count and SHA-256.
3. Put the public `https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/<commit-sha>/<asset-path>` URL in the Repixel card. Pinning the commit makes the URL immutable.
4. Confirm the public URL returns the expected bytes and that the media renders in the Repixel card before publishing. Keep existing URLs unchanged unless migrating them deliberately.

These first two files are byte-identical copies of previously published Studio menu media, used to verify the publishing path. The existing card still uses its issue video and local poster until migrated deliberately.

| File | SHA-256 | Bytes |
|---|---|---:|
| `videos/menus/studio-editorial-index-2026-09-26.mp4` | `7615112c377571d4b2c281ae9f9c384db14dc3be522db8da06647e06d088578e` | 808895 |
| `images/posters/studio-editorial-index-2026-09-26.webp` | `9aa801033541fd0420e007868372b1abf0e6ae5514735d5582bb284ffd69c8df` | 23150 |
