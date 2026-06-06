'use client';

import { useRef, useEffect } from 'react';
import { motion, useReducedMotion, Variants, useSpring, useInView, useMotionValue } from 'framer-motion';
import { TrendingUp, Bot, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

// --- SUBKOMPONENT: WYDAJNY LICZNIK ---
// Używamy useRef i onChange, żeby nie renderować komponentu 60 razy na sekundę
// To zapewnia super płynną animację bez obciążania procesora.
function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20px" }); // Startuje jak element wejdzie w ekran
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,   // Tłumienie (jak szybko hamuje)
        stiffness: 60, // Sztywność (jak szybko startuje)
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        // Subskrypcja zmian wartości "sprężyny" i wpisywanie ich bezpośrednio do HTML
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toString();
            }
        });
    }, [springValue]);

    return <span ref={ref}>0</span>;
}

// === IMPACT BENTO SHADERS ===
// Każdy kafel dostaje inny efekt, ale wszystkie są celowo low-amplitude
// (alpha 0.15-0.40) - przystawka pod treścią, nie główne danie.
// Wspólny VS + snoise GLSL + ShaderCanvas (jeden host JS), tylko FS różny per kafel.

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const SNOISE_GLSL = `
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
`;

// KAFEL 1 - TOPOGRAPHIC FLOW (blue, "Inwestycja, nie Koszt")
// Cienkie warstwice z noise'a - sugestia "rosnących warstw wartości".
const TOPO_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
${SNOISE_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.04;

  float h = snoise(p * 1.4 + vec2(t * 0.3, t * 0.2));
  h += snoise(p * 3.0 + vec2(-t * 0.2, t * 0.4)) * 0.35;

  // Warstwice - fract z thresholded distance
  float lines = abs(fract(h * 3.5) - 0.5);
  float contour = smoothstep(0.06, 0.005, lines);

  // Szersza falloff - szerokie pokrycie, bias nadal do prawego górnego
  vec2 bias = vec2(0.4, 0.4);
  float falloff = smoothstep(2.6, 0.1, length((p - bias) * vec2(0.85, 1.0)));

  // Text dim mask - chronimy upper-left gdzie siedzi icon + h3 + p
  vec2 textCenter = vec2(-0.9, 0.35);
  float textDist = length((p - textCenter) * vec2(0.6, 1.3));
  float textDim = smoothstep(0.4, 1.2, textDist);

  // Edge boost - wzmocnienie pod glassem na prawej/górnej/dolnej krawędzi
  // (lewą pomijamy, tam siedzi tekst). Multiplied AFTER textDim, zero ryzyka kontrastu.
  float edgeBoost = max(
    smoothstep(0.9, 1.7, p.x),
    max(
      smoothstep(0.5, 0.95, p.y),
      smoothstep(0.5, 0.95, -p.y)
    )
  );

  gl_FragColor = vec4(vec3(0.184, 0.357, 0.922), contour * falloff * textDim * (1.0 + edgeBoost * 0.5));
}
`;

// KAFEL 2 - INDIGO CONTOURS (indigo, "Wirtualny Asystent")
// Cienkie warstwice tej samej rodziny co kafel 1 (TOPO), ale inne częstotliwości
// i kierunki driftu. Subtelny pattern rozłożony po całej powierzchni - dopasowanie
// stylistyczne do reszty bento (kafel 1 lines, kafel 3 sparks, kafel 4 rim).
const ORBS_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
${SNOISE_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.05;

  // Pole noise - inne kierunki driftu i częstotliwości niż TOPO, żeby wizualnie się różniły
  float h = snoise(p * 1.8 + vec2(-t * 0.4, t * 0.3));
  h += snoise(p * 3.5 + vec2(t * 0.25, -t * 0.5)) * 0.25;

  // Warstwice z większym spacingiem niż TOPO (2.5 vs 3.5) - rzadsze, większe
  float lines = abs(fract(h * 2.5) - 0.5);
  float contour = smoothstep(0.06, 0.005, lines);

  // Edge bias - odwrócona logika: shader jaśniejszy na krawędziach (pod glass),
  // dimowany w środku gdzie siedzi tekst (icon + h3 + p + tag). Krytyczne dla czytelności.
  float edgeBias = smoothstep(0.15, 0.85, length(p));

  gl_FragColor = vec4(vec3(0.55, 0.55, 0.95), contour * edgeBias * 1.0);
}
`;

