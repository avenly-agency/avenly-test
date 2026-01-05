'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import { Lightbulb, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Discovery & Strategia",
    description: "Nie zgadujemy. Analizujemy Twój biznes, konkurencję i ustalamy KPI. Budujemy fundament pod skalowalny wzrost.",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "UX/UI Design",
    description: "Tworzymy makiety high-fidelity. Projektujemy doświadczenia, które konwertują odwiedzających w płacących klientów.",
    icon: PenTool,
  },
  {
    id: 3,
    title: "Development & AI",
    description: "Kodowanie w Next.js. Integracja z headless CMS i wdrożenie automatyzacji AI, która oszczędzi Twój czas.",
    icon: Code2,
  },
  {
    id: 4,
    title: "Launch & Skalowanie",
    description: "Testy wydajności, wdrożenie na produkcję (Vercel) i podpięcie analityki. Twój system jest gotowy na ruch.",
    icon: Rocket,
  },
];

export const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section 
        ref={containerRef} 
        className="relative w-full min-h-[300vh] bg-[#050505]"
        aria-label="Proces realizacji projektu"
    >
      
      {/* --- STICKY CONTAINER --- */}
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden py-12 md:py-0">
        
        {/* TŁO AMBIENT */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-20"></div>
        </div>

        {/* HEADER */}
        <header className="relative z-20 text-center mb-12 md:mb-16 px-4 shrink-0 mt-8 md:mt-0">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Roadmapa</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Jak to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Działa?</span>
            </h2>
        </header>

        {/* --- TIMELINE WRAPPER --- */}
        <div className="relative w-full max-w-5xl mx-auto flex gap-8 md:gap-0 px-4 md:px-0">
            
            {/* 1. LINIA CENTRALNA (THE BEAM) */}
            {/* Zmieniono left na mobile, aby lepiej pasował do paddingu listy */}
            <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-white/10 rounded-full overflow-hidden z-10">
                <motion.div 
                    style={{ 
                        height: "100%", 
                        scaleY: shouldReduceMotion ? 1 : scaleY, 
                        transformOrigin: "top" 
                    }}
                    className="w-full bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-400 shadow-[0_0_20px_2px_rgba(59,130,246,0.5)] will-change-transform"
                    aria-hidden="true"
                ></motion.div>
            </div>

            {/* 2. KROKI (STEPS) */}
            <ol className="w-full flex flex-col gap-12 md:gap-24 pl-20 md:pl-0 relative z-20 m-0 py-16 md:py-20">
                {steps.map((step, index) => (
                    <StepItem 
                        key={step.id} 
                        step={step} 
                        index={index} 
                        total={steps.length}
                        progress={scrollYProgress}
                        reduceMotion={shouldReduceMotion}
                    />
                ))}
            </ol>

        </div>

        {/* Scroll Indicator */}
        {!shouldReduceMotion && (
            <motion.div 
                style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [1, 0]) }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] uppercase tracking-widest animate-bounce md:block hidden pointer-events-none"
                aria-hidden="true"
            >
                Scroll Down
            </motion.div>
        )}

      </div>
    </section>
  );
};

// --- KOMPONENT KROKU (<li>) ---
const StepItem = ({ step, index, total, progress, reduceMotion }: { 
    step: typeof steps[0], 
    index: number, 
    total: number, 
    progress: MotionValue<number>,
    reduceMotion: boolean | null
}) => {
    
    // Zakresy aktywacji
    const stepPart = 1 / total;
    const start = stepPart * index;
    
    // Animacje
    const opacity = useTransform(progress, [start, start + 0.15], reduceMotion ? [1, 1] : [0.3, 1]);
    const scale = useTransform(progress, [start, start + 0.15], reduceMotion ? [1, 1] : [0.95, 1]);
    const glowOpacity = useTransform(progress, [start, start + 0.1], reduceMotion ? [1, 1] : [0, 1]);
    const dotColor = useTransform(progress, [start, start + 0.1], ["#334155", "#60a5fa"]);
    
    // Animacja connectora (skalowanie X)
    const connectorScale = useTransform(progress, [start, start + 0.1], [0, 1]);

    const isEven = index % 2 === 0;

    // Klasy layoutu (Naprzemiennie na desktopie)
    const liClass = `relative flex items-center md:w-[50%] ${
        isEven ? 'md:ml-auto md:justify-start md:pl-24' : 'md:mr-auto md:justify-end md:pr-24 md:text-right'
    }`;

    // Pozycjonowanie kropki (Musi pasować idealnie do linii centralnej)
    // Mobile: Linia jest na left: 39px. Kropka (w-4 = 16px) musi być wycentrowana na 39px+2px = 41px.
    // Tutaj pozycjonujemy względem <li>, który ma pl-20 (80px).
    // Kropka na desktopie jest pozycjonowana względem krawędzi środkowej.
    const dotPositionClass = `absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#050505] z-30 shadow-sm
        left-[-38px] md:left-auto md:right-auto 
        ${isEven ? 'md:left-[-8px]' : 'md:right-[-8px]'}
    `;

   // POPRAWIONE POZYCJONOWANIE CONNECTORA
    // Dodano 'md:left-auto' dla kart po lewej stronie, aby nadpisać mobilny 'left'
    const connectorClass = `absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-blue-500 to-transparent z-10
        w-[32px] left-[-32px] 
        md:w-[96px] 
        ${isEven 
            ? 'md:left-0 origin-left'   // Prawa strona (Działa dobrze)
            : 'md:right-0 md:left-auto origin-right bg-gradient-to-l' // Lewa strona (FIX: resetujemy left)
        }
    `;

    return (
        <li className={liClass}>
            
            {/* PUNKT NA LINII */}
            <motion.div 
                style={{ backgroundColor: dotColor }}
                className={dotPositionClass}
                aria-hidden="true"
            >
                <motion.div 
                    style={{ opacity: glowOpacity }}
                    className="absolute inset-0 bg-blue-500 blur-md rounded-full"
                />
            </motion.div>

            {/* --- TECH CONNECTOR (NAPRAWIONY) --- */}
            <motion.div 
                // POPRAWKA: Używamy 'reduceMotion' zamiast 'shouldReduceMotion'
                style={{ scaleX: reduceMotion ? 1 : connectorScale }}
                className={connectorClass}
                aria-hidden="true"
            >
                {/* Mała kropka na końcu linii (przy karcie) */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full ${isEven ? 'right-0' : 'left-0'}`}></div>
            </motion.div>

            {/* KARTA TREŚCI */}
            <motion.div 
                style={{ opacity, scale }}
                className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-[#080808] w-full max-w-md hover:border-blue-500/30 transition-colors duration-500"
            >   
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true"></div>

                <div className={`relative z-10 flex flex-col gap-3 ${!isEven && 'md:items-end'}`}>
                    <div className={`flex items-center gap-3 ${!isEven && 'md:flex-row-reverse'}`}>
                         <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                             <step.icon size={20} aria-hidden="true" />
                         </div>
                         <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">
                             Krok 0{step.id}
                         </span>
                    </div>

                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                            {step.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </li>
    );
};