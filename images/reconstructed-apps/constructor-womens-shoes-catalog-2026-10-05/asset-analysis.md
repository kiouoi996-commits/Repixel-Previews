# constructor-womens-shoes-catalog-2026-10-05 — asset reconstruction analysis

> Все размеры, проценты, координаты и цвета ниже измерены/оценены по предоставленному растровому скриншоту 1051×1497 px. Это не исходные параметры макета. Финальные файлы — реконструкция по скриншоту, а не оригинальные исходники.

## Разделение графики и интерфейса

На экране один desktop-каталог. Растровая графика: один широкий hero-баннер и девять товарных студийных фотографий. Текст, цены, названия товаров, сортировка, фильтры, CTA, поля ввода, рамки карточек, круглые кнопки с сумкой, radio/checkbox, size chips и footer — интерфейс и в растр не включаются. Цветовые кружки реализуются CSS. Системной строки состояния нет.

## Растровые ассеты

### `hero-womens-shoes.webp`

- **Роль/место:** Wide hero artwork behind the New Collection / Women's Shoes copy. Видимая область: `x=0, y=74, 1051×316 px` (≈ `x 0.0%, y 4.94%, w 100.0%, h 21.11%` of screenshot).
- **Экспорт:** `3153×948 px`, соотношение `3.3259:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `56.0%` ширины и `81.6%` высоты изображения; отступы ≈ left `43.0%`, top `18.4%`, right `1.0%`, bottom `0.0%`.
- **Фон/свет:** Included photographic/off-white studio set. Approx. visible tonal progression: #F0EFED at left/top, #F1F0EE in left center, #EBE7E4 around center/top, darkening to about #D1CCC8 at lower-right because of the set/shadows.
- **UI:** удалено/не включено: NEW COLLECTION label, Women's Shoes heading, supporting copy, Shop Now button. Простые UI-подложки остаются CSS.
- **Обрезка:** Full-width screenshot banner. The rightmost pedestal/shadow reaches the right edge; no extra unseen scene is claimed.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Reconstruct only the wide hero artwork from the screenshot: warm off-white/cream minimalist studio, three women's shoes displayed on textured white rectangular plinths on the right half; top shoe is a cream low loafer with gold horsebit, middle shoe a dusty-rose pointed slingback flat, lower-right shoe a cream loafer with gold horsebit. Large clean negative space on the left. Soft diffused light from upper-left/front, gentle contact shadows, low contrast, editorial e-commerce photography. Preserve the screenshot scale and camera angle. No headline, copy, button, navigation or other UI. Landscape about 3.33:1.

### `elara-ballet-flats.webp`

- **Роль/место:** Elara Ballet Flats product photo, first row / first product card. Видимая область: `x=294, y=478, 220×191 px` (≈ `x 27.97%, y 31.93%, w 20.93%, h 12.76%` of screenshot).
- **Экспорт:** `660×573 px`, соотношение `1.1518:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `87.3%` ширины и `56.0%` высоты изображения; отступы ≈ left `7.7%`, top `25.7%`, right `5.0%`, bottom `18.3%`.
- **Фон/свет:** Included pastel blush studio backdrop, approximately #EDD2CD → #EAD0CA with subtle soft-floor shadow.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Both flats visible essentially in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Two ivory/cream leather ballet flats matching the screenshot, each with a small tied bow on the rounded toe, warm beige lining, very low flat heel; one shoe slightly behind and higher than the front shoe, three-quarter product view. Pastel blush pink seamless studio background, soft top-left diffuse light and gentle contact shadow. No text, price, card frame, badge or bag button.

### `nova-slingback-flats.webp`

- **Роль/место:** Nova Slingback Flats product photo, first row / second product card. Видимая область: `x=529, y=478, 223×191 px` (≈ `x 50.33%, y 31.93%, w 21.22%, h 12.76%` of screenshot).
- **Экспорт:** `669×573 px`, соотношение `1.1675:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `87.0%` ширины и `48.2%` высоты изображения; отступы ≈ left `6.7%`, top `29.8%`, right `6.3%`, bottom `22.0%`.
- **Фон/свет:** Included muted sage/mint studio backdrop, approximately #D3DBCE → #CCD4C6.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Slingback shown in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Single dusty-rose/pink pointed-toe slingback flat matching the screenshot, low heel, slim back strap with small gold buckle, warm tan insole, side three-quarter view facing left. Muted sage-green seamless studio background, soft diffuse light and understated floor shadow. No UI, text, price or button.

### `mira-loafers.webp`

- **Роль/место:** Mira Loafers product photo, first row / third product card. Видимая область: `x=767, y=478, 222×191 px` (≈ `x 72.98%, y 31.93%, w 21.12%, h 12.76%` of screenshot).
- **Экспорт:** `666×573 px`, соотношение `1.1623:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `87.8%` ширины и `56.0%` высоты изображения; отступы ≈ left `6.3%`, top `23.6%`, right `5.9%`, bottom `20.4%`.
- **Фон/свет:** Included powder-blue studio backdrop, approximately #BED2E6 → #B8CDE1.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Pair visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Pair of cream/off-white leather loafers matching the screenshot, rounded-square moccasin toe, stitched apron seam, gold horsebit hardware, tan/brown low outsole and heel; one shoe behind the other, side three-quarter view facing left. Powder-blue seamless studio backdrop, soft diffuse light and contact shadow. No UI or text.

