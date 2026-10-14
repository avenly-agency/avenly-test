'use client';

import { useEffect, useRef } from 'react';
// Shader mgławicy z podstrony Realizacje (ten sam moduł co tło podstron usług - tylko używamy).
import { createNebulaPlus, type NebulaPlus } from '../realizacje/_rl/nebula';

// O NAS - JEDNO TŁO NA CAŁĄ PODSTRONĘ (2026-10-13). Właściciel (zrzut nagłówka „Dla kogo pracujemy” na rzadkich
// gwiazdach): „tutaj też tła jakoś dziwne są: jest u góry, potem jest jakieś inne, potem następną sekcję jeszcze inne”.
// Dotąd podstrona miała trzy tła: mgławicę w przypiętym wejściu, niebo z rzadkich gwiazd pod resztą treści i osobną
// mgławicę w scenie „Portal” - każde zaczynało się i kończyło czernią. Teraz jest jedno płótno przyklejone do okna
// ZA całą treścią (jak na podstronach usług i /realizacje):
//   - blask stoi wokół elementu z atrybutem data-sky najbliżej środka okna (gwiazda w wejściu, kadr w „Portalu”);
//     gdy żadnego nie ma na ekranie, wschodzi zza dolnej krawędzi (tekst stoi na ciemnym niebie),
//   - BARWA przechodzi płynnie w kolor tego elementu: data-tint = „r,g,b;r,g,b” (jasna; głęboka, 0-1), bez atrybutu
//     błękit marki - „Portal” zmienia go razem z klientem w kadrze,
//   - sterowanie jak w app/(pl)/uslugi/_usluga/sky.tsx: blask liczony w każdej klatce (liveGlow), gaz z klatek
//     kluczowych, odsłona z czerni od pierwszej narysowanej klatki (3 s, zegar krokami), tempo do 60 kl./s tylko gdy
//     sprzęt je utrzymał w czasie odsłony, pomiar elementów tylko po przewinięciu (w spoczynku co MEASURE_MS),
//   - bez interakcji z kursorem (zasada 2026-10-05), pauza przy ukrytej karcie i poza ekranem (stopka),
//   - Save-Data / ≤ 2 GB RAM / brak WebGL: poświata CSS (.on-psky-neb[data-fail]).
// Montowane tylko przy pełnym ruchu; ograniczony ruch i brak JS mają nieruchome niebo z gwiazd (sky.tsx).

export type RGB = [number, number, number];
export type Tint = [RGB, RGB];
/** Mgławica w kolorze marki (jak podstrony „blue”). */
export const BRAND_TINT: Tint = [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]];
/** Barwa jako wartość atrybutu data-tint. */
export const tintAttr = (t: Tint) => t.map((c) => c.join(',')).join(';');

const parsed = new Map<string, Tint>();
const readTint = (s: string | undefined): Tint => {
  if (!s) return BRAND_TINT;
  let t = parsed.get(s);
  if (!t) {
    const p = s.split(';').map((c) => c.split(',').map(Number));
    t = p.length === 2 && p.every((c) => c.length === 3 && c.every(Number.isFinite)) ? [p[0] as RGB, p[1] as RGB] : BRAND_TINT;
    parsed.set(s, t);
  }
  return t;
};

const REVEAL_MS = 3000, REVEAL_STEP = 34;
const FRAME_FAST = 1000 / 60, FRAME_MS = 1000 / 30;
const SCROLL_HOLD = 240, GLOW_HOLD = 160, GLOW_EPS = 0.003;
const PROBE_OK_MS = 21, PROBE_MIN = 40;
const QUERY_MS = 1000, MEASURE_MS = 250;
/** Cel blasku bez elementu na ekranie: szeroka elipsa pod dolną krawędzią okna (wschód zza horyzontu). */
const REST = { cx: 0.5, cy: 1.12, hw: 0.46, hh: 0.2 };
const NO_TRAIL = new Float32Array(32), NO_WAVES = new Float32Array(24);

type Goal = { cx: number; cy: number; hw: number; hh: number; tint: Tint };

