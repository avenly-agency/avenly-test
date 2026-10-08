// Kafel tła sekcji "Dlaczego Avenly" (propozycja "Mapa warstwic"): powtarzalne warstwice jak na
// mapie topograficznej -> public/impact/contours.svg. Pole wysokości = suma fal o całkowitych
// częstotliwościach na kaflu (okresowe, więc kafel łączy się bez szwu), warstwice z marching
// squares, co 5. poziom grubszy (warstwica zasadnicza jak na mapach). Białe linie z kryciem - plik
// służy jako MASKA, kolor (z odcieniem aktywnej karty) daje CSS. Uruchom: node scripts/impact-contours.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const T = 1440; // bok kafla (px CSS przy background-size = T)
const N = 180; // komórek na bok (8 px)
const LEVELS = 14;
const EPS = 0.45; // uproszczenie linii (px) - niewidoczne przy 1 px, a plik kilka razy lżejszy
const SEED = 7;

let s = SEED;
const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

// Fale: wektory falowe całkowite (okresowe na kaflu), amplituda maleje z częstotliwością.
const waves = [];
for (let kx = -4; kx <= 4; kx++) {
  for (let ky = 0; ky <= 4; ky++) {
    if (ky === 0 && kx <= 0) continue;
    const k = Math.hypot(kx, ky);
    if (k > 4.3) continue;
    waves.push({ kx, ky, a: (0.6 + rnd() * 0.8) / Math.pow(k, 1.35), p: rnd() * Math.PI * 2 });
  }
}
const f = new Float64Array(N * N);
let lo = Infinity, hi = -Infinity;
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const x = i / N, y = j / N;
    let v = 0;
    for (const w of waves) v += w.a * Math.sin(2 * Math.PI * (w.kx * x + w.ky * y) + w.p);
    f[j * N + i] = v;
    lo = Math.min(lo, v); hi = Math.max(hi, v);
  }
}
for (let k = 0; k < f.length; k++) f[k] = (f[k] - lo) / (hi - lo);
const at = (i, j) => f[((j % N + N) % N) * N + ((i % N + N) % N)];

const C = T / N;

// Ramer-Douglas-Peucker.
const simplify = (p, eps) => {
  if (p.length < 3) return p;
  const keep = new Uint8Array(p.length); keep[0] = keep[p.length - 1] = 1;
  const st = [[0, p.length - 1]];
  while (st.length) {
    const [a, b] = st.pop();
    const [ax, ay] = p[a], [bx, by] = p[b];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    let md = 0, mi = -1;
    for (let k = a + 1; k < b; k++) { const d = Math.abs((p[k][0] - ax) * dy - (p[k][1] - ay) * dx) / L; if (d > md) { md = d; mi = k; } }
    if (md > eps) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return p.filter((_, k) => keep[k]);
};
const paths = { minor: [], major: [] };

for (let l = 0; l < LEVELS; l++) {
  const lv = (l + 0.5) / LEVELS;
  // Punkty na krawędziach siatki: klucz krawędzi -> [x, y]; odcinki łączą klucze.
  const pt = new Map();
  const adj = new Map();
  const edgePt = (key, x, y) => { if (!pt.has(key)) pt.set(key, [x, y]); return key; };
  const link = (a, b) => {
    (adj.get(a) ?? adj.set(a, []).get(a)).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)).push(a);
  };
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const v0 = at(i, j), v1 = at(i + 1, j), v2 = at(i + 1, j + 1), v3 = at(i, j + 1);
      const c = (v0 > lv ? 1 : 0) | (v1 > lv ? 2 : 0) | (v2 > lv ? 4 : 0) | (v3 > lv ? 8 : 0);
      if (c === 0 || c === 15) continue;
      const m = (a, b) => (lv - a) / (b - a);
      const I = (i + 1) % N, J = (j + 1) % N;
      const top = () => edgePt(`h${i},${j}`, (i + m(v0, v1)) * C, j * C);
      const right = () => edgePt(`v${I},${j}`, (i + 1) * C, (j + m(v1, v2)) * C);
      const bottom = () => edgePt(`h${i},${J}`, (i + m(v3, v2)) * C, (j + 1) * C);
      const left = () => edgePt(`v${i},${j}`, i * C, (j + m(v0, v3)) * C);
      const center = (v0 + v1 + v2 + v3) / 4 > lv;
      switch (c) {
        case 1: case 14: link(left(), top()); break;
        case 2: case 13: link(top(), right()); break;
        case 3: case 12: link(left(), right()); break;
        case 4: case 11: link(right(), bottom()); break;
        case 6: case 9: link(top(), bottom()); break;
        case 7: case 8: link(left(), bottom()); break;
        case 5: if (center) { link(left(), bottom()); link(top(), right()); } else { link(left(), top()); link(right(), bottom()); } break;
        case 10: if (center) { link(left(), top()); link(right(), bottom()); } else { link(left(), bottom()); link(top(), right()); } break;
      }
    }
  }
  // Pętle: krok po sąsiadach, współrzędne "rozwinięte" (bez skoku o T przy przejściu przez brzeg kafla).
  const seen = new Set();
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let prev = null, cur = start;
    let [ux, uy] = pt.get(start);
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      const [x, y] = pt.get(cur);
      if (loop.length) {
        const [px, py] = loop[loop.length - 1];
        ux = x + Math.round((px - x) / T) * T;
        uy = y + Math.round((py - y) / T) * T;
      } else { ux = x; uy = y; }
      loop.push([ux, uy]);
      const next = (adj.get(cur) ?? []).find((k) => k !== prev && !seen.has(k));
      prev = cur; cur = next;
    }
    if (loop.length < 4) continue;
    const [sx, sy] = loop[0], [ex, ey] = loop[loop.length - 1];
    const closed = Math.hypot(sx - ex, sy - ey) < C * 1.5;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of loop) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const r = (v) => Math.round(v * 2) / 2;
    const pts = simplify(loop, EPS);
    // Kopie przesunięte o ±T tam, gdzie pętla wychodzi poza kafel (viewBox je przytnie).
    for (let dx = -T; dx <= T; dx += T) {
      for (let dy = -T; dy <= T; dy += T) {
        if (x1 + dx < 0 || x0 + dx > T || y1 + dy < 0 || y0 + dy > T) continue;
        let d = '';
        pts.forEach(([x, y], k) => { d += (k ? 'L' : 'M') + r(x + dx) + ' ' + r(y + dy); });
        paths[l % 5 === 2 ? 'major' : 'minor'].push(d + (closed ? 'Z' : ''));
      }
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${T}" height="${T}">` +
  `<path fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1" stroke-linejoin="round" d="${paths.minor.join('')}"/>` +
  `<path fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" d="${paths.major.join('')}"/>` +
  `</svg>`;
mkdirSync('public/impact', { recursive: true });
writeFileSync('public/impact/contours.svg', svg);
console.log('public/impact/contours.svg', (svg.length / 1024).toFixed(1), 'KB,', paths.minor.length + paths.major.length, 'ścieżek');
