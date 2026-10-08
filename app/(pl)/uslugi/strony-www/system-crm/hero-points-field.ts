// PŁÓTNO sceny głównej „Z punktów” (hero-points.tsx) - sam rysunek na canvas 2D, bez Reacta i bez WebGL.
// Scena wybrana przez właściciela 2026-10-04. Od 2026-10-05 okno pojawia się „rozejściem” (decyzja właściciela dla
// całej podstrony: żadnych lecących linii światła, kurtyn i przycięć prostą krawędzią - NIE wracać).
// Motyw ze strony głównej Avenly (logotyp zbiera się z cząstek, usługi są konstelacją na niebie): tu punkty-gwiazdy
// to dane firmy, które zbierają się w układ systemu.
//   ŚWIAT   punkty żyją w przestrzeni przed kamerą; rzut perspektywiczny liczy ten moduł (`proj`). Płaszczyzna
//           z = 0 to gotowe okno systemu w układzie sceny - przy kamerze „na wprost” (koniec sceny) rzut jest
//           tożsamością, więc cele z pomiaru DOM trafiają co do piksela w kropki wierszy i narożniki kart.
//   KAMERA  `far` = cofnięcie (najazd = far maleje; bliskie punkty rosną i uciekają za krawędzie ekranu szybciej
//           niż dalekie), `lift` = środek rzutu wraca spod nagłówka na środek okna (bardzo wolno, przez cały najazd
//           i zbieranie), `tilt` = pochylenie PŁASZCZYZNY UKŁADU: obracają się tylko cele punktów, chmura nie.
//   PUNKTY  trzy role: układ (lecą na obrysy okna, kart, kafli i na linie wierszy / kolumn), znaczniki (gwiazdki
//           w kolorze podstrony - lądują na kropkach wierszy, inicjałach i terminach) i tło (dalekie gwiazdy, które
//           zostają wokół okna). Lot = start -> cel, każdy punkt we własnym oknie czasu (start `st`, czas `du`).
//   LINIE   włosowe linie rosną wzdłuż krawędzi tuż za lądującymi punktami i wchodzą z przezroczystości (łamane
//           przez cele - obracane i rzutowane tak samo jak punkty, więc pochylają się razem z płaszczyzną).
//   ROZEJŚCIE  prawdziwe okno DOM odsłania się kilkoma mniejszymi kłębami gazu, które pojawiają się od lewej do
//           prawej, rosną i zlewają się (klasa .cr-bloom, reguły w generowanym bloom.css, postęp `bloom`; właściciel
//           2026-10-05: „fluid, nieregularny, nie cały element, tylko kilka mniejszych”). Układ z punktów i linii
//           gaśnie pod nimi dopełnieniem tej samej maski (`veil`: ta sama lista warstw - bloom-layers.ts - i te same
//           tekstury, odczytane przez scenę ze zmiennych CSS i podane przez `setMask`).
// RUCH (2026-10-05, właściciel: „jak się scrolluje i gwiazdy się tak przesuwają (…) zrób bardziej premium i ładniej,
// bo tak clanky jest strasznie”). Co dawało szarpanie i czym jest zastąpione - NIE wracać:
//   - scena była przyspawana do przewijania (każdy skok kółka = skok gwiazd, potem martwy bezruch) -> BEZWŁADNOŚĆ:
//     płótno ma własną pętlę klatek i dochodzi do celu przewijania krytycznie tłumioną sprężyną (INERTIA_MS); z tego
//     samego wygładzonego postępu scena pisze też DOM (`onBeat`), więc punkty nie rozjeżdżają się z oknem,
//   - pochylenie obracało całą chmurę wokół środka okna: bliskie gwiazdy leciały setki px w górę, dalekie w dół,
//     a środek rzutu przesuwał wszystko naraz jak płytę -> obraca się tylko płaszczyzna układu, środek rzutu wraca
//     bardzo wolno (`lift`), kamera jedzie zazębionymi odcinkami bez zatrzymań do zera (`beat`),
//   - punkty ruszały i lądowały falami w jednakowym tempie -> własny czas lotu każdego punktu (bliższe szybciej),
//     miękki start, długie wyhamowanie (LAND), spokojniejsze łuki,
//   - jasność skakała w 8 stopniach, linie pojawiały się od razu w pełnym kryciu -> 32 stopnie, linie wchodzą płynnie,
//   - w spoczynku obraz był zamrożony -> ŻYCIE: wolne kołysanie kamery i mruganie gwiazd (IDLE_FPS), tylko gdy scena
//     jest na ekranie i zanim okno się rozejdzie.
// TELEFON (2026-10-05, właściciel: „dostosuj całą podstronę do urządzeń mobilnych”): 560 punktów zamiast 1400, chmura
// ciaśniej w kadrze i odrobinę jaśniejsza (PHONE_GAIN), płótno w DPR do 2 z budżetem 2,2 mln px, krótsza bezwładność
// (INERTIA_MS_TOUCH - przewijanie idzie wprost za palcem) i 24 klatki w spoczynku (IDLE_FPS_TOUCH). Płótno nie łapie
// dotyku. Na ekranie za niskim na scenę płótna w ogóle nie ma (hero-points.tsx, PIN_MIN_H).
// Losowość ze stałego ziarna - ten sam układ po przeliczeniu. W pętli klatek nie ma żadnych odczytów układu strony.

import { BLOOM_LAYERS, BLOOM_LAYERS_SMALL } from './bloom-layers';

export interface FieldRect { x: number; y: number; w: number; h: number }
/** Prostokąt z zaokrągleniem: punkty i linia po obrysie. `g` = grupa (kolejność zbierania, indeks w GROUP). */
export interface FieldBox extends FieldRect { r: number; g: number }
/** Odcinek: punkty i linia od (x1, y1) do (x2, y2). `acc` = linia w kolorze podstrony. */
export interface FieldSeg { x1: number; y1: number; x2: number; y2: number; g: number; acc: boolean }
/** Znacznik: gwiazdka ląduje jako kropka o promieniu `r`. */
export interface FieldDot { x: number; y: number; r: number; g: number }

