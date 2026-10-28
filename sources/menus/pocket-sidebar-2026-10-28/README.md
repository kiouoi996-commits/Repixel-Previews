# Pocket Sidebar

An embeddable native Web Component with saved products, attribute comparison and an independent bag. The sample FORMA shop is a host example. Do not replace a client's real page with it.

## Files

Copy `pocket-sidebar.mjs`, `model.mjs`, `icons.mjs`, `pocket.css` and `assets.json` into the same folder on the host's own origin. Serve modules with a JavaScript MIME type. Load `pocket-sidebar.mjs` as a module and mount one `pocket-sidebar` element. The custom element scopes its styles with Shadow DOM; `shop.css` and `shop.mjs` belong only to the example shop.

Call its asynchronous `configure` method with `{products, storageKey, savedIds, bag}` after mounting. Products require a unique string `id`, `name`, nonnegative numeric `price`, and an HTTPS or same-origin `image` URL. Optional `material`, `dimensions`, `finish`, `category` and `description` fields supply comparison and host detail views. The example host seeds its three products explicitly. A new host integration starts empty unless `savedIds` and `bag` are provided. Existing persisted version-1 state takes precedence over these seeds. Use a unique storage key per store/account. Version-1 persisted data is filtered against the current catalog, saved IDs are deduplicated and quantities accept only integers 1–99. The sample currency formatter is USD; integrate the host's existing currency and localization rules. No purchase or payment request is made by the component.

## Public operations

- `save(id, {reveal: true})` saves an existing product and optionally opens Saved; duplicate IDs do not create duplicate cards.
- `addToBag(id)` increases that product's independent bag quantity.
- `close()` closes the panel while keeping its contents and selected view.
- `showCollection()` opens the saved collection dialog.
- `replay()` is an explicit ten-second example input sequence; do not run it automatically in a real store.

## Events

All public events bubble and cross the shadow boundary. `pocket:change` contains copied saved IDs and bag quantities. `pocket:navigate` contains `destination` (`discover` or `objects`) for the real host router. `pocket:bag` contains the product ID and current quantity. `pocket:collection` opens the local collection and permits host analytics or integration. `pocket:checkout` contains `items` (`id`, `quantity`, `unitPrice`), `total` and `currency`; connect this to the real cart/checkout. `pocket:resize` exposes `reserved`, `mobile` and displayed opening `progress`. The host decides how to reserve desktop space. On small screens use an overlay and mark background content inert for the open modal. The example host does this without unmounting its content.

For drag-and-drop, mark actual host product cards draggable and set only a known product ID in `application/x-pocket-product`. Use `effectAllowed=copy`. The component checks its own product records before accepting a drop. External files and unknown IDs are ignored. Mobile and keyboard users can use the equivalent visible Save button. Saved objects are separate from bag objects; removing one does not remove the other.

## Motion and semantics

The component uses native navigation buttons, saved article cards, a real comparison table and native modal dialogs. The panel and one shared selected-view marker follow interruptible springs. Surviving cards use their current measured rectangles for reflow. Dead cards are removed from the focus order immediately. The modal mobile panel traps focus, supports Escape and returns focus to its navigation control. Avoid nested modals in host integrations. The host must make background content inert while the mobile panel is open. Reduced-motion preferences settle panel and marker immediately and skip list/mode travel. Animation frames stop when settled or hidden; replay cancels on user input and visibility loss. A disconnect cancels animation frames, event subscriptions and timers.

Desktop reference plane:1600×1000. Sidebar left28/top18; rail94; gap10; panel420; host content starts584. Desktop scale is the minimum of1, viewportWidth/1600 and viewportHeight/1000. At widths below850 the rail is76px at left12 and the panel begins at100px, scales to viewportWidth−112 and overlays the host. Product buttons have at least44px targets. The preview's background, FORMA branding, heading and hero are host example content.

The deterministic video is an authored reconstruction of the native UI, using the same product records, input actions and spring integrator. It is not a browser screen recording. Its 300 source frames loop back to identical initial source pixels; H.264 encoding is lossy. All photos were generated separately from the approved design and have actual alpha channels; the approved design and private Drive style reference are not redistributed as runtime assets.
