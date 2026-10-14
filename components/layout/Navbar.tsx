'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback, type ReactNode, type RefObject } from 'react'
import { motion, AnimatePresence, usePresence, Variants } from 'framer-motion'
import { ArrowRight, Github, Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLenis } from 'lenis/react'
import { cn } from '@/lib/utils'
import { AvenlyLogo } from '@/components/ui/AvenlyLogo'
import { LOGO_BOX, LOGO_STAR_CENTER } from '@/lib/brand/logo'
import { localeFromPathname, localizeHref, switchLocalePath, type Locale } from '@/lib/i18n/locale'
// 1. DODANO IMPORTY GSAP
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// --- DANE NAWIGACJI (per locale; EN bez Bloga - blog jest PL-only w v1) ---
const NAV_DATA: Record<Locale, { links: { title: string; href: string }[]; cta: string; menuOpen: string; menuClose: string }> = {
    pl: {
        links: [
            { title: 'Usługi', href: '/uslugi' },
            { title: 'Proces', href: '#proces' },
            { title: 'O nas', href: '/o-nas' },
            { title: 'Realizacje', href: '/realizacje' },
            { title: 'Blog', href: '/blog' },
            { title: 'Kontakt', href: '/kontakt' },
        ],
        cta: 'Darmowa Wycena',
        menuOpen: 'Otwórz menu',
        menuClose: 'Zamknij menu',
    },
    en: {
        links: [
            { title: 'Services', href: '/uslugi' },
            { title: 'Process', href: '#proces' },
            { title: 'About us', href: '/o-nas' },
            { title: 'Work', href: '/realizacje' },
            { title: 'Contact', href: '/kontakt' },
        ],
        cta: 'Free quote',
        menuOpen: 'Open menu',
        menuClose: 'Close menu',
    },
}

// --- SOCIAL MEDIA LINKI ---
const SOCIAL_LINKS = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61581862509345' },
    { icon: Instagram, href: 'https://www.instagram.com/avenly.pl/' },
    { icon: Github, href: 'https://github.com/avenly-agency' },
]

// --- MENU MOBILNE: OTWARCIE PRZEZ GWIAZDĘ Z LOGO (2026-10-13) ---
// Właściciel po przejściu „Portal” na /o-nas: „portal zajebisty, gdzie można jeszcze ten efekt użyć zmiany
// z gwiazdami?” i polecenie „wykonaj”. Menu nie rozwija się już z góry (dawne scaleY): gwiazda z logo w nawigacji
// rośnie, aż zakryje cały ekran (z cienką krawędzią w kolorze podstrony); treść menu pojawia się, gdy gwiazda
// zakrywa ekran. Zamknięcie = to samo wstecz (gwiazda zwija się do gwiazdy logo).
// WYDAJNOŚĆ - trzecia wersja (właściciel: „menu na telefonie laguje strasznie”, potem „dalej laguje przy
// pojawianiu się”): (1) clip-path pisany co klatkę przemalowywał całe menu; (2) gwiazda na płótnie 2D była tania,
// ale rysowana w klatce głównego wątku - a ten przy otwieraniu jest zajęty (montaż menu, układ strony po blokadzie
// przewijania, animacje linków), więc gubiła klatki. Teraz ruch robi KOMPOZYTOR: gwiazda to osiem warstw w jednym
// kolorze (romby = obrócone kwadraty), skalowanych animacją Web Animations na samym transform - bez JS w klatce,
// bez rastrowania (jednolity kolor jest ostry w każdej skali), niezależnie od obciążenia głównego wątku. Treść menu
// zmienia tylko krycie (też na kompozytorze). Skala rośnie wykładniczo (klatki kluczowe próbkują krzywą).
// Ograniczony ruch: menu pojawia się i znika od razu.
const MENU_OPEN_MS = 620
const MENU_CLOSE_MS = 460
/** Zamykanie zaczyna się po krótkim zjeździe linków (ich wyjście: containerVars / mobileLinkVars). */
const MENU_CLOSE_WAIT = 240
/** Wcięcie gwiazdy leży 7,884 jedn. od jej środka - gwiazda zakrywa ekran, gdy wcięcia wyjdą poza najdalszy róg. */
const MENU_WAIST = 7.884
/** Tło menu (to samo co tło strony). */
const MENU_BG = '#050505'
/** Gwiazda logo (promień 20 jedn.) złożona z rombów: półprzekątne [pozioma, pionowa]. Dwa smukłe i dwa szersze
    dają ramiona z wcięciem jak krzywa gwiazdy logo (łamana przez jej punkty: czubek, (11,5; 1,86), wcięcie
    (5,575; 5,575)). */
