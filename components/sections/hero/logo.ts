// Warstwa logotypu hero (od 2026-10-09): NOWE LOGO i „chirurgiczne cięcie”. Zastąpiła logotyp z cząstek
// (particles.ts / particles-gl.ts usunięte - właściciel: „porzucamy ten zamysł z kulkami, bo laguje; chcę, żeby się
// pojawiał napis AVENLY cały i dopiero wtedy gwiazda przechodzi i chirurgicznie przecina, to ma być fizyczna animacja”).
//
// Przebieg wejścia (kolejne rundy z właścicielem tego samego dnia):
//   1. CAŁY napis NA RAZ wschodzi ZZA PLANETY jak słońce zza horyzontu („to pojawianie się też zrób bardziej premium,
//      szczególnie napis AVENLY”): litery w całości (bez szczeliny - górne połówki cofnięte o LOGO_CUT_SHIFT, szczelina
//      wypełniona) jadą promieniście spod horyzontu, planeta zasłania to, co jeszcze jest pod nim; części liter tuż nad
//      horyzontem łapią błękitne światło krawędzi planety. Pełne krycie - w miejscu cięcia nic nie prześwituje,
//   2. chwila ciszy, potem GWIAZDA (kolor marki, rozgrzany biały środek) pojawia się w locie i jak spadająca gwiazda
//      na niebie hero ciągnie zwężający się ogon (biel → chłodny błękit); ROZPĘDZA SIĘ na początku, najszybciej tnie
//      środek napisu i ZWALNIA na końcówce („przyspiesz na początku, zwolnij na końcówce”) - ogon rośnie i maleje
//      z prędkością, a gwiazda przy lądowaniu rośnie do wielkości gwiazdy logo,
//   3. CIĘCIE ZGODNE Z DROGĄ GWIAZDY („to przecięcie niech nie będzie tak jak w logo, czyli proste, tylko niech będzie
//      matematycznie zgodne z drogą gwiazdy”): gwiazda leci po okręgu wokół środka planety, więc szczelina jest pasem
//      tego samego okręgu (łuk przez wszystkie litery, szerokość jak w logo: rośnie od A do Y) - otwiera się dokładnie
//      na czole gwiazdy; za nią zostaje linia logo (tuż za gwiazdą rozgrzana do bieli), a świeże krawędzie cięcia
//      łapią jej światło i stygną,
//   4. górna połówka przeciętej litery, pociągnięta przez gwiazdę, ZSUWA SIĘ PO ŁUKU CIĘCIA (obrót wokół środka planety
//      - po cięciu po okręgu to jedyny możliwy ruch) o 3u i hamuje do zera (bez przestrzelenia); efekt końcowy to logo
//      z przesunięciem połówek jak w projekcie, z cięciem wygiętym po orbicie,
//   5. przy lądowaniu krótki błysk ostrych promieni (jak „klejnoty” nieba w hero), środek gwiazdy stygnie do koloru marki. Potem warstwa nie rysuje NIC.
// Litery stoją na łuku orbity sztywno (każda obrócona prostopadle do krawędzi planety). Canvas 2D, ten sam na komputerze
// i telefonie. Ograniczony ruch / zmiana rozmiaru: od razu stan końcowy. Odbicie w planecie rysuje scena (2D).
//
// Wydajność: cały napis i linia z gwiazdą rysowane RAZ do warstw poza ekranem; regiony przycięcia (litery, pas
// cięcia) liczone raz przy budowie. Klatka = kilka drawImage z przycięciem + gwiazda. Czyszczony jest tylko prostokąt
// logo. W pauzie przed cięciem nic się nie rysuje.

import type { HeroLayout } from './layout';
import {
  GEM, LOGO_BOX, LOGO_CUT_SHIFT, LOGO_LETTERS_BOX, LOGO_PIECES, LOGO_STAR, LOGO_STAR_CENTER, LOGO_WHOLE_FILLS,
  type LogoPiece,
} from '@/lib/brand/logo';

/** Szerokość całego znaku (od czubka linii po gwiazdę) względem layout.logoW. */
const LOGO_SPAN = 1.04;
const MID = LOGO_BOX.x + LOGO_BOX.w / 2; // środek znaku w jednostkach logo
const LINE_Y = 62.5; // linia nad linią bazową (jednostki logo)
const LETTERS: LogoPiece['letter'][] = ['A', 'V', 'E', 'N', 'L', 'Y'];

