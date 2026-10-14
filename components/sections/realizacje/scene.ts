// Orkiestrator sekcji "Realizacje" (handoff 8b "Kurtyna"). Vanilla TS, zero zależności,
// ładowany dynamic import() PO idle i dopiero gdy sekcja zbliża się do viewportu.
//
// STEROWANIE (decyzja właściciela, Sesja 30): BEZ scroll-locka z makiety ("jeden scroll = jeden
// kadr" był słabym UX). Jedyny wyjątek: jednorazowa, ~2 s blokada przy wejściu sekcji (prośba
// właściciela 2026-09-24, niżej "wejście sekcji"). Kadry zmieniają się SAME co AUTO_HOLD ms po zakończeniu przejścia;
// klik w pozycję indeksu / swipe poziomy / strzałki ←→ przełączają ręcznie i odkładają automat.
// Automat pauzuje: poza viewportem, przy ukrytej karcie, gdy kursor jest nad indeksem / panelem
// informacji lub fokus klawiatury jest w nich (WCAG 2.2.2 - użytkownik może zatrzymać rotację); reduced motion =
// bez automatu (tylko ręcznie, crossfade). Timer setTimeout, nie pętla rAF - na telefonie bez
// shadera pętla stoi, a automat i tak działa.
//
// Przejście jak w makiecie (wchodzący: kurtyna od dołu, expo-out, start po 20% czasu; wychodzący:
// unosi się, blednie, rozmycie, expo-in; 1500 ms), ale NADPISYWANE (Sesja 31): każdy wybór - także
// w trakcie przejścia - od razu odgrywa pełne wejście nowego kadru, a to, co było widoczne, zanika
// jako "duch" od bieżącego wyglądu (bez czekania i bez skoku). Przejścia zawsze bezpośrednie (klik 01 → 04 nie "kartkuje" 02 i 03). Style pisane
// wyłącznie gdy się zmieniają.
//
// PRZEJŚCIE „GWIAZDA” (2026-10-13; właściciel o tym samym przejściu na /o-nas: „portal zajebisty, gdzie można jeszcze
// ten efekt użyć” i polecenie „wykonaj”): nowy kadr otwiera się przez okno w kształcie gwiazdy z logo, które rośnie
// ze środka kadru jak przy wjeździe w gwiazdę; przed oknem lecą dwa obrysy-powidoki w barwie nowej realizacji.
// Poprzedni kadr stoi nieruchomo pod spodem, dopóki okno go nie zakryje (bez unoszenia, rozmycia i zaniku).
// „Kurtyna” od dołu zostaje jako drugi wariant - wybór podaje komponent (opts.getTransition; przełącznik tylko
// w `npm run dev`, realizacje/variant.tsx). Ograniczony ruch: jak dotąd samo przenikanie.

import { GEM } from '@/lib/brand/logo';
import type { RGB } from '@/lib/i18n/home/realizacje';
import { createNebula, type NebulaLayer } from './nebula';

export interface RealizacjeScene { destroy(): void }

const N = 4;
const T = 1500;
const T_REDUCED = 600;
/** Pauza między końcem przejścia a kolejną automatyczną zmianą kadru. */
const AUTO_HOLD = 5000;
const SWIPE_PX = 40;
/** Dotyk (2026-09-24): dotknięcie sekcji odkłada automat o tyle ms - projekt nie zmienia się
    pod palcem ani w trakcie czytania panelu po przewinięciu; ręczny wybór (swipe / miniatura)
    wyłącza automat, dopóki sekcja nie zniknie z ekranu (WCAG 2.2.2 - na dotyku nie ma hovera). */
const TOUCH_HOLD = 10000;
/** Krycie nieaktywnej miniatury (aktywna = 1) - jak .rz-thumb img w globals.css. */
const THUMB_DIM = 0.42;
/** Przerwane przejście: kadr odsłonięty co najmniej w tej części (s) zostaje tłem i domyka kurtynę. */
const DOMINANT = 0.5;
/** Domknięcie przerwanej kurtyny (ms) - potem to zwykłe przejście z tego kadru do nowego. */
const FINISH = 280;
/** Zanik ledwo odsłoniętego kadru przy przerwaniu (i tak przykrywa go nowa kurtyna). */
const DROP = 260;
/** Zanik poprzedniego tła, gdy przykrył je już domknięty kadr. */
const DROP_COVERED = 160;
/** Maks. duchów naraz (każdy ma backdrop-filter) - bezpiecznik na bardzo szybkie klikanie. */
const MAX_GHOSTS = 5;
/** Wejście sekcji (2026-09-24, prośba właściciela): sekcja czarna, dopóki się do niej przewija;
    gdy wypełni ekran (górna krawędź ≤ REVEAL_SNAP wysokości okna), strona dociąga się dokładnie
    do jej góry i na chwilę (JEDEN raz, ~2 s) blokuje scroll, a w tym czasie maluje się tło,
    nagłówek i wchodzi pierwsza realizacja; potem scroll normalnie w obie strony. */
const REVEAL_SNAP = 0.08;
/** Dotyk: bez dociągnięcia i blokady, więc start wcześniej - gdy kadr jest już cały na ekranie
    (górna krawędź sekcji ≤ 35% wysokości okna); inaczej prawie cały ekran czerni przy przewijaniu. */
const REVEAL_SNAP_TOUCH = 0.35;
/** Czas malowania (ms) - postęp 0..1 z easingiem LAY. */
const REVEAL_DUR = 2000;
/** Progi postępu: nagłówek, potem pierwsza realizacja (kurtyna) + panele + miniatury. */
const REVEAL_TEXT = 0.25;
const REVEAL_FRAME = 0.55;
/** Blokada tylko po WŁASNYM scrollu użytkownika (kółko / dotyk / klawisze w tym oknie ms) -
    przejazd programowy (nawigacja do kotwicy) nie może zostać przejęty. */
const REVEAL_INPUT_MS = 1200;
/** Szybki zamach kółkiem potrafi przenieść sekcję za próg w jednej klatce - do tej części
    wysokości okna za progiem nadal blokada z dociągnięciem z powrotem do góry sekcji; dalej
    (sekcja przeleciana) odsłona bez blokady. */
const REVEAL_FLY = 0.6;
/** Bezpiecznik: blokada nigdy dłużej niż tyle ms od startu malowania (sprawdzane co klatkę;
    zapasowy setTimeout 2× na wypadek, gdyby klatki stanęły). */
