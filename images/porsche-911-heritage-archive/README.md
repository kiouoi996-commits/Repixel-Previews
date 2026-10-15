# Porsche 911 Heritage Archive — media assets

Reconstructed asset set based on one **1536 × 1024** user-provided screenshot; not source photographs.

14 WebP images, 16 independent transparent SVG icons.

## Display / layout
Three separate mobile screens (home catalogue, Porsche 911 detail, 911 timeline). Coordinates in `manifest.json` are approximate measurements of rasterized screenshot, not source layout measurements.
Each image is an independent file; render `<img>` with `object-fit: cover`, CSS border-radius per `manifest.json`, do not bake labels, white rounded surfaces, circles, shadows, editorial typography or tab bar into photographs.
Transparent SVG icons use `currentColor`, for instance white hearts on photos and muted outline icons on light controls. CSS creates buttons and circles.

## Reconstruction notes
Hero backdrop areas covered with editorial text are inferred using surrounding wall colors. The bottoms of the blue/red car catalogue photos are image-model interpretations because the tab bar hides the true source pixels.

## Asset listing

| File | Screenshot x,y,w,h | Export pixels |
|---|---|---|
| `home_hero_porsche_911_rear.webp` | 82,63,433,485 | 1299×1455 |
| `home_card_porsche_911_1964.webp` | 101,628,196,121 | 588×363 |
| `home_card_mercedes_300sl_1955.webp` | 314,628,182,121 | 546×363 |
| `home_card_porsche_911_blue.webp` | 101,827,196,121 | 588×363 |
| `home_card_porsche_911_red.webp` | 314,827,182,121 | 546×363 |
| `detail_hero_porsche_911_1964.webp` | 550,63,438,585 | 1314×1755 |
| `detail_steering.webp` | 570,771,89,87 | 267×261 |
| `detail_wheel.webp` | 668,771,93,87 | 279×261 |
| `detail_leather_seats.webp` | 769,771,99,87 | 297×261 |
| `detail_911_emblem.webp` | 876,771,93,87 | 279×261 |
| `timeline_porsche_911_1964.webp` | 1037,255,292,182 | 876×546 |
| `timeline_porsche_911s_1967.webp` | 1037,447,292,183 | 876×549 |
| `timeline_porsche_911t_1970.webp` | 1037,639,292,180 | 876×540 |
| `timeline_porsche_911_carrera_1973.webp` | 1037,827,292,159 | 876×477 |
