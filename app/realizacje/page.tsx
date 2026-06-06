'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Filter, ArrowRight, Globe, Code2, ShoppingCart, Cpu, Sparkles, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { projects } from '@/app/data/projects';

// ─── KATEGORIE + KOLORY ───────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'Wszystkie', label: 'Wszystkie', icon: Globe },
  { id: 'Strony WWW', label: 'Strony WWW', icon: Code2 },
  { id: 'Sklepy', label: 'Sklepy', icon: ShoppingCart },
  { id: 'AI & Boty', label: 'AI & Boty', icon: Cpu },
];

const CATEGORY_COLORS = {
  www: { badge: 'text-blue-300 bg-blue-500/25 border-blue-500/40', shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(59,130,246,0.22)]', gradient: 'from-blue-500/10 to-indigo-500/10' },
  ecommerce: { badge: 'text-amber-300 bg-amber-500/25 border-amber-500/40', shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(217,119,6,0.22)]', gradient: 'from-amber-500/10 to-orange-500/10' },
  ai: { badge: 'text-cyan-300 bg-cyan-400/25 border-cyan-400/40', shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.22)]', gradient: 'from-cyan-400/10 to-teal-400/10' },
};

function getCategoryStyle(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('e-commerce') || cat.includes('sklep')) return CATEGORY_COLORS.ecommerce;
  if (cat.includes('ai') || cat.includes('bot') || cat.includes('saas') || cat.includes('app')) return CATEGORY_COLORS.ai;
  return CATEGORY_COLORS.www;
}

// ─── HELPERY ──────────────────────────────────────────────────────────────────

const openChat = () => window.dispatchEvent(new CustomEvent('avenly:open-chat'));

function projectMeta(project: any) {
  const isExternal = !project.hasCaseStudy;
  const isOpenChat = !!project.openChat;
  const href = isOpenChat ? '#' : isExternal ? (project.externalLink || '#') : `/realizacje/${project.slug}`;
  const target = isExternal && !isOpenChat ? '_blank' : '_self';
  const cta = isOpenChat ? 'Przetestuj online' : isExternal ? 'Zobacz online' : 'Case Study';
  const badge = isOpenChat ? 'AI Demo' : isExternal ? 'Live' : 'Case Study';
  return { isExternal, isOpenChat, href, target, cta, badge };
}

