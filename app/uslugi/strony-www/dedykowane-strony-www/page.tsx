'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
    Target,
    Code2,
    Database,
    Search,
    ShieldCheck,
    MousePointer2,
    Cpu,
    Layers,
    CheckCircle2,
    TerminalSquare,
    Lock,
    KeyRound
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { AvenlyAICta } from '@/components/AvenlyAICta'

export default function DedicatedWebsitesPage() {
    // --- ANIMACJA 1: MAKIETA (HOME -> PODSTRONA -> LOGOWANIE -> DASHBOARD) ---
    const targetRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: mainProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    })

    const smoothMain = useSpring(mainProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001,
    })

    // Główne transformacje makiety
    const scale = useTransform(smoothMain, [0, 0.03], [0.85, 1])
    const rotateX = useTransform(smoothMain, [0, 0.03], [15, 0])
    const opacity = useTransform(smoothMain, [0, 0.02], [0.3, 1])
    const progressBar = useTransform(smoothMain, [0.03, 0.95], ['0%', '100%'])

    // --- LOGIKA URL ---
    const urlHomeOpacity = useTransform(smoothMain, [0, 0.24, 0.26], [1, 1, 0])
    const urlSubOpacity = useTransform(smoothMain, [0.24, 0.26, 0.44, 0.46], [0, 1, 1, 0])
    const urlAuthOpacity = useTransform(smoothMain, [0.44, 0.46, 0.64, 0.66], [0, 1, 1, 0])
    const urlDashOpacity = useTransform(smoothMain, [0.64, 0.66, 1], [0, 1, 1])

    // --- FAZA 1: STRONA GŁÓWNA (ROZBUDOWANA) ---
    const homeY = useTransform(smoothMain, [0.03, 0.20], ['0%', '-45%'])
    const homeOpacity = useTransform(smoothMain, [0, 0.24, 0.26, 1], [1, 1, 0, 0])

    // --- FAZA 2: PODSTRONA ---
    const subOpacity = useTransform(smoothMain, [0, 0.25, 0.27, 0.44, 0.46, 1], [0, 0, 1, 1, 0, 0])
    const subY = useTransform(smoothMain, [0.28, 0.40], ['0%', '-35%'])

    // --- KURSOR - ZŁOŻONA ŚCIEŻKA ---
    const cursorOpacity = useTransform(
        smoothMain, 
        // 1. Wjazd do linku | 2. Wjazd do Panelu | 3. Wjazd do Login
        [0, 0.14, 0.16, 0.23, 0.24, 0.37, 0.39, 0.43, 0.44, 0.55, 0.57, 0.61, 0.62, 1], 
        [0, 0,    1,    1,    0,    0,    1,    1,    0,    0,    1,    1,    0,    0]
    )
    
    // Zmienione wartości X i Y z procentów na calc/viewport, aby trafiały w Navbar.
    // 'calc(100% - 180px)' celuje w przyciski po prawej niezależnie od szerokości makiety.
    const cursorX = useTransform(
        smoothMain,
        // Start -> Do "Oferta" -> Chowa się -> Do "Panel" -> Chowa się -> Do "Zaloguj"
        [0,      0.15,   0.20,              0.23,             0.37,   0.41,               0.43,               0.56,   0.59,  0.61, 1],
        ['110%', '110%', 'calc(100% - 220px)', 'calc(100% - 220px)', '110%', 'calc(100% - 80px)', 'calc(100% - 80px)', '110%', '50%', '50%', '50%'], 
    )
    
    // Y celuje teraz w 40px od góry, co wypada w połowie Navbaru (przy założeniu h-20 / 80px wysokości).
    const cursorY = useTransform(
        smoothMain,
        [0,      0.15,   0.20,  0.23,  0.37,   0.41,  0.43,  0.56,   0.59,  0.61, 1],
        ['100%', '100%', '32px', '32px', '100%', '32px', '32px', '100%', 'calc(50% + 120px)', 'calc(50% + 120px)', 'calc(50% + 120px)'], 
    )
    
    const cursorScale = useTransform(
        smoothMain,
        // Klika w Oferte (0.21) | Klika w Panel (0.42) | Klika w Zaloguj (0.60)
        [0, 0.20, 0.21, 0.22, 0.41, 0.42, 0.43, 0.59, 0.60, 0.61, 1],
        [1, 1,    0.8,  1,    1,    0.8,  1,    1,    0.8,  1,    1], 
    )

    // --- FAZA 3: FORMULARZ LOGOWANIA ---
    const authOpacity = useTransform(smoothMain, [0, 0.44, 0.46, 0.62, 0.64, 1], [0, 0, 1, 1, 0, 0])
    const emailWidth = useTransform(smoothMain, [0.48, 0.52], ['0%', '100%'])
    const passWidth = useTransform(smoothMain, [0.53, 0.56], ['0%', '100%'])

    // --- FAZA 4: LOADER ---
    const loaderOpacity = useTransform(smoothMain, [0, 0.64, 0.66, 0.70, 0.72, 1], [0, 0, 1, 1, 0, 0])

    // --- FAZA 5: DASHBOARD ---
    const dashboardOpacity = useTransform(smoothMain, [0, 0.72, 0.74, 1], [0, 0, 1, 1])
    const dashboardY = useTransform(smoothMain, [0.74, 0.95], ['0%', '-15%'])
    const skeletonOpacity = useTransform(smoothMain, [0, 0.74, 0.78, 0.80, 1], [0, 1, 1, 0, 0])
    const dataOpacity = useTransform(smoothMain, [0, 0.78, 0.80, 1], [0, 0, 1, 1])

    const chartHeight1 = useTransform(smoothMain, [0.80, 0.86], ['0%', '80%'])
    const chartHeight2 = useTransform(smoothMain, [0.82, 0.88], ['0%', '50%'])
    const chartHeight3 = useTransform(smoothMain, [0.84, 0.90], ['0%', '100%'])
    const chartHeight4 = useTransform(smoothMain, [0.86, 0.92], ['0%', '70%'])

    // --- ANIMACJA 2: ZAKRES PRAC SCROLL LOCK ---
    const scopeRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: scopeProgress } = useScroll({
        target: scopeRef,
        offset: ['start start', 'end end'],
    })

    const smoothScope = useSpring(scopeProgress, {
        stiffness: 70,
        damping: 25,
        restDelta: 0.001,
    })

    const scopeCardsY = useTransform(smoothScope, [0, 1], ['40vh', '-75%'])

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-clip">
            {/* TŁO KINOWE */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_70%)]" />
            </div>

            <main className="relative z-10">
                {/* --- HERO SECTION --- */}
                <section className="pt-32 pb-10 container mx-auto px-6 text-center">
                    <Reveal delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <TerminalSquare size={14} /> Custom Web Development
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
                            Więcej niż <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
                                tylko strona.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
                            Dedykowane strony internetowe połączone z zaawansowanymi systemami, panelami klienta i aplikacjami. Zbuduj
                            cyfrowe serce swojego biznesu.
                        </p>
                    </Reveal>
                </section>

                {/* --- SEKCJA ANIMACJI 1 --- */}
                <section ref={targetRef} style={{ height: '800vh' }} className="relative z-30">
                    <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">
                        <motion.div
                            style={{ scale, opacity, rotateX, perspective: '1200px' }}
                            className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden will-change-transform">
                            
                            {/* PASEK PRZEGLĄDARKI */}
                            <div className="relative h-14 bg-[#111] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                                <div className="flex gap-1.5 md:gap-2 shrink-0">
                                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                                </div>

                                <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/50 rounded-full border border-white/5 flex items-center justify-center px-4 overflow-hidden z-50 shadow-inner max-w-[50%] md:max-w-md">
                                    <span className="text-purple-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                                    <div className="relative w-32 sm:w-56 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                                        <motion.span style={{ opacity: urlHomeOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">
                                            twoja-marka.pl
                                        </motion.span>
                                        <motion.span style={{ opacity: urlSubOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-fuchsia-300">
                                            twoja-marka.pl/oferta
                                        </motion.span>
                                        <motion.span style={{ opacity: urlAuthOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-pink-300">
                                            twoja-marka.pl/login
                                        </motion.span>
                                        <motion.span style={{ opacity: urlDashOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-purple-300">
                                            twoja-marka.pl/portal
                                        </motion.span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                                    <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500 will-change-transform" />
                                </div>
                            </div>

                            {/* GŁÓWNY KONTENER EKRANU */}
                            <div className="relative flex-1 bg-[#020202] overflow-hidden flex flex-col">
                                
                                {/* NIERUCHOMY NAVBAR (Żeby nie scrollował się ze stroną) */}
                                <div className="absolute top-0 inset-x-0 w-full h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-[#020202]/90 backdrop-blur-md z-40 pointer-events-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                            <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-400 rounded-sm" />
                                        </div>
                                        <div className="w-24 h-5 bg-white/10 rounded-md hidden sm:block" />
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        {/* Linki Nawigacyjne */}
                                        <div className="hidden md:flex gap-6 items-center">
                                            <div className="w-16 h-2 bg-purple-400/80 rounded shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                            <div className="w-16 h-2 bg-white/20 rounded" />
                                            <div className="w-16 h-2 bg-white/20 rounded" />
                                        </div>
                                        {/* PRZYCISK LOGOWANIA DO PANELU */}
                                        <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-400">
                                            <Lock size={14} />
                                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:block">Panel Klienta</span>
                                        </div>
                                    </div>
                                </div>

                                {/* =========================================
                                FAZA 1: STRONA GŁÓWNA 
                                ========================================= */}
                                <motion.div
                                    style={{ y: homeY, opacity: homeOpacity }}
                                    className="absolute inset-x-0 top-0 pt-16 md:pt-20 flex flex-col will-change-transform z-10">
                                    
                                    {/* Hero Section */}
                                    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-16 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
                                            <div className="w-32 h-6 bg-purple-500/20 rounded-full mb-2 mx-auto md:mx-0" />
                                            <div className="w-full h-12 md:h-16 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl" />
                                            <div className="w-5/6 h-12 md:h-16 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl mx-auto md:mx-0" />
                                            <div className="w-3/4 h-4 bg-white/5 rounded-md mt-4 mx-auto md:mx-0" />
                                            <div className="w-2/3 h-4 bg-white/5 rounded-md mx-auto md:mx-0" />
                                            <div className="flex gap-4 mt-6 justify-center md:justify-start">
                                                <div className="w-36 h-14 bg-purple-500 border border-purple-400 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                                                <div className="w-36 h-14 bg-white/5 border border-white/10 rounded-xl" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 w-full aspect-square md:aspect-auto md:h-[400px] relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full" />
                                            <div className="w-64 h-64 rounded-full border border-purple-500/20 absolute animate-[spin_10s_linear_infinite] border-t-purple-500" />
                                            <div className="w-48 h-48 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl absolute rotate-12 flex flex-col justify-between p-6 shadow-2xl">
                                                <div className="w-12 h-12 rounded-full bg-purple-500/20" />
                                                <div className="w-full h-3 bg-white/10 rounded" />
                                                <div className="w-2/3 h-3 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid Bento */}
                                    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 aspect-video bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 mb-8" />
                                                <div className="w-1/2 h-6 bg-white/10 rounded-md mb-4" />
                                                <div className="w-3/4 h-4 bg-white/5 rounded-md mb-2" />
                                                <div className="w-2/3 h-4 bg-white/5 rounded-md" />
                                            </div>
                                            <div className="aspect-square md:aspect-auto bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
                                                <div className="w-24 h-24 rounded-full bg-purple-500/10 border-[8px] border-white/5 border-t-purple-500" />
                                                <div className="w-1/2 h-4 bg-white/10 rounded mt-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dodatkowa Sekcja (Feature / Wireframe) */}
                                    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12 pb-32 border-t border-white/5">
                                        <div className="flex flex-col md:flex-row gap-12 items-center">
                                            <div className="flex-1 w-full flex flex-col gap-4">
                                                <div className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center px-6 gap-6">
                                                    <div className="w-16 h-16 rounded-full bg-purple-500/20" />
                                                    <div className="flex-1">
                                                        <div className="w-2/3 h-4 bg-white/10 rounded mb-2" />
                                                        <div className="w-1/2 h-3 bg-white/5 rounded" />
                                                    </div>
                                                </div>
                                                <div className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center px-6 gap-6">
                                                    <div className="w-16 h-16 rounded-full bg-pink-500/20" />
                                                    <div className="flex-1">
                                                        <div className="w-3/4 h-4 bg-white/10 rounded mb-2" />
                                                        <div className="w-1/3 h-3 bg-white/5 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 w-full flex flex-col gap-6">
                                                <div className="w-1/2 h-6 bg-purple-500/20 rounded-full" />
                                                <div className="w-full h-10 bg-white/10 rounded-xl" />
                                                <div className="w-5/6 h-10 bg-white/10 rounded-xl" />
                                                <div className="w-full h-4 bg-white/5 rounded-md mt-4" />
                                                <div className="w-4/5 h-4 bg-white/5 rounded-md" />
                                                <div className="w-full h-4 bg-white/5 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* =========================================
                                FAZA 2: PODSTRONA (OFERTA)
                                ========================================= */}
                                <motion.div
                                    style={{ y: subY, opacity: subOpacity }}
                                    className="absolute inset-x-0 top-0 pt-16 md:pt-20 flex flex-col will-change-transform z-15 pointer-events-none">
                                    
                                    {/* Subpage Banner */}
                                    <div className="w-full h-64 md:h-80 bg-gradient-to-br from-fuchsia-900/20 to-transparent border-b border-white/5 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                        <div className="w-32 h-6 bg-fuchsia-500/20 rounded-full" />
                                        <div className="w-3/4 max-w-2xl h-12 md:h-16 bg-white/10 rounded-2xl" />
                                        <div className="w-1/2 max-w-md h-4 bg-white/5 rounded-md" />
                                    </div>

                                    {/* Subpage Grid */}
                                    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 pb-32">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 mb-2" />
                                                    <div className="w-full h-5 bg-white/10 rounded-md" />
                                                    <div className="w-3/4 h-3 bg-white/5 rounded" />
                                                    <div className="w-5/6 h-3 bg-white/5 rounded" />
                                                    <div className="w-full h-10 mt-4 bg-white/5 rounded-xl border border-white/5" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="w-full mt-16 p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center text-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-purple-500/20 mb-4" />
                                            <div className="w-1/2 h-8 bg-white/10 rounded-xl" />
                                            <div className="w-3/4 h-4 bg-white/5 rounded-md" />
                                            <div className="w-2/3 h-4 bg-white/5 rounded-md" />
                                            <div className="w-48 h-12 mt-4 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-xl" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* =========================================
                                FAZA 3: FORMULARZ LOGOWANIA
                                ========================================= */}
                                <motion.div
                                    style={{ opacity: authOpacity }}
                                    className="absolute inset-0 pt-16 md:pt-20 z-20 flex items-center justify-center bg-[#020202] will-change-opacity pointer-events-none">
                                    
                                    <div className="w-full max-w-md p-8 md:p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col shadow-2xl relative">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 mx-auto border border-purple-500/30">
                                            <KeyRound size={24} />
                                        </div>
                                        <div className="w-48 h-6 bg-white/10 rounded-md mb-2 mx-auto" />
                                        <div className="w-32 h-3 bg-white/5 rounded-md mb-8 mx-auto" />

                                        {/* Pole Email */}
                                        <div className="w-full mb-4">
                                            <div className="w-16 h-3 bg-white/10 rounded mb-2" />
                                            <div className="w-full h-12 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden flex items-center px-4">
                                                <motion.div style={{ width: emailWidth }} className="h-4 overflow-hidden border-r-2 border-purple-500 flex items-center">
                                                    <span className="text-sm font-mono text-purple-200 truncate">admin@twoja-marka.pl</span>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Pole Hasło */}
                                        <div className="w-full mb-8">
                                            <div className="w-20 h-3 bg-white/10 rounded mb-2" />
                                            <div className="w-full h-12 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden flex items-center px-4">
                                                <motion.div style={{ width: passWidth }} className="h-4 overflow-hidden border-r-2 border-purple-500 flex items-center text-purple-200 tracking-widest text-lg">
                                                    ••••••••••••
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Przycisk Zaloguj - Zmieniony na Flex, aby latwiej wycelowac w środek */}
                                        <div className="w-full h-12 rounded-xl bg-purple-500 border border-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                            <span className="text-sm font-bold">Zaloguj się</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* =========================================
                                FAZA 4: LOADER (PRZEJŚCIE)
                                ========================================= */}
                                <motion.div
                                    style={{ opacity: loaderOpacity }}
                                    className="absolute inset-0 z-30 flex items-center justify-center bg-[#020202] will-change-opacity pointer-events-none">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
                                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-1/2 h-full bg-purple-500 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* =========================================
                                FAZA 5: DASHBOARD / PANEL APLIKACJI
                                ========================================= */}
                                <motion.div
                                    style={{ y: dashboardY, opacity: dashboardOpacity }}
                                    className="absolute inset-0 z-10 flex w-full h-full will-change-transform pt-16 md:pt-20 bg-[#020202]">
                                    
                                    <div className="w-16 md:w-64 h-full border-r border-white/5 bg-[#050505] p-4 flex flex-col gap-6 pt-8 shrink-0">
                                        <div className="w-8 h-8 md:w-full md:h-12 rounded-lg md:rounded-xl bg-purple-500/20 border border-purple-500/30 mb-4" />
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`flex items-center gap-4 group cursor-pointer p-2 md:p-3 rounded-lg ${i === 1 ? 'bg-white/5' : ''}`}>
                                                <div className={`w-4 h-4 md:w-6 md:h-6 rounded bg-white/10 shrink-0 ${i === 1 ? 'bg-purple-500/50' : ''}`} />
                                                <div className="hidden md:block w-full h-3 rounded bg-white/5 group-hover:bg-white/10 transition-colors" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex-1 p-6 md:p-12 relative overflow-hidden">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 mb-4" />
                                                    <motion.div style={{ opacity: skeletonOpacity }} className="absolute bottom-6 left-6 right-6">
                                                        <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
                                                    </motion.div>
                                                    <motion.div style={{ opacity: dataOpacity }} className="flex flex-col gap-1 md:gap-2">
                                                        <div className="text-xl md:text-3xl font-black text-white">
                                                            {i === 1 ? '12,400' : i === 2 ? '89%' : i === 3 ? '$45k' : '24/7'}
                                                        </div>
                                                        <div className="text-[10px] md:text-xs text-purple-400 font-mono tracking-wider">+12.5%</div>
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                            <div className="xl:col-span-2 aspect-video rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex flex-col relative">
                                                <div className="w-1/3 h-6 bg-white/10 rounded-md mb-8" />
                                                <div className="flex-1 flex items-end gap-2 md:gap-6 justify-between border-b border-white/10 pb-4 relative px-2">
                                                    <div className="absolute inset-x-0 bottom-1/4 h-px bg-white/5" />
                                                    <div className="absolute inset-x-0 bottom-2/4 h-px bg-white/5" />
                                                    <div className="absolute inset-x-0 bottom-3/4 h-px bg-white/5" />
                                                    <motion.div style={{ height: chartHeight1 }} className="w-full bg-gradient-to-t from-purple-500/40 to-purple-400 rounded-t-lg relative z-10" />
                                                    <motion.div style={{ height: chartHeight2 }} className="w-full bg-gradient-to-t from-purple-500/40 to-purple-400 rounded-t-lg relative z-10" />
                                                    <motion.div style={{ height: chartHeight3 }} className="w-full bg-gradient-to-t from-pink-500/40 to-pink-400 rounded-t-lg relative z-10 shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
                                                    <motion.div style={{ height: chartHeight4 }} className="w-full bg-gradient-to-t from-purple-500/40 to-purple-400 rounded-t-lg relative z-10" />
                                                    <motion.div style={{ height: chartHeight1 }} className="w-full bg-gradient-to-t from-purple-500/40 to-purple-400 rounded-t-lg relative z-10 hidden sm:block" />
                                                </div>
                                            </div>

                                            <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex flex-col gap-4 relative overflow-hidden hidden xl:flex">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                                                <div className="w-1/2 h-6 bg-white/10 rounded-md mb-4" />
                                                {[1, 2, 3, 4].map(i => (
                                                    <motion.div key={i} style={{ opacity: dataOpacity }} className="flex gap-4 items-start p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 shrink-0 border border-purple-500/30" />
                                                        <div className="flex flex-col gap-2 w-full pt-1">
                                                            <div className="w-3/4 h-3 bg-white/20 rounded" />
                                                            <div className="w-1/2 h-2 bg-white/10 rounded" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                <motion.div style={{ opacity: skeletonOpacity }} className="absolute inset-0 bg-[#0a0a0a] p-6 flex flex-col gap-4 z-20">
                                                    <div className="w-1/2 h-6 bg-white/10 rounded-md mb-4" />
                                                    <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-purple-500 animate-spin mx-auto mt-10" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* --- ANIMOWANY KURSOR --- */}
                                <motion.div
                                    style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }}
                                    className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform">
                                    <MousePointer2 size={32} className="text-white fill-purple-500 stroke-[1.5]" />
                                </motion.div>

                                {/* Mgła dla głębi makiety */}
                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-50 pointer-events-none" />
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ opacity: useTransform(smoothMain, [0, 0.05, 0.1], [1, 1, 0]) }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-purple-500 z-10 pointer-events-none">
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby testować aplikację</span>
                            <div className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent" />
                        </motion.div>
                    </div>
                </section>

                {/* --- BENTO GRID (TECHNOLOGIA I ZALETY) --- */}
                <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
                    <section className="py-24 md:py-32 border-b border-white/5">
                        <Reveal>
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Technologia Liderów</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Zostawiamy w tyle ciężkie, wolne systemy. Budujemy na tym samym stosie technologicznym co Netflix,
                                    TikTok i największe startupy.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
                            {/* KARTA 1 */}
                            <div className="md:col-span-12 h-full">
                                <Reveal delay={0.1}>
                                    <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                                        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none" />
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 relative z-10 border border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-500">
                                            <Cpu size={32} />
                                        </div>
                                        <div className="relative z-10 flex-1 text-center md:text-left">
                                            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                                                Architektura Headless
                                            </h3>
                                            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                                                Rozdzielamy frontend od bazy danych. Dzięki temu Twoja aplikacja jest odporna na ataki,
                                                błyskawiczna w ładowaniu i gotowa na podpięcie pod aplikację mobilną w przyszłości.
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* KARTA 2 */}
                            <div className="md:col-span-6 h-full">
                                <Reveal delay={0.2}>
                                    <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-pink-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full group-hover:bg-pink-500/20 transition-all duration-500" />
                                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-8 relative z-10 border border-pink-500/20 shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform duration-500">
                                            <Database size={28} />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-pink-400 transition-colors">
                                                Potężne Integracje
                                            </h3>
                                            <p className="text-slate-400 leading-relaxed">
                                                Płatności, systemy ERP, CRM czy kurierzy. Łączymy Twoją platformę z dowolnym zewnętrznym API
                                                (REST / GraphQL).
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* KARTA 3 */}
                            <div className="md:col-span-6 h-full">
                                <Reveal delay={0.3}>
                                    <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 relative z-10 border border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-500">
                                            <Layers size={28} />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                                                Interfejs w Czasie Rzeczywistym
                                            </h3>
                                            <p className="text-slate-400 leading-relaxed">
                                                Brak konieczności przeładowywania stron. Interfejsy reagują natychmiast na akcje użytkownika, co
                                                daje poczucie używania aplikacji natywnej.
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* KARTA 4 */}
                            <div className="md:col-span-12 h-full">
                                <Reveal delay={0.4}>
                                    <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-[#050505] border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 shadow-[0_0_40px_-15px_rgba(168,85,247,0.15)] group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 relative z-10 border border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-500">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 relative z-10 text-white group-hover:text-purple-400 transition-colors">
                                            Skalowalność i Bezpieczeństwo
                                        </h3>
                                        <p className="text-slate-400 text-lg max-w-3xl relative z-10 leading-relaxed">
                                            Zabezpieczamy panele logowania i chronimy dane. Kod operuje na nowoczesnej infrastrukturze
                                            (Cloud), co gwarantuje ciągłość działania nawet przy gwałtownych wzrostach ruchu.
                                        </p>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- SEKCJA ANIMACJI 2 (SCROLL LOCK ZAKRESU PRAC) --- */}
                <section ref={scopeRef} className="relative h-[300vh] bg-[#050505] z-30">
                    <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
                        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 h-full pt-24 md:pt-40">
                            {/* Lewa strona - Nieruchomy nagłówek */}
                            <div className="lg:w-5/12 text-center lg:text-left shrink-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6 mx-auto lg:mx-0">
                                    <CheckCircle2 size={14} /> Zakres Wdrożenia
                                </div>
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                                    Od konceptu <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                        po wdrożenie.
                                    </span>
                                </h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    Budowa zaawansowanej platformy wymaga inżynieryjnego podejścia. Zobacz, jak bezpiecznie przeprowadzamy
                                    Cię przez cały proces.
                                </p>
                            </div>

                            {/* Prawa strona - Scrollowane karty */}
                            <div className="lg:w-7/12 relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)] pb-32">
                                <motion.div
                                    style={{ y: scopeCardsY }}
                                    className="flex flex-col gap-6 w-full absolute top-0 left-0 pb-[20vh]">
                                    {[
                                        {
                                            title: 'Architektura i Logika',
                                            desc: 'Zaczynamy od mapowania procesów biznesowych i doboru odpowiedniego stosu technologicznego (Backend/Frontend).',
                                        },
                                        {
                                            title: 'Prototypowanie (UX)',
                                            desc: 'Tworzymy klikalne makiety aplikacji i strony, aby zweryfikować użyteczność przed kodowaniem.',
                                        },
                                        {
                                            title: 'Nowoczesny Frontend',
                                            desc: 'Budujemy responsywne, komponentowe widoki w React, gwarantujące płynne i błyskawiczne działanie interfejsu.',
                                        },
                                        {
                                            title: 'Potężny Backend (CMS)',
                                            desc: 'Projektujemy własny system CMS, łączymy bazy danych, budujemy bezpieczne API i integrujemy systemy zewnętrzne.',
                                        },
                                        {
                                            title: 'Quality Assurance (QA)',
                                            desc: 'Rygorystyczne testy automatyczne i manualne, sprawdzające bezpieczeństwo oraz wydajność kodu pod obciążeniem.',
                                        },
                                        {
                                            title: 'Deploy & Utrzymanie',
                                            desc: 'Publikujemy projekt w infrastrukturze chmurowej (AWS/Vercel) i zapewniamy stałe wsparcie techniczne.',
                                        },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-10%' }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-start gap-6 group">
                                            <div className="absolute -bottom-6 right-0 text-[160px] md:text-[200px] font-black text-purple-500/5 group-hover:text-purple-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                                                0{i + 1}
                                            </div>

                                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] border border-purple-500/20">
                                                <CheckCircle2 size={20} />
                                            </div>

                                            <div className="relative z-10 flex-1">
                                                <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-slate-400 leading-relaxed text-base md:text-lg">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- STOPKA I CTA --- */}
                <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
                    <section className="border-t border-white/10 pt-20 pb-20">
                        <AvenlyAICta />
                    </section>
                </div>
            </main>
        </div>
    )
}