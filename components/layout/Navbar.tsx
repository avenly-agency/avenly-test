'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ArrowRight, Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLenis } from 'lenis/react'
import { cn } from '@/lib/utils'

// --- DANE NAWIGACJI ---
const NAV_LINKS = [
	{ title: 'Oferta', href: '#oferta' },
	{ title: 'Proces', href: '#proces' },
	{ title: 'Realizacje', href: '/realizacje' },
	{ title: 'Kontakt', href: '/kontakt' },
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

export const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const pathname = usePathname()
	const router = useRouter()
	const lenis = useLenis() // Hook do sterowania scrollem
	const isHome = pathname === '/'

	const lastScrollY = useRef(0)
	const scrollDownAccumulator = useRef(0)

	// --- HARDCORE FIX: NAWIGACJA ---
	// Ta funkcja decyduje, czy robimy scroll, czy przekierowanie
	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		// 1. Jeśli to link do podstrony (nie zaczyna się od #), pozwalamy działać normalnie
		if (!href.startsWith('#')) {
			setIsMobileMenuOpen(false)
			return
		}

		// 2. Jeśli to kotwica (#)
		e.preventDefault() // Blokujemy domyślny skok przeglądarki
		setIsMobileMenuOpen(false)

		if (isHome) {
			// SCENARIUSZ A: Jesteśmy na Home -> Płynny scroll Lenis
			// offset: -100 zapewnia, że sekcja nie chowa się pod navbarem
			lenis?.scrollTo(href, { offset: -100, duration: 1.5 })
		} else {
			// SCENARIUSZ B: Jesteśmy na podstronie -> Przekierowanie z PARAMETREM
			// Zamiast /#oferta robimy /?target=oferta
			// To zapobiega natychmiastowemu skokowi przeglądarki i pozwala SmoothScrolling.tsx przejąć kontrolę
			const targetId = href.replace('#', '')
			router.push(`/?target=${targetId}`)
		}
	}

	// --- LOGIKA UI (Scrollowanie - chowanie/pokazywanie navbaru) ---
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY
			setIsScrolled(currentScrollY > 20)

			const deltaY = currentScrollY - lastScrollY.current

			if (currentScrollY <= 0) {
				setIsVisible(true)
				scrollDownAccumulator.current = 0
			} else if (deltaY > 0) {
				// Scroll w dół
				scrollDownAccumulator.current += deltaY
				if (scrollDownAccumulator.current > 200) setIsVisible(false) // Szybsza reakcja (200px)
			} else if (deltaY < 0) {
				// Scroll w górę
				scrollDownAccumulator.current = 0
				setIsVisible(true)
			}
			lastScrollY.current = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// --- BLOKADA SCROLLA (MOBILE MENU) ---
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobileMenuOpen])

	const navbarClasses = cn(
		'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-b',
		isScrolled
			? 'bg-slate-950/80 backdrop-blur-xl border-slate-800/50 py-4 shadow-lg'
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
						className="text-xl font-bold tracking-tighter text-white z-50 hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1 relative"
						onClick={e => {
							setIsMobileMenuOpen(false) // Zawsze zamykamy menu mobilne
							if (isHome) {
								e.preventDefault() // Jeśli jesteśmy na Home, blokujemy przeładowanie
								lenis?.scrollTo(0, { duration: 1.5, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) }) // Płynny scroll na górę (piksel 0)
							}
							// Jeśli jesteśmy na podstronie, Link zadziała normalnie i przeniesie na "/"
						}}>
						AVENLY<span className="text-blue-500">.</span>
					</Link>

					{/* DESKTOP MENU */}
					<div className="hidden md:flex items-center gap-10">
						{NAV_LINKS.map(item => (
							<a
								key={item.title}
								href={item.href}
								onClick={e => handleLinkClick(e, item.href)}
								className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white cursor-pointer group">
								{item.title}
								<span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/20 blur-xl -z-10"></span>
								<span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-blue-500 group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
							</a>
						))}

						{/* PRZYCISK WYCENY */}
						<a
							href="#kontakt"
							onClick={e => handleLinkClick(e, '#kontakt')}
							className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)]">
							Darmowa Wycena
						</a>
					</div>

					{/* MOBILE HAMBURGER */}
					<button
						className="md:hidden text-white z-50 relative cursor-pointer hover:text-blue-400 transition-colors p-2 active:scale-90"
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
						className="fixed inset-0 w-full h-[100dvh] bg-[#050505] z-40 origin-top flex flex-col justify-between">
						{/* TŁO AMBIENT */}
						<div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

						<div className="flex flex-col h-full container mx-auto px-6 pb-10 pt-32 relative z-10">
							{/* LINKI */}
							<motion.div
								variants={containerVars}
								initial="initial"
								animate="open"
								exit="initial"
								className="flex flex-col gap-4 flex-1 justify-center">
								{NAV_LINKS.map((link, index) => (
									<div key={index} className="overflow-hidden">
										<motion.div variants={mobileLinkVars}>
											<a
												href={link.href}
												onClick={e => handleLinkClick(e, link.href)}
												className="text-5xl font-bold text-white tracking-tight hover:text-blue-500 transition-colors block py-2 cursor-pointer">
												{link.title}
												<span className="text-blue-500 text-6xl leading-[0]">.</span>
											</a>
										</motion.div>
									</div>
								))}
							</motion.div>

							{/* FOOTER W MENU */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
								exit={{ opacity: 0, transition: { duration: 0.2 } }}
								className="border-t border-white/10 pt-8 mt-8">
								<div className="flex flex-col gap-6">
									<div className="flex justify-between items-center">
										<span className="text-slate-400 text-sm uppercase tracking-widest">Social Media</span>
										<div className="flex gap-4">
											<div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
												<Github size={20} className="text-white" />
											</div>
											<div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
												<Twitter size={20} className="text-white" />
											</div>
											<div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
												<Linkedin size={20} className="text-white" />
											</div>
										</div>
									</div>

									<a href="#kontakt" onClick={e => handleLinkClick(e, '#kontakt')} className="w-full block">
										<button className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95">
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