### `lena-slide-sandals.webp`

- **Роль/место:** Lena Slide Sandals product photo, second row / first card. Видимая область: `x=294, y=727, 220×191 px` (≈ `x 27.97%, y 48.56%, w 20.93%, h 12.76%` of screenshot).
- **Экспорт:** `660×573 px`, соотношение `1.1518:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `89.1%` ширины и `47.6%` высоты изображения; отступы ≈ left `6.4%`, top `35.1%`, right `4.5%`, bottom `17.3%`.
- **Фон/свет:** Included pale lavender studio backdrop, approximately #D8D6ED → #D4D2E9.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Pair visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Pair of warm tan/caramel leather slide sandals matching the screenshot, wide crossed front straps, flat sole with low stacked heel, one sandal offset behind the other. Pale lavender seamless studio background, soft diffused e-commerce lighting and gentle contact shadow. No UI or text.

### `vega-chelsea-boots.webp`

- **Роль/место:** Vega Chelsea Boots product photo, second row / second card. Видимая область: `x=529, y=727, 223×191 px` (≈ `x 50.33%, y 48.56%, w 21.22%, h 12.76%` of screenshot).
- **Экспорт:** `669×573 px`, соотношение `1.1675:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `78.0%` ширины и `69.1%` высоты изображения; отступы ≈ left `9.9%`, top `18.3%`, right `12.1%`, bottom `12.6%`.
- **Фон/свет:** Included warm beige studio backdrop, approximately #EDDCCB → #EAD9C7.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Boot pair visible; rear boot partially occluded by front boot as in reference.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Two sleek black leather Chelsea ankle boots matching the screenshot, smooth slightly glossy leather, black elastic side gore, pull tab, rounded-almond toe, low black block heel; front boot prominent with second boot behind. Warm beige seamless studio background, soft top-left light, realistic contact shadow. No UI or text.

### `luna-sneakers.webp`

- **Роль/место:** Luna Sneakers product photo, second row / third card. Видимая область: `x=767, y=727, 222×191 px` (≈ `x 72.98%, y 48.56%, w 21.12%, h 12.76%` of screenshot).
- **Экспорт:** `666×573 px`, соотношение `1.1623:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `89.6%` ширины и `52.9%` высоты изображения; отступы ≈ left `6.3%`, top `28.3%`, right `4.1%`, bottom `18.8%`.
- **Фон/свет:** Included soft pastel pink studio backdrop, approximately #F0D1CF → #EECBC9.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Pair visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Pair of clean white low-top leather sneakers matching the screenshot, white laces, subtle stitched side-panel construction, off-white rubber cupsole, one shoe behind the other, three-quarter side view. Soft pastel pink studio background, diffuse light and gentle floor shadow. No UI or text.

### `aria-mules.webp`

- **Роль/место:** Aria Mules product photo, third row / first card. Видимая область: `x=294, y=976, 220×191 px` (≈ `x 27.97%, y 65.2%, w 20.93%, h 12.76%` of screenshot).
- **Экспорт:** `660×573 px`, соотношение `1.1518:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `90.5%` ширины и `47.6%` высоты изображения; отступы ≈ left `5.9%`, top `36.6%`, right `3.6%`, bottom `15.7%`.
- **Фон/свет:** Included muted pale green studio backdrop, approximately #D4DBCD → #D1D9CC; local lower-right tonal variation comes from product shadow.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Pair visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Pair of pointed-toe woven open-back mule flats matching the screenshot, cream/tan basket-weave or perforated lattice upper, pale blush/tan insole, tiny low heel; one mule angled over the other. Muted pale sage-green studio background with soft light and shadow. No UI or text.

### `cora-flat-sandals.webp`

