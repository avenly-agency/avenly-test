'use client';

import { useEffect, useRef } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// GŁĘBIA KART STOSU - sklep internetowy (silnik skopiowany z pilota one-page; własne sceny dobrane do treści kart).
// W tle każdej karty żyje świat świecących włosowych linii w kolorze podstrony (to samo uczucie głębi co karty
// „Dlaczego Avenly” na stronie głównej, inne motywy). Cztery sceny, po jednej na kartę:
//   0 SYGNAŁ  (Płatność w jedno kliknięcie) - równoległe ścieżki sygnału: po każdej biegnie impuls (paczka fal),
//                                             a od środka rozchodzą się kręgi potwierdzenia jak przy zbliżeniu karty,
//   1 TRASY   (Wysyłka pod kontrolą)        - siatka dróg w perspektywie aż po horyzont: po drogach jadą światła
//                                             (paczki) ku widzowi i w poprzek, nad horyzontem gwiazdy,
//   2 KASKADA (Zakupy na telefonie)         - pionowe strumienie: kreski spływają w dół z różną prędkością jak treść
//                                             przewijana kciukiem, każda z jasną główką,
//   3 SŁUPKI  (Wiesz, co podnosi sprzedaż)  - krajobraz słupków wykresu: wysokości falują i rosną ku prawej, szczyty
//                                             jaśniejsze, nad nimi linia trendu.
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
  // 0 SYGNAŁ - równoległe ścieżki, po każdej biegnie paczka fal (impuls płatności); od środka rozchodzą się kręgi
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  vec2 c = u_focus.xy + vec2(0., H * .07 * u_rise);
  float acc = 0., hi = 0.;
  for (int i = 0; i < 13; i++) {
    float fi = float(i);
    float y0 = c.y + (fi - 6.) * H * .064;
    float sp = .07 + .06 * hash(vec2(fi, 3.));
    float ph = fract(u_time * sp + hash(vec2(fi, 9.)));
    float xp = c.x + (ph * 3.4 - 1.7) * H;
    float u = (p.x - xp) / (H * .1);
    float env = exp(-u * u);
    float amp = H * .034 * (.45 + hash(vec2(fi, 5.)));
    float y = y0 - env * sin(u * 5.) * amp;
    float slope = (env * amp / (H * .1)) * abs(5. * cos(u * 5.) - 2. * u * sin(u * 5.));
    float ln = aa(abs(p.y - y) / sqrt(1. + slope * slope), w);
    float fade = 1. - smoothstep(H * .26, H * .46, abs(y0 - c.y));
    acc = max(acc, ln * (.3 + .7 * env) * fade);
    hi = max(hi, ln * env * fade);
  }
  float r = length((p - c) / H);
  float ring = gridLine(r * 5.5 - u_time * .3, w) * smoothstep(.6, .08, r) * .5;
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * max(acc * .92, ring) + mix(u_ac, vec3(1.), .7) * hi * .5 + vec3(1.) * gem((p - c) / u_dpr, 12.) * .9;
}`,
  // 1 TRASY - płaszczyzna dróg w perspektywie: linie wzdłuż i w poprzek, po drogach jadą światła, nad horyzontem gwiazdy
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  float hor = u_focus.y - H * .2 + H * .1 * u_rise;
  float dy = (p.y - hor) / H;
  float below = step(.004, dy);
  float z = .3 / max(dy, .004);
  float x = (p.x - u_focus.x - H * .05) / H * z * 1.7;
  float zz = z * 1.4 + u_time * .22;
  float gx = gridLine(x, w), gz = gridLine(zz, w);
  float fog = smoothstep(11., 1.1, z);
  float id = floor(x + .5);
  float run = fract(z * .13 + u_time * (.07 + .07 * hash(vec2(id, 2.))) + hash(vec2(id, 7.)));
  float pulse = smoothstep(0., .25, run) * (1. - smoothstep(.25, .29, run));
  float idz = floor(zz + .5);
  float run2 = fract(x * .08 + u_time * (.05 + .05 * hash(vec2(idz, 4.))) + hash(vec2(idz, 1.)));
  float pulse2 = smoothstep(0., .2, run2) * (1. - smoothstep(.2, .24, run2));
  float lines = max(gx * (.28 + .72 * pulse), gz * (.24 + .6 * pulse2)) * fog * below;
  float horizon = aa(abs(p.y - hor), w * 1.2) * .55;
  vec2 sun = vec2(u_focus.x + H * .34, hor);
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * (lines * .95 + horizon) + mix(u_ac, vec3(1.), .7) * (gx * pulse + gz * pulse2) * fog * below * .4
    + vec3(.85, .9, 1.) * stars(p, 5.) * (1. - below) * .65 + vec3(1.) * gem((p - sun) / u_dpr, 18.);
}`,
  // 2 KASKADA - pionowe strumienie: kreski spływają w dół z różną prędkością, każda z jasną główką
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  float cw = H * .062;
  float xc = (p.x - u_focus.x) / cw;
  float id = floor(xc + .5);
  float dpx = abs(xc - id) * cw;
  float k = 1.1 + 1.3 * hash(vec2(id, 8.));
  float sp = .1 + .22 * hash(vec2(id, 3.));
  float v = p.y / H * k - u_time * sp + hash(vec2(id, 5.)) * 7. + u_rise * 1.5;
  float sg = fract(v);
  float tail = smoothstep(0., .62, sg) * (1. - smoothstep(.62, .64, sg));
  float line = aa(dpx, w);
  float hy = (sg - .63) * H / k;
  float head = aa(length(vec2(dpx, hy)), 1.7 * u_dpr);
  float fade = 1. - smoothstep(H * .3, H * .8, abs(p.x - u_focus.x));
  float base = line * (.1 + .9 * tail * tail) * fade;
  float scan = gridLine(p.y / (H * .5) - u_time * .05, w) * .16 * fade;
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * max(base, scan) * .95 + mix(u_ac, vec3(1.), .75) * head * fade;
}`,
  // 3 SŁUPKI - krajobraz słupków wykresu: wysokości falują i rosną ku prawej, szczyty jaśniejsze, nad nimi linia trendu
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  float base = u_focus.y + H * .36;
  float bw = H * .078;
  float xb = (p.x - u_focus.x) / bw;
  float id = floor(xb);
  float fx = fract(xb);
  float tr = .22 + .028 * id;
  float h = tr + .09 * sin(id * 1.7 + u_time * .45) + .05 * sin(id * .63 - u_time * .3);
  h = clamp(h, .05, .66) * H * (1. - .6 * u_rise);
  float top = base - h;
  float inside = step(top, p.y) * step(p.y, base);
  float inx = step(.16, fx) * step(fx, .84);
  float eL = aa(abs(fx - .16) * bw, w), eR = aa(abs(fx - .84) * bw, w);
  float eT = aa(abs(p.y - top), w * 1.2) * inx;
  float sides = max(eL, eR) * inside;
  float hatch = gridLine((base - p.y) / (H * .028), w) * inside * inx * .22;
  float ground = aa(abs(p.y - base), w) * .5;
  float fade = 1. - smoothstep(H * .4, H * .9, abs(p.x - u_focus.x));
  // linia trendu nad słupkami + światło biegnące po niej
  float xt = (p.x - u_focus.x) / bw;
  float yt = base - (tr + .028 * (xt - id) + .14) * H * (1. - .6 * u_rise);
  float trend = aa(abs(p.y - yt) / sqrt(1. + .0008 * H * H / (bw * bw)), w * 1.1);
  float run = fract(xt * .07 - u_time * .12);
  float pulse = smoothstep(0., .3, run) * (1. - smoothstep(.3, .34, run));
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * (max(max(sides * .55, eT), hatch) + ground + trend * (.3 + .7 * pulse)) * fade * .95
    + mix(u_ac, vec3(1.), .7) * (eT * .35 + trend * pulse * .45) * fade + vec3(.85, .9, 1.) * stars(p, 2.) * step(p.y, top) * .45;
}`,
];

export const Depth = ({ scene }: { scene: number }) => {
  const host = useRef<HTMLElement>(null);
  const reduced = useReducedPref();

  useEffect(() => {
    const el = host.current;
    const card = el?.closest<HTMLElement>('.sk-k-card');
    const art = card?.querySelector<HTMLElement>('.sk-k-art');
    if (!el || !card || !art || reduced) return;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) return;

    let canvas: HTMLCanvasElement | null = null, gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null, buf: WebGLBuffer | null = null;
    let raf = 0, near = false, vis = false, last = 0, failed = false, lastD = -1, ready = false, poll = 0;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const t0 = performance.now();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const ac = (getComputedStyle(card).getPropertyValue('--sv-ac').trim() || '245 158 11').split(/\s+/).map((v) => Number(v) / 255);

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
          console.warn('sklep depth: shader', scene, g.getShaderInfoLog(fs) || g.getProgramInfoLog(pr));
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

  return <i ref={host} className="sk-k-gl" />;
};
