// „Rozejście” podstrony System CRM (.cr-bloom / .cr-bloom-out) - generator masek.
// Decyzje właściciela (2026-10-05):
//   1. „te wszystkie animacje linii… wywal i zrób animację taką pojawiania płynną, tak jak się nebula rozchodzi”,
//   2. „zrób to z axisem, np. od lewej do prawej, i tak nieregularnie, a nie że jednym kształtem się pojawia”,
//   3. „nie chcę, żeby to był jedną linią i statyczny na końcu, tylko taki fluid, nieregularny, że nie cały element,
//      tylko kilka mniejszych”.
// Element odsłania się KILKOMA MNIEJSZYMI KŁĘBAMI gazu: pojawiają się po kolei od lewej do prawej (nierówno, na
// przemian wyżej i niżej), każdy rośnie i dryfuje, kłęby zlewają się, a na końcu luki między nimi domyka duży kłąb
// rosnący ze środka. Nie ma jednego czoła ani jednego kształtu, a krawędzie cały czas się ruszają.
// Maska = lista warstw: tekstura kłębu (kanał alfa, pełny środek + poszarpany, miękki brzeg), jej rozmiar i położenie
// liczone w CSS z jednej zmiennej --bloom (0-1).
// Ten skrypt jest JEDYNYM źródłem prawdy - zapisuje:
//   app/(pl)/uslugi/strony-www/system-crm/bloom.css        tekstury (data URI) + reguły .cr-bloom / .cr-bloom-out
//   app/(pl)/uslugi/strony-www/system-crm/bloom-layers.ts  ta sama lista warstw dla płótna sceny głównej, które
//                                                           gasi punkty dopełnieniem tej samej maski
// NIE edytować tych dwóch plików ręcznie.
//   node scripts/crm-bloom.mjs                 zapis obu plików
//   node scripts/crm-bloom.mjs --preview <dir> dodatkowo podgląd PNG: tekstury i maska w kolejnych chwilach postępu
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'app/(pl)/uslugi/strony-www/system-crm';

const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v) => { const t = c01(v); return t * t * (3 - 2 * t); };
const prng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Szum wartościowy z oktawami (fbm), 0-1. */
const makeFbm = (seed) => {
  const r = prng(seed);
  const g = new Float32Array(256 * 256);
  for (let i = 0; i < g.length; i++) g[i] = r();
  const at = (x, y) => g[((y & 255) << 8) | (x & 255)];
  const val = (x, y) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  return (x, y, oct = 4) => {
    let v = 0, amp = 0.5, f = 1, sum = 0;
    for (let o = 0; o < oct; o++) { v += val(x * f, y * f) * amp; sum += amp; amp *= 0.5; f *= 2.03; }
    return v / sum;
  };
};

/** Tekstury kłębów: [nazwa, ziarno, bok w px, najmniejszy i największy promień gęstego gazu (1 = środek boku),
    liczba komórek szumu na bok]. Środek do (najmniejszy promień - SOFT / 2) jest w pełni kryjący; brzeg obrazu pusty. */
const TEXTURES = [
  ['a', 20261005, 192, 0.4, 0.78, 3.2],
  ['b', 771, 192, 0.4, 0.78, 4.1],
  ['c', 4099, 224, 0.5, 0.8, 5],
];
const SOFT = 0.22;
const HAZE = 0.4;
const WARP = 0.3;

const blob = (seed, N, r0, r1, cells) => {
  const cloud = makeFbm(seed);
  const warp = makeFbm(seed * 7 + 13);
  const a = new Uint8Array(N * N);
  for (let j = 0; j < N; j++) {
    const y = (j / (N - 1)) * 2 - 1;
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * 2 - 1;
      const px = (x + 1) * cells * 0.5, py = (y + 1) * cells * 0.5;
      const wx = warp(px * 0.6 + 5.2, py * 0.6 + 1.3, 3) - 0.5;
      const wy = warp(px * 0.6 + 9.7, py * 0.6 + 4.1, 3) - 0.5;
      // promień z zagiętą dziedziną (kłąb nie jest kołem) porównany z progiem z szumu (poszarpany brzeg)
      const g = Math.hypot(x + wx * WARP, y + wy * WARP);
      const n = c01((cloud(px + wx * 1.4, py + wy * 1.4, 4) - 0.27) / 0.46);
      const thr = r0 + (r1 - r0) * n;
      const dense = 1 - smooth((g - thr) / SOFT + 0.5);
      const haze = HAZE * (1 - smooth((g - thr + 0.04) / 0.36)) ** 1.6;
      let al = Math.max(dense, haze);
      al *= 1 - smooth((Math.max(Math.abs(x), Math.abs(y)) - 0.9) / 0.1); // brzeg obrazu zawsze pusty
      a[j * N + i] = Math.round(c01(al) * 255);
    }
  }
  return a;
};

