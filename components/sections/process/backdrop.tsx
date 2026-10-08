'use client';

import { useEffect, useRef } from 'react';
import { ACC, crossWidth, GLASS_GLSL, SILVER, twistAngle, type RGB } from './silk';

// Tło sekcji "Proces" - GŁĘBIA (wybór właściciela 2026-09-27 z propozycji Kaustyki / Soczewki / Tafle /
// Głębia / Nici / Bez tła; pozostałe usunięte). Dwie szerokie szklane wstęgi w oddali - ten sam materiał
// (GLASS_GLSL: szlif krawędzi, ostre refleksy, przydymione wnętrze), skręt i przejście przez krawędź co
// wstęga główna ("tło głębia również daj szklane"), przygaszone. Tło leży DALEKO: przesuwa się wolniej
// niż strona (paralaksa = głębia bez rozmycia), gaśnie pod tekstem (nagłówek, kroki, CTA) oraz przy
// górnej i dolnej krawędzi sekcji (sekcja zaczyna się i kończy czernią). Barwa = NEUTRALNE chłodne srebro
// z ledwie wyczuwalną (18%) nutą akcentu etapu na ekranie (płynne przejście) - kolorowa wstęga główna
// ma się od tła odcinać (2026-09-27: "wstęga się zlewa z tłem przez ten sam kolor").
// WebGL na płótnie przyklejonym do okna (sticky, rozmiar okna - nie całej sekcji): CPU liczy paski
// trójkątów (kilkaset punktów), szkło, wygaszenie pod tekstem i przy krawędziach sekcji liczy shader na
// piksel, krawędzie wygładza MSAA i pochodna. Tło nie jest związane z tekstem, więc spóźnienie o klatkę
// przy przewijaniu palcem jest niewidoczne. Rysowanie w każdej klatce przewijania (paralaksa),
// w spoczynku ~30 fps (powolny ruch), pauza poza ekranem i przy ukrytej karcie, DPR <= 1,5 (dotyk 1,25).
// Telefon: węższe wstęgi, w pełni widoczne w odstępach między krokami i przy krawędziach ekranu.
// Reduced motion: bez paralaksy i ruchu w czasie. Bez WebGL (lub po utracie kontekstu) - czysta czerń.

const TAU = Math.PI * 2;
const FRAME = 1000 / 30;
const MAX_RECTS = 6; // .pr-head + 4 x .pw-copy + .pr-cta

interface Band { p: number; w: number; wp: number; k: number; a: number; lam: number; phi: number; flip: number; drift: number; x0: number }
// Dalsza (p mniejsze = wolniej = dalej) rysowana pierwsza. w / wp = szerokość komputer / telefon (px).
const BANDS: Band[] = [
  { p: 0.5, w: 250, wp: 130, k: 0.28, a: 0.34, lam: 2.4, phi: 0.5, flip: 1900, drift: 0.07, x0: 0.52 },
  { p: 0.72, w: 160, wp: 92, k: 0.38, a: 0.4, lam: 1.75, phi: 2.7, flip: 1400, drift: 0.1, x0: 0.48 },
];

/** Linia środkowa: szeroka fala w poprzek sekcji + druga, krótsza (organicznie). Zwraca x i dx/dy. */
const path = (yv: number, W: number, vh: number, a: number, lam: number, phi: number, x0: number, tt: number) => {
  const L = lam * vh, L2 = L * 0.41;
  const u = (yv / L) * TAU + phi + tt, u2 = (yv / L2) * TAU + phi * 1.7 - tt * 0.6;
  return {
    x: W * (x0 + a * Math.sin(u) + 0.06 * Math.sin(u2)),
    dx: W * (a * Math.cos(u) * (TAU / L) + 0.06 * Math.cos(u2) * (TAU / L2)),
  };
};

