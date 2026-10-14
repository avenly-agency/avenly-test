'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { AvenlyLogo } from '@/components/ui/AvenlyLogo';
import { GEM, LOGO_CUT_SHIFT, LOGO_LETTERS_BOX, LOGO_PIECES, LOGO_WHOLE_FILLS, type LogoPiece } from '@/lib/brand/logo';
import type { Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { fillPoints, markShape } from './mark';
import { Poster, POSTER_EXTRA, type PosterPaint } from './poster';
import { attr, css, mix, seg, usePin } from './shared';
import './heroes.css';

// O NAS - WEJŚCIE „PANORAMA Z CIĘCIEM” (jedyne wejście podstrony; prefiks on-x-, scena on-x3-).
// Wybór właściciela: 2026-10-09 „chcę panoramę, ale idziemy wraz z przecinaniem i potem jest zoom na scroll w gwiazdę”,
// dopracowane w rundach 6-13 (2026-10-12), potwierdzone 2026-10-12: „wybieram tą wersję” (+ „usuń to przewiń”,
// „zoptymalizuj pod wydajność i responsywność, zrób perfekcyjnie tą pierwszą sekcję na telefonach”).
// Pozostałe cztery wejścia (Okno, Odjazd, Przesunięcie, Klapka) są w docs/archiwum/o-nas-2026-10/.
// Reżyseria:
//   - TŁO: mgławica całej podstrony (page-sky.tsx - od 2026-10-13 jedno tło za całą treścią, scena nie ma już własnej
//     mgławicy ani własnej czerni); jej blask idzie za gwiazdą (element .on-x3-glow z data-sky); rzadkie bliskie
//     gwiazdy przesuwają się z kamerą (paralaksa),
//   - LITERY: ciemne bryły na tle mgławicy z krawędziami oświetlonymi przez gwiazdę (białe przy niej, chłodny błękit
//     dalej, ciemny grafit daleko); krawędź = obrys POD bryłą, więc widać tylko zewnętrzną połowę, a krawędzie
//     przyszłego cięcia są przykryte wypełnieniem szczeliny,
//   - CIĘCIE: na czole gwiazdy otwiera się szczelina, świeże krawędzie świecą i stygną; górne połówki zsuwają się
//     o 3u; spod gwiazdy pryskają iskry, gdy tnie literę,
//   - ZNAK: linia z gwiazdą to JEDEN kształt (markShape), bez jasnego kółka i bez promieni; rozgrzanie = jaśniejszy
//     błękit marki, tylko w ruchu,
//   - WEJŚCIE (na czas, od pierwszej klatki): kamera najeżdża, gwiazda wpada z lewej i staje przed A,
//   - WJAZD W GWIAZDĘ: znak traci wypełnienie, kamera przelatuje przez obrys i wszystkie powidoki; dopiero po
//     ostatnim pojawia się sekcja z nagłówkiem - „Plakat” (poster.tsx; wybór właściciela 2026-10-12).
// WYDAJNOŚĆ (2026-10-12): wymiary sceny czytane tylko przy zmianie rozmiaru (ResizeObserver), w klatce zero odczytów
// układu; blask mgławicy przesuwany samym przekształceniem (bez zmian szerokości / wysokości = bez przeliczania układu);
// elementy sceny zebrane raz; pętla klatek chodzi tylko, gdy coś żyje na czas (wejście, iskry, stygnięcie, refleks),
// a budzik refleksu jest wyłączony, gdy scena jest przewinięta dalej.
// TELEFON (2026-10-12): scena ma wysokość dużego okna (100lvh - po schowaniu paska adresu tło sięga do dołu ekranu,
// bez paska gołej strony pod sceną), a kompozycja liczy się ze stałej wysokości małego okna (100svh - nic nie skacze,
// gdy pasek się chowa); wielkość liter z krótszego wymiaru (na pionowym ekranie litera wypełnia szerokość), litery
// wyśrodkowane w pionie; światło gwiazdy zwężone do szerokości ekranu; tekst końcowy mieści się między nawigacją
// a bąblem czatu także na niskich telefonach (rozmiary pisma z wysokości ekranu - heroes.css).
// Bez JS / ograniczony ruch: zwykłe logo, pod nim nagłówek, opis i przycisk.

type P = { t: ONasDict['intro']; locale: Locale; live: boolean };
const LETTERS: LogoPiece['letter'][] = ['A', 'V', 'E', 'N', 'L', 'Y'];

// długość samego wejścia w vh (cięcie + wjazd w gwiazdę); sekcja po wjeździe („Plakat”, poster.tsx) dokłada swoje
// POSTER_EXTRA - suma (SCENE_LEN) idzie do zmiennej --len na przypiętym elemencie. Ostatni powidok mija kamerę po
// PAN_LEN · 0,9.
const PAN_LEN = 300, PAN_PASSED = PAN_LEN * 0.9;
const SCENE_LEN = PAN_LEN + POSTER_EXTRA;
const PAN_IN = -32.5 - 160;  // skąd wpada gwiazda (jednostki logo, poza ekranem)
const PAN_REST = -12;        // gdzie czeka po wejściu: na linii tuż przed A
const PAN_STAR = 580.117;    // miejsce gwiazdy w logo
const PAN_SLIDE = 45;        // droga gwiazdy, na której górna połówka minionej litery zsuwa się o 3u
// wejście (runda 11: „daj animację pojawiania się … od razu niech animacja”): od pierwszej klatki kamera powoli
// najeżdża (PAN_DOLLY ms), po PAN_ENTRY_AT ms gwiazda wpada z lewej, a jej światło zapala litery z ciemności
const PAN_ENTRY_AT = 250, PAN_ENTRY = 1600, PAN_DOLLY = 2800;
const PAN_INTRO_END = PAN_ENTRY_AT + Math.max(PAN_ENTRY, PAN_DOLLY) + 40;
// refleks światła przebiegający po krawędziach liter w spoczynku (życie sceny bez przewijania): co PAN_GLINT_EVERY ms
const PAN_GLINT_AT = 2700, PAN_GLINT_EVERY = 5600, PAN_GLINT = 1500;
const PAN_GROW_FROM = 300;   // od tego miejsca gwiazda rośnie stopniowo do wielkości gwiazdy logo (runda 8: „nagle rośnie”)
// ISKRY spod gwiazdy, gdy tnie literę (runda 8: „samo przecinanie jest mało immersyjne”): jednostki logo i sekundy
const SPARK_MAX = 220, SPARK_RATE = 1.3, SPARK_G = 300, SPARK_DRAG = 1.8;
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number };
/** Czy w tym miejscu linii jest litera (gwiazda tnie materiał) - prostokąty liter, z marginesem. */
const inLetter = (x: number) => LETTERS.some((l) => { const b = LOGO_LETTERS_BOX[l]; return x > 2 * b.cx - b.right + 2 && x < b.right - 1; });
/** Nowa iskra na linii cięcia: leci do tyłu i na boki (wyrzut przy wyjściu z litery - bardziej w górę i w przód). */
const spawnSpark = (list: Spark[], x: number, burst: boolean) => {
  if (list.length >= SPARK_MAX) list.shift();
  const r = Math.random, back = burst ? 0.35 : 1;
  list.push({
    x, y: -62.5 + (r() - 0.5) * 3,
    vx: -(25 + r() * 160) * back + (burst ? (r() - 0.3) * 130 : 0),
    vy: (r() - 0.62) * (burst ? 280 : 200),
    age: 0, life: 0.35 + r() * 0.55,
  });
};
/** Krok fizyki iskier i rysunek (smuga = droga z ostatnich ~22 ms, od bieli do koloru marki, „lighter”).
    Wymiary płótna (W × H w px CSS) przychodzą z pomiaru sceny - bez odczytu układu w klatce. */
