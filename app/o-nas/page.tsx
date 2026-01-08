'use client';

import { useRef, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Zap, Users, Clock, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Rejestracja wtyczki (bezpieczna dla SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- DANE ---
const STATS = [
  { value: '100%', label: 'Zaangażowania', desc: 'W Twój projekt', icon: Users },
  { value: '98/100', label: 'Google PageSpeed', desc: 'Wydajność naszych stron', icon: Zap },
  { value: '< 24h', label: 'Czas reakcji', desc: 'Na Twoje zgłoszenie', icon: Clock },
  { value: '1:1', label: 'Model współpracy', desc: 'Bezpośredni kontakt', icon: Star },
];

const VALUES = [
    'Transparentność na każdym etapie',
    'Partnerstwo w biznesie, nie tylko kod',
    'Nowoczesne technologie (Next.js, AI)',
    'Dbałość o detale i UX',
    'Terminowość dowożenia projektów'
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  // Fix na hydrację
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    let ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        // --- KONFIGURACJA ANIMACJI SCROLLA ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", // Długość trwania efektu
            pin: true,     // Przyklejamy sekcję
            scrub: 1,      // Płynność (bezwładność)
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        });

        // 1. DESKTOP ZOOM
        mm.add("(min-width: 769px)", () => {
           tl.to(textRef.current, {
             scale: 50,
             transformOrigin: "42% 45%", // Celujemy w dziurę w "E"
             ease: "power2.inOut",
           });
        });

        // 2. MOBILE ZOOM
        mm.add("(max-width: 768px)", () => {
            tl.to(textRef.current, {
              scale: 80, 
              transformOrigin: "50% 50%", 
              ease: "power2.inOut",
            });
         });

        // Wspólne animacje (zanikanie napisu + przybliżanie tła)
        tl.to(textRef.current, {
          opacity: 0,
          duration: 0.1, 
          ease: "none"
        }, ">-0.1")
        
        .to(bgRef.current, {
          scale: 1.2, // Tło lekko się przybliża
          ease: "none"
        }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* --- SEKCJA HERO --- */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
        
        <div className="absolute inset-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden">

            {/* --- TŁO "DIGITAL NEBULA" --- */}
            {/* Dodano brightness-125 na mobile, żeby wyciągnąć kolory z czerni */}
            <div ref={bgRef} className="absolute inset-0 w-full h-[120%] bg-[#020202] will-change-transform overflow-hidden brightness-125 md:brightness-100">
                
                {/* 1. Tło bazowe */}
                <div className="absolute inset-0 bg-black" />

                {/* 2. Pierwsza warstwa mgławicy (Ciemny Błękit) */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-70 mix-blend-screen animate-spin-very-slow">
                     {/* MOBILE: Jaśniejszy niebieski (#2563eb - blue-600) | DESKTOP: Ciemny granat (#1e3a8a) */}
                     <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#2563eb_25%,#000000_50%,#1d4ed8_75%,#000000_100%)] md:bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#1e3a8a_25%,#000000_50%,#172554_75%,#000000_100%)] blur-[80px]" />
                </div>

                {/* 3. Druga warstwa (Kontra) */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 mix-blend-hard-light animate-spin-reverse-slow">
                     {/* MOBILE: Bardzo jasny błękit (#60a5fa - blue-400) | DESKTOP: Standardowy niebieski (#2563eb) */}
                     <div className="w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,#000000_0%,#60a5fa_30%,#000000_50%,#3b82f6_70%,#000000_100%)] md:bg-[conic-gradient(from_180deg_at_50%_50%,#000000_0%,#2563eb_30%,#000000_50%,#3b82f6_70%,#000000_100%)] blur-[90px]" />
                </div>

            </div>

            {/* MASKA Z NAPISEM */}
            <div 
                ref={textRef}
                className="absolute inset-0 bg-[#050505] z-10 flex items-center justify-center mix-blend-multiply pointer-events-none will-change-transform"
            >
                <h1 className="text-[25vw] md:text-[22vw] font-black text-white tracking-tighter leading-none select-none text-center whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                    AVENLY
                </h1>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-slate-500 text-sm font-medium animate-bounce flex flex-col items-center gap-2 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.2em]">Scrolluj w dół</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-blue-500 to-transparent"></div>
            </div>
            
        </div>
      </div>

      {/* --- TREŚĆ --- */}
      <div className="relative z-30 bg-[#050505] pt-24 pb-24 border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <div className="container mx-auto px-6">
              
              <div className="max-w-4xl mb-24">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="h-[1px] w-12 bg-blue-500"></div>
                      <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">O nas</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                      Nie jesteśmy kolejną korporacją. <br className="hidden md:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                          Jesteśmy Twoim partnerem.
                      </span>
                  </h2>
                  
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl text-balance">
                      Tworzymy oprogramowanie, które realnie wspiera biznes. Łączymy inżynierską precyzję z designem, który sprzedaje.
                  </p>
                  
                  <div className="mt-10">
                    <a 
                        href="/kontakt" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-blue-600/50"
                    >
                        Rozpocznijmy współpracę
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
              </div>

              {/* STATYSTYKI */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-20">
                  {STATS.map((stat, index) => (
                      <div 
                        key={index} 
                        className="group p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                      >
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                              <stat.icon size={24} />
                          </div>
                          <span className="block text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                              {stat.value}
                          </span>
                          <span className="block text-lg font-bold text-white mb-1">
                              {stat.label}
                          </span>
                          <span className="text-sm text-slate-400 font-medium">
                              {stat.desc}
                          </span>
                      </div>
                  ))}
              </div>

              {/* ZESPÓŁ I WARTOŚCI */}
              <div className="mt-32 grid lg:grid-cols-2 gap-16 items-center">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[#080808] border border-white/10 group">
                      {/* Gradient w tle kafelka - teraz tylko niebieski */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-900/10 opacity-50" />
                      
                      {/* Animowane echo mgławicy w kafelku - tylko niebieskie */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                           <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#1e40af_50%,transparent_100%)] animate-spin-very-slow blur-[50px]" />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                           <div className="relative z-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse" />
                                    <div>
                                        <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                                        <div className="h-2 w-16 bg-white/10 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-48 bg-white/10 rounded" />
                                    <div className="h-2 w-32 bg-white/10 rounded" />
                                </div>
                           </div>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-3xl font-bold text-white mb-6">
                          Robimy to, co naprawdę lubimy.
                      </h3>
                      <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                          Jesteśmy zespołem pasjonatów, dla których kod to coś więcej niż praca. 
                          Każdy projekt traktujemy jak wyzwanie inżynieryjne i artystyczne.
                      </p>
                      
                      <ul className="space-y-4">
                          {VALUES.map((item) => (
                              <li key={item} className="flex items-start gap-3 text-slate-300 font-medium group">
                                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 border border-blue-500/20">
                                      <CheckCircle2 size={12} strokeWidth={3} />
                                  </div>
                                  {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

          </div>
      </div>
    </main>
  );
}