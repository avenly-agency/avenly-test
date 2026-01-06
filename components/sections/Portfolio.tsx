'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- KROK 1: DODAJEMY LIVE URL DO DANYCH ---
const projects = [
  {
    id: 1,
    title: "Klinika Stomatologiczna",
    category: "Strona WWW",
    description: "Rebranding i system rezerwacji. Konwersja +150% w Q1.",
    tech: ["Next.js", "Tailwind"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
    href: "/realizacje/klinika",
    liveUrl: "https://google.com" // Tutaj wstawisz prawdziwy link klienta
  },
  {
    id: 2,
    title: "E-commerce Auto Parts",
    category: "Sklep Online",
    description: "Sklep na WooCommerce z wyszukiwarką części po VIN.",
    tech: ["WooCommerce", "React"],
    image: "https://images.unsplash.com/photo-1486262715619-01b80258e0a5?q=80&w=2070&auto=format&fit=crop",
    href: "/realizacje/auto-parts",
    liveUrl: "https://google.com"
  },
  {
    id: 3,
    title: "AI Law Chatbot System",
    category: "Automatyzacja AI",
    description: "Asystent dla kancelarii. Kwalifikacja leadów 24/7.",
    tech: ["OpenAI", "Python"],
    image: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9?q=80&w=2071&auto=format&fit=crop",
    href: "/realizacje/law-ai",
    liveUrl: "https://google.com"
  },
  {
    id: 4,
    title: "Inwestycja Deweloperska",
    category: "Landing Page",
    description: "Interaktywna mapa mieszkań 3D i system CRM dla dewelopera.",
    tech: ["Vue.js", "Mapbox"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    href: "/realizacje/deweloper",
    liveUrl: "https://google.com"
  },
];

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
            setScrollRange(scrollWidth - clientWidth);
        }
    };

    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, [isDesktop]);

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  const totalSlides = 1 + projects.length + 1; 

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
        style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 900px' }}
    >
        
        <section 
            ref={targetRef} 
            className="relative h-[100vh] md:h-[350vh]" 
            aria-label="Portfolio Realizacji"
        >
        
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="sticky top-0 flex h-screen items-center overflow-hidden w-full bg-[#050505] z-10">
                
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
                        className="hidden md:flex gap-12 md:gap-16 items-center w-max h-full pl-[calc(50vw-225px)] pr-[calc(50vw-175px)] relative z-10 will-change-transform"
                    >
                        <FocusCard index={0} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                            <div className="shrink-0 w-[450px] h-[550px] flex flex-col justify-center p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-[2px] bg-blue-500" aria-hidden="true"></span>
                                    <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">Portfolio 2024</span>
                                </div>
                                <h2 className="text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                                Wybrane <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                    Realizacje
                                </span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-xs leading-relaxed">
                                Projekty, które definiują jakość. Od stron WWW po zaawansowane systemy AI.
                                </p>
                            </div>
                        </FocusCard>

                        {projects.map((project, i) => (
                            <FocusCard key={project.id} index={i + 1} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                                <RevealCard delay={i * 0.2} reduceMotion={shouldReduceMotion}>
                                    <Card project={project} />
                                </RevealCard>
                            </FocusCard>
                        ))}
                        
                        <FocusCard index={totalSlides - 1} total={totalSlides} progress={smoothProgress} reduceMotion={shouldReduceMotion}>
                            <RevealCard delay={projects.length * 0.2} reduceMotion={shouldReduceMotion}>
                                <div className="relative h-[450px] w-[350px] flex items-center justify-center shrink-0 rounded-3xl border border-white/5 bg-white/[0.02] cursor-default transition-all group backdrop-blur-sm overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                                    <div className="text-center p-8 relative z-10 flex flex-col items-center">
                                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-500">Twój Projekt?</h3>
                                        <div className="h-[1px] w-12 bg-blue-500/50 mx-auto my-6 group-hover:w-24 transition-all" aria-hidden="true"></div>
                                        <p className="text-slate-400 text-sm mb-8">Dołącz do liderów rynku i wyskaluj swój biznes.</p>
                                        
                                        <button className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group/btn cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none mb-3">
                                            Rozpocznij
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                                        </button>

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

                        <div 
                            ref={mobileContainerRef}
                            onScroll={handleMobileScroll}
                            className="flex items-center overflow-x-auto gap-4 px-6 snap-x snap-mandatory scrollbar-hide pb-8"
                        >
                            {projects.map((project) => (
                                <div key={project.id} className="snap-center shrink-0">
                                    <Card project={project} isMobile={true} />
                                </div>
                            ))}
                            
                            <div className="snap-center shrink-0 h-[400px] w-[300px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
                                <div className="text-center p-6 flex flex-col items-center w-full">
                                    <h3 className="text-xl font-bold text-white mb-4">Twój Projekt?</h3>
                                    <button className="w-full px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none mb-3">
                                        Działajmy
                                    </button>

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
                        
                         <div className="flex justify-center items-center gap-2 mt-2 pointer-events-none" aria-hidden="true">
                            {Array.from({ length: totalSlides }).map((_, index) => (
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

// ... POZOSTAŁE KOMPONENTY (BEZ ZMIAN) ...
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

const FocusCard = ({ children, index, total, progress, reduceMotion }: { children: React.ReactNode, index: number, total: number, progress: MotionValue<number>, reduceMotion: boolean | null }) => {
    const step = 1 / (total - 1);
    const target = index * step;
    const range = [target - 0.15, target, target + 0.15];
    const opacity = useTransform(progress, range, reduceMotion ? [1, 1, 1] : [0.6, 1, 0.6]);
    const scale = useTransform(progress, range, reduceMotion ? [1, 1, 1] : [0.95, 1, 0.95]);
    const filter = useTransform(progress, range, reduceMotion ? ["none", "none", "none"] : ["grayscale(40%) blur(1px)", "grayscale(0%) blur(0px)", "grayscale(40%) blur(1px)"]);

    return <motion.div style={{ opacity, scale, filter }} className="origin-center">{children}</motion.div>;
};

// --- KROK 2: UPDATE KARTY ---
const Card = ({ project, isMobile = false }: { project: any, isMobile?: boolean }) => {
  return (
    <div className="group relative h-[450px] w-[320px] md:h-[550px] md:w-[450px] overflow-hidden rounded-3xl bg-[#080808] border border-white/5 shrink-0 transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)]">
      
      <div className="absolute inset-0">
         <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            sizes={isMobile ? "350px" : "(max-width: 1200px) 50vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-50"
            loading="lazy" 
            quality={isMobile ? 60 : 75} 
         />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent opacity-90 transition-opacity" aria-hidden="true"></div>
      
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end z-10 pointer-events-none">
        <div className="transform transition-transform duration-500 ease-out lg:translate-y-[88px] group-hover:translate-y-0">
            
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-[2px] bg-blue-500 rounded-full" aria-hidden="true"></span>
                    <p className="text-blue-300 text-[11px] font-bold tracking-widest uppercase shadow-black drop-shadow-md">
                        {project.category}
                    </p>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight h-[5rem] md:h-[6rem] line-clamp-2 drop-shadow-lg">
                    {project.title}
                </h3>
            </div>
            
            <div className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <p className="text-slate-300 text-sm leading-relaxed mb-6 border-l-2 border-white/20 pl-4 h-[3rem] line-clamp-2 drop-shadow-md">
                    {project.description}
                </p>
                
                {/* --- SEKCJA BUTTONÓW (POINTER EVENTS AUTO) --- */}
                <div className="flex items-center gap-3 pointer-events-auto">
                    {/* BUTTON 1: WEWNĘTRZNY CASE STUDY */}
                    <Link href={project.href}>
                        <button className="px-6 py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
                            Zobacz Realizację
                        </button>
                    </Link>
                    
                    {/* BUTTON 2: LIVE PREVIEW (ZEWNĘTRZNY) */}
                    {/* Renderujemy tylko jeśli liveUrl istnieje */}
                    {project.liveUrl && (
                        <a 
                            href={project.liveUrl} 
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

      {/* GŁÓWNY LINK NA TŁO (CASE STUDY) */}
      <Link 
        href={project.href}
        className="absolute inset-0 z-0 focus:outline-none" 
        aria-label={`Zobacz projekt ${project.title}`}
      />
      
    </div>
  );
};