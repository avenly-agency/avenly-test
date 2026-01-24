'use client';

import { useRef } from 'react';
// ZMIANA 1: Dodajemy 'Variants' do importu
import { motion, useScroll, useSpring, useTransform, useReducedMotion, MotionValue, Variants } from 'framer-motion';
import { Lightbulb, PenTool, Code2, Rocket } from 'lucide-react';

// ... (reszta kodu steps, Process - bez zmian aż do StepItem) ...
// (Poniżej wklejam tylko fragmenty, które trzeba podmienić, ale najlepiej podmień cały plik, jeśli masz go w całości)

const steps = [
  {
    id: 1,
    title: "Plan i Strategia",
    description: "Słuchamy i analizujemy. Tworzymy plan działania, dzięki któremu strona stanie się skutecznym narzędziem do zarabiania, jak i budującą wizerunek wizytówką.",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "Projekt Graficzny",
    description: "Nie kupujesz kota w worku. Zobaczysz wizualizację strony przed wdrożeniem. Projektujemy tak, aby klienci od razu wiedzieli, dlaczego warto Ci zaufać.",
    icon: PenTool,
  },
  {
    id: 3,
    title: "Budowa i Technologia",
    description: "My bierzemy na siebie całe zaplecze techniczne i programowanie. Otrzymujesz szybką, bezpieczną stronę, która po prostu działa – bez konieczności znania się na kodzie",
    icon: Code2,
  },
  {
    id: 4,
    title: "Start i Wsparcie",
    description: "Sprawdzamy każdy detal i uruchamiamy stronę. Podpinamy statystyki, żebyś widział efekty. Twój biznes jest gotowy na przyjęcie nowych klientów.",
    icon: Rocket,
  },
];

export const Process = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();
  
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start center", "end center"]
    });
  
    const scaleY = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    });
  
    return (
      <section 
          ref={containerRef} 
          className="relative w-full py-24 md:py-32 bg-[#050505] overflow-hidden"
          aria-label="Proces realizacji projektu"
      >
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-20"></div>
          </div>
  
          <div className="container mx-auto px-4 relative z-10">
              <header className="text-center mb-20 md:mb-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Proces</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                      Jak to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Działa?</span>
                  </h2>
              </header>
  
              <div className="relative w-full max-w-5xl mx-auto">
                  <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-white/10 rounded-full overflow-hidden z-10 h-full">
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
  
                  <ol className="flex flex-col gap-12 md:gap-24 m-0 p-0 list-none relative z-20">
                      {steps.map((step, index) => (
                          <StepItem 
                              key={step.id} 
                              step={step} 
                              index={index} 
                              globalProgress={scrollYProgress} 
                              reduceMotion={shouldReduceMotion}
                          />
                      ))}
                  </ol>
              </div>
          </div>
      </section>
    );
};

// --- KOMPONENT KROKU (Z NAPRAWIONYM TYPEM) ---
const StepItem = ({ step, index, globalProgress, reduceMotion }: { 
    step: typeof steps[0], 
    index: number, 
    globalProgress: MotionValue<number>,
    reduceMotion: boolean | null
}) => {
    
    const isEven = index % 2 === 0; 
    const isOdd = !isEven;          

    // ZMIANA 2: Dodajemy typ ': Variants'
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const liClass = `relative flex items-center w-full md:w-[50%] pl-20 md:pl-0
        ${isEven 
            ? 'md:ml-auto md:justify-start md:pl-24' 
            : 'md:mr-auto md:justify-end md:pr-24 md:text-right' 
        }
    `;

    const dotPositionClass = `absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#050505] z-30 bg-[#050505]
        left-[22px]  
        ${isEven ? 'md:left-[-8px]' : 'md:right-[-8px] md:left-auto'}
    `;

    const connectorClass = `absolute top-1/2 -translate-y-1/2 h-[1px] z-10
        w-[30px] left-[28px] bg-gradient-to-r from-blue-500 to-transparent
        ${isEven 
            ? 'md:w-[96px] md:left-0 md:bg-gradient-to-r' 
            : 'md:w-[96px] md:right-0 md:left-auto md:bg-gradient-to-l'
        }
    `;

    const connectorDotClass = `absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full
        right-0
        ${isEven ? 'md:right-0' : 'md:left-0 md:right-auto'}
    `;

    return (
        <li className={liClass}>
            <motion.div 
                initial={{ scale: 0, backgroundColor: "#334155" }}
                whileInView={{ scale: 1, backgroundColor: "#60a5fa" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
                className={dotPositionClass}
                aria-hidden="true"
            >
                <div className="absolute inset-0 bg-blue-500 blur-[6px] opacity-50"></div>
            </motion.div>

            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`${connectorClass} origin-left ${!isEven && 'md:origin-right'}`}
                aria-hidden="true"
            >
                 <div className={connectorDotClass}></div>
            </motion.div>

            <motion.div 
                variants={cardVariants} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-[#080808] w-full max-w-md hover:border-blue-500/30 transition-colors duration-500"
            >   
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true"></div>

                <div className={`relative z-10 flex flex-col gap-3 ${isOdd && 'md:items-end'}`}>
                    <div className={`flex items-center gap-3 ${isOdd && 'md:flex-row-reverse'}`}>
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