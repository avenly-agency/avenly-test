'use client';

import { useEffect, useRef } from 'react';
// Shader mgławicy z podstrony Realizacje (decyzja koordynatora: nie robić trzeciej kopii; scalenie we wspólny moduł =
// zadanie „porządki”). Tu jest wyłącznie sterowanie dopasowane do podstron usług. 2026-10-05 moduł dostał opcje
// still / gasEvery / gasBusy - wartości domyślne to dawne zachowanie, więc /realizacje działa bez zmian.
import { createNebulaPlus, type NebulaPlus } from '../../realizacje/_rl/nebula';
import type { SkyTint } from './theme';

// Tło podstrony usługi: MGŁAWICA w kolorze motywu podstrony (zasady z etapu 2 - świat strony głównej, wejście z czerni,
// nigdy maski za nagłówkiem).
//   - jedno płótno przyklejone do okna ZA całą treścią podstrony,
//   - blask siedzi wokół sceny pokazującej usługę: element z atrybutem data-sky najbliżej środka okna; gdy żadnego
//     nie ma na ekranie, blask wschodzi zza dolnej krawędzi (tekst stoi na ciemnym niebie),
//   - BEZ INTERAKCJI (właściciel 2026-10-05: „usuń na każdej podstronie w usłudze hover na tle i dystorsję, bo laguje”):
//     kursor i palec nie uginają tła („czarna dziura”), nie ma smugi za kursorem ani fal po kliknięciach, tło nie
//     nasłuchuje wskaźnika - NIE przywracać bez prośby. Zostaje głębia przy przewijaniu (gaz i gwiazdy wolniej niż treść),
//   - odsłona od pierwszej NARYSOWANEJ klatki (3 s, 60 fps), kompozycja bez pętli soczewki,
//   - PŁYNNOŚĆ (2026-10-06, właściciel: „w ogóle efekty na nebuli lagują, np. to z podświetleniem, co się dzieje przy
//     scrollu … weź to zoptymalizuj”): po optymalizacji z 2026-10-05 blask wokół sceny był częścią drogiego przebiegu
//     gazu, a ten rysował się tylko 10-15 razy na sekundę - przesuwające się podświetlenie skakało. Teraz (opcja
//     liveGlow modułu) blask i winietę liczy tania kompozycja w KAŻDEJ klatce, a gaz jest przerysowywany rzadko (co
//     ~260 ms albo gdy przewinięcie ucieknie od narysowanego - płynie bardzo wolno, więc tego nie widać). Zaoszczędzony
//     koszt idzie w klatki: gdy coś się rusza (przewijanie, blask w drodze do nowej sceny), kompozycja rysuje do 60 kl./s
//     - jeśli sprzęt utrzymał tempo w czasie odsłony (próba: mediana odstępu klatek ≤ 21 ms), inaczej ~30 kl./s jak
//     dotąd; w spoczynku ~20 kl./s. NIE wracać do blasku w przebiegu gazu przy rzadkim gazie,
//   - ODSŁONA (2026-10-06, właściciel: „wszędzie pierwsze pojawianie się nebuli po wejściu nie jest płynne i szarpie”):
//     (1) front odsłony też liczy kompozycja, więc w czasie odsłony gaz NIE jest już rysowany w każdej klatce (dotąd
//     przez 3 s szły oba przebiegi naraz, 60 razy na sekundę - najcięższy moment całego tła, do tego w trakcie
//     ładowania strony); (2) zegar odsłony to suma przyciętych kroków (`rvT`), nie czas ścienny - zgubiona klatka nie
//     daje przeskoku frontu,
//   - położenie sceny mierzone tylko po przewinięciu / zmianie okna (w spoczynku co MEASURE_MS), lista scen co QUERY_MS,
//   - pauza przy ukrytej karcie i gdy tło wyjedzie z ekranu (stopka),
//   - Save-Data / ≤ 2 GB RAM / brak WebGL: poświata CSS (.sv-sky-neb[data-fail]); ograniczony ruch: jedna klatka.
// onReady: pierwsza klatka (albo brak WebGL) - korzeń startuje wtedy wejście tekstu (useIntro w shared.tsx).

type RGB = [number, number, number];
const REVEAL_MS = 3000;
/** Największy krok zegara odsłony na jedną narysowaną klatkę (ms) - patrz `rvT`. Przy stałych ≥ 30 kl./s odsłona trwa
    dokładnie REVEAL_MS; wolniej albo po zacięciu trwa dłużej, ale nie skacze. */
