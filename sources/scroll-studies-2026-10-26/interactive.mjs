import { WIDTH, HEIGHT, clamp, makeTextures, previewProgress, renderScene } from './scene.mjs';

const canvas = document.querySelector('canvas'), context = canvas.getContext('2d');
const story = document.querySelector('.story'), range = document.querySelector('#progress');
const replay = document.querySelector('#replay'), calmInput = document.querySelector('#calm');
const status = document.querySelector('#status'), number = Number(document.body.dataset.study);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
calmInput.checked = reduced.matches;
let raf = 0, demo = false, demoStart = 0, demoElapsed = 0, last = -1;
const assets = await (await fetch(new URL('./assets.json', import.meta.url))).json();
async function loadImage(url) {
  const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url;
  await img.decode(); return img;
}
try {
  const fontFaces = await Promise.all(assets.fonts.map(async f => {
    const face = new FontFace(f.family, `url(${f.url})`); await face.load(); document.fonts.add(face); return face;
  }));
  const photos = await Promise.all(assets.photos.map(a => loadImage(a.url)));
  const textures = makeTextures((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
  const ready = { photos, textures, fontFaces };
  const distance = () => Math.max(1, story.offsetHeight - story.querySelector('.stage').offsetHeight);
  const current = () => clamp((window.scrollY - story.offsetTop + 64) / distance());
  function paint(p, force = false) {
    if (!force && Math.abs(p - last) < .00005) return;
    last = p; renderScene(context, number, p, ready, { calm: calmInput.checked });
    range.value = String(Math.round(p * 1000));
    range.setAttribute('aria-valuetext', `${Math.round(p * 100)} percent through the transition`);
    status.textContent = demo ? 'Preview replay · use the wheel to take control' : 'Scroll down or up · the transition follows your position';
  }
  function requestPaint() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(() => { raf = 0; paint(current()); });
  }
  function stopDemo() {
    demo = false; replay.textContent = 'Replay preview';
    if (raf) cancelAnimationFrame(raf); raf = 0; requestPaint();
  }
  function tick(now) {
    raf = 0; if (!demo || document.hidden) return;
    demoElapsed = now - demoStart;
    if (demoElapsed >= 10000) { window.scrollTo({ top: 0, behavior: 'instant' }); stopDemo(); return; }
    const p = previewProgress(demoElapsed / 1000);
    window.scrollTo({ top: p * distance(), behavior: 'instant' }); paint(p);
    raf = requestAnimationFrame(tick);
  }
  function playDemo() {
    if (demo) { stopDemo(); return; }
    demo = true; demoStart = performance.now(); demoElapsed = 0; replay.textContent = 'Pause replay';
    if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  const resize = new ResizeObserver(() => {
    // The same canonical coordinate system is used by the video renderer.
    const dpr = Math.min(2, window.devicePixelRatio || 1), bounds = canvas.getBoundingClientRect();
    const scale = Math.min(2, Math.max(.25, bounds.width * dpr / WIDTH));
    canvas.width = Math.round(WIDTH * scale); canvas.height = Math.round(HEIGHT * scale);
    context.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
    paint(current(), true);
  });
  resize.observe(canvas);
  window.addEventListener('scroll', requestPaint, { passive: true });
  for (const event of ['wheel', 'touchstart']) window.addEventListener(event, () => { if (demo) stopDemo(); }, { passive: true });
  window.addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key) && demo) stopDemo();
  });
  range.addEventListener('input', () => { stopDemo(); window.scrollTo({ top: Number(range.value) / 1000 * distance(), behavior: 'instant' }); requestPaint(); });
  replay.addEventListener('click', playDemo);
  calmInput.addEventListener('change', () => paint(current(), true));
  reduced.addEventListener('change', event => { calmInput.checked = event.matches; if (event.matches) stopDemo(); paint(current(), true); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
    else if (demo) { demoStart = performance.now() - demoElapsed; raf = requestAnimationFrame(tick); }
    else requestPaint();
  });
  window.addEventListener('pagehide', () => { stopDemo(); resize.disconnect(); });
  paint(current(), true); replay.disabled = false; range.disabled = false;
  if (new URLSearchParams(location.search).get('demo') === '1' && !reduced.matches) playDemo();
} catch (error) {
  status.textContent = 'The visual assets could not load. Reload this example to try again.';
  console.error('Scroll example asset load failed', error);
}
