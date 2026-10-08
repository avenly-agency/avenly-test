'use client';

import { useEffect, useRef } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// GŁĘBIA KART STOSU: w tle każdej karty żyje świat świecących włosowych linii w kolorze podstrony - to samo uczucie
// głębi co karty „Dlaczego Avenly” na stronie głównej, ale inne motywy (właściciel 2026-10-01: „mają głębię, której
// szukam, ale nie chcę 1:1 takich samych”, „dla każdego unikalny shader w tle”; 2026-10-02: „te same, ale trochę
// ciekawiej - są spoko dopasowane, ale zrób je lepsze, ładniejsze, nowocześniejsze”). Cztery sceny, po jednej na kartę:
//   0 ZBIEG    (Laserowe skupienie)       - skręcony korytarz zaokrąglonych kadrów: wszystko zbiega się w jednym punkcie
//                                           (ostra gwiazda) za rysunkiem, kadry płyną ku widzowi, po promieniach biegną
//                                           impulsy światła, punkt zbiegu powoli dryfuje,
//   1 HORYZONT (Wizytówka w sieci)        - krzywizna planety z hero jak rysunek techniczny: siatka z węzłami, impulsy
//                                           na południkach, podwójna krawędź (atmosfera), słońce wschodzące na
//                                           horyzoncie i gwiazdy,
//   2 FALE     (Idealne pod mobile)       - przelot nad grzbietami fal: rzędy płyną ku widzowi (jak przewijanie),
//                                           bliższe zasłaniają dalsze, grzbiety jaśniejsze, po falach przesuwa się
//                                           pas światła,
//   3 ORBITY   (Szybkość, która oszczędza)- żyroskop orbit o różnych nachyleniach z precesją; satelity ciągną długie
//                                           smugi, im bliżej środka, tym szybciej; gwiazdy w tle.
// Światło wspólne: pełna jasność przy rysunku, łagodne wygaszenie pod tekstem (bez masek i prostokątów), przy dolnej
// krawędzi karty (podpis rysunku) scena przygasa. Scena „wschodzi”, gdy karta wjeżdża (--d z cases.tsx).
// Wydajność: start dopiero przy zbliżeniu karty (600 px), ~30 fps, pauza poza ekranem / pod przykryciem (--dp) /
// przy ukrytej karcie przeglądarki, DPR do 1,5 (dotyk 1,25). Bez WebGL / Save-Data / ≤ 2 GB RAM / ograniczony ruch:
// zostaje papier kreślarski z CSS.
// GLSL ES 1.0: pochodne (fwidth) tylko poza rozgałęzieniami, pętle o stałej długości.

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
  float pool = 1. - smoothstep(.4, 1.5, length(q));
  pool = pool * pool * (3. - 2. * pool);
  col *= (.08 + .92 * pool) * (1. - .55 * smoothstep(u_res.y * .74, u_res.y * .97, p.y));
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0., 1.));
}
`;

const SCENES = [
  // 0 ZBIEG - skręcony korytarz zaokrąglonych kadrów (superelipsa w skali geometrycznej), promienie co 15 stopni
  // z impulsami światła biegnącymi od punktu zbiegu, w punkcie zbiegu ostra gwiazda
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  vec2 vp = u_focus.xy + H * vec2(.035 * sin(u_time * .21), -.03 + .025 * cos(u_time * .17));
  vec2 q0 = (p - vp) / H * vec2(1., 1.5);
  float lm = log(max(length(q0), 1e-3));
  float tw = .2 * lm + .07 * sin(u_time * .13);
  float ct = cos(tw), st = sin(tw);
  vec2 q = vec2(q0.x * ct - q0.y * st, q0.x * st + q0.y * ct);
  vec2 a = abs(q);
  float m = pow(pow(a.x, 7.) + pow(a.y, 7.), .142857);
  float g = log(max(m, 1e-4)) * 3.6 - u_time * .2 + u_rise * 1.4;
  float frames = max(gridLine(g, w) * .4, gridLine(g / 4., w * 1.35));
  float a1 = atan(q.y, q.x) * 3.819719, a2 = atan(-q.y, -q.x) * 3.819719;
  float right = step(0., q.x);
  float rail = mix(gridLine(a2, w), gridLine(a1, w), right);
  float id = mod(floor(mix(a2 + 12., a1, right) + .5), 24.);
  float run = fract(lm * .5 - u_time * (.14 + .1 * hash(vec2(id, 3.))) + hash(vec2(id, 7.)));
  float pulse = smoothstep(0., .3, run) * (1. - smoothstep(.3, .34, run));
  float fog = smoothstep(.01, .16, m);
  vec3 lc = mix(u_ac, vec3(1.), .16);
  vec3 col = lc * max(frames, rail * (.2 + .8 * pulse)) * fog * .95 + mix(u_ac, vec3(1.), .65) * rail * pulse * fog * .45;
  return col + vec3(1.) * gem((p - vp) / u_dpr, 14.);
}`,
  // 1 HORYZONT - kula: wierzchołek tuż pod środkiem rysunku, biegun odchylony od widza; siatka z węzłami i impulsami,
  // podwójna krawędź, słońce na horyzoncie
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  float R = H * 1.62;
  vec2 c = vec2(u_focus.x + H * .06, u_focus.y + H * (.05 + .1 * u_rise) + R);
  vec2 dd = (p - c) / R; dd.y = -dd.y;
  float r2 = dot(dd, dd);
  float inside = step(r2, 1.);
  vec3 n = vec3(dd, sqrt(max(1. - r2, 0.)));
  float ct = cos(.62), st = sin(.62);
  vec3 m = vec3(n.x, n.y * ct - n.z * st, n.y * st + n.z * ct);
  float lat = asin(clamp(m.y, -1., 1.)) * 57.29578;
  float lon = atan(m.x, m.z) * 57.29578 + u_time * .55 + 17.;
  float minor = max(gridLine(lon / 2., w), gridLine(lat / 1.5, w));
  float gl = lon / 10., gt = lat / 7.5;
  float mer = gridLine(gl, w * 1.3), par = gridLine(gt, w * 1.3);
  // impuls światła na każdym południku (ku horyzontowi) i węzły na przecięciach głównych linii
  float mid = floor(gl + .5);
  float run = fract(lat / 46. + u_time * (.05 + .04 * hash(vec2(mid, 2.))) + hash(vec2(mid, 5.)));
  float pulse = smoothstep(0., .22, run) * (1. - smoothstep(.22, .26, run));
  float dense = smoothstep(4., 10., 1. / max(fwidth(gl), 1e-6)) * smoothstep(4., 10., 1. / max(fwidth(gt), 1e-6));
  float node = aa(length(vec2(gridPx(gl), gridPx(gt))), 1.9 * u_dpr) * dense;
  float lam = max(dot(n, normalize(vec3(.5, .55, .67))), 0.);
  float dist = (1. - sqrt(r2)) * R;
  float graze = .16 + .84 * exp(-max(dist, 0.) / (H * .26));
  float lines = max(minor * .28, max(par * .85, mer * (.5 + .5 * pulse))) * (.25 + .75 * lam) * graze * inside;
  // słońce na krawędzi: krawędź i atmosfera jaśnieją w jego stronę
  float sa = -.42 + .2 * sin(u_time * .09);
  vec2 sun = c + R * vec2(sin(sa), -cos(sa));
  float sunlit = exp(-dot(p - sun, p - sun) / (H * H * .09));
  float rim = (1. - smoothstep(0., 1.4 * u_dpr, abs(dist))) * (.55 + .45 * sunlit);
  float rim2 = (1. - smoothstep(0., 1. * u_dpr, abs(dist + 6. * u_dpr))) * (.1 + .4 * sunlit);
  float atm = exp(-max(dist, 0.) / (H * .07)) * inside * (.6 + .8 * sunlit);
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * lines * .92 + mix(u_ac, vec3(1.), .7) * (mer * pulse * .35 + node * .9) * graze * inside
    + mix(u_ac, vec3(1.), .5) * (rim * .95 + rim2) + u_ac * atm * .3
    + vec3(1.) * gem((p - sun) / u_dpr, 22.) + vec3(.85, .9, 1.) * stars(p, 7.) * (1. - inside) * .7;
}`,
  // 2 FALE - przelot nad grzbietami: rzędy terenu płyną ku widzowi, bliższy grzbiet zasłania dalsze; grzbiety jaśniejsze,
  // po falach przesuwa się pas światła
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .65 * u_dpr;
  float hor = u_focus.y - H * .05 + H * .1 * u_rise;
  float x0 = (p.x - u_focus.x) / H;
  float ts = u_time * .22;
  float row0 = floor(ts) + 1., fr = fract(ts);
  float sweep = exp(-pow((x0 - (fract(u_time * .06) * 3.2 - 1.6)) * 2.4, 2.));
  float acc = 0., hi = 0., vis = 1.;
  for (int i = 0; i < 20; i++) {
    float fi = float(i);
    float u = fi + 1. - fr;
    float z = pow(1.17, u - 1.);
    float nrow = row0 + fi;
    float xw = x0 * z + nrow * .37;
    float s1 = xw * 1.9 + nrow * .83, s2 = xw * 4.3 - nrow * 1.7, s3 = xw * .7 + nrow * .4;
    float hgt = sin(s1) * .5 + sin(s2) * .22 + sin(s3) * .45;
    float amp = H * .1 / z;
    float Y = hor + H * .66 / z - hgt * amp;
    float slope = (cos(s1) * .95 + cos(s2) * .946 + cos(s3) * .315) * z * amp / H;
    float ln = aa(abs(p.y - Y) / sqrt(1. + slope * slope), w) * vis;
    float crest = smoothstep(-.3, .95, hgt);
    float b = mix(1., .5, u / 20.) * smoothstep(20., 17., u) * (.55 + .45 * crest) * (.8 + .6 * sweep);
    acc = max(acc, ln * b);
    hi = max(hi, ln * crest * crest * (.35 + .65 * sweep));
    vis *= step(p.y, Y + w);
  }
  return mix(u_ac, vec3(1.), .16) * acc * .95 + mix(u_ac, vec3(1.), .7) * hi * .4;
}`,
  // 3 ORBITY - żyroskop: każda orbita ma własne nachylenie i węzeł, które powoli się zmieniają (precesja); satelita
  // ciągnie długą smugę, przód orbity jaśniejszy niż tył
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .65 * u_dpr;
  vec2 c = u_focus.xy + vec2(H * .02, H * (.05 + .08 * u_rise));
  vec2 d = (p - c) / H;
  float acc = 0., sat = 0.;
  for (int j = 0; j < 6; j++) {
    float fj = float(j);
    float r = .2 + fj * .14;
    float node = -.35 + fj * .5 + u_time * (.04 + .01 * fj) * (mod(fj, 2.) * 2. - 1.);
    float inc = .3 + .16 * sin(fj * 2.3 + u_time * .06);
    float cn = cos(node), sn = sin(node);
    vec2 q = vec2(d.x * cn + d.y * sn, (d.y * cn - d.x * sn) / inc);
    float rr = length(q);
    float ang = atan(q.y, q.x);
    float th = u_time * .62 / pow(r / .2, 1.5) + fj * 2.4;
    float trail = exp(-mod(th - ang, 6.28318) * 1.5);
    float front = mix(.45, 1., smoothstep(-.3, .3, sin(ang)));
    acc = max(acc, aa(abs(rr - r) / max(fwidth(rr), 1e-6), w) * (.3 + .7 * trail) * front);
    vec2 v = vec2(cos(th), sin(th) * inc) * r;
    sat = max(sat, aa(length(d - vec2(v.x * cn - v.y * sn, v.x * sn + v.y * cn)) * H, 2.3 * u_dpr));
  }
  return mix(u_ac, vec3(1.), .16) * acc * .92 + mix(u_ac, vec3(1.), .7) * sat
    + vec3(1.) * gem((p - c) / u_dpr, 12.) * .9 + vec3(.85, .9, 1.) * stars(p, 3.) * .6;
}`,
];

export const Depth = ({ scene }: { scene: number }) => {
  const host = useRef<HTMLElement>(null);
  const reduced = useReducedPref();

  useEffect(() => {
    const el = host.current;
    const card = el?.closest<HTMLElement>('.one-b-card');
    const art = card?.querySelector<HTMLElement>('.one-b-art');
    if (!el || !card || !art || reduced) return;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) return;

    let canvas: HTMLCanvasElement | null = null, gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null, buf: WebGLBuffer | null = null;
    let raf = 0, near = false, vis = false, last = 0, failed = false, lastD = -1, ready = false, poll = 0;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const t0 = performance.now();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const ac = (getComputedStyle(card).getPropertyValue('--sv-ac').trim() || '59 130 246').split(/\s+/).map((v) => Number(v) / 255);

    const size = () => {
      if (!canvas || !gl || !ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      const w = Math.max(1, Math.round(card.offsetWidth * dpr)), h = Math.max(1, Math.round(card.offsetHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.dpr, dpr);
      // światło i środek sceny: środek rysunku (położenie z układu - bez skali stosu)
      gl.uniform4f(u.focus, (art.offsetLeft + art.offsetWidth / 2) * dpr, (art.offsetTop + art.offsetHeight * 0.44) * dpr, art.offsetWidth * 0.68 * dpr, art.offsetHeight * 0.86 * dpr);
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
          console.warn('one-page depth: shader', scene, g.getShaderInfoLog(fs) || g.getProgramInfoLog(pr));
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

  return <i ref={host} className="one-b-gl" />;
};
