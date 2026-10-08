'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// RYSUNKI KART STOSU ze SCENKAMI (wzór: rysunki Oferty na stronie głównej - reveal + scenka na jednej osi czasu).
// Właściciel 2026-10-01: „te motion design zrób bardziej premium i smooth, może bardziej zaawansowane, a nie jak ten
// z szybkością taki sobie, i reszta też do dopracowania” - dawna wersja miała tylko rysowanie linii i jedną kropkę.
// Dwie warstwy ruchu:
//   1. RYSOWANIE - linie rysują się razem z przewijaniem (--d na karcie, --i linii; CSS w one-page.css),
//   2. SCENKA    - po narysowaniu rysunek ożywa w pętli 8 s (WAAPI, jedna oś czasu na rysunek): pętla zaczyna się
//                  i kończy gotowym rysunkiem, więc wejście i zapętlenie są bez szwu. Ruch tylko przez transform /
//                  opacity / stroke-dashoffset, łagodne krzywe (wyjście expo, sprężyna przy „pstryknięciach”).
//      0 Laserowe skupienie       - dotknięcie reklamy, światło biegnie do strony, wzrok schodzi jedną ścieżką
//                                   do formularza, pole się wypełnia, przycisk potwierdza wysłanie,
//      1 Wizytówka w sieci        - kod z wizytówki zostaje zeskanowany, światło biegnie do strony, strona składa
//                                   się od nowa: mapa, pinezka spada na miejsce, dane kontaktowe po kolei (dawny
//                                   rysunek „pomysł -> strona -> zapytania” usunięty razem z kartą - właściciel
//                                   2026-10-02: „błyskawiczna weryfikacja - chujowy koncept”),
//      2 Idealne pod mobile       - strona w telefonie przewija się trzema „pstryknięciami” kciuka (treść jedzie pod
//                                   maską ekranu), ramka na długiej stronie i wskaźnik jadą razem z nią, potem powrót,
//      3 Szybkość, która oszczędza - wskazówka wraca na zero i wystrzeliwuje ze sprężyną, łuk i podziałka zapalają
//                                   się za nią, pasek ładowania przelatuje, strona wskakuje kaskadą, znak „gotowe”.
// Scenka gra tylko, gdy karta jest narysowana, na ekranie i nieprzykryta (setPlay z cases.tsx).
// Bez JS / ograniczony ruch: gotowy rysunek bez ruchu.

/** 'panel' = płytka z obrysem i ciemnym wypełnieniem, 'pad' = samo wypełnienie (zasłaniają świat za rysunkiem). */
type Kind = 'main' | 'panel' | 'pad' | 'soft' | 'acc' | 'accFill' | 'bar' | 'barHi' | 'barXL' | 'dash' | 'dot' | 'track' | 'arc' | 'ticks';
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
/** Strona one-page w oknie przeglądarki (wspólna dla rysunków). */
const page = (x: number, y: number, w: number, h: number): Part[] => [
  ['panel', R(x, y, w, h, 10)],
  ['soft', L(x, y + 22, x + w, y + 22)],
  ['barHi', L(x + 14, y + 11, x + 42, y + 11)],
  ['bar', L(x + w - 48, y + 11, x + w - 14, y + 11)],
];

