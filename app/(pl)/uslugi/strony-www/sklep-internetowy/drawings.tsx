'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// RYSUNKI KART STOSU ze SCENKAMI - sklep internetowy (silnik skopiowany z pilota one-page z prefiksem sk-; wzór:
// rysunki Oferty na stronie głównej - rysowanie + scenka na jednej osi czasu). Dwie warstwy ruchu:
//   1. RYSOWANIE - linie rysują się razem z przewijaniem (--d na karcie, --i linii; CSS w sklep.css),
//   2. SCENKA    - po narysowaniu rysunek ożywa w pętli 8 s (WAAPI, jedna oś czasu na rysunek): pętla zaczyna się
//                  i kończy gotowym rysunkiem. Ruch tylko przez transform / opacity / stroke-dashoffset.
//      0 Płatność w jedno kliknięcie - klient klika „Zapłać”, światło biegnie na stronę operatora płatności, tam
//                                      wpisuje się kod BLIK, potwierdzenie wraca i przycisk zmienia się w „opłacone”,
//      1 Wysyłka pod kontrolą        - klient przełącza dostawę na paczkomat i zatwierdza, światło biegnie do panelu,
//                                      wpada zamówienie, adres po kolei, paczka spada na miejsce,
//      2 Zakupy na telefonie         - produkt przewija się pod kciukiem dwoma „pstryknięciami”, przycisk zakupu
//                                      stoi przyklejony u dołu, dotknięcie i trzy kroki zakupu zapalają się po kolei,
//      3 Wiesz, co podnosi sprzedaż  - koszyk zostaje porzucony (słupek opada), wychodzi mail, klient wraca,
//                                      słupek rośnie ponad poprzedni poziom.
// Scenka gra tylko, gdy karta jest narysowana, na ekranie i nieprzykryta (setPlay z cases.tsx).
// Bez JS / ograniczony ruch: gotowy rysunek bez ruchu.

/** 'panel' = płytka z obrysem i ciemnym wypełnieniem, 'pad' = samo wypełnienie (zasłaniają świat za rysunkiem). */
type Kind = 'main' | 'panel' | 'pad' | 'soft' | 'acc' | 'accFill' | 'bar' | 'barHi' | 'barXL' | 'dash' | 'dot';
const FILL_ONLY: Kind[] = ['accFill', 'dot', 'dash', 'pad'];
/** [rodzaj, ścieżka, nazwa w scence (data-l), punkt odniesienia przekształceń: 'c' środek, 'l' lewa krawędź albo "x y"] */
type Part = [Kind, string, string?, string?];
/** Grupa animowana jako całość (data-l = g); clip = id maski przycinającej grupę (okno telefonu). */
interface Group { g: string; clip?: string; parts: Part[] }
type KF = [number, Keyframe];
type Run = (name: string, frames: KF[]) => void;
interface Art { parts: (Part | Group)[]; defs?: ReactNode; live?: ReactNode; scene: (run: Run) => void }

