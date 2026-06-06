'use client';

import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import {
  ArrowRight, Zap, Users, Clock, TrendingUp,
  Code2, Globe, Sparkles, Layout, Plus, Minus, MessageSquare
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FAQS } from './faq-data';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Isomorphic layout effect (SSR-safe) - używamy do detection viewport przed paintem
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// === AURORA SHADER (WebGL) - tło za "AVENLY" textem ===
// Inny wariant niż Hero strony głównej: 3 warstwy noise (zamiast 4), wolniejsze tempo,
// głębsza paleta (deep navy → royal → brand blue) pasująca do "intimate" feel o-nas.
// Desktop only - mobile dostaje static radial gradient (perf-critical mobile TBT).

const ABOUT_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const ABOUT_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 mod289_3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289_2(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute3(vec3 x){ return mod289_3(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289_2(i);
  vec3 p = permute3(permute3(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.18; // 2× szybciej (było 0.09) - bardziej dynamic movement

  // 4 warstwy noise (było 3) z silniejszym domain warpingiem (każda kolejna mocno "popychana" przez poprzednią)
  float n1 = snoise(p*0.6  + vec2( t*0.9,   t*0.5));
  float n2 = snoise(p*1.1  + vec2(-t*0.5,   t*1.1) + n1*0.8);
  float n3 = snoise(p*0.45 + vec2( t*0.3,  -t*0.7) + n2*0.5);
  float n4 = snoise(p*1.8  + vec2( t*0.6,   t*0.4) + n3*0.4);

  // Paleta poszerzona o indigo + violet - wciąż brand-cool, ale więcej hue variation
  vec3 canvas   = vec3(0.010, 0.012, 0.025);
  vec3 deepNavy = vec3(0.040, 0.080, 0.300);  // #0a1452 - deep navy base
  vec3 indigo   = vec3(0.180, 0.150, 0.560);  // #2e268f - deep indigo midtone
  vec3 violet   = vec3(0.290, 0.180, 0.600);  // #4a2e99 - blue-violet accent
  vec3 brand    = vec3(0.234, 0.510, 0.965);  // #3b82f6 - bright brand blue highlight

  vec3 col = canvas;
  col = mix(col, deepNavy, smoothstep(-0.5, 0.5,  n1) * 0.85);
  col = mix(col, indigo,   smoothstep(-0.3, 0.7,  n2) * 0.55);
  col = mix(col, violet,   smoothstep( 0.0, 0.8,  n3) * 0.40);
  col = mix(col, brand,    smoothstep( 0.5, 0.95, n4) * 0.45);

  // Eliptyczny vignette - naturalna ciemność na rogach
  float vig = smoothstep(1.6, 0.3, length(p*vec2(0.85, 1.0)));
  col *= vig*0.85 + 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`;

const AuroraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('o-nas shader compile:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, ABOUT_VS);
    const fs = compile(gl.FRAGMENT_SHADER, ABOUT_FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('o-nas shader link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      if (uTime) gl.uniform1f(uTime, t);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

// === GLOBAL FLUID SHADER (SyncedShaderCanvas pattern, jak w UI/UX) ===
// Autonomiczna animacja fluida w dolnej części grid'a stats, ciągle przepływająca przez
// wszystkie 4 karty jednocześnie. 2 bloby (L→R i R→L w przeciw-fazie) + domain warp +
// bottom-focus mask = "fluid current flowing across cards".
// Tempo wolne (~20s loop), 30fps throttle, DPR 1.25, IO pause poza viewport.

const HOVER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const HOVER_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_offset;      // canvas pos relative to grid container (px, DPR-scaled)
uniform vec2 u_globalSize;  // grid container size (px, DPR-scaled)
uniform float u_time;
uniform vec2 u_mouse;       // mouse pos w grid coords 0-1 (shared między kartami)
uniform float u_hover;      // smoothed hover intensity 0-1 (gradient fade in/out)

vec3 mod289_3h(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289_2h(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute3h(vec3 x){ return mod289_3h(((x*34.0)+1.0)*x); }
float snoiseH(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289_2h(i);
  vec3 p = permute3h(permute3h(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}

void main(){
  // Global UV - across whole stats grid (continuous → zero seams między kartami)
  vec2 globalUV = (gl_FragCoord.xy + u_offset) / u_globalSize;
  globalUV.y = 1.0 - globalUV.y; // 0=top, 1=bottom

  float t = u_time;

  // === 3 WARSTWY FAL - fluid jako stratified color bands z falującymi krawędziami ===
  // Każda warstwa ma własną wave displacement (różne częstotliwości i prędkości,
  // przeciwbieżne kierunki), własny kolor. Razem tworzą "layered fluid" effect
  // jak strefy głębi w wodzie morskiej.

  // Layer A - TOP edge of fluid mass (najpłytsze fale, L→R slow)
  float waveA = 0.09 * sin(globalUV.x * 3.0 - t * 0.65)
              + 0.05 * sin(globalUV.x * 6.5 - t * 0.95 + 1.5);
  float noiseA = snoiseH(vec2(globalUV.x * 4.0, t * 0.40)) * 0.04;
  float surfaceA = 0.35 + waveA + noiseA;

  // Layer B - MIDDLE band (R→L counter-direction, medium speed)
  float waveB = 0.08 * sin(globalUV.x * 3.5 + t * 0.80 + 1.8)
              + 0.04 * sin(globalUV.x * 7.0 + t * 1.20 + 0.5);
  float noiseB = snoiseH(vec2(globalUV.x * 4.0, t * 0.50 + 10.0)) * 0.04;
  float surfaceB = 0.55 + waveB + noiseB;

  // Layer C - DEEP band (L→R fast, smaller amplitude)
  float waveC = 0.06 * sin(globalUV.x * 4.0 - t * 0.95 + 2.5)
              + 0.03 * sin(globalUV.x * 8.5 - t * 1.40 + 3.0);
  float noiseC = snoiseH(vec2(globalUV.x * 4.0, t * 0.60 + 20.0)) * 0.03;
  float surfaceC = 0.72 + waveC + noiseC;

  // === MOUSE DISTURBANCE - fluid surface "pulls UP" toward kursor (jak palec w wodzie) ===
  vec2 mouseRel = globalUV - u_mouse;
  float gridAspect = u_globalSize.x / u_globalSize.y;
  mouseRel.x *= gridAspect; // circular falloff w przestrzeni fizycznej (nie eliptic)
  float mouseDist = length(mouseRel);

  // Bulge strength - exp falloff dla smooth gradient, multiply przez u_hover dla fade in/out
  float bulgeStrength = exp(-mouseDist * 7.0) * u_hover;

  // Apply bulge - surfaces unoszą się ku kursorowi (top-most najbardziej, deep najmniej)
  surfaceA -= bulgeStrength * 0.14;
  surfaceB -= bulgeStrength * 0.10;
  surfaceC -= bulgeStrength * 0.06;

  // Layer presences - smoothstep threshold per surface
  float feather = 0.015;
  float layerA = smoothstep(surfaceA - feather, surfaceA + feather, globalUV.y);
  float layerB = smoothstep(surfaceB - feather, surfaceB + feather, globalUV.y);
  float layerC = smoothstep(surfaceC - feather, surfaceC + feather, globalUV.y);

  // Color bands - segregowane regions między surfaces:
  // - topBand: tylko layer A (between surface A i surface B)
  // - midBand: tylko layer B (between surface B i surface C)
  // - deepBand: layer C (najgłębsza strefa)
  float topBand  = layerA - layerB; // gdzie A active, B nieaktywna
  float midBand  = layerB - layerC;
  float deepBand = layerC;

  // Foam - bright thin band at every surface crest (3 wave fronts widoczne)
  float foamA = smoothstep(0.022, 0.0, abs(globalUV.y - surfaceA));
  float foamB = smoothstep(0.022, 0.0, abs(globalUV.y - surfaceB));
  float foamC = smoothstep(0.022, 0.0, abs(globalUV.y - surfaceC));
  float allFoam = max(foamA, max(foamB, foamC));

  // === Paleta (stłumiona pod glass saturate 200%) ===
  vec3 light  = vec3(0.32, 0.55, 0.92);  // top fluid band (najjaśniejsza, blisko powierzchni)
  vec3 brand  = vec3(0.18, 0.42, 0.85);  // middle band (brand blue)
  vec3 indigo = vec3(0.22, 0.20, 0.65);  // deep band (ciemniejsza, blue-violet)
  vec3 foam   = vec3(0.55, 0.78, 1.00);  // bright cyan-white wave crests

  // Stratified color - każda strefa głębi ma własny kolor
  vec3 col = light * topBand + brand * midBand + indigo * deepBand;

  // Add foam highlights at each wave crest (3 świecące linie fal)
  col = mix(col, foam, allFoam * 0.45);

  // === MOUSE HALO - bright cyan glow wokół kursora WEWNĄTRZ fluid mass ===
  // Halo widoczne tylko gdzie jest fluid (layerA = 1), brak halo nad transparent area
  float halo = exp(-mouseDist * 4.5) * u_hover * 0.65 * layerA;
  col = mix(col, foam, halo * 0.75);

  // Final intensity - fluid mass + foam glow + halo boost
  float intensity = max(layerA * 0.82, allFoam * 0.45);
  intensity = max(intensity, halo * 0.70);

  // Premultiplied output - pasuje do gl.blendFunc(ONE, ONE_MINUS_SRC_ALPHA)
  gl_FragColor = vec4(col * intensity, intensity);
}
`;

interface HoverShaderProps {
  layoutObj: { offsetX: number; offsetY: number; width: number; height: number };
  gridSizeObj: { width: number; height: number };
  globalMouseObj: { x: number; y: number }; // shared mouse pos w grid coords 0-1
  hoverStateObj: { active: boolean };        // shared hover state (true gdy grid hovered)
}

const HoverShader = ({ layoutObj, gridSizeObj, globalMouseObj, hoverStateObj }: HoverShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true); // autonomiczna anim - running zawsze, pauza tylko przez IO
  const hoverSmoothRef = useRef(0); // smoothed hover intensity 0-1 (lerp w draw loop)
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    uTime: WebGLUniformLocation | null;
    uRes: WebGLUniformLocation | null;
    uOffset: WebGLUniformLocation | null;
    uGlobalSize: WebGLUniformLocation | null;
    uMouse: WebGLUniformLocation | null;
    uHover: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      premultipliedAlpha: true,
      alpha: true,
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('hover shader compile:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, HOVER_VS);
    const fs = compile(gl.FRAGMENT_SHADER, HOVER_FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('hover shader link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    glRef.current = {
      gl,
      uTime: gl.getUniformLocation(program, 'u_time'),
      uRes: gl.getUniformLocation(program, 'u_resolution'),
      uOffset: gl.getUniformLocation(program, 'u_offset'),
      uGlobalSize: gl.getUniformLocation(program, 'u_globalSize'),
      uMouse: gl.getUniformLocation(program, 'u_mouse'),
      uHover: gl.getUniformLocation(program, 'u_hover'),
    };

    const resize = () => {
      // DPR clamp 1.25 (idle anim, niska precyzja wystarcza - match Impact bento)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // === DRAW LOOP: autonomiczna anim z 45fps throttle + IO pause ===
    // 45fps zamiast 30 bo 5 blobów z szybkimi Lissajous needs smoother sampling
    const FRAME_INTERVAL = 1000 / 45;
    let lastDrawTime = 0;
    const t0 = performance.now();

    const draw = (now?: number) => {
      if (!runningRef.current || !glRef.current || !canvasRef.current) return;
      const ts = now ?? performance.now();
      if (ts - lastDrawTime >= FRAME_INTERVAL) {
        lastDrawTime = ts;
        const { uTime, uRes, uOffset, uGlobalSize, uMouse, uHover } = glRef.current;
        const t = (ts - t0) / 1000;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

        // Smooth hover intensity - lerp 0.08 daje ~12-frame fade in/out (~270ms @ 45fps)
        const hoverTarget = hoverStateObj.active ? 1.0 : 0.0;
        hoverSmoothRef.current += (hoverTarget - hoverSmoothRef.current) * 0.08;

        if (uTime) gl.uniform1f(uTime, t);
        if (uRes) gl.uniform2f(uRes, canvasRef.current.width, canvasRef.current.height);
        if (uOffset) gl.uniform2f(uOffset, layoutObj.offsetX * dpr, layoutObj.offsetY * dpr);
        if (uGlobalSize) gl.uniform2f(uGlobalSize, gridSizeObj.width * dpr, gridSizeObj.height * dpr);
        if (uMouse) gl.uniform2f(uMouse, globalMouseObj.x, globalMouseObj.y);
        if (uHover) gl.uniform1f(uHover, hoverSmoothRef.current);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    // IO pause gdy karta poza viewport (zero GPU work scrolling poza statystykami)
    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries[0].isIntersecting;
        if (inView && !runningRef.current) {
          runningRef.current = true;
          draw();
        } else if (!inView && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { rootMargin: '150px' }
    );
    io.observe(canvas);

    draw();

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      glRef.current = null;
    };
  }, [layoutObj, gridSizeObj, globalMouseObj, hoverStateObj]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

// === GLASS EDGE (iOS 26 Liquid Glass - Dramatic tier, skopiowany 1:1 z UI/UX) ===
// Backdrop-blur(32px) + saturate(200%) + 4 linear gradient masks (right/left/top/bottom z 28%)
// = soft glass ring na obwódce karty. Blururje shader spotlight pod spodem → glow przenika
// przez szkło z prawdziwym lensing effectem.
const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 rounded-[2rem] pointer-events-none z-5"
    style={{
      backdropFilter: 'blur(32px) saturate(200%) brightness(120%) contrast(110%)',
      WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(120%) contrast(110%)',
      boxShadow:
        'inset 0 1.5px 0 rgba(255, 255, 255, 0.30), inset 0 -1.5px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      WebkitMaskImage: [
        'linear-gradient(to right,  #000 0%, transparent 28%)',
        'linear-gradient(to left,   #000 0%, transparent 28%)',
        'linear-gradient(to bottom, #000 0%, transparent 28%)',
        'linear-gradient(to top,    #000 0%, transparent 28%)',
      ].join(', '),
      maskImage: [
        'linear-gradient(to right,  #000 0%, transparent 28%)',
        'linear-gradient(to left,   #000 0%, transparent 28%)',
        'linear-gradient(to bottom, #000 0%, transparent 28%)',
        'linear-gradient(to top,    #000 0%, transparent 28%)',
      ].join(', '),
    }}
  />
);

// === STAT CARD ===
// Outer wrapper `p-[1px]` = ring slot, inner `bg-[#0c0c0c] rounded-[calc(2rem-1px)]`
// przykrywa shader oprócz 1px obwódki → shader widoczny TYLKO jako świecący border.
// GlassEdge na warstwie z-5 (nad inner content, pod content text z-10) - blururje shader
// na krawędziach karty z prawdziwym lensing effectem.
// hover state + mouse pos pochodzą z parenta (globalny grid hover).

interface StatCardProps {
  stat: typeof STATS[number];
  layoutObj: { offsetX: number; offsetY: number; width: number; height: number };
  gridSizeObj: { width: number; height: number };
  globalMouseObj: { x: number; y: number };
  hoverStateObj: { active: boolean };
  enableShader: boolean;
  enableGlass: boolean;
}

const StatCard = ({ stat, layoutObj, gridSizeObj, globalMouseObj, hoverStateObj, enableShader, enableGlass }: StatCardProps) => {
  return (
    <div className="stat-card group relative rounded-[2rem] bg-white/15 p-[1px] overflow-hidden transition-colors duration-300 hover:bg-white/25">
      {/* SHADER LAYER - autonomiczna anim fluida + hover disturbance (SyncedShaderCanvas).
          Renderuje wycinek globalnego fluid'a płynącego przez wszystkie 4 karty.
          Hover: surface pull-up + bright halo wokół kursora wewnątrz cieczy. */}
      {enableShader && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <HoverShader
            layoutObj={layoutObj}
            gridSizeObj={gridSizeObj}
            globalMouseObj={globalMouseObj}
            hoverStateObj={hoverStateObj}
          />
        </div>
      )}

      {/* INNER CONTENT - CIEMNIEJSZE bg (gradient: ciemny góra, lekko jaśniej dół gdzie fluid).
          Ciemne tło daje stronger contrast dla glassmorphism + glass edge backdrop-blur ma
          więcej "kolorowego materiału" do rozproszenia z fluida u dołu.
          Border 1px ring dostaje pełen shader (poza inner area). */}
      <div className="relative h-full rounded-[calc(2rem-1px)] bg-gradient-to-b from-black/92 via-black/87 to-black/75 p-8 overflow-hidden">
        {/* Icon container - mini glass z hover transition */}
        <div className="relative z-10 mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 text-blue-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
          <stat.icon size={26} />
        </div>

        {/* Content z drop-shadow - czytelność na tle przebijającego shadera */}
        <div className="relative z-10 [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">
          <span className="block text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">{stat.value}</span>
          <span className="block text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">{stat.label}</span>
          <span className="block text-sm text-slate-300 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">{stat.desc}</span>
        </div>
      </div>

      {/* GLASS EDGE - Dramatic tier (UI/UX style). Pod content text (z-5 < z-10 content),
          nad inner bg/shader. Mobile skip (backdrop-blur 32px = expensive). */}
      {enableGlass && <GlassEdge />}
    </div>
  );
};

// --- DANE ---
const STATS = [
  { value: '100%', label: 'Zaangażowania', desc: 'Twój projekt, nasz priorytet', icon: Users },
  { value: '98/100', label: 'Wydajność', desc: 'Google PageSpeed', icon: Zap },
  { value: '< 24h', label: 'Szybki Kontakt', desc: 'Czas reakcji', icon: Clock },
  { value: 'ROI', label: 'Twój zysk', desc: 'Nasz cel nr 1', icon: TrendingUp },
];

const CAPABILITIES = [
    {
        title: "Strategia i audyt",
        desc: "Nie strzelamy na oślep. Analizujemy konkurencję i tworzymy plan dostosowany do Twojej marki.",
        icon: Globe
    },
    {
        title: "UI/UX Design",
        desc: "Projektujemy interfejsy, które nie tylko robią wrażenie od pierwszego wejrzenia, ale przede wszystkim prowadzą użytkownika za rękę do zakupu.",
        icon: Layout
    },
    {
        title: "Realizacja",
        desc: "Serce procesu. To tutaj makiety zamieniają się w interaktywną stronę. Dbamy o każdy detal techniczny, aby końcowy efekt był skalowalny i łatwy w obsłudze, niezależnie od wybranej technologii.",
        icon: Code2
    },
    {
        title: "AI i automatyzacja",
        desc: "Zatrudnij technologię do żmudnej pracy. Tworzymy konsultantów AI, którzy natychmiast odpowiadają na pytania klientów na stronie i odciążają Twój zespół.",
        icon: Sparkles
    }
];

// FAQS przeniesione do ./faq-data.ts (jako source of truth używana też w layout.tsx FAQPage schema)

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // SyncedShaderCanvas pattern (jak UI/UX bento) - autonomiczna anim fluida + hover effects:
  // - cardLayouts: cached pozycje + rozmiary kart względem grid'a (refresh tylko na resize)
  // - gridSize: rozmiar grid containera
  // - globalMouse: pozycja myszki w GRID coords 0-1 (mutowane in-place na mousemove)
  // - hoverState: shared hover state (mutated by useEffect - shader smoothly lerp toward target)
  // Wszystko stable refs - parent mutates, shadery czytają same references co frame.
  const cardLayoutsRef = useRef(
    Array.from({ length: STATS.length }, () => ({ offsetX: 0, offsetY: 0, width: 0, height: 0 }))
  );
  const gridSizeRef = useRef({ width: 1, height: 1 });
  const globalMouseRef = useRef({ x: 0.5, y: 0.5 });
  const hoverStateRef = useRef({ active: false });
  const [gridHover, setGridHover] = useState(false);

  // Mirror gridHover do ref żeby shader draw loop mógł czytać bez re-runów useEffect
  useEffect(() => {
    hoverStateRef.current.active = gridHover;
  }, [gridHover]);

  // Stan dla FAQ (Akordeon)
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Desktop gate dla aurora shadera - mobile dostaje static gradient (TBT killer fix)
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktopViewport(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktopViewport(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.scrollTo(0, 0);

    let ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        // 1. HERO ANIMATION (ZOOM)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", 
            pin: true,    
            scrub: 1,     
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        });

        mm.add("(min-width: 769px)", () => {
           tl.to(textRef.current, {
             scale: 50,
             transformOrigin: "42% 45%", 
             ease: "power2.inOut",
           });
        });

        mm.add("(max-width: 768px)", () => {
            tl.to(textRef.current, {
              scale: 80, 
              transformOrigin: "50% 50%", 
              ease: "power2.inOut",
            });
         });

        tl.to(textRef.current, { opacity: 0, duration: 0.1, ease: "none" }, ">-0.1")
        .to(bgRef.current, { scale: 1.2, ease: "none" }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // --- FLUID SHADER LAYOUT CACHE (SyncedShaderCanvas pattern) ---
  // Mierzy pozycje + rozmiary kart względem grid'a. Refresh tylko na resize
  // (NIE per frame) - eliminuje getBoundingClientRect w draw loop'ach (4× karty × 60fps).
  useEffect(() => {
    if (!mounted) return;
    const measure = () => {
      const grid = statsContainerRef.current;
      if (!grid) return;
      const gridRect = grid.getBoundingClientRect();
      gridSizeRef.current.width = gridRect.width;
      gridSizeRef.current.height = gridRect.height;
      const cards = grid.getElementsByClassName('stat-card');
      for (let i = 0; i < cards.length && i < cardLayoutsRef.current.length; i++) {
        const cardRect = cards[i].getBoundingClientRect();
        cardLayoutsRef.current[i].offsetX = cardRect.left - gridRect.left;
        cardLayoutsRef.current[i].offsetY = cardRect.top - gridRect.top;
        cardLayoutsRef.current[i].width = cardRect.width;
        cardLayoutsRef.current[i].height = cardRect.height;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (statsContainerRef.current) ro.observe(statsContainerRef.current);
    return () => ro.disconnect();
  }, [mounted]);

  // Mouse position w GLOBAL grid coords (0-1) - wszystkie 4 shadery referują tę samą.
  const handleStatsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!statsContainerRef.current) return;
    const rect = statsContainerRef.current.getBoundingClientRect();
    globalMouseRef.current.x = (e.clientX - rect.left) / rect.width;
    globalMouseRef.current.y = (e.clientY - rect.top) / rect.height;
  };

  if (!mounted) return null;

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* =======================================================
          SEKCJA HERO (ZOOM)
         ======================================================= */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden">
            <div
                ref={bgRef}
                className="absolute inset-0 w-full h-[120%] bg-[#020202] will-change-transform overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
                <div className="absolute inset-0 bg-black" />
                {isDesktopViewport ? (
                    // Desktop: WebGL aurora shader (3-warstwowy domain-warped noise w palecie deep navy → royal → brand blue)
                    <AuroraBackground />
                ) : (
                    // Mobile fallback: static radial gradient (zero JS/rAF/GPU loop, brightness compensation jak w oryginale brightness-125)
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.32),transparent_70%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(99,102,241,0.18),transparent_60%)]" />
                    </>
                )}
            </div>
            <div
                ref={textRef}
                className="absolute inset-0 bg-[#050505] z-10 flex items-center justify-center mix-blend-multiply pointer-events-none will-change-transform"
                style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
                <h1 className="text-[25vw] md:text-[22vw] font-black text-white tracking-tighter leading-none select-none text-center whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">AVENLY</h1>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-slate-500 text-sm font-medium animate-bounce flex flex-col items-center gap-2 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.2em]">Scrolluj w dół</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-blue-500 to-transparent"></div>
            </div>
        </div>
      </div>

      {/* =======================================================
          SEKCJA CONTENT
         ======================================================= */}
      <article className="relative z-30 bg-[#050505] pt-24 pb-24 border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <div className="container mx-auto px-6">
              
              {/* 1. O NAS (INTRO) */}
              <section className="max-w-5xl mb-24">
                  <header className="flex items-center gap-3 mb-6">
                      <div className="h-[1px] w-12 bg-blue-500"></div>
                      <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">O nas</span>
                  </header>
                  
                  {/* ZMIANA: Powrót do standardowych rozmiarów, ale "korporacją" trzyma się białego tekstu. 
                      Kolorowy tekst spada do nowej linii dzięki klasie 'block' */}
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                      Nie jesteśmy kolejną korporacją.
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                          Jesteśmy Twoim partnerem.
                      </span>
                  </h2>
                  
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl text-balance">
                      Tworzymy rozwiązania cyfrowe, które wspierają Twój biznes. Każdy detal ma jeden cel: więcej klientów i mniej Twojej pracy.
                  </p>
                  <div className="mt-10">
                    <a href="/kontakt" aria-label="Rozpocznij współpracę" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-blue-600/50">
                        Rozpocznijmy współpracę <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
              </section>

              {/* 2. STATYSTYKI (FLUID SHADER + HOVER DISTURBANCE - surface pull-up + halo) */}
              <section
                ref={statsContainerRef}
                onMouseEnter={() => isDesktopViewport && setGridHover(true)}
                onMouseLeave={() => setGridHover(false)}
                onMouseMove={handleStatsMouseMove}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/10 pt-20"
                aria-label="Statystyki agencji"
              >
                  {STATS.map((stat, index) => (
                      <StatCard
                        key={index}
                        stat={stat}
                        layoutObj={cardLayoutsRef.current[index]}
                        gridSizeObj={gridSizeRef.current}
                        globalMouseObj={globalMouseRef.current}
                        hoverStateObj={hoverStateRef.current}
                        enableShader={isDesktopViewport}
                        enableGlass={isDesktopViewport}
                      />
                  ))}
              </section>

              {/* 3. KOMPETENCJE (CSS HOVER) */}
              <section className="mt-32 pt-20 border-t border-white/10" aria-label="Nasze kompetencje">
                  <header className="mb-12">
                      <h3 className="text-3xl font-bold text-white">Kompetencje</h3>
                      <p className="text-slate-400 mt-2">Fundamenty, na których budujemy Twój sukces.</p>
                  </header>

                  <ul className="flex flex-col">
                      {CAPABILITIES.map((cap, i) => (
                          <li 
                            key={i} 
                            className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.02] hover:pl-4 cursor-default"
                          >
                              <div className="flex items-center gap-6 md:w-1/3 mb-4 md:mb-0">
                                  <span className="text-blue-500/50 font-mono text-xl transition-colors group-hover:text-blue-500">0{i + 1}</span>
                                  <h4 className="text-2xl md:text-4xl font-bold text-white transition-colors group-hover:text-blue-100">
                                      {cap.title}
                                  </h4>
                              </div>
                              <div className="md:w-1/2 flex items-start gap-6">
                                  <p className="text-slate-300 text-lg leading-relaxed max-w-lg">{cap.desc}</p>
                                  <div className="hidden md:flex w-10 h-10 rounded-full border border-white/20 items-center justify-center text-white bg-blue-500/10 ml-auto mr-4 shrink-0 transition-all group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:scale-110">
                                      <cap.icon size={18} />
                                  </div>
                              </div>
                          </li>
                      ))}
                  </ul>
              </section>

              {/* 4. FAQ + AI PROMPT (NOWOŚĆ) */}
              <section className="mt-32 pt-20 border-t border-white/10" aria-labelledby="faq-heading">
                  <header className="mb-16 text-center max-w-2xl mx-auto">
                      <h3 id="faq-heading" className="text-3xl font-bold text-white mb-4">Częste pytania</h3>
                      <p className="text-slate-400">Rozwiewamy wątpliwości zanim zapytasz.</p>
                  </header>

                  <div className="max-w-3xl mx-auto space-y-4">
                      {FAQS.map((faq, i) => (
                          <div 
                            key={i} 
                            className="group border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.04]"
                          >
                              <button 
                                onClick={() => toggleFaq(i)}
                                aria-expanded={openFaq === i}
                                aria-controls={`faq-answer-${i}`}
                                className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl"
                              >
                                  <span className="text-lg font-medium text-white group-hover:text-blue-100 transition-colors pr-4">
                                      {faq.question}
                                  </span>
                                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 transition-all duration-300 shrink-0 ${openFaq === i ? 'bg-blue-500 border-blue-500 rotate-180' : 'group-hover:bg-white/10'}`}>
                                      {openFaq === i ? <Minus size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                                  </div>
                              </button>
                              
                              <div 
                                id={`faq-answer-${i}`}
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                              >
                                  <div className="p-6 pt-0 text-slate-400 leading-relaxed text-sm md:text-base border-t border-white/5 mt-2">
                                      {faq.answer}
                                  </div>
                              </div>
                          </div>
                      ))}

                      {/* SPECIAL AI CARD */}
                      <div className="relative mt-8 group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                          <div className="relative border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl p-1 overflow-hidden">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-xl p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 animate-pulse-slow">
                                          <Sparkles size={24} />
                                      </div>
                                      <div className="text-left">
                                          <h4 className="text-white font-bold text-lg">Inne pytanie?</h4>
                                          <p className="text-slate-400 text-sm">Zapytaj naszego Avenly AI lub napisz bezpośrednio.</p>
                                      </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new Event("avenly:open-chat"))}
                                    aria-label="Otwórz asystenta AI Avenly"
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap cursor-pointer"
                                  >
                                      <MessageSquare size={18} />
                                      Rozpocznij czat
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

          </div>
      </article>
    </main>
  );
}