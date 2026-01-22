'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook, 
  FileCheck, 
  ArrowUpRight 
} from 'lucide-react';

// --- KONFIGURACJA LINKÓW ---
// Ważne: Kotwice zostawiamy z samym '#', strony z '/'
const footerLinks = {
  main: [
    { name: 'Oferta', href: '#oferta' },
    { name: 'Proces', href: '#proces' },
    { name: 'Realizacje', href: '/realizacje' }, // To jest osobna podstrona
    { name: 'Kontakt', href: '#kontakt' },       // To jest sekcja na stronie głównej
  ],
  legal: [
    { name: 'Polityka Prywatności', href: '/polityka-prywatnosci' },
    { name: 'Regulamin', href: '/regulamin' },
    { name: 'Cookies', href: '/cookies' },
  ],
  socials: [
    { 
      name: 'Facebook',
      icon: Facebook, 
      href: 'https://facebook.com', 
      color: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white' 
    },
    { 
      name: 'Instagram',
      icon: Instagram, 
      href: 'https://instagram.com', 
      color: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white' 
    },
    { 
      name: 'LinkedIn',
      icon: Linkedin, 
      href: 'https://linkedin.com', 
      color: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white' 
    },
    { 
      name: 'Useme',
      icon: FileCheck, 
      href: 'https://useme.com', 
      color: 'hover:bg-[#FFE000] hover:border-[#FFE000] hover:text-black' 
    },
  ]
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // --- LOGIKA OBSŁUGI NAWIGACJI (Ta sama co w Navbarze) ---
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const isHome = pathname === '/';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // 1. Jeśli to link zewnętrzny (http) lub zwykła podstrona (/blog), nic nie rób (niech działa domyślnie)
    if (!href.startsWith('#')) return;

    // 2. Jeśli to kotwica (#kontakt), przejmujemy kontrolę
    e.preventDefault();

    if (isHome) {
      // Jesteśmy na głównej -> Płynny scroll
      lenis?.scrollTo(href, { offset: -100, duration: 1.5 });
    } else {
      // Jesteśmy na podstronie -> Przekieruj z parametrem target
      const targetId = href.replace('#', '');
      router.push(`/?target=${targetId}`);
    }
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 overflow-hidden pt-20 pb-10">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* KOLUMNA 1: MARKA + MISJA */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-1">
              AVENLY<span className="text-blue-500">.</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Tworzymy cyfrową przyszłość dla ambitnych marek. 
              Design, Technologia, Automatyzacja. 
              Bez kompromisów.
            </p>
          </div>

          {/* KOLUMNA 2: NAVIGACJA (Z LOGIKĄ KLIKNIĘCIA) */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white font-bold mb-6">Menu</h4>
            <ul className="space-y-4">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  {/* Używamy zwykłego <a> lub Link z obsługą onClick */}
                  <Link 
                    href={link.href} 
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group w-fit cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLUMNA 3: LEGAL & INFO */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- STOPKA DOLNA (BOTTOM BAR) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-slate-500 text-sm gap-6">
            
            {/* LEWA STRONA: COPYRIGHT + SYSTEM STATUS */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <p>&copy; {currentYear} Avenly Agency.</p>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-slate-300">All Systems Operational</span>
                </div>
            </div>

            {/* PRAWA STRONA: SOCIAL MEDIA */}
            <div className="flex gap-3">
              {footerLinks.socials.map((social, idx) => (
                <Link 
                    key={idx} 
                    href={social.href}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 ${social.color} hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20`}
                >
                    <social.icon size={18} />
                </Link>
              ))}
            </div>

        </div>
      </div>

      {/* GIANT TYPOGRAPHY BACKGROUND */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden flex justify-center opacity-5">
        <motion.h1 
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[15vw] md:text-[20vw] font-bold text-white tracking-tighter leading-[0.8]"
        >
            AVENLY
        </motion.h1>
      </div>
    </footer>
  );
};