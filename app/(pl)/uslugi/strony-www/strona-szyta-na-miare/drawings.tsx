'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// RYSUNKI ze SCENKAMI (od rundy 5 na desce sceny „Deska” - tech.tsx; dawniej w kartach stosu) - silnik skopiowany z pilota (one-page/drawings.tsx, prefiks sm-), rysunki własne.
// Dwie warstwy ruchu:
//   1. RYSOWANIE - linie rysują się razem z przewijaniem (--d na gospodarzu rysunku, --i linii; CSS w strona-szyta-na-miare.css),
//   2. SCENKA    - po narysowaniu rysunek ożywa w pętli 8 s (WAAPI, jedna oś czasu na rysunek): pętla zaczyna się
//                  i kończy gotowym rysunkiem, więc wejście i zapętlenie są bez szwu. Ruch tylko przez transform /
//                  opacity / stroke-dashoffset, łagodne krzywe (wyjście expo, sprężyna przy „pstryknięciach”).
//      0 Sceny pisane dla marki - linijki kodu wpisują się po kolei, światło biegnie do strony, a ta składa się z
//                               autorskich elementów (każdy z innej strony, żadnej gotowej siatki), na końcu znak „gotowe”,
//      1 Integracje bez granic - strona pośrodku, wokół płatności, CRM i ERP; dane biegną w obie strony, narzędzie
//                               i wiersz na stronie zapalają się po kolei,
//      2 Zero czekania        - klik w link, światło przelatuje do strony, cała strona pojawia się naraz; na osi czasu
//                               odcinek od kliknięcia do gotowej strony jest krótki.
// Scenka gra tylko, gdy rysunek jest narysowany i na ekranie (setPlay z tech.tsx).
// Bez JS / ograniczony ruch: gotowy rysunek bez ruchu.

/** 'panel' = płytka z obrysem i ciemnym wypełnieniem, 'pad' = samo wypełnienie (zasłaniają świat za rysunkiem). */
type Kind = 'main' | 'panel' | 'pad' | 'soft' | 'acc' | 'accFill' | 'bar' | 'barHi' | 'barXL' | 'dash' | 'dot' | 'track' | 'arc' | 'ticks';
const FILL_ONLY: Kind[] = ['accFill', 'dot', 'dash', 'pad'];
/** [rodzaj, ścieżka, nazwa w scence (data-l), punkt odniesienia przekształceń: 'c' środek, 'l' lewa krawędź albo "x y"] */
type Part = [Kind, string, string?, string?];
/** Grupa animowana jako całość (data-l = g); clip = id maski przycinającej grupę. */
interface Group { g: string; clip?: string; o?: string; parts: Part[] }
type KF = [number, Keyframe];
type Run = (name: string, frames: KF[]) => void;
interface Art { parts: (Part | Group)[]; defs?: ReactNode; live?: ReactNode; scene: (run: Run) => void }

/** Długość pętli scenki [s]. */
const T = 8;
const OUT = 'cubic-bezier(.16, 1, .3, 1)';
const IO = 'cubic-bezier(.65, 0, .35, 1)';
const SPRING = 'cubic-bezier(.34, 1.56, .64, 1)';

const f = (n: number) => +n.toFixed(1);
const R = (x: number, y: number, w: number, h: number, r = 0) =>
  r
    ? `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
    : `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
const L = (x1: number, y1: number, x2: number, y2: number) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
const C = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
const AR = (x: number, y: number, s = 6) => `M${f(x - s)} ${f(y - s * 0.7)}L${f(x)} ${f(y)}L${f(x - s)} ${f(y + s * 0.7)}`;
/** Przycisk w kolorze podstrony: wypełnienie + obrys. */
const BTN = (x: number, y: number, w: number, h: number): Part[] => [['accFill', R(x, y, w, h, h / 2)], ['acc', R(x, y, w, h, h / 2)]];
/** Części z nazwą do scenki (opcjonalnie z punktem odniesienia przekształceń). */
const N = (name: string, parts: Part[], o?: string): Part[] => parts.map(([k, d]) => [k, d, name, o]);
/** Strona w oknie przeglądarki (wspólna dla rysunków). */
const page = (x: number, y: number, w: number, h: number): Part[] => [
  ['panel', R(x, y, w, h, 10)],
  ['soft', L(x, y + 22, x + w, y + 22)],
  ['barHi', L(x + 14, y + 11, x + 42, y + 11)],
  ['bar', L(x + w - 48, y + 11, x + w - 14, y + 11)],
];

