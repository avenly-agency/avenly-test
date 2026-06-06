'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion, MotionValue, Variants } from 'framer-motion';
import { Lightbulb, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Plan i strategia',
    description: 'Zaczynasz od planu. Słuchamy i analizujemy Twój biznes, a strona od początku ma jeden cel: zarabiać i odzwierciedlać jakość Twoich usług.',
    icon: Lightbulb,
  },
  {
    id: 2,
    title: 'Projekt graficzny',
    description: 'Nie kupujesz kota w worku. Zobaczysz pełną wizualizację strony przed wdrożeniem, zaprojektowaną tak, by klienci od razu wiedzieli, dlaczego warto Ci zaufać.',
    icon: PenTool,
  },
  {
    id: 3,
    title: 'Budowa i technologia',
    description: 'Dostajesz szybką, bezpieczną stronę, która po prostu działa. Całe zaplecze techniczne bierzemy na siebie, a Ty zajmujesz się tym, co potrafisz najlepiej.',
    icon: Code2,
  },
  {
    id: 4,
    title: 'Start i wsparcie',
    description: 'Strona startuje dopięta na ostatni guzik. Sprawdzamy każdy detal i podpinamy statystyki, żebyś od razu widział efekty, a Twój biznes był gotowy na nowych klientów.',
    icon: Rocket,
  },
];

// Motyw GLOW: solidne ciemne karty z mocnym niebieskim glow.
const GLOW_CARD: React.CSSProperties = {
  background: '#080c1a',
  border: '1px solid rgba(59,130,246,0.3)',
  boxShadow: '0 0 50px -12px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
};

function TimelineItem({ step, index }: { step: typeof steps[0]; index: number }) {
  const isEven = index % 2 === 0;
  const isOdd = !isEven;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const liClass = `relative flex items-center w-full md:w-[50%] pl-20 md:pl-0 ${isEven ? 'md:ml-auto md:justify-start md:pl-24' : 'md:mr-auto md:justify-end md:pr-24 md:text-right'}`;
  const dotPositionClass = `absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#050505] z-30 bg-[#050505] left-[22px] ${isEven ? 'md:left-[-8px]' : 'md:right-[-8px] md:left-auto'}`;
  const connectorClass = `absolute top-1/2 -translate-y-1/2 h-[1px] z-10 w-[30px] left-[28px] bg-gradient-to-r from-blue-500 to-transparent ${isEven ? 'md:w-[96px] md:left-0 md:bg-gradient-to-r' : 'md:w-[96px] md:right-0 md:left-auto md:bg-gradient-to-l'}`;
  const connectorDotClass = `absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full right-0 ${isEven ? 'md:right-0' : 'md:left-0 md:right-auto'}`;

  return (
    <li className={liClass}>
      {/* Kropka na osi - skaluje się + zmienia kolor */}
      <motion.div
        initial={{ scale: 0, backgroundColor: '#334155' }}
        whileInView={{ scale: 1, backgroundColor: '#60a5fa' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
        className={dotPositionClass}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-blue-500 blur-[6px] opacity-50" />
      </motion.div>

      {/* Łącznik oś → karta - rysuje się scaleX */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`${connectorClass} origin-left ${isOdd ? 'md:origin-right' : ''}`}
        aria-hidden="true"
      >
        <div className={connectorDotClass} />
      </motion.div>

      {/* Karta GLOW - wjeżdża z variants */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative overflow-hidden p-6 md:p-8 rounded-3xl w-full max-w-md"
        style={GLOW_CARD}
      >
        {/* Wielki numer w tle - watermark w dolnym rogu, odsunięty od krawędzi */}
        <span
          aria-hidden="true"
          className={`absolute bottom-4 md:bottom-6 text-[5rem] sm:text-[7rem] md:text-[10rem] font-bold leading-none text-blue-500/10 select-none pointer-events-none ${isEven ? 'right-5 md:right-8' : 'right-5 md:right-auto md:left-8'}`}
        >
          0{step.id}
        </span>

        <div className={`relative z-10 flex flex-col gap-3 ${isOdd ? 'md:items-end' : ''}`}>
          <div className={`flex items-center gap-3 ${isOdd ? 'md:flex-row-reverse' : ''}`}>
            <span className="p-2.5 rounded-xl border bg-blue-500/15 border-blue-500/30 text-blue-300"><step.icon size={20} aria-hidden="true" /></span>
            <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">Krok 0{step.id}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{step.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
        </div>
      </motion.div>
    </li>
  );
}

function Timeline({ scaleY, reduce }: { scaleY: MotionValue<number>; reduce: boolean }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-white/10 rounded-full overflow-hidden z-10">
        <motion.div
          style={{ height: '100%', scaleY: reduce ? 1 : scaleY, transformOrigin: 'top', translateZ: 0 }}
          className="w-full bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-400 shadow-[0_0_20px_2px_rgba(59,130,246,0.5)] will-change-transform"
          aria-hidden="true"
        />
      </div>

      <ol className="flex flex-col gap-12 md:gap-24 m-0 p-0 list-none relative z-20">
        {steps.map((step, index) => (
          <TimelineItem key={step.id} step={step} index={index} />
        ))}
      </ol>
    </div>
  );
}

export const Process = () => {
  const reduce = useReducedMotion() ?? false;

  // Wypełnianie osi liczone na poziomie sekcji - logika z pierwotnej wersji (sprawdzona).
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start center', 'end center'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-32 bg-[#050505] overflow-hidden"
      aria-label="Proces realizacji projektu"
    >
      {/* TŁO - aurora glow (blue/indigo) + pionowy beam za osią */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[55vw] h-[40vw] bg-blue-600/15 blur-[130px] rounded-full" />
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[45vw] h-[40vw] bg-indigo-600/12 blur-[130px] rounded-full" />
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-44 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Proces</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Jak to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">działa?</span>
          </h2>
        </header>

        <Timeline scaleY={scaleY} reduce={reduce} />
      </div>
    </section>
  );
};
