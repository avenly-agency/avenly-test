'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll, useTransform, useSpring, useMotionTemplate,
  useInView, useMotionValue, useReducedMotion,
  Variants,
} from 'framer-motion';
import {
  ArrowRight,
  Code2, Target, ArrowUpRight, Search, ShieldCheck,
  CalendarCheck, MousePointer2,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { CorporateDict } from '@/lib/i18n/uslugi/strona-firmowa';

// ═══════════════════════════════════════════════════════════════════════════════
// HERO RAYS SHADER - EMERALD palette (theme color tej podstrony)
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
  // ELEGANT/CALM wariant - wolniejszy time, szersza amplituda sway
  float t = u_time * 0.06;

  // Sun bliżej (1.3 vs 1.4 baseline) + wider sway (0.50 vs 0.35) - wider angular spread
  vec2 sunPos = vec2(sin(t * 0.22) * 0.50, 1.3);
  vec2 toSun = sunPos - p;
  float distSun = length(toSun);
  float angle = atan(toSun.x, toSun.y);

  // 4 ray layers (vs 5 baseline) - fewer, broader rays. Lower freqs + softer powers
  float r1 = pow(max(0.0, sin(angle *  3.0 + t * 0.25)), 1.2);
  float r2 = pow(max(0.0, sin(angle *  5.0 - t * 0.30)), 1.6);
  float r3 = pow(max(0.0, sin(angle *  7.0 + t * 0.40)), 2.0);
  float r4 = pow(max(0.0, sin(angle * 10.0 - t * 0.50)), 2.5);

  float flick1 = 0.96 + 0.04 * sin(t * 1.1 + angle * 1.8);
  float flick2 = 0.96 + 0.04 * sin(t * 1.4 + angle * 3.0 + 1.5);
  float flick3 = 0.96 + 0.04 * sin(t * 0.9 + angle * 2.4 + 3.2);
  float flick4 = 0.96 + 0.04 * sin(t * 1.6 + angle * 3.8 + 5.0);

  float rays = r1 * 0.75 * flick1
             + r2 * 0.60 * flick2
             + r3 * 0.45 * flick3
             + r4 * 0.30 * flick4;

  // Wolniejszy falloff (0.08 vs 0.10) - rays sięgają dalej, "elegancko"
  rays *= exp(-distSun * 0.08);

  float vertFade = smoothstep(1.0 - u_entry, 1.0, uv.y);
  float breath = 0.97 + 0.03 * sin(t * 0.4);
  float raysIntensity = rays * vertFade * 0.55 * breath;

  // EMERALD #34d399 emerald-400
  vec3 rayColor = vec3(0.20, 0.83, 0.60);

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
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Rays shader compile:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, RAYS_VS);
    const fs = compile(gl.FRAGMENT_SHADER, RAYS_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Rays shader link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      // Mobile DPR 1.0, desktop 1.5 - mobile GPU oszczędza ~2× mniej fragment invocations.
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
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

    // Canvas startuje z visibility: hidden żeby uniknąć migotania białym
    // między DOM mount a pierwszą klatką shadera (~50-300ms cold load).
    // Browser composites canvas w "undefined" state przed pierwszym gl.drawArrays -
    // na niektórych GPU/browserach pokazuje białe tło. visibility:hidden eliminuje to.
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
      if (!firstFrameDone) {
        firstFrameDone = true;
        canvas.style.visibility = 'visible';
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    // WebGL context loss handlers - przy szybkiej nawigacji między subpage'ami
    // browser może hit context limit (>16 active contexts) → next created context
    // dostaje "lost" event → canvas pokazuje white. preventDefault pozwala na restore.
    const handleLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const handleRestored = () => { firstFrameDone = false; canvas.style.visibility = 'hidden'; draw(); };
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          draw();
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
      // Hide canvas PRZED loseContext - Chrome renderuje lost-context canvas jako biały.
      canvas.style.visibility = 'hidden';
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [canvasKey]);

  return (
    <canvas
      key={canvasKey}
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{ visibility: 'hidden', background: '#000000' }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BENTO SHADERS - 4 inne shadery (EMERALD palette)
// ═══════════════════════════════════════════════════════════════════════════════

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// CARD 1 - RADIAL PULSE RINGS (emerald)
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

  // EMERALD #34d399
  gl_FragColor = vec4(vec3(0.20, 0.83, 0.60), rings * textDim * (1.0 + edgeBoost * 0.5) * 1.0);
}
`;

// CARDS 2 & 3 - WARP (Paper Design, emerald)
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

  vec2 q;
  q.x = sin(p.x * 2.0 + p.y * 1.5 + t * 0.6);
  q.y = sin(p.x * 1.5 - p.y * 2.0 + t * 0.4 + 1.5);

  vec2 r;
  r.x = sin(p.x * 1.0 + q.y * 2.0 + t * 0.3);
  r.y = sin(p.y * 1.0 + q.x * 2.0 + t * 0.5 + 2.5);

  float field = (sin(r.x * 2.0 + r.y * 1.5 + t * 0.4) * 0.5 + 0.5);
  field += (sin(r.y * 2.5 - r.x * 1.5 + t * 0.3) * 0.5 + 0.5);
  field *= 0.5;

  float edgeBias = smoothstep(0.15, 0.85, length(p));

  vec2 textCenter = vec2(-0.3, 0.3);
  float textDist = length((p - textCenter) * vec2(0.7, 1.2));
  float textDim = smoothstep(0.4, 1.2, textDist);

  // EMERALD #34d399
  gl_FragColor = vec4(vec3(0.20, 0.83, 0.60), field * edgeBias * textDim * 0.85);
}
`;

// CARD 4 - LIQUID METAL (Paper Design, emerald base + teal peak chromatic shift)
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

  vec2 q;
  q.x = sin(p.x * 1.3 + p.y * 1.0 + t * 0.5);
  q.y = sin(p.x * 1.0 - p.y * 1.5 + t * 0.4 + 1.5);

  vec2 r;
  r.x = sin(p.x * 0.8 + q.y * 2.0 + t * 0.6);
  r.y = sin(p.y * 0.8 + q.x * 2.0 + t * 0.4 + 2.0);

  float v = sin(r.x * 3.0 + r.y * 2.0 + t * 0.5);
  float specular = pow(max(0.0, v), 5.0);
  float base = sin(r.x * 2.0 - r.y * 1.5 + t * 0.3) * 0.5 + 0.5;

  // EMERALD-TEAL chromatic shift
  vec3 colorBase = vec3(0.10, 0.55, 0.40);  // deeper emerald
  vec3 colorPeak = vec3(0.40, 0.92, 0.70);  // bright emerald-teal peak
  vec3 finalColor = mix(colorBase, colorPeak, specular);

  float intensity = base * 0.5 + specular * 0.8;

  float falloff = smoothstep(2.5, 0.2, length(p * vec2(0.5, 1.0)));

  vec2 textCenter = vec2(-1.5, 0.0);
  float textDist = length((p - textCenter) * vec2(0.5, 1.4));
  float textDim = smoothstep(0.5, 1.5, textDist);

  float edgeBoost = max(
    smoothstep(0.5, 0.95, p.y),
    smoothstep(0.5, 0.95, -p.y)
  );

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
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Bento shader compile:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, SHADER_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Bento shader link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      // Mobile DPR 1.0, desktop 1.25.
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          draw();
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [fragmentShader]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

// GlassEdge - iOS Liquid Glass ring (identyczne jak na one-page)
const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 rounded-3xl pointer-events-none z-5"
    style={{
      backdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      WebkitBackdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      boxShadow:
        'inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
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

// ─── ANIMATED COUNTER (z Impact.tsx) ─────────────────────────────────────────
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 60 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString();
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

// ─── ANIMATION VARIANTS (jak na homepage) ────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};
const vp = { once: true, margin: '-50px' } as const;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function CorporateWebsiteClient({ t, locale = 'pl' }: { t: CorporateDict; locale?: Locale }) {

  // a11y - respect prefers-reduced-motion
  // Shadery włączone na mobile (DPR 1.0) i desktop (DPR 1.5/1.25) - IO pause + 30fps
  // throttle utrzymują koszt GPU pod kontrolą na obu device'ach.
  const shouldReduceMotion = useReducedMotion() ?? false;

  // ── ANIMACJA 1: MAKIETA PRZEGLĄDARKI (logika niezmieniona) ──────────────────
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  // Snappier spring settle - wyższy stiffness + damping = szybsze settle bez visible "jump" przy końcu wheel scroll.
  // restDelta 0.0005 (zamiast 0.001) - spring settles do mniejszego threshold = mniej widoczny final drift.
  const smoothMain = useSpring(mainProgress, { stiffness: 140, damping: 38, restDelta: 0.0005 });
  const raysOpacity = useTransform(smoothMain, [0.85, 1], [1, 0]);

  const scale       = useTransform(smoothMain, [0, 0.08], [0.85, 1]);
  const rotateX     = useTransform(smoothMain, [0, 0.08], [15, 0]);
  const mockOpacity = useTransform(smoothMain, [0, 0.05], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.08, 0.95], ['0%', '100%']);

  const homeY  = useTransform(smoothMain, [0.08, 0.30], ['0%', '-55%']);
  const aboutY = useTransform(smoothMain, [0.38, 0.60], ['0%', '-55%']);
  const offerY = useTransform(smoothMain, [0.68, 0.90], ['0%', '-55%']);

  const homeOpacity  = useTransform(smoothMain, [0, 0.32, 0.34, 1], [1, 1, 0, 0]);
  const aboutOpacity = useTransform(smoothMain, [0, 0.36, 0.38, 0.62, 0.64, 1], [0, 0, 1, 1, 0, 0]);
  const offerOpacity = useTransform(smoothMain, [0, 0.66, 0.68, 1], [0, 0, 1, 1]);
  const loaderOpacity = useTransform(smoothMain,
    [0, 0.32, 0.34, 0.36, 0.38, 0.62, 0.64, 0.66, 0.68, 1],
    [0,    0,    1,    1,    0,    0,    1,    1,    0,    0]);

  const cursorOpacity = useTransform(smoothMain,
    [0, 0.23, 0.25, 0.35, 0.36, 0.53, 0.55, 0.65, 0.66, 1],
    [0,    0,    1,    1,    0,    0,    1,    1,    0,    0]);
  // Cursor X synced z centrum nav links wireframe: link 1 (O nas) ≈ 82%, link 2 (Oferta) ≈ 88%
  // Cursor Y = 5% (środek nav h-16 w viewport mockup ~88vh)
  const cursorX = useTransform(smoothMain,
    [0, 0.23, 0.28, 0.31, 0.36, 0.53, 0.58, 0.61, 1],
    ['50%','50%','68%','82%','82%','50%','72%','88%','88%']);
  const cursorY = useTransform(smoothMain,
    [0, 0.23, 0.28, 0.31, 0.36, 0.53, 0.58, 0.61, 1],
    ['70%','70%','25%','3.8%','3.8%','80%','35%','3.8%','3.8%']);
  const cursorScale = useTransform(smoothMain,
    [0, 0.30, 0.31, 0.32, 0.34, 0.60, 0.61, 0.62, 1],
    [1,    1,  0.8,    1,    1,    1,  0.8,    1,    1]);

  const link0Active   = useTransform(smoothMain, [0, 0.34, 0.35, 1], [1, 1, 0, 0]);
  const link0Inactive = useTransform(smoothMain, [0, 0.34, 0.35, 1], [0, 0, 1, 1]);
  const link1Active   = useTransform(smoothMain, [0, 0.34, 0.35, 0.64, 0.65, 1], [0, 0, 1, 1, 0, 0]);
  const link1Inactive = useTransform(smoothMain, [0, 0.34, 0.35, 0.64, 0.65, 1], [1, 1, 0, 0, 1, 1]);
  const link2Active   = useTransform(smoothMain, [0, 0.64, 0.65, 1], [0, 0, 1, 1]);
  const link2Inactive = useTransform(smoothMain, [0, 0.64, 0.65, 1], [1, 1, 0, 0]);

  // ── PER-PAGE REVEAL (wireframe → blueprint diagonal BR→TL) ──────────────────
  // Każda podstrona ma własny moment reveal - zsynchronizowany z page transition.
  // HOME reveal: 0.005-0.10, O NAS reveal: 0.38-0.46, OFERTA reveal: 0.68-0.76.
  // Po reveal, blueprint stable do końca tej page'a stage.
  //
  // KLUCZOWE: reveal i beam używają RAW mainProgress (BEZ spring), nie smoothMain.
  // Powód: Lenis już smoothuje raw scroll (`duration: 1.2`), dodanie useSpring na to
  // tworzy podwójne smoothing → spring overshoot/settle pod koniec scroll wheel ticka
  // → visible "jump"/"snap" na końcu reveal. Reveal mask powinien trackować scroll
  // **exact** żeby być pixel-perfect, bez dodatkowej fizyki. Layout transforms (scale,
  // y, opacity) ZOSTAJĄ na smoothMain bo lubią lekki spring lag dla cinematic feel.

  // HOME
  const homeReveal   = useTransform(mainProgress, [0.005, 0.10], [0, 105]);
  const homeLeading  = useTransform(homeReveal, (v) => v - 3);
  const homeTrailing = useTransform(homeReveal, (v) => v + 3);
  const homeBlueprintMask = useMotionTemplate`linear-gradient(to top left, black ${homeLeading}%, transparent ${homeTrailing}%)`;
  const homeWireframeMask = useMotionTemplate`linear-gradient(to top left, transparent ${homeLeading}%, black ${homeTrailing}%)`;
  const homeBeamS1 = useTransform(homeReveal, (v) => v - 15);
  const homeBeamS2 = useTransform(homeReveal, (v) => v - 8);
  const homeBeamS3 = useTransform(homeReveal, (v) => v - 2.5);
  const homeBeamS4 = useTransform(homeReveal, (v) => v);
  const homeBeamS5 = useTransform(homeReveal, (v) => v + 3);
  const homeBeamS6 = useTransform(homeReveal, (v) => v + 10);
  const homeBeamS7 = useTransform(homeReveal, (v) => v + 17);
  const homeBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${homeBeamS1}%, rgba(0,0,0,0.15) ${homeBeamS2}%, rgba(0,0,0,0.55) ${homeBeamS3}%, rgba(0,0,0,1) ${homeBeamS4}%, rgba(0,0,0,0.55) ${homeBeamS5}%, rgba(0,0,0,0.15) ${homeBeamS6}%, transparent ${homeBeamS7}%)`;
  const homeBeamOpacity = useTransform(mainProgress, [0, 0.005, 0.095, 0.10], [0, 1, 1, 0]);

  // O NAS
  const aboutReveal   = useTransform(mainProgress, [0.38, 0.46], [0, 105]);
  const aboutLeading  = useTransform(aboutReveal, (v) => v - 3);
  const aboutTrailing = useTransform(aboutReveal, (v) => v + 3);
  const aboutBlueprintMask = useMotionTemplate`linear-gradient(to top left, black ${aboutLeading}%, transparent ${aboutTrailing}%)`;
  const aboutWireframeMask = useMotionTemplate`linear-gradient(to top left, transparent ${aboutLeading}%, black ${aboutTrailing}%)`;
  const aboutBeamS1 = useTransform(aboutReveal, (v) => v - 15);
  const aboutBeamS2 = useTransform(aboutReveal, (v) => v - 8);
  const aboutBeamS3 = useTransform(aboutReveal, (v) => v - 2.5);
  const aboutBeamS4 = useTransform(aboutReveal, (v) => v);
  const aboutBeamS5 = useTransform(aboutReveal, (v) => v + 3);
  const aboutBeamS6 = useTransform(aboutReveal, (v) => v + 10);
  const aboutBeamS7 = useTransform(aboutReveal, (v) => v + 17);
  const aboutBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${aboutBeamS1}%, rgba(0,0,0,0.15) ${aboutBeamS2}%, rgba(0,0,0,0.55) ${aboutBeamS3}%, rgba(0,0,0,1) ${aboutBeamS4}%, rgba(0,0,0,0.55) ${aboutBeamS5}%, rgba(0,0,0,0.15) ${aboutBeamS6}%, transparent ${aboutBeamS7}%)`;
  const aboutBeamOpacity = useTransform(mainProgress, [0.38, 0.385, 0.455, 0.46], [0, 1, 1, 0]);

  // OFERTA
  const offerReveal   = useTransform(mainProgress, [0.68, 0.76], [0, 105]);
  const offerLeading  = useTransform(offerReveal, (v) => v - 3);
  const offerTrailing = useTransform(offerReveal, (v) => v + 3);
  const offerBlueprintMask = useMotionTemplate`linear-gradient(to top left, black ${offerLeading}%, transparent ${offerTrailing}%)`;
  const offerWireframeMask = useMotionTemplate`linear-gradient(to top left, transparent ${offerLeading}%, black ${offerTrailing}%)`;
  const offerBeamS1 = useTransform(offerReveal, (v) => v - 15);
  const offerBeamS2 = useTransform(offerReveal, (v) => v - 8);
  const offerBeamS3 = useTransform(offerReveal, (v) => v - 2.5);
  const offerBeamS4 = useTransform(offerReveal, (v) => v);
  const offerBeamS5 = useTransform(offerReveal, (v) => v + 3);
  const offerBeamS6 = useTransform(offerReveal, (v) => v + 10);
  const offerBeamS7 = useTransform(offerReveal, (v) => v + 17);
  const offerBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${offerBeamS1}%, rgba(0,0,0,0.15) ${offerBeamS2}%, rgba(0,0,0,0.55) ${offerBeamS3}%, rgba(0,0,0,1) ${offerBeamS4}%, rgba(0,0,0,0.55) ${offerBeamS5}%, rgba(0,0,0,0.15) ${offerBeamS6}%, transparent ${offerBeamS7}%)`;
  const offerBeamOpacity = useTransform(mainProgress, [0.68, 0.685, 0.755, 0.76], [0, 1, 1, 0]);

  // ── ANIMACJA 2: ZAKRES PRAC ────────────────────────────────────────────────
  // Wolniejszy spring + krótszy zakres transform + 400vh parent = leniwy pływ,
  // ostatnia karta nadal widoczna gdy scroll się kończy (vs schowana w -75%).
  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({ target: scopeRef, offset: ['start start', 'end end'] });
  const smoothScope = useSpring(scopeProgress, { stiffness: 55, damping: 32, restDelta: 0.001 });
  const scopeCardsY = useTransform(smoothScope, [0, 1], ['50vh', '-50%']);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-emerald-500/30 overflow-x-clip">

      {/* TŁO - rays fixed during Hero+makieta scroll lock, fade out po makiecie */}
      <motion.div
        style={{ opacity: raysOpacity }}
        className="fixed top-0 left-0 right-0 h-screen z-0 pointer-events-none overflow-hidden bg-[#000000]"
      >
        <RaysBackground />
      </motion.div>

      <main className="relative z-10">

        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Code2 size={14} /> {t.heroBadge}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              {t.heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                {t.heroTitleAccent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              {t.heroLead}
            </p>
          </Reveal>
        </section>

        {/* ── ANIMACJA 1: MAKIETA PRZEGLĄDARKI (700vh) ─────────────────────── */}
        {/* Cała logika scroll transform zachowana identycznie */}
        <section ref={targetRef} style={{ height: '700vh' }} className="relative z-30">
          <div className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden px-3 md:px-6">

            {/* Entry animation wrapper - fade-up gdy makieta wchodzi w viewport (one-shot) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
            <motion.div
              style={{ scale, opacity: mockOpacity, rotateX, perspective: '1200px' }}
              className="relative w-full max-w-[88rem] h-[78vh] md:h-[88vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden will-change-transform"
            >
              {/* Browser toolbar */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                <div className="flex gap-1.5 md:gap-2 shrink-0">
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>

                {/* URL bar */}
                <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/50 rounded-full border border-white/15 flex items-center px-3 md:px-4 overflow-hidden z-50 shadow-inner max-w-[50%] md:max-w-md">
                  <span className="text-emerald-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                  <div className="relative w-28 sm:w-48 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                    <motion.span style={{ opacity: homeOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">{t.urlHome}</motion.span>
                    <motion.span style={{ opacity: aboutOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">{t.urlAbout}</motion.span>
                    <motion.span style={{ opacity: offerOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-emerald-300">{t.urlOffer}</motion.span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 will-change-transform" />
                </div>
              </div>

              {/* Viewport */}
              <div className="relative flex-1 bg-[#020202] overflow-hidden">

                {/* Fixed nav inside mockup */}
                <div className="absolute top-0 inset-x-0 h-16 border-b border-white/5 bg-[#000000]/80 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-12 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                    </div>
                    <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                  </div>
                  <div className="flex gap-4 sm:gap-8 items-center pt-1">
                    {[link0Active, link1Active, link2Active].map((active, i) => {
                      const inactive = [link0Inactive, link1Inactive, link2Inactive][i];
                      return (
                        <div key={i} className="relative w-8 sm:w-12 h-2 will-change-opacity">
                          <motion.div style={{ opacity: inactive }} className="absolute inset-0 rounded bg-white/20" />
                          <motion.div style={{ opacity: active }} className="absolute inset-0 rounded bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        </div>
                      );
                    })}
                    <div className="w-16 h-8 rounded-md bg-white/10 -mt-1 hidden lg:block" />
                  </div>
                </div>

                {/* PAGE 1: HOME - dual-layer wireframe → blueprint diagonal reveal (entry only)
                    Wireframe = current placeholders. Blueprint = real-feeling text overlay.
                    Mask sweep BR→TL podczas mainProgress 0.005→0.10 (entry zone makiety). */}
                <motion.div style={{ y: homeY, opacity: homeOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">

                  {/* WIREFRAME LAYER - REAL TYPOGRAPHY z text-transparent + bg-white/X overlay (jak one-page) */}
                  <motion.div
                    style={{ maskImage: homeWireframeMask, WebkitMaskImage: homeWireframeMask }}
                    className="w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-24"
                  >
                    {/* HERO - real typography z transparent text + gray bg per linia */}
                    <div className="w-full flex flex-col items-center text-center mt-8 max-w-5xl mx-auto">
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                        <span className="inline-block text-transparent bg-white/10 rounded-2xl leading-[1.1]">{t.homeHeadingLine1}</span>
                        <br />
                        <span className="inline-block text-transparent bg-white/10 rounded-2xl leading-[1.1] mt-1.5">{t.homeHeadingLine2}</span>
                      </h2>
                      <p className="text-sm md:text-base max-w-2xl mb-6 leading-relaxed">
                        <span className="inline-block text-transparent bg-white/5 rounded-md">{t.homeLead1}</span>
                      </p>
                      <p className="text-sm md:text-base max-w-xl mb-12 leading-relaxed">
                        <span className="inline-block text-transparent bg-white/5 rounded-md">{t.homeLead2}</span>
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <div className="px-7 py-3.5 rounded-xl bg-emerald-500/30 border border-emerald-500/40 text-transparent font-bold text-sm md:text-base">{t.homeCtaPrimary}</div>
                        <div className="px-7 py-3.5 rounded-xl border border-white/15 text-transparent font-bold text-sm md:text-base">{t.homeCtaSecondary}</div>
                      </div>
                    </div>

                    {/* FEATURED SERVICES */}
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-4 px-2">
                      <h3 className="text-center mb-4 text-xl md:text-2xl font-bold">
                        <span className="inline-block text-transparent bg-white/10 rounded-md">{t.homeServicesHeading}</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="aspect-square bg-white/[0.02] border border-white/15 rounded-3xl p-6 flex flex-col justify-end">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 mb-auto border border-emerald-500/20" />
                            <div className="text-base font-bold mb-2">
                              <span className="inline-block text-transparent bg-white/10 rounded">{t.homeServiceWireframe}</span>
                            </div>
                            <div className="text-xs md:text-sm leading-relaxed">
                              <span className="inline-block text-transparent bg-white/5 rounded">{t.homeServiceDesc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HERO BLOCK */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto mt-4 px-2">
                      <div className="md:col-span-8 aspect-[2/1] bg-white/[0.02] border border-white/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                        <div className="self-start text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md bg-emerald-500/20">
                          <span className="inline-block text-transparent bg-emerald-500/30 rounded">{t.homePromoBadge}</span>
                        </div>
                        <div>
                          <div className="text-base md:text-xl font-bold mb-2 md:mb-3">
                            <span className="inline-block text-transparent bg-white/10 rounded">{t.homePromoHeading}</span>
                          </div>
                          <div className="text-xs md:text-sm leading-relaxed">
                            <span className="inline-block text-transparent bg-white/5 rounded">{t.homePromoDesc}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-4 bg-white/[0.02] border border-white/15 rounded-3xl p-6 items-center justify-center hidden sm:flex">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] md:border-[8px] border-emerald-500/20 border-t-emerald-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* BLUEPRINT LAYER - 1:1 mirror wireframe JSX (te same wrappery, te same
                      <span inline-block>), różnica tylko w kolorze tekstu i bg. */}
                  <motion.div
                    style={{ maskImage: homeBlueprintMask, WebkitMaskImage: homeBlueprintMask }}
                    className="absolute inset-0 w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-24"
                    aria-hidden="true"
                  >
                    {/* HERO - real visible text */}
                    <div className="w-full flex flex-col items-center text-center mt-8 max-w-5xl mx-auto">
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
                        <span className="inline-block text-white leading-[1.1]">{t.homeHeadingLine1}</span>
                        <br />
                        <span className="inline-block text-emerald-300 leading-[1.1] mt-1.5">{t.homeHeadingLine2}</span>
                      </h2>
                      <p className="text-sm md:text-base max-w-2xl mb-6 leading-relaxed">
                        <span className="inline-block text-slate-300">{t.homeLead1}</span>
                      </p>
                      <p className="text-sm md:text-base max-w-xl mb-12 leading-relaxed">
                        <span className="inline-block text-slate-400">{t.homeLead2}</span>
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <div className="px-7 py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm md:text-base">{t.homeCtaPrimary}</div>
                        <div className="px-7 py-3.5 rounded-xl border border-white/15 text-white font-bold text-sm md:text-base">{t.homeCtaSecondary}</div>
                      </div>
                    </div>

                    {/* FEATURED SERVICES */}
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-4 px-2">
                      <h3 className="text-center mb-4 text-xl md:text-2xl font-bold">
                        <span className="inline-block text-white">{t.homeServicesHeading}</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {t.homeServiceCards.map((title, i) => (
                          <div key={i} className="aspect-square bg-white/[0.02] border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-end">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/30 mb-auto border border-emerald-500/40" />
                            <div className="text-base font-bold mb-2">
                              <span className="inline-block text-white">{title}</span>
                            </div>
                            <div className="text-xs md:text-sm leading-relaxed">
                              <span className="inline-block text-slate-400">{t.homeServiceDesc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HERO BLOCK */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto mt-4 px-2">
                      <div className="md:col-span-8 aspect-[2/1] bg-white/[0.02] border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                        <div className="self-start text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md bg-emerald-500/20">
                          <span className="inline-block text-emerald-300">{t.homePromoBadge}</span>
                        </div>
                        <div>
                          <div className="text-base md:text-xl font-bold mb-2 md:mb-3">
                            <span className="inline-block text-white">{t.homePromoHeading}</span>
                          </div>
                          <div className="text-xs md:text-sm leading-relaxed">
                            <span className="inline-block text-slate-400">{t.homePromoDesc}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-4 bg-white/[0.02] border border-emerald-500/30 rounded-3xl p-6 items-center justify-center hidden sm:flex">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] md:border-[8px] border-emerald-500/30 border-t-emerald-400" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* LOADER */}
                <motion.div style={{ opacity: loaderOpacity }} className="absolute top-16 inset-x-0 bottom-0 z-20 flex items-center justify-center bg-[#020202] will-change-opacity">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                </motion.div>

                {/* PAGE 2: O NAS - dual-layer wireframe → blueprint reveal */}
                <motion.div style={{ y: aboutY, opacity: aboutOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">

                  {/* WIREFRAME LAYER - real typography z transparent text + bg overlay */}
                  <motion.div
                    style={{ maskImage: aboutWireframeMask, WebkitMaskImage: aboutWireframeMask }}
                    className="w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-20"
                  >
                    {/* HEADER */}
                    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 border-b border-white/10 pb-12 mt-8 max-w-5xl mx-auto">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-400/50 blur-xl" />
                      </div>
                      <div className="flex-1 flex flex-col gap-4 w-full">
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                          <span className="inline-block text-transparent bg-white/10 rounded-lg">{t.aboutHeading}</span>
                        </h2>
                        <p className="text-sm md:text-base max-w-md leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded-md">{t.aboutLead1}</span>
                        </p>
                        <p className="text-sm md:text-base max-w-sm leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded-md">{t.aboutLead2}</span>
                        </p>
                      </div>
                    </div>
                    {/* TEAM 4 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col gap-3 md:gap-4">
                          <div className="w-full aspect-square bg-white/[0.03] rounded-2xl border border-white/15" />
                          <div className="text-sm md:text-base font-bold">
                            <span className="inline-block text-transparent bg-white/10 rounded">{t.aboutTeamName}</span>
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className="inline-block text-transparent bg-white/5 rounded">{t.aboutTeamRole}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* STATS 3× */}
                    <div className="w-full max-w-5xl mx-auto flex gap-4 md:gap-8 justify-center border-y border-white/5 py-8 md:py-12">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 flex flex-col items-center text-center gap-2 md:gap-4">
                          <div className="text-2xl md:text-4xl font-bold">
                            <span className="inline-block text-transparent bg-emerald-500/30 rounded-lg">{t.aboutStatWireframeNum}</span>
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className="inline-block text-transparent bg-white/10 rounded">{t.aboutStatWireframeLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* IMAGE + TEXT + CTA */}
                    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                      <div className="w-full md:w-1/2 aspect-video bg-white/[0.02] border border-white/15 rounded-3xl" />
                      <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-4">
                        <h3 className="text-lg md:text-2xl font-bold mb-2">
                          <span className="inline-block text-transparent bg-white/10 rounded">{t.aboutSectionHeading}</span>
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded">{t.aboutSectionLead1}</span>
                        </p>
                        <p className="text-sm md:text-base leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded">{t.aboutSectionLead2}</span>
                        </p>
                        <div className="self-start mt-4 px-6 py-3 rounded-xl bg-emerald-500/30 border border-emerald-500/40 text-transparent font-bold text-sm">{t.aboutSectionCta}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* BLUEPRINT LAYER - 1:1 mirror wireframe JSX (te same wrappery, te same
                      <span inline-block>), różnica tylko w kolorze tekstu i bg. */}
                  <motion.div
                    style={{ maskImage: aboutBlueprintMask, WebkitMaskImage: aboutBlueprintMask }}
                    className="absolute inset-0 w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-20"
                    aria-hidden="true"
                  >
                    {/* HEADER */}
                    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 border-b border-white/10 pb-12 mt-8 max-w-5xl mx-auto">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40">
                        <span className="text-2xl md:text-3xl font-bold text-emerald-300">{t.aboutLogoLabel}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-4 w-full">
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                          <span className="inline-block text-white">{t.aboutHeading}</span>
                        </h2>
                        <p className="text-sm md:text-base max-w-md leading-relaxed">
                          <span className="inline-block text-slate-300">{t.aboutLead1}</span>
                        </p>
                        <p className="text-sm md:text-base max-w-sm leading-relaxed">
                          <span className="inline-block text-slate-400">{t.aboutLead2}</span>
                        </p>
                      </div>
                    </div>
                    {/* TEAM 4 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col gap-3 md:gap-4">
                          <div className="w-full aspect-square bg-white/[0.03] rounded-2xl border border-emerald-500/30 flex items-center justify-center">
                            <span className="text-base md:text-xl font-bold text-emerald-300">{t.aboutFotoLabel} {i}</span>
                          </div>
                          <div className="text-sm md:text-base font-bold">
                            <span className="inline-block text-white">{t.aboutTeamName}</span>
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className="inline-block text-slate-400">{t.aboutTeamRole}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* STATS 3× */}
                    <div className="w-full max-w-5xl mx-auto flex gap-4 md:gap-8 justify-center border-y border-white/5 py-8 md:py-12">
                      {t.aboutStats.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center text-center gap-2 md:gap-4">
                          <div className="text-2xl md:text-4xl font-bold">
                            <span className="inline-block text-emerald-300">{s.num}</span>
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className="inline-block text-slate-400">{s.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* IMAGE + TEXT + CTA */}
                    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                      <div className="w-full md:w-1/2 aspect-video bg-white/[0.02] border border-emerald-500/30 rounded-3xl flex items-center justify-center">
                        <span className="text-base md:text-xl font-bold text-emerald-300">{t.aboutImageLabel}</span>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-4">
                        <h3 className="text-lg md:text-2xl font-bold mb-2">
                          <span className="inline-block text-white">{t.aboutSectionHeading}</span>
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed">
                          <span className="inline-block text-slate-300">{t.aboutSectionLead1}</span>
                        </p>
                        <p className="text-sm md:text-base leading-relaxed">
                          <span className="inline-block text-slate-400">{t.aboutSectionLead2}</span>
                        </p>
                        <div className="self-start mt-4 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm">{t.aboutSectionCta}</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* PAGE 3: OFERTA - dual-layer wireframe → blueprint reveal */}
                <motion.div style={{ y: offerY, opacity: offerOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">

                  {/* WIREFRAME LAYER - real typography z transparent text + bg overlay */}
                  <motion.div
                    style={{ maskImage: offerWireframeMask, WebkitMaskImage: offerWireframeMask }}
                    className="w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-16"
                  >
                    <div className="w-full max-w-5xl mx-auto mt-8">
                      {/* HERO CARD */}
                      <div className="w-full h-40 md:h-64 bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 border border-emerald-500/20 rounded-[2rem] flex flex-col justify-center px-6 md:px-12 mb-8 md:mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-emerald-400/20 blur-[80px]" />
                        <h2 className="text-xl md:text-3xl font-bold mb-4 relative z-10">
                          <span className="inline-block text-transparent bg-white/10 rounded-lg">{t.offerHeading}</span>
                        </h2>
                        <p className="text-sm md:text-base max-w-lg mb-2 relative z-10 leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded-md">{t.offerLead1}</span>
                        </p>
                        <p className="text-sm md:text-base max-w-md relative z-10 leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded-md">{t.offerLead2}</span>
                        </p>
                      </div>
                      {/* 3 SERVICE CARDS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`p-6 md:p-8 rounded-3xl border flex flex-col gap-4 md:gap-6 ${i === 2 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${i === 2 ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-white/5'}`} />
                            <div className="text-base md:text-lg font-bold">
                              <span className="inline-block text-transparent bg-white/10 rounded">{t.offerPackageName}</span>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-transparent bg-white/5 rounded">{t.offerFeature1}</span>
                              </div>
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-transparent bg-white/5 rounded">{t.offerFeature2}</span>
                              </div>
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-transparent bg-white/5 rounded">{t.offerFeature3}</span>
                              </div>
                            </div>
                            <div className={`mt-4 px-5 py-3 rounded-xl text-transparent font-bold text-sm text-center ${i === 2 ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-white/10'}`}>{t.offerPackageCta}</div>
                          </div>
                        ))}
                      </div>
                      {/* LIST 4 ITEMS */}
                      <div className="w-full mt-12 md:mt-24">
                        <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-8">
                          <span className="inline-block text-transparent bg-white/10 rounded">{t.offerListHeading}</span>
                        </h3>
                        <div className="flex flex-col gap-3 md:gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full bg-white/[0.02] border border-white/15 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 shrink-0" />
                              <div className="flex-1 flex flex-col gap-2">
                                <div className="text-sm md:text-base font-bold">
                                  <span className="inline-block text-transparent bg-white/10 rounded">{t.offerListItemName}</span>
                                </div>
                                <div className="text-xs leading-relaxed">
                                  <span className="inline-block text-transparent bg-white/5 rounded">{t.offerListItemDesc}</span>
                                </div>
                              </div>
                              <div className="hidden sm:block px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-transparent font-bold text-xs">{t.offerListItemCta}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* BLUEPRINT LAYER - 1:1 mirror wireframe JSX (te same wrappery, te same
                      <span inline-block>), różnica tylko w kolorze tekstu i bg. */}
                  <motion.div
                    style={{ maskImage: offerBlueprintMask, WebkitMaskImage: offerBlueprintMask }}
                    className="absolute inset-0 w-full p-4 md:p-16 pt-12 md:pt-24 flex flex-col gap-12 md:gap-16"
                    aria-hidden="true"
                  >
                    <div className="w-full max-w-5xl mx-auto mt-8">
                      {/* HERO CARD */}
                      <div className="w-full h-40 md:h-64 bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 border border-emerald-500/30 rounded-[2rem] flex flex-col justify-center px-6 md:px-12 mb-8 md:mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-emerald-400/20 blur-[80px]" />
                        <h2 className="text-xl md:text-3xl font-bold mb-4 relative z-10">
                          <span className="inline-block text-white">{t.offerHeading}</span>
                        </h2>
                        <p className="text-sm md:text-base max-w-lg mb-2 relative z-10 leading-relaxed">
                          <span className="inline-block text-slate-300">{t.offerLead1}</span>
                        </p>
                        <p className="text-sm md:text-base max-w-md relative z-10 leading-relaxed">
                          <span className="inline-block text-slate-400">{t.offerLead2}</span>
                        </p>
                      </div>
                      {/* 3 SERVICE CARDS - wireframe ma identyczne treści dla wszystkich 3 kart, więc tu też. */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`p-6 md:p-8 rounded-3xl border flex flex-col gap-4 md:gap-6 ${i === 2 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/15'}`}>
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${i === 2 ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-white/5'}`} />
                            <div className="text-base md:text-lg font-bold">
                              <span className="inline-block text-white">{t.offerPackageName}</span>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-slate-400">{t.offerFeature1}</span>
                              </div>
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-slate-400">{t.offerFeature2}</span>
                              </div>
                              <div className="text-xs leading-relaxed">
                                <span className="inline-block text-slate-400">{t.offerFeature3}</span>
                              </div>
                            </div>
                            <div className={`mt-4 px-5 py-3 rounded-xl text-white font-bold text-sm text-center ${i === 2 ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-white/10'}`}>{t.offerPackageCta}</div>
                          </div>
                        ))}
                      </div>
                      {/* LIST 4 ITEMS - same wireframe ma "Nazwa usługi" × 4, więc tu też dla parity. */}
                      <div className="w-full mt-12 md:mt-24">
                        <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-8">
                          <span className="inline-block text-white">{t.offerListHeading}</span>
                        </h3>
                        <div className="flex flex-col gap-3 md:gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full bg-white/[0.02] border border-white/15 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 shrink-0" />
                              <div className="flex-1 flex flex-col gap-2">
                                <div className="text-sm md:text-base font-bold">
                                  <span className="inline-block text-white">{t.offerListItemName}</span>
                                </div>
                                <div className="text-xs leading-relaxed">
                                  <span className="inline-block text-slate-400">{t.offerListItemDesc}</span>
                                </div>
                              </div>
                              <div className="hidden sm:block px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-white font-bold text-xs">{t.offerListItemCta}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* BEAMS - 3 osobne overlays, każdy active tylko podczas reveal swojej page'a */}
                {/* HOME beam (0.005-0.10) */}
                <motion.div
                  style={{ maskImage: homeBeamMask, WebkitMaskImage: homeBeamMask, opacity: homeBeamOpacity }}
                  className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-linear-to-tl from-emerald-600/50 via-emerald-100/90 to-emerald-600/50" />
                </motion.div>
                {/* O NAS beam (0.38-0.46) */}
                <motion.div
                  style={{ maskImage: aboutBeamMask, WebkitMaskImage: aboutBeamMask, opacity: aboutBeamOpacity }}
                  className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-linear-to-tl from-emerald-600/50 via-emerald-100/90 to-emerald-600/50" />
                </motion.div>
                {/* OFERTA beam (0.68-0.76) */}
                <motion.div
                  style={{ maskImage: offerBeamMask, WebkitMaskImage: offerBeamMask, opacity: offerBeamOpacity }}
                  className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-linear-to-tl from-emerald-600/50 via-emerald-100/90 to-emerald-600/50" />
                </motion.div>

                {/* DEMO badge - sygnał klientowi że to makieta, nie konkretna realizacja */}
                <div
                  className="absolute top-20 right-3 md:top-24 md:right-4 z-45 inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300/80 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  {t.demoBadge}
                </div>

                {/* Animated cursor */}
                <motion.div style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }} className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform">
                  <MousePointer2 size={32} className="text-white fill-emerald-500 stroke-[1.5]" />
                </motion.div>

                {/* Bottom fog */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-30 pointer-events-none" />
              </div>
            </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              style={{ opacity: useTransform(smoothMain, [0, 0.05, 0.1], [1, 1, 0]) }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-emerald-500 z-10 pointer-events-none"
            >
              <span className="text-[9px] uppercase font-bold tracking-[0.3em]">{t.scrollHint}</span>
              <div className="w-px h-10 bg-gradient-to-b from-emerald-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── "MAKIETA = FRAGMENT" - chips marquee z dodatkowymi sekcjami ────────────── */}
        {/* Sygnalizuje klientowi że makieta pokazuje 3 podstrony, ale realna witryna
            może mieć dużo więcej: blog, portfolio, FAQ, formularze, intranet, itd. */}
        <section className="container mx-auto px-6 relative z-30 pt-12 md:pt-20 pb-4 md:pb-8 bg-[#000000]">
          <Reveal delay={0.05}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-emerald-300 text-[11px] font-mono uppercase tracking-[0.22em]">{t.fragmentBadge}</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
                {t.fragmentHeadingPre}{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-300">{t.fragmentHeadingAccent}</span>.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
                {t.fragmentLead}
              </p>

              {/* Dwurzędowy marquee - Row 1 w prawo, Row 2 w lewo */}
              <div
                className="space-y-4 md:space-y-5 mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6"
                aria-hidden="true"
              >
                <div className="overflow-hidden">
                  <div className="flex gap-4 w-max will-change-transform" style={{ animation: 'scroll 55s linear infinite reverse' }}>
                    {(() => {
                      const row1 = t.fragmentRow1;
                      return [...row1, ...row1].map((label, i) => (
                        <span key={`r1-${i}`} className="shrink-0 inline-flex items-center px-6 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-slate-100 text-base md:text-lg font-medium whitespace-nowrap">
                          {label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="flex gap-4 w-max will-change-transform" style={{ animation: 'scroll 55s linear infinite' }}>
                    {(() => {
                      const row2 = t.fragmentRow2;
                      return [...row2, ...row2].map((label, i) => (
                        <span key={`r2-${i}`} className="shrink-0 inline-flex items-center px-6 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-slate-100 text-base md:text-lg font-medium whitespace-nowrap">
                          {label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm md:text-base font-mono font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" aria-hidden="true" />
                  {t.fragmentPill}
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── BENTO GRID (jak Impact.tsx) ────────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="py-24 md:py-32 border-b border-white/5">

            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">{t.bentoBadge}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                  {t.bentoHeadingPre}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                    {t.bentoHeadingAccent}
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {t.bentoLead}
                </p>
              </motion.div>
            </div>

            {/* Grid 2+1+1+2 (jak Impact) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 (span 2) - Skalowalność + animated bar chart */}
              <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-emerald-500/30 transition-colors duration-700 ease-out">
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={RADIAL_RINGS_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <Target size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{t.bentoCard1Title}</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    {t.bentoCard1Desc}
                  </p>
                </div>
                {/* Animated bar chart */}
                <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-30 md:opacity-50 pointer-events-none translate-y-4 translate-x-4" aria-hidden="true">
                  <div className="flex items-end justify-end gap-2 h-full">
                    {[35, 55, 42, 72, 60, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                        className="w-8 md:w-12 bg-gradient-to-t from-emerald-600/20 to-emerald-500/60 rounded-t-lg"
                      />
                    ))}
                  </div>
                </div>
                <GlassEdge />
              </motion.div>

              {/* Card 2 (span 1) - CMS */}
              <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[300px] flex flex-col hover:border-emerald-500/30 transition-colors duration-700 ease-out">
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-700 ease-out relative z-10">
                  <ArrowUpRight size={24} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{t.bentoCard2Title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  {t.bentoCard2Desc}
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 3 (span 1) - SEO + counter */}
              <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[250px] flex flex-col hover:border-emerald-500/30 transition-colors duration-700 ease-out">
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Search size={24} aria-hidden="true" />
                  </div>
                  <span className="text-4xl font-bold text-white flex items-baseline" aria-label={t.bentoCard3AriaScore}>
                    <Counter value={99} /><span className="text-emerald-500 text-2xl" aria-hidden="true">/100</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{t.bentoCard3Title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  {t.bentoCard3Desc}
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 4 (span 2) - Status Lidera + CTA */}
              <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-emerald-500/30 transition-colors duration-700 ease-out">
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={LIQUID_METAL_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={20} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{t.bentoCard4Title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {t.bentoCard4Desc}
                  </p>
                </div>
                <div className="shrink-0 relative z-20">
                  <Link
                    href={localizeHref('/kontakt', locale)}
                    className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 cursor-pointer"
                  >
                    {t.bentoCard4Cta}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-500" aria-hidden="true" />
                  </Link>
                </div>
                <GlassEdge />
              </motion.div>
            </div>
          </section>
        </div>

        {/* ── ANIMACJA 2: ZAKRES PRAC (400vh - wolniejszy, oddychający) ────── */}
        <section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
          <div className="sticky top-0 h-dvh w-full flex items-center px-6 py-12 md:py-16">
            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEWA - nagłówek (wyrównany do góry) */}
            <div className="text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">{t.scopeBadge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1]">
                {t.scopeHeadingPre}{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-300">
                  {t.scopeHeadingAccent}
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                {t.scopeLead}
              </p>
            </div>

            {/* PRAWA - karty (startują od dołu) */}
            <div className="relative w-full h-[78vh] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
              <motion.div style={{ y: scopeCardsY, willChange: 'transform' }} className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]">
                {t.scopeItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden p-7 md:p-10 rounded-3xl border border-white/15 bg-[#080808] hover:border-emerald-500/30 transition-colors duration-500 flex items-start gap-6"
                  >
                    {/* Static emerald glow pod glass - daje glassmorphismowi co blurować */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      aria-hidden="true"
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.05) 40%, transparent 70%)',
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" aria-hidden="true" />
                    <div className="relative z-10 shrink-0 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest">0{i + 1}</span>
                    </div>
                    <div className="absolute bottom-0 right-0 text-[150px] md:text-[180px] font-black text-emerald-500/[0.04] group-hover:text-emerald-500/[0.07] transition-colors duration-500 pointer-events-none select-none leading-none z-0" aria-hidden="true">
                      0{i + 1}
                    </div>
                    <div className="relative z-10 flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
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

        {/* ── CTA CARD ──────────────────────────────────────────────────────── */}
        <section className="relative w-full py-14 sm:py-20 lg:py-32 bg-[#000000] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-emerald-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
          </div>
          <div className="container mx-auto px-5 sm:px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-3xl blur opacity-15" aria-hidden="true" />
              <div className="relative rounded-3xl bg-[#080808] border border-white/15 p-6 sm:p-10 md:p-16 text-center overflow-hidden">

                {/* Shader CTA - Warp pattern, mocniej widoczny */}
                {!shouldReduceMotion && (
                  <div className="absolute inset-0 opacity-60 pointer-events-none" aria-hidden="true">
                    <ShaderCanvas fragmentShader={WARP_FS} />
                  </div>
                )}
                {/* Lekka vignette żeby content był czytelny ale shader nadal pulsował */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.55) 70%, rgba(8,8,8,0.75) 100%)',
                  }}
                />
                {/* iOS Liquid Glass na bordzie (jak bento) */}
                <GlassEdge />

                <div className="relative z-10">
                  <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 sm:mb-8 max-w-full"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase truncate">{t.ctaBadge}</span>
                  </motion.div>

                  <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-[2rem] sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.08] text-balance"
                  >
                    {t.ctaHeadingPre}{' '}
                    <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-300">
                      {t.ctaHeadingAccent}
                    </span>
                  </motion.h2>

                  <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                  >
                    {t.ctaLead}
                  </motion.p>

                  <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    <Link href={localizeHref('/kontakt', locale)}
                      className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t.ctaPrimary}
                        <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                    </Link>
                    <Link href={localizeHref('/kontakt', locale)}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      {t.ctaSecondary}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AVENLY AI CTA ─────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 pb-20 relative z-40 bg-[#000000]">
          <div className="border-t border-white/5 pt-16">
            <AvenlyAICta />
          </div>
        </div>

      </main>
    </div>
  );
}
