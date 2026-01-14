'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

export const Hero = () => {
  const [showHeavyContent, setShowHeavyContent] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    // Opóźniamy ładowanie ciężkich elementów (tło, modal)
    const timer = setTimeout(() => {
        setShowHeavyContent(window.innerWidth >= 1024);
    }, 0);

    const handleResize = () => setShowHeavyContent(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    
    // --- USUNIĘTO BLOKADĘ SCROLLA ---
    // Wcześniej tu był kod lenis.stop(), który blokował telefon.
    // Teraz scroll na mobile będzie działał natywnie i płynnie.

    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
    };
  }, []); // Usunięto zależność [lenis], bo nie sterujemy nim stąd

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
        // Logika scrolla: Lenis na desktopie, Native na mobile
        if (showHeavyContent && lenis) {
            lenis.scrollTo(elem, { offset: -120, duration: 1.5, lock: false, force: true });
        } else {
            // Natywny scroll dla mobile (niezawodny)
            const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }
  };

  return (
    <>
    <style jsx global>{`
      @keyframes floatBlobLeft {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        50% { transform: translate(50px, -30px) scale(1.5); opacity: 0.4; }
      }
      @keyframes floatBlobRight {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        50% { transform: translate(-40px, 40px) scale(1.3); opacity: 0.5; }
      }
      .animate-blob-left {
        animation: floatBlobLeft 12s infinite ease-in-out;
        will-change: transform, opacity;
      }
      .animate-blob-right {
        animation: floatBlobRight 15s infinite ease-in-out;
        animation-delay: 2s;
        will-change: transform, opacity;
      }
    `}</style>

    <section 
        className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-blue-500/30 pt-32 pb-20 lg:py-0 content-visibility-auto"
    >
      
      {/* --- TŁO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* MOBILE: Statyczny Gradient */}
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.12),transparent_60%)]"></div>

        {/* DESKTOP: Animacje CSS */}
        {showHeavyContent && (
            <>
                <div className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-blob-left" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-blob-right" />
            </>
        )}
      </div>

      {/* WRAPPER */}
      <div className="w-full max-w-[1800px] px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* LEWA STRONA (TEXT) */}
        <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-10 relative z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide backdrop-blur-sm mx-auto lg:mx-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            STRATEGIA I REALIZACJA
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="block"
            >
                TWOJA FIRMA <br />
            </motion.span>
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block"
            >
                <span className="text-white">WYŻSZY </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  POZIOM.
                </span>
            </motion.span>
          </h1>

          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
           Masz potencjał, teraz czas na narzędzia. Przekształćmy twój biznes w nowoczesną markę, gotową na skalowanie zysków i automatyzację sprzedaży.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4 lg:pt-6"
          >
            <Link 
              href="/#oferta"
              onClick={(e) => handleScroll(e, 'oferta')}
              className="relative overflow-hidden group px-10 py-5 bg-white text-slate-950 font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-[0.98] w-full sm:w-auto text-base flex items-center justify-center gap-2"
            >
                Rozwiń Biznes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/#proces"
              onClick={(e) => handleScroll(e, 'proces')}
              className="group px-10 py-5 bg-transparent border border-slate-700 text-slate-300 font-medium rounded-xl hover:border-blue-500/50 hover:bg-slate-900/50 hover:text-white transition-all duration-300 w-full sm:w-auto flex items-center justify-center text-base"
            >
              Jak To Działa?
            </Link>
          </motion.div>
        </div>

        {/* PRAWA STRONA (Tylko desktop) */}
        {showHeavyContent && (
            <div className="hidden lg:block flex-1 w-full max-w-[650px] relative perspective-1000">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[80px] -z-10 rounded-full animate-blob-left" />

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
                            {/* Karta 1 */}
                            <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-base font-semibold text-white truncate">Nowe zapytanie o ofertę</h4>
                                        <span className="text-xs text-slate-500 ml-2">2 min temu</span>
                                    </div>
                                    <p className="text-sm text-slate-400 truncate">Jan Kowalski: "Proszę o wycenę..."</p>
                                </div>
                            </div>

                            {/* Karta 2 */}
                            <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Calendar size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-base font-semibold text-white truncate">Wizyta potwierdzona</h4>
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">Jutro 14:00</span>
                                    </div>
                                    <p className="text-sm text-slate-400 truncate">Automatyczna rezerwacja online.</p>
                                </div>
                            </div>

                            {/* Karta 3 */}
                            <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
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
        )}

      </div>
    </section>
    </>
  );
};