'use client';

import { useEffect, useRef } from 'react';
import { createNebulaPlus, type NebulaPlus } from './nebula';

// Tło całej podstrony Usługi - MGŁAWICA z podstrony Realizacje (2026-09-30, właściciel: „podkradnij tło, które jest
// na podstronie Realizacje”). Sterowanie dopasowane do katalogu:
//   - jedno płótno przyklejone do okna ZA całą treścią (nagłówek i galeria),
//   - ujęcie otwierające OD RAZU Z CZERNI (właściciel 2026-09-30: „żeby od razu z pitch black tła robiła się mgławica”):
//     start w pierwszej klatce po wejściu (nie po bezczynności), płótno bez wygaszania i bez zastępczej poświaty -
//     gaz rozlewa się od dołu ekranu poszarpaną krawędzią ze świetlistym frontem, gwiazdy zapalają się po kolei,
//   - w nagłówku blask wschodzi zza dolnej krawędzi ekranu w kolorze marki (tekst stoi na ciemnym niebie),
//   - w galerii blask siedzi wokół karty usługi najbliżej środka okna i płynnie przyjmuje kolor jej podstrony
//     (TINTS - kolory motywów z lib/service-theme.ts); przy przewijaniu gaz i trzy warstwy gwiazd płyną z różną prędkością,
//   - BEZ INTERAKCJI Z KURSOREM (właściciel 2026-10-05, po tej samej zmianie na podstronach usług - „usuń hover na tle
//     i dystorsję, bo laguje” - o katalogu: „z podstrony /uslugi też usuń ten efekt”): tło nie nasłuchuje wskaźnika -
//     bez czarnej dziury, smugi i fal po kliknięciach, blask nie przeskakuje na kartę pod kursorem. NIE przywracać
//     bez prośby.
// Telefon (właściciel 2026-10-01: „animacje pojawiania się mgławicy na mobile też zrób tak samo zajebiście jak na kompie”):
// odsłona liczy się od PIERWSZEJ NARYSOWANEJ klatki (dawniej od utworzenia płótna - przy wolniejszej kompilacji na telefonie
// początek odsłony przepadał i mgławica wskakiwała w połowie), w trakcie odsłony 60 fps; w jednej kolumnie kart (< 700 px)
// celem jest WIDOCZNA część karty (karty są wyższe od połowy ekranu - ich środek wypadał poza pas wyboru, więc mgławica
// wschodziła spod dolnej krawędzi i ledwie ją było widać; teraz rozkwita wokół karty jak na komputerze); położenia liczone
// względem wysokości płótna (100lvh), nie widocznej części okna (iOS z paskiem narzędzi); ostre gwiazdy (DPR do 2 z budżetem
// pikseli, ≤ 3 GB RAM: 1,25).
// Wydajność: start w pierwszej klatce (kompilacja asynchroniczna); 60 fps tylko przez 3 s odsłony, potem ~30 fps przy
// przewijaniu i gdy blask lub kolor jeszcze dojeżdżają, ~20 fps w spoczynku; drogi przebieg gazu rzadziej (w spoczynku co
// 3. klatkę, przy ruchu kadru co 2.), kompozycja bez pętli soczewki (opcja still); położenie kart mierzone tylko po
// przewinięciu / zmianie okna (w spoczynku co MEASURE_MS); pauza przy ukrytej karcie przeglądarki i gdy tło wyjedzie
// z ekranu; DPR ≤ 1,5 (dotyk ≤ 2 i maks. 1,1 mln px, gaz w niższej rozdzielczości), Save-Data / ≤ 2 GB RAM /
// brak WebGL = poświata CSS (.us-sky).
// Ograniczony ruch: bez odsłony, jedna klatka po każdej zmianie celu.

type RGB = [number, number, number];
/** Barwy mgławicy [jasna, głęboka] na karcie usługi (klucz = polska ścieżka podstrony, jak `key` w modelu). */
const TINTS: Record<string, [RGB, RGB]> = {
  '/uslugi/strony-www/one-page': [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]],
  '/uslugi/strony-www/strona-firmowa': [[0.06, 0.72, 0.5], [0.02, 0.2, 0.16]],
  '/uslugi/strony-www/strona-szyta-na-miare': [[0.95, 0.25, 0.38], [0.34, 0.03, 0.12]],
  '/uslugi/strony-www/sklep-internetowy': [[0.96, 0.62, 0.06], [0.42, 0.14, 0.02]],
  '/uslugi/strony-www/system-crm': [[0.06, 0.64, 0.92], [0.03, 0.14, 0.36]],
  '/uslugi/automatyzacje-ai/chatboty-ai': [[0.98, 0.45, 0.1], [0.4, 0.1, 0.02]],
  '/uslugi/marketing/audyt-wydajnosci-seo': [[0.08, 0.72, 0.65], [0.02, 0.2, 0.2]],
};
/** Kolor marki (nagłówek, karta „Nie wiesz, co wybrać?”). */
const BRAND_TINT: [RGB, RGB] = [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]];
const tintOf = (key: string | null | undefined) => (key && TINTS[key]) || BRAND_TINT;

