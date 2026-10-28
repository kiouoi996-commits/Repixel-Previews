# Approved controls: Solar, Paper Bookmarks, File Pocket and Trip Dates

Four separately approved generated screens become native interactive Web Components. The stills establish the appearance; the movement and unshown states are authored. Fonts are named licensed implementation matches, not asserted identities of the unknown fonts originally generated in the screenshots. The book illustration, glass pocket and coastal photograph are separate generated assets. Original private Drive references and full approved screenshots are not runtime backgrounds.

Copy `component.mjs`, `model.mjs`, `scene.mjs` and `assets.json` into one same-origin folder and serve modules with a JavaScript MIME type. Load `component.mjs`, mount one `approved-control` with kind `solar`, `bookmarks`, `pocket` or `dates`, and size it in the host layout. The component scopes its native controls with Shadow DOM. The decorative canvas is not the accessibility surface. Do not copy the fullscreen demo stage, comparison grid or Replay/Reset footer into a client's product.

## Solar

The dial has a real native range input, pointer capture for angular dragging, integer0–100 bounds, visible focus and a separate mute button. Mute retains the previous level. Changing the level to a positive number unmutes it. `volume:change` and `volume:commit` expose value/muted state. `configure({media})` accepts a real HTMLMediaElement, sets its volume/muted properties and listens for external volume changes. It never starts that media automatically. The isolated demo's explicit Test sound button creates a quiet local Web Audio tone only after user activation, and the dial controls its real gain. Stop sound stops the tone; pagehide cleans it up. Client audio/device policies may limit programmatic volume.

## Paper Bookmarks

Supply one to three unique records with id, title and a positive page through `configure({items,onNavigate})`. Selection is by stable identity, with a native radio group, roving focus, Arrow/Home/End keys and native Enter/Space activation. The rose highlight travels between rows; text and the hit regions stay still. Escape/outside input closes the nonmodal popover, and its Open bookmarks trigger restores it. Escape returns focus to that trigger. `bookmark:select` reports selection. Back to reading calls the host callback once, or emits `bookmark:navigate` when no callback is configured. The public fixture opens a real native reading dialog containing its selected short original excerpt. It does not claim to fetch a book or change a client's reader route.

## File Pocket

The native file input and drag/drop accept up to three non-empty PDF/PNG/JPEG files, at most20MiB each. Extensions, supplied MIME types and short file signatures are checked; this is a header/type check, not antivirus scanning or full document parsing. Validation failures retain existing accepted files and explain the error. Repeated selections of the same name/size/lastModified do not duplicate it. The glass and document layers remain independent during the drop.

Below520px native width, the file panel reflows to a640×910 plane with a full-width action and readable captions.

The default component holds File objects in browser memory and reports them as ready locally. Review files opens a native dialog, offers genuine Blob downloads, previews accepted images and supports removal. Blob URLs are revoked on removal/reset/disconnect. Nothing is uploaded by default. `configure({onUpload})` enables a real host upload action in that dialog; the callback receives the File array plus AbortSignal and onProgress(received,total). Only its resolved response emits `files:uploaded`. Known progress is monotonic; unknown progress remains indeterminate. Duplicate submission/removal is blocked during upload. Reset/disconnect abort supported work and generation guards ignore obsolete callbacks. Client abort cannot prove a server rollback. Preserve host authorization, endpoints, idempotency and reconciliation. `files:change` reports the actual File objects.

The isolated Try sample PDF action creates a complete645-byte PDF locally using `sample-file.mjs` and feeds that real File through the same validation path. It sends no network request. The native file chooser remains available for actual user files.

## Trip Dates

The visible calendar is one week, not a full month. Previous/Next move seven UTC calendar days. Choose arrival then a different departure; reverse selection is normalized chronologically. Apply is unavailable for an incomplete range. It emits `dates:apply` with ISO start/end dates and a UTC calendar-night count; it does not book, charge or assert remote availability. `configure({range,onApply,isDateDisabled})` supplies actual host dates, callback and availability predicate. Apply checks every date in the selected range. The demonstration intentionally starts with the approved September17–20,2026 example instead of changing that design to today's dates.

Seven native day buttons expose full date names and selection. Left/Right/Home/End/PageUp/PageDown move focus, crossing week boundaries when needed; Enter/Space selects. At widths below336px the seven days wrap into four plus three columns. All hit targets remain at least44×44 CSS pixels while the typography, photographic header and footer preserve their visual hierarchy. The draft range stays separate from its applied payload.

## Motion, lifecycle and movies

The components stop frames at rest and while hidden. Reduced motion skips interpolation and decorative replay while preserving all real actions. Disconnect removes observers/listeners, cancels frames and supported work, and releases local media/Blob resources. Replay is explicit, cancels on real input/hide and changes no actual volume, selection, File array or applied range. It invokes no host callback, uploads/downloads nothing and starts no audio.

`scene.mjs` drives both the live decorative layers and the deterministic native movie painter. Each authored nine-second1280×800,30fps film has270 source frames, no audio and identical first/last source pixels. H.264 is lossy; decoded pixel equality is not claimed. Curved pointer transfers include pauses, presses, acceleration and braking. The movie inputs/progress are authored demonstration data, not a recovered animation or a browser recording. Book closing/reopening uses an authored Escape/trigger sequence; actual reader navigation remains the host's responsibility.

Authoring helpers are in `tools/approved-controls/`. Restore those paths and `public/effects/approved-controls-2026-10-28/` before reproducing. Download assets.json resources into the sibling controls-media/assets folder and save its metadata as controls-media/asset-manifest.json. The renderer requires @napi-rs/canvas, sharp, FFmpeg and the pinned assets; it rejects abnormal font metrics. Tests cover volume/mute, stable bookmark identity, file signatures/limits, UTC/date-range boundaries and matching preview endpoints. The browser checks cover native interaction and responsive layouts.