/** Warstwy maski: [tekstura, środek x, y (ułamki elementu) na starcie, dryf środka x, y do końca, szerokość
    i wysokość kłębu w pełni rozrośniętego (ułamki elementu), start i czas na osi --bloom, przebieg].
    Małe kłęby (rozmiar < 1 - wzór na położenie w CSS dzieli przez 1 - rozmiar): dwa nierówne rzędy, kolejność od
    lewej do prawej, lekki dryf w prawo. Ostatnia warstwa: duży kłąb ze środka, który domyka luki (przebieg 'in' =
    wolny start, p do sześcianu), przy --bloom = 1 jego pełny środek zakrywa cały element. */
const LAYERS = [
  ['a', 0.10, 0.27, 0.05, 0.02, 0.86, 0.9, 0.0, 0.46, 'smooth'],
  ['b', 0.15, 0.80, 0.04, -0.03, 0.74, 0.86, 0.05, 0.46, 'smooth'],
  ['b', 0.33, 0.16, 0.05, 0.04, 0.72, 0.8, 0.11, 0.46, 'smooth'],
  ['a', 0.40, 0.72, 0.05, 0.02, 0.88, 0.9, 0.17, 0.46, 'smooth'],
  ['a', 0.58, 0.30, 0.05, -0.03, 0.8, 0.88, 0.24, 0.46, 'smooth'],
  ['b', 0.66, 0.84, 0.04, -0.02, 0.76, 0.84, 0.3, 0.46, 'smooth'],
  ['b', 0.83, 0.20, 0.04, 0.04, 0.78, 0.86, 0.37, 0.46, 'smooth'],
  ['a', 0.90, 0.72, 0.03, 0.02, 0.86, 0.9, 0.43, 0.46, 'smooth'],
  ['c', 0.5, 0.5, 0, 0, 4.2, 4.2, 0.42, 0.58, 'in'],
];
/** TELEFON (ekran węższy niż SMALL px; właściciel 2026-10-05: „dostosuj całą podstronę do urządzeń mobilnych”):
    lżejsza maska - cztery większe kłęby zygzakiem z góry na dół (lewy, prawy, lewy, prawy) + duży kłąb ze środka.
    Mniej warstw do przeliczenia przy każdej klatce przewijania, a na wąskich elementach kłęby nie są drobnicą. */
const SMALL = 768;
const LAYERS_SMALL = [
  ['a', 0.22, 0.17, 0.05, 0.03, 0.96, 0.6, 0.0, 0.5, 'smooth'],
  ['b', 0.78, 0.37, -0.04, 0.03, 0.9, 0.56, 0.1, 0.5, 'smooth'],
  ['a', 0.24, 0.6, 0.05, 0.02, 0.94, 0.58, 0.2, 0.5, 'smooth'],
  ['b', 0.76, 0.82, -0.04, -0.02, 0.92, 0.56, 0.3, 0.5, 'smooth'],
  ['c', 0.5, 0.5, 0, 0, 4.2, 4.2, 0.42, 0.58, 'in'],
];

const fix = (v) => Number(v.toFixed(4)).toString();

