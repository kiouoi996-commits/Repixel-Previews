# Stellar Screen Cinema — анализ и карта ассетов

> Все размеры и цвета ниже измерены/оценены по растровому скриншоту 1536×1024 px. Это реконструкция по скриншоту, а не достоверные параметры исходного макета. Полностью скрытые интерфейсом области изображений восстановлены предположительно.

## 1. Разбиение по экранам

### Экран 1 — Discover

- Видимый корпус/экран телефона занимает примерно x=96–527, y=64–1023, то есть около 431×959 px на исходном скриншоте (28.1%×93.7%). Контентная колонка — примерно x=118–511.
- Большой featured-art `last-horizon-feature.webp`: x=118–511, y=430–648, 393×218 px (25.59% ширины и 21.29% высоты всего скриншота), видимое отношение сторон ≈1.803:1. Текст “The Last Horizon”, “New season” и круглая стрелка относятся к UI и из растрового ассета удалены; округление контейнера тоже UI.
- Trending cards: `dune-part-two.webp` 126×192 px, `fallout.webp` 125×191 px, `our-planet.webp` 125×191 px. Белые названия и heart-кнопки — UI, поэтому в ассетах отсутствуют. Частично видимый следующий card справа показан слишком узкой полосой, чтобы достоверно восстановить отдельную иллюстрацию; для пиксель-точного воспроизведения области справа лучше использовать clipping/overflow и следующий реальный контент проекта, а не выдумывать неизвестный арт.
- Search field, табы, заголовки, dots-индикатор карусели, нижняя навигация и все круглые/пилюльные подложки должны оставаться средствами интерфейса.

### Экран 2 — Detail

- Телефон примерно x=556–979, y=75–1024. Верхняя медиа-зона до белого bottom sheet: x=557–978, y=76–568, 421×492 px (27.41%×48.05% от всего скриншота).
- `last-horizon-detail.webp` — фон верхней части без status bar, back/heart/share, заголовка, metadata, Play Trailer, bookmark и белого sheet. Белая панель начинается примерно на y≈567 и должна перекрывать изображение как UI.
- Ряд preview stills: #1 ≈135×67 px, #2 ≈106×67 px, #3 ≈120×67 px. Круглый play поверх #1 — UI и в растр не входит.
- Ряд “You might also like”: `interstellar.webp` 121×177, `the-expanse.webp` 120×177, `foundation.webp` 123×177 видимой области. Нижние названия и heart — UI; арт экспортирован отдельно.
- Верхние controls имеют отдельные SVG-глифы; их полупрозрачные круглые подложки и blur создаются CSS/нативным UI.

### Экран 3 — My Watchlist

- Телефон примерно x=1008–1439, y=64–1023. Список начинается около y=326.
- Watchlist thumbnails имеют видимую область около 75×73/75 px и скругление контейнера. `interstellar.webp` можно переиспользовать через квадратный cover-crop; Blade Runner, The Last of Us, Spirited Away, Planet Earth III и Dune Watchlist имеют отдельные растровые ассеты.
- Play, more-vertical, back и plus — SVG-глифы; круглые кнопки, белые row-cards, тени и большой purple Add More button — UI.

## 2. Растровые ассеты

| Файл | Видимая область на скриншоте | Экспорт | Основной объект и оценка масштаба | Кадрирование / UI |
|---|---:|---:|---|---|
| `last-horizon-feature.webp` | 393×218 px @ (118,430) | 1572×872 | standing astronaut: ~3% W × 13% H; поля T/R/B/L ≈ 43/18/44/79%. planet ≈50% W × 55% H; cliff ≈42% W × 42% H | `object-fit:cover`, `object-position:center 50%`; rectangular export; UI corner radius must be applied by container |
| `last-horizon-detail.webp` | 421×492 px @ (557,76) | 1684×1968 | standing astronaut: ~4% W × 12% H; поля T/R/B/L ≈ 56/13/32/83%. planet ≈72% W × 40% H | `object-fit:cover`, `object-position:center top`; rectangular export; UI corner radius must be applied by container |
| `dune-part-two.webp` | 126×192 px @ (121,727) | 504×768 | standing figure: ~12% W × 18% H; поля T/R/B/L ≈ 49/42/33/46%. orange planet ≈86% W × 48% H | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `fallout.webp` | 125×191 px @ (254,728) | 500×764 | industrial tower complex: ~44% W × 50% H; поля T/R/B/L ≈ 34/31/16/25%. settlement fills lower ≈55% H | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `our-planet.webp` | 125×191 px @ (388,728) | 500×764 | glacier/ice mass: ~92% W × 58% H; поля T/R/B/L ≈ 29/4/13/4%. mountain range spans upper middle | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `horizon-still-01.webp` | 135×67 px @ (579,709) | 540×268 | dark alpine/space landscape: ~100% W × 78% H; поля T/R/B/L ≈ 10/0/12/0%. play control is UI and excluded | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `horizon-still-02.webp` | 106×67 px @ (721,709) | 424×268 | central snowy peak: ~58% W × 82% H; поля T/R/B/L ≈ 7/19/11/23%. snow field fills frame | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `horizon-still-03.webp` | 120×67 px @ (835,709) | 480×268 | planet limb: ~94% W × 68% H; поля T/R/B/L ≈ 20/0/12/6%. small celestial body at top right | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `interstellar.webp` | 121×177 px @ (579,838) | 484×708 | black snow peak: ~56% W × 47% H; поля T/R/B/L ≈ 45/19/8/25%. white/gray planetary cloud arc fills upper background | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `the-expanse.webp` | 120×177 px @ (708,838) | 480×708 | spacecraft: ~58% W × 32% H; поля T/R/B/L ≈ 39/14/29/28%. curving orange planet limb upper left | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `foundation.webp` | 123×177 px @ (835,838) | 492×708 | planet horizon + flare: ~100% W × 58% H; поля T/R/B/L ≈ 27/0/15/0%. tiny figure/structure near upper-right quadrant | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `blade-runner-2049.webp` | 75×73 px @ (1041,416) | 300×292 | standing cloaked figure: ~43% W × 78% H; поля T/R/B/L ≈ 8/26/14/31%. orange-left / cyan-right city background | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `the-last-of-us.webp` | 75×73 px @ (1041,507) | 300×292 | two seated figures: ~45% W × 48% H; поля T/R/B/L ≈ 38/23/14/32%. dark ruined interior/forest-like environment | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `spirited-away.webp` | 75×74 px @ (1041,597) | 300×296 | fantastical tower/structure: ~53% W × 73% H; поля T/R/B/L ≈ 14/19/13/28%. bright cyan sky and golden circular motif | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `planet-earth-iii.webp` | 75×73 px @ (1041,689) | 300×292 | mountain valley / small person: ~100% W × 65% H; поля T/R/B/L ≈ 29/0/6/0%. green foreground and blue mountains | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |
| `dune-part-two-watchlist.webp` | 75×73 px @ (1041,782) | 300×292 | standing figure: ~8% W × 29% H; поля T/R/B/L ≈ 41/45/30/47%. pink-orange desert gradient | `object-fit:cover`, `object-position:center`; rectangular export; UI corner radius must be applied by container |

