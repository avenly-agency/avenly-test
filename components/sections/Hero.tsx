'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

// STYLE WYCIĄGNIĘTE POZA KOMPONENT
// Dodane 'backface-visibility: hidden' i 'transform: translateZ(0)' wymuszają renderowanie tła na karcie graficznej (GPU), odciążając procesor
const BLOB_STYLES = `
  @keyframes pureBlob1 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.2; }
    50% { transform: translate3d(50px, -30px, 0) scale(1.5); opacity: 0.4; }
  }
  @keyframes pureBlob2 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.2; }
    50% { transform: translate3d(-40px, 40px, 0) scale(1.3); opacity: 0.5; }
  }
  @keyframes pureBlob3 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.15; }
    50% { transform: translate3d(30px, -20px, 0) scale(1.2); opacity: 0.35; }
  }
  .css-anim-blob-1, .css-anim-blob-2, .css-anim-blob-3 {
    will-change: transform, opacity;
    backface-visibility: hidden;
  }
  .css-anim-blob-1 { animation: pureBlob1 12s infinite ease-in-out; }
  .css-anim-blob-2 { animation: pureBlob2 15s infinite ease-in-out 2s both; }
  .css-anim-blob-3 { animation: pureBlob3 12s infinite ease-in-out; }
`;

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: BLOB_STYLES }} />
    
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-blue-500/30 pt-32 pb-20 lg:py-0">
      
      {/* --- TŁO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.12),transparent_60%)]" />

        <div className="hidden lg:block">
            <div className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw]">
                <div className="w-full h-full bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen css-anim-blob-1" />
            </div>
            
            <div className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw]">
                <div className="w-full h-full bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen css-anim-blob-2" />
            </div>
        </div>
      </div>

      {/* WRAPPER */}
      <div className="w-full max-w-[1800px] px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* LEWA STRONA (TEXT) */}
        <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-10 relative z-20">
          
          <motion.div 
            {...fadeInUp}
            className="max-lg:!opacity-100 max-lg:!transform-none inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide backdrop-blur-sm mx-auto lg:mx-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            STRATEGIA I REALIZACJA
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            <motion.span
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-lg:!opacity-100 max-lg:!transform-none block"
            >
                TWOJA FIRMA <br />
            </motion.span>
            <motion.span
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-lg:!opacity-100 max-lg:!transform-none block"
            >
                <span className="text-white">WYŻSZY </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  POZIOM.
                </span>
            </motion.span>
          </h1>

          <motion.p 
             {...fadeInUp}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="max-lg:!opacity-100 max-lg:!transform-none text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
           Masz potencjał, teraz czas na narzędzia. Przekształćmy twój biznes w nowoczesną markę, gotową na skalowanie zysków i automatyzację sprzedaży.
          </motion.p>

          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-lg:!opacity-100 max-lg:!transform-none flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4 lg:pt-6"
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
        <div className="hidden lg:block flex-1 w-full max-w-[650px] relative isolate">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none -z-10">
                <div className="w-full h-full bg-blue-500/30 blur-[80px] rounded-full css-anim-blob-3" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="relative bg-slate-950/40 border border-slate-800 border-t-white/10 border-l-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl z-10 overflow-hidden min-h-[460px] flex flex-col">
                    
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

                    {/* Uwaga: wyrzucony `space-y-4` zapobiega powstawaniu białych znaków, gdy element obok ma wysokość zero */}
                    <div className="flex-1 relative flex flex-col">
                        {NOTIFICATIONS_DATA.map((notif) => (
                            <motion.div
                                key={notif.id}
                                /* POCZĄTKOWY STAN: Całkowicie zwinięty element (wysokość 0) z przesunięciem -20px na osi Y */
                                initial={{ height: 0, opacity: 0, scale: 0.95, y: -20 }}
                                /* ANIMOWANY STAN: Rozwija się od góry w ułamek sekundy i fizycznie pcha elementy niżej */
                                animate={{ height: "auto", opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: notif.delay, type: "spring", stiffness: 400, damping: 25 }}
                                className="w-full overflow-hidden"
                            >
                                <div className={`${notif.hasBottomGap ? 'pb-4' : ''}`}>
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] w-full">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}>
                                            {notif.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`flex items-center mb-1 ${notif.timePosition === 'inline' ? 'gap-2' : 'justify-between'}`}>
                                                <h4 className="text-base font-semibold text-white truncate">{notif.title}</h4>
                                                {notif.time}
                                            </div>
                                            <p className="text-sm text-slate-400 truncate">{notif.desc}</p>
                                        </div>
                                        {notif.statusIcon && (
                                            notif.statusIcon
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
    </>
  );
};