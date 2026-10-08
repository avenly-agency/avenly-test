'use client';

import { useEffect, useRef } from 'react';
import { createNebulaPlus, type NebulaPlus } from './nebula';
import { pickSky } from './shared';

// Mgławica jako KLIMAT całej podstrony Realizacje (runda 4, właściciel: „nie chciałem 1:1 modułu ze strony głównej,
// tylko zamysł mgławicy - zrób z tego cinematic i kilka wersji tej podstrony”). Jedno płótno przyklejone do okna za całą
// treścią podstrony (lista i case study).
//   - ujęcie otwierające: gaz rozlewa się poszarpaną krawędzią ze świetlistym frontem, gwiazdy zapalają się po kolei,
//   - blask mgławicy siedzi wokół kadru realizacji, która jest teraz na ekranie (kadr z atrybutem data-sky najbliżej
//     środka okna), a barwy przechodzą płynnie w kolory tej realizacji; w nagłówku blask wschodzi zza dolnej krawędzi
//     ekranu w kolorze marki (tekst nagłówka stoi na ciemnym niebie),
//   - przy przewijaniu gaz i trzy warstwy gwiazd płyną z różną prędkością (głębia),
//   - BEZ INTERAKCJI Z KURSOREM (właściciel 2026-10-05, po tej samej zmianie na podstronach usług i w katalogu usług -
//     „usuń hover na tle i dystorsję, bo laguje”, potem „z realizacji też usuń”): tło nie nasłuchuje myszy ani palca -
//     bez czarnej dziury, smugi i fal po kliknięciach (runda 5), blask nie przeskakuje na kartę pod kursorem (runda 16).
//     NIE przywracać bez prośby. Shader (./nebula.ts) ma interakcję nadal w kodzie - tu działa wariant `still`.
// Telefon (runda 17, właściciel: „animacje pojawiania się mgławicy na mobile też zrób tak samo zajebiście jak na kompie”;
// te same poprawki co w /uslugi - chat 2): odsłona od PIERWSZEJ NARYSOWANEJ klatki (wcześniej od pierwszego kroku pętli -
// przy wolniejszej kompilacji na telefonie początek przepadał), w trakcie odsłony 60 fps, front i zapalanie gwiazd na ekranie
// pionowym w proporcjach ekranu (nebula.ts), położenia względem wysokości płótna (100lvh), ostre gwiazdy (DPR do 2 z budżetem pikseli).
// Wydajność: start od razu po montażu (kompilacja shadera asynchroniczna); 60 fps tylko przez 3 s odsłony, potem ~30 fps
// przy przewijaniu i gdy blask lub kolor jeszcze dojeżdżają, ~20 fps w spoczynku; drogi przebieg gazu rzadziej (w spoczynku
// co 3. klatkę, przy ruchu kadru co 2.), kompozycja bez pętli soczewki; położenie kadrów mierzone tylko po przewinięciu /
// zmianie okna (w spoczynku co MEASURE_MS); pauza przy ukrytej karcie i gdy tło wyjedzie z ekranu; DPR ≤ 1,5 (dotyk ≤ 2
// i maks. 1,1 mln px, ≤ 3 GB RAM: 1,25; gaz w niższej rozdzielczości), Save-Data / ≤ 2 GB RAM / brak WebGL = poświata CSS (.rl-sky).
// Ograniczony ruch: bez odsłony, jedna klatka po każdej zmianie celu.

type RGB = [number, number, number];
/** Barwy mgławicy [jasna, głęboka] - jak `tint` realizacji w sekcji na stronie głównej (lib/i18n/home/realizacje.ts). */
export const TINTS: Record<string, [RGB, RGB]> = {
  'klub-sportowy': [[0.86, 0.16, 0.13], [0.34, 0.03, 0.08]],
  'grawerstwo-kardys': [[0.86, 0.62, 0.30], [0.42, 0.05, 0.08]],
  'wirtualny-asystent-ai': [[0.20, 0.40, 0.96], [0.20, 0.10, 0.52]],
  mcentrumfizjoterapia: [[1.0, 0.52, 0.08], [0.40, 0.16, 0.02]],
};
/** Kolor marki (nagłówek, „Twoja firma może być następna”). */
export const BRAND_TINT: [RGB, RGB] = [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]];
const tintOf = (slug: string | null | undefined) => (slug && TINTS[slug]) || BRAND_TINT;

/** Otwarcie (runda 10, właściciel: „żeby od razu z pitch black tła się robiła mgławica”): strona startuje w czerni,
    mgławica wyłania się od razu po kompilacji shadera - jak w /uslugi: od blasku (w nagłówku zza dolnej krawędzi ekranu), poszarpanym frontem gazu, gwiazdy
    zapalają się od środka na zewnątrz. */
const REVEAL_MS = 3000;
const FRAME_FAST = 1000 / 60, FRAME_MS = 1000 / 30, FRAME_REST = 1000 / 20;
/** Tyle ms po ostatnim przewinięciu / ruchu blasku tło trzyma ~30 fps, potem zwalnia do ~20 fps. */
const BUSY_HOLD = 240;
/** Bez przewijania położenie kadrów sprawdzamy co tyle ms (filtr kategorii, wejścia kart). */
const MEASURE_MS = 250;
/** Cel blasku, gdy żaden kadr nie jest na ekranie: szeroka elipsa pod dolną krawędzią okna (wschód zza horyzontu). */
const REST = { cx: 0.5, cy: 1.12, hw: 0.46, hh: 0.2 };
const NO_TRAIL = new Float32Array(32), NO_WAVES = new Float32Array(24);

