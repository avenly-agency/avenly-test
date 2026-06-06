'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  Target,
  Send,
  Cpu,
  Database,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// ═══════════════════════════════════════════════════════════════════════════════
// HERO BACKGROUND SHADERS - paleta ORANGE + EMERALD. 5 wariantów (toggle).
// ═══════════════════════════════════════════════════════════════════════════════

const HERO_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// Hero background - PLASMA (orange-only, wybrany finalnie)
const PLASMA_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_entry;
void main(){
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * 2.0;
  float t = u_time * 0.08;
  vec2 q = vec2(sin(p.x * 2.0 + p.y * 1.5 + t * 0.6), sin(p.x * 1.5 - p.y * 2.0 + t * 0.4 + 1.5));
  vec2 r = vec2(sin(p.x + q.y * 2.0 + t * 0.3), sin(p.y + q.x * 2.0 + t * 0.5 + 2.5));
  float fld = sin(r.x * 2.0 + r.y * 1.5 + t * 0.4) * 0.5 + 0.5;
  float spec = pow(max(0.0, sin(r.x * 3.0 + r.y * 2.0 + t * 0.5)), 4.0);
  float intensity = (fld * 0.5 + spec * 0.6) * u_entry;
  intensity *= smoothstep(1.8, 0.2, length(p));
  vec3 col = mix(vec3(0.55, 0.18, 0.03), vec3(1.0, 0.6, 0.2), fld);
  col = mix(col, vec3(1.0, 0.78, 0.42), spec * 0.5);
  gl_FragColor = vec4(col * intensity * 0.55, 1.0);
}
`;

const HeroShader = ({ fragmentShader }: { fragmentShader: string }) => {
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
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Hero shader compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, HERO_VS);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Hero shader link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
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

    const FRAME = 1000 / 30;
    const t0 = performance.now();
    let last = 0;
    let firstFrameDone = false;
    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - last >= FRAME) {
        last = ts;
        const t = (ts - t0) / 1000;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, t);
        if (uEntry) { const _p = Math.min(1, t / 1.5); gl.uniform1f(uEntry, 1 - Math.pow(1 - _p, 3)); }
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!firstFrameDone) { firstFrameDone = true; requestAnimationFrame(() => { canvas.style.opacity = '1'; }); }
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
      canvas.style.opacity = '0';
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [fragmentShader, canvasKey]);

  return <canvas key={canvasKey} ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" style={{ opacity: 0, transition: 'opacity 1.4s ease-out', willChange: 'opacity' }} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// BENTO SHADERS (tło kafli "Możliwości") + GlassEdge - 5 wariantów (toggle)
// Alpha blend + textDim (czytelność tekstu) + edgeBoost. Paleta orange.
// ═══════════════════════════════════════════════════════════════════════════════

// Jeden shader (Dots) - różnicowany per kafel przez u_seed (róg pulsu, gęstość, prędkość, kolor).
const BENTO_DOTS_FS = `
precision highp float;
uniform vec2 u_resolution; uniform float u_time; uniform float u_entry; uniform float u_seed;
void main(){
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float s = u_seed;
  float t = u_time * (0.42 + s * 0.13);
  // jednolita wielkość i gęstość kropek (px-based) we wszystkich boxach - niezależnie od rozmiaru kafla
  vec2 cell = fract(gl_FragCoord.xy / 18.0) - 0.5;
  float dotV = smoothstep(0.20, 0.06, length(cell));
  vec2 pc;
  if (s < 0.5)      pc = vec2(aspect * 0.85, 0.15);
  else if (s < 1.5) pc = vec2(aspect * 0.12, 0.88);
  else if (s < 2.5) pc = vec2(aspect * 0.95, 0.95);
  else              pc = vec2(aspect * 0.08, 0.10);
  float dist = length(p - pc);
  float pulse = pow(max(0.0, sin(dist * (6.0 + s) - t + s * 1.3)), 3.0);
  vec2 tc = vec2(aspect * 0.35, 0.6);
  float textDim = smoothstep(0.2, 0.95, length(p - tc));
  float em = 0.30 + 0.20 * s;
  vec3 col = mix(vec3(0.98, 0.46, 0.15), vec3(1.0, 0.74, 0.34), clamp(pulse * em, 0.0, 1.0));
  gl_FragColor = vec4(col, dotV * (0.10 + pulse) * textDim * 0.9 * u_entry);
}
`;

// Resilient bento canvas (alpha blend, 30fps, DPR clamp, IO pauza, canvasKey recovery)
const ShaderCanvas = ({ fragmentShader, seed = 0 }: { fragmentShader: string; seed?: number }) => {
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

    const vs = compile(gl.VERTEX_SHADER, HERO_VS);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uEntry = gl.getUniformLocation(program, 'u_entry');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uSeed = gl.getUniformLocation(program, 'u_seed');

    const resize = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
      const w = canvas.clientWidth * dpr; const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const FRAME = 1000 / 30;
    const t0 = performance.now();
    let last = 0;
    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - last >= FRAME) {
        last = ts;
        const t = (ts - t0) / 1000;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, t);
        if (uEntry) { const _p = Math.min(1, t / 1.5); gl.uniform1f(uEntry, 1 - Math.pow(1 - _p, 3)); }
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uSeed) gl.uniform1f(uSeed, seed);
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
  }, [fragmentShader, canvasKey, seed]);

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

// ═══════════════════════════════════════════════════════════════════════════════
// DANE
// ═══════════════════════════════════════════════════════════════════════════════

const openChat = () => { if (typeof window !== 'undefined') window.dispatchEvent(new Event('avenly:open-chat')); };

interface QA { q: string; a: string; chip: string; src: string; }
const QA_LIST: QA[] = [
  { q: 'Ile kosztuje dostawa?', a: 'Kurier to 14,99 zł, a od 200 zł - gratis. Wysyłka w 24h.', chip: 'Sprawdź koszyk', src: 'cennik dostaw' },
  { q: 'Czy mogę zwrócić produkt?', a: 'Tak - masz 30 dni na zwrot bez podania przyczyny. Wygenerować etykietę?', chip: 'Zwróć produkt', src: 'regulamin' },
  { q: 'Jak szybko wdrożycie chatbota?', a: 'Zwykle 1 dzień roboczy od dostarczenia treści. Zostaw e-mail, wyślę plan.', chip: 'Zostaw e-mail', src: 'oferta' },
  { q: 'Pracujecie z klientami z UE?', a: 'Tak, obsługujemy całą Unię - faktury w EUR i PLN. Umówić rozmowę?', chip: 'Umów rozmowę', src: 'FAQ' },
];

const QUESTIONS_ROW1 = ['Ile kosztuje dostawa?', 'Macie w rozmiarze M?', 'Jak zwrócić produkt?', 'Do kiedy promocja?', 'Czy wystawiacie faktury?', 'Jak długo trwa wysyłka?'];
const QUESTIONS_ROW2 = ['Czy mogę zapłacić BLIKiem?', 'Pracujecie w weekendy?', 'Macie sklep stacjonarny?', 'Jak umówić wizytę?', 'Czy jest gwarancja?', 'Dowozicie za granicę?'];

const CAPS = [
  { id: 'knowledge', icon: Cpu, title: 'Zna Twoją ofertę', body: 'Trenujemy go na Twoich cennikach, opisach i FAQ - zna asortyment lepiej niż nowy pracownik pierwszego dnia.' },
  { id: 'always', icon: Clock, title: 'Pracuje 24/7', body: 'W nocy, w weekend i w święta - Twój klient nigdy nie trafia na zamknięte.' },
  { id: 'leads', icon: Target, title: 'Zbiera leady', body: 'Kwalifikuje potrzeby i zapisuje gotowe kontakty prosto do Twojego CRM.' },
  { id: 'integrate', icon: Database, title: 'Integruje się', body: 'Łączy się z CRM, e-mailem, WhatsAppem, kalendarzem czy n8n.' },
];

const WHY = [
  { icon: CheckCircle2, title: 'Wie, czego nie wie.', body: 'Gdy pytanie wykracza poza jego wiedzę, nie zmyśla odpowiedzi. Z pełnym kontekstem rozmowy przekazuje klienta Twojemu zespołowi - zamiast tracić zaufanie błędną informacją.' },
  { icon: Sparkles, title: 'Brzmi jak Twoja marka.', body: 'Ton wypowiedzi, język i wygląd widgetu dopasowujemy do Twojego serwisu. Klient nie ma poczucia, że rozmawia z generycznym, sztampowym botem.' },
  { icon: TrendingUp, title: 'Mierzysz każdą rozmowę.', body: 'W panelu widzisz, o co realnie pytają klienci, gdzie się gubią i co domyka sprzedaż. Co miesiąc dostrajamy bota na podstawie tych danych.' },
];

const BotAvatar = ({ size = 16 }: { size?: number }) => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(249,115,22,0.45)]">
    <Bot size={size} className="text-white" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIVING ASK - bot sam wpisuje pytania klientów i wypisuje odpowiedzi (autoplay, pętla)
// ═══════════════════════════════════════════════════════════════════════════════

type Phase = 'type' | 'think' | 'answer';

function LivingAsk() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10%' });
  const reduce = useReducedMotion() ?? false;

  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<Phase>('type');
  const [qText, setQText] = useState('');
  const [aText, setAText] = useState('');

  useEffect(() => {
    const qa = QA_LIST[qi];
    if (reduce) { setQText(qa.q); setAText(qa.a); setPhase('answer'); return; }
    if (!inView) return;

    let alive = true;
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => { const id = window.setTimeout(() => { if (alive) fn(); }, ms); timers.push(id); };

    setPhase('type'); setQText(''); setAText('');

    const typeA = (i: number) => {
      setAText(qa.a.slice(0, i));
      if (i < qa.a.length) after(18, () => typeA(i + 1));
      else after(2800, () => setQi((q) => (q + 1) % QA_LIST.length));
    };
    const typeQ = (i: number) => {
      setQText(qa.q.slice(0, i));
      if (i < qa.q.length) after(40, () => typeQ(i + 1));
      else after(450, () => { setPhase('think'); after(850, () => { setPhase('answer'); typeA(1); }); });
    };
    after(400, () => typeQ(1));

    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [qi, inView, reduce]);

  const qa = QA_LIST[qi];
  const answered = phase === 'answer' && aText.length >= qa.a.length;

  return (
    <div ref={ref} className="max-w-2xl mx-auto text-left">
      {/* Ask bar */}
      <div className="relative">
        <div className="absolute -inset-4 bg-orange-500/10 blur-2xl rounded-full pointer-events-none" aria-hidden="true" />
        <div className="relative flex items-center gap-3 rounded-2xl bg-[#0d0d0d]/90 backdrop-blur-xl border border-orange-500/25 px-4 py-3.5 shadow-[0_0_50px_-14px_rgba(249,115,22,0.45)]">
          <Sparkles className="text-orange-400 shrink-0" size={18} aria-hidden="true" />
          <div className="flex-1 text-[15px] md:text-lg text-white min-h-[1.6em] flex items-center">
            <span>{qText || (phase === 'type' ? '' : qa.q)}</span>
            {phase === 'type' && <span className="inline-block w-[2px] h-[1.1em] bg-orange-400 ml-0.5 animate-pulse" />}
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${phase === 'type' ? 'bg-white/5 text-white/40' : 'bg-orange-500 text-black shadow-[0_0_16px_rgba(249,115,22,0.5)]'}`}>
            <Send size={15} />
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div className="mt-6 min-h-[180px] sm:min-h-[150px]">
        {phase === 'think' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center">
            <BotAvatar />
            <div className="rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.07] px-4 py-3 flex gap-1.5 items-center">
              {[0, 0.15, 0.3].map((d) => (
                <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                  animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, delay: d, repeat: Infinity, ease: 'easeInOut' }} />
              ))}
            </div>
          </motion.div>
        )}
        {phase === 'answer' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex gap-3 items-start">
            <BotAvatar />
            <div className="flex flex-col gap-3 flex-1">
              <p className="text-slate-100 text-base md:text-lg leading-relaxed">
                {aText}{!answered && <span className="inline-block w-[2px] h-[1.05em] bg-orange-400 ml-0.5 align-middle animate-pulse" />}
              </p>
              <motion.div
                initial={false}
                animate={{ opacity: answered ? 1 : 0, y: answered ? 0 : 6 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <span className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-[12px] text-orange-300 font-medium">{qa.chip}</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <CheckCircle2 size={12} className="text-orange-400" /> źródło: {qa.src}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mini-podpowiedź pętli */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {QA_LIST.map((_, i) => (
          <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === qi ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/15'}`} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARQUEE PYTAŃ
// ═══════════════════════════════════════════════════════════════════════════════

const QChip = ({ text }: { text: string }) => (
  <span className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/[0.04] border border-orange-500/12 text-slate-200 text-[13px] md:text-base font-medium whitespace-nowrap">
    <MessageCircle size={13} className="text-orange-400/70 shrink-0" /> {text}
  </span>
);

function QuestionMarquee() {
  return (
    <div className="space-y-4 md:space-y-5 mask-[linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]" aria-hidden="true">
      <div className="overflow-hidden">
        <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 200s linear infinite reverse' }}>
          {Array.from({ length: 8 }, () => QUESTIONS_ROW1).flat().map((t, i) => <QChip key={`a-${i}`} text={t} />)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-3 md:gap-4 w-max will-change-transform" style={{ animation: 'scroll 200s linear infinite' }}>
          {Array.from({ length: 8 }, () => QUESTIONS_ROW2).flat().map((t, i) => <QChip key={`b-${i}`} text={t} />)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEKCJE
// ═══════════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: 'easeOut' as const } }),
};

// Schodkowy reveal nagłówków sekcji (badge → tytuł → podtytuł po kolei)
const headerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } } };
const headerItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };

// Mini-wizualizacja per możliwość (Showcase + duże kafle Bento)
function CapVisual({ id }: { id: string }) {
  if (id === 'knowledge') {
    return (
      <div className="flex flex-wrap gap-2">
        {['cennik', 'opisy produktów', 'FAQ', 'regulamin', 'case studies', 'dostawa', 'zwroty', 'gwarancja'].map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 text-[11px]">{t}</span>
        ))}
      </div>
    );
  }
  if (id === 'always') {
    return (
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full border-2 border-orange-500/30 flex items-center justify-center">
          <Clock className="text-orange-400" size={22} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-orange-400 border-2 border-[#080808] animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-orange-400 text-xs font-mono">● online · 02:47</span>
          <div className="flex items-end gap-1 h-7">
            {[40, 70, 50, 85, 60, 90, 55, 75].map((h, i) => (<div key={i} className="w-1.5 rounded-sm bg-orange-400/50" style={{ height: `${h}%` }} />))}
          </div>
        </div>
      </div>
    );
  }
  if (id === 'leads') {
    return (
      <div className="flex flex-col gap-2">
        {['anna@firma.pl', 'biuro@xyz.pl'].map((e, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-orange-500/15 border border-orange-500/25 shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] text-slate-300 truncate">{e}</span>
              <span className="text-[9px] text-slate-500 font-mono">nowy lead · gorący</span>
            </div>
            <span className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/25 shrink-0">→ CRM</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {['CRM', 'E-mail', 'WhatsApp', 'Slack', 'Kalendarz', 'n8n', 'Arkusze'].map((t) => (
        <span key={t} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">{t}</span>
      ))}
    </div>
  );
}

// Bento z shaderem Dots w tle kafli (różny per kafel via seed) + glassmorphism (GlassEdge).
function CapsBento() {
  const reduce = useReducedMotion() ?? false;
  const layout = [
    { c: CAPS[0], span: true, visual: true },
    { c: CAPS[1], span: false, visual: false },
    { c: CAPS[2], span: false, visual: false },
    { c: CAPS[3], span: true, visual: true },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-5">
      {layout.map(({ c, span, visual }, i) => {
        const Icon = c.icon;
        return (
          <motion.div key={c.id} custom={i * 0.07} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-[#080808] p-7 md:p-8 hover:border-orange-500/35 transition-colors duration-500 flex flex-col ${span ? 'md:col-span-2' : ''}`}>
            {/* Shader w tle (inset-px = bufor w rogach) */}
            {!reduce && (
              <div className="absolute inset-px overflow-hidden rounded-3xl" aria-hidden="true">
                <ShaderCanvas fragmentShader={BENTO_DOTS_FS} seed={i} />
              </div>
            )}
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-300 mb-6 group-hover:scale-110 transition-transform duration-500"><Icon size={22} /></div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2.5 leading-snug">{c.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{c.body}</p>
              {visual && <div className="mt-6 pt-6 border-t border-white/[0.1]"><CapVisual id={c.id} /></div>}
            </div>
            <GlassEdge />
          </motion.div>
        );
      })}
    </div>
  );
}

function Capabilities() {
  return (
    <section className="py-24 md:py-32 border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div variants={headerStagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center max-w-2xl mx-auto mb-14">
          <motion.div variants={headerItem} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
            <Sparkles size={13} /> Możliwości
          </motion.div>
          <motion.h2 variants={headerItem} className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">Cztery rzeczy, w których jest lepszy od formularza</motion.h2>
        </motion.div>
        <CapsBento />
      </div>
    </section>
  );
}

function StatsEditorial() {
  const changes = [
    { title: 'Łapie klienta, gdy jest gotowy', desc: 'Zamiast szukać odpowiedzi u konkurencji, dostaje ją od razu u Ciebie.' },
    { title: 'Zdejmuje rutynę z zespołu', desc: 'Dostawa, zwroty, dostępność - powtarzalne pytania nie lądują już na Twojej skrzynce.' },
    { title: 'Każdy klient obsłużony tak samo', desc: 'Pierwszy i setny dostają równie konkretną odpowiedź, bez gorszych dni i kolejek.' },
  ];
  return (
    <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-end">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6 }} className="md:col-span-7">
        <div className="text-7xl md:text-[7rem] font-black text-white leading-[0.9] tracking-tight">2<span className="text-orange-400">s</span></div>
        <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-md leading-relaxed">
          tyle średnio czeka klient na odpowiedź asystenta. Formularz kontaktowy?<br /><span className="text-white">Godziny - albo następny dzień.</span>
        </p>
      </motion.div>
      <div className="md:col-span-5 flex flex-col border-t border-white/[0.08]">
        {changes.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-start gap-5 py-5 border-b border-white/[0.08]">
            <span className="text-2xl md:text-3xl font-black text-orange-400 shrink-0 tabular-nums leading-none mt-0.5">0{i + 1}</span>
            <div className="flex flex-col gap-1">
              <span className="text-base md:text-lg font-bold text-white leading-snug">{r.title}</span>
              <span className="text-sm text-slate-400 leading-relaxed">{r.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ImpactStats() {
  return (
    <section className="py-24 md:py-32 border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div variants={headerStagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2 variants={headerItem} className="text-3xl md:text-4xl font-bold mb-4">Konkret, nie obietnice</motion.h2>
          <motion.p variants={headerItem} className="text-slate-400 text-lg leading-relaxed">Co realnie zmienia się, gdy klient zawsze dostaje odpowiedź.</motion.p>
        </motion.div>
        <StatsEditorial />
      </div>
    </section>
  );
}

// Wiersz „Różnicy" - scroll-driven hover: aktywny gdy mija środek ekranu
function WhyRow({ f, i }: { f: (typeof WHY)[number]; i: number }) {
  const Icon = f.icon;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: '-45% 0px -45% 0px' }, // wąski pas w centrum viewportu
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Reveal delay={i * 0.05}>
      <div
        ref={ref}
        className={`relative border-t py-14 md:py-20 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 transition-colors duration-700 cursor-default ${active ? 'border-orange-500/20' : 'border-white/[0.06]'}`}
      >
        {/* Tło - poświata od prawej (scroll-active) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(ellipse 55% 130% at 100% 50%, rgba(249,115,22,0.12), transparent 62%)' }}
        />
        <div className="relative z-10 flex flex-col gap-5">
          <span className={`text-[72px] md:text-[96px] font-black leading-none transition-colors duration-700 select-none ${active ? 'text-white' : 'text-white/[0.03]'}`}>0{i + 1}</span>
          <div className={`w-11 h-11 rounded-2xl border border-orange-500/15 flex items-center justify-center text-orange-400 transition-all duration-500 ${active ? 'bg-orange-500/20 scale-110' : 'bg-orange-500/10'}`}><Icon size={22} /></div>
          <h3 className={`text-xl md:text-2xl font-bold leading-snug transition-colors duration-500 max-w-xs ${active ? 'text-orange-400' : ''}`}>{f.title}</h3>
        </div>
        <div className="relative z-10 flex flex-col justify-center"><p className="text-slate-400 text-lg leading-relaxed max-w-xl">{f.body}</p></div>
      </div>
    </Reveal>
  );
}

function WhyEditorial() {
  return (
    <section className="py-24 md:py-32 border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div variants={headerStagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="flex items-baseline gap-4 mb-16 md:mb-24">
          <motion.span variants={headerItem} className="text-[10px] uppercase tracking-[0.3em] text-orange-500/60 font-mono">Różnica</motion.span>
          <motion.h2 variants={headerItem} className="text-3xl md:text-4xl font-bold">Nie każdy chatbot jest taki sam</motion.h2>
        </motion.div>
        {WHY.map((f, i) => <WhyRow key={i} f={f} i={i} />)}
        <div className="border-t border-white/[0.06]" />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════

export function ChatbotsAIClient() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-clip">

      {/* TŁO - shader Plasma (orange) */}
      <div className="absolute top-0 inset-x-0 h-[1100px] md:h-[1300px] z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.10),transparent_70%)]" />
        {!reduce && <HeroShader fragmentShader={PLASMA_FS} />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 55%, #050505 95%)' }} />
      </div>

      <main className="relative z-10">

        {/* ── HERO + LIVING ASK ── */}
        <section className="pt-28 sm:pt-32 pb-24 md:pb-32 container mx-auto px-6 text-center">
          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/5 border border-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8">
              <MessageCircle size={13} /> Wirtualny asystent
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-7 leading-[1.05]">
              Rozmawia z klientem.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500">Natychmiast.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Asystent AI wbudowany w Twoją stronę - odpowiada, kwalifikuje potrzeby i przekazuje gotowe leady do CRM. Zobacz, jak to wygląda na żywo:
            </p>
          </Reveal>

          <Reveal delay={0.42}>
            <LivingAsk />
          </Reveal>

          <Reveal delay={0.55}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <Link href="/kontakt" className="px-6 py-3 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 transition-colors cursor-pointer">Bezpłatna konsultacja</Link>
              <button type="button" onClick={openChat} className="px-6 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-bold hover:bg-white/[0.08] transition-colors cursor-pointer inline-flex items-center gap-2"><MessageCircle size={15} /> Przetestuj na sobie</button>
            </div>
          </Reveal>
        </section>

        {/* ── SEKCJE DOLNE (pełna szerokość, kryją shader) ── */}
        <div className="relative bg-[#050505]">

          {/* Marquee pytań */}
          <section className="py-16 md:py-20 border-y border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 mb-10">
              <Reveal>
                <p className="text-center text-slate-500 text-sm md:text-base max-w-xl mx-auto">
                  Setki pytań, które Twoi klienci zadają każdego dnia,<br /><span className="text-white font-semibold">żadne nie zostaje bez odpowiedzi.</span>
                </p>
              </Reveal>
            </div>
            <QuestionMarquee />
          </section>

          <Capabilities />
          <ImpactStats />
          <WhyEditorial />

          <div className="container mx-auto px-6">
            <section className="border-t border-white/10 pt-20 pb-20">
              <AvenlyAICta />
            </section>
          </div>
        </div>

      </main>
    </div>
  );
}
