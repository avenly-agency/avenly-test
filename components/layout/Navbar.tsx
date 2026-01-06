'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { title: "Oferta", href: "#oferta" },
  { title: "Proces", href: "#proces" },
  { title: "Realizacje", href: "#realizacje" },
  { title: "Kontakt", href: "#kontakt" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prosta obsługa scrolla - tylko zmiana tła
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blokada scrollowania body
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-[#050505]/80 backdrop-blur-xl border-slate-800/50 py-4" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tighter text-white z-50 hover:opacity-80 transition-opacity relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AVENLY<span className="text-blue-500">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.title} 
                href={item.href} 
                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-white group"
              >
                {item.title}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/20 blur-xl -z-10"></span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-blue-500 group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
              </Link>
            ))}
            
            <button className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all duration-300 active:scale-95 shadow-lg shadow-white/10">
              Darmowa Wycena
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden text-white z-50 relative p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU - METODA INLINE (BEZPIECZNA) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 w-full h-[100dvh] bg-[#050505] z-40 flex flex-col justify-between"
          >
            {/* TŁO AMBIENT */}
            <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col h-full container mx-auto px-6 pb-10 pt-32 relative z-10">
              
              {/* LINKI */}
              <div className="flex flex-col gap-6 flex-1 justify-center">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    // Liczymy delay w locie - to jest super bezpieczne
                    transition={{ delay: 0.1 + (index * 0.1), duration: 0.4, ease: "easeOut" }}
                  >
                    <Link 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-5xl font-bold text-white tracking-tight hover:text-blue-500 transition-colors block py-2"
                    >
                        {link.title}
                        <span className="text-blue-500 text-6xl leading-[0]">.</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* FOOTER */}
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
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
                      
                      <button className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
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