/** Długość pętli scenki [s]. */
const T = 8;
const OUT = 'cubic-bezier(.16, 1, .3, 1)';
const IO = 'cubic-bezier(.65, 0, .35, 1)';
const FLICK = 'cubic-bezier(.22, 1, .36, 1)';
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
/** Części z nazwą do scenki. */
const N = (name: string, parts: Part[]): Part[] => parts.map(([k, d]) => [k, d, name]);
/** Okno (strona / panel) z paskiem u góry. */
const page = (x: number, y: number, w: number, h: number): Part[] => [
  ['panel', R(x, y, w, h, 10)],
  ['soft', L(x, y + 22, x + w, y + 22)],
  ['barHi', L(x + 14, y + 11, x + 42, y + 11)],
  ['bar', L(x + w - 48, y + 11, x + w - 14, y + 11)],
];
/** Telefon. */
const phone = (x: number, y: number, w: number, h: number): Part[] => [
  ['panel', R(x, y, w, h, 18)],
  ['soft', L(x + w / 2 - 17, y + 13, x + w / 2 + 17, y + 13)],
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
/** Światło biegnące po ścieżce między a i b. */
const comet = (a: number, b: number): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 0.2 }],
  [a, { opacity: 1, strokeDashoffset: 0.2, easing: IO }],
  [b, { opacity: 1, strokeDashoffset: -1 }],
  [b + 0.05, { opacity: 0, strokeDashoffset: -1 }],
  [T, { opacity: 0, strokeDashoffset: -1 }],
];
/** Dodatek pojawia się w chwili a, zostaje do 7 s i gaśnie przed końcem pętli. */
const hold = (a: number, on: Keyframe, off: Keyframe, dur = 0.5, easing = OUT, till = 7): KF[] => [
  [0, { opacity: 0, ...off }],
  [a, { opacity: 1, ...off, easing }],
  [a + dur, { opacity: 1, ...on }],
  [till, { opacity: 1, ...on }],
  [till + 0.5, { opacity: 0, ...on }],
  [T, { opacity: 0, ...on }],
];
/** Dotknięcie: pierścień rozchodzi się od punktu w chwili a. */
const tap = (a: number): KF[] => [
  [0, { opacity: 0, transform: 'scale(.3)' }], [a, { opacity: 0, transform: 'scale(.3)' }],
  [a + 0.15, { opacity: 1, transform: 'scale(.55)', easing: OUT }], [a + 1.05, { opacity: 0, transform: 'scale(1.6)' }], [T, { opacity: 0, transform: 'scale(1.6)' }],
];
/** Znak „gotowe” rysuje się w chwili a. */
const check = (a: number, till = 7): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 1 }], [a, { opacity: 1, strokeDashoffset: 1, easing: OUT }], [a + 0.5, { opacity: 1, strokeDashoffset: 0 }],
  [till, { opacity: 1, strokeDashoffset: 0 }], [till + 0.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }],
];

// telefon w rysunku 3: trzy ekrany treści jeden pod drugim (przewijane pod maską ekranu)
const SCREEN = 188;
const feed = (): Part[] => {
  const o1 = SCREEN, o2 = SCREEN * 2;
  return [
    ['soft', R(202, 44, 116, 90, 8)], ['soft', `${L(202, 44, 318, 134)}${L(318, 44, 202, 134)}`],
    ['barXL', L(202, 152, 276, 152)], ['bar', L(202, 170, 250, 170)],
    ['soft', C(208, 194, 6)], ['soft', C(228, 194, 6)], ['soft', C(248, 194, 6)],
    ['barHi', L(202, 46 + o1, 268, 46 + o1)],
    ['bar', L(202, 66 + o1, 316, 66 + o1)], ['bar', L(202, 80 + o1, 300, 80 + o1)], ['bar', L(202, 94 + o1, 310, 94 + o1)],
    ['soft', R(202, 112 + o1, 54, 26, 6)], ['soft', R(264, 112 + o1, 54, 26, 6)],
    ['bar', L(202, 160 + o1, 290, 160 + o1)], ['bar', L(202, 174 + o1, 270, 174 + o1)],
    ['barHi', L(202, 46 + o2, 280, 46 + o2)],
    ['soft', R(202, 62 + o2, 54, 58, 6)], ['soft', R(264, 62 + o2, 54, 58, 6)],
    ['bar', L(202, 134 + o2, 246, 134 + o2)], ['bar', L(264, 134 + o2, 304, 134 + o2)],
    ['soft', R(202, 150 + o2, 116, 30, 6)],
  ];
};

