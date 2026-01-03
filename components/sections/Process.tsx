'use client';

import { motion } from 'framer-motion';
import { Search, Lightbulb, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Analiza & Strategia",
    desc: "Zrozumienie Twojego biznesu to klucz. Analizujemy konkurencję i tworzymy plan działania."
  },
  {
    icon: Lightbulb,
    title: "Design UX/UI",
    desc: "Projektujemy makiety, które nie tylko wyglądają, ale przede wszystkim sprzedają."
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Wdrażamy projekt używając najnowszych technologii (Next.js, React) dla maksymalnej wydajności."
  },
  {
    icon: Rocket,
    title: "Wdrożenie & Skalowanie",
    desc: "Testujemy, uruchamiamy i optymalizujemy system, by generował wyniki od pierwszego dnia."
  }
];

export const Process = () => {
  return (
    // Z-INDEX: Mniejszy lub równy poprzedniej sekcji, ale relative, żeby zachować flow.
    // bg-slate-950 - minimalnie inny odcień czerni, żeby widzieć granicę (opcjonalnie)
    <section className="relative w-full py-32 bg-[#050505] border-t border-white/5">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* NAGŁÓWEK */}
        <div className="mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 font-mono text-sm tracking-wider uppercase"
            >
              Jak Działamy?
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mt-4"
            >
              Proces <span className="text-slate-500">Wdrożenia</span>
            </motion.h2>
        </div>

        {/* SIATKA KROKÓW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <step.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {step.desc}
                    </p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};