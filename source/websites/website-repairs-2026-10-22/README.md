# Bloom and Sakura: verified reconstruction V2

This kit repairs the two existing Repixel website prompts while retaining their original preview images and card IDs. The HTML files are complete live DOM implementations, not screenshots. Download a reference HTML into your project and adapt its native sections, SVG text, controls and image paths; do not embed it as an iframe. The separate CSS, runtime module and layout contract record the same parameters.

Desktop control plane: 941px wide, total height 1672px. Each section is in normal flow and scales with the full available viewport width; element boxes are local to their section. At <=900px, the explicit mobile CSS uses normal document flow and pairs photographs with captions. No 941px global page width or global transform scaling is used.

Typography: Cormorant Garamond400/500 for editorial headings, Cormorant700 for all giant display words, Inter400/500 for utility/body, and Caveat400 for Sakura script accents. Source font identity is not confirmed. Each giant word/glyph uses the fixed optical box and measured ink matrix, live SVG text and font-kerning:none. Instrument Serif400 from the previous prompt is deliberately excluded from the revised display roles because its strokes were too light.

Clean media are pinned to commit1dc9d84437915f1eb247163f47ac35723b0bebbd in images/websites/website-repairs-2026-10-22. The two RGBA files preserve real transparency. They are AI-assisted reconstructions from the preview and damaged cutouts, not original photographic exports. Sakura atmosphere contains only artwork, no type, controls, framed photographs or central subjects. It retains the foliage, landscape and decorative placement. The subject sprite is isolated into three independent inline SVG images using foreground-map.json. PNG bytes remain unchanged; vector clipping prevents contamination by adjacent subjects. Old contaminated alpha cutouts and RGB scene patches are not runtime resources.

The old clean floral photos, exact destination crops, experience crops, route crops and supplied fonts retain their pinned original URLs. Hidden parts of experience labels and overlapping route photos cannot be recovered from the source screenshot. The live labels, fixed stacking and explicit clips cover those original overlap regions. Route photo movement must not reveal them.

GSAP3.13.0, Lenis1.3.11 and SplitType0.3.4 distributions are included inline in both HTMLs and separately under vendor with source/license notices. Header entry and heading reveals enhance a visible static layout. Reduced motion tears down motion and leaves final content visible. Lenis uses one GSAP ticker on desktop; mobile scroll is native.

Menu works with native dialog, Escape and focus restoration. Sakura trip form saves a browser-local draft only; no booking or message is sent. Bloom Cart starts empty. Photographs are editorial content; the kit invents no product inventory. Social/contact hrefs must be supplied by the product owner.

Verification: original 941px geometry and five viewport widths per page, no horizontal overflow, transparent layer checks, mobile menu/escape and exact public resource bytes. Browser versions and AI implementations can differ; verify the final rendered result rather than promising universal pixel identity.
