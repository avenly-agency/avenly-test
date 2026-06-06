'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Smartphone,
  Layers,
  CheckCircle2,
  MonitorSmartphone,
  Eye,
  MousePointerClick,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { motion, useReducedMotion } from 'framer-motion';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// ═══════════════════════════════════════════════════════════════════════════════
// IRIDESCENT FLOW (HERO BG) - Paper Design "Mesh Gradient × Wave Distortion" hybrid
// Multi-octave domain warp + IQ cosine palette = flowing iridescent bands.
// Signature "designer" aesthetic (Stripe/Linear/Vercel) - distinct od rays/aurora.
// ═══════════════════════════════════════════════════════════════════════════════

const MESH_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const MESH_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

// Inigo Quilez cosine palette - phase shifts ciasne → blue-dominant
// Większa amplituda b → szerszy zakres dark↔light, mocniejszy kontrast
vec3 palette(float t){
  vec3 a = vec3(0.13, 0.18, 0.40);
  vec3 b = vec3(0.22, 0.28, 0.58);
  vec3 c = vec3(1.00, 1.00, 1.00);
  vec3 d = vec3(0.62, 0.55, 0.50);
  return a + b * cos(6.28318 * (c * t + d));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.18;

  // 5-octave domain warp - dynamic motion: wszystkie phase speeds bumpnięte ~60%
  vec2 q = p;
  q += vec2(sin(p.y * 1.4 + t * 0.85),        cos(p.x * 1.3 - t * 0.70 + 1.0)) * 0.70;
  q += vec2(sin(p.y * 1.8 + t * 1.20 + 0.5),  cos(p.x * 1.6 - t * 0.95 + 1.0)) * 0.50;
  q += vec2(sin(p.y * 3.6 - t * 1.90 + 2.0),  cos(p.x * 3.0 + t * 1.65 + 0.5)) * 0.26;
  q += vec2(sin(p.y * 7.0 + t * 2.40),        cos(p.x * 6.0 - t * 2.20 + 3.0)) * 0.10;
  q += vec2(sin(p.y * 14.0 - t * 3.20 + 1.0), cos(p.x * 12.0 + t * 2.90))      * 0.035;

  // Palette input - szybsze sweep dla intensywniejszych dark↔light zmian
  float v = q.x * 0.35 + q.y * 0.28 + t * 0.95;
  vec3 col = palette(v);

  // SECOND palette pass - niezależny cycle (różna częstotliwość v) → dwie nakładające się
  // fale jasne/ciemne, jeszcze więcej variation
  vec3 col2 = palette(v * 0.55 + t * 0.40 + 1.7);
  col = mix(col, col2, 0.40);

  // Lime-300 accent - większy strength + mocniejszy puls
  vec3 lime = vec3(0.745, 0.945, 0.392);
  float limePulse = sin(v * 1.5 + t * 0.7) * 0.5 + 0.5;
  float limeMask = smoothstep(0.74, 0.96, limePulse);
  float limeRegion = smoothstep(-0.3, 0.6, q.x) * smoothstep(-0.8, 0.4, q.y);
  col = mix(col, lime, limeMask * limeRegion * 0.48);

  // Slate-blue highlight - mocniejszy (depth)
  vec3 slateBlue = vec3(0.520, 0.610, 0.980);
  float slateMask = smoothstep(0.78, 1.0, sin(v * 0.7 - t * 0.5) * 0.5 + 0.5);
  col = mix(col, slateBlue, slateMask * 0.38);

  // DARK shadow accent - mocne pociemnienie w peakach niskiej palette wartości
  // (tworzy "deep navy zones" przeplatające się z jasnymi)
  float darkMask = smoothstep(0.74, 1.0, sin(-v * 0.9 + t * 0.4 + 3.14) * 0.5 + 0.5);
  vec3 deepNavy = vec3(0.015, 0.018, 0.040);
  col = mix(col, deepNavy, darkMask * 0.35);

  // Highlight sheen - szybsze, mocniejsze
  float band = exp(-pow(q.y - sin(t * 1.3) * 0.5, 2.0) * 4.0) * 0.42;
  col += vec3(band) * vec3(0.55, 0.70, 1.0);

  // Brightness floor - jeszcze głębsze darks
  col = max(col, vec3(0.018, 0.020, 0.045));

  // Vignette
  float vig = smoothstep(2.0, 0.4, length(p * vec2(0.85, 1.0))) * 0.55 + 0.45;
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

const MeshGradientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('Mesh compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, MESH_VS);
    const fs = compile(gl.FRAGMENT_SHADER, MESH_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('Mesh link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
      const w = canvas.clientWidth * dpr; const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const t0 = performance.now();
    const draw = () => {
      if (!runningRef.current) return;
      const t = (performance.now() - t0) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uTime) gl.uniform1f(uTime, t);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !runningRef.current) { runningRef.current = true; draw(); }
      else if (!entry.isIntersecting && runningRef.current) { runningRef.current = false; cancelAnimationFrame(rafRef.current); }
    }, { rootMargin: '100px' });
    io.observe(canvas);

    return () => {
      runningRef.current = false; cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// IRIDESCENT FLOW (BENTO) - ten sam pattern co hero, scaled-down per karta
// Multi-octave warp (2 oktawy) + IQ cosine palette w brand range (blue-dominant).
// Karta 4 ma lime accent (match hero text-gradient `from-blue-400 to-lime-300`).
// Zero discrete shapes - same flow as hero, cohesive page identity.
// ═══════════════════════════════════════════════════════════════════════════════

const BENTO_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// SYNCED BENTO SHADER - używa u_offset + u_global_size aby renderować wycinek
// większej kompozycji. 4 karty z tym samym shaderem i czasem widzą różne fragmenty
// tej samej "wirtualnej powierzchni" - wyglądają jak okna do jednego płótna.
const BENTO_SYNCED_FS = `
precision highp float;
uniform vec2 u_resolution;     // size tego canvasa (px)
uniform vec2 u_offset;         // offset tego canvasa w global composition (px)
uniform vec2 u_global_size;    // total size composition area (px)
uniform float u_time;

vec3 palette(float t){
  vec3 a = vec3(0.10, 0.15, 0.32);
  vec3 b = vec3(0.12, 0.15, 0.30);
  vec3 c = vec3(1.00, 1.00, 1.00);
  vec3 d = vec3(0.62, 0.55, 0.50);
  return a + b * cos(6.28318 * (c * t + d));
}

void main(){
  // Global coordinates: gdzie ten fragment leży w pełnej kompozycji
  vec2 globalCoord = gl_FragCoord.xy + u_offset;
  vec2 uv = globalCoord / u_global_size;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_global_size.x / u_global_size.y;
  float t = u_time * 0.20;

  // 3-octave warp w global coordinate space - flow synchronized across kart
  // Większe amplitudy + szybsze phase speeds = bardziej dynamiczne bloby
  vec2 q = p;
  q += vec2(sin(p.y * 1.2 + t * 0.9),          cos(p.x * 1.0 - t * 0.7 + 1.0)) * 0.75;
  q += vec2(sin(p.y * 2.4 - t * 1.5 + 2.0),    cos(p.x * 2.0 + t * 1.3 + 0.5)) * 0.32;
  q += vec2(sin(p.y * 5.0 + t * 2.0 + 1.0),    cos(p.x * 4.5 - t * 1.8))       * 0.12;

  float v = q.x * 0.22 + q.y * 0.20 + t * 0.80;
  vec3 col = palette(v);

  // Lime accent - dolna-prawa część global composition (gdzie wide KARTA 4)
  vec3 lime = vec3(0.745, 0.945, 0.392);
  float limePulse = sin(v * 1.2 + t * 0.4) * 0.5 + 0.5;
  float limeMask = smoothstep(0.80, 0.97, limePulse);
  float limeRegion = smoothstep(-0.3, 0.6, q.x) * smoothstep(0.5, -0.6, q.y);
  col = mix(col, lime, limeMask * limeRegion * 0.30);

  // Slate-blue highlights
  vec3 slateBlue = vec3(0.420, 0.510, 0.940);
  float slateMask = smoothstep(0.85, 1.0, sin(v * 0.7 - t * 0.3) * 0.5 + 0.5);
  col = mix(col, slateBlue, slateMask * 0.15);

  // Soft vignette w global space - krawędzie zewnętrzne ciemnieją
  float vig = smoothstep(2.2, 0.5, length(p * vec2(0.7, 1.0))) * 0.5 + 0.5;
  col *= vig;

  vec3 floor = vec3(0.020, 0.025, 0.050);
  col = max(col, floor);

  gl_FragColor = vec4(col, 1.0);
}
`;

// Module-level shared time origin → wszystkie 4 canvasy używają tego samego t
const SHARED_T0 = typeof performance !== 'undefined' ? performance.now() : 0;

// SyncedShaderCanvas - measures position relative to `parentRef` co frame
// i przekazuje u_offset + u_global_size do shadera. Wszystkie instancje używają
// SHARED_T0 (module-level) → animacje są w lock-step.
const SyncedShaderCanvas = ({
  fragmentShader,
  parentRef,
}: {
  fragmentShader: string;
  parentRef: React.RefObject<HTMLElement | null>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('SyncedBento compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, BENTO_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('SyncedBento link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uOffset = gl.getUniformLocation(program, 'u_offset');
    const uGlobalSize = gl.getUniformLocation(program, 'u_global_size');

    // Mobile DPR 1.0, desktop 1.25. Aktualizowane w resize() przy każdym ResizeObserver.
    let dpr = 1;
    const computeDpr = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
    };
    computeDpr();

    // Cached uniforms - odświeżane TYLKO na resize/scroll, nie co frame
    // (eliminuje 240 layout reads/s → ~10/s podczas scrolla)
    let cachedOffX = 0, cachedOffY = 0, cachedGlobalW = 1, cachedGlobalH = 1;

    const updatePositions = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      cachedOffX = (canvasRect.left - parentRect.left) * dpr;
      cachedOffY = (parentRect.bottom - canvasRect.bottom) * dpr;
      cachedGlobalW = parentRect.width * dpr;
      cachedGlobalH = parentRect.height * dpr;
    };

    const resize = () => {
      computeDpr();
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      updatePositions();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(parent);

    // Scroll = jedyne inne źródło zmiany pozycji wzgl. parenta poza resize.
    // Passive listener - zero blocking głównego wątku.
    const onScroll = () => updatePositions();
    window.addEventListener('scroll', onScroll, { passive: true });

    const FRAME_INTERVAL = 1000 / 30;
    let lastDrawTime = 0;

    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - lastDrawTime >= FRAME_INTERVAL) {
        lastDrawTime = ts;
        const t = (ts - SHARED_T0) / 1000;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, t);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        // Czytamy z cache - bez layout reads w draw loopie
        if (uOffset) gl.uniform2f(uOffset, cachedOffX, cachedOffY);
        if (uGlobalSize) gl.uniform2f(uGlobalSize, cachedGlobalW, cachedGlobalH);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !runningRef.current) { runningRef.current = true; draw(); }
      else if (!entry.isIntersecting && runningRef.current) { runningRef.current = false; cancelAnimationFrame(rafRef.current); }
    }, { rootMargin: '100px' });
    io.observe(canvas);

    return () => {
      runningRef.current = false; cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect(); io.disconnect();
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, [fragmentShader, parentRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};

const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-5"
    style={{
      // Mocniejszy blur 32px + szerszy ring → bardziej rozmyty glass effect
      backdropFilter: 'blur(32px) saturate(200%) brightness(120%) contrast(110%)',
      WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(120%) contrast(110%)',
      boxShadow:
        'inset 0 1.5px 0 rgba(255, 255, 255, 0.30), inset 0 -1.5px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      // Szerszy ring (28%) - glass effect sięga głębiej w środek karty, soft transition
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

export default function UiUxPage() {
  // a11y reduce motion (shadery włączone na mobile z DPR 1.0, desktop z DPR 1.5/1.25)
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Bento wrapper ref - synced shader liczy offset/size relative do tego elementu
  const bentoWrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 overflow-hidden pt-24 lg:pt-28 pb-24">

      {/* TŁO - Iridescent Flow shader (Paper Design pattern, designer aesthetic) */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0 pointer-events-none overflow-hidden">
        <MeshGradientBackground />
        {/* Bottom fade mask - bands smoothly disappear into page bg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.6) 80%, #000000 100%)',
          }}
        />
      </div>

      <main className="relative z-10 container mx-auto px-6">
        
        {/* --- BREADCRUMBS --- */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link 
            href="/uslugi/design" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group backdrop-blur-md w-fit"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Wróć do: Design
          </Link>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <MonitorSmartphone size={14} /> Projektowanie UI/UX
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <h1 className="text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white mb-8 leading-[1.2]">
                Zyskaj interfejs, który <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-lime-300 block mt-2 lg:inline lg:mt-0">
                  zamienia ruch w klientów.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mb-10 pr-4">
                Klienci wchodzą na stronę i wychodzą bez kontaktu? Dostajesz przemyślaną architekturę (UX) i nowoczesny wygląd (UI), dzięki którym odwiedzający płynnie stają się klientami. Budujesz autorytet i przestajesz tracić zapytania.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Link href="/kontakt">
                  <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2 group cursor-pointer">
                    Bezpłatna konsultacja <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* PRAWA STRONA - GLASSMORPHISM WIZUALIZACJA */}
          <Reveal delay={0.3}>
            <div className="relative z-10 w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center group/main">
              
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/15 to-transparent rounded-[3rem] blur-3xl opacity-50 group-hover/main:opacity-70 group-hover/main:scale-105 transition-all duration-700" />
              
              <div className="relative w-[80%] h-[80%] rounded-[2.5rem] bg-white/[0.02] border border-white/15 shadow-2xl p-8 flex flex-col justify-between overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-default">

                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-400/40 group-hover:scale-110 transition-all duration-700" />

                <div className="w-full flex justify-between items-center mb-8 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                  </div>
                  <div className="h-2 w-24 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-500" />
                </div>

                <div className="flex-1 flex flex-col gap-5 relative z-10">
                  <div className="h-10 w-3/4 bg-gradient-to-r from-blue-500/20 to-transparent rounded-lg border border-blue-500/10 group-hover:w-[90%] group-hover:from-blue-500/30 transition-all duration-500" />

                  <div className="h-4 w-full bg-white/5 rounded-md group-hover:bg-white/10 transition-colors duration-500 delay-100" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-md group-hover:w-[95%] group-hover:bg-white/10 transition-all duration-500 delay-150" />

                  <div className="mt-auto h-12 w-1/2 bg-blue-500/20 rounded-xl border border-blue-500/30 flex items-center justify-center group-hover:w-2/3 group-hover:bg-blue-500/40 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all duration-500 delay-200">
                    <MousePointerClick size={20} className="text-blue-400 group-hover:animate-none group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                  </div>
                </div>

                {/* Identyczny GlassEdge co w bento - spójność glassmorphism w całej stronie */}
                <GlassEdge />
              </div>
            </div>
          </Reveal>
        </section>

        {/* --- NOWY BENTO GRID (Szklany, bez gigantycznych ikon w tle) --- */}
        <section className="mb-32">
          <Reveal>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Co zyskujesz dzięki UX?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Pozbywasz się błędów, które przepalały Twój budżet. Dostajesz stronę zaprojektowaną tak, by realnie zwiększać sprzedaż.
              </p>
            </div>
          </Reveal>

          {/* Grid wrapper = "płótno" do którego shadery 4 kart odnoszą offset */}
          <div ref={bentoWrapperRef} className="relative grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl 3xl:max-w-[88rem] 4xl:max-w-[1700px] mx-auto">

            {/* KARTA 1 - Szeroka */}
            <div className="md:col-span-12 h-full">
              <Reveal delay={0.1}>
                <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/15 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  {!shouldReduceMotion && (
                    <div className="absolute -inset-4" aria-hidden="true" style={{ filter: 'blur(14px)' }}>
                      <SyncedShaderCanvas fragmentShader={BENTO_SYNCED_FS} parentRef={bentoWrapperRef} />
                    </div>
                  )}

                  {/* Ikona główna */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    <Target size={32} />
                  </div>

                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      Każdy element pracuje na zysk
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                      Prowadzimy Twojego klienta za rękę, prosto do finalizacji zakupu lub wypełnienia formularza kontaktowego. Układ, treść i przyciski celują w jedno: Twój zysk.
                    </p>
                  </div>
                  <GlassEdge />
                </div>
              </Reveal>
            </div>

            {/* KARTA 2 - Kwadratowa */}
            <div className="md:col-span-6 h-full">
              <Reveal delay={0.2}>
                <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/15 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                  {!shouldReduceMotion && (
                    <div className="absolute -inset-4" aria-hidden="true" style={{ filter: 'blur(14px)' }}>
                      <SyncedShaderCanvas fragmentShader={BENTO_SYNCED_FS} parentRef={bentoWrapperRef} />
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    <Smartphone size={28} />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-white">Przewaga na mobile</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Przejmujesz klientów kupujących na smartfonach. Otrzymujesz interfejs równie wygodny, szybki i wciągający co dedykowana aplikacja natywna.
                    </p>
                  </div>
                  <GlassEdge />
                </div>
              </Reveal>
            </div>

            {/* KARTA 3 - Kwadratowa */}
            <div className="md:col-span-6 h-full">
              <Reveal delay={0.3}>
                <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/15 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                  {!shouldReduceMotion && (
                    <div className="absolute -inset-4" aria-hidden="true" style={{ filter: 'blur(14px)' }}>
                      <SyncedShaderCanvas fragmentShader={BENTO_SYNCED_FS} parentRef={bentoWrapperRef} />
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    <Layers size={28} />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-white">Spójność i autorytet</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Otrzymujesz pełny system wizualny. Twoja marka od pierwszych sekund budzi natychmiastowe zaufanie i sprawia wrażenie lidera w swojej branży.
                    </p>
                  </div>
                  <GlassEdge />
                </div>
              </Reveal>
            </div>

            {/* KARTA 4 - Szeroka (Wyśrodkowana) */}
            <div className="md:col-span-12 h-full">
              <Reveal delay={0.4}>
                <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/15 relative overflow-hidden flex flex-col items-center text-center">
                  {!shouldReduceMotion && (
                    <div className="absolute -inset-4" aria-hidden="true" style={{ filter: 'blur(14px)' }}>
                      <SyncedShaderCanvas fragmentShader={BENTO_SYNCED_FS} parentRef={bentoWrapperRef} />
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    <Eye size={32} />
                  </div>

                  <h3 className="text-3xl font-bold mb-4 relative z-10 text-white">Psychologia, która sprzedaje</h3>
                  <p className="text-slate-400 text-lg max-w-3xl relative z-10 leading-relaxed">
                    Twoja strona od razu wygląda premium. Odpowiednio kierujemy wzrokiem Twojego klienta, budując w nim poczucie bezpieczeństwa i chęć współpracy z Twoją firmą.
                  </p>
                  <GlassEdge />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --- CO ZAWIERA OFERTA (Zakres Prac) --- */}
        <section className="mb-32">
          <Reveal>
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 size={14} /> Zakres prac
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Co dokładnie otrzymujesz <br className="hidden md:block"/> w pakiecie?
              </h3>
            </div>
          </Reveal>
          
          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Audyt i analiza UX", desc: "Zaczynamy od namierzenia błędów obecnego interfejsu, które powodują ucieczkę klientów, oraz analizujemy przewagi konkurencji." },
              { title: "Układ i przepływ", desc: "Tworzymy surowy szkic struktury i ułożenia elementów (Low-Fi), aby upewnić się, że nawigacja na stronie jest logiczna i intuicyjna." },
              { title: "Finalny design (UI)", desc: "Nakładamy kinowy wygląd, dobieramy paletę kolorów, fonty i autorskie ikony. Projektujemy finalny interfejs piksel po pikselu." },
              { title: "Interaktywny prototyp", desc: "Otrzymujesz klikalną wersję projektu. Możesz sprawdzić jak zachowają się przyciski i animacje, jeszcze przed napisaniem linijki kodu." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-colors duration-500 relative overflow-hidden flex flex-col items-start gap-6 group"
              >
                {/* Luksusowy numerek w tle boxa */}
                <div className="absolute -bottom-6 right-0 text-[140px] md:text-[180px] font-black text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                  0{i + 1}
                </div>

                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] border border-blue-500/20">
                  <CheckCircle2 size={20} />
                </div>

                <div className="relative z-10 flex-1">
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-base md:text-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- WEZWANIE DO DZIAŁANIA --- */}
        <section className="border-t border-white/10 pt-20">
          <AvenlyAICta />
        </section>

      </main>
    </div>
  );
}