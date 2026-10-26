export const WIDTH = 1440, HEIGHT = 810;
export const clamp = n => Math.min(1, Math.max(0, n));
export const mix = (a, b, p) => a + (b - a) * p;
export const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
export const smoother = p => { p = clamp(p); return p * p * p * (p * (6 * p - 15) + 10); };
export const specs = [
  { number: 190, slug: 'split-portal-scroll', title: 'Split Portal Scroll', mechanism: 'outer-hinged-perspective-panels' },
  { number: 191, slug: 'mosaic-focus-scroll', title: 'Mosaic Focus Scroll', mechanism: 'shared-image-grid-to-viewport' },
];

// Deliberate scroll strokes, pauses and reversal. The final hold is the same
// exact state as the first; the example never jumps between unrelated slides.
export function previewProgress(t) {
  t = ((t % 10) + 10) % 10;
  const stops = [[0, 0], [.65, 0], [2.55, .52], [3.05, .52], [4.65, 1],
    [5.7, 1], [7.05, .56], [7.45, .56], [9.35, 0], [10, 0]];
  for (let i = 1; i < stops.length; i++) {
    const [end, b] = stops[i], [start, a] = stops[i - 1];
    if (t <= end) return mix(a, b, smooth((t - start) / (end - start)));
  }
  return 0;
}

function type(ctx, text, x, y, size, { color = '#F2F0E8', serif = false, weight = 400, align = 'left', alpha = 1 } = {}) {
  ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${serif ? '"Instrument Serif"' : '"Inter"'}`;
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, y); ctx.restore();
}
function line(ctx, x1, y1, x2, y2, color = '#F2F0E840', width = 1) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function rounded(ctx, x, y, w, h, r = 12) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}
function cover(ctx, image, x, y, w, h, crop = [0, 0, 1, 1], zoom = 1) {
  const iw = image.width * crop[2], ih = image.height * crop[3];
  const scale = Math.max(w / iw, h / ih) * zoom;
  const sw = w / scale, sh = h / scale;
  ctx.drawImage(image, image.width * crop[0] + (iw - sw) / 2,
    image.height * crop[1] + (ih - sh) / 2, sw, sh, x, y, w, h);
}
function shade(ctx, x, y, w, h, strength) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.4, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${strength})`); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
function footer(ctx, progress, light = true) {
  const color = light ? '#E7E7DB' : '#20241D';
  type(ctx, 'SCROLL TO EXPLORE', 52, 778, 15, { color });
  type(ctx, '↕', 251, 779, 21, { color });
  line(ctx, 1118, 771, 1318, 771, light ? '#FFFFFF40' : '#20241D40', 2);
  line(ctx, 1118, 771, 1118 + 200 * clamp(progress), 771, color, 2);
  type(ctx, String(Math.round(progress * 100)).padStart(3, '0'), 1388, 778, 15, { color, align: 'right' });
}

export function makeTextures(createSurface) {
  return [0, 1].map(side => {
    const c = createSurface(664, 610), ctx = c.getContext('2d');
    const ink = '#242820'; ctx.fillStyle = side ? '#C3CBB4' : '#ECE8DD'; ctx.fillRect(0, 0, 664, 610);
    type(ctx, side ? '02 — SEE WHAT OPENS' : '01 — MAKE SOME ROOM', 44, 51, 15, { color: ink });
    line(ctx, 44, 77, 620, 77, '#24282035');
    type(ctx, side ? 'space.' : 'Open', 44, 335, 154, { color: ink, serif: true });
    type(ctx, side ? 'A different point of view.' : 'A small shift in perspective.', 46, 391, 19, { color: ink });
    ctx.strokeStyle = '#242820'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(side ? 582 : 82, 520, 34, 0, Math.PI * 2); ctx.stroke();
    const sign = side ? 1 : -1, cx = side ? 582 : 82;
    line(ctx, cx - sign * 12, 520, cx + sign * 12, 520, ink, 1.5);
    line(ctx, cx + sign * 12, 520, cx + sign * 4, 512, ink, 1.5);
    line(ctx, cx + sign * 12, 520, cx + sign * 4, 528, ink, 1.5);
    type(ctx, 'NATIVE SCROLL / CONTINUOUS DEPTH', side ? 46 : 616, 574, 12, { color: '#454A3E', align: side ? 'left' : 'right' });
    return c;
  });
}