const drawSparks = (
  cv: HTMLCanvasElement | null, list: Spark[], cam: { k: number; tx: number; ty: number; dirty: boolean },
  dt: number, W: number, H: number,
) => {
  if (!cv) return;
  for (let i = list.length - 1; i >= 0; i--) {
    const s = list[i];
    s.age += dt;
    if (s.age >= s.life) { list.splice(i, 1); continue; }
    const drag = Math.max(0, 1 - SPARK_DRAG * dt);
    s.vx *= drag; s.vy = s.vy * drag + SPARK_G * dt;
    s.x += s.vx * dt; s.y += s.vy * dt;
  }
  if (!W || !H) return;
  if (!list.length && !cam.dirty) return; // płótno już czyste - nic do zrobienia
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const pw = Math.round(W * dpr), ph = Math.round(H * dpr);
  if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  cam.dirty = list.length > 0;
  if (!list.length) return;
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.4;
  for (const s of list) {
    const t = s.age / s.life, w = Math.min(1, t * 1.6);
    const x = cam.tx + s.x * cam.k, y = cam.ty + s.y * cam.k;
    ctx.strokeStyle = `rgba(${Math.round(255 - 159 * w)},${Math.round(255 - 90 * w)},${Math.round(255 - 5 * w)},${(Math.pow(1 - t, 1.4) * 0.95).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - s.vx * cam.k * 0.022, y - s.vy * cam.k * 0.022);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
};
/** Powidoki przy wjeździe w gwiazdę: obrysy gwiazdy w tych skalach; kamera przelatuje przez wszystkie. */
const ECHOES = [0.82, 0.66, 0.5];
const ECHO_MIN = Math.min(...ECHOES);
const outCubic = (v: number) => { const x = v < 0 ? 0 : v > 1 ? 1 : v; return 1 - Math.pow(1 - x, 3); };
/** Gładkie min(d, 0) o promieniu m: kamera stoi, dopóki gwiazda nie dojdzie do swojego miejsca na ekranie,
    potem jedzie razem z nią (bez szarpnięcia w chwili ruszenia). */
const follow = (d: number, m: number) => (d >= m ? 0 : d <= -m ? d : -((m - d) * (m - d)) / (4 * m));
/** Znak w jednostkach logo: czubek linii w -32,5, linia cięcia na wysokości -62,5 (runda 12: jeden kształt). */
const markPath = (hx: number, sz: number) => markShape(-32.5, hx, -62.5, sz);
// bliskie gwiazdy (paralaksa przy przejeździe): układ 0-4000 × 0-1000 skalowany do wysokości sceny;
// stała tablica z generatora z ziarnem (ten sam układ na serwerze i w przeglądarce)
const PAN_NEAR = (() => {
  let seed = 7001;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let d = '';
  for (let i = 0; i < 64; i++) d += `M${Math.round(rnd() * 4000)} ${Math.round(rnd() * 1000)}h.01`;
  return d;
})();

/** Wymiary sceny: W × HF = cały przypięty ekran (100lvh), H = wysokość kompozycji (100svh - stała, gdy na telefonie
    chowa się pasek adresu), bl = lewa krawędź treści wrappera. Czytane tylko przy zmianie rozmiaru. */
type Geo = { W: number; H: number; HF: number; bl: number };
const readGeo = (st: HTMLElement, ft: HTMLElement, bx: HTMLElement): Geo => {
  const HF = st.clientHeight;
  return { W: st.clientWidth, HF, H: ft.clientHeight || HF, bl: bx.offsetLeft + 24 };
};

type PanEls = {
  strip: SVGGElement | null; lettersG: SVGGElement | null; kerfG: SVGGElement | null; near: SVGGElement | null;
  ups: SVGGElement[][]; uncut: SVGRectElement | null; kerfc: SVGRectElement | null;
  rim: SVGRadialGradientElement | null; body: SVGRadialGradientElement | null;
  edge: SVGLinearGradientElement | null; hotg: SVGLinearGradientElement | null;
  mark: SVGPathElement | null; hot: SVGPathElement | null; echo: SVGGElement | null;
  glintG: SVGGElement | null; glintg: SVGLinearGradientElement | null;
  glow: HTMLElement | null;
};
const collectPan = (el: HTMLElement): PanEls => {
  const one = <T extends Element>(s: string) => el.querySelector<T>(s);
  const groups = ['.on-x3-rims', '.on-x3-glints', '.on-x3-bodies', '.on-x3-kerf'].map((s) => Array.from(el.querySelectorAll<SVGGElement>(`${s} > g`)));
  return {
    strip: one('.on-x3-strip'), lettersG: one('.on-x3-letters'), kerfG: one('.on-x3-kerf'), near: one('.on-x3-near'),
    // górne połówki litery i: w krawędzi, w bryle i w świeżym cięciu - zsuwają się razem
    ups: LETTERS.map((_, i) => groups.map((g) => g[i]?.querySelector<SVGGElement>('.on-x3-up')).filter((u): u is SVGGElement => !!u)),
    uncut: one('#on-x3-uncut rect'), kerfc: one('#on-x3-kerfc rect'),
    rim: one('#on-x3-rim'), body: one('#on-x3-body'), edge: one('#on-x3-edge'), hotg: one('#on-x3-hotg'),
    mark: one('.on-x3-mark'), hot: one('.on-x3-hot'), echo: one('.on-x3-echo'),
    glintG: one('.on-x3-glints'), glintg: one('#on-x3-glintg'),
    glow: one('.on-x3-glow'),
  };
};

export function HeroPan({ t, locale, live }: P) {
  const pin = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null);
  const cache = useRef<PanEls | null>(null);
  // malarz sekcji po wjeździe w gwiazdę (rejestruje go „Plakat” z poster.tsx)
  const endPaint = useRef<PosterPaint | null>(null);
  const register = useCallback((fn: PosterPaint | null) => { endPaint.current = fn; }, []);
  const geo = useRef<Geo | null>(null);
  // postęp przewijania całej sceny i samego wejścia (0-1), ms od pokazania sceny, faza refleksu (-1 = brak)
  const state = useRef({ p: 0, ph: 0, ms: 0, glint: -1 });
  const sparksCv = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  // poprzednie czoło (emisja iskier), kamera ostatniej klatki (rysowanie iskier), ułamek emisji, rozgrzanie,
  // budziki pętli klatek: kick = coś ożyło (iskry, rozgrzanie), wake = scena wróciła na ekran (refleks)
  const memo = useRef({ hv: NaN, k: 1, tx: 0, ty: 0, dirty: false, carry: 0, heat: 0, kick: () => {}, wake: () => {} });

  const paint = useCallback(() => {
    const el = pin.current, st = stage.current, ft = fit.current, bx = box.current;
    if (!el || !st || !ft || !bx) return;
    const { W, H, HF, bl } = (geo.current ??= readGeo(st, ft, bx));
    if (!W || !H) return;
    const c = (cache.current ??= collectPan(el));
    const { ph, ms, glint } = state.current;
    const sv = state.current.p * SCENE_LEN; // ile vh sceny przewinięto
    const dolly = outCubic(ms / PAN_DOLLY);      // najazd kamery na wejściu (od pierwszej klatki)
    // px na jednostkę logo: litery na 70% wysokości ekranu, ale nie szersze niż 80% szerokości na 100 jednostek -
    // na pionowym ekranie (telefon, tablet) litera wypełnia szerokość, zamiast wychodzić daleko poza kadr
    const wide = H * 0.7 <= W * 0.8;
    const kBase = Math.min(H * 0.7, W * 0.8) / 100;
    const k0 = kBase * mix(0.84, 1, dolly);
    // linia cięcia: na szerokim ekranie w połowie wysokości; na pionowym litery (37,5 jednostki nad linią, 62,5 pod
    // nią) stoją prawie na środku, odrobinę niżej (u góry jest nawigacja). Na wejściu lekko unosi się.
    const yL = (wide ? H * 0.5 : (H - 100 * kBase) * 0.56 + 37.5 * kBase) + (1 - dolly) * H * 0.03;
    const a = seg(ph, 0.04, 0.58);              // przejazd z cięciem (gwiazda ląduje przy ph ≈ 0,47)
    const z = seg(ph, 0.5, 0.9);                // wjazd w gwiazdę - zaczyna się zaraz po lądowaniu, bez postoju
    const entry = outCubic((ms - PAN_ENTRY_AT) / PAN_ENTRY); // gwiazda wpada i hamuje przed A
    const hv = mix(mix(PAN_IN, PAN_REST, entry), PAN_STAR + PAN_SLIDE + 6, a); // czoło „z zapasem” (zsunięcie Y)
    const hx = Math.min(hv, PAN_STAR);                                         // czoło gwiazdy
    const sz = mix(0.3, 1, seg(hv, PAN_GROW_FROM, PAN_STAR)); // rośnie stopniowo przez drugą połowę napisu
    const cool = seg(hv, PAN_STAR, PAN_STAR + 40);             // po lądowaniu gwiazda i linia stygną

    // kamera: na starcie gwiazda czeka przy lewej krawędzi wrappera, potem trzyma 60% szerokości ekranu;
    // w przejeździe powolny najazd wokół gwiazdy, potem wjazd w gwiazdę ze stałym tempem powiększania
    const tx0 = bl + 40 - PAN_REST * k0;
    const sx0 = tx0 + follow(W * 0.6 - hx * k0 - tx0, W * 0.25) + hx * k0; // gwiazda na ekranie w przejeździe
    const kP = k0 * (1 + 0.08 * a);
    // koniec wjazdu: kamera przelatuje przez obrys gwiazdy i wszystkie powidoki - nawet najmniejszy (skala ECHO_MIN)
    // wychodzi poza najdalszy róg sceny (wcięcia gwiazdy leżą 7,884 jednostki od środka po przekątnej); potem nagłówek
    const kIn = (Math.hypot(W / 2, HF - H / 2) * 1.08) / (7.884 * ECHO_MIN);
    const zr = z > 0 ? Math.pow(kIn / kP, z) : 1;
    const k = kP * zr;
    const sx = mix(sx0, W / 2, z), sy = mix(yL, H / 2, z);
    const tx = sx - hx * k, ty = sy + 62.5 * k;
    attr(c.strip, 'transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(5)})`);
    // iskry: tylko gdy gwiazda tnie literę w przód; przy wyjściu z litery krótki wyrzut; wjazd w gwiazdę je gasi
    const m = memo.current;
    m.k = k; m.tx = tx; m.ty = ty;
    if (z > 0) {
      if (sparks.current.length) { sparks.current.length = 0; m.kick(); } // pętla wyczyści płótno i stanie
    } else if (Number.isFinite(m.hv) && hv > m.hv) {
      const dh = Math.min(hv, PAN_STAR) - Math.min(m.hv, PAN_STAR);
      if (dh > 0) { m.heat = Math.min(1, m.heat + dh * 0.09); m.kick(); } // jedzie = rozgrzewa się (stygnie w pętli)
      if (dh > 0 && inLetter(hx)) {
        m.carry += dh * SPARK_RATE;
        const n = Math.min(18, Math.floor(m.carry));
        m.carry -= n;
        for (let i = 0; i < n; i++) spawnSpark(sparks.current, hx - 3 * sz, false);
      }
      const prevHv = m.hv;
      LETTERS.forEach((l) => { const r = LOGO_LETTERS_BOX[l].right; if (prevHv < r && hv >= r) for (let i = 0; i < 12; i++) spawnSpark(sparks.current, r, true); });
      if (sparks.current.length) m.kick();
    }
    m.hv = hv;

    // blask mgławicy idzie za gwiazdą (tło podstrony mierzy prostokąt elementu z data-sky): element 100 × 100 px
    // ustawiany samym przekształceniem - bez zmian szerokości i wysokości, czyli bez przeliczania układu w klatce
    if (c.glow) {
      const gw = mix(Math.min(W * (wide ? 0.5 : 0.8), 720), W, z), gh = mix(H * 0.62, HF, z);
      css(c.glow, 'transform', `translate3d(${(sx - gw / 2).toFixed(1)}px, ${(sy - gh / 2).toFixed(1)}px, 0) scale(${(gw / 100).toFixed(3)}, ${(gh / 100).toFixed(3)})`);
    }
    // bliskie gwiazdy - paralaksa przy przejeździe, rozbiegają się przy wjeździe
    const pan = Math.max(0, tx0 + hx * k0 - sx0), ns = Math.pow(zr, 0.42);
    attr(c.near, 'transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${ns.toFixed(4)}) translate(${(-sx - pan * 0.42).toFixed(1)} ${(-sy).toFixed(1)}) scale(${(HF / 1000).toFixed(4)})`);

    // światło gwiazdy: krawędzie liter i bryły (elipsa wokół gwiazdy), świeże krawędzie cięcia, rozgrzana linia;
    // zasięg światła rośnie, gdy gwiazda wpada - litery zapalają się z ciemności. Na wąskim ekranie elipsa jest
    // węższa (ta sama część kadru w świetle co na szerokim - inaczej cały kadr telefonu byłby równo biały).
    const lr = mix(0.3, 1, seg(entry, 0, 0.9));
    const lw = Math.max(0.5, Math.min(1, W / (k0 * 228)));
    const lt = `translate(${hx.toFixed(2)} -62.5) scale(${(520 * lr * lw).toFixed(1)} ${(300 * lr).toFixed(1)})`;
    attr(c.rim, 'gradientTransform', lt);
    attr(c.body, 'gradientTransform', lt);
    attr(c.edge, 'x1', (hx - 320 * lw).toFixed(2)); attr(c.edge, 'x2', hx.toFixed(2));
    attr(c.hotg, 'x1', (hx - 90).toFixed(2)); attr(c.hotg, 'x2', hx.toFixed(2));
    attr(c.uncut, 'x', hx.toFixed(2)); // szczelina otwiera się dokładnie na czole gwiazdy
    attr(c.kerfc, 'width', Math.max(0, hx + 40).toFixed(2));
    const d = markPath(hx, sz);
    attr(c.mark, 'd', d);
    attr(c.hot, 'd', d);
    css(c.hot, 'opacity', (m.heat * (1 - cool) * (1 - seg(z, 0, 0.2))).toFixed(3));

    // litery: górne połówki zsuwają się po cięciu (bez przestrzelenia)
    c.ups.forEach((ups, i) => {
      const sl = outCubic((hv - LOGO_LETTERS_BOX[LETTERS[i]].right) / PAN_SLIDE);
      const tf = sl >= 1 ? 'none' : `translateX(${(-LOGO_CUT_SHIFT * (1 - sl)).toFixed(3)}px)`;
      ups.forEach((u) => css(u, 'transform', tf));
    });
    const lo = 1 - seg(z, 0, 0.4);
    [c.lettersG, c.kerfG].forEach((g) => { css(g, 'opacity', lo.toFixed(3)); css(g, 'visibility', lo < 0.002 ? 'hidden' : 'visible'); });

    // znak (linia z gwiazdą) ten sam przez cały przejazd i wjazd; przy wjeździe cały naraz traci wypełnienie
    // i zostaje ostry obrys - linia i gwiazda jako jedno (runda 12)
    css(c.mark, 'opacity', seg(entry, 0, 0.06).toFixed(3));
    css(c.mark, 'fill-opacity', (1 - seg(z, 0.04, 0.3)).toFixed(3));
    css(c.mark, 'stroke-opacity', seg(z, 0, 0.12).toFixed(3));
    // powidoki: przy wjeździe przez środek gwiazdy przelatują jej obrysy (runda 12: „te powidoki mi się podobały”);
    // nie gasną (runda 13: „nie chcę, żeby znikały”) - zostają i po kolei wylatują poza ekran
    const eo = seg(z, 0.1, 0.25);
    css(c.echo, 'opacity', eo.toFixed(3));
    css(c.echo, 'visibility', eo < 0.002 ? 'hidden' : 'visible');

    // refleks na krawędziach liter (tylko w przejeździe, nie przy wjeździe w gwiazdę)
    const gOn = glint >= 0 && z <= 0;
    css(c.glintG, 'visibility', gOn ? 'visible' : 'hidden');
    if (gOn) {
      const L = -tx / k, R = (W - tx) / k, g = outCubic(glint) * 0.4 + glint * 0.6;
      const gx = mix(L - 90, R + 90, g);
      attr(c.glintg, 'x1', (gx - 70).toFixed(1)); attr(c.glintg, 'x2', (gx + 70).toFixed(1));
      css(c.glintG, 'opacity', (seg(glint, 0, 0.12) * (1 - seg(glint, 0.85, 1))).toFixed(3));
    }
    // sekcja po wjeździe: dopiero po przelocie przez ostatni powidok (v = vh przewinięte od tego momentu)
    endPaint.current?.(sv - PAN_PASSED);
  }, []);

  // wymiary sceny tylko przy zmianie rozmiaru (okno, obrót telefonu, szerokość wrappera)
  useEffect(() => {
    if (!live) return;
    const st = stage.current, ft = fit.current, bx = box.current;
    if (!st || !ft || !bx) return;
    const ro = new ResizeObserver(() => { geo.current = readGeo(st, ft, bx); paint(); });
    ro.observe(st); ro.observe(ft); ro.observe(bx);
    return () => { ro.disconnect(); geo.current = null; cache.current = null; };
  }, [live, paint]);

  // pętla klatek tylko wtedy, gdy coś żyje na czas: wejście (ok. 2,9 s), iskry, stygnięcie znaku, refleks
  useEffect(() => {
    if (!live) return;
    let raf = 0, prev = 0, timer = 0;
    const t0 = performance.now();
    const m = memo.current, st = state.current;
    const tick = (now: number) => {
      raf = -1; // w trakcie klatki: budzik z paint() nie dokłada drugiej pętli
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 1 / 60;
      prev = now;
      const t = now - t0;
      // wejście na czas: zegar dochodzi do końca także po przerwie (ukryta karta) - kamera nie zostaje w pół najazdu
      const intro = st.ms < PAN_INTRO_END;
      if (intro) st.ms = Math.min(t, PAN_INTRO_END);
      // refleks: co PAN_GLINT_EVERY ms, tylko gdy scena stoi na początku przejazdu albo w jego trakcie (bez wjazdu)
      const gt = t - PAN_GLINT_AT, gp = gt >= 0 ? gt % PAN_GLINT_EVERY : -1;
      const glint = gp >= 0 && gp < PAN_GLINT && st.ph < 0.5 ? gp / PAN_GLINT : -1;
      const hot = m.heat > 0;
      m.heat = m.heat > 0.01 ? m.heat * Math.exp(-dt / 0.4) : 0; // stygnięcie (~0,4 s), gdy gwiazda stoi
      const glintChanged = glint !== st.glint;
      st.glint = glint;
      if (intro || hot || glintChanged) paint();
      const g = geo.current;
      drawSparks(sparksCv.current, sparks.current, m, dt, g ? g.W : 0, g ? g.HF : 0);
      if (st.ms < PAN_INTRO_END || m.heat > 0 || sparks.current.length || glint >= 0) raf = requestAnimationFrame(tick);
      else {
        raf = 0; prev = 0;
        window.clearTimeout(timer); timer = 0;
        // następny refleks: obudź pętlę, gdy przyjdzie jego pora - tylko dopóki scena jest przed wjazdem w gwiazdę
        // (przewinięta dalej nie budzi się wcale; po powrocie budzi ją wake z przewijania)
        if (st.ph < 0.5) {
          const wait = gt < 0 ? -gt : PAN_GLINT_EVERY - (gt % PAN_GLINT_EVERY);
          timer = window.setTimeout(() => { timer = 0; m.kick(); }, Math.max(16, wait));
        }
      }
    };
    m.kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    m.wake = () => { if (!raf && !timer) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(timer); m.kick = () => {}; m.wake = () => {}; };
  }, [live, paint]);
  usePin(pin, (p) => {
    const st = state.current, ph = Math.min(1, (p * SCENE_LEN) / PAN_LEN), back = ph < 0.5 && st.ph >= 0.5;
    st.p = p; st.ph = ph;
    paint();
    if (back) memo.current.wake();
  }, live);

  // jedna litera: dolna połówka, górna (zsuwana), wypełnienie szczeliny przed gwiazdą
  const letter = (l: LogoPiece['letter'], fill: boolean) => {
    const dn = LOGO_PIECES.find((pc) => pc.letter === l && pc.part === 'down');
    const up = LOGO_PIECES.find((pc) => pc.letter === l && pc.part === 'up');
    if (!dn || !up) return null;
    return (
      <g key={l}>
        <path d={dn.d} vectorEffect="non-scaling-stroke" />
        <g className="on-x3-up"><path d={up.d} vectorEffect="non-scaling-stroke" /></g>
        {fill && (
          <g clipPath="url(#on-x3-uncut)">
            {LOGO_WHOLE_FILLS[l].map((poly, j) => <polygon key={j} points={fillPoints(poly)} vectorEffect="non-scaling-stroke" />)}
          </g>
        )}
      </g>
    );
  };
  return (
    <section className="on-x on-x--3" aria-labelledby="on-h1">
      <div ref={pin} className="on-x-pin" style={{ '--len': SCENE_LEN } as CSSProperties}>
        <div ref={stage} className="on-x-stick">
          {/* cel blasku mgławicy podstrony (page-sky.tsx): idzie za gwiazdą */}
          <div className="on-x3-glow" data-sky="" aria-hidden="true" />
          <svg className="on-x-svg" aria-hidden="true" focusable="false">
            <defs>
              {/* przycięcia w jednostkach logo: wypełnienie szczeliny przed czołem gwiazdy, pas krawędzi cięcia za gwiazdą */}
              <clipPath id="on-x3-uncut"><rect x={PAN_IN} y={-74} width={900} height={24} /></clipPath>
              <clipPath id="on-x3-kerfc"><rect x={-40} y={-68.9} width={0} height={12.8} /></clipPath>
              {/* światło gwiazdy: elipsa 520 × 300 jednostek wokół gwiazdy (środek pisze JS) - krawędzie i bryły liter */}
              <radialGradient id="on-x3-rim" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={1} gradientTransform="translate(0 -62.5) scale(520 300)">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset=".2" stopColor="#e6edf8" />
                <stop offset=".42" stopColor="#6f95d8" />
                <stop offset=".66" stopColor="#2c3a58" stopOpacity=".55" />
                <stop offset=".9" stopColor="#1c2333" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="on-x3-body" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={1} gradientTransform="translate(0 -62.5) scale(520 300)">
                <stop offset="0" stopColor="#1d2433" />
                <stop offset=".35" stopColor="#11151d" />
                <stop offset=".7" stopColor="#0a0c11" />
                <stop offset="1" stopColor="#08090c" />
              </radialGradient>
              <linearGradient id="on-x3-edge" gradientUnits="userSpaceOnUse" x1={-320} y1={0} x2={0} y2={0}>
                <stop offset="0" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset=".55" stopColor="#3b82f6" stopOpacity=".85" />
                <stop offset=".88" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
              {/* rozgrzanie linii tuż za gwiazdą: jaśniejszy błękit marki, bez bieli (runda 11: „kontrast dziwny”) */}
              <linearGradient id="on-x3-hotg" gradientUnits="userSpaceOnUse" x1={-90} y1={0} x2={0} y2={0}>
                <stop offset="0" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset=".6" stopColor="#60a5fa" stopOpacity=".35" />
                <stop offset="1" stopColor="#60a5fa" stopOpacity=".75" />
              </linearGradient>
              {/* refleks: wąski pas światła przebiegający po krawędziach liter (położenie pisze JS) */}
              <linearGradient id="on-x3-glintg" gradientUnits="userSpaceOnUse" x1={-70} y1={0} x2={70} y2={0}>
                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <stop offset=".5" stopColor="#ffffff" stopOpacity=".95" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="on-x3-near"><path className="on-x3-dot" d={PAN_NEAR} vectorEffect="non-scaling-stroke" /></g>
            <g className="on-x3-strip">
              <g className="on-x3-letters">
                {/* krawędź POD bryłą: widać tylko jej zewnętrzną połowę, krawędzie przyszłego cięcia przykrywa szczelina */}
                <g className="on-x3-rims" stroke="url(#on-x3-rim)">{LETTERS.map((l) => letter(l, true))}</g>
                <g className="on-x3-glints" stroke="url(#on-x3-glintg)">{LETTERS.map((l) => letter(l, true))}</g>
                <g className="on-x3-bodies" fill="url(#on-x3-body)">{LETTERS.map((l) => letter(l, true))}</g>
              </g>
              {/* świeże krawędzie cięcia: te same połówki, sam obrys w pasie cięcia za gwiazdą */}
              <g className="on-x3-kerf" clipPath="url(#on-x3-kerfc)" stroke="url(#on-x3-edge)">{LETTERS.map((l) => letter(l, false))}</g>
              {/* linia z gwiazdą = jeden kształt (ścieżkę pisze JS), rozgrzanie tym samym kształtem */}
              <path className="on-x3-mark" vectorEffect="non-scaling-stroke" />
              <path className="on-x3-hot" fill="url(#on-x3-hotg)" />
              {/* powidoki przy wjeździe w gwiazdę */}
              <g className="on-x3-echo" transform={`translate(${PAN_STAR} -62.5)`}>
                {ECHOES.map((e) => <path key={e} d={GEM} transform={`scale(${e})`} vectorEffect="non-scaling-stroke" />)}
              </g>
            </g>
          </svg>
          <canvas ref={sparksCv} className="on-x3-sparks" aria-hidden="true" />
          {/* kompozycja w wysokości małego okna (100svh): logo dla trybu bez ruchu i sekcja po wjeździe w gwiazdę */}
          <div ref={fit} className="on-x-fit">
            <div className="container mx-auto px-6 on-x-still"><AvenlyLogo /></div>
            <div ref={box} className="container mx-auto px-6 on-x-box">
              <Poster t={t} locale={locale} register={register} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
