'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

// Dane powiadomień
const NOTIFICATIONS_DATA = [
  {
    id: 3, 
    icon: <MessageSquare size={22} />,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Asystent AI",
    time: <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-1.5 rounded"><Clock size={12} /> 03:42</span>,
    timePosition: "inline", // Odznaka obok tekstu
    desc: "Odpowiedział na 3 pytania klienta.",
    statusIcon: <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /></div>
  },
  {
    id: 2, 
    icon: <Calendar size={22} />,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Wizyta potwierdzona",
    time: <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">Jutro 14:00</span>,
    timePosition: "right", // Odznaka po prawej
    desc: "Automatyczna rezerwacja online."
  },
  {
    id: 1, 
    icon: <Mail size={22} />,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Nowe zapytanie o ofertę",
    time: <span className="text-xs text-slate-500 ml-2">2 min temu</span>,
    timePosition: "right", // Odznaka po prawej
    desc: 'Jan Kowalski: "Proszę o wycenę..."'
  }
];

export const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState<typeof NOTIFICATIONS_DATA>([]);
  const lenis = useLenis();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animacja pojawiania się powiadomień
  useEffect(() => {
    if (!isMounted) return;

    // Harmonogram szybkiego pojawiania się (w milisekundach)
    const schedule = [300, 1000, 1700];

    const timeouts = schedule.map((delay, index) => {
      return setTimeout(() => {
        // Dodawanie nowego powiadomienia na początek tablicy (na samą górę)
        setVisibleNotifications(prev => [NOTIFICATIONS_DATA[index], ...prev]);
      }, delay);
    });

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [isMounted]);

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
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-blue-500/30 pt-32 pb-20 lg:py-0">
      
      {/* --- TŁO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.12),transparent_60%)]" />

        <div className="hidden lg:block">
            <div className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw]">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"
                />
            </div>
            
            <div className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw]">
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="w-full h-full bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen"
                />
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
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full bg-blue-500/30 blur-[80px] rounded-full"
                />
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

                    {/* USUNIĘTO: 'justify-end' i pusty placeholder. Teraz elementy układają się naturalnie od góry */}
                    <div className="space-y-4 flex-1 relative flex flex-col">
                        <AnimatePresence>
                            {visibleNotifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    layout // Powoduje płynne przesuwanie starszych elementów w dół
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] w-full"
                                >
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
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