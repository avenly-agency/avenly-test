'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll, useTransform, useSpring, useMotionTemplate,
  useMotionValue, useReducedMotion,
  Variants,
} from 'framer-motion';
import {
  ArrowRight,
  Globe, Target, FastForward, Smartphone, Zap, CalendarCheck,
  Lock, MousePointer2, Quote, Layers, Sparkles, Shield,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// === LIGHT RAYS SHADER (god rays z góry, brand blue) ===
// Overlay nad istniejącym radial gradient - NIE fullscreen, tylko top 800px (matching gradient).
// Mobile DPR 1.0 / desktop 1.5 - IO pause + 30fps throttle aktywne na wszystkich device'ach.
// Additive blend (rays glow nad gradientem zamiast go zastępować).

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

  float t = u_time * 0.08;

  // === SUN POSITION Z SWAY ===
  // Horizontalne wahanie ~35s cycle, amplituda 0.35 - rays delikatnie "tańczą" w bok
  vec2 sunPos = vec2(sin(t * 0.18) * 0.35, 1.4);
  vec2 toSun = sunPos - p;
  float distSun = length(toSun);
  float angle = atan(toSun.x, toSun.y);

  // 5 warstw rays
  float r1 = pow(max(0.0, sin(angle *  3.5 + t * 0.30)), 1.5);
  float r2 = pow(max(0.0, sin(angle *  5.0 - t * 0.35)), 1.8);
  float r3 = pow(max(0.0, sin(angle *  6.0 + t * 0.40)), 2.0);
  float r4 = pow(max(0.0, sin(angle *  8.0 - t * 0.45)), 2.5);
  float r5 = pow(max(0.0, sin(angle * 11.0 + t * 0.50)), 3.0);

  // === PER-RAY FLICKER (modulowany kątem → niezsynchronizowany, organiczny) ===
  // Każda warstwa ma własny "oddech" zależny od kąta - różne części tej samej rodziny rays migoczą innym tempem
  float flick1 = 0.96 + 0.04 * sin(t * 1.3 + angle * 2.0);
  float flick2 = 0.96 + 0.04 * sin(t * 1.7 + angle * 3.5 + 1.5);
  float flick3 = 0.96 + 0.04 * sin(t * 1.1 + angle * 2.7 + 3.2);
  float flick4 = 0.96 + 0.04 * sin(t * 1.9 + angle * 4.1 + 5.0);
  float flick5 = 0.96 + 0.04 * sin(t * 2.3 + angle * 5.3 + 2.1);

  float rays = r1 * 0.65 * flick1
             + r2 * 0.55 * flick2
             + r3 * 0.50 * flick3
             + r4 * 0.35 * flick4
             + r5 * 0.25 * flick5;

  rays *= exp(-distSun * 0.10);

  float vertFade = smoothstep(1.0 - u_entry, 1.0, uv.y);

  // === OVERALL BREATH MODULATION (subtle pulse całości) ===
  float breath = 0.97 + 0.03 * sin(t * 0.5);

  float raysIntensity = rays * vertFade * 0.55 * breath;

  vec3 rayColor = vec3(0.40, 0.60, 1.0);

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
    // Jeśli kontekst już lost (zwrócony stary z poprzedniego cleanup, typowo Strict Mode
    // lub po kumulacji WebGL contextów >Chrome limit ~16), force nowy canvas DOM przez key.
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

    // Additive blending - rays GLOW nad gradient/bg zamiast zastępować
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

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
      if (!firstFrameDone) {
        firstFrameDone = true;
        canvas.style.visibility = 'visible';
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const handleLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const handleRestored = () => { firstFrameDone = false; canvas.style.visibility = 'hidden'; draw(); };
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);

    // Pauza gdy poza viewport - service page scroll przeniesie rays poza ekran
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
      // Hide canvas PRZED loseContext - Chrome renderuje lost-context canvas jako biały,
      // ~100ms okno między cleanup a new canvas mount (Strict Mode dev).
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

// === BENTO SHADERS (4 inne koncepty niż Impact contours) ===
// Card 1: radial rings, Card 2: speed streaks, Card 3: vertical flow, Card 4: plasma orb
// Wszystkie blue brand color, low-amplitude alpha (0.35-0.40) jako "przystawka" pod treścią

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// CARD 1 - RADIAL PULSE RINGS - koncentryczne pierścienie ekspandujące z punktu off-center
// (idealnie pasuje do "Laserowe skupienie" / target theme)
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

  // 4 layers - WYŻSZE powers (8-12) = sharper laser-like rings (mniej blur)
  float r1 = sin(dist *  6.0 - t * 0.7);
  float r2 = sin(dist * 10.0 - t * 0.5 + 1.5);
  float r3 = sin(dist * 14.0 - t * 0.9 + 3.0);
  float r4 = sin(dist * 20.0 - t * 1.2 + 4.5);

  float rings = pow(max(0.0, r1),  8.0) * 0.70
              + pow(max(0.0, r2), 10.0) * 0.55
              + pow(max(0.0, r3),  8.0) * 0.45
              + pow(max(0.0, r4),  6.0) * 0.30;

  // Slower falloff (0.20 vs 0.35) - rings extend further
  rings *= exp(-dist * 0.20);

  vec2 textCenter = vec2(-0.9, 0.35);
  float textDist = length((p - textCenter) * vec2(0.6, 1.3));
  float textDim = smoothstep(0.4, 1.2, textDist);

  // Edge boost - right + top + bottom (left skip, text)
  float edgeBoost = max(
    smoothstep(0.9, 1.7, p.x),
    max(smoothstep(0.5, 0.95, p.y), smoothstep(0.5, 0.95, -p.y))
  );

  gl_FragColor = vec4(vec3(0.30, 0.55, 1.0), rings * textDim * (1.0 + edgeBoost * 0.5) * 1.0);
}
`;

// CARDS 2 & 3 - WARP (Paper Design pattern) - domain-warped color field
// Najpopularniejszy premium card shader 2026. Smooth fluid flow, ZERO discrete shapes,
// pairs idealnie z glassmorphism (continuous soft variation = beautiful when blurred).
const MESH_GRADIENT_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.08;

  // 2-iteracje domain warping (sin-based, tańsze niż snoise, identyczny smooth flow effect)
  // Iteracja 1: q oblicza początkowy displacement
  vec2 q;
  q.x = sin(p.x * 2.0 + p.y * 1.5 + t * 0.6);
  q.y = sin(p.x * 1.5 - p.y * 2.0 + t * 0.4 + 1.5);

  // Iteracja 2: r używa q jako offset (domain warping → organic flow)
  vec2 r;
  r.x = sin(p.x * 1.0 + q.y * 2.0 + t * 0.3);
  r.y = sin(p.y * 1.0 + q.x * 2.0 + t * 0.5 + 2.5);

  // Sample warped color field - 2 sins combined
  float field = (sin(r.x * 2.0 + r.y * 1.5 + t * 0.4) * 0.5 + 0.5);
  field += (sin(r.y * 2.5 - r.x * 1.5 + t * 0.3) * 0.5 + 0.5);
  field *= 0.5;

  // Edge bias - bright krawędzie (glass), dim środek (tekst)
  float edgeBias = smoothstep(0.15, 0.85, length(p));

  // Text dim
  vec2 textCenter = vec2(-0.3, 0.3);
  float textDist = length((p - textCenter) * vec2(0.7, 1.2));
  float textDim = smoothstep(0.4, 1.2, textDist);

  gl_FragColor = vec4(vec3(0.40, 0.60, 1.0), field * edgeBias * textDim * 0.85);
}
`;

