'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Layout,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  GitBranch,
  Users,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export function AppWebClient() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothMain = useSpring(mainProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothMain, [0, 0.15], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.15], [15, 0]);
  const opacity = useTransform(smoothMain, [0, 0.1], [0.3, 1]);
  const contentY = useTransform(smoothMain, [0.15, 0.9], ['0%', '-72%']);
  const progressBar = useTransform(smoothMain, [0.15, 0.9], ['0%', '100%']);

  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });

  const smoothScope = useSpring(scopeProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  const scopeCardsY = useTransform(smoothScope, [0, 1], ['40vh', '-75%']);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-sky-500/30 overflow-clip">

      {/* TŁO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent_70%)]" />
      </div>

      <main className="relative z-10">

        {/* --- HERO --- */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/5 border border-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Layout size={14} /> Aplikacje Webowe
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Oprogramowanie <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500">
                szyte na miarę.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Systemy CRM, portale klienta, panele B2B i aplikacje wewnętrzne. Dedykowane rozwiązania, które automatyzują Twój biznes i rosną razem z nim.
            </p>
          </Reveal>
        </section>

        {/* --- BROWSER MOCKUP SCROLL LOCK --- */}
        <section ref={targetRef} className="relative h-[400vh] z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">

            <motion.div
              style={{ scale, opacity, rotateX, perspective: '1200px' }}
              className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(14,165,233,0.2)] flex flex-col overflow-hidden will-change-transform"
            >

              {/* Pasek przeglądarki */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-6 flex items-center justify-between z-30 shrink-0">
                <div className="flex gap-2 shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-[65%] md:w-1/2 max-w-md h-8 bg-black/50 rounded-full border border-white/5 flex items-center justify-center px-4 overflow-hidden">
                  <span className="text-sky-500/50 mr-1 text-[11px] sm:text-xs font-mono shrink-0">https://</span>
                  <span className="text-slate-500 font-mono tracking-wider text-[11px] sm:text-xs truncate">app.twoja-firma.pl</span>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div
                    style={{ width: progressBar }}
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-500"
                  />
                </div>
              </div>

              {/* Zawartość — app dashboard */}
              <div className="relative flex-1 bg-[#020202] overflow-hidden flex">

                {/* Sidebar */}
                <div className="w-14 md:w-56 h-full border-r border-white/5 bg-[#050505] p-3 md:p-4 flex flex-col gap-4 pt-6 shrink-0">
                  <div className="w-8 h-8 md:w-full md:h-10 rounded-lg md:rounded-xl bg-sky-500/20 border border-sky-500/30 mb-4" />
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex items-center gap-3 p-2 md:p-3 rounded-lg ${i === 1 ? 'bg-white/5' : ''}`}>
                      <div className={`w-4 h-4 md:w-5 md:h-5 rounded bg-white/10 shrink-0 ${i === 1 ? 'bg-sky-500/50' : ''}`} />
                      <div className="hidden md:block w-full h-3 rounded bg-white/5" />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <motion.div
                  style={{ y: contentY }}
                  className="absolute left-14 md:left-56 right-0 top-0 p-4 md:p-8 flex flex-col gap-8 will-change-transform pb-32"
                >
                  {/* Stats row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {['1,240', '86%', '48', '$12k'].map((val, i) => (
                      <div key={i} className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                        <div className="text-lg md:text-2xl font-black text-white mt-2">{val}</div>
                        <div className="text-[10px] text-sky-400 font-mono tracking-wider">+8.3%</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart + list */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 aspect-video rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex flex-col">
                      <div className="w-1/3 h-5 bg-white/10 rounded mb-6" />
                      <div className="flex-1 flex items-end gap-3 border-b border-white/10 pb-4">
                        {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                          <div
                            key={i}
                            className="w-full bg-gradient-to-t from-sky-500/30 to-sky-400 rounded-t-lg"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex flex-col gap-3">
                      <div className="w-1/2 h-5 bg-white/10 rounded mb-3" />
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-sky-500/20 shrink-0" />
                          <div className="flex flex-col gap-1.5 flex-1">
                            <div className="w-3/4 h-3 bg-white/20 rounded" />
                            <div className="w-1/2 h-2 bg-white/10 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6">
                    <div className="w-1/4 h-5 bg-white/10 rounded mb-6" />
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-white/5">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-3 bg-white/10 rounded" />
                        ))}
                      </div>
                      {[1, 2, 3, 4].map(row => (
                        <div key={row} className="grid grid-cols-4 gap-4 py-2">
                          {[1, 2, 3, 4].map(col => (
                            <div key={col} className={`h-3 rounded ${col === 3 ? 'bg-sky-500/30' : 'bg-white/5'}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stopka */}
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="w-32 h-6 bg-white/5 rounded" />
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                    </div>
                  </div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]) }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sky-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-sky-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* --- BENTO GRID --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Technologia dopasowana do biznesu</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Nie sprzedajemy gotowych szablonów. Projektujemy architekturę systemu od zera, uwzględniając Twoje procesy i plany na przyszłość.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
              {/* KARTA 1 */}
              <div className="md:col-span-12">
                <Reveal delay={0.1}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-[#0a0a0a] to-[#111] border border-white/5 hover:border-sky-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-sky-900/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-20 -top-20 text-sky-500/5 group-hover:text-sky-500/10 transition-colors duration-700 rotate-12">
                      <Cpu size={300} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 shrink-0 relative z-10">
                      <Cpu size={32} />
                    </div>
                    <div className="relative z-10 flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-4">React & Next.js — stos liderów</h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Budujemy na tym samym stosie co Vercel, Airbnb i Discord. Komponenty renderują się błyskawicznie po stronie serwera — Twoi użytkownicy dostają aplikację, która odpowiada natychmiast.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 2 */}
              <div className="md:col-span-6">
                <Reveal delay={0.2}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400 mb-8 relative z-10 group-hover:bg-cyan-500/20 transition-colors">
                      <Database size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Własna baza danych</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Projektujemy schemat danych pod Twoje procesy. PostgreSQL, Supabase lub MongoDB — wybieramy technologię pasującą do skali projektu.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 3 */}
              <div className="md:col-span-6">
                <Reveal delay={0.3}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full group-hover:bg-teal-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-teal-400 mb-8 relative z-10 group-hover:bg-teal-500/20 transition-colors">
                      <ShieldCheck size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Bezpieczeństwo i role</h3>
                      <p className="text-slate-400 leading-relaxed">
                        System uprawnień z rolami użytkowników, szyfrowanie end-to-end i audyt logów. Twoje dane są chronione na każdym poziomie.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 4 */}
              <div className="md:col-span-12">
                <Reveal delay={0.4}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-[#050505] border border-sky-500/20 hover:border-sky-400/50 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 shadow-[0_0_40px_-15px_rgba(14,165,233,0.15)] group">
                    <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <Users size={32} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 relative z-10">Skalowalność dla Twojego zespołu</h3>
                    <p className="text-slate-400 text-lg max-w-2xl relative z-10 leading-relaxed">
                      Projektujesz dziś dla 10 użytkowników, ale jutro możesz mieć 10 000. Architektura mikroserwisów i infrastruktura chmurowa gwarantują, że aplikacja urośnie razem z Tobą — bez przepisywania od zera.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </div>

        {/* --- ZAKRES PRAC SCROLL LOCK --- */}
        <section ref={scopeRef} className="relative h-[300vh] bg-[#050505] z-30">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 h-full pt-24 md:pt-40">

              <div className="lg:w-5/12 text-center lg:text-left shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 mx-auto lg:mx-0">
                  <CheckCircle2 size={14} /> Zakres prac
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Od pomysłu <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                    do wdrożenia.
                  </span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Budujesz narzędzie, które działa na Ciebie — zamiast odwrotnie. Każda funkcja powstaje z myślą o realnym procesie biznesowym.
                </p>
              </div>

              <div className="lg:w-7/12 relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)] pb-32">
                <motion.div
                  style={{ y: scopeCardsY }}
                  className="flex flex-col gap-6 w-full absolute top-0 left-0 pb-[20vh]"
                >
                  {[
                    { title: 'Analiza wymagań', desc: 'Mapujemy procesy biznesowe i przekładamy je na specyfikację techniczną. Wiesz dokładnie, co budujesz.' },
                    { title: 'Projekt UX/UI', desc: 'Klikalne makiety w Figmie. Testujesz przepływy użytkownika, zanim powstanie choć jedna linia kodu.' },
                    { title: 'Frontend (React)', desc: 'Responsywne, komponentowe widoki. Interfejs reaguje w czasie rzeczywistym — zero przeładowań.' },
                    { title: 'Backend & API', desc: 'Bezpieczne REST API, zarządzanie sesjami, integracje z zewnętrznymi systemami (ERP, CRM, płatności).' },
                    { title: 'Testy i QA', desc: 'Automatyczne testy jednostkowe i integracyjne. Błędy wykrywamy zanim aplikacja trafi do użytkowników.' },
                    { title: 'Deploy & wsparcie', desc: 'Wdrożenie na infrastrukturę chmurową (Vercel/AWS), CI/CD pipeline i stałe wsparcie techniczne.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-sky-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-start gap-6 group"
                    >
                      <div className="absolute -bottom-6 right-0 text-[160px] md:text-[200px] font-black text-sky-500/5 group-hover:text-sky-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                        0{i + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)] border border-sky-500/20">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="relative z-10 flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 leading-relaxed text-base md:text-lg">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}