- **Роль/место:** Cora Flat Sandals product photo, third row / second card. Видимая область: `x=529, y=976, 223×191 px` (≈ `x 50.33%, y 65.2%, w 21.22%, h 12.76%` of screenshot).
- **Экспорт:** `669×573 px`, соотношение `1.1675:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `90.6%` ширины и `59.7%` высоты изображения; отступы ≈ left `4.5%`, top `25.1%`, right `4.9%`, bottom `15.2%`.
- **Фон/свет:** Included powder-blue studio backdrop, approximately #C1D4E7 → #BBCFE3.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Single sandal visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Single warm tan leather flat sandal matching the screenshot, two clean front straps plus ankle strap and small buckle, flat sole with tiny dark heel edge, angled three-quarter side view facing left. Powder-blue seamless studio background, soft diffuse lighting and subtle contact shadow. No UI or text.

### `zara-boat-shoes.webp`

- **Роль/место:** Zara Boat Shoes product photo, third row / third card. Видимая область: `x=767, y=976, 222×191 px` (≈ `x 72.98%, y 65.2%, w 21.12%, h 12.76%` of screenshot).
- **Экспорт:** `666×573 px`, соотношение `1.1623:1`, alpha: `нет`.
- **Основной объект (оценка):** ≈ `89.2%` ширины и `53.4%` высоты изображения; отступы ≈ left `6.3%`, top `29.3%`, right `4.5%`, bottom `17.3%`.
- **Фон/свет:** Included dusty blush studio backdrop, approximately #EBC5C3 → #EAC4C2.
- **UI:** удалено/не включено: circular product bag button. Простые UI-подложки остаются CSS.
- **Обрезка:** Pair visible in full.
- **Отображение:** `object-fit: cover; object-position: 50% 50%`.
- **Метод:** Screenshot-derived crop; UI overlay locally reconstructed/inpainted; exported at 3× measured screenshot size using Lanczos resampling. This preserves the visible item rather than claiming access to the original source photography.
- **Промпт реконструкции:** Pair of ivory/cream leather boat shoes matching the screenshot, moccasin apron stitching, round laces tied at the vamp, side lace detail, low tan/brown outsole; one shoe behind the other, three-quarter view. Dusty blush pink seamless studio background, soft product light and gentle floor shadow. No UI or text.

## SVG-иконки

- `icons/menu.svg` — Header hamburger menu. Видимые места: `69,33 15×11` px. 24×24 viewBox; three 1.6 px rounded horizontal strokes; #7890C4. Прозрачный фон.
- `icons/search.svg` — Search-field magnifier. Видимые места: `559,34 14×14` px. 24×24; 1.7 px outline circle + rounded handle; #7890C4. Прозрачный фон.
- `icons/user.svg` — Header account/person. Видимые места: `833,32 15×16` px. 24×24; filled circular head and filled shoulders; #7890C4. Прозрачный фон.
- `icons/bag.svg` — Header bag and repeated product-card bag glyph. Видимые места: `931,32 15×17`; `479,629 16×16` px. 24×24; 1.55 px outline body and handle; #7890C4. White circular button background is CSS/UI, not part of SVG. Прозрачный фон.
- `icons/envelope.svg` — Newsletter email field icon. Видимые места: `780,420 15×12` px. 24×24; 1.45 px rounded envelope outline; #7890C4. Прозрачный фон.
- `icons/arrow-right.svg` — Newsletter submit / footer email arrow. Видимые места: `965,418 16×14`; `603,1450 14×12` px. 24×24; 1.55 px rounded arrow; #7890C4. Прозрачный фон.
- `icons/chevron-up.svg` — Expanded filter-section chevrons. Видимые места: `249,487 10×7`; `249,735 10×7`; `249,894 10×7`; `249,1009 10×7`; `249,1192 10×7` px. 24×24; 1.55 px rounded up-chevron; #7890C4. Прозрачный фон.
- `icons/check.svg` — White check inside active price radio. Видимые места: `69,789 8×7` px. 24×24; 2 px rounded white check; filled purple circular radio background is CSS. Прозрачный фон.
- `icons/instagram.svg` — Footer Instagram. Видимые места: `811,1448 17×17` px. 24×24; 1.55 px outline; #7890C4. Прозрачный фон.
- `icons/facebook.svg` — Footer Facebook. Видимые места: `851,1448 11×17` px. 24×24; filled mark; #7890C4. Прозрачный фон.
- `icons/youtube.svg` — Footer YouTube. Видимые места: `890,1450 17×13` px. 24×24; filled rounded video shape with white play triangle; #7890C4. Прозрачный фон.
- `icons/pinterest.svg` — Footer Pinterest. Видимые места: `932,1448 17×17` px. 24×24; filled Pinterest-like mark; #7890C4. Прозрачный фон.

## Заливки, геометрия и эффекты интерфейса, не включённые в изображения

- Основной фон страницы/header: `#F6F9FC` (оценка по пустым участкам растра).
- Белые поверхности карточек: `#FDFDFE`; product bag button — белый круг ≈ `33 px` в исходном скриншоте, лёгкая тень `0 2px 8px rgba(48,69,116,.06)`.
- Основной тёмно-синий текст: ≈ `#304574`; вторичный сине-серый текст/иконки: ≈ `#7890C4`.
- Акцент сортировки: ≈ `#7826FE`; выбранный price radio: ≈ `#5052FD` + белая SVG-галочка.
- Hero CTA: визуально почти сплошной синий, можно реализовать `linear-gradient(90deg, #6B7AA4 0%, #6877A3 50%, #6D7CA6 100%)`; радиус ≈ `20 px`. Это UI, не часть hero-растра.
- Search/newsletter fields: белая заливка, мягкая тень порядка `0 4px 16px rgba(61,78,120,.06)`, большие скругления.
- Color swatches: CSS-кружки. Репрезентативные видимые цвета: `#FFFFFF`, `#E7E7E5`, `#E9D2B7`, `#F59A4B`, `#EA7D36`, `#3AAF70`, `#8196BA`, `#A99BD6`, `#ED5A84`, `#D94F50`, `#725446`, `#111111`.
- Тени обуви и поверхностей студийной сцены сохранены внутри raster-ассетов. Тени карточек/полей/кнопок должны задаваться CSS и не дублироваться внутри изображений.