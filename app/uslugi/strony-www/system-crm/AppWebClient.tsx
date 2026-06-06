'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useReducedMotion, Variants } from 'framer-motion';
import {
  Layout,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  MousePointer2,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// ═══════════════════════════════════════════════════════════════════════════════
// HERO RAYS - SKY palette + TECHNICAL PRECISE wariant
// ═══════════════════════════════════════════════════════════════════════════════

const RAYS_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const RAYS_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.09;

  vec2 sunPos = vec2(sin(t * 0.16) * 0.30, 1.45);
  vec2 toSun = sunPos - p;
  float distSun = length(toSun);
  float angle = atan(toSun.x, toSun.y);

  float r1 = pow(max(0.0, sin(angle *  4.0 + t * 0.32)), 2.0);
  float r2 = pow(max(0.0, sin(angle *  6.0 - t * 0.38)), 2.3);
  float r3 = pow(max(0.0, sin(angle *  7.5 + t * 0.42)), 2.6);
  float r4 = pow(max(0.0, sin(angle * 10.0 - t * 0.48)), 3.0);
  float r5 = pow(max(0.0, sin(angle * 14.0 + t * 0.56)), 3.5);

  float flick1 = 0.96 + 0.04 * sin(t * 1.4 + angle * 2.1);
  float flick2 = 0.96 + 0.04 * sin(t * 1.8 + angle * 3.4 + 1.5);
  float flick3 = 0.96 + 0.04 * sin(t * 1.2 + angle * 2.6 + 3.2);
  float flick4 = 0.96 + 0.04 * sin(t * 2.0 + angle * 3.9 + 5.0);
  float flick5 = 0.96 + 0.04 * sin(t * 2.4 + angle * 5.1 + 2.1);

  float rays = r1 * 0.68 * flick1 + r2 * 0.56 * flick2 + r3 * 0.46 * flick3
             + r4 * 0.36 * flick4 + r5 * 0.26 * flick5;

  rays *= exp(-distSun * 0.11);

  float vertFade = smoothstep(1.0 - u_entry, 1.0, uv.y);
  float breath = 0.97 + 0.03 * sin(t * 0.55);
  float raysIntensity = rays * vertFade * 0.55 * breath;

  // SKY #38bdf8 (sky-400)
  vec3 rayColor = vec3(0.22, 0.74, 0.97);

  gl_FragColor = vec4(rayColor * raysIntensity, 1.0);
}
`;

const RaysBackground = () => {
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    if (gl.isContextLost()) { setCanvasKey(k => k + 1); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Rays compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, RAYS_VS);
    const fs = compile(gl.FRAGMENT_SHADER, RAYS_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Rays link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
      const w = canvas.clientWidth * dpr; const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const t0 = performance.now();
    let firstFrameDone = false;
    const draw = () => {
      if (!runningRef.current) return;
      const t = (performance.now() - t0) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uTime) gl.uniform1f(uTime, t);
      if (uEntry) { const _p = Math.min(1, t / 1.5); gl.uniform1f(uEntry, 1 - Math.pow(1 - _p, 3)); }
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!firstFrameDone) { firstFrameDone = true; canvas.style.visibility = 'visible'; }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const handleLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const handleRestored = () => { firstFrameDone = false; canvas.style.visibility = 'hidden'; draw(); };
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !runningRef.current) { runningRef.current = true; draw(); }
      else if (!entry.isIntersecting && runningRef.current) { runningRef.current = false; cancelAnimationFrame(rafRef.current); }
    }, { rootMargin: '100px' });
    io.observe(canvas);

    return () => {
      runningRef.current = false; cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
      canvas.style.visibility = 'hidden';
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" style={{ visibility: 'hidden', background: '#000000' }} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// BENTO / MAKIETA SHADERS - SKY palette
// ═══════════════════════════════════════════════════════════════════════════════

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const RADIAL_RINGS_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.25;

  vec2 center = vec2(0.6, -0.3);
  vec2 d = p - center;
  float dist = length(d);

  float r1 = sin(dist *  6.0 - t * 0.7);
  float r2 = sin(dist * 10.0 - t * 0.5 + 1.5);
  float r3 = sin(dist * 14.0 - t * 0.9 + 3.0);
  float r4 = sin(dist * 20.0 - t * 1.2 + 4.5);

  float rings = pow(max(0.0, r1),  8.0) * 0.70
              + pow(max(0.0, r2), 10.0) * 0.55
              + pow(max(0.0, r3),  8.0) * 0.45
              + pow(max(0.0, r4),  6.0) * 0.30;

  rings *= exp(-dist * 0.20);

  vec2 textCenter = vec2(-0.9, 0.35);
  float textDist = length((p - textCenter) * vec2(0.6, 1.3));
  float textDim = smoothstep(0.4, 1.2, textDist);

  float edgeBoost = max(
    smoothstep(0.9, 1.7, p.x),
    max(smoothstep(0.5, 0.95, p.y), smoothstep(0.5, 0.95, -p.y))
  );

  // SKY #38bdf8
  gl_FragColor = vec4(vec3(0.22, 0.74, 0.97), rings * textDim * (1.0 + edgeBoost * 0.5) * 1.0);
}
`;