const MENU_RHOMBI: [number, number][] = [[20, 4.376], [4.376, 20], [14.47, 9.07], [9.07, 14.47]]
/** O ile (w jednostkach skali) romby krawędzi są większe od rombów gwiazdy - krawędź ok. 1,5 px. */
const MENU_RIM = [0.35, 0.35, 0.195, 0.195]
/** Bok kwadratu, z którego powstaje romb, i jego półprzekątna po obrocie o 45°. */
const MENU_BOX = 100
const MENU_HALF = MENU_BOX / Math.SQRT2
/** Liczba klatek kluczowych krzywej wzrostu (między nimi przeglądarka liczy liniowo). */
const MENU_STEPS = 28

type MenuGeo = { cx: number; cy: number; s0: number; full: number; w: number; h: number }
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function MobileMenuShell({ logoRef, accent, children }: {
    logoRef: RefObject<HTMLAnchorElement | null>
    /** Kolor krawędzi gwiazdy (kolor podstrony jako hex). */
    accent: string
    children: ReactNode
}) {
    const [isPresent, safeToRemove] = usePresence()
    const shell = useRef<HTMLDivElement>(null)
    const stage = useRef<HTMLDivElement>(null)
    const geo = useRef<MenuGeo | null>(null)
    const anims = useRef<Animation[]>([])
    const removeRef = useRef(safeToRemove)
    useEffect(() => { removeRef.current = safeToRemove }, [safeToRemove])

    // Środek i wielkość gwiazdy w logo nawigacji (stąd rośnie gwiazda menu) + skala, przy której zakrywa ekran.
    const measure = useCallback((): MenuGeo => {
        const st = stage.current
        const w = st?.clientWidth || window.innerWidth, h = st?.clientHeight || window.innerHeight
        let cx = w * 0.3, cy = 36, s0 = 0.16
        const r = logoRef.current?.querySelector('svg')?.getBoundingClientRect()
        if (r && r.width > 0 && r.height > 0) {
            s0 = Math.min(r.width / LOGO_BOX.w, r.height / LOGO_BOX.h)
            cx = r.left + (r.width - LOGO_BOX.w * s0) / 2 + (LOGO_STAR_CENTER.x - LOGO_BOX.x) * s0
            cy = r.top + (r.height - LOGO_BOX.h * s0) / 2 + (LOGO_STAR_CENTER.y - LOGO_BOX.y) * s0
        }
        const far = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy))
        return { cx, cy, s0, full: Math.max(s0 * 2, (far * 1.08) / MENU_WAIST), w, h }
    }, [logoRef])

    /** Tworzy animacje gwiazdy i krycia menu (zatrzymane na początku albo na końcu). Oś czasu = otwieranie;
        zamykanie odtwarza ją wstecz. */
    const build = useCallback((atEnd: boolean) => {
        const st = stage.current, el = shell.current
        if (!st || !el) return
        anims.current.forEach((a) => a.cancel())
        const g = (geo.current = measure())
        const at = 'translate(' + g.cx.toFixed(1) + 'px, ' + g.cy.toFixed(1) + 'px)'
        const list: Animation[] = []
        Array.from(st.children).forEach((part, i) => {
            const [a, b] = MENU_RHOMBI[i % 4]
            const extra = i < 4 ? MENU_RIM[i % 4] : 0 // pierwsze cztery warstwy = krawędź (pod gwiazdą)
            const frames: Keyframe[] = []
            for (let j = 0; j <= MENU_STEPS; j++) {
                // szybko przez etap małej gwiazdy, miękko na końcu (domknięcie rogów ekranu)
                const v = 1 - Math.pow(1 - j / MENU_STEPS, 1.6)
                const s = g.s0 * Math.pow(g.full / g.s0, v) + extra * Math.min(1, v * 8)
                frames.push({
                    transform: at + ' scale(' + ((a * s) / MENU_HALF).toFixed(4) + ', ' + ((b * s) / MENU_HALF).toFixed(4) + ') rotate(45deg)',
                })
            }
            list.push(part.animate(frames, { duration: MENU_OPEN_MS, fill: 'both', easing: 'linear' }))
        })
        // treść menu pokazuje się dopiero, gdy gwiazda zakrywa ekran (nic nie wisi nad stroną poza gwiazdą)
        list.push(el.animate([{ opacity: 0 }, { opacity: 0, offset: 0.62 }, { opacity: 1 }], { duration: MENU_OPEN_MS, fill: 'both', easing: 'linear' }))
        list.forEach((an) => { an.pause(); an.currentTime = atEnd ? MENU_OPEN_MS : 0 })
        anims.current = list
    }, [measure])

    // Stan startowy przed pierwszym malowaniem (menu nie mignie w całości): gwiazda wielkości gwiazdy logo, treść ukryta.
    useLayoutEffect(() => {
        const st = stage.current
        if (reduced()) { if (st) st.style.visibility = 'hidden'; return }
        build(false)
        return () => { anims.current.forEach((a) => a.cancel()); anims.current = [] }
    }, [build])

    useEffect(() => {
        const el = shell.current, st = stage.current
        if (!el || !st) return
        // po zakryciu ekranu menu ma własne tło, a warstwy gwiazdy znikają; w ruchu tłem menu jest gwiazda
        const settle = () => { el.style.backgroundColor = MENU_BG; st.style.visibility = 'hidden' }
        const unsettle = () => { el.style.backgroundColor = 'transparent'; st.style.visibility = 'visible' }
        if (reduced()) {
            if (isPresent) settle(); else removeRef.current?.()
            return
        }
        let timer = 0
        const run = (rate: number, done: () => void) => {
            unsettle()
            const lead = anims.current[0]
            if (!lead) { done(); return }
            lead.onfinish = done
            anims.current.forEach((an) => { an.updatePlaybackRate(rate); an.play() })
        }
        if (isPresent) {
            if (!anims.current.length) build(false)
            el.style.pointerEvents = ''
            // ponowne otwarcie, zanim gwiazda zaczęła się zwijać: menu już stoi - bez odtwarzania od początku
            if (Number(anims.current[0]?.currentTime ?? 0) >= MENU_OPEN_MS - 1) settle()
            else run(1, settle)
        } else {
            el.style.pointerEvents = 'none' // zamykane menu nie łapie już dotyku
            timer = window.setTimeout(() => {
                // ekran mógł się zmienić, gdy menu było otwarte (obrót telefonu) - gwiazda zwija się w aktualne logo
                const g = geo.current, n = measure()
                if (!g || Math.abs(g.w - n.w) > 1 || Math.abs(g.h - n.h) > 1 || Math.abs(g.cx - n.cx) > 1 || Math.abs(g.cy - n.cy) > 1) build(true)
                const lead = anims.current[0]
                // zamknięcie w tej samej chwili co otwarcie (oś czasu jeszcze na zerze) - nie ma czego zwijać
                if (!lead || Number(lead.currentTime ?? 0) < 1) { removeRef.current?.(); return }
                run(-MENU_OPEN_MS / MENU_CLOSE_MS, () => removeRef.current?.())
            }, MENU_CLOSE_WAIT)
        }
        return () => window.clearTimeout(timer)
    }, [isPresent, build, measure])

    return (
        <>
            {/* gwiazda: cztery romby krawędzi (kolor podstrony) i na nich cztery romby w kolorze tła menu */}
            <div ref={stage} className="fixed inset-0 z-40 overflow-hidden pointer-events-none" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                        key={i}
                        className="absolute left-0 top-0 will-change-transform"
                        style={{ width: MENU_BOX, height: MENU_BOX, margin: -MENU_BOX / 2, backgroundColor: i < 4 ? accent : MENU_BG }}
                    />
                ))}
            </div>
            {/* bez przewijania w bok; w pionie tylko gdy treść naprawdę się nie mieści (bardzo niski ekran) -
                rozmiary linków liczą się z wysokości ekranu, żeby menu mieściło się w całości */}
            <div ref={shell} className="fixed inset-0 w-full h-[100dvh] z-40 overflow-x-hidden overflow-y-auto overscroll-contain touch-pan-y">
                {children}
            </div>
        </>
    )
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
    dot: string            // linia z gwiazdą w logo (kolor podstrony; przejście koloru w CSS)
    dotHex: string         // ten sam kolor jako hex (krawędź gwiazdy przy otwieraniu menu mobilnego i poświata w jego tle)
    underline: string      // podkreślenie linku (hover)
    glow: string           // halo blur pod linkiem (hover)
    hamburgerHover: string // hover ikony hamburgera (mobile)
    mobileDot: string      // kropka przy linkach w menu mobile
    mobileLinkHover: string// hover tekstu linku (mobile)
    blob: string           // dawny rozmyty blob w tle menu mobile (od 2026-10-13 poświata to gradient z dotHex - pole nieużywane)
    socialHover: string    // hover ikon social (mobile)
    ctaHover: string       // hover przycisku "Darmowa Wycena" (mobile)
}