type Goal = { tint: [RGB, RGB]; cx: number; cy: number; hw: number; hh: number };

/** onReady: pierwsza klatka mgławicy narysowana (albo brak WebGL / słabe urządzenie) - strona startuje wtedy wejście
    tekstu (kolejność jak w /uslugi: czerń, mgławica, tekst po kolei, reszta - useIntro w shared.tsx). */
export const Sky = ({ tint, onReady }: { tint?: string; onReady?: () => void }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    // Save-Data / słaby telefon: bez WebGL - poświata CSS (data-fail)
    if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2)) { host.setAttribute('data-fail', ''); readyRef.current?.(); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let neb: NebulaPlus | null = null, raf = 0, dead = false, last = 0, t0 = -1, drawn = false, prev = -1;
    let onScreen = true, busyAt = -1e9;
    const base = tintOf(tint);
    const cur = { c1: [...base[0]] as RGB, c2: [...base[1]] as RGB, ...REST };
    let tg: Goal | null = null, tgAt = -1e9, tgY = NaN, tgW = 0, tgH = 0;

    const loop = (now: number) => {
      raf = 0;
      if (dead || document.hidden || !onScreen || !neb) return;
      const gap = t0 < 0 || (!reduced && now - t0 < REVEAL_MS) ? FRAME_FAST : now - busyAt < BUSY_HOLD ? FRAME_MS : FRAME_REST;
      if (now - last >= gap - 1) { last = now; step(now); }
      if (!reduced || !drawn) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && !dead && neb) raf = requestAnimationFrame(loop); };

    // Cel: kadr z data-sky najbliżej środka okna (pickSky w shared.tsx; bez pierwszeństwa karty pod kursorem). Pomiar
    // tylko wtedy, gdy coś mogło się zmienić (przewinięcie, rozmiar okna), w spoczynku co MEASURE_MS.
    const target = (now: number): Goal => {
      const vw = window.innerWidth, vh = window.innerHeight, y = window.scrollY;
      if (tg && y === tgY && vw === tgW && vh === tgH && now - tgAt < MEASURE_MS) return tg;
      tgAt = now; tgY = y; tgW = vw; tgH = vh;
      const pick = pickSky(null);
      if (!pick) return (tg = { tint: base, ...REST });
      const r = pick.r;
      const slug = pick.el.dataset.sky;
      // położenie względem wysokości płótna (100lvh), nie widocznej części okna - uv shadera liczy się od płótna
      // (iOS z paskiem narzędzi: okno niższe od płótna; runda 17, jak w /uslugi)
      const ch = host.clientHeight || vh;
      return (tg = {
        // kadr ze znaną barwą świeci po swojemu także w case study (zapowiedź następnej realizacji), reszta w barwie strony
        tint: (slug && TINTS[slug]) || base,
        cx: (r.left + r.width / 2) / vw, cy: (r.top + r.height / 2) / ch,
        hw: Math.min(0.48, r.width / 2 / vw), hh: Math.min(0.46, r.height / 2 / ch),
      });
    };

    function step(now: number) {
      if (!neb) return;
      const dt = prev < 0 ? 1 / 30 : Math.min(0.1, Math.max(0.004, (now - prev) / 1000));
      prev = now;
      const goal = target(now);
      // współczynniki wygładzania niezależne od liczby klatek; przed pierwszą narysowaną klatką cel od razu
      // na miejscu - odsłona rozkwita wokół celu niezależnie od czasu kompilacji shadera
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
      // bez soczewki, smugi i fal - z interakcji modułu zostaje tylko przewinięcie (głębia) i środek odsłony
      neb.interact({
        cx: 0.5, cy: 0.5, lens: 0, trail: NO_TRAIL, waves: NO_WAVES,
        scrollY: window.scrollY, viewH: window.innerHeight, rc: [cur.cx, cur.cy],
      });
      // odsłona liczona od PIERWSZEJ NARYSOWANEJ klatki (runda 17, jak w /uslugi; t0 < 0 = shadery jeszcze się kompilują) -
      // dawniej od pierwszego kroku pętli: przy wolniejszej kompilacji na telefonie początek odsłony przepadał i mgławica
      // wskakiwała w połowie
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
        // dotyk (runda 17, jak w /uslugi): ostre gwiazdy - DPR do 2 z budżetem 1,1 mln px kompozycji (≤ 3 GB RAM: 1,25)
        maxDpr: touch ? (nav.deviceMemory && nav.deviceMemory <= 3 ? 1.25 : 2) : 1.5,
        maxPx: touch ? 1.1e6 : undefined,
        gasScale: touch ? 0.55 : 0.6,
        still: true,
        // ograniczony ruch rysuje pojedyncze klatki (po przewinięciu) - każda z aktualnym gazem
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
    const onVis = () => kick();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    // start od razu (bez czekania na bezczynność) - czerń strony przechodzi w mgławicę jak najwcześniej
    start();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      neb?.destroy();
      host.removeAttribute('data-ready');
      host.removeAttribute('data-fail');
    };
  }, [tint]);

  return (
    <div className="rl-sky" aria-hidden="true">
      <div ref={hostRef} className="rl-sky-neb" />
    </div>
  );
};
