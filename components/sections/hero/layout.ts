// Geometria sceny hero. ŹRÓDŁEM PRAWDY jest CSS: element [data-hero-anchor]
// (okrąg planety pozycjonowany względem bloku CTA - patrz .hero-* w globals.css).
// JS tylko MIERZY jego rect i z tego wyprowadza horyzont / promień / środek, więc
// canvasy zawsze zgadzają się z fallbackiem CSS i z layoutem tekstu (zero driftu).
//
// Desktop (>=1024): "jednostka sceny" = px kadru projektowego 1440x900 z handoffu
//   (horyzont y=602, środek x=720, R=1300); k = px CSS na jednostkę.
// Mobile (<1024): jednostka sceny = px CSS (k=1), kompozycja pionowa.

export interface HeroPointer {
  /** Wygładzona pozycja znormalizowana 0..1 (światło planety, paralaksa). */
  x: number; y: number;
  tx: number; ty: number;
  /** Surowa pozycja w jednostkach sceny; -1 gdy kursor poza sekcją. */
  px: number; py: number;
}

export interface HeroNode {
  /** Indeks węzła w słowniku (0..5) → etykieta "0{index+1}". */
  index: number;
  x: number; y: number;
  /** Etykieta po lewej stronie węzła (gdy po prawej wyszłaby poza ekran). */
  flip: boolean;
}

export interface HeroLayout {
  W: number; H: number;
  mobile: boolean;
  /** <640px: same kropki (bez siatki linii) i bez odbicia - README "Responsive". */
  compact: boolean;
  k: number; ox: number; oy: number;
  cx: number; horizon: number; R: number;
  /** Widoczny zakres w jednostkach sceny. */
  xMin: number; xMax: number; yMin: number; yMax: number;
  logoW: number; gap: number;
  step: number; dotR: number; link: number; lines: boolean;
  nodes: HeroNode[];
  links: [number, number][];
  /** Dolna granica gwiazd (jednostki sceny). */
  starsBottom: number;
  /** Mnożnik rozmiarów dekoracji nieba (promienie, linie) względem makiety. */
  deco: number;
  /** Skala etykiet DOM w px CSS (= --u z CSS: clamp(0.9, k, 1.75) na desktopie, 1 na mobile). */
  labelScale: number;
}

const DESIGN_NODES: [number, number][] = [
  [268, 262], [452, 168], [668, 214], [870, 150], [1074, 236], [1206, 318],
];
const DESIGN_LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 4]];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function measureLayout(section: HTMLElement, anchor: HTMLElement): HeroLayout | null {
  const sr = section.getBoundingClientRect();
  const pr = anchor.getBoundingClientRect();
  const W = sr.width, H = sr.height;
  if (W < 10 || H < 10 || pr.width < 10) return null;

  const Rcss = pr.width / 2;
  const cxCss = pr.left - sr.left + Rcss;
  const horizonCss = pr.top - sr.top;
  const mobile = W < 1024;
  const compact = W < 640;

  if (!mobile) {
    // Identyczna formuła jak --su w CSS (vw/vh liczone od okna, nie od sekcji).
    const k = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
    const ox = cxCss - 720 * k;
    const oy = horizonCss - 602 * k;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const step = lowPower ? 3.6 : 3;
    return {
      W, H, mobile, compact, k, ox, oy,
      cx: 720, horizon: 602, R: Rcss / k,
      xMin: -ox / k, xMax: (W - ox) / k, yMin: -oy / k, yMax: (H - oy) / k,
      logoW: 1190, gap: 28,
      step, dotR: 1.25 * (step / 3), link: 5.6 * (step / 3), lines: true,
      nodes: DESIGN_NODES.map(([x, y], index) => ({ index, x, y, flip: false })),
      links: DESIGN_LINKS,
      starsBottom: 520,
      deco: 1,
      labelScale: clamp(k, 0.9, 1.75),
    };
  }

  // Wygięcie po łuku rozszerza wierzchołki liter ~1,17x względem linii bazowej -
  // drugi limit pilnuje, żeby ramiona "A" i "Y" nie wyszły poza ekran (tablet).
  const logoW = Math.min(W - 80, (W - 24) / 1.175, 760);
  const gap = clamp(W * 0.0194, 8, 20);
  const capH = logoW * 0.193; // wysokość wersalików Inter 800 przy szerokości logoW
  const step = compact ? 2.4 : 2.8;

  // Konstelacja żyje między navbarem a logotypem; gdy brak miejsca (niskie ekrany) - same gwiazdy.
  const top = 88;
  const bottom = horizonCss - gap - capH - 30;
  const h = bottom - top;
  let nodes: HeroNode[] = [];
  let links: [number, number][] = [];
  if (compact) {
    if (h >= 180) {
      // WSZYSTKIE 6 usług (decyzja właściciela): zygzak - każdy węzeł ma WŁASNY rząd, parzyste
      // po lewej (etykieta w prawo), nieparzyste po prawej (etykieta odbita w lewo). Etykiety
      // nigdy nie dzielą rzędu, więc mieszczą się nawet na 320 px; linie biegnące pod etykietą
      // chowa jej ciemne tło (.hero-node-text::before na mobile). Zakotwiczone nisko, nad logotypem.
      const pitch = Math.min(44, (h - 12) / 5.4);
      const t0 = bottom - pitch * 5 - 6;
      const xl = [0.085, 0.15, 0.085], xr = [0.915, 0.85, 0.915];
      nodes = [0, 1, 2, 3, 4, 5].map((index) => {
        const right = index % 2 === 1, row = Math.floor(index / 2);
        return { index, flip: right, x: W * (right ? xr[row] : xl[row]), y: t0 + pitch * index };
      });
      links = DESIGN_LINKS.slice(0, 5); // łańcuch 01→02→…→06
    } else if (h >= 110) {
      // Niski ekran: 4 węzły (01, 03, 04, 06), etykiety po prawej stronie ekranu odbite w lewo.
      const hh = Math.min(h, 240);
      const t0 = top + (h - hh) * 0.86;
      nodes = [
        { index: 0, x: W * 0.08, y: t0 + hh * 0.62, flip: false },
        { index: 2, x: W * 0.3, y: t0 + hh * 0.08, flip: false },
        { index: 3, x: W * 0.92, y: t0 + hh * 0.3, flip: true },
        { index: 5, x: W * 0.62, y: t0 + hh * 0.95, flip: true },
      ];
      links = [[0, 1], [1, 2], [2, 3]];
    }
  } else if (h >= 110) {
    const hh = Math.min(h, 300);
    const t0 = top + (h - hh) * 0.8;
    const fx = [0.12, 0.27, 0.45, 0.6, 0.78, 0.9];
    const fy = [0.67, 0.11, 0.38, 0, 0.51, 1];
    nodes = fx.map((f, index) => ({ index, x: W * f, y: t0 + hh * fy[index], flip: f > 0.7 }));
    links = DESIGN_LINKS;
  }

  return {
    W, H, mobile, compact, k: 1, ox: 0, oy: 0,
    cx: cxCss, horizon: horizonCss, R: Rcss,
    xMin: 0, xMax: W, yMin: 0, yMax: H,
    logoW, gap,
    step, dotR: step * 0.42, link: step * 1.87, lines: !compact,
    nodes, links,
    starsBottom: Math.max(120, horizonCss - 40),
    deco: compact ? 0.85 : 0.95,
    labelScale: 1,
  };
}
