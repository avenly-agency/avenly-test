'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Globe, 
  Layout, 
  Zap, 
  ShoppingCart,
  Code2
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

const webServices = [
  {
    title: 'Strona One-Page',
    description: 'Szybki start dla Twojego biznesu. Zdobądź widoczność w sieci dzięki czytelnej wizytówce, która natychmiast odpowiada na pytania klientów i zachęca do kontaktu.',
    icon: Zap,
    href: '/uslugi/strony-www/one-page',
    badge: 'Szybki start',
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-400',
    isActive: true,
  },
  {
    title: 'Profesjonalna Strona Firmowa',
    description: 'Zarządzaj swoją ofertą bez wiedzy technicznej. Otrzymujesz potężny system (CMS) zoptymalizowany pod wyszukiwarkę Google i otwarty na rozwój Twojego biznesu.',
    icon: Layout,
    href: '/uslugi/strony-www/profesjonalna-strona-firmowa',
    badge: 'CMS & SEO',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    isActive: true,
  },
  {
    title: 'Strony Dedykowane',
    description: 'Zostaw konkurencję w tyle dzięki niesamowitej wydajności. Zyskujesz ultra-szybką, bezpieczną witrynę, która ładuje się natychmiast i drastycznie zwiększa konwersję.',
    icon: Zap,
    href: '/uslugi/strony-www/dedykowane-strony-www',
    badge: 'Premium',
    color: 'from-purple-500/20 to-fuchsia-500/20',
    iconColor: 'text-purple-400',
    isActive: true,
  },
  {
    title: 'Sklepy E-commerce',
    description: 'Zarabiaj na autopilocie 24/7. Otrzymujesz stabilny, gotowy do sprzedaży sklep, w pełni zintegrowany z płatnościami (BLIK, karty) i zautomatyzowany z kurierami.',
    icon: ShoppingCart,
    href: '/uslugi/strony-www/sklepy-internetowe',
    badge: 'E-commerce',
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    isActive: true,
  },
  {
    title: 'Aplikacje Webowe',
    description: 'Dedykowane systemy CRM, portale klienta i panele B2B. Oprogramowanie szyte na miarę, skalowalne bez ograniczeń.',
    icon: Globe,
    href: '/uslugi/strony-www/aplikacje-webowe',
    badge: 'Custom Dev',
    color: 'from-sky-500/20 to-cyan-500/20',
    iconColor: 'text-sky-400',
    isActive: true,
  },
];

export default function WebCategoryPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden pt-32 pb-24">
      
      {/* TŁO KINOWE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-125 bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 container mx-auto px-6">
        
        {/* --- HERO SECTION KATEGORII --- */}
        <section className="flex flex-col items-center text-center mb-24">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Code2 size={14} className="text-blue-400" /> Kategoria Usług
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Strony WWW
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Twój nowy najlepszy handlowiec. Przestań tracić klientów przez przestarzałe witryny i zyskaj platformę, która budzi zaufanie, pozycjonuje się w Google i płynnie zamienia ruch w zysk.
            </p>
          </Reveal>
        </section>

        {/* --- GRID USŁUG (KARTY) --- */}
        <section className="mb-32">
          {/* Zmieniono na lg:grid-cols-3 by pasowało do strony Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="h-full">
                  <Reveal delay={0.2 + (index * 0.1)}>
                    <Link 
                      href={service.href} 
                      onClick={(e) => !service.isActive && e.preventDefault()}
                      className={`block h-full ${service.isActive ? 'group' : 'cursor-default opacity-50'}`}
                    >
                      <div className={`h-full p-8 rounded-3xl bg-[#0a0a0a] border transition-all duration-500 relative overflow-hidden flex flex-col ${service.isActive ? 'border-white/5 hover:border-white/10' : 'border-white/5'}`}>
                        
                        {/* Gradientowy blask w tle karty po najechaniu (tylko aktywne) */}
                        {service.isActive && (
                          <div className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`} />
                        )}
                        
                        {/* Badge */}
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
                          <div className={`w-14 h-14 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6 transition-transform duration-500 ${service.iconColor} ${service.isActive ? 'group-hover:scale-110' : ''}`}>
                            <Icon size={28} />
                          </div>
                          
                          <h3 className={`text-2xl font-bold mb-4 transition-all ${service.isActive ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-400' : 'text-slate-300'}`}>
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