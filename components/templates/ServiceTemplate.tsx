// components/templates/ServiceTemplate.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { AvenlyAICta } from '@/components/AvenlyAICta'; 
import { ProcessAccordion } from '@/components/ProcessAccordion';
import { Reveal } from '@/components/Reveal';

// Typy dla naszego szablonu
interface ServiceTemplateProps {
  categoryLabel: string;
  categorySlug: string;
  title: string;
  description: string;
  fullDescription: string[];
  features: string[];
  badgeText: string;
  icon: any; // Ikona z Lucide
  children?: React.ReactNode; // Pozwala na wstrzyknięcie customowych sekcji!
}

export const ServiceTemplate = ({
  categoryLabel,
  categorySlug,
  title,
  description,
  fullDescription,
  features,
  badgeText,
  icon: Icon,
  children
}: ServiceTemplateProps) => {
  return (
    <div className="relative z-10 pt-32 pb-24">
      {/* --- BREADCRUMBS --- */}
      <div className="container mx-auto px-6 mb-12">
          <Link 
              href={`/uslugi/${categorySlug}`} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group"
          >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Wróć do: <span className="text-blue-400 ml-1">{categoryLabel}</span>
          </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                  <Reveal delay={0.1}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                          <Star size={12} fill="currentColor" />
                          {badgeText}
                      </div>
                  </Reveal>
                  
                  <Reveal delay={0.2}>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                          {title}
                      </h1>
                  </Reveal>

                  <Reveal delay={0.3}>
                      <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mb-10 border-l-2 border-white/10 pl-6">
                          {description}
                      </p>
                  </Reveal>

                  <Reveal delay={0.4}>
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                          <Link href="/kontakt" className="w-full sm:w-auto">
                              <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2">
                                  Darmowa Wycena <ArrowRight size={18} />
                              </button>
                          </Link>
                      </div>
                  </Reveal>
              </div>

              {/* PRAWA STRONA (IKONA) */}
              <div className="order-1 lg:order-2 hidden lg:flex justify-end relative">
                  <Reveal delay={0.3}>
                      <div className="relative w-full lg:max-w-[500px]">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full" />
                          <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-md flex items-center justify-center p-12 shadow-2xl">
                              <div className="w-full h-full rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                  <Icon size={120} className="text-blue-500 relative z-10" />
                              </div>
                          </div>
                      </div>
                  </Reveal>
              </div>
          </div>
      </div>

      {/* --- O ROZWIĄZANIU --- */}
      <div id="szczegoly" className="container mx-auto px-6 space-y-32">
          <section>
              <Reveal>
                  <div className="flex flex-col items-center text-center mb-10">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">O Rozwiązaniu</h2>
                      <h3 className="text-3xl font-bold text-white">Dlaczego to jest ważne?</h3>
                  </div>
                  <div className="max-w-4xl mx-auto prose prose-invert prose-lg text-slate-300/90 leading-relaxed text-center">
                      {fullDescription.map((paragraph, i) => (
                          <p key={i} className="text-lg md:text-xl font-light mb-6 last:mb-0">
                              {paragraph}
                          </p>
                      ))}
                  </div>
              </Reveal>
          </section>

          {/* MIEJSCE NA CUSTOMOWE SEKCJE DLA DANEJ USŁUGI */}
          {children}

          {/* --- KORZYŚCI --- */}
          <section>
              <Reveal>
                  <div className="flex flex-col items-center text-center mb-16">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">Korzyści</h2>
                      <h3 className="text-3xl font-bold text-white">Co otrzymujesz w pakiecie?</h3>
                  </div>
              </Reveal>
              <Reveal delay={0.2}>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-full">
                      {features.map((item, i) => (
                          <div key={i} className="group flex items-center gap-5 p-4 rounded-xl hover:bg-white/[0.02] transition-all">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                  <CheckCircle2 size={20} />
                              </div>
                              <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                  {item}
                              </h3>
                          </div>
                      ))}
                  </div>
              </Reveal>
          </section>

          <ProcessAccordion category={categorySlug} />
          <AvenlyAICta />
      </div>
    </div>
  );
};