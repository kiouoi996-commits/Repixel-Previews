# basil-bite-pizza-recipe-ui-2026-10-04 — asset reconstruction analysis

**Source:** 1448×1086 raster screenshot. All measurements below are approximate measurements from that raster, not known source-layout values. Original source assets were unavailable; exported raster files are reconstructions/extractions based on the screenshot.

## Screen segmentation
- **home:** rect ≈ `[68, 89, 401, 899]` px = `[4.7, 8.2, 27.69, 82.78]`% of screenshot (x, y, w, h). Левый экран: каталог/рекомендации/тренды и нижняя навигация.
- **recipe:** rect ≈ `[500, 89, 404, 900]` px = `[34.53, 8.2, 27.9, 82.87]`% of screenshot (x, y, w, h). Центральный экран: Margherita, ингредиенты и шаги приготовления.
- **order:** rect ≈ `[936, 102, 406, 889]` px = `[64.64, 9.39, 28.04, 81.86]`% of screenshot (x, y, w, h). Правый экран: корзина/заказ.

## Raster assets
| File | Role | Visible rect on 1448×1086 | Export | Ratio | Alpha | Object occupancy | Display |
|---|---|---:|---:|---:|---|---|---|
| `avatar-user.webp` | Аватар пользователя | `[405, 128, 39, 39]` ([27.97, 11.79, 2.69, 3.59]%) | 192×192 | 192:192 | yes | 100%×100% | `contain; object-position:center` |
| `category-pizza.webp` | Мини-иллюстрация категории Pizza | `[108, 292, 34, 30]` ([7.46, 26.89, 2.35, 2.76]%) | 256×256 | 256:256 | yes | 78.9%×67.2% | `contain; object-position:center` |
| `category-pasta.webp` | Мини-иллюстрация категории Pasta | `[184, 297, 34, 24]` ([12.71, 27.35, 2.35, 2.21]%) | 256×256 | 256:256 | yes | 89.8%×64.8% | `contain; object-position:center` |
| `category-salad.webp` | Мини-иллюстрация категории Salad | `[258, 296, 34, 25]` ([17.82, 27.26, 2.35, 2.3]%) | 256×256 | 256:256 | yes | 89.8%×59.4% | `contain; object-position:center` |
| `category-soup.webp` | Мини-иллюстрация категории Soup | `[333, 296, 36, 24]` ([23.0, 27.26, 2.49, 2.21]%) | 256×256 | 256:256 | yes | 87.1%×55.9% | `contain; object-position:center` |
| `category-dessert.webp` | Мини-иллюстрация категории Dessert | `[404, 297, 36, 24]` ([27.9, 27.35, 2.49, 2.21]%) | 256×256 | 256:256 | yes | 76.6%×69.9% | `contain; object-position:center` |
| `pizza-margherita-card.webp` | Фото Margherita в Recommended | `[100, 445, 172, 161]` ([6.91, 40.98, 11.88, 14.83]%) | 516×486 | 516:486 | no | 88%×91% | `cover; object-position:50% 50%` |
| `pizza-capricciosa-card.webp` | Фото Capricciosa в Recommended | `[304, 445, 165, 161]` ([20.99, 40.98, 11.4, 14.83]%) | 495×486 | 495:486 | no | 91%×92% | `cover; object-position:50% 50%` |
| `pizza-diavola.webp` | Круглая пицца Diavola в Trending | `[92, 775, 82, 80]` ([6.35, 71.36, 5.66, 7.37]%) | 320×320 | 320:320 | yes | 84.1%×88.1% | `contain; object-position:center` |
| `pizza-quattro-formaggi.webp` | Круглая пицца Quattro Formaggi в Trending | `[193, 775, 80, 80]` ([13.33, 71.36, 5.52, 7.37]%) | 320×320 | 320:320 | yes | 88.1%×81.6% | `contain; object-position:center` |
| `pizza-vegetariana.webp` | Круглая пицца Vegetariana в Trending | `[291, 775, 80, 80]` ([20.1, 71.36, 5.52, 7.37]%) | 320×320 | 320:320 | yes | 88.1%×85.3% | `contain; object-position:center` |
| `pizza-tonno.webp` | Круглая пицца Tonno в Trending | `[392, 775, 77, 80]` ([27.07, 71.36, 5.32, 7.37]%) | 320×320 | 320:320 | yes | 86.2%×88.1% | `contain; object-position:center` |
| `pizza-margherita-hero.webp` | Главный hero-кадр Margherita | `[527, 145, 355, 326]` ([36.4, 13.35, 24.52, 30.02]%) | 1080×1020 | 1080:1020 | no | 79%×84% | `cover; object-position:50% 49%` |
| `ingredient-tomato.webp` | Ингредиент Tomato | `[543, 627, 48, 46]` ([37.5, 57.73, 3.31, 4.24]%) | 384×384 | 384:384 | yes | 90.1%×89.1% | `contain; object-position:center` |
| `ingredient-mozzarella.webp` | Ингредиент Mozzarella | `[633, 627, 50, 45]` ([43.72, 57.73, 3.45, 4.14]%) | 384×384 | 384:384 | yes | 90.1%×81.2% | `contain; object-position:center` |
| `ingredient-basil.webp` | Ингредиент Basil | `[722, 626, 55, 47]` ([49.86, 57.64, 3.8, 4.33]%) | 384×384 | 384:384 | yes | 90.1%×76.3% | `contain; object-position:center` |
| `ingredient-dough.webp` | Ингредиент Dough | `[813, 628, 49, 44]` ([56.15, 57.83, 3.38, 4.05]%) | 384×384 | 384:384 | yes | 90.1%×84.1% | `contain; object-position:center` |
| `step-dough.webp` | Превью шага Prepare the dough | `[800, 771, 80, 40]` ([55.25, 70.99, 5.52, 3.68]%) | 480×288 | 480:288 | no | 100%×100% | `cover; object-position:50% 50%` |
| `step-sauce.webp` | Превью шага Add tomato sauce | `[800, 820, 80, 40]` ([55.25, 75.51, 5.52, 3.68]%) | 480×288 | 480:288 | no | 100%×100% | `cover; object-position:50% 50%` |
| `step-toppings.webp` | Превью шага Add toppings | `[800, 869, 80, 40]` ([55.25, 80.02, 5.52, 3.68]%) | 480×288 | 480:288 | no | 100%×100% | `cover; object-position:50% 50%` |
| `step-bake.webp` | Превью шага Bake for 10 minutes | `[800, 918, 80, 40]` ([55.25, 84.53, 5.52, 3.68]%) | 480×288 | 480:288 | no | 100%×100% | `cover; object-position:50% 50%` |
| `pizza-margherita-thumb.webp` | Миниатюра Margherita в заказе | `[972, 235, 87, 86]` ([67.13, 21.64, 6.01, 7.92]%) | 384×384 | 384:384 | yes | 88.0%×87.5% | `contain; object-position:center` |
| `pizza-capricciosa-thumb.webp` | Миниатюра Capricciosa в заказе | `[972, 366, 88, 86]` ([67.13, 33.7, 6.08, 7.92]%) | 384×384 | 384:384 | yes | 88.0%×86.2% | `contain; object-position:center` |
| `drink-lemonade.webp` | Стакан лимонада в заказе | `[978, 499, 78, 88]` ([67.54, 45.95, 5.39, 8.1]%) | 432×540 | 432:540 | yes | 84.0%×85.9% | `contain; object-position:center` |