// Czas (ms od startu wejścia)
const APPEAR = 1300;     // cały napis wschodzi zza krawędzi planety
const RIM = 30;          // jak wysoko nad horyzontem (jednostki logo) litery łapią światło krawędzi planety
const STAR_AT = 1550;    // gwiazda wpada z lewej (napis jest już cały, chwila ciszy)
const FLIGHT = 1150;     // przelot: od wlotu do zatrzymania w miejscu gwiazdy logo
const LEAD = 80;         // gwiazda pojawia się w locie na tym odcinku przed czubkiem linii (jednostki logo)
const STREAK = 250;      // ogon jak u spadającej gwiazdy na niebie hero przy NAJWIĘKSZEJ prędkości (jednostki logo)
const STREAK_W = 5.5;    // grubość ogona przy gwieździe (jednostki logo), zwęża się do zera
const SLIDE = 520;       // zsunięcie górnej połówki po łuku cięcia
const COOL = 520;        // stygnięcie gwiazdy i krawędzi po dolocie
const GLINT = 560;       // błysk promieni przy dolocie
const HOT = 120;         // długość rozgrzanego odcinka linii za gwiazdą (jednostki logo)
const EDGE = 130;        // jak daleko za gwiazdą świeże krawędzie cięcia łapią jej światło (jednostki logo)
const EXT = 0.35;        // zakładka wypełnienia szczeliny na połówki liter (jednostki logo)
const END = STAR_AT + FLIGHT + Math.max(GLINT, COOL) + 120;
const X0 = LOGO_BOX.x - LEAD;          // punkt wlotu gwiazdy (jednostki logo)
const X1 = LOGO_STAR_CENTER.x;         // miejsce gwiazdy w logo

const BLUE = 'rgb(59,130,246)';
const WHITE = '248,251,255';
const EDGE_RGB = '96,165,250'; // światło gwiazdy na krawędziach cięcia (--brand-hi)
const RIM_RGB = '166,209,255'; // światło krawędzi planety (kolor rimu z renderu planety)
const GRAD = ['rgb(248,250,252)', 'rgb(238,242,249)', 'rgb(207,220,246)']; // biel u góry → lekki błękit przy planecie

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const outCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const outExpo = (t: number) => { const x = clamp01(t); return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };
/** cubic-bezier jak w CSS (x1, y1, x2, y2). */
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, u = x;
    for (let i = 0; i < 22; i++) { if (sx(u) < x) lo = u; else hi = u; u = (lo + hi) / 2; }
    return sy(u);
  };
};
/** Wschód napisu zza planety: szybkie wynurzenie, długie, miękkie dojście na miejsce (bez przestrzelenia). */
const rise = bezier(0.16, 1, 0.3, 1);
/** Przelot (właściciel: „przecinanie jest jednostajne, przyspiesz na początku, zwolnij na końcówce”): gwiazda
    rozpędza się, najszybciej tnie środek napisu i hamuje do zera na końcu - droga = smootherstep 6u⁵ − 15u⁴ + 10u³,
    prędkość = 30u²(1 − u)² (szczyt w połowie lotu, 1,875 × średniej). Droga 0..1. */
const flight = (t: number) => { const u = clamp01(t); return u * u * u * (u * (6 * u - 15) + 10); };
/** Prędkość przelotu w chwili u, 0..1 (1 = szczyt w połowie lotu) - długość ogona spadającej gwiazdy. */
const speed = (t: number) => { const u = clamp01(t); return (30 * u * u * (1 - u) * (1 - u)) / 1.875; };
/** Odwrotność przelotu: ułamek czasu lotu, w którym czoło gwiazdy jest na danym ułamku drogi. */
const flightAt = (f: number) => {
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (flight(m) < f) lo = m; else hi = m; }
  return hi;
};
/** Pół szerokości szczeliny (jednostki logo) w miejscu x - jak w logo: ok. 2,6u przy A, ok. 5,1u przy Y. */
const kerfHalf = (x: number) => 2.56 + 0.005708 * (x - 55);