const ARTS: Art[] = [
  // 0. Płatność w jedno kliknięcie: kasa sklepu -> strona operatora (Przelewy24 / Stripe) z kodem BLIK -> opłacone.
  {
    parts: [
      ...phone(34, 22, 150, 256),
      ['barXL', L(52, 70, 126, 70)],
      ['bar', L(52, 88, 104, 88)],
      ['soft', R(52, 106, 114, 22, 6)], ['bar', L(62, 117, 110, 117)],
      ['soft', R(52, 136, 114, 22, 6)], ['bar', L(62, 147, 124, 147)],
      ...BTN(52, 172, 114, 24),
      ['bar', L(52, 222, 150, 222)],
      ['bar', L(52, 236, 120, 236)],
      ['dash', L(196, 150, 244, 150)],
      ['acc', AR(248, 150)],
      ...phone(262, 22, 150, 256),
      ['acc', 'M337 50L358 59V80C358 94 349 103 337 108C325 103 316 94 316 80V59Z'],
      ['barHi', L(300, 128, 374, 128)],
      ...[0, 1, 2, 3, 4, 5].map((i): Part => ['soft', R(280 + i * 19.6, 146, 16, 22, 3)]),
      ...BTN(286, 208, 102, 26),
    ],
    live: (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} data-l={`d${i}`} data-o="l" className="sk-l sk-l-type" d={L(284 + i * 19.6, 157, 292 + i * 19.6, 157)} />)}
        <circle data-l="tap" data-o="c" className="sk-l sk-l-ring" cx="109" cy="184" r="13" />
        <path data-l="pbtn" className="sk-l sk-l-fill" d={R(52, 172, 114, 24, 12)} />
        <path data-l="c1" className="sk-l sk-l-comet" pathLength={1} d="M166 184C214 184 226 79 316 79" />
        <path data-l="sh" className="sk-l sk-l-fill" d="M337 50L358 59V80C358 94 349 103 337 108C325 103 316 94 316 80V59Z" />
        <circle data-l="tap2" data-o="c" className="sk-l sk-l-ring" cx="337" cy="221" r="13" />
        <path data-l="cbtn" className="sk-l sk-l-fill" d={R(286, 208, 102, 26, 13)} />
        <path data-l="c2" className="sk-l sk-l-comet" pathLength={1} d="M286 221C236 221 226 184 166 184" />
        <path data-l="send" className="sk-l sk-l-solid" d={R(52, 172, 114, 24, 12)} />
        <path data-l="ok" className="sk-l sk-l-check" pathLength={1} d="M102 184.4L107.2 189.2L117 178.8" />
        <g data-l="done" data-o="c" className="sk-l">
          <circle className="sk-l-badge" cx="184" cy="24" r="11" />
          <path data-l="donec" className="sk-l-check" pathLength={1} d="M178.6 24.3L182.6 28L189.6 20.3" />
        </g>
      </>
    ),
    scene: (run) => {
      // klient klika „Zapłać” w sklepie, sklep przekazuje go do operatora; tam wpisuje kod i wraca z potwierdzeniem
      run('tap', tap(0.4));
      run('pbtn', [[0, { opacity: 0 }], [0.45, { opacity: 0, easing: OUT }], [0.7, { opacity: 0.9 }], [1.7, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('c1', comet(0.8, 1.8));
      run('sh', [[0, { opacity: 0 }], [1.7, { opacity: 0, easing: OUT }], [2.1, { opacity: 0.75 }], [7, { opacity: 0.3 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
      for (let k = 0; k < 6; k++) run(`d${k}`, hold(2.2 + k * 0.24, { transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }, 0.2, OUT));
      run('tap2', tap(3.9));
      run('cbtn', [[0, { opacity: 0 }], [3.95, { opacity: 0, easing: OUT }], [4.2, { opacity: 0.9 }], [5.2, { opacity: 0.3 }], [7, { opacity: 0.3 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('c2', comet(4.3, 5.2));
      run('send', hold(5.2, { transform: 'none' }, { transform: 'none' }, 0.35));
      run('ok', check(5.4));
      run('done', hold(5.7, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [5.95, { strokeDashoffset: 1, easing: OUT }], [6.4, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
    },
  },
  // 1. Wysyłka pod kontrolą: wybór dostawy w kasie -> zamówienie z adresem w panelu.
  {
    parts: [
      ['panel', R(30, 34, 170, 232, 14)],
      ['barHi', L(46, 58, 112, 58)],
      ['soft', R(46, 74, 138, 44, 8)], ['soft', C(64, 96, 7)], ['bar', L(80, 90, 142, 90)], ['bar', L(80, 102, 122, 102)],
      ['soft', R(46, 128, 138, 44, 8)], ['soft', C(64, 150, 7)], ['bar', L(80, 144, 150, 144)], ['bar', L(80, 156, 116, 156)],
      ['bar', L(46, 196, 124, 196)],
      ...BTN(46, 214, 138, 26),
      ['dash', L(210, 150, 244, 150)],
      ['acc', AR(248, 150)],
      ...page(262, 24, 186, 252),
      ...N('hd', [['barXL', L(278, 64, 372, 64)]]),
      { g: 'row', parts: [['soft', R(278, 82, 154, 42, 6)], ['dot', C(292, 103, 3)], ['bar', L(302, 97, 376, 97)], ['bar', L(302, 109, 350, 109)], ['acc', R(394, 96, 28, 14, 7)]] },
      { g: 'r0', parts: [['dot', C(284, 146, 3)], ['bar', L(296, 146, 404, 146)]] },
      { g: 'r1', parts: [['dot', C(284, 164, 3)], ['bar', L(296, 164, 380, 164)]] },
      { g: 'r2', parts: [['dot', C(284, 182, 3)], ['bar', L(296, 182, 416, 182)]] },
      { g: 'box', parts: [['acc', R(278, 208, 46, 38, 4)], ['acc', L(301, 208, 301, 246)], ['soft', L(278, 220, 324, 220)]] },
      ...N('bt', BTN(340, 218, 92, 22)),
    ],
    live: (
      <>
        <circle data-l="s1" data-o="c" className="sk-l sk-l-badge" cx="64" cy="96" r="3.6" />
        <circle data-l="s2" data-o="c" className="sk-l sk-l-badge" cx="64" cy="150" r="3.6" />
        <path data-l="pick" className="sk-l sk-l-guide" pathLength={1} d={R(46, 128, 138, 44, 8)} />
        <circle data-l="tap" data-o="c" className="sk-l sk-l-ring" cx="115" cy="227" r="13" />
        <path data-l="pbtn" className="sk-l sk-l-fill" d={R(46, 214, 138, 26, 13)} />
        <path data-l="c1" className="sk-l sk-l-comet" pathLength={1} d="M184 227C230 227 226 103 278 103" />
        <circle data-l="here" data-o="c" className="sk-l sk-l-ring" cx="301" cy="227" r="18" />
      </>
    ),
    scene: (run) => {
      // klient przełącza dostawę z kuriera na paczkomat, zatwierdza; zamówienie z adresem wpada do panelu
      run('s1', [[0, { opacity: 1, transform: 'scale(1)' }], [0.9, { opacity: 1, transform: 'scale(1)', easing: IO }], [1.15, { opacity: 0, transform: 'scale(0)' }], [7.2, { opacity: 0, transform: 'scale(0)', easing: SPRING }], [7.6, { opacity: 1, transform: 'scale(1)' }], [T, { opacity: 1, transform: 'scale(1)' }]]);
      run('s2', [[0, { opacity: 0, transform: 'scale(0)' }], [1.05, { opacity: 1, transform: 'scale(0)', easing: SPRING }], [1.5, { opacity: 1, transform: 'scale(1)' }], [7, { opacity: 1, transform: 'scale(1)' }], [7.3, { opacity: 0, transform: 'scale(0)' }], [T, { opacity: 0, transform: 'scale(0)' }]]);
      run('pick', [[0, { opacity: 0, strokeDashoffset: 1 }], [1.05, { opacity: 1, strokeDashoffset: 1, easing: IO }], [1.9, { opacity: 1, strokeDashoffset: 0 }], [7, { opacity: 1, strokeDashoffset: 0 }], [7.4, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }]]);
      run('tap', tap(2.3));
      run('pbtn', [[0, { opacity: 0 }], [2.35, { opacity: 0, easing: OUT }], [2.6, { opacity: 0.9 }], [3.6, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('c1', comet(2.7, 3.7));
      run('hd', rebuild(3.3, 'translate(0px, 8px)'));
      run('row', rebuild(3.7, 'translate(0px, -14px)', 0.6, SPRING));
      for (let k = 0; k < 3; k++) run(`r${k}`, rebuild(4.3 + k * 0.3, 'translate(-12px, 0px)', 0.6));
      run('box', rebuild(5.3, 'translate(0px, -22px)', 0.55, SPRING));
      run('here', tap(5.75));
      run('bt', rebuild(5.6, 'translate(0px, 8px)'));
    },
  },
  // 2. Zakupy na telefonie: produkt przewijany kciukiem, przycisk zakupu przyklejony u dołu, trzy kroki.
  {
    parts: [
      ['soft', C(64, 76, 10)], ['bar', L(86, 70, 138, 70)], ['bar', L(86, 82, 118, 82)],
      ['soft', L(64, 88, 64, 138)],
      ['soft', C(64, 150, 10)], ['bar', L(86, 144, 142, 144)], ['bar', L(86, 156, 112, 156)],
      ['soft', L(64, 162, 64, 212)],
      ['soft', C(64, 224, 10)], ['bar', L(86, 218, 130, 218)], ['bar', L(86, 230, 122, 230)],
      ['panel', R(186, 10, 148, 280, 22)],
      ['soft', L(244, 24, 276, 24)],
      { g: 'feed', clip: 'sk-k-clip-phone', parts: feed() },
      { g: 'dock', clip: 'sk-k-clip-phone', parts: [['pad', R(186, 232, 148, 60)], ['soft', L(192, 232, 328, 232)], ...BTN(202, 244, 116, 28)] },
      ['acc', L(366, 98, 366, 198)],
      ['acc', 'M359.5 190.5L366 199L372.5 190.5'],
      ['dash', L(380, 258, 420, 258)],
    ],
    defs: <clipPath id="sk-k-clip-phone"><rect x="192" y="34" width="136" height="250" rx="16" /></clipPath>,
    live: (
      <>
        <circle data-l="knob" className="sk-k-pulse" cx="366" cy="104" r="4" />
        <circle data-l="tap" data-o="c" className="sk-l sk-l-ring" cx="260" cy="258" r="14" />
        <path data-l="send" className="sk-l sk-l-solid" d={R(202, 244, 116, 28, 14)} />
        <path data-l="ok" className="sk-l sk-l-check" pathLength={1} d="M253 258.4L258.2 263.2L268 252.8" />
        {[76, 150, 224].map((y, i) => <circle key={y} data-l={`n${i}`} data-o="c" className="sk-l sk-l-badge" cx="64" cy={y} r="5.5" />)}
        <path data-l="g0" className="sk-l sk-l-guide" pathLength={1} d={L(64, 88, 64, 138)} />
        <path data-l="g1" className="sk-l sk-l-guide" pathLength={1} d={L(64, 162, 64, 212)} />
      </>
    ),
    scene: (run) => {
      const y = (k: number) => `translate(0px, ${-k * SCREEN}px)`;
      run('feed', [
        [0, { transform: y(0) }], [0.6, { transform: y(0), easing: FLICK }], [1.5, { transform: y(1) }],
        [2.1, { transform: y(1), easing: FLICK }], [3, { transform: y(2) }],
        [6.2, { transform: y(2), easing: IO }], [7.4, { transform: y(0) }], [T, { transform: y(0) }],
      ]);
      const ky = (k: number) => `translate(0px, ${k * 44}px)`;
      run('knob', [
        [0, { transform: ky(0) }], [0.6, { transform: ky(0), easing: FLICK }], [1.5, { transform: ky(1) }],
        [2.1, { transform: ky(1), easing: FLICK }], [3, { transform: ky(2) }],
        [6.2, { transform: ky(2), easing: IO }], [7.4, { transform: ky(0) }], [T, { transform: ky(0) }],
      ]);
      run('n0', hold(0.3, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.45, SPRING));
      run('g0', [[0, { opacity: 0, strokeDashoffset: 1 }], [3.1, { opacity: 1, strokeDashoffset: 1, easing: IO }], [3.7, { opacity: 1, strokeDashoffset: 0 }], [7, { opacity: 1, strokeDashoffset: 0 }], [7.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }]]);
      run('tap', tap(3.4));
      run('send', hold(3.6, { transform: 'none' }, { transform: 'none' }, 0.35));
      run('n1', hold(3.7, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.45, SPRING));
      run('ok', check(3.9));
      run('g1', [[0, { opacity: 0, strokeDashoffset: 1 }], [4.3, { opacity: 1, strokeDashoffset: 1, easing: IO }], [4.9, { opacity: 1, strokeDashoffset: 0 }], [7, { opacity: 1, strokeDashoffset: 0 }], [7.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }]]);
      run('n2', hold(4.9, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.45, SPRING));
    },
  },
  // 3. Wiesz, co podnosi sprzedaż: porzucony koszyk -> mail do klienta -> sprzedaż wraca na wykres.
  {
    parts: [
      ['panel', R(26, 40, 214, 220, 12)],
      ['barHi', L(44, 64, 124, 64)],
      ['bar', L(44, 78, 100, 78)],
      ['soft', L(44, 230, 222, 230)],
      ...[44, 66, 58, 88].map((h, i): Part => ['soft', R(54 + i * 34, 230 - h, 22, h, 3)]),
      ['accFill', R(190, 112, 22, 118, 3), 'last', '201px 230px'],
      ['acc', R(190, 112, 22, 118, 3), 'last', '201px 230px'],
      ['dash', 'M65 180L99 158L133 166L167 136L201 104'],
      ['panel', R(272, 40, 180, 84, 10)],
      { g: 'cart', parts: [['acc', 'M290 62H298L305 92H332L338 72H301'], ['dot', C(309, 101, 3)], ['dot', C(329, 101, 3)]] },
      ['barHi', L(354, 68, 430, 68)],
      ['bar', L(354, 84, 410, 84)],
      ['bar', L(354, 98, 392, 98)],
      ['dash', L(362, 132, 362, 162)],
      ['acc', 'M355.5 157.5L362 166L368.5 157.5'],
      ['panel', R(272, 176, 180, 84, 10)],
      { g: 'mail', parts: [['soft', R(290, 199, 52, 38, 4)], ['acc', 'M290 202L316 222L342 202']] },
      ...N('mt', [['barHi', L(356, 204, 432, 204)], ['bar', L(356, 220, 412, 220)]]),
      ...N('mbtn', BTN(356, 232, 60, 16)),
    ],
    live: (
      <>
        <circle data-l="warn" data-o="c" className="sk-l sk-l-ring" cx="314" cy="82" r="24" />
        <path data-l="c1" className="sk-l sk-l-comet" pathLength={1} d="M362 124C362 140 362 152 362 176" />
        <path data-l="c2" className="sk-l sk-l-comet" pathLength={1} d="M272 218C244 218 258 108 213 108" />
        <g data-l="done" data-o="c" className="sk-l">
          <circle className="sk-l-badge" cx="201" cy="100" r="11" />
          <path data-l="donec" className="sk-l-check" pathLength={1} d="M195.6 100.3L199.6 104L206.6 96.3" />
        </g>
      </>
    ),
    scene: (run) => {
      // koszyk porzucony: słupek sprzedaży opada; mail wychodzi do klienta; klient wraca, słupek rośnie
      run('cart', [
        [0, { transform: 'translate(0px, 0px)' }], [0.5, { transform: 'translate(0px, 0px)', easing: IO }], [0.68, { transform: 'translate(-4px, 0px)', easing: IO }],
        [0.86, { transform: 'translate(4px, 0px)', easing: IO }], [1.04, { transform: 'translate(-3px, 0px)', easing: IO }], [1.25, { transform: 'translate(0px, 0px)' }], [T, { transform: 'translate(0px, 0px)' }],
      ]);
      run('warn', tap(0.5));
      run('last', [
        [0, { transform: 'scaleY(1)' }], [0.6, { transform: 'scaleY(1)', easing: IO }], [1.4, { transform: 'scaleY(.52)' }],
        [4.3, { transform: 'scaleY(.52)', easing: SPRING }], [5.1, { transform: 'scaleY(1)' }], [T, { transform: 'scaleY(1)' }],
      ]);
      run('c1', comet(1.5, 2.3));
      run('mail', rebuild(2.3, 'translate(0px, 12px)', 0.55, SPRING));
      run('mt', rebuild(2.6, 'translate(-10px, 0px)', 0.55));
      run('mbtn', rebuild(2.9, 'translate(0px, 8px)'));
      run('c2', comet(3.3, 4.4));
      run('done', hold(5, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [5.25, { strokeDashoffset: 1, easing: OUT }], [5.7, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
    },
  },
];

/** Włączanie / zatrzymywanie scenki z zewnątrz (cases.tsx: karta narysowana, na ekranie, nieprzykryta). */
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
        key={i++} d={d} className={`sk-k-k-${k}`} pathLength={FILL_ONLY.includes(k) ? undefined : 1}
        data-l={name} data-o={origin === 'c' || origin === 'l' ? origin : undefined} style={style}
      />
    );
  };
  const nodes = art.parts.map((n, idx) => {
    if (!isGroup(n)) return part(n);
    const inner = <g key={`g${idx}`} data-l={n.g}>{n.parts.map(part)}</g>;
    return n.clip ? <g key={`c${idx}`} clipPath={`url(#${n.clip})`}>{inner}</g> : inner;
  });
  return (
    <svg ref={ref} className="sk-k-svg" viewBox="0 0 480 300" focusable="false" style={{ '--n': i } as CSSProperties}>
      {art.defs && <defs>{art.defs}</defs>}
      {nodes}
      {art.live}
    </svg>
  );
};