/** Element pojawia się w chwili s (z dołu / z boku), znika na początku pętli i wraca - pętla zaczyna się gotowym rysunkiem. */
const rebuild = (s: number, from: string, dur = 0.55): KF[] => [
  [0, { opacity: 1, transform: 'translate(0px, 0px)' }],
  [0.5, { opacity: 1, transform: 'translate(0px, 0px)' }],
  [0.95, { opacity: 0, transform: 'translate(0px, 0px)' }],
  [s, { opacity: 0, transform: from, easing: OUT }],
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
const hold = (a: number, on: Keyframe, off: Keyframe, dur = 0.5, easing = OUT): KF[] => [
  [0, { opacity: 0, ...off }],
  [a, { opacity: 1, ...off, easing }],
  [a + dur, { opacity: 1, ...on }],
  [7, { opacity: 1, ...on }],
  [7.5, { opacity: 0, ...on }],
  [T, { opacity: 0, ...on }],
];

// telefon w rysunku 3: cztery ekrany treści jeden pod drugim (przewijane pod maską ekranu)
const SCREEN = 236;
const feed = (): Part[] => {
  const o1 = SCREEN, o2 = SCREEN * 2, o3 = SCREEN * 3;
  return [
    ['barXL', L(264, 72, 352, 72)], ['barXL', L(264, 90, 326, 90)], ['bar', L(264, 112, 362, 112)], ['bar', L(264, 126, 338, 126)],
    ...BTN(264, 142, 72, 20), ['soft', R(264, 180, 100, 42, 6)], ['soft', R(264, 232, 100, 30, 6)],
    ['barHi', L(264, 68 + o1, 330, 68 + o1)],
    ['soft', R(264, 86 + o1, 100, 44, 6)], ['bar', L(274, 102 + o1, 332, 102 + o1)], ['bar', L(274, 116 + o1, 312, 116 + o1)],
    ['soft', R(264, 140 + o1, 100, 44, 6)], ['bar', L(274, 156 + o1, 326, 156 + o1)], ['bar', L(274, 170 + o1, 306, 170 + o1)],
    ['soft', R(264, 194 + o1, 100, 44, 6)], ['bar', L(274, 210 + o1, 336, 210 + o1)], ['bar', L(274, 224 + o1, 316, 224 + o1)],
    ['soft', R(264, 66 + o2, 100, 72, 6)], ['soft', `${L(264, 66 + o2, 364, 138 + o2)}${L(364, 66 + o2, 264, 138 + o2)}`],
    ['barXL', L(264, 160 + o2, 348, 160 + o2)], ['bar', L(264, 180 + o2, 362, 180 + o2)], ['bar', L(264, 194 + o2, 350, 194 + o2)],
    ...BTN(264, 214 + o2, 64, 20),
    ['barHi', L(264, 70 + o3, 336, 70 + o3)],
    ['soft', R(264, 90 + o3, 100, 24, 5)], ['soft', R(264, 122 + o3, 100, 24, 5)], ['soft', R(264, 154 + o3, 100, 46, 5)],
    ...BTN(264, 214 + o3, 100, 24),
  ];
};
/** Trzy „pstryknięcia” w dół i powrót: wartości przekształcenia dla czterech położeń. */
const flicks = (v: string[]): KF[] => [
  [0, { transform: v[0] }], [0.7, { transform: v[0], easing: FLICK }], [1.6, { transform: v[1] }],
  [2.3, { transform: v[1], easing: FLICK }], [3.2, { transform: v[2] }],
  [3.9, { transform: v[2], easing: FLICK }], [4.8, { transform: v[3] }],
  [6, { transform: v[3], easing: IO }], [7.4, { transform: v[0] }], [T, { transform: v[0] }],
];

const ARTS: Art[] = [
  // 0. Laserowe skupienie: reklama w telefonie -> strona, która mówi to samo -> jedna ścieżka do formularza.
  {
    parts: [
      ['panel', R(36, 34, 118, 232, 16)],
      ['soft', L(80, 46, 110, 46)],
      ['soft', R(50, 68, 90, 132, 8)],
      ['soft', R(58, 76, 74, 54, 5)],
      ['soft', `${L(58, 76, 132, 130)}${L(132, 76, 58, 130)}`],
      ['barHi', L(60, 146, 124, 146)],
      ['bar', L(60, 160, 108, 160)],
      ...BTN(60, 174, 62, 18),
      ['bar', L(52, 220, 136, 220)],
      ['bar', L(52, 234, 116, 234)],
      ['dash', L(166, 150, 244, 150)],
      ['acc', AR(248, 150)],
      ...page(258, 24, 186, 252),
      ['barXL', L(274, 74, 400, 74)],
      ['barXL', L(274, 92, 362, 92)],
      ['bar', L(274, 112, 416, 112)],
      ...BTN(274, 126, 66, 20),
      ['soft', L(258, 162, 444, 162)],
      ['soft', R(274, 174, 48, 36, 5)],
      ['soft', R(331, 174, 48, 36, 5)],
      ['soft', R(388, 174, 48, 36, 5)],
      ['soft', L(258, 224, 444, 224)],
      ['soft', R(274, 236, 100, 14, 4)],
      ...BTN(382, 236, 48, 14),
    ],
    live: (
      <>
        <circle data-l="tap" data-o="c" className="one-l one-l-ring" cx="91" cy="183" r="13" />
        <path data-l="adbtn" className="one-l one-l-fill" d={R(60, 174, 62, 18, 9)} />
        <path data-l="c1" className="one-l one-l-comet" pathLength={1} d="M122 183C196 183 206 136 274 136" />
        <path data-l="hbtn" className="one-l one-l-fill" d={R(274, 126, 66, 20, 10)} />
        <path data-l="guide" className="one-l one-l-guide" pathLength={1} d="M307 148C307 198 324 188 324 234" />
        <path data-l="type" data-o="l" className="one-l one-l-type" d={L(281, 243, 362, 243)} />
        <path data-l="send" className="one-l one-l-solid" d={R(382, 236, 48, 14, 7)} />
        <path data-l="ok" className="one-l one-l-check" pathLength={1} d="M399.5 243.2L404.4 247.4L412.6 238.8" />
      </>
    ),
    scene: (run) => {
      run('tap', [[0, { opacity: 0, transform: 'scale(.3)' }], [0.25, { opacity: 0, transform: 'scale(.3)' }], [0.4, { opacity: 1, transform: 'scale(.55)', easing: OUT }], [1.3, { opacity: 0, transform: 'scale(1.6)' }], [T, { opacity: 0, transform: 'scale(1.6)' }]]);
      run('adbtn', [[0, { opacity: 0 }], [0.3, { opacity: 0, easing: OUT }], [0.55, { opacity: 0.9 }], [1.4, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('c1', comet(0.9, 2));
      run('hbtn', [[0, { opacity: 0 }], [1.8, { opacity: 0, easing: OUT }], [2.15, { opacity: 0.85 }], [3.1, { opacity: 0.3 }], [7, { opacity: 0.3 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('guide', [[0, { opacity: 0, strokeDashoffset: 1 }], [2.4, { opacity: 1, strokeDashoffset: 1, easing: IO }], [3.8, { opacity: 1, strokeDashoffset: 0 }], [7, { opacity: 1, strokeDashoffset: 0 }], [7.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }]]);
      run('type', hold(3.9, { transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }, 1.1, IO));
      run('send', hold(5.2, { transform: 'none' }, { transform: 'none' }, 0.35));
      run('ok', [[0, { opacity: 0, strokeDashoffset: 1 }], [5.4, { opacity: 1, strokeDashoffset: 1, easing: OUT }], [5.95, { opacity: 1, strokeDashoffset: 0 }], [7, { opacity: 1, strokeDashoffset: 0 }], [7.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }]]);
    },
  },
  // 1. Wizytówka w sieci: wizytówka z kodem -> strona z mapą, adresem, telefonem i godzinami.
  {
    parts: [
      ['panel', R(30, 96, 160, 100, 8)],
      ['barHi', L(46, 118, 110, 118)],
      ['bar', L(46, 134, 96, 134)],
      ['bar', L(46, 172, 120, 172)],
      ['soft', R(132, 112, 42, 42, 3)],
      ['accFill', `${R(138, 118, 10, 10)}${R(158, 118, 10, 10)}${R(138, 138, 10, 10)}${R(154, 134, 6, 6)}${R(164, 144, 6, 6)}`],
      ['dash', L(200, 146, 244, 146)],
      ['acc', AR(248, 146)],
      ...page(258, 24, 186, 252),
      ...N('hd', [['barXL', L(274, 74, 388, 74)], ['bar', L(274, 92, 410, 92)]]),
      { g: 'map', parts: [['soft', R(274, 108, 154, 70, 6)], ['soft', 'M274 150C310 130 350 170 428 138'], ['soft', L(330, 108, 350, 178)]] },
      { g: 'pin', parts: [['acc', C(372, 134, 7)], ['acc', L(372, 141, 372, 154)]] },
      { g: 'r0', parts: [['dot', C(280, 198, 3)], ['bar', L(292, 198, 400, 198)]] },
      { g: 'r1', parts: [['dot', C(280, 216, 3)], ['bar', L(292, 216, 376, 216)]] },
      { g: 'r2', parts: [['dot', C(280, 234, 3)], ['bar', L(292, 234, 412, 234)]] },
      ...N('bt', BTN(274, 250, 70, 16)),
    ],
    live: (
      <>
        <path data-l="scan" className="one-l one-l-guide" d={L(134, 114, 172, 114)} />
        <circle data-l="tap" data-o="c" className="one-l one-l-ring" cx="153" cy="133" r="28" />
        <path data-l="c1" className="one-l one-l-comet" pathLength={1} d="M174 146C214 146 250 134 372 134" />
        <circle data-l="here" data-o="c" className="one-l one-l-ring" cx="372" cy="134" r="14" />
      </>
    ),
    scene: (run) => {
      // kod na wizytówce zostaje zeskanowany, światło biegnie do strony, strona składa się od nowa: nagłówek, mapa,
      // pinezka spada na miejsce, dane kontaktowe po kolei, przycisk
      run('scan', [[0, { opacity: 0, transform: 'translate(0px, 0px)' }], [0.15, { opacity: 1, transform: 'translate(0px, 0px)', easing: IO }], [0.75, { opacity: 1, transform: 'translate(0px, 38px)', easing: IO }], [1.3, { opacity: 1, transform: 'translate(0px, 0px)' }], [1.5, { opacity: 0, transform: 'translate(0px, 0px)' }], [T, { opacity: 0, transform: 'translate(0px, 0px)' }]]);
      run('tap', [[0, { opacity: 0, transform: 'scale(.6)' }], [1.2, { opacity: 0, transform: 'scale(.6)' }], [1.35, { opacity: 0.9, transform: 'scale(.75)', easing: OUT }], [2.2, { opacity: 0, transform: 'scale(1.5)' }], [T, { opacity: 0, transform: 'scale(1.5)' }]]);
      run('c1', comet(1.4, 2.4));
      run('hd', rebuild(2.4, 'translate(0px, 8px)'));
      run('map', rebuild(2.65, 'translate(0px, 8px)'));
      run('pin', [
        [0, { opacity: 1, transform: 'translate(0px, 0px)' }], [0.5, { opacity: 1, transform: 'translate(0px, 0px)' }], [0.95, { opacity: 0, transform: 'translate(0px, 0px)' }],
        [3.2, { opacity: 0, transform: 'translate(0px, -22px)', easing: SPRING }], [3.75, { opacity: 1, transform: 'translate(0px, 0px)' }], [T, { opacity: 1, transform: 'translate(0px, 0px)' }],
      ]);
      run('here', [[0, { opacity: 0, transform: 'scale(.4)' }], [3.6, { opacity: 0, transform: 'scale(.4)' }], [3.75, { opacity: 0.9, transform: 'scale(.6)', easing: OUT }], [4.7, { opacity: 0, transform: 'scale(1.7)' }], [T, { opacity: 0, transform: 'scale(1.7)' }]]);
      for (let k = 0; k < 3; k++) run(`r${k}`, rebuild(4 + k * 0.3, 'translate(-12px, 0px)', 0.6));
      run('bt', rebuild(5, 'translate(0px, 8px)'));
    },
  },
  // 2. Idealne pod mobile: długa strona -> jej wycinek w telefonie, przewijany kciukiem.
  {
    parts: [
      ['panel', R(52, 14, 96, 272, 6)],
      ['soft', L(52, 82, 148, 82)],
      ['soft', L(52, 150, 148, 150)],
      ['soft', L(52, 218, 148, 218)],
      ...[0, 1, 2, 3].flatMap((k): Part[] => [[k === 0 ? 'barHi' : 'bar', L(64, 38 + k * 68, 112 + (k % 2) * 20, 38 + k * 68)], ['bar', L(64, 54 + k * 68, 98 + ((k + 1) % 2) * 18, 54 + k * 68)]]),
      { g: 'view', parts: [['acc', R(44, 10, 112, 76, 6)], ['dash', L(168, 48, 226, 48)], ['acc', AR(230, 48)]] },
      ['panel', R(244, 18, 140, 264, 20)],
      ['soft', L(298, 31, 330, 31)],
      { g: 'feed', clip: 'one-b-clip-phone', parts: feed() },
      ['acc', L(412, 98, 412, 198)],
      ['acc', 'M405.5 190.5L412 199L418.5 190.5'],
    ],
    defs: <clipPath id="one-b-clip-phone"><rect x="250" y="42" width="128" height="232" rx="14" /></clipPath>,
    live: <circle data-l="knob" className="one-b-pulse" cx="412" cy="104" r="4" />,
    scene: (run) => {
      run('view', flicks([0, 68, 136, 204].map((y) => `translate(0px, ${y}px)`)));
      run('feed', flicks([0, 1, 2, 3].map((k) => `translate(0px, ${-k * SCREEN}px)`)));
      run('knob', flicks([0, 29, 58, 88].map((y) => `translate(0px, ${y}px)`)));
    },
  },
  // 3. Szybkość, która oszczędza: szybkościomierz (łuk 240 stopni z podziałką) -> strona wczytana od razu.
  {
    parts: [
      ['panel', R(30, 84, 200, 186, 12)],
      ['ticks', 'M59 227A82 82 0 1 1 201 227'],
      ['track', 'M69.4 221A70 70 0 1 1 190.6 221'],
      ['arc', 'M69.4 221A70 70 0 1 1 199.9 181.6', 'arc'],
      ['main', L(130, 186, 179.9, 182.9), 'needle', '130px 186px'],
      ['dot', C(130, 186, 5)],
      ['soft', C(130, 186, 10)],
      ['barHi', L(104, 238, 156, 238)],
      ['bar', L(114, 252, 146, 252)],
      ['dash', L(238, 150, 258, 150)],
      ['acc', AR(262, 150)],
      ...page(274, 24, 172, 252),
      ['acc', L(274, 49, 446, 49), 'load', 'l'],
      ...N('pb0', [['barXL', L(290, 84, 400, 84)], ['barXL', L(290, 102, 366, 102)]]),
      ...N('pb1', [['bar', L(290, 122, 420, 122)]]),
      ...N('pb2', BTN(290, 136, 66, 20)),
      ...N('pb3', [['soft', R(290, 172, 140, 44, 5)]]),
      ...N('pb4', [['soft', R(290, 228, 88, 14, 4)], ...BTN(386, 228, 44, 14)]),
    ],
    defs: (
      <mask id="one-b-mask-ticks" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="300">
        <path data-l="lit" d="M59 227A82 82 0 1 1 211.8 180.9" pathLength={1} fill="none" stroke="#fff" strokeWidth="18" />
      </mask>
    ),
    live: (
      <>
        <path className="one-l-ticks" d="M59 227A82 82 0 1 1 201 227" pathLength={48} mask="url(#one-b-mask-ticks)" style={{ '--i': 3 } as CSSProperties} />
        <g data-l="done" data-o="c" className="one-l">
          <circle className="one-l-badge" cx="446" cy="24" r="11" />
          <path data-l="donec" className="one-l-check" pathLength={1} d="M440.6 24.3L444.6 28L451.6 20.3" />
        </g>
      </>
    ),
    scene: (run) => {
      const zero = 'rotate(-206.4deg)';
      const sweep: KF[] = [[0, { strokeDashoffset: 0, easing: IO }], [0.9, { strokeDashoffset: 1 }], [1.3, { strokeDashoffset: 1, easing: OUT }], [2.4, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]];
      run('needle', [
        [0, { transform: 'rotate(0deg)', easing: IO }], [0.9, { transform: zero }], [1.3, { transform: zero, easing: 'cubic-bezier(.3, 1.34, .5, 1)' }], [2.5, { transform: 'rotate(0deg)' }],
        [3.3, { transform: 'rotate(0deg)', easing: IO }], [4, { transform: 'rotate(-3deg)', easing: IO }], [4.8, { transform: 'rotate(1.2deg)', easing: IO }], [5.7, { transform: 'rotate(-2deg)', easing: IO }], [6.6, { transform: 'rotate(0deg)' }], [T, { transform: 'rotate(0deg)' }],
      ]);
      run('arc', sweep);
      run('lit', sweep);
      run('load', [[0, { opacity: 1, transform: 'scaleX(1)' }], [0.5, { opacity: 1, transform: 'scaleX(1)' }], [0.9, { opacity: 0, transform: 'scaleX(1)' }], [1.3, { opacity: 1, transform: 'scaleX(0)', easing: OUT }], [1.85, { opacity: 1, transform: 'scaleX(1)' }], [T, { opacity: 1, transform: 'scaleX(1)' }]]);
      for (let k = 0; k < 5; k++) run(`pb${k}`, rebuild(1.75 + k * 0.09, 'translate(0px, 9px)', 0.5));
      run('done', hold(2.45, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [2.7, { strokeDashoffset: 1, easing: OUT }], [3.15, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
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
        key={i++} d={d} className={`one-b-k-${k}`} pathLength={k === 'ticks' ? 48 : FILL_ONLY.includes(k) ? undefined : 1}
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
    <svg ref={ref} className="one-b-svg" viewBox="0 0 480 300" focusable="false" style={{ '--n': i } as CSSProperties}>
      {art.defs && <defs>{art.defs}</defs>}
      {nodes}
      {art.live}
    </svg>
  );
};
