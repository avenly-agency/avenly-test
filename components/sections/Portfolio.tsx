'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Klinika Stomatologiczna",
    category: "Strona WWW",
    description: "Rebranding i system rezerwacji. Konwersja +150% w Q1.",
    tech: ["Next.js", "Tailwind"],
  },
  {
    id: 2,
    title: "E-commerce Auto Parts",
    category: "Sklep Online",
    description: "Sklep na WooCommerce z wyszukiwarką części po VIN.",
    tech: ["WooCommerce", "React"],
  },
  {
    id: 3,
    title: "AI Law Chatbot System",
    category: "Automatyzacja AI",
    description: "Asystent dla kancelarii. Kwalifikacja leadów 24/7.",
    tech: ["OpenAI", "Python"],
  },
  {
    id: 4,
    title: "Inwestycja Deweloperska",
    category: "Landing Page",
    description: "Interaktywna mapa mieszkań 3D i system CRM dla dewelopera.",
    tech: ["Vue.js", "Mapbox"],
  },
];

export const Portfolio = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Przesunięcie poziome (-75% dla 6 elementów)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div className="relative w-full bg-[#050505]">
        
        <section ref={targetRef} className="relative h-[300vh]">
        
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="sticky top-0 flex h-screen items-center overflow-hidden w-full bg-[#050505] z-10">
                
                {/* --- TRACK --- */}
                <motion.div 
                    style={{ x }} 
                    className="flex gap-12 lg:gap-16 items-center w-max h-full pl-[calc(50vw-225px)]"
                >
                    
                    {/* --- 1. KARTA TYTUŁOWA (PERFORMANCE CARD) --- */}
                    <div className="shrink-0 w-[350px] lg:w-[450px] h-[450px] lg:h-[550px] flex flex-col justify-center p-8 lg:p-12">
                         <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[2px] bg-blue-500"></span>
                            <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">Portfolio 2024</span>
                         </div>
                         
                         <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                            Wybrane <br />
                            {/* GRADIENT Z HERO SECTION */}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Realizacje
                            </span>
                         </h2>
                         
                         <p className="text-slate-400 text-lg max-w-xs leading-relaxed">
                            Projekty, które definiują jakość. Od stron WWW po zaawansowane systemy AI.
                         </p>
                    </div>


                    {/* --- 2. KARTY PROJEKTÓW --- */}
                    {projects.map((project) => (
                        <Card key={project.id} project={project} />
                    ))}
                    
                    
                    {/* --- 3. CTA CARD --- */}
                    <div className="relative h-[450px] w-[350px] flex items-center justify-center shrink-0 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-blue-500/50 hover:bg-blue-900/10 transition-all cursor-pointer group backdrop-blur-sm">
                        <div className="text-center p-6">
                            <h3 className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">Twój Projekt?</h3>
                            <div className="h-[1px] w-12 bg-blue-500/50 mx-auto my-4 group-hover:w-24 transition-all"></div>
                            <p className="text-slate-400 text-sm">Dołącz do liderów rynku.</p>
                        </div>
                    </div>

                    {/* Margines końcowy */}
                    <div className="shrink-0 w-[50vw]"></div>
                </motion.div>


                {/* --- MOBILE (SWIPE) --- */}
                <div className="lg:hidden absolute bottom-0 left-0 w-full h-full flex items-center overflow-x-auto gap-4 px-6 snap-x snap-mandatory scrollbar-hide bg-[#050505]">
                    
                    {/* Spacer Startowy */}
                    <div className="shrink-0 w-[calc(50vw-175px-24px)]" />

                    {/* Karta Tytułowa Mobile */}
                    <div className="snap-center shrink-0 w-[350px] h-[450px] flex flex-col justify-center p-4">
                         <h2 className="text-5xl font-bold text-white tracking-tighter leading-none mb-4">
                            Wybrane <br />
                            {/* GRADIENT MOBILE */}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Realizacje
                            </span>
                         </h2>
                         <div className="w-12 h-[2px] bg-blue-500 mb-4"></div>
                         <p className="text-slate-400 text-sm">Przesuń, aby zobaczyć.</p>
                    </div>
                    
                    {/* Projekty */}
                    {projects.map((project) => (
                        <div key={project.id} className="snap-center shrink-0">
                            <Card project={project} />
                        </div>
                    ))}
                    
                    {/* CTA Mobile */}
                    <div className="snap-center shrink-0 h-[400px] w-[300px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Twój Projekt?</h3>
                            <p className="text-slate-500 text-xs mt-2">Napisz do nas.</p>
                        </div>
                    </div>
                    
                    {/* Spacer Końcowy */}
                    <div className="shrink-0 w-[calc(50vw-175px-24px)]" />
                </div>

            </div>
        </section>
    </div>
  );
};

const Card = ({ project }: { project: any }) => {
  return (
    <div className="group relative h-[450px] w-[350px] lg:h-[550px] lg:w-[450px] overflow-hidden rounded-3xl bg-[#080808] border border-white/5 shrink-0 cursor-pointer transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#050505] transition-transform duration-700 group-hover:scale-105"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
        <div className="transform transition-transform duration-500 ease-out lg:translate-y-[88px] lg:group-hover:translate-y-0">
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-[2px] bg-blue-500 rounded-full"></span>
                    <p className="text-blue-300 text-[11px] font-bold tracking-widest uppercase">
                        {project.category}
                    </p>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight h-[5rem] md:h-[6rem] line-clamp-2">
                    {project.title}
                </h3>
            </div>
            <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <p className="text-slate-400 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-4 h-[3rem] line-clamp-2">
                    {project.description}
                </p>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
                        Zobacz Realizację
                    </button>
                    <div className="p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};