export interface FieldLayout {
  /** Rozmiar sceny (px CSS). */
  W: number; H: number;
  /** Okno systemu w układzie sceny, bez przekształceń (stan końcowy). */
  win: FieldRect;
  /** Dolna krawędź nagłówka na pierwszym ekranie - chmura startuje pod nią (tekst stoi na czystym tle). */
  head: number;
  boxes: FieldBox[]; segs: FieldSeg[]; dots: FieldDot[];
  phone: boolean; coarse: boolean;
  /** Kolor podstrony (r, g, b). */
  accent: [number, number, number];
}

/** Stan sceny dla postępu - wspólny dla płótna i DOM (okno, rozejście, narrator). */
export interface Beat {
  /** Najazd kamery: nagłówek odjeżdża (0-1). */
  cam: number;
  /** Środek rzutu wraca spod nagłówka na środek okna (0-1). */
  lift: number;
  /** Cofnięcie kamery: 1 = pierwszy ekran, 0 = na wprost okna. */
  far: number;
  /** Pochylenie płaszczyzny układu (0-1). */
  tilt: number;
  /** Zbieranie punktów w układ (0-1). */
  gather: number;
  /** Skala okna DOM = rzut płaszczyzny przy bieżącym cofnięciu. */
  s: number;
  /** Rozejście okna (--bloom, 0-1): wolny start i koniec. */
  bloom: number;
  /** Finał: terminy na kartach (0-1). */
  fin: number;
}

export interface Field {
  setLayout(layout: FieldLayout): void;
  /** Tekstury „rozejścia” (kanał alfa kłębów maski .cr-bloom, każda n × n, w kolejności BLOOM_TEXTURES) - bez nich
      układ gaśnie równym, miękkim czołem od lewej. */
  setMask(maps: Uint8Array[], n: number): void;
  /** Nowy cel postępu przewijania (0-1). Scena dochodzi do niego z bezwładnością; `snap` = od razu. */
  seek(p: number, snap?: boolean): void;
  /** Przerysowuje bieżący stan (po pomiarze układu, po wczytaniu tekstur). */
  refresh(): void;
  /** Wejście: chmura rodzi się od środka i kamera dojeżdża do pierwszego ujęcia (raz). */
  intro(): void;
  setVisible(v: boolean): void;
  destroy(): void;
}

// ── STROJENIE RUCHU ──────────────────────────────────────────────────────────────────────────────────────────
/** BEZWŁADNOŚĆ: po tylu ms scena jest w 63% drogi do nowego celu przewijania (sprężyna krytycznie tłumiona:
    miękki start, miękkie dojście, bez przestrzelenia). Mniej = sztywniej przy kółku, więcej = bardziej „pływa”.
    Na dotyku krócej: przewijanie idzie tam wprost za palcem (bez Lenisa), więc dłuższa stała wyglądałaby jak
    spóźnienie za palcem - zostaje tylko tyle, żeby wygładzić start i zatrzymanie. */
const INERTIA_MS = 210, INERTIA_MS_TOUCH = 120;
/** LOT: bazowy czas lotu punktu w jednostkach zbierania (0-1) i jego mnożnik od głębi (najbliższy … najdalszy
    punkt chmury - bliższe dolatują szybciej). */
const FLY = 0.45, FLY_NEAR = 0.8, FLY_FAR = 1.25;
/** Lądowanie: im więcej, tym dłuższe i łagodniejsze wyhamowanie przed celem (1 = równe tempo startu i końca). */
const LAND = 2.2;
/** Po tylu jednostkach zbierania od startu krawędzi lądują jej pierwsze punkty; EDGE = czas, w którym lądowania
    i linia przechodzą wzdłuż całej krawędzi. */
const ARRIVE = 0.5, EDGE = 0.1;
/** Początek zbierania grup: 0 kolumny tablicy, 1 wiersze list, 2 kafle kalendarza, 3 karty, 4 okno i paski
    (małe odstępy + rozrzut krawędzi = grupy mocno zachodzą na siebie). */
const GROUP = [0, 0.07, 0.14, 0.21, 0.28];
/** Łuk lotu: wychylenie w bok w ułamkach drogi punktu (od … do). */
const ARC_MIN = 0.05, ARC_MAX = 0.15;
/** ŻYCIE W SPOCZYNKU: klatki na sekundę (na dotyku mniej - obok pracuje mgławica tła, a ruch jest bardzo wolny),
    amplituda mrugania (ułamek jasności) i jego tempo (rad/s, od … do), kołysanie kamery (rad) i jego tempo (rad/s)
    w pionie i poziomie. */
const IDLE_FPS = 30, IDLE_FPS_TOUCH = 24;
const TWINKLE = 0.2, TWINKLE_MIN = 0.45, TWINKLE_MAX = 1.3;
const SWAY_X = 0.008, SWAY_Y = 0.012, SWAY_SPEED_X = 0.23, SWAY_SPEED_Y = 0.17;
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Cofnięcie kamery na pierwszym ekranie (w odległościach perspektywy). */
const FAR = 0.55;
const TILT_X = 0.38, TILT_Y = -0.18;
const INTRO_MS = 2600;
/** Stopnie jasności punktów i krycia linii (dużo - zmiana ma być niewidoczna jako skok). */
const LEVELS = 32, LINE_LEVELS = 20;
const TAU = Math.PI * 2;
const WHITE: [number, number, number] = [248, 250, 252];
/** Skupiska chmury: środek w ułamkach szerokości sceny i wysokości pasa chmury („każda rzecz leży gdzie indziej”). */
const PILES = [[0.1, 0.6], [0.3, 0.32], [0.53, 0.66], [0.73, 0.28], [0.92, 0.58]];
const PILES_PHONE = [[0.2, 0.24], [0.8, 0.16], [0.5, 0.5], [0.14, 0.78], [0.86, 0.7]];
/** Telefon: mnożnik rozmiaru i jasności punktów chmury (1 = jak na komputerze). */
const PHONE_GAIN = 1.14;
/** Liczba warstw maski „rozejścia” (lista w generowanym bloom-layers.ts - ta sama, z której liczy się CSS). */
const LN = Math.max(BLOOM_LAYERS.length, BLOOM_LAYERS_SMALL.length);