const REVEAL_STEP = 34;
// spoczynek ~30 kl./s (do 2026-10-06 ~20: po odsłonie w 60 kl./s tło wyglądało na „poklatkowane”; gaz i tak płynie
// teraz z przenikania klatek kluczowych, więc każda klatka kompozycji jest tania)
const FRAME_FAST = 1000 / 60, FRAME_MS = 1000 / 30, FRAME_REST = 1000 / 30;
/** Tyle ms po ostatnim przewinięciu tło trzyma szybkie tempo (paralaksa gwiazd), potem zwalnia do ~20 fps. */
const SCROLL_HOLD = 240;
/** Tyle ms po ostatnim kroku blasku w drodze do celu tło trzyma szybkie tempo (blask dojeżdża płynnie także po
    zatrzymaniu przewijania); GLOW_EPS = od jakiej odległości od celu blask uznajemy za będący w ruchu. */
const GLOW_HOLD = 140, GLOW_EPS = 0.003;
/** Próba sprzętu w czasie odsłony: mediana odstępu klatek nie większa niż tyle ms = szybkie tempo do 60 kl./s. */
const PROBE_OK_MS = 21, PROBE_MIN = 40;
const QUERY_MS = 1000, MEASURE_MS = 250;
/** Cel blasku bez sceny na ekranie: szeroka elipsa pod dolną krawędzią okna (wschód zza horyzontu). */
const REST = { cx: 0.5, cy: 1.12, hw: 0.46, hh: 0.2 };
const NO_TRAIL = new Float32Array(32), NO_WAVES = new Float32Array(24);