/** Rozkłada ścieżkę złożoną z M / C / Z na punkty (do wygięcia linii z gwiazdą po łuku). */
function flatten(d: string): [number, number][][] {
  const tok = d.match(/[MCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const polys: [number, number][][] = [];
  let cur: [number, number][] = [];
  let i = 0, x = 0, y = 0;
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') { x = num(); y = num(); cur = [[x, y]]; polys.push(cur); }
    else if (c === 'C') {
      while (i < tok.length && !/[MCZ]/i.test(tok[i])) {
        const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num();
        const n = Math.max(6, Math.ceil(Math.hypot(x3 - x, y3 - y) / 5));
        for (let s = 1; s <= n; s++) {
          const t = s / n, u = 1 - t;
          cur.push([
            u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
            u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
          ]);
        }
        x = x3; y = y3;
      }
    }
  }
  return polys;
}
const STAR_POLYS = flatten(LOGO_STAR);

/** Wypełnienia szczeliny z zakładką (wierzchołki krawędzi wysunięte od partnera w głąb połówek). */
const FILLS: Record<string, [number, number][][]> = Object.fromEntries(
  LETTERS.map((l) => [l, LOGO_WHOLE_FILLS[l].map((poly) => poly.map(([x, y, p]) => {
    if (p === undefined) return [x, y] as [number, number];
    const [px, py] = poly[p];
    const k = EXT / Math.max(0.5, Math.abs(y - py));
    return [x + (x - px) * k, y + (y - py) * k] as [number, number];
  }))]),
);

/** Granice między literami w całości (jednostki logo, od dołu do góry) - biegną środkiem odstępu między literami,
    także między skośnymi ramionami (A|V, V|E, L|Y). Granica i + 1 = prawa krawędź litery i. */
const BOUNDS: [number, number][][] = [
  [[-60, 8], [-60, -108]],
  [[121.2, 8], [82.2, -108]],
  [[186.1, 8], [204.9, -108]],
  [[283.5, 8], [283.5, -108]],
  [[385.9, 8], [385.9, -108]],
  [[469.9, 8], [469.9, -24], [443, -58], [431, -108]],
  [[640, 8], [640, -108]],
];
/** Ostatni punkt każdej litery na wysokości cięcia (litera przecięta w całości, gdy gwiazda go minie). */
const CUT_END_X = [100, 197, 283.5, 385.9, 452, 530];

export interface LogoLayer {
  readonly canvas: HTMLCanvasElement;
  /** animate=false → od razu stan końcowy (ograniczony ruch, zmiana rozmiaru). */
  build(layout: HeroLayout, animate: boolean, startAt: number): void;
  /** true, gdy zawartość canvasa zmieniła się w tej klatce (→ odbicie). */
  frame(now: number): boolean;
  /** true po zakończeniu wejścia (stan końcowy narysowany). */
  readonly done: boolean;
  /** Górna krawędź liter (jednostki sceny) - pas źródłowy odbicia. */
  readonly topY: number;
  readonly ownsReflection: boolean;
  destroy(): void;
}

type C2D = CanvasRenderingContext2D;

export function createLogo(canvas: HTMLCanvasElement): LogoLayer {
  const ctx = canvas.getContext('2d')!;
  const up: Partial<Record<LogoPiece['letter'], Path2D>> = {};
  const down: Partial<Record<LogoPiece['letter'], Path2D>> = {};
  for (const pc of LOGO_PIECES) (pc.part === 'up' ? up : down)[pc.letter] = new Path2D(pc.d);
  const gem = new Path2D(GEM);
  // warstwy poza ekranem (rozmiar = prostokąt logo w px urządzenia)
  const layer = () => { const c = document.createElement('canvas'); return { c, x: c.getContext('2d')! }; };
  const WHOLE = layer(), LINE = layer();

  let L: HeroLayout | null = null;
  let dpr = 1, sc = 1, Rb = 1, Cy = 0, topY = 0, rLine = 1, delta = 0;
  let bx = 0, by = 0, bw = 1, bh = 1; // prostokąt logo w px urządzenia (na płótnie głównym) = rozmiar warstw
  let ax = 0, ay = 0, aw = 1, ah = 1; // obszar czyszczony w każdej klatce (logo + promienie gwiazdy)
  let startAt = 0, done = true, holdDrawn = false;
  let drop = 130; // o ile (jednostki logo) napis zaczyna pod horyzontem - cały schowany za planetą
  let star = new Float32Array(0); // linia z gwiazdą wygięta po łuku (jednostki sceny), kolejne kontury
  let starLens: number[] = [];
  let grad: CanvasGradient | null = null;
  // regiony przycięcia (jednostki sceny), liczone przy budowie
  let letterClip: Path2D[] = [];  // litera i (między granicami i oraz i + 1)
  let leftOf: Path2D[] = [];      // wszystko na lewo od granicy k (litery 0..k-1)
  let rightOf: Path2D[] = [];     // wszystko na prawo od granicy k (litery k..5)
  let below = new Path2D();       // pod pasem cięcia (dolne połówki)
  let above = new Path2D();       // nad pasem cięcia (górne połówki)
  let cutAng: number[] = [];      // kąt, przy którym litera jest przecięta w całości
  let cutT: number[] = [];        // chwila (ms od startu) przecięcia litery w całości
  let aLeft = 0, aRight = 0;      // zakres kątów całego znaku (z zapasem)

  const angle = (x: number) => ((x - MID) * sc) / Rb;
  /** Punkt logo (x, y; y < 0 nad linią bazową) wygięty po łuku orbity → jednostki sceny. */
  const bend = (x: number, y: number): [number, number] => {
    const th = angle(x), r = Rb - y * sc;
    return [L!.cx + r * Math.sin(th), Cy - r * Math.cos(th)];
  };
  const polar = (th: number, r: number): [number, number] => [L!.cx + r * Math.sin(th), Cy - r * Math.cos(th)];
  /** Punkt litery l (sztywna ramka na łuku) → jednostki sceny. */
  const inLetter = (l: number, x: number, y: number): [number, number] => {
    const c = LOGO_LETTERS_BOX[LETTERS[l]].cx, th = angle(c);
    const [px, py] = polar(th, Rb);
    const u = (x - c) * sc, v = y * sc;
    return [px + u * Math.cos(th) - v * Math.sin(th), py + u * Math.sin(th) + v * Math.cos(th)];
  };
  /** Granica b w jednostkach sceny: średnia z ramek litery po lewej i po prawej (litery są sztywne, każda obrócona). */
  const boundPts = (b: number) => BOUNDS[b].map(([x, y]) => {
    const a = inLetter(Math.max(0, b - 1), x, y), c = inLetter(Math.min(5, b), x, y);
    return [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2] as [number, number];
  });
  /** Transformacja jednostek sceny → px urządzenia (na warstwie: względem prostokąta logo). */
  const base = (c: C2D, onLayer = false) =>
    c.setTransform(dpr * L!.k, 0, 0, dpr * L!.k, L!.ox * dpr - (onLayer ? bx : 0), L!.oy * dpr - (onLayer ? by : 0));
  /** Z jednostek sceny (bieżąca transformacja) z powrotem do px urządzenia - do drawImage warstw. */
  const toDevice = (c: C2D) => { c.scale(1 / (dpr * L!.k), 1 / (dpr * L!.k)); c.translate(-L!.ox * dpr, -L!.oy * dpr); };
  const gradient = (c: C2D) => {
    const g = c.createLinearGradient(0, -100, 0, 0); // w jednostkach logo (ramka litery)
    g.addColorStop(0, GRAD[0]); g.addColorStop(0.55, GRAD[1]); g.addColorStop(1, GRAD[2]);
    return g;
  };

  /** Klin od środka planety między kątami a..b (linia za gwiazdą, rozgrzany odcinek, światło krawędzi). */
  const wedge = (c: C2D, a: number, b: number) => {
    const r = Rb + 400 * sc, n = Math.max(2, Math.ceil(Math.abs(b - a) / 0.05));
    c.beginPath();
    c.moveTo(L!.cx, Cy);
    for (let s = 0; s <= n; s++) { const [x, y] = polar(a + ((b - a) * s) / n, r); c.lineTo(x, y); }
    c.closePath();
  };
  /** Krawędź pasa cięcia: koncentryczna z drogą gwiazdy (promień linii ± pół szczeliny w danym miejscu). */
  const kerfR = (th: number, side: -1 | 1) => rLine + side * kerfHalf(MID + (th * Rb) / sc) * sc;
  /** Pas cięcia między kątami a..b (do wymazania szczeliny za gwiazdą). */
  const kerfBand = (c: C2D, a: number, b: number) => {
    const n = Math.max(2, Math.ceil(Math.abs(b - a) / 0.004));
    c.beginPath();
    for (let s = 0; s <= n; s++) { const th = a + ((b - a) * s) / n; const [x, y] = polar(th, kerfR(th, -1)); if (s) c.lineTo(x, y); else c.moveTo(x, y); }
    for (let s = n; s >= 0; s--) { const th = a + ((b - a) * s) / n; const [x, y] = polar(th, kerfR(th, 1)); c.lineTo(x, y); }
    c.closePath();
  };

  /** Ramka litery: punkt litery na łuku (lift = przesunięcie promieniste), obrót prostopadle do krawędzi planety. */
  const letterFrame = (c: C2D, l: LogoPiece['letter'], lift = 0) => {
    const x = LOGO_LETTERS_BOX[l].cx, th = angle(x), r = Rb + lift * sc;
    c.translate(L!.cx + r * Math.sin(th), Cy - r * Math.cos(th));
    c.rotate(th);
    c.scale(sc, sc);
    c.translate(-x, 0);
  };
  /** Litera w całości (przed cięciem): dolna połówka + wypełnienie szczeliny + górna połówka cofnięta. */
  const wholeLetter = (c: C2D, l: LogoPiece['letter']) => {
    c.fill(down[l]!);
    c.beginPath();
    for (const poly of FILLS[l]) {
      c.moveTo(poly[0][0], poly[0][1]);
      for (let j = 1; j < poly.length; j++) c.lineTo(poly[j][0], poly[j][1]);
      c.closePath();
    }
    c.fill();
    c.save();
    c.translate(-LOGO_CUT_SHIFT, 0);
    c.fill(up[l]!);
    c.restore();
  };

  const starPath = (c: C2D) => {
    c.beginPath();
    let o = 0;
    for (const len of starLens) {
      c.moveTo(star[o], star[o + 1]);
      for (let j = 1; j < len; j++) c.lineTo(star[o + j * 2], star[o + j * 2 + 1]);
      c.closePath();
      o += len * 2;
    }
  };

  /** Warstwy nieruchome i regiony przycięcia - raz przy budowie. */
  const prepare = () => {
    for (const { c } of [WHOLE, LINE]) { c.width = bw; c.height = bh; }
    const g = gradient(WHOLE.x);
    for (const l of LETTERS) {
      WHOLE.x.save(); base(WHOLE.x, true); letterFrame(WHOLE.x, l); WHOLE.x.fillStyle = g; wholeLetter(WHOLE.x, l); WHOLE.x.restore();
    }
    LINE.x.save(); base(LINE.x, true); LINE.x.fillStyle = BLUE; starPath(LINE.x); LINE.x.fill(); LINE.x.restore();

    // regiony (jednostki sceny)
    const far = Rb + 400 * sc, near = Math.max(1, Rb - 200 * sc);
    const bounds = BOUNDS.map((_, b) => boundPts(b));
    aLeft = angle(LOGO_BOX.x - 80); aRight = angle(LOGO_BOX.x + LOGO_BOX.w + 120);
    const poly = (pts: [number, number][]) => {
      const p = new Path2D();
      pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
      p.closePath();
      return p;
    };
    const farR: [number, number][] = [polar(aRight, far), polar(aRight, near)];
    // granica idzie od dołu (blisko planety) do góry; dopięcie dalekimi punktami po lewej / prawej
    const ext = (pts: [number, number][]) => {
      const [x0, y0] = pts[0], [x1, y1] = pts[pts.length - 1];
      const th0 = Math.atan2(x0 - L!.cx, Cy - y0), th1 = Math.atan2(x1 - L!.cx, Cy - y1);
      return [polar(th0, near), ...pts, polar(th1, far)] as [number, number][];
    };
    letterClip = LETTERS.map((_, i) => poly([...ext(bounds[i]), ...ext(bounds[i + 1]).reverse()]));
    // lewa / prawa strona granicy: granica od dołu do góry, potem daleko po lewej / prawej (cięciwy na promieniach
    // `near` i `far` leżą pod literami i nad nimi)
    leftOf = bounds.map((b) => poly([polar(aLeft, near), ...ext(b), polar(aLeft, far)]));
    rightOf = bounds.map((b) => poly([...ext(b), ...farR]));
    const n = Math.ceil((aRight - aLeft) / 0.004);
    const inner: [number, number][] = [], outer: [number, number][] = [];
    for (let s = 0; s <= n; s++) {
      const th = aLeft + ((aRight - aLeft) * s) / n;
      inner.push(polar(th, kerfR(th, -1)));
      outer.push(polar(th, kerfR(th, 1)));
    }
    below = poly([[L!.cx, Cy], ...inner]);
    above = poly([...outer, ...Array.from({ length: 24 }, (_, i) => polar(aRight + ((aLeft - aRight) * i) / 23, far))]);

    // kiedy litera jest przecięta w całości: gwiazda mija jej ostatni punkt na wysokości cięcia
    cutAng = CUT_END_X.map((x, i) => { const [px, py] = inLetter(i, x, -LINE_Y); return Math.atan2(px - L!.cx, Cy - py); });
    cutT = cutAng.map((a) => {
      const hx = MID + (a * Rb) / sc;
      return STAR_AT + flightAt((hx - X0) / (X1 - X0)) * FLIGHT;
    });
  };

  const clear = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(ax, ay, aw, ah); };
  /** Warstwa przycięta do regionów (jednostki sceny), opcjonalnie obrócona wokół środka planety. */
  const blit = (src: HTMLCanvasElement, clips: Path2D[], rot = 0) => {
    ctx.save();
    base(ctx);
    if (rot) { ctx.translate(L!.cx, Cy); ctx.rotate(rot); ctx.translate(-L!.cx, -Cy); }
    for (const c of clips) ctx.clip(c);
    toDevice(ctx);
    ctx.drawImage(src, bx, by);
    ctx.restore();
  };
  const blitWedge = (src: HTMLCanvasElement, a: number, b: number) => {
    ctx.save();
    base(ctx);
    wedge(ctx, a, b);
    ctx.clip();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(src, bx, by);
    ctx.restore();
  };

  /** Litery w chwili t: k = liczba liter przeciętych w całości, headA = kąt czoła gwiazdy (null = przed cięciem). */
  const drawLetters = (t: number, k: number, headA: number | null) => {
    // litery jeszcze nieprzecięte w całości - w całości, bez ruchu
    if (k < LETTERS.length) {
      blit(WHOLE.c, k ? [rightOf[k]] : []);
      // szczelina za czołem gwiazdy znika z litery, przez którą gwiazda właśnie przechodzi
      if (headA !== null && headA > aLeft) {
        ctx.save();
        base(ctx);
        ctx.globalCompositeOperation = 'destination-out';
        kerfBand(ctx, aLeft, headA);
        ctx.fill();
        ctx.restore();
      }
    }
    if (!k) return;
    // litery przecięte: dolne połówki na miejscu, górne zsuwają się po łuku cięcia (obrót wokół środka planety)
    blit(WHOLE.c, [leftOf[k], below]);
    for (let i = 0; i < k; i++) {
      const s = Number.isFinite(t) ? outExpo((t - cutT[i]) / SLIDE) : 1;
      blit(WHOLE.c, [letterClip[i], above], delta * s);
    }
  };

  /** Ogon spadającej gwiazdy: zwężający się pas wzdłuż drogi lotu (okrąg linii logo), od czoła gwiazdy `len`
      jednostek logo w tył; barwy jak u spadającej gwiazdy na niebie hero (sky.ts): biel → chłodny błękit → nic. */
  const streak = (headX: number, len: number, alpha: number) => {
    const n = 28, pts: [number, number][] = [], back: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const s = i / n, x = headX - len * s, w = (STREAK_W / 2) * Math.pow(1 - s, 1.3) * sc;
      const th = angle(x);
      pts.push(polar(th, rLine + w));
      back.push(polar(th, rLine - w));
    }
    ctx.save();
    base(ctx);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    for (let i = back.length - 1; i >= 0; i--) ctx.lineTo(back[i][0], back[i][1]);
    ctx.closePath();
    const [hx, hy] = bend(headX, -LINE_Y), [ex, ey] = bend(headX - len, -LINE_Y);
    const g = ctx.createLinearGradient(hx, hy, ex, ey);
    g.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
    g.addColorStop(0.3, `rgba(226,232,255,${0.35 * alpha})`);
    g.addColorStop(1, 'rgba(186,200,255,0)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  };

  /** Ostre promienie gwiazdy (jak „klejnoty” nieba w hero): cztery włosowe linie od środka, gasnące ku końcom.
      Rysowane w ramce gwiazdy (jednostki sceny, oś x wzdłuż linii); poziome dłuższe niż pionowe. */
  const rays = (len: number, alpha: number) => {
    ctx.save();
    ctx.lineWidth = 1.25 / (dpr * L!.k); // ~1,25 px urządzenia
    ctx.lineCap = 'butt';
    for (const [dx, dy, k] of [[1, 0, 1], [-1, 0, 1], [0, 1, 0.58], [0, -1, 0.58]]) {
      const l = len * k;
      const g = ctx.createLinearGradient(0, 0, dx * l, dy * l);
      g.addColorStop(0, `rgba(${WHITE},${alpha})`);
      g.addColorStop(1, `rgba(${WHITE},0)`);
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * l, dy * l);
      ctx.stroke();
    }
    ctx.restore();
  };

  /** Światło gwiazdy na świeżych krawędziach cięcia: pas w kolorze marki wzdłuż obu brzegów szczeliny (koncentryczny
      z drogą gwiazdy), nałożony tylko na narysowane już litery (source-atop), gasnący w kilku klinach za gwiazdą. */
  const edgeLight = (headX: number, strength: number) => {
    const half = kerfHalf(Math.min(headX, 552));
    const rIn = rLine - (half + 3.4) * sc, rD = rLine - half * sc, rU = rLine + half * sc, rOut = rLine + (half + 3.4) * sc;
    const span = rOut - rIn;
    ctx.save();
    base(ctx);
    const rg = ctx.createRadialGradient(L!.cx, Cy, rIn, L!.cx, Cy, rOut);
    rg.addColorStop(0, `rgba(${EDGE_RGB},0)`);
    rg.addColorStop((rD - rIn) / span, `rgba(${EDGE_RGB},1)`);
    rg.addColorStop(0.5, `rgba(${EDGE_RGB},0.12)`);
    rg.addColorStop((rU - rIn) / span, `rgba(${EDGE_RGB},1)`);
    rg.addColorStop(1, `rgba(${EDGE_RGB},0)`);
    ctx.fillStyle = rg;
    ctx.globalCompositeOperation = 'source-atop';
    const N = 5;
    for (let i = 0; i < N; i++) {
      ctx.save();
      wedge(ctx, angle(headX - (EDGE * (i + 1)) / N), angle(headX - (EDGE * i) / N));
      ctx.clip();
      ctx.globalAlpha = strength * (1 - i / N) * 0.9;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  };

  /** Stan końcowy: wszystkie litery przecięte po łuku, górne połówki zsunięte, linia z gwiazdą. */
  const drawFinal = () => {
    clear();
    drawLetters(Infinity, LETTERS.length, null);
    blitWedge(LINE.c, aLeft, aRight);
  };

  /** Klatka wejścia w chwili t (ms od startu). Zwraca true, gdy coś się zmieniło. */
  const draw = (t: number): boolean => {
    // 1. cały napis NA RAZ wschodzi zza krawędzi planety: litery (całe, bez szczeliny) jadą promieniście z dołu,
    //    planeta zasłania to, co jeszcze jest pod horyzontem (przycięcie do okręgu planety), a części liter tuż nad
    //    horyzontem łapią błękitne światło jej krawędzi. Pełne krycie - nic nie prześwituje w miejscu cięcia.
    if (t < STAR_AT) {
      const p = rise(t / APPEAR);
      if (p >= 1) {
        if (holdDrawn) return false;
        holdDrawn = true;
        clear();
        ctx.drawImage(WHOLE.c, bx, by); // napis na miejscu (jeden obraz)
        return true;
      }
      clear();
      ctx.save();
      base(ctx);
      ctx.beginPath();
      ctx.rect(L!.xMin - 60, L!.yMin - 60, L!.xMax - L!.xMin + 120, L!.yMax - L!.yMin + 120);
      ctx.arc(L!.cx, Cy, L!.R, 0, Math.PI * 2);
      ctx.clip('evenodd');
      const lift = -(1 - p) * drop;
      for (const l of LETTERS) {
        ctx.save();
        letterFrame(ctx, l, lift);
        ctx.fillStyle = grad!;
        wholeLetter(ctx, l);
        ctx.restore();
      }
      // światło krawędzi planety na literach tuż nad horyzontem (tylko na już narysowanych pikselach liter)
      const rim = ctx.createRadialGradient(L!.cx, Cy, L!.R, L!.cx, Cy, L!.R + RIM * sc);
      rim.addColorStop(0, `rgba(${RIM_RGB},0.8)`);
      rim.addColorStop(1, `rgba(${RIM_RGB},0)`);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = rim;
      ctx.fillRect(L!.xMin - 60, L!.yMin - 60, L!.xMax - L!.xMin + 120, L!.yMax - L!.yMin + 120);
      ctx.restore();
      return true;
    }

    // 2. cięcie
    const u = (t - STAR_AT) / FLIGHT;
    const f = flight(u);
    const headX = X0 + (X1 - X0) * f;
    const headA = angle(headX);
    // gwiazda pojawia się już w locie (jak spadająca gwiazda), na odcinku wlotu przed czubkiem linii
    const born = outCubic((headX - X0) / LEAD);
    // na końcówce gwiazda rośnie do pełnej wielkości gwiazdy logo
    const grow = clamp01((u - 0.62) / 0.38);
    const arrived = t - (STAR_AT + FLIGHT);
    let k = 0;
    while (k < LETTERS.length && headA >= cutAng[k]) k++;

    clear();
    drawLetters(t, k, headA);
    // linia za gwiazdą (po dolocie cała, z gwiazdą logo)
    blitWedge(LINE.c, aLeft, arrived < 0 ? headA : aRight);

    const [hx, hy] = bend(headX, -LINE_Y);
    // rozgrzany odcinek tuż za gwiazdą: biel na czole, stygnie do niebieskiego
    const heat = arrived < 0 ? 1 : 1 - clamp01(arrived / COOL);
    if (heat > 0.001) {
      ctx.save();
      base(ctx);
      wedge(ctx, angle(headX - HOT), headA);
      ctx.clip();
      const tx = Math.cos(headA), ty = Math.sin(headA), len = HOT * sc;
      const g = ctx.createLinearGradient(hx, hy, hx - tx * len, hy - ty * len);
      g.addColorStop(0, `rgba(${WHITE},${0.95 * heat})`);
      g.addColorStop(1, `rgba(${WHITE},0)`);
      ctx.fillStyle = g;
      starPath(ctx);
      ctx.fill();
      ctx.restore();
    }
    // świeże krawędzie cięcia łapią światło gwiazdy (kolor marki) i stygną za nią
    if (heat > 0.001 && headX > LOGO_BOX.x) edgeLight(headX, heat);
    // ogon spadającej gwiazdy (te same barwy co spadająca gwiazda na niebie hero): zwężający się pas po drodze lotu,
    // biel przy gwieździe, chłodny błękit dalej; długość rośnie i maleje z prędkością (widać rozpęd i hamowanie)
    const tail = Math.min(STREAK * speed(u), headX - X0 + 10);
    if (tail > 2 && arrived < 0) streak(headX, tail, born);

    // gwiazda na czole: w kolorze marki (biała zlewałaby się z białymi literami, przez które przelatuje) z rozgrzanym,
    // białym środkiem; w locie nieco mniejsza, przy hamowaniu rośnie do wielkości gwiazdy logo, po dolocie środek stygnie
    ctx.save();
    base(ctx);
    ctx.translate(hx, hy);
    ctx.rotate(headA);
    // promienie: krótki błysk przy lądowaniu
    const glint = arrived < 0 ? 0 : clamp01(arrived / GLINT);
    const landRays = arrived < 0 ? 0 : (glint < 0.16 ? glint / 0.16 : 1 - (glint - 0.16) / 0.84) * 0.85;
    if (landRays > 0.01) rays(sc * (60 + 130 * outCubic(glint)), landRays);
    const s = sc * (0.72 + 0.28 * grow * grow * (3 - 2 * grow));
    ctx.scale(s, s);
    ctx.globalAlpha = born;
    ctx.fillStyle = BLUE;
    ctx.fill(gem);
    if (heat > 0.001) {
      ctx.scale(0.46, 0.46);
      ctx.globalAlpha = born * heat;
      ctx.fillStyle = `rgb(${WHITE})`;
      ctx.fill(gem);
    }
    ctx.restore();
    return true;
  };

  return {
    get canvas() { return canvas; },
    get topY() { return topY; },
    get done() { return done; },
    get ownsReflection() { return false; },

    build(layout, animate, at) {
      L = layout;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const hCss = layout.mobile ? Math.min(layout.H, Math.ceil(layout.horizon + 48)) : layout.H;
      canvas.style.display = 'block';
      canvas.style.width = `${layout.W}px`;
      canvas.style.height = `${hCss}px`;
      canvas.width = Math.max(1, Math.round(layout.W * dpr));
      canvas.height = Math.max(1, Math.round(hCss * dpr));
      sc = (layout.logoW * LOGO_SPAN) / LOGO_BOX.w;
      Rb = layout.R + layout.gap;
      Cy = layout.horizon + layout.R;
      rLine = Rb + LINE_Y * sc;
      delta = (LOGO_CUT_SHIFT * sc) / (Rb + 82 * sc); // zsunięcie górnej połówki o 3u po łuku (mierzone w jej środku)
      topY = Cy - (Rb + 100 * sc);
      drop = layout.gap / sc + 106;
      // prostokąty w px urządzenia, przycięte do płótna: logo (warstwy poza ekranem - ciasno, z zapasem na
      // zsunięcie połówek) i obszar czyszczony w każdej klatce (dodatkowo promienie gwiazdy)
      const rect = (xa: number, xb: number, ys: number[]) => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (let x = xa; x <= xb + 0.001; x += (xb - xa) / 40) {
          for (const y of ys) {
            const [px, py] = bend(x, y);
            x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
          }
        }
        const m = 24 * sc;
        const toX = (v: number) => (layout.ox + v * layout.k) * dpr, toY = (v: number) => (layout.oy + v * layout.k) * dpr;
        const rx = Math.max(0, Math.floor(toX(x0 - m))), ry = Math.max(0, Math.floor(toY(y0 - m)));
        return {
          x: rx, y: ry,
          w: Math.max(1, Math.min(canvas.width, Math.ceil(toX(x1 + m))) - rx),
          h: Math.max(1, Math.min(canvas.height, Math.ceil(toY(y1 + m))) - ry),
        };
      };
      ({ x: bx, y: by, w: bw, h: bh } = rect(LOGO_BOX.x - 25, LOGO_BOX.x + LOGO_BOX.w + 25, [layout.gap / sc + 8, -LINE_Y, -104]));
      ({ x: ax, y: ay, w: aw, h: ah } = rect(LOGO_BOX.x - 240, LOGO_BOX.x + LOGO_BOX.w + 200, [Math.max(75, layout.gap / sc + 8), -LINE_Y, -200]));
      // linia z gwiazdą wygięta po łuku raz (jednostki sceny)
      const pts: number[] = [];
      starLens = [];
      for (const poly of STAR_POLYS) { starLens.push(poly.length); for (const [x, y] of poly) pts.push(...bend(x, y)); }
      star = new Float32Array(pts);
      grad = gradient(ctx);
      prepare();
      startAt = at;
      holdDrawn = false;
      done = !animate;
      if (!animate) drawFinal();
    },

    frame(now) {
      if (!L || done) return false;
      const t = now - startAt;
      if (t < 0) return false;
      if (t >= END) { drawFinal(); done = true; return true; }
      return draw(t);
    },

    destroy() {
      L = null; done = true;
      canvas.width = canvas.height = 1;
      for (const { c } of [WHOLE, LINE]) c.width = c.height = 1;
    },
  };
}
