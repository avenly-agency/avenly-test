'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Filter, ArrowRight, Globe, Code2, ShoppingCart, Cpu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { projects } from '@/app/data/projects';

// --- 1. TWOJE ORYGINALNE KATEGORIE Z IKONAMI ---
const CATEGORIES = [
  { id: 'Wszystkie', label: 'Wszystkie', icon: Globe },
  { id: 'Strony WWW', label: 'Strony WWW', icon: Code2 },
  { id: 'Sklepy', label: 'Sklepy', icon: ShoppingCart },
  { id: 'AI & Boty', label: 'AI & Boty', icon: Cpu },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  // --- 2. LOGIKA FILTROWANIA ---
  useEffect(() => {
    if (activeFilter === 'Wszystkie') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => {
        const cat = p.category.toLowerCase();
        
        // Mapowanie kategorii z projects.ts na przyciski filtrów
        if (activeFilter === 'Sklepy') {
            return cat.includes('e-commerce') || cat.includes('sklep');
        }
        if (activeFilter === 'AI & Boty') {
            return cat.includes('ai') || cat.includes('bot') || cat.includes('saas') || cat.includes('app');
        }
        if (activeFilter === 'Strony WWW') {
            // Wszystko co nie jest sklepem ani AI, trafia do WWW (Landing pages, Wizytówki etc.)
            return !cat.includes('e-commerce') && !cat.includes('ai') && !cat.includes('saas');
        }
        
        return true;
      }));
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 overflow-hidden relative">
      
      {/* TŁO */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none z-0">
          <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505]/0 to-transparent blur-3xl"></div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-50"></div>
      </div>

      {/* HEADER */}
      <section className="container mx-auto px-6 mb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"
            >
                <Search size={14} className="text-blue-500"/>
                <span className="text-blue-500">Realizacje</span>
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
            >
                Dowód, nie <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    Obietnice.
                </span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
                Każdy projekt to rozwiązany problem biznesowy. 
                Nie tworzymy sztuki dla sztuki, tworzymy systemy, które zarabiają.
            </motion.p>
        </div>
      </section>

      {/* --- FILTRY Z IKONAMI --- */}
      <section className="container mx-auto px-6 mb-16 sticky top-24 z-30">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-2 bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-2xl w-fit mx-auto shadow-2xl">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer",
                        activeFilter === cat.id
                            ? "bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                            : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                    )}
                >
                    <cat.icon size={16} />
                    {cat.label}
                </button>
            ))}
        </div>
      </section>

      {/* GRID PROJEKTÓW */}
      <section className="container mx-auto px-6 relative z-10">
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
            <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nie znaleziono projektów w tej kategorii.</p>
            </div>
        )}
      </section>

      {/* CTA BOTTOM */}
      <section className="container mx-auto px-6 mt-32 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border border-white/5 p-8 md:p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Twój projekt może być następny.</h2>
                <p className="text-slate-400 mb-8 text-lg">Masz pomysł? A może problem do rozwiązania? Porozmawiajmy konkretnie.</p>
                <Link href="/kontakt">
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto cursor-pointer">
                        Rozpocznij Współpracę
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}

// --- KOMPONENT KARTY (BEZ ZMIAN) ---
const ProjectCard = ({ project, index }: { project: any, index: number }) => {
    const isExternal = !project.hasCaseStudy;
    const href = isExternal ? (project.externalLink || '#') : `/realizacje/${project.slug}`;
    const target = isExternal ? "_blank" : "_self";

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative flex flex-col h-full bg-[#080808] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-colors duration-500 cursor-pointer"
        >
            <Link href={href} target={target} className="relative aspect-[4/3] w-full overflow-hidden block cursor-pointer">
                {project.mainImage ? (
                    <Image
                        src={project.mainImage}
                        alt={`Realizacja: ${project.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900/20" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-bold text-white backdrop-blur-md">
                        {project.category}
                    </span>
                </div>

                {isExternal && (
                    <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 rounded bg-blue-600/80 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                            Live Link
                        </span>
                    </div>
                )}
            </Link>

            <div className="flex flex-col flex-1 p-6 md:p-8">
                <Link href={href} target={target} className="block group-hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">{project.title}</h3>
                </Link>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack?.slice(0, 4).map((tech: string) => (
                        <span key={tech} className="text-[10px] uppercase font-mono text-slate-500 border border-white/5 px-2 py-1 rounded bg-white/[0.02]">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
                    <Link href={href} target={target} className="flex-1 cursor-pointer">
                        <button className={cn(
                            "w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn border cursor-pointer",
                            isExternal 
                                ? "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                                : "bg-white/5 text-white hover:bg-white hover:text-black border-white/5"
                        )}>
                            {isExternal ? "Zobacz Online" : "Case Study"}
                            {isExternal ? (
                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            ) : (
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </Link>
                    
                    {!isExternal && project.externalLink && (
                        <a 
                            href={project.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label={`Zobacz stronę live: ${project.title}`}
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
};