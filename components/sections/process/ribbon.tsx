'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { ProcessDict } from '@/lib/i18n/home/process';
import { ACC_S, crossWidth, GLASS_GLSL, RIBBON_ACC, smooth, twistAngle } from './silk';

// Sekcja "Proces" - SZKLANA WSTĘGA. Układ "Wstęga" = wybór właściciela 2026-09-27 z trzeciej rundy
// ("wstęga jest genialna i piękna"); materiał "Szkło" = wybór z propozycji wyglądu tego samego dnia
// ("zbyt metaliczna, zrób kilka propozycji" - Satyna, Szkło, Linie, Pył, Metal; reszta usunięta).
// Jedna przezroczysta szklana wstęga prowadzi przez cztery etapy: rozwija się przy przewijaniu (czoło
// w 64% wysokości okna), przy każdym etapie przechodzi na stronę bez tekstu, a na końcu schodzi do
// środka - prosto na "Bezpłatną konsultację". Szkło (GLASS_GLSL w silk.ts): BARWIONA tafla (kolorowy
// kryształ) z krawędzią jak szlif, odbiciem przy ustawieniu bokiem, ostrym białym blikiem i lekko
// przydymionym wnętrzem - jak szklana planeta w hero i ciemne szkło kadru w Realizacjach. Barwa
// (RIBBON_ACC, 2026-09-27: "żeby wstęga się wyróżniała od tła, bo się zlewa") = nasycony akcent kroku
// obok (błękit, fiolet, bursztyn, zieleń), płynnie przechodzi wzdłuż wstęgi od kroku do kroku; tło
// Głębia jest neutralnym srebrnym szkłem. Co ~11 s wzdłuż wstęgi przesuwa się refleks
// światła. Skręt (2026-09-27, "moment, jak się krzyżuje, zrób ładniej"): wstęga długo pokazuje lico,
// przez krawędź przechodzi krótko i rzadko (twistAngle), a ustawiona bokiem zwęża się do cienkiej,
// jasnej krawędzi szkła (crossWidth, min. ~1 px) zamiast znikać w punkt; ewentualne zakładki pasa rysuje
// się raz (bufor szablonu), bez sumowania jasności. Delikatne falowanie linii środkowej. Bez poświat.
// Płótno na CAŁĄ wysokość toru (przewija się natywnie razem z tekstem - przyklejone płótno
// spóźniałoby się o klatkę i wstęga "pływałaby" względem tekstu), ~30 fps, pauza poza ekranem
// i przy ukrytej karcie. Renderer: WebGL (cieniowanie na piksel, krawędzie wygładzane z pochodnych,
// bez MSAA na wysokim płótnie), zapas: canvas 2D (obrys wstęgi z delikatnym wypełnieniem i jasnymi
// krawędziami, przerysowywany tylko pas przy oknie). DPR z budżetu pikseli i limitu rozmiaru płótna GPU.
// Telefon: wstęga (44 px) przeplata się przez ekran - przy tekście chowa się za krawędzią, a między krokami
// przepływa łukiem przez cały ekran, na przemian w lewo i w prawo. Reduced motion: cała wstęga, bez ruchu.
// Bez JS: same kroki (wstęga to dekoracja - aria-hidden).
const FRAME = 1000 / 30;
const TAU = Math.PI * 2;