// ── CSS ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Wydajność (właściciel 2026-10-05: „zoptymalizuj całą podstronę względem wydajności”): listy obraz / rozmiar /
// położenie są zapisane RAZ w zmiennych i użyte przez obie klasy, bez ręcznych przedrostków -webkit- (dokłada je
// kompilator CSS według browserslist) - plik reguł jest kilka razy krótszy niż przy czterech kopiach każdej listy.
/** Zmienne maski dla listy warstw: postęp każdej warstwy i listy obraz / rozmiar / położenie. */
const varsFor = (layers, pad) => {
  const vars = [];
  const img = [], size = [], pos = [];
  layers.forEach(([tex, cx, cy, dx, dy, w, h, start, dur, ease], i) => {
    const k = i + 1;
    vars.push(`${pad}  --bl-p${k}: clamp(0, (var(--bl-t) - ${fix(start)}) / ${fix(dur)}, 1);`);
    vars.push(ease === 'in'
      ? `${pad}  --bl-e${k}: calc(var(--bl-p${k}) * var(--bl-p${k}) * var(--bl-p${k}));`
      : `${pad}  --bl-e${k}: calc(var(--bl-p${k}) * var(--bl-p${k}) * (3 - 2 * var(--bl-p${k})));`);
    const e = `var(--bl-e${k})`;
    img.push(`var(--cr-bloom-${tex})`);
    size.push(`calc(${e} * ${fix(w * 100)}%) calc(${e} * ${fix(h * 100)}%)`);
    if (w >= 1 || h >= 1) {
      if (cx !== 0.5 || cy !== 0.5 || dx || dy) throw new Error('warstwa większa od elementu musi stać w środku');
      pos.push('50% 50%');
    } else {
      // lewa krawędź obrazu = środek - rozmiar / 2; mask-position w % liczy się od (element - obraz), stąd dzielenie
      const axis = (c, d, s) => `calc((${fix(c)} + ${fix(d)} * ${e} - ${e} * ${fix(s / 2)}) / (1 - ${e} * ${fix(s)}) * 100%)`;
      pos.push(`${axis(cx, dx, w)} ${axis(cy, dy, h)}`);
    }
  });
  return `${pad}.cr-bloom, .cr-bloom-out {
${vars.join('\n')}
${pad}  --bl-img: ${img.join(', ')};
${pad}  --bl-size: ${size.join(', ')};
${pad}  --bl-pos: ${pos.join(', ')};
${pad}}
${pad}.cr-bloom-out { mask-composite: exclude, ${layers.map(() => 'add').join(', ')}; }`;
};
const cssFor = (images) => `/* GENEROWANE: node scripts/crm-bloom.mjs - NIE edytować ręcznie (opis i decyzje właściciela w skrypcie
   i w system-crm.css, blok „ROZEJŚCIE”). Tekstury kłębów (kanał alfa) + maska liczona z --bloom: ${LAYERS.length} warstw,
   na ekranach węższych niż ${SMALL} px ${LAYERS_SMALL.length} warstw. Listy maski są w zmiennych --bl-img / --bl-size / --bl-pos. */
.cr {
${images.map(([name, uri]) => `  --cr-bloom-${name}: url("${uri}");`).join('\n')}
}
@property --bloom { syntax: '<number>'; inherits: true; initial-value: 1; }
.cr-bloom, .cr-bloom-out { --bl-t: var(--bloom, 1); mask-repeat: no-repeat; }
${varsFor(LAYERS, '')}
@media (max-width: ${SMALL - 0.02}px) {
${varsFor(LAYERS_SMALL, '  ')}
}
.cr-bloom { mask-image: var(--bl-img); mask-size: var(--bl-size); mask-position: var(--bl-pos); }
/* dopełnienie: pełna warstwa „wyklucza” sumę wszystkich kłębów (lista mask-composite - przy zmiennych wyżej) */
.cr-bloom-out { mask-image: linear-gradient(#000, #000), var(--bl-img); mask-size: 100% 100%, var(--bl-size); mask-position: 0 0, var(--bl-pos); }
.cr-bloom[data-bloomed] { mask-image: none; }
.cr-bloom-out[data-bloomed] { visibility: hidden; }
`;

// ── TS dla płótna sceny głównej ──────────────────────────────────────────────────────────────────────────────────
const tsRows = (layers) => layers.map(([tex, cx, cy, dx, dy, w, h, start, dur, ease]) => `  [${TEXTURES.findIndex(([n]) => n === tex)}, ${[cx, cy, dx, dy, w, h, start, dur].map(fix).join(', ')}, ${ease === 'in' ? 1 : 0}],`).join('\n');
const tsFor = () => `// GENEROWANE: node scripts/crm-bloom.mjs - NIE edytować ręcznie. Lista warstw maski „rozejścia” (ta sama, z której
// liczy się CSS w bloom.css) dla płótna sceny głównej: hero-points-field.ts gasi punkty dopełnieniem tej maski.

/** Zmienne CSS z teksturami kłębów (na korzeniu .cr), w kolejności indeksów tekstur. */
export const BLOOM_TEXTURES = [${TEXTURES.map(([name]) => `'--cr-bloom-${name}'`).join(', ')}] as const;

/** [tekstura, środek x, środek y, dryf x, dryf y, szerokość, wysokość (ułamki elementu), start, czas, przebieg:
    0 = miękki start i koniec (p * p * (3 - 2p)), 1 = wolny start (p do sześcianu)]. */
export type BloomLayer = readonly [number, number, number, number, number, number, number, number, number, 0 | 1];

export const BLOOM_LAYERS: ReadonlyArray<BloomLayer> = [
${tsRows(LAYERS)}
];

/** Lżejsza maska na ekranach węższych niż BLOOM_SMALL px (w CSS: @media (max-width: ${SMALL - 0.02}px)). */
export const BLOOM_SMALL = ${SMALL};
export const BLOOM_LAYERS_SMALL: ReadonlyArray<BloomLayer> = [
${tsRows(LAYERS_SMALL)}
];
`;

