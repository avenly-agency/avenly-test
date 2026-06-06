'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

// Tło: WebGL fragment shader (aurora). Layered domain-warped simplex noise w palecie brand.
// Zastępuje wcześniejszą warstwę blobów (css-anim-blob-1/2/3 nadal w globals.css na wypadek użycia gdzie indziej).

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const AURORA_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
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

  float t = u_time * 0.12;

  float n1 = snoise(p*0.7  + vec2( t*0.8, t*0.4));
  float n2 = snoise(p*1.3  + vec2(-t*0.5, t*0.9) + n1*0.6);
  float n3 = snoise(p*0.45 + vec2( t*0.3,-t*0.6) + n2*0.4);

  vec3 canvas = vec3(0.020, 0.020, 0.025);
  vec3 royal  = vec3(0.067, 0.169, 0.510);  // #112b82
  vec3 electr = vec3(0.184, 0.357, 0.922);  // #2f5beb
  vec3 sky    = vec3(0.376, 0.647, 0.980);  // #60a5fa

  vec3 col = canvas;
  col = mix(col, royal,  smoothstep(-0.4, 0.6, n1) * 0.85);
  col = mix(col, electr, smoothstep(-0.2, 0.8, n2) * 0.55);
  col = mix(col, sky,    smoothstep( 0.4, 0.95,n3) * 0.35);

  col *= mix(1.0, 0.5, smoothstep(-0.2, 1.2, p.y));

  float vig = smoothstep(1.6, 0.3, length(p*vec2(0.85,1.0)));
  col *= vig*0.45 + 0.55;

  // float grain = fract(sin(dot(uv + u_time*0.0003, vec2(12.9898, 78.233)))*43758.5453);
  // col += (grain - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;

const AuroraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    // Skip WebGL setup na mobile (Hero shader = TBT killer 6800ms). Mobile dostaje
    // pure dark bg-slate-950 - bez "mobile fallback gradient" który flashował przy SSR.
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    // Defer WebGL setup z `requestIdleCallback` (fallback setTimeout 200ms). Shader
    // compile + GPU upload + observers setup to ~100-300ms synchronous task która
    // blokuje main thread podczas hydration React (gdy Framer Motion intro startuje).
    // Pomimo `isolate` na text container, hydration sam wymaga main thread → text
    // animations konkurują z shader compile. requestIdleCallback przesuwa shader
    // setup za hydration tail, dając text czystą ścieżkę przez intro window.
    const setupShader = (): (() => void) | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
      if (!gl) return null;

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error('Shader compile error:', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      };

      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, AURORA_FRAG);
      if (!vs || !fs) return null;

      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
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
        // DPR clamp 1.25 - Aurora to diffuse/blurry shader, wizualnie identyczne
        // do 1.5 ale ~30% mniej fragment invocations per frame.
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

      // 30fps throttle - sweet spot dla diffuse aurora (t * 0.12). 24fps było wyraźnie
      // mniej płynne; 60fps to zbyt drogi (DPR 1.25 + highp precision już daje budget).
      const FRAME_INTERVAL = 1000 / 30;
      const t0 = performance.now();
      let lastDrawTime = 0;
      const draw = (now?: number) => {
        if (!runningRef.current) return;
        const ts = now ?? performance.now();
        if (ts - lastDrawTime >= FRAME_INTERVAL) {
          lastDrawTime = ts;
          const t = (ts - t0) / 1000;
          if (uTime) gl.uniform1f(uTime, t);
          if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();

      // IntersectionObserver pause - gdy hero scrolluje poza viewport, shader pauzowany.
      // Defer state change do następnego frame'u - IO callback fires podczas scroll
      // i synchronous cancelAnimationFrame/draw może powodować mikro-ścinkę przy
      // przejściu Hero → Portfolio. rAF defer = state change w idle moment.
      const io = new IntersectionObserver(([entry]) => {
        const visible = entry.isIntersecting;
        requestAnimationFrame(() => {
          if (visible && !runningRef.current) {
            runningRef.current = true; draw();
          } else if (!visible && runningRef.current) {
            runningRef.current = false; cancelAnimationFrame(rafRef.current);
          }
        });
      }, { rootMargin: '100px' });
      io.observe(canvas);

      // Tab visibility pause - gdy karta nieaktywna, shader stopped
      const onVisibility = () => {
        if (document.hidden) {
          runningRef.current = false; cancelAnimationFrame(rafRef.current);
        } else {
          // Wznawiamy tylko jeśli IO uważa że jesteśmy w viewport
          const rect = canvas.getBoundingClientRect();
          const inView = rect.bottom > -100 && rect.top < window.innerHeight + 100;
          if (inView && !runningRef.current) { runningRef.current = true; draw(); }
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        runningRef.current = false;
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      };
    };

    let cancelled = false;
    let shaderCleanup: (() => void) | null = null;

    type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
    const ric = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback;
    const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    const start = () => {
      if (cancelled) return;
      shaderCleanup = setupShader();
    };

    const deferId = ric
      ? ric(start, { timeout: 600 })
      : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (ric && cic) cic(deferId);
      else window.clearTimeout(deferId);
      if (shaderCleanup) shaderCleanup();
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

// Wyrzuciliśmy zmianę stanu na rzecz stałej konfiguracji - zero przeładowań Reacta (0 TBT)
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    delay: 2.65, // Pojawia się najpóźniej, na samej górze (spycha wszystko)
    icon: <Mail size={22} />,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Nowe zapytanie o ofertę",
    time: <span className="text-xs text-slate-500 ml-2">2 min temu</span>,
    timePosition: "right",
    desc: 'Jan Kowalski: "Proszę o wycenę..."',
    hasBottomGap: true // Zastępuje gapy flexboxa
  },
  {
    id: 2,
    delay: 1.95, // Pojawia się pośrodku czasu
    icon: <Calendar size={22} />,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Wizyta potwierdzona",
    time: <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">Jutro 14:00</span>,
    timePosition: "right",
    desc: "Automatyczna rezerwacja online.",
    hasBottomGap: true
  },
  {
    id: 3,
    delay: 1.25, // Pojawia się jako pierwsze (najniżej)
    icon: <MessageSquare size={22} />,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Asystent AI",
    time: <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-1.5 rounded"><Clock size={12} /> 03:42</span>,
    timePosition: "inline",
    desc: "Odpowiedział na 3 pytania klienta.",
    statusIcon: <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /></div>,
    hasBottomGap: false
  }
];

