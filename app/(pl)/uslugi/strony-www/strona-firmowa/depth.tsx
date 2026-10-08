'use client';

import { useEffect, useRef } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// GŁĘBIA KART STOSU: w tle każdej karty żyje świat świecących włosowych linii w kolorze podstrony - to samo uczucie
// głębi co karty „Dlaczego Avenly” na stronie głównej i karty one-page, ale WŁASNE motywy (silnik = kopia
// one-page/depth.tsx, nic nie importujemy). Cztery sceny dobrane do treści kart:
//   0 KRATOWNICA (Pełna skalowalność)     - rusztowanie z sześcianów w rzucie izometrycznym: kolumny rosną i maleją,
//                                           nowy sześcian zapala się, po krawędziach biegną impulsy światła; bliższe
//                                           sześciany zasłaniają dalsze (prawdziwa bryła, nie płaska siatka),
//   1 TARASY     (Gotowa na kolejny krok) - schodkowa budowla w perspektywie: dwanaście poziomów, coraz węższych
//                                           i dalszych; kamera lekko się kołysze (paralaksa między poziomami), a po
//                                           krawędziach stopni przesuwa się światło - stopień po stopniu w górę,
//   2 ECHO       (Architektura pod SEO)   - fale rozchodzą się łukami od punktu za rysunkiem; rozsiane węzły zapalają
//                                           się (ostra gwiazda), gdy mija je czoło fali,
//   3 KRYSZTAŁ   (Wyglądasz na lidera)    - obracający się dwudziestościan z ostrych krawędzi (przednie jaśniejsze
//                                           niż tylne), w wierzchołkach klejnoty, po krawędziach biegnie światło;
//                                           bryła jest większa od okna w rysunku - fasety wychodzą zza niego.
// Światło wspólne: pełna jasność przy rysunku, łagodne wygaszenie pod tekstem (bez masek i prostokątów), przy dolnej
// krawędzi karty (podpis rysunku) scena przygasa. Scena „wschodzi”, gdy karta wjeżdża (--d z cards.tsx).
// Skala scen = U (mniejszy z: wysokość karty, 0,9 szerokości) - na telefonie wzór jest gęstszy względem rysunku.
// Wydajność: start dopiero przy zbliżeniu karty (600 px), ~30 fps, pauza poza ekranem / pod przykryciem (--dp) /
// przy ukrytej karcie przeglądarki, DPR do 1,5 (dotyk 1,25). Bez WebGL / Save-Data / ≤ 2 GB RAM / ograniczony ruch:
// zostaje papier kreślarski z CSS.
// GLSL ES 1.0: pochodne (fwidth) tylko poza rozgałęzieniami, pętle o stałej długości, bez tablic indeksowanych
// zmienną, nazwy zmiennych inne niż funkcje wbudowane.

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const HEAD = `#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time, u_dpr, u_rise;
uniform vec3 u_ac;
uniform vec4 u_focus;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// linia o grubości w px z ostrą krawędzią
float aa(float px, float w) { return 1. - smoothstep(w - .5, w + .5, px); }
// odległość w px od najbliższej linii siatki na polu g (linie przy całkowitych wartościach)
float gridPx(float g) { return abs(fract(g + .5) - .5) / max(fwidth(g), 1e-6); }
// linia siatki; gęste zbiegi gasną zamiast migotać
float gridLine(float g, float w) { return aa(gridPx(g), w) * smoothstep(3.5, 9., 1. / max(fwidth(g), 1e-6)); }
// odległość od odcinka a-b
float segD(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.));
}
// ostre gwiazdy (bez poświaty), lekko migoczą
float stars(vec2 p, float sd) {
  float cs = 26. * u_dpr;
  vec2 cell = floor(p / cs);
  vec2 sp = (fract(p / cs) - (.15 + .7 * vec2(hash(cell + 3.1), hash(cell + 9.7)))) * 26.;
  float tw = .72 + .28 * sin(u_time * (.6 + hash(cell + 1.3)) + hash(cell + 2.9) * 6.28318);
  return step(.93, hash(cell + sd)) * (1. - smoothstep(.45, 1.15, length(sp))) * (.35 + .65 * hash(cell + 5.3)) * tw;
}
// ostra gwiazda z czterema promieniami (jak „klejnoty” nieba w hero); d = odległość od środka w px CSS
float gem(vec2 d, float len) {
  float core = aa(length(d), 1.5);
  float ray = max(aa(abs(d.y), .5) * smoothstep(len, 0., abs(d.x)), aa(abs(d.x), .5) * smoothstep(len, 0., abs(d.y)));
  return max(core, ray * .85);
}
vec3 scene(vec2 p);
void main() {
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec3 col = scene(p);
  // światło: pełna jasność przy rysunku, łagodnie do prawie zera pod tekstem; przy dolnej krawędzi karty przygasa
  vec2 q = (p - u_focus.xy) / u_focus.zw;
  float pool = 1. - smoothstep(.35, 1.3, length(q));
  pool = pool * pool * (3. - 2. * pool);
  col *= (.08 + .92 * pool) * (1. - .78 * smoothstep(u_res.y * .7, u_res.y * .94, p.y));
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0., 1.));
}
`;

