// Renderer GPU dla logotypu AVENLY (desktop). Dwa "materiały" tego samego napisu:
// - LITY: siatka (mesh) wyginająca teksturę tekstu po łuku orbity - ostre krawędzie liter,
// - CZĄSTKI: ~30k punktów + ~135k krawędzi siatki; CPU liczy tylko sprężyny i wgrywa JEDNĄ
//   teksturę pozycji (RGBA float: x, y, ez, on+calm), vertex shader pobiera z niej oba końce
//   krawędzi (vertex texture fetch) i sam liczy alfę z bieżącej odległości.
//
// BEZSZWOWE przejście cząstki ↔ lity (decyzja właściciela: "perfekcyjnie"): NIE ma przenikania
// alfą dwóch warstw. Każda cząstka ma "swell" 0..1: przy 1 jest spuchnięta tak, że sąsiednie
// kropki zlewają się w ciągłe wypełnienie, i ma KOLOR litego napisu w swoim miejscu (ten sam
// gradient). Spuchnięte kropki są więc nieodróżnialne od litego materiału - lity mesh jest
// docinany/wygaszany dopiero POD nimi. Dzięki temu:
//   - wejście: cząstka, która dotarła na miejsce (calm→1), puchnie razem z globalnym u_melt
//     → napis zlewa się w lity od razu, gdy kulki się zbiorą,
//   - hover: w pasie przy krawędzi "dziury" kropki są w pełni spuchnięte (= wyglądają jak lity),
//     ku środkowi płynnie chudną do zwykłych kulek i pojawia się siatka linii; lity mesh kończy
//     się ukryty pod pasem spuchniętych kropek. Zero półprzezroczystych krawędzi.
// Odbicie w planecie to te same bufory narysowane drugi raz z lustrzaną transformacją
// w vertex shaderze. Cała warstwa rysuje się od zera w każdej aktywnej klatce - zero regionów,
// zero artefaktów. Wymaga OES_texture_float + tekstur w VS; brak → particles.ts zostaje na 2D.

import type { HeroLayout } from './layout';

const TEX_W = 256;
const REFLECT_K = 0.78;
const MESH_COLS = 128, MESH_ROWS = 6;

/** Profil "dziury" (ułamki promienia) - WSPÓLNY dla GPU i 2D, żeby oba renderery wyglądały tak samo. */
export const HOLE = {
  swell0: 0.56, swell1: 0.82, // kropki: zwykłe → w pełni spuchnięte
  cut0: 0.8, cut1: 0.92,      // lity mesh: brak → pełny (zawsze POD spuchniętymi kropkami)
  fade0: 0.9, fade1: 1.02,    // kropki nad pełnym litym gasną (znika ich lekko "grubszy" obrys)
};
/** Średnica w pełni spuchniętej kropki względem kroku siatki próbkowania (3 jedn. → 5,4 jedn.). */
export const SWELL_DIAMETER = 1.8;

// Wspólny fragment GLSL: lustrzane odbicie punktu sceny w powierzchni planety (+ maska zaniku).
const REFLECT_GLSL = `
uniform vec4 u_planet; // cx, horizon, R, offset
uniform vec2 u_refl;   // (1 = pass odbicia, zasięg maski)
float reflectPoint(inout vec2 pos){
  if (u_refl.x < .5) return 1.;
  float dx = pos.x - u_planet.x;
  float ins = u_planet.z * u_planet.z - dx * dx;
  float surf = u_planet.y + (u_planet.z - sqrt(max(ins, 0.)));
  float yy = surf + ${REFLECT_K} * (surf - pos.y) + u_planet.w;
  float t = clamp((yy - (u_planet.y - 10.)) / (u_refl.y + 10.), 0., 1.);
  float m = t < .35 ? mix(.5, .22, t / .35) : mix(.22, 0., (t - .35) / .65);
  float fall = 1. - min(1., abs(dx) / u_planet.z) * .35;
  float a = m * fall * .7 * step(0., ins) * step(pos.y, surf);
  pos.y = yy;
  return a;
}`;