## 3. Иконки SVG

Все SVG имеют прозрачный фон, `viewBox="0 0 24 24"`, не содержат круглых/пилюльных подложек и используют `currentColor`, чтобы активное/неактивное состояние задавалось UI. Контурные иконки имеют толщину около 1.9–2.1 единицы viewBox; окончания и соединения скруглены там, где это видно на референсе. Красная notification dot не включена в `bell.svg` и должна быть отдельным UI-элементом.

Файлы: `icons/arrow-right.svg`, `icons/back.svg`, `icons/bell.svg`, `icons/bookmark.svg`, `icons/grid.svg`, `icons/heart.svg`, `icons/home-active.svg`, `icons/more-vertical.svg`, `icons/play.svg`, `icons/plus.svg`, `icons/profile.svg`, `icons/search.svg`, `icons/share.svg`.

## 4. Отдельные UI-заливки, геометрия и эффекты

- Основной светлый фон: приблизительно `#F7F7FB`; белые/почти белые sheets/cards — `#F9F9FD`/`#FFFFFF` в зависимости от слоя.
- Неактивные chips: приблизительно `#F1F1FB`; активный purple: около `#6F71F6`. Большая кнопка Add More выглядит как почти ровная фиолетовая заливка/очень мягкий горизонтальный градиент; безопасная реконструкция: `linear-gradient(90deg, #6668F7 0%, #7173F4 100%)`.
- Основной текст: около `#0B0911`; вторичный текст — около `#7C7E95`; тёмные иконки — около `#24213F`; unread dot — около `#FF2D46`.
- Малые круглые controls: `background: rgba(245,245,252,.90)` + `backdrop-filter: blur(8px)`; фактическая прозрачность в скриншоте смешана с содержимым подложки, поэтому RGBA — оценка.
- Large art container radius ориентировочно 22–26 px; poster-card radius ~16–20 px; watchlist thumbs ~17–20 px. Тени контейнеров не запекать в изображения: ориентир `0 8px 24px rgba(45,43,89,.06)`.
- Status bar (время, связь, Wi‑Fi, батарея) не включена в ассеты и не воспроизводится графическими файлами.

## 5. Качество и ограничения реконструкции

- Растры экспортированы минимум примерно в 4× от видимого размера скриншота. Это апскейл/реконструкция, поэтому дополнительное разрешение не означает наличие исходных деталей.
- Видимые части иллюстраций сохранены максимально близко к референсу. Там, где UI полностью закрывал изображение (особенно hero), фон восстановлен предположительно; эти области не следует считать исходником.
- У всех WebP фон является частью изображения; альфа-канал не нужен. У SVG фон прозрачный.
- Отдельных системных status-bar icons нет, как и требовалось.

## 6. GitHub / Repixel Media

- Запрошенный проект: `stellar-screen-cinema` в репозитории **Repixel prewiews**.
- На момент выполнения GitHub-плагин включён, но у текущего подключения **0 GitHub App installations / 0 installed accounts / 0 доступных repositories**. Поэтому невозможно безопасно определить `owner/repo`, записать файлы, получить commit SHA и проверить raw/permalink URL.
- Локальный набор полностью подготовлен; поля `github_url`, `repository_url`, `manifest_url`, `commit_sha` в manifest намеренно оставлены пустыми/blocked вместо выдуманных ссылок.