### Composition notes
- Hero Margherita keeps its own warm off-white photographic background and the scattered basil/tomato/crumb composition. Its shadow is part of the image, not CSS.
- Recommended-card photos keep their photographic background. Card radius, bookmark, calories/time labels and green plus buttons are UI and are not baked into the files.
- Ingredient/category/cart object files use alpha. The pale ingredient circles and cart thumbnail tiles are UI backplates. Transparent edges were checked on both light and dark backgrounds; small contact shadows are kept with alpha where they visually belong to the object.
- Step images are full rectangular photos; the rounded clipping visible in the UI should be applied by the component (`overflow:hidden; border-radius`).

## SVG icons
| File | Role | Approx visible rect | Geometry | Background |
|---|---|---:|---|---|
| `icons/search.svg` | Поиск | `[113, 217, 22, 22]` | stroke 1.9 px, round; viewBox 0 0 24 24; `currentColor` | none |
| `icons/filter.svg` | Фильтр/слайдеры | `[407, 215, 25, 25]` | stroke 1.8 px, round; viewBox 0 0 24 24; `currentColor` | none |
| `icons/back.svg` | Назад | `[535, 134, 23, 23]` | stroke 1.9 px, round; viewBox 0 0 24 24; `currentColor` | none |
| `icons/more-vertical.svg` | Меню ⋮ | `[856, 132, 13, 28]` | 3 filled dots; viewBox 0 0 24 24; `currentColor` | none |
| `icons/bookmark.svg` | Закладка | `[247, 618, 16, 20]` | stroke 1.7 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/flame.svg` | Калорийность | `[108, 646, 14, 17]` | filled silhouette; viewBox 0 0 24 24; `currentColor` | none |
| `icons/clock.svg` | Время | `[108, 674, 17, 17]` | stroke 1.7 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/chef-hat.svg` | Сложность | `[742, 529, 18, 18]` | filled silhouette; viewBox 0 0 24 24; `currentColor` | none |
| `icons/plus.svg` | Плюс/увеличить количество | `[237, 660, 17, 17]` | stroke 1.9 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/minus.svg` | Минус/уменьшить количество | `[1091, 291, 14, 14]` | stroke 1.9 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/home-filled.svg` | Дом, активный таб | `[103, 942, 19, 21]` | filled; viewBox 0 0 24 24; `currentColor` | none |
| `icons/list.svg` | Список/рецепты | `[184, 942, 18, 21]` | stroke 1.6 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/brand-pizza.svg` | Центральная pizza-марка | `[257, 912, 24, 25]` | filled wedge with cut-out dots; viewBox 0 0 24 24; `currentColor` | none |
| `icons/heart.svg` | Избранное | `[336, 942, 22, 21]` | stroke 1.7 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/profile.svg` | Профиль | `[416, 941, 19, 22]` | stroke 1.6 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/check.svg` | Галочка выполненного шага | `[540, 780, 18, 17]` | stroke 2 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/trash.svg` | Удалить | `[1295, 154, 18, 23]` | stroke 1.6 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/percent.svg` | Промокод | `[985, 644, 19, 22]` | stroke 1.8–2 px; viewBox 0 0 24 24; `currentColor` | none |
| `icons/chevron-right.svg` | Переход вправо | `[1292, 649, 10, 16]` | stroke 1.9 px; viewBox 0 0 24 24; `currentColor` | none |

## UI-only fills, geometry and effects
- Canvas outside phones: approximate `linear-gradient(115deg, #EBF3ED 0%, #F7F0EA 53%, #F6F5E9 100%)`, plus very soft mint/peach/yellow radial haze. This is an estimate from the raster.
- App surfaces: approximately `#FFFEFD`; screen-card corner radius ≈ 34–38 px at screenshot scale; screen shadow ≈ `0 22px 48px rgba(34,70,53,.08)`.
- Primary green ≈ `#2F7051`; CTA/filter surfaces vary around `#2C6C4F…#337A57`; yellow accent ≈ `#FFE06A`.
- Ingredient circles ≈ `#F2F1EB`; light cards use near-white fill and extremely subtle green/gray shadow/border.
- Keep text as live text. No UI labels/prices/buttons are included in raster assets. System status indicators are intentionally absent.

## Repository publication status
Target repository: `kiouoi996-commits/Repixel-Previews`, target folder: `images/reconstructed-apps/basil-bite-pizza-recipe-ui-2026-10-04`. Upload was attempted through the connected GitHub integration, but GitHub returned **403 Resource not accessible by integration** for both Git Data blob creation and Contents API file creation. No repository path or immutable raw URL is claimed as published until permissions are fixed.
