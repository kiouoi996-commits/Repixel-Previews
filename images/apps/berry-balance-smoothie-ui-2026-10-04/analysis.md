# berry-balance-smoothie-ui-2026-10-04

> **Статус:** реконструкция по скриншоту 1448×1086 px. Оригинальные медиа и исходный макет не предоставлены. Поэтому все координаты, размеры, проценты, цвета и эффекты ниже — **оценки по растровому скриншоту**, а не достоверные параметры исходного дизайна.

## Экраны и визуальная структура

На скриншоте три мобильных экрана на тёплом фоне `≈ #E9E1D9`.

- **Левый onboarding:** full-bleed фото клубничного смузи. Сверху UI: круг с leaf-логотипом и `Skip`; слева крупный текст; снизу отдельная стеклянная карточка с мини-превью ингредиентов, `+3`, описанием и круглой кнопкой со стрелкой; в самом низу pagination dots. Всё перечисленное — UI, не часть фотографии.
- **Средний home/catalog:** светлая кремовая поверхность, заголовок, avatar + online-dot, search field, filter, category chips, две фото-карточки, текст рецептов, hearts, chevrons и bottom navigation. Текст/иконки/кнопки отделены от фото.
- **Правый detail:** драматичная full-height ягодная фотография под UI. Сверху back и filled-heart в отдельных круглых кнопках. Снизу — крупная тёмная полупрозрачная панель с названием, метриками, ingredient tiles и CTA. Плитки являются UI; прозрачные cutout-ингредиенты экспортированы отдельно.

## Растровые ассеты

| Файл | Роль | Видимая область на скриншоте, ≈ px | ≈ % от скриншота (x, y, w, h) | Основной объект | Фон / альфа | Обрезка | Рекомендуемое отображение |
|---|---|---:|---:|---|---|---|---|
| `hero-strawberry-smoothie.webp` | onboarding background | 65,78,414,913 | 4.5,7.2,28.6,84.1 | стакан ≈68% W × 63% H; слева ≈32%, сверху ≈19% | фото, без альфы | справа намеренно срезаны стакан/соломинка | `cover; object-position: 50% 50%` |
| `card-green-energizer.webp` | Green Energizer card | 517,417,376,234 | 35.7,38.4,26.0,21.5 | чаша ≈64% W × 90% H; справа/снизу в край | фото, без альфы | справа и снизу | `cover; object-position: 50% 50%` |
| `card-berry-balance.webp` | Berry Balance card | 517,659,376,233 | 35.7,60.7,26.0,21.5 | стакан ≈68% W × 96% H | фото, без альфы | справа и снизу | `cover; object-position: 50% 50%` |
| `hero-berry-balance.webp` | detail background | 933,79,410,913 | 64.4,7.3,28.3,84.1 | cluster ≈84% W × 79% H | фото, без альфы | правая сторона; низ скрывается панелью | `cover; object-position: 50% 0%` |
| `avatar-user.webp` | profile avatar | 840,139,48,48 | 58.0,12.8,3.3,4.4 | лицо/плечи ≈72% W × 82% H | фото, без альфы | круглая UI-маска | `cover; object-position: 50% 35%; border-radius:50%` |
| `ingredient-strawberry.webp` | ingredient cutout | 961,723,85,94 | 66.4,66.6,5.9,8.7 | ≈83% W × 80% H | прозрачный PNG | нет | `contain` |
| `ingredient-banana.webp` | ingredient cutout | 1054,723,85,94 | 72.8,66.6,5.9,8.7 | ≈80% W × 76% H | прозрачный PNG | нет | `contain` |
| `ingredient-raspberry.webp` | ingredient cutout | 1148,723,84,94 | 79.3,66.6,5.8,8.7 | ≈78% W × 75% H | прозрачный PNG | нет | `contain` |
| `ingredient-mint.webp` | ingredient cutout | 1241,723,84,94 | 85.7,66.6,5.8,8.7 | ≈81% W × 58% H | прозрачный PNG | нет | `contain` |

## SVG-иконки

Все иконки имеют прозрачный фон, `viewBox="0 0 24 24"` и используют `currentColor`. Круглые кнопки, chip-подложки, активный фон bottom-nav и их тени в SVG **не включены**. Координаты и размеры ниже — оценки по исходному растровому скриншоту 1448×1086 px.

