'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// RYSUNKI KART STOSU ze SCENKAMI (wzorzec: one-page/drawings.tsx - kopia silnika, własne rysunki; język rysunków
// Oferty: włosowe ramki, „tekst” jako kreski, akcent w kolorze podstrony). Poziom 2 hierarchii - rysunki pokazują
// STRUKTURĘ (strona z menu i podstronami), scenki mają po kilka zdarzeń na jednej osi czasu.
// Dwie warstwy ruchu:
//   1. RYSOWANIE - linie rysują się razem z przewijaniem (--d na karcie, --i linii; CSS w cards.css),
//   2. SCENKA    - po narysowaniu rysunek ożywa w pętli 8 s (WAAPI, jedna oś czasu na rysunek): pętla zaczyna się
//                  i kończy gotowym rysunkiem, więc wejście i zapętlenie są bez szwu. Ruch tylko przez transform /
//                  opacity / stroke-dashoffset.
//      0 Pełna skalowalność    - trzy moduły (sklep, portal, platforma B2B) stoją obok strony „w planach” (obrys
//                                przerywany); po kolei dosuwają się i wpinają w gniazda strony: obrys staje się ciągły,
//                                błysk na złączu, w menu strony zapala się nowa pozycja; na końcu światło biegnie
//                                ze strony do wszystkich trzech,
//      1 Gotowa na kolejny krok - mapa strony: w pustym miejscu rzędu rysuje się nowa podstrona (ramka od przerywanej
//                                do ciągłej z jasnym punktem na czole linii, treść wpisuje się po kolei), linia od szyny
//                                dociąga się do niej, światło wraca do strony głównej i w menu pojawia się nowa
//                                pozycja; potem to samo z podstroną w drugim rzędzie,
//      2 Architektura pod SEO  - w polu wyszukiwarki wpisuje się zapytanie, od każdej podstrony biegnie światło do
//                                własnego wyniku (wyniki pojawiają się po kolei), kursor wybiera jeden wynik, światło
//                                wraca i jego podstrona się podświetla. Bez liczb i bez „pierwszego miejsca”,
//      3 Wyglądasz na lidera   - ukośna linia światła przechodzi przez okno jak kurtyna: najpierw odsłania stary,
//                                ciasny układ, potem zamienia go w nowy (dwie warstwy przycinane ruchomą maską),
//                                nowy układ dopina elementy kaskadą, znak „gotowe”. Pętla zaczyna i kończy się
//                                NOWYM układem - stary widać tylko na początku scenki.
// Scenka gra tylko, gdy karta jest narysowana, na ekranie i nieprzykryta (setPlay z cards.tsx).
// Bez JS / ograniczony ruch: gotowy rysunek bez ruchu.

/** 'panel' = płytka z obrysem i ciemnym wypełnieniem, 'pad' = samo wypełnienie, 'plan' = płytka z obrysem
    przerywanym (zasłaniają świat za rysunkiem); 'ph' = puste miejsce na podstronę. */
type Kind = 'main' | 'panel' | 'pad' | 'plan' | 'soft' | 'acc' | 'accFill' | 'bar' | 'barS' | 'barHi' | 'barXL' | 'barXXL' | 'barAc' | 'dash' | 'dot' | 'ph' | 'plus';
/** Rodzaje bez „rysowania” kreską (pojawiają się): wypełnienia i linie przerywane. */
const FILL_ONLY: Kind[] = ['accFill', 'dot', 'dash', 'pad', 'plan', 'ph'];
/** [rodzaj, ścieżka, nazwa w scence (data-l), punkt odniesienia przekształceń: 'c' środek, 'l' lewa krawędź albo "x y"] */
type Part = [Kind, string, string?, string?];
/** Grupa animowana jako całość (data-l = g). clip = id maski: sama - maska stoi, grupa rusza się pod nią;
    z sweep - maska jedzie razem z grupą `cw`, a treść stoi w miejscu dzięki przeciwnemu ruchowi `cc` (kurtyna). */
interface Group { g?: string; clip?: string; sweep?: boolean; parts: Part[] }
type KF = [number, Keyframe];
type Run = (name: string, frames: KF[]) => void;
/** fit = przekształcenie całego rysunku (atrybut transform): rysunek 3 jest pomniejszony, żeby zza okna wychodził świat karty,
    rysunek 0 przesunięty w prawo (po wpięciu modułów stoi pośrodku). */
interface Art { parts: (Part | Group)[]; defs?: ReactNode; live?: ReactNode; fit?: string; scene: (run: Run) => void }

/** Długość pętli scenki [s]. */
const T = 8;
const OUT = 'cubic-bezier(.16, 1, .3, 1)';
const IO = 'cubic-bezier(.65, 0, .35, 1)';
const SPRING = 'cubic-bezier(.34, 1.56, .64, 1)';
/** Dosunięcie modułu: spokojny start, pewne domknięcie. */
const DOCK = 'cubic-bezier(.6, 0, .2, 1)';
const HOME = 'translate(0px, 0px)';

const f = (n: number) => +n.toFixed(1);
const R = (x: number, y: number, w: number, h: number, r = 0) =>
  r
    ? `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
    : `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
