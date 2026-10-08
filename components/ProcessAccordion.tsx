'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { localeFromPathname } from '@/lib/i18n/locale';
import { processAccordionDict } from '@/lib/i18n/process-accordion';

export const ProcessAccordion = ({ category }: { category: string }) => {
  const [activeStep, setActiveStep] = useState(0);

  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const stepsMap = processAccordionDict[locale];

  const getSteps = () => {
    // Obsługa aliasów dla AI
    if (category === 'automatyzacja-ai' || category === 'konsultacje-ai' || category === 'ai' || category === 'chatbot') {
        return stepsMap['automatyzacja-ai'];
    }
    // Obsługa marketingu
    if (category === 'marketing' || category === 'seo' || category === 'sprzedaz') {
        return stepsMap['marketing'];
    }
    
    return stepsMap[category] || stepsMap['default'];
  }

  const steps = getSteps();

  return (
    <div className="w-full">
      {/* MOBILE VIEW (Vertical Stack) */}
      <div className="flex flex-col gap-4 lg:hidden">
        {steps.map((step, i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
            </div>
            <p className="text-sm text-slate-400 pl-14">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW (Horizontal Accordion) */}
      <div className="hidden lg:flex h-[450px] gap-3 w-full">
        {steps.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setActiveStep(i)}
              className={`
                relative rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                border border-white/5
                ${isActive 
                  ? 'flex-[3] bg-[#0a0a0a] border-blue-500/30 cursor-default' 
                  : 'flex-[1] bg-[#050505] hover:bg-white/[0.02] cursor-pointer'
                }
              `}
            >
              {/* TŁO AKTYWNE */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-50" />
              )}

              {/* NUMER (WATERMARK) */}
              <div className={`
                absolute transition-all duration-700 flex items-center justify-center font-bold font-mono pointer-events-none select-none
                ${isActive 
                  ? 'top-6 left-8 text-8xl text-blue-500/20 scale-100' 
                  : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-blue-600/40 scale-110' 
                }
              `}>
                0{i + 1}
              </div>

              {/* CONTENT */}
              <div className={`
                absolute inset-0 flex flex-col justify-end p-10 
                transition-opacity ease-in-out
                ${isActive 
                    ? 'opacity-100 duration-500 delay-300' // Opóźnione pojawienie
                    : 'opacity-0 duration-150' // Szybkie znikanie
                }
              `}>
                {/* Blokada zwężania tekstu */}
                <div className="min-w-[400px]">
                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {step.title}
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                    {step.desc}
                    </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};