const REVEAL_LOCK_MAX = 3500;
/** Klawisze przewijające stronę - zablokowane w trakcie blokady (kółko i dotyk blokuje Lenis). */
const SCROLL_KEYS = new Set([' ', 'Spacebar', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Minimalny interfejs Lenisa (smooth scroll strony) - podaje go komponent (useLenis). */
export interface ScrollControl {
  stop(): void;
  start(): void;
  scrollTo(target: number, options?: { duration?: number; easing?: (t: number) => number; force?: boolean }): void;
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** cubic-bezier jak w CSS (Newton, 6 iteracji) - 1:1 z makiety. */
const bez = (x1: number, y1: number, x2: number, y2: number) => {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const calc = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (calc(t, x1, x2) - x) / s;
    }
    return calc(t, y1, y2);
  };
};
const IN = bez(0.16, 1, 0.3, 1);
const OUT = bez(0.7, 0, 0.84, 0);
/** Podpisy indeksu, wskaźnik i barwy mgławicy: łagodne in-out, bez szarpnięć. */
const LAY = bez(0.65, 0, 0.35, 1);
const EO = (x: number) => 1 - Math.pow(1 - x, 3);

/** Sposób zmiany kadru: okno-gwiazda (domyślnie) albo dotychczasowa kurtyna od dołu. */
export type RealizacjeTransition = 'star' | 'curtain';
/** Skala gwiazdy (GEM, promień 20 jedn.) na starcie okna = promień 5 px. */
const STAR_FROM = 0.25;
/** Obrys okna i dwa powidoki przed nim (mnożniki skali). */
const STAR_ECHO = [1, 1.24, 1.56];
/** Wcięcie gwiazdy leży 7,884 jedn. od jej środka: okno zakrywa kadr, gdy wcięcia wyjdą poza jego rogi (zapas 8%). */
const STAR_WAIST = 7.884;
/** Tempo otwierania: skala rośnie wykładniczo (stałe tempo zbliżenia), łagodny start i koniec. */
const STAR_EASE = bez(0.45, 0, 0.55, 1);
/** Gwiazda logo jako clip-path w px kadru: środek (cx, cy), skala s. */
const starPath = (cx: number, cy: number, s: number) => {
  const P = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  return `path("M${P(0, -20)}C${P(1.4, -6.8)} ${P(6.8, -1.4)} ${P(20, 0)}C${P(6.8, 1.4)} ${P(1.4, 6.8)} ${P(0, 20)}`
    + `C${P(-1.4, 6.8)} ${P(-6.8, 1.4)} ${P(-20, 0)}C${P(-6.8, -1.4)} ${P(-1.4, -6.8)} ${P(0, -20)}Z")`;
};
const SVG_NS = 'http://www.w3.org/2000/svg';

type StyleProp = 'transform' | 'opacity' | 'filter' | 'clipPath' | 'zIndex';

export function createRealizacjeScene(
  section: HTMLElement,
  opts: { getScroll?: () => ScrollControl | undefined; getTransition?: () => RealizacjeTransition } = {},
): RealizacjeScene | null {
  const q = <E extends Element>(sel: string) => Array.from(section.querySelectorAll<E>(sel));
  const box = section.querySelector<HTMLElement>('[data-rz-box]');
  const glHost = section.querySelector<HTMLElement>('[data-rz-gl]');
  const stage = section.querySelector<HTMLElement>('[data-rz-stage]');
  const indexNav = section.querySelector<HTMLElement>('[data-rz-index]');
  const slabs = q<HTMLElement>('[data-rz-slab]');
  const shadows = q<HTMLElement>('[data-rz-shadow]');
  const sweeps = q<HTMLElement>('[data-rz-sweep]');
  const thumbs = q<HTMLImageElement>('[data-rz-thumb]');
  const tabs = q<HTMLAnchorElement>('[data-rz-tab]');
  const metas = q<HTMLElement>('[data-rz-meta]');
  const infos = q<HTMLElement>('[data-rz-info]');
  // Strefy, nad którymi kursor / fokus wstrzymuje automat: indeks + panele z linkami.
  const pauseZones = [...(indexNav ? [indexNav] : []), ...q<HTMLElement>('[data-rz-pause]')];
  const ind = section.querySelector<HTMLElement>('[data-rz-ind]');
  const hairline = section.querySelector<HTMLElement>('[data-rz-hairline]');
  if (!box || !stage || slabs.length !== N || shadows.length !== N || thumbs.length !== N || tabs.length !== N) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sceneLayout = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Mgławica na każdej szerokości (2026-09-24, "dostosuj do mobile" - wcześniej < 640 px bez
  // shadera). Na dotyku lżejszy bufor kompozycji (DPR ≤ 1,25 - zasada shaderów mobile); pomija
  // ją tryb oszczędzania danych i telefony z ≤ 2 GB RAM (tam zostaje poświata CSS).
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const shaderOn = !nav.connection?.saveData && !(nav.deviceMemory !== undefined && nav.deviceMemory <= 2);
  const autoplay = !reduced;
  const dur = reduced ? T_REDUCED : T;

  section.setAttribute('data-mode', sceneLayout ? 'scene' : 'flow');

  // ---------- stan ----------
  let idx = 0;
  let cur = -1;
  let sweptFor = -1;
  let u = 1; // px CSS na jednostkę kadru (kadr sceny = 1200 jednostek szerokości)
  // „Gwiazda”: wymiary kadru w px, skala okna, przy której zakrywa cały kadr, tryb bieżącego przejścia i czas,
  // przez który poprzedni kadr stoi pod oknem.
  let sw = 0, sht = 0;
  let starFull = 1;
  let starGo = false;
  let holdLen = 0;
  const starMode = () => !reduced && (opts.getTransition?.() ?? 'star') === 'star';
  // Indeks (oba układy, flow od 2026-09-24): pasek miniatur na szerokość kadru o STAŁYCH
  // pozycjach; x0 = lewa krawędź miniatury względem hairline, tw = jej szerokość (pod wskaźnik).
  // Podpisy pod miniaturą tylko w scenie - we flow nazwa jest tytułem panelu tuż niżej.
  const tabLayout = !!hairline && !!ind;
  let tabsGeo: { x0: number[]; tw: number[] } | null = null;
  const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let disposed = false;
  let running = false;
  let inView = true;
  let raf = 0;
  let lastNeb = 0;
  /** Który kadr ma atrybut data-off (ukryty - bez backdrop-filter). */
  const slabOff: boolean[] = slabs.map(() => false);
  let resizeTimer = 0;
  let autoTimer = 0;
  let hoverPause = false;
  let focusPause = false;
  let touchHoldUntil = 0;
  let manualStop = false;
  const t0 = performance.now();

  // ---------- mgławica (WebGL) w barwach realizacji ----------
  // Palety z data-tint kadrów ("r,g,b;r,g,b" = jasna; głęboka); brak/zły format → błękit Avenly.
  const FALLBACK: [RGB, RGB] = [[0.2, 0.4, 0.96], [0.2, 0.1, 0.52]];
  const palettes = slabs.map((sl): [RGB, RGB] => {
    const parts = (sl.dataset.tint || '').split(';').map((s) => s.split(',').map(Number));
    return parts.length === 2 && parts.every((c) => c.length === 3 && c.every(Number.isFinite))
      ? [parts[0] as RGB, parts[1] as RGB]
      : FALLBACK;
  });
  const c1: RGB = [0, 0, 0];
  const c2: RGB = [0, 0, 0];
  let nebula: NebulaLayer | null = null;
  let nebulaFailed = false;
  let nebulaDrawn = false;
  /** Czarna klatka sprzed odsłony sekcji jest już narysowana (do startu odsłony nic więcej nie rysujemy). */
  let nebulaBlack = false;
  if (shaderOn && glHost) {
    nebula = createNebula(
      glHost,
      () => { if (!disposed) glHost.setAttribute('data-ready', ''); },
      () => { nebulaFailed = true; },
      { maxDpr: fine ? 1.5 : 1.25 },
    );
  }

  // ---------- wejście sekcji ----------
  // Czarna sekcja (jak pasek nad nią), dopóki się do niej przewija → gdy wypełni ekran: dociągnięcie
  // do jej góry + krótka blokada scrolla (raz), tło i gwiazdy "malują się" od środka kadru →
  // nagłówek → pierwsza realizacja kurtyną, panele, miniatury → scroll wolny. Tylko gdy jest
  // mgławica, bez reduced motion i gdy sekcji jeszcze nie widać (przeładowanie w połowie strony =
  // od razu pełny widok). Stany data-reveal: wait → text → on, potem atrybut znika (CSS
  // .rz[data-reveal] w globals.css). Przejazd bez własnego scrolla użytkownika (kotwica) albo
  // przelecenie sekcji = odsłona bez blokady. Dotyk: bez dociągnięcia i blokady, start wcześniej
  // (REVEAL_SNAP_TOUCH - kadr cały na ekranie).
  type RevealStage = 'wait' | 'text' | 'on' | 'done';
  const revealOn = !reduced && !!nebula && !nebulaFailed && section.getBoundingClientRect().top > window.innerHeight * 0.85;
  let revealStage: RevealStage = revealOn ? 'wait' : 'done';
  let rv = revealOn ? 0 : 1;
  let revealT0 = -1; // start malowania (-1 = jeszcze czeka)
  let locked = false;
  let lockTimer = 0;
  let lastInput = -Infinity;

  // ---------- zapisy stylów tylko przy zmianie ----------
  const cache = new WeakMap<HTMLElement, Partial<Record<StyleProp, string>>>();
  const setStyle = (el: HTMLElement, prop: StyleProp, val: string) => {
    let c = cache.get(el);
    if (!c) { c = {}; cache.set(el, c); }
    if (c[prop] === val) return;
    c[prop] = val;
    el.style[prop] = val;
  };

  // ---------- „Gwiazda”: obrys okna i dwa powidoki ----------
  // SVG nad kadrami, przycięte do okna ze zrzutem (rama 10 jedn. + obwódka 1 px), w barwie realizacji, która się
  // otwiera (currentColor). Tworzone tutaj (bez zmian w markupie SSR i w globals.css), widoczne tylko w trakcie przejścia.
  let ringBox: HTMLElement | null = null;
  const rings: SVGPathElement[] = [];
  let ringsOn = false;
  let ringsFor = -1;
  if (!reduced) {
    ringBox = document.createElement('div');
    ringBox.setAttribute('data-rz-rings', '');
    ringBox.style.cssText = 'position:absolute;inset:calc(var(--u) * 10 + 1px);z-index:3;overflow:hidden;'
      + 'border-radius:calc(var(--u) * 10);pointer-events:none;visibility:hidden';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'display:block;overflow:visible';
    STAR_ECHO.forEach((_, k) => {
      const p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', GEM);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', k === 0 ? '1.5' : '1');
      p.setAttribute('stroke-opacity', k === 0 ? '1' : k === 1 ? '.55' : '.3');
      p.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(p);
      rings.push(p);
    });
    ringBox.appendChild(svg);
    stage.appendChild(ringBox);
  }

  const measureTabs = () => {
    if (!tabLayout || !hairline || !ind) { tabsGeo = null; return; }
    const hr = hairline.getBoundingClientRect();
    if (hr.width < 2) { tabsGeo = null; return; }
    const x0: number[] = [], tw: number[] = [];
    tabs.forEach((el) => {
      const b = el.getBoundingClientRect();
      x0.push(b.left - hr.left);
      tw.push(b.width);
    });
    tabsGeo = tw[0] > 0 ? { x0, tw } : null;
    if (tabsGeo) indTw = tween([tabsGeo.x0[idx], tabsGeo.tw[idx]]); // po resize / foncie: od razu na aktywnej
  };
  const measure = () => {
    const sr = stage.getBoundingClientRect();
    if (sr.width > 0) u = sr.width / 1200;
    sw = sr.width; sht = sr.height;
    starFull = Math.max(STAR_FROM, (Math.hypot(sw, sht) * 0.54) / STAR_WAIST);
    // Zmiana rozmiaru czyści canvas - reduced (statyczna klatka) musi narysować tło od nowa.
    // Poświata mgławicy obejmuje kadr: środek i połowa wymiarów kadru jako ułamki hosta.
    if (nebula) {
      const r = box.getBoundingClientRect();
      nebula.resize(r.width, r.height);
      if (r.width > 0 && r.height > 0 && sr.width > 0) {
        nebula.frame((sr.left + sr.width / 2 - r.left) / r.width, (sr.top + sr.height / 2 - r.top) / r.height, sr.width / 2 / r.width, sr.height / 2 / r.height);
      }
      nebulaDrawn = false;
      nebulaBlack = false; // zmiana rozmiaru czyści płótno - czarną klatkę sprzed odsłony też trzeba narysować od nowa
    }
    measureTabs();
  };

  // ---------- automat ----------
  const clearAuto = () => { window.clearTimeout(autoTimer); autoTimer = 0; };
  const scheduleAuto = () => {
    clearAuto();
    if (!autoplay || disposed) return;
    autoTimer = window.setTimeout(autoTick, AUTO_HOLD);
  };
  function autoTick() {
    autoTimer = 0;
    if (disposed) return;
    // Automat dopiero po wejściu pierwszej realizacji (odsłona sekcji).
    if (revealStage === 'wait' || revealStage === 'text') { scheduleAuto(); return; }
    if (manualStop) return; // dotyk: po ręcznym wyborze automat czeka na wyjście sekcji z ekranu
    const hold = touchHoldUntil - performance.now();
    if (hold > 0) { autoTimer = window.setTimeout(autoTick, hold + 50); return; }
    if (!inView || document.hidden || hoverPause || focusPause || busy) { scheduleAuto(); return; }
    go((idx + 1) % N, performance.now(), false);
  }

  // ---------- przejścia (nadpisywane) ----------
  // Decyzja właściciela (Sesja 31): KAŻDY wybór zawsze odgrywa pełne wejście kadru (kurtyna od
  // dołu), także przy szybkim klikaniu i powrocie do kadru, który właśnie znikał - animacja się
  // "nadpisuje". Mechanizm: wszystko, co w chwili wyboru jest widoczne, oddaje swój wygląd
  // "duchowi" (klon kadru + cienia), który zanika od DOKŁADNIE bieżącego stanu (bez skoku),
  // a wybrany kadr startuje kurtynę od zera na wierzchu - od razu przy ręcznym wyborze, po 20%
  // czasu przy automacie (rytm makiety). Kadry mają więc tylko stany: ukryty / wchodzi / widoczny.
  // Wskaźnik, podpisy + jasność miniatur i barwy mgławicy to tweeny od bieżącej wartości.
  //
  // Szybkie klikanie (fix: pasy innych projektów i zdublowany obraz): pod nową kurtyną zostaje
  // JEDNO tło. Przerwany kadr odsłonięty w >= DOMINANT domyka kurtynę w FINISH ms i staje się
  // tłem (dotychczasowe tło znika, gdy jest już przykryte); ledwo odsłonięty znika w DROP ms.
  // Duchy leżą w kolejności wyboru (nowszy wyżej) i przy każdym wyborze dostają wspólną oś
  // czasu od bieżącego wyglądu - stare tło odpływa jednym ruchem, warstwy nie rozjeżdżają się.
  /** `star` = ten kadr wchodzi (albo wszedł) przez okno-gwiazdę, a nie kurtyną. */
  type SlabState = { level: number; entering: boolean; t0: number; delay: number; len: number; star: boolean };
  const st: SlabState[] = slabs.map((_, i) => ({ level: i === 0 ? 1 : 0, entering: false, t0: 0, delay: 0, len: 0, star: false }));
  type Ghost = {
    el: HTMLElement; sh: HTMLElement;
    /** „Gwiazda”: duch stoi nieruchomo w wyglądzie z chwili wyboru (także z zamrożonym oknem-gwiazdą), dopóki nowe
        okno go nie zakryje - gaśnie tylko jego poświata; znika po `len` ms od `t0`. */
    hold: boolean;
    /** Wyjście (unosi się, rozmywa, blednie) od wyglądu z chwili t0 - przestawiane przy każdym wyborze. */
    t0: number; len: number; op0: number; dy0: number; blur0: number; sh0: number;
    /** Kurtyna: przycięcie od góry (%) clip0 → clip1 od ct0 (domknięcie tła); settle = offset wejścia, który przy tym dojeżdża do 0. */
    clip0: number; clip1: number; ct0: number; settle: number;
    /** Szybki zanik zbędnego ducha (Infinity = tło, nie znika przed końcem wyjścia). */
    dropAt: number; dropLen: number;
  };
  const ghosts: Ghost[] = [];
  /** Wejście / zanik trwa 80% czasu przejścia (makieta), reduced = 100%. */
  const span = reduced ? 1 : 0.8;
  type Tween = { a: number[]; b: number[]; t0: number; d: number };
  const tween = (v: number[]): Tween => ({ a: v.slice(), b: v.slice(), t0: 0, d: 1 });
  /** Wartość tweena w chwili `now` do `out`; zwraca true, dopóki trwa. */
  const tweenAt = (tw: Tween, now: number, out: number[]) => {
    const p = clamp((now - tw.t0) / tw.d, 0, 1);
    const e = LAY(p);
    for (let j = 0; j < tw.a.length; j++) out[j] = tw.a[j] + (tw.b[j] - tw.a[j]) * e;
    return p < 1;
  };
  const retarget = (tw: Tween, b: number[], now: number) => {
    const at = tw.a.slice();
    tweenAt(tw, now, at);
    tw.a = at; tw.b = b.slice(); tw.t0 = now; tw.d = dur;
  };
  const palOf = (i: number) => [...palettes[i][0], ...palettes[i][1]];
  const oneHot = (i: number) => Array.from({ length: N }, (_, j) => (j === i ? 1 : 0));
  const palTw = tween(palOf(0));
  const capTw = tween(oneHot(0));
  let indTw: Tween | null = null;
  const pal = palOf(0);
  const cap = oneHot(0);
  const indv = [0, 0];
  let busy = false;

  /** Wygląd kadru z poziomu (kurtyna od dołu albo okno-gwiazda; reduced = samo krycie).
      `win` = skala okna-gwiazdy w trakcie otwierania (0 = bez okna). */
  const look = (lv: number, star = false) => {
    if (reduced) return { s: lv, op: lv, dy: 0, clipPct: 0, win: 0 };
    if (star) {
      // Kadr stoi w miejscu, odsłania go okno; skala okna rośnie wykładniczo - jak wjazd w gwiazdę.
      const win = lv > 0 && lv < 1 ? STAR_FROM * Math.pow(starFull / STAR_FROM, STAR_EASE(lv)) : 0;
      return { s: lv * lv * (3 - 2 * lv), op: lv > 0 ? 1 : 0, dy: 0, clipPct: 0, win };
    }
    const s = IN(lv);
    return { s, op: lv > 0 ? 1 : 0, dy: 24 * (1 - s), clipPct: (1 - s) * 100, win: 0 };
  };
  // Bez tiltu za kursorem z makiety (decyzja właściciela 2026-09-24, "na rzecz jakości"):
  // przechylona warstwa jest przepróbkowywana i zrzut realizacji tracił ~15% ostrości (pomiar).
  // Kadr stoi płasko - transform to wyłącznie przesunięcie w pionie (kurtyna / zanik).

  /** Wygląd ducha w chwili `now`. Wyjście liczone od t0 (wspólna oś po każdym wyborze),
      domknięcie kurtyny i szybki zanik - na własnych, stałych zegarach. */
  const ghostAt = (g: Ghost, now: number) => {
    const q = clamp((now - g.t0) / g.len, 0, 1);
    if (g.hold) {
      return { done: q >= 1, k: 0, exit: 1, keep: 1, dy: g.dy0, blur: 0, op: g.op0, sh: g.sh0 * (1 - q * q * (3 - 2 * q)), clip: g.clip0 };
    }
    const k = OUT(q);
    const pc = g.clip0 === g.clip1 ? 1 : EO(clamp((now - g.ct0) / FINISH, 0, 1));
    const dq = clamp((now - g.dropAt) / g.dropLen, 0, 1);
    const exit = EO(1 - q);
    const keep = 1 - EO(dq);
    return {
      done: q >= 1 || dq >= 1,
      k, exit, keep,
      dy: g.dy0 + g.settle * (1 - pc) - 16 * k,
      blur: g.blur0 + 3 * k,
      op: g.op0 * exit * keep,
      sh: g.sh0 * (1 - k) * exit * keep,
      clip: g.clip0 + (g.clip1 - g.clip0) * pc,
    };
  };
  /** Nowy wybór: wyjście ducha rusza od nowa od bieżącego wyglądu (bez skoku) - wszystkie duchy
      mają odtąd jedną oś czasu, więc całe stare tło unosi się i blednie jednym ruchem. */
  const rebase = (g: Ghost, now: number) => {
    const v = ghostAt(g, now);
    // „Gwiazda”: duch dalej stoi (teraz pod nowym oknem), poświata gaśnie od bieżącej wartości.
    if (g.hold) { g.sh0 = v.sh; g.t0 = now; g.len = holdLen; return; }
    g.dy0 -= 16 * v.k;
    g.blur0 = v.blur;
    g.op0 *= v.exit;
    g.sh0 *= (1 - v.k) * v.exit;
    g.t0 = now;
    g.len = span * dur;
  };
  const removeGhost = (k: number) => { const g = ghosts[k]; g.el.remove(); g.sh.remove(); ghosts.splice(k, 1); };

  /** Widoczny kadr oddaje wygląd duchowi (klon kadru i cienia z bieżącymi stylami inline). */
  const spawnGhost = (i: number, now: number) => {
    const L = look(st[i].level, st[i].star);
    const el = slabs[i].cloneNode(true) as HTMLElement;
    const sh = shadows[i].cloneNode(false) as HTMLElement;
    for (const n of [el, sh]) {
      n.removeAttribute('data-rz-slab'); n.removeAttribute('data-rz-shadow'); n.removeAttribute('data-i');
      n.setAttribute('data-rz-ghost', '');
      n.style.zIndex = '1';
    }
    // Znikający kadr nie rozmywa już tła pod sobą (wydajność, 2026-10-05): przy każdej zmianie kadru liczyły się
    // dwa-trzy pełne rozmycia naraz (nowy kadr + duchy). Zostaje barwa szkła (saturate / brightness - bez tego rama
    // mignęłaby jaśniej w chwili zmiany); gaz mgławicy jest gładki, więc brak rozmycia na ramie 10 jedn. nie jest widoczny.
    el.style.setProperty('-webkit-backdrop-filter', 'saturate(150%) brightness(.82)');
    el.style.setProperty('backdrop-filter', 'saturate(150%) brightness(.82)');
    el.querySelectorAll('[data-rz-sweep]').forEach((w) => w.removeAttribute('data-rz-sweep'));
    // Klon obrazka z pamięci przeglądarki: bez lazy / async decode, żeby duch nie mignął pustą klatką.
    const im = el.querySelector('img');
    if (im) { im.alt = ''; im.loading = 'eager'; im.decoding = 'sync'; }
    // Kolejność = kolejność wyboru (nowszy duch nad starszym), niezależnie od numeru kadru:
    // wstawiany tuż przed pierwszym kadrem / cieniem, czyli za wszystkimi starszymi duchami.
    stage.insertBefore(sh, shadows[0]);
    stage.insertBefore(el, slabs[0]);
    const g: Ghost = {
      el, sh, hold: false, t0: now, len: span * dur, op0: L.op, dy0: L.dy, blur0: 0,
      sh0: parseFloat(shadows[i].style.opacity || '0') || 0,
      clip0: L.clipPct, clip1: L.clipPct, ct0: now, settle: 0,
      dropAt: Infinity, dropLen: 1,
    };
    if (starGo || L.win > 0) {
      // „Gwiazda”: klon zostaje dokładnie taki, jaki był w chwili wyboru (pełny kadr albo kadr z zamrożonym oknem przy
      // szybkim klikaniu) i stoi pod nowym oknem, aż to go zakryje.
      g.hold = true;
      g.len = holdLen;
    } else if (!reduced) {
      const backdrops = ghosts.filter((gh) => gh.dropAt === Infinity);
      if (L.s >= DOMINANT || backdrops.length === 0) {
        // Kadr był już w większości widoczny: domyka kurtynę i zostaje jedynym tłem pod nową
        // kurtyną; dotychczasowe tło znika, dopiero gdy ten kadr całkiem je przykryje.
        g.clip1 = 0;
        g.dy0 = 0;
        g.settle = L.dy;
        backdrops.forEach((b) => { b.dropAt = now + FINISH; b.dropLen = DROP_COVERED; });
      } else {
        // Ledwo odsłonięty (klik tuż po kliku): znika, a nowa kurtyna i tak go zaraz przykrywa.
        g.dropAt = now;
        g.dropLen = DROP;
      }
    }
    ghosts.push(g);
    // Bezpiecznik: najpierw odpada najstarszy znikający duch (i tak prawie niewidoczny).
    // („Gwiazda”: najstarszy duch to pełny kadr pod wszystkimi oknami - zostaje, odpada drugi w kolejności.)
    while (ghosts.length > MAX_GHOSTS) {
      const k = ghosts.findIndex((gh) => gh.dropAt !== Infinity && !gh.hold);
      removeGhost(k >= 0 ? k : ghosts[0].hold ? 1 : 0);
    }
  };
  const clearGhosts = () => { ghosts.splice(0).forEach((g) => { g.el.remove(); g.sh.remove(); }); };

  /** Stan "aktywny" (indeks, panele, poświata tła) - od razu przy wyborze, przejścia robi CSS. */
  const setActive = (a: number) => {
    if (a === cur) return;
    cur = a;
    tabs.forEach((tb, i) => {
      if (i === a) { tb.setAttribute('data-active', ''); tb.setAttribute('aria-current', 'true'); }
      else { tb.removeAttribute('data-active'); tb.removeAttribute('aria-current'); }
    });
    // Panele informacji: wejście/wyjście robią przejścia CSS ([data-on], stagger przez --d);
    // nieaktywne są inert (poza fokusem i drzewem dostępności, nie łapią kliknięć).
    infos.forEach((el, i) => {
      if (i === a) { el.setAttribute('data-on', ''); el.removeAttribute('inert'); }
      else { el.removeAttribute('data-on'); el.setAttribute('inert', ''); }
    });
    // Poświata tła (CSS, pod mgławicą / bez shadera) w kolorze realizacji - przejście robi @property.
    const g = palettes[a][0];
    const rgb = g.map((v) => Math.round(v * 255)).join(' ');
    box.style.setProperty('--rz-glow', `rgb(${rgb} / .22)`);
    // Etykieta sekcji (gwiazdki i linie) w kolorze realizacji - przejście przez @property --rz-accent.
    box.style.setProperty('--rz-accent', `rgb(${rgb})`);
  };

  // ---------- wejście sekcji: etapy ----------
  let revealClearTimer = 0;
  /** Pierwsza realizacja wchodzi kurtyną od dołu (jak przy wyborze), panele przez setActive. */
  const introFrame = (now: number) => {
    if (cur !== -1) return; // użytkownik już wybrał kadr (strzałki z klawiatury w trakcie odsłony)
    const x = st[0];
    x.level = 0; x.entering = true; x.t0 = now; x.delay = 0; x.len = span * dur;
    x.star = starMode(); // pierwsza realizacja też otwiera się gwiazdą (nad samą mgławicą)
    busy = true;
    setActive(0);
  };
  // Blokada scrolla na czas odsłony: Lenis (stop blokuje kółko i dotyk) + klawisze przewijania;
  // bez Lenisa - własna blokada kółka i dotyku. Zawsze zdejmowana (koniec, bezpiecznik, ukrycie karty).
  const blockEvent = (e: Event) => { if (e.cancelable) e.preventDefault(); };
  const onLockKey = (e: KeyboardEvent) => {
    const tg = e.target as HTMLElement | null;
    if (tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName))) return;
    if (SCROLL_KEYS.has(e.key)) e.preventDefault();
  };
  const unlock = () => {
    if (!locked) return;
    locked = false;
    window.clearTimeout(lockTimer);
    window.removeEventListener('keydown', onLockKey, true);
    window.removeEventListener('wheel', blockEvent);
    window.removeEventListener('touchmove', blockEvent);
    opts.getScroll?.()?.start();
  };
  const lock = () => {
    const target = Math.round(window.scrollY + section.getBoundingClientRect().top);
    const sc = opts.getScroll?.();
    locked = true;
    window.addEventListener('keydown', onLockKey, true);
    if (sc) {
      sc.stop();
      sc.scrollTo(target, { duration: 0.7, easing: expoOut, force: true });
    } else {
      window.addEventListener('wheel', blockEvent, { passive: false });
      window.addEventListener('touchmove', blockEvent, { passive: false });
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
    // Bezpiecznik główny liczy czas animacji (stepReveal); ten timer to zapas, gdyby klatki stanęły.
    lockTimer = window.setTimeout(unlock, REVEAL_LOCK_MAX * 2);
  };
  /** Start malowania (raz); `withLock` = dociągnięcie do sekcji + krótka blokada scrolla. */
  const startReveal = (withLock: boolean) => {
    if (revealT0 >= 0 || revealStage === 'done') return;
    revealT0 = performance.now();
    window.removeEventListener('scroll', onRevealScroll);
    if (withLock) lock();
    start();
  };
  /** Postęp z czasu (easing LAY), progi etapów; true, dopóki trwa (także blokada). */
  const stepReveal = (now: number) => {
    if (revealStage === 'done') return false;
    if (revealT0 < 0) { onRevealScroll(); if (revealT0 < 0) return false; } // próg także co klatkę (odczyt przed zapisami stylów)
    if (locked && now - revealT0 > REVEAL_LOCK_MAX) unlock(); // bezpiecznik: blokada nigdy dłużej
    rv = LAY(clamp((now - revealT0) / REVEAL_DUR, 0, 1));
    if (revealStage === 'wait' && rv >= REVEAL_TEXT) { revealStage = 'text'; section.setAttribute('data-reveal', 'text'); }
    if (revealStage === 'text' && rv >= REVEAL_FRAME) {
      revealStage = 'on';
      section.setAttribute('data-reveal', 'on');
      introFrame(now);
      // Po wejściach (kurtyna, panele, miniatury - opóźnienia w CSS) atrybut znika, żeby dodatkowe
      // opóźnienie paneli z odsłony nie działało przy kolejnych zmianach kadru.
      revealClearTimer = window.setTimeout(() => { if (!disposed) section.removeAttribute('data-reveal'); }, 2600);
    }
    // Koniec: malowanie gotowe i kurtyna pierwszej realizacji prawie domknięta → scroll wolny.
    if (revealStage === 'on' && rv >= 1 && (!st[0].entering || st[0].level >= 0.85)) { revealStage = 'done'; unlock(); }
    // Odsłona w toku = pętla pracuje do końca. (Dawniej "postęp się zmienił": znacznik czasu klatki
    // bywa wcześniejszy niż start odsłony, więc w 1. klatce postęp = 0 - gdy pętli nie trzyma
    // mgławica, np. shader padł w trakcie odsłony, animacja stawała w stanie "wait" = czarna sekcja.)
    return revealStage !== 'done' || locked;
  };
  /** Obserwacja scrolla przed odsłoną: sekcja wypełnia ekran po własnym scrollu = odsłona
      z blokadą; przejazd programowy / przelecenie sekcji = odsłona bez blokady. */
  function onRevealScroll() {
    if (revealT0 >= 0 || revealStage === 'done') return;
    const vh = window.innerHeight || 1;
    const top = section.getBoundingClientRect().top;
    if (top > vh * (fine ? REVEAL_SNAP : REVEAL_SNAP_TOUCH)) return;
    const userScroll = performance.now() - lastInput < REVEAL_INPUT_MS;
    // Blokada tylko z myszą: na dotyku walczyłaby z bezwładnym przewijaniem (iOS), a sekcja i tak
    // jest wyższa niż ekran - tam samo malowanie.
    startReveal(userScroll && fine && top > -vh * REVEAL_FLY);
  }
  const onUserInput = (e: Event) => {
    if (e.type === 'keydown' && !SCROLL_KEYS.has((e as KeyboardEvent).key)) return;
    lastInput = performance.now();
  };
  /** Klawiatura (Tab do indeksu / paneli): od razu odsłona bez blokady - nic niewidocznego z fokusem. */
  const onRevealFocus = () => startReveal(false);

  // ---------- klatka ----------
  const frame = (now: number) => {
    if (fine) { m.x += (m.tx - m.x) * 0.05; m.y += (m.ty - m.y) * 0.05; }
    const revealing = stepReveal(now);
    const round = `round ${(20 * u).toFixed(1)}px`;
    let moving = false;
    let best = 0, bs = -1;
    let winS = 0, winI = 0; // „Gwiazda”: skala otwierającego się okna i jego kadr
    for (let i = 0; i < N; i++) {
      const x = st[i];
      if (x.entering) {
        const p = clamp((now - x.t0 - x.delay) / x.len, 0, 1);
        x.level = p;
        if (p >= 1) x.entering = false; else moving = true;
      }
      const L = look(x.level, x.star);
      if (L.win > 0) { winS = L.win; winI = i; }
      const tf = `translate3d(0,${(L.dy * u).toFixed(1)}px,0)`;
      const sl = slabs[i];
      setStyle(sl, 'transform', tf);
      setStyle(sl, 'opacity', L.op.toFixed(3));
      // Ukryty kadr (krycie 0) nie rozmywa tła pod sobą (.rz-slab[data-off] w globals.css): cztery kadry leżą
      // jeden na drugim, a widać jeden - pozostałe nie powinny trzymać własnego przebiegu backdrop-filter.
      const off = L.op <= 0;
      if (slabOff[i] !== off) { slabOff[i] = off; sl.toggleAttribute('data-off', off); }
      setStyle(sl, 'filter', 'none');
      setStyle(sl, 'clipPath', L.win > 0
        ? starPath(sw / 2, sht / 2, L.win)
        : !reduced && L.clipPct > 0.01 ? `inset(${L.clipPct.toFixed(2)}% 0 0 0 ${round})` : 'none');
      setStyle(sl, 'zIndex', '2');
      setStyle(shadows[i], 'transform', tf);
      setStyle(shadows[i], 'opacity', (L.op * L.s).toFixed(3));
      if (L.s > bs) { bs = L.s; best = i; }
    }

    // „Gwiazda”: obrys okna i powidoki przed nim - tylko gdy okno się otwiera, w barwie jego realizacji.
    if (ringBox) {
      const on = winS > 0;
      if (on !== ringsOn) { ringsOn = on; ringBox.style.visibility = on ? 'visible' : 'hidden'; }
      if (on) {
        if (ringsFor !== winI) {
          ringsFor = winI;
          ringBox.style.color = `rgb(${palettes[winI][0].map((v) => Math.round(v * 255)).join(' ')})`;
        }
        const pad = 10 * u + 1; // rama kadru + obwódka: środek okna w układzie pola obrysów
        const rx = (sw / 2 - pad).toFixed(1), ry = (sht / 2 - pad).toFixed(1);
        for (let k = 0; k < rings.length; k++) {
          rings[k].setAttribute('transform', `translate(${rx} ${ry}) scale(${(winS * STAR_ECHO[k]).toFixed(4)})`);
        }
      }
    }

    // Duchy: zanik jak wychodzący kadr z makiety (unosi się, blednie, rozmycie; expo-in), od
    // bieżącego wyglądu; tło przerwanego przejścia najpierw domyka kurtynę. Po zaniku znikają z DOM.
    for (let g = ghosts.length - 1; g >= 0; g--) {
      const gh = ghosts[g];
      const v = ghostAt(gh, now);
      if (v.done) { removeGhost(g); continue; }
      moving = true;
      setStyle(gh.sh, 'opacity', v.sh.toFixed(3));
      if (gh.hold) continue; // „Gwiazda”: wygląd zamrożony z chwili wyboru, gaśnie tylko poświata
      setStyle(gh.el, 'opacity', v.op.toFixed(3));
      if (reduced) continue;
      const tf = `translate3d(0,${(v.dy * u).toFixed(1)}px,0)`;
      setStyle(gh.el, 'transform', tf);
      setStyle(gh.el, 'filter', v.blur > 0.01 ? `blur(${(v.blur * u).toFixed(2)}px)` : 'none');
      setStyle(gh.el, 'clipPath', v.clip > 0.01 ? `inset(${v.clip.toFixed(2)}% 0 0 0 ${round})` : 'none');
      setStyle(gh.sh, 'transform', tf);
    }

    // Barwy mgławicy, podpisy + jasność miniatur i wskaźnik na linii - tweeny od bieżącej wartości.
    const palMoving = tweenAt(palTw, now, pal);
    for (let c = 0; c < 3; c++) { c1[c] = pal[c]; c2[c] = pal[c + 3]; }
    moving = tweenAt(capTw, now, cap) || palMoving || moving;
    for (let i = 0; i < N; i++) {
      setStyle(thumbs[i], 'opacity', (THUMB_DIM + (1 - THUMB_DIM) * cap[i]).toFixed(3)); // aktywna w pełni, reszta przygaszona
      if (tabsGeo && sceneLayout && metas[i]) setStyle(metas[i], 'opacity', cap[i].toFixed(3)); // podpisy tylko w scenie (flow: tylko dla czytników)
    }
    if (tabsGeo && ind && indTw) {
      moving = tweenAt(indTw, now, indv) || moving;
      setStyle(ind, 'transform', `translateX(${indv[0].toFixed(1)}px) scaleX(${indv[1].toFixed(1)})`);
    }
    moving = moving || revealing;
    if (busy && !moving) scheduleAuto(); // koniec przejścia → automat liczy pauzę od nowa
    busy = moving;

    // Poświata po dojechaniu (raz na dojazd), WAAPI - poza main threadem.
    if (!reduced && bs > 0.985 && sweptFor !== best) {
      sweptFor = best;
      const sw = sweeps[best];
      if (sw && typeof sw.animate === 'function') {
        sw.animate(
          [{ left: '-30%', opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 1, offset: 0.75 }, { left: '110%', opacity: 0 }],
          { duration: 1800, easing: 'ease-in-out' },
        );
      }
    }
    if (bs < 0.5) sweptFor = -1;

    if (nebula && !nebulaFailed) {
      // reduced: statyczna klatka, przerysowana tylko w trakcie zmiany barw
      if (reduced) { if (!nebulaDrawn || palMoving) nebulaDrawn = nebula.render(0, 0.5, 0.5, c1, c2); }
      else {
        // Wydajność (2026-10-05 - właściciel: „druga sekcja laguje”): tempo liczone z CZASU, nie z numeru klatki (na
        // monitorach 120 / 144 Hz mgławica szła dawniej w ~72 kl./s). ~30 kl./s, gdy coś się dzieje (przejście kadrów,
        // zmiana barw, odsłona sekcji, kursor w ruchu - paralaksa i światło), ~20 kl./s w spoczynku: gaz płynie bardzo
        // wolno, gwiazdy dryfują < 0,2 px na klatkę. Gaz liczy się co drugie wywołanie (nebula.ts).
        const chasing = fine && (Math.abs(m.tx - m.x) > 1e-3 || Math.abs(m.ty - m.y) > 1e-3);
        const lively = moving || rv < 1 || chasing;
        // Przed odsłoną sekcji (stan "wait", rv = 0) obraz to sama czerń z ziarnem - wystarczy jedna klatka. Dawniej
        // gaz i kompozycja liczyły się wtedy w pełnym tempie od chwili, gdy sekcja zbliżała się do ekranu (czyli
        // razem ze sceną hero), tylko po to, żeby rysować czerń.
        const waiting = revealStage === 'wait' && revealT0 < 0;
        if (!(waiting && nebulaBlack) && now - lastNeb >= (lively ? 30 : 46)) {
          lastNeb = now;
          const ok = nebula.render((now - t0) / 1000, m.x, m.y, c1, c2, rv, !lively);
          nebulaBlack = waiting && ok;
        }
      }
    }
    // Nic się nie rusza (flow bez shadera / reduced po pierwszej klatce) → pętla staje
    // (automat działa na timerze, nie w pętli).
    const live = busy || (!!nebula && !nebulaFailed && (!reduced || !nebulaDrawn))
      || (fine && (Math.abs(m.tx - m.x) > 1e-3 || Math.abs(m.ty - m.y) > 1e-3));
    if (!live) stop();
  };

  const tick = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    frame(now);
  };
  function start() {
    if (running || disposed || !inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  /** Wybór kadru `to` (zawija). Zawsze pełne wejście kurtyną; widoczne kadry (także wybrany, jeśli
      jeszcze było go widać) oddają wygląd duchom. `manual` = klik / klawisz / swipe: kurtyna
      rusza od razu; automat: po 20% czasu jak w makiecie. Ręczna zmiana odkłada automat. */
  const go = (to: number, now: number, manual: boolean): boolean => {
    to = ((to % N) + N) % N;
    if (to === idx) return false;
    clearAuto();
    if (manual && !fine) manualStop = true;
    idx = to;
    // „Gwiazda” rusza od razu także w automacie (pod oknem nic się nie dzieje, więc nie ma na co czekać);
    // poprzedni kadr stoi pod spodem dokładnie tak długo, jak otwiera się okno.
    starGo = starMode();
    const delay = !manual && !reduced && !starGo ? 0.2 * dur : 0;
    holdLen = delay + span * dur;
    ghosts.forEach((g) => rebase(g, now));
    for (let i = 0; i < N; i++) {
      const x = st[i];
      if (x.level > 0.001) spawnGhost(i, now);
      x.level = 0;
      x.entering = i === to;
      x.star = i === to && starGo;
      x.t0 = now;
      x.delay = i === to ? delay : 0;
      x.len = span * dur;
    }
    retarget(palTw, palOf(to), now);
    retarget(capTw, oneHot(to), now);
    if (indTw && tabsGeo) retarget(indTw, [tabsGeo.x0[to], tabsGeo.tw[to]], now);
    busy = true;
    setActive(to);
    frame(now); // duchy przejmują wygląd w tej samej klatce, w której kadry się zerują
    start();
    return true;
  };

  // ---------- klawiatura (fokus w sekcji: linki indeksu) ----------
  const onKey = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    go(idx + dir, performance.now(), true);
  };

  // ---------- indeks: klik = przejście; aktywna pozycja / klawiatura / modyfikatory = nawigacja ----------
  const tabHandlers: Array<() => void> = [];
  tabs.forEach((tb, i) => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.detail === 0) return; // Enter z klawiatury: prawdziwy link (czytniki ekranu)
      if (i === idx && !busy) return; // aktywna, w spoczynku: zwykła nawigacja do realizacji
      e.preventDefault();
      go(i, performance.now(), true);
    };
    tb.addEventListener('click', onClick);
    tabHandlers.push(() => tb.removeEventListener('click', onClick));
  });

  // ---------- pauza automatu: kursor / fokus w indeksie lub w panelu informacji ----------
  // (link w panelu nie może zmienić się pod kursorem w chwili kliknięcia)
  const hovered = new Set<EventTarget>();
  const onIndexEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse' && e.currentTarget) { hovered.add(e.currentTarget); hoverPause = true; } };
  const onIndexLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !e.currentTarget) return;
    hovered.delete(e.currentTarget);
    hoverPause = hovered.size > 0;
    if (!hoverPause && !busy) scheduleAuto();
  };
  const onIndexFocus = () => { focusPause = true; };
  const onIndexBlur = (e: FocusEvent) => {
    const next = e.relatedTarget;
    if (next instanceof Node && pauseZones.some((z) => z.contains(next))) return;
    focusPause = false;
    if (!busy) scheduleAuto();
  };

  // ---------- swipe poziomy (dotyk, oba układy) ----------
  let touch: { x: number; y: number } | null = null;
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) touch = { x: t.clientX, y: t.clientY };
    if (!fine) touchHoldUntil = performance.now() + TOUCH_HOLD;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(idx + (dx < 0 ? 1 : -1), performance.now(), true);
  };

  // ---------- kursor (tylko mysz): paralaksa i światło mgławicy ----------
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = box.getBoundingClientRect();
    m.tx = clamp((e.clientX - r.left) / r.width, 0, 1);
    m.ty = clamp((e.clientY - r.top) / r.height, 0, 1);
    start();
  };
  const onLeave = () => { m.tx = 0.5; m.ty = 0.5; start(); };

  // ---------- obserwatory ----------
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView) manualStop = false; // powrót do sekcji = automat znowu działa
    requestAnimationFrame(() => {
      if (inView) { start(); if (!busy && !autoTimer) scheduleAuto(); }
      else { stop(); clearAuto(); }
    });
  }, { rootMargin: '100px' });
  io.observe(section);
  const onVisibility = () => {
    if (document.hidden) { stop(); clearAuto(); unlock(); }
    else { start(); if (!busy) scheduleAuto(); }
  };
  document.addEventListener('visibilitychange', onVisibility);
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { if (!disposed) { measure(); start(); } }, 120);
  });
  ro.observe(box);
  // Po podmianie fontu zmieniają się szerokości opisów - nowy pomiar + klatka z nowymi przesunięciami.
  const onFonts = () => { if (!disposed) { measure(); start(); } };
  document.fonts?.ready.then(onFonts, onFonts);

  if (fine) {
    box.addEventListener('pointermove', onMove, { passive: true });
    box.addEventListener('pointerleave', onLeave, { passive: true });
  }
  box.addEventListener('touchstart', onTouchStart, { passive: true });
  box.addEventListener('touchend', onTouchEnd, { passive: true });
  section.addEventListener('keydown', onKey);
  pauseZones.forEach((z) => {
    z.addEventListener('pointerenter', onIndexEnter);
    z.addEventListener('pointerleave', onIndexLeave);
    z.addEventListener('focusin', onIndexFocus);
    z.addEventListener('focusout', onIndexBlur);
  });

  measure();
  if (revealOn) {
    // Czarny start: kadr ukryty (poziom 0), panele wyłączone, nagłówek i indeks chowa CSS.
    section.setAttribute('data-reveal', 'wait');
    st[0].level = 0;
    infos.forEach((el) => { el.removeAttribute('data-on'); el.setAttribute('inert', ''); });
    window.addEventListener('scroll', onRevealScroll, { passive: true });
    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('touchmove', onUserInput, { passive: true });
    window.addEventListener('keydown', onUserInput, { passive: true });
    section.addEventListener('focusin', onRevealFocus);
    onRevealScroll();
  } else {
    setActive(0);
  }
  // Pierwsza klatka synchronicznie: od data-mode="scene" CSS już nie chowa opisów indeksu,
  // więc przesunięcia i clip muszą trafić do DOM przed najbliższym paintem.
  frame(performance.now());
  start();
  scheduleAuto();
  section.setAttribute('data-scene', 'on');

  return {
    destroy() {
      disposed = true;
      stop();
      clearAuto();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(revealClearTimer);
      unlock();
      window.removeEventListener('scroll', onRevealScroll);
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchmove', onUserInput);
      window.removeEventListener('keydown', onUserInput);
      section.removeEventListener('focusin', onRevealFocus);
      section.removeAttribute('data-reveal');
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
      box.removeEventListener('touchstart', onTouchStart);
      box.removeEventListener('touchend', onTouchEnd);
      section.removeEventListener('keydown', onKey);
      pauseZones.forEach((z) => {
        z.removeEventListener('pointerenter', onIndexEnter);
        z.removeEventListener('pointerleave', onIndexLeave);
        z.removeEventListener('focusin', onIndexFocus);
        z.removeEventListener('focusout', onIndexBlur);
      });
      tabHandlers.forEach((fn) => fn());
      clearGhosts();
      ringBox?.remove();
      slabs.forEach((sl) => sl.removeAttribute('data-off'));
      // Zmiana układu (scena → flow) buduje scenę od nowa - flow nie może dostać przesunięć indeksu.
      tabs.forEach((tb) => { tb.style.transform = ''; });
      metas.forEach((mt) => { mt.style.opacity = ''; mt.style.clipPath = ''; });
      if (ind) ind.style.transform = '';
      nebula?.destroy();
      nebula = null;
      glHost?.removeAttribute('data-ready');
      section.removeAttribute('data-scene');
      section.removeAttribute('data-mode');
    },
  };
}
