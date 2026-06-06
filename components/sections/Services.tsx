'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { services } from '@/app/data/services'
import { Reveal } from '@/components/Reveal'

export const Services = () => {
    const [activeTab, setActiveTab] = useState(services[0].id)
    const [mobileActiveTab, setMobileActiveTab] = useState<string | null>(services[0].id)
    const shouldReduceMotion = useReducedMotion()

    const activeContent = services.find(s => s.id === activeTab)

    const toggleMobile = (id: string) => {
        setMobileActiveTab(mobileActiveTab === id ? null : id)
    }

    // CAŁKOWICIE USUNIĘTE FRAMER MOTION z tego pliku - Framer Motion 12 + Next.js 16
    // static export na produkcji w jakiś sposób blokuje Link onClick (lewy klik nie nawiguje,
    // środkowy klik działa). Pattern: tylko strony bez Framer Motion miały działającą nawigację.
    // Zastępujemy wszystkie motion.* na plain DOM + CSS transitions / Reveal (CSS-only).

    return (
        <section className="relative w-full py-20 md:py-24 bg-[#050505] overflow-hidden" id="uslugi">
            <div
                className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none"
                aria-hidden="true"
            />

            <div className="container mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="mb-12 md:mb-20 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                            Nasze{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">usługi</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Strategia, design i wdrożenie u jednego zespołu. Oszczędzasz czas i dostajesz spójny, gotowy produkt.
                        </p>
                    </div>
                </Reveal>

                {/* ============================================================
                    DESKTOP VIEW (TABY) - plain div zamiast motion.div żeby Next.js Link
                    onClick działał na produkcji static export. CSS-only Reveal dla entry.
                   ============================================================ */}
                <div className="hidden lg:flex flex-row gap-20 min-h-[500px]">
                    {/* LEWA STRONA: ZAKŁADKI */}
                    <div className="w-1/3 flex flex-col gap-2">
                        {services.map(service => (
                            <button
                                key={service.id}
                                onClick={() => setActiveTab(service.id)}
                                className={`group relative flex items-center justify-between p-6 text-left rounded-2xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                                    activeTab === service.id
                                        ? 'bg-white/5 text-white'
                                        : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                                }`}
                            >
                                {activeTab === service.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
                                )}
                                <span className="text-xl font-bold tracking-tight">{service.label}</span>
                                <ArrowRight
                                    className={`w-5 h-5 transition-transform duration-300 ${
                                        activeTab === service.id ? 'text-blue-400 translate-x-0 opacity-100' : 'opacity-0 -translate-x-4'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* PRAWA STRONA: CONTENT - crossfade przy zmianie kategorii.
                        AnimatePresence mode="wait" + key=activeContent.id: treść wychodzącej
                        kategorii zanika + lekko się przesuwa, wchodząca wjeżdża (opacity + translateY,
                        compositor-only). useReducedMotion → instant (zero ruchu).
                        Bezpieczne dla Next.js Link routing po fix flatten-rsc (Sesja 20) -
                        mode="wait" usuwa wychodzący element zanim wjedzie nowy (brak overlapu na
                        klikalnym obszarze). */}
                    <div className="w-2/3">
                        <AnimatePresence mode="wait" initial={false}>
                            {activeContent && (
                                <motion.div
                                    key={activeContent.id}
                                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                                    transition={{ duration: shouldReduceMotion ? 0.2 : 0.3, ease: 'easeOut' }}
                                    style={{ willChange: 'transform, opacity' }}
                                >
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <activeContent.icon className="text-blue-500" size={24} />
                                    {activeContent.label}
                                </h3>
                                <p className="text-slate-400 max-w-lg">{activeContent.description}</p>
                            </div>

                            {/* GRID KART */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {activeContent.cards.map((card, index) => (
                                    <div key={index}>
                                        <Link
                                            href={card.href}
                                            className={`group block h-full p-8 rounded-3xl bg-[#080808] border border-white/5 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden relative ${card.shadow}`}
                                        >
                                            {/* Gradient overlay */}
                                            <div
                                                className={`absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl ${card.gradient}`}
                                                aria-hidden="true"
                                            />

                                            <div className="relative z-10 flex justify-between items-start mb-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${card.iconColor}`}>
                                                    <card.icon size={26} />
                                                </div>
                                                <div className="p-1.5 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex-1 flex flex-col">
                                                <h4 className="text-xl font-bold mb-3 transition-all text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-400">
                                                    {card.title}
                                                </h4>
                                                <p className="text-slate-400 leading-relaxed flex-1">{card.desc}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* LINK DO PODSTRONY SLUG */}
                            <div className="flex justify-start">
                                <Link
                                    href={`/uslugi/${activeContent.slug}`}
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-blue-50 transition-all flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:scale-105"
                                >
                                    Zobacz {activeContent.label}
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ============================================================
                    MOBILE VIEW (CLEAN ACCORDION + SWIPE)
                   ============================================================ */}
                <div className="flex flex-col lg:hidden">
                    {services.map((service) => {
                        const isOpen = mobileActiveTab === service.id;

                        return (
                            <div 
                                key={service.id} 
                                className="border-b border-white/5 last:border-none"
                            >
                                <button
                                    onClick={() => toggleMobile(service.id)}
                                    className="w-full flex items-center justify-between py-6 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`transition-colors duration-300 ${
                                            isOpen ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                                        }`}>
                                            <service.icon size={28} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                                                isOpen ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                            }`}>
                                                {service.label}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                        <ChevronDown className={`w-6 h-6 ${isOpen ? 'text-blue-400' : 'text-slate-600'}`} />
                                    </div>
                                </button>

                                {/* CSS grid-rows technique do animacji height (0fr ↔ 1fr).
                                    Bez AnimatePresence/motion.div żeby Next.js Link działał na produkcji
                                    (Framer Motion + Link wewnątrz miało race condition blokujący routing). */}
                                <div
                                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="pb-8">
                                            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                                                {service.description}
                                            </p>

                                            {/* Kontener Mobile Cards */}
                                            <div
                                                className="flex overflow-x-auto pb-4 -mx-6 px-6 gap-3 snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
                                                data-lenis-prevent
                                            >
                                                {service.cards.map((card, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={card.href}
                                                        className={`
                                                            snap-center shrink-0 w-[80vw] md:w-[300px]
                                                            p-6 rounded-3xl
                                                            bg-[#0a0a0a]
                                                            border border-white/10
                                                            flex flex-col gap-4
                                                            active:scale-[0.98] transition-all duration-200 overflow-hidden relative group
                                                            ${card.shadow}
                                                        `}
                                                    >
                                                        {/* Gradient overlay */}
                                                        <div
                                                            className={`absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl bg-linear-to-br ${card.gradient}`}
                                                            aria-hidden="true"
                                                        />

                                                        <div className="relative z-10 flex justify-between items-start">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                                                                <card.icon size={22} />
                                                            </div>
                                                            <div className="p-1.5 rounded-full bg-white/5 border border-white/5">
                                                                <ArrowUpRight className="w-4 h-4 text-slate-500 group-active:text-white transition-all group-active:translate-x-1" />
                                                            </div>
                                                        </div>

                                                        <div className="relative z-10">
                                                            <h4 className="text-lg font-bold mb-1 transition-all text-white group-active:text-transparent group-active:bg-clip-text group-active:bg-linear-to-r group-active:from-white group-active:to-slate-400">
                                                                {card.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                                {card.desc}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}

                                                {/* LINK DO PODSTRONY SLUG */}
                                                <Link
                                                    href={`/uslugi/${service.slug}`}
                                                    className="snap-center shrink-0 w-[80px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10">
                                                        <ArrowRight size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Więcej
                                                    </span>
                                                </Link>

                                                <div className="w-1 shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}