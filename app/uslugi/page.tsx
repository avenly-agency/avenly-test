'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Globe, 
  Palette, 
  Bot, 
  Search,
  Zap,
  ShoppingCart,
  Layout,
  MonitorSmartphone,
  PenTool,
  LayoutTemplate,
  Layers,
  Code2,
  Cpu,
  BarChart,
  Filter
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- KATEGORIE DO FILTROWANIA ---
const CATEGORIES = [
  { id: 'all', label: 'Wszystkie', icon: Globe },
  { id: 'www', label: 'Strony WWW', icon: Code2 },
  { id: 'design', label: 'Design & UI/UX', icon: Palette },
  { id: 'ai', label: 'Automatyzacje AI', icon: Cpu },
  { id: 'marketing', label: 'Marketing', icon: BarChart },
];

// --- BAZA WSZYSTKICH USŁUG ---
const allServices = [
  // WWW - AKTYWNE
  {
    category: 'www',
    title: 'Profesjonalna Strona Firmowa',
    description: 'Rozwiązania bez kompromisów. Zyskujesz ultra-szybką, bezpieczną witrynę B2B klasy premium z własnym systemem CMS.',
    icon: Code2,
    href: '/strony-www/profesjonalna-strona-firmowa/', // Możesz zmienić na '/strony-www/firmowe' jeśli taki masz routing
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    isActive: true,
  },
  {
    category: 'www',
    title: 'Strony One-Page',
    description: 'Szybki start dla biznesu i narzędzie do zadań specjalnych. Landing page ze zablokowanym scrollem skupiony w 100% na konwersji.',
    icon: Zap,
    href: '/strony-www/one-page',
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-400',
    isActive: true,
  },
  
  // DESIGN - AKTYWNE
  {
    category: 'design',
    title: 'Projektowanie UI/UX',
    description: 'Interfejsy, które sprzedają. Otrzymujesz ścieżki i makiety oparte na psychologii, eliminujące ucieczki klientów z Twojej strony.',
    icon: MonitorSmartphone,
    href: '/uslugi/design/ui-ux',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    isActive: true,
  },

  // WWW - W PRZYGOTOWANIU
  {
    category: 'www',
    title: 'Sklepy E-commerce',
    description: 'Zarabiaj na autopilocie 24/7. Otrzymujesz stabilny sklep zintegrowany z płatnościami i gotowy na tysiące transakcji.',
    icon: ShoppingCart,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },
  {
    category: 'www',
    title: 'Aplikacje Webowe',
    description: 'Dedykowane systemy CRM, portale pacjenta, panele B2B. Oprogramowanie szyte na miarę pod unikalne potrzeby firmy.',
    icon: Layout,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },
  
  // DESIGN - W PRZYGOTOWANIU
  {
    category: 'design',
    title: 'Identyfikacja Wizualna',
    description: 'Zbuduj autorytet. Od logo po pełną księgę znaku, tworzymy wizerunek marek, który zostawia konkurencję daleko w tyle.',
    icon: PenTool,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },
  {
    category: 'design',
    title: 'Materiały Marketingowe',
    description: 'Profesjonalna komunikacja wizualna na social media, banery reklamowe i prezentacje inwestorskie, które budzą zaufanie.',
    icon: LayoutTemplate,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },

  // AI - W PRZYGOTOWANIU
  {
    category: 'ai',
    title: 'Inteligentne Chatboty',
    description: 'Zatrudnij technologię. Wdrażamy asystentów AI, którzy błyskawicznie obsługują klientów i zbierają leady 24/7 w każdym języku.',
    icon: Bot,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },

  // MARKETING - W PRZYGOTOWANIU
  {
    category: 'marketing',
    title: 'Audyt SEO i Wydajności',
    description: 'Dowiedz się, dlaczego nie masz ruchu. Dogłębna analiza techniczna i strukturalna, zakończona gotowym planem naprawczym.',
    icon: Search,
    href: '#',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false,
  },
];