// KAFEL 3 - YELLOW CONTOURS (yellow, "Wydajność i SEO")
// Spójny pattern z kafel 1 (TOPO) i kafel 2 (ORBS contours) - warstwice z noise.
// Edge bias (jak kafel 2) - dim środek gdzie text, bright krawędzie pod glass.
const VOLTAGE_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
${SNOISE_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.05;

  // Inne freq/drift niż pozostałe kafle - wizualna różnorodność w ramach tej samej rodziny
  float h = snoise(p * 1.6 + vec2(t * 0.25, -t * 0.35));
  h += snoise(p * 3.2 + vec2(-t * 0.4, t * 0.2)) * 0.30;

  float lines = abs(fract(h * 2.8) - 0.5);
  float contour = smoothstep(0.06, 0.005, lines);

  // Płynne przejście opacity od środka (0) do krawędzi (1.0) - gradient bez S-curve'a,
  // bez "ringu". Im dalej od centrum, tym mocniej widoczne yellow contours.
  // Środek = invisible (tekst safe), krawędzie = full (premium glow pod glass)
  float edgeBias = smoothstep(0.0, 1.5, length(p));

  gl_FragColor = vec4(vec3(0.95, 0.75, 0.20), contour * edgeBias * 1.0);
}
`;

// KAFEL 4 - GREEN CONTOURS (green, "Stabilność & Bezpieczeństwo")
// Spójny pattern z kafel 1 (TOPO) - warstwice z noise + wide falloff + text dim.
// Col-span-2 (wide), tekst po lewej, button po prawej → text dim na lewo.
const SCAN_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
${SNOISE_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv*2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.045;

  // Inne freq/drift niż pozostałe kafle (kierunek odwrócony vs TOPO)
  float h = snoise(p * 1.2 + vec2(-t * 0.3, t * 0.25));
  h += snoise(p * 2.6 + vec2(t * 0.4, t * 0.15)) * 0.40;

  float lines = abs(fract(h * 3.2) - 0.5);
  float contour = smoothstep(0.06, 0.005, lines);

  // Bias do prawej-środka (gdzie button, button ma własne bg więc OK)
  vec2 bias = vec2(0.5, 0.0);
  float falloff = smoothstep(2.8, 0.1, length((p - bias) * vec2(0.6, 1.0)));

  // Text dim - lewa strona gdzie siedzi icon + h3 + p "Stabilność..."
  vec2 textCenter = vec2(-1.5, 0.0);
  float textDist = length((p - textCenter) * vec2(0.5, 1.4));
  float textDim = smoothstep(0.5, 1.5, textDist);

  // Edge boost - tylko górna + dolna krawędź (lewa = text, prawa = button)
  // Wide col-span-2 ma pełną szerokość pod glassem na top/bottom - tam pójdzie boost.
  float edgeBoost = max(
    smoothstep(0.5, 0.95, p.y),
    smoothstep(0.5, 0.95, -p.y)
  );

  gl_FragColor = vec4(vec3(0.34, 0.78, 0.45), contour * falloff * textDim * (1.0 + edgeBoost * 0.5));
}
`;

