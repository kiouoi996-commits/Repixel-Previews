// The demo and the offline renderer call this same deterministic SVG function.
export const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const smooth = x => { const q = clamp(x); return q * q * (3 - 2 * q); };
export const smoother = x => { const q = clamp(x); return q ** 3 * (q * (q * 6 - 15) + 10); };
const f = n => Number(n.toFixed(5));

export function renderSvg(geometry, params, seconds, mode = 'gallery', reducedMotion = false) {
  let entryTime = seconds;
  let staticOpacity = null;
  if (reducedMotion) staticOpacity = 1;
  else if (mode === 'gallery') {
    const t = ((seconds % params.durationSeconds) + params.durationSeconds) % params.durationSeconds;
    if (t <= params.galleryHoldEnd) staticOpacity = 1;
    else if (t < params.galleryResetEnd) staticOpacity = 1 - smooth((t - params.galleryHoldEnd) / (params.galleryResetEnd - params.galleryHoldEnd));
    else if (t < params.galleryEntryStart) staticOpacity = 0;
    entryTime = t - params.galleryEntryStart;
  }
  const defs = [];
  const body = [];
  geometry.composition.lines.forEach((line, i) => {
    const paths = line.glyphs.map(g => `<path d="${g.d}" fill="${g.fill}"/>`).join('');
    if (staticOpacity !== null) {
      body.push(`<g opacity="${f(staticOpacity)}">${paths}</g>`);
      return;
    }
    const q = clamp((entryTime - i * params.lineDelay) / params.entryDuration);
    if (q <= 0) return;
    if (q >= 1) { body.push(paths); return; }
    const [left, top, right, bottom] = line.bounds;
    const xBase = left - params.frontPadding + (right - left + 2 * params.frontPadding) * smoother(q);
    const amplitude = params.waveAmplitude * Math.sin(Math.PI * q) ** 2;
    const frontAt = y => xBase + amplitude * Math.sin(2 * Math.PI * (y - top) / params.waveWavelength - 2 * Math.PI * q);
    const topY = top - params.maskVerticalPadding;
    const bottomY = bottom + params.maskVerticalPadding;
    const points = [];
    for (let y = topY; y < bottomY; y += params.maskSampleStep) points.push([frontAt(y), y]);
    points.push([frontAt(bottomY), bottomY]);
    const d = `M${f(left - 64)} ${f(topY)} ` + points.map(([x,y]) => `L${f(x)} ${f(y)}`).join(' ') + ` L${f(left - 64)} ${f(bottomY)}Z`;
    const clipId = `liquid-line-${i}`;
    defs.push(`<clipPath id="${clipId}" clipPathUnits="userSpaceOnUse"><path d="${d}"/></clipPath>`);
    const outlineOpacity = params.outlineOpacity * smooth(q / params.outlineFadeInProgress) * (1 - smooth((q - params.outlineFadeOutStart) / (1 - params.outlineFadeOutStart)));
    body.push(`<g fill="none" opacity="${f(outlineOpacity)}" stroke-width="${params.outlineWidth}" stroke-linejoin="round">` + line.glyphs.map(g => `<path d="${g.d}" stroke="${g.fill}"/>`).join('') + '</g>');
    body.push(`<g clip-path="url(#${clipId})">${paths}</g>`);
  });
  const [cx,cy] = params.scaleOrigin;
  const transform = `translate(${cx} ${cy}) scale(${params.scale}) translate(${-cx} ${-cy})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${params.width}" height="${params.height}" viewBox="0 0 ${params.width} ${params.height}" role="img" aria-labelledby="headline-title"><title id="headline-title">THE INSIDE LOOK® — Liquid Ink Reveal</title><rect width="100%" height="100%" fill="${geometry.background}"/><defs>${defs.join('')}</defs><g transform="${transform}">${body.join('')}</g></svg>`;
}