// Wierzchołek: pozycja (px CSS płótna) + d = (v w poprzek -1..1, kąt skrętu, normalna linii środkowej).
const VS = `
attribute vec2 a_pos;
attribute vec4 a_d;
uniform vec2 u_res;
varying vec4 v_d;
varying vec2 v_px;
void main() {
  v_d = a_d;
  v_px = a_pos;
  vec2 c = a_pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;
const FS = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec4 v_d;
varying vec2 v_px;
uniform vec3 u_tint;
uniform float u_k;
uniform vec2 u_sec;
uniform float u_nr;
uniform vec4 u_rects[${MAX_RECTS}];
${GLASS_GLSL}
// Wygaszenie pod tekstem: do 16% w prostokącie tekstu (+ zapas), łagodnie na 160 px.
float textFade(vec2 p) {
  float m = 1.0;
  for (int i = 0; i < ${MAX_RECTS}; i++) {
    if (float(i) >= u_nr) break;
    vec4 r = u_rects[i];
    vec2 d = max(max(r.xy - p, p - r.zw), 0.0);
    m = min(m, 0.16 + 0.84 * smoothstep(-10.0, 160.0, length(d)));
  }
  return m;
}
void main() {
  float ys = v_px.y - u_sec.x;
  float f = smoothstep(0.0, 340.0, ys) * smoothstep(0.0, 340.0, u_sec.y - ys) * textFade(v_px);
  float v = v_d.x;
  float fw = max(fwidth(v), 1e-4);
  float dpx = (1.0 - abs(v)) / fw;
  float a = v_d.y + v * 0.5;
  vec2 n2 = normalize(v_d.zw);
  vec3 n = vec3(-n2 * sin(a), cos(a));
  float front = step(0.0, n.z);
  n *= front * 2.0 - 1.0;
  float hwid = max(fwidth(dot(n, SH)), 0.002);
  gl_FragColor = glass(n, front, dpx, 2.0 / fw, u_tint, u_k, 0.972, hwid, 0.0) * clamp(dpx, 0.0, 1.0) * f;
}`;

