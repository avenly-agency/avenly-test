'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { 
  Github, 
  Twitter, 
  Instagram, 
  Facebook, 
  FileCheck, 
  ArrowUpRight 
} from 'lucide-react';

// --- KONFIGURACJA LINKÓW ---
const footerLinks = {
  main: [
    { name: 'Usługi', href: '#uslugi' },
    { name: 'Proces', href: '#proces' },
    { name: 'Realizacje', href: '/realizacje' },
    { name: 'Kontakt', href: '#kontakt' },
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
      href: 'https://www.facebook.com/profile.php?id=61581862509345', 
      color: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white' 
    },
    { 
      name: 'Instagram',
      icon: Instagram, 
      href: 'https://www.instagram.com/avenly.pl/', 
      color: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white' 
    },
    { 
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/avenly-agency', 
      color: 'hover:bg-[#333] hover:border-[#333] hover:text-white'
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
  
  // --- LOGIKA OBSŁUGI NAWIGACJI ---
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const isHome = pathname === '/';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();

    if (isHome) {
      lenis?.scrollTo(href, { offset: -100, duration: 1.5 });
    } else {
      const targetId = href.replace('#', '');
      router.push(`/?target=${targetId}`);
    }
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 overflow-hidden pt-20 pb-10">
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-12 mb-20">
          
          {/* KOLUMNA 1: MARKA */}
          <div className="col-span-2 md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-1">
              AVENLY<span className="text-blue-500">.</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Twój partner w cyfrowym świecie. 
              Przekuwamy Twoje cele w skuteczne działania w internecie. 
              Strategia, kreacja i technologia w jednym miejscu.
            </p>
          </div>

          {/* KOLUMNA 2: MENU */}
          <div className="col-span-1 md:col-span-3 md:col-start-7">
            <h4 className="text-white font-bold mb-6">Menu</h4>
            <ul className="space-y-4">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    onClick={(e) => handleLinkClick(e, link.href)}
                    // ZMIANA: gap-0 na mobile, gap-2 na desktop
                    className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-0 md:gap-2 group w-fit cursor-pointer text-sm"
                  >
                    {/* ZMIANA: hidden md:block - kropka znika na mobile */}
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLUMNA 3: LEGAL */}
          <div className="col-span-1 md:col-span-3">
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
            
            {/* LEWA STRONA */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <p>&copy; {currentYear} Avenly.</p>
                

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

      {/* TŁO TYPOGRAFICZNE */}
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