const WARP_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.08;

  vec2 q; q.x = sin(p.x * 2.0 + p.y * 1.5 + t * 0.6); q.y = sin(p.x * 1.5 - p.y * 2.0 + t * 0.4 + 1.5);
  vec2 r; r.x = sin(p.x * 1.0 + q.y * 2.0 + t * 0.3); r.y = sin(p.y * 1.0 + q.x * 2.0 + t * 0.5 + 2.5);

  float field = (sin(r.x * 2.0 + r.y * 1.5 + t * 0.4) * 0.5 + 0.5);
  field += (sin(r.y * 2.5 - r.x * 1.5 + t * 0.3) * 0.5 + 0.5);
  field *= 0.5;

  float edgeBias = smoothstep(0.15, 0.85, length(p));
  vec2 textCenter = vec2(-0.3, 0.3);
  float textDist = length((p - textCenter) * vec2(0.7, 1.2));
  float textDim = smoothstep(0.4, 1.2, textDist);

  // SKY #38bdf8
  gl_FragColor = vec4(vec3(0.22, 0.74, 0.97), field * edgeBias * textDim * 0.85);
}
`;

const LIQUID_METAL_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.08;

  vec2 q; q.x = sin(p.x * 1.3 + p.y * 1.0 + t * 0.5); q.y = sin(p.x * 1.0 - p.y * 1.5 + t * 0.4 + 1.5);
  vec2 r; r.x = sin(p.x * 0.8 + q.y * 2.0 + t * 0.6); r.y = sin(p.y * 0.8 + q.x * 2.0 + t * 0.4 + 2.0);

  float v = sin(r.x * 3.0 + r.y * 2.0 + t * 0.5);
  float specular = pow(max(0.0, v), 5.0);
  float base = sin(r.x * 2.0 - r.y * 1.5 + t * 0.3) * 0.5 + 0.5;

  // SKY chromatic shift: deep sky → bright cyan peak
  vec3 colorBase = vec3(0.05, 0.30, 0.60);    // #0a4d99 deep sky
  vec3 colorPeak = vec3(0.45, 0.90, 1.0);     // #73e6ff bright cyan-sky
  vec3 finalColor = mix(colorBase, colorPeak, specular);

  float intensity = base * 0.5 + specular * 0.8;
  float falloff = smoothstep(2.5, 0.2, length(p * vec2(0.5, 1.0)));

  vec2 textCenter = vec2(-1.5, 0.0);
  float textDist = length((p - textCenter) * vec2(0.5, 1.4));
  float textDim = smoothstep(0.5, 1.5, textDist);

  float edgeBoost = max(smoothstep(0.5, 0.95, p.y), smoothstep(0.5, 0.95, -p.y));

  gl_FragColor = vec4(finalColor, intensity * falloff * textDim * (1.0 + edgeBoost * 0.4) * 1.0);
}
`;

// Resilient bento/makieta canvas - canvasKey recovery + console.warn + context-loss handlers.
const ShaderCanvas = ({ fragmentShader }: { fragmentShader: string }) => {
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    if (gl.isContextLost()) { setCanvasKey((k) => k + 1); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Bento compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, SHADER_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Bento link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
      const w = canvas.clientWidth * dpr; const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const FRAME_INTERVAL = 1000 / 30;
    const t0 = performance.now();
    let lastDrawTime = 0;
    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - lastDrawTime >= FRAME_INTERVAL) {
        lastDrawTime = ts;
        const t = (ts - t0) / 1000;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, t);
        if (uEntry) { const _p = Math.min(1, t / 1.5); gl.uniform1f(uEntry, 1 - Math.pow(1 - _p, 3)); }
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
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

    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const onRestored = () => { setCanvasKey((k) => k + 1); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      runningRef.current = false; cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [fragmentShader, canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};

const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 rounded-3xl pointer-events-none z-5"
    style={{
      backdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      WebkitBackdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      WebkitMaskImage: [
        'linear-gradient(to right,  #000 0%, transparent 15%)',
        'linear-gradient(to left,   #000 0%, transparent 15%)',
        'linear-gradient(to bottom, #000 0%, transparent 15%)',
        'linear-gradient(to top,    #000 0%, transparent 15%)',
      ].join(', '),
      maskImage: [
        'linear-gradient(to right,  #000 0%, transparent 15%)',
        'linear-gradient(to left,   #000 0%, transparent 15%)',
        'linear-gradient(to bottom, #000 0%, transparent 15%)',
        'linear-gradient(to top,    #000 0%, transparent 15%)',
      ].join(', '),
    }}
  />
);

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};
const vp = { once: true, margin: '-50px' } as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MAKIETA - APLIKACJA WEBOWA: 3 ekrany (Pulpit → Klienci → Zadania)
// wireframe → blueprint reveal (diagonal mask + beam) + kursor klikający nawigację.
// Każdy ekran = renderer(mode) → identyczna struktura JSX dla wire i blue (parity!),
// różni tylko kolor (T token / warunkowe bg). Treść GENERYCZNA (placeholdery).
// ═══════════════════════════════════════════════════════════════════════════════

type Mode = 'wire' | 'blue';

// Token tekstu: 'wire' = transparentny placeholder o wymiarach tekstu, 'blue' = realny kolor.
function T({ m, tone = 'h', children }: { m: Mode; tone?: 'h' | 's' | 'm' | 'a'; children: ReactNode }) {
  const blue = tone === 'h' ? 'text-white' : tone === 's' ? 'text-slate-300' : tone === 'm' ? 'text-slate-400' : 'text-sky-300';
  const wireBg = tone === 'h' || tone === 'a' ? 'bg-white/10' : 'bg-white/5';
  return <span className={`inline-block ${m === 'wire' ? `text-transparent ${wireBg} rounded` : blue}`}>{children}</span>;
}

const card = (m: Mode) =>
  `rounded-2xl border ${m === 'wire' ? 'border-white/10 bg-white/[0.02]' : 'border-sky-500/15 bg-white/[0.015]'}`;

// Shader FX bloku - tylko warstwa blueprint, gate reduced-motion. inset-px = bufor w rogach.
const Fx = ({ m, fx, shader }: { m: Mode; fx: boolean; shader: string }) =>
  m === 'blue' && fx ? (
    <div className="absolute inset-px overflow-hidden pointer-events-none rounded-2xl" aria-hidden="true">
      <ShaderCanvas fragmentShader={shader} />
    </div>
  ) : null;

// Mała etykieta sekcji (mono numerek/tag) - premium app feel
const Eyebrow = ({ m, children }: { m: Mode; children: ReactNode }) => (
  <span className="font-mono text-[10px] tracking-[0.25em] uppercase"><T m={m} tone="a">{children}</T></span>
);

const primaryBtn = (m: Mode) =>
  `px-4 py-2 rounded-xl border text-xs font-bold ${m === 'wire' ? 'border-white/15 text-transparent bg-white/5' : 'border-sky-500/30 text-sky-200 bg-sky-500/10'}`;

