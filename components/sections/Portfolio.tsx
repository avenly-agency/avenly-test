'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects as allProjects } from '@/app/data/projects';

// 1. ZMIANA: Ograniczamy do 4 projektów, aby pasowało do Twojej prośby
const displayedProjects = allProjects.slice(0, 4);

export const Portfolio = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null); 
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRange, setScrollRange] = useState(0); 
  const [isDesktop, setIsDesktop] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: targetRef });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop || !scrollContainerRef.current) return;

    const updateScrollRange = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = window.innerWidth;
            // Obliczamy ile scrolla potrzeba, aby dojść do końca kontenera
            setScrollRange(scrollWidth - clientWidth);
        }
    };

    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, [isDesktop]);

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  // Liczba slajdów: 1 (Intro) + 4 (Projekty) + 1 (CTA) = 6
  const totalSlides = 1 + displayedProjects.length + 1; 

  const handleMobileScroll = () => {
    if (mobileContainerRef.current) {
      const scrollLeft = mobileContainerRef.current.scrollLeft;
      const itemWidth = 320 + 12; 
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  return (
    <div
        className="relative w-full bg-[#050505]"
    >
        
        <section 
            ref={targetRef} 
            // 2. ZMIANA: Wysokość sekcji (scroll distance). 
            // 300vh jest optymalne dla 4 projektów (nie za szybko, nie za wolno)
            className="relative h-dvh md:h-[300vh]"
            aria-label="Portfolio Realizacji"
        >
        
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="sticky top-0 flex h-dvh items-center overflow-hidden w-full bg-[#050505] z-10" style={{ transform: 'translateZ(0)' }}>

                {/* Subtle aurora flow shader - najgłębsza warstwa, daje sekcji "życie".
                    Lekki: mediump + 30fps + DPR 1.0 + IO pause + desktop only. Opacity-40
                    żeby nie konkurował z grid dots, blobs, floor reflection nad nim. */}
                {isDesktop && !shouldReduceMotion && (
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true">
                        <PortfolioFlowBackground />
                    </div>
                )}

                {/* Grid dot pattern - depth signal w tle (zero JS cost, pure CSS) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-60"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                    aria-hidden="true"
                />

                {/* Floor reflection - subtle blue glow przy dolnej krawędzi (sugeruje "podłogę") */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] h-[55vh] z-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at bottom, rgba(37,99,235,0.18), rgba(37,99,235,0.06) 40%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                {isDesktop && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                        <motion.div
                            animate={shouldReduceMotion ? {} : {
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0.4, 0.2],
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen will-change-transform"
                        ></motion.div>
                        <motion.div
                            animate={shouldReduceMotion ? {} : {
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.5, 0.2],
                                x: [0, -40, 0],
                                y: [0, 40, 0],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen will-change-transform"
                        ></motion.div>
                    </div>
                )}

                {isDesktop ? (
                    <motion.div 
                        ref={scrollContainerRef}
                        style={{ x }} 
                        // 3. ZMIANA: PADDINGI CENTRUJĄCE
                        // pl (Intro): 50vw - połowa szerokości karty intro (450/2 = 225)
                        // pr (CTA): 50vw - połowa szerokości karty CTA (350/2 = 175) -> To zapewnia stop na środku
                        className="hidden md:flex gap-12 md:gap-16 items-center w-max h-full pl-[calc(50vw-225px)] pr-[calc(50vw-175px)] relative z-10 will-change-transform"
                    >
                        {/* KARTA INTRO */}
                        <FocusCard index={0} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                            <div className="shrink-0 w-[450px] h-[550px] flex flex-col justify-center p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-[2px] bg-blue-500" aria-hidden="true"></span>
                                    <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">Portfolio</span>
                                </div>
                                <h2 className="text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                                Wybrane <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                    Realizacje
                                </span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-xs leading-relaxed">
                                Zobacz, co dostają nasi klienci. Od stron WWW po chatboty AI.
                                </p>
                            </div>
                        </FocusCard>

                        {/* KARTY PROJEKTÓW */}
                        {displayedProjects.map((project, i) => (
                            <FocusCard key={project.id} index={i + 1} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                                <RevealCard delay={i * 0.2} reduceMotion={shouldReduceMotion}>
                                    <Card project={project} />
                                </RevealCard>
                            </FocusCard>
                        ))}
                        
                        {/* KARTA CTA - DESKTOP */}
                        <FocusCard index={totalSlides - 1} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                            <RevealCard delay={displayedProjects.length * 0.2} reduceMotion={shouldReduceMotion}>
                                <div className="relative h-[450px] w-[350px] flex items-center justify-center shrink-0 rounded-3xl border border-white/5 bg-white/[0.02] cursor-default transition-all duration-500 group backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(37,99,235,0.5)]">
                                    {/* Liquid glass shader - pauzuje się gdy karta poza viewport */}
                                    {!shouldReduceMotion && (
                                        <div className="absolute inset-px" aria-hidden="true">
                                            <LiquidGlassBackground />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                                    <div className="text-center p-8 relative z-10 flex flex-col items-center">
                                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-500">Twój projekt?</h3>
                                        <div className="h-[1px] w-12 bg-blue-500/50 mx-auto my-6 group-hover:w-24 transition-all" aria-hidden="true"></div>
                                        <p className="text-slate-400 text-sm mb-8">Dołącz do liderów rynku i wyskaluj swój biznes.</p>
                                        
                                        <Link 
                                            href="/kontakt"
                                            className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group/btn cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none mb-3"
                                        >
                                            Rozpocznij
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                                        </Link>

                                        <Link 
                                            href="/realizacje" 
                                            className="w-full px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group/link cursor-pointer"
                                        >
                                            <span className="font-medium text-sm">Wszystkie realizacje</span>
                                            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                        </Link>

                                    </div>
                                </div>
                            </RevealCard>
                        </FocusCard>
                    </motion.div>
               ) : (
                    // MOBILE VIEW
                    <div className="md:hidden absolute inset-0 w-full h-full flex flex-col justify-center relative z-10">
                         <div className="container mx-auto px-6 mb-4">
                            <h2 className="text-5xl font-bold text-white tracking-tighter leading-none mb-2">
                            Wybrane <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Realizacje
                            </span>
                            </h2>
                            <p className="text-slate-400 text-xs">Przesuń, aby zobaczyć.</p>
                         </div>

                        {/* 👇 FIX DLA MOBILE SCROLLA TUTAJ 👇 */}
                        <div 
                            ref={mobileContainerRef}
                            onScroll={handleMobileScroll}
                            className="flex items-center overflow-x-auto gap-4 px-6 snap-x snap-mandatory scrollbar-hide pb-8 overscroll-x-contain"
                            data-lenis-prevent // ✅ Blokuje Lenisa w tym kontenerze
                        >
                            {displayedProjects.map((project) => (
                                <div key={project.id} className="snap-center shrink-0">
                                    <Card project={project} isMobile={true} />
                                </div>
                            ))}
                            
                            {/* KARTA CTA - MOBILE */}
                            <div className="snap-center shrink-0 h-[400px] w-[300px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
                                <div className="text-center p-6 flex flex-col items-center w-full">
                                    <h3 className="text-xl font-bold text-white mb-4">Twój projekt?</h3>

                                    <Link
                                        href="/kontakt"
                                        className="w-full px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none mb-3 flex items-center justify-center"
                                    >
                                        Działajmy
                                    </Link>

                                    <Link
                                        href="/realizacje"
                                        className="w-full px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        Wszystkie realizacje
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="shrink-0 w-6" />
                        </div>
                        
                        {/* --- NAWIGACJA (KROPKI) --- */}
                         <div className="flex justify-center items-center gap-2 mt-2 pointer-events-none" aria-hidden="true">
                            {Array.from({ length: displayedProjects.length + 1 }).map((_, index) => (
                                <div 
                                    key={index}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        activeIndex === index 
                                            ? 'w-4 bg-blue-500' 
                                            : 'w-1 bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    </div>
  );
};

// --- SUBKOMPONENTY ---

const RevealCard = ({ children, delay, reduceMotion }: { children: React.ReactNode, delay: number, reduceMotion: boolean | null }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 50, scale: reduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

// 4. ZMIANA: Synchronizacja Blura
// 4. ZMIANA: "Płaskowyż" ostrości
const FocusCard = ({ children, index, total, progress, reduceMotion }: { children: React.ReactNode, index: number, total: number, progress: MotionValue<number>, reduceMotion: boolean | null }) => {
    // Obliczamy "krok" (odległość między środkami kart w skali 0-1)
    const step = 1 / (total - 1); 
    const target = index * step;
    
    // KLUCZOWA ZMIANA:
    // Definiujemy bufor (np. 25% kroku), w którym karta pozostaje idealnie ostra.
    // Im większa liczba (np. 0.4), tym dłużej karta jest ostra.
    const buffer = step * 0.25; 

    // Tworzymy zakres 4-punktowy:
    // 1. Pełne rozmycie (sąsiad z lewej)
    // 2. Początek idealnej ostrości (trochę przed środkiem)
    // 3. Koniec idealnej ostrości (trochę po środku)
    // 4. Pełne rozmycie (sąsiad z prawej)
    const range = [
        target - step, 
        target - buffer, 
        target + buffer, 
        target + step
    ];
    
    const opacity = useTransform(
        progress, 
        range, 
        reduceMotion ? [1, 1, 1, 1] : [0.3, 1, 1, 0.3]
    );
    
    const scale = useTransform(
        progress, 
        range, 
        reduceMotion ? [1, 1, 1, 1] : [0.9, 1, 1, 0.9]
    );
    
    const filter = useTransform(
        progress, 
        range, 
        reduceMotion 
            ? ["none", "none", "none", "none"] 
            : [
                "grayscale(100%) blur(3px)",  // Sąsiad
                "grayscale(0%) blur(0px)",    // Początek strefy sharp
                "grayscale(0%) blur(0px)",    // Koniec strefy sharp
                "grayscale(100%) blur(3px)"   // Sąsiad
              ]
    );

    return (
        <motion.div
            style={{ opacity, scale, filter, willChange: reduceMotion ? 'auto' : 'filter, opacity, transform' }}
            className="origin-center"
        >
            {children}
        </motion.div>
    );
};

const Card = ({ project, isMobile = false }: { project: any, isMobile?: boolean }) => {
  const isExternal = !project.hasCaseStudy;
  const isOpenChat = !!project.openChat;
  const href = isExternal ? (project.externalLink || '#') : `/realizacje/${project.slug}`;
  const target = isExternal ? "_blank" : "_self";

  const handleChatOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("avenly:open-chat"));
  };

  return (
    <div className="group relative h-[450px] w-[320px] md:h-[550px] md:w-[450px] overflow-hidden rounded-3xl bg-[#080808] border border-white/5 shrink-0 transition-all duration-500 shadow-2xl shadow-black/60 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-[0_20px_60px_-12px_rgba(37,99,235,0.45)]">
      
      {/* --- OBRAZEK (Bez zmian) --- */}
      <div className="absolute inset-0">
         <Image 
            src={project.mainImage} 
            alt={project.title} 
            fill 
            sizes={isMobile ? "350px" : "(max-width: 1200px) 50vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-50"
            loading="lazy" 
            quality={75}
         />
      </div>

      {/* --- GRADIENTY (Bez zmian) --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent opacity-90 transition-opacity" aria-hidden="true"></div>
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      )}

      {/* --- TREŚĆ KARTY --- */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end z-10 pointer-events-none">
        {/* Kontener animowany */}
        <div className="transform transition-transform duration-500 ease-out lg:translate-y-[88px] group-hover:translate-y-0">
            
            {/* 1. SEKCJA GÓRNA (Kategoria + Tytuł) */}
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-[2px] bg-blue-500 rounded-full" aria-hidden="true"></span>
                    <p className="text-blue-300 text-[11px] font-bold tracking-widest uppercase shadow-black drop-shadow-md">
                        {project.category}
                    </p>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg min-h-[2.5rem] md:min-h-[5rem] flex items-end">
                    {project.title}
                </h3>
            </div>
            
            {/* 2. SEKCJA UKRYTA (Opis + Buttony) */}
            <div className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <p className="text-slate-300 text-sm leading-relaxed mb-6 border-l-2 border-white/20 pl-4 line-clamp-2 drop-shadow-md mt-2">
                    {project.description}
                </p>
                
                <div className="flex items-center gap-3 pointer-events-auto">
                    {isOpenChat ? (
                        <button
                            onClick={handleChatOpen}
                            className="px-6 py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        >
                            Przetestuj Online
                        </button>
                    ) : (
                        <Link href={href} target={target}>
                            <button className={
                                `px-6 py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                                    isExternal
                                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                    : "bg-white text-black hover:bg-blue-50"
                                }`
                            }>
                                {isExternal ? "Zobacz online" : "Zobacz realizację"}
                            </button>
                        </Link>
                    )}

                    {!isExternal && !isOpenChat && project.externalLink && (
                        <a
                            href={project.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white backdrop-blur-sm cursor-pointer block hover:scale-105 active:scale-95"
                            aria-label="Zobacz stronę na żywo"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
      </div>

      {isOpenChat ? (
        <button
          onClick={handleChatOpen}
          className="absolute inset-0 z-0 focus:outline-none cursor-pointer"
          aria-label="Otwórz asystenta AI Avenly"
        />
      ) : (
        <Link
          href={href}
          target={target}
          className="absolute inset-0 z-0 focus:outline-none"
          aria-label={`Zobacz projekt ${project.title}`}
        />
      )}

    </div>
  );
};

// --- LIQUID GLASS SHADER (karta CTA "Twój projekt?") ---
// Symulacja wnętrza szkła: faked refraction (UV displacement noise'em),
// caustics (smug światła przez "tafle"), orbitujący specular highlight (catch światła),
// rim glow na krawędziach, ciemny rdzeń pod tekst. Inspirowane iOS 26 Liquid Glass.

const LIQUID_GLASS_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const LIQUID_GLASS_FS = `
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
  float aspect = u_resolution.x / u_resolution.y;
  p.x *= aspect;

  float t = u_time * 0.18;

  // 1) FAKED REFRACTION - pole przepływu (UV displacement)
  // Slow flowing field zniekształca pozycję samplowania głębi - symulacja refrakcji
  vec2 flow = vec2(
    snoise(p * 0.9 + vec2(t * 0.4, 0.0)),
    snoise(p * 0.9 + vec2(0.0, t * 0.5))
  );
  vec2 pd = p + flow * 0.18; // displaced sample point

  // 2) BAZOWA GŁĘBIA SZKŁA - radialny gradient z biasem do prawego górnego rogu
  vec2 coreOffset = vec2(0.35, 0.30); // gdzie jest "jasny środek głębi"
  float depth = length((pd - coreOffset) * vec2(1.0, 1.15));

  vec3 deep   = vec3(0.008, 0.014, 0.045);  // near-black blue (krawędzie szkła)
  vec3 royal  = vec3(0.067, 0.169, 0.510);  // #112b82 (środek głębi)
  vec3 vivid  = vec3(0.184, 0.357, 0.922);  // #2f5beb (jaśniejszy punkt)
  vec3 sheen  = vec3(0.55,  0.72,  0.98 );  // catch światła (caustic + spec)

  vec3 col = mix(vivid, royal, smoothstep(0.25, 0.85, depth));
  col = mix(col, deep, smoothstep(0.85, 1.6, depth));

  // 3) SOFT GLOW VARIATION - minimalna modulacja jasności
  float band1 = snoise(pd * 1.2 + flow * 0.4 + vec2(t * 0.3, 0.0));
  float band2 = snoise(pd * 1.6 + flow * 0.3 + vec2(0.0, -t * 0.4));
  float glowVar = smoothstep(-0.4, 1.0, band1) * smoothstep(-0.4, 1.0, band2);
  col += sheen * glowVar * 0.04;

  // 4) SPECULAR HIGHLIGHT - bardzo subtelny "catch" światła, nie konkuruje z tekstem
  float ang = t * 0.5;
  vec2 specPos = vec2(0.55 * cos(ang) + 0.15, 0.40 * sin(ang) + 0.10);
  float spec = exp(-length(p - specPos) * 3.2);
  col += vec3(0.92, 0.96, 1.0) * spec * 0.18;

  // 5) RIM LIGHT - niebieska poświata na krawędziach karty (przyciemniona)
  float rimX = abs(p.x / aspect);
  float rimY = abs(p.y);
  float rim = max(smoothstep(0.78, 1.0, rimX), smoothstep(0.78, 1.0, rimY));
  col += vec3(0.30, 0.55, 0.98) * rim * 0.12;

  // 6) CZYTELNOŚĆ TEKSTU - soft dark area gdzie siedzi h3 + p + buttony
  // Stronger darkening (0.35 zamiast 0.50) żeby spec passing through nie tłukł kontrastu tekstu slate-400
  vec2 textCenter = vec2(0.0, -0.05);
  float textMask = smoothstep(0.85, 0.0, length((p - textCenter) * vec2(1.4, 1.0)));
  col *= mix(1.0, 0.35, textMask);

  // 7) FINAL VIGNETTE - naturalna ciemność rogów
  float vig = smoothstep(1.6, 0.4, length(p * vec2(0.9, 1.0)));
  col *= vig * 0.85 + 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`;

const LiquidGlassBackground = () => {
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
        console.error('LiquidGlass shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, LIQUID_GLASS_VS);
    const fs = compile(gl.FRAGMENT_SHADER, LIQUID_GLASS_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LiquidGlass program link error:', gl.getProgramInfoLog(program));
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
      if (!runningRef.current) return;
      const t = (performance.now() - t0) / 1000;
      if (uTime) gl.uniform1f(uTime, t);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    // Pauza gdy karta poza viewport (Portfolio jest sticky 300vh - często ma ją "za ekranem")
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
      { rootMargin: '200px' },
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

// --- PORTFOLIO FLOW BACKGROUND ---
// Lekki aurora-style shader jako najgłębsza warstwa Portfolio sticky child.
// 2-layer simplex noise z slow drift, blue/indigo palette, low intensity.
// Budget: mediump precision + 30fps throttle + DPR 1.0 + IO pause + desktop only.
// Cel: dać sekcji "życie" subtle pulsem, nie konkurować z LiquidGlass CTA card.

const PORTFOLIO_FLOW_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const PORTFOLIO_FLOW_FS = `
precision mediump float;
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
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  // Bardzo wolny czas - subtle ambient drift
  float t = u_time * 0.06;

  // 2-warstwowy noise z domain warping (lżejszy niż Hero 3-layer)
  float n1 = snoise(p * 0.55 + vec2(t * 0.5, t * 0.3));
  float n2 = snoise(p * 0.85 + vec2(-t * 0.4, t * 0.6) + n1 * 0.4);

  vec3 deep   = vec3(0.020, 0.020, 0.030);  // dark base
  vec3 royal  = vec3(0.067, 0.169, 0.510);  // #112b82 brand royal
  vec3 indigo = vec3(0.184, 0.184, 0.667);  // #2f2faa indigo accent

  vec3 col = deep;
  col = mix(col, royal,  smoothstep(-0.4, 0.7, n1) * 0.55);
  col = mix(col, indigo, smoothstep( 0.0, 1.0, n2) * 0.35);

  // Soft top-to-bottom fade - bottom slightly brighter dla flow z floor reflection
  col *= mix(0.75, 1.0, smoothstep(-1.0, 0.5, p.y));

  // Soft vignette
  float vig = smoothstep(1.5, 0.4, length(p * vec2(0.85, 1.0)));
  col *= vig * 0.7 + 0.3;

  gl_FragColor = vec4(col, 1.0);
}
`;

const PortfolioFlowBackground = () => {
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
        console.error('PortfolioFlow shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, PORTFOLIO_FLOW_VS);
    const fs = compile(gl.FRAGMENT_SHADER, PORTFOLIO_FLOW_FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('PortfolioFlow program link error:', gl.getProgramInfoLog(program));
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

    // DPR clamp 1.0 - bardzo diffuse shader, native res nie potrzebny.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
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

    // 30fps throttle - bardzo wolna animacja (t * 0.06)
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

    // IO pause - sticky 300vh często ma canvas poza viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        requestAnimationFrame(() => {
          if (visible && !runningRef.current) {
            runningRef.current = true; draw();
          } else if (!visible && runningRef.current) {
            runningRef.current = false; cancelAnimationFrame(rafRef.current);
          }
        });
      },
      { rootMargin: '200px' },
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};