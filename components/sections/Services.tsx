'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Palette, Bot, BarChart, ArrowRight, CheckCircle2, Globe, Smartphone, Layers, Cpu, Search, Megaphone, ChevronDown } from 'lucide-react';

const servicesData = [
  {
    id: 'dev',
    label: 'Development',
    icon: Code2,
    description: "Solidny kod to fundament. Budujemy skalowalne aplikacje i strony, które działają błyskawicznie.",
    cards: [
      { title: "Strony WWW Premium", desc: "Next.js, React, animacje 60fps. Zero szablonów.", icon: Globe },
      { title: "Sklepy E-commerce", desc: "Headless Shopify/WooCommerce. Konwersja first.", icon: Smartphone },
      { title: "Web Applications", desc: "Systemy SaaS, CRM i dedykowane panele klienta.", icon: Layers },
    ]
  },
  {
    id: 'design',
    label: 'Design & UI/UX',
    icon: Palette,
    description: "Nie tylko ładne obrazki. Projektujemy ścieżki użytkownika, które prowadzą prosto do zakupu.",
    cards: [
      { title: "Product Design", desc: "Makiety High-Fidelity i prototypowanie interakcji.", icon: Palette },
      { title: "Rebranding", desc: "Nowa tożsamość wizualna, która wyróżni Cię z tłumu.", icon: Layers },
      { title: "Design System", desc: "Spójność marki na każdym urządzeniu i kanale.", icon: CheckCircle2 },
    ]
  },
  {
    id: 'ai',
    label: 'Automatyzacja AI',
    icon: Bot,
    description: "Zatrudnij technologię zamiast kolejnych pracowników. Automatyzujemy nudne procesy.",
    cards: [
      { title: "Chatboty Sprzedażowe", desc: "Obsługa klienta 24/7 bez udziału człowieka.", icon: Bot },
      { title: "Workflow Automation", desc: "Łączymy Twoje CRM, maile i faktury w jeden organizm.", icon: Cpu },
      { title: "Analiza Danych AI", desc: "Wyciągamy wnioski z danych, których nie widzi ludzkie oko.", icon: BarChart },
    ]
  },
  {
    id: 'marketing',
    label: 'Growth Marketing',
    icon: BarChart,
    description: "Nawet najlepszy produkt potrzebuje widowni. Dostarczamy precyzyjny ruch.",
    cards: [
      { title: "SEO Techniczne", desc: "Pozycjonowanie oparte na wydajności i Core Web Vitals.", icon: Search },
      { title: "Kampanie Performance", desc: "Google Ads & Meta Ads nastawione na ROI.", icon: Megaphone },
      { title: "Content Strategy", desc: "Treści, które budują autorytet i zaufanie.", icon: Layers },
    ]
  },
];

export const Services = () => {
  const [activeTab, setActiveTab] = useState(servicesData[0].id);

  const toggleMobile = (id: string) => {
    setActiveTab(activeTab === id ? '' : id);
  };

  const activeContent = servicesData.find(s => s.id === activeTab);

  return (
    <section className="relative w-full py-20 md:py-24 bg-[#050505] overflow-hidden" id="uslugi">
      
      {/* TŁO AMBIENT */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* NAGŁÓWEK (H2) */}
        <div className="mb-12 md:mb-20 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Nasze <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Usługi</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                Kompleksowe podejście. Od pierwszej linii kodu, przez design, aż po automatyzację procesów. Nie szukaj trzech agencji, wystarczy jedna dobra.
            </p>
        </div>

        {/* --- DESKTOP (STANDARDOWY ROZMIAR) --- */}
        <div className="hidden lg:flex flex-row gap-20 min-h-[500px]">
            
            {/* LEWA STRONA: NAWIGACJA */}
            <div className="w-1/3 flex flex-col gap-2">
                {servicesData.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => setActiveTab(service.id)}
                        className={`group relative flex items-center justify-between p-6 text-left rounded-2xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            activeTab === service.id 
                                ? 'bg-white/5 text-white' 
                                : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        {activeTab === service.id && (
                            <motion.div 
                                layoutId="active-indicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl"
                            />
                        )}
                        <span className="text-xl font-bold tracking-tight">{service.label}</span>
                        <ArrowRight 
                            className={`w-5 h-5 transition-transform duration-300 ${
                                activeTab === service.id 
                                    ? 'text-blue-400 translate-x-0 opacity-100' 
                                    : 'opacity-0 -translate-x-4'
                            }`} 
                        />
                    </button>
                ))}
            </div>

            {/* PRAWA STRONA: KARTY */}
            <div className="w-2/3">
                <AnimatePresence mode="wait">
                    {activeContent && (
                        <motion.div
                            key={activeContent.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8">
                                {/* H3 - Poprawna hierarchia na Desktopie (H2 -> H3) */}
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <activeContent.icon className="text-blue-500" size={24} />
                                    {activeContent.label}
                                </h3>
                                <p className="text-slate-400 max-w-lg">
                                    {activeContent.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {activeContent.cards.map((card, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="group p-6 rounded-2xl bg-[#080808] border border-white/5 hover:border-blue-500/30 transition-colors duration-300 flex flex-col gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-900/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <card.icon size={20} />
                                        </div>
                                        <div>
                                            {/* H4 - Poprawna hierarchia na Desktopie (H3 -> H4) */}
                                            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                                                {card.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                {card.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                    <h4 className="text-white font-bold">Inne wyzwanie?</h4>
                                    <p className="text-xs text-slate-500">Napisz do nas.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* --- WERSJA MOBILE (ACCORDION XXL) --- */}
        <div className="flex flex-col gap-5 lg:hidden">
            {servicesData.map((service) => {
                const isOpen = activeTab === service.id;

                return (
                    <div 
                        key={service.id} 
                        className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                            isOpen ? 'bg-white/[0.03] border-blue-500/30' : 'bg-[#080808] border-white/10'
                        }`}
                    >
                        <button
                            onClick={() => toggleMobile(service.id)}
                            className="w-full flex items-center justify-between p-6 text-left active:bg-white/5 transition-colors"
                            // Dodajemy aria-expanded dla dostępności
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl transition-colors ${isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                                    <service.icon size={28} />
                                </div>
                                <span className={`text-2xl font-bold ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                                    {service.label}
                                </span>
                            </div>
                            <ChevronDown 
                                className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} 
                            />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-6 pb-8 pt-2 border-t border-white/5">
                                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                            {service.description}
                                        </p>
                                        
                                        <div className="space-y-4">
                                            {service.cards.map((card, idx) => (
                                                <div key={idx} className="flex gap-5 p-5 rounded-2xl bg-black/40 border border-white/5">
                                                    <div className="mt-1 text-blue-500 shrink-0">
                                                        <card.icon size={24} />
                                                    </div>
                                                    <div>
                                                        {/* NAPRAWA: Zmieniono H4 na H3 dla zachowania ciągłości (H2 -> H3) */}
                                                        <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                                                        <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="p-5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-3 text-slate-400">
                                                <span>Masz inny pomysł?</span>
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>

      </div>
    </section>
  );
};