| Файл | Где виден, ≈ bbox px исходного скриншота | Геометрия знака |
|---|---|---|
| `icons/arrow-left.svg` | right/detail: top back button: 976,148,22,20 | контур; glyph ≈64% W × 72% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/arrow-right.svg` | left/onboarding: glass-card CTA: 394,833,23,21 | контур; glyph ≈72% W × 62% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/bowl.svg` | middle/home: Bowls chip: 808,359,23,18 | контур; glyph ≈80% W × 58% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/calendar.svg` | middle/home: bottom navigation: 740,916,21,26 | контур; glyph ≈67% W × 79% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/chevron-right.svg` | middle/home: Green Energizer card: 843,591,16,22; middle/home: Berry Balance card: 843,829,16,22; right/detail: Start recipe CTA: 1270,879,17,23 | контур; glyph ≈48% W × 72% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/clock.svg` | right/detail: 5 min metric: 971,682,18,18 | контур; glyph ≈70% W × 70% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/filter.svg` | middle/home: search filter: 840,274,22,22 | контур; glyph ≈72% W × 67% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/flame.svg` | right/detail: kcal metric: 1078,681,16,20 | контур; glyph ≈55% W × 72% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/heart-filled.svg` | right/detail: favorite top button: 1275,144,24,22 | заливка; glyph ≈79% W × 68% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/heart-outline.svg` | middle/home: Green Energizer favorite: 844,445,20,20; middle/home: Berry Balance favorite: 844,687,20,20 | контур; glyph ≈80% W × 72% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/home.svg` | middle/home: active bottom navigation: 562,917,24,25 | контур; glyph ≈78% W × 80% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/immunity-bars.svg` | right/detail: Immunity metric: 1198,682,22,19 | контур; glyph ≈76% W × 70% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/leaf-filled.svg` | left/onboarding: brand mark: 114,143,26,28; middle/home: All chip: 552,359,18,19 | заливка; glyph ≈74% W × 78% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/leaf-outline.svg` | middle/home: bottom navigation: 650,919,21,22 | контур; glyph ≈72% W × 72% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/search.svg` | middle/home: search field: 551,275,21,21 | контур; glyph ≈74% W × 74% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/smoothie.svg` | middle/home: Smoothies chip: 654,356,18,26 | контур; glyph ≈56% W × 82% H viewBox; прозрачный фон; UI-подложка отдельно |\n| `icons/user.svg` | middle/home: bottom navigation: 824,916,22,25 | контур; glyph ≈72% W × 78% H viewBox; прозрачный фон; UI-подложка отдельно |\n
Контурные варианты используют округлые окончания/соединения и визуально близкую к референсу толщину штриха ≈1.45–1.9 px при 24 px. Filled-варианты содержат только форму знака; цвет активного/обычного состояния задаётся интерфейсом.

## Не включено в изображения — реализовать интерфейсом

- Общий фон макета: `≈ #E9E1D9`.
- Средний экран: мягкий вертикальный кремовый градиент `#F3EEE8 → #EFE6DC → #F5EFE9`.
- Search surface: `≈ #FAF8F5`; inactive chips `≈ #E5DACE`; active chip `≈ #1A1A1A`.
- Onboarding glass-card: `rgba(196,166,145,.74)` + `backdrop-filter: blur(14px)` + белая полупрозрачная обводка. Это оценка видимого результата.
- Detail panel: `linear-gradient(180deg, rgba(117,71,59,.94), rgba(79,55,48,.96), rgba(58,41,35,.98))` + `backdrop-filter: blur(14px)`.
- Ingredient tile: `rgba(255,255,255,.09)`, обводка `rgba(255,255,255,.18)`, радиус `≈22px`.
- Online-dot: простой круг `≈12px`, зелёный `#35B84A`, светлая обводка `≈2px`; отдельный файл не нужен.
- Pagination dots: CSS-круги; active `rgba(255,255,255,.95)`, inactive `rgba(255,255,255,.38)`.
- Круглые кнопки, карточки, рамки, blur, shadows и все тексты интерфейса **не включены** в растровые ассеты.

## Проверка

- Растры экспортированы в WebP, прозрачные ингредиенты — WebP с альфа-каналом.
- Прозрачные ингредиенты проверены композитом на светлом и тёмном фоне: альфа-канал присутствует, непрозрачной подложки нет.
- SVG парсятся как корректный XML и рендерятся с прозрачным фоном.
- Фотографии сравнивались с видимой композицией на скриншоте; это реконструкции, поэтому мелкие различия фактуры и формы фруктов возможны.

## Публикация Repixel Media

Подключённый публичный медиа-репозиторий — `kiouoi996-commits/Repixel-Previews`; его README описывает репозиторий как отдельное публичное хранилище медиа Repixel. Проект опубликован в `images/apps/berry-balance-smoothie-ui-2026-10-04/`.

- **Immutable asset commit:** `59b10d45814e9073e5b02521bb8964d0d329f61e`
- **Commit:** https://github.com/kiouoi996-commits/Repixel-Previews/commit/59b10d45814e9073e5b02521bb8964d0d329f61e
- **Immutable project folder:** https://github.com/kiouoi996-commits/Repixel-Previews/tree/59b10d45814e9073e5b02521bb8964d0d329f61e/images/apps/berry-balance-smoothie-ui-2026-10-04
- **Branch project folder:** https://github.com/kiouoi996-commits/Repixel-Previews/tree/main/images/apps/berry-balance-smoothie-ui-2026-10-04
- Все 9 растровых ассетов и 17 SVG-иконок проверены через GitHub Contents API на указанном immutable commit; GitHub вернул прямые `download_url` на `raw.githubusercontent.com`.
- `manifest.json`, `analysis.md` и `asset-map.csv` опубликованы рядом с ассетами на ветке `main`; финальная неизменяемая ссылка на manifest фиксируется коммитом метаданных и приводится в итоговом отчёте.