const REVEAL_MS = 3000;
const FRAME_FAST = 1000 / 60, FRAME_MS = 1000 / 30, FRAME_REST = 1000 / 20;
/** Tyle ms po ostatnim przewinięciu / ruchu blasku tło trzyma ~30 fps, potem zwalnia do ~20 fps. */
const BUSY_HOLD = 240;
/** Bez przewijania położenie kart sprawdzamy co tyle ms (filtr kategorii, wejścia kart). */
const MEASURE_MS = 250;
/** Cel blasku, gdy żadna karta nie jest w środkowym pasie okna: szeroka elipsa pod dolną krawędzią (wschód zza horyzontu).
    Ułamki widocznej części okna (target() przelicza na wysokość płótna). */
const REST = { cx: 0.5, cy: 1.12, hw: 0.46, hh: 0.2 };
/** Jedna kolumna kart (siatka w uslugi.css: 2 kolumny od 700 px). */
const ONE_COL = '(max-width: 699.98px)';
const NO_TRAIL = new Float32Array(32), NO_WAVES = new Float32Array(24);

type Goal = { tint: [RGB, RGB]; cx: number; cy: number; hw: number; hh: number };

/** onReady: pierwsza klatka mgławicy narysowana (albo brak WebGL / słabe urządzenie) - Catalog.tsx startuje wtedy
    wejście tekstu (kolejność: czerń, mgławica, tekst, karty). */
