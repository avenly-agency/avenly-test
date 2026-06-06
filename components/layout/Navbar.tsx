'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ArrowRight, Github, Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLenis } from 'lenis/react'
import { cn } from '@/lib/utils'
// 1. DODANO IMPORTY GSAP
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// --- DANE NAWIGACJI ---
const NAV_LINKS = [
    { title: 'Usługi', href: '/uslugi' },
    { title: 'Proces', href: '#proces' },
    { title: 'O nas', href: '/o-nas' },
    { title: 'Realizacje', href: '/realizacje' },
    { title: 'Blog', href: '/blog' },
    { title: 'Kontakt', href: '/kontakt' },
]

// --- SOCIAL MEDIA LINKI ---
const SOCIAL_LINKS = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61581862509345' },
    { icon: Instagram, href: 'https://www.instagram.com/avenly.pl/' },
    { icon: Github, href: 'https://github.com/avenly-agency' },
]

// --- ANIMACJE (VARIANTS) ---
const menuVars: Variants = {
    initial: { scaleY: 0 },
    animate: {
        scaleY: 1,
        transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] as const },
    },
    exit: {
        scaleY: 0,
        transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
}

const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } },
}

const mobileLinkVars: Variants = {
    initial: {
        y: '30vh',
        transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as const },
    },
    open: {
        y: 0,
        transition: { ease: [0, 0.55, 0.45, 1] as const, duration: 0.7 },
    },
}

// --- DYNAMICZNY MOTYW NAWIGACJI (per-podstrona) ---
// Wszystkie klasy verbatim - Tailwind v4 JIT skanuje source, nie obsługuje
// dynamicznych concatów typu `text-${color}-500`. Spójne z lib/service-theme.ts
// oraz components/utils/ScrollbarTheme.tsx (jeden brand color na podstronę).
type NavTheme = {
    shell: string          // tło + border po scrollu
    dot: string            // kropka przy AVENLY (fallback SSR / no-JS)
    dotHex: string         // kropka przy AVENLY (Framer color tween przy zmianie podstrony)
    underline: string      // podkreślenie linku (hover)
    glow: string           // halo blur pod linkiem (hover)
    hamburgerHover: string // hover ikony hamburgera (mobile)
    mobileDot: string      // kropka przy linkach w menu mobile
    mobileLinkHover: string// hover tekstu linku (mobile)
    blob: string           // dekoracyjny blob w tle menu mobile
    socialHover: string    // hover ikon social (mobile)
    ctaHover: string       // hover przycisku "Darmowa Wycena" (mobile)
}

const NAV_THEMES: Record<string, NavTheme> = {
    default: {
        shell: 'bg-slate-950/80 border-slate-800/50',
        dot: 'text-blue-500', dotHex: '#3b82f6', underline: 'bg-blue-500', glow: 'bg-blue-400/20',
        hamburgerHover: 'hover:text-blue-400', mobileDot: 'text-blue-500',
        mobileLinkHover: 'hover:text-blue-500', blob: 'bg-blue-900/20',
        socialHover: 'hover:bg-blue-600', ctaHover: 'hover:bg-blue-500',
    },
    blue: {
        shell: 'bg-[#050505]/80 border-blue-500/30',
        dot: 'text-blue-500', dotHex: '#3b82f6', underline: 'bg-blue-500', glow: 'bg-blue-400/20',
        hamburgerHover: 'hover:text-blue-400', mobileDot: 'text-blue-500',
        mobileLinkHover: 'hover:text-blue-500', blob: 'bg-blue-900/20',
        socialHover: 'hover:bg-blue-600', ctaHover: 'hover:bg-blue-500',
    },
    emerald: {
        shell: 'bg-[#050505]/80 border-emerald-500/30',
        dot: 'text-emerald-500', dotHex: '#10b981', underline: 'bg-emerald-500', glow: 'bg-emerald-400/20',
        hamburgerHover: 'hover:text-emerald-400', mobileDot: 'text-emerald-500',
        mobileLinkHover: 'hover:text-emerald-500', blob: 'bg-emerald-900/20',
        socialHover: 'hover:bg-emerald-600', ctaHover: 'hover:bg-emerald-500',
    },
    rose: {
        shell: 'bg-[#050505]/80 border-rose-500/30',
        dot: 'text-rose-500', dotHex: '#f43f5e', underline: 'bg-rose-500', glow: 'bg-rose-400/20',
        hamburgerHover: 'hover:text-rose-400', mobileDot: 'text-rose-500',
        mobileLinkHover: 'hover:text-rose-500', blob: 'bg-rose-900/20',
        socialHover: 'hover:bg-rose-600', ctaHover: 'hover:bg-rose-500',
    },
    amber: {
        shell: 'bg-[#050505]/80 border-amber-500/30',
        dot: 'text-amber-500', dotHex: '#f59e0b', underline: 'bg-amber-500', glow: 'bg-amber-400/20',
        hamburgerHover: 'hover:text-amber-400', mobileDot: 'text-amber-500',
        mobileLinkHover: 'hover:text-amber-500', blob: 'bg-amber-900/20',
        socialHover: 'hover:bg-amber-600', ctaHover: 'hover:bg-amber-500',
    },
    sky: {
        shell: 'bg-[#050505]/80 border-sky-500/30',
        dot: 'text-sky-500', dotHex: '#0ea5e9', underline: 'bg-sky-500', glow: 'bg-sky-400/20',
        hamburgerHover: 'hover:text-sky-400', mobileDot: 'text-sky-500',
        mobileLinkHover: 'hover:text-sky-500', blob: 'bg-sky-900/20',
        socialHover: 'hover:bg-sky-600', ctaHover: 'hover:bg-sky-500',
    },
    orange: {
        shell: 'bg-[#050505]/80 border-orange-500/30',
        dot: 'text-orange-500', dotHex: '#f97316', underline: 'bg-orange-500', glow: 'bg-orange-400/20',
        hamburgerHover: 'hover:text-orange-400', mobileDot: 'text-orange-500',
        mobileLinkHover: 'hover:text-orange-500', blob: 'bg-orange-900/20',
        socialHover: 'hover:bg-orange-600', ctaHover: 'hover:bg-orange-500',
    },
}