function CardLink({ project, label }: { project: any; label: string }) {
  const { isOpenChat, href, target } = projectMeta(project);
  if (isOpenChat) return <button onClick={(e) => { e.preventDefault(); openChat(); }} className="absolute inset-0 z-20 cursor-pointer focus:outline-none" aria-label={label} />;
  return <Link href={href} target={target} className="absolute inset-0 z-20" aria-label={`Przejdź do projektu: ${label}`} />;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (activeFilter === 'Wszystkie') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => {
        const cat = p.category.toLowerCase();
        if (activeFilter === 'Sklepy') return cat.includes('e-commerce') || cat.includes('sklep');
        if (activeFilter === 'AI & Boty') return cat.includes('ai') || cat.includes('bot') || cat.includes('saas') || cat.includes('app');
        if (activeFilter === 'Strony WWW') return !cat.includes('e-commerce') && !cat.includes('ai') && !cat.includes('saas');
        return true;
      }));
    }
  }, [activeFilter]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">

      {/* ── FIXED BACKGROUND ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 100% 70% at 50% 5%, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 70% at 50% 5%, black 10%, transparent 80%)',
          }}
        />
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[65vw] h-[55vh] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-24 lg:pt-32 pb-32 overflow-hidden">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <header className="container mx-auto px-6 mb-24 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" aria-hidden="true">
            <span className="font-black text-white leading-none translate-y-4" style={{ fontSize: 'clamp(160px, 26vw, 380px)', opacity: 0.022 }}>05</span>
          </div>

          <div className="relative z-10 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/4 border border-white/8 text-slate-400 text-[11px] font-semibold tracking-[0.14em] uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
              Portfolio - Avenly
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black tracking-tight leading-[1.05]"
            >
              Dowód, nie{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">Obietnice.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed"
            >
              Każdy projekt to rozwiązany problem biznesowy. Nie tworzymy sztuki dla sztuki - tworzymy systemy, które zarabiają.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-2.5 pt-1"
            >
              {[
                { dot: 'bg-blue-400', label: 'Strony WWW' },
                { dot: 'bg-amber-400', label: 'Sklepy' },
                { dot: 'bg-cyan-400', label: 'AI & Boty' },
              ].map(({ dot, label }) => (
                <span key={label} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-slate-400 bg-white/3 border border-white/6">
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        </header>

        {/* ── STICKY FILTER ───────────────────────────────────────────────── */}
        <div className="sticky top-24 z-30 mb-14">
          <div className="relative">
            <nav aria-label="Filtruj realizacje według kategorii" className="w-full overflow-x-auto overscroll-x-contain snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex justify-center min-w-max px-6">
                <div className="flex gap-1 p-1.5 bg-[#0b0b0b]/95 backdrop-blur-2xl border border-white/6 rounded-2xl shadow-2xl shadow-black/60">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveFilter(cat.id)}
                        aria-pressed={isActive}
                        className={cn(
                          'relative shrink-0 snap-start flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]',
                          isActive ? 'bg-white text-[#050505] shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/6'
                        )}
                      >
                        <Icon size={14} aria-hidden="true" className="hidden sm:inline-block" />
                        <span className="whitespace-nowrap">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
            <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-[#050505] to-transparent pointer-events-none md:hidden" aria-hidden="true" />
            <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-[#050505] to-transparent pointer-events-none md:hidden" aria-hidden="true" />
          </div>
        </div>

        {/* ── GRID PROJEKTÓW ───────────────────────────────────────────────── */}
        <section aria-label="Lista realizacji" className="container mx-auto px-6 mb-28">
          {filteredProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <Filter className="w-10 h-10 mx-auto mb-4 opacity-40" />
              <p className="text-sm">Nie znaleziono projektów w tej kategorii.</p>
            </div>
          )}
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-6">
          <div className="max-w-7xl 3xl:max-w-[88rem] mx-auto pt-16 border-t border-white/5">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative border border-blue-500/30 bg-linear-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl p-1 overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 animate-pulse-slow"><Sparkles size={24} /></div>
                    <div className="text-left">
                      <h4 className="text-white font-bold text-lg">Masz pytania?</h4>
                      <p className="text-slate-400 text-sm">Zapytaj naszego Avenly AI lub napisz bezpośrednio.</p>
                    </div>
                  </div>
                  <button type="button" onClick={openChat} aria-label="Otwórz asystenta AI Avenly" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap cursor-pointer">
                    <MessageSquare size={18} /> Rozpocznij czat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// ─── KARTA PROJEKTU ───────────────────────────────────────────────────────────

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const { isExternal, cta, badge } = projectMeta(project);
  const colors = getCategoryStyle(project.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
      whileHover={{ y: -4, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }}
      className={cn('group relative flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden transition-[border-color,box-shadow] duration-500 hover:border-white/10', colors.shadow)}
    >
      <CardLink project={project} label={project.title} />

      <div className={cn('absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl', colors.gradient)} aria-hidden="true" />

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className={cn('text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full border backdrop-blur-md', colors.badge)}>{badge}</span>
      </div>

      <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
        {project.mainImage ? (
          <Image src={project.mainImage} alt={`Realizacja: ${project.title}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-900 to-blue-900/20" />
        )}
      </div>

      <div className="relative z-10 flex flex-col flex-1 p-6 pointer-events-none">
        <h3 className="text-xl font-bold text-white leading-snug mb-3">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">{project.description}</p>

        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.slice(0, 4).map((tech: string) => (
              <span key={tech} className="text-[10px] uppercase font-mono text-slate-500 border border-white/5 px-2 py-1 rounded-md bg-white/2">{tech}</span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
            {cta}
            {isExternal ? <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
          </span>
          {!isExternal && project.externalLink && (
            <a href={project.externalLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Zobacz stronę live: ${project.title}`} className="relative z-30 pointer-events-auto p-2 rounded-lg border border-white/5 bg-white/2 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};