function panel(ctx, texture, side, theta) {
  const hinge = side ? 1384 : 56, sign = side ? -1 : 1;
  const at = (u, v) => {
    const x = hinge + sign * u * Math.cos(theta), z = u * Math.sin(theta), scale = 1800 / (1800 - z);
    return { x: 720 + (x - 720) * scale, y: 415 + (110 + v - 415) * scale };
  };
  const inner = at(664, 305); if (sign * (inner.x - hinge) <= 0) return;
  const a = at(0, 0), b = at(664, 0), c = at(664, 610), d = at(0, 610);
  ctx.save(); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.clip();
  if (theta < .00001) ctx.drawImage(texture, side ? 720 : 56, 110);
  else for (let col = 0; col < 240; col++) {
    const u = col * 664 / 240, sw = 664 / 240;
    const first = at(u, 305), second = at(u + sw, 305), top = at(u + sw / 2, 0), bottom = at(u + sw / 2, 610);
    const left = Math.min(first.x, second.x), dw = Math.abs(first.x - second.x);
    const sx = side ? 664 - u - sw : u;
    // One source crop per column avoids alpha cracks along triangle diagonals.
    ctx.drawImage(texture, Math.max(0, sx - .4), 0, Math.min(664 - Math.max(0, sx - .4), sw + .8), 610,
      left - .35, top.y - 1, dw + .7, bottom.y - top.y + 2);
  }
  ctx.restore();
  ctx.fillStyle = `rgba(25,30,22,${.16 * Math.sin(theta)})`; ctx.beginPath();
  ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill();
  line(ctx, b.x, b.y, c.x, c.y, '#33382D', 2);
}
function portal(ctx, p, assets, calm) {
  const s = smoother((p - .08) / .78);
  ctx.fillStyle = '#181B17'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  type(ctx, 'OPEN / FORM', 56, 57, 23, { weight: 500 });
  type(ctx, 'A STUDY IN PERSPECTIVE', 720, 55, 14, { align: 'center', color: '#AFB3A7' });
  type(ctx, 'SCROLL STUDY 01', 1384, 55, 14, { align: 'right' });
  ctx.save(); rounded(ctx, 56, 110, 1328, 610, 8); ctx.clip();
  cover(ctx, assets.photos[0], 56, 110, 1328, 610, undefined, calm ? 1 : mix(1.12, 1, s));
  shade(ctx, 56, 110, 1328, 610, .56);
  const textAlpha = smooth((p - .48) / .30);
  type(ctx, 'Room to think.', 106, 622 + (calm ? 0 : 30 * (1 - textAlpha)), 105, { serif: true, alpha: textAlpha });
  type(ctx, 'The view was here all along.', 111, 669, 21, { alpha: textAlpha });
  type(ctx, 'COURTYARD / 001', 1331, 665, 14, { align: 'right', alpha: textAlpha });
  if (calm) { ctx.globalAlpha = 1 - s; ctx.drawImage(assets.textures[0], 56, 110); ctx.drawImage(assets.textures[1], 720, 110); }
  else { panel(ctx, assets.textures[0], 0, s * Math.PI / 2); panel(ctx, assets.textures[1], 1, s * Math.PI / 2); }
  ctx.restore(); footer(ctx, p);
}

function mosaic(ctx, p, assets, calm) {
  const s = smoother((p - .08) / .82), leave = smooth(s / .66), enter = smooth((s - .62) / .38);
  ctx.fillStyle = '#191C19'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save(); ctx.globalAlpha = 1 - leave;
  const dy = calm ? 0 : -150 * s;
  type(ctx, 'FIELDWORK', 52, 53 + dy, 23, { weight: 500 });
  type(ctx, 'SELECTED PLACES / 2026', 1388, 51 + dy, 14, { align: 'right', color: '#BFC3B6' });
  type(ctx, 'A wider perspective.', 52, 181 + dy, 103, { serif: true });
  ctx.restore();
  const tiles = [
    { image: 1, x: 52, y: 236, w: 328, h: 236, dx: -600, dy: -160, label: '01 / HORIZON', crop: [0, 0, 1, .40] },
    { image: 2, x: 52, y: 488, w: 328, h: 262, dx: -600, dy: 170, label: '02 / STILL WATER' },
    { image: 3, x: 1020, y: 236, w: 368, h: 514, dx: 600, dy: 0, label: '04 / SOFT LIGHT' },
  ];
  for (const a of tiles) {
    ctx.save(); ctx.globalAlpha = calm ? 1 - s : 1 - smooth((s - .38) / .40);
    const k = calm ? 1 : mix(1, .84, s), x = a.x + (calm ? 0 : a.dx * s), y = a.y + (calm ? 0 : a.dy * s);
    rounded(ctx, x, y, a.w * k, a.h * k, 5); ctx.clip();
    cover(ctx, assets.photos[a.image], x, y, a.w * k, a.h * k, a.crop); shade(ctx, x, y, a.w * k, a.h * k, .35);
    type(ctx, a.label, x + 18, y + a.h * k - 20, 12); ctx.restore();
  }
  const x = calm ? 396 : mix(396, 0, s), y = calm ? 236 : mix(236, 0, s);
  const w = calm ? 608 : mix(608, 1440, s), h = calm ? 514 : mix(514, 810, s);
  ctx.save(); rounded(ctx, x, y, w, h, calm ? 5 : mix(5, 0, s)); ctx.clip();
  cover(ctx, assets.photos[0], x, y, w, h); shade(ctx, x, y, w, h, mix(.2, .52, enter));
  type(ctx, '03 / THE COURTYARD', x + 22, y + h - 22, 13, { alpha: 1 - enter });
  if (!calm) {
    type(ctx, 'Closer to calm.', 72, 664 + 28 * (1 - enter), 108, { serif: true, alpha: enter });
    type(ctx, 'A place worth a closer look.', 77, 708, 21, { alpha: enter });
  }
  ctx.restore();
  if (calm) {
    ctx.save(); ctx.globalAlpha = enter; cover(ctx, assets.photos[0], 0, 0, 1440, 810); shade(ctx, 0, 0, 1440, 810, .52);
    type(ctx, 'Closer to calm.', 72, 664, 108, { serif: true }); type(ctx, 'A place worth a closer look.', 77, 708, 21); ctx.restore();
  }
  type(ctx, 'FIELDWORK / 03', 56, 55, 20, { alpha: enter });
  type(ctx, 'THE COURTYARD', 1384, 54, 14, { align: 'right', alpha: enter });
  footer(ctx, p);
}
export function renderScene(ctx, number, progress, assets, { calm = false } = {}) {
  ctx.save(); ctx.clearRect(0, 0, WIDTH, HEIGHT); ctx.imageSmoothingEnabled = true;
  (number === 190 ? portal : mosaic)(ctx, clamp(progress), assets, calm); ctx.restore();
}