/** Element pojawia się w chwili s (z dołu / z boku), znika na początku pętli i wraca - pętla zaczyna się gotowym rysunkiem. */
const rebuild = (s: number, from: string, dur = 0.55, easing = OUT): KF[] => [
  [0, { opacity: 1, transform: 'translate(0px, 0px)' }],
  [0.5, { opacity: 1, transform: 'translate(0px, 0px)' }],
  [0.95, { opacity: 0, transform: 'translate(0px, 0px)' }],
  [s, { opacity: 0, transform: from, easing }],
  [s + dur, { opacity: 1, transform: 'translate(0px, 0px)' }],
  [T, { opacity: 1, transform: 'translate(0px, 0px)' }],
];
/** Linijka „wpisuje się” od lewej w chwili s. */
const typeIn = (s: number, dur = 0.4): KF[] => [
  [0, { opacity: 1, transform: 'scaleX(1)' }],
  [0.5, { opacity: 1, transform: 'scaleX(1)' }],
  [0.95, { opacity: 0, transform: 'scaleX(1)' }],
  [s, { opacity: 1, transform: 'scaleX(0)', easing: IO }],
  [s + dur, { opacity: 1, transform: 'scaleX(1)' }],
  [T, { opacity: 1, transform: 'scaleX(1)' }],
];
/** Światło biegnące po ścieżce między a i b. */
const comet = (a: number, b: number): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 0.2 }],
  [a, { opacity: 1, strokeDashoffset: 0.2, easing: IO }],
  [b, { opacity: 1, strokeDashoffset: -1 }],
  [b + 0.05, { opacity: 0, strokeDashoffset: -1 }],
  [T, { opacity: 0, strokeDashoffset: -1 }],
];
/** Dodatek pojawia się w chwili a, zostaje do 7 s i gaśnie przed końcem pętli. */
const hold = (a: number, on: Keyframe, off: Keyframe, dur = 0.5, easing = OUT): KF[] => [
  [0, { opacity: 0, ...off }],
  [a, { opacity: 1, ...off, easing }],
  [a + dur, { opacity: 1, ...on }],
  [7, { opacity: 1, ...on }],
  [7.5, { opacity: 0, ...on }],
  [T, { opacity: 0, ...on }],
];
/** Krótki błysk wypełnienia między a i b. */
const flash = (a: number, b: number, peak = 0.9): KF[] => [
  [0, { opacity: 0 }], [a, { opacity: 0, easing: OUT }], [a + 0.25, { opacity: peak }], [b, { opacity: 0 }], [T, { opacity: 0 }],
];
/** Pierścień rozchodzący się od punktu w chwili a. */
const ring = (a: number, to = 1.7): KF[] => [
  [0, { opacity: 0, transform: 'scale(.3)' }], [a, { opacity: 0, transform: 'scale(.3)' }], [a + 0.12, { opacity: 1, transform: 'scale(.55)', easing: OUT }],
  [a + 1, { opacity: 0, transform: `scale(${to})` }], [T, { opacity: 0, transform: `scale(${to})` }],
];
const tr = (x: number, y: number, s?: number) => `translate(${x}px, ${y}px)${s === undefined ? '' : ` scale(${s})`}`;

const CODE: [number, number, number, Kind][] = [
  [46, 104, 86, 'barHi'], [58, 150, 102, 'bar'], [58, 126, 118, 'bar'], [70, 168, 134, 'bar'], [70, 138, 150, 'barHi'],
  [58, 112, 166, 'bar'], [46, 92, 182, 'barHi'], [46, 160, 206, 'bar'], [46, 120, 222, 'bar'],
];

