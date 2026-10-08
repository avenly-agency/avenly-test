// Orkiestrator sceny hero (wariant 12a). Vanilla TS, zero zależności - ładowany
// przez dynamic import() PO idle (poza krytycznym bundlem i oknem hydratacji).
// Jedna pętla rAF dla wszystkich warstw; planeta (WebGL) i niebo renderują się
// naprzemiennie (po ~30 fps każda - ruch jest wolny), cząstki w pełnym tempie
// tylko gdy coś się rusza. Pauza: IntersectionObserver + document.hidden.

import { measureLayout, type HeroLayout, type HeroPointer } from './layout';
import { createPlanet, type PlanetLayer } from './planet';
import { createParticles } from './particles';
import { createSky } from './sky';

const REFLECT_K = 0.78;
const STRIP = 6;

export interface HeroScene { destroy(): void }

export function createHeroScene(section: HTMLElement): HeroScene | null {
  const anchor = section.querySelector<HTMLElement>('[data-hero-anchor]');
  const glHost = section.querySelector<HTMLElement>('[data-hero-gl]');
  const dotsCanvas = section.querySelector<HTMLCanvasElement>('canvas[data-hero-dots]');
  const skyCanvas = section.querySelector<HTMLCanvasElement>('canvas[data-hero-sky]');
  const reflectCanvas = section.querySelector<HTMLCanvasElement>('canvas[data-hero-reflect]');
  const labels = Array.from(section.querySelectorAll<HTMLElement>('[data-hero-node]'));
  if (!anchor || !glHost || !dotsCanvas || !skyCanvas || !reflectCanvas) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interactive = !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const fontFamily = getComputedStyle(section).fontFamily || 'Inter, sans-serif';

  const t0 = performance.now();
  const pointer: HeroPointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, px: -1, py: -1 };
  let layout: HeroLayout | null = null;
  let planet: PlanetLayer | null = null;
  let disposed = false;
  let raf = 0;
  let running = false;
  let inView = true;
  let lastSky = 0;
  let lastPlanet = 0;
  /** Ostatni ruch myszy / fokus etykiety (ms) - przez chwilę po nim scena rysuje w pełnym tempie. */
  let lastMove = -1e9;
  let built = false;
  let pageLeft = 0, pageTop = 0;
  let resizeTimer = 0;
  /** Kiedy odsłonić tekst: logotyp po ~1,9 s wejścia jest już czytelny (0 = jeszcze nie wiadomo). */
  let textAt = reduced ? t0 : 0;
  let textShown = false;

  // Kolejność wejścia (decyzja właściciela): planeta (obraz od 1. klatki) → logotyp → tekst (CSS).
  // Dlatego cząstki ruszają niemal od razu po starcie sceny, a nie po 600 ms jak w makiecie.
  // Cząstki reagują na mysz ORAZ dotyk (na telefonie lity napis rozpada się pod palcem);
  // niebo/magnes/światło planety zostają tylko dla myszy (`interactive`).
  const particles = createParticles(dotsCanvas, !reduced, () => { if (!disposed) apply(false, true); });
  const sky = createSky(skyCanvas, labels, t0 + 400, reduced, interactive);
  const rctx = reflectCanvas.getContext('2d')!;
  let reflectTop = 0;

  const drawReflection = () => {
    // Renderer GPU rysuje odbicie sam (druga transformacja w vertex shaderze).
    if (!layout || layout.compact || particles.ownsReflection) return;
    const L = layout, src = particles.canvas;
    if (!src.width) return;
    const sd = src.width / L.W; // px bufora źródła na px CSS
    const off = 6.24 * (L.R / 1300);
    rctx.setTransform(1, 0, 0, 1, 0, 0);
    rctx.clearRect(0, 0, reflectCanvas.width, reflectCanvas.height);
    rctx.setTransform(L.k, 0, 0, L.k, L.ox, L.oy - reflectTop);
    rctx.globalCompositeOperation = 'source-over';
    const yTop = particles.topY - 30;
    const xA = Math.max(L.xMin, L.cx - L.logoW / 2 - 120), xB = Math.min(L.xMax, L.cx + L.logoW / 2 + 120);
    for (let x = xA; x < xB; x += STRIP) {
      const dx = x + STRIP / 2 - L.cx, inside = L.R * L.R - dx * dx;
      if (inside <= 0) continue;
      const surf = L.horizon + (L.R - Math.sqrt(inside));
      const far = surf + REFLECT_K * (surf - yTop) + off, near = surf + off;
      const sy = (L.oy + yTop * L.k) * sd, sh = (surf - yTop) * L.k * sd;
      if (sh <= 0 || sy + sh < 0) continue;
      rctx.save();
      rctx.translate(x, far); rctx.scale(1, -1);
      rctx.globalAlpha = 1 - Math.min(1, Math.abs(dx) / L.R) * 0.35;
      rctx.drawImage(src, (L.ox + x * L.k) * sd, Math.max(0, sy), STRIP * L.k * sd, sh, 0, 0, STRIP, far - near);
      rctx.restore();
    }
    rctx.globalAlpha = 1;
    rctx.globalCompositeOperation = 'destination-in';
    const span = 616 * 0.95 * (L.R / 1300);
    const g = rctx.createLinearGradient(0, L.horizon - 10, 0, L.horizon + span);
    g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(0.35, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    rctx.fillStyle = g;
    rctx.fillRect(L.xMin, L.yMin, L.xMax - L.xMin, L.yMax - L.yMin);
    rctx.globalCompositeOperation = 'source-over';
  };

  const sizeReflection = (L: HeroLayout) => {
    if (L.compact || particles.ownsReflection) { reflectCanvas.width = reflectCanvas.height = 1; reflectCanvas.style.display = 'none'; return; }
    reflectTop = Math.max(0, Math.floor(L.oy + (L.horizon - 12) * L.k));
    const h = Math.max(1, L.H - reflectTop);
    reflectCanvas.style.display = 'block';
    // transform zamiast `top` - zmiana top na canvasie dawała CLS 0,167 (Lighthouse desktop).
    reflectCanvas.style.transform = `translate3d(0,${reflectTop}px,0)`;
    reflectCanvas.style.width = `${L.W}px`;
    reflectCanvas.style.height = `${h}px`;
    reflectCanvas.width = Math.round(L.W); reflectCanvas.height = Math.round(h);
  };

  const measureStatics = () => {
    const r = section.getBoundingClientRect();
    pageLeft = r.left + window.scrollX; pageTop = r.top + window.scrollY;
  };

  const apply = (animate: boolean, force = false) => {
    const next = measureLayout(section, anchor);
    if (!next || disposed) return;
    const same = !force && layout && built && Math.abs(layout.W - next.W) < 1 && Math.abs(layout.H - next.H) < 1
      && Math.abs(layout.horizon * layout.k + layout.oy - (next.horizon * next.k + next.oy)) < 1;
    if (same) return;
    layout = next;
    measureStatics();
    if (next.mobile && planet) { planet.destroy(); planet = null; glHost.removeAttribute('data-ready'); }
    planet?.resize(next);
    sky.resize(next);
    const entrance = animate && !reduced;
    // Start wejścia liczony od TERAZ (build czeka na font) - nie od startu sceny.
    const entranceAt = performance.now() + 100;
    particles.build(next, fontFamily, entrance, entranceAt);
    if (!textAt) textAt = entrance ? entranceAt + 1900 : performance.now();
    sizeReflection(next); // po build(): dopiero wtedy wiadomo, który renderer rysuje odbicie
    built = true;
    drawReflection();
    start();
    // Start rozbity na osobne taski (każdy < 50 ms): sampling (wyżej) → siatka sąsiedztwa
    // → kontekst WebGL. Cząstki ruszają dopiero w t0+600 ms, planeta w t0+900 ms - jest zapas.
    window.setTimeout(() => {
      if (disposed || layout !== next) return;
      if (entrance) particles.link();
      window.setTimeout(() => { if (!disposed && layout === next) ensurePlanet(next); }, 0);
      // Lity napis (raster hi-res + tekstura) jest potrzebny dopiero przy zastyganiu (~3,7 s) -
      // osobny task w środku wejścia, żeby nie sklejał się z siatką sąsiedztwa w long task.
      if (entrance) window.setTimeout(() => { if (!disposed && layout === next) particles.prepareSolid(); }, 1400);
    }, 0);
  };

  // WebGL tylko na desktopie (zasada projektu: shader hero na mobile = TBT killer);
  // mobile / brak WebGL dostają planetę CSS (identyczna geometria, zero pętli GPU).
  const ensurePlanet = (L: HeroLayout) => {
    if (L.mobile || planet) return;
    planet = createPlanet(
      glHost,
      // Pod spodem od pierwszej klatki leży statyczny render planety - shader po prostu
      // płynnie go zastępuje, gdy tylko narysuje pierwszą klatkę (bez sztucznego opóźnienia).
      () => { if (!disposed) glHost.setAttribute('data-ready', ''); },
      () => section.setAttribute('data-gl', 'off'),
    );
    planet.resize(L);
  };

  const tick = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (!layout) return;
    if (!textShown && textAt && now >= textAt) { textShown = true; section.setAttribute('data-text', ''); }
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const partsLive = particles.frame(now, pointer);
    if (partsLive) drawReflection();
    let skyLive = true;
    if (layout.mobile) {
      // Mobile: brak WebGL; niebo ~20 fps (mruganie/impulsy są wolne, a każda klatka canvasa
      // to raster + upload - w labie bez GPU i na słabych telefonach to realny koszt).
      if (now - lastSky >= 48) { lastSky = now; skyLive = sky.frame(now, pointer); }
    } else {
      // Desktop (wydajność, 2026-10-05 - właściciel: „pierwsza sekcja laguje”): tempo liczone z CZASU, nie z numeru
      // klatki - na monitorach 120 / 144 Hz planeta szła dawniej w ~72 kl./s, a niebo w ~144. Gdy coś się dzieje
      // (wejście, ruch myszy i ~1,2 s po nim, podświetlony węzeł, spadająca gwiazda, cząstki logotypu): niebo do
      // ~60 kl./s (płynne hovery i impulsy), planeta ~30. W spoczynku ruch jest bardzo wolny (planeta < 1 px na
      // klatkę, impulsy konstelacji ~4 px): niebo ~30 kl./s, planeta ~20.
      const lively = partsLive || sky.busy || now - lastMove < 1200 || now - t0 < 6500
        || Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002;
      if (now - lastPlanet >= (lively ? 30 : 46)) { lastPlanet = now; planet?.render(reduced ? 0 : (now - t0) / 1000, pointer); }
      if (now - lastSky >= (lively ? 12 : 30)) { lastSky = now; skyLive = sky.frame(now, pointer); }
    }
    // Reduced motion: po fade-inach scena jest statyczna → pętla staje (zero kosztu).
    if (reduced && !skyLive && now - t0 > 5000) stop();
  };

  function start() {
    if (running || disposed || !inView || document.hidden || !built) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // --- wejście: kursor (tylko mysz) + magnes przycisku ---
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !layout) return;
    lastMove = performance.now();
    const cssX = e.pageX - pageLeft, cssY = e.pageY - pageTop;
    pointer.tx = cssX / layout.W; pointer.ty = cssY / layout.H;
    pointer.px = (cssX - layout.ox) / layout.k; pointer.py = (cssY - layout.oy) / layout.k;
  };
  const onLeave = () => {
    pointer.tx = 0.5; pointer.ty = 0.5; pointer.px = -1; pointer.py = -1;
  };
  // Dotyk / rysik: tylko surowa pozycja (dla cząstek). Listenery pasywne - nie blokują scrolla;
  // gdy przeglądarka przejmie gest (scroll), przychodzi pointercancel i "dziura" się zamyka.
  const onTouch = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || !layout) return;
    pointer.px = (e.pageX - pageLeft - layout.ox) / layout.k;
    pointer.py = (e.pageY - pageTop - layout.oy) / layout.k;
  };
  const onTouchEnd = (e: PointerEvent) => { if (e.pointerType !== 'mouse') { pointer.px = -1; pointer.py = -1; } };
  if (interactive) {
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave, { passive: true });
  }
  if (!reduced) {
    section.addEventListener('pointerdown', onTouch, { passive: true });
    section.addEventListener('pointermove', onTouch, { passive: true });
    section.addEventListener('pointerup', onTouchEnd, { passive: true });
    section.addEventListener('pointercancel', onTouchEnd, { passive: true });
  }

  // Hover / focus linku etykiety = "hot" węzeł (klawiatura dostaje ten sam feedback co mysz).
  const labelHandlers: Array<() => void> = [];
  labels.forEach((el, i) => {
    const onIn = () => { sky.setFocusNode(i); lastMove = performance.now(); start(); };
    const onOut = () => sky.setFocusNode(-1);
    el.addEventListener('pointerenter', onIn); el.addEventListener('pointerleave', onOut);
    el.addEventListener('focusin', onIn); el.addEventListener('focusout', onOut);
    labelHandlers.push(() => {
      el.removeEventListener('pointerenter', onIn); el.removeEventListener('pointerleave', onOut);
      el.removeEventListener('focusin', onIn); el.removeEventListener('focusout', onOut);
    });
  });

  // Pauza także wtedy, gdy hero w większości zjechało z ekranu (widać < 30% sekcji: dół z przyciskami i ciemną
  // częścią planety - krawędź planety i niebo są już poza ekranem): scena stoi na ostatniej klatce i nie liczy się
  // równocześnie z mgławicą Realizacji, która właśnie wtedy rusza (wydajność, 2026-10-05).
  const io = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.3;
    requestAnimationFrame(() => { if (inView) start(); else stop(); });
  }, { threshold: [0, 0.25, 0.3, 0.35] });
  io.observe(section);

  const onVisibility = () => { if (document.hidden) stop(); else start(); };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(() => {
    if (!built) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => apply(false), 180);
  });
  ro.observe(section);

  // Pierwszy build dopiero gdy Inter 800 jest gotowy (sampling liter z canvasa);
  // bezpiecznik 1500 ms, żeby brak fontu nie zablokował sceny.
  let fontDone = false;
  const first = () => { if (fontDone || disposed) return; fontDone = true; apply(true); };
  const fontTimer = window.setTimeout(first, 1500);
  if (document.fonts?.load) document.fonts.load(`800 100px ${fontFamily}`, 'AVENLY').then(first, first);
  else first();

  section.setAttribute('data-scene', 'on');

  return {
    destroy() {
      disposed = true;
      stop();
      window.clearTimeout(fontTimer);
      window.clearTimeout(resizeTimer);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      section.removeEventListener('pointerdown', onTouch);
      section.removeEventListener('pointermove', onTouch);
      section.removeEventListener('pointerup', onTouchEnd);
      section.removeEventListener('pointercancel', onTouchEnd);
      labelHandlers.forEach((fn) => fn());
      planet?.destroy(); planet = null;
      glHost.removeAttribute('data-ready');
      particles.destroy(); sky.destroy();
      reflectCanvas.width = reflectCanvas.height = 1;
      dotsCanvas.width = dotsCanvas.height = 1;
      section.removeAttribute('data-scene');
    },
  };
}