// CARD 4 - LIQUID METAL (Paper Design pattern) - premium polished metal shimmer
// Domain-warped flow + power-sharpened specular peaks + chromatic 2-color blend
// Pasuje do "Kompaktowa wydajność" theme (energy/performance)
const PLASMA_ORB_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.08;

  // 2-iter domain warping (smooth fluid base)
  vec2 q;
  q.x = sin(p.x * 1.3 + p.y * 1.0 + t * 0.5);
  q.y = sin(p.x * 1.0 - p.y * 1.5 + t * 0.4 + 1.5);

  vec2 r;
  r.x = sin(p.x * 0.8 + q.y * 2.0 + t * 0.6);
  r.y = sin(p.y * 0.8 + q.x * 2.0 + t * 0.4 + 2.0);

  // Sample warped value field
  float v = sin(r.x * 3.0 + r.y * 2.0 + t * 0.5);

  // POWER-SHARPENED specular - wąskie, ostre błyski jak na wypolerowanym metalu
  float specular = pow(max(0.0, v), 5.0);

  // Wider base flow (smooth gradient backdrop)
  float base = sin(r.x * 2.0 - r.y * 1.5 + t * 0.3) * 0.5 + 0.5;

  // CHROMATIC 2-COLOR MIX - base blue → bright peak (metallic shift)
  vec3 colorBase = vec3(0.25, 0.45, 0.90);
  vec3 colorPeak = vec3(0.55, 0.75, 1.0);
  vec3 finalColor = mix(colorBase, colorPeak, specular);

  // Intensity = base flow + sharp specular highlights
  float intensity = base * 0.5 + specular * 0.8;

  // Wide-card aspect - falloff w X compressed (col-span-2 layout)
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

// ShaderCanvas - wspólny host JS (DPR clamp 1.25, 30fps throttle, IO pause, alpha blend)
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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      // Mobile DPR 1.0, desktop 1.25 - mobile GPU oszczędza ~1.5× mniej fragment invocations.
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

// GlassEdge - iOS-like glass ring (4 linear gradient masks, soft frame, blur backdrop)
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

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};
const vp = { once: true, margin: '-50px' } as const;

// Blueprint section label - monospace numerowana sekcja + cienka linia ekspozycyjna.
// Używane w 4 stage'ach makiety przeglądarki (Hero / Oferta / Społeczny Dowód / Kontakt).
function BlueprintLabel({ num, name }: { num: string; name: string }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
      <span className="font-mono text-[10px] md:text-xs text-blue-400/70 tracking-[0.25em] uppercase shrink-0">
        {num} / {name}
      </span>
      <div className="flex-1 h-px bg-linear-to-r from-blue-500/30 via-white/10 to-transparent" />
    </div>
  );
}