const ARTS: Art[] = [
  // 0. Sceny pisane dla Twojej marki (do rundy 2: „Kod pisany od zera” - właściciel: oczywistość każdej usługi stron):
  //    edytor z linijkami kodu -> strona z autorskich elementów (żadnej gotowej siatki).
  {
    parts: [
      ['panel', R(30, 44, 172, 212, 10)],
      ['soft', L(30, 66, 202, 66)],
      ['soft', C(44, 55, 3)], ['soft', C(55, 55, 3)], ['soft', C(66, 55, 3)],
      ...CODE.flatMap(([x1, x2, y, k], i): Part[] => N(`c${i}`, [[k, L(x1, y, x2, y)]], 'l')),
      ['dash', L(212, 150, 240, 150)],
      ['acc', AR(244, 150)],
      ...page(254, 24, 196, 252),
      { g: 'b0', parts: [['barXL', L(270, 70, 372, 70)], ['barXL', L(270, 88, 340, 88)]] },
      { g: 'b1', o: 'c', parts: [['acc', C(408, 84, 22)], ['soft', C(408, 84, 12)], ['dot', C(408, 84, 3)]] },
      { g: 'b2', parts: [['soft', R(270, 112, 84, 96, 8)], ['soft', 'M270 184L296 156L318 174L354 140']] },
      { g: 'b3', parts: [['bar', L(368, 130, 434, 130)], ['bar', L(368, 144, 420, 144)], ['bar', L(368, 158, 428, 158)]] },
      { g: 'b4', parts: BTN(368, 178, 62, 20) },
      { g: 'b5', parts: [['soft', L(254, 224, 450, 224)], ['bar', L(270, 246, 330, 246)], ['soft', R(380, 238, 54, 16, 4)]] },
    ],
    live: (
      <>
        <path data-l="c1" className="sm-x sm-x-comet" pathLength={1} d="M202 150C226 150 228 150 254 150" />
        <g data-l="done" data-o="c" className="sm-x">
          <circle className="sm-x-badge" cx="450" cy="24" r="11" />
          <path data-l="donec" className="sm-x-check" pathLength={1} d="M444.6 24.3L448.6 28L455.6 20.3" />
        </g>
      </>
    ),
    scene: (run) => {
      CODE.forEach((_, i) => run(`c${i}`, typeIn(1 + i * 0.16)));
      run('c1', comet(2.5, 3.1));
      run('b0', rebuild(3, tr(-14, 0)));
      run('b1', [
        [0, { opacity: 1, transform: 'scale(1)' }], [0.5, { opacity: 1, transform: 'scale(1)' }], [0.95, { opacity: 0, transform: 'scale(1)' }],
        [3.25, { opacity: 0, transform: 'scale(.4)', easing: SPRING }], [3.9, { opacity: 1, transform: 'scale(1)' }], [T, { opacity: 1, transform: 'scale(1)' }],
      ]);
      run('b2', rebuild(3.5, tr(0, 16)));
      run('b3', rebuild(3.75, tr(14, 0)));
      run('b4', rebuild(4, tr(0, 10), 0.5, SPRING));
      run('b5', rebuild(4.25, tr(0, 10)));
      run('done', hold(4.8, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [5.05, { strokeDashoffset: 1, easing: OUT }], [5.5, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
    },
  },
  // 1. Integracje bez granic: strona pośrodku, wokół płatności, CRM i ERP - dane biegną w obie strony.
  {
    parts: [
      ['panel', R(24, 44, 100, 64, 8)],
      ['soft', L(24, 62, 124, 62)],
      ['barHi', L(36, 86, 70, 86)],
      ['acc', R(90, 78, 22, 15, 3)],
      ['panel', R(24, 192, 100, 64, 8)],
      ['soft', C(44, 214, 8)],
      ['bar', L(60, 210, 108, 210)],
      ['bar', L(60, 222, 96, 222)],
      ['bar', L(36, 242, 108, 242)],
      ['dash', 'M124 76C150 76 148 112 172 112'],
      ['dash', 'M124 224C150 224 148 188 172 188'],
      ...page(172, 34, 140, 232),
      ['barXL', L(186, 78, 266, 78)],
      ['bar', L(186, 96, 292, 96)],
      ...N('row0', [['soft', R(186, 112, 112, 20, 4)], ['bar', L(194, 122, 262, 122)]]),
      ...N('row1', [['soft', R(186, 140, 112, 20, 4)], ['bar', L(194, 150, 246, 150)]]),
      ...N('row2', [['soft', R(186, 168, 112, 20, 4)], ['bar', L(194, 178, 270, 178)]]),
      ...BTN(186, 204, 62, 18),
      ['bar', L(186, 244, 262, 244)],
      ['dash', L(312, 150, 356, 150)],
      ['panel', R(356, 104, 100, 92, 8)],
      ['soft', R(368, 116, 34, 28, 3)], ['soft', R(410, 116, 34, 28, 3)],
      ['soft', R(368, 152, 34, 28, 3)], ['acc', R(410, 152, 34, 28, 3)],
    ],
    live: (
      <>
        <path data-l="ca" className="sm-x sm-x-comet" pathLength={1} d="M124 76C150 76 148 112 172 112" />
        <path data-l="fa" className="sm-x sm-x-fill" d={R(186, 112, 112, 20, 4)} />
        <path data-l="cc" className="sm-x sm-x-comet" pathLength={1} d="M312 150L356 150" />
        <path data-l="fc" className="sm-x sm-x-fill" d={R(410, 152, 34, 28, 3)} />
        <path data-l="cb" className="sm-x sm-x-comet" pathLength={1} d="M172 188C148 188 150 224 124 224" />
        <path data-l="fb" className="sm-x sm-x-fill" d={C(44, 214, 8)} />
        <path data-l="cd" className="sm-x sm-x-comet" pathLength={1} d="M356 150L312 150" />
        <path data-l="fd" className="sm-x sm-x-fill" d={R(186, 168, 112, 20, 4)} />
        <path data-l="ce" className="sm-x sm-x-comet" pathLength={1} d="M172 112C148 112 150 76 124 76" />
        <path data-l="fe" className="sm-x sm-x-fill" d={R(90, 78, 22, 15, 3)} />
      </>
    ),
    scene: (run) => {
      // płatność wpada na stronę -> zamówienie idzie do ERP -> klient trafia do CRM -> stan wraca z ERP -> potwierdzenie płatności
      run('ca', comet(0.5, 1.3)); run('fa', flash(1.2, 2.4)); run('row0', rebuild(1.25, tr(-8, 0)));
      run('cc', comet(1.9, 2.5)); run('fc', flash(2.4, 3.6));
      run('cb', comet(3, 3.8)); run('fb', flash(3.7, 4.9)); run('row1', rebuild(2.9, tr(-8, 0)));
      run('cd', comet(4.4, 5)); run('fd', flash(4.9, 6.1)); run('row2', rebuild(4.95, tr(8, 0)));
      run('ce', comet(5.6, 6.4)); run('fe', flash(6.3, 7.4));
    },
  },
  // 2. Zero czekania: klik w link -> strona gotowa od razu; na osi czasu krótki odcinek od kliknięcia do gotowej strony.
  {
    parts: [
      ['panel', R(30, 36, 164, 88, 10)],
      ['barHi', L(46, 60, 132, 60)],
      ['bar', L(46, 76, 168, 76)],
      ...BTN(46, 92, 72, 18),
      ['dash', L(204, 80, 232, 80)],
      ['acc', AR(236, 80)],
      ...page(246, 24, 204, 196),
      ...N('p0', [['barXL', L(262, 72, 376, 72)], ['barXL', L(262, 90, 340, 90)]]),
      ...N('p1', [['bar', L(262, 110, 404, 110)]]),
      ...N('p2', BTN(262, 124, 66, 20)),
      ...N('p3', [['soft', R(262, 158, 52, 46, 5)], ['soft', R(324, 158, 52, 46, 5)], ['soft', R(386, 158, 48, 46, 5)]]),
      ['soft', L(30, 256, 450, 256)],
      ['ticks', L(30, 256, 450, 256)],
      ['acc', L(62, 242, 62, 270)],
      ['acc', L(62, 256, 104, 256), 'span', 'l'],
      ['acc', L(104, 242, 104, 270), 'ready'],
      ['bar', L(48, 284, 76, 284)],
      ['barHi', L(92, 284, 132, 284)],
    ],
    live: (
      <>
        <circle data-l="tap" data-o="c" className="sm-x sm-x-ring" cx="82" cy="101" r="16" />
        <path data-l="lf" className="sm-x sm-x-fill" d={R(46, 92, 72, 18, 9)} />
        <path data-l="c1" className="sm-x sm-x-comet" pathLength={1} d="M118 101C170 101 190 80 246 80" />
        <circle data-l="mk" className="sm-b-pulse" cx="62" cy="256" r="4" />
        <g data-l="done" data-o="c" className="sm-x">
          <circle className="sm-x-badge" cx="450" cy="24" r="11" />
          <path data-l="donec" className="sm-x-check" pathLength={1} d="M444.6 24.3L448.6 28L455.6 20.3" />
        </g>
      </>
    ),
    scene: (run) => {
      run('tap', ring(1.2, 1.6));
      run('lf', flash(1.2, 2.2, 0.85));
      run('c1', comet(1.3, 1.62));
      for (let k = 0; k < 4; k++) run(`p${k}`, rebuild(1.56 + k * 0.045, tr(0, 6), 0.32));
      run('span', [[0, { transform: 'scaleX(1)' }], [0.5, { transform: 'scaleX(1)' }], [0.9, { transform: 'scaleX(0)' }], [1.3, { transform: 'scaleX(0)', easing: OUT }], [1.72, { transform: 'scaleX(1)' }], [T, { transform: 'scaleX(1)' }]]);
      run('ready', [[0, { opacity: 1 }], [0.5, { opacity: 1 }], [0.9, { opacity: 0 }], [1.66, { opacity: 0 }], [1.8, { opacity: 1 }], [T, { opacity: 1 }]]);
      run('mk', [[0, { transform: tr(42, 0) }], [0.5, { transform: tr(42, 0), easing: IO }], [1, { transform: tr(0, 0) }], [1.3, { transform: tr(0, 0), easing: OUT }], [1.72, { transform: tr(42, 0) }], [T, { transform: tr(42, 0) }]]);
      run('done', hold(1.85, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [2.1, { strokeDashoffset: 1, easing: OUT }], [2.55, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
    },
  },
];

/** Włączanie / zatrzymywanie scenki z zewnątrz (tech.tsx: rysunek narysowany i na ekranie). */
const PLAYERS = new WeakMap<Element, (on: boolean) => void>();
export const setPlay = (svg: Element | null, on: boolean) => { if (svg) PLAYERS.get(svg)?.(on); };

const isGroup = (n: Part | Group): n is Group => !Array.isArray(n);

export const Drawing = ({ index }: { index: number }) => {
  const art = ARTS[index % ARTS.length];
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedPref();

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reduced || typeof svg.animate !== 'function') return;
    let anims: Animation[] = [];
    const build = () => {
      art.scene((name, frames) => {
        svg.querySelectorAll(`[data-l="${name}"]`).forEach((el) => {
          anims.push(el.animate(frames.map(([t, k]) => ({ offset: t / T, ...k })), { duration: T * 1000, iterations: Infinity }));
        });
      });
    };
    PLAYERS.set(svg, (on) => {
      if (on && !anims.length) build();
      else if (!on && anims.length) { anims.forEach((a) => a.cancel()); anims = []; }
    });
    return () => { PLAYERS.delete(svg); anims.forEach((a) => a.cancel()); anims = []; };
  }, [art, reduced]);

  let i = 0;
  const part = ([k, d, name, origin]: Part) => {
    const style = { '--i': i } as CSSProperties;
    if (origin && origin !== 'c' && origin !== 'l') style.transformOrigin = origin;
    return (
      <path
        key={i++} d={d} className={`sm-b-k-${k}`} pathLength={k === 'ticks' ? 48 : FILL_ONLY.includes(k) ? undefined : 1}
        data-l={name} data-o={origin === 'c' || origin === 'l' ? origin : undefined} style={style}
      />
    );
  };
  const nodes = art.parts.map((n, idx) => {
    if (!isGroup(n)) return part(n);
    const inner = <g key={`g${idx}`} data-l={n.g} data-o={n.o}>{n.parts.map(part)}</g>;
    return n.clip ? <g key={`c${idx}`} clipPath={`url(#${n.clip})`}>{inner}</g> : inner;
  });
  return (
    <svg ref={ref} className="sm-b-svg" viewBox="0 0 480 300" focusable="false" style={{ '--n': i } as CSSProperties}>
      {art.defs && <defs>{art.defs}</defs>}
      {nodes}
      {art.live}
    </svg>
  );
};