const VS_DOTS = `
attribute vec2 a_ij;
uniform sampler2D u_pos;
uniform vec2 u_tex;
uniform vec4 u_map;
uniform float u_lmax;
uniform mediump float u_isLine; // współdzielony z FS - precyzja MUSI być identyczna (inaczej link error)
uniform vec2 u_point;    // px: (zwykła kropka, w pełni spuchnięta)
uniform vec3 u_hole;     // x, y, promień (0 = brak)
uniform float u_melt;    // globalne spuchnięcie (wejście 0→1; w spoczynku 1)
uniform float u_dotsAll; // 1 = wszystkie cząstki widoczne (wejście), 0 = tylko dziura / odepchnięte
uniform vec3 u_grad;     // (długość gradientu litego, przesunięcie linii bazowej, odstęp napisu od planety)
${REFLECT_GLSL}
varying float v_a;
varying vec3 v_col;
vec4 fetch(float idx){
  float yy = floor(idx / u_tex.x);
  float xx = idx - yy * u_tex.x;
  return texture2D(u_pos, (vec2(xx, yy) + .5) / u_tex);
}
void main(){
  vec4 p = fetch(a_ij.x);
  float onP = step(.5, p.w);
  float calm = clamp(p.w - 1., 0., 1.);
  float d = u_hole.z > 1. ? distance(p.xy, u_hole.xy) / u_hole.z : 9.;
  float swell = calm * u_melt * smoothstep(${HOLE.swell0}, ${HOLE.swell1}, d);
  // widoczność: wejście = wszystko; spoczynek = wnętrze dziury + cząstki jeszcze odepchnięte
  float vis = max(u_dotsAll, max(1. - smoothstep(${HOLE.fade0}, ${HOLE.fade1}, d), 1. - calm));
  float a;
  if (u_isLine < .5) {
    a = onP * mix(.9, 1., swell) * vis;
  } else {
    vec4 q = fetch(a_ij.y);
    float dq = distance(p.xy, q.xy);
    a = clamp(1. - dq / u_lmax, 0., 1.) * min(p.z, q.z) * step(.12, max(p.z, q.z)) * onP * step(.5, q.w) * .42 * (1. - swell) * vis;
  }
  // Kolor litego napisu w miejscu cząstki: ten sam gradient co w teksturze (wysokość nad linią bazową).
  vec2 c = vec2(u_planet.x, u_planet.y + u_planet.z);
  float t = clamp(1. - (distance(p.xy, c) - (u_planet.z + u_grad.z) + u_grad.y) / u_grad.x, 0., 1.);
  vec3 g0 = vec3(.9725, .9804, .9882), g1 = vec3(.9333, .9490, .9765), g2 = vec3(.8118, .8627, .9647);
  vec3 grad = t < .55 ? mix(g0, g1, t / .55) : mix(g1, g2, (t - .55) / .45);
  v_col = u_isLine < .5 ? mix(vec3(.9451, .9608, .9765), grad, swell) : vec3(.5804, .6392, .7216);
  vec2 pos = p.xy;
  a *= reflectPoint(pos);
  gl_Position = vec4(pos * u_map.xy + u_map.zw, 0., 1.);
  gl_PointSize = max(mix(u_point.x, u_point.y, swell), 1.);
  v_a = a;
}`;

const FS_DOTS = `
precision mediump float;
uniform mediump float u_isLine;
varying float v_a;
varying vec3 v_col;
void main(){
  float a = v_a;
  if (u_isLine < .5) a *= 1. - smoothstep(.36, .5, length(gl_PointCoord - .5));
  gl_FragColor = vec4(v_col * a, a);
}`;

const VS_SOLID = `
attribute vec2 a_st; // (przesunięcie po łuku od środka napisu, wysokość nad linią bazową)
attribute vec2 a_uv;
uniform vec4 u_map;
uniform float u_gap;
${REFLECT_GLSL}
varying vec2 v_uv;
varying vec2 v_orig;
varying float v_m;
void main(){
  float arc = u_planet.z + u_gap;
  float th = a_st.x / arc;
  float r = arc + a_st.y;
  vec2 pos = vec2(u_planet.x + r * sin(th), u_planet.y + u_planet.z - r * cos(th));
  v_orig = pos;
  v_m = reflectPoint(pos);
  v_uv = a_uv;
  gl_Position = vec4(pos * u_map.xy + u_map.zw, 0., 1.);
}`;

const FS_SOLID = `
precision highp float;
uniform sampler2D u_text; // premultiplied
uniform float u_solid;
uniform vec3 u_hole;
varying vec2 v_uv;
varying vec2 v_orig;
varying float v_m;
void main(){
  float k = u_solid * v_m;
  if (u_hole.z > 1.) k *= smoothstep(${HOLE.cut0}, ${HOLE.cut1}, distance(v_orig, u_hole.xy) / u_hole.z);
  gl_FragColor = texture2D(u_text, v_uv) * k;
}`;

export interface SolidText {
  /** Raster prostego (niewygiętego) napisu w wysokiej rozdzielczości, już zabarwiony. */
  canvas: HTMLCanvasElement;
  /** Rozmiar rastra i metryki w jednostkach sceny: środek napisu (x) i linia bazowa (y). */
  w: number; h: number; mid: number; base: number;
  /** Gradient litego: długość (od góry wersalików do linii bazowej) i baseY - base. */
  gradLen: number; gradBaseOff: number;
}