export const Sky = ({ onReady }: { onReady?: () => void }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    const root = host?.closest('.us');
    if (!host || !root) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    // słabe urządzenie: bez WebGL, zostaje poświata CSS (.us-sky-neb[data-fail])
    if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2)) { host.setAttribute('data-fail', ''); readyRef.current?.(); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const oneCol = window.matchMedia(ONE_COL);
    // wysokość płótna (100lvh) - uv shadera jest liczone względem niej, nie względem widocznej części okna
    const canvasH = () => host.clientHeight || window.innerHeight;
    let neb: NebulaPlus | null = null, raf = 0, dead = false, last = 0, t0 = -1, drawn = false, prev = -1;
    let onScreen = true, busyAt = -1e9;
    const cur = { c1: [...BRAND_TINT[0]] as RGB, c2: [...BRAND_TINT[1]] as RGB, ...REST };
    let tg: Goal | null = null, tgAt = -1e9, tgY = NaN, tgW = 0, tgH = 0;

    const loop = (now: number) => {
      raf = 0;
      if (dead || document.hidden || !onScreen || !neb) return;
      const gap = t0 < 0 || (!reduced && now - t0 < REVEAL_MS) ? FRAME_FAST : now - busyAt < BUSY_HOLD ? FRAME_MS : FRAME_REST;
      if (now - last >= gap - 1) { last = now; step(now); }
      if (!reduced || !drawn) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && !dead && neb) raf = requestAnimationFrame(loop); };

    // Cel: karta (z data-sky), której środek jest najbliżej środka okna - tylko w środkowym pasie okna (15-85% wysokości),
    // inaczej wschód blasku zza dolnej krawędzi w kolorze marki (nagłówek). W jednej kolumnie liczy się widoczna część
    // karty (co najmniej 18% wysokości okna). Pomiar tylko wtedy, gdy coś mogło się zmienić (przewinięcie, rozmiar okna),
    // w spoczynku co MEASURE_MS.
    const target = (now: number): Goal => {
      const vw = window.innerWidth, vh = window.innerHeight, y = window.scrollY;
      if (tg && y === tgY && vw === tgW && vh === tgH && now - tgAt < MEASURE_MS) return tg;
      tgAt = now; tgY = y; tgW = vw; tgH = vh;
      const ch = canvasH(), part = oneCol.matches;
      let best: HTMLElement | null = null, br: DOMRect | null = null, bd = Infinity;
      root.querySelectorAll<HTMLElement>('[data-sky]').forEach((el) => {
        let r = el.getBoundingClientRect();
        if (!r.width) return;
        if (part) {
          const top = Math.max(0, r.top), bot = Math.min(vh, r.bottom);
          if (bot - top < vh * 0.18) return;
          r = new DOMRect(r.left, top, r.width, bot - top);
        }
        const my = r.top + r.height / 2;
        if (my < vh * 0.15 || my > vh * 0.85) return;
        const dd = Math.hypot((r.left + r.width / 2 - vw / 2) * 0.6, my - vh / 2);
        if (dd < bd) { bd = dd; best = el; br = r; }
      });
      if (!best || !br) return (tg = { tint: BRAND_TINT, cx: REST.cx, cy: (REST.cy * vh) / ch, hw: REST.hw, hh: (REST.hh * vh) / ch });
      const r = br as DOMRect;
      return (tg = {
        tint: tintOf((best as HTMLElement).dataset.sky),
        cx: (r.left + r.width / 2) / vw, cy: (r.top + r.height / 2) / ch,
        hw: Math.min(0.48, r.width / 2 / vw), hh: Math.min(0.46, r.height / 2 / ch),
      });
    };

    function step(now: number) {
      if (!neb) return;
      const dt = prev < 0 ? 1 / 30 : Math.min(0.1, Math.max(0.004, (now - prev) / 1000));
      prev = now;
      const goal = target(now);
      // przed pierwszą klatką cel od razu na miejscu: odsłona rozkwita wokół celu niezależnie od czasu kompilacji
      const snap = reduced || t0 < 0;
      const kc = snap ? 1 : 1 - Math.pow(0.93, dt * 30), kf = snap ? 1 : 1 - Math.pow(0.9, dt * 30);
      let far = Math.abs(goal.cx - cur.cx) + Math.abs(goal.cy - cur.cy) + Math.abs(goal.hw - cur.hw) + Math.abs(goal.hh - cur.hh);
      for (let i = 0; i < 3; i++) {
        far += Math.abs(goal.tint[0][i] - cur.c1[i]) + Math.abs(goal.tint[1][i] - cur.c2[i]);
        cur.c1[i] += (goal.tint[0][i] - cur.c1[i]) * kc;
        cur.c2[i] += (goal.tint[1][i] - cur.c2[i]) * kc;
      }
      // blask albo kolor jeszcze dojeżdżają do celu - trzymamy ~30 fps (płynne przejście po zatrzymaniu przewijania)
      if (far > 0.004) busyAt = now;
      cur.cx += (goal.cx - cur.cx) * kf; cur.cy += (goal.cy - cur.cy) * kf;
      cur.hw += (goal.hw - cur.hw) * kf; cur.hh += (goal.hh - cur.hh) * kf;
      neb.frame(cur.cx, cur.cy, cur.hw, cur.hh);
      // bez soczewki, smugi i fal - z interakcji modułu zostaje tylko przewinięcie (głębia)
      neb.interact({ cx: 0.5, cy: 0.5, lens: 0, trail: NO_TRAIL, waves: NO_WAVES, scrollY: window.scrollY, viewH: window.innerHeight });
      // odsłona od pierwszej narysowanej klatki (t0 < 0 = shadery jeszcze się kompilują)
      const rv = reduced ? 1 : t0 < 0 ? 0 : Math.min(1, (now - t0) / REVEAL_MS);
      const e = 1 - Math.pow(1 - rv, 3);
      const ok = neb.render(reduced || t0 < 0 ? 0 : (now - t0) / 1000, 0.5, 0.5, cur.c1, cur.c2, e);
      if (ok && t0 < 0) t0 = now;
      drawn = ok || drawn;
    }

    const resize = () => {
      if (!neb) return;
      neb.resize(host.clientWidth, host.clientHeight);
      tgAt = -1e9;
      if (reduced) drawn = false;
      kick();
    };
    const onScroll = () => { busyAt = performance.now(); if (reduced) { drawn = false; kick(); } };
    const start = () => {
      if (dead || neb) return;
      neb = createNebulaPlus(host, () => { host.setAttribute('data-ready', ''); readyRef.current?.(); }, () => { host.setAttribute('data-fail', ''); readyRef.current?.(); }, {
        maxDpr: touch ? (nav.deviceMemory && nav.deviceMemory <= 3 ? 1.25 : 2) : 1.5,
        maxPx: touch ? 1.1e6 : undefined,
        gasScale: touch ? 0.55 : 0.6,
        still: true,
        // ograniczony ruch rysuje pojedyncze klatki (po przewinięciu / zmianie celu) - każda z aktualnym gazem
        gasEvery: reduced ? 1 : 3,
        gasBusy: reduced ? 1 : 2,
      });
      resize();
      kick();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; if (onScreen) kick(); });
    io.observe(host);
    // Filtr kategorii montuje karty od nowa - przy ograniczonym ruchu trzeba przerysować (nowy cel).
    const mo = reduced ? new MutationObserver(() => { tgAt = -1e9; drawn = false; kick(); }) : null;
    mo?.observe(root, { childList: true, subtree: true });
    const onVis = () => kick();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    // start od razu po hydratacji góry strony (galeria hydratuje się osobno - Suspense w Catalog.tsx), bez czekania
    // na kolejną klatkę; kompilacja shaderów jest asynchroniczna
    start();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      neb?.destroy();
      host.removeAttribute('data-ready');
      host.removeAttribute('data-fail');
    };
  }, []);

  return (
    <div className="us-sky" aria-hidden="true">
      <div ref={hostRef} className="us-sky-neb" />
    </div>
  );
};
