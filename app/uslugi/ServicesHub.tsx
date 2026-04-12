'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Palette,
  Bot,
  Search,
  Zap,
  ShoppingCart,
  Layout,
  MonitorSmartphone,
  PenTool,
  Code2,
  Cpu,
  BarChart,
  Lock,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvenlyAICta } from '@/components/AvenlyAICta';
import { Reveal } from '@/components/Reveal';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type CategoryId = 'www' | 'design' | 'ai' | 'marketing';
type FilterId = 'all' | CategoryId;

// ─── CATEGORY STYLING ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  CategoryId,
  {
    tag: string;
    border: string;
    badge: string;
    icon: string;
    gradient: string;
    shadow: string;
  }
> = {
  www: {
    tag: 'Strony WWW',
    border: 'border-l-blue-500',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    icon: 'text-blue-400 bg-blue-500/[0.12]',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(59,130,246,0.18)]',
  },
  design: {
    tag: 'Design & UI/UX',
    border: 'border-l-violet-500',
    badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    icon: 'text-violet-400 bg-violet-500/[0.12]',
    gradient: 'from-violet-500/20 to-purple-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(139,92,246,0.18)]',
  },
  ai: {
    tag: 'Automatyzacja AI',
    border: 'border-l-cyan-400',
    badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    icon: 'text-cyan-400 bg-cyan-400/[0.12]',
    gradient: 'from-cyan-400/20 to-teal-400/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.18)]',
  },
  marketing: {
    tag: 'Marketing & SEO',
    border: 'border-l-emerald-500',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: 'text-emerald-400 bg-emerald-500/[0.12]',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
  },
};

// ─── FILTER TABS ──────────────────────────────────────────────────────────────

const FILTER_TABS: Array<{ id: FilterId; label: string; icon: LucideIcon }> = [
  { id: 'all', label: 'Wszystkie', icon: Layers },
  { id: 'www', label: 'Strony WWW', icon: Code2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'ai', label: 'AI & Boty', icon: Cpu },
  { id: 'marketing', label: 'Marketing', icon: BarChart },
];

// ─── SERVICES DATA ────────────────────────────────────────────────────────────