const L = (x1: number, y1: number, x2: number, y2: number) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
const C = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
const PLUS = (cx: number, cy: number, s = 7) => `${L(cx - s, cy, cx + s, cy)}${L(cx, cy - s, cx, cy + s)}`;
/** Przycisk w kolorze podstrony: wypełnienie + obrys. */
const BTN = (x: number, y: number, w: number, h: number): Part[] => [['accFill', R(x, y, w, h, h / 2)], ['acc', R(x, y, w, h, h / 2)]];
/** Części z nazwą do scenki (i wspólnym punktem odniesienia). */
const N = (name: string, parts: Part[], origin?: string): Part[] => parts.map(([k, d]) => [k, d, name, origin]);

// ── klatki scenek ──
/** Chwila tuż przed a (stan „przed” trzyma się do samego startu - bez powolnego narastania od początku pętli). */
const pre = (a: number) => Math.max(0, a - 0.02);
/** Element bazowy znika na początku pętli i wraca w chwili s (z boku / z dołu) - pętla zaczyna się gotowym rysunkiem. */
const rebuild = (s: number, from: string, dur = 0.55): KF[] => [
  [0, { opacity: 1, transform: HOME }], [0.5, { opacity: 1, transform: HOME }], [0.95, { opacity: 0, transform: HOME }],
  [s, { opacity: 0, transform: from, easing: OUT }], [s + dur, { opacity: 1, transform: HOME }], [T, { opacity: 1, transform: HOME }],
];
/** Kreska bazowa znika na początku pętli i w chwili s „wpisuje się” od lewej. */
const write = (s: number, dur = 0.45, easing = OUT): KF[] => [
  [0, { opacity: 1, transform: 'scaleX(1)' }], [0.5, { opacity: 1, transform: 'scaleX(1)' }], [0.95, { opacity: 0, transform: 'scaleX(1)' }],
  [pre(s), { opacity: 0, transform: 'scaleX(0)' }], [s, { opacity: 1, transform: 'scaleX(0)', easing }], [s + dur, { opacity: 1, transform: 'scaleX(1)' }], [T, { opacity: 1, transform: 'scaleX(1)' }],
];
/** Linia bazowa znika na początku pętli i w chwili s rysuje się od nowa. */
const redraw = (s: number, dur = 0.6): KF[] => [
  [0, { opacity: 1, strokeDashoffset: 0 }], [0.5, { opacity: 1, strokeDashoffset: 0 }], [0.95, { opacity: 0, strokeDashoffset: 0 }],
  [pre(s), { opacity: 0, strokeDashoffset: 1 }], [s, { opacity: 1, strokeDashoffset: 1, easing: IO }], [s + dur, { opacity: 1, strokeDashoffset: 0 }], [T, { opacity: 1, strokeDashoffset: 0 }],
];
/** Płytka bazowa znika na początku pętli i wraca przez przenikanie między a i b. */
const refade = (a: number, b: number): KF[] => [[0, { opacity: 1 }], [0.5, { opacity: 1 }], [0.95, { opacity: 0 }], [a, { opacity: 0 }], [b, { opacity: 1 }], [T, { opacity: 1 }]];
/** Światło biegnące po ścieżce między a i b. */
const comet = (a: number, b: number): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 0.2 }], [pre(a), { opacity: 0, strokeDashoffset: 0.2 }],
  [a, { opacity: 1, strokeDashoffset: 0.2, easing: IO }], [b, { opacity: 1, strokeDashoffset: -1 }],
  [b + 0.05, { opacity: 0, strokeDashoffset: -1 }], [T, { opacity: 0, strokeDashoffset: -1 }],
];
/** Dodatek pojawia się w chwili a (przejście off -> on), zostaje do end i gaśnie przed końcem pętli. */
const hold = (a: number, on: Keyframe, off: Keyframe, dur = 0.5, easing = OUT, end = 7): KF[] => [
  [0, { opacity: 0, ...off }], [pre(a), { opacity: 0, ...off }], [a, { opacity: 1, ...off, easing }], [a + dur, { opacity: 1, ...on }],
  [end, { opacity: 1, ...on }], [end + 0.5, { opacity: 0, ...on }], [T, { opacity: 0, ...on }],
];
/** Dodatek rysuje się kreską między a i b, zostaje do end i gaśnie. */
const draw = (a: number, b: number, end = 7, easing = IO): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 1 }], [pre(a), { opacity: 0, strokeDashoffset: 1 }], [a, { opacity: 1, strokeDashoffset: 1, easing }], [b, { opacity: 1, strokeDashoffset: 0 }],
  [end, { opacity: 1, strokeDashoffset: 0 }], [end + 0.5, { opacity: 0, strokeDashoffset: 0 }], [T, { opacity: 0, strokeDashoffset: 0 }],
];
/** Jasny punkt na czole linii rysowanej między a i b. */
const tip = (a: number, b: number, easing = IO): KF[] => [
  [0, { opacity: 0, strokeDashoffset: 0 }], [pre(a), { opacity: 0, strokeDashoffset: 0 }], [a, { opacity: 1, strokeDashoffset: 0, easing }], [b, { opacity: 1, strokeDashoffset: -1 }],
  [b + 0.2, { opacity: 0, strokeDashoffset: -1 }], [T, { opacity: 0, strokeDashoffset: -1 }],
];
/** Pierścień: pojawia się w chwili a, rośnie i gaśnie. */
const ring = (a: number, from = 0.4, to = 1.7, dur = 0.85): KF[] => [
  [0, { opacity: 0, transform: `scale(${from})` }], [pre(a), { opacity: 0, transform: `scale(${from})` }],
  [a + 0.1, { opacity: 0.9, transform: `scale(${f(from + (to - from) * 0.25)})`, easing: OUT }], [a + dur, { opacity: 0, transform: `scale(${to})` }], [T, { opacity: 0, transform: `scale(${to})` }],
];
/** Błysk: narasta w chwili a do peak, opada do rest (zostaje do 7 s), gaśnie przed końcem pętli. */
const flash = (a: number, peak = 0.9, down = 0.9, rest = 0): KF[] => [
  [0, { opacity: 0 }], [pre(a), { opacity: 0 }], [a + 0.15, { opacity: peak, easing: OUT }], [a + 0.15 + down, { opacity: rest }],
  [Math.max(7, a + 0.15 + down), { opacity: rest }], [Math.max(7.5, a + 0.2 + down), { opacity: 0 }], [T, { opacity: 0 }],
];