const c01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ln = (p: number, a: number, b: number) => c01((p - a) / (b - a));
const sm = (p: number, a: number, b: number) => { const x = ln(p, a, b); return x * x * (3 - 2 * x); };
/** Jak `sm`, ale jeszcze łagodniej rusza i staje (zerowe przyspieszenie na końcach) - dla kamery. */
const sm5 = (p: number, a: number, b: number) => { const x = ln(p, a, b); return x * x * x * (x * (x * 6 - 15) + 10); };

/** Oś sceny (p = postęp 0-1, już wygładzony bezwładnością). Odcinki kamery zachodzą na siebie - kamera zwalnia
    przy 0,26 (chmura) i 0,60 (układ), ale nie staje; stoi dopiero od 0,92.
      0,015-0,20  nagłówek odjeżdża
      0,01-0,62   najazd kamery (dwa zazębione odcinki), środek rzutu wraca na środek okna (0,02-0,58)
      0,16-0,60   punkty zbierają się w układ (ruszają jeszcze w czasie najazdu), za nimi rosną linie
      0,32-0,61   płaszczyzna układu prostuje się na wprost kamery
      0,64-0,84   okno systemu rozchodzi się, punkty i linie gasną pod nim
      0,84-0,95   na kartach pojawiają się terminy; kamera dojeżdża do skali 1 przy 0,92 */
export const beat = (p: number): Beat => {
  const far = Math.max(0, 1 - (0.46 * sm5(p, 0.01, 0.3) + 0.44 * sm5(p, 0.2, 0.62) + 0.1 * sm5(p, 0.56, 0.92)));
  return {
    cam: sm(p, 0.015, 0.2),
    lift: sm5(p, 0.02, 0.58),
    far,
    tilt: 1 - sm5(p, 0.32, 0.61),
    gather: ln(p, 0.16, 0.6),
    s: 1 / (1 + FAR * far),
    bloom: sm(p, 0.64, 0.84),
    fin: ln(p, 0.84, 0.95),
  };
};

interface Edge { v: Float32Array; closed: boolean; t0: number; acc: boolean }

/** Losowość ze stałego ziarna (mulberry32). */
const prng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Obrys zaokrąglonego prostokąta jako łamana zamknięta (zgodnie z ruchem wskazówek, od lewego górnego rogu). */
const outline = (b: FieldBox, step: number): number[] => {
  const r = Math.max(0, Math.min(b.r, b.w / 2, b.h / 2));
  const v: number[] = [];
  const side = (x1: number, y1: number, x2: number, y2: number) => {
    const m = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / step));
    for (let i = 0; i < m; i++) v.push(x1 + ((x2 - x1) * i) / m, y1 + ((y2 - y1) * i) / m);
  };
  const corner = (ox: number, oy: number, a0: number) => {
    if (r < 3) return;
    for (let i = 0; i < 3; i++) { const a = a0 + (Math.PI / 2) * (i / 3); v.push(ox + Math.cos(a) * r, oy + Math.sin(a) * r); }
  };
  const { x, y, w, h } = b;
  side(x + r, y, x + w - r, y); corner(x + w - r, y + r, -Math.PI / 2);
  side(x + w, y + r, x + w, y + h - r); corner(x + w - r, y + h - r, 0);
  side(x + w - r, y + h, x + r, y + h); corner(x + r, y + h - r, Math.PI / 2);
  side(x, y + h - r, x, y + r); corner(x + r, y + r, Math.PI);
  return v;
};

/** `onBeat` = stan sceny dla wygładzonego postępu: scena pisze z niego DOM (wołane tylko, gdy postęp się zmienił,
    w tej samej klatce, w której płótno rysuje ten sam stan). */
