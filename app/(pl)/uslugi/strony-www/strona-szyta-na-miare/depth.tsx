'use client';

import { useEffect, useRef } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// ŚWIATY LINII - silnik skopiowany z pilota (one-page/depth.tsx, prefiks sm-), sceny własne. Od rundy 5 scena nie
// jest związana z kartą stosu: rysuje na dowolnym gospodarzu (data-dh) - desce, całym ekranie albo pasie. W tle
// żyje świat świecących włosowych linii w kolorze podstrony (decyzja właściciela z pilota: głębię daje świat ZA treścią,
// „dla każdego unikalny shader w tle”; tu inne motywy niż na one-page). Trzy sceny, po jednej na kartę:
//   0 POSADZKA (Sceny pisane dla marki) - posadzka z kafli biegnąca do horyzontu: linie płyną ku widzowi, wybrane kafle
//                                       mają własny, jaśniejszy kontur (każdy element osobno), po liniach biegną impulsy,
//   1 WĘZŁY    (Integracje bez granic) - sieć punktów połączonych odcinkami, po odcinkach wędrują impulsy danych,
//   2 SMUGI    (Zero czekania)         - poziome smugi prędkości: im dalej od osi rysunku, tym szybsze; jasne czoła.
// Światło wspólne: pełna jasność przy rysunku, łagodne wygaszenie pod tekstem (bez masek i prostokątów), przy dolnej
// krawędzi gospodarza scena przygasa. Scena „wschodzi” razem z --d gospodarza (tech.tsx).
// Wydajność: start dopiero przy zbliżeniu gospodarza (600 px), ~30 fps, pauza poza ekranem / gdy scena jest zgaszona
// (--dp = 1 z tech.tsx: w scenach przypiętych rysuje tylko świat bieżącego rozdziału) /
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
  // 0 POSADZKA - płaszczyzna z kafli w perspektywie: linie płyną ku widzowi, co któryś kafel ma własny kontur,
  // po liniach biegnących w głąb wędrują impulsy; nad horyzontem gwiazdy
  `vec3 scene(vec2 p) {
  float H = u_res.y, w = .6 * u_dpr;
  float hor = u_focus.y - H * (.22 - .1 * u_rise);
  vec2 q = vec2((p.x - u_focus.x) / H, (p.y - hor) / H);
  float below = step(.004, q.y);
  float z = .2 / max(q.y, .004);
  vec2 g = vec2(q.x * z * 2.4 + .5, z * 1.5 + u_time * .14);
  float lx = gridLine(g.x, w), lz = gridLine(g.y, w);
  float fog = smoothstep(.012, .2, q.y) * below;
  vec2 cell = floor(g), fc = fract(g) - .5;
  float lit = step(.84, hash(cell)) * (.55 + .45 * sin(u_time * (.5 + hash(cell + 3.3)) + hash(cell + 1.9) * 6.28318));
  float dq = max(abs(fc.x), abs(fc.y));
  float tile = aa(abs(dq - .3) / max(fwidth(dq), 1e-6), w * 1.2) * smoothstep(5., 12., 1. / max(fwidth(g.y), 1e-6));
  float id = floor(g.x + .5);
  float run = fract(g.y * .09 - u_time * (.1 + .08 * hash(vec2(id, 4.))) + hash(vec2(id, 9.)));
  float pulse = smoothstep(0., .25, run) * (1. - smoothstep(.25, .29, run));
  float horizon = aa(abs(p.y - hor), w);
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * max(lz * .55, lx * (.4 + .6 * pulse)) * fog * .9 + mix(u_ac, vec3(1.), .65) * (tile * lit + lx * pulse * .4) * fog
    + lc * horizon * .5 + vec3(.85, .9, 1.) * stars(p, 5.) * (1. - below) * .7;
}`,
  // 1 WĘZŁY - punkty na luźnej siatce (lekko pływają), połączone odcinkami w prawo i w dół; po odcinkach impulsy
  `vec2 nodeAt(vec2 c) { return c + .5 + .28 * vec2(sin(u_time * .3 + hash(c) * 6.28318), cos(u_time * .24 + hash(c + 7.3) * 6.28318)); }
vec2 segD(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  return vec2(length(pa - ba * t), t);
}
vec3 scene(vec2 p) {
  float H = u_res.y, cs = H * .21;
  vec2 g = (p - u_focus.xy) / cs + vec2(0., u_rise * .7);
  vec2 c0 = floor(g);
  float line = 0., pulse = 0., node = 0.;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 c = c0 + vec2(float(i), float(j));
      vec2 a = nodeAt(c);
      node = max(node, aa(length(g - a) * cs, 2.3 * u_dpr));
      vec2 s1 = segD(g, a, nodeAt(c + vec2(1., 0.))), s2 = segD(g, a, nodeAt(c + vec2(0., 1.)));
      float e1 = step(.28, hash(c + 1.7)), e2 = step(.42, hash(c + 4.1));
      line = max(line, max(aa(s1.x * cs, .6 * u_dpr) * e1, aa(s2.x * cs, .6 * u_dpr) * e2));
      float r1 = fract(u_time * (.16 + .12 * hash(c + 2.2)) + hash(c + 3.3));
      float r2 = fract(u_time * (.14 + .1 * hash(c + 5.5)) + hash(c + 6.6));
      pulse = max(pulse, max(aa(s1.x * cs, 1.5 * u_dpr) * e1 * (1. - smoothstep(0., .09, abs(s1.y - r1))), aa(s2.x * cs, 1.5 * u_dpr) * e2 * (1. - smoothstep(0., .09, abs(s2.y - r2)))));
    }
  }
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * line * .5 + mix(u_ac, vec3(1.), .7) * (pulse * .9 + node * .95) + vec3(.85, .9, 1.) * stars(p, 2.) * .35;
}`,
  // 2 SMUGI - poziome smugi prędkości w rzędach: ogon gaśnie, czoło jasne; dalej od osi rysunku szybciej (paralaksa)
  `vec3 scene(vec2 p) {
  float H = u_res.y;
  float rowH = 8. * u_dpr;
  float row = floor(p.y / rowH);
  float yy = abs(fract(p.y / rowH) - .5) * rowH;
  float dist = abs((row + .5) * rowH - u_focus.y) / H;
  float on = step(.4, hash(vec2(row, 1.)));
  float sp = (.3 + hash(vec2(row, 2.))) * (.3 + 2.6 * dist);
  float len = .5 + .9 * hash(vec2(row, 3.));
  float u = (p.x - u_focus.x) / H / len - u_time * sp * .5 + hash(vec2(row, 4.)) * 7. + u_rise * 1.5;
  float ph = fract(u);
  float tail = smoothstep(.3, 1., ph);
  tail *= tail;
  float head = smoothstep(.975, 1., ph);
  vec3 lc = mix(u_ac, vec3(1.), .16);
  return lc * aa(yy, .6 * u_dpr) * on * tail * (.35 + .65 * hash(vec2(row, 5.)))
    + mix(u_ac, vec3(1.), .75) * aa(yy, 1.1 * u_dpr) * on * head + vec3(.85, .9, 1.) * stars(p, 4.) * .4;
}`,
];

export const Depth = ({ scene }: { scene: number }) => {
  const host = useRef<HTMLElement>(null);
  const reduced = useReducedPref();

  useEffect(() => {
    const el = host.current;
    // gospodarz sceny = najbliższy przodek z data-dh (deska, cały ekran albo pas - tech.tsx); środek światła i sceny
    // = jego element z data-df (bezpośrednio pozycjonowany względem gospodarza)
    const card = el?.closest<HTMLElement>('[data-dh]');
    const art = card?.querySelector<HTMLElement>('[data-df]');
    if (!el || !card || !art || reduced) return;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) return;

    let canvas: HTMLCanvasElement | null = null, gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null, buf: WebGLBuffer | null = null;
    let raf = 0, near = false, vis = false, last = 0, failed = false, lastD = -1, ready = false, poll = 0;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const t0 = performance.now();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const ac = (getComputedStyle(card).getPropertyValue('--sv-ac').trim() || '244 63 94').split(/\s+/).map((v) => Number(v) / 255);

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
          console.warn('na-miare depth: shader', scene, g.getShaderInfoLog(fs) || g.getProgramInfoLog(pr));
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

  return <i ref={host} className="sm-b-gl" />;
};
