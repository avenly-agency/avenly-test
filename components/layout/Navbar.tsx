'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = `
    fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-b
    ${isScrolled 
      ? 'bg-slate-950/70 backdrop-blur-xl border-slate-800/50 py-4 shadow-lg' 
      : 'bg-transparent border-transparent py-6'}
  `;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tighter text-white z-50 hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
          >
            AVENLY<span className="text-blue-500">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {['Oferta', 'Proces', 'Realizacje'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white cursor-pointer group"
              >
                {item}
                {/* EFEKT GLOW (Zamiast underline) */}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/20 blur-xl -z-10"></span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-blue-500 group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* CTA Button */}
            <button className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)]">
              Darmowa Wycena
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden text-white z-50 relative cursor-pointer hover:text-blue-400 transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-slate-950/90 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Oferta', 'Proces', 'Realizacje', 'Kontakt'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-slate-300 tracking-tight hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                {item}
              </Link>
            ))}
            
            <button className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl w-3/4 hover:bg-blue-500 transition-colors cursor-pointer active:scale-95 shadow-lg shadow-blue-900/20">
              Darmowa Wycena
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};