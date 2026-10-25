import {CarScene} from './car-scene';
import {icon} from './icons';
import {clamp, demoPose, DETAIL_YAW, H, HOME_YAW, initialPose, mix, phase, Pose, smooth, smoother, W} from './timeline';

type Options = {asset: (path: string) => string; film?: boolean};
type Nav = {start: number; from: number; to: number; yaw: number; pitch: number; inspection: number};
const blend = (a: number[], b: number[], p: number) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], p))).join(',')})`;
const storageKey = 'repixel.classic-porsche-3d.favorite.v1';
const views = [HOME_YAW - DETAIL_YAW, 0, Math.PI / 2 - DETAIL_YAW, Math.PI - DETAIL_YAW];

export class ClassicApp {
  host: HTMLElement;
  stage: HTMLElement;
  pose = initialPose();
  ready: Promise<void>;
  scene: CarScene | null = null;
  private options: Options;
  private frame = 0;
  private destroyed = false;
  private dirty = true;
  private nav: Nav | null = null;
  private viewTween: {start: number; from: number; to: number; inspection: number; targetInspection: number} | null = null;
  private targetInspection = 0;
  private observer: ResizeObserver;
  private cleanup: (() => void)[] = [];
  private lastTime = 0;
  private velocity = 0;
  private pointer: {id: number; x: number; y: number; lastX: number; lastY: number; time: number; moved: boolean} | null = null;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private favoriteAt = -Infinity;
  private pressTarget = 0;
  private home911X = 226;
  private searchQuery = '';
  private lastFocus: HTMLElement | null = null;
  private overlayKind = '';
  private el = new Map<string, HTMLElement>();

  constructor(host: HTMLElement, options: Options) {
    this.host = host; this.options = options;
    host.innerHTML = this.markup();
    this.stage = host.querySelector('.classic-stage') as HTMLElement;
    this.stage.querySelectorAll<HTMLElement>('[data-part]').forEach(node => this.el.set(node.dataset.part!, node));
    this.observer = new ResizeObserver(() => this.fit());
    this.observer.observe(host); this.fit();
    if (!options.film) {const resize = () => this.fit(); window.addEventListener('resize', resize); this.cleanup.push(() => window.removeEventListener('resize', resize));}
    if (!options.film) {
      try {this.pose.favorite = localStorage.getItem(storageKey) === 'true';} catch { /* Storage can be disabled. */ }
      this.bind();
      this.frame = requestAnimationFrame(this.tick);
    }
    this.ready = this.load();
    this.paint();
  }
  private part(name: string) { return this.el.get(name)!; }
  private markup() {
    const image = (name: string, alt: string) => `<img src="${this.options.asset('images/' + name + '.webp')}" alt="${alt}" draggable="false">`;
    const button = (action: string, label: string, glyph: string, extra = '') => `<button type="button" data-action="${action}" aria-label="${label}" ${extra}>${icon(glyph)}</button>`;
    const specs = [['engine', 'Engine', '2.0 L'], ['power', 'Power', '130 hp'], ['speed', 'Top Speed', '210 km/h'], ['acceleration', '0–100 km/h', '8.5 sec'], ['weight', 'Weight', '1,080 kg'], ['transmission', 'Transmission', 'Manual']];
    return `<div class="classic-stage" data-part="stage">
      <div class="home-layer" data-part="home">
        <header class="home-header">${button('menu', 'Open menu', 'menu')}<span>Classic</span>${button('search', 'Search cars', 'search')}</header>
        <div class="home-pagination"><span>01</span><div><i></i></div><span>04</span></div>
        <p class="home-subtitle">SPORT CLASSIC</p>
        <button type="button" class="open-car" data-action="open" aria-label="View Porsche 911 in 3D" data-part="open">${icon('arrow', 27)}</button>
        <div class="thumbnails" aria-label="Collection photographs">
          <button type="button" data-action="silver" aria-label="View silver Porsche 911" class="selected">${image('porsche-911-reference', 'Silver Porsche 911')}<i></i></button>
          <button type="button" data-action="red" aria-label="View red coupe photograph">${image('red-coupe-reference', 'Red coupe')}</button>
          <button type="button" data-action="black" aria-label="View black coupe photograph">${image('black-coupe-reference', 'Black coupe')}</button>
        </div>
        <nav class="bottom-dock" aria-label="Main navigation">${button('home', 'Home', 'home', 'aria-current="page" class="active"')}${button('collection', 'Collection', 'car')}${button('saved', 'Saved cars', 'bookmark')}${button('profile', 'Local profile', 'profile')}</nav>
      </div>
      <span class="shared-year" data-part="year" aria-hidden="true">1967</span><span class="shared-year" data-part="year-small" aria-hidden="true">1967</span>
      <div class="car-canvas" data-part="canvas"></div>
      <div class="static-fallback" data-part="fallback">${image('porsche-911-reference', 'Porsche 911 static preview')}</div>
      <div class="model-status" data-part="loading" role="status">Loading 3D model…</div>
      <button type="button" class="retry-model" data-action="retry" data-part="retry" hidden>Retry 3D</button>
      <div class="model-drag" data-part="drag" role="region" aria-label="Interactive 3D Porsche 911. Drag horizontally to rotate; arrow keys rotate; Home resets the view." tabindex="0"></div>
      <div class="shared-title" role="heading" aria-level="1" aria-label="Porsche 911, 1967"><span data-part="porsche">Porsche</span><span data-part="911">911</span></div>
      <div class="detail-header" data-part="detail-header">${button('back', 'Back to Classic', 'back', 'data-part="back"')}${button('save', 'Save Porsche 911', 'bookmark', 'aria-pressed="false" data-part="save"')}</div>
      <div class="view-tabs" role="tablist" aria-label="Porsche camera views" data-part="views">${['Front three-quarter', 'Rear three-quarter', 'Side profile', 'Rear'].map((label, index) => `<button type="button" role="tab" data-action="view-${index}" aria-label="${label}" aria-selected="${index === 1}" tabindex="${index === 1 ? 0 : -1}">${String(index + 1).padStart(2, '0')}<i></i></button>`).join('')}</div>
      <section class="detail-sheet" data-part="sheet" aria-label="Porsche 911 details">
        <div class="spec-grid">${specs.map(([glyph, label, value]) => `<div class="spec-item"><span class="spec-icon">${icon(glyph, 21)}</span><span><small>${label}</small><strong>${value}</strong></span></div>`).join('')}</div>
        <div class="sheet-rule first"></div>
        <p class="description">The Porsche 911 1967 combines timeless design with an engaging driving experience. Its balanced chassis and iconic silhouette make it a true classic on the road.</p>
        <div class="sheet-rule second"></div>
        <div class="price"><small>Price</small><strong>$125,000</strong></div>
        <button type="button" class="contact" data-action="contact">Contact ${icon('arrow', 23)}</button>
      </section>
      <div class="touch-indicator" data-part="touch" aria-hidden="true"></div>
      <div class="overlay-host" data-part="overlay"></div>
      <p class="sr-only" data-part="announcement" role="status" aria-live="polite"></p>
    </div>`;
  }
  private fit() {
    const scale = this.host.clientWidth / W;
    const height = this.options.film ? H * scale : Math.max(H * scale, window.innerHeight);
    const extra = height / scale - H;
    this.host.style.height = `${height}px`;
    this.stage.style.height = `${H + extra}px`;
    this.stage.style.setProperty('--extra-h', `${extra}px`);
    this.stage.style.transform = `scale(${scale})`;
  }
  private async load() {
    const fonts = [
      new FontFace('Classic Inter', `url(${this.options.asset('fonts/Inter-variable.woff')})`, {weight: '100 900'}),
      new FontFace('Classic Serif', `url(${this.options.asset('fonts/DMSerifDisplay-Regular.woff')})`, {weight: '400'}),
      new FontFace('Classic Bodoni', `url(${this.options.asset('fonts/BodoniModa-variable.woff')})`, {weight: '400 900'}),
    ];
    await Promise.all(fonts.map(async font => {const loaded = await font.load(); document.fonts.add(loaded);}));
    await document.fonts.ready;
    const context = document.createElement('canvas').getContext('2d')!;
    context.font = '55px "Classic Serif"'; this.home911X = 31 + context.measureText('Porsche').width + 8;
    await Promise.all(Array.from(this.stage.querySelectorAll('img')).map(image => image.decode()));
    try {
      this.scene = new CarScene(this.part('canvas'), this.options.asset, !!this.options.film);
      await this.scene.ready;
      if (this.destroyed) {this.scene.dispose(); return;}
      this.part('fallback').hidden = true;
      this.part('loading').hidden = true;
      this.part('retry').hidden = true;
      this.part('canvas').dataset.ready = 'true';
      this.announce('3D Porsche 911 loaded.');
    } catch (error) {
      this.part('loading').textContent = '3D view unavailable';
      this.part('retry').hidden = false;
      if (this.options.film) throw error;
    }
    this.dirty = true; this.paint();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  setFilmTime(seconds: number) {this.pose = demoPose(seconds); this.paint();}
  private announce(text: string) {this.part('announcement').textContent = text;}
  private setInteractive(node: HTMLElement, enabled: boolean) {node.inert = !enabled; node.setAttribute('aria-hidden', String(!enabled)); node.style.pointerEvents = enabled ? '' : 'none';}
  private paint() {
    const {p, yaw, favorite, view, press, pressStrength, touch, pulse} = this.pose;
    const morph = phase(p, .08, .94), homeOpacity = 1 - phase(p, .03, .30), detailOpacity = phase(p, .40, .82);
    this.stage.style.backgroundColor = blend([246,245,242], [29,30,28], phase(p, .04, .90));
    if (!this.options.film) document.body.style.backgroundColor = this.stage.style.backgroundColor;
    const text = blend([15,16,14], [247,247,242], phase(p, .13, .84));
    this.part('home').style.opacity = `${homeOpacity}`;
    this.part('home').style.translate = `0 ${28 * morph}px`;
    this.setInteractive(this.part('home'), p < .02);
    const porsche = this.part('porsche'), number = this.part('911');
    porsche.style.left = `${mix(31, 37, morph)}px`; porsche.style.top = `${mix(557, 84, morph)}px`; porsche.style.fontSize = `${mix(55, 39, morph)}px`; porsche.style.color = text;
    number.style.left = `${mix(this.home911X, 36, morph)}px`; number.style.top = `${mix(557, 119, morph)}px`; number.style.fontSize = `${mix(55, 102, morph)}px`; number.style.color = text;
    const year = this.part('year'); year.style.left = `${mix(13, 37, morph)}px`; year.style.top = `${mix(88, 214, morph)}px`; year.style.fontSize = `${mix(185, 22, morph)}px`;
    year.style.letterSpacing = `${mix(-12, .1, morph)}px`; year.style.color = blend([231,230,226], [147,148,142], phase(p, .10, .92));
    const yearHandoff = phase(morph, .70, .99);
    year.style.opacity = `${1 - yearHandoff}`;
    const yearSmall = this.part('year-small');
    yearSmall.style.cssText = `left:${mix(13, 37, morph)}px;top:${mix(88, 214, morph)}px;font-size:${mix(185, 22, morph)}px;letter-spacing:${mix(-12, .1, morph)}px;color:${blend([231,230,226], [147,148,142], phase(p,.10,.92))};font-family:"Classic Inter",sans-serif;opacity:${yearHandoff}`;
    // All states use the same sheet and same renderer. Only their transforms change.
    const sheetP = phase(p, .28, 1);
    this.part('sheet').style.translate = `0 ${500 * (1 - sheetP)}px`;
    this.setInteractive(this.part('sheet'), p > .98);
    this.part('detail-header').style.opacity = `${detailOpacity}`;
    this.setInteractive(this.part('detail-header'), p > .98);
    this.part('views').style.opacity = `${detailOpacity}`;
    this.setInteractive(this.part('views'), p > .98);
    this.part('views').querySelectorAll<HTMLButtonElement>('button').forEach((node, index) => {node.setAttribute('aria-selected', String(index === view)); node.tabIndex = index === view ? 0 : -1;});
    const save = this.part('save'); save.setAttribute('aria-pressed', String(favorite)); save.setAttribute('aria-label', favorite ? 'Remove saved Porsche 911' : 'Save Porsche 911');
    const mark = save.querySelector('svg')!; mark.setAttribute('fill', favorite ? 'currentColor' : 'none');
    save.style.scale = `${1 - (press === 'save' ? .10 * pressStrength : 0) + .08 * pulse}`;
    this.part('open').style.scale = `${1 - (press === 'open' ? .06 * pressStrength : 0)}`;
    this.part('back').style.scale = `${1 - (press === 'back' ? .08 * pressStrength : 0)}`;
    this.part('drag').style.top = `${mix(194, 245, p)}px`;
    this.part('drag').style.height = `${mix(280, 176, p)}px`;
    this.part('drag').style.pointerEvents = this.nav ? 'none' : 'auto';
    const indicator = this.part('touch'); indicator.style.opacity = String(touch?.opacity || 0);
    if (touch) {indicator.style.left = `${touch.x - 17}px`; indicator.style.top = `${touch.y - 17}px`;}
    this.stage.dataset.route = p > .98 ? 'detail' : p < .02 ? 'home' : 'transition';
    this.stage.dataset.view = String(view);
    this.stage.dataset.yaw = yaw.toFixed(5);
    this.scene?.draw(this.pose);
    this.dirty = false;
  }
  private tick = (now: number) => {
    if (this.destroyed) return;
    const dt = Math.min(.05, (now - (this.lastTime || now)) / 1000); this.lastTime = now;
    if (this.nav) {
      const amount = this.reduced ? 1 : smoother((now - this.nav.start) / 1120);
      this.pose.p = mix(this.nav.from, this.nav.to, amount);
      this.pose.yaw = this.nav.yaw * (1 - amount); this.pose.pitch = this.nav.pitch * (1 - amount); this.pose.inspection = this.nav.inspection * (1 - amount); this.dirty = true;
      if (amount >= 1) {const detail = this.nav.to === 1; this.nav = null; this.pose.view = 1; this.part(detail ? 'back' : 'open').focus({preventScroll: true}); this.announce(detail ? 'Porsche 911 details.' : 'Classic home.');}
    } else if (this.viewTween) {
      const amount = this.reduced ? 1 : smoother((now - this.viewTween.start) / 880);
      this.pose.yaw = mix(this.viewTween.from, this.viewTween.to, amount); this.pose.inspection = mix(this.viewTween.inspection, this.viewTween.targetInspection, amount); this.dirty = true;
      if (amount >= 1) this.viewTween = null;
    } else if (!this.pointer && Math.abs(this.velocity) > .001) {
      const damping = 8, decay = Math.exp(-damping * dt);
      this.pose.yaw += this.velocity * (1 - decay) / damping; this.velocity *= decay; this.dirty = true;
    }
    if (!this.nav && !this.viewTween && Math.abs(this.pose.inspection - this.targetInspection) > .0001) {
      this.pose.inspection = this.reduced ? this.targetInspection : mix(this.pose.inspection, this.targetInspection, 1 - Math.exp(-9 * dt)); this.dirty = true;
    }
    if (Math.abs(this.pose.pressStrength - this.pressTarget) > .001) {this.pose.pressStrength = this.reduced ? this.pressTarget : mix(this.pose.pressStrength, this.pressTarget, 1 - Math.exp(-28 * dt)); this.dirty = true;}
    const pulse = now - this.favoriteAt < 300 ? Math.sin(Math.PI * (now - this.favoriteAt) / 300) : 0;
    if (pulse !== this.pose.pulse) {this.pose.pulse = pulse; this.dirty = true;}
    if (this.dirty) this.paint();
    this.frame = requestAnimationFrame(this.tick);
  };
  private navigate(detail: boolean, history = true) {
    this.closeOverlay(); this.velocity = 0; this.viewTween = null;
    this.targetInspection = 0;
    this.nav = {start: performance.now(), from: this.pose.p, to: detail ? 1 : 0, yaw: Math.atan2(Math.sin(this.pose.yaw), Math.cos(this.pose.yaw)), pitch: this.pose.pitch, inspection: this.pose.inspection};
    this.pose.touch = null; this.pressTarget = 0;
    if (history) window.history.pushState({classicDetail: detail}, '', detail ? '#porsche-911' : '#home');
    this.dirty = true;
  }
  private save() {
    this.pose.favorite = !this.pose.favorite; this.favoriteAt = performance.now();
    try {localStorage.setItem(storageKey, String(this.pose.favorite));} catch { /* Still works in memory. */ }
    this.announce(this.pose.favorite ? 'Porsche 911 saved.' : 'Porsche 911 removed from saved cars.'); this.dirty = true;
  }
  private setView(index: number) {
    this.velocity = 0; this.pose.view = index; this.targetInspection = index === 1 ? 0 : 1;
    const targetYaw = this.pose.yaw + Math.atan2(Math.sin(views[index] - this.pose.yaw), Math.cos(views[index] - this.pose.yaw));
    this.viewTween = {start: performance.now(), from: this.pose.yaw, to: targetYaw, inspection: this.pose.inspection, targetInspection: this.targetInspection};
    this.announce(['Front three-quarter', 'Rear three-quarter', 'Side profile', 'Rear'][index] + ' view.'); this.dirty = true;
  }
  private bind() {
    const on = <T extends EventTarget>(target: T, name: string, handler: EventListener, options?: AddEventListenerOptions) => {target.addEventListener(name, handler, options); this.cleanup.push(() => target.removeEventListener(name, handler, options));};
    on(this.stage, 'click', ((event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]'); if (!target) return;
      const action = target.dataset.action!;
      if (action === 'open' || action === 'silver') this.navigate(true);
      else if (action === 'back' || action === 'home') this.navigate(false);
      else if (action === 'save') this.save();
      else if (action.startsWith('view-')) this.setView(Number(action.slice(5)));
      else if (action === 'close') this.closeOverlay();
      else if (action === 'retry') {this.scene?.dispose(); this.scene = null; this.part('retry').hidden = true; this.part('loading').textContent = 'Loading 3D model…'; this.ready = this.load();}
      else if (action === 'red' || action === 'black') this.photo(action);
      else if (action === 'contact') this.contact();
      else this.overlay(action);
    }) as EventListener);
    on(this.stage, 'pointerdown', ((event: PointerEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
      if (button) {this.pose.press = button.dataset.action || null; this.pressTarget = 1; this.dirty = true;}
    }) as EventListener);
    on(window, 'pointerup', (() => {this.pressTarget = 0; this.dirty = true;}) as EventListener);
    const area = this.part('drag');
    on(area, 'pointerdown', ((event: PointerEvent) => {
      if (this.nav || event.button !== 0 || this.pointer) return;
      this.viewTween = null; this.velocity = 0; this.pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, time: event.timeStamp, moved: false};
      area.setPointerCapture(event.pointerId);
    }) as EventListener);
    on(area, 'pointermove', ((event: PointerEvent) => {
      const point = this.pointer; if (!point || point.id !== event.pointerId) return;
      const totalX = event.clientX - point.x, totalY = event.clientY - point.y;
      if (!point.moved && Math.abs(totalY) > Math.abs(totalX) + 8) return;
      if (!point.moved && Math.abs(totalX) < 4) return;
      point.moved = true; this.pose.view = -1; this.targetInspection = 1;
      const scale = this.host.clientWidth / W, dx = (event.clientX - point.lastX) / scale;
      const dt = Math.max(.008, (event.timeStamp - point.time) / 1000);
      this.pose.yaw -= dx * .0095;
      this.velocity = clamp(Math.abs(dx * .0095 / dt) / 4) * Math.sign(-dx) * 4;
      this.pose.pitch = Math.max(-.05, Math.min(.08, this.pose.pitch + (event.clientY - point.lastY) / scale * .0005));
      point.lastX = event.clientX; point.lastY = event.clientY; point.time = event.timeStamp;
      this.dirty = true;
    }) as EventListener);
    const release = ((event: PointerEvent) => {if (this.pointer?.id !== event.pointerId) return; if (event.timeStamp - this.pointer.time > 90 || this.reduced || event.type === 'pointercancel') this.velocity = 0; this.pointer = null; this.dirty = true;}) as EventListener;
    on(area, 'pointerup', release); on(area, 'pointercancel', release); on(area, 'lostpointercapture', release);
    on(area, 'keydown', ((event: KeyboardEvent) => {
      if (this.nav) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); this.pose.yaw += event.key === 'ArrowLeft' ? .18 : -.18; this.pose.view = -1; this.targetInspection = 1; this.velocity = 0; this.dirty = true;}
      if (event.key === 'Home') {event.preventDefault(); this.setView(1);}
    }) as EventListener);
    on(this.part('views'), 'keydown', ((event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault();
      const current = Math.max(0, this.pose.view), index = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (current + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
      this.setView(index); this.part('views').querySelectorAll<HTMLButtonElement>('button')[index].focus();
    }) as EventListener);
    on(window, 'popstate', (() => {this.navigate(location.hash === '#porsche-911', false);}) as EventListener);
    on(this.stage, 'keydown', ((event: KeyboardEvent) => {
      if (event.key === 'Escape') {if (this.overlayKind) this.closeOverlay(); else if (this.pose.p > 0) this.navigate(false);}
      if (event.key === 'Tab' && this.overlayKind) {
        const controls = Array.from(this.part('overlay').querySelectorAll<HTMLElement>('button,input,textarea,a[href]')).filter(node => !node.hasAttribute('disabled'));
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) {event.preventDefault(); controls.at(-1)!.focus();}
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) {event.preventDefault(); controls[0].focus();}
      }
    }) as EventListener);
    if (location.hash === '#porsche-911') {this.pose.p = 1; this.dirty = true;}
  }
  private openOverlay(title: string, contents: string, kind: string) {
    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.overlayKind = kind;
    this.part('overlay').innerHTML = `<section class="utility-panel" role="dialog" aria-modal="true" aria-label="${title}"><header><h2>${title}</h2><button type="button" data-action="close" aria-label="Close ${title}">${icon('close')}</button></header>${contents}</section>`;
    this.part('overlay').querySelector<HTMLElement>('input,button')?.focus({preventScroll: true});
  }
  private closeOverlay() {if (!this.overlayKind) return; this.part('overlay').innerHTML = ''; this.overlayKind = ''; this.lastFocus?.focus({preventScroll: true});}
  private overlay(kind: string) {
    if (kind === 'menu') {this.openOverlay('Classic', '<div class="menu-list"><button data-action="home">Home</button><button data-action="collection">Collection</button><button data-action="saved">Saved cars</button></div>', kind); return;}
    if (kind === 'search') {
      this.openOverlay('Search cars', `<input type="search" aria-label="Search cars" placeholder="Search model or year" value="${this.searchQuery.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"><div class="search-results"></div>`, kind);
      const input = this.part('overlay').querySelector('input')!;
      const update = () => {this.searchQuery = input.value; this.part('overlay').querySelector('.search-results')!.innerHTML = !input.value || 'porsche 911 1967'.includes(input.value.toLowerCase().trim()) ? this.savedCard() : '<p>No cars match your search.</p>';};
      input.addEventListener('input', update); update(); input.focus(); return;
    }
    if (kind === 'saved') {this.openOverlay('Saved cars', this.pose.favorite ? this.savedCard() : '<p>No saved cars yet. Save the Porsche from its detail screen.</p>', kind); return;}
    if (kind === 'profile') {this.openOverlay('Local collection', `<p>Your saved cars are stored on this device.</p><p>${this.pose.favorite ? '1 saved car' : 'No saved cars'}</p><button class="utility-cta" data-action="saved">View saved cars</button>`, kind); return;}
    this.openOverlay('Collection', `<div class="collection-photos">${this.savedCard()}<button data-action="red"><img src="${this.options.asset('images/red-coupe-reference.webp')}" alt="Red coupe"><span>Red coupe photograph</span></button><button data-action="black"><img src="${this.options.asset('images/black-coupe-reference.webp')}" alt="Black coupe"><span>Black coupe photograph</span></button></div>`, 'collection');
  }
  private savedCard() {return `<button type="button" data-action="silver" class="saved-car"><img src="${this.options.asset('images/porsche-911-reference.webp')}" alt="Silver Porsche 911"><span>Porsche 911 <small>1967 · $125,000</small></span>${icon('arrow', 20)}</button>`;}
  private photo(color: string) {this.openOverlay(color === 'red' ? 'Red coupe' : 'Black coupe', `<img class="gallery-photo" src="${this.options.asset('images/' + color + '-coupe-reference.webp')}" alt="${color} coupe"><p>Collection photograph</p>`, 'photo');}
  private contact() {
    this.openOverlay('Contact', '<p>Porsche 911 · 1967<br>$125,000</p><form class="contact-form"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" rows="4" required>I’m interested in the Porsche 911 (1967).</textarea></label><p class="draft-note">Prepare an enquiry on this device. Sending requires a seller contact.</p><button type="submit" class="utility-cta">Prepare enquiry</button><p role="status" class="draft-status"></p></form>', 'contact');
    const form = this.part('overlay').querySelector('form')!;
    form.addEventListener('submit', event => {event.preventDefault(); if (!form.reportValidity()) return; this.part('overlay').querySelector('.draft-status')!.textContent = 'Enquiry prepared locally. Nothing has been sent.';});
  }
  dispose() {this.destroyed = true; cancelAnimationFrame(this.frame); this.cleanup.forEach(fn => fn()); this.observer.disconnect(); this.scene?.dispose(); this.host.innerHTML = '';}
}