// KOLEJNOŚĆ CHECKÓW WAŻNA (sklep matchuje też "sklep-internetowy")
const getNavbarTheme = (pathname: string | null): NavTheme => {
    if (!pathname) return NAV_THEMES.default
    if (pathname.includes('/strony-www/sklep')) return NAV_THEMES.amber
    if (pathname.includes('/strony-www/system-crm')) return NAV_THEMES.sky
    if (pathname.includes('/strony-www/strona-szyta-na-miare')) return NAV_THEMES.rose
    if (pathname.includes('/strony-www/one-page')) return NAV_THEMES.blue
    if (pathname.includes('/strony-www/strona-firmowa')) return NAV_THEMES.emerald
    if (pathname.includes('/automatyzacje-ai/chatboty-ai')) return NAV_THEMES.orange
    return NAV_THEMES.default
}
export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const pathname = usePathname()
    const router = useRouter()
    const lenis = useLenis()
    const isHome = pathname === '/'

    const lastScrollY = useRef(0)
    const scrollDownAccumulator = useRef(0)

    // 2. REJESTRACJA GSAP (Aby Navbar widział ScrollTrigger)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }, []);

    // --- FIX: PANCERNE SCROLLOWANIE W MENU ---
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.startsWith('#')) {
            setIsMobileMenuOpen(false)
            return
        }

        e.preventDefault()
        setIsMobileMenuOpen(false)

        if (isHome) {
            // Logika "Hunt & Kill" dla strony głównej
            const targetId = href.replace('#', '');
            const elem = document.getElementById(targetId);

            if (elem && lenis) {
                // A. Wymuś przeliczenie wysokości strony (kluczowe dla Pinned Sections)
                ScrollTrigger.refresh();

                lenis.scrollTo(elem, {
                    offset: -100, // Offset na header
                    duration: 1.5, // Czas trwania
                    lock: true,   // Zablokuj scrollowanie użytkownika podczas jazdy
                    force: true,  // Wymuś scroll
                    
                    // B. Jeszcze raz odśwież na starcie
                    onStart: () => ScrollTrigger.refresh(),
                    
                    // C. Sprawdź po dojechaniu, czy trafiliśmy (Auto-Korekta)
                    onComplete: () => {
                        ScrollTrigger.refresh(); // Ostatnie odświeżenie
                        const rect = elem.getBoundingClientRect();
                        
                        // Jeśli element jest dalej niż 50px od celu (czyli scroll zatrzymał się za wcześnie)
                        if (Math.abs(rect.top - 100) > 50) {
                            // console.log("Korekta scrolla z Navbara...");
                            lenis.scrollTo(elem, {
                                offset: -100,
                                duration: 0.5, // Szybka poprawka
                                immediate: false,
                                lock: true
                            });
                        }
                    }
                });
            }
        } else {
            // Jesteśmy na innej podstronie -> Przekierowanie z parametrem
            const targetId = href.replace('#', '')
            router.push(`/?target=${targetId}`)
        }
    }

    // --- LOGIKA UI ---
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setIsScrolled(currentScrollY > 20)

            const deltaY = currentScrollY - lastScrollY.current

            if (currentScrollY <= 0) {
                setIsVisible(true)
                scrollDownAccumulator.current = 0
            } else if (deltaY > 0) {
                scrollDownAccumulator.current += deltaY
                if (scrollDownAccumulator.current > 200) setIsVisible(false)
            } else if (deltaY < 0) {
                scrollDownAccumulator.current = 0
                setIsVisible(true)
            }
            lastScrollY.current = currentScrollY
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // --- BLOKADA SCROLLA ---
    // Lock html + body overflow + lenis.stop() - bez tego Lenis (syncTouch:true)
    // łapie touch events i pozwala na horizontal swipe za otwartym menu.
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
            lenis?.stop()
        } else {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            lenis?.start()
        }
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            lenis?.start()
        }
    }, [isMobileMenuOpen, lenis])

    // Pobieramy motyw (klasy) specyficzny dla podstrony
    const navTheme = getNavbarTheme(pathname);

    // FIX ANIMACJI: Używamy transition-all, aby zmiana z py-6 na py-4 animowała się płynnie
    const navbarClasses = cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b',
        isScrolled
            ? `${navTheme.shell} backdrop-blur-xl py-4 shadow-lg`
            : 'bg-transparent border-transparent py-6',
        isVisible && !isMobileMenuOpen ? 'translate-y-0' : !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
    )

    return (
        <>
            <nav className={navbarClasses}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* LOGO */}
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tighter text-white z-50 hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1 relative flex-shrink-0"
                        onClick={e => {
                            setIsMobileMenuOpen(false)
                            if (isHome) {
                                e.preventDefault()
                                lenis?.scrollTo(0, { duration: 1.5, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) })
                            }
                        }}>
                        AVENLY
                        <motion.span
                            initial={false}
                            animate={{ color: navTheme.dotHex }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className={navTheme.dot}
                        >
                            .
                        </motion.span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-10">
                        {NAV_LINKS.map(item => (
                            <a
                                key={item.title}
                                href={item.href}
                                onClick={e => handleLinkClick(e, item.href)}
                                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white cursor-pointer group whitespace-nowrap">
                                {item.title}
                                <span className={cn('absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10', navTheme.glow)}></span>
                                <span className={cn('absolute -bottom-1 left-1/2 w-0 h-[1px] group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300', navTheme.underline)}></span>
                            </a>
                        ))}

                        {/* PRZYCISK WYCENY */}
                        <a
                            href="#kontakt"
                            onClick={e => handleLinkClick(e, '#kontakt')}
                            className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)] whitespace-nowrap">
                            Darmowa Wycena
                        </a>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className={cn('lg:hidden text-white z-50 relative cursor-pointer transition-colors p-2 active:scale-90', navTheme.hamburgerHover)}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}>
                        <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-[5px]">
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                className="w-full h-[2px] bg-white block rounded-full origin-center transition-all"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-full h-[2px] bg-white block rounded-full transition-all"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                className="w-full h-[2px] bg-white block rounded-full origin-center transition-all"
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={menuVars}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 w-full h-[100dvh] bg-[#050505] z-40 origin-top overflow-y-auto"
                    >

                        <div className={cn('absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] blur-[100px] rounded-full pointer-events-none', navTheme.blob)} />

                        <div className="flex flex-col min-h-[100dvh] container mx-auto px-6 pb-48 pt-24 relative z-10">
                            
                            {/* LINKI */}
                            <motion.div
                                variants={containerVars}
                                initial="initial"
                                animate="open"
                                exit="initial"
                                className="flex flex-col gap-2 flex-1 justify-center">
                                {NAV_LINKS.map((link, index) => (
                                    <div key={index} className="overflow-hidden">
                                        <motion.div variants={mobileLinkVars}>
                                            <a
                                                href={link.href}
                                                onClick={e => handleLinkClick(e, link.href)}
                                                className={cn('text-5xl font-bold text-white tracking-tight transition-colors block py-2 cursor-pointer', navTheme.mobileLinkHover)}>
                                                {link.title}
                                                <span className={cn('text-6xl leading-none', navTheme.mobileDot)}>.</span>
                                            </a>
                                        </motion.div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* SOCIAL MEDIA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="border-t border-white/10 pt-8 mt-8 shrink-0">
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm uppercase tracking-widest">Social Media</span>
                                        <div className="flex gap-4">
                                            {SOCIAL_LINKS.map((item, i) => (
                                                <a
                                                    key={i}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={cn('p-2 bg-white/5 rounded-full transition-colors cursor-pointer', navTheme.socialHover)}
                                                >
                                                    <item.icon size={20} className="text-white" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <a href="#kontakt" onClick={e => handleLinkClick(e, '#kontakt')} className="w-full block">
                                        <button className={cn('w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95', navTheme.ctaHover)}>
                                            Darmowa Wycena
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}