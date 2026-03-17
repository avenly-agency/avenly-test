'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  MonitorSmartphone, 
  PenTool, 
  LayoutTemplate,
  Palette
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

const designServices = [
  {
    title: 'Projektowanie UI/UX',
    description: 'Interfejsy, które zniewalają wizualnie i maksymalizują konwersję. Tworzymy ścieżki użytkownika oparte na badaniach i psychologii.',
    icon: MonitorSmartphone,
    href: '/uslugi/design/ui-ux', 
    badge: 'Najpopularniejsze',
    color: 'from-blue-500/20 to-purple-500/20',
    iconColor: 'text-blue-400',
    isActive: true, // <--- Flaga aktywności
  },
  {
    title: 'Identyfikacja Wizualna',
    description: 'Od logo po pełną księgę znaku. Budujemy spójny wizerunek marek premium, który wyróżnia się na tle konkurencji i buduje zaufanie.',
    icon: PenTool,
    href: '#',
    badge: 'Wkrótce...',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false, // <--- Usługa nieaktywna
  },
  {
    title: 'Materiały Marketingowe',
    description: 'Projekty do social mediów, banery, prezentacje inwestorskie i wizytówki. Wszystko, czego potrzebujesz do profesjonalnej komunikacji.',
    icon: LayoutTemplate,
    href: '#',
    badge: 'Wkrótce...',
    color: 'from-white/5 to-white/5',
    iconColor: 'text-slate-500',
    isActive: false, // <--- Usługa nieaktywna
  }
];

export default function DesignCategoryPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden pt-32 pb-24">
      
      {/* TŁO KINOWE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 container mx-auto px-6">
        
        {/* --- HERO SECTION KATEGORII --- */}
        <section className="flex flex-col items-center text-center mb-24">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Palette size={14} className="text-blue-400" /> Kategoria Usług
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Design & UX
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Nie tworzymy tylko ładnych obrazków. Tworzymy systemy wizualne, które budują autorytet Twojej marki i naturalnie sprzedają Twoje produkty.
            </p>
          </Reveal>
        </section>

        {/* --- GRID USŁUG (KARTY) --- */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designServices.map((service, index) => {
              const Icon = service.icon;
              return (
                /* WPROWADZONA POPRAWKA: owinięcie w div z kluczem i klasą */
                <div key={index} className="h-full">
                  <Reveal delay={0.2 + (index * 0.1)}>
                    <Link 
                      href={service.href} 
                      // Blokada kliknięcia dla nieaktywnych usług
                      onClick={(e) => !service.isActive && e.preventDefault()}
                      className={`block h-full ${service.isActive ? 'group' : 'cursor-default opacity-50'}`}
                    >
                      <div className={`h-full p-8 rounded-3xl bg-[#0a0a0a] border transition-all duration-500 relative overflow-hidden flex flex-col ${service.isActive ? 'border-white/5 hover:border-white/10' : 'border-white/5'}`}>
                        
                        {/* Gradientowy blask w tle karty po najechaniu (tylko aktywne) */}
                        {service.isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`} />
                        )}
                        
                        {/* Badge (Najpopularniejsze / Wkrótce) */}
                        {service.badge && (
                          <div className={`absolute top-6 right-6 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                            service.isActive 
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                              : 'bg-white/5 border-white/10 text-slate-400'
                          }`}>
                            {service.badge}
                          </div>
                        )}

                        <div className="relative z-10 flex-1 flex flex-col">
                          <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 transition-transform duration-500 ${service.iconColor} ${service.isActive ? 'group-hover:scale-110' : ''}`}>
                            <Icon size={28} />
                          </div>
                          
                          <h3 className={`text-2xl font-bold mb-4 transition-all ${service.isActive ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400' : 'text-slate-300'}`}>
                            {service.title}
                          </h3>
                          
                          <p className="text-slate-400 leading-relaxed mb-8 flex-1">
                            {service.description}
                          </p>

                          <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${service.isActive ? 'text-white group-hover:text-blue-400' : 'text-slate-500'}`}>
                            {service.isActive ? (
                              <>
                                Sprawdź szczegóły 
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </>
                            ) : (
                              'Oferta w przygotowaniu...'
                            )}
                          </div>
                        </div>

                      </div>
                    </Link>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- WEZWANIE DO DZIAŁANIA --- */}
        <section className="border-t border-white/10 pt-20">
          <AvenlyAICta />
        </section>

      </main>
    </div>
  );
}