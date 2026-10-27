export const WIDTH = 1440, HEIGHT = 810;
export const portalGeometry = { x: 58, y: 101, width: 1324, height: 611, panelWidth: 654, gap: 16 };
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

function type(ctx, text, x, y, size, { color = '#F4F2E9', serif = false, weight = 400, align = 'left', alpha = 1 } = {}) {
  ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${serif ? '"Bodoni Moda"' : weight >= 700 ? '"Inter Display"' : '"Inter"'}`;
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, y);
  const width = ctx.measureText(text).width; ctx.restore(); return width;
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
  const color = light ? '#BEC2C9' : '#20241D';
  type(ctx, 'SCROLL TO EXPLORE', 50, 773, 15, { color });
  line(ctx, 1114, 768, 1334, 768, '#555961AA', 2);
  line(ctx, 1114, 768, 1114 + 54 + 166 * clamp(progress), 768, '#FFED59', 2);
  type(ctx, String(Math.round(progress * 100)).padStart(3, '0'), 1392, 774, 15, { color, align: 'right' });
}

function field(ctx, base = '#121416') {
  ctx.fillStyle = base; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = ctx.createRadialGradient(720, 360, 80, 720, 405, 940);
  glow.addColorStop(0, '#272B3033'); glow.addColorStop(1, '#00000070');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
function arrow(ctx, cx, cy, radius, { filled = false, left = false, warm = false, outline = true } = {}) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = filled ? warm ? '#FCE485' : '#FEEA43' : '#35393F80'; ctx.fill();
  if (!filled && outline) { ctx.lineWidth = 1; ctx.strokeStyle = '#C0C3CAAA'; ctx.stroke(); }
  const color = filled ? '#15181B' : '#FAFAF6', sign = left ? -1 : 1;
  line(ctx, cx - sign * 12, cy, cx + sign * 12, cy, color, 2);
  line(ctx, cx + sign * 12, cy, cx + sign * 3, cy - 9, color, 2);
  line(ctx, cx + sign * 12, cy, cx + sign * 3, cy + 9, color, 2); ctx.restore();
}
function badge(ctx, number, label, x, y, w, h, active = false) {
  type(ctx, number, x + 20, y + h - 25, 21, { color: '#FEEA43', weight: 800 });
  line(ctx, x + 61, y + h - 43, x + 61, y + h - 22, '#F4F4F180', 1);
  type(ctx, label, x + 80, y + h - 27, 14, { color: '#F9F9F6', weight: 500 });
  arrow(ctx, x + w - 42, y + h - 53, active ? 28 : 26, { filled: active });
}

export function makeTextures(createSurface) {
  return [0, 1].map(side => {
    const c = createSurface(654, 611), ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 654, 611);
    g.addColorStop(0, '#22262A'); g.addColorStop(.55, '#202428'); g.addColorStop(1, '#191D21');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 654, 611);
    ctx.beginPath(); ctx.arc(850, side ? 737 : 790, side ? 635 : 590, 0, Math.PI * 2);
    const arc = ctx.createLinearGradient(260, 230, 654, 611);
    arc.addColorStop(0, side ? '#2A2F36' : '#5A503A'); arc.addColorStop(1, side ? '#242930' : '#292C29');
    ctx.fillStyle = arc; ctx.globalAlpha = side ? .72 : .38; ctx.fill();
    ctx.globalAlpha = .55; ctx.strokeStyle = side ? '#626874' : '#8A7743'; ctx.lineWidth = .7; ctx.stroke(); ctx.globalAlpha = 1;
    const light = ctx.createRadialGradient(420, 340, 40, 330, 320, 500);
    light.addColorStop(0, '#FFFFFF06'); light.addColorStop(1, '#FFFFFF00'); ctx.fillStyle = light; ctx.fillRect(0, 0, 654, 611);
    type(ctx, side ? '02' : '01', 38, 54, 16, { color: '#D5D9DF' });
    type(ctx, side ? 'SEE WHAT OPENS' : 'MAKE SOME ROOM', 92, 54, 16, { color: '#D5D9DF' });
    line(ctx, 38, 79, 616, 79, '#ABB0B740');
    type(ctx, side ? 'space.' : 'Open', 38, 330, 155, { color: '#F8F4E9', serif: true });
    type(ctx, side ? 'A different point of view.' : 'A small shift in perspective.', 38, 402, 22, { color: '#C8CBD0' });
    arrow(ctx, side ? 578 : 76, 530, 38, { filled: side === 1, warm: true, left: side === 0, outline: false });
    type(ctx, 'NATIVE SCROLL / CONTINUOUS DEPTH', side ? 38 : 616, 579, 12, { color: '#BEC2CA', align: side ? 'left' : 'right' });
    return c;
  });
}

function panel(ctx, texture, side, theta) {
  const hinge = side ? 1382 : 58, sign = side ? -1 : 1;
  const at = (u, v) => {
    const x = hinge + sign * u * Math.cos(theta), z = u * Math.sin(theta), scale = 1800 / (1800 - z);
    return { x: 720 + (x - 720) * scale, y: 406.5 + (101 + v - 406.5) * scale };
  };
  const inner = at(654, 305.5); if (sign * (inner.x - hinge) <= 0) return;
  const a = at(0, 0), b = at(654, 0), c = at(654, 611), d = at(0, 611);
  ctx.save(); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.clip();
  if (theta < .00001) ctx.drawImage(texture, side ? 728 : 58, 101);
  else for (let col = 0; col < 240; col++) {
    const u = col * 654 / 240, sw = 654 / 240;
    const first = at(u, 305.5), second = at(u + sw, 305.5), top = at(u + sw / 2, 0), bottom = at(u + sw / 2, 611);
    const left = Math.min(first.x, second.x), dw = Math.abs(first.x - second.x);
    const sx = side ? 654 - u - sw : u;
    // One source crop per column avoids alpha cracks along triangle diagonals.
    ctx.drawImage(texture, Math.max(0, sx - .4), 0, Math.min(654 - Math.max(0, sx - .4), sw + .8), 611,
      left - .35, top.y - 1, dw + .7, bottom.y - top.y + 2);
  }
  ctx.restore();
  ctx.fillStyle = `rgba(0,0,0,${.12 * Math.sin(theta)})`; ctx.beginPath();
  ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill();
  if (theta > .00001) line(ctx, b.x, b.y, c.x, c.y, '#40454D', 1);
}
function portal(ctx, p, assets, calm) {
  const s = smoother((p - .08) / .78);
  field(ctx, '#15181B');
  const logoWidth = type(ctx, 'OPEN', 55, 58, 24, { weight: 800, color: '#F3F4F4' });
  type(ctx, ' / FORM', 55 + logoWidth, 58, 24, { color: '#969DA6' });
  type(ctx, 'A STUDY IN PERSPECTIVE', 720, 55, 15, { align: 'center', color: '#BEC3CB' });
  type(ctx, 'SCROLL STUDY 01', 1384, 55, 15, { align: 'right', color: '#BEC3CB' });
  ctx.save(); rounded(ctx, 58, 101, 1324, 611, 0); ctx.clip();
  cover(ctx, assets.photos[0], 58, 101, 1324, 611, undefined, calm ? 1 : mix(1.12, 1, s));
  shade(ctx, 58, 101, 1324, 611, .56);
  ctx.save(); ctx.globalAlpha = 1 - smooth(s / .06); ctx.fillStyle = '#15181B'; ctx.fillRect(712, 101, 16, 611); ctx.restore();
  const textAlpha = smooth((p - .48) / .30);
  type(ctx, 'Room to think.', 106, 622 + (calm ? 0 : 30 * (1 - textAlpha)), 88, { serif: true, alpha: textAlpha });
  type(ctx, 'The view was here all along.', 111, 669, 21, { alpha: textAlpha });
  type(ctx, 'COURTYARD / 001', 1331, 665, 14, { align: 'right', alpha: textAlpha });
  if (calm) { ctx.globalAlpha = 1 - s; ctx.drawImage(assets.textures[0], 58, 101); ctx.drawImage(assets.textures[1], 728, 101); }
  else { panel(ctx, assets.textures[0], 0, s * Math.PI / 2); panel(ctx, assets.textures[1], 1, s * Math.PI / 2); }
  ctx.restore(); footer(ctx, p);
}

function mosaic(ctx, p, assets, calm) {
  const s = smoother((p - .08) / .82), leave = smooth(s / .66), enter = smooth((s - .62) / .38);
  field(ctx, '#101111');
  ctx.save(); ctx.globalAlpha = 1 - leave;
  const dy = calm ? 0 : -150 * s;
  type(ctx, 'FIELDWORK', 46, 44 + dy, 20, { color: '#F5F5F2' });
  type(ctx, 'A STUDY IN PERSPECTIVE', 720, 44 + dy, 14, { align: 'center', color: '#A9A9A7' });
  type(ctx, 'SCROLL STUDY 01', 1392, 44 + dy, 14, { align: 'right', color: '#A9A9A7' });
  const before = type(ctx, 'A wider ', 48, 165 + dy, 89, { weight: 800, color: '#F7F7F5' });
  type(ctx, 'perspective.', 48 + before, 165 + dy, 89, { weight: 800, color: '#FEEA43' });
  ctx.restore();
  const tiles = [
    { image: 1, x: 50, y: 214, w: 383, h: 233, dx: -600, dy: -160, number: '01', label: 'HORIZON', crop: [0, .12, 1, .40] },
    { image: 2, x: 50, y: 464, w: 383, h: 247, dx: -600, dy: 170, number: '02', label: 'STILL WATER' },
    { image: 3, x: 1009, y: 214, w: 383, h: 497, dx: 600, dy: 0, number: '04', label: 'SOFT LIGHT' },
  ];
  for (const a of tiles) {
    ctx.save(); ctx.globalAlpha = calm ? 1 - s : 1 - smooth((s - .38) / .40);
    const k = calm ? 1 : mix(1, .84, s), x = a.x + (calm ? 0 : a.dx * s), y = a.y + (calm ? 0 : a.dy * s);
    rounded(ctx, x, y, a.w * k, a.h * k, 3); ctx.clip();
    cover(ctx, assets.photos[a.image], x, y, a.w * k, a.h * k, a.crop); shade(ctx, x, y, a.w * k, a.h * k, .35);
    badge(ctx, a.number, a.label, x, y, a.w * k, a.h * k); ctx.restore();
  }
  const x = calm ? 453 : mix(453, 0, s), y = calm ? 214 : mix(214, 0, s);
  const w = calm ? 537 : mix(537, 1440, s), h = calm ? 497 : mix(497, 810, s);
  ctx.save(); rounded(ctx, x, y, w, h, calm ? 3 : mix(3, 0, s)); ctx.clip();
  cover(ctx, assets.photos[0], x, y, w, h); shade(ctx, x, y, w, h, mix(.2, .52, enter));
  ctx.save(); ctx.globalAlpha *= 1 - enter; badge(ctx, '03', 'THE COURTYARD', x, y, w, h, true); ctx.restore();
  if (!calm) {
    const prefix = type(ctx, 'Closer to ', 64, 660 + 28 * (1 - enter), 84, { weight: 800, alpha: enter });
    type(ctx, 'calm.', 64 + prefix, 660 + 28 * (1 - enter), 84, { weight: 800, color: '#FEEA43', alpha: enter });
    type(ctx, 'A place worth a closer look.', 77, 708, 21, { alpha: enter });
  }
  ctx.restore();
  if (calm) {
    ctx.save(); ctx.globalAlpha = enter; cover(ctx, assets.photos[0], 0, 0, 1440, 810); shade(ctx, 0, 0, 1440, 810, .52);
    const prefix = type(ctx, 'Closer to ', 64, 660, 84, { weight: 800 }); type(ctx, 'calm.', 64 + prefix, 660, 84, { weight: 800, color: '#FEEA43' }); type(ctx, 'A place worth a closer look.', 77, 708, 21); ctx.restore();
  }
  type(ctx, 'FIELDWORK / 03', 56, 55, 20, { alpha: enter });
  type(ctx, 'THE COURTYARD', 1384, 54, 14, { align: 'right', alpha: enter });
  footer(ctx, p);
}
export function renderScene(ctx, number, progress, assets, { calm = false } = {}) {
  ctx.save(); ctx.clearRect(0, 0, WIDTH, HEIGHT); ctx.imageSmoothingEnabled = true;
  (number === 190 ? portal : mosaic)(ctx, clamp(progress), assets, calm); ctx.restore();
}