export function createField(canvas: HTMLCanvasElement, onBeat: (b: Beat, p: number) => void): Field {
  const ctx = canvas.getContext('2d');
  const F = (len: number) => new Float32Array(len);
  let L: FieldLayout | null = null;
  let dead = false, visible = true, raf = 0, introAt = -1;
  // postęp: cel z przewijania, bieżący (wygładzony) i jego prędkość; zegar pętli, zegar życia, chwila ostatniej klatki
  let target = 0, cur = 0, vel = 0, seeded = false, lastT = 0, clock = 0, drawnAt = 0;
  // sztywność sprężyny (1/s) i odstęp klatek w spoczynku (ms) - z układu: krótsza bezwładność i mniej klatek na dotyku
  let omega = 2146 / INERTIA_MS, idleMs = 1000 / IDLE_FPS;
  let last: Beat = beat(0);
  let dpr = 1, d = 1400, cx = 0, cy = 0, drop = 0;
  let n = 0;
  // punkty: start i cel w świecie, łuk lotu, początek i czas lotu, rozmiar, jasność, promień kropki (znaczniki),
  // jasność na końcu (tło), chwila narodzin przy wejściu, faza i tempo mrugania; kind: 0 układ, 1 znacznik, 2 tło
  let sx = F(0), sy = F(0), sz = F(0), tx = F(0), ty = F(0), tz = F(0), bx = F(0), by = F(0), bz = F(0);
  let st = F(0), du = F(0), size = F(0), alpha = F(0), tr = F(0), endA = F(0), born = F(0), ph = F(0), tw = F(0);
  let kind = new Uint8Array(0);
  // klatka: położenie na ekranie, promień, jasność, postęp lotu i talia gwiazdki (znaczniki)
  let PX = F(0), PY = F(0), PR = F(0), PA = F(0), PE = F(0), PW = F(0);
  let edges: Edge[] = [];
  let links = new Int32Array(0);
  let fills: string[][] = [[], []];
  const lineW = 'rgba(255,255,255,.22)';
  let lineA = lineW, linkRgb = '255,255,255';
  // kamera bieżącej klatki (kołysanie) + wynik rzutu; obrót płaszczyzny układu + wynik obrotu
  let cX = 1, sX = 0, cY = 1, sY = 0, dolly = 0, oy = 0, qx = 0, qy = 0, qf = 0;
  let tcX = 1, tsX = 0, tcY = 1, tsY = 0, rx = 0, ry = 0, rz = 0;
  // rozejście bieżącej klatki: postęp, prostokąt okna (układ sceny) i prostokąt każdego kłębu maski w ułamkach okna
  // (lewy górny róg, rozmiar); tekstury z setMask
  let vB = 0, vWx = 0, vWy = 0, vWw = 1, vWh = 1;
  const lX = new Float32Array(LN), lY = new Float32Array(LN), lW = new Float32Array(LN), lH = new Float32Array(LN);
  /** Lista warstw maski dla bieżącego układu: na telefonie lżejsza (ta sama granica co @media w bloom.css). */
  let layers = BLOOM_LAYERS;
  let masks: Uint8Array[] | null = null, mN = 0;
  /** Krycie tekstury kłębu w punkcie (u, v w ułamkach jej boku, wewnątrz obrazu). */
  const tex = (m: Uint8Array, u: number, v: number) => {
    const fx = u * (mN - 1), fy = v * (mN - 1);
    const x0 = fx | 0, y0 = fy | 0, x1 = Math.min(x0 + 1, mN - 1), y1 = Math.min(y0 + 1, mN - 1);
    const ax = fx - x0, ay = fy - y0;
    const a = m[y0 * mN + x0], b = m[y0 * mN + x1], c = m[y1 * mN + x0], d = m[y1 * mN + x1];
    return (a + (b - a) * ax + (c - a) * ay + (a - b - c + d) * ax * ay) / 255;
  };

  /** Rzut punktu świata na ekran: qx, qy, qf (skala głębi; -1 = za blisko kamery). */
  const proj = (x: number, y: number, z: number) => {
    const X = x - cx, Y = y - cy;
    const x1 = X * cY + z * sY, z1 = z * cY - X * sY;
    const y2 = Y * cX - z1 * sX, z2 = Y * sX + z1 * cX;
    const den = d - z2 - dolly;
    if (den < d * 0.22) { qf = -1; return; }
    qf = d / den; qx = cx + x1 * qf; qy = oy + y2 * qf;
  };

  /** Punkt płaszczyzny układu (z = 0) po jej pochyleniu wokół środka okna: rx, ry, rz. Chmura się nie obraca -
      pochylona jest tylko płaszczyzna, na którą punkty dolatują. */
  const rot = (x: number, y: number) => {
    const X = x - cx, Y = y - cy, z1 = -X * tsY;
    rx = cx + X * tcY; ry = cy + Y * tcX - z1 * tsX; rz = Y * tsX + z1 * tcX;
  };

  /** Ile układu zostaje w punkcie płaszczyzny okna (1 = wszystko, 0 = nic): dopełnienie maski .cr-bloom, czyli
      iloczyn (1 - krycie kłębu) po wszystkich warstwach. Kłęby leżą na oknie tak jak w CSS (prostokąty lX… liczone
      raz na klatkę). Punkt układu spoza okna (krawędź, zaokrąglenie) bierze wartość z najbliższego miejsca okna.
      Zanim tekstury się wczytają: równe, miękkie czoło od lewej do prawej. */
  const veil = (x: number, y: number) => {
    const u = c01((x - vWx) / vWw), v = c01((y - vWy) / vWh);
    if (!masks) return c01((u - (1.4 * vB - 0.3)) / 0.3);
    let keep = 1;
    for (let i = 0; i < layers.length; i++) {
      const w = lW[i];
      if (w <= 0) continue;
      const tu = (u - lX[i]) / w, tv = (v - lY[i]) / lH[i];
      if (tu <= 0 || tu >= 1 || tv <= 0 || tv >= 1) continue;
      keep *= 1 - tex(masks[layers[i][0]], tu, tv);
      if (keep < 0.004) return 0;
    }
    return keep;
  };

  const build = (top: number) => {
    const lay = L;
    if (!lay) return;
    const { W, H, win, phone, boxes, segs, dots } = lay;
    const rnd = prng(0x51ed270b);
    const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.73;
    const N0 = phone ? 560 : 1400;

    // 1. krawędzie układu i cele punktów na nich (gęstość z budżetu punktów); gt = chwila, w której wzdłuż krawędzi
    //    przechodzi fala lądowań (liczona od startu krawędzi)
    let total = 0;
    boxes.forEach((b) => { total += 2 * (b.w + b.h); });
    segs.forEach((s) => { total += Math.hypot(s.x2 - s.x1, s.y2 - s.y1); });
    const step = Math.max(phone ? 10 : 11, total / (N0 * 0.74));
    edges = [];
    const gx: number[] = [], gy: number[] = [], gt: number[] = [];
    const add = (v: number[], closed: boolean, g: number, acc: boolean) => {
      const t0 = (GROUP[g] ?? GROUP[GROUP.length - 1]) + rnd() * 0.06, m = v.length / 2;
      edges.push({ v: Float32Array.from(v), closed, t0, acc });
      for (let k = 0; k < m; k++) { gx.push(v[k * 2]); gy.push(v[k * 2 + 1]); gt.push(t0 + (k / m) * EDGE); }
    };
    boxes.forEach((b) => add(outline(b, step), true, b.g, false));
    segs.forEach((s) => {
      const m = Math.max(1, Math.round(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / step)), v: number[] = [];
      for (let k = 0; k <= m; k++) v.push(s.x1 + ((s.x2 - s.x1) * k) / m, s.y1 + ((s.y2 - s.y1) * k) / m);
      add(v, false, s.g, s.acc);
    });
    const M = gx.length, A = dots.length;
    n = Math.min(2400, Math.max(N0, Math.ceil((M + A) / 0.8)));

    sx = F(n); sy = F(n); sz = F(n); tx = F(n); ty = F(n); tz = F(n); bx = F(n); by = F(n); bz = F(n);
    st = F(n); du = F(n).fill(FLY); size = F(n); alpha = F(n); tr = F(n); endA = F(n); born = F(n); ph = F(n); tw = F(n);
    kind = new Uint8Array(n).fill(2);
    PX = F(n); PY = F(n); PR = F(n); PA = F(n); PE = F(n); PW = F(n);

    // 2. chmura na pierwszym ekranie (px ekranu przy p = 0): pas wznoszący się w prawo, skupiska i rzadkie tło;
    //    wychodzi za lewą, prawą i dolną krawędź ekranu. f0 = skala głębi punktu (daleki mały, bliski duży).
    //    Telefon (wąski, wysoki ekran): mniej punktów ucieka poza ekran w bok i pod dolną krawędź, a przygaszony
    //    pas pod nagłówkiem jest węższy - chmura na pierwszym ekranie jest gęstsza. PHONE_GAIN = punkty odrobinę
    //    większe i jaśniejsze (na małym ekranie drobne punkty giną).
    const ch = Math.max(140, H * (phone ? 1.08 : 1.14) - top), x0 = (phone ? -0.08 : -0.14) * W, xw = (phone ? 1.16 : 1.28) * W;
    const fadeZone = ch * (phone ? 0.12 : 0.2), gain = phone ? PHONE_GAIN : 1;
    const piles = phone ? PILES_PHONE : PILES;
    const px = F(n), py = F(n), f0 = F(n), fade = F(n);
    for (let i = 0; i < n; i++) {
      const u = rnd();
      let x: number, y: number;
      if (u < 0.5) { const a = rnd(); x = x0 + xw * a; y = top + ch * (0.76 - 0.46 * a) + gauss() * ch * 0.15; }
      else if (u < 0.82) { const c = piles[Math.floor(rnd() * piles.length) % piles.length]; x = c[0] * W + gauss() * W * (phone ? 0.17 : 0.09); y = top + c[1] * ch + gauss() * ch * 0.12; }
      else { x = x0 + xw * rnd(); y = top + ch * rnd(); }
      if (y < top) y = top + (top - y) * 0.6;
      px[i] = x; py[i] = y;
      f0[i] = 0.38 + 0.95 * Math.pow(rnd(), 1.7);
      // przy linii nagłówka chmura rzednie stopniowo (bez równej krawędzi)
      fade[i] = sm(y, top - 6, top + fadeZone);
    }

    // 3. role: bliskie punkty niosą układ, najdalsze zostają tłem. Znaczniki ze środka głębi (nie najbliższe):
    //    przy najeździe jadą spokojnie, więc linie konstelacji między nimi nie „machają” po ekranie.
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => f0[b] - f0[a]);
    const anchors: number[] = [];
    for (let k = 0; k < n && anchors.length < A; k++) {
      const i = order[k];
      if (f0[i] > 1.02) continue;
      if (px[i] > W * 0.04 && px[i] < W * 0.96 && py[i] > top + 26 && py[i] < H - 20) { kind[i] = 1; anchors.push(i); }
    }
    for (let k = 0; k < n && anchors.length < A; k++) { const i = order[k]; if (kind[i] === 2) { kind[i] = 1; anchors.push(i); } }
    const struct: number[] = [];
    const M2 = Math.min(M, n - anchors.length);
    for (let k = 0; k < n && struct.length < M2; k++) { const i = order[k]; if (kind[i] === 2) { kind[i] = 0; struct.push(i); } }

    const Z0 = FAR * d;
    const place = (i: number) => {
      const f = f0[i];
      sx[i] = cx + (px[i] - cx) / f; sy[i] = cy + (py[i] - cy - drop) / f; sz[i] = Z0 + d * (1 - 1 / f);
    };
    /** Czas lotu punktu: bliższy leci krócej (szybciej), dalszy dłużej; do tego własny rozrzut. */
    const flyOf = (i: number) => FLY * (FLY_FAR + (FLY_NEAR - FLY_FAR) * c01((f0[i] - 0.38) / 0.95)) * (0.92 + 0.16 * rnd());

    // znaczniki: od lewej do lewej (bez krzyżowania dróg)
    anchors.sort((a, b) => px[a] - px[b]);
    const dOrder = dots.map((_, i) => i).sort((a, b) => dots[a].x - dots[b].x);
    anchors.forEach((i, k) => {
      const dt = dots[dOrder[k]];
      place(i);
      tx[i] = dt.x; ty[i] = dt.y; tz[i] = 0; tr[i] = dt.r;
      st[i] = (GROUP[dt.g] ?? GROUP[GROUP.length - 1]) + 0.03 + rnd() * 0.09;
      du[i] = Math.max(0.2, Math.min(flyOf(i), 0.98 - st[i]));
      size[i] = (phone ? 5.2 : 6) + rnd() * 1.8;
      alpha[i] = Math.max(0.65, fade[i]);
    });

    // układ: punkty i cele parowane po położeniu w poziomie, w paczkach potasowane (sąsiedzi nie lecą rzędem).
    // Lądują po kolei wzdłuż swojej krawędzi (gt + ARRIVE - za nimi rośnie linia), ale ruszają w różnych chwilach,
    // bo każdy leci własnym tempem.
    struct.sort((a, b) => px[a] - px[b]);
    for (let k = 0; k < struct.length; k += 28) {
      const end = Math.min(struct.length, k + 28);
      for (let j = end - 1; j > k; j--) {
        const r = k + Math.floor(rnd() * (j - k + 1)), tmp = struct[j];
        struct[j] = struct[r]; struct[r] = tmp;
      }
    }
    const tOrder = Array.from({ length: M }, (_, i) => i).sort((a, b) => gx[a] - gx[b]);
    struct.forEach((i, k) => {
      const j = tOrder[Math.min(M - 1, Math.floor((k * M) / struct.length))];
      place(i);
      tx[i] = gx[j]; ty[i] = gy[j]; tz[i] = 0;
      const land = gt[j] + ARRIVE + (rnd() - 0.5) * 0.012, fly = Math.max(0.2, Math.min(flyOf(i), land));
      st[i] = land - fly; du[i] = fly;
      size[i] = (1.05 + rnd() * 0.6) * gain;
      alpha[i] = Math.min(1, (0.55 + 0.45 * rnd()) * gain) * fade[i];
    });

    // tło: dalekie gwiazdy kończą wokół okna (nigdy na nim), pod zdaniem narratora przygaszone
    const pad = 22, narrX = phone ? W : win.x + 760, narrY = H - 150;
    for (let i = 0; i < n; i++) {
      if (kind[i] !== 2) continue;
      place(i);
      let ex = 0, ey = 0, ok = false;
      for (let tries = 0; tries < 8 && !ok; tries++) {
        ex = W * (1.08 * rnd() - 0.04); ey = H * (1.08 * rnd() - 0.04);
        ok = ex < win.x - pad || ex > win.x + win.w + pad || ey < win.y - pad || ey > win.y + win.h + pad;
      }
      if (!ok) { ex = rnd() < 0.5 ? -40 - rnd() * 80 : W + 40 + rnd() * 80; ey = H * rnd(); }
      const f1 = 0.34 + 0.4 * rnd();
      tx[i] = cx + (ex - cx) / f1; ty[i] = cy + (ey - cy) / f1; tz[i] = d * (1 - 1 / f1);
      st[i] = 0.02 + rnd() * 0.38;
      du[i] = Math.max(0.2, Math.min(flyOf(i), 0.98 - st[i]));
      size[i] = (1.1 + rnd() * 0.8) * gain;
      alpha[i] = Math.min(1, (0.45 + 0.4 * rnd()) * gain) * fade[i];
      endA[i] = ey > narrY && ex < narrX ? 0.35 : 0.8;
    }

    // łuk lotu (wszystkie w tę samą stronę = spokojny wir, różne wychylenie), kolejność narodzin przy wejściu
    // (od środka chmury), faza i tempo mrugania
    for (let i = 0; i < n; i++) {
      const dx = tx[i] - sx[i], dy = ty[i] - sy[i], dz = tz[i] - sz[i];
      const dist = Math.hypot(dx, dy, dz), pl = Math.hypot(dx, dy) || 1, k = (ARC_MIN + (ARC_MAX - ARC_MIN) * rnd()) * dist;
      bx[i] = (-dy / pl) * k; by[i] = (dx / pl) * k; bz[i] = (rnd() - 0.5) * 0.2 * dist;
      born[i] = 0.55 * c01(Math.hypot(px[i] - W / 2, py[i] - (top + ch * 0.4)) / (W * 0.75)) + 0.2 * rnd();
      ph[i] = rnd() * TAU; tw[i] = TWINKLE_MIN + (TWINKLE_MAX - TWINKLE_MIN) * rnd();
    }

    // konstelacja pierwszego ekranu: sąsiednie znaczniki połączone cienką linią (rozpływa się przy najeździe)
    const lk: number[] = [];
    for (let k = 1; k < anchors.length; k++) {
      const a = anchors[k - 1], b = anchors[k];
      if (Math.hypot(px[b] - px[a], py[b] - py[a]) < Math.max(200, W * 0.3)) lk.push(a, b);
    }
    links = Int32Array.from(lk);
  };

  const render = (now: number) => {
    const lay = L;
    if (!ctx || !lay || dead) return;
    const { W, H, win, phone } = lay;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (introAt < 0) return;
    const it = c01((now - introAt) / INTRO_MS);
    if (it <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const b = last, G = b.gather;
    // życie w spoczynku cichnie, gdy okno się rozchodzi; kołysanie kamery - gdy układ staje na miejscu (okno DOM
    // musi wtedy leżeć dokładnie pod punktami)
    const life = 1 - b.bloom, sway = life * (1 - sm(G, 0.3, 0.85));
    const swX = SWAY_X * sway * Math.sin(clock * SWAY_SPEED_X), swY = SWAY_Y * sway * Math.sin(clock * SWAY_SPEED_Y + 1.3);
    cX = Math.cos(swX); sX = Math.sin(swX); cY = Math.cos(swY); sY = Math.sin(swY);
    // kamera: przy wejściu dojeżdża z lekkiego oddalenia do pierwszego ujęcia
    const far = b.far + 0.14 * (1 - it) ** 3;
    dolly = -FAR * d * far;
    oy = cy + drop * (1 - b.lift);
    // pochylenie płaszczyzny układu (tylko cele punktów i linie)
    const ax = TILT_X * b.tilt * (phone ? 0.8 : 1), ay = TILT_Y * b.tilt * (phone ? 0.45 : 1);
    tcX = Math.cos(ax); tsX = Math.sin(ax); tcY = Math.cos(ay); tsY = Math.sin(ay);
    // rozejście: prostokąt okna w układzie sceny i prostokąty kłębów maski dla bieżącego postępu - te same wzory
    // co w bloom.css (liczone w płaszczyźnie okna, więc skala kamery, wspólna dla okna i płótna, niczego nie przesuwa)
    const B = b.bloom, veiled = B > 0;
    if (veiled) {
      vB = B;
      vWx = win.x; vWy = win.y; vWw = Math.max(1, win.w); vWh = Math.max(1, win.h);
      layers = phone ? BLOOM_LAYERS_SMALL : BLOOM_LAYERS;
      for (let i = 0; i < layers.length; i++) {
        const [, cx, cy, dx, dy, w, h, start, dur, ease] = layers[i];
        const p = c01((B - start) / dur), e = ease ? p * p * p : p * p * (3 - 2 * p);
        lW[i] = w * e; lH[i] = h * e;
        lX[i] = cx + dx * e - lW[i] / 2; lY[i] = cy + dy * e - lH[i] / 2;
      }
    }

    // 1. punkty: położenie, promień, jasność - wszystko ciągłe w postępie lotu `e`
    for (let i = 0; i < n; i++) {
      PA[i] = 0;
      const bi = sm(it * 1.6 - born[i], 0, 0.55);
      if (bi <= 0) continue;
      // lot: miękki start, długie i łagodne wyhamowanie przed celem
      const g = c01((G - st[i]) / du[i]);
      let e = 0, sb = 0;
      if (g >= 1) e = 1;
      else if (g > 0) { e = 1 - Math.pow(1 - g * g * (3 - 2 * g), LAND); sb = Math.sin(Math.PI * e); }
      const k = kind[i];
      let ex = tx[i], ey = ty[i], ez = tz[i];
      if (k !== 2 && e > 0) { rot(ex, ey); ex = rx; ey = ry; ez = rz; }
      proj(sx[i] + (ex - sx[i]) * e + bx[i] * sb, sy[i] + (ey - sy[i]) * e + by[i] * sb, sz[i] + (ez - sz[i]) * e + bz[i] * sb);
      if (qf < 0) continue;
      let a = alpha[i] * c01(0.3 + 0.75 * qf) * c01((4.5 - qf) / 1.5);
      let r = size[i] * qf;
      // mruganie: każda gwiazda w swojej fazie; punkt, który stanął w układzie, cichnie
      let live = life;
      if (k === 0) {
        // na miejscu: drobny koralik na linii; gdy linia przez niego przejdzie, przygasa
        a += (0.62 * (1 - 0.4 * c01((G - st[i] - du[i]) / 0.12)) - a) * e;
        r += (0.9 - r) * e;
        if (r > 4.2) r = 4.2;
        live *= 1 - e;
        if (veiled) a *= veil(tx[i], ty[i]);
      } else if (k === 1) {
        // gwiazdka -> kropka o promieniu kropki z DOM
        if (r > 16) r = 16;
        const rd = tr[i] * qf;
        a += (1 - a) * e;
        PW[i] = r * 0.2 + (rd * 0.7071 - r * 0.2) * e;
        r += (rd - r) * e;
        PE[i] = e;
        live *= 1 - e;
        if (veiled) a *= veil(tx[i], ty[i]);
      } else {
        a *= 1 + (endA[i] - 1) * e;
        if (r > 4.2) r = 4.2;
      }
      if (live > 0.002) a *= 1 + TWINKLE * live * Math.sin(clock * tw[i] + ph[i]);
      PX[i] = qx; PY[i] = qy; PR[i] = r; PA[i] = a * bi;
    }

    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 2. konstelacja znaczników (pierwszy ekran): rozpływa się razem z najazdem kamery
    const la = c01(1 - (1 - b.far) * 3.2);
    if (la > 0.01 && links.length) {
      ctx.beginPath();
      for (let k = 0; k < links.length; k += 2) {
        const p0 = links[k], p1 = links[k + 1];
        if (PA[p0] <= 0 || PA[p1] <= 0) continue;
        const grow = c01((it - 0.35 - k * 0.012) / 0.4);
        if (grow <= 0) continue;
        ctx.moveTo(PX[p0], PY[p0]);
        ctx.lineTo(PX[p0] + (PX[p1] - PX[p0]) * grow, PY[p0] + (PY[p1] - PY[p0]) * grow);
      }
      ctx.strokeStyle = `rgba(${linkRgb},${(0.34 * la).toFixed(3)})`;
      ctx.stroke();
    }

    // 3. włosowe linie układu: rosną wzdłuż krawędzi tuż za lądującymi punktami i wchodzą z przezroczystości;
    //    w czasie rozejścia gasną pod oknem odcinek po odcinku. Krycie w wielu stopniach (bez widocznych skoków).
    if (G > ARRIVE) {
      const lp: (Path2D | undefined)[] = [];
      const level = (a: number) => Math.max(0, Math.min(LINE_LEVELS - 1, Math.round(a * LINE_LEVELS) - 1));
      for (const ed of edges) {
        const grow = c01((G - ed.t0 - ARRIVE - 0.012) / EDGE);
        if (grow <= 0) continue;
        const v = ed.v, m = v.length / 2, segN = ed.closed ? m : m - 1, upto = grow * segN;
        const ea = c01(grow * 2.5), base = ed.acc ? LINE_LEVELS : 0;
        if (ea < 0.03) continue;
        if (!veiled) {
          const slot = base + level(ea), path = lp[slot] ?? (lp[slot] = new Path2D());
          let pen = false;
          for (let k = 0; k <= segN; k++) {
            let x: number, y: number;
            if (k <= upto) { const j = (k % m) * 2; x = v[j]; y = v[j + 1]; }
            else if (k - 1 < upto) {
              const j0 = ((k - 1) % m) * 2, j1 = (k % m) * 2, fr = upto - (k - 1);
              x = v[j0] + (v[j1] - v[j0]) * fr; y = v[j0 + 1] + (v[j1 + 1] - v[j0 + 1]) * fr;
            } else break;
            rot(x, y);
            proj(rx, ry, rz);
            if (qf < 0) { pen = false; continue; }
            if (pen) path.lineTo(qx, qy); else { path.moveTo(qx, qy); pen = true; }
          }
        } else {
          let x0 = 0, y0 = 0, a0 = 0, ok0 = false;
          for (let k = 0; k <= segN && k <= upto; k++) {
            const j = (k % m) * 2, a1 = veil(v[j], v[j + 1]);
            rot(v[j], v[j + 1]);
            proj(rx, ry, rz);
            const ok1 = qf >= 0;
            if (k > 0 && ok0 && ok1) {
              const a = ea * (a0 + a1) / 2;
              if (a > 0.03) {
                const slot = base + level(a), path = lp[slot] ?? (lp[slot] = new Path2D());
                path.moveTo(x0, y0); path.lineTo(qx, qy);
              }
            }
            x0 = qx; y0 = qy; a0 = a1; ok0 = ok1;
          }
        }
      }
      for (let s = 0; s < lp.length; s++) {
        const path = lp[s];
        if (!path) continue;
        ctx.globalAlpha = ((s % LINE_LEVELS) + 1) / LINE_LEVELS;
        ctx.strokeStyle = s < LINE_LEVELS ? lineW : lineA;
        ctx.stroke(path);
      }
      ctx.globalAlpha = 1;
    }

    // 4. punkty w koszykach jasności (kilkadziesiąt wypełnień na klatkę zamiast ponad tysiąca); położenia
    //    podpikselowe, mały punkt = kwadrat o polu koła (bez skoku jasności na granicy kwadrat / koło)
    const paths: (Path2D | undefined)[] = [];
    for (let i = 0; i < n; i++) {
      const a = PA[i];
      if (a < 0.02) continue;
      const x = PX[i], y = PY[i], r = PR[i];
      if (x < -24 || x > W + 24 || y < -24 || y > H + 24) continue;
      const acc = kind[i] === 1;
      const slot = (acc ? LEVELS : 0) + Math.max(0, Math.min(LEVELS - 1, Math.round(a * LEVELS) - 1));
      const path = paths[slot] ?? (paths[slot] = new Path2D());
      if (acc && PE[i] < 0.985 && r > 1.4) {
        // czteroramienna gwiazdka (jak gwiazdki etykiet i nieba strony głównej), ostra - bez poświaty
        const w = PW[i];
        path.moveTo(x, y - r); path.lineTo(x + w, y - w); path.lineTo(x + r, y); path.lineTo(x + w, y + w);
        path.lineTo(x, y + r); path.lineTo(x - w, y + w); path.lineTo(x - r, y); path.lineTo(x - w, y - w);
        path.closePath();
      } else if (r < 1) { const h = r * 0.886; path.rect(x - h, y - h, h * 2, h * 2); }
      else { path.moveTo(x + r, y); path.arc(x, y, r, 0, TAU); }
    }
    for (let s = 0; s < paths.length; s++) {
      const path = paths[s];
      if (!path) continue;
      ctx.fillStyle = fills[s < LEVELS ? 0 : 1][s % LEVELS];
      ctx.fill(path);
    }
  };

  /** Jedna pętla klatek sceny: bezwładność postępu, wejście i życie w spoczynku. Biegnie tylko, gdy scena jest na
      ekranie i jest co robić (dojazd do celu, wejście albo spoczynek przed rozejściem okna); przy ukrytej karcie
      przeglądarka sama ją wstrzymuje. */
  const tick = (now: number) => {
    raf = 0;
    if (dead) return;
    const dt = lastT > 0 ? Math.min(0.05, Math.max(0.001, (now - lastT) / 1000)) : 1 / 60;
    lastT = now;
    let moved = false;
    if (cur !== target || vel !== 0) {
      if (visible) {
        // sprężyna krytycznie tłumiona - rozwiązanie dokładne, niezależne od liczby klatek
        const k = Math.exp(-omega * dt), dx = cur - target, tmp = (vel + omega * dx) * dt;
        cur = target + (dx + tmp) * k;
        vel = (vel - omega * tmp) * k;
        if (Math.abs(target - cur) < 2e-5 && Math.abs(vel) < 2e-4) { cur = target; vel = 0; }
      } else { cur = target; vel = 0; } // poza ekranem bez dojazdu - sam stan
      last = beat(cur);
      onBeat(last, cur);
      moved = true;
    }
    if (!visible) { lastT = 0; return; }
    clock += dt;
    const entering = introAt >= 0 && now - introAt < INTRO_MS + 80;
    const alive = introAt >= 0 && last.bloom < 1;
    if (moved || entering || (alive && now - drawnAt >= idleMs - 2)) { render(now); drawnAt = now; }
    if (cur !== target || vel !== 0 || entering || alive) raf = requestAnimationFrame(tick);
    else lastT = 0;
  };
  const wake = () => { if (!raf && !dead) raf = requestAnimationFrame(tick); };

  return {
    setMask(maps, n) {
      if (n < 2 || [...BLOOM_LAYERS, ...BLOOM_LAYERS_SMALL].some(([t]) => !maps[t] || maps[t].length < n * n)) return;
      masks = maps; mN = n;
    },
    setLayout(layout) {
      if (!ctx || dead) return;
      L = layout;
      const { W, H, win } = layout;
      // DPR do 2, z budżetem pikseli (nie mniej niż 1 - punkty mają zostać ostre)
      const budget = layout.coarse ? 2.2e6 : 3.4e6;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (W * H * dpr * dpr > budget) dpr = Math.max(1, Math.sqrt(budget / Math.max(1, W * H)));
      const cw = Math.max(1, Math.round(W * dpr)), chh = Math.max(1, Math.round(H * dpr));
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== chh) canvas.height = chh;
      omega = 2146 / (layout.coarse ? INERTIA_MS_TOUCH : INERTIA_MS);
      idleMs = 1000 / (layout.coarse ? IDLE_FPS_TOUCH : IDLE_FPS);
      d = Math.max(900, W * 1.05);
      cx = win.x + win.w / 2; cy = win.y + win.h / 2;
      // chmura zaczyna się tuż pod nagłówkiem (na telefonie bliżej - każdy piksel pierwszego ekranu się liczy)
      const top = Math.min(layout.head + (layout.phone ? 12 : 18), H - 90);
      // środek rzutu na pierwszym ekranie = środek pasa chmury (pod nagłówkiem), potem wolno wraca na środek okna
      drop = (top + H) / 2 - cy;
      const [r, g, bl] = layout.accent;
      fills = [WHITE, layout.accent].map(([cr, cg, cb]) => Array.from({ length: LEVELS }, (_, i) => `rgba(${cr},${cg},${cb},${((i + 1) / LEVELS).toFixed(3)})`));
      lineA = `rgba(${r},${g},${bl},.75)`;
      linkRgb = `${r},${g},${bl}`;
      build(top);
    },
    seek(p, snap) {
      if (dead) return;
      target = p;
      if (snap || !seeded) {
        seeded = true;
        cur = p; vel = 0;
        last = beat(p);
        onBeat(last, p);
        if (visible) { drawnAt = performance.now(); render(drawnAt); }
      }
      wake();
    },
    refresh() {
      if (dead) return;
      if (visible) { drawnAt = performance.now(); render(drawnAt); }
      wake();
    },
    intro() {
      if (introAt >= 0 || dead) return;
      introAt = performance.now();
      wake();
    },
    setVisible(v) {
      const was = visible;
      visible = v;
      if (v && !was) wake();
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.width = canvas.height = 1;
    },
  };
}
