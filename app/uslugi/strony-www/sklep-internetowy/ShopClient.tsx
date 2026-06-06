'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useReducedMotion, Variants } from 'framer-motion';
import {
  ShoppingCart,
  CreditCard,
  Package,
  Smartphone,
  CheckCircle2,
  BarChart3,
  MousePointer2,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// ═══════════════════════════════════════════════════════════════════════════════
// HERO RAYS - AMBER palette (theme tej podstrony)
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
  // ENERGETIC/COMMERCIAL wariant - szybszy time, tighter sway, więcej layers
  float t = u_time * 0.10;

  // Sun dalej (1.6 vs 1.4 baseline) + tighter sway (0.25 vs 0.35) - narrower angular spread
  vec2 sunPos = vec2(sin(t * 0.14) * 0.25, 1.6);
  vec2 toSun = sunPos - p;
  float distSun = length(toSun);
  float angle = atan(toSun.x, toSun.y);

  // 6 ray layers (vs 5 baseline) - more, denser, sharper rays
  float r1 = pow(max(0.0, sin(angle *  4.0 + t * 0.35)), 1.8);
  float r2 = pow(max(0.0, sin(angle *  5.5 - t * 0.40)), 2.0);
  float r3 = pow(max(0.0, sin(angle *  7.0 + t * 0.45)), 2.3);
  float r4 = pow(max(0.0, sin(angle *  9.0 - t * 0.50)), 2.5);
  float r5 = pow(max(0.0, sin(angle * 12.0 + t * 0.55)), 3.0);
  float r6 = pow(max(0.0, sin(angle * 15.0 - t * 0.60)), 3.5);

  float flick1 = 0.96 + 0.04 * sin(t * 1.5 + angle * 2.2);
  float flick2 = 0.96 + 0.04 * sin(t * 1.9 + angle * 3.7 + 1.5);
  float flick3 = 0.96 + 0.04 * sin(t * 1.3 + angle * 2.9 + 3.2);
  float flick4 = 0.96 + 0.04 * sin(t * 2.1 + angle * 4.3 + 5.0);
  float flick5 = 0.96 + 0.04 * sin(t * 2.5 + angle * 5.5 + 2.1);
  float flick6 = 0.96 + 0.04 * sin(t * 2.9 + angle * 6.7 + 4.5);

  float rays = r1 * 0.55 * flick1 + r2 * 0.50 * flick2 + r3 * 0.45 * flick3
             + r4 * 0.35 * flick4 + r5 * 0.25 * flick5 + r6 * 0.20 * flick6;

  // Szybszy falloff (0.12 vs 0.10) - rays nie sięgają tak daleko, bardziej skoncentrowane u góry
  rays *= exp(-distSun * 0.12);

  float vertFade = smoothstep(1.0 - u_entry, 1.0, uv.y);
  float breath = 0.97 + 0.03 * sin(t * 0.6);
  float raysIntensity = rays * vertFade * 0.55 * breath;

  // AMBER #fbbf24 (amber-400)
  vec3 rayColor = vec3(1.0, 0.71, 0.20);

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
    // Lost context check - force fresh canvas via key change (zob. DedicatedWebsiteClient).
    if (gl.isContextLost()) { setCanvasKey(k => k + 1); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('Rays compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, RAYS_VS);
    const fs = compile(gl.FRAGMENT_SHADER, RAYS_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('Rays link:', gl.getProgramInfoLog(program)); return; }
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

    // Canvas startuje z visibility: hidden - flash-free init (zob. CorporateWebsiteClient).
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
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
      // Hide canvas PRZED loseContext - Chrome renderuje lost-context canvas jako biały.
      canvas.style.visibility = 'hidden';
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" style={{ visibility: 'hidden', background: '#000000' }} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// BENTO SHADERS - AMBER palette
// ═══════════════════════════════════════════════════════════════════════════════

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// CARD 1 - RADIAL PULSE RINGS (amber)
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

  // AMBER #fbbf24
  gl_FragColor = vec4(vec3(1.0, 0.71, 0.20), rings * textDim * (1.0 + edgeBoost * 0.5) * 1.0);
}
`;

// CARDS 2 & 3 - WARP (amber)
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

  // AMBER #fbbf24
  gl_FragColor = vec4(vec3(1.0, 0.71, 0.20), field * edgeBias * textDim * 0.85);
}
`;

// CARD 4 - LIQUID METAL (amber base + bright orange peak chromatic shift)
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

  // AMBER chromatic shift: deep amber → bright orange peak
  vec3 colorBase = vec3(0.55, 0.35, 0.05);   // #8c5908 deep amber
  vec3 colorPeak = vec3(1.0, 0.78, 0.40);    // #ffc766 bright amber-orange
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

const ShaderCanvas = ({ fragmentShader }: { fragmentShader: string }) => {
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
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('Bento compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, SHADER_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error('Bento link:', gl.getProgramInfoLog(program)); return; }
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

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, [fragmentShader]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
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

// Bento card fade-in variants (matches one-page)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};
const vp = { once: true, margin: '-50px' } as const;

// Token tekstu makiety: 'wire' = przezroczysty placeholder na szarym tle (wygląda jak pasek),
// 'blue' = prawdziwy kolorowy tekst. Identyczny element w obu trybach (tekst określa wymiary)
// → reveal pasuje 1:1, a po odsłonięciu pojawia się realny napis zamiast pustego paska.
function Txt({ wire, tone = 'h', cls = '', children }: { wire: boolean; tone?: 'h' | 'p' | 'm' | 'btn' | 'ok'; cls?: string; children: ReactNode }) {
  const blue =
    tone === 'h' ? 'text-white'
    : tone === 'p' ? 'text-amber-400'
    : tone === 'm' ? 'text-slate-400'
    : tone === 'ok' ? 'text-green-400'
    : 'text-black/80'; // btn - na pomarańczowym przycisku
  return <span className={`inline-block leading-tight whitespace-nowrap ${cls} ${wire ? 'text-transparent bg-white/10 rounded' : blue}`}>{children}</span>;
}

export function ShopClient() {
  // a11y reduce motion (shadery włączone na mobile z DPR 1.0, desktop z DPR 1.5/1.25)
  const shouldReduceMotion = useReducedMotion() ?? false;

  const targetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const buttonProductRef = useRef<HTMLDivElement>(null);
  const buttonCartRef = useRef<HTMLDivElement>(null);
  const buttonCheckoutRef = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);

  // Pomiar środka przycisków akcji → kursor klika dokładnie w nie (wzorzec z szyta-na-miare,
  // Sesja 25): pozycje jako % viewportu makiety, rAF + setTimeout(900) + ResizeObserver.
  const [prodPos, setProdPos] = useState({ x: 22, y: 60 });
  const [cartPos, setCartPos] = useState({ x: 82, y: 52 });
  const [checkPos, setCheckPos] = useState({ x: 30, y: 66 });
  const [scroll1Px, setScroll1Px] = useState(300); // px wewnętrznego scrolla sceny 1 (liczony z pomiaru)
  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const vr = vp.getBoundingClientRect();
      if (vr.width < 2 || vr.height < 2) return;
      const center = (ref: React.RefObject<HTMLDivElement | null>) => {
        const el = ref.current;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - vr.left) / vr.width) * 100,
          y: ((r.top + r.height / 2 - vr.top) / vr.height) * 100,
        };
      };
      // Produkt jest w SCROLLUJĄCEJ się pierwszej scenie. Przewijamy o DOKŁADNĄ liczbę PIKSELI
      // (nie %), żeby przycisk "Do koszyka" wylądował na stałej wysokości TARGET - i tam celuje
      // kursor. Px (zamiast %) eliminuje zależność od wysokości treści → trafienie zawsze poprawne.
      const elP = buttonProductRef.current;
      if (elP) {
        const rP = elP.getBoundingClientRect();
        const TARGET = 0.6; // docelowa wysokość przycisku w viewport po scrollu
        const needPx = (rP.top + rP.height / 2 - vr.top) - TARGET * vr.height;
        setScroll1Px(Math.max(0, needPx));
        setProdPos({ x: ((rP.left + rP.width / 2 - vr.left) / vr.width) * 100, y: TARGET * 100 });
      }
      const c = center(buttonCartRef); if (c) setCartPos(c);
      const k = center(buttonCheckoutRef); if (k) setCheckPos(k);
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

  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothMain = useSpring(mainProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });
  const raysOpacity = useTransform(smoothMain, [0.85, 1], [1, 0]);

  const scale = useTransform(smoothMain, [0, 0.03], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.03], [15, 0]);
  const opacity = useTransform(smoothMain, [0, 0.02], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.03, 0.95], ['0%', '100%']);

  // URL transitions
  const urlShopOpacity = useTransform(smoothMain, [0, 0.24, 0.26], [1, 1, 0]);
  const urlCartOpacity = useTransform(smoothMain, [0.24, 0.26, 0.47, 0.49], [0, 1, 1, 0]);
  const urlCheckoutOpacity = useTransform(smoothMain, [0.47, 0.49, 0.72, 0.74], [0, 1, 1, 0]);
  const urlConfirmOpacity = useTransform(smoothMain, [0.72, 0.74, 1], [0, 1, 1]);

  // Phase opacities
  const phase1Opacity = useTransform(smoothMain, [0, 0.24, 0.26, 1], [1, 1, 0, 0]);
  // Wewnętrzny scroll pierwszej sceny (hero → bestsellery → produkty → zaufanie).
  // Dystans liczony tak, by przycisk produktu wylądował dokładnie pod kursorem (scroll1).
  const phase1Y = useTransform(smoothMain, [0.11, 0.16], ['0px', `-${scroll1Px}px`]);
  const phase2Opacity = useTransform(smoothMain, [0, 0.24, 0.26, 0.47, 0.49, 1], [0, 0, 1, 1, 0, 0]);
  const phase3Opacity = useTransform(smoothMain, [0, 0.47, 0.49, 0.72, 0.74, 1], [0, 0, 1, 1, 0, 0]);
  const phase4Opacity = useTransform(smoothMain, [0, 0.755, 0.78, 1], [0, 0, 1, 1]);

  // Checkout card fill
  const cardNumW = useTransform(smoothMain, [0.52, 0.60], ['0%', '100%']);
  const cardExpW = useTransform(smoothMain, [0.60, 0.66], ['0%', '100%']);
  const cardCvvW = useTransform(smoothMain, [0.66, 0.70], ['0%', '100%']);

  // Cart badge
  const cartBadgeScale = useTransform(smoothMain, [0.24, 0.27], [0, 1]);
  const cartBadgeOpacity = useTransform(smoothMain, [0.24, 0.27], [0, 1]);

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]);

  // ── KURSOR (logika 1:1 z poprzednich podstron): 3 cykle pojaw → lot do przycisku →
  //    klik (puls scale) → schowaj. Pozycje X/Y to ZMIERZONE % środka przycisków akcji.
  const cursorOpacity = useTransform(smoothMain,
    [0, 0.125, 0.15, 0.23, 0.24,  0.29, 0.31, 0.43, 0.45,  0.52, 0.54, 0.69, 0.71],
    [0,     0,    1,    1,    0,     0,    1,    1,    0,     0,    1,    1,    0]);
  const cursorX = useTransform(smoothMain,
    [0, 0.15, 0.21, 0.23,  0.29, 0.37, 0.43,  0.52, 0.60, 0.69],
    ['50%', '50%', `${prodPos.x}%`, `${prodPos.x}%`,  '50%', `${cartPos.x}%`, `${cartPos.x}%`,  '50%', `${checkPos.x}%`, `${checkPos.x}%`]);
  const cursorY = useTransform(smoothMain,
    [0, 0.15, 0.21, 0.23,  0.29, 0.37, 0.43,  0.52, 0.60, 0.69],
    ['75%', '75%', `${prodPos.y}%`, `${prodPos.y}%`,  '75%', `${cartPos.y}%`, `${cartPos.y}%`,  '75%', `${checkPos.y}%`, `${checkPos.y}%`]);
  const cursorScale = useTransform(smoothMain,
    [0, 0.21, 0.22, 0.23,  0.39, 0.40, 0.41,  0.64, 0.65, 0.66],
    [1,    1,  0.8,    1,     1,  0.8,    1,     1,  0.8,    1]);

  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });

  // Wolniejszy spring + krótszy zakres + 400vh parent = leniwy pływ
  const smoothScope = useSpring(scopeProgress, {
    stiffness: 55,
    damping: 32,
    restDelta: 0.001,
  });

  const scopeCardsY = useTransform(smoothScope, [0, 1], ['50vh', '-50%']);

  // ═══ PER-PHASE WIREFRAME → BLUEPRINT REVEAL + BEAM ═══════════════════════════
  // Każda z 4 faz ścieżki zakupowej wjeżdża jako szary szkielet (grayscale klon)
  // i odsłania kolor po przekątnej (to top left) ze świetlistym beamem - wzorzec
  // 1:1 z strona-szyta-na-miare / wordpress. Reveal na RAW mainProgress (Lenis
  // już smoothuje); poza oknem reveala maska jest statyczna (zero repaintów).
  const beamGrad = 'absolute inset-0 bg-linear-to-tl from-amber-600/50 via-amber-100/90 to-amber-600/50';

  // FAZA 1 - PRODUKTY (0.04-0.14)
  const p1Reveal = useTransform(mainProgress, [0.04, 0.14], [0, 105]);
  const p1Lead = useTransform(p1Reveal, (v) => v - 3);
  const p1Trail = useTransform(p1Reveal, (v) => v + 3);
  const p1Wire = useMotionTemplate`linear-gradient(to top left, transparent ${p1Lead}%, black ${p1Trail}%)`;
  const p1Blue = useMotionTemplate`linear-gradient(to top left, black ${p1Lead}%, transparent ${p1Trail}%)`;
  const p1B1 = useTransform(p1Reveal, (v) => v - 15);
  const p1B2 = useTransform(p1Reveal, (v) => v - 8);
  const p1B3 = useTransform(p1Reveal, (v) => v - 2.5);
  const p1B4 = useTransform(p1Reveal, (v) => v);
  const p1B5 = useTransform(p1Reveal, (v) => v + 3);
  const p1B6 = useTransform(p1Reveal, (v) => v + 10);
  const p1B7 = useTransform(p1Reveal, (v) => v + 17);
  const p1Beam = useMotionTemplate`linear-gradient(to top left, transparent ${p1B1}%, rgba(0,0,0,0.15) ${p1B2}%, rgba(0,0,0,0.55) ${p1B3}%, rgba(0,0,0,1) ${p1B4}%, rgba(0,0,0,0.55) ${p1B5}%, rgba(0,0,0,0.15) ${p1B6}%, transparent ${p1B7}%)`;
  const p1BeamOp = useTransform(mainProgress, [0.04, 0.045, 0.135, 0.14], [0, 1, 1, 0]);

  // FAZA 2 - KOSZYK (0.27-0.37)
  const p2Reveal = useTransform(mainProgress, [0.27, 0.37], [0, 105]);
  const p2Lead = useTransform(p2Reveal, (v) => v - 3);
  const p2Trail = useTransform(p2Reveal, (v) => v + 3);
  const p2Wire = useMotionTemplate`linear-gradient(to top left, transparent ${p2Lead}%, black ${p2Trail}%)`;
  const p2Blue = useMotionTemplate`linear-gradient(to top left, black ${p2Lead}%, transparent ${p2Trail}%)`;
  const p2B1 = useTransform(p2Reveal, (v) => v - 15);
  const p2B2 = useTransform(p2Reveal, (v) => v - 8);
  const p2B3 = useTransform(p2Reveal, (v) => v - 2.5);
  const p2B4 = useTransform(p2Reveal, (v) => v);
  const p2B5 = useTransform(p2Reveal, (v) => v + 3);
  const p2B6 = useTransform(p2Reveal, (v) => v + 10);
  const p2B7 = useTransform(p2Reveal, (v) => v + 17);
  const p2Beam = useMotionTemplate`linear-gradient(to top left, transparent ${p2B1}%, rgba(0,0,0,0.15) ${p2B2}%, rgba(0,0,0,0.55) ${p2B3}%, rgba(0,0,0,1) ${p2B4}%, rgba(0,0,0,0.55) ${p2B5}%, rgba(0,0,0,0.15) ${p2B6}%, transparent ${p2B7}%)`;
  const p2BeamOp = useTransform(mainProgress, [0.27, 0.275, 0.365, 0.37], [0, 1, 1, 0]);

  // FAZA 3 - CHECKOUT (0.50-0.60)
  const p3Reveal = useTransform(mainProgress, [0.50, 0.60], [0, 105]);
  const p3Lead = useTransform(p3Reveal, (v) => v - 3);
  const p3Trail = useTransform(p3Reveal, (v) => v + 3);
  const p3Wire = useMotionTemplate`linear-gradient(to top left, transparent ${p3Lead}%, black ${p3Trail}%)`;
  const p3Blue = useMotionTemplate`linear-gradient(to top left, black ${p3Lead}%, transparent ${p3Trail}%)`;
  const p3B1 = useTransform(p3Reveal, (v) => v - 15);
  const p3B2 = useTransform(p3Reveal, (v) => v - 8);
  const p3B3 = useTransform(p3Reveal, (v) => v - 2.5);
  const p3B4 = useTransform(p3Reveal, (v) => v);
  const p3B5 = useTransform(p3Reveal, (v) => v + 3);
  const p3B6 = useTransform(p3Reveal, (v) => v + 10);
  const p3B7 = useTransform(p3Reveal, (v) => v + 17);
  const p3Beam = useMotionTemplate`linear-gradient(to top left, transparent ${p3B1}%, rgba(0,0,0,0.15) ${p3B2}%, rgba(0,0,0,0.55) ${p3B3}%, rgba(0,0,0,1) ${p3B4}%, rgba(0,0,0,0.55) ${p3B5}%, rgba(0,0,0,0.15) ${p3B6}%, transparent ${p3B7}%)`;
  const p3BeamOp = useTransform(mainProgress, [0.50, 0.505, 0.595, 0.60], [0, 1, 1, 0]);

  // FAZA 4 - POTWIERDZENIE (0.80-0.90, po loaderze)
  const p4Reveal = useTransform(mainProgress, [0.80, 0.90], [0, 105]);
  const p4Lead = useTransform(p4Reveal, (v) => v - 3);
  const p4Trail = useTransform(p4Reveal, (v) => v + 3);
  const p4Wire = useMotionTemplate`linear-gradient(to top left, transparent ${p4Lead}%, black ${p4Trail}%)`;
  const p4Blue = useMotionTemplate`linear-gradient(to top left, black ${p4Lead}%, transparent ${p4Trail}%)`;
  const p4B1 = useTransform(p4Reveal, (v) => v - 15);
  const p4B2 = useTransform(p4Reveal, (v) => v - 8);
  const p4B3 = useTransform(p4Reveal, (v) => v - 2.5);
  const p4B4 = useTransform(p4Reveal, (v) => v);
  const p4B5 = useTransform(p4Reveal, (v) => v + 3);
  const p4B6 = useTransform(p4Reveal, (v) => v + 10);
  const p4B7 = useTransform(p4Reveal, (v) => v + 17);
  const p4Beam = useMotionTemplate`linear-gradient(to top left, transparent ${p4B1}%, rgba(0,0,0,0.15) ${p4B2}%, rgba(0,0,0,0.55) ${p4B3}%, rgba(0,0,0,1) ${p4B4}%, rgba(0,0,0,0.55) ${p4B5}%, rgba(0,0,0,0.15) ${p4B6}%, transparent ${p4B7}%)`;
  const p4BeamOp = useTransform(mainProgress, [0.80, 0.805, 0.895, 0.90], [0, 1, 1, 0]);

  // Loader "przetwarzanie płatności" przed potwierdzeniem (parytet z szyta-na-miare)
  const loaderOpacity = useTransform(smoothMain, [0, 0.735, 0.745, 0.785, 0.80, 1], [0, 0, 1, 1, 0, 0]);

  // ── Treść faz wyodrębniona do funkcji (renderowana 2×: wireframe + blueprint).
  //    `wire` steruje TYLKO ref-ami kursora → struktura identyczna, reveal pasuje 1:1.
  const phase1Content = (wire: boolean) => (
    <>
      {/* Baner promo */}
      <div className="mx-3 md:mx-8 mt-3 md:mt-5 h-9 md:h-11 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center gap-3">
        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
        <Txt wire={wire} tone="p" cls="text-[11px] md:text-sm font-semibold tracking-wide">Darmowa dostawa od 200 zł • Zwroty 30 dni</Txt>
      </div>

      {/* HERO - jak w prawdziwych sklepach: hasło + CTA + wizual produktu */}
      <div className="mx-3 md:mx-8 mt-3 md:mt-4 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-2 md:gap-3.5 p-5 md:p-9 order-2 md:order-1">
          <span className={`self-start inline-flex items-center px-2.5 py-1 rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-wider ${wire ? 'bg-white/10 text-transparent' : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'}`}>Nowość</span>
          <Txt wire={wire} tone="h" cls="text-xl md:text-4xl font-black leading-[1.05]">Letnia kolekcja 2026</Txt>
          <Txt wire={wire} tone="m" cls="text-[11px] md:text-sm leading-relaxed">Odkryj nowości w niższych cenach - darmowa dostawa już dziś.</Txt>
          <div className="flex items-center gap-2 md:gap-3 mt-1">
            <div className="h-8 md:h-11 px-4 md:px-6 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/30 flex items-center justify-center">
              <Txt wire={wire} tone="btn" cls="text-[10px] md:text-sm font-bold">Kupuj teraz</Txt>
            </div>
            <div className="h-8 md:h-11 px-4 md:px-6 rounded-lg md:rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
              <Txt wire={wire} tone="m" cls="text-[10px] md:text-sm font-semibold">Lookbook</Txt>
            </div>
          </div>
        </div>
        <div className="relative order-1 md:order-2 min-h-[120px] md:min-h-[210px] overflow-hidden">
          <div className={`absolute inset-0 ${wire ? 'bg-white/[0.04]' : 'bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-rose-500/10'}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-24 md:w-32 md:h-40 rounded-2xl ${wire ? 'bg-white/[0.08] border border-white/10' : 'bg-white/10 border border-white/20 shadow-2xl shadow-black/40'}`} />
          </div>
          <div className={`absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center ${wire ? 'bg-white/10' : 'bg-amber-500 shadow-lg shadow-amber-500/40'}`}>
            <Txt wire={wire} tone="btn" cls="text-[9px] md:text-xs font-black">−30%</Txt>
          </div>
        </div>
      </div>

      {/* Sekcja: Bestsellery */}
      <div className="mx-3 md:mx-8 mt-4 md:mt-6 flex items-center justify-between">
        <Txt wire={wire} tone="h" cls="text-sm md:text-xl font-bold">Bestsellery</Txt>
        <Txt wire={wire} tone="p" cls="text-[10px] md:text-xs font-semibold">Zobacz wszystkie →</Txt>
      </div>

      {/* Grid produktów */}
      <div className="mx-3 md:mx-8 mt-3 md:mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
        {[
          { badge: 'SALE', badgeCls: 'bg-amber-500/20 border-amber-500/30 text-amber-400', iconCls: 'bg-amber-500/10 border-amber-500/20', highlighted: true },
          { badge: null,   badgeCls: '', iconCls: 'bg-orange-500/10 border-orange-500/20', highlighted: false },
          { badge: 'NEW',  badgeCls: 'bg-rose-500/20 border-rose-500/30 text-rose-400',    iconCls: 'bg-rose-500/10 border-rose-500/20',  highlighted: false },
          { badge: null,   badgeCls: '', iconCls: 'bg-amber-500/10 border-amber-500/20', highlighted: false },
        ].map((p, i) => (
          <div key={i} className="flex flex-col rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02]">
              {p.badge && (
                <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded border text-[9px] md:text-[10px] font-black ${p.badgeCls}`}>{p.badge}</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl border ${p.iconCls}`} />
              </div>
            </div>
            <div className="p-2.5 md:p-3.5 flex flex-col items-start gap-1.5">
              <Txt wire={wire} tone="h" cls="text-[11px] md:text-sm font-semibold">{`Produkt 0${i + 1}`}</Txt>
              <Txt wire={wire} tone="p" cls="text-[11px] md:text-sm font-bold">{`${[129, 149, 79, 199][i]} zł`}</Txt>
              <div
                ref={!wire && p.highlighted ? buttonProductRef : null}
                className={`w-full h-7 md:h-8 mt-1 rounded-lg md:rounded-xl flex items-center justify-center ${p.highlighted ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/30' : 'bg-white/5 border border-white/5'}`}
              >
                <Txt wire={wire} tone={p.highlighted ? 'btn' : 'm'} cls="text-[10px] md:text-xs font-bold">{p.highlighted ? 'Do koszyka' : 'Zobacz'}</Txt>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ikony zaufania */}
      <div className="mx-3 md:mx-8 mt-4 md:mt-6 grid grid-cols-4 gap-2 md:gap-4">
        {['bg-amber-500/10', 'bg-orange-500/10', 'bg-rose-500/10', 'bg-amber-500/10'].map((cls, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 md:gap-2.5 p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.01] border border-white/5">
            <div className={`w-5 h-5 md:w-9 md:h-9 rounded-full ${cls}`} />
            <Txt wire={wire} tone="m" cls="text-[8px] md:text-[11px] font-medium">{['Wysyłka 24h', 'Zwroty 30 dni', 'Płatność BLIK', 'Wsparcie 7/7'][i]}</Txt>
          </div>
        ))}
      </div>

      <div className="h-2 md:h-3" />
    </>
  );

  const phase2Content = (wire: boolean) => (
    <div className="mx-3 md:mx-8 mt-3 md:mt-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center gap-2">
        <Txt wire={wire} tone="h" cls="text-base md:text-2xl font-bold">Twój koszyk</Txt>
        <div className="w-5 h-4 bg-amber-500/30 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
        {/* Pozycje koszyka */}
        <div className="flex-[1.5] flex flex-col gap-2.5 md:gap-3">
          <div className="flex gap-3 md:gap-4 p-3 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0" />
            <div className="flex-1 flex flex-col items-start gap-1.5">
              <Txt wire={wire} tone="h" cls="text-xs md:text-sm font-semibold">Produkt 01</Txt>
              <Txt wire={wire} tone="p" cls="text-xs md:text-sm font-bold">129 zł</Txt>
              <Txt wire={wire} tone="m" cls="text-[10px] md:text-xs hidden md:inline-block">Rozmiar M • Ilość 1</Txt>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
              <div className="w-4 h-3.5 bg-white/20 rounded" />
              <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 md:h-10 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/5" />
            <div className="w-20 md:w-24 h-9 md:h-10 rounded-lg md:rounded-xl bg-amber-500/10 border border-amber-500/20" />
          </div>
        </div>

        {/* Podsumowanie */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3.5 md:p-5 flex flex-col gap-2.5 md:gap-3">
          <Txt wire={wire} tone="h" cls="self-start text-sm md:text-lg font-bold">Podsumowanie</Txt>
          <div className="border-t border-white/5" />
          <div className="flex justify-between">
            <div className="w-1/3 h-2.5 bg-white/5 rounded" />
            <div className="w-1/4 h-2.5 bg-white/10 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="w-2/5 h-2.5 bg-white/5 rounded" />
            <div className="w-1/5 h-2.5 bg-green-500/30 rounded" />
          </div>
          <div className="border-t border-white/5" />
          <div className="flex justify-between items-center">
            <Txt wire={wire} tone="h" cls="text-sm md:text-base font-bold">Razem</Txt>
            <Txt wire={wire} tone="p" cls="text-sm md:text-base font-bold">129 zł</Txt>
          </div>
          {/* CURSOR TARGET: przejdź do kasy */}
          <div
            ref={wire ? null : buttonCartRef}
            className="w-full h-9 md:h-11 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg md:rounded-xl shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 mt-1"
          >
            <Txt wire={wire} tone="btn" cls="text-xs md:text-sm font-bold">Przejdź do kasy</Txt>
            <div className="w-2.5 h-2.5 rounded-full bg-black/20" />
          </div>
        </div>
      </div>
    </div>
  );

  const phase3Content = (wire: boolean) => (
    <div className="mx-3 md:mx-8 mt-3 md:mt-5 flex flex-col lg:flex-row gap-3 md:gap-4">
      {/* Formularz */}
      <div className="flex-[1.5] flex flex-col gap-2.5 md:gap-3">
        {/* Dostawa */}
        <div className="p-3.5 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl flex flex-col gap-2.5 md:gap-3">
          <Txt wire={wire} tone="h" cls="self-start text-xs md:text-base font-bold">Dostawa</Txt>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
            <div className="h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
            <div className="col-span-2 h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
          </div>
        </div>

        {/* Płatność kartą */}
        <div className="p-3.5 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl flex flex-col gap-2.5 md:gap-3">
          <div className="flex items-center justify-between">
            <Txt wire={wire} tone="h" cls="text-xs md:text-base font-bold">Płatność kartą</Txt>
            <div className="flex gap-1.5">
              <div className="w-7 h-4 bg-white/10 rounded-sm" />
              <div className="w-7 h-4 bg-white/10 rounded-sm" />
            </div>
          </div>
          {/* Numer karty - animacja wpisywania */}
          <div className="relative h-9 md:h-10 bg-white/[0.03] border border-amber-500/25 rounded-lg overflow-hidden flex items-center px-3">
            <motion.div style={{ width: cardNumW }} className="h-2 bg-amber-500/40 rounded absolute left-3" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative h-9 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden flex items-center px-3">
              <motion.div style={{ width: cardExpW }} className="h-2 bg-amber-500/30 rounded absolute left-3" />
            </div>
            <div className="relative h-9 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden flex items-center px-3">
              <motion.div style={{ width: cardCvvW }} className="h-2 bg-amber-500/30 rounded absolute left-3" />
            </div>
          </div>
          {/* CURSOR TARGET: zapłać */}
          <div
            ref={wire ? null : buttonCheckoutRef}
            className="w-full h-9 md:h-11 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg md:rounded-xl shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 mt-0.5"
          >
            <div className="w-3 h-3 rounded-full bg-black/20" />
            <Txt wire={wire} tone="btn" cls="text-xs md:text-sm font-bold">Zapłać 129 zł</Txt>
          </div>
        </div>
      </div>

      {/* Podsumowanie zamówienia */}
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3.5 md:p-5 flex flex-col gap-2.5 self-start">
        <Txt wire={wire} tone="h" cls="self-start text-sm md:text-base font-bold">Twoje zamówienie</Txt>
        <div className="border-t border-white/5" />
        <div className="flex gap-2.5 items-center">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0" />
          <div className="flex-1 flex flex-col items-start">
            <Txt wire={wire} tone="h" cls="text-xs md:text-sm font-semibold mb-1">Produkt 01</Txt>
            <Txt wire={wire} tone="p" cls="text-xs md:text-sm font-bold">129 zł</Txt>
          </div>
        </div>
        <div className="border-t border-white/5" />
        <div className="flex justify-between">
          <div className="w-1/4 h-2.5 bg-white/5 rounded" />
          <div className="w-1/4 h-2.5 bg-white/10 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 h-2.5 bg-white/5 rounded" />
          <div className="w-1/5 h-2.5 bg-green-500/30 rounded" />
        </div>
        <div className="border-t border-white/5" />
        <div className="flex justify-between items-center">
          <Txt wire={wire} tone="h" cls="text-sm md:text-base font-bold">Razem</Txt>
          <Txt wire={wire} tone="p" cls="text-sm md:text-base font-bold">129 zł</Txt>
        </div>
      </div>
    </div>
  );

  const phase4Content = (wire: boolean) => (
    <>
      <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
        <CheckCircle2 size={24} className="text-green-400" />
      </div>
      <Txt wire={wire} tone="h" cls="text-lg md:text-2xl font-bold">Dziękujemy za zakup!</Txt>
      <Txt wire={wire} tone="p" cls="text-xs md:text-sm font-semibold">Zamówienie #2026-0042</Txt>
      <div className="w-full max-w-xs border-t border-white/5" />
      <div className="w-full max-w-xs flex flex-col gap-2">
        {[
          ['Numer zamówienia', '#2026-0042'],
          ['Płatność', 'BLIK'],
          ['Dostawa', 'InPost Paczkomat'],
        ].map(([label, val], i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <Txt wire={wire} tone="m" cls="text-[10px] md:text-xs">{label}</Txt>
            <Txt wire={wire} tone="h" cls="text-[10px] md:text-xs font-semibold">{val}</Txt>
          </div>
        ))}
      </div>
      <div className="w-auto px-5 h-9 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Txt wire={wire} tone="h" cls="text-xs md:text-sm font-semibold">Śledź przesyłkę</Txt>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-amber-500/30 overflow-x-clip">

      {/* TŁO - amber rays fixed during Hero+makieta scroll lock, fade out po makiecie */}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
              <ShoppingCart size={14} /> Headless Commerce / WooCommerce
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Sprzedawaj online <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">
                bez ograniczeń.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Sklep, w którym klient kupuje łatwo, a Ty rośniesz bez limitów. Dobierzemy rozwiązanie dokładnie pod Twój budżet i plany na przyszłość.
            </p>
          </Reveal>
        </section>

        {/* --- BROWSER MOCKUP SCROLL LOCK --- */}
        <section ref={targetRef} className="relative h-[600vh] z-30">
          <div className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">

            {/* Entry animation wrapper - fade-up gdy makieta wchodzi w viewport (one-shot) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
            {/* ZMIANA: Tło modalu z efektem szkła (backdrop-blur, półprzezroczyste bg, wewnętrzny biały border-top) */}
            <motion.div
              style={{ scale, opacity, rotateX, perspective: '1200px' }}
              className="mockup-screen relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#000000]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_-20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden will-change-transform"
            >

              {/* Pasek przeglądarki - ZMIANA na szklisty */}
              <div className="relative h-14 bg-white/[0.03] border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                <div className="flex gap-1.5 md:gap-2 shrink-0">
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/30 rounded-full border border-white/[0.05] flex items-center justify-center px-4 overflow-hidden z-50 shadow-inner max-w-[55%] md:max-w-md">
                  <span className="text-amber-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                  <div className="relative w-32 sm:w-56 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                    <motion.span style={{ opacity: urlShopOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">twoj-sklep.pl</motion.span>
                    <motion.span style={{ opacity: urlCartOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-amber-300">twoj-sklep.pl/koszyk</motion.span>
                    <motion.span style={{ opacity: urlCheckoutOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-orange-300">twoj-sklep.pl/checkout</motion.span>
                    <motion.span style={{ opacity: urlConfirmOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-green-400">twoj-sklep.pl/zamowienie/ok</motion.span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-amber-500 to-orange-500 will-change-transform" />
                </div>
              </div>

              {/* Główny kontener ekranu - delikatnie przepuszcza tło z blur */}
              <div ref={viewportRef} className="inner-screen relative flex-1 bg-[#020202]/50 overflow-hidden flex flex-col">

                {/* ======= WEWNĘTRZNY NAVBAR ======= */}
                <div className="absolute top-0 inset-x-0 h-12 md:h-14 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-10 bg-white/[0.02] backdrop-blur-lg z-40 pointer-events-none">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-amber-400 rounded-sm" />
                    </div>
                    <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:flex gap-5 items-center">
                      <div className="w-14 h-2 bg-amber-400/60 rounded shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                      <div className="w-14 h-2 bg-white/20 rounded" />
                      <div className="w-14 h-2 bg-white/20 rounded" />
                    </div>
                    <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 rounded-xl bg-white/5 border border-white/10">
                      <ShoppingCart size={13} className="text-amber-400" />
                      <span className="text-amber-400 text-[10px] md:text-xs font-bold hidden sm:block">Koszyk</span>
                      <motion.div
                        style={{ scale: cartBadgeScale, opacity: cartBadgeOpacity }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-amber-500 rounded-full flex items-center justify-center text-[9px] font-black text-black"
                      >1</motion.div>
                    </div>
                  </div>
                </div>

                {/* ======= JEDEN UNIWERSALNY KURSOR ======= */}
                <motion.div
                  style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }}
                  className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform"
                >
                  <MousePointer2 size={32} className="text-white fill-amber-500 stroke-[1.5]" />
                </motion.div>

                {/* ======= FAZA 1: PRODUKTY ======= */}
                <motion.div
                  ref={phase1Ref}
                  style={{ y: phase1Y, opacity: phase1Opacity }}
                  className="absolute inset-x-0 top-0 z-10 will-change-transform"
                >
                  <motion.div style={{ maskImage: p1Wire, WebkitMaskImage: p1Wire, filter: 'grayscale(1) brightness(0.8)' }} className="pt-12 md:pt-14 flex flex-col">
                    {phase1Content(true)}
                  </motion.div>
                  <motion.div style={{ maskImage: p1Blue, WebkitMaskImage: p1Blue }} className="absolute inset-0 pt-12 md:pt-14 flex flex-col" aria-hidden="true">
                    {phase1Content(false)}
                  </motion.div>
                  <motion.div style={{ maskImage: p1Beam, WebkitMaskImage: p1Beam, opacity: p1BeamOp }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className={beamGrad} /></motion.div>
                </motion.div>

                {/* ======= FAZA 2: KOSZYK ======= */}
                <motion.div
                  style={{ opacity: phase2Opacity }}
                  className="absolute inset-x-0 top-0 z-10 will-change-[opacity]"
                >
                  <motion.div style={{ maskImage: p2Wire, WebkitMaskImage: p2Wire, filter: 'grayscale(1) brightness(0.8)' }} className="pt-12 md:pt-14 flex flex-col">
                    {phase2Content(true)}
                  </motion.div>
                  <motion.div style={{ maskImage: p2Blue, WebkitMaskImage: p2Blue }} className="absolute inset-0 pt-12 md:pt-14 flex flex-col" aria-hidden="true">
                    {phase2Content(false)}
                  </motion.div>
                  <motion.div style={{ maskImage: p2Beam, WebkitMaskImage: p2Beam, opacity: p2BeamOp }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className={beamGrad} /></motion.div>
                </motion.div>

                {/* ======= FAZA 3: CHECKOUT ======= */}
                <motion.div
                  style={{ opacity: phase3Opacity }}
                  className="absolute inset-x-0 top-0 z-10 will-change-[opacity]"
                >
                  <motion.div style={{ maskImage: p3Wire, WebkitMaskImage: p3Wire, filter: 'grayscale(1) brightness(0.8)' }} className="pt-12 md:pt-14 flex flex-col">
                    {phase3Content(true)}
                  </motion.div>
                  <motion.div style={{ maskImage: p3Blue, WebkitMaskImage: p3Blue }} className="absolute inset-0 pt-12 md:pt-14 flex flex-col" aria-hidden="true">
                    {phase3Content(false)}
                  </motion.div>
                  <motion.div style={{ maskImage: p3Beam, WebkitMaskImage: p3Beam, opacity: p3BeamOp }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className={beamGrad} /></motion.div>
                </motion.div>

                {/* ======= FAZA 4: POTWIERDZENIE ======= */}
                <motion.div
                  style={{ opacity: phase4Opacity }}
                  className="absolute inset-x-0 top-12 md:top-14 bottom-0 z-10"
                >
                  <motion.div style={{ maskImage: p4Wire, WebkitMaskImage: p4Wire, filter: 'grayscale(1) brightness(0.8)' }} className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-3 md:gap-5">
                    {phase4Content(true)}
                  </motion.div>
                  <motion.div style={{ maskImage: p4Blue, WebkitMaskImage: p4Blue }} className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-3 md:gap-5" aria-hidden="true">
                    {phase4Content(false)}
                  </motion.div>
                  <motion.div style={{ maskImage: p4Beam, WebkitMaskImage: p4Beam, opacity: p4BeamOp }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className={beamGrad} /></motion.div>
                </motion.div>

                {/* LOADER - przetwarzanie płatności (przed potwierdzeniem) */}
                <motion.div style={{ opacity: loaderOpacity }} className="absolute inset-0 z-[60] flex items-center justify-center bg-[#020202] will-change-[opacity] pointer-events-none">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-12 md:h-14 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>
            </motion.div>

            <motion.div
              style={{ opacity: scrollIndicatorOpacity }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* --- DWA PODEJŚCIA (marquee, on-brand - 2 rzędy: WooCommerce vs Headless) --- */}
        <section className="container mx-auto px-6 relative z-40 pt-20 md:pt-28 pb-16 md:pb-24 bg-[#000000] border-b border-white/5">
          <Reveal delay={0.05}>
            <div className="relative z-10 max-w-4xl mx-auto text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                <span className="text-amber-300 text-[11px] font-mono uppercase tracking-[0.22em]">Fundament sklepu</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
                Gotowy na{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-300">każdą skalę</span>.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Niezależnie od tego, jak szybko rośniesz, Twój sklep nadąża - ładuje się błyskawicznie i obsługuje każdy ruch.
              </p>
            </div>

            {/* Rząd 1 - Headless (PROMOWANY, jaśniejszy, scroll w lewo) */}
            <div className="relative z-10 mb-12 md:mb-16">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6 md:mb-7">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">Headless E-commerce</h3>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">Rekomendowane</span>
              </div>
              <div className="overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6" aria-hidden="true">
                <div className="flex w-max will-change-transform" style={{ animation: 'scroll 55s linear infinite' }}>
                  {(() => {
                    const head = ['Next.js + Stripe', 'PageSpeed 95-99', 'Sanity Studio', 'Custom UX bez limitów', '5× szybszy frontend', 'Skalowalność', 'Headless API', 'Premium design'];
                    return [...head, ...head].map((label, i) => (
                      <span key={`head-${i}`} className="shrink-0 mr-3 md:mr-4 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-amber-500/[0.10] border border-amber-500/40 text-white text-[13px] md:text-base font-semibold whitespace-nowrap shadow-[0_0_20px_-8px_rgba(245,158,11,0.5)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />{label}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Rząd 2 - WooCommerce (prostsza opcja, neutralna - nie wyszarzona) */}
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-5 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-200 tracking-tight">WooCommerce</h3>
              </div>
              <div className="overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6" aria-hidden="true">
                <div className="flex w-max will-change-transform" style={{ animation: 'scroll 55s linear infinite reverse' }}>
                  {(() => {
                    const woo = ['Panel WP Admin', 'Szybkie wdrożenie 3-4 tyg', 'Setki wtyczek', 'Niższy koszt startu', 'BLIK / karty', 'InPost / DPD', 'Motyw + customizacja', 'Sam edytujesz produkty', 'Integracje z hurtowniami'];
                    return [...woo, ...woo].map((label, i) => (
                      <span key={`woo-${i}`} className="shrink-0 mr-3 md:mr-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 text-[13px] md:text-sm font-medium whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />{label}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* CTA - nie wiesz która? */}
            <div className="relative z-10 flex justify-center mt-14 md:mt-20">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('avenly:open-chat'))}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/15 border border-amber-500/30 text-white text-sm md:text-base font-semibold hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                Nie wiesz która opcja? Zapytaj Avenly AI <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </section>

        {/* --- BENTO GRID --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Sklep, który nie gubi klienta</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Od pierwszego kliknięcia po finalizację usuwamy każdą przeszkodę między klientem a zakupem.
                </p>
              </div>
            </Reveal>

            {/* Grid 2+1+1+2 (jak one-page) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 (span 2) - Płatności bez komplikacji */}
              <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-amber-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={RADIAL_RINGS_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <CreditCard size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Płatność w jedno kliknięcie</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    Twój klient płaci od razu - BLIK, karty, Apple Pay czy Google Pay, bez rejestracji i barier.
                  </p>
                </div>
                <GlassEdge />
              </motion.div>

              {/* Card 2 (span 1) - Automatyczna logistyka */}
              <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[300px] flex flex-col hover:border-amber-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-bl from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400 group-hover:rotate-12 transition-transform duration-700 ease-out relative z-10">
                  <Package size={24} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Automatyczna logistyka</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Wysyłka pod kontrolą - kurierzy (InPost, DPD, DHL) zintegrowani tam, gdzie zarządzasz zamówieniami.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 3 (span 1) - Mobile-first zakupy */}
              <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[250px] flex flex-col hover:border-amber-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400 relative z-10">
                  <Smartphone size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Zakupy na telefonie</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Większość zakupów dzieje się na smartfonie. Zyskujesz ścieżkę dopasowaną pod kciuk - szybką i bezbłędną.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 4 (span 2) - Analityka + CTA */}
              <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-amber-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={LIQUID_METAL_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <BarChart3 size={20} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Wiesz, co podnosi sprzedaż</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Śledzisz porzucone koszyki i odzyskujesz klientów automatycznymi mailami. Więcej danych, mniej strat.
                  </p>
                </div>
                <div className="shrink-0 relative z-20">
                  <Link
                    href="/kontakt"
                    className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 cursor-pointer"
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <CheckCircle2 size={14} /> Zakres prac
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1]">
                Co dokładnie{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400">
                  otrzymujesz?
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                Sklep gotowy do sprzedaży od pierwszego dnia.
              </p>
            </div>

            {/* PRAWA - karty (startują od dołu) */}
            <div className="relative w-full h-[78vh] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
              <motion.div
                style={{ y: scopeCardsY, willChange: 'transform' }}
                className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]"
              >
                {[
                  { title: 'Projekt graficzny sklepu', desc: 'Spójny, markowy wygląd dopasowany do Twojego brandu - karty produktów, strona główna, checkout.' },
                  { title: 'Konfiguracja katalogu', desc: 'Dodawanie produktów, kategorii, atrybutów (rozmiary, kolory), wariantów i zdjęć w wysokiej jakości.' },
                  { title: 'Bramki płatności', desc: 'Pełna integracja Przelewy24 lub Stripe - BLIK, karty, Apple Pay, Google Pay, płatności odroczone.' },
                  { title: 'Integracja kurierów', desc: 'InPost, DPD, DHL i Poczta Polska spięte ze sklepem, gotowe do wysyłki zamówień.' },
                  { title: 'Optymalizacja konwersji', desc: 'Szybki checkout bez rejestracji, cross-sell, porzucone koszyki, promocje i kupony rabatowe.' },
                  { title: 'Wdrożenie i szkolenie', desc: 'Publikacja sklepu, konfiguracja hostingu, SSL i panel administracyjny - prowadzisz sklep samodzielnie.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden p-7 md:p-10 rounded-3xl border border-white/15 bg-[#080808] hover:border-amber-500/30 transition-colors duration-500 flex items-start gap-6"
                  >
                    {/* Static amber glow pod glass */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      aria-hidden="true"
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.05) 40%, transparent 70%)',
                      }}
                    />
                    <div className="absolute bottom-0 right-0 text-[150px] md:text-[180px] font-black text-amber-500/[0.05] group-hover:text-amber-500/[0.08] transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                      0{i + 1}
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] border border-amber-500/20">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="relative z-10 flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-amber-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
          </div>
          <div className="container mx-auto px-5 sm:px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-3xl blur opacity-15" aria-hidden="true" />
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
                    className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 sm:mb-8 max-w-full"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase truncate">Wolny termin w tym miesiącu</span>
                  </motion.div>

                  <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-[2rem] sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.08] text-balance"
                  >
                    Gotowy na cyfrową{' '}
                    <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-300">
                      Dominację?
                    </span>
                  </motion.h2>

                  <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                  >
                    Zbudujmy sklep, który zarabia od pierwszego dnia. Darmowa konsultacja, zero zobowiązań.
                  </motion.p>

                  <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    <Link href="/kontakt"
                      className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Bezpłatna konsultacja
                        <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-orange-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
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

        {/* --- AVENLY AI CTA --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}