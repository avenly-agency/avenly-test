// Warstwa 4 handoffu: logotyp AVENLY (canvas). Sampling → wygięcie po orbicie → sprężyny →
// siatka sąsiedztwa pochodzą z hero-12a.html; zachowanie zmienione decyzją właściciela:
//   1. WEJŚCIE  - cząstki zlatują się; każda, która DOTARŁA na miejsce (calm→1), od razu puchnie
//      i zlewa się z sąsiadami w lity napis (globalny `melt` rośnie z odsetkiem zebranych cząstek),
//   2. SPOCZYNEK - lity napis (czyste litery po łuku); warstwa nie rysuje NIC,
//   3. HOVER/DOTYK - wokół kursora napis rozpada się na cząstki, kursor je odpycha; po odjechaniu
//      "dziura" się zamyka i napis wraca do litego.
// Przejście cząstki ↔ lity jest BEZSZWOWE: nie ma przenikania alfą dwóch warstw - spuchnięte
// kropki mają kolor litego napisu i zlewają się w ciągłe wypełnienie, a lity materiał kończy się
// ukryty POD nimi (profil HOLE wspólny dla obu rendererów - patrz particles-gl.ts).
// Poza tym: fizyka w stałym kroku 60 Hz; DWA renderery: desktop = GPU (particles-gl.ts),
// mobile / brak wsparcia = canvas 2D (bitmapa litego napisu + kropki w koszykach rozmiaru).

import type { HeroLayout, HeroPointer } from './layout';
import { createParticleGL, HOLE, SWELL_DIAMETER, type ParticleGL, type SolidText } from './particles-gl';

const TEXT = 'AVENLY';
const TRACKING = -0.06; // em
const ENTRANCE_MS = 3600; // twardy limit wejścia (zwykle melt kończy je wcześniej)
const RAMP_MS = 1400;
const MAX_DELAY_MS = 900;
const MELT_MS = 110;      // stała czasowa zlewania (krótka: "od razu jak się zbiorą")
const HOLE_MS = 190;      // otwieranie/zamykanie dziury
const HOLE_FOLLOW_MS = 60; // wygładzenie podążania dziury za kursorem
const STEP_MS = 1000 / 60;
const LEVELS = 6;
const GRID = 24;
const GRAD = [[248, 250, 252], [238, 242, 249], [207, 220, 246]]; // stopnie gradientu litego: 0 / .55 / 1
const DOT_RGB = [241, 245, 249];
const TONES = 6; // 2D: pasma wysokości litery dla koloru spuchniętych kropek (mniej = widoczne pasy)
/** Kolor gradientu litego napisu dla t ∈ 0..1 (0 = góra wersalików, 1 = linia bazowa). */
const gradAt = (t: number) => {
  const lo = t < 0.55 ? 0 : 1, f = lo === 0 ? t / 0.55 : (t - 0.55) / 0.45;
  return GRAD[lo].map((v, i) => v + (GRAD[lo + 1][i] - v) * f);
};

const smooth = (v: number) => { const t = Math.min(1, Math.max(0, v)); return t * t * (3 - 2 * t); };

export interface ParticleLayer {
  readonly canvas: HTMLCanvasElement;
  /**
   * Próbkuje logotyp dla layoutu. animate=false → od razu stan spoczynkowy (lity napis).
   * animate=true → BEZ siatki sąsiedztwa i litego napisu: wywołaj link() / prepareSolid()
   * w osobnych taskach (wszystko naraz = long task > 50 ms).
   */
  build(layout: HeroLayout, fontFamily: string, animate: boolean, startAt: number): void;
  /** Buduje siatkę sąsiedztwa (linie mesh) po build(animate=true). */
  link(): void;
  /** Raster + bitmapa/tekstura litego napisu - osobny task (potrzebne, gdy cząstki zaczną się zlewać). */
  prepareSolid(): void;
  /** Zwraca true, gdy zawartość canvasa zmieniła się w tej klatce (→ odbicie 2D). */
  frame(now: number, pointer: HeroPointer): boolean;
  /** Pas źródłowy dla odbicia (jednostki sceny): górna krawędź liter. */
  readonly topY: number;
  /** true = renderer GPU sam rysuje odbicie (scena pomija canvas 2D odbicia). */
  readonly ownsReflection: boolean;
  destroy(): void;
}

