// Orkiestrator sceny hero (wariant 12a). Vanilla TS, zero zależności - ładowany
// przez dynamic import() PO idle (poza krytycznym bundlem i oknem hydratacji).
// Jedna pętla rAF dla wszystkich warstw; planeta (WebGL) i niebo renderują się
// naprzemiennie (po ~30 fps każda - ruch jest wolny), logotyp tylko w czasie wejścia
// (cały napis → gwiazda go przecina, ~2,6 s), potem nie rysuje nic. Pauza: IntersectionObserver + document.hidden.
// Od 2026-10-09 logotyp to nowe logo z „chirurgicznym cięciem” (logo.ts) - dawne cząstki usunięte („laguje”).

import { measureLayout, type HeroLayout, type HeroPointer } from './layout';
import { createPlanet, type PlanetLayer } from './planet';
import { createLogo } from './logo';
import { createSky } from './sky';
import { markHeroIntroDone } from '@/lib/hero-intro';

const REFLECT_K = 0.78;
/** Odbicie logotypu (2026-10-13, właściciel: „odbicie jest low quality (…) plus nie odzwierciedla aktualnej wersji”):
    dawne paski co 6 jednostek (wymyślone dla logotypu z cząstek) dawały na pełnych literach schodki, a płótno odbicia
    miało gęstość 1 - na ekranach o większej gęstości było rozmyte. Teraz odbicie to lustro logotypu względem
    POWIERZCHNI PLANETY liczone klinami od jej środka (w każdym klinie lustro względem stycznej - gładko, bez schodków,
    litery i linia z gwiazdą dokładnie jak nad horyzontem), w gęstości płótna logotypu. */