export interface ParticleFx {
  /** Alfa litego mesha 0..1. */
  solid: number;
  /** Globalne spuchnięcie cząstek 0..1 (wejście); w spoczynku 1. */
  melt: number;
  /** 1 = wszystkie cząstki widoczne, 0 = tylko dziura / odepchnięte. */
  dotsAll: number;
  holeX: number; holeY: number; holeR: number;
}

export interface ParticleGL {
  readonly canvas: HTMLCanvasElement;
  /** Rozmiar canvasa + liczba cząstek. Zwraca false, gdy kontekst jest martwy. */
  configure(layout: HeroLayout, count: number): boolean;
  /** Krawędzie siatki (pary indeksów a[e], b[e]). */
  setEdges(a: ArrayLike<number>, b: ArrayLike<number>): void;
  setSolid(text: SolidText): void;
  draw(x: Float32Array, y: Float32Array, ez: Float32Array, on: Uint8Array, calm: Float32Array, fx: ParticleFx): void;
  show(visible: boolean): void;
  destroy(): void;
}

export function createParticleGL(before: HTMLCanvasElement, onLost: () => void): ParticleGL | null {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-hero-dots-gl', '');
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, depth: false, stencil: false });
  if (!gl || gl.isContextLost()) return null;
  const bail = () => { gl.getExtension('WEBGL_lose_context')?.loseContext(); return null; };
  if (!gl.getExtension('OES_texture_float') || gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 1) return bail();

  const shaders: WebGLShader[] = [];
  const link = (vsSrc: string, fsSrc: string, attribs: string[]) => {
    const mk = (type: number, src: string) => { const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); shaders.push(sh); return sh; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vsSrc)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fsSrc));
    attribs.forEach((name, i) => gl.bindAttribLocation(prog, i, name));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('Hero particles GL: link error', gl.getProgramInfoLog(prog)); return null; }
    return prog;
  };
  const dotsProg = link(VS_DOTS, FS_DOTS, ['a_ij']);
  const solidProg = link(VS_SOLID, FS_SOLID, ['a_st', 'a_uv']);
  if (!dotsProg || !solidProg) return bail();
  const uniforms = <T extends string>(prog: WebGLProgram, names: T[]) =>
    Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, `u_${n}`)])) as Record<T, WebGLUniformLocation | null>;
  const ud = uniforms(dotsProg, ['pos', 'tex', 'map', 'lmax', 'isLine', 'point', 'hole', 'melt', 'dotsAll', 'grad', 'planet', 'refl']);
  const us = uniforms(solidProg, ['text', 'solid', 'hole', 'map', 'gap', 'planet', 'refl']);

  const texParams = (filter: number) => {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const posTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, posTex); texParams(gl.NEAREST);
  const textTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textTex); texParams(gl.LINEAR);
  const pointBuf = gl.createBuffer(), edgeBuf = gl.createBuffer(), meshBuf = gl.createBuffer();

  let L: HeroLayout | null = null;
  let n = 0, texH = 1, edgeVerts = 0, meshVerts = 0, dpr = 1;
  let gradLen = 100, gradBaseOff = 0;
  let data = new Float32Array(TEX_W * 4);
  let dead = false;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const handleLost = (e: Event) => { e.preventDefault(); if (!dead) { dead = true; onLost(); } };
  canvas.addEventListener('webglcontextlost', handleLost);
  before.parentElement?.insertBefore(canvas, before);

  return {
    canvas,

    configure(layout, count) {
      if (dead) return false;
      L = layout; n = count;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.style.width = `${layout.W}px`;
      canvas.style.height = `${layout.H}px`;
      canvas.width = Math.max(1, Math.round(layout.W * dpr));
      canvas.height = Math.max(1, Math.round(layout.H * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      texH = Math.max(1, Math.ceil(count / TEX_W));
      data = new Float32Array(TEX_W * texH * 4);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, posTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEX_W, texH, 0, gl.RGBA, gl.FLOAT, data);
      const idx = new Float32Array(count * 2);
      for (let i = 0; i < count; i++) { idx[i * 2] = i; idx[i * 2 + 1] = i; }
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      gl.bufferData(gl.ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      edgeVerts = 0;
      return !gl.isContextLost();
    },

    setEdges(a, b) {
      if (dead) return;
      const buf = new Float32Array(a.length * 4);
      for (let e = 0; e < a.length; e++) {
        const o = e * 4;
        buf[o] = a[e]; buf[o + 1] = b[e]; buf[o + 2] = b[e]; buf[o + 3] = a[e];
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
      edgeVerts = a.length * 2;
    },

    setSolid(text) {
      if (dead) return;
      gradLen = text.gradLen; gradBaseOff = text.gradBaseOff;
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, text.canvas);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      // Siatka: (st.x, st.y, u, v) na wierzchołek, 2 trójkąty na komórkę.
      const verts = new Float32Array(MESH_COLS * MESH_ROWS * 6 * 4);
      let o = 0;
      const put = (cu: number, cv: number) => {
        verts[o++] = cu * text.w - text.mid; verts[o++] = text.base - cv * text.h; verts[o++] = cu; verts[o++] = cv;
      };
      for (let c = 0; c < MESH_COLS; c++) for (let r = 0; r < MESH_ROWS; r++) {
        const u0 = c / MESH_COLS, u1 = (c + 1) / MESH_COLS, v0 = r / MESH_ROWS, v1 = (r + 1) / MESH_ROWS;
        put(u0, v0); put(u1, v0); put(u0, v1); put(u1, v0); put(u1, v1); put(u0, v1);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, meshBuf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      meshVerts = MESH_COLS * MESH_ROWS * 6;
    },

    draw(x, y, ez, on, calm, fx) {
      if (dead || !L || !n) return;
      // Widoczność pojedynczych cząstek rozstrzyga vertex shader (dziura / odepchnięte / wejście).
      for (let i = 0; i < n; i++) {
        const o = i * 4;
        data[o] = x[i]; data[o + 1] = y[i]; data[o + 2] = ez[i]; data[o + 3] = on[i] ? 1 + calm[i] : 0;
      }
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, posTex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TEX_W, texH, gl.RGBA, gl.FLOAT, data);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const { W, H, k, ox, oy, cx, horizon, R } = L;
      const map: [number, number, number, number] = [(k * 2) / W, (-k * 2) / H, (ox * 2) / W - 1, 1 - (oy * 2) / H];
      const planet: [number, number, number, number] = [cx, horizon, R, 6.24 * (R / 1300)];
      const span = 616 * 0.95 * (R / 1300);
      const basePx = Math.max(1.5, L.dotR * 2 * k * dpr);
      const fullPx = Math.max(basePx, L.step * SWELL_DIAMETER * k * dpr);

      // Kolejność: odbicie (lity, linie, kropki) → logotyp (lity, linie, kropki).
      for (let pass = 0; pass < 2; pass++) {
        const refl = pass === 0 ? 1 : 0;
        if (meshVerts && fx.solid > 0.003) {
          gl.useProgram(solidProg);
          gl.bindBuffer(gl.ARRAY_BUFFER, meshBuf);
          gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1);
          gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
          gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
          gl.uniform1i(us.text, 1);
          gl.uniform1f(us.solid, fx.solid);
          gl.uniform3f(us.hole, fx.holeX, fx.holeY, fx.holeR);
          gl.uniform4f(us.map, ...map); gl.uniform1f(us.gap, L.gap);
          gl.uniform4f(us.planet, ...planet); gl.uniform2f(us.refl, refl, span);
          gl.drawArrays(gl.TRIANGLES, 0, meshVerts);
          gl.disableVertexAttribArray(1);
        }
        gl.useProgram(dotsProg);
        gl.enableVertexAttribArray(0);
        gl.uniform1i(ud.pos, 0);
        gl.uniform2f(ud.tex, TEX_W, texH);
        gl.uniform4f(ud.map, ...map);
        gl.uniform1f(ud.lmax, L.link * 1.9);
        gl.uniform2f(ud.point, basePx, fullPx);
        gl.uniform3f(ud.hole, fx.holeX, fx.holeY, fx.holeR);
        gl.uniform1f(ud.melt, fx.melt);
        gl.uniform1f(ud.dotsAll, fx.dotsAll);
        gl.uniform3f(ud.grad, gradLen, gradBaseOff, L.gap);
        gl.uniform4f(ud.planet, ...planet); gl.uniform2f(ud.refl, refl, span);
        if (edgeVerts && L.lines) {
          gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuf);
          gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
          gl.uniform1f(ud.isLine, 1);
          gl.drawArrays(gl.LINES, 0, edgeVerts);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(ud.isLine, 0);
        gl.drawArrays(gl.POINTS, 0, n);
      }
    },

    show(visible) { canvas.style.display = visible ? 'block' : 'none'; },

    destroy() {
      dead = true;
      canvas.removeEventListener('webglcontextlost', handleLost);
      gl.deleteBuffer(pointBuf); gl.deleteBuffer(edgeBuf); gl.deleteBuffer(meshBuf);
      gl.deleteTexture(posTex); gl.deleteTexture(textTex);
      gl.deleteProgram(dotsProg); gl.deleteProgram(solidProg);
      shaders.forEach((sh) => gl.deleteShader(sh));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
