'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useReducedMotion, Variants } from 'framer-motion'
import {
    Workflow,
    Zap,
    MousePointer2,
    Cpu,
    Sparkles,
    CheckCircle2,
    TerminalSquare,
    ArrowRight,
    CalendarCheck,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { AvenlyAICta } from '@/components/AvenlyAICta'

// ═══════════════════════════════════════════════════════════════════════════════
// HERO RAYS - ROSE palette (theme tej podstrony) + DRAMATIC wariant
// (większa amplituda sway, średnio gęste, sharp powers - "premium custom feel")
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
  // DRAMATIC wariant - średnie tempo, szersza amplituda sway, mocny sun bias
  float t = u_time * 0.07;

  // Sun pozycja: szeroka sway (0.45 vs 0.35 baseline), bliżej (1.35)
  vec2 sunPos = vec2(sin(t * 0.20) * 0.45, 1.35);
  vec2 toSun = sunPos - p;
  float distSun = length(toSun);
  float angle = atan(toSun.x, toSun.y);

  // 5 ray layers - średnio gęste, sharp dla "dramatic premium"
  float r1 = pow(max(0.0, sin(angle *  3.2 + t * 0.28)), 1.8);
  float r2 = pow(max(0.0, sin(angle *  4.5 - t * 0.36)), 2.2);
  float r3 = pow(max(0.0, sin(angle *  6.5 + t * 0.44)), 2.6);
  float r4 = pow(max(0.0, sin(angle *  9.0 - t * 0.52)), 3.0);
  float r5 = pow(max(0.0, sin(angle * 13.0 + t * 0.60)), 3.5);

  float flick1 = 0.96 + 0.04 * sin(t * 1.2 + angle * 1.9);
  float flick2 = 0.96 + 0.04 * sin(t * 1.6 + angle * 3.3 + 1.5);
  float flick3 = 0.96 + 0.04 * sin(t * 1.0 + angle * 2.5 + 3.2);
  float flick4 = 0.96 + 0.04 * sin(t * 1.8 + angle * 4.0 + 5.0);
  float flick5 = 0.96 + 0.04 * sin(t * 2.2 + angle * 5.0 + 2.1);

  float rays = r1 * 0.70 * flick1 + r2 * 0.58 * flick2 + r3 * 0.50 * flick3
             + r4 * 0.38 * flick4 + r5 * 0.25 * flick5;

  // Median falloff
  rays *= exp(-distSun * 0.09);

  float vertFade = smoothstep(1.0 - u_entry, 1.0, uv.y);
  float breath = 0.97 + 0.03 * sin(t * 0.45);
  float raysIntensity = rays * vertFade * 0.55 * breath;

  // ROSE #fb7185 (rose-400)
  vec3 rayColor = vec3(0.98, 0.44, 0.52);

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
    // Lost context check - force fresh canvas via key change (zob. CorporateWebsiteClient).
    if (gl.isContextLost()) { setCanvasKey(k => k + 1); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, RAYS_VS);
    const fs = compile(gl.FRAGMENT_SHADER, RAYS_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
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

    // Flash-free init: canvas startuje z visibility:hidden, ujawniamy po pierwszej klatce.
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
      // Hide canvas PRZED loseContext - Chrome renderuje lost-context canvas jako biały.
      canvas.style.visibility = 'hidden';
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" style={{ visibility: 'hidden', background: '#000000' }} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// BENTO SHADERS - ROSE palette
// ═══════════════════════════════════════════════════════════════════════════════

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// CARD 1 - RADIAL PULSE RINGS (rose)
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

  // ROSE #fb7185
  gl_FragColor = vec4(vec3(0.98, 0.44, 0.52), rings * textDim * (1.0 + edgeBoost * 0.5) * 1.0);
}
`;

// CARDS 2 & 3 - WARP (rose)
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

  // ROSE #fb7185
  gl_FragColor = vec4(vec3(0.98, 0.44, 0.52), field * edgeBias * textDim * 0.85);
}
`;

// CARD 4 - LIQUID METAL (rose base + bright pink-rose peak)
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

  // ROSE chromatic shift: deep rose → bright pink peak
  vec3 colorBase = vec3(0.55, 0.15, 0.25);   // #8c2640 deep rose
  vec3 colorPeak = vec3(1.0, 0.55, 0.70);    // #ff8cb3 bright pink-rose
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

    // Dev-resilience: przy >16 kontekstach Chrome wyrzuca najstarszy - odzyskaj zamiast gasnąć
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
// ═══════════════════════════════════════════════════════════════════════════════
// MAKIETA - DŁUGA PODRÓŻ + 3 STYLE (toggle)
// PRZYKŁADOWA premium strona (placeholder content - jak makiety one-page/wordpress):
// Strona główna (wiele sekcji) → Oferta → Realizacje → Logowanie (pojawia się) → Panel.
// Treść jest GENERYCZNA (Nagłówek sekcji / Projekt 01 / Element pierwszy), NIE opis usługi.
// Design celowo bardziej premium / editorial niż wariant firmowy (efekt wow, custom React).
// Każda strona = renderer (mode, style) => JSX (wire/blue) → 1:1 z definicji.
// ═══════════════════════════════════════════════════════════════════════════════

type Mode = 'wire' | 'blue';

// Iridescent SYNCED flow (jak bento UI/UX) - każdy kafel renderuje swój WYCINEK jednej globalnej
// kompozycji (u_offset/u_global_size + wspólny SHARED_T0) => spójny flow przez kafle, a GAPY zostają
// ciemne (shader tylko na boxach, nie poza nimi). Paleta rose.
const SHARED_T0 = typeof performance !== 'undefined' ? performance.now() : 0;

const DEPTH_SYNCED_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_offset;
uniform vec2 u_global_size;
uniform float u_time;
void main(){
  vec2 globalCoord = gl_FragCoord.xy + u_offset;
  vec2 uv = globalCoord / u_global_size;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_global_size.x / u_global_size.y;
  float t = u_time * 0.12;
  // WIELOKIERUNKOWY liquid - każda warstwa płynie w INNĄ stronę + komponent rotacyjny (swirl),
  // brak jednego dominującego dryfu (ciecz wiruje organicznie we wszystkie strony)
  vec2 a = p;
  a += 0.55 * vec2(sin(p.y * 1.3 + t * 0.80),       cos(p.x * 1.1 - t * 0.60));        // dryf prawo-góra
  a += 0.40 * vec2(sin(p.y * 2.1 - t * 1.10 + 1.7), cos(p.x * 1.9 + t * 0.90 + 0.6));  // przeciwbieżnie lewo-dół
  float ang = t * 0.50 + length(p) * 1.2;                                              // rotacja zależna od promienia
  a += 0.28 * vec2(cos(ang + p.y * 2.4),            sin(ang - p.x * 2.2));             // swirl / curl
  a += 0.16 * vec2(sin(p.x * 3.6 - t * 1.40 + 2.0), cos(p.y * 4.0 + t * 1.60));        // drobne szybkie zawirowania
  // dwa niezależne pola z przeciwnym kierunkiem czasu
  float v  = sin(a.x * 2.0 + a.y * 1.6 + t * 0.30) * 0.5 + 0.5;
  float v2 = sin(a.y * 2.4 - a.x * 1.3 - t * 0.40) * 0.5 + 0.5;
  // ostre specular peaks z dwóch przeciwbieżnych pól
  float spec  = pow(max(0.0, sin(a.x * 3.0 + a.y * 2.0 + t * 0.50)), 6.0);
  float spec2 = pow(max(0.0, sin(a.y * 2.6 - a.x * 1.7 - t * 0.40)), 12.0);
  float base = mix(v, v2, 0.5);
  float depth = smoothstep(0.0, 1.0, base);
  // paleta rose: GŁĘBOKIE ciemne wgłębienie -> środkowa rose -> jasny pink peak
  vec3 cDeep = vec3(0.16, 0.02, 0.09);
  vec3 cMid  = vec3(0.74, 0.16, 0.32);
  vec3 cPeak = vec3(1.0, 0.62, 0.74);
  vec3 col = mix(cDeep, cMid, depth);
  col = mix(col, cPeak, clamp(spec*0.95 + spec2*0.6, 0.0, 1.0));
  // ambient-occlusion vignette w global space - krawędzie ciemnieją (głębia)
  float ao = smoothstep(2.0, 0.3, length(p * vec2(0.85, 1.0)));
  col *= 0.50 + 0.50*ao;
  col = max(col, vec3(0.03, 0.005, 0.02));
  gl_FragColor = vec4(col, 0.94);
}
`;

// Canvas synced - mierzy swój wycinek względem najbliższego [data-synced] (siatka galerii),
// wspólny SHARED_T0 => wszystkie kafle w lock-step. 30fps, DPR clamp, IO pauza, dev-resilience.
const SyncedShaderCanvas = ({ fragmentShader }: { fragmentShader: string }) => {
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
    const grid = (canvas.closest('[data-synced]') as HTMLElement) || canvas.parentElement;
    if (!grid) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn('Synced compile:', gl.getShaderInfoLog(sh)); gl.deleteShader(sh); return null; }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, SHADER_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Synced link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uOff = gl.getUniformLocation(program, 'u_offset');
    const uGlob = gl.getUniformLocation(program, 'u_global_size');

    let offX = 0, offY = 0, gW = 1, gH = 1;
    const measure = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
      const cr = canvas.getBoundingClientRect();
      const gr = grid.getBoundingClientRect();
      const w = cr.width * dpr, h = cr.height * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      offX = (cr.left - gr.left) * dpr;
      offY = (gr.bottom - cr.bottom) * dpr;
      gW = Math.max(1, gr.width * dpr); gH = Math.max(1, gr.height * dpr);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(grid); ro.observe(canvas);
    window.addEventListener('resize', measure);

    const FRAME = 1000 / 30; let last = 0;
    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - last >= FRAME) {
        last = ts;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, (ts - SHARED_T0) / 1000);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uOff) gl.uniform2f(uOff, offX, offY);
        if (uGlob) gl.uniform2f(uGlob, gW, gH);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !runningRef.current) { runningRef.current = true; draw(); }
      else if (!en.isIntersecting && runningRef.current) { runningRef.current = false; cancelAnimationFrame(rafRef.current); }
    }, { rootMargin: '100px' });
    io.observe(canvas);

    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const onRestored = () => { setCanvasKey((k) => k + 1); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('resize', measure);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [fragmentShader, canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};

// Shader FX dla bloku media - renderowany TYLKO w warstwie blueprint (wireframe = pusty placeholder)
// + gate reduced-motion. inset-px = 1px bufor (brak prześwitu w rogach). Reuse ShaderCanvas (IO pauza, 30fps, DPR clamp).
const Fx = ({ m, fx, shader }: { m: Mode; fx: boolean; shader: string }) =>
  m === 'blue' && fx ? (
    <div className="absolute inset-px overflow-hidden pointer-events-none" aria-hidden="true">
      <ShaderCanvas fragmentShader={shader} />
    </div>
  ) : null;

// Token tekstu: 'wire' = transparentny placeholder, 'blue' = realny kolor.
function T({ m, tone = 'h', children }: { m: Mode; tone?: 'h' | 's' | 'm' | 'a'; children: ReactNode }) {
  const blue = tone === 'h' ? 'text-white' : tone === 's' ? 'text-slate-300' : tone === 'm' ? 'text-slate-400' : 'text-rose-300';
  const wireBg = tone === 'h' || tone === 'a' ? 'bg-white/10' : 'bg-white/5';
  return <span className={`inline-block ${m === 'wire' ? `text-transparent ${wireBg} rounded` : blue}`}>{children}</span>;
}

interface Style {
  id: string;
  label: string;
  center: boolean;
  heroH: string;
  secH: string;
  gap: string;
  btn: (m: Mode) => string;
  card: (m: Mode) => string;
}

// Jedna wersja - minimal (toggle usunięty).
const STYLE: Style = {
  id: 'minimal', label: 'Minimal', center: true,
  heroH: 'text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.02em] leading-[1.06]',
  secH: 'text-xl sm:text-2xl md:text-4xl font-medium tracking-[-0.01em] leading-[1.15]',
  gap: 'gap-12 sm:gap-16 md:gap-36',
  btn: (m) => `px-6 py-3 rounded-full text-xs md:text-sm font-semibold border ${m === 'wire' ? 'border-white/15' : 'border-rose-400/50 text-rose-200'}`,
  card: (m) => `rounded-3xl border ${m === 'wire' ? 'border-white/10 bg-white/[0.02]' : 'border-rose-500/15 bg-white/[0.015]'}`,
};

const URLS = ['twoja-marka.pl', 'twoja-marka.pl/oferta', 'twoja-marka.pl/realizacje', 'twoja-marka.pl/panel', 'twoja-marka.pl/panel'];

const al = (s: Style) => (s.center ? 'items-center text-center mx-auto' : 'items-start text-left');

// Eyebrow - editorialowy numerek sekcji (premium, generyczny)
const Eyebrow = ({ m, children }: { m: Mode; children: ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className={`h-px w-8 ${m === 'wire' ? 'bg-white/15' : 'bg-rose-400/50'}`} />
    <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase"><T m={m} tone="a">{children}</T></span>
  </div>
);

// Premium media placeholder - głębia + akcent (sygnał custom build, nie WP theme)
const media = (m: Mode, s: Style, extra = '') =>
  `relative overflow-hidden ${s.card(m)} ${extra} ${m === 'blue' ? 'shadow-[0_24px_70px_-28px_rgba(244,63,94,0.35)]' : ''}`;
const Accent = ({ m }: { m: Mode }) =>
  m === 'blue' ? <div className="absolute -top-1/3 -right-1/4 w-2/3 h-2/3 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" /> : null;

// ── FAZA 1: STRONA GŁÓWNA (długa premium, wiele sekcji) ────────────────────────
const homePage = (m: Mode, s: Style, fx = false) => (
  <div className={`w-full flex flex-col ${s.gap}`}>

    {/* HERO - editorial asymetryczny / wyśrodkowany wg stylu */}
    {s.center ? (
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center text-center gap-7">
        <Eyebrow m={m}>Premium ⁄ 2026</Eyebrow>
        <h2 className={`${s.heroH} max-w-4xl`}><T m={m}>Twoja marka</T> <T m={m} tone="a">w nowym świetle.</T></h2>
        <p className="text-base md:text-xl max-w-xl leading-relaxed"><T m={m} tone="s">Krótki opis wartości, jednym zdaniem, które buduje pierwsze wrażenie.</T></p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
          <span className={s.btn(m)}><T m={m}>Główny przycisk</T></span>
          <span className="px-6 py-3 rounded-full border border-white/15 text-xs md:text-sm font-bold"><T m={m}>Zobacz więcej</T></span>
        </div>
        <div className={`${media(m, s, 'mt-6')} w-full aspect-[16/8]`}><Fx m={m} fx={fx} shader={WARP_FS} /><Accent m={m} /></div>
      </div>
    ) : (
      <div className="max-w-6xl w-full grid md:grid-cols-12 gap-8 md:gap-12 items-end">
        <div className="md:col-span-7 flex flex-col gap-6">
          <Eyebrow m={m}>Premium ⁄ 2026</Eyebrow>
          <h2 className={s.heroH}><T m={m}>Twoja marka</T><br /><T m={m} tone="a">w nowym świetle.</T></h2>
          <p className="text-base md:text-xl max-w-md leading-relaxed"><T m={m} tone="s">Krótki opis wartości, jednym zdaniem, które buduje pierwsze wrażenie.</T></p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className={s.btn(m)}><T m={m}>Główny przycisk</T></span>
            <span className="px-6 py-3 rounded-full border border-white/15 text-xs md:text-sm font-bold"><T m={m}>Zobacz więcej</T></span>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className={`${media(m, s)} aspect-[3/4]`}><Accent m={m} /></div>
        </div>
      </div>
    )}

    {/* PASEK ZAUFANIA - abstrakcyjne logotypy (premium, bez tekstu) */}
    <div className="max-w-5xl w-full mx-auto flex flex-col items-center gap-5">
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase"><T m={m} tone="m">Zaufali nam</T></span>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {[20, 14, 24, 16, 22].map((w, i) => (
          <div key={i} className={`h-4 rounded ${m === 'wire' ? 'bg-white/8' : 'bg-white/15'}`} style={{ width: w * 4 }} />
        ))}
      </div>
    </div>

    {/* 01 - SEKCJA: asymetryczny obraz + tekst */}
    <div className="max-w-6xl w-full mx-auto grid md:grid-cols-12 gap-8 md:gap-12 items-center">
      <div className={`md:col-span-6 ${media(m, s)} aspect-[5/4]`}><Fx m={m} fx={fx} shader={WARP_FS} /><Accent m={m} /></div>
      <div className={`md:col-span-6 flex flex-col gap-5 ${s.center ? 'items-center text-center' : 'items-start text-left'}`}>
        <Eyebrow m={m}>01 - Sekcja</Eyebrow>
        <h3 className={s.secH}><T m={m}>Nagłówek sekcji</T></h3>
        <p className="text-sm md:text-lg max-w-md leading-relaxed"><T m={m} tone="s">Krótki opis sekcji w dwóch zdaniach. Druga myśl, która rozwija kontekst i prowadzi dalej.</T></p>
        <span className={s.btn(m)}><T m={m}>Dowiedz się więcej</T></span>
      </div>
    </div>

    {/* 02 - SEKCJA: trzy elementy */}
    <div className={`max-w-5xl w-full mx-auto flex flex-col gap-8 md:gap-10 ${al(s)}`}>
      <div className={`flex flex-col gap-4 ${s.center ? 'items-center' : 'items-start'}`}>
        <Eyebrow m={m}>02 - Zakres</Eyebrow>
        <h3 className={s.secH}><T m={m}>Nagłówek sekcji</T></h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {['Element pierwszy', 'Element drugi', 'Element trzeci'].map((t, i) => (
          <div key={t} className={`${s.card(m)} p-6 md:p-7 flex flex-col gap-4 text-left`}>
            <span className="font-mono text-xs tracking-[0.2em]"><T m={m} tone="a">{`0${i + 1}`}</T></span>
            <div className="text-base md:text-lg font-bold"><T m={m}>{t}</T></div>
            <div className="text-xs md:text-sm leading-relaxed"><T m={m} tone="m">Krótki opis elementu w jednym lub dwóch zdaniach.</T></div>
          </div>
        ))}
      </div>
    </div>

    {/* 03 - REALIZACJE teaser: featured + dwa mniejsze */}
    <div className={`max-w-6xl w-full mx-auto flex flex-col gap-8 ${al(s)}`}>
      <div className={`flex flex-col gap-4 ${s.center ? 'items-center' : 'items-start'}`}>
        <Eyebrow m={m}>03 - Realizacje</Eyebrow>
        <h3 className={s.secH}><T m={m}>Wybrane projekty</T></h3>
      </div>
      <div className="grid md:grid-cols-12 gap-4 md:gap-5 w-full">
        <div className={`md:col-span-7 ${media(m, s)} aspect-[16/10] flex flex-col justify-end p-6`}>
          <Fx m={m} fx={fx} shader={LIQUID_METAL_FS} />
          <Accent m={m} />
          <div className="relative z-10 text-base md:text-xl font-bold"><T m={m}>Projekt 01</T></div>
          <div className="relative z-10 text-xs md:text-sm"><T m={m} tone="m">Kategoria</T></div>
        </div>
        <div className="md:col-span-5 flex flex-col gap-4 md:gap-5">
          {['Projekt 02', 'Projekt 03'].map((p) => (
            <div key={p} className={`flex-1 ${media(m, s)} flex flex-col justify-end p-5`}>
              <div className="text-sm md:text-base font-bold"><T m={m}>{p}</T></div>
              <div className="text-xs"><T m={m} tone="m">Kategoria</T></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* STATY */}
    <div className={`max-w-5xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 ${m === 'wire' ? 'border-y border-white/8' : 'border-y border-rose-500/15'} py-10 md:py-14`}>
      {[['100+', 'Etykieta'], ['12', 'Etykieta'], ['99', 'Etykieta'], ['24/7', 'Etykieta']].map(([n, l], i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-center">
          <span className="text-3xl md:text-5xl font-bold tracking-tight"><T m={m} tone="a">{n}</T></span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase"><T m={m} tone="m">{l}</T></span>
        </div>
      ))}
    </div>

    {/* OPINIA */}
    <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-6">
      <span className={`text-5xl leading-none ${m === 'wire' ? 'text-white/15' : 'text-rose-400/40'}`}>&ldquo;</span>
      <blockquote className="text-xl md:text-3xl font-medium leading-snug"><T m={m}>Tu znajdzie się krótka opinia. Mocny cytat, który buduje zaufanie do marki.</T></blockquote>
      <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase"><T m={m} tone="m">- Imię Nazwisko, Stanowisko</T></span>
    </div>

    {/* CTA zamykające */}
    <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-6 pb-4">
      <h3 className={s.secH}><T m={m}>Zaczynamy?</T></h3>
      <span className={s.btn(m)}><T m={m}>Główny przycisk</T></span>
    </div>
  </div>
);

// ── FAZA 2: OFERTA (podstrona - rozbudowana) ──────────────────────────────────
const offerPage = (m: Mode, s: Style) => (
  <div className={`w-full flex flex-col ${s.gap}`}>

    {/* Intro */}
    <div className={`max-w-5xl w-full flex flex-col gap-5 ${al(s)}`}>
      <Eyebrow m={m}>Oferta</Eyebrow>
      <h2 className={`${s.secH} max-w-3xl`}><T m={m}>Tytuł oferty</T> <T m={m} tone="a">w jednym zdaniu.</T></h2>
      <p className={`text-sm md:text-lg max-w-xl leading-relaxed ${s.center ? 'mx-auto' : ''}`}><T m={m} tone="s">Krótki opis oferty w dwóch zdaniach. Co znajdzie odbiorca i dlaczego warto.</T></p>
    </div>

    {/* Pakiety z ceną */}
    <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {['Pakiet I', 'Pakiet II', 'Pakiet III'].map((t, i) => (
        <div key={t} className={`${s.card(m)} p-6 md:p-8 flex flex-col gap-5 ${i === 1 && m === 'blue' ? 'ring-1 ring-rose-500/40' : ''}`}>
          <div className="flex items-baseline justify-between">
            <div className="text-base md:text-lg font-bold"><T m={m}>{t}</T></div>
            <span className="font-mono text-xs"><T m={m} tone="a">{`0${i + 1}`}</T></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-bold"><T m={m}>od 0 000</T></span>
            <span className="text-xs"><T m={m} tone="m">zł</T></span>
          </div>
          <div className="flex flex-col gap-2.5 flex-1 mt-1">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs leading-relaxed">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/15' : 'bg-rose-400/70'}`} />
                <T m={m} tone="m">Element pakietu</T>
              </div>
            ))}
          </div>
          <span className={s.btn(m)}><T m={m}>Wybierz pakiet</T></span>
        </div>
      ))}
    </div>

    {/* Proces - 4 kroki */}
    <div className={`max-w-5xl w-full mx-auto flex flex-col gap-8 md:gap-10 ${al(s)}`}>
      <div className={`flex flex-col gap-3 ${s.center ? 'items-center' : 'items-start'}`}>
        <Eyebrow m={m}>Proces</Eyebrow>
        <h3 className={s.secH}><T m={m}>Jak pracujemy</T></h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 w-full">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 text-left">
            <span className="text-3xl md:text-5xl font-bold leading-none"><T m={m} tone="a">{`0${i + 1}`}</T></span>
            <div className="text-sm md:text-base font-bold"><T m={m}>Etap procesu</T></div>
            <div className="text-xs md:text-sm leading-relaxed"><T m={m} tone="m">Krótki opis kroku w jednym zdaniu.</T></div>
          </div>
        ))}
      </div>
    </div>

    {/* Co obejmuje - lista 2 kolumny */}
    <div className={`max-w-5xl w-full mx-auto flex flex-col gap-8 ${al(s)}`}>
      <div className={`flex flex-col gap-3 ${s.center ? 'items-center' : 'items-start'}`}>
        <Eyebrow m={m}>Zakres</Eyebrow>
        <h3 className={s.secH}><T m={m}>Co obejmuje</T></h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`${s.card(m)} px-5 py-4 flex items-center gap-4`}>
            <span className={`w-9 h-9 rounded-xl shrink-0 ${m === 'wire' ? 'bg-white/8' : 'bg-rose-500/15 border border-rose-500/25'}`} />
            <div className="flex flex-col gap-1 text-left">
              <div className="text-sm font-bold"><T m={m}>Element oferty</T></div>
              <div className="text-xs leading-relaxed"><T m={m} tone="m">Krótki opis w jednym zdaniu.</T></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-6 pb-4">
      <h3 className={s.secH}><T m={m}>Porozmawiajmy o szczegółach</T></h3>
      <span className={s.btn(m)}><T m={m}>Główny przycisk</T></span>
    </div>
  </div>
);
// ── FAZA 3: REALIZACJE (podstrona - rozbudowana) ──────────────────────────────
const worksPage = (m: Mode, s: Style, fx = false) => (
  <div className={`w-full flex flex-col ${s.gap}`}>

    {/* Intro */}
    <div className={`max-w-5xl w-full flex flex-col gap-5 ${al(s)}`}>
      <Eyebrow m={m}>Realizacje</Eyebrow>
      <h2 className={`${s.secH} max-w-3xl`}><T m={m}>Wybrane</T> <T m={m} tone="a">projekty.</T></h2>
      <p className={`text-sm md:text-lg max-w-xl leading-relaxed ${s.center ? 'mx-auto' : ''}`}><T m={m} tone="s">Krótki opis sekcji realizacji. Co łączy prezentowane projekty i jaki dają efekt.</T></p>
    </div>

    {/* Featured case study - asymetryczny + wyniki */}
    <div className="max-w-6xl w-full mx-auto grid md:grid-cols-12 gap-8 md:gap-10 items-center">
      <div className={`md:col-span-7 ${media(m, s)} aspect-[16/10]`}><Fx m={m} fx={fx} shader={LIQUID_METAL_FS} /><Accent m={m} /></div>
      <div className={`md:col-span-5 flex flex-col gap-5 ${s.center ? 'items-center text-center' : 'items-start text-left'}`}>
        <span className="font-mono text-xs tracking-[0.2em]"><T m={m} tone="a">Projekt 01</T></span>
        <h3 className={s.secH}><T m={m}>Nazwa projektu</T></h3>
        <p className="text-sm md:text-base max-w-md leading-relaxed"><T m={m} tone="s">Krótki opis realizacji w dwóch zdaniach. Wyzwanie, podejście i rezultat.</T></p>
        <div className="flex gap-8">
          {[['+00%', 'Etykieta'], ['00', 'Etykieta']].map(([n, l], i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-bold"><T m={m} tone="a">{n}</T></span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase"><T m={m} tone="m">{l}</T></span>
            </div>
          ))}
        </div>
        <span className={s.btn(m)}><T m={m}>Zobacz case study</T></span>
      </div>
    </div>

    {/* Galeria - równa siatka: wszystkie kafle identyczne (aspect-[4/3]), bez col-span → zero luk.
        Synced shader per-kafel mierzy pozycję względem [data-synced] → spójny flow, shader tylko na boxach. */}
    <div data-synced className="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {[2, 3, 4, 5, 6, 7].map((n) => (
        <div key={n} className={`relative overflow-hidden rounded-2xl border aspect-[4/3] ${m === 'wire' ? 'border-white/12 bg-white/[0.03]' : 'border-rose-500/30 bg-[#0a0a0a]'} flex flex-col justify-end p-5`}>
          {m === 'blue' && fx && <div className="absolute inset-px overflow-hidden pointer-events-none" aria-hidden="true"><SyncedShaderCanvas fragmentShader={DEPTH_SYNCED_FS} /></div>}
          <div className="relative z-10 text-sm md:text-base font-bold"><T m={m}>{`Projekt 0${n}`}</T></div>
          <div className="relative z-10 text-[11px]"><T m={m} tone="m">Kategoria</T></div>
        </div>
      ))}
    </div>

    {/* Pasek wyników */}
    <div className={`max-w-5xl w-full mx-auto grid grid-cols-3 gap-6 ${m === 'wire' ? 'border-y border-white/8' : 'border-y border-rose-500/15'} py-10 md:py-12`}>
      {[['00+', 'Etykieta'], ['00%', 'Etykieta'], ['00', 'Etykieta']].map(([n, l], i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-center">
          <span className="text-3xl md:text-5xl font-bold tracking-tight"><T m={m} tone="a">{n}</T></span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase"><T m={m} tone="m">{l}</T></span>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-6 pb-4">
      <h3 className={s.secH}><T m={m}>Twój projekt może być następny</T></h3>
      <span className={s.btn(m)}><T m={m}>Główny przycisk</T></span>
    </div>
  </div>
);
// ── FAZA 4: LOGOWANIE (pojawia się samo, route /panel) ─────────────────────────
const loginPage = (m: Mode, s: Style) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className={`w-full max-w-sm ${s.card(m)} p-7 md:p-9 flex flex-col gap-5 ${m === 'blue' ? 'shadow-[0_30px_80px_-30px_rgba(244,63,94,0.4)]' : ''}`}>
      <div className="flex flex-col gap-1.5 text-center">
        <div className={`w-10 h-10 rounded-xl mx-auto mb-2 ${m === 'wire' ? 'bg-white/10' : 'bg-rose-500/20 border border-rose-500/30'}`} />
        <div className="text-lg md:text-xl font-bold"><T m={m}>Panel</T></div>
        <div className="text-xs"><T m={m} tone="m">Zaloguj się, aby kontynuować</T></div>
      </div>
      {['Adres e-mail', 'Hasło'].map((lbl) => (
        <div key={lbl} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase"><T m={m} tone="m">{lbl}</T></span>
          <div className={`rounded-lg border px-3 py-2.5 ${m === 'wire' ? 'border-white/12 bg-white/[0.03]' : 'border-rose-500/20 bg-white/[0.02]'}`}>
            <div className={`h-2 rounded-sm w-2/3 ${m === 'wire' ? 'bg-white/10' : 'bg-rose-400/30'}`} />
          </div>
        </div>
      ))}
      <span className={`${s.btn(m)} text-center`}><T m={m}>Zaloguj się</T></span>
    </div>
  </div>
);

// ── FAZA 5: PANEL HEADLESS (studio - zarządzanie treścią) ─────────────────────
const panelPage = (m: Mode, s: Style) => (
  <div className="w-full max-w-5xl mx-auto">
    <div className={`${s.card(m)} overflow-hidden ${m === 'blue' ? 'shadow-[0_40px_100px_-30px_rgba(244,63,94,0.4)]' : ''}`}>

      {/* Topbar */}
      <div className={`flex items-center justify-between px-5 md:px-6 py-3.5 border-b ${m === 'wire' ? 'border-white/10 bg-white/[0.02]' : 'border-rose-500/20 bg-rose-500/[0.04]'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${m === 'wire' ? 'bg-white/10' : 'bg-rose-500/20 border border-rose-500/30'}`}>
            <div className={`w-2.5 h-2.5 rounded-sm ${m === 'wire' ? 'bg-white/30' : 'bg-rose-400'}`} />
          </div>
          <span className="font-mono text-[11px] md:text-xs tracking-[0.15em]"><T m={m} tone="s">Studio</T></span>
          <span className="hidden sm:flex items-center gap-2 text-[11px]"><span className="opacity-40">/</span><T m={m} tone="m">Usługi</T></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.15em] uppercase"><T m={m} tone="m">Zapisano</T></span>
          <div className={`w-7 h-7 rounded-full ${m === 'wire' ? 'bg-white/10' : 'bg-rose-500/20 border border-rose-500/30'}`} />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-12">
        {/* Sidebar - kolekcje treści */}
        <aside className={`col-span-4 md:col-span-3 border-r p-3 md:p-5 flex flex-col gap-1.5 ${m === 'wire' ? 'border-white/10' : 'border-rose-500/15'}`}>
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2 hidden md:block"><T m={m} tone="m">Kolekcje</T></div>
          {['Usługi', 'Realizacje', 'Wpisy', 'Media', 'Ustawienia'].map((d, i) => (
            <div key={d} className={`flex items-center gap-2.5 rounded-lg px-2 md:px-3 py-2 ${i === 0 ? (m === 'wire' ? 'bg-white/[0.06]' : 'bg-rose-500/15') : ''}`}>
              <span className={`w-4 h-4 rounded shrink-0 ${i === 0 ? (m === 'wire' ? 'bg-white/30' : 'bg-rose-400') : (m === 'wire' ? 'bg-white/10' : 'bg-white/15')}`} />
              <span className="text-xs hidden md:inline"><T m={m} tone={i === 0 ? 'a' : 'm'}>{d}</T></span>
            </div>
          ))}
        </aside>

        {/* Main - kolekcja "Usługi": lista pozycji + Dodaj */}
        <section className="col-span-8 md:col-span-9 p-5 md:p-7 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-base md:text-lg font-bold"><T m={m}>Usługi</T></span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase"><T m={m} tone="m">4 pozycje</T></span>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[11px] md:text-xs font-bold shrink-0 ${m === 'wire' ? 'bg-rose-500/30 text-transparent' : 'bg-rose-500 text-white'}`}>+ Dodaj usługę</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center gap-3 md:gap-4 rounded-xl border px-4 py-3.5 ${m === 'wire' ? 'border-white/12 bg-white/[0.03]' : 'border-rose-500/20 bg-white/[0.02]'}`}>
                <span className={`w-1 h-6 rounded-full shrink-0 ${m === 'wire' ? 'bg-white/15' : 'bg-rose-400/60'}`} />
                <span className={`w-8 h-8 rounded-lg shrink-0 ${m === 'wire' ? 'bg-white/8' : 'bg-rose-500/15 border border-rose-500/25'}`} />
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="text-sm font-bold"><T m={m}>{`Usługa 0${i + 1}`}</T></div>
                  <div className="text-[11px] leading-relaxed hidden sm:block"><T m={m} tone="m">Krótki opis pozycji</T></div>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider ${i === 0 ? (m === 'wire' ? 'bg-white/10 text-transparent' : 'bg-rose-500/15 text-rose-300') : (m === 'wire' ? 'bg-white/5 text-transparent' : 'bg-white/5 text-slate-400')}`}>{i === 0 ? 'Live' : 'Szkic'}</span>
                <span className={`shrink-0 text-lg leading-none ${m === 'wire' ? 'text-white/20' : 'text-slate-500'}`}>···</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export function DedicatedWebsiteClient() {
    // a11y reduce motion (shadery włączone na mobile z DPR 1.0, desktop z DPR 1.5/1.25)
    const shouldReduceMotion = useReducedMotion() ?? false;
    const s = STYLE;
    const fx = !shouldReduceMotion;

    // Pomiar pozycji linków nav makiety → kursor klika dokładnie w ich środek (działa cross-width).
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const navLinkRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [linkX, setLinkX] = useState<[number, number, number]>([78, 87, 93]);
    const [navY, setNavY] = useState(5);
    useEffect(() => {
      const measure = () => {
        const vp = viewportRef.current;
        if (!vp) return;
        const vr = vp.getBoundingClientRect();
        if (vr.width < 2 || vr.height < 2) return;
        const xs = ([0, 1, 2] as const).map((i) => {
          const el = navLinkRefs.current[i];
          if (!el) return [78, 87, 93][i];
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

    // ── ANIMACJA 1: MAKIETA - DŁUGA PODRÓŻ (home → oferta → realizacje → login → panel) ──
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: mainProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
    const smoothMain = useSpring(mainProgress, { stiffness: 140, damping: 38, restDelta: 0.0005 });
    const raysOpacity = useTransform(smoothMain, [0.9, 1], [1, 0]);

    // Wejście okna + pasek postępu przeglądarki
    const scale       = useTransform(smoothMain, [0, 0.05], [0.85, 1]);
    const rotateX     = useTransform(smoothMain, [0, 0.05], [15, 0]);
    const mockOpacity = useTransform(smoothMain, [0, 0.04], [0.3, 1]);
    const progressBar = useTransform(smoothMain, [0.05, 0.97], ['0%', '100%']);

    // Crossfade faz
    const homeOpacity  = useTransform(smoothMain, [0, 0.22, 0.24, 1], [1, 1, 0, 0]);
    const offerOpacity = useTransform(smoothMain, [0, 0.24, 0.26, 0.44, 0.46, 1], [0, 0, 1, 1, 0, 0]);
    const worksOpacity = useTransform(smoothMain, [0, 0.46, 0.48, 0.64, 0.66, 1], [0, 0, 1, 1, 0, 0]);
    const loginOpacity = useTransform(smoothMain, [0, 0.68, 0.70, 0.82, 0.84, 1], [0, 0, 1, 1, 0, 0]);
    const panelOpacity = useTransform(smoothMain, [0, 0.87, 0.89, 1], [0, 0, 1, 1]);

    // Pionowy scroll wewnątrz długich faz (home najdłuższa)
    const homeY  = useTransform(smoothMain, [0.05, 0.22], ['0%', '-66%']);
    const offerY = useTransform(smoothMain, [0.27, 0.44], ['0%', '-60%']);
    const worksY = useTransform(smoothMain, [0.51, 0.64], ['0%', '-60%']);

    // Loader przed panelem
    const loaderOpacity = useTransform(smoothMain, [0, 0.83, 0.85, 0.87, 0.89, 1], [0, 0, 1, 1, 0, 0]);

    // Nawigacja makiety znika przy logowaniu/panelu (to inny "ekran")
    const navOpacity = useTransform(smoothMain, [0, 0.64, 0.68], [1, 1, 0]);

    // URL bar - 4 trasy (login + panel dzielą /panel)
    const urlHome  = useTransform(smoothMain, [0, 0.22, 0.24], [1, 1, 0]);
    const urlOffer = useTransform(smoothMain, [0.24, 0.26, 0.44, 0.46], [0, 1, 1, 0]);
    const urlWorks = useTransform(smoothMain, [0.46, 0.48, 0.66, 0.68], [0, 1, 1, 0]);
    const urlPanel = useTransform(smoothMain, [0.66, 0.68, 1], [0, 1, 1]);

    // Kursor - klika linki nawigacji (Oferta ~0.23, Realizacje ~0.47); logowanie pojawia się SAMO (kursor już zniknął)
    // Kursor - logika z strona-firmowa: 2 cykle (pojaw → lot do linku → klik → schowaj → reset → pojaw → lot → klik).
    // Pozycje X/Y wzięte z POMIARU środka linków nav (linkX/navY) → klik dokładnie w środek.
    const cursorOpacity = useTransform(smoothMain,
      [0, 0.15, 0.17, 0.25, 0.27, 0.39, 0.41, 0.48, 0.50, 1],
      [0,    0,    1,    1,    0,    0,    1,    1,    0,    0]);
    const cursorX = useTransform(smoothMain,
      [0, 0.15, 0.20, 0.23, 0.27, 0.39, 0.44, 0.46, 1],
      ['50%', '50%', `${linkX[1]}%`, `${linkX[1]}%`, `${linkX[1]}%`, '50%', `${linkX[2]}%`, `${linkX[2]}%`, `${linkX[2]}%`]);
    const cursorY = useTransform(smoothMain,
      [0, 0.15, 0.20, 0.23, 0.27, 0.39, 0.44, 0.46, 1],
      ['72%', '72%', `${navY}%`, `${navY}%`, `${navY}%`, '72%', `${navY}%`, `${navY}%`, `${navY}%`]);
    const cursorScale = useTransform(smoothMain,
      [0, 0.215, 0.225, 0.235, 0.45, 0.46, 0.47, 1],
      [1, 1, 0.8, 1, 1, 0.8, 1, 1]);

    // Aktywne linki nawigacji (Home / Oferta / Realizacje)
    const link0Active   = useTransform(smoothMain, [0, 0.23, 0.24, 1], [1, 1, 0, 0]);
    const link0Inactive = useTransform(smoothMain, [0, 0.23, 0.24, 1], [0, 0, 1, 1]);
    const link1Active   = useTransform(smoothMain, [0, 0.23, 0.24, 0.46, 0.47, 1], [0, 0, 1, 1, 0, 0]);
    const link1Inactive = useTransform(smoothMain, [0, 0.23, 0.24, 0.46, 0.47, 1], [1, 1, 0, 0, 1, 1]);
    const link2Active   = useTransform(smoothMain, [0, 0.46, 0.47, 1], [0, 0, 1, 1]);
    const link2Inactive = useTransform(smoothMain, [0, 0.46, 0.47, 1], [1, 1, 0, 0]);

    // ── PER-PHASE WIREFRAME → BLUEPRINT REVEAL (raw mainProgress, bez spring) ──────
    // HOME reveal (0.02-0.10)
    const homeReveal = useTransform(mainProgress, [0.02, 0.10], [0, 105]);
    const homeLead = useTransform(homeReveal, (v) => v - 3);
    const homeTrail = useTransform(homeReveal, (v) => v + 3);
    const homeWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${homeLead}%, black ${homeTrail}%)`;
    const homeBlueMask = useMotionTemplate`linear-gradient(to top left, black ${homeLead}%, transparent ${homeTrail}%)`;
    const homeBS1 = useTransform(homeReveal, (v) => v - 15);
    const homeBS2 = useTransform(homeReveal, (v) => v - 8);
    const homeBS3 = useTransform(homeReveal, (v) => v - 2.5);
    const homeBS4 = useTransform(homeReveal, (v) => v);
    const homeBS5 = useTransform(homeReveal, (v) => v + 3);
    const homeBS6 = useTransform(homeReveal, (v) => v + 10);
    const homeBS7 = useTransform(homeReveal, (v) => v + 17);
    const homeBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${homeBS1}%, rgba(0,0,0,0.15) ${homeBS2}%, rgba(0,0,0,0.55) ${homeBS3}%, rgba(0,0,0,1) ${homeBS4}%, rgba(0,0,0,0.55) ${homeBS5}%, rgba(0,0,0,0.15) ${homeBS6}%, transparent ${homeBS7}%)`;
    const homeBeamOpacity = useTransform(mainProgress, [0.02, 0.025, 0.095, 0.10], [0, 1, 1, 0]);

    // OFERTA reveal (0.27-0.35)
    const offerReveal = useTransform(mainProgress, [0.27, 0.35], [0, 105]);
    const offerLead = useTransform(offerReveal, (v) => v - 3);
    const offerTrail = useTransform(offerReveal, (v) => v + 3);
    const offerWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${offerLead}%, black ${offerTrail}%)`;
    const offerBlueMask = useMotionTemplate`linear-gradient(to top left, black ${offerLead}%, transparent ${offerTrail}%)`;
    const offerBS1 = useTransform(offerReveal, (v) => v - 15);
    const offerBS2 = useTransform(offerReveal, (v) => v - 8);
    const offerBS3 = useTransform(offerReveal, (v) => v - 2.5);
    const offerBS4 = useTransform(offerReveal, (v) => v);
    const offerBS5 = useTransform(offerReveal, (v) => v + 3);
    const offerBS6 = useTransform(offerReveal, (v) => v + 10);
    const offerBS7 = useTransform(offerReveal, (v) => v + 17);
    const offerBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${offerBS1}%, rgba(0,0,0,0.15) ${offerBS2}%, rgba(0,0,0,0.55) ${offerBS3}%, rgba(0,0,0,1) ${offerBS4}%, rgba(0,0,0,0.55) ${offerBS5}%, rgba(0,0,0,0.15) ${offerBS6}%, transparent ${offerBS7}%)`;
    const offerBeamOpacity = useTransform(mainProgress, [0.27, 0.275, 0.345, 0.35], [0, 1, 1, 0]);

    // REALIZACJE reveal (0.51-0.59)
    const worksReveal = useTransform(mainProgress, [0.51, 0.55], [0, 105]);
    const worksLead = useTransform(worksReveal, (v) => v - 3);
    const worksTrail = useTransform(worksReveal, (v) => v + 3);
    const worksWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${worksLead}%, black ${worksTrail}%)`;
    const worksBlueMask = useMotionTemplate`linear-gradient(to top left, black ${worksLead}%, transparent ${worksTrail}%)`;
    const worksBS1 = useTransform(worksReveal, (v) => v - 15);
    const worksBS2 = useTransform(worksReveal, (v) => v - 8);
    const worksBS3 = useTransform(worksReveal, (v) => v - 2.5);
    const worksBS4 = useTransform(worksReveal, (v) => v);
    const worksBS5 = useTransform(worksReveal, (v) => v + 3);
    const worksBS6 = useTransform(worksReveal, (v) => v + 10);
    const worksBS7 = useTransform(worksReveal, (v) => v + 17);
    const worksBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${worksBS1}%, rgba(0,0,0,0.15) ${worksBS2}%, rgba(0,0,0,0.55) ${worksBS3}%, rgba(0,0,0,1) ${worksBS4}%, rgba(0,0,0,0.55) ${worksBS5}%, rgba(0,0,0,0.15) ${worksBS6}%, transparent ${worksBS7}%)`;
    const worksBeamOpacity = useTransform(mainProgress, [0.51, 0.515, 0.545, 0.55], [0, 1, 1, 0]);

    // LOGOWANIE reveal (0.69-0.76)
    const loginReveal = useTransform(mainProgress, [0.69, 0.76], [0, 105]);
    const loginLead = useTransform(loginReveal, (v) => v - 3);
    const loginTrail = useTransform(loginReveal, (v) => v + 3);
    const loginWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${loginLead}%, black ${loginTrail}%)`;
    const loginBlueMask = useMotionTemplate`linear-gradient(to top left, black ${loginLead}%, transparent ${loginTrail}%)`;
    const loginBS1 = useTransform(loginReveal, (v) => v - 15);
    const loginBS2 = useTransform(loginReveal, (v) => v - 8);
    const loginBS3 = useTransform(loginReveal, (v) => v - 2.5);
    const loginBS4 = useTransform(loginReveal, (v) => v);
    const loginBS5 = useTransform(loginReveal, (v) => v + 3);
    const loginBS6 = useTransform(loginReveal, (v) => v + 10);
    const loginBS7 = useTransform(loginReveal, (v) => v + 17);
    const loginBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${loginBS1}%, rgba(0,0,0,0.15) ${loginBS2}%, rgba(0,0,0,0.55) ${loginBS3}%, rgba(0,0,0,1) ${loginBS4}%, rgba(0,0,0,0.55) ${loginBS5}%, rgba(0,0,0,0.15) ${loginBS6}%, transparent ${loginBS7}%)`;
    const loginBeamOpacity = useTransform(mainProgress, [0.69, 0.695, 0.755, 0.76], [0, 1, 1, 0]);

    // PANEL reveal (0.89-0.96)
    const panelReveal = useTransform(mainProgress, [0.89, 0.96], [0, 105]);
    const panelLead = useTransform(panelReveal, (v) => v - 3);
    const panelTrail = useTransform(panelReveal, (v) => v + 3);
    const panelWireMask = useMotionTemplate`linear-gradient(to top left, transparent ${panelLead}%, black ${panelTrail}%)`;
    const panelBlueMask = useMotionTemplate`linear-gradient(to top left, black ${panelLead}%, transparent ${panelTrail}%)`;
    const panelBS1 = useTransform(panelReveal, (v) => v - 15);
    const panelBS2 = useTransform(panelReveal, (v) => v - 8);
    const panelBS3 = useTransform(panelReveal, (v) => v - 2.5);
    const panelBS4 = useTransform(panelReveal, (v) => v);
    const panelBS5 = useTransform(panelReveal, (v) => v + 3);
    const panelBS6 = useTransform(panelReveal, (v) => v + 10);
    const panelBS7 = useTransform(panelReveal, (v) => v + 17);
    const panelBeamMask = useMotionTemplate`linear-gradient(to top left, transparent ${panelBS1}%, rgba(0,0,0,0.15) ${panelBS2}%, rgba(0,0,0,0.55) ${panelBS3}%, rgba(0,0,0,1) ${panelBS4}%, rgba(0,0,0,0.55) ${panelBS5}%, rgba(0,0,0,0.15) ${panelBS6}%, transparent ${panelBS7}%)`;
    const panelBeamOpacity = useTransform(mainProgress, [0.89, 0.895, 0.955, 0.96], [0, 1, 1, 0]);

    // --- ANIMACJA 2: ZAKRES PRAC SCROLL LOCK ---
    // Wolniejszy spring + krótszy zakres + 400vh parent = leniwy pływ, ostatnia karta
    // nadal widoczna gdy scroll się kończy.
    const scopeRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: scopeProgress } = useScroll({
        target: scopeRef,
        offset: ['start start', 'end end'],
    })

    const smoothScope = useSpring(scopeProgress, {
        stiffness: 55,
        damping: 32,
        restDelta: 0.001,
    })

    const scopeCardsY = useTransform(smoothScope, [0, 1], ['50vh', '-50%'])

    return (
        <div className="relative min-h-screen bg-[#000000] text-white selection:bg-rose-500/30 overflow-x-clip">
            {/* TŁO - rose rays fixed during Hero+makieta scroll lock, fade out po makiecie */}
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <TerminalSquare size={14} /> Next.js · premium · bez ograniczeń
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
                            Strona Szyta <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-pink-500">
                                na Miarę.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
                            Dla marek, dla których „wystarczająco dobrze" to za mało. Witryna na miarę Twojego prestiżu, z opcjonalnym panelem CMS i funkcjami bez ograniczeń.
                        </p>
                    </Reveal>
                </section>

                {/* ── ANIMACJA 1: MAKIETA - DŁUGA PODRÓŻ (1100vh) ──────────────────── */}
                {/* 5 faz: home → oferta → realizacje → logowanie (pojawia się) → panel. 3 style (toggle). */}
                <section ref={targetRef} style={{ height: '1100vh' }} className="relative z-30">
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
                      className="relative w-full max-w-[88rem] h-[76vh] md:h-[86vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(244,63,94,0.2)] flex flex-col overflow-hidden will-change-transform"
                    >
                      {/* Browser toolbar */}
                      <div className="relative h-14 bg-[#111] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                        <div className="flex gap-1.5 md:gap-2 shrink-0">
                          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/50 rounded-full border border-white/15 flex items-center px-3 md:px-4 overflow-hidden z-50 shadow-inner max-w-[60%] md:max-w-md">
                          <span className="text-rose-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                          <div className="relative w-36 sm:w-60 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                            <motion.span style={{ opacity: urlHome }} className="absolute inset-x-0 truncate text-center sm:text-left">{URLS[0]}</motion.span>
                            <motion.span style={{ opacity: urlOffer }} className="absolute inset-x-0 truncate text-center sm:text-left text-rose-300">{URLS[1]}</motion.span>
                            <motion.span style={{ opacity: urlWorks }} className="absolute inset-x-0 truncate text-center sm:text-left text-rose-300">{URLS[2]}</motion.span>
                            <motion.span style={{ opacity: urlPanel }} className="absolute inset-x-0 truncate text-center sm:text-left text-rose-200">{URLS[3]}</motion.span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                          <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-rose-500 to-rose-400 will-change-transform" />
                        </div>
                      </div>

                      {/* Viewport */}
                      <div ref={viewportRef} className="relative flex-1 bg-[#020202] overflow-hidden">

                        {/* Fixed nav (znika przy logowaniu/panelu) */}
                        <motion.div style={{ opacity: navOpacity }} className="absolute top-0 inset-x-0 h-16 border-b border-white/5 bg-[#000000]/80 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-12 pointer-events-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                              <div className="w-3 h-3 bg-rose-400 rounded-sm" />
                            </div>
                            <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                          </div>
                          <div className="flex gap-4 sm:gap-8 items-center pt-1">
                            {[link0Active, link1Active, link2Active].map((active, i) => {
                              const inactive = [link0Inactive, link1Inactive, link2Inactive][i];
                              return (
                                <div key={i} ref={(el) => { navLinkRefs.current[i] = el; }} className="relative w-8 sm:w-12 h-2 will-change-[opacity]">
                                  <motion.div style={{ opacity: inactive }} className="absolute inset-0 rounded bg-white/20" />
                                  <motion.div style={{ opacity: active }} className="absolute inset-0 rounded bg-rose-400/80 shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* FAZA 1: STRONA GŁÓWNA (długa, scroll) */}
                        <motion.div style={{ y: homeY, opacity: homeOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                          <motion.div style={{ maskImage: homeWireMask, WebkitMaskImage: homeWireMask }} className="w-full p-4 md:p-12 pt-10 md:pt-16">
                            {homePage('wire', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: homeBlueMask, WebkitMaskImage: homeBlueMask }} className="absolute inset-0 w-full p-4 md:p-12 pt-10 md:pt-16" aria-hidden="true">
                            {homePage('blue', s, fx)}
                          </motion.div>
                          <motion.div style={{ maskImage: homeBeamMask, WebkitMaskImage: homeBeamMask, opacity: homeBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-rose-600/50 via-rose-100/90 to-rose-600/50" /></motion.div>
                        </motion.div>

                        {/* FAZA 2: OFERTA (podstrona) */}
                        <motion.div style={{ y: offerY, opacity: offerOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                          <motion.div style={{ maskImage: offerWireMask, WebkitMaskImage: offerWireMask }} className="w-full p-4 md:p-12 pt-12 md:pt-20">
                            {offerPage('wire', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: offerBlueMask, WebkitMaskImage: offerBlueMask }} className="absolute inset-0 w-full p-4 md:p-12 pt-12 md:pt-20" aria-hidden="true">
                            {offerPage('blue', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: offerBeamMask, WebkitMaskImage: offerBeamMask, opacity: offerBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-rose-600/50 via-rose-100/90 to-rose-600/50" /></motion.div>
                        </motion.div>

                        {/* FAZA 3: REALIZACJE (podstrona) */}
                        <motion.div style={{ y: worksY, opacity: worksOpacity }} className="absolute top-16 left-0 w-full will-change-transform pb-32">
                          <motion.div style={{ maskImage: worksWireMask, WebkitMaskImage: worksWireMask }} className="w-full p-4 md:p-12 pt-12 md:pt-20">
                            {worksPage('wire', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: worksBlueMask, WebkitMaskImage: worksBlueMask }} className="absolute inset-0 w-full p-4 md:p-12 pt-12 md:pt-20" aria-hidden="true">
                            {worksPage('blue', s, fx)}
                          </motion.div>
                          <motion.div style={{ maskImage: worksBeamMask, WebkitMaskImage: worksBeamMask, opacity: worksBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-rose-600/50 via-rose-100/90 to-rose-600/50" /></motion.div>
                        </motion.div>

                        {/* LOADER (przed panelem) */}
                        <motion.div style={{ opacity: loaderOpacity }} className="absolute inset-0 z-30 flex items-center justify-center bg-[#020202] will-change-[opacity]">
                          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin shadow-[0_0_30px_rgba(244,63,94,0.3)]" />
                        </motion.div>

                        {/* FAZA 4: LOGOWANIE (pojawia się samo, pełny ekran) */}
                        <motion.div style={{ opacity: loginOpacity }} className="absolute inset-0 z-20 will-change-[opacity]">
                          <motion.div style={{ maskImage: loginWireMask, WebkitMaskImage: loginWireMask }} className="absolute inset-0 p-4 md:p-12">
                            {loginPage('wire', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: loginBlueMask, WebkitMaskImage: loginBlueMask }} className="absolute inset-0 p-4 md:p-12" aria-hidden="true">
                            {loginPage('blue', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: loginBeamMask, WebkitMaskImage: loginBeamMask, opacity: loginBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-rose-600/50 via-rose-100/90 to-rose-600/50" /></motion.div>
                        </motion.div>

                        {/* FAZA 5: PANEL HEADLESS (pełny ekran) */}
                        <motion.div style={{ opacity: panelOpacity }} className="absolute inset-0 z-20 overflow-hidden will-change-[opacity]">
                          <motion.div style={{ maskImage: panelWireMask, WebkitMaskImage: panelWireMask }} className="absolute inset-0 p-4 md:p-10 flex items-center">
                            {panelPage('wire', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: panelBlueMask, WebkitMaskImage: panelBlueMask }} className="absolute inset-0 p-4 md:p-10 flex items-center" aria-hidden="true">
                            {panelPage('blue', s)}
                          </motion.div>
                          <motion.div style={{ maskImage: panelBeamMask, WebkitMaskImage: panelBeamMask, opacity: panelBeamOpacity }} className="absolute inset-0 pointer-events-none mix-blend-screen blur-[1.5px] z-40" aria-hidden="true"><div className="absolute inset-0 bg-linear-to-tl from-rose-600/50 via-rose-100/90 to-rose-600/50" /></motion.div>
                        </motion.div>

                        {/* DEMO badge */}
                        <div className="absolute top-20 right-3 md:top-24 md:right-4 z-[45] inline-flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-rose-300/80 backdrop-blur-sm" aria-hidden="true">
                          <span className="w-1 h-1 rounded-full bg-rose-400 animate-pulse" />
                          Makieta · Demo
                        </div>

                        {/* Animated cursor (klika linki nav; znika przed logowaniem) */}
                        <motion.div style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }} className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform">
                          <MousePointer2 size={32} className="text-white fill-rose-500 stroke-[1.5]" />
                        </motion.div>

                        {/* Bottom fog */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-30 pointer-events-none" />
                      </div>
                    </motion.div>
                    </motion.div>

                    {/* Scroll hint */}
                    <motion.div
                      style={{ opacity: useTransform(smoothMain, [0, 0.05, 0.1], [1, 1, 0]) }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-rose-500 z-10 pointer-events-none"
                    >
                      <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby testować</span>
                      <div className="w-px h-10 bg-gradient-to-b from-rose-500 to-transparent" />
                    </motion.div>
                  </div>
                </section>

                {/* ── "MAKIETA = FRAGMENT" - co jeszcze zmieścimy w szytej stronie (premium) ── */}
                <section className="container mx-auto px-6 relative z-30 pt-16 md:pt-24 pb-4 md:pb-8 bg-[#000000]">
                  {/* Miękka rose poświata u góry - premium głębia, zero JS */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-72"
                    style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(244,63,94,0.10), transparent 70%)' }}
                  />
                  <Reveal delay={0.05}>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" aria-hidden="true" />
                        <span className="text-rose-300 text-[11px] font-mono uppercase tracking-[0.22em]">Makieta = fragment</span>
                      </div>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
                        Możliwości <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-pink-400">nie mają limitu</span>.
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
                        Makieta pokazuje kilka ekranów. Twoja strona dostaje funkcje na miarę Twojego prestiżu - poniżej tylko próbka tego, co jest możliwe.
                      </p>

                      {/* Dwurzędowy marquee - premium chips (rząd 1 w prawo, rząd 2 w lewo) */}
                      <div
                        className="space-y-4 md:space-y-5 mask-[linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] -mx-6"
                        aria-hidden="true"
                      >
                        <div className="overflow-hidden">
                          <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 60s linear infinite reverse' }}>
                            {(() => {
                              const row1 = ['Custom animacje scroll', 'Panel CMS (Sanity / Strapi)', 'Strefa klienta', 'Integracje API', 'Płatności online', 'Wielojęzyczność', 'Wyszukiwarka full-text', 'Dashboard analityczny', 'Newsletter + automatyzacje', 'Headless commerce'];
                              return [...row1, ...row1].map((label, i) => (
                                <span key={`r1-${i}`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/[0.04] border border-rose-500/15 text-slate-100 text-[13px] md:text-base font-medium whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/70 shrink-0" />{label}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 60s linear infinite' }}>
                            {(() => {
                              const row2 = ['Logowanie / SSO', 'Rezerwacje online', 'Kalkulatory ofert', 'Czat na żywo', 'Tryb ciemny', 'PWA / tryb offline', 'Mapa interaktywna', 'Filtry i warianty', 'Webhooki / n8n'];
                              return [...row2, ...row2].map((label, i) => (
                                <span key={`r2-${i}`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/[0.04] border border-rose-500/15 text-slate-100 text-[13px] md:text-base font-medium whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/70 shrink-0" />{label}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Domykający badge */}
                      <div className="flex justify-center mt-6 md:mt-8">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm md:text-base font-mono font-semibold tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" aria-hidden="true" />
                          + cokolwiek wymyślisz
                        </span>
                      </div>
                    </div>
                  </Reveal>
                </section>

                {/* --- BENTO GRID (TECHNOLOGIA I ZALETY) --- */}
                <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
                    <section className="py-24 md:py-32 border-b border-white/5">
                        <Reveal>
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Technologia liderów</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Ta sama technologia, na której działa Netflix i TikTok, pracuje teraz na Twój biznes. Szybka, odporna i gotowa na każdą skalę.
                                </p>
                            </div>
                        </Reveal>

                        {/* Grid 2+1+1+2 (jak one-page) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Card 1 (span 2) - Architektura Headless */}
                            <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-rose-500/30 transition-colors duration-700 ease-out"
                            >
                                {!shouldReduceMotion && (
                                    <div className="absolute inset-px" aria-hidden="true">
                                        <ShaderCanvas fragmentShader={RADIAL_RINGS_FS} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                                        <Cpu size={24} aria-hidden="true" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Architektura Headless</h3>
                                    <p className="text-slate-400 max-w-md leading-relaxed">
                                        Rozdzielona warstwa treści i wyglądu sprawia, że Twoja strona jest szybsza i bezpieczniejsza niż zwykłe witryny. Najwyższy standard pod maską.
                                    </p>
                                </div>
                                <GlassEdge />
                            </motion.div>

                            {/* Card 2 (span 1) - Potężne Integracje */}
                            <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[300px] flex flex-col hover:border-rose-500/30 transition-colors duration-700 ease-out"
                            >
                                {!shouldReduceMotion && (
                                    <div className="absolute inset-px" aria-hidden="true">
                                        <ShaderCanvas fragmentShader={WARP_FS} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-bl from-rose-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-400 group-hover:rotate-12 transition-transform duration-700 ease-out relative z-10">
                                    <Workflow size={24} aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Integracje bez granic</h3>
                                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                                    Płatności, ERP, CRM, kurierzy - Twoja strona dogaduje się z każdym narzędziem, którego używa Twój biznes.
                                </p>
                                <GlassEdge />
                            </motion.div>

                            {/* Card 3 (span 1) - Interfejs w Czasie Rzeczywistym */}
                            <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[250px] flex flex-col hover:border-rose-500/30 transition-colors duration-700 ease-out"
                            >
                                {!shouldReduceMotion && (
                                    <div className="absolute inset-px" aria-hidden="true">
                                        <ShaderCanvas fragmentShader={WARP_FS} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-400 relative z-10">
                                    <Sparkles size={24} aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Czuć każdy detal</h3>
                                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                                    Każde przewinięcie, najazd i przejście jest dopracowane. To suma detali sprawia, że Twoja strona wygląda na droższą niż konkurencja.
                                </p>
                                <GlassEdge />
                            </motion.div>

                            {/* Card 4 (span 2) - Skalowalność i Bezpieczeństwo + CTA */}
                            <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-rose-500/30 transition-colors duration-700 ease-out"
                            >
                                {!shouldReduceMotion && (
                                    <div className="absolute inset-px" aria-hidden="true">
                                        <ShaderCanvas fragmentShader={LIQUID_METAL_FS} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                                            <Zap size={20} aria-hidden="true" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Zero czekania</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Każda sekunda ładowania to klient, który ucieka. Twoja strona ładuje się natychmiast, więc nie tracisz nikogo na starcie.
                                    </p>
                                </div>
                                <div className="shrink-0 relative z-20">
                                    <Link
                                        href="/kontakt"
                                        className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 cursor-pointer"
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

                {/* --- SEKCJA ANIMACJI 2 (400vh - wolniejszy, oddychający) --- */}
                <section ref={scopeRef} className="relative h-[400vh] bg-[#000000] z-30">
                    <div className="sticky top-0 h-dvh w-full flex items-center px-6 py-12 md:py-16">
                        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* LEWA - nagłówek (wyrównany do góry) */}
                        <div className="text-left max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <CheckCircle2 size={14} /> Zakres Wdrożenia
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1]">
                                Od konceptu{' '}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-pink-400">
                                    po wdrożenie.
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                                Inżynieryjne podejście do budowy zaawansowanej platformy.
                            </p>
                        </div>

                        {/* CARDS MASK REGION - 2 karty widoczne naraz, centered horizontally */}
                        <div className="relative z-10 w-full h-[78vh] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
                            <motion.div
                                style={{ y: scopeCardsY, willChange: 'transform' }}
                                className="flex flex-col gap-5 md:gap-6 w-full absolute top-0 left-0 pb-[20vh]">
                                {[
                                    {
                                        title: 'Architektura i Logika',
                                        desc: 'Zaczynamy od mapowania procesów biznesowych i doboru odpowiedniego stosu technologicznego (Backend/Frontend).',
                                    },
                                    {
                                        title: 'Prototypowanie (UX)',
                                        desc: 'Tworzymy klikalne makiety aplikacji i strony, aby zweryfikować użyteczność przed kodowaniem.',
                                    },
                                    {
                                        title: 'Nowoczesny Frontend',
                                        desc: 'Budujemy responsywne, komponentowe widoki w React, gwarantujące płynne i błyskawiczne działanie interfejsu.',
                                    },
                                    {
                                        title: 'Potężny backend',
                                        desc: 'Łączymy bazy danych, budujemy bezpieczne API i integrujemy systemy zewnętrzne. Panel CMS do samodzielnej edycji - opcjonalnie.',
                                    },
                                    {
                                        title: 'Quality Assurance (QA)',
                                        desc: 'Rygorystyczne testy automatyczne i manualne, sprawdzające bezpieczeństwo oraz wydajność kodu pod obciążeniem.',
                                    },
                                    {
                                        title: 'Deploy i utrzymanie',
                                        desc: 'Publikujemy projekt na szybkiej, niezawodnej infrastrukturze chmurowej i zapewniamy stałe wsparcie techniczne.',
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="group relative overflow-hidden p-7 md:p-10 rounded-3xl border border-white/15 bg-[#080808] hover:border-rose-500/30 transition-colors duration-500 flex items-start gap-6">
                                        {/* Bazowy gradient w rogu (przywrócony) */}
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            aria-hidden="true"
                                            style={{
                                                background:
                                                    'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(244,63,94,0.18) 0%, rgba(244,63,94,0.05) 40%, transparent 70%)',
                                            }}
                                        />
                                        <div className="absolute bottom-0 right-0 text-[150px] md:text-[180px] font-black text-rose-500/[0.06] group-hover:text-rose-500/[0.10] transition-colors duration-500 pointer-events-none select-none leading-none z-[1]">
                                            0{i + 1}
                                        </div>

                                        <div className="relative z-10 w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)] border border-rose-500/20">
                                            <CheckCircle2 size={20} />
                                        </div>

                                        <div className="relative z-10 flex-1">
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-rose-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
                    </div>
                    <div className="container mx-auto px-5 sm:px-6 relative z-10">
                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute -inset-1 bg-linear-to-r from-rose-500 to-pink-600 rounded-3xl blur opacity-15" aria-hidden="true" />
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
                                        className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6 sm:mb-8 max-w-full"
                                    >
                                        <span className="relative flex h-2 w-2 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                                        </span>
                                        <span className="text-rose-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase truncate">Wolny termin w tym miesiącu</span>
                                    </motion.div>

                                    <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                        className="text-[2rem] sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.08] text-balance"
                                    >
                                        Gotowy na cyfrową{' '}
                                        <br className="md:hidden" />
                                        <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-pink-400">
                                            Dominację?
                                        </span>
                                    </motion.h2>

                                    <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                        className="text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                                    >
                                        Zbudujmy stronę, która wyróżni Cię na tle konkurencji. Darmowa konsultacja, zero zobowiązań.
                                    </motion.p>

                                    <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                                    >
                                        <Link href="/kontakt"
                                            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-rose-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Bezpłatna konsultacja
                                                <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                            </span>
                                            <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-pink-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
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

                {/* --- STOPKA I CTA --- */}
                <div className="container mx-auto px-6 relative z-40 bg-[#000000]">
                    <section className="border-t border-white/10 pt-20 pb-20">
                        <AvenlyAICta />
                    </section>
                </div>
            </main>
        </div>
    )
}