const REFLECT_WEDGES = 40;
const REFLECT_DPR = 2;

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
  let lastReflect = 0;
  let pendingReflect = false;
  /** Planeta WebGL zamówiona (po zakończeniu wejścia logotypu). */
  let planetQueued = false;
  /** Ostatni ruch myszy / fokus etykiety (ms) - przez chwilę po nim scena rysuje w pełnym tempie. */
  let lastMove = -1e9;
  let built = false;
  let pageLeft = 0, pageTop = 0;
  let resizeTimer = 0;
  /** Kiedy odsłonić tekst: gdy gwiazda kończy cięcie logotypu (~2,55 s wejścia; 0 = jeszcze nie wiadomo). */
  let textAt = reduced ? t0 : 0;
  let textShown = false;

  // Kolejność wejścia (decyzja właściciela): planeta (obraz od 1. klatki) → logotyp (cały napis, potem cięcie
  // gwiazdą) → tekst (CSS). Niebo / magnes / światło planety reagują tylko na mysz (`interactive`).
  const logo = createLogo(dotsCanvas);
  const sky = createSky(skyCanvas, labels, t0 + 400, reduced, interactive);
  const rctx = reflectCanvas.getContext('2d')!;
  let reflectTop = 0;

  const drawReflection = () => {
    if (!layout || layout.compact || logo.ownsReflection) return;
    const L = layout, src = logo.canvas;
    if (!src.width) return;
    const sd = src.width / L.W; // px bufora źródła (logotypu) na px CSS
    const rd = reflectCanvas.width / L.W; // px bufora odbicia na px CSS
    const off = 6.24 * (L.R / 1300);
    const Cy = L.horizon + L.R; // środek planety
    // jednostki sceny → px bufora odbicia
    const toScene = () => rctx.setTransform(L.k * rd, 0, 0, L.k * rd, L.ox * rd, (L.oy - reflectTop) * rd);
    rctx.setTransform(1, 0, 0, 1, 0, 0);
    rctx.clearRect(0, 0, reflectCanvas.width, reflectCanvas.height);
    rctx.globalCompositeOperation = 'source-over';
    // Kliny od środka planety obejmujące logotyp z zapasem. W każdym: przycięcie do klina (wnętrze planety), potem
    // obraz logotypu odbity względem stycznej do powierzchni w środku klina (ściśnięty REFLECT_K w głąb planety).
    // Kliny lekko zachodzą na siebie - bez szwów na ich granicach.
    const half = Math.min(1.2, (L.logoW * 0.52 + 150) / L.R);
    const step = (2 * half) / REFLECT_WEDGES, lap = step * 0.05, rr = L.R + 2;
    for (let i = 0; i < REFLECT_WEDGES; i++) {
      const a = -half + i * step, b = a + step + lap, th = a + step / 2;
      const sn = Math.sin(th), cs = Math.cos(th);
      const sx = L.cx + L.R * sn, sy = Cy - L.R * cs; // punkt powierzchni planety w środku klina
      rctx.save();
      toScene();
      rctx.beginPath();
      rctx.moveTo(L.cx, Cy);
      rctx.lineTo(L.cx + rr * Math.sin(a), Cy - rr * Math.cos(a));
      rctx.lineTo(L.cx + rr * Math.sin(b), Cy - rr * Math.cos(b));
      rctx.closePath();
      rctx.clip();
      rctx.globalAlpha = 1 - Math.min(1, Math.abs(sn)) * 0.35; // ku bokom odbicie słabnie (jak dotąd)
      // lustro: układ styczna / promień w punkcie powierzchni, odwrócenie i ściśnięcie wzdłuż promienia
      rctx.translate(sx, sy); rctx.rotate(th); rctx.translate(0, off); rctx.scale(1, -REFLECT_K); rctx.rotate(-th); rctx.translate(-sx, -sy);
      // obraz logotypu: px jego bufora → jednostki sceny
      rctx.translate(-L.ox / L.k, -L.oy / L.k);
      rctx.scale(1 / (L.k * sd), 1 / (L.k * sd));
      rctx.drawImage(src, 0, 0);
      rctx.restore();
    }
    // wygaszenie w głąb planety (od krawędzi do `span` jednostek pod nią) - te same wartości co dotąd, ale liczone
    // od powierzchni planety (promieniście), więc odbicie liter przy brzegach nie jest słabsze niż na środku
    toScene();
    rctx.globalAlpha = 1;
    rctx.globalCompositeOperation = 'destination-in';
    const span = 616 * 0.95 * (L.R / 1300);
    const g = rctx.createRadialGradient(L.cx, Cy, Math.max(1, L.R - span), L.cx, Cy, L.R + 10);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.65, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,.5)');
    rctx.fillStyle = g;
    rctx.fillRect(L.xMin, L.yMin, L.xMax - L.xMin, L.yMax - L.yMin);
    rctx.globalCompositeOperation = 'source-over';
    rctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const sizeReflection = (L: HeroLayout) => {
    if (L.compact || logo.ownsReflection) { reflectCanvas.width = reflectCanvas.height = 1; reflectCanvas.style.display = 'none'; return; }
    reflectTop = Math.max(0, Math.floor(L.oy + (L.horizon - 12) * L.k));
    const h = Math.max(1, L.H - reflectTop);
    reflectCanvas.style.display = 'block';
    // transform zamiast `top` - zmiana top na canvasie dawała CLS 0,167 (Lighthouse desktop).
    reflectCanvas.style.transform = `translate3d(0,${reflectTop}px,0)`;
    reflectCanvas.style.width = `${L.W}px`;
    reflectCanvas.style.height = `${h}px`;
    // gęstość jak płótno logotypu (najwyżej 2) - odbicie nie jest już rozmyte na ekranach o większej gęstości
    const rd = Math.min(window.devicePixelRatio || 1, REFLECT_DPR);
    reflectCanvas.width = Math.round(L.W * rd); reflectCanvas.height = Math.round(h * rd);
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
    // Start wejścia liczony od TERAZ - nie od startu sceny.
    const entranceAt = performance.now() + 100;
    logo.build(next, entrance, entranceAt);
    if (!textAt) textAt = entrance ? entranceAt + 2550 : performance.now();
    sizeReflection(next);
    built = true;
    drawReflection();
    start();
    // Kontekst WebGL planety: przy wejściu dopiero PO cięciu logotypu (tick - do tego czasu planeta to statyczny
    // render, identyczny z pierwszą klatką shadera; kompilacja i przenikanie nie dzielą klatek z animacją),
    // bez wejścia (zmiana rozmiaru, ograniczony ruch) - w osobnym tasku od razu.
    if (!entrance || planetQueued) window.setTimeout(() => { if (!disposed && layout === next) ensurePlanet(next); }, 0);
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
    const partsLive = logo.frame(now);
    // Odbicie logotypu w planecie: w czasie wejścia najwyżej ~30 razy na sekundę (ok. 240 pasków drawImage na
    // przerysowanie), ostatnia klatka zawsze (wydajność, 2026-10-09).
    if (partsLive || pendingReflect) {
      if (logo.done || now - lastReflect >= 32) { lastReflect = now; pendingReflect = false; drawReflection(); }
      else pendingReflect = true;
    }
    // Koniec wejścia logotypu: sygnał dla reszty strony (lib/hero-intro.ts - sekcje poniżej, czat, cookies)
    // i dopiero teraz planeta WebGL (desktop).
    if (logo.done && !planetQueued) {
      planetQueued = true;
      markHeroIntroDone();
      const L = layout;
      window.setTimeout(() => { if (!disposed && layout === L) ensurePlanet(L); }, 500);
    }
    const logoBusy = !logo.done;
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
      // W czasie wejścia logotypu niebo ~30 kl./s (jego ruch jest wolny) - klatki należą do cięcia (2026-10-09).
      if (now - lastSky >= (logoBusy ? 30 : lively ? 12 : 30)) { lastSky = now; skyLive = sky.frame(now, pointer); }
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
  if (interactive) {
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave, { passive: true });
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

  // Logotyp to ścieżki SVG (nie font) - scena buduje się od razu.
  apply(true);

  section.setAttribute('data-scene', 'on');

  return {
    destroy() {
      disposed = true;
      stop();
      window.clearTimeout(resizeTimer);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      labelHandlers.forEach((fn) => fn());
      planet?.destroy(); planet = null;
      glHost.removeAttribute('data-ready');
      logo.destroy(); sky.destroy();
      reflectCanvas.width = reflectCanvas.height = 1;
      dotsCanvas.width = dotsCanvas.height = 1;
      section.removeAttribute('data-scene');
    },
  };
}