// ── rysunek 0: moduły ──
/** Środki trzech gniazd strony i modułów (y). */
const MODS = [84, 150, 216];
/** O tyle moduł dosuwa się do strony (koniec wtyku trafia w gniazdo). */
const DOCK_DX = -56;
const tile = (y: number) => R(340, y - 26, 106, 52, 8);
const ICONS: ((y: number) => Part[])[] = [
  // sklep: koszyk
  (y) => [['acc', `M350 ${y - 8}h4l3.5 12h11l3 -8.5h-15.5`], ['acc', C(359.5, y + 8.5, 1.7)], ['acc', C(367, y + 8.5, 1.7)]],
  // portal: osoba
  (y) => [['acc', C(361, y - 5, 4.2)], ['acc', `M352 ${f(y + 9.5)}A9 9 0 0 1 370 ${f(y + 9.5)}`]],
  // platforma B2B: dwa połączone bloki
  (y) => [['acc', R(351, y - 10, 10, 10, 2.5)], ['acc', R(363, y, 10, 10, 2.5)], ['acc', `M361 ${y - 5}H368V${y}`]],
];

// ── rysunek 3: stary układ (ciasny, drobny, krzywy) - tylko w scence ──
const OLD: Part[] = [
  ['soft', R(54, 54, 372, 18, 2)],
  ...[62, 100, 130, 172, 196, 240, 268, 310, 346, 384].map((x, k): Part => ['barS', L(x, 63, x + [30, 22, 34, 16, 36, 20, 34, 28, 30, 34][k], 63)]),
  ['soft', R(54, 80, 76, 186, 2)],
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k): Part => ['barS', L(62, 93 + k * 13, 62 + [48, 38, 56, 42, 50, 34, 58, 44, 40][k], 93 + k * 13)]),
  ['soft', R(62, 214, 28, 20, 1)], ['soft', R(94, 220, 28, 20, 1)], ['barS', L(62, 250, 118, 250)], ['barS', L(62, 258, 104, 258)],
  ['bar', L(140, 88, 220, 88)],
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k): Part => ['barS', L(140, 101 + k * 9, 140 + [172, 164, 176, 150, 170, 158, 174, 120, 168, 176, 160, 96][k], 101 + k * 9)]),
  ['soft', 'M144 216L196 212L199 254L147 258Z'], ['soft', 'M144 216L199 254M196 212L147 258'],
  ['soft', 'M208 220L262 223L260 259L206 256Z'],
  ['barS', L(270, 222, 314, 222)], ['barS', L(270, 231, 306, 231)], ['barS', L(270, 240, 316, 240)], ['barS', L(270, 249, 298, 249)], ['barS', L(270, 258, 310, 258)],
  ['soft', R(330, 82, 94, 44, 2)], ['soft', `${L(330, 82, 424, 126)}${L(424, 82, 330, 126)}`],
  ['soft', R(336, 134, 84, 36, 2)], ['barS', L(344, 146, 404, 146)], ['barS', L(344, 156, 390, 156)],
  ['soft', R(328, 178, 98, 30, 2)], ['barS', L(336, 189, 412, 189)], ['barS', L(336, 198, 396, 198)],
  ...[0, 1, 2, 3, 4, 5].map((k): Part => ['soft', R(332 + k * 15, 218, 10, 10)]),
  ['barS', L(332, 240, 420, 240)], ['barS', L(332, 249, 406, 249)], ['barS', L(332, 258, 416, 258)],
];
/** Droga kurtyny (px rysunku): przy -SWEEP nowy układ jest cały zasłonięty, przy 0 cały odsłonięty. */
const SWEEP = 426;
/** Element nowego układu „dopina się” w chwili s (stan przed ustawiany, gdy zasłania go stary układ). */
const settle = (s: number, dur = 0.75): KF[] => [
  [0, { opacity: 1, transform: HOME }], [1.42, { opacity: 1, transform: HOME }], [1.46, { opacity: 0, transform: 'translate(0px, 12px)' }],
  [s, { opacity: 0, transform: 'translate(0px, 12px)', easing: OUT }], [s + dur, { opacity: 1, transform: HOME }], [T, { opacity: 1, transform: HOME }],
];