const SERVICES: Array<{
  category: CategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  keyBenefit: string;
  iconColor: string;
  gradient: string;
  shadow: string;
}> = [
  // ─── WWW ───────────────────────────────────────────────────────────────────
  {
    category: 'www',
    title: 'Strona One-Page',
    description:
      'Szybki start dla Twojego biznesu. Zdobądź widoczność w sieci dzięki czytelnej wizytówce, która natychmiast odpowiada na pytania klientów i zachęca do kontaktu.',
    icon: Zap,
    href: '/uslugi/strony-www/one-page',
    isActive: true,
    keyBenefit: 'Konwersja · 3–5 dni · Responsywność',
    iconColor: 'text-indigo-400 bg-indigo-500/[0.12]',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(99,102,241,0.18)]',
  },
  
  {
    category: 'www',
    title: 'Profesjonalna Strona Firmowa',
    description:
      'Zarządzaj swoją ofertą bez wiedzy technicznej. Otrzymujesz potężny system (CMS) zoptymalizowany pod wyszukiwarkę Google i otwarty na rozwój Twojego biznesu.',
    icon: Code2,
    href: '/uslugi/strony-www/profesjonalna-strona-firmowa',
    isActive: true,
    keyBenefit: 'WordPress · CMS · Core Web Vitals',
    iconColor: 'text-emerald-400 bg-emerald-500/[0.12]',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
  },
  {
    category: 'www',
    title: 'Strony Dedykowane',
    description:
      'Zostaw konkurencję w tyle dzięki niesamowitej wydajności. Zyskujesz ultra-szybką, bezpieczną witrynę, która ładuje się natychmiast i drastycznie zwiększa konwersję.',
    icon: Zap,
    href: '/uslugi/strony-www/dedykowane-strony-www',
    isActive: true,
    keyBenefit: 'Wydajność · Premium · Konwersja',
    iconColor: 'text-purple-400 bg-purple-500/[0.12]',
    gradient: 'from-purple-500/20 to-fuchsia-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(168,85,247,0.18)]',
  },
  {
    category: 'www',
    title: 'Sklepy E-commerce',
    description:
      'Zarabiaj na autopilocie 24/7. Otrzymujesz stabilny, gotowy do sprzedaży sklep, w pełni zintegrowany z płatnościami (BLIK, karty) i zautomatyzowany z kurierami.',
    icon: ShoppingCart,
    href: '/uslugi/strony-www/sklepy-internetowe',
    isActive: true,
    keyBenefit: 'WooCommerce · Przelewy24 · InPost',
    iconColor: 'text-amber-400 bg-amber-500/[0.12]',
    gradient: 'from-amber-500/20 to-orange-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(217,119,6,0.18)]',
  },
  {
    category: 'www',
    title: 'Aplikacje Webowe',
    description:
      'Dedykowane systemy CRM, portale klienta i panele B2B. Oprogramowanie szyte na miarę, skalowalne bez ograniczeń.',
    icon: Layout,
    href: '/uslugi/strony-www/aplikacje-webowe',
    isActive: true,
    keyBenefit: 'React · Next.js · Headless CMS',
    iconColor: 'text-sky-400 bg-sky-500/[0.12]',
    gradient: 'from-sky-500/20 to-cyan-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(14,165,233,0.18)]',
  },
  // ─── DESIGN ───────────────────────────────────────────────────────────────
  {
    category: 'design',
    title: 'Projektowanie UI/UX',
    description:
      'Interfejsy oparte na psychologii użytkownika. Eliminujemy ucieczkę klientów i projektujemy ścieżki prowadzące prosto do zakupu.',
    icon: MonitorSmartphone,
    href: '/uslugi/design/ui-ux',
    isActive: true,
    keyBenefit: 'Figma · Badania UX · Prototypy HiFi',
    iconColor: 'text-violet-400 bg-violet-500/[0.12]',
    gradient: 'from-violet-500/20 to-purple-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(139,92,246,0.18)]',
  },
  {
    category: 'design',
    title: 'Identyfikacja Wizualna',
    description:
      'Od logo po pełną księgę znaku. Budujemy wizerunek marek, który zostawia konkurencję w tyle i buduje trwały autorytet.',
    icon: PenTool,
    href: '#',
    isActive: false,
    keyBenefit: 'Logo · Brandbook · Typografia',
    iconColor: 'text-rose-400 bg-rose-500/[0.12]',
    gradient: 'from-rose-500/20 to-pink-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(244,63,94,0.18)]',
  },
  // ─── AI ────────────────────────────────────────────────────────────────────
  {
    category: 'ai',
    title: 'Inteligentne Chatboty',
    description:
      'Asystenci AI obsługujący klientów i zbierający leady 24/7 — w każdym języku, bez udziału człowieka, przez całą dobę.',
    icon: Bot,
    href: '#',
    isActive: false,
    keyBenefit: 'GPT-4o · Multi-język · Lead gen',
    iconColor: 'text-cyan-400 bg-cyan-400/[0.12]',
    gradient: 'from-cyan-400/20 to-teal-400/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.18)]',
  },
  // ─── MARKETING ─────────────────────────────────────────────────────────────
  {
    category: 'marketing',
    title: 'Audyt SEO i Wydajności',
    description:
      'Dogłębna analiza techniczna i strukturalna Twojej strony, zakończona gotowym, priorytetyzowanym planem naprawczym.',
    icon: Search,
    href: '#',
    isActive: false,
    keyBenefit: 'Core Web Vitals · Słowa kluczowe · Raport',
    iconColor: 'text-emerald-400 bg-emerald-500/[0.12]',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    shadow: 'hover:shadow-[0_8px_32px_-6px_rgba(16,185,129,0.18)]',
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function ServicesHub() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const filtered = (
    activeFilter === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeFilter)
  ).sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">

      {/* ── PAGE BACKGROUND ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Dot grid — fades out downward so it doesn't compete with content */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage:
              'radial-gradient(ellipse 100% 70% at 50% 5%, black 10%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 70% at 50% 5%, black 10%, transparent 80%)',
          }}
        />
        {/* Radial glow — top center */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[65vw] h-[55vh] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-24 lg:pt-32 pb-32">

        {/* ── BREADCRUMB ───────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-6 mb-10">
          <ol className="flex items-center gap-2 text-xs text-slate-600">
            <li>
              <Link
                href="/"
                aria-label="Strona główna"
                className="hover:text-slate-400 transition-colors duration-150"
              >
                Avenly
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-800">/</li>
            <li className="text-slate-400" aria-current="page">
              Usługi
            </li>
          </ol>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <header className="container mx-auto px-6 mb-24 text-center relative">

          {/* Decorative large "04" — purely visual */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-black text-white leading-none translate-y-4"
              style={{ fontSize: 'clamp(160px, 26vw, 380px)', opacity: 0.022 }}
            >
              04
            </span>
          </div>

          <div className="relative z-10 space-y-7">

            {/* Eyebrow badge */}
            <Reveal delay={0.05}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px] font-semibold tracking-[0.14em] uppercase">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                  aria-hidden="true"
                />
                Katalog Usług — Avenly
              </div>
            </Reveal>

            {/* H1 */}
            <Reveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black tracking-tight leading-[1.05]">
                Narzędzia do{' '}
                <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  cyfrowej dominacji.
                </span>
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal delay={0.15}>
              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
                Kompleksowa oferta dla firm, które chcą rosnąć. Wybierz
                usługę i pozwól nam zamienić Twój potencjał w wyniki.
              </p>
            </Reveal>

            {/* Stat pills */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                {[
                  { dot: 'bg-emerald-400', label: '4 aktywne usługi' },
                  { dot: 'bg-amber-400', label: '4 wkrótce' },
                  { dot: 'bg-blue-400', label: '4 kategorie' },
                ].map(({ dot, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span
                      className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)}
                      aria-hidden="true"
                    />
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>

          </div>
        </header>

        {/* ── STICKY FILTER ────────────────────────────────────────────── */}
        <div className="sticky top-24 z-30 mb-14">
          <div className="container mx-auto px-6">
            <nav
              aria-label="Filtruj usługi według kategorii"
              className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex gap-1 p-1.5 bg-[#0b0b0b]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl w-max mx-auto shadow-2xl shadow-black/60">
                {FILTER_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      aria-pressed={isActive}
                      aria-label={`Pokaż usługi: ${tab.label}`}
                      className={cn(
                        'relative shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]',
                        isActive
                          ? 'bg-white text-[#050505] shadow-md'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                      )}
                    >
                      <Icon size={14} aria-hidden="true" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* ── SERVICES GRID ────────────────────────────────────────────── */}
        <section
          aria-label="Lista dostępnych usług"
          className="container mx-auto px-6 mb-28"
        >
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((service, i) => {
                const cfg = CATEGORY_META[service.category];
                const Icon = service.icon;

                return (
                  <motion.div
                    key={service.title}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="h-full"
                  >
                    <Link
                      href={service.isActive ? service.href : '#'}
                      onClick={(e) =>
                        !service.isActive && e.preventDefault()
                      }
                      tabIndex={service.isActive ? undefined : -1}
                      aria-disabled={!service.isActive}
                      className={cn(
                        'block h-full',
                        !service.isActive && 'cursor-default'
                      )}
                    >
                      <article
                        className={cn(
                          'relative h-full rounded-3xl bg-[#0a0a0a] overflow-hidden flex flex-col',
                          'border border-white/5 p-8',
                          'transition-all duration-500',
                          service.isActive
                            ? [
                                'group',
                                'hover:-translate-y-[3px]',
                                'hover:border-white/10',
                                service.shadow,
                              ]
                            : 'opacity-50'
                        )}
                      >
                        {/* Hover gradient overlay */}
                        {service.isActive && (
                          <div
                            className={cn(
                              'absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl',
                              service.gradient
                            )}
                            aria-hidden="true"
                          />
                        )}

                        {/* Badge — absolute top-right */}
                        <span
                          className={cn(
                            'absolute top-6 right-6 text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full border',
                            service.isActive ? cfg.badge : 'text-slate-500 bg-white/5 border-white/10'
                          )}
                        >
                          {cfg.tag}
                        </span>

                        <div className="relative z-10 flex flex-col h-full">

                          {/* Icon */}
                          <div
                            className={cn(
                              'w-14 h-14 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6 transition-transform duration-500',
                              service.iconColor,
                              service.isActive && 'group-hover:scale-110'
                            )}
                          >
                            <Icon size={28} aria-hidden="true" />
                          </div>

                          {/* Title */}
                          <h3
                            className={cn(
                              'text-2xl font-bold mb-4 leading-snug transition-all',
                              service.isActive
                                ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-400'
                                : 'text-slate-300'
                            )}
                          >
                            {service.title}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-400 leading-relaxed flex-1 mb-8">
                            {service.description}
                          </p>

                          {/* Bottom CTA */}
                          <div className={cn(
                            'flex items-center gap-2 text-sm font-bold transition-colors',
                            service.isActive ? 'text-white group-hover:text-blue-400' : 'text-slate-500'
                          )}>
                            {service.isActive ? (
                              <>
                                Sprawdź szczegóły
                                <ArrowRight
                                  size={16}
                                  className="group-hover:translate-x-1 transition-transform"
                                  aria-hidden="true"
                                />
                              </>
                            ) : (
                              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <Lock size={10} aria-hidden="true" />
                                Wkrótce dostępne
                              </span>
                            )}
                          </div>

                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section
          aria-label="Darmowa konsultacja z Avenly AI"
          className="container mx-auto px-6"
        >
          <div className="max-w-7xl mx-auto pt-16 border-t border-white/[0.05]">
            <AvenlyAICta />
          </div>
        </section>

      </main>
    </div>
  );
}