// ── EKRAN 1: PULPIT (dashboard - bogaty, scrolluje) ────────────────────────────
const dashboardView = (m: Mode, fx = false) => (
  <div className="w-full flex flex-col gap-7 md:gap-9">

    {/* Header */}
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="flex flex-col gap-2">
        <Eyebrow m={m}>Pulpit</Eyebrow>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight"><T m={m}>Dzień dobry, Anno</T></h2>
        <p className="text-sm md:text-base max-w-md leading-relaxed"><T m={m} tone="m">Oto co wydarzyło się w Twoim systemie dzisiaj.</T></p>
      </div>
      <div className={primaryBtn(m)}><T m={m} tone={m === 'wire' ? 'h' : 'a'}>+ Nowy rekord</T></div>
    </div>

    {/* Stat cards (4) z mini-sparkline */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[['1 240', 'Użytkownicy', '+8.3%'], ['86%', 'Konwersja', '+2.1%'], ['48', 'Zadania', '−4'], ['64 200', 'Przychód', '+12%']].map(([v, l, d], i) => (
        <div key={i} className={`${card(m)} p-4 md:p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <div className={`w-9 h-9 rounded-lg ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/15 border border-sky-500/25'}`} />
            <span className="font-mono text-[10px]"><T m={m} tone="a">{d}</T></span>
          </div>
          <div className="text-xl md:text-3xl font-bold"><T m={m}>{v}</T></div>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase"><T m={m} tone="m">{l}</T></div>
          <div className="flex items-end gap-1 h-8 mt-1">
            {[40, 65, 50, 80, 60, 90, 70].map((h, j) => (
              <div key={j} className={`flex-1 rounded-sm ${m === 'wire' ? 'bg-white/8' : 'bg-sky-400/40'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Chart (span 2, z Fx) + activity feed */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className={`xl:col-span-2 ${card(m)} relative overflow-hidden p-5 md:p-6 flex flex-col gap-5 ${m === 'blue' ? 'shadow-[0_24px_70px_-28px_rgba(14,165,233,0.35)]' : ''}`}>
        <Fx m={m} fx={fx} shader={WARP_FS} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="text-sm md:text-base font-bold"><T m={m}>Aktywność w czasie</T></div>
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase"><T m={m} tone="m">Ostatnie 30 dni</T></div>
          </div>
          <div className="flex gap-2">
            {['7D', '30D', '90D'].map((t, i) => (
              <span key={t} className={`px-2.5 py-1 rounded-md text-[10px] font-mono ${i === 1 ? (m === 'wire' ? 'bg-white/10 text-transparent' : 'bg-sky-500/20 text-sky-200') : (m === 'wire' ? 'text-transparent bg-white/5' : 'text-slate-400 bg-white/5')}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex-1 flex items-end gap-2 md:gap-3 min-h-[150px] border-b border-white/10 pb-1">
          {[45, 60, 40, 72, 55, 85, 62, 78, 50, 90, 68, 82].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-md ${m === 'wire' ? 'bg-white/8' : 'bg-linear-to-t from-sky-500/30 to-sky-400'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="relative z-10 flex justify-between">
          {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map((d) => (
            <span key={d} className="font-mono text-[9px]"><T m={m} tone="m">{d}</T></span>
          ))}
        </div>
      </div>

      <div className={`${card(m)} p-5 md:p-6 flex flex-col gap-4`}>
        <div className="text-sm md:text-base font-bold"><T m={m}>Ostatnia aktywność</T></div>
        <div className="flex flex-col gap-3.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`w-8 h-8 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/15 border border-sky-500/25'}`} />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="text-xs font-semibold"><T m={m} tone="s">Nowe zdarzenie w systemie</T></div>
                <div className="text-[10px]"><T m={m} tone="m">2 godziny temu</T></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Mini-tabela: ostatnie zamówienia */}
    <div className={`${card(m)} p-5 md:p-6 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div className="text-sm md:text-base font-bold"><T m={m}>Ostatnie zamówienia</T></div>
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase"><T m={m} tone="a">Zobacz wszystkie</T></span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-white/10">
          {['ID', 'Klient', 'Status', 'Kwota'].map((h) => (
            <span key={h} className="font-mono text-[9px] tracking-[0.15em] uppercase"><T m={m} tone="m">{h}</T></span>
          ))}
        </div>
        {[0, 1, 2, 3].map((r) => (
          <div key={r} className="grid grid-cols-4 gap-4 items-center py-1.5">
            <span className="font-mono text-[11px]"><T m={m} tone="s">{`#00${r + 1}`}</T></span>
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-5 h-5 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/15'}`} />
              <span className="text-[11px] truncate"><T m={m} tone="s">Klient</T></span>
            </div>
            <span className={`justify-self-start px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${m === 'wire' ? 'bg-white/8 text-transparent' : 'bg-emerald-500/15 text-emerald-300'}`}>Opłacone</span>
            <span className="text-[11px] font-bold"><T m={m}>129 zł</T></span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── EKRAN 2: KLIENCI (tabela CRM - bogata, scrolluje) ──────────────────────────
const clientsView = (m: Mode) => (
  <div className="w-full flex flex-col gap-6 md:gap-7">

    {/* Header */}
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="flex flex-col gap-2">
        <Eyebrow m={m}>Klienci</Eyebrow>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight"><T m={m}>Baza klientów</T></h2>
      </div>
      <div className={primaryBtn(m)}><T m={m} tone={m === 'wire' ? 'h' : 'a'}>+ Dodaj klienta</T></div>
    </div>

    {/* Toolbar: search + filtry */}
    <div className="flex items-center gap-3 flex-wrap">
      <div className={`flex-1 min-w-[180px] h-10 rounded-xl border flex items-center px-3 gap-2.5 ${m === 'wire' ? 'border-white/12 bg-white/[0.03]' : 'border-sky-500/20 bg-white/[0.02]'}`}>
        <div className={`w-4 h-4 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/15' : 'bg-sky-400/40'}`} />
        <div className="h-2 w-32 rounded bg-white/10" />
      </div>
      {['Wszyscy', 'Aktywni', 'Nowi', 'VIP'].map((t, i) => (
        <span key={t} className={`px-3 py-2 rounded-lg text-xs font-semibold ${i === 0 ? (m === 'wire' ? 'bg-white/10 text-transparent' : 'bg-sky-500/20 text-sky-200') : (m === 'wire' ? 'text-transparent bg-white/5' : 'text-slate-400 bg-white/5')}`}>{t}</span>
      ))}
    </div>

    {/* Tabela */}
    <div className={`${card(m)} overflow-hidden`}>
      <div className={`grid grid-cols-12 gap-4 px-5 py-3 border-b ${m === 'wire' ? 'border-white/10 bg-white/[0.02]' : 'border-sky-500/15 bg-sky-500/[0.03]'}`}>
        {[['col-span-5 sm:col-span-4', 'Nazwa'], ['hidden sm:block sm:col-span-3', 'E-mail'], ['col-span-3 sm:col-span-2', 'Status'], ['col-span-3 sm:col-span-2', 'Wartość'], ['col-span-1', '']].map(([c, h], i) => (
          <span key={i} className={`${c} font-mono text-[9px] tracking-[0.15em] uppercase`}><T m={m} tone="m">{h}</T></span>
        ))}
      </div>
      {[0, 1, 2, 3, 4, 5, 6].map((r) => (
        <div key={r} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center border-b border-white/5 ${r === 0 && m === 'blue' ? 'bg-sky-500/[0.04]' : ''}`}>
          <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/15 border border-sky-500/25'}`} />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-bold truncate"><T m={m} tone="s">Imię Nazwisko</T></span>
              <span className="text-[10px] sm:hidden"><T m={m} tone="m">firma.pl</T></span>
            </div>
          </div>
          <span className="col-span-3 text-[11px] truncate hidden sm:inline"><T m={m} tone="m">kontakt@firma.pl</T></span>
          <span className={`col-span-3 sm:col-span-2 justify-self-start px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider ${m === 'wire' ? 'bg-white/8 text-transparent' : (r % 3 === 0 ? 'bg-emerald-500/15 text-emerald-300' : r % 3 === 1 ? 'bg-sky-500/15 text-sky-300' : 'bg-white/8 text-slate-400')}`}>Aktywny</span>
          <span className="col-span-3 sm:col-span-2 text-[11px] font-bold"><T m={m}>12 400 zł</T></span>
          <span className={`col-span-1 justify-self-end text-lg leading-none ${m === 'wire' ? 'text-white/20' : 'text-slate-500'}`}>···</span>
        </div>
      ))}
    </div>

    {/* Paginacja */}
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase"><T m={m} tone="m">1-7 z 248</T></span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((p, i) => (
          <span key={p} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono ${i === 0 ? (m === 'wire' ? 'bg-white/10 text-transparent' : 'bg-sky-500/20 text-sky-200') : (m === 'wire' ? 'text-transparent bg-white/5' : 'text-slate-400 bg-white/5')}`}>{p}</span>
        ))}
      </div>
    </div>
  </div>
);

// ── EKRAN 3: ZADANIA (kanban - bogata tablica) ─────────────────────────────────
const tasksView = (m: Mode, fx = false) => (
  <div className="w-full flex flex-col gap-6 md:gap-7">

    {/* Header */}
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="flex flex-col gap-2">
        <Eyebrow m={m}>Zadania</Eyebrow>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight"><T m={m}>Tablica projektu</T></h2>
      </div>
      <div className="flex items-center -space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#020202] ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/20'}`} />
        ))}
      </div>
    </div>

    {/* Kolumny */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[['Backlog', '5'], ['W toku', '3'], ['Review', '2'], ['Gotowe', '8']].map(([col, n], ci) => (
        <div key={ci} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${m === 'wire' ? 'bg-white/20' : ci === 0 ? 'bg-slate-400' : ci === 1 ? 'bg-sky-400' : ci === 2 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="text-xs font-bold"><T m={m} tone="s">{col}</T></span>
            </div>
            <span className="font-mono text-[10px]"><T m={m} tone="m">{n}</T></span>
          </div>
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: ci === 3 ? 3 : ci + 1 }).map((_, k) => (
              <div key={k} className={`${card(m)} relative overflow-hidden p-3.5 flex flex-col gap-2.5`}>
                {ci === 1 && k === 0 && <Fx m={m} fx={fx} shader={LIQUID_METAL_FS} />}
                <div className="relative z-10 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${m === 'wire' ? 'bg-white/8 text-transparent' : 'bg-sky-500/15 text-sky-300'}`}>Feature</span>
                </div>
                <div className="relative z-10 text-[11px] font-semibold leading-snug"><T m={m} tone="s">Tytuł zadania do wykonania</T></div>
                <div className="relative z-10 flex items-center justify-between mt-1">
                  <div className={`w-6 h-6 rounded-full ${m === 'wire' ? 'bg-white/8' : 'bg-sky-500/15'}`} />
                  <span className="font-mono text-[9px]"><T m={m} tone="m">12 maj</T></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const URLS = ['app.twoja-firma.pl/pulpit', 'app.twoja-firma.pl/klienci', 'app.twoja-firma.pl/zadania'];

export function AppWebClient() {
  // a11y reduce motion (shadery na mobile z DPR 1.0, desktop z DPR 1.5/1.25)
  const shouldReduceMotion = useReducedMotion() ?? false;
  const fx = !shouldReduceMotion;

  // Pomiar pozycji linków nav makiety → kursor klika dokładnie w ich środek (cross-width).
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const navLinkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [linkX, setLinkX] = useState<[number, number, number]>([72, 82, 92]);
  const [navY, setNavY] = useState(5);
  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const vr = vp.getBoundingClientRect();
      if (vr.width < 2 || vr.height < 2) return;
      const xs = ([0, 1, 2] as const).map((i) => {
        const el = navLinkRefs.current[i];
        if (!el) return [72, 82, 92][i];
        const r = el.getBoundingClientRect();
        return ((r.left + r.width / 2 - vr.left) / vr.width) * 100;
      }) as [number, number, number];
      const el0 = navLinkRefs.current[0];
      if (el0) {
        const r = el0.getBoundingClientRect();
        setNavY(((r.top + r.height / 2 - vr.top) / vr.height) * 100);
      }
      setLinkX(xs);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const tm = setTimeout(measure, 900);
    const vp = viewportRef.current;
    const ro = vp ? new ResizeObserver(measure) : null;
    if (ro && vp) ro.observe(vp);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); clearTimeout(tm); ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // ── MAKIETA - podróż przez aplikację (pulpit → klienci → zadania) ──
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const smoothMain = useSpring(mainProgress, { stiffness: 140, damping: 38, restDelta: 0.0005 });
  const raysOpacity = useTransform(smoothMain, [0.9, 1], [1, 0]);

  // Wejście okna + pasek postępu
  const scale = useTransform(smoothMain, [0, 0.05], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.05], [15, 0]);
  const mockOpacity = useTransform(smoothMain, [0, 0.04], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.05, 0.97], ['0%', '100%']);

  // Crossfade ekranów: pulpit [0-0.33], klienci [0.33-0.66], zadania [0.66-1]
  const pulpitOpacity = useTransform(smoothMain, [0, 0.31, 0.34, 1], [1, 1, 0, 0]);
  const klienciOpacity = useTransform(smoothMain, [0, 0.34, 0.37, 0.63, 0.66, 1], [0, 0, 1, 1, 0, 0]);
  const zadaniaOpacity = useTransform(smoothMain, [0, 0.66, 0.69, 1], [0, 0, 1, 1]);

  // Pionowy scroll wewnątrz ekranów
  const pulpitY = useTransform(smoothMain, [0.06, 0.31], ['0%', '-55%']);
  const klienciY = useTransform(smoothMain, [0.40, 0.63], ['0%', '-45%']);
  const zadaniaY = useTransform(smoothMain, [0.72, 0.97], ['0%', '-22%']);

  // URL bar - 3 trasy
  const urlPulpit = useTransform(smoothMain, [0, 0.31, 0.34], [1, 1, 0]);
  const urlKlienci = useTransform(smoothMain, [0.34, 0.37, 0.63, 0.66], [0, 1, 1, 0]);
  const urlZadania = useTransform(smoothMain, [0.66, 0.69, 1], [0, 1, 1]);

  // Aktywne linki nawigacji (Pulpit / Klienci / Zadania)
  const link0Active = useTransform(smoothMain, [0, 0.33, 0.34, 1], [1, 1, 0, 0]);
  const link0Inactive = useTransform(smoothMain, [0, 0.33, 0.34, 1], [0, 0, 1, 1]);
  const link1Active = useTransform(smoothMain, [0, 0.33, 0.34, 0.66, 0.67, 1], [0, 0, 1, 1, 0, 0]);
  const link1Inactive = useTransform(smoothMain, [0, 0.33, 0.34, 0.66, 0.67, 1], [1, 1, 0, 0, 1, 1]);
  const link2Active = useTransform(smoothMain, [0, 0.66, 0.67, 1], [0, 0, 1, 1]);
  const link2Inactive = useTransform(smoothMain, [0, 0.66, 0.67, 1], [1, 1, 0, 0]);

  // Kursor - klika link1 (~0.33 → Klienci) i link2 (~0.66 → Zadania)
  const cursorOpacity = useTransform(smoothMain,
    [0, 0.18, 0.20, 0.34, 0.36, 0.52, 0.54, 0.67, 0.69, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]);
  const cursorX = useTransform(smoothMain,
    [0, 0.18, 0.28, 0.32, 0.36, 0.52, 0.61, 0.65, 1],
    ['50%', '50%', `${linkX[1]}%`, `${linkX[1]}%`, `${linkX[1]}%`, '50%', `${linkX[2]}%`, `${linkX[2]}%`, `${linkX[2]}%`]);
  const cursorY = useTransform(smoothMain,
    [0, 0.18, 0.28, 0.32, 0.36, 0.52, 0.61, 0.65, 1],
    ['72%', '72%', `${navY}%`, `${navY}%`, `${navY}%`, '72%', `${navY}%`, `${navY}%`, `${navY}%`]);
  const cursorScale = useTransform(smoothMain,
    [0, 0.315, 0.325, 0.335, 0.645, 0.655, 0.665, 1],
    [1, 1, 0.8, 1, 1, 0.8, 1, 1]);

  // ── PER-PHASE WIREFRAME → BLUEPRINT REVEAL (raw mainProgress, bez spring) ──
  // PULPIT reveal (0.02-0.10)
  const pulpitReveal = useTransform(mainProgress, [0.02, 0.10], [0, 105]);
  const pLead = useTransform(pulpitReveal, (v) => v - 3);
  const pTrail = useTransform(pulpitReveal, (v) => v + 3);
  const pulpitWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${pLead}%, black ${pTrail}%)`;
  const pulpitBlueMask = useMotionTemplate`linear-gradient(to top left, black ${pLead}%, transparent ${pTrail}%)`;
  const pBS1 = useTransform(pulpitReveal, (v) => v - 15);
  const pBS2 = useTransform(pulpitReveal, (v) => v - 8);
  const pBS3 = useTransform(pulpitReveal, (v) => v - 2.5);
  const pBS4 = useTransform(pulpitReveal, (v) => v);
  const pBS5 = useTransform(pulpitReveal, (v) => v + 3);
  const pBS6 = useTransform(pulpitReveal, (v) => v + 10);
  const pBS7 = useTransform(pulpitReveal, (v) => v + 17);
  const pulpitBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${pBS1}%, rgba(0,0,0,0.15) ${pBS2}%, rgba(0,0,0,0.55) ${pBS3}%, rgba(0,0,0,1) ${pBS4}%, rgba(0,0,0,0.55) ${pBS5}%, rgba(0,0,0,0.15) ${pBS6}%, transparent ${pBS7}%)`;
  const pulpitBeamOpacity = useTransform(mainProgress, [0.02, 0.025, 0.095, 0.10], [0, 1, 1, 0]);

  // KLIENCI reveal (0.37-0.45)
  const klienciReveal = useTransform(mainProgress, [0.37, 0.45], [0, 105]);
  const kLead = useTransform(klienciReveal, (v) => v - 3);
  const kTrail = useTransform(klienciReveal, (v) => v + 3);
  const klienciWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${kLead}%, black ${kTrail}%)`;
  const klienciBlueMask = useMotionTemplate`linear-gradient(to top left, black ${kLead}%, transparent ${kTrail}%)`;
  const kBS1 = useTransform(klienciReveal, (v) => v - 15);
  const kBS2 = useTransform(klienciReveal, (v) => v - 8);
  const kBS3 = useTransform(klienciReveal, (v) => v - 2.5);
  const kBS4 = useTransform(klienciReveal, (v) => v);
  const kBS5 = useTransform(klienciReveal, (v) => v + 3);
  const kBS6 = useTransform(klienciReveal, (v) => v + 10);
  const kBS7 = useTransform(klienciReveal, (v) => v + 17);
  const klienciBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${kBS1}%, rgba(0,0,0,0.15) ${kBS2}%, rgba(0,0,0,0.55) ${kBS3}%, rgba(0,0,0,1) ${kBS4}%, rgba(0,0,0,0.55) ${kBS5}%, rgba(0,0,0,0.15) ${kBS6}%, transparent ${kBS7}%)`;
  const klienciBeamOpacity = useTransform(mainProgress, [0.37, 0.375, 0.445, 0.45], [0, 1, 1, 0]);

  // ZADANIA reveal (0.69-0.77)
  const zadaniaReveal = useTransform(mainProgress, [0.69, 0.77], [0, 105]);
  const zLead = useTransform(zadaniaReveal, (v) => v - 3);
  const zTrail = useTransform(zadaniaReveal, (v) => v + 3);
  const zadaniaWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${zLead}%, black ${zTrail}%)`;
  const zadaniaBlueMask = useMotionTemplate`linear-gradient(to top left, black ${zLead}%, transparent ${zTrail}%)`;
  const zBS1 = useTransform(zadaniaReveal, (v) => v - 15);
  const zBS2 = useTransform(zadaniaReveal, (v) => v - 8);
  const zBS3 = useTransform(zadaniaReveal, (v) => v - 2.5);
  const zBS4 = useTransform(zadaniaReveal, (v) => v);
  const zBS5 = useTransform(zadaniaReveal, (v) => v + 3);
  const zBS6 = useTransform(zadaniaReveal, (v) => v + 10);
  const zBS7 = useTransform(zadaniaReveal, (v) => v + 17);
  const zadaniaBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${zBS1}%, rgba(0,0,0,0.15) ${zBS2}%, rgba(0,0,0,0.55) ${zBS3}%, rgba(0,0,0,1) ${zBS4}%, rgba(0,0,0,0.55) ${zBS5}%, rgba(0,0,0,0.15) ${zBS6}%, transparent ${zBS7}%)`;
  const zadaniaBeamOpacity = useTransform(mainProgress, [0.69, 0.695, 0.765, 0.77], [0, 1, 1, 0]);

  const scrollHintOpacity = useTransform(smoothMain, [0, 0.05, 0.1], [1, 1, 0]);

  // --- ZAKRES PRAC SCROLL LOCK ---
  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });
  const smoothScope = useSpring(scopeProgress, { stiffness: 55, damping: 32, restDelta: 0.001 });
  const scopeCardsY = useTransform(smoothScope, [0, 1], ['50vh', '-50%']);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-sky-500/30 overflow-x-clip">

      {/* TŁO - sky rays fixed podczas Hero+makieta scroll lock, fade out po makiecie */}
      <motion.div
        style={{ opacity: raysOpacity }}
        className="fixed top-0 left-0 right-0 h-screen z-0 pointer-events-none overflow-hidden bg-[#000000]"
      >
        <RaysBackground />
      </motion.div>

      <main className="relative z-10">

        {/* --- HERO --- */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/5 border border-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Layout size={14} /> CRM · Automatyzacje AI · B2B
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="font-bold tracking-tight mb-8 leading-[1.0]">
              <span className="block text-[clamp(2.5rem,12vw,9rem)] leading-[0.95]">Systemy CRM</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-300 text-[clamp(1.75rem,8.3vw,6.2rem)] leading-[1.0]">
                pod Twój proces.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Masz proces, którego nie ogarnia żaden gotowy program? Zyskujesz system szyty dokładnie pod niego - CRM, portal klienta, panel B2B czy narzędzie wewnętrzne, które automatyzuje powtarzalną pracę z pomocą AI.
            </p>
          </Reveal>
        </section>

        {/* ── MAKIETA - PODRÓŻ PRZEZ APLIKACJĘ (800vh) ────────────────────── */}
        {/* 3 ekrany: pulpit → klienci → zadania. Każdy = wireframe→blueprint reveal + beam, kursor klika nawigację. */}
        <section ref={targetRef} style={{ height: '800vh' }} className="relative z-30">
          <div className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden px-3 md:px-6">

            {/* Entry animation wrapper - fade-up gdy makieta wchodzi w viewport */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <motion.div
                style={{ scale, opacity: mockOpacity, rotateX, perspective: '1200px' }}
                className="relative w-full max-w-[88rem] h-[76vh] md:h-[86vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(14,165,233,0.2)] flex flex-col overflow-hidden will-change-transform"
              >
                {/* Browser toolbar */}
                <div className="relative h-14 bg-[#111] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                  <div className="flex gap-1.5 md:gap-2 shrink-0">
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/50 rounded-full border border-white/15 flex items-center px-3 md:px-4 overflow-hidden z-50 shadow-inner max-w-[60%] md:max-w-md">
                    <span className="text-sky-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                    <div className="relative w-44 sm:w-72 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                      <motion.span style={{ opacity: urlPulpit }} className="absolute inset-x-0 truncate text-center sm:text-left">{URLS[0]}</motion.span>
                      <motion.span style={{ opacity: urlKlienci }} className="absolute inset-x-0 truncate text-center sm:text-left text-sky-300">{URLS[1]}</motion.span>
                      <motion.span style={{ opacity: urlZadania }} className="absolute inset-x-0 truncate text-center sm:text-left text-sky-300">{URLS[2]}</motion.span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                    <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-sky-500 to-sky-400 will-change-transform" />
                  </div>
                </div>

                {/* Viewport */}
                <div ref={viewportRef} className="relative flex-1 bg-[#020202] overflow-hidden">

                  {/* App top nav (persistuje - to aplikacja SPA) */}
                  <div className="absolute top-0 inset-x-0 h-16 border-b border-white/5 bg-[#000000]/80 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-8 pointer-events-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                        <div className="w-3 h-3 bg-sky-400 rounded-sm" />
                      </div>
                      <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                    </div>
                    <div className="flex gap-4 sm:gap-8 items-center pt-1">
                      {[link0Active, link1Active, link2Active].map((active, i) => {
                        const inactive = [link0Inactive, link1Inactive, link2Inactive][i];
                        return (
                          <div key={i} ref={(el) => { navLinkRefs.current[i] = el; }} className="relative w-10 sm:w-14 h-2 will-change-[opacity]">
                            <motion.div style={{ opacity: inactive }} className="absolute inset-0 rounded bg-white/20" />
                            <motion.div style={{ opacity: active }} className="absolute inset-0 rounded bg-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <div className="w-24 h-7 rounded-full bg-white/5 border border-white/10" />
                      <div className="w-8 h-8 rounded-full bg-sky-500/15 border border-sky-500/25" />
                    </div>
                  </div>

                  {/* EKRAN 1: PULPIT */}
                  <motion.div style={{ y: pulpitY, opacity: pulpitOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                    <motion.div style={{ maskImage: pulpitWireMask, WebkitMaskImage: pulpitWireMask }} className="w-full p-4 md:p-8 pt-8 md:pt-10">
                      {dashboardView('wire')}
                    </motion.div>
                    <motion.div style={{ maskImage: pulpitBlueMask, WebkitMaskImage: pulpitBlueMask }} className="absolute inset-0 w-full p-4 md:p-8 pt-8 md:pt-10" aria-hidden="true">
                      {dashboardView('blue', fx)}
                    </motion.div>
                    <motion.div style={{ maskImage: pulpitBeamMask, WebkitMaskImage: pulpitBeamMask, opacity: pulpitBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-sky-600/50 via-sky-100/90 to-sky-600/50" /></motion.div>
                  </motion.div>

                  {/* EKRAN 2: KLIENCI */}
                  <motion.div style={{ y: klienciY, opacity: klienciOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                    <motion.div style={{ maskImage: klienciWireMask, WebkitMaskImage: klienciWireMask }} className="w-full p-4 md:p-8 pt-8 md:pt-10">
                      {clientsView('wire')}
                    </motion.div>
                    <motion.div style={{ maskImage: klienciBlueMask, WebkitMaskImage: klienciBlueMask }} className="absolute inset-0 w-full p-4 md:p-8 pt-8 md:pt-10" aria-hidden="true">
                      {clientsView('blue')}
                    </motion.div>
                    <motion.div style={{ maskImage: klienciBeamMask, WebkitMaskImage: klienciBeamMask, opacity: klienciBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-sky-600/50 via-sky-100/90 to-sky-600/50" /></motion.div>
                  </motion.div>

                  {/* EKRAN 3: ZADANIA */}
                  <motion.div style={{ y: zadaniaY, opacity: zadaniaOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                    <motion.div style={{ maskImage: zadaniaWireMask, WebkitMaskImage: zadaniaWireMask }} className="w-full p-4 md:p-8 pt-8 md:pt-10">
                      {tasksView('wire')}
                    </motion.div>
                    <motion.div style={{ maskImage: zadaniaBlueMask, WebkitMaskImage: zadaniaBlueMask }} className="absolute inset-0 w-full p-4 md:p-8 pt-8 md:pt-10" aria-hidden="true">
                      {tasksView('blue', fx)}
                    </motion.div>
                    <motion.div style={{ maskImage: zadaniaBeamMask, WebkitMaskImage: zadaniaBeamMask, opacity: zadaniaBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-sky-600/50 via-sky-100/90 to-sky-600/50" /></motion.div>
                  </motion.div>

                  {/* DEMO badge */}
                  <div className="absolute top-20 right-3 md:top-24 md:right-4 z-[45] inline-flex items-center gap-1.5 px-2 py-1 bg-sky-500/10 border border-sky-500/20 rounded text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-sky-300/80 backdrop-blur-sm" aria-hidden="true">
                    <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
                    Makieta · Demo
                  </div>

                  {/* Animowany kursor (klika nawigację) */}
                  <motion.div style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }} className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform">
                    <MousePointer2 size={32} className="text-white fill-sky-500 stroke-[1.5]" />
                  </motion.div>

                  {/* Bottom fog */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-30 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              style={{ opacity: scrollHintOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-sky-500 z-10 pointer-events-none"
            >
              <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby zobaczyć aplikację</span>
              <div className="w-px h-10 bg-gradient-to-b from-sky-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── "MAKIETA = FRAGMENT" - co jeszcze zmieścimy w aplikacji ── */}
        <section className="container mx-auto px-6 relative z-30 pt-16 md:pt-24 pb-4 md:pb-8 bg-[#000000]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-72"
            style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(14,165,233,0.10), transparent 70%)' }}
          />
          <Reveal delay={0.05}>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
                <span className="text-sky-300 text-[11px] font-mono uppercase tracking-[0.22em]">Makieta = fragment</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
                Trzy ekrany to początek<br />
                aplikacja <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-sky-300">rośnie z Tobą</span>.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
                Makieta pokazuje kilka widoków. Twój system dostaje dokładnie te moduły, których potrzebujesz - a to, co widzisz niżej, to dopiero zajawka.
              </p>

              <div
                className="space-y-4 md:space-y-5 mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6"
                aria-hidden="true"
              >
                <div className="overflow-hidden">
                  <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 60s linear infinite reverse' }}>
                    {(() => {
                      const row1 = ['Autentykacja & role (RBAC)', 'Panel administracyjny', 'Strefa klienta B2B', 'Integracje API (REST/GraphQL)', 'Płatności online', 'Powiadomienia e-mail/push', 'Eksport CSV/PDF', 'Dashboard analityczny', 'Automatyzacje AI', 'Multi-tenant'];
                      return [...row1, ...row1].map((label, i) => (
                        <span key={`r1-${i}`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/[0.04] border border-sky-500/15 text-slate-100 text-[13px] md:text-base font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400/70 shrink-0" />{label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 60s linear infinite' }}>
                    {(() => {
                      const row2 = ['Logowanie SSO / OAuth', 'Kalendarz & rezerwacje', 'Wyszukiwarka full-text', 'Czat na żywo', 'Tryb offline (PWA)', 'Audyt logów', 'Webhooki', 'Wersjonowanie danych', 'Import danych', 'Raporty na żądanie'];
                      return [...row2, ...row2].map((label, i) => (
                        <span key={`r2-${i}`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/[0.04] border border-sky-500/15 text-slate-100 text-[13px] md:text-base font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400/70 shrink-0" />{label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-200 text-sm md:text-base font-mono font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" aria-hidden="true" />
                  + cokolwiek wymyślisz
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* --- BENTO GRID --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Technologia dopasowana do biznesu</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Nie sprzedajemy gotowych szablonów. Projektujemy architekturę systemu od zera, automatyzując powtarzalne procesy z pomocą AI i myśląc o Twoich planach na przyszłość.
                </p>
              </div>
            </Reveal>

            {/* Grid 2+1+1+2 (jak one-page) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 (span 2) - React & Next.js */}
              <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-sky-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={RADIAL_RINGS_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <Cpu size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">React & Next.js - stos liderów</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    Twój zespół pracuje w narzędziu, które odpowiada natychmiast - bo stoi na tym samym stosie co Vercel, Airbnb i Discord.
                  </p>
                </div>
                <GlassEdge />
              </motion.div>

              {/* Card 2 (span 1) - Własna baza danych */}
              <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[300px] flex flex-col hover:border-sky-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-bl from-sky-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 text-sky-400 group-hover:rotate-12 transition-transform duration-700 ease-out relative z-10">
                  <Database size={24} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Własna baza danych</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Pełna własność i kontrola nad danymi. Baza zaprojektowana pod Twój proces, którą rozbudowujesz bez limitów i opłat za każdy rekord.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 3 (span 1) - Bezpieczeństwo i role */}
              <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[250px] flex flex-col hover:border-sky-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 text-sky-400 relative z-10">
                  <ShieldCheck size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Bezpieczeństwo i role</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  System uprawnień z rolami użytkowników, szyfrowanie danych i audyt logów. Twoje dane są chronione na każdym poziomie.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 4 (span 2) - Skalowalność + CTA */}
              <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-sky-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={LIQUID_METAL_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Sparkles size={20} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Automatyzacje AI</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Wbudowujemy automatyzacje AI dokładnie tam, gdzie ich potrzebujesz. Powtarzalne procesy dzieją się same, a zespół skupia się na tym, co ważne.
                  </p>
                </div>
                <div className="shrink-0 relative z-20">
                  <Link
                    href="/kontakt"
                    className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 cursor-pointer"
                  >
                    Zacznijmy
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-500" aria-hidden="true" />
                  </Link>
                </div>
                <GlassEdge />
              </motion.div>
            </div>
          </section>
        </div>

        {/* --- ZAKRES PRAC (400vh - wolniejszy, oddychający) --- */}
        <section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
          <div className="sticky top-0 h-dvh w-full flex items-center px-6 py-12 md:py-16">
            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEWA - nagłówek (wyrównany do góry) */}
            <div className="text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-4">
                <CheckCircle2 size={14} /> Zakres prac
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1]">
                Od pomysłu{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-sky-300">
                  do wdrożenia.
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                Narzędzie zbudowane wokół Twoich procesów biznesowych.
              </p>
            </div>

            {/* PRAWA - karty (startują od dołu) */}
            <div className="relative w-full h-[78vh] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
              <motion.div
                style={{ y: scopeCardsY, willChange: 'transform' }}
                className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]"
              >
                {[
                  { title: 'Analiza wymagań', desc: 'Mapujemy procesy biznesowe i przekładamy je na specyfikację techniczną. Wiesz dokładnie, co budujesz.' },
                  { title: 'Projekt UX/UI', desc: 'Klikalne makiety w Figmie. Testujesz przepływy użytkownika, zanim powstanie choć jedna linia kodu.' },
                  { title: 'Interfejs', desc: 'Responsywny, dopracowany interfejs - reaguje natychmiast, bez przeładowań stron.' },
                  { title: 'Logika i dane', desc: 'Bezpieczny silnik, który spina aplikację z Twoimi systemami (ERP, CRM, płatności) i pilnuje dostępu do danych.' },
                  { title: 'Testy i QA', desc: 'Automatyczne testy jednostkowe i integracyjne. Błędy wykrywamy, zanim aplikacja trafi do Twojego zespołu.' },
                  { title: 'Deploy & wsparcie', desc: 'Wdrożenie na szybką, niezawodną infrastrukturę chmurową, CI/CD i stałe wsparcie techniczne.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden p-7 md:p-10 rounded-3xl border border-white/15 bg-[#080808] hover:border-sky-500/30 transition-colors duration-500 flex items-start gap-6"
                  >
                    {/* Static sky glow pod glass */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      aria-hidden="true"
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.05) 40%, transparent 70%)',
                      }}
                    />
                    <div className="absolute bottom-0 right-0 text-[150px] md:text-[180px] font-black text-sky-500/[0.05] group-hover:text-sky-500/[0.08] transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                      0{i + 1}
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)] border border-sky-500/20">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="relative z-10 flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-base">{item.desc}</p>
                    </div>
                    {/* Lightweight glass rim (no backdrop-filter - scroll perf) */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        boxShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            </div>
          </div>
        </section>

        {/* --- CTA CARD --- */}
        <section className="relative w-full py-14 sm:py-20 lg:py-32 bg-[#000000] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-sky-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
          </div>
          <div className="container mx-auto px-5 sm:px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-linear-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-15" aria-hidden="true" />
              <div className="relative rounded-3xl bg-[#080808] border border-white/15 p-6 sm:p-10 md:p-16 text-center overflow-hidden">
                {!shouldReduceMotion && (
                  <div className="absolute inset-0 opacity-60 pointer-events-none" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.55) 70%, rgba(8,8,8,0.75) 100%)',
                  }}
                />
                <GlassEdge />

                <div className="relative z-10">
                  <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6 sm:mb-8 max-w-full"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                    </span>
                    <span className="text-sky-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase truncate">Wolny termin w tym miesiącu</span>
                  </motion.div>

                  <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-[2rem] sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.08] text-balance"
                  >
                    Gotowy na cyfrową{' '}
                    <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-sky-300">
                      Dominację?
                    </span>
                  </motion.h2>

                  <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                  >
                    Zbudujmy system, który zdejmie z Twojego zespołu powtarzalną pracę. Darmowa konsultacja, zero zobowiązań.
                  </motion.p>

                  <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    <Link href="/kontakt"
                      className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-sky-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Bezpłatna konsultacja
                        <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-sky-400 to-sky-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                    </Link>
                    <Link href="/kontakt"
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Napisz do nas
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
                    </Link>
                  </motion.div>

                  <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-2 text-xs md:text-sm text-slate-500"
                  >
                    <span className="text-amber-400 text-base tracking-tight" aria-hidden="true">★★★★★</span>
                    <p>5,0 na Google od naszych klientów.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}
