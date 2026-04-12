'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll, useTransform, useSpring,
  useInView, useMotionValue,
  Variants,
} from 'framer-motion';
import {
  ArrowRight,
  Globe, Target, FastForward, Smartphone, Zap, CheckCircle2, CalendarCheck,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 60 });
  useEffect(() => { if (isInView) motionValue.set(value); }, [isInView, value, motionValue]);
  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString();
    });
  }, [springValue]);
  return <span ref={ref}>0</span>;
}

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};
const vp = { once: true, margin: '-50px' } as const;

export function OnePageClient() {
  // ── ANIMACJA 1: MAKIETA PRZEGLĄDARKI ────────────────────────────────────────
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const smoothMain = useSpring(mainProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  const scale       = useTransform(smoothMain, [0, 0.15], [0.85, 1]);
  const rotateX     = useTransform(smoothMain, [0, 0.15], [15, 0]);
  const mockOpacity = useTransform(smoothMain, [0, 0.1], [0.3, 1]);
  const contentY    = useTransform(smoothMain, [0.15, 0.9], ['0%', '-78%']);
  const progressBar = useTransform(smoothMain, [0.15, 0.9], ['0%', '100%']);

  // ── ANIMACJA 2: ZAKRES PRAC ──────────────────────────────────────────────────
  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });
  const smoothScope = useSpring(scopeProgress, { stiffness: 70, damping: 25, restDelta: 0.001 });
  const scopeCardsY = useTransform(smoothScope, [0, 1], ['40vh', '-75%']);

  const scopeItems = [
    { title: 'Kinowy projekt graficzny',  desc: 'Zaprojektowany od zera, ukierunkowany na maksymalizację konwersji i budowanie prestiżu marki.' },
    { title: 'Płynne animacje i efekty',  desc: 'Interakcje oparte na scrollu (Reveal, Parallax) ożywiające stronę i przykuwające uwagę klienta.' },
    { title: 'Zbieranie leadów',          desc: 'Zoptymalizowany, zabezpieczony formularz kontaktowy podpięty bezpośrednio pod Twój adres e-mail.' },
    { title: 'Perfekcyjne RWD',           desc: 'Ręczne dopasowanie każdego piksela do ekranów smartfonów i tabletów — podejście Mobile-First.' },
    { title: 'Google Core Web Vitals',    desc: 'Optymalizacja wydajności dla natychmiastowego ładowania i perfekcyjnych wyników PageSpeed.' },
    { title: 'Pomoc wdrożeniowa',         desc: 'Wsparcie w wyborze hostingu, podpięciu domeny i konfiguracji darmowego certyfikatu SSL.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-clip">

      {/* TŁO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>

      <main className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Globe size={14} /> Rozwiązania One-Page
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Skupienie na <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                jednym celu.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Idealne rozwiązanie dla kampanii reklamowych i startujących projektów. Zyskujesz landing page, który chwyta uwagę i prowadzi użytkownika prosto do konwersji.
            </p>
          </Reveal>
        </section>

        {/* ── MAKIETA PRZEGLĄDARKI (400vh) ──────────────────────────────────── */}
        <section ref={targetRef} className="relative h-[400vh] z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">

            <motion.div
              style={{ scale, opacity: mockOpacity, rotateX, perspective: '1200px' }}
              className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.25)] flex flex-col overflow-hidden will-change-transform"
            >
              {/* Browser toolbar */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-6 flex items-center justify-between z-30 shrink-0">
                <div className="flex gap-2 shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-[65%] md:w-1/2 max-w-md h-8 bg-black/50 rounded-full border border-white/5 flex items-center justify-center px-4 overflow-hidden">
                  <span className="text-blue-500/50 mr-1 text-[11px] sm:text-xs font-mono shrink-0">https://</span>
                  <span className="text-slate-500 font-mono tracking-wider text-[11px] sm:text-xs truncate">twoja-przyszla-strona.pl</span>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </div>

              {/* Viewport */}
              <div className="relative flex-1 bg-[#020202] overflow-hidden">
                <motion.div
                  style={{ y: contentY }}
                  className="absolute top-0 left-0 w-full p-6 md:p-16 flex flex-col gap-16 md:gap-24 will-change-transform pb-32"
                >
                  {/* Sekcja 1 */}
                  <div className="w-full flex flex-col items-center text-center mt-10 md:mt-20">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20 mb-10 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                      <Zap className="text-blue-400" size={32} />
                    </div>
                    <div className="w-full max-w-4xl h-16 md:h-24 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-2xl mb-8" />
                    <div className="w-3/4 max-w-2xl h-6 bg-white/5 rounded-lg mb-12" />
                    <div className="w-64 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/20" />
                  </div>
                  {/* Sekcja 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-3xl bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-end gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 mb-auto" />
                        <div className="w-full h-5 bg-white/15 rounded-md" />
                        <div className="w-2/3 h-4 bg-white/5 rounded-md" />
                      </div>
                    ))}
                  </div>
                  {/* Sekcja 3 */}
                  <div className="w-full aspect-video md:aspect-[21/9] bg-gradient-to-br from-[#111] to-[#050505] rounded-[2.5rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/5" />
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center z-10">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  {/* Sekcja 4 */}
                  <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="w-3/4 h-10 bg-white/10 rounded-xl mb-4" />
                      <div className="w-full h-4 bg-white/5 rounded-md" />
                      <div className="w-full h-4 bg-white/5 rounded-md" />
                      <div className="w-2/3 h-4 bg-white/5 rounded-md" />
                    </div>
                    <div className="flex-[1.5] bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-white/5 rounded-xl border border-white/5" />
                        <div className="h-14 bg-white/5 rounded-xl border border-white/5" />
                      </div>
                      <div className="h-32 bg-white/5 rounded-xl border border-white/5" />
                      <div className="h-16 bg-blue-500/20 border border-blue-500/30 rounded-xl" />
                    </div>
                  </div>
                  {/* Stopka */}
                  <div className="w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-32 h-8 bg-white/10 rounded-lg" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                    </div>
                  </div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]) }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── BENTO GRID ────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">

            <div className="max-w-3xl mx-auto text-center mb-20">
              <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Dlaczego One-Page?</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                  Narzędzie do <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    zadań specjalnych
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Kiedy potrzebujesz szybkiej weryfikacji pomysłu, dedykowanego landing page&apos;a lub wizytówki wspierającej reklamy — One-Page sprawdza się najlepiej.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 — span 2, Laserowe skupienie */}
              <motion.div custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:border-blue-500/30 transition-colors duration-700 ease-out"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <Target size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Laserowe skupienie</h3>
                  <p className="text-slate-400 max-w-md leading-relaxed">
                    Projektujemy jedną, spójną ścieżkę wizualną. Idealnie wspiera kampanie reklamowe, gdzie liczy się zatrzymanie uwagi i natychmiastowe wypełnienie formularza.
                  </p>
                </div>
                {/* Dekoracja: animated focus rings */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none translate-x-12 translate-y-12" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-blue-500/40"
                      style={{ scale: 1 + i * 0.3 }}
                      animate={{ scale: [1 + i * 0.3, 1.1 + i * 0.3], opacity: [0.4, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                  <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-blue-500/40 blur-sm" />
                </div>
              </motion.div>

              {/* Card 2 — Błyskawiczna weryfikacja + counter */}
              <motion.div custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[300px] flex flex-col hover:border-indigo-500/30 transition-colors duration-700 ease-out"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:rotate-12 transition-transform duration-700">
                    <FastForward size={24} aria-hidden="true" />
                  </div>
                  <span className="text-4xl font-bold text-white flex items-baseline" aria-label="3-5 dni realizacji">
                    <Counter value={3} /><span className="text-indigo-400 text-2xl">–5 dni</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Błyskawiczna weryfikacja</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Zbieraj leady i testuj rynek znacznie szybciej, zanim zdecydujesz się na rozbudowaną platformę. Czas to Twój zysk.
                </p>
              </motion.div>

              {/* Card 3 — Idealne pod Mobile */}
              <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 min-h-[250px] flex flex-col hover:border-purple-500/30 transition-colors duration-700 ease-out"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 relative z-10">
                  <Smartphone size={24} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Idealne pod Mobile</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Płynne przewijanie to naturalny odruch. Twoja oferta staje się wciągającą opowieścią na każdym smartfonie, gdzie przebywa 80% kupujących.
                </p>
              </motion.div>

              {/* Card 4 — span 2, Kompaktowa wydajność + CTA */}
              <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#080808] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 hover:border-blue-400/30 transition-colors duration-700 ease-out"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" aria-hidden="true" />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Zap size={20} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Kompaktowa wydajność</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Lekka struktura gwarantuje natychmiastowe ładowanie. Kluczowy czynnik obniżający CPC w reklamach i zapobiegający ucieczce klientów.
                  </p>
                </div>
                <div className="shrink-0 relative z-20">
                  <Link
                    href="/kontakt"
                    className="group/btn px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-500 ease-out flex items-center gap-2"
                  >
                    Zacznijmy
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-500" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* ── ZAKRES PRAC (300vh) ────────────────────────────────────────────── */}
        <section ref={scopeRef} className="relative h-[300vh] bg-[#050505] z-30">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 h-full pt-24 md:pt-40">

              <div className="lg:w-5/12 text-center lg:text-left shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto lg:mx-0 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                  <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Zakres prac</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Co dokładnie{' '}
                  <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    otrzymujesz?
                  </span>
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Przewijaj w dół, aby zobaczyć pełen pakiet wdrożeniowy. Nie musisz martwić się o technikalia — projektujemy narzędzie gotowe do zbierania klientów.
                </p>
              </div>

              <div className="lg:w-7/12 relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)] pb-32">
                <motion.div style={{ y: scopeCardsY }} className="flex flex-col gap-4 w-full absolute top-0 left-0 pb-[20vh]">
                  {scopeItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-[#080808] hover:border-blue-500/30 transition-colors duration-500 flex items-start gap-5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true" />
                      <div className="relative z-10 shrink-0 p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">0{i + 1}</span>
                      </div>
                      <div className="absolute -bottom-4 right-0 text-[130px] md:text-[160px] font-black text-blue-500/[0.04] group-hover:text-blue-500/[0.07] transition-colors duration-500 pointer-events-none select-none leading-none z-0" aria-hidden="true">
                        0{i + 1}
                      </div>
                      <div className="relative z-10 flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="relative w-full py-16 lg:py-32 bg-[#050505] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-900/10 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen opacity-40" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-15" aria-hidden="true" />
              <div className="relative rounded-[1.5rem] md:rounded-[2rem] bg-[#080808] border border-white/10 p-8 sm:p-12 md:p-16 text-center overflow-hidden">

                <motion.div custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                  className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Mamy wolne moce przerobowe</span>
                </motion.div>

                <motion.h2 custom={0.1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]"
                >
                  Gotowy na cyfrową{' '}
                  <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Dominację?
                  </span>
                </motion.h2>

                <motion.p custom={0.2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                  className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                  Zbudujmy razem landing page, który pracuje na Twój sukces 24/7. Darmowa konsultacja, zero zobowiązań.
                </motion.p>

                <motion.div custom={0.3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link href="/kontakt"
                    className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Darmowa Konsultacja
                      <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                  </Link>
                  <Link href="/kontakt"
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    Napisz do nas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
                  </Link>
                </motion.div>

                <motion.div custom={0.4} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp}
                  className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm text-slate-500"
                >
                  <div className="flex -space-x-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-800 border-2 border-[#080808]" />
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-700 border-2 border-[#080808]" />
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-600 border-2 border-[#080808]" />
                  </div>
                  <p>Dołącz do firm, które wyprzedziły konkurencję.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AVENLY AI CTA ─────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 pb-20 relative z-40 bg-[#050505]">
          <div className="border-t border-white/5 pt-16">
            <AvenlyAICta />
          </div>
        </div>

      </main>
    </div>
  );
}