export const Hero = () => {
  const lenis = useLenis();

  // Notification stack - newest na górze, stare zsuwają się w dół (real phone behavior).
  // setTimeouts dodają id-ki w kolejności delay (najmniejszy pierwszy = Asystent),
  // każdy nowy prepend'uje state → renderowanie [latest, ..., oldest].
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  useEffect(() => {
    const sorted = [...NOTIFICATIONS_DATA].sort((a, b) => a.delay - b.delay);
    const timers = sorted.map(n =>
      window.setTimeout(() => {
        setVisibleIds(prev => [n.id, ...prev]);
      }, n.delay * 1000)
    );
    return () => timers.forEach(t => window.clearTimeout(t));
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
        const isDesktop = window.innerWidth >= 1024;

        if (isDesktop && lenis) {
            lenis.scrollTo(elem, { offset: -120, duration: 1.5, lock: false, force: true });
        } else {
            const offsetPosition = elem.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-blue-500/30 pt-32 pb-20 lg:py-0">

      {/* --- TŁO --- Pre-render SSR gradient (visible od first paint, no "pusty" frame)
           + Aurora WebGL canvas overlay z fade-in (smooth subtle pojawienie się).
           Gradient symuluje aurora rest state - ciemne royal blue baseline, mocno
           stłumione żeby flow'owało do WebGL aurora bez visible transition. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 35%, rgba(17, 43, 130, 0.35), transparent 65%), radial-gradient(ellipse 50% 45% at 75% 65%, rgba(47, 91, 235, 0.18), transparent 60%), radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.5), transparent 50%)',
        }}
      >
        <AuroraBackground />
      </div>

      {/* WRAPPER */}
      <div className="w-full max-w-[1800px] 4xl:max-w-[2300px] px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">

        {/* LEWA STRONA (TEXT) - Framer Motion z identycznym setup co modal po prawej
            (scale 0.95 + opacity 0 → scale 1 + opacity 1). Framer automatically promote
            elements do compositor layer (GPU-only animations). `isolate` = osobny
            stacking context. */}
        <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-10 relative z-20 isolate">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide backdrop-blur-sm mx-auto lg:mx-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Strategia i realizacja
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="block"
            >
                TWOJA FIRMA <br />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="block"
            >
                <span className="text-white">WYŻSZY </span>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">
                  POZIOM.
                </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
           Masz potencjał, czas na narzędzia. Zyskujesz nowoczesną stronę internetową, design, który sprzedaje, i automatyzacje pracujące, gdy Ty zajmujesz się biznesem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4 lg:pt-6"
          >
            <Link 
              href="/#oferta"
              onClick={(e) => handleScroll(e, 'oferta')}
              className="relative overflow-hidden group px-10 py-5 bg-white text-slate-950 font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-[0.98] w-full sm:w-auto text-base flex items-center justify-center gap-2"
            >
                Rozwiń biznes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/#proces"
              onClick={(e) => handleScroll(e, 'proces')}
              style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              className="group px-10 py-5 bg-white/8 border border-white/20 text-white font-medium rounded-xl hover:bg-white/14 hover:border-blue-400/50 transition-all duration-300 w-full sm:w-auto flex items-center justify-center text-base shadow-lg shadow-black/20"
            >
              Jak to działa?
            </Link>
          </motion.div>
        </div>

        {/* PRAWA STRONA (Tylko desktop) */}
        <div className="hidden lg:block flex-1 w-full max-w-[650px] relative isolate">
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.05 }}
            >
                <div className="relative bg-slate-950/45 border border-slate-800 border-t-white/10 border-l-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl z-10 overflow-hidden min-h-[540px] flex flex-col">
                    
                    <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-6 shrink-0">
                        <div className="flex gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-700"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-700"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-700"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base font-bold text-white tracking-wide">Powiadomienia</div>
                            <div className="text-xs text-slate-500 font-mono uppercase">Twojej Firmy</div>
                        </div>
                    </div>

                    {/* Notification stack - newest na górze, stare auto-shift w dół przez
                        `layout` prop Framer Motion. Map nad `visibleIds` (state-driven, dodawane
                        po setTimeout). Slot z `overflow-hidden` ucina slide-from-top do widoku. */}
                    <div className="flex-1 relative flex flex-col gap-4 overflow-hidden">
                        {visibleIds.map((id) => {
                            const notif = NOTIFICATIONS_DATA.find(n => n.id === id);
                            if (!notif) return null;
                            return (
                                <motion.div
                                    key={id}
                                    layout="position"
                                    initial={{ opacity: 0, scale: 0.92, y: -80 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 140, damping: 20, mass: 1 }}
                                    className="w-full"
                                >
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] w-full">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}>
                                            {notif.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`flex items-center mb-1 ${notif.timePosition === 'inline' ? 'gap-2' : 'justify-between'}`}>
                                                <p className="text-base font-semibold text-white truncate">{notif.title}</p>
                                                {notif.time}
                                            </div>
                                            <p className="text-sm text-slate-400 truncate">{notif.desc}</p>
                                        </div>
                                        {notif.statusIcon && (
                                            notif.statusIcon
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500 shrink-0">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500"/>
                            <span>Status: Wszystkie usługi aktywne</span>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};