export function createParticles(
  canvas: HTMLCanvasElement,
  interactive: boolean,
  /** Kontekst GPU przepadł → scena ma przebudować warstwę (spadnie na renderer 2D). */
  onRendererLost: () => void,
): ParticleLayer {
  const ctx = canvas.getContext('2d')!;
  let glr: ParticleGL | null = null;
  let glTried = false;
  let useGL = false;
  let buildToken = 0; // unieważnia odroczone wgrania po przebudowie (resize)

  const solidBmp = document.createElement('canvas'); // 2D: lity napis wygięty po łuku
  const sctx = solidBmp.getContext('2d')!;

  let L: HeroLayout | null = null;
  let family = 'sans-serif';
  let dpr = 1;
  let n = 0;
  let tx = new Float32Array(0), ty = new Float32Array(0);
  let x = new Float32Array(0), y = new Float32Array(0);
  let vx = new Float32Array(0), vy = new Float32Array(0);
  let dl = new Float32Array(0), ez = new Float32Array(0);
  let calm = new Float32Array(0); // 1 = cząstka na miejscu, 0 = w locie / odepchnięta
  let tone = new Uint8Array(0);   // 2D: pasmo wysokości litery (kolor spuchniętej kropki)
  let on = new Uint8Array(0), active = new Uint8Array(0);
  let mark = new Int32Array(0);
  let nbStart = new Int32Array(1), nb = new Int32Array(0);
  let gStart = new Int32Array(1), gItems = new Int32Array(0);
  let gCols = 1, gRows = 1, gX0 = 0, gY0 = 0;
  let allIdx = new Int32Array(0);
  let activeList: number[] = [];
  let frameId = 0;
  let startAt = 0;
  let lastNow = 0;
  let acc = 0;
  let settled = false;
  let melt = 0;
  let solidReady = false;
  let restDrawn = false; // stan spoczynkowy już narysowany → brak kolejnych klatek
  let holeR = 0, holeX = 0, holeY = 0;
  let drawLines = true;
  let slowFrames = 0;
  let topY = 0;
  let bounds = { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  let metrics = { size: 100, w: 1, h: 1, mid: 0, base: 0, x0: 0, baseY: 0 };
  // Prostokąt bitmapy litego napisu (jednostki sceny) + jej rozmiar w px urządzenia.
  let cX = 0, cY = 0, bmpW = 1, bmpH = 1;

  const holeMax = () => (L ? Math.max(80, 205 * (L.logoW / 1190)) : 0);
  // Odpychanie kończy się PRZED pasem spuchniętych kropek (swell0): w pasie zlewającym się
  // z litym napisem wszystkie cząstki stoją dokładnie na literach → idealnie równa krawędź.
  const repelRadius = () => holeMax() * (HOLE.swell0 - 0.02);

  const setSceneTransform = (c: CanvasRenderingContext2D) => {
    if (!L) return;
    const s = dpr * L.k;
    c.setTransform(s, 0, 0, s, L.ox * dpr, L.oy * dpr);
  };
  /** Bitmapa litego: początek wyrównany do całego piksela urządzenia (ostry blit 1:1). */
  const bmpOrigin = () => (L ? { x: Math.round((L.ox + cX * L.k) * dpr), y: Math.round((L.oy + cY * L.k) * dpr) } : { x: 0, y: 0 });

  /** Rysuje napis litera po literze (ten sam układ dla samplingu i rastra hi-res). */
  const drawText = (o: CanvasRenderingContext2D, size: number, x0: number, baseY: number) => {
    o.font = `800 ${size}px ${family}`;
    o.textBaseline = 'alphabetic';
    o.fillStyle = '#fff';
    // ctx.letterSpacing nie istnieje w Safari < 17 / starszych Firefoxach. Pozycja =
    // szerokość(prefiks + litera) - szerokość(litera): zawiera kerning pary z POPRZEDNIĄ literą
    // (AV, LY) - sam prefiks by go zgubił i logotyp wyszedłby szerszy.
    for (let i = 0; i < TEXT.length; i++) {
      const px = o.measureText(TEXT.slice(0, i + 1)).width - o.measureText(TEXT[i]).width + TRACKING * size * i;
      o.fillText(TEXT[i], x0 + px, baseY);
    }
  };

  const sample = (layout: HeroLayout) => {
    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const probe = 200;
    o.font = `800 ${probe}px ${family}`;
    const advance = (o.measureText(TEXT).width + TRACKING * probe * TEXT.length) / probe;
    const size = Math.max(24, Math.floor(layout.logoW / advance));
    const w = Math.ceil(layout.logoW + size * 0.3);
    const h = Math.ceil(size * 1.15);
    off.width = w; off.height = h;
    const baseY = Math.round(size * 0.92), x0 = size * 0.12;
    drawText(o, size, x0, baseY);
    const data = o.getImageData(0, 0, w, h).data;
    const xs: number[] = [], ys: number[] = [];
    const st = layout.step, jit = st / 2;
    let minX = 1e9, maxX = -1e9, base = -1e9;
    for (let py = 0; py < h; py += st) {
      const row = Math.round(py) * w;
      for (let px = 0; px < w; px += st) {
        if (data[(row + Math.round(px)) * 4 + 3] > 128) {
          const sx = px + (Math.random() - 0.5) * jit, sy = py + (Math.random() - 0.5) * jit;
          xs.push(sx); ys.push(sy);
          if (sx < minX) minX = sx; if (sx > maxX) maxX = sx;
          if (sy > base) base = sy;
        }
      }
    }
    // Wygięcie po orbicie: spody liter leżą `gap` nad horyzontem, litery prostopadle do łuku.
    const R = layout.R + layout.gap;
    const Cy = layout.horizon + layout.R;
    const mid = (minX + maxX) / 2;
    const count = xs.length;
    const outX = new Float32Array(count), outY = new Float32Array(count);
    const tones = new Uint8Array(count);
    const gTop = baseY - size * 0.74, gLen = size * 0.74;
    for (let i = 0; i < count; i++) {
      const th = (xs[i] - mid) / R, r = R + (base - ys[i]);
      outX[i] = layout.cx + r * Math.sin(th);
      outY[i] = Cy - r * Math.cos(th);
      tones[i] = Math.min(TONES - 1, Math.max(0, Math.floor(((ys[i] - gTop) / gLen) * TONES)));
    }
    metrics = { size, w, h, mid, base, x0, baseY };
    return { outX, outY, tones, count };
  };

  /** Raster prostego napisu w rozdzielczości urządzenia, zabarwiony subtelnym gradientem. */
  const rasterSolid = (): SolidText | null => {
    if (!L) return null;
    const { size, w, h, mid, base, x0, baseY } = metrics;
    const q = Math.min(L.k * dpr * 1.15, 4096 / w, useGL ? 3 : 2);
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.ceil(w * q)); cv.height = Math.max(1, Math.ceil(h * q));
    const o = cv.getContext('2d', { willReadFrequently: !useGL })!;
    o.setTransform(q, 0, 0, q, 0, 0);
    drawText(o, size, x0, baseY);
    // Zabarwienie: jasna, chłodna biel u góry → lekko błękitna przy planecie (łapie jej poświatę).
    // TEN SAM gradient liczą cząstki (VS w particles-gl.ts / pasma `tone` w 2D) - nie zmieniać osobno.
    o.globalCompositeOperation = 'source-in';
    const g = o.createLinearGradient(0, baseY - size * 0.74, 0, baseY);
    const hex = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;
    g.addColorStop(0, hex(GRAD[0])); g.addColorStop(0.55, hex(GRAD[1])); g.addColorStop(1, hex(GRAD[2]));
    o.fillStyle = g; o.fillRect(0, 0, w, h);
    return { canvas: cv, w, h, mid, base, gradLen: size * 0.74, gradBaseOff: baseY - base };
  };

  /** 2D: wygina napis po łuku mapowaniem ODWROTNYM piksel po pikselu (dla każdego piksela
   *  bitmapy liczymy kąt i promień względem środka planety → punkt w prostym rastrze → alfa
   *  dwuliniowo). Wyginanie paskami drawImage zostawiało prążki na szwach pasków. Kolor liczony
   *  analitycznie z tego samego gradientu co w rasterSolid (interpolacja RGB po krawędziach
   *  z alfa=0 dawałaby ciemne obwódki). */
  const buildSolid2D = (text: SolidText) => {
    if (!L) return;
    const W = bmpW, H = bmpH;
    solidBmp.width = W; solidBmp.height = H;
    const src = text.canvas.getContext('2d')!.getImageData(0, 0, text.canvas.width, text.canvas.height);
    const sw = src.width, sh = src.height, sd = src.data;
    const q = sw / text.w;
    const out = sctx.createImageData(W, H), od = out.data;
    const s = dpr * L.k, o = bmpOrigin();
    const arc = L.R + L.gap, Cy = L.horizon + L.R, cx = L.cx;
    const gTop = metrics.baseY - text.gradLen;
    const alphaAt = (fx: number, fy: number) => {
      if (fx < 0 || fy < 0 || fx >= sw - 1 || fy >= sh - 1) return 0;
      const x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0, i = (y0 * sw + x0) * 4 + 3;
      return (sd[i] * (1 - ax) + sd[i + 4] * ax) * (1 - ay) + (sd[i + sw * 4] * (1 - ax) + sd[i + sw * 4 + 4] * ax) * ay;
    };
    for (let py = 0; py < H; py++) {
      const Y = (py + 0.5 + o.y - L.oy * dpr) / s, vyy = Cy - Y;
      for (let px = 0; px < W; px++) {
        const vxx = (px + 0.5 + o.x - L.ox * dpr) / s - cx;
        const r = Math.sqrt(vxx * vxx + vyy * vyy);
        const ys = text.base - (r - arc);
        if (ys < 0 || ys > text.h) continue;
        const al = alphaAt((text.mid + Math.atan2(vxx, vyy) * arc) * q, ys * q);
        if (al < 1) continue;
        const t = Math.min(1, Math.max(0, (ys - gTop) / text.gradLen));
        const lo = t < 0.55 ? 0 : 1, f = lo === 0 ? t / 0.55 : (t - 0.55) / 0.45;
        const k = (py * W + px) * 4;
        od[k] = GRAD[lo][0] + (GRAD[lo + 1][0] - GRAD[lo][0]) * f;
        od[k + 1] = GRAD[lo][1] + (GRAD[lo + 1][1] - GRAD[lo][1]) * f;
        od[k + 2] = GRAD[lo][2] + (GRAD[lo + 1][2] - GRAD[lo][2]) * f;
        od[k + 3] = al;
      }
    }
    sctx.putImageData(out, 0, 0);
  };

  const buildSolid = () => {
    const text = rasterSolid();
    if (!text) return;
    if (useGL && glr) glr.setSolid(text); else buildSolid2D(text);
    solidReady = true;
  };

  const buildGrid = (cell: number, minX: number, minY: number, cols: number, rows: number) => {
    const counts = new Int32Array(cols * rows + 1);
    const keys = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      const k = Math.floor((ty[i] - minY) / cell) * cols + Math.floor((tx[i] - minX) / cell);
      keys[i] = k; counts[k + 1]++;
    }
    for (let i = 0; i < cols * rows; i++) counts[i + 1] += counts[i];
    const items = new Int32Array(n);
    const cursor = counts.slice(0, cols * rows);
    for (let i = 0; i < n; i++) items[cursor[keys[i]]++] = i;
    return { start: counts, items };
  };

  /** deferUpload: wgranie ~2 MB krawędzi na GPU idzie w OSOBNYM tasku (razem z szukaniem
   *  sąsiadów przekraczało 50 ms = long task w Lighthouse). */
  const buildNeighbours = (deferUpload = false) => {
    const { minX, minY, maxX, maxY } = bounds;
    if (!L || !L.lines) { nbStart = new Int32Array(n + 1); nb = new Int32Array(0); return; }
    const cell = L.link, l2 = cell * cell;
    const cols = Math.floor((maxX - minX) / cell) + 1, rows = Math.floor((maxY - minY) / cell) + 1;
    const { start, items } = buildGrid(cell, minX, minY, cols, rows);
    const a: number[] = [], b: number[] = [];
    const deg = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) {
      const gx = Math.floor((tx[i] - minX) / cell), gy = Math.floor((ty[i] - minY) / cell);
      for (let oy = -1; oy <= 1; oy++) {
        const yy = gy + oy; if (yy < 0 || yy >= rows) continue;
        for (let ox = -1; ox <= 1; ox++) {
          const xx = gx + ox; if (xx < 0 || xx >= cols) continue;
          const c = yy * cols + xx;
          for (let s = start[c]; s < start[c + 1]; s++) {
            const j = items[s]; if (j <= i) continue;
            const dx = tx[j] - tx[i], dy = ty[j] - ty[i];
            if (dx * dx + dy * dy < l2) { a.push(i); b.push(j); deg[i + 1]++; deg[j + 1]++; }
          }
        }
      }
    }
    for (let i = 0; i < n; i++) deg[i + 1] += deg[i];
    nbStart = deg;
    nb = new Int32Array(a.length * 2);
    const cur = deg.slice(0, n);
    for (let e = 0; e < a.length; e++) { nb[cur[a[e]]++] = b[e]; nb[cur[b[e]]++] = a[e]; }
    if (!useGL || !glr) return;
    if (!deferUpload) { glr.setEdges(a, b); return; }
    const token = ++buildToken;
    window.setTimeout(() => { if (token === buildToken && useGL && glr) glr.setEdges(a, b); }, 0);
  };

  const physics = (i: number, ease: number, mpx: number, mpy: number, radius: number) => {
    const stiff = 0.015 + ease * 0.07;
    let fx = (tx[i] - x[i]) * stiff, fy = (ty[i] - y[i]) * stiff;
    if (mpx >= 0) {
      const dx = x[i] - mpx, dy = y[i] - mpy, d = Math.sqrt(dx * dx + dy * dy);
      if (d < radius && d > 0) { const f = (1 - d / radius) * 4.5; fx += (dx / d) * f; fy += (dy / d) * f; }
    }
    vx[i] = (vx[i] + fx) * 0.84; vy[i] = (vy[i] + fy) * 0.84;
    x[i] += vx[i]; y[i] += vy[i];
  };

  /** calm: 1 gdy cząstka stoi na celu (≤0,5 jedn.), 0 gdy dalej niż 2,5 jedn. */
  const calmOf = (i: number) => {
    const dx = x[i] - tx[i], dy = y[i] - ty[i];
    return 1 - smooth((Math.sqrt(dx * dx + dy * dy) - 0.5) / 2);
  };

  const clearAll = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const gridRange = (x0: number, y0: number, x1: number, y1: number, visit: (i: number) => void) => {
    const c0 = Math.max(0, Math.floor((x0 - gX0) / GRID)), c1 = Math.min(gCols - 1, Math.floor((x1 - gX0) / GRID));
    const r0 = Math.max(0, Math.floor((y0 - gY0) / GRID)), r1 = Math.min(gRows - 1, Math.floor((y1 - gY0) / GRID));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const cell = r * gCols + c;
      for (let s = gStart[cell]; s < gStart[cell + 1]; s++) visit(gItems[s]);
    }
  };

  /** Koniec wejścia: cząstki na miejscu przypięte do celu, reszta zostaje aktywna. */
  const settle = () => {
    activeList = [];
    for (let i = 0; i < n; i++) {
      ez[i] = 1; on[i] = 1;
      if (calm[i] < 0.999 || Math.abs(vx[i]) + Math.abs(vy[i]) > 0.05) { active[i] = 1; activeList.push(i); }
      else { x[i] = tx[i]; y[i] = ty[i]; vx[i] = vy[i] = 0; calm[i] = 1; active[i] = 0; }
    }
    melt = 1;
    settled = true;
    restDrawn = false;
    if (!solidReady) buildSolid();
  };

  /** Aktywacja cząstek przy kursorze + krok fizyki aktywnych. Zwraca liczbę aktywnych przed wygaszeniem. */
  const stepActive = (mpx: number, mpy: number, steps: number): number => {
    const radius = repelRadius(), reach = radius + 8;
    if (mpx >= 0) {
      gridRange(mpx - reach, mpy - reach, mpx + reach, mpy + reach, (i) => {
        if (!active[i] && Math.abs(tx[i] - mpx) < reach && Math.abs(ty[i] - mpy) < reach) { active[i] = 1; activeList.push(i); }
      });
    }
    const count = activeList.length;
    if (!count) return 0;
    for (let s = 0; s < steps; s++) for (const i of activeList) physics(i, 1, mpx, mpy, radius);
    const next: number[] = [];
    for (const i of activeList) {
      const near = mpx >= 0 && Math.abs(tx[i] - mpx) < reach && Math.abs(ty[i] - mpy) < reach;
      if (near || Math.abs(x[i] - tx[i]) > 0.25 || Math.abs(y[i] - ty[i]) > 0.25 || Math.abs(vx[i]) + Math.abs(vy[i]) > 0.05) { calm[i] = calmOf(i); next.push(i); }
      else { x[i] = tx[i]; y[i] = ty[i]; vx[i] = vy[i] = 0; calm[i] = 1; active[i] = 0; }
    }
    activeList = next;
    return count;
  };

  /** Dziura przy kursorze: promień dąży wykładniczo do celu, środek płynnie podąża za kursorem. */
  const stepHole = (mpx: number, mpy: number, dt: number, allowed: boolean) => {
    const hm = holeMax(), b = bounds;
    const over = allowed && mpx >= 0 && mpx > b.minX - hm && mpx < b.maxX + hm && mpy > b.minY - hm && mpy < b.maxY + hm;
    const target = over ? hm : 0;
    if (over) {
      if (holeR < 4) { holeX = mpx; holeY = mpy; }
      else { const f = 1 - Math.exp(-dt / HOLE_FOLLOW_MS); holeX += (mpx - holeX) * f; holeY += (mpy - holeY) * f; }
    }
    holeR += (target - holeR) * (1 - Math.exp(-dt / HOLE_MS));
    if (target === 0 && holeR < 0.6) holeR = 0;
    return { over, target };
  };

  // ---- renderer 2D -------------------------------------------------------------------------
  const SW_LEVELS = 4; // koszyki spuchnięcia 0..3
  const dotColor = (level: number, band: number) => {
    const f = level / (SW_LEVELS - 1), g = gradAt((band + 0.5) / TONES);
    const c = DOT_RGB.map((v, i) => Math.round(v + (g[i] - v) * f));
    return `rgba(${c[0]},${c[1]},${c[2]},${(0.9 + 0.1 * f).toFixed(2)})`;
  };

  /** 2D: lity napis (z wyciętą dziurą) + kropki w koszykach: spuchnięcie x pasmo koloru x alfa. */
  const draw2D = (entrance: boolean, solidA: number, dotsAll: number) => {
    if (!L) return;
    const o = bmpOrigin();
    if (entrance) clearAll();
    else {
      const m = holeMax() * dpr * L.k; // zapas na cząstki odepchnięte poza litery
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(Math.floor(o.x - m), Math.floor(o.y - m), Math.ceil(bmpW + m * 2), Math.ceil(bmpH + m * 2));
    }
    const hole = holeR > 1;
    if (solidA > 0.003 && solidReady) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = solidA; ctx.drawImage(solidBmp, o.x, o.y); ctx.globalAlpha = 1;
      if (hole) {
        setSceneTransform(ctx);
        ctx.globalCompositeOperation = 'destination-out';
        const g = ctx.createRadialGradient(holeX, holeY, holeR * HOLE.cut0, holeX, holeY, holeR * HOLE.cut1);
        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(holeX - holeR, holeY - holeR, holeR * 2, holeR * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // Które cząstki w ogóle rozważamy: wejście / wygaszanie = wszystkie; spoczynek = dziura + aktywne.
    frameId++;
    let idxs: ArrayLike<number> = allIdx, len = n;
    if (!entrance && dotsAll <= 0.003) {
      const list: number[] = [];
      if (hole) {
        const r = holeR * HOLE.fade1;
        gridRange(holeX - r, holeY - r, holeX + r, holeY + r, (i) => { mark[i] = frameId; list.push(i); });
      }
      for (const i of activeList) if (mark[i] !== frameId) { mark[i] = frameId; list.push(i); }
      idxs = list; len = list.length;
    } else for (let i = 0; i < n; i++) mark[i] = frameId;
    if (!len) return;

    const square = len > 9000; // fallback 2D na desktopie: kwadraty ~4x tańsze niż łuki
    const fullR = (L.step * SWELL_DIAMETER) / 2, lmax = L.link * 1.9;
    const withLines = L.lines && drawLines;
    const dots: Path2D[] = Array.from({ length: SW_LEVELS * TONES * 2 }, () => new Path2D());
    const lines: Path2D[] = withLines ? Array.from({ length: LEVELS }, () => new Path2D()) : [];
    const level = new Uint8Array(n);
    for (let s = 0; s < len; s++) {
      const i = idxs[s];
      if (!on[i]) { level[i] = 255; continue; }
      const d = hole ? Math.hypot(x[i] - holeX, y[i] - holeY) / holeR : 9;
      const swell = calm[i] * melt * smooth((d - HOLE.swell0) / (HOLE.swell1 - HOLE.swell0));
      const vis = Math.max(dotsAll, 1 - smooth((d - HOLE.fade0) / (HOLE.fade1 - HOLE.fade0)), 1 - calm[i]);
      if (vis < 0.04) { level[i] = 255; continue; }
      const lv = Math.min(SW_LEVELS - 1, Math.round(swell * (SW_LEVELS - 1)));
      level[i] = lv;
      const r = L.dotR + (fullR - L.dotR) * (lv / (SW_LEVELS - 1));
      const p = dots[(lv * TONES + tone[i]) * 2 + (vis > 0.6 ? 0 : 1)];
      if (square) p.rect(x[i] - r * 0.89, y[i] - r * 0.89, r * 1.78, r * 1.78);
      else { p.moveTo(x[i] + r, y[i]); p.arc(x[i], y[i], r, 0, 6.2832); }
    }
    setSceneTransform(ctx);
    if (withLines) {
      // Siatka tylko między zwykłymi (niespuchniętymi) kropkami.
      for (let s = 0; s < len; s++) {
        const i = idxs[s];
        if (level[i] !== 0 || ez[i] < 0.12) continue;
        for (let e = nbStart[i]; e < nbStart[i + 1]; e++) {
          const j = nb[e];
          if (level[j] !== 0 || (mark[j] === frameId && j < i)) continue;
          const dx = x[j] - x[i], dy = y[j] - y[i], dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < lmax) {
            const al = (1 - dd / lmax) * Math.min(ez[i], ez[j]);
            const p = lines[Math.min(LEVELS - 1, (al * LEVELS) | 0)];
            p.moveTo(x[i], y[i]); p.lineTo(x[j], y[j]);
          }
        }
      }
      ctx.lineWidth = 0.7 * (L.step / 3);
      for (let i = 0; i < LEVELS; i++) { ctx.strokeStyle = `rgba(148,163,184,${((i + 0.5) / LEVELS) * 0.5})`; ctx.stroke(lines[i]); }
    }
    for (let lv = 0; lv < SW_LEVELS; lv++) for (let band = 0; band < TONES; band++) for (let a = 0; a < 2; a++) {
      ctx.globalAlpha = a === 0 ? 1 : 0.5;
      ctx.fillStyle = dotColor(lv, band);
      ctx.fill(dots[(lv * TONES + band) * 2 + a]);
    }
    ctx.globalAlpha = 1;
  };

  return {
    get canvas() { return useGL && glr ? glr.canvas : canvas; },
    get topY() { return topY; },
    get ownsReflection() { return useGL; },

    build(layout, fontFamily, animate, at) {
      L = layout;
      buildToken++;
      family = fontFamily;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // Renderer: GPU tylko na desktopie (mobile ma ~1,5-7k kropek i w spoczynku nie rysuje nic;
      // zasada projektu: zero pętli WebGL w hero na telefonach).
      if (!layout.mobile && !glTried) {
        glTried = true;
        glr = createParticleGL(canvas, () => { useGL = false; glr?.show(false); glr = null; onRendererLost(); });
      }
      useGL = !layout.mobile && !!glr;
      glr?.show(useGL);
      canvas.style.display = useGL ? 'none' : 'block';
      // Mobile: canvas tylko nad horyzontem (+ margines) - oszczędność pamięci i fill-rate.
      const hCss = layout.mobile ? Math.min(layout.H, Math.ceil(layout.horizon + 48)) : layout.H;
      canvas.style.width = `${layout.W}px`;
      canvas.style.height = `${hCss}px`;
      canvas.width = Math.max(1, Math.round(layout.W * dpr));
      canvas.height = Math.max(1, Math.round(hCss * dpr));

      const s = sample(layout);
      n = s.count; tx = s.outX; ty = s.outY; tone = s.tones;
      x = new Float32Array(n); y = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
      dl = new Float32Array(n); ez = new Float32Array(n); calm = new Float32Array(n);
      on = new Uint8Array(n); active = new Uint8Array(n); mark = new Int32Array(n);
      allIdx = new Int32Array(n); for (let i = 0; i < n; i++) allIdx[i] = i;
      activeList = []; settled = false; solidReady = false; restDrawn = false;
      melt = 0; holeR = 0; drawLines = true; slowFrames = 0; acc = 0; lastNow = 0;

      let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      for (let i = 0; i < n; i++) {
        if (tx[i] < minX) minX = tx[i]; if (tx[i] > maxX) maxX = tx[i];
        if (ty[i] < minY) minY = ty[i]; if (ty[i] > maxY) maxY = ty[i];
      }
      if (!n) { minX = minY = 0; maxX = maxY = 1; }
      topY = minY;
      bounds = { minX, minY, maxX, maxY };
      nbStart = new Int32Array(n + 1); nb = new Int32Array(0);
      if (useGL && glr && !glr.configure(layout, n)) { useGL = false; glr.show(false); canvas.style.display = 'block'; }
      gX0 = minX; gY0 = minY;
      gCols = Math.floor((maxX - minX) / GRID) + 1; gRows = Math.floor((maxY - minY) / GRID) + 1;
      const g = buildGrid(GRID, minX, minY, gCols, gRows);
      gStart = g.start; gItems = g.items;

      const m = layout.link * 2 + 6;
      cX = minX - m; cY = minY - m;
      bmpW = Math.max(1, Math.ceil((maxX - minX + m * 2) * layout.k * dpr) + 2);
      bmpH = Math.max(1, Math.ceil((maxY - minY + m * 2) * layout.k * dpr) + 2);

      if (!animate) {
        buildNeighbours();
        for (let i = 0; i < n; i++) { x[i] = tx[i]; y[i] = ty[i]; calm[i] = 1; }
        settle();
        if (useGL && glr) glr.draw(x, y, ez, on, calm, { solid: 1, melt: 1, dotsAll: 0, holeX: 0, holeY: 0, holeR: 0 });
        else { clearAll(); draw2D(false, 1, 0); }
        restDrawn = true;
        return;
      }
      startAt = at;
      const spanX = (layout.xMax - layout.xMin) * 0.8, spanY = (layout.yMax - layout.yMin) * 1.3;
      const midY = (layout.yMin + layout.yMax) / 2;
      for (let i = 0; i < n; i++) {
        x[i] = layout.cx + (Math.random() - 0.5) * 2 * spanX;
        y[i] = midY + (Math.random() - 0.5) * 2 * spanY;
        dl[i] = Math.random() * MAX_DELAY_MS;
      }
      clearAll();
    },

    link() {
      if (L && n) buildNeighbours(true);
    },

    prepareSolid() {
      if (L && n && !solidReady) buildSolid();
    },

    frame(now, pointer) {
      if (!L || !n) return false;
      const dt = lastNow ? Math.min(100, now - lastNow) : STEP_MS;
      lastNow = now;
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 3) { acc -= STEP_MS; steps++; }
      if (acc > STEP_MS) acc = 0;
      if (!steps) return false;

      const mpx = interactive ? pointer.px : -1, mpy = pointer.py;

      if (!settled) {
        const el0 = now - startAt;
        if (el0 < 0) return false;
        const radius = repelRadius();
        const t0 = performance.now();
        let arrived = 0;
        for (let i = 0; i < n; i++) {
          const el = el0 - dl[i];
          if (el < 0) { on[i] = 0; calm[i] = 0; continue; }
          on[i] = 1;
          const kk = Math.min(1, el / RAMP_MS);
          ez[i] = 1 - (1 - kk) * (1 - kk) * (1 - kk);
          for (let s = 0; s < steps; s++) physics(i, ez[i], mpx, mpy, radius);
          arrived += calm[i] = calmOf(i);
        }
        // Zlewanie rusza przy ~42% zebranych cząstek i kończy już przy ~78% - NIE czekamy na ogon
        // ostatnich cząstek (właściciel: faza "nierównego" napisu trwała za długo). Ostry lity
        // materiał wchodzi w połowie zlewania, a spuchnięte kropki (nierówny obrys) gasną zaraz
        // po nim; spóźnione cząstki dolatują już do gotowego napisu (widoczne przez 1 - calm).
        const target = el0 >= ENTRANCE_MS ? 1 : smooth((arrived / n - 0.42) / 0.36);
        melt += (target - melt) * (1 - Math.exp(-dt / MELT_MS));
        if (melt > 0.2 && !solidReady) buildSolid();
        stepHole(mpx, mpy, dt, melt > 0.9);
        const solidA = smooth((melt - 0.5) / 0.3);
        const dotsAll = 1 - smooth((melt - 0.72) / 0.23);
        if (useGL && glr) glr.draw(x, y, ez, on, calm, { solid: solidA, melt, dotsAll, holeX, holeY, holeR });
        else {
          draw2D(true, solidA, dotsAll);
          // Bezpiecznik (tylko 2D): słaby sprzęt → na czas wejścia same kropki.
          if (drawLines && performance.now() - t0 > 28 && ++slowFrames > 6) drawLines = false;
        }
        if (melt > 0.995 && (el0 >= ENTRANCE_MS || arrived / n > 0.985)) { settle(); if (!useGL) clearAll(); }
        return true;
      }

      // --- spoczynek: lity napis; rysujemy tylko gdy dziura / odepchnięte cząstki ---
      // (kropki zgasły już w trakcie zlewania, więc dotsAll = 0 od razu)
      const { over, target } = stepHole(mpx, mpy, dt, true);
      const activeCount = stepActive(over ? mpx : -1, mpy, steps);
      const animating = holeR > 0 || target > 0 || activeCount > 0;
      if (!animating && restDrawn) return false;

      if (useGL && glr) glr.draw(x, y, ez, on, calm, { solid: 1, melt: 1, dotsAll: 0, holeX, holeY, holeR });
      else draw2D(false, 1, 0);
      restDrawn = !animating;
      return true;
    },

    destroy() {
      n = 0; L = null; activeList = [];
      solidBmp.width = solidBmp.height = 1;
      glr?.destroy(); glr = null; useGL = false;
    },
  };
}
