'use client';

import { useRef, useEffect } from 'react';
import { motion, useReducedMotion, Variants, useSpring, useInView, useMotionValue } from 'framer-motion';
import { TrendingUp, Bot, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

// --- SUBKOMPONENT: WYDAJNY LICZNIK ---
// Używamy useRef i onChange, żeby nie renderować komponentu 60 razy na sekundę
// To zapewnia super płynną animację bez obciążania procesora.
function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20px" }); // Startuje jak element wejdzie w ekran
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,   // Tłumienie (jak szybko hamuje)
        stiffness: 60, // Sztywność (jak szybko startuje)
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        // Subskrypcja zmian wartości "sprężyny" i wpisywanie ich bezpośrednio do HTML
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toString();
            }
        });
    }, [springValue]);

    return <span ref={ref}>0</span>;
}

export const Impact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? false;
  const lenis = useLenis();

  const fadeInUpVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
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

  const handleScrollToOffer = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
        e.preventDefault();
        const elem = document.getElementById('oferta');
        if (elem && lenis) {
            lenis.scrollTo(elem, { 
                offset: -100,
                duration: 1.5,
                lock: false,
                force: true
            });
        }
    }
  };

  return (
    <section 
        ref={containerRef} 
        aria-label="Korzyści współpracy" 
        className="relative w-full py-24 lg:py-32 bg-[#050505] overflow-hidden"
    >
      
      {/* TŁO */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div 
                custom={0}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 mb-6" role="text">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></span>
                    <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Dlaczego Avenly?</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                    Twój Biznes. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                        Wersja 2.0
                    </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Stara szkoła to ładne wizytówki. Nowa szkoła to <strong>systemy, które sprzedają</strong>. 
                    Łączymy design premium z technologią, która zostawia konkurencję w tyle.
                </p>
            </motion.div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KAFEL 1: SKALOWALNY WZROST */}
            <motion.div 
                custom={0.1}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-blue-500/30 transition-colors duration-700 ease-out"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                        <TrendingUp size={24} aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Skalowalny Wzrost</h3>
                    <p className="text-slate-400 max-w-md">
                        Nasze rozwiązania to nie koszt, to inwestycja. Optymalizujemy ścieżki zakupowe (UX), aby każdy odwiedzający miał powód, by zostać klientem.
                    </p>
                </div>

                <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-30 md:opacity-50 pointer-events-none translate-y-4 translate-x-4" aria-hidden="true">
                     <div className="flex items-end justify-end gap-2 h-full">
                        {[40, 65, 50, 85, 70, 100].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.2 + (i * 0.1) }}
                                className="w-8 md:w-12 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-lg"
                            ></motion.div>
                        ))}
                     </div>
                </div>
            </motion.div>

            {/* KAFEL 2: AI FIRST */}
            <motion.div 
                custom={0.2}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[300px] flex flex-col hover:border-indigo-500/30 transition-colors duration-700 ease-out"
            >
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>
                
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-700 ease-out">
                    <Bot size={24} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AI First</h3>
                <p className="text-slate-400 text-sm mb-8">
                    Automatyzacja obsługi klienta i procesów. Twój biznes działa, gdy Ty śpisz.
                </p>
                <div className="mt-auto flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <span>Chatboty & Automatyzacje</span>
                </div>
            </motion.div>

            {/* KAFEL 3: PERFORMANCE - Z LICZNIKIEM */}
            <motion.div 
                custom={0.3}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[250px] flex flex-col hover:border-yellow-500/30 transition-colors duration-700 ease-out"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                        <Zap size={24} aria-hidden="true" />
                    </div>
                    {/* --- TUTAJ JEST LICZNIK --- */}
                    <span className="text-4xl font-bold text-white flex items-baseline" aria-label="99 procent">
                        <Counter value={99} />
                        <span className="text-yellow-500 text-2xl" aria-hidden="true">%</span>
                    </span>
                    {/* ------------------------- */}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Performance SEO</h3>
                <p className="text-slate-400 text-sm">
                    Google kocha szybkie strony. Twoi klienci też. Budujemy pod Core Web Vitals.
                </p>
            </motion.div>

            {/* KAFEL 4: SECURITY & CTA */}
            <motion.div 
                custom={0.4}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-green-500/30 transition-colors duration-700 ease-out"
            >
                 <div className="absolute inset-0 bg-gradient-to-r from-green-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true"></div>

                 <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <ShieldCheck size={20} aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Stabilność & Bezpieczeństwo</h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Hosting nowej generacji, SSL, ochrona Cloudflare. Twoja marka jest bezpieczna i dostępna 24/7 na całym świecie.
                    </p>
                 </div>
                 
                 <div className="shrink-0 relative z-20">
                    <Link 
                        href="/#oferta" 
                        onClick={handleScrollToOffer}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2 group/btn !cursor-pointer"
                    >
                        Sprawdź Ofertę
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-500" aria-hidden="true" />
                    </Link>
                 </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};