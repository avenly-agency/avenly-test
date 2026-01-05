'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ArrowRight, CalendarCheck } from 'lucide-react';

export const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? false;

  const fadeInUpVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30 
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

  return (
    <section 
      ref={containerRef}
      aria-label="Rozpocznij współpracę"
      // ZMIANA: Zmniejszono padding pionowy na mobile (py-16 zamiast py-24)
      className="relative w-full py-16 lg:py-32 bg-[#050505] overflow-hidden"
    >
      {/* --- TŁO AMBIENT --- */}
      <div className="absolute inset-0 pointer-events-none">
          {/* ZMIANA: Większy, ale bardziej rozmyty blob na mobile, żeby nie robił "plamy" */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative max-w-5xl mx-auto">
            
            {/* GLOW EFFECT ZA KARTĄ */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            {/* GŁÓWNA KARTA CTA */}
            {/* ZMIANA: Zmniejszono padding wewnętrzny na mobile (p-6) */}
            <div className="relative rounded-[1.5rem] md:rounded-[2rem] bg-[#080808] border border-white/10 p-6 sm:p-10 md:p-16 text-center overflow-hidden">
                
                {/* ODBLASK (Grid pattern) */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* LABEL */}
                    <motion.div 
                        custom={0}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        // ZMIANA: Mniejszy margin bottom (mb-6)
                        className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 md:mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-blue-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">Mamy wolne moce przerobowe</span>
                    </motion.div>

                    {/* TYTUŁ */}
                    <motion.h2 
                        custom={0.1}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        // ZMIANA: Mniejszy font na mobile (3xl), żeby się nie łamał brzydko
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 md:mb-6 leading-[1.1]"
                    >
                        Gotowy na cyfrową <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Dominację?
                        </span>
                    </motion.h2>

                    {/* OPIS */}
                    <motion.p 
                        custom={0.2}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        // ZMIANA: Mniejszy margin (mb-8) i font (text-base) na mobile
                        className="text-slate-400 text-base md:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed"
                    >
                        Nie marnuj potencjału na przeciętne strony i przestarzałe procesy. 
                        Zbudujmy system, który pracuje na Twój sukces 24/7.
                    </motion.p>

                    {/* BUTTONS GROUP */}
                    <motion.div 
                        custom={0.3}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto"
                    >
                        {/* PRIMARY BUTTON */}
                        {/* ZMIANA: py-3 na mobile (kompaktowy) */}
                        <button className="group relative w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-black text-base md:text-lg font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)] !cursor-pointer flex items-center justify-center gap-2 md:gap-3 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Darmowa Konsultacja
                                <CalendarCheck className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        </button>

                        {/* SECONDARY BUTTON */}
                        {/* ZMIANA: py-3 na mobile */}
                        <button className="group w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-transparent border border-white/10 text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/5 transition-all duration-300 !cursor-pointer flex items-center justify-center gap-2 md:gap-3 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
                            Napisz do nas
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300 text-slate-400 group-hover:text-white" />
                        </button>
                    </motion.div>

                    {/* SOCIAL PROOF */}
                    <motion.div 
                        custom={0.4}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        // ZMIANA: Mniejszy margin top (mt-8)
                        className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-500"
                    >
                        <div className="flex -space-x-3">
                             <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 border-2 border-[#080808]"></div>
                             <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-700 border-2 border-[#080808]"></div>
                             <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-600 border-2 border-[#080808]"></div>
                        </div>
                        <p>Dołącz do firm, które wyprzedziły konkurencję.</p>
                    </motion.div>

                </div>
            </div>
        </div>
      </div>
    </section>
  );
};