const SCENES = [
  // 0 KRATOWNICA - pole kolumn z sześcianów w rzucie izometrycznym (ekran: x = (X - Y) * 0,866, y = (X + Y) / 2 + Z).
  // Promień widzenia idzie po przekątnej (1, 1, -1); pierwsza trafiona ściana (góra albo jedna z dwóch widocznych
  // ścian bocznych) rysuje krawędzie swojej kratki. Cztery próbki na piksel wygładzają obrysy brył.
  `// wysokość kolumny (ciągła; część całkowita = liczba sześcianów) i kierunek zmiany (1 = rośnie)
vec2 colH(vec2 c, float lift) {
  float a = .55 * hash(floor(c * .5) + 11.3) + .45 * hash(c + 2.1), b = hash(c + 4.7);
  float ph = u_time * (.16 + .22 * b) + b * 6.28318;
  return vec2(max(a * 4.6 - 1.4 + 1.1 * sin(ph) - lift, 0.), step(0., cos(ph)));
}
// jedna próbka: x = linia (z jasnością ściany), y = błysk nowego sześcianu, z = impuls biegnący po krawędzi
vec3 lattice(vec2 s, float S, float w, float lift) {
  float zc = 4.4;
  float a = s.x / .866, b = 2. * (s.y - zc);
  vec2 xy = vec2(a + b, b - a) * .5;
  vec2 c = floor(xy), fr = xy - c;
  float ent = 0., hitf = 0.;
  vec3 res = vec3(0.);
  for (int k = 0; k < 10; k++) {
    if (hitf < .5) {
      vec2 hu = colH(c, lift);
      float hc = floor(hu.x), part = hu.x - hc;
      vec2 tn = 1. - fr;
      float zo = zc - min(tn.x, tn.y);
      // świeży sześcian na szczycie kolumny pojawia się przygaszony i błyska
      float fresh = mix(.3, 1., smoothstep(0., .3, part));
      float glow = hu.y * (1. - smoothstep(.05, .6, part));
      if (ent > .5 && zc < hc) {
        // ściana boczna (weszliśmy przez nią do kolumny)
        float fz = fract(zc), fl = ent < 1.5 ? fr.y : fr.x;
        float ln = aa(min(min(fl, 1. - fl), min(fz, 1. - fz)) * .866 * S, w);
        float topc = step(hc - 1.5, floor(zc));
        res = vec3(ln * (ent < 1.5 ? .6 : .34) * mix(1., fresh, topc), ln * glow * topc * .6, 0.);
        hitf = 1.;
      } else if (zo < hc) {
        // góra kolumny (albo ziemia, gdy kolumna jest pusta)
        vec2 ff = fr + (zc - hc);
        vec2 ee = min(ff, 1. - ff);
        float ln = aa(min(ee.x, ee.y) * .866 * S, w);
        float gnd = 1. - step(.5, hc);
        float along = ee.x < ee.y ? c.y + ff.y : c.x + ff.x;
        float lid = ee.x < ee.y ? c.x + step(.5, ff.x) : c.y + step(.5, ff.y) + 57.;
        float run = fract(along * .13 - u_time * (.2 + .16 * hash(vec2(lid, hc))) + hash(vec2(lid, hc + 9.)));
        float pulse = smoothstep(0., .14, run) * (1. - smoothstep(.14, .17, run));
        res = vec3(ln * mix(fresh, .22, gnd), ln * glow * (1. - gnd), ln * pulse * mix(1., .55, gnd));
        hitf = 1.;
      } else {
        if (tn.x < tn.y) { c.x += 1.; fr = vec2(0., fr.y + tn.x); ent = 1.; }
        else { c.y += 1.; fr = vec2(fr.x + tn.y, 0.); ent = 2.; }
        zc = zo;
      }
    }
  }
  return res;
}
vec3 scene(vec2 p) {
  float U = min(u_res.y, u_res.x * .9), S = U * .115, w = .6 * u_dpr;
  vec2 o = u_focus.xy + vec2(U * .03, U * .2);
  vec2 s = vec2(p.x - o.x, o.y - p.y) / S;
  float lift = u_rise * 3.4, e = 1. / S;
  vec3 a = lattice(s + vec2(.125, .375) * e, S, w, lift) + lattice(s + vec2(-.375, .125) * e, S, w, lift)
    + lattice(s + vec2(.375, -.125) * e, S, w, lift) + lattice(s + vec2(-.125, -.375) * e, S, w, lift);
  a *= .25;
  return mix(u_ac, vec3(1.), .16) * a.x * .95 + mix(u_ac, vec3(1.), .7) * (a.y * .9 + a.z * .8);
}`,
  // 1 TARASY - schodkowa budowla widziana z przodu w perspektywie: poziom k stoi dalej (z), wyżej (y) i jest węższy.
  // Poziomy poniżej kamery pokazują taras z góry (tylna krawędź nad nosem niższego stopnia), wyższe - same ściany.
  `vec3 scene(vec2 p) {
  float U = min(u_res.y, u_res.x * .9), w = .6 * u_dpr;
  vec2 o = u_focus.xy - vec2(0., U * .1);
  vec2 q = vec2(p.x - o.x, o.y - p.y) / U;
  vec2 cam = vec2(.36 * sin(u_time * .12), 1.5 + .2 * sin(u_time * .087));
  float grow = 1. - .6 * u_rise;
  float acc = 0., hi = 0., cover = 0., prevTop = -9., prevW = 4.5, prevXl = 0., prevXr = 0.;
  for (int k = 0; k < 12; k++) {
    float fk = float(k);
    float z = 2.1 + fk * .56, sc = 1. / z;
    float W = 4.1 - fk * .29;
    float y0 = fk * .34 * grow, y1 = y0 + .34 * grow;
    float xl = (-W - cam.x) * sc, xr = (W - cam.x) * sc;
    float yb = (y0 - cam.y) * sc, yt = (y1 - cam.y) * sc;
    float inX = step(xl, q.x) * step(q.x, xr);
    // krawędź stopnia
    float nose = aa(abs(q.y - yt) * U, w) * inX;
    // tylna krawędź niższego tarasu i jego boki - widać je tylko, gdy patrzymy na taras z góry
    float pl = (-prevW - cam.x) * sc, pr = (prevW - cam.x) * sc;
    float seen = smoothstep(0., .012, yb - prevTop);
    float rear = aa(abs(q.y - yb) * U, w) * step(pl, q.x) * step(q.x, pr) * seen;
    float flank = max(aa(segD(q, vec2(prevXl, prevTop), vec2(pl, yb)) * U, w), aa(segD(q, vec2(prevXr, prevTop), vec2(pr, yb)) * U, w)) * seen * step(.5, fk);
    // ściana stopnia: boki i pionowe podziały (im dalej, tym gęściej), tylko część niezasłonięta przez niższy stopień
    float inY = step(max(yb, prevTop), q.y) * step(q.y, yt);
    float sides = max(aa(abs(q.x - xl) * U, w), aa(abs(q.x - xr) * U, w)) * inY;
    float gx = q.x * z + cam.x;
    float ribs = aa(abs(fract(gx + .5) - .5) * U * sc, w * .8) * inX * inY;
    // światło przesuwa się po krawędzi stopnia - stopień po stopniu w górę
    float ph = fract(u_time * .085 - fk * .06);
    float dd = mix(xl, xr + .55, ph / .4) - q.x;
    float sweep = step(0., dd) * (1. - smoothstep(0., .5, dd)) * step(ph, .4);
    float dim = mix(1., .45, fk / 11.);
    acc = max(acc, max(max(nose, sides * .8), max(max(rear, flank) * .5, ribs * .2)) * dim);
    hi = max(hi, nose * sweep * mix(1., .6, fk / 11.));
    cover = max(cover, inX * step(q.y, yt));
    prevTop = yt; prevW = W; prevXl = xl; prevXr = xr;
  }
  return mix(u_ac, vec3(1.), .16) * acc * .95 + mix(u_ac, vec3(1.), .72) * hi * .85
    + vec3(.85, .9, 1.) * stars(p, 5.) * (1. - cover) * .55;
}`,
  // 2 ECHO - czoła fal rozchodzą się od punktu za rysunkiem (odstępy rosną z odległością), każde czoło to kilka łuków;
  // co trzecie mocniejsze, z cienką linią tuż za sobą. Węzeł zapala się, gdy mija go czoło, i powoli gaśnie.
  `float arcs(float ang, float id) {
  float h1 = hash(vec2(id, 3.)), h2 = hash(vec2(id, 8.));
  return smoothstep(-.3, .05, sin(ang * (1. + floor(h1 * 2.99)) + h2 * 6.28318 + u_time * .06 * (h1 - .5)));
}
vec3 scene(vec2 p) {
  float U = min(u_res.y, u_res.x * .9), w = .6 * u_dpr;
  vec2 o = u_focus.xy - U * vec2(.02, .02);
  vec2 d = (p - o) / U;
  float r = length(d), ang = atan(d.y, d.x);
  float spd = u_time * .17 - u_rise * 1.6;
  float g = pow(max(r, 1e-4), .72) * 7. - spd;
  float id = floor(g + .5);
  float major = 1. - step(.5, mod(id, 3.));
  float am = arcs(ang, id);
  float front = gridLine(g, w * mix(1., 1.3, major)) * am * mix(.4, 1., major);
  float trail = gridLine(g + .16, w * .8) * am * .24 * major;
  float fade = 1. - smoothstep(.35, 1.35, r);
  // węzły: po jednym w części komórek rozsianej siatki
  float cs = .19;
  vec2 cell = floor(d / cs);
  vec2 n = (cell + .22 + .56 * vec2(hash(cell + 1.7), hash(cell + 6.1))) * cs;
  float ex = step(.42, hash(cell + 7.7));
  float gn = pow(max(length(n), 1e-4), .72) * 7. - spd;
  float idn = ceil(gn);
  float lit = exp(-(idn - gn) * 6.) * arcs(atan(n.y, n.x), idn) * mix(.5, 1., 1. - step(.5, mod(idn, 3.)));
  vec2 dn = (d - n) * U;
  float halo = aa(abs(length(dn) - 3.4 * u_dpr), w * .9);
  float core = max(aa(length(dn), 1.7 * u_dpr), gem(dn / u_dpr, 12.));
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * (front + trail) * fade * .95 + (lc * halo * .5 + mix(u_ac, vec3(1.), .75) * core * lit) * ex * fade
    + vec3(1.) * gem((p - o) / u_dpr, 13.) * .9;
}`,
  // 3 KRYSZTAŁ - dwudziestościan foremny (12 wierzchołków, 30 krawędzi) obracany wokół osi pionowej z kołysaniem;
  // jasność krawędzi rośnie z głębią punktu (przód jasny, tył ledwo widoczny), w wierzchołkach klejnoty.
  `vec3 turn(vec3 v, vec4 cs) {
  float x1 = v.x * cs.x + v.z * cs.y, z1 = v.z * cs.x - v.x * cs.y;
  return vec3(x1, v.y * cs.z - z1 * cs.w, v.y * cs.w + z1 * cs.z);
}
vec3 proj(vec3 v, vec2 o, float R) { return vec3(o + vec2(v.x, -v.y) * R / (1. - v.z * .22), v.z); }
// krawędź: x = linia (przód jaśniejszy niż tył), y = światło biegnące po krawędzi
vec2 edgeL(vec2 p, vec3 a, vec3 b, float w, float sd) {
  vec2 pa = p - a.xy, ba = b.xy - a.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.);
  float ln = aa(length(pa - ba * h), w) * mix(.2, 1., smoothstep(-.5, .6, mix(a.z, b.z, h)));
  float run = fract(h * .5 - u_time * .13 + sd);
  return vec2(ln, ln * smoothstep(0., .2, run) * (1. - smoothstep(.2, .24, run)));
}
#define E(a, b, s) acc = max(acc, edgeL(p, a, b, w, s));
#define G(v) gm = max(gm, max(gem((p - v.xy) / u_dpr, 11.) * smoothstep(-.1, .7, v.z), aa(length(p - v.xy), 1.5 * u_dpr) * .3));
vec3 scene(vec2 p) {
  float U = min(u_res.y, u_res.x * .9), w = .65 * u_dpr;
  vec2 o = u_focus.xy + vec2(-U * .03, U * (.02 + .06 * u_rise));
  // promień: większy od okna rysunku, ale na telefonie (światło ciaśniejsze w pionie) nie wchodzi w opis nad rysunkiem
  float R = min(U * .58, u_focus.w * .95) * (1. - .22 * u_rise);
  float ay = u_time * .16 + u_rise * 1.3, ax = .46 + .2 * sin(u_time * .1);
  vec4 cs = vec4(cos(ay), sin(ay), cos(ax), sin(ax));
  float n = .5257311, m = .8506508;
  vec3 v0 = proj(turn(vec3(-n, m, 0.), cs), o, R), v1 = proj(turn(vec3(n, m, 0.), cs), o, R);
  vec3 v2 = proj(turn(vec3(-n, -m, 0.), cs), o, R), v3 = proj(turn(vec3(n, -m, 0.), cs), o, R);
  vec3 v4 = proj(turn(vec3(0., -n, m), cs), o, R), v5 = proj(turn(vec3(0., n, m), cs), o, R);
  vec3 v6 = proj(turn(vec3(0., -n, -m), cs), o, R), v7 = proj(turn(vec3(0., n, -m), cs), o, R);
  vec3 v8 = proj(turn(vec3(m, 0., -n), cs), o, R), v9 = proj(turn(vec3(m, 0., n), cs), o, R);
  vec3 va = proj(turn(vec3(-m, 0., -n), cs), o, R), vb = proj(turn(vec3(-m, 0., n), cs), o, R);
  vec2 acc = vec2(0.);
  E(v0, vb, .03) E(v0, v5, .37) E(v0, v1, .71) E(v0, v7, .19) E(v0, va, .55)
  E(vb, v5, .83) E(v5, v1, .11) E(v1, v7, .47) E(v7, va, .93) E(va, vb, .29)
  E(v5, v9, .61) E(v1, v9, .07) E(vb, v4, .41) E(v5, v4, .77) E(va, v2, .23)
  E(vb, v2, .59) E(v7, v6, .89) E(va, v6, .15) E(v1, v8, .51) E(v7, v8, .97)
  E(v3, v9, .33) E(v3, v4, .67) E(v3, v2, .01) E(v3, v6, .43) E(v3, v8, .79)
  E(v9, v4, .25) E(v4, v2, .63) E(v2, v6, .87) E(v6, v8, .13) E(v8, v9, .49)
  float gm = 0.;
  G(v0) G(v1) G(v2) G(v3) G(v4) G(v5) G(v6) G(v7) G(v8) G(v9) G(va) G(vb)
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * acc.x * .95 + mix(u_ac, vec3(1.), .72) * acc.y * .6 + vec3(1.) * gm
    + vec3(.85, .9, 1.) * stars(p, 5.) * .5;
}`,
];

