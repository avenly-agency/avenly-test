'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Filter, ArrowRight, Globe, Code2, ShoppingCart, Cpu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { projects } from '@/app/data/projects';

// ─── KATEGORIE FILTRÓW ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'Wszystkie', label: 'Wszystkie', icon: Globe },
  { id: 'Strony WWW', label: 'Strony WWW', icon: Code2 },
  { id: 'Sklepy', label: 'Sklepy', icon: ShoppingCart },
  { id: 'AI & Boty', label: 'AI & Boty', icon: Cpu },
];

// ─── KOLORY PER KATEGORIA ─────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  www: {
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(59,130,246,0.22)]',
    gradient: 'from-blue-500/10 to-indigo-500/10',
  },
  ecommerce: {
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(217,119,6,0.22)]',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
  ai: {
    badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.22)]',
    gradient: 'from-cyan-400/10 to-teal-400/10',
  },
};

function getCategoryStyle(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('e-commerce') || cat.includes('sklep')) return CATEGORY_COLORS.ecommerce;
  if (cat.includes('ai') || cat.includes('bot') || cat.includes('saas') || cat.includes('app')) return CATEGORY_COLORS.ai;
  return CATEGORY_COLORS.www;
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

          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-black text-white leading-none translate-y-4"
              style={{ fontSize: 'clamp(160px, 26vw, 380px)', opacity: 0.022 }}
            >
              05
            </span>
          </div>

          <div className="relative z-10 space-y-7">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/4 border border-white/8 text-slate-400 text-[11px] font-semibold tracking-[0.14em] uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
              Portfolio — Avenly
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black tracking-tight leading-[1.05]"
            >
              Dowód, nie{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">
                Obietnice.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed"
            >
              Każdy projekt to rozwiązany problem biznesowy.
              Nie tworzymy sztuki dla sztuki — tworzymy systemy, które zarabiają.
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
                <span
                  key={label}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-slate-400 bg-white/3 border border-white/6"
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>

          </div>
        </header>

        {/* ── STICKY FILTER ───────────────────────────────────────────────── */}
        <div className="sticky top-24 z-30 mb-14">
          <div className="container mx-auto px-6">
            <nav
              aria-label="Filtruj realizacje według kategorii"
              className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex gap-1 p-1.5 bg-[#0b0b0b]/95 backdrop-blur-2xl border border-white/6 rounded-2xl w-max mx-auto shadow-2xl shadow-black/60">
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
                        'relative shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]',
                        isActive
                          ? 'bg-white text-[#050505] shadow-md'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/6'
                      )}
                    >
                      <Icon size={14} aria-hidden="true" />
                      <span className="whitespace-nowrap">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* ── GRID PROJEKTÓW ───────────────────────────────────────────────── */}
        <section aria-label="Lista realizacji" className="container mx-auto px-6 mb-28">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <Filter className="w-10 h-10 mx-auto mb-4 opacity-40" />
              <p className="text-sm">Nie znaleziono projektów w tej kategorii.</p>
            </div>
          )}
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto pt-16 border-t border-white/5">
            <div className="rounded-3xl bg-linear-to-br from-blue-900/20 to-indigo-900/10 border border-white/5 p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                  Twój projekt może być następny.
                </h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                  Masz pomysł? A może problem do rozwiązania? Porozmawiajmy konkretnie.
                </p>
                <Link href="/kontakt">
                  <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto cursor-pointer">
                    Rozpocznij Współpracę
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
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
  const isExternal = !project.hasCaseStudy;
  const href = isExternal ? (project.externalLink || '#') : `/realizacje/${project.slug}`;
  const target = isExternal ? '_blank' : '_self';
  const colors = getCategoryStyle(project.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
      className={cn(
        'group relative flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden',
        'transition-[border-color,box-shadow,transform] duration-500',
        'hover:-translate-y-0.75 hover:border-white/10',
        colors.shadow
      )}
    >
      {/* Całkarta jako link */}
      <Link
        href={href}
        target={target}
        className="absolute inset-0 z-10"
        aria-label={`Przejdź do projektu: ${project.title}`}
      />

      {/* Hover gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl',
          colors.gradient
        )}
        aria-hidden="true"
      />

      {/* Badge — prawy górny róg */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full border backdrop-blur-md',
            isExternal
              ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
              : colors.badge
          )}
        >
          {isExternal ? 'Live' : 'Case Study'}
        </span>
      </div>

      {/* Zdjęcie — overflow-hidden tylko tu, gradient poza tym kontenerem */}
      <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
        {project.mainImage ? (
          <Image
            src={project.mainImage}
            alt={`Realizacja: ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-900 to-blue-900/20" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 p-6">

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-snug mb-3 transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-400">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.slice(0, 4).map((tech: string) => (
              <span
                key={tech}
                className="text-[10px] uppercase font-mono text-slate-500 border border-white/5 px-2 py-1 rounded-md bg-white/2"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
            {isExternal ? 'Zobacz online' : 'Case Study'}
            {isExternal ? (
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            ) : (
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            )}
          </span>

          {/* Link live gdy karta ma case study — osobny klikalny element nad overlay */}
          {!isExternal && project.externalLink && (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Zobacz stronę live: ${project.title}`}
              className="relative z-20 p-2 rounded-lg border border-white/5 bg-white/2 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>

      </div>
    </motion.article>
  );
};