// === SOFT GLASS FRAME (iOS-like, ale BEZ hard ring edges) ===
// Klucz: zamiast mask-composite XOR (który robił widoczne ramki w ramkach),
// używamy DWÓCH linear-gradient mask layers (poziomy + pionowy), domyślny composite ADD.
// Każdy gradient: opaque przy krawędzi, transparent po ~30% - efekt szkła zanika
// MIĘKKO w stronę środka, brak żadnej widocznej linii granicznej.
const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 rounded-3xl pointer-events-none z-5"
    style={{
      // Dramatic glass - zsynced z UI/UX bento + service subpages (16px blur, sat 170%, bright 110%)
      backdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      WebkitBackdropFilter: 'blur(16px) saturate(170%) brightness(110%)',
      boxShadow:
        'inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      // Węższy ring (15%) → mocniejszy efekt glass na samej krawędzi, opaque content w środku
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
        console.error('Impact shader compile:', gl.getShaderInfoLog(s));
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
      console.error('Impact shader link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Alpha blending - pozwala karcie bg-[#080808] przebić się przez transparent obszary shadera
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
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      // Perf: DPR clamp 1.25 (było 2.0). 4× shaderów = 4× fewer pixels per frame,
      // visually near-identical na bento backgroundach (kontury nie wymagają sub-pixel sharpness).
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

    // Throttle do 30fps (zamiast 60) - kontury są wolno animowane (t*0.04-0.05),
    // 30fps wygląda identycznie a halves GPU load × 4 shaders.
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
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    // Pauza gdy poza viewport
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

export const Impact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? false;
  const lenis = useLenis();

  const fadeInUpVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: shouldReduceMotion ? 0 : customDelay, 
        ease: "easeOut" 
      }
    })
  };

  const viewportConfig = { once: true, margin: "-50px" } as const;

  const handleScrollToOffer = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
        e.preventDefault();
        const elem = document.getElementById('oferta');
        if (elem && lenis) {
            lenis.scrollTo(elem, { 
                offset: -100,
                duration: 1.5,
                lock: false,
                force: true
            });
        }
    }
  };

  return (
    <section 
        ref={containerRef} 
        aria-label="Korzyści współpracy" 
        className="relative w-full py-24 lg:py-32 bg-[#050505] overflow-hidden"
    >
      
      {/* TŁO */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div 
                custom={0}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 mb-6" role="text">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></span>
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Dlaczego Avenly?</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                    Twój Biznes. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                        Wersja 2.0
                    </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Świat pędzi do przodu - nie zostawaj w tyle.<br />
                    Wyprzedzasz konkurencję dzięki <strong>szybkiej stronie, automatyzacji i designowi</strong>, który przekonuje.
                </p>
            </motion.div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KAFEL 1: SKALOWALNY WZROST */}
            <motion.div 
                custom={0.1}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-blue-500/30 transition-colors duration-700 ease-out"
            >
                {!shouldReduceMotion && (
                    <div className="absolute inset-px" aria-hidden="true">
                        <ShaderCanvas fragmentShader={TOPO_FS} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                        <TrendingUp size={24} aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Inwestycja, nie koszt</h3>
                    <p className="text-slate-400 max-w-md">
                        Zamieniasz ruch na stronie w realny zysk. Dostajesz maszynę do pozyskiwania klientów, która pracuje na Twój wynik.
                    </p>
                </div>

                <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-30 md:opacity-50 pointer-events-none translate-y-4 translate-x-4" aria-hidden="true">
                     <div className="flex items-end justify-end gap-2 h-full">
                        {[40, 65, 50, 85, 70, 100].map((h, i) => (
                            <div
                                key={i}
                                className="w-8 md:w-12 origin-bottom"
                                style={{ height: `${h}%` }}
                            >
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.2 + (i * 0.1) }}
                                    className="w-full h-full origin-bottom bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-lg will-change-transform"
                                />
                            </div>
                        ))}
                     </div>
                </div>
                <GlassEdge />
            </motion.div>

            {/* KAFEL 2: AI FIRST */}
            <motion.div 
                custom={0.2}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[300px] flex flex-col hover:border-indigo-500/30 transition-colors duration-700 ease-out"
            >
                {!shouldReduceMotion && (
                    <div className="absolute inset-px" aria-hidden="true">
                        <ShaderCanvas fragmentShader={ORBS_FS} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                <div className="relative z-10 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-700 ease-out">
                        <Bot size={24} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Wirtualny asystent</h3>
                    <p className="text-slate-400 text-sm mb-8">
                        Automatyczna obsługa klienta i procesów. Twój biznes domyka tematy, gdy Ty masz wolne.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        <span>Chatboty AI</span>
                    </div>
                </div>
                <GlassEdge />
            </motion.div>

            {/* KAFEL 3: PERFORMANCE - Z LICZNIKIEM */}
            <motion.div 
                custom={0.3}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 min-h-[250px] flex flex-col hover:border-yellow-500/30 transition-colors duration-700 ease-out"
            >
                {!shouldReduceMotion && (
                    <div className="absolute inset-px" aria-hidden="true">
                        <ShaderCanvas fragmentShader={VOLTAGE_FS} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                            <Zap size={24} aria-hidden="true" />
                        </div>
                        {/* --- TUTAJ JEST LICZNIK --- */}
                        <span className="text-4xl font-bold text-white flex items-baseline" aria-label="99 procent">
                            <Counter value={99} />
                            <span className="text-yellow-500 text-2xl" aria-hidden="true">%</span>
                        </span>
                        {/* ------------------------- */}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Wydajność i SEO</h3>
                    <p className="text-slate-400 text-sm">
                       Google kocha szybkie strony. Twoi klienci też. Masz szybkość, z której rośnie Twoja widoczność.
                    </p>
                </div>
                <GlassEdge />
            </motion.div>

            {/* KAFEL 4: SECURITY & CTA */}
            <motion.div 
                custom={0.4}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/15 p-8 flex flex-col md:flex-row items-start md:items-center gap-8 hover:border-green-500/30 transition-colors duration-700 ease-out"
            >
                 {!shouldReduceMotion && (
                    <div className="absolute inset-px" aria-hidden="true">
                        <ShaderCanvas fragmentShader={SCAN_FS} />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-r from-green-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                 <div className="w-full md:flex-1 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <ShieldCheck size={20} aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Stabilność i bezpieczeństwo</h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                       Awaria strony to straceni klienci. Dzięki hostingowi nowej generacji Twoja firma działa bez przerw, a Ty masz spokój.
                    </p>
                 </div>
                 
                 <div className="shrink-0 relative z-20">
                    <Link
                        href="/#oferta"
                        onClick={handleScrollToOffer}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 group/btn !cursor-pointer"
                    >
                        Sprawdź ofertę
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-500" aria-hidden="true" />
                    </Link>
                 </div>
                 <GlassEdge />
            </motion.div>

        </div>
      </div>
    </section>
  );
};