# Repixel Previews

Public video previews for cards on [repixel.pro](https://repixel.pro/). This repository is separate from the website source.

## Publishing a new preview

1. Render the final MP4 (H.264, muted or without audio, web-optimized `moov` atom at the start). Give it a descriptive, unique path under `videos/<category>/`; never overwrite a URL already used by a published card.
2. Commit the exact MP4 bytes here through the connected GitHub account with Base64 encoding. Record SHA-256 and byte count from the local render.
3. Use the file's public `https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/<commit-sha>/videos/<category>/<filename>.mp4` URL in the Repixel card. Pinning the commit makes the URL immutable.
4. Verify the published URL returns the expected bytes and the preview plays on Repixel before finishing the card. Keep previous card URLs unchanged unless migrating them deliberately.

The first file below is a byte-identical copy of a previously published Studio menu preview, used to verify the publishing path. The original card still uses its issue attachment URL until the site is migrated.

| File | SHA-256 | Bytes |
|---|---|---:|
| `videos/menus/studio-editorial-index-2026-09-26.mp4` | `7615112c377571d4b2c281ae9f9c384db14dc3be522db8da06647e06d088578e` | 808895 |
