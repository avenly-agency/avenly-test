'use client';

import { useEffect, useRef } from 'react';

// Tło nagłówka bloga: linie z czerwcowego shadera (to samo pole falowe, ten sam ruch), zmodernizowane do języka strony:
// ostre linie o stałej grubości ~1 px CSS (z pochodnej fwidth), co czwarta grubsza i jaśniejsza, jeden kolor marki,
// bez poświaty i bez mieszania z fioletem; gęste zbiegi linii gasną zamiast się zlewać. Gdzie linie mają być widoczne,
// decyduje maska CSS wariantu (.bl-bg w blog.css). Start po idle, ~30 fps, pauza poza ekranem i przy ukrytej karcie,
// ograniczony ruch = jedna klatka, bez WebGL / pochodnych = czysta czerń. Płótno tworzone przy każdym montażu
// (podwójny montaż w dev nie trafia na utracony kontekst), w sprzątaniu loseContext() i usunięcie.

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const FS = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform float u_px;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 p = vec2(uv.x * asp, uv.y) * 3.5;
  float t = u_t;
  float v = sin(p.x + t)
          + sin(p.y * 0.9 - t * 0.8)
          + sin((p.x + p.y) * 0.7 + t * 0.6)
          + sin(length(p - vec2(asp * 1.75, 1.75)) - t);
  float f = v * 1.5;
  float fw = max(fwidth(f), 1e-4);
  float d = abs(fract(f + 0.5) - 0.5) / fw;
  float major = step(mod(floor(f + 0.5), 4.0), 0.5);
  float hw = mix(0.5, 0.8, major) * u_px;
  float line = 1.0 - smoothstep(hw - 0.6, hw + 0.6, d);
  float crowd = smoothstep(4.0, 10.0, 1.0 / (fw * u_px));
  float a = line * crowd * mix(0.36, 0.7, major);
  vec3 col = mix(vec3(0.231, 0.510, 0.965), vec3(0.376, 0.647, 0.980), major);
  gl_FragColor = vec4(col * a, a);
}`;

const SPEED = 0.16; // czerwiec: 0.3 - spokojniej
const FRAME = 1000 / 30;

export function BlogBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Oszczędzanie danych i słabe telefony (≤ 2 GB RAM): bez shadera, zostaje czysta czerń (jak mgławica w Realizacjach).
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData || (nav.deviceMemory ?? 8) <= 2) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return;

    let raf = 0;
    let idle = 0;
    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let buf: WebGLBuffer | null = null;
    let uRes: WebGLUniformLocation | null = null;
    let uT: WebGLUniformLocation | null = null;
    let uPx: WebGLUniformLocation | null = null;
    let dpr = 1;
    let inView = true;
    let shown = false;
    let last = 0;
    let lost = false;
    const t0 = performance.now();

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Blog lines:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      const w = Math.min(Math.round(host.clientWidth * dpr), 2560);
      const h = Math.min(Math.round(host.clientHeight * dpr), 1400);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };

    const draw = (now: number) => {
      if (!program || lost) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, reduce ? 2.0 : ((now - t0) / 1000) * SPEED);
      gl.uniform1f(uPx, canvas.width / Math.max(host.clientWidth, 1));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!shown) { shown = true; host.setAttribute('data-ready', ''); }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!inView || document.hidden || lost) return;
      if (now - last >= FRAME) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (reduce) { draw(performance.now()); return; }
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      idle = 0;
      vs = compile(gl.VERTEX_SHADER, VS);
      fs = compile(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) return;
      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Blog lines:', gl.getProgramInfoLog(program)); program = null; return; }
      gl.useProgram(program);
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(program, 'u_res');
      uT = gl.getUniformLocation(program, 'u_t');
      uPx = gl.getUniformLocation(program, 'u_px');
      host.appendChild(canvas);
      size();
      wake();
    };

    const ro = new ResizeObserver(() => { size(); if (reduce) draw(performance.now()); });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) wake(); }, { rootMargin: '100px' });
    io.observe(host);
    const onVis = () => { if (!document.hidden) wake(); };
    document.addEventListener('visibilitychange', onVis);
    const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; host.removeAttribute('data-ready'); };
    canvas.addEventListener('webglcontextlost', onLost);

    const ric = typeof window.requestIdleCallback === 'function';
    if (ric) idle = window.requestIdleCallback(start, { timeout: 900 }); else idle = window.setTimeout(start, 300);

    return () => {
      if (idle) { if (ric) window.cancelIdleCallback(idle); else clearTimeout(idle); }
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (buf) gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
      host.removeAttribute('data-ready');
    };
  }, []);

  return <div ref={hostRef} className="bl-bg" aria-hidden="true" />;
}