export const Sky = ({ tint, onReady }: { tint: SkyTint; onReady?: () => void }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);
  const tintKey = tint.flat().join(',');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const root = host.closest('.sv') ?? document;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2)) { host.setAttribute('data-fail', ''); readyRef.current?.(); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let neb: NebulaPlus | null = null, raf = 0, dead = false, last = 0, t0 = -1, drawn = false, prev = -1;
    let onScreen = true, scrollAt = -1e9;
    const base = tintKey.split(',').map(Number);
    const c1 = base.slice(0, 3) as RGB, c2 = base.slice(3, 6) as RGB;
    const cur = { ...REST };
    let nodes: HTMLElement[] = [], nodesAt = -1e9;
    let tg = REST, tgAt = -1e9, tgY = NaN, tgW = 0, tgH = 0;
    // moveAt = kiedy blask ostatnio był w drodze do celu; próba sprzętu: odstępy klatek z czasu odsłony
    let moveAt = -1e9, fastOk = false, lastRaf = -1, probing = !reduced;
    const probe: number[] = [];
    // zegar odsłony (ms): suma kroków przyciętych do REVEAL_STEP, nie czas ścienny - po zgubionej klatce (ładowanie
    // strony, wejście tekstu) front odsłony nie przeskakuje do przodu, tylko rusza dalej z miejsca
    let rvT = 0;

    const loop = (now: number) => {
      raf = 0;
      if (dead || document.hidden || !onScreen || !neb) { lastRaf = -1; return; }
      const revealing = t0 < 0 || (!reduced && rvT < REVEAL_MS);
      // próba sprzętu: w czasie odsłony (oba przebiegi w każdej klatce - cięższe niż sama kompozycja) zbieramy odstępy
      // klatek od 0,5 s (pierwsze klatki giną w ładowaniu strony); po odsłonie mediana decyduje o szybkim tempie
      if (probing && t0 >= 0) {
        if (revealing) { if (lastRaf > 0 && now - t0 > 500) probe.push(now - lastRaf); }
        else { probing = false; if (probe.length >= PROBE_MIN) { probe.sort((a, b) => a - b); fastOk = probe[probe.length >> 1] <= PROBE_OK_MS; } }
      }
      lastRaf = now;
      const active = now - scrollAt < SCROLL_HOLD || now - moveAt < GLOW_HOLD;
      const gap = revealing ? FRAME_FAST : active ? (fastOk ? FRAME_FAST : FRAME_MS) : FRAME_REST;
      if (now - last >= gap - 1) { last = now; step(now); }
      if (!reduced || !drawn) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && !dead && neb) raf = requestAnimationFrame(loop); };

    /** Cel: scena (data-sky) najbliżej środka okna; położenia względem wysokości płótna (100lvh). Pomiar tylko wtedy,
        gdy coś mogło się zmienić (przewinięcie, rozmiar okna, nowa lista scen), w spoczynku co MEASURE_MS. */
    const target = (now: number) => {
      const vw = window.innerWidth, vh = window.innerHeight, y = window.scrollY;
      if (now - nodesAt >= QUERY_MS) { nodesAt = now; nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-sky]')); }
      else if (y === tgY && vw === tgW && vh === tgH && now - tgAt < MEASURE_MS) return tg;
      tgAt = now; tgY = y; tgW = vw; tgH = vh;
      let best: DOMRect | null = null, bd = Infinity;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < vh * 0.1 || r.top > vh * 0.9 || !r.width) continue;
        const d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < bd) { bd = d; best = r; }
      }
      if (!best) return (tg = REST);
      const ch = host.clientHeight || vh;
      // widoczna część sceny (wysoka scena wychodzi poza ekran - blask zostaje na ekranie)
      const top = Math.max(best.top, 0), bot = Math.min(best.bottom, vh);
      return (tg = {
        cx: (best.left + best.width / 2) / vw, cy: (top + bot) / 2 / ch,
        hw: Math.min(0.48, best.width / 2 / vw), hh: Math.min(0.46, Math.max(0.12, (bot - top) / 2 / ch)),
      });
    };

    function step(now: number) {
      if (!neb) return;
      const dt = prev < 0 ? 1 / 30 : Math.min(0.1, Math.max(0.004, (now - prev) / 1000));
      prev = now;
      const goal = target(now);
      const snap = reduced || t0 < 0;
      // blask jeszcze w drodze do celu - pętla trzyma szybkie tempo (moveAt), żeby dojechał płynnie
      if (Math.abs(goal.cx - cur.cx) + Math.abs(goal.cy - cur.cy) + Math.abs(goal.hw - cur.hw) + Math.abs(goal.hh - cur.hh) > GLOW_EPS) moveAt = now;
      const kf = snap ? 1 : 1 - Math.pow(0.9, dt * 30);
      cur.cx += (goal.cx - cur.cx) * kf; cur.cy += (goal.cy - cur.cy) * kf;
      cur.hw += (goal.hw - cur.hw) * kf; cur.hh += (goal.hh - cur.hh) * kf;
      neb.frame(cur.cx, cur.cy, cur.hw, cur.hh);
      // bez soczewki, smugi i fal - z interakcji modułu zostaje tylko przewinięcie (głębia) i środek odsłony
      neb.interact({
        cx: 0.5, cy: 0.5, lens: 0, trail: NO_TRAIL, waves: NO_WAVES,
        scrollY: window.scrollY, viewH: window.innerHeight, rc: [cur.cx, cur.cy],
      });
      if (t0 >= 0 && !reduced && rvT < REVEAL_MS) rvT = Math.min(REVEAL_MS, rvT + Math.min(dt * 1000, REVEAL_STEP));
      const rv = reduced ? 1 : t0 < 0 ? 0 : rvT / REVEAL_MS;
      const e = 1 - Math.pow(1 - rv, 3);
      const ok = neb.render(reduced || t0 < 0 ? 0 : (now - t0) / 1000, 0.5, 0.5, c1, c2, e);
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
    const onScroll = () => { scrollAt = performance.now(); if (reduced) { drawn = false; kick(); } };
    neb = createNebulaPlus(host, () => { host.setAttribute('data-ready', ''); readyRef.current?.(); }, () => { host.setAttribute('data-fail', ''); readyRef.current?.(); }, {
      maxDpr: touch ? (nav.deviceMemory && nav.deviceMemory <= 3 ? 1.25 : 2) : 1.5,
      maxPx: touch ? 1.1e6 : undefined,
      gasScale: touch ? 0.55 : 0.6,
      still: true,
      // ograniczony ruch rysuje pojedyncze klatki (po przewinięciu) - każda z aktualnym gazem
      gasEvery: reduced ? 1 : 3,
      gasBusy: reduced ? 1 : 2,
      // blask wokół sceny liczony w kompozycji (płynny w każdej klatce), gaz przerysowywany rzadko - opis w nagłówku
      liveGlow: !reduced,
      // klatka kluczowa gazu co 140 ms (~7 na sekundę), między nimi płynne przenikanie w kompozycji - przy 260 ms bez
      // przenikania gaz było widać jako skoki (właściciel: „jak już jest shader, to jest poklatkowany”)
      gasMs: 140,
    });
    resize();
    kick();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; if (onScreen) kick(); });
    io.observe(host);
    const onVis = () => kick();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
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
  }, [tintKey]);

  return (
    <div className="sv-sky" aria-hidden="true">
      <div ref={hostRef} className="sv-sky-neb" />
    </div>
  );
};
