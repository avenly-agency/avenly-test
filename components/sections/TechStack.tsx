'use client';

import { Zap, ShieldCheck, Smartphone, Gauge, Server, Bot, Cloud } from 'lucide-react';

const metrics = [
  { text: "Błyskawiczne Ładowanie", icon: Zap }, // ZMIANA: Bardziej ogólne
  { text: "Konsultant AI", icon: Bot },          // ZMIANA: Bardziej "premium" nazwa
  { text: "Cloudflare Security", icon: Cloud },  // ZMIANA: Dodano Cloudflare
  { text: "PageSpeed SEO 100", icon: Gauge },
  { text: "Mobile First Design", icon: Smartphone },
  { text: "Bezpieczeństwo SSL", icon: ShieldCheck },
  { text: "Uptime 99.9%", icon: Server },
];

export const TechStack = () => {
  return (
    <section className="w-full bg-[#050505] border-y border-white/5 py-12 overflow-hidden relative z-10">
      
      {/* Cień/Gradient na bokach (Fade Effect) */}
      <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

      <div className="flex items-center">
         {/* Kontener Marquee */}
         <div className="flex gap-16 animate-scroll whitespace-nowrap pl-16">
            {/* x4 dla płynności pętli */}
            {[...metrics, ...metrics, ...metrics, ...metrics].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105"
              >
                {/* Ikona z efektem Glow */}
                <div className="text-blue-500 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0)] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:text-blue-400">
                   <item.icon size={28} strokeWidth={2} />
                </div>
                
                {/* Tekst */}
                <span className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-tight group-hover:text-white transition-colors">
                  {item.text}
                </span>

              </div>
            ))}
         </div>
      </div>

    </section>
  );
};