export const Depth = ({ scene }: { scene: number }) => {
  const host = useRef<HTMLElement>(null);
  const reduced = useReducedPref();

  useEffect(() => {
    const el = host.current;
    const card = el?.closest<HTMLElement>('.sf-b-card');
    const art = card?.querySelector<HTMLElement>('.sf-b-art');
    if (!el || !card || !art || reduced) return;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) return;

    let canvas: HTMLCanvasElement | null = null, gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null, buf: WebGLBuffer | null = null;
    let raf = 0, near = false, vis = false, last = 0, failed = false, lastD = -1, ready = false, poll = 0;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const t0 = performance.now();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    // kolor podstrony „r g b” (szmaragd przychodzi z adresu przez ServiceShell; zapas = ten sam szmaragd)
    const ac = (getComputedStyle(card).getPropertyValue('--sv-ac').trim() || '16 185 129').split(/\s+/).map((v) => Number(v) / 255);

    const size = () => {
      if (!canvas || !gl || !ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      const w = Math.max(1, Math.round(card.offsetWidth * dpr)), h = Math.max(1, Math.round(card.offsetHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.dpr, dpr);
      // światło i środek sceny: środek rysunku (położenie z układu - bez skali stosu); w jednej kolumnie (telefon) światło
      // jest ciaśniejsze w pionie - opis karty stoi tuż nad rysunkiem
      const column = art.offsetWidth > card.offsetWidth * 0.8;
      gl.uniform4f(u.focus, (art.offsetLeft + art.offsetWidth / 2) * dpr, (art.offsetTop + art.offsetHeight * (column ? 0.47 : 0.44)) * dpr, art.offsetWidth * 0.68 * dpr, art.offsetHeight * (column ? 0.52 : 0.86) * dpr);
      lastD = -1;
    };

    const init = () => {
      if (gl || failed) return;
      const cv = document.createElement('canvas');
      const g = cv.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!g || !g.getExtension('OES_standard_derivatives')) { failed = true; return; }
      canvas = cv; gl = g;
      const mk = (type: number, src: string) => { const s = g.createShader(type)!; g.shaderSource(s, src); g.compileShader(s); return s; };
      const vs = mk(g.VERTEX_SHADER, VS), fs = mk(g.FRAGMENT_SHADER, HEAD + SCENES[scene % SCENES.length]);
      const pr = g.createProgram()!;
      prog = pr;
      g.attachShader(pr, vs); g.attachShader(pr, fs); g.linkProgram(pr);
      const finish = () => {
        poll = 0;
        if (gl !== g || failed) return;
        if (!g.getProgramParameter(pr, g.LINK_STATUS)) {
          console.warn('strona-firmowa depth: shader', scene, g.getShaderInfoLog(fs) || g.getProgramInfoLog(pr));
          failed = true; g.getExtension('WEBGL_lose_context')?.loseContext(); gl = null; canvas = null; return;
        }
        g.deleteShader(vs); g.deleteShader(fs);
        g.useProgram(pr);
        buf = g.createBuffer();
        g.bindBuffer(g.ARRAY_BUFFER, buf);
        g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
        const loc = g.getAttribLocation(pr, 'a');
        g.enableVertexAttribArray(loc);
        g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
        for (const name of ['res', 'time', 'dpr', 'rise', 'ac', 'focus']) u[name] = g.getUniformLocation(pr, `u_${name}`);
        g.uniform3f(u.ac, ac[0], ac[1], ac[2]);
        g.clearColor(0, 0, 0, 0);
        cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); failed = true; el.removeAttribute('data-ready'); });
        el.appendChild(cv);
        ready = true;
        size();
        wake();
      };
      // kompilacja w tle (wydajność, 2026-10-05): o LINK_STATUS pytamy dopiero, gdy sterownik skończy - pytanie od razu
      // zamrażało przewijanie w chwili, gdy karta zbliżała się do ekranu; bez rozszerzenia działa jak dawniej
      const par = g.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;
      const check = () => {
        poll = 0;
        if (gl !== g || failed) return;
        if (g.isContextLost()) { failed = true; return; }
        if (!par || g.getProgramParameter(pr, par.COMPLETION_STATUS_KHR)) finish(); else poll = requestAnimationFrame(check);
      };
      if (par) poll = requestAnimationFrame(check); else finish();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!gl || !ready || failed || !vis || document.hidden) return;
      raf = requestAnimationFrame(frame);
      // przykryta karta stoi; rysowanie co ~33 ms, a przy wjeździe karty (zmiana --d) co klatkę
      if ((parseFloat(card.style.getPropertyValue('--dp')) || 0) > 0.97) return;
      const d = parseFloat(card.style.getPropertyValue('--d'));
      const dv = Number.isFinite(d) ? d : 1;
      if (now - last < 32 && dv === lastD) return;
      last = now; lastD = dv;
      gl.uniform1f(u.time, (now - t0) / 1000);
      gl.uniform1f(u.rise, 1 - dv);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!el.hasAttribute('data-ready')) el.setAttribute('data-ready', '');
    };
    const wake = () => { if (near && !gl && !failed) init(); if (!raf && gl && ready && vis && !document.hidden) raf = requestAnimationFrame(frame); };

    const ioNear = new IntersectionObserver(([e]) => { near = e.isIntersecting; wake(); }, { rootMargin: '600px 0px' });
    const ioVis = new IntersectionObserver(([e]) => { vis = e.isIntersecting; wake(); }, { rootMargin: '80px 0px' });
    ioNear.observe(card); ioVis.observe(card);
    const ro = new ResizeObserver(() => size());
    ro.observe(card); ro.observe(art);
    document.addEventListener('visibilitychange', wake);

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(poll);
      ioNear.disconnect(); ioVis.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', wake);
      el.removeAttribute('data-ready');
      if (gl) {
        if (prog) gl.deleteProgram(prog);
        if (buf) gl.deleteBuffer(buf);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      canvas?.remove();
    };
  }, [reduced, scene]);

  return <i ref={host} className="sf-b-gl" />;
};
