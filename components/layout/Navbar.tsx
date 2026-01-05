'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// DEFINICJA LINKÓW
const navLinks = [
  { title: "Oferta", href: "#oferta" },
  { title: "Proces", href: "#proces" },
  { title: "Realizacje", href: "#realizacje" },
  { title: "Kontakt", href: "#kontakt" },
];

// WARIANTY ANIMACJI
// FIX: Dodano 'as const' do wszystkich tablic ease - to naprawia błąd builda
const menuVars: Variants = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.12, 0, 0.39, 0] as const, // <--- TUTAJ FIX
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const, // <--- TUTAJ FIX
    },
  },
};

const containerVars: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
};

const mobileLinkVars: Variants = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1] as const, // <--- TUTAJ FIX
    },
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1] as const, // <--- TUTAJ FIX
      duration: 0.7,
    },
  },
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const scrollDownAccumulator = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);

      const deltaY = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 0) {
        setIsVisible(true);
        scrollDownAccumulator.current = 0;
      } 
      else if (deltaY > 0) {
        // Scroll w dół
        scrollDownAccumulator.current += deltaY;
        if (scrollDownAccumulator.current > 400) { 
          setIsVisible(false);
        }
      } 
      else if (deltaY < 0) {
        // Scroll w górę
        scrollDownAccumulator.current = 0;
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blokada scrollowania body gdy menu jest otwarte
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navbarClasses = cn(
    "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-b",
    isScrolled 
      ? 'bg-slate-950/70 backdrop-blur-xl border-slate-800/50 py-4 shadow-lg'
      : 'bg-transparent border-transparent py-6',
    isVisible && !isMobileMenuOpen 
      ? 'translate-y-0' 
      : !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
  );

  return (
    <>
      <nav className={navbarClasses}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tighter text-white z-50 hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1 relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AVENLY<span className="text-blue-500">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link 
                key={item.title} 
                href={item.href} 
                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white cursor-pointer group"
              >
                {item.title}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/20 blur-xl -z-10"></span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-blue-500 group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
              </Link>
            ))}
            
            <button className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)]">
              Darmowa Wycena
            </button>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            className="md:hidden text-white z-50 relative cursor-pointer hover:text-blue-400 transition-colors p-2 active:scale-90"
            aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu nawigacji"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
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

      {/* --- FANCY MOBILE MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 w-full h-screen bg-[#050505] z-40 origin-top flex flex-col justify-between"
          >
            {/* TŁO AMBIENT */}
            <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col h-full container mx-auto px-6 pb-10 pt-32">
              
              {/* LINKI */}
              <motion.div 
                variants={containerVars}
                initial="initial"
                animate="open"
                exit="initial"
                className="flex flex-col gap-4 flex-1 justify-center"
              >
                {navLinks.map((link, index) => (
                  <div key={index} className="overflow-hidden">
                    <motion.div variants={mobileLinkVars}>
                        <Link 
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-5xl font-bold text-white tracking-tight hover:text-blue-500 transition-colors block py-2"
                        >
                            {link.title}
                            <span className="text-blue-500 text-6xl leading-[0]">.</span>
                        </Link>
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* FOOTER W MENU */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                 exit={{ opacity: 0, transition: { duration: 0.2 } }}
                 className="border-t border-white/10 pt-8 mt-8"
              >
                  <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm uppercase tracking-widest">Social Media</span>
                          <div className="flex gap-4">
                             <div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"><Github size={20} className="text-white"/></div>
                             <div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"><Twitter size={20} className="text-white"/></div>
                             <div className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"><Linkedin size={20} className="text-white"/></div>
                          </div>
                      </div>
                      
                      <button className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95">
                          Darmowa Wycena
                          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};