// rysunek 2: podstrony po lewej (y górnej krawędzi), wyniki po prawej (y środka), linie między nimi
const PAGES = [22, 116, 210];
const HITS = [104, 162, 220];
const LINKS = ['M128 56C188 56 188 104 248 104', 'M128 150C188 150 188 162 248 162', 'M128 244C188 244 188 220 248 220'];

const ARTS: Art[] = [
  // 0. Pełna skalowalność: strona firmowa z gniazdami + trzy moduły (sklep, portal, platforma B2B), które się w nią wpinają.
  {
    fit: 'translate(12 0)',
    parts: [
      ['panel', R(28, 44, 214, 212, 10)],
      ['soft', L(28, 66, 242, 66)],
      ['barHi', L(42, 55, 64, 55)],
      ['bar', L(96, 55, 110, 55)], ['bar', L(118, 55, 132, 55)], ['bar', L(140, 55, 154, 55)],
      ['barXL', L(46, 92, 150, 92)],
      ['barXL', L(46, 110, 116, 110)],
      ['bar', L(46, 130, 158, 130)],
      ...BTN(46, 144, 62, 18),
      ['soft', R(176, 104, 48, 60, 6)],
      ['soft', `${L(176, 104, 224, 164)}${L(224, 104, 176, 164)}`],
      ['soft', L(28, 182, 242, 182)],
      ['soft', R(46, 196, 52, 44, 5)], ['bar', L(54, 228, 84, 228)],
      ['soft', R(104, 196, 52, 44, 5)], ['bar', L(112, 228, 142, 228)],
      ['soft', R(162, 196, 52, 44, 5)], ['bar', L(170, 228, 200, 228)],
      ...MODS.flatMap((y): Part[] => [['pad', C(242, y, 6.5)], ['acc', C(242, y, 4.8)]]),
      ...MODS.flatMap((y, k): (Part | Group)[] => [
        ['dash', L(251, y, 291, y), `br${k}`],
        { g: `m${k}`, parts: [['main', L(301, y, 340, y)], ['dot', C(298, y, 3)], ['plan', tile(y)], ...ICONS[k](y), ['barHi', L(384, y - 6, 430, y - 6)], ['bar', L(384, y + 8, 416, y + 8)]] },
      ]),
    ],
    live: (
      <>
        {MODS.map((y, k) => (
          <g key={`m${k}`} data-l={`m${k}`}>
            <path data-l={`t${k}`} className="sf-l sf-l-fill" d={tile(y)} />
            <path data-l={`f${k}`} className="sf-l sf-l-frame" pathLength={1} d={tile(y)} />
          </g>
        ))}
        {MODS.map((y, k) => <circle key={`j${k}`} data-l={`j${k}`} data-o="c" className="sf-l sf-l-ring" cx="242" cy={y} r="11" />)}
        {MODS.map((_, k) => <path key={`n${k}`} data-l={`mn${k}`} data-o="l" className="sf-l sf-l-menu" d={L(166 + k * 22, 55, 180 + k * 22, 55)} />)}
        {MODS.map((y, k) => <path key={`c${k}`} data-l={`c${k}`} className="sf-l sf-l-comet" pathLength={1} d={`M108 153C176 153 196 ${y} 242 ${y}H286`} />)}
      </>
    ),
    scene: (run) => {
      const on = `translate(${DOCK_DX}px, 0px)`;
      MODS.forEach((_, k) => {
        const s = 0.5 + k * 1.45, c = 5.35 + k * 0.14;
        // moduł dosuwa się, przerywany łącznik znika, błysk na złączu, obrys przerywany staje się ciągły, płytka
        // zapala się, w menu strony pojawia się pozycja; pod koniec pętli wszystko wraca do stanu „w planach”
        run(`m${k}`, [[0, { transform: HOME }], [s, { transform: HOME, easing: DOCK }], [s + 0.85, { transform: on }], [7.05, { transform: on, easing: IO }], [7.85, { transform: HOME }], [T, { transform: HOME }]]);
        run(`br${k}`, [[0, { opacity: 1 }], [s + 0.2, { opacity: 1 }], [s + 0.6, { opacity: 0 }], [7.55, { opacity: 0 }], [7.95, { opacity: 1 }], [T, { opacity: 1 }]]);
        run(`j${k}`, ring(s + 0.78));
        run(`f${k}`, draw(s + 0.85, s + 1.6, 7, OUT));
        run(`t${k}`, [
          [0, { opacity: 0 }], [s + 0.83, { opacity: 0 }], [s + 1, { opacity: 0.8, easing: OUT }], [s + 1.9, { opacity: 0.2 }],
          [c + 0.75, { opacity: 0.2 }], [c + 0.9, { opacity: 0.75, easing: OUT }], [6.95, { opacity: 0.2 }], [7, { opacity: 0.2 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }],
        ]);
        run(`mn${k}`, hold(s + 1.05, { transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }, 0.5));
        // na końcu światło biegnie ze strony do wszystkich trzech modułów
        run(`c${k}`, comet(c, c + 0.85));
      });
    },
  },
  // 1. Gotowa na kolejny krok: mapa strony (strona główna, szyna, rząd podstron, drugi rząd) - nowa podstrona
  // powstaje i dołącza do menu, potem kolejna w drugim rzędzie.
  {
    parts: [
      ['panel', R(160, 10, 160, 66, 8)],
      ['soft', L(160, 30, 320, 30)],
      ['barHi', L(172, 20, 192, 20)],
      ['bar', L(212, 20, 224, 20)], ['bar', L(231, 20, 243, 20)], ['bar', L(250, 20, 262, 20)],
      ['bar', L(269, 20, 281, 20), 'n1m', 'l'],
      ['bar', L(288, 20, 300, 20), 'n2m', 'l'],
      ['barXL', L(174, 46, 246, 46)],
      ['bar', L(174, 61, 226, 61)],
      ...BTN(264, 48, 42, 16),
      ['main', L(240, 76, 240, 96)],
      ['soft', L(70, 96, 297, 96)],
      ['soft', L(70, 96, 70, 110)], ['soft', L(183, 96, 183, 110)], ['soft', L(297, 96, 297, 110)],
      // rząd 1: trzy gotowe podstrony
      ['panel', R(24, 110, 92, 62, 7)],
      ['barHi', L(34, 124, 68, 124)],
      ['soft', R(34, 135, 22, 27, 3)], ['soft', R(60, 135, 22, 27, 3)], ['soft', R(86, 135, 22, 27, 3)],
      ['panel', R(137, 110, 92, 62, 7)],
      ['barHi', L(147, 124, 183, 124)],
      ['bar', L(147, 138, 217, 138)], ['bar', L(147, 149, 205, 149)], ['bar', L(147, 160, 211, 160)],
      ['panel', R(251, 110, 92, 62, 7)],
      ['barHi', L(261, 124, 291, 124)],
      ['soft', R(261, 134, 30, 28, 3)],
      ['bar', L(299, 140, 333, 140)], ['bar', L(299, 151, 325, 151)],
      // rząd 1: nowa podstrona (w scence powstaje od zera)
      ['soft', 'M297 96H410V110', 'n1r'],
      ['panel', R(364, 110, 92, 62, 7), 'n1f'],
      ['barHi', L(374, 124, 410, 124), 'n1a', 'l'],
      ['bar', L(374, 137, 444, 137), 'n1b', 'l'],
      ['bar', L(374, 147, 430, 147), 'n1c', 'l'],
      ...N('n1d', BTN(374, 155, 32, 10), 'l'),
      // rząd 2: gotowa podstrona pod drugą, nowa pod trzecią, puste miejsce pod czwartą
      ['soft', L(183, 172, 183, 206)],
      ['panel', R(137, 206, 92, 62, 7)],
      ['barHi', L(147, 220, 179, 220)],
      ['bar', L(147, 234, 215, 234)], ['bar', L(147, 245, 199, 245)], ['bar', L(147, 256, 207, 256)],
      ['soft', L(297, 172, 297, 206), 'n2r'],
      ['panel', R(251, 206, 92, 62, 7), 'n2f'],
      ['barHi', L(261, 220, 297, 220), 'n2a', 'l'],
      ['bar', L(261, 234, 331, 234), 'n2b', 'l'],
      ['bar', L(261, 245, 315, 245), 'n2c', 'l'],
      ['bar', L(261, 256, 323, 256), 'n2d', 'l'],
      ['dash', L(410, 172, 410, 206)],
      ['ph', R(364, 206, 92, 62, 7)],
      ['plus', PLUS(410, 237)],
    ],
    live: (
      <>
        <g data-l="ph1" className="sf-l sf-l-ph"><path d={R(364, 110, 92, 62, 7)} /><path className="sf-l-plus" d={PLUS(410, 141)} /></g>
        <g data-l="ph2" className="sf-l sf-l-ph"><path d={R(251, 206, 92, 62, 7)} /><path className="sf-l-plus" d={PLUS(297, 237)} /></g>
        <path data-l="a1" className="sf-l sf-l-accframe" pathLength={1} d={R(364, 110, 92, 62, 7)} />
        <path data-l="a1t" className="sf-l sf-l-tip" pathLength={1} d={R(364, 110, 92, 62, 7)} />
        <path data-l="a2" className="sf-l sf-l-accframe" pathLength={1} d={R(251, 206, 92, 62, 7)} />
        <path data-l="a2t" className="sf-l sf-l-tip" pathLength={1} d={R(251, 206, 92, 62, 7)} />
        <circle data-l="j1" data-o="c" className="sf-l sf-l-ring" cx="410" cy="110" r="9" />
        <circle data-l="j2" data-o="c" className="sf-l sf-l-ring" cx="297" cy="206" r="9" />
        <path data-l="k1" className="sf-l sf-l-comet" pathLength={1} d="M410 110V96H240V76" />
        <path data-l="k2" className="sf-l sf-l-comet" pathLength={1} d="M297 206V172" />
        <path data-l="p2x" className="sf-l sf-l-accframe" d={R(251, 110, 92, 62, 7)} />
        <path data-l="k2b" className="sf-l sf-l-comet" pathLength={1} d="M297 110V96H240V76" />
        <path data-l="m1x" data-o="l" className="sf-l sf-l-menu" d={L(269, 20, 281, 20)} />
        <path data-l="m2x" data-o="l" className="sf-l sf-l-menu" d={L(288, 20, 300, 20)} />
      </>
    ),
    scene: (run) => {
      const menu = (a: number, end: number): KF[] => [
        [0, { opacity: 0, transform: 'scaleX(0)' }], [pre(a), { opacity: 0, transform: 'scaleX(0)' }], [a, { opacity: 1, transform: 'scaleX(0)', easing: OUT }],
        [a + 0.4, { opacity: 1, transform: 'scaleX(1)' }], [end, { opacity: 1, transform: 'scaleX(1)' }], [end + 0.45, { opacity: 0, transform: 'scaleX(1)' }], [T, { opacity: 0, transform: 'scaleX(1)' }],
      ];
      // puste miejsca (ramki przerywane ze znakiem plus) w miejscu obu nowych podstron
      run('ph1', [[0, { opacity: 0 }], [0.75, { opacity: 0 }], [1.15, { opacity: 1 }], [1.5, { opacity: 1 }], [2.1, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('ph2', [[0, { opacity: 0 }], [0.75, { opacity: 0 }], [1.15, { opacity: 1 }], [4.5, { opacity: 1 }], [5.1, { opacity: 0 }], [T, { opacity: 0 }]]);
      // nowa podstrona w rzędzie: ramka, wypełnienie, treść po kolei, linia od szyny, światło do strony głównej, menu
      run('a1', draw(1.4, 2.5, 3.5));
      run('a1t', tip(1.4, 2.5));
      run('n1f', refade(2.3, 2.8));
      ['n1a', 'n1b', 'n1c', 'n1d'].forEach((n, k) => run(n, write(2.6 + k * 0.2)));
      run('n1r', redraw(3, 0.55));
      run('j1', ring(3.5));
      run('k1', comet(3.65, 4.4));
      run('n1m', write(4.35, 0.4));
      run('m1x', menu(4.35, 5.5));
      // to samo w drugim rzędzie: podstrona pod podstroną
      run('a2', draw(4.4, 5.3, 6.2));
      run('a2t', tip(4.4, 5.3));
      run('n2f', refade(5.1, 5.55));
      ['n2a', 'n2b', 'n2c', 'n2d'].forEach((n, k) => run(n, write(5.3 + k * 0.15, 0.4)));
      run('n2r', redraw(5.55, 0.4));
      run('j2', ring(5.9, 0.4, 1.7, 0.7));
      run('k2', comet(5.95, 6.25));
      run('p2x', flash(6.15, 0.95, 0.6));
      run('k2b', comet(6.25, 6.8));
      run('n2m', write(6.75, 0.4));
      run('m2x', menu(6.75, 7.2));
    },
  },
  // 2. Architektura pod SEO: trzy podstrony po lewej, okno wyszukiwarki z listą wyników po prawej - każda podstrona
  // ma własny wynik.
  {
    parts: [
      ...PAGES.flatMap((y0, k): Part[] => [
        ['panel', R(24, y0, 104, 68, 7)],
        ['barHi', L(36, y0 + 16, 72 + k * 6, y0 + 16)],
        ...(k === 1
          ? ([['soft', R(36, y0 + 27, 24, 30, 3)], ['bar', L(68, y0 + 33, 116, y0 + 33)], ['bar', L(68, y0 + 44, 104, y0 + 44)], ['bar', L(68, y0 + 55, 110, y0 + 55)]] as Part[])
          : ([['bar', L(36, y0 + 31, 116, y0 + 31)], ['bar', L(36, y0 + 42, 102, y0 + 42)], ...(k === 0 ? BTN(36, y0 + 50, 28, 9) : ([['bar', L(36, y0 + 53, 110, y0 + 53)]] as Part[]))] as Part[])),
      ]),
      ...LINKS.map((d): Part => ['dash', d]),
      ['panel', R(248, 18, 208, 264, 10)],
      ['soft', R(262, 32, 180, 26, 13)],
      ['acc', C(278, 44.5, 5)],
      ['acc', L(281.8, 48.3, 285.6, 52.1)],
      ['barHi', L(296, 45, 372, 45), 'q', 'l'],
      ['soft', L(248, 72, 456, 72)],
      ['soft', L(262, 133, 442, 133)],
      ['soft', L(262, 191, 442, 191)],
      ...HITS.map((y, k): Group => ({
        g: `r${k}`,
        parts: [['dot', C(267, y - 13, 3)], ['bar', L(277, y - 13, 334 - k * 8, y - 13)], ['barAc', L(264, y + 1, 400 - k * 22, y + 1)], ['bar', L(264, y + 14, 428, y + 14)]],
      })),
    ],
    live: (
      <>
        <path data-l="caret" className="sf-l sf-l-guide" d={L(378, 38, 378, 52)} />
        <circle data-l="go" data-o="c" className="sf-l sf-l-ring" cx="278" cy="44.5" r="11" />
        {PAGES.map((y0, k) => <path key={`e${k}`} data-l={`e${k}`} className="sf-l sf-l-accframe" d={R(24, y0, 104, 68, 7)} />)}
        {LINKS.map((d, k) => <path key={`c${k}`} data-l={`c${k}`} className="sf-l sf-l-comet" pathLength={1} d={`${d}H262`} />)}
        <path data-l="pick" className="sf-l sf-l-fill" d={R(255, 137, 194, 50, 7)} />
        <path data-l="back" className="sf-l sf-l-comet" pathLength={1} d="M248 162C188 162 188 150 128 150" />
        <path data-l="sel" className="sf-l sf-l-fill" d={R(24, 116, 104, 68, 7)} />
        <path data-l="selb" className="sf-l sf-l-accframe" d={R(24, 116, 104, 68, 7)} />
        <circle data-l="tap" data-o="c" className="sf-l sf-l-ring" cx="398" cy="168" r="12" />
        <path data-l="cur" className="sf-l sf-l-cursor" d="M398 168v14.5l3.9 -3.5l3.1 6.4l2.5 -1.2l-3 -6.2l5.1 -0.2z" />
      </>
    ),
    scene: (run) => {
      // zapytanie wpisuje się w pole (kreska rośnie, kursor tekstu jedzie na jej końcu), wyszukiwarka rusza
      run('q', write(1.1, 1, IO));
      run('caret', [
        [0, { opacity: 0, transform: 'translate(-80px, 0px)' }], [1.08, { opacity: 0, transform: 'translate(-80px, 0px)' }], [1.1, { opacity: 1, transform: 'translate(-80px, 0px)', easing: IO }],
        [2.1, { opacity: 1, transform: HOME }], [2.3, { opacity: 0, transform: HOME }], [T, { opacity: 0, transform: HOME }],
      ]);
      run('go', ring(2.15, 0.4, 1.6, 0.8));
      // od każdej podstrony światło biegnie do własnego wyniku; wyniki pojawiają się po kolei
      HITS.forEach((_, k) => {
        const s = 2.35 + k * 0.5;
        run(`e${k}`, flash(s - 0.15, 0.95, 1.1));
        run(`c${k}`, comet(s, s + 0.75));
        run(`r${k}`, rebuild(s + 0.62, 'translate(-10px, 0px)', 0.55));
      });
      // klient wybiera jeden z wyników: kursor, kliknięcie, podświetlenie wyniku, światło wraca do jego podstrony
      run('cur', hold(4.6, { transform: HOME }, { transform: 'translate(26px, 42px)' }, 0.75, IO, 6.8));
      run('tap', ring(5.4, 0.3, 1.5, 0.8));
      run('pick', [[0, { opacity: 0 }], [5.4, { opacity: 0 }], [5.6, { opacity: 0.42, easing: OUT }], [7, { opacity: 0.3 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('back', comet(5.7, 6.4));
      run('sel', [[0, { opacity: 0 }], [6.3, { opacity: 0 }], [6.5, { opacity: 0.5, easing: OUT }], [7, { opacity: 0.26 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('selb', [[0, { opacity: 0 }], [6.3, { opacity: 0 }], [6.5, { opacity: 1 }], [7, { opacity: 1 }], [7.5, { opacity: 0 }], [T, { opacity: 0 }]]);
    },
  },
  // 3. Wyglądasz na lidera: jedno okno strony - nowy, czysty układ (duży nagłówek, jeden przycisk, duże zdjęcie);
  // w scence kurtyna światła pokazuje stary, ciasny układ i zamienia go w nowy.
  {
    fit: 'translate(28.8 18) scale(.88)',
    parts: [
      ['panel', R(40, 22, 400, 256, 12)],
      ['soft', L(40, 46, 440, 46)],
      ['soft', C(56, 34, 2.6)], ['soft', C(66, 34, 2.6)], ['soft', C(76, 34, 2.6)],
      ['soft', R(170, 28, 140, 12, 6)],
      {
        clip: 'sf-b-clip-new', sweep: true,
        parts: [
          ['barHi', L(64, 66, 92, 66)],
          ['bar', L(330, 66, 350, 66)], ['bar', L(362, 66, 382, 66)], ['bar', L(394, 66, 416, 66)],
          ['barXXL', L(67, 110, 226, 110), 'nh1'],
          ['barXXL', L(67, 134, 180, 134), 'nh2'],
          ...N('ns', [['bar', L(63, 160, 224, 160)], ['bar', L(63, 172, 196, 172)]]),
          ...N('nb', BTN(62, 190, 88, 26)),
          ...N('ni', [['main', R(272, 88, 144, 128, 10)], ['soft', 'M272 190L312 152L338 176L362 154L416 198'], ['soft', C(384, 120, 10)]]),
          ['soft', L(62, 234, 418, 234)],
          ...[0, 1, 2].flatMap((k): Part[] => N(`nc${k}`, [['dot', C(66 + k * 124, 254, 3)], ['bar', L(78 + k * 124, 254, 150 + k * 124, 254)]])),
        ],
      },
    ],
    defs: (
      <>
        <clipPath id="sf-b-clip-new"><path d="M-80 0H464L440 300H-80Z" /></clipPath>
        <clipPath id="sf-b-clip-old"><path d="M464 0H1100V300H440Z" /></clipPath>
        <clipPath id="sf-b-clip-win"><path d={R(40, 22, 400, 256, 12)} /></clipPath>
      </>
    ),
    live: (
      <>
        <g data-l="cw" clipPath="url(#sf-b-clip-old)">
          <g data-l="cc">
            <g data-l="old" className="sf-l">{OLD.map(([k, d], i) => <path key={i} className={`sf-b-k-${k}`} d={d} />)}</g>
          </g>
        </g>
        <g clipPath="url(#sf-b-clip-win)">
          <g data-l="cw">
            <path data-l="beam" className="sf-l sf-l-beam2" d="M469.1 24L448.9 276" />
            <path data-l="beam" className="sf-l sf-l-beam" d="M462.1 24L441.9 276" />
          </g>
        </g>
        <path data-l="nbx" className="sf-l sf-l-fill" d={R(62, 190, 88, 26, 13)} />
        <g data-l="done" data-o="c" className="sf-l">
          <circle className="sf-l-badge" cx="440" cy="22" r="11" />
          <path data-l="donec" className="sf-l-check" pathLength={1} d="M434.6 22.3L438.6 26L445.6 18.3" />
        </g>
      </>
    ),
    scene: (run) => {
      const shut = `translate(${-SWEEP}px, 0px)`, back = `translate(${SWEEP}px, 0px)`;
      // kurtyna: szybko w lewo (nowy układ znika pod starym), chwila na stary układ, powoli w prawo (stary -> nowy);
      // `cc` jedzie odwrotnie, więc treść obu warstw stoi w miejscu, rusza się tylko granica
      const sweep = (a: string, b: string): KF[] => [[0, { transform: a }], [0.5, { transform: a, easing: IO }], [1.4, { transform: b }], [2.4, { transform: b, easing: DOCK }], [4.5, { transform: a }], [T, { transform: a }]];
      run('cw', sweep(HOME, shut));
      run('cc', sweep(HOME, back));
      run('old', [[0, { opacity: 0 }], [0.44, { opacity: 0 }], [0.5, { opacity: 1 }], [4.5, { opacity: 1 }], [4.56, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('beam', [[0, { opacity: 0 }], [0.4, { opacity: 0 }], [0.6, { opacity: 1 }], [1.25, { opacity: 1 }], [1.4, { opacity: 0 }], [2.4, { opacity: 0 }], [2.55, { opacity: 1 }], [4.35, { opacity: 1 }], [4.55, { opacity: 0 }], [T, { opacity: 0 }]]);
      // nowy układ dopina elementy kaskadą, w miarę jak kurtyna je odsłania
      run('nh1', settle(3.1));
      run('nh2', settle(3.24));
      run('ns', settle(3.38));
      run('nb', settle(3.52));
      run('ni', settle(3.85));
      [2.95, 3.45, 3.9].forEach((s, k) => run(`nc${k}`, settle(s, 0.65)));
      run('nbx', [[0, { opacity: 0 }], [4.95, { opacity: 0 }], [5.2, { opacity: 0.75, easing: OUT }], [6.3, { opacity: 0 }], [T, { opacity: 0 }]]);
      run('done', hold(4.7, { transform: 'scale(1)' }, { transform: 'scale(0)' }, 0.5, SPRING));
      run('donec', [[0, { strokeDashoffset: 1 }], [4.95, { strokeDashoffset: 1, easing: OUT }], [5.4, { strokeDashoffset: 0 }], [T, { strokeDashoffset: 0 }]]);
    },
  },
];

/** Włączanie / zatrzymywanie scenki z zewnątrz (cards.tsx: karta narysowana, na ekranie, nieprzykryta). */
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
        const keys = frames.map(([t, k]) => ({ offset: Math.min(1, Math.max(0, t / T)), ...k }));
        svg.querySelectorAll(`[data-l="${name}"]`).forEach((el) => {
          try { anims.push(el.animate(keys, { duration: T * 1000, iterations: Infinity })); } catch (e) { console.warn('strona-firmowa drawings: scenka', index, name, e); }
        });
      });
    };
    PLAYERS.set(svg, (on) => {
      if (on && !anims.length) build();
      else if (!on && anims.length) { anims.forEach((a) => a.cancel()); anims = []; }
    });
    return () => { PLAYERS.delete(svg); anims.forEach((a) => a.cancel()); anims = []; };
  }, [art, index, reduced]);

  let i = 0;
  const part = ([k, d, name, origin]: Part) => {
    const style = { '--i': i } as CSSProperties;
    if (origin && origin !== 'c' && origin !== 'l') style.transformOrigin = origin;
    return (
      <path
        key={i++} d={d} className={`sf-b-k-${k}`} pathLength={FILL_ONLY.includes(k) ? undefined : 1}
        data-l={name} data-o={origin === 'c' || origin === 'l' ? origin : undefined} style={style}
      />
    );
  };
  const nodes = art.parts.map((n, idx) => {
    if (!isGroup(n)) return part(n);
    const inner = <g key={`g${idx}`} data-l={n.g}>{n.parts.map(part)}</g>;
    if (n.clip && n.sweep) return <g key={`c${idx}`} data-l="cw" clipPath={`url(#${n.clip})`}><g data-l="cc">{inner}</g></g>;
    return n.clip ? <g key={`c${idx}`} clipPath={`url(#${n.clip})`}>{inner}</g> : inner;
  });
  return (
    <svg ref={ref} className="sf-b-svg" viewBox="0 0 480 300" focusable="false" style={{ '--n': i } as CSSProperties}>
      {art.defs && <defs>{art.defs}</defs>}
      {art.fit ? <g transform={art.fit}>{nodes}{art.live}</g> : <>{nodes}{art.live}</>}
    </svg>
  );
};