// Wireframe placeholder dla BlueprintLabel - utrzymuje identyczną wysokość,
// dzięki czemu Wireframe i Blueprint layers są w pixel-perfect alignment.
function WireframeLabel() {
  return (
    <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8" aria-hidden="true">
      <div className="h-3 w-24 md:w-32 bg-white/8 rounded-sm shrink-0" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

export function OnePageClient() {
  // a11y - respect prefers-reduced-motion (gate shaderów bento)
  // Shadery na mobile mają niższy DPR (1.0 vs desktop 1.5/1.25) - patrz resize() w
  // RaysBackground i ShaderCanvas. IO pause + 30fps throttle nadal aktywne wszędzie.
  const shouldReduceMotion = useReducedMotion() ?? false;

  // ── ANIMACJA 1: MAKIETA PRZEGLĄDARKI ────────────────────────────────────────
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const smoothMain = useSpring(mainProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const raysOpacity = useTransform(smoothMain, [0.85, 1], [1, 0]);

  const scale       = useTransform(smoothMain, [0, 0.15], [0.85, 1]);
  const rotateX     = useTransform(smoothMain, [0, 0.15], [15, 0]);
  const mockOpacity = useTransform(smoothMain, [0, 0.1], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.15, 0.9], ['0%', '100%']);

  // Dynamic scroll end - content przesuwa się o (contentH - viewportH) px tak żeby
  // ostatnia sekcja (submit) była dokładnie na dolnej krawędzi viewport gdy smoothMain = 0.9.
  // Mierzymy oba wymiary przez ResizeObserver, contentY jest motion value w pixelach.
  const wireframeLayerRef = useRef<HTMLDivElement>(null);
  const viewportRef       = useRef<HTMLDivElement>(null);
  const maxScrollPx       = useMotionValue(0);
  useEffect(() => {
    const layer = wireframeLayerRef.current;
    const vp = viewportRef.current;
    if (!layer || !vp) return;
    const update = () => {
      const cH = layer.offsetHeight;
      const vH = vp.offsetHeight;
      maxScrollPx.set(Math.max(0, cH - vH));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(layer);
    ro.observe(vp);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [maxScrollPx]);
  const contentY = useTransform([smoothMain, maxScrollPx], (latest: number[]) => {
    const [p, ms] = latest;
    const t = Math.max(0, Math.min(1, (p - 0.15) / (0.9 - 0.15)));
    return -t * ms;
  });

  // ── LANE A: URL bar narration (3 states) ────────────────────────────────────
  const urlHomeOpacity    = useTransform(smoothMain, [0.15, 0.30, 0.38], [1, 1, 0]);
  const urlOfertaOpacity  = useTransform(smoothMain, [0.34, 0.42, 0.66, 0.74], [0, 1, 1, 0]);
  const urlKontaktOpacity = useTransform(smoothMain, [0.70, 0.78, 0.90], [0, 1, 1]);

  // ── LANE B: Diagonal reveal (wireframe → design) ────────────────────────────
  // Linia diagonal przechodzi od prawego-dolnego do lewego-górnego.
  // 0% = nic nie odsłonięte (pure wireframe), 130% = wszystko odsłonięte (pure Blueprint).
  // 130 zamiast 100 daje bufor żeby finalna klatka miała czysty Blueprint bez residual transparent.
  const revealProgress = useTransform(smoothMain, [0.28, 0.68], [0, 130]);
  // Transition zone SYMETRYCZNA wokół beam core - text fade-in dokładnie podczas
  // przejścia linii beam, nie przed kontaktem. revealLeading = strona już revealed (BR),
  // revealTrailing = strona jeszcze wireframe (TL), środek transition = beam core.
  const revealLeading  = useTransform(revealProgress, (v) => v - 3);
  const revealTrailing = useTransform(revealProgress, (v) => v + 3);
  const blueprintMask  = useMotionTemplate`linear-gradient(to top left, black ${revealLeading}%, transparent ${revealTrailing}%)`;
  // Wireframe - INVERSE mask (visible tylko tam gdzie Blueprint NIE pokrywa),
  // ta sama symetryczna transition żeby krawędzie się idealnie spotkały.
  const wireframeMask  = useMotionTemplate`linear-gradient(to top left, transparent ${revealLeading}%, black ${revealTrailing}%)`;
  // Beam mask - 7-stop smooth gradient: wide halo + sharp center core + symetria
  // Total beam width: ~30% gradient span (15% halo + sharp 2% core + 15% halo)
  // Alpha curve: 0 → 0.15 → 0.55 → 1 (core) → 0.55 → 0.15 → 0 - nessa smooth gauss-like
  const beamS1 = useTransform(revealProgress, (v) => v - 15);  // halo outer start
  const beamS2 = useTransform(revealProgress, (v) => v - 8);   // halo soft
  const beamS3 = useTransform(revealProgress, (v) => v - 2.5); // halo inner approach
  const beamS4 = useTransform(revealProgress, (v) => v);       // CORE peak
  const beamS5 = useTransform(revealProgress, (v) => v + 3);   // halo inner depart
  const beamS6 = useTransform(revealProgress, (v) => v + 10);  // halo soft
  const beamS7 = useTransform(revealProgress, (v) => v + 17);  // halo outer end
  const beamMask = useMotionTemplate`linear-gradient(to top left,
    transparent ${beamS1}%,
    rgba(0,0,0,0.15) ${beamS2}%,
    rgba(0,0,0,0.55) ${beamS3}%,
    rgba(0,0,0,1) ${beamS4}%,
    rgba(0,0,0,0.55) ${beamS5}%,
    rgba(0,0,0,0.15) ${beamS6}%,
    transparent ${beamS7}%
  )`;
  // Beam visibility - pulsuje tylko gdy reveal aktywny (knockout na początku i końcu)
  const beamOpacity = useTransform(smoothMain, [0.28, 0.30, 0.66, 0.68], [0, 1, 1, 0]);

  // ── LANE C: Cursor traveler + click choreography ────────────────────────────
  // Sekwencja jest LINEARNA (każda faza po poprzedniej, brak overlapu):
  //   0.70-0.74  cursor fade-in (top-right of viewport)
  //   0.74-0.83  flight (BR → middle-right → submit center-bottom) - KOŃCZY ruch @ 0.83
  //   0.83-0.86  ⏸ PAUZA (kursor stoi nieruchomo na submit, ~3% scroll = chwila oddechu)
  //   0.86-0.90  ⬇ KLIK (cursor scale 1→0.72→1, depression + return)
  //   0.90-0.97  ⚡ SUBMIT REACTION (flash peak 0.92, ring expand 1→1.7) - dopiero PO klik
  //   0.95-0.98  cursor fade-out
  const cursorOpacity     = useTransform(smoothMain, [0.70, 0.74, 0.95, 0.98], [0, 1, 1, 0]);
  const cursorX           = useTransform(smoothMain, [0.74, 0.79, 0.83], ['82%', '65%', '50%']);
  const cursorY           = useTransform(smoothMain, [0.74, 0.79, 0.83], ['25%', '60%', '95%']);
  const cursorClickScale  = useTransform(smoothMain, [0.86, 0.88, 0.90], [1, 0.72, 1]);
  const submitFlash       = useTransform(smoothMain, [0.90, 0.92, 0.96], [0, 0.55, 0]);
  const submitRingScale   = useTransform(smoothMain, [0.90, 0.98], [1, 1.7]);
  const submitRingOpacity = useTransform(smoothMain, [0.90, 0.93, 0.98], [0, 0.85, 0]);

  // ── ANIMACJA 2: ZAKRES PRAC ──────────────────────────────────────────────────
  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });
  // Wolniejsza spring (większy damping + niższy stiffness) + krótszy zakres transform
  // = animacja jedzie wolniej i zatrzymuje się wcześniej. Start na 0vh = pierwsza karta
  // widoczna od razu (bez konieczności scrollowania całej wysokości boxa).
  const smoothScope = useSpring(scopeProgress, { stiffness: 55, damping: 32, restDelta: 0.001 });
  // Initial offset 6vh - pierwsza karta startuje w BLACK region maski (poniżej top fade 0-8%),
  // inaczej jej górna krawędź jest „ucinana" przez fade alpha. End reduced -50% (z -55%)
  // żeby kompensować initial shift - ostatnia karta wciąż dojeżdża do bottom mask region.
  const scopeCardsY = useTransform(smoothScope, [0, 1], ['50vh', '-50%']);

  const scopeItems = [
    { title: 'Kinowy projekt graficzny',  desc: 'Projekt od zera, nastawiony na konwersję i prestiż Twojej marki.' },
    { title: 'Płynne animacje i efekty',  desc: 'Subtelne animacje na scrollu, które ożywiają stronę i przykuwają uwagę klienta.' },
    { title: 'Zbieranie leadów',          desc: 'Zoptymalizowany, zabezpieczony formularz kontaktowy podpięty bezpośrednio pod Twój adres e-mail.' },
    { title: 'Perfekcyjne na telefonie',  desc: 'Każdy piksel dopasowany do smartfonów i tabletów, z myślą najpierw o telefonie.' },
    { title: 'Google Core Web Vitals',    desc: 'Optymalizacja wydajności dla natychmiastowego ładowania i perfekcyjnych wyników PageSpeed.' },
    { title: 'Pomoc wdrożeniowa',         desc: 'Wsparcie w wyborze hostingu, podpięciu domeny i konfiguracji darmowego certyfikatu SSL.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 overflow-x-clip">

      {/* TŁO - rays fixed during Hero+makieta scroll lock, fade out gdy makieta kończy się.
          fixed positioning + opacity tied to smoothMain → rays follow viewport i znikają po makiecie. */}
      <motion.div
        style={{ opacity: raysOpacity }}
        className="fixed top-0 left-0 right-0 h-screen z-0 pointer-events-none overflow-hidden bg-[#000000]"
      >
        <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden">
          <RaysBackground />
        </div>
      </motion.div>

      <main className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Globe size={14} /> Rozwiązania One-Page
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Skupienie na <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                jednym celu.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Idealna pod kampanie reklamowe i startujące projekty. Zyskujesz landing page, który chwyta uwagę i prowadzi klienta prosto do konwersji.
            </p>
          </Reveal>
        </section>

        {/* ── MAKIETA PRZEGLĄDARKI (400vh) ──────────────────────────────────── */}
        <section ref={targetRef} className="relative h-[400vh] z-30">
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
              className="relative w-full max-w-[88rem] h-[78vh] md:h-[88vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.25)] flex flex-col overflow-hidden will-change-transform"
            >
              {/* Browser toolbar */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-6 flex items-center gap-2 z-30 shrink-0">
                <div className="flex gap-2 shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                <div className="flex-1 max-w-md md:absolute md:left-1/2 md:-translate-x-1/2 md:w-1/2 md:max-w-md md:flex-none h-8 bg-black/50 rounded-full border border-white/5 flex items-center px-3 overflow-hidden">
                  <Lock size={9} className="text-emerald-400/70 shrink-0 mr-1.5" aria-hidden="true" />
                  <span className="text-blue-500/50 text-[11px] sm:text-xs font-mono shrink-0">https://</span>
                  <div className="relative flex-1 h-full flex items-center text-[11px] sm:text-xs font-mono tracking-wider text-slate-500 ml-0.5">
                    <motion.span style={{ opacity: urlHomeOpacity }} className="absolute inset-x-0 truncate">twoja-przyszla-strona.pl</motion.span>
                    <motion.span style={{ opacity: urlOfertaOpacity }} className="absolute inset-x-0 truncate text-blue-300">twoja-przyszla-strona.pl/#oferta</motion.span>
                    <motion.span style={{ opacity: urlKontaktOpacity }} className="absolute inset-x-0 truncate text-blue-200">twoja-przyszla-strona.pl/#kontakt</motion.span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400" />
                </div>
              </div>

              {/* Viewport */}
              <div ref={viewportRef} className="relative flex-1 bg-[#020202] overflow-hidden">

                {/* DEMO badge - sygnał że to makieta, nie realizacja klienta */}
                <div
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-40 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-blue-300/80 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                  Makieta · Demo
                </div>

                {/* Scrolling content - 2 layery stacked: wireframe baseline + Blueprint masked overlay.
                    Obie warstwy scrollują razem przez contentY (parent motion.div),
                    Blueprint odsłania się diagonalnie (BR → TL) wraz z scroll progress,
                    pokazując "build process": planning → design. */}
                <motion.div
                  style={{ y: contentY }}
                  className="absolute top-0 left-0 w-full will-change-transform"
                  aria-hidden="true"
                >

                  {/* ═══════════ LAYER 1: WIREFRAME (inverse mask - visible tylko tam gdzie Blueprint NIE pokrywa) ═══════════ */}
                  <motion.div
                    ref={wireframeLayerRef}
                    style={{ maskImage: wireframeMask, WebkitMaskImage: wireframeMask }}
                    className="relative w-full p-6 md:p-14 flex flex-col gap-16 md:gap-24 pb-8"
                  >

                    {/* 01 / HERO - wireframe mirror Blueprint (inline-block per line, rounded, zero overlap) */}
                    <section className="mt-6 md:mt-10">
                      <WireframeLabel />
                      <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 md:mb-5">
                          <span className="inline-block text-transparent bg-white/10 rounded-lg leading-[1.05]">Krótki, mocny</span>
                          <br />
                          <span className="inline-block text-transparent bg-white/10 rounded-lg leading-[1.05] mt-1.5">nagłówek.</span>
                        </h2>
                        <p className="text-sm md:text-base max-w-lg mx-auto mb-7 md:mb-9 leading-relaxed">
                          <span className="inline-block text-transparent bg-white/5 rounded-md">
                            Tagline w mniejszej skali. Propozycja wartości w jednym zdaniu.
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                          <div className="px-5 py-3 rounded-xl bg-blue-500/30 text-transparent font-mono font-bold text-[11px] md:text-xs tracking-[0.18em]">
                            CTA_PRIMARY
                          </div>
                          <div className="px-5 py-3 rounded-xl border border-white/15 text-transparent font-mono text-[11px] md:text-xs tracking-[0.18em]">
                            CTA_SECONDARY
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* 02 / OFERTA - wireframe mirror Blueprint */}
                    <section>
                      <WireframeLabel />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="relative p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                            <div className="font-mono text-[9px] md:text-[10px] tracking-[0.22em] uppercase mb-3 md:mb-4">
                              <span className="inline-block text-transparent bg-white/8 rounded">0{i} / Usługa</span>
                            </div>
                            <div className="w-[22px] h-[22px] bg-white/10 rounded mb-3" />
                            <div className="text-sm md:text-base font-bold mb-1.5">
                              <span className="inline-block text-transparent bg-white/10 rounded">Usługa Pierwsza</span>
                            </div>
                            <div className="text-xs md:text-sm leading-relaxed">
                              <span className="inline-block text-transparent bg-white/5 rounded">Co klient zyskuje. Krótki opis w dwóch zdaniach.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 03 / SPOŁECZNY DOWÓD - wireframe mirror Blueprint */}
                    <section>
                      <WireframeLabel />
                      <div className="max-w-2xl mx-auto text-center">
                        <div className="w-7 h-7 mx-auto bg-white/10 rounded-md mb-5" />
                        <blockquote className="text-xl md:text-3xl font-bold leading-snug">
                          <span className="inline-block text-transparent bg-white/10 rounded-lg">
                            &bdquo;Tu znajdzie się krótka opinia klienta. Mocny cytat budujący zaufanie.&rdquo;
                          </span>
                        </blockquote>
                        <p className="text-[10px] md:text-xs font-mono tracking-[0.22em] uppercase mt-5 md:mt-6">
                          <span className="inline-block text-transparent bg-white/5 rounded">- Klient / Stanowisko</span>
                        </p>
                      </div>
                    </section>

                    {/* 04 / KONTAKT - wireframe mirror Blueprint */}
                    <section>
                      <WireframeLabel />
                      <div className="max-w-md mx-auto">
                        <div className="space-y-3 mb-5 md:mb-6">
                          {[
                            { label: 'NAME', h: '' },
                            { label: 'EMAIL', h: '' },
                            { label: 'MESSAGE', h: 'h-16 md:h-20' },
                          ].map(({ label, h }) => (
                            <div
                              key={label}
                              className={`relative rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 ${h}`}
                            >
                              <div className="font-mono text-[9px] tracking-[0.22em] uppercase">
                                <span className="inline-block text-transparent bg-white/8 rounded">FIELD_{label}</span>
                              </div>
                              <div className="h-2.5 bg-white/5 rounded-sm w-2/3 mt-1.5" />
                            </div>
                          ))}
                        </div>
                        <div className="w-full px-5 py-4 rounded-xl bg-blue-500/30 text-transparent text-center font-mono font-bold text-[11px] md:text-xs tracking-[0.22em]">
                          SUBMIT →
                        </div>
                      </div>
                    </section>
                  </motion.div>

                  {/* ═══════════ LAYER 2: BLUEPRINT (mask reveals diagonal BR → TL) ═══════════ */}
                  <motion.div
                    style={{ maskImage: blueprintMask, WebkitMaskImage: blueprintMask }}
                    className="absolute inset-0 w-full p-6 md:p-14 flex flex-col gap-16 md:gap-24 pb-8"
                  >
                    {/* 01 / HERO - Blueprint */}
                    <section className="mt-6 md:mt-10">
                      <BlueprintLabel num="01" name="HERO" />
                      <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-4 md:mb-5">
                          Krótki, mocny<br />nagłówek.
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-7 md:mb-9 leading-relaxed">
                          Tagline w mniejszej skali. Propozycja wartości w jednym zdaniu.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                          <div className="px-5 py-3 rounded-xl bg-blue-500 text-white font-mono font-bold text-[11px] md:text-xs tracking-[0.18em]">
                            CTA_PRIMARY
                          </div>
                          <div className="px-5 py-3 rounded-xl border border-white/15 text-white font-mono text-[11px] md:text-xs tracking-[0.18em]">
                            CTA_SECONDARY
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* 02 / OFERTA - Blueprint */}
                    <section>
                      <BlueprintLabel num="02" name="OFERTA" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        {[
                          { num: '01', icon: Layers, name: 'Usługa Pierwsza' },
                          { num: '02', icon: Sparkles, name: 'Usługa Druga' },
                          { num: '03', icon: Shield, name: 'Usługa Trzecia' },
                        ].map(({ num, icon: Icon, name }) => (
                          <div key={num} className="relative p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                            <div className="font-mono text-[9px] md:text-[10px] text-blue-400/60 tracking-[0.22em] uppercase mb-3 md:mb-4">
                              {num} / Usługa
                            </div>
                            <Icon size={22} className="text-blue-400 mb-3" aria-hidden="true" />
                            <div className="text-white font-bold text-sm md:text-base mb-1.5">{name}</div>
                            <div className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              Co klient zyskuje. Krótki opis w dwóch zdaniach.
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 03 / SPOŁECZNY DOWÓD - Blueprint */}
                    <section>
                      <BlueprintLabel num="03" name="Społeczny Dowód" />
                      <div className="max-w-2xl mx-auto text-center">
                        <Quote size={28} className="text-blue-400/40 mx-auto mb-5" aria-hidden="true" />
                        <blockquote className="text-xl md:text-3xl font-bold text-white leading-snug">
                          &bdquo;Tu znajdzie się krótka opinia klienta. Mocny cytat budujący zaufanie.&rdquo;
                        </blockquote>
                        <p className="text-slate-500 text-[10px] md:text-xs font-mono tracking-[0.22em] uppercase mt-5 md:mt-6">
                          - Klient / Stanowisko
                        </p>
                      </div>
                    </section>

                    {/* 04 / KONTAKT - Blueprint */}
                    <section>
                      <BlueprintLabel num="04" name="Kontakt" />
                      <div className="max-w-md mx-auto">
                        <div className="space-y-3 mb-5 md:mb-6">
                          {[
                            { label: 'NAME', h: '' },
                            { label: 'EMAIL', h: '' },
                            { label: 'MESSAGE', h: 'h-16 md:h-20' },
                          ].map(({ label, h }) => (
                            <div
                              key={label}
                              className={`relative rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 ${h}`}
                            >
                              <div className="font-mono text-[9px] text-blue-400/50 tracking-[0.22em] uppercase">
                                FIELD_{label}
                              </div>
                              <div className="h-2.5 bg-white/5 rounded-sm w-2/3 mt-1.5" />
                            </div>
                          ))}
                        </div>
                        {/* Submit - przyjmuje cursor + flash + expanding ring */}
                        <div className="relative">
                          <motion.div
                            style={{ scale: submitRingScale, opacity: submitRingOpacity }}
                            className="absolute -inset-2 rounded-2xl border-2 border-blue-400 pointer-events-none"
                            aria-hidden="true"
                          />
                          <div className="relative w-full px-5 py-4 rounded-xl bg-blue-500 text-white text-center font-mono font-bold text-[11px] md:text-xs tracking-[0.22em] overflow-hidden">
                            <motion.div
                              style={{ opacity: submitFlash }}
                              className="absolute inset-0 bg-white pointer-events-none"
                              aria-hidden="true"
                            />
                            <span className="relative">SUBMIT →</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </motion.div>

                  {/* ═══════════ BEAM - soft halo + hot core wzdłuż revealing edge ═══════════ */}
                  {/* Wrapper z drobnym blur'em (1.5px) zmiękcza ostre pixele maski,
                      mix-blend-screen daje świecenie nad ciemnym tłem.
                      Background gradient ma white-hot center przy środku diagonalu, blue na końcach. */}
                  <motion.div
                    style={{
                      maskImage: beamMask,
                      WebkitMaskImage: beamMask,
                      opacity: beamOpacity,
                    }}
                    className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px]"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-linear-to-tl from-blue-600/50 via-blue-100/90 to-blue-600/50" />
                  </motion.div>
                </motion.div>

                {/* Lane C - cursor traveler + click depression scale */}
                <motion.div
                  style={{ opacity: cursorOpacity, left: cursorX, top: cursorY }}
                  className="absolute pointer-events-none z-30 will-change-transform -translate-x-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  {/* Inner wrapper for scale (separate from positioning translate) */}
                  <motion.div style={{ scale: cursorClickScale }} className="origin-top-left">
                    <MousePointer2
                      className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] w-[24px] h-[24px] md:w-[34px] md:h-[34px]"
                      fill="white"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>
            </motion.div>

            <motion.div
              style={{ opacity: useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]) }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── "MAKIETA = FRAGMENT" - chips z dodatkowymi sekcjami ───────────── */}
        {/* Pokazuje klientowi że makieta pokazuje TYLKO 4 podstawowe sekcje;
            realna realizacja ma znacznie więcej. Open-ended chip "+ co potrzebujesz"
            sygnalizuje że lista nie jest zamknięta. */}
        <section className="container mx-auto px-6 relative z-30 pt-12 md:pt-20 pb-4 md:pb-8 bg-[#000000]">
          <Reveal delay={0.05}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                <span className="text-blue-300 text-[11px] font-mono uppercase tracking-[0.22em]">Makieta = fragment</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
                4 sekcje to dopiero{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-300">początek</span>.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
                Twoja strona powstaje pod konkretną branżę i cel. Makieta to punkt wyjścia - dostajesz wszystko, czego potrzebujesz, żeby sprzedawać.
              </p>

              {/* Dwurzędowy marquee - Row 1 w prawo (reverse), Row 2 w lewo (normal). */}
              {/* Każdy rząd duplikowany 2× w DOM → seamless loop (translateX 0 → -50%). */}
              {/* Soft mask na krawędziach żeby chipy fade'owały na lewej i prawej krawędzi viewportu. */}
              {/* Inline `style={{ animation }}` zamiast utility class - gwarantowane bypass dla Tailwind v4 PostCSS cache. */}
              <div
                className="space-y-4 md:space-y-5 mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6"
                aria-hidden="true"
              >
                {/* Row 1 - scroll RIGHT (items appear from left, exit to right) */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-4 w-max will-change-transform"
                    style={{ animation: 'scroll 55s linear infinite reverse' }}
                  >
                    {(() => {
                      const row1 = [
                        'Galeria zdjęć',
                        'FAQ',
                        'Cennik',
                        'Blog firmowy',
                        'Integracja Google Maps',
                        'Newsletter',
                        'Animowane statystyki',
                        'Tło video',
                        'Pasek opinii Google',
                        'Logo klientów',
                      ];
                      return [...row1, ...row1].map((label, i) => (
                        <span
                          key={`r1-${i}`}
                          className="shrink-0 inline-flex items-center px-6 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-slate-100 text-base md:text-lg font-medium whitespace-nowrap"
                        >
                          {label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>

                {/* Row 2 - scroll LEFT (items appear from right, exit to left) */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-4 w-max will-change-transform"
                    style={{ animation: 'scroll 55s linear infinite' }}
                  >
                    {(() => {
                      const row2 = [
                        'Kalkulator usług',
                        'Sekcja zespół',
                        'System rezerwacji',
                        'Czat na żywo',
                        'Integracja z CRM',
                        'Multi-język',
                        'Strefa pobrań',
                        'Animowane CTA',
                        'Polityka prywatności',
                        'Wsparcie WCAG',
                      ];
                      return [...row2, ...row2].map((label, i) => (
                        <span
                          key={`r2-${i}`}
                          className="shrink-0 inline-flex items-center px-6 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-slate-100 text-base md:text-lg font-medium whitespace-nowrap"
                        >
                          {label}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Open-ended badge - większy, wyróżniony, statyczny pod marquee */}
              <div className="flex justify-center mt-6 md:mt-8">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200 text-sm md:text-base font-mono font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" aria-hidden="true" />
                  + co potrzebujesz
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── BENTO GRID ────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
          <section className="py-24 md:py-32 border-b border-white/5">

            <div className="max-w-3xl mx-auto text-center mb-20">
              <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Dlaczego One-Page?</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                  Narzędzie do <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                    zadań specjalnych
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Kiedy potrzebujesz szybkiej weryfikacji pomysłu, dedykowanego landing page&apos;a lub wizytówki wspierającej reklamy - One-Page sprawdza się najlepiej.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 - span 2, Laserowe skupienie */}
              <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-blue-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={RADIAL_RINGS_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <Target size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Laserowe skupienie</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    Zyskujesz jedną, spójną ścieżkę wizualną, idealną pod kampanie reklamowe, gdzie liczy się zatrzymanie uwagi i natychmiastowe wypełnienie formularza.
                  </p>
                </div>
                {/* Dekoracja: animated focus rings */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none translate-x-12 translate-y-12" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-blue-500/40"
                      style={{ scale: 1 + i * 0.3 }}
                      animate={{ scale: [1 + i * 0.3, 1.1 + i * 0.3], opacity: [0.4, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                  <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-blue-500/40 blur-sm" />
                </div>
                <GlassEdge />
              </motion.div>

              {/* Card 2 - Błyskawiczna weryfikacja + counter */}
              <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[300px] flex flex-col hover:border-blue-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={MESH_GRADIENT_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:rotate-12 transition-transform duration-700">
                    <FastForward size={24} aria-hidden="true" />
                  </div>
                  <span className="text-4xl font-bold text-white flex items-baseline" aria-label="3-5 dni realizacji">
                    3<span className="text-blue-400 text-2xl">-5 dni</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Błyskawiczna weryfikacja</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Zbieraj leady i testuj rynek znacznie szybciej, zanim zdecydujesz się na rozbudowaną platformę. Czas to Twój zysk.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 3 - Idealne pod Mobile */}
              <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[250px] flex flex-col hover:border-blue-500/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={MESH_GRADIENT_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 relative z-10">
                  <Smartphone size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Idealne pod Mobile</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Płynne przewijanie to naturalny odruch. Twoja oferta staje się wciągającą opowieścią na każdym smartfonie, gdzie przebywa większość Twoich klientów.
                </p>
                <GlassEdge />
              </motion.div>

              {/* Card 4 - span 2, Kompaktowa wydajność + CTA */}
              <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-blue-400/30 transition-colors duration-700 ease-out"
              >
                {!shouldReduceMotion && (
                  <div className="absolute inset-px" aria-hidden="true">
                    <ShaderCanvas fragmentShader={PLASMA_ORB_FS} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Zap size={20} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Szybkość, która oszczędza</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Klient nie czeka ani sekundy. Błyskawiczne ładowanie zatrzymuje go na stronie i obniża koszt Twoich reklam.
                  </p>
                </div>
                <div className="shrink-0 relative z-20">
                  <Link
                    href="/kontakt"
                    className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2"
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

        {/* ── ZAKRES PRAC (400vh - wolniejszy scroll, bardziej oddychający) ──── */}
        <section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
          <div className="sticky top-0 h-dvh w-full flex items-center px-6 py-12 md:py-16">
            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEWA - nagłówek (wyrównany do góry) */}
            <div className="text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Zakres prac</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1]">
                Co dokładnie{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-300">
                  otrzymujesz?
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                Przewijaj w dół, aby zobaczyć pełen pakiet wdrożeniowy.
              </p>
            </div>

            {/* PRAWA - karty (mask region, startują od dołu) */}
            <div className="relative w-full h-[78vh] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
              <motion.div style={{ y: scopeCardsY, willChange: 'transform' }} className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]">
                  {scopeItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative overflow-hidden p-7 md:p-10 rounded-3xl border border-white/15 bg-[#080808] hover:border-blue-500/30 transition-colors duration-500 flex items-start gap-6"
                    >
                      {/* Static blue glow pod glass - daje glassmorphismowi co blurować
                          (bez tego glass na #080808 jest niewidoczny). Zero JS/GPU cost. */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        aria-hidden="true"
                        style={{
                          background:
                            'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" aria-hidden="true" />
                      <div className="relative z-10 shrink-0 p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                        <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest">0{i + 1}</span>
                      </div>
                      <div className="absolute bottom-0 right-0 text-[150px] md:text-[180px] font-black text-blue-500/[0.04] group-hover:text-blue-500/[0.07] transition-colors duration-500 pointer-events-none select-none leading-none z-0" aria-hidden="true">
                        0{i + 1}
                      </div>
                      <div className="relative z-10 flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                      </div>
                      {/* Lightweight glass rim - tylko box-shadow inset (zero GPU cost vs
                          backdrop-filter w GlassEdge). 6 kart × backdrop-filter w sticky
                          pin z animowanym translateY = scroll lag. Box-shadow inset jest
                          cache'owany przez browser, tani na repaint. */}
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

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="relative w-full py-14 sm:py-20 lg:py-32 bg-[#000000] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
          </div>
          <div className="container mx-auto px-5 sm:px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-15" aria-hidden="true" />
              <div className="relative rounded-3xl bg-[#080808] border border-white/15 p-6 sm:p-10 md:p-16 text-center overflow-hidden">

                {/* Shader CTA - Mesh Gradient Warp pattern, mocniej widoczny */}
                {!shouldReduceMotion && (
                  <div className="absolute inset-0 opacity-60 pointer-events-none" aria-hidden="true">
                    <ShaderCanvas fragmentShader={MESH_GRADIENT_FS} />
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
                    className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 sm:mb-8 max-w-full"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                    <span className="text-blue-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase truncate">Wolny termin w tym miesiącu</span>
                  </motion.div>

                  <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-[2rem] sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.08] text-balance"
                  >
                    Gotowy na cyfrową{' '}
                    <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-300">
                      Dominację?
                    </span>
                  </motion.h2>

                  <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                  >
                    Zbudujmy landing page, który pozyskuje klientów za Ciebie. Darmowa konsultacja, zero zobowiązań.
                  </motion.p>

                  <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    <Link href="/kontakt"
                      className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Bezpłatna konsultacja
                        <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
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