// Wierzchołek: pozycja (px CSS toru), d = (v w poprzek -1..1, kąt skrętu, normalna linii środkowej),
// barwa etapu (0-1), s = długość łuku (px) - droga refleksu światła.
const VS = `
attribute vec2 a_pos;
attribute vec4 a_d;
attribute vec3 a_c;
attribute float a_s;
uniform vec2 u_res;
varying vec4 v_d;
varying vec3 v_c;
varying float v_s;
void main() {
  v_d = a_d;
  v_c = a_c;
  v_s = a_s;
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
varying vec3 v_c;
varying float v_s;
uniform float u_time;
uniform float u_glint;
${GLASS_GLSL}
void main() {
  float v = v_d.x;
  // Odległość od krawędzi w px z pochodnej (płótno jest wysokie - bez MSAA): wygładzenie i szlif krawędzi.
  float fw = max(fwidth(v), 1e-4);
  float dpx = (1.0 - abs(v)) / fw;
  float cov = clamp(dpx, 0.0, 1.0);
  // Normalna tafli (lekko wygiętej w poprzek), strona widoczna.
  float a = v_d.y + v * 0.5;
  vec2 n2 = normalize(v_d.zw);
  vec3 n = vec3(-n2 * sin(a), cos(a));
  float front = step(0.0, n.z);
  n *= front * 2.0 - 1.0;
  // Refleks światła sunący wzdłuż wstęgi (380 px/s, co 4200 px drogi ~ 11 s).
  float g = (1.0 - smoothstep(0.0, 150.0, abs(mod(v_s - u_time * 380.0 + 2100.0, 4200.0) - 2100.0))) * u_glint;
  float hwid = max(fwidth(dot(n, SH)), 0.002);
  gl_FragColor = glass(n, front, dpx, 2.0 / fw, v_c, 1.0 + 0.9 * g, 0.972, hwid, 1.0) * cov;
}`;

const nn = (i: number) => String(i + 1).padStart(2, '0');

/** Co konkretnie dostajesz w kroku. */
const Gain = ({ label, text }: { label: string; text: string }) => (
  <p className="pr-gain">
    <span className="pr-gain-label">{label}</span>
    <span className="pr-gain-text">{text}</span>
  </p>
);

