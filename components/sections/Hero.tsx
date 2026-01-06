'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react'; // <--- IMPORT LENIS

// Warianty tylko dla desktopu
const blobVariants: Variants = {
  animateLeft: {
    scale: [1, 1.5, 1],
    opacity: [0.2, 0.4, 0.2],
    x: [0, 50, 0],
    y: [0, -30, 0],
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
  },
  animateRight: {
    scale: [1, 1.3, 1],
    opacity: [0.2, 0.5, 0.2],
    x: [0, -40, 0],
    y: [0, 40, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }
  }
};

export const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const lenis = useLenis(); // <--- HOOK DO SCROLLA

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // --- FUNKCJA WYMUSZAJĄCA SCROLL ---
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); // Blokujemy domyślne zachowanie przeglądarki (która by nic nie zrobiła)
    
    // Ręczne wywołanie scrolla
    const elem = document.getElementById(targetId);
    if (elem && lenis) {
        lenis.scrollTo(elem, { 
            offset: -120, // Offset na navbar
            duration: 1.5,
            lock: false,
            force: true // Wymuszenie
        });
    }
  };

  return (
    <section 
        className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-blue-500/30 pt-32 pb-20 lg:py-0"
    >
      
      {/* --- TŁO HYBRYDOWE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="md:hidden absolute inset-0">
            <div className="absolute top-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-blue-600/15 blur-[80px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-20%] w-[90vw] h-[90vw] bg-indigo-500/15 blur-[80px] rounded-full mix-blend-screen"></div>
        </div>

        {isDesktop && (
            <>
                <motion.div 
                    variants={blobVariants}
                    animate="animateLeft"
                    className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen will-change-transform transform-gpu" 
                />
                <motion.div 
                    variants={blobVariants}
                    animate="animateRight"
                    className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen will-change-transform transform-gpu"
                />
            </>
        )}
      </div>

      {/* WRAPPER TREŚCI */}
      <div className="w-full max-w-[1800px] px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* LEWA STRONA: CONTENT */}
        <div className="flex-1 text-center lg:text-left space-y-10 relative z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide backdrop-blur-sm mx-auto lg:mx-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            AUTOMATYZACJA I WZROST
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] will-change-[opacity,transform]"
          >
            TWOJA FIRMA <br />
            <span className="text-white">WYŻSZY </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              POZIOM.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
           Masz potencjał, teraz czas na narzędzia. Przekształćmy twój biznes w nowoczesną markę, gotową na skalowanie zysków i automatyzację sprzedaży.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6"
          >
            {/* PRZYCISK 1: Link do Oferty */}
            <Link 
              href="/#oferta"
              onClick={(e) => handleScroll(e, 'oferta')} // <--- OBSŁUGA KLIKNIĘCIA
              className="relative overflow-hidden group px-10 py-5 bg-white text-slate-950 font-bold rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-base flex items-center justify-center gap-2"
            >
                Rozwiń Biznes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
            
            {/* PRZYCISK 2: Link do Procesu */}
            <Link 
              href="/#proces"
              onClick={(e) => handleScroll(e, 'proces')} // <--- OBSŁUGA KLIKNIĘCIA
              className="group px-10 py-5 bg-transparent border border-slate-700 text-slate-300 font-medium rounded-xl hover:border-blue-500/50 hover:bg-slate-900/50 hover:text-white transition-all duration-500 cursor-pointer backdrop-blur-sm w-full sm:w-auto flex items-center justify-center text-base"
            >
              Jak To Działa?
            </Link>
          </motion.div>
        </div>

        {/* PRAWA STRONA: MODAL */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block flex-1 w-full max-w-[650px] relative perspective-1000"
          aria-hidden="true"
        >
          {isDesktop && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[80px] -z-10 rounded-full will-change-transform"
              />
          )}

          <div className="relative bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl z-10 ring-1 ring-white/5 overflow-hidden">
            
            <div className="flex items-center justify-between mb-10 border-b border-slate-800/50 pb-6">
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

            <div className="space-y-5 relative">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-blue-500/30 transition-all duration-500 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500 shrink-0 z-10 ring-4 ring-slate-950">
                  <Mail size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-base font-semibold text-white truncate">Nowe zapytanie o ofertę</h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">2 min temu</span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">Jan Kowalski: "Proszę o wycenę..."</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-emerald-500/30 transition-all duration-500 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 shrink-0 z-10 ring-4 ring-slate-950">
                  <Calendar size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-base font-semibold text-white truncate">Wizyta potwierdzona</h4>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap ml-2">
                      Jutro 14:00
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">Automatyczna rezerwacja online.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-purple-500/30 transition-all duration-500 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-500 shrink-0 z-10 ring-4 ring-slate-950">
                  <MessageSquare size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-semibold text-white truncate">Asystent AI</h4>
                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-1.5 rounded">
                        <Clock size={12} /> 03:42
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">Odpowiedział na 3 pytania klienta.</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500"/>
                <span>Status: Wszystkie usługi aktywne</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};