export const RibbonBackdrop = ({ reduced }: { reduced: boolean }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const section = host?.parentElement;
    if (!host || !section) return;
    // Płótno tworzone przy każdym montażu = nowy kontekst WebGL (podwójny montaż w trybie dev
    // i zwalnianie kontekstu w sprzątaniu nie trafiają na ten sam, utracony kontekst).
    const canvas = document.createElement('canvas');
    canvas.className = 'pw-bg-canvas';
    host.appendChild(canvas);
    const steps = Array.from(section.querySelectorAll<HTMLElement>('.pw-step'));
    const texts = Array.from(section.querySelectorAll<HTMLElement>('.pr-head, .pw-copy, .pr-cta'));
    let W = 0, VH = 0, dpr = 1, phone = false;
    const tint: RGB = [...SILVER];
    let lastTop = NaN, last = 0, lastNow = 0, ready = false;

    // --- WebGL ---
    let gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram | null = null, vs: WebGLShader | null = null, fs: WebGLShader | null = null, buf: WebGLBuffer | null = null;
    let U: Record<string, WebGLUniformLocation | null> = {};
    const init = () => {
      gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, depth: false, stencil: true, powerPreference: 'low-power' });
      if (!gl || gl.isContextLost() || !gl.getExtension('OES_standard_derivatives')) { gl = null; return false; }
      const mk = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return s;
      };
      vs = mk(gl.VERTEX_SHADER, VS);
      fs = mk(gl.FRAGMENT_SHADER, FS);
      prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn('Proces - tło: shader', gl.getShaderInfoLog(fs), gl.getProgramInfoLog(prog));
        return false;
      }
      gl.useProgram(prog);
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      const aPos = gl.getAttribLocation(prog, 'a_pos'), aD = gl.getAttribLocation(prog, 'a_d');
      gl.enableVertexAttribArray(aPos);
      gl.enableVertexAttribArray(aD);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 24, 0);
      gl.vertexAttribPointer(aD, 4, gl.FLOAT, false, 24, 8);
      U = {};
      for (const n of ['u_res', 'u_tint', 'u_k', 'u_sec', 'u_nr', 'u_rects']) U[n] = gl.getUniformLocation(prog, n);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      // Zakładki pasa przy przejściu przez krawędź rysowane raz (piksel przyjmuje pierwszy fragment).
      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.EQUAL, 0, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
      gl.clearColor(0, 0, 0, 0);
      return true;
    };
    const release = () => {
      if (!gl) return;
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };

    const resize = () => {
      W = canvas.clientWidth;
      VH = canvas.clientHeight;
      phone = W < 768;
      dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(VH * dpr));
      lastTop = NaN;
    };

    // Bufor wierzchołków (6 floatów na wierzchołek), rośnie w razie potrzeby.
    let data = new Float32Array(6 * 2048);
    let len = 0;
    const push = (x: number, y: number, v: number, a: number, nx: number, ny: number) => {
      if (len + 6 > data.length) { const d = new Float32Array(data.length * 2); d.set(data); data = d; }
      data[len++] = x; data[len++] = y; data[len++] = v; data[len++] = a; data[len++] = nx; data[len++] = ny;
    };

    const draw = (now: number) => {
      if (!gl) return;
      const sr = section.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();
      const H = sr.height;
      const tt = reduced ? 0 : now / 1000;
      // Aktywny etap = najbliżej środka okna; barwa tła dochodzi do jego akcentu płynnie (~0,6 s).
      let act = 0, best = Infinity;
      steps.forEach((s, i) => {
        const b = s.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - VH / 2);
        if (d < best) { best = d; act = i; }
      });
      const f = reduced || !lastNow ? 1 : 1 - Math.exp(-Math.min(100, now - lastNow) / 600);
      lastNow = now;
      for (let i = 0; i < 3; i++) tint[i] += (SILVER[i] + (ACC[act][i] - SILVER[i]) * 0.18 - tint[i]) * f;
      // Prostokąty tekstu (px płótna) z zapasem - pod nimi tło gaśnie.
      const rects = new Float32Array(MAX_RECTS * 4);
      let nr = 0;
      for (const el of texts) {
        const b = el.getBoundingClientRect();
        if (b.bottom - cr.top < -200 || b.top - cr.top > VH + 200 || nr >= MAX_RECTS) continue;
        rects.set([b.left - cr.left - 24, b.top - cr.top - 24, b.right - cr.left + 24, b.bottom - cr.top + 24], nr * 4);
        nr++;
      }
      // Paralaksa: przy sekcji na środku okna warstwy się pokrywają, poza tym dalsze zostają w tyle.
      const ref = VH / 2 - H / 2;
      const offOf = (p: number) => (reduced ? 1 : p) * (sr.top - ref) + ref - cr.top;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.u_res, W, VH);
      gl.uniform3f(U.u_tint, tint[0] / 255, tint[1] / 255, tint[2] / 255);
      gl.uniform2f(U.u_sec, sr.top - cr.top, H);
      gl.uniform1f(U.u_nr, nr);
      gl.uniform4fv(U.u_rects, rects);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      for (const b of BANDS) {
        const off = offOf(b.p);
        const bw = phone ? b.wp : b.w;
        len = 0;
        for (let yc = -bw; yc <= VH + bw; yc += 4) {
          const yv = yc - off;
          const { x, dx } = path(yv, W, VH, b.a, b.lam, b.phi, b.x0, tt * 0.05);
          const l = Math.hypot(dx, 1);
          const nx = 1 / l, ny = -dx / l;
          // Skręt jak wstęga główna: długo lico, krótko krawędź, ustawiona bokiem = cienka krawędź szkła.
          const a = twistAngle(yv, b.flip, tt * b.drift, b.phi);
          const w = crossWidth((bw / 2) * (0.9 + 0.1 * Math.sin(yv / 500)), a, 1.2);
          push(x + nx * w, yc + ny * w, 1, a, nx, ny);
          push(x - nx * w, yc - ny * w, -1, a, nx, ny);
        }
        gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, len), gl.DYNAMIC_DRAW);
        gl.clear(gl.STENCIL_BUFFER_BIT); // każda wstęga osobno: bliższa nakłada się na dalszą
        gl.uniform1f(U.u_k, b.k);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, len / 6);
      }
      if (!ready) { ready = true; host.setAttribute('data-ready', ''); }
    };

    let raf = 0, visible = false;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || !gl) return;
      const top = section.getBoundingClientRect().top;
      // Przewijanie = rysuj w każdej klatce (paralaksa); w spoczynku ~30 fps (reduced: tylko przy przewijaniu).
      if (top !== lastTop || (!reduced && now - last >= FRAME - 2)) {
        lastTop = top;
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!raf && visible && !document.hidden && gl) raf = requestAnimationFrame(loop); };
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; gl = null; };
    const onRestored = () => { if (init()) { lastTop = NaN; wake(); } };
    if (!init()) { canvas.remove(); return; }
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; wake(); });
    const ro = new ResizeObserver(() => { resize(); wake(); });
    ro.observe(canvas);
    io.observe(section);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    document.addEventListener('visibilitychange', wake);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      document.removeEventListener('visibilitychange', wake);
      release();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [reduced]);

  return <div ref={hostRef} className="pw-bg" aria-hidden="true" />;
};