const NAV_THEMES: Record<string, NavTheme> = {
    default: {
        // Neutralne tło jak na podstronach (slate-950 dawał granatowy pas nad sekcjami w kolorach realizacji)
        shell: 'bg-[#050505]/80 border-white/[0.06]',
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
    if (pathname.includes('/strony-www/sklep') || pathname.includes('/websites/online-store')) return NAV_THEMES.amber
    if (pathname.includes('/strony-www/system-crm') || pathname.includes('/websites/crm-system')) return NAV_THEMES.sky
    if (pathname.includes('/strony-www/strona-szyta-na-miare') || pathname.includes('/websites/custom-website')) return NAV_THEMES.rose
    if (pathname.includes('/strony-www/one-page') || pathname.includes('/websites/one-page')) return NAV_THEMES.blue
    if (pathname.includes('/strony-www/strona-firmowa') || pathname.includes('/websites/company-website')) return NAV_THEMES.emerald
    if (pathname.includes('/automatyzacje-ai/chatboty-ai') || pathname.includes('/ai-automation/ai-chatbots')) return NAV_THEMES.orange
    return NAV_THEMES.default
}
export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    // Menu mobilne jest na ekranie - od otwarcia do końca zamykania (dłużej niż isMobileMenuOpen: obejmuje animację
    // wyjścia). W tym czasie pasek nawigacji nie ma własnego tła ani rozmycia - patrz navbarClasses.
    const [menuOnScreen, setMenuOnScreen] = useState(false)

    const pathname = usePathname()
    const router = useRouter()
    const lenis = useLenis()
    const locale = localeFromPathname(pathname)
    const nav = NAV_DATA[locale]
    const homeHref = locale === 'en' ? '/en/' : '/'
    const isHome = pathname === '/' || pathname === '/en'

    const lastScrollY = useRef(0)
    const scrollDownAccumulator = useRef(0)
    // Logo w nawigacji: z jego gwiazdy rośnie okno menu mobilnego (MobileMenuShell).
    const logoRef = useRef<HTMLAnchorElement>(null)

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
            // Jesteśmy na innej podstronie -> Przekierowanie z parametrem (homepage danego języka)
            const targetId = href.replace('#', '')
            router.push(`${homeHref}?target=${targetId}`)
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
    // Menu mobilne na ekranie (2026-10-13, właściciel: menu „działa dobrze, jak jest pierwszy ekran bez ruszenia, ale
    // jak już jest ruszony i pojawia się nawigacja przylepiona, to już jest lipa”): po przewinięciu pasek ma ciemne tło
    // z rozmyciem - gwiazda menu rosła POD nim, więc pasek ucinał ją prostą krawędzią i rozmywał, a rozmycie tła paska
    // liczyło się od nowa w każdej klatce animacji. Dopóki menu jest na ekranie, pasek jest więc goły (bez tła, linii,
    // cienia i rozmycia) - tak jak na górze strony; rozmycie znika od razu (nie jest na liście przejść), tło gaśnie
    // w 0,2 s. Odstępy paska zostają, więc logo i przycisk nie drgną. Po zamknięciu pasek wraca jak dotąd.
    const menuUp = isMobileMenuOpen || menuOnScreen
    const navbarClasses = cn(
        'fixed top-0 left-0 w-full z-50 border-b',
        menuUp
            ? cn('bg-transparent border-transparent shadow-none transition-[background-color,border-color,box-shadow,padding,translate] duration-200 ease-out', isScrolled ? 'py-4' : 'py-6')
            : cn('transition-all duration-500 ease-in-out', isScrolled
                ? `${navTheme.shell} backdrop-blur-xl py-4 shadow-lg`
                : 'bg-transparent border-transparent py-6'),
        isVisible && !isMobileMenuOpen ? 'translate-y-0' : !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
    )

    return (
        <>
            <nav className={navbarClasses}>
                <div className="container mx-auto px-6 flex items-center justify-between relative">
                    {/* LOGO (od 2026-10-09 nowe logo „cięcie”: AVENLY przecięte linią z gwiazdą). Linia z gwiazdą
                        w kolorze podstrony, płynne przejście koloru przy zmianie podstrony (CSS, jak dawna kropka). */}
                    <Link
                        ref={logoRef}
                        href={homeHref}
                        className="text-white z-50 hover:opacity-80 transition-opacity cursor-pointer flex items-center relative flex-shrink-0 py-1"
                        onClick={e => {
                            setIsMobileMenuOpen(false)
                            if (isHome) {
                                e.preventDefault()
                                lenis?.scrollTo(0, { duration: 1.5, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) })
                            }
                        }}>
                        <span className="sr-only">Avenly</span>
                        <AvenlyLogo
                            className="block h-[16px] w-[101px] lg:h-[18px] lg:w-[114px]"
                            accentClassName={cn(navTheme.dot, 'transition-colors duration-[600ms] ease-in-out')}
                        />
                    </Link>

                    {/* DESKTOP MENU - linki DOKŁADNIE w osi strony (absolute + translate; kontener jest
                        wyśrodkowany, więc 50% kontenera = 50% strony), niezależnie od szerokości logo/CTA */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-10 absolute left-1/2 -translate-x-1/2">
                        {nav.links.map(item => {
                            const href = localizeHref(item.href, locale)
                            return (
                            <a
                                key={item.title}
                                href={href}
                                onClick={e => handleLinkClick(e, href)}
                                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white cursor-pointer group whitespace-nowrap">
                                {item.title}
                                <span className={cn('absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10', navTheme.glow)}></span>
                                <span className={cn('absolute -bottom-1 left-1/2 w-0 h-[1px] group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300', navTheme.underline)}></span>
                            </a>
                            )
                        })}

                    </div>

                    {/* PRAWA STRONA (desktop): język obok przycisku */}
                    <div className="hidden lg:flex items-center gap-5">
                        {/* TOGGLE JĘZYKA - pełny reload (nawigacja między root layoutami pl/en) */}
                        <a
                            href={switchLocalePath(pathname)}
                            aria-label={locale === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
                            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap tracking-wide">
                            {locale === 'pl' ? 'EN' : 'PL'}
                        </a>

                        {/* PRZYCISK WYCENY - prosto na /kontakt (formularz); dawna sekcja CTA #kontakt na stronie głównej usunięta 2026-09-27 */}
                        <Link
                            href={localizeHref('/kontakt', locale)}
                            onClick={e => handleLinkClick(e, '/kontakt')}
                            className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)] whitespace-nowrap">
                            {nav.cta}
                        </Link>
                    </div>

                    {/* MOBILE: język obok hamburgera (jak na desktopie - obok przycisku) */}
                    <div className="lg:hidden flex items-center gap-2 z-50 relative">
                    <a
                        href={switchLocalePath(pathname)}
                        aria-label={locale === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
                        className="text-[11px] font-semibold tracking-[0.14em] text-slate-300 px-3 py-2 rounded-full border border-white/15 bg-white/[0.03] hover:border-white/40 hover:text-white transition-colors cursor-pointer">
                        {locale === 'pl' ? 'EN' : 'PL'}
                    </a>
                    <button
                        className={cn('text-white cursor-pointer transition-colors p-2 active:scale-90', navTheme.hamburgerHover)}
                        onClick={() => {
                            if (!isMobileMenuOpen) setMenuOnScreen(true)
                            setIsMobileMenuOpen(!isMobileMenuOpen)
                        }}
                        aria-label={isMobileMenuOpen ? nav.menuClose : nav.menuOpen}>
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
                </div>
            </nav>

            {/* MOBILE MENU */}
            <AnimatePresence onExitComplete={() => setMenuOnScreen(false)}>
                {isMobileMenuOpen && (
                    <MobileMenuShell key="mobile-menu" logoRef={logoRef} accent={navTheme.dotHex}>

                        {/* Poświata w rogu menu: gradient zamiast koła z rozmyciem 100 px (filtr blur na dużej warstwie
                            kosztował na telefonie przy każdej klatce pojawiania się menu); ten sam środek i zasięg. */}
                        <div
                            className="absolute rounded-full pointer-events-none w-[180vw] h-[180vw] top-[calc(-20%-50vw)] right-[calc(-20%-50vw)]"
                            style={{ background: `radial-gradient(closest-side, ${navTheme.dotHex}12, ${navTheme.dotHex}09 45%, transparent)` }}
                        />

                        {/* Menu mieści się na ekranie bez przewijania (2026-10-13 - właściciel: „mogę menu scrollować w bok
                            i do dołu”): dawne pb-48 i linki 48 px z kropką 60 px dawały treść wyższą od ekranu. Linki mają
                            teraz wielkość z wysokości ekranu (pełne 48 px od ok. 840 px wysokości), kropka nie podbija linii. */}
                        <div className="flex flex-col min-h-[100dvh] container mx-auto px-6 pb-6 pt-24 relative z-10">
                            
                            {/* LINKI */}
                            <motion.div
                                variants={containerVars}
                                initial="initial"
                                animate="open"
                                exit="initial"
                                className="flex flex-col gap-1.5 flex-1 justify-center">
                                {nav.links.map((link, index) => {
                                    const href = localizeHref(link.href, locale)
                                    return (
                                    <div key={index} className="overflow-hidden">
                                        <motion.div variants={mobileLinkVars}>
                                            <a
                                                href={href}
                                                onClick={e => handleLinkClick(e, href)}
                                                className={cn('text-[length:clamp(1.875rem,5.1vh,3rem)] supports-[height:1svh]:text-[length:clamp(1.875rem,5.7svh,3rem)] leading-[1.05] font-bold text-white tracking-tight transition-colors block py-1.5 cursor-pointer', navTheme.mobileLinkHover)}>
                                                {link.title}
                                                <span className={cn('text-[1.25em] leading-[0]', navTheme.mobileDot)}>.</span>
                                            </a>
                                        </motion.div>
                                    </div>
                                    )
                                })}
                            </motion.div>

                            {/* SOCIAL MEDIA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="border-t border-white/10 pt-5 mt-5 shrink-0">
                                <div className="flex flex-col gap-4">
                                    {/* TOGGLE JĘZYKA (mobile) */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm uppercase tracking-widest">{locale === 'pl' ? 'Język' : 'Language'}</span>
                                        <a
                                            href={switchLocalePath(pathname)}
                                            aria-label={locale === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
                                            className="px-4 py-2 bg-white/5 rounded-full text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors cursor-pointer">
                                            {locale === 'pl' ? 'English' : 'Polski'}
                                        </a>
                                    </div>
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

                                    <Link href={localizeHref('/kontakt', locale)} onClick={e => handleLinkClick(e, '/kontakt')} className="w-full block">
                                        <button className={cn('w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95', navTheme.ctaHover)}>
                                            {nav.cta}
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </MobileMenuShell>
                )}
            </AnimatePresence>
        </>
    )
}