export function PageSky() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const root: ParentNode = host.closest('.on') ?? document;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2)) { host.setAttribute('data-fail', ''); return; }
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let neb: NebulaPlus | null = null, raf = 0, dead = false, last = 0, t0 = -1, prev = -1;
    let onScreen = true, scrollAt = -1e9, moveAt = -1e9, rvT = 0;
    let fastOk = false, lastRaf = -1, probing = true;
    const probe: number[] = [];
    const cur = { ...REST, c1: [...BRAND_TINT[0]] as RGB, c2: [...BRAND_TINT[1]] as RGB };
    let nodes: HTMLElement[] = [], nodesAt = -1e9;
    let tg: Goal = { ...REST, tint: BRAND_TINT }, tgAt = -1e9, tgY = NaN, tgW = 0, tgH = 0;

    /** Cel: element z data-sky najbliżej środka okna (położenie względem płótna 100lvh) i jego barwa. Pomiar tylko
        wtedy, gdy coś mogło się zmienić (przewinięcie, rozmiar okna, nowa lista elementów), w spoczynku co MEASURE_MS. */
    const target = (now: number): Goal => {
      const vw = window.innerWidth, vh = window.innerHeight, y = window.scrollY;
      if (now - nodesAt >= QUERY_MS) { nodesAt = now; nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-sky]')); }
      else if (y === tgY && vw === tgW && vh === tgH && now - tgAt < MEASURE_MS) return tg;
      tgAt = now; tgY = y; tgW = vw; tgH = vh;
      let best: DOMRect | null = null, bestEl: HTMLElement | null = null, bd = Infinity;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < vh * 0.1 || r.top > vh * 0.9 || !r.width) continue;
        const d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < bd) { bd = d; best = r; bestEl = el; }
      }
      // bez elementu na ekranie: blask wschodzi od dołu, barwa wraca do koloru marki
      if (!best || !bestEl) return (tg = { ...REST, tint: BRAND_TINT });
      const ch = host.clientHeight || vh;
      // widoczna część elementu (wysoki element wychodzi poza ekran - blask zostaje na ekranie)
      const top = Math.max(best.top, 0), bot = Math.min(best.bottom, vh);
      return (tg = {
        cx: (best.left + best.width / 2) / vw, cy: (top + bot) / 2 / ch,
        hw: Math.min(0.48, best.width / 2 / vw), hh: Math.min(0.46, Math.max(0.12, (bot - top) / 2 / ch)),
        tint: readTint(bestEl.dataset.tint),
      });
    };

    function step(now: number) {
      if (!neb) return;
      const dt = prev < 0 ? 1 / 30 : Math.min(0.1, Math.max(0.004, (now - prev) / 1000));
      prev = now;
      const g = target(now);
      // przed pierwszą narysowaną klatką cel od razu na miejscu - odsłona rozkwita wokół gwiazdy wejścia
      const snap = t0 < 0;
      const kf = snap ? 1 : 1 - Math.pow(0.9, dt * 30), kc = snap ? 1 : 1 - Math.pow(0.94, dt * 30);
      let far = Math.abs(g.cx - cur.cx) + Math.abs(g.cy - cur.cy) + Math.abs(g.hw - cur.hw) + Math.abs(g.hh - cur.hh);
      cur.cx += (g.cx - cur.cx) * kf; cur.cy += (g.cy - cur.cy) * kf;
      cur.hw += (g.hw - cur.hw) * kf; cur.hh += (g.hh - cur.hh) * kf;
      for (let i = 0; i < 3; i++) {
        far += Math.abs(g.tint[0][i] - cur.c1[i]) + Math.abs(g.tint[1][i] - cur.c2[i]);
        cur.c1[i] += (g.tint[0][i] - cur.c1[i]) * kc;
        cur.c2[i] += (g.tint[1][i] - cur.c2[i]) * kc;
      }
      // blask albo barwa jeszcze w drodze - pętla trzyma szybkie tempo, żeby przejście było płynne
      if (far > GLOW_EPS) moveAt = now;
      neb.frame(cur.cx, cur.cy, cur.hw, cur.hh);
      // bez soczewki, smugi i fal - z interakcji modułu zostaje przewinięcie (głębia) i środek odsłony
      neb.interact({
        cx: 0.5, cy: 0.5, lens: 0, trail: NO_TRAIL, waves: NO_WAVES,
        scrollY: window.scrollY, viewH: window.innerHeight, rc: [cur.cx, cur.cy],
      });
      if (t0 >= 0 && rvT < REVEAL_MS) rvT = Math.min(REVEAL_MS, rvT + Math.min(dt * 1000, REVEAL_STEP));
      const rv = t0 < 0 ? 0 : rvT / REVEAL_MS;
      const ok = neb.render(t0 < 0 ? 0 : (now - t0) / 1000, 0.5, 0.5, cur.c1, cur.c2, 1 - Math.pow(1 - rv, 3));
      if (ok && t0 < 0) t0 = now;
    }
    const loop = (now: number) => {
      raf = 0;
      if (dead || document.hidden || !onScreen || !neb) { lastRaf = -1; return; }
      const revealing = t0 < 0 || rvT < REVEAL_MS;
      // próba sprzętu w czasie odsłony: mediana odstępu klatek decyduje, czy potem wolno rysować do 60 kl./s
      if (probing && t0 >= 0) {
        if (revealing) { if (lastRaf > 0 && now - t0 > 500) probe.push(now - lastRaf); }
        else { probing = false; if (probe.length >= PROBE_MIN) { probe.sort((a, b) => a - b); fastOk = probe[probe.length >> 1] <= PROBE_OK_MS; } }
      }
      lastRaf = now;
      const active = now - scrollAt < SCROLL_HOLD || now - moveAt < GLOW_HOLD;
      const gap = revealing || (active && fastOk) ? FRAME_FAST : FRAME_MS;
      if (now - last >= gap - 1) { last = now; step(now); }
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && !dead && neb) raf = requestAnimationFrame(loop); };
    const resize = () => { if (neb) { neb.resize(host.clientWidth, host.clientHeight); tgAt = -1e9; kick(); } };
    const onScroll = () => { scrollAt = performance.now(); };
    neb = createNebulaPlus(host, () => host.setAttribute('data-ready', ''), () => host.setAttribute('data-fail', ''), {
      maxDpr: touch ? (nav.deviceMemory && nav.deviceMemory <= 3 ? 1.25 : 2) : 1.5,
      maxPx: touch ? 1.1e6 : undefined,
      gasScale: touch ? 0.55 : 0.6,
      still: true, gasEvery: 3, gasBusy: 2, liveGlow: true, gasMs: 140,
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
  }, []);

  return (
    <div className="on-psky" aria-hidden="true">
      <div ref={hostRef} className="on-psky-neb" />
    </div>
  );
}