export default function ServicesHubPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filtrowanie i sortowanie
  let filteredServices = activeFilter === 'all' 
    ? allServices 
    : allServices.filter(service => service.category === activeFilter);
    
  filteredServices = filteredServices.sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden pt-24 lg:pt-32 pb-24">
      
      {/* --- TŁO KINOWE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 container mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col items-center text-center mb-16">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Layers size={14} className="text-blue-400" /> Katalog Usług
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white mb-8 leading-[1.2]">
              Zbuduj z nami <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mt-2 block sm:inline sm:mt-0">
                cyfrowe imperium.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Nie jesteśmy zwykłymi wykonawcami. Wybierz rozwiązanie, którego potrzebujesz, i pozwól nam skalować Twój biznes za pomocą najwyższej klasy technologii, designu i AI.
            </p>
          </Reveal>
        </section>

        {/* --- FILTRY Z IKONAMI --- */}
        <section className="container mx-auto px-6 mb-16 sticky top-24 z-30">
          <Reveal delay={0.4}>
            {/* Wrapper z ukrytym paskiem przewijania na mobile */}
            <div className="w-full overflow-x-auto pb-4 -mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Główny kontener z tłem. Na mobile w-max (żeby nie zawijał do nowej linii), na desktopie mx-auto (żeby wyśrodkować) */}
              <div className="flex md:flex-wrap md:justify-center gap-2 p-2 bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-2xl w-max md:mx-auto shadow-2xl">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                          key={cat.id}
                          onClick={() => setActiveFilter(cat.id)}
                          className={cn(
                              "shrink-0 whitespace-nowrap px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer",
                              activeFilter === cat.id
                                  ? "bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                                  : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                          )}
                      >
                          <Icon size={16} />
                          {cat.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          </Reveal>
        </section>

        {/* --- GRID USŁUG --- */}
        <section className="mb-32">
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto min-h-[400px]"
          >
            <AnimatePresence mode='popLayout'>
              {filteredServices.map((service, index) => {
                const ServiceIcon = service.icon;
                return (
                  <motion.div
                    key={`${service.title}-${service.category}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Link 
                      href={service.href} 
                      onClick={(e) => !service.isActive && e.preventDefault()}
                      className={`block h-full cursor-pointer ${service.isActive ? 'group' : 'opacity-50'}`}
                    >
                      <div className={`h-full p-8 rounded-3xl bg-[#0a0a0a] border transition-all duration-500 relative overflow-hidden flex flex-col ${service.isActive ? 'border-white/5 hover:border-white/10 hover:-translate-y-1' : 'border-white/5'}`}>
                        
                        {/* 1. Delikatne tło kolorystyczne widoczne ZAWSZE (tylko dla aktywnych usług) */}
                        {service.isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                        )}

                        {/* 2. Kinowy rozmyty blask (glow) na hoverze */}
                        {service.isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`} />
                        )}

                        <div className="relative z-10 flex-1 flex flex-col">
                          {/* Ikona */}
                          <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 transition-transform duration-500 ${service.iconColor} ${service.isActive ? 'group-hover:scale-110 group-hover:bg-white/[0.05]' : ''}`}>
                            <ServiceIcon size={24} />
                          </div>
                          
                          {/* Tytuł */}
                          <h3 className={`text-xl font-bold mb-3 transition-all ${service.isActive ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300' : 'text-slate-300'}`}>
                            {service.title}
                          </h3>
                          
                          {/* Opis */}
                          <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm md:text-base">
                            {service.description}
                          </p>

                          {/* Dół karty z CTA */}
                          <div className={`flex items-center gap-2 text-xs md:text-sm font-bold transition-colors ${service.isActive ? 'text-white group-hover:text-blue-400' : 'text-slate-500'}`}>
                            {service.isActive ? (
                              <>
                                Sprawdź korzyści
                                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                              </>
                            ) : (
                              'Oferta w przygotowaniu...'
                            )}
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Brak usług w tej kategorii.</p>
            </div>
          )}
        </section>

        {/* --- WEZWANIE DO DZIAŁANIA --- */}
        <section className="border-t border-white/10 pt-20">
          <AvenlyAICta />
        </section>

      </main>
    </div>
  );
}