// ── Podgląd: maska w kolejnych chwilach postępu (to samo, co liczy CSS) ────────────────────────────────────────────
const sample = (m, N, u, v) => {
  if (u <= 0 || u >= 1 || v <= 0 || v >= 1) return 0;
  const fx = u * (N - 1), fy = v * (N - 1);
  const x0 = fx | 0, y0 = fy | 0, x1 = Math.min(x0 + 1, N - 1), y1 = Math.min(y0 + 1, N - 1);
  const ax = fx - x0, ay = fy - y0;
  const a = m[y0 * N + x0], b = m[y0 * N + x1], c = m[y1 * N + x0], d = m[y1 * N + x1];
  return (a + (b - a) * ax + (c - a) * ay + (a - b - c + d) * ax * ay) / 255;
};
const maskAt = (layers, alphas, t, u, v) => {
  let keep = 1;
  for (const [tex, cx, cy, dx, dy, w, h, start, dur, ease] of layers) {
    const p = c01((t - start) / dur), e = ease === 'in' ? p * p * p : p * p * (3 - 2 * p);
    const sw = w * e, sh = h * e;
    if (sw < 1e-4) continue;
    const { a, N } = alphas[tex];
    keep *= 1 - sample(a, N, (u - (cx + dx * e - sw / 2)) / sw, (v - (cy + dy * e - sh / 2)) / sh);
  }
  return 1 - keep;
};

const alphas = {};
const images = [];
for (const [name, seed, N, r0, r1, cells] of TEXTURES) {
  const a = blob(seed, N, r0, r1, cells);
  alphas[name] = { a, N };
  const rgba = Buffer.alloc(N * N * 4, 255);
  for (let i = 0; i < a.length; i++) rgba[i * 4 + 3] = a[i];
  const webp = await sharp(rgba, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 1, alphaQuality: 72, effort: 6 }).toBuffer();
  const back = await sharp(webp).ensureAlpha().raw().toBuffer();
  let border = 0;
  for (let i = 0; i < N; i++) border = Math.max(border, back[i * 4 + 3], back[((N - 1) * N + i) * 4 + 3], back[i * N * 4 + 3], back[(i * N + N - 1) * 4 + 3]);
  console.log(`tekstura ${name}: ${N} px, ${webp.length} B, środek = ${back[((N >> 1) * N + (N >> 1)) * 4 + 3]}, największa alfa na brzegu = ${border}`);
  images.push([name, `data:image/webp;base64,${webp.toString('base64')}`]);
}
// kontrola: przy --bloom = 1 maska kryje cały element (także rogi) - obie listy warstw
for (const [label, layers] of [['pełna', LAYERS], ['telefon', LAYERS_SMALL]]) {
  let minFull = 1;
  for (const [u, v] of [[0.001, 0.001], [0.999, 0.001], [0.001, 0.999], [0.999, 0.999], [0.5, 0.001], [0.001, 0.5]]) minFull = Math.min(minFull, maskAt(layers, alphas, 1, u, v));
  console.log(`maska ${label}: krycie przy --bloom = 1 (rogi i krawędzie) = ${minFull.toFixed(3)}`);
}

const css = cssFor(images);
fs.writeFileSync(path.join(DIR, 'bloom.css'), css);
fs.writeFileSync(path.join(DIR, 'bloom-layers.ts'), tsFor());
console.log(`zapisano bloom.css (${css.length} B) i bloom-layers.ts`);

const previewDir = process.argv.includes('--preview') ? process.argv[process.argv.indexOf('--preview') + 1] : null;
if (previewDir) {
  const steps = [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88, 0.96];
  // pełna maska na elemencie poziomym (okno na komputerze), maska telefonu na pionowym (okno na telefonie)
  for (const [file, layers, FW, FH, cols] of [['bloom-steps.png', LAYERS, 360, 180, 4], ['bloom-steps-small.png', LAYERS_SMALL, 170, 220, 6]]) {
    const GAP = 6, rows = Math.ceil(steps.length / cols);
    const SW = cols * FW + (cols + 1) * GAP, SH = rows * FH + (rows + 1) * GAP;
    const sheet = Buffer.alloc(SW * SH, 70);
    steps.forEach((t, k) => {
      const ox = GAP + (k % cols) * (FW + GAP), oy = GAP + Math.floor(k / cols) * (FH + GAP);
      for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) sheet[(oy + y) * SW + ox + x] = Math.round(maskAt(layers, alphas, t, (x + 0.5) / FW, (y + 0.5) / FH) * 255);
    });
    await sharp(sheet, { raw: { width: SW, height: SH, channels: 1 } }).png().toFile(path.join(previewDir, file));
    console.log(`podgląd: ${path.join(previewDir, file)} (postęp ${steps.join(', ')})`);
  }
}