export const RibbonProcess = ({ t, reduced }: { t: ProcessDict; reduced: boolean }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = root?.querySelector<HTMLElement>('.pw-track');
    if (!root || !track) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>('.pw-step'));
    // Płótno tworzone przy każdym montażu = nowy kontekst (podwójny montaż w dev nie trafia na utracony).
    const canvas = document.createElement('canvas');
    canvas.className = 'pw-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    track.prepend(canvas);

    // --- Renderer: WebGL, a bez niego (lub bez pochodnych) canvas 2D ---
    let gl: WebGLRenderingContext | null = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: true });
    let prog: WebGLProgram | null = null, vsh: WebGLShader | null = null, fsh: WebGLShader | null = null, buf: WebGLBuffer | null = null;
    let uRes: WebGLUniformLocation | null = null, uTime: WebGLUniformLocation | null = null;
    let maxDim = 8192;
    if (gl && gl.getExtension('OES_standard_derivatives')) {
      const mk = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; };
      vsh = mk(gl.VERTEX_SHADER, VS);
      fsh = mk(gl.FRAGMENT_SHADER, FS);
      prog = gl.createProgram()!;
      gl.attachShader(prog, vsh);
      gl.attachShader(prog, fsh);
      gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        const aPos = gl.getAttribLocation(prog, 'a_pos'), aD = gl.getAttribLocation(prog, 'a_d'), aC = gl.getAttribLocation(prog, 'a_c'), aS = gl.getAttribLocation(prog, 'a_s');
        gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aD); gl.enableVertexAttribArray(aC); gl.enableVertexAttribArray(aS);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 40, 0);
        gl.vertexAttribPointer(aD, 4, gl.FLOAT, false, 40, 8);
        gl.vertexAttribPointer(aC, 3, gl.FLOAT, false, 40, 24);
        gl.vertexAttribPointer(aS, 1, gl.FLOAT, false, 40, 36);
        uRes = gl.getUniformLocation(prog, 'u_res');
        uTime = gl.getUniformLocation(prog, 'u_time');
        gl.uniform1f(gl.getUniformLocation(prog, 'u_glint'), reduced ? 0 : 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // Zakładki pasa przy skrzyżowaniu (pochylona wstęga) rysowane raz: piksel przyjmuje pierwszy fragment.
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.EQUAL, 0, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
        gl.clearColor(0, 0, 0, 0);
        const vp = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
        maxDim = Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number, vp[0], vp[1], 16384);
      } else {
        console.warn('Proces - wstęga: shader', gl.getShaderInfoLog(fsh), gl.getProgramInfoLog(prog));
        gl = null;
      }
    } else gl = null;
    const ctx = gl ? null : canvas.getContext('2d');
    if (!gl && !ctx) { canvas.remove(); return; }
    root.setAttribute('data-live', '');
    root.dataset.renderer = gl ? 'gl' : '2d';

    // Geometria (px CSS toru): próbki linii środkowej, normalne, długość łuku, barwa etapu.
    let W = 0, H = 0, dpr = 1, band = 64, flip = 1100, sway = 7, n = 0, phone = false, padL = 0, CW = 0;
    let X = new Float32Array(0), Y = X, NX = X, NY = X, S = X, CR = X, CG = X, CB = X;
    let stepY: number[] = [];
    let head = reduced ? 1e9 : -1e9;
    let lastOn = -2;
    let data = new Float32Array(10 * 4096);

    const layout = () => {
      W = track.clientWidth;
      H = track.offsetHeight;
      phone = W < 720;
      band = phone ? 44 : Math.min(96, Math.max(56, W * 0.064));
      flip = phone ? 560 : 1100;
      sway = phone ? 3 : 7;
      // Telefon: płótno na CAŁĄ szerokość ekranu (także margines kontenera) - wstęga wpływa zza krawędzi
      // ekranu, a nie zza krawędzi toru (inaczej byłaby ucięta 24 px od brzegu).
      const rt = track.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      padL = phone ? Math.max(0, rt.left) : 0;
      const padR = phone ? Math.max(0, vw - rt.right) : 0;
      CW = W + padL + padR;
      const budget = phone ? 4.5e6 : 8e6;
      dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(budget / Math.max(1, CW * H)), maxDim / Math.max(1, H), maxDim / Math.max(1, CW));
      canvas.width = Math.round(CW * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${CW}px`;
      canvas.style.height = `${H}px`;
      canvas.style.left = `${-padL}px`;
      const top = rt.top;
      stepY = steps.map((s) => {
        const b = s.getBoundingClientRect();
        return b.top - top + b.height / 2;
      });
      const xs: number[] = [], ys: number[] = [];
      if (phone) {
        // Telefon (2026-09-27, właściciel: "proces na telefonie trzeba zrobić ładniej"): wstęga PRZEPLATA SIĘ
        // przez ekran między krokami. Przy tekście kroku chowa się poza krawędzią ekranu (tekst na pełnej
        // szerokości, na czystym tle), a w odstępie między krokami wpływa zza jednej krawędzi i przepływa
        // szerokim, łagodnym łukiem S na drugą stronę - na przemian w lewo i w prawo; start od środka pod
        // nagłówkiem, finał łukiem do środka nad CTA. Końce łuków mają poziome styczne, odcinki poza ekranem
        // są pionowe (zakręt i jego zakładki leżą ponad pół szerokości wstęgi za krawędzią - niewidoczne).
        // Krzywe Beziera z niemalejącym y (czoło wstęgi idzie z przewijaniem, wyszukiwanie po y).
        const cubic = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
          const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
          const m = Math.max(2, Math.ceil(len / 2.5));
          for (let j = 0; j < m; j++) {
            const u = j / m, v = 1 - u;
            const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
            xs.push(a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]);
            ys.push(a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]);
          }
        };
        const line = (a: number[], b: number[]) => cubic(a, [a[0], a[1] + (b[1] - a[1]) / 3], [b[0], a[1] + (2 * (b[1] - a[1])) / 3], b);
        const across = (a: number[], b: number[]) => { const k = (b[0] - a[0]) * 0.45; cubic(a, [a[0] + k, a[1]], [b[0] - k, b[1]], b); };
        const out = 40 + band / 2; // za krawędzią ekranu: dalej niż pół szerokości wstęgi
        const xL = -padL - out, xR = W + padR + out;
        // Zasięg tekstu kroku z offsetTop (bez transformacji wejścia .pw-copy, która przesuwa tekst o 18 px).
        const list = root.querySelector<HTMLElement>('.pw-steps');
        const base = list ? list.getBoundingClientRect().top - top : 0;
        const runs = steps.map((st) => {
          const c = st.querySelector<HTMLElement>('.pw-copy') ?? st;
          return [base + c.offsetTop, base + c.offsetTop + c.offsetHeight];
        });
        const last = runs.length - 1;
        // Start: od środka pod nagłówkiem łukiem za prawą krawędź, tuż nad pierwszym krokiem.
        // Odstęp łuku od tekstu: pół szerokości wstęgi + 26 px (krawędź wstęgi nie dotyka tekstu).
        const gap = band / 2 + 26;
        const y0 = Math.max(60, runs[0][0] - gap);
        // Start w torze (y = 6), nie nad nim - zwężony początek widać, zamiast ucięcia na górnej krawędzi płótna.
        cubic([W / 2, 6], [W / 2, y0 * 0.55], [xR - (xR - W / 2) * 0.55, y0], [xR, y0]);
        let side = xR, y = y0;
        runs.forEach(([, t1], i) => {
          const yIn = t1 + gap;
          line([side, y], [side, yIn]); // poza ekranem, wzdłuż tekstu kroku
          if (i < last) {
            const yOut = runs[i + 1][0] - gap;
            const other = side === xR ? xL : xR;
            across([side, yIn], [other, yOut]); // łuk przez ekran w odstępie między krokami
            side = other;
            y = yOut;
          } else {
            // Finał: zza krawędzi łukiem do środka nad CTA.
            cubic([side, yIn], [side + (W / 2 - side) * 0.55, yIn], [W / 2, H - (H - yIn) * 0.5], [W / 2, H]);
          }
        });
        xs.push(W / 2);
        ys.push(H);
      } else {
        // Komputer / tablet: punkty kontrolne od środka u góry, przy etapach po stronie bez tekstu, na końcu
        // do środka; Catmull-Rom (jednorodny), próbki co ~3 px.
        const pts: [number, number][] = [[W / 2, -80], [W / 2, 0], ...stepY.map((y, i): [number, number] => [i % 2 ? W * 0.27 : W * 0.73, y]), [W / 2, H], [W / 2, H + 80]];
        for (let k = 1; k < pts.length - 2; k++) {
          const [p0, p1, p2, p3] = [pts[k - 1], pts[k], pts[k + 1], pts[k + 2]];
          const m = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3));
          for (let j = 0; j < m; j++) {
            const u = j / m, u2 = u * u, u3 = u2 * u;
            const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * u + (2 * a - 5 * b + 4 * cc - d) * u2 + (-a + 3 * b - 3 * cc + d) * u3);
            xs.push(c(p0[0], p1[0], p2[0], p3[0]));
            ys.push(c(p0[1], p1[1], p2[1], p3[1]));
          }
        }
        xs.push(pts[pts.length - 2][0]);
        ys.push(pts[pts.length - 2][1]);
      }
      n = xs.length;
      X = new Float32Array(xs); Y = new Float32Array(ys);
      NX = new Float32Array(n); NY = new Float32Array(n); S = new Float32Array(n);
      CR = new Float32Array(n); CG = new Float32Array(n); CB = new Float32Array(n);
      if (data.length < n * 20) data = new Float32Array(n * 20);
      for (let k = 0; k < n; k++) {
        const a = Math.max(0, k - 1), b = Math.min(n - 1, k + 1);
        const tx = X[b] - X[a], ty = Y[b] - Y[a], tl = Math.hypot(tx, ty) || 1;
        NX[k] = -ty / tl; NY[k] = tx / tl;
        S[k] = k ? S[k - 1] + Math.hypot(X[k] - X[k - 1], Y[k] - Y[k - 1]) : 0;
        // Barwa: nasycony akcent etapu (RIBBON_ACC), płynnie przechodzi od kroku do kroku.
        const y = Y[k];
        let c = RIBBON_ACC[0];
        if (y >= stepY[stepY.length - 1]) c = RIBBON_ACC[RIBBON_ACC.length - 1];
        else {
          for (let i = 0; i < stepY.length - 1; i++) {
            if (y < stepY[i + 1]) {
              const q = smooth(stepY[i], stepY[i + 1], y);
              const a0 = RIBBON_ACC[i], a1 = RIBBON_ACC[i + 1];
              c = [a0[0] + (a1[0] - a0[0]) * q, a0[1] + (a1[1] - a0[1]) * q, a0[2] + (a1[2] - a0[2]) * q];
              break;
            }
          }
        }
        CR[k] = c[0]; CG[k] = c[1]; CB[k] = c[2];
      }
      paint(performance.now(), true);
    };

    // Próbki wstęgi w zakresie [y0, y1] toru i do czoła: krawędzie A / B, kąt skrętu.
    const ax: number[] = [], ay: number[] = [], bx: number[] = [], by: number[] = [], th: number[] = [];
    const sample = (y0: number, y1: number, ts: number, phase: number) => {
      let lo = 0, hi = n - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (Y[m] < y0 - band) lo = m + 1; else hi = m; }
      const k0 = Math.max(0, lo - 1);
      const end = S[n - 1];
      let hl = 0, hh = n - 1;
      while (hl < hh) { const m = (hl + hh) >> 1; if (Y[m] <= head) hl = m + 1; else hh = m; }
      const sHead = S[hl];
      ax.length = ay.length = bx.length = by.length = th.length = 0;
      for (let k = k0; k < n; k++) {
        const y = Y[k];
        if (y > y1 + band || y > head) break;
        const s = S[k];
        const tip = smooth(0, 160, sHead - s);
        const taper = Math.min(1, s / 90) * smooth(0, 1, (end - s) / (phone ? 110 : 180)) * (1 - (1 - tip) ** 2);
        // Skręt: komputer - długo lico, krótko i rzadko krawędź (twistAngle); telefon - łagodne kołysanie
        // (+-49 st., bez przewracania: na wąskim ekranie wstęga ustawiona bokiem wyglądała jak kreska).
        const a = phone ? 0.85 * Math.sin(s / 480 + phase * 0.8) : twistAngle(s, flip, phase);
        // Falowanie linii środkowej (wzdłuż normalnej), słabsze przy końcach.
        const d = reduced ? 0 : sway * taper * Math.sin((s / 900) * TAU + ts * 0.45);
        const cx = X[k] + NX[k] * d, cy = Y[k] + NY[k] * d;
        // Połowa szerokości: cos(a), przy ustawieniu bokiem nie mniej niż ~1 px (cienka krawędź szkła, nie punkt).
        const w = crossWidth((band / 2) * taper, a, Math.min(1, taper * 4));
        const ox = NX[k] * w, oy = NY[k] * w;
        ax.push(cx + ox); ay.push(cy + oy);
        bx.push(cx - ox); by.push(cy - oy);
        th.push(a);
      }
      return k0;
    };

    const paint = (now: number, full = false) => {
      if (!n) return;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (!reduced) {
        const target = vh * 0.64 - r.top;
        head = head < -1e8 ? target : head + (target - head) * 0.22;
      }
      const ts = reduced ? 0 : now / 1000;
      const phase = reduced ? 0.6 : ts * 0.25;

      if (gl) {
        // WebGL: cała wstęga do czoła w każdej klatce (kilka tysięcy wierzchołków, wypełnienie tylko wstęgi).
        const k0 = sample(-1e9, 1e9, ts, phase);
        const m = ax.length;
        let o = 0;
        for (let j = 0; j < m; j++) {
          const k = k0 + j;
          const c0 = CR[k] / 255, c1 = CG[k] / 255, c2 = CB[k] / 255;
          data[o++] = ax[j] + padL; data[o++] = ay[j]; data[o++] = 1; data[o++] = th[j]; data[o++] = NX[k]; data[o++] = NY[k]; data[o++] = c0; data[o++] = c1; data[o++] = c2; data[o++] = S[k];
          data[o++] = bx[j] + padL; data[o++] = by[j]; data[o++] = -1; data[o++] = th[j]; data[o++] = NX[k]; data[o++] = NY[k]; data[o++] = c0; data[o++] = c1; data[o++] = c2; data[o++] = S[k];
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (m > 1) {
          gl.uniform2f(uRes, CW, H);
          gl.uniform1f(uTime, ts);
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, o), gl.DYNAMIC_DRAW);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, m * 2);
        }
      } else if (ctx) {
        // Canvas 2D: pas przy oknie (przycięty - poza pasem zostaje poprzednia klatka, niewidoczna).
        // Uproszczone szkło: obrys wstęgi z delikatnym wypełnieniem i jasne krawędzie w akcencie etapu.
        const y0 = full ? 0 : Math.max(0, -r.top - vh * 0.3);
        const y1 = full ? H : Math.min(H, -r.top + vh * 1.3);
        if (y1 <= y0) return;
        ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
        ctx.save();
        ctx.beginPath();
        ctx.rect(-padL, y0, CW, y1 - y0);
        ctx.clip();
        ctx.clearRect(-padL, y0, CW, y1 - y0);
        const k0 = sample(y0, y1, ts, phase);
        const m = ax.length;
        if (m > 1) {
          const k = Math.min(n - 1, k0 + (m >> 1));
          const tint = `${Math.round(CR[k] + (255 - CR[k]) * 0.2)},${Math.round(CG[k] + (255 - CG[k]) * 0.2)},${Math.round(CB[k] + (255 - CB[k]) * 0.2)}`;
          ctx.beginPath();
          ctx.moveTo(ax[0], ay[0]);
          for (let j = 1; j < m; j++) ctx.lineTo(ax[j], ay[j]);
          for (let j = m - 1; j >= 0; j--) ctx.lineTo(bx[j], by[j]);
          ctx.closePath();
          ctx.fillStyle = `rgba(${tint}, .12)`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${tint}, .55)`;
          ctx.beginPath();
          ctx.moveTo(ax[0], ay[0]);
          for (let j = 1; j < m; j++) ctx.lineTo(ax[j], ay[j]);
          ctx.moveTo(bx[0], by[0]);
          for (let j = 1; j < m; j++) ctx.lineTo(bx[j], by[j]);
          ctx.stroke();
        }
        ctx.restore();
      }
      // Etapy: zapalają się, gdy dojdzie do nich czoło wstęgi.
      let on = -1;
      stepY.forEach((y, i) => { if (head >= y - 90) on = i; });
      if (on !== lastOn) {
        lastOn = on;
        steps.forEach((s, i) => s.toggleAttribute('data-on', i <= on));
      }
    };

    let raf = 0, last = 0, visible = false, lost = false;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || lost) return;
      if (now - last >= FRAME - 2) {
        last = now;
        paint(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!raf && visible && !document.hidden && !lost) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (reduced) { if (visible) paint(performance.now()); return; }
      wake();
    }, { rootMargin: '200px 0px' });
    // Reduced motion: płótno WebGL rysuje całą wstęgę (bez przerysowań przy przewijaniu), 2D - pas przy oknie.
    const onScroll = () => { if (reduced && visible && ctx) paint(performance.now()); };
    // Utrata kontekstu WebGL (rzadka): wstęga znika, kroki zostają w pełni czytelne.
    const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; steps.forEach((s) => s.setAttribute('data-on', '')); };
    const ro = new ResizeObserver(() => { if (!lost) layout(); });
    ro.observe(track);
    io.observe(track);
    canvas.addEventListener('webglcontextlost', onLost);
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('scroll', onScroll);
      if (gl) {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vsh);
        gl.deleteShader(fsh);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      canvas.remove();
      root.removeAttribute('data-live');
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="pw container mx-auto px-6">
      <div className="pw-track">
        <ol className="pw-steps">
          {t.steps.map((s, i) => (
            <li key={i} className="pw-step" style={{ '--pc': ACC_S[i] } as CSSProperties}>
              <div className="pw-copy">
                <p className="pw-kicker"><b>{nn(i)}</b><span>{s.short}</span></p>
                <h3 className="pw-title">{s.title}</h3>
                <p className="pw-desc">{s.description}</p>
                <Gain label={t.gainLabel} text={s.gain} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
