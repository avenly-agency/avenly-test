'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Smartphone, 
  Globe,
  CheckCircle2,
  Code2,
  Database,
  Search,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export default function CorporateWebsitesPage() {
  // --- ANIMACJA 1: MAKIETA PRZEGLĄDARKI Z 3-ETAPOWĄ NAWIGACJĄ ---
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const smoothMain = useSpring(mainProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const scale = useTransform(smoothMain, [0, 0.08], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.08], [15, 0]);
  const opacity = useTransform(smoothMain, [0, 0.05], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.08, 0.95], ["0%", "100%"]);

  // --- LOGIKA SYMULACJI KLIKNIĘCIA I PRZEJŚCIA (HOME -> O NAS -> OFERTA) ---
  const homeY = useTransform(smoothMain, [0.08, 0.30], ["0%", "-55%"]);
  const aboutY = useTransform(smoothMain, [0.38, 0.60], ["0%", "-55%"]);
  const offerY = useTransform(smoothMain, [0.68, 0.90], ["0%", "-55%"]);

  const homeOpacity = useTransform(smoothMain, [0, 0.32, 0.34, 1], [1, 1, 0, 0]);
  const aboutOpacity = useTransform(smoothMain, [0, 0.36, 0.38, 0.62, 0.64, 1], [0, 0, 1, 1, 0, 0]);
  const offerOpacity = useTransform(smoothMain, [0, 0.66, 0.68, 1], [0, 0, 1, 1]);

  const loaderOpacity = useTransform(
    smoothMain, 
    [0, 0.32, 0.34, 0.36, 0.38, 0.62, 0.64, 0.66, 0.68, 1], 
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
  );

  const cursorOpacity = useTransform(
    smoothMain, 
    [0, 0.23, 0.25, 0.35, 0.36, 0.53, 0.55, 0.65, 0.66, 1], 
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
  );
  
  const cursorX = useTransform(
    smoothMain, 
    [0, 0.23, 0.28, 0.31, 0.36, 0.53, 0.58, 0.61, 1], 
    ["50%", "50%", "65%", "78%", "78%", "50%", "68%", "85%", "85%"]
  );
  
  const cursorY = useTransform(
    smoothMain, 
    [0, 0.23, 0.28, 0.31, 0.36, 0.53, 0.58, 0.61, 1], 
    ["70%", "70%", "30%", "4.5%", "4.5%", "80%", "40%", "4.5%", "4.5%"]
  );
  
  const cursorScale = useTransform(
    smoothMain, 
    [0, 0.30, 0.31, 0.32, 0.34, 0.60, 0.61, 0.62, 1], 
    [1, 1, 0.8, 1, 1, 1, 0.8, 1, 1]
  );

  const link0Active = useTransform(smoothMain, [0, 0.34, 0.35, 1], [1, 1, 0, 0]);
  const link0Inactive = useTransform(smoothMain, [0, 0.34, 0.35, 1], [0, 0, 1, 1]);

  const link1Active = useTransform(smoothMain, [0, 0.34, 0.35, 0.64, 0.65, 1], [0, 0, 1, 1, 0, 0]);
  const link1Inactive = useTransform(smoothMain, [0, 0.34, 0.35, 0.64, 0.65, 1], [1, 1, 0, 0, 1, 1]);

  const link2Active = useTransform(smoothMain, [0, 0.64, 0.65, 1], [0, 0, 1, 1]);
  const link2Inactive = useTransform(smoothMain, [0, 0.64, 0.65, 1], [1, 1, 0, 0]);

  // --- ANIMACJA 2: ZAKRES PRAC SCROLL LOCK ---
  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ["start start", "end end"]
  });

  const smoothScope = useSpring(scopeProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });
  
  const scopeCardsY = useTransform(smoothScope, [0, 1], ["40vh", "-75%"]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-clip">
      
      {/* TŁO KINOWE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_70%)]" />
      </div>

      <main className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Code2 size={14} /> Strony Dedykowane
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Rozwiązania bez <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
                kompromisów.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Zbuduj platformę, która rośnie razem z Twoim biznesem. Od systemu CMS po zaawansowane integracje – dostarczamy strony stworzone z myślą o dominacji w branży.
            </p>
          </Reveal>
        </section>

        {/* --- SEKCJA ANIMACJI 1 (MAKIETA Z SYMULACJĄ NAWIGACJI) --- */}
        <section ref={targetRef} style={{ height: "700vh" }} className="relative z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">
            
            <motion.div 
              style={{ scale, opacity, rotateX, perspective: "1200px" }}
              className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden will-change-transform"
            >
              {/* Pasek narzędzi przeglądarki */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                <div className="flex gap-1.5 md:gap-2 shrink-0">
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                
                {/* Dynamiczny URL */}
                <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/50 rounded-full border border-white/5 flex items-center justify-center px-3 md:px-4 overflow-hidden z-50 shadow-inner max-w-[50%] md:max-w-md">
                   <span className="text-emerald-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                   <div className="relative w-28 sm:w-48 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                     <motion.span style={{ opacity: homeOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">
                       twoja-korporacja.pl
                     </motion.span>
                     <motion.span style={{ opacity: aboutOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">
                       twoja-korporacja.pl/o-nas
                     </motion.span>
                     <motion.span style={{ opacity: offerOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-emerald-300">
                       twoja-korporacja.pl/oferta
                     </motion.span>
                   </div>
                </div>
                
                {/* Pasek postępu od scrolla */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div 
                    style={{ width: progressBar }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 will-change-transform"
                  />
                </div>
              </div>

              {/* OKNO WYŚWIETLANIA (Główna zawartość makiety) */}
              <div className="relative flex-1 bg-[#020202] overflow-hidden">
                
                {/* Nieruchome Menu */}
                <div className="absolute top-0 inset-x-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-12 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                    </div>
                    <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                  </div>
                  
                  {/* Zakładki */}
                  <div className="flex gap-4 sm:gap-8 items-center pt-1">
                    <div className="relative w-8 sm:w-12 h-2 will-change-opacity">
                      <motion.div style={{ opacity: link0Inactive }} className="absolute inset-0 rounded bg-white/20" />
                      <motion.div style={{ opacity: link0Active }} className="absolute inset-0 rounded bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                    <div className="relative w-8 sm:w-12 h-2 will-change-opacity">
                      <motion.div style={{ opacity: link1Inactive }} className="absolute inset-0 rounded bg-white/20" />
                      <motion.div style={{ opacity: link1Active }} className="absolute inset-0 rounded bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                    <div className="relative w-8 sm:w-12 h-2 will-change-opacity">
                      <motion.div style={{ opacity: link2Inactive }} className="absolute inset-0 rounded bg-white/20" />
                      <motion.div style={{ opacity: link2Active }} className="absolute inset-0 rounded bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                    <div className="w-16 h-8 rounded-md bg-white/10 -mt-1 hidden lg:block" />
                  </div>
                </div>

                {/* --- PODSTRONA 1: STRONA GŁÓWNA --- */}
                <motion.div 
                  style={{ y: homeY, opacity: homeOpacity }}
                  className="absolute top-16 left-0 w-full p-4 md:p-16 flex flex-col gap-12 md:gap-24 will-change-transform pb-32"
                >
                  <div className="w-full flex flex-col items-center text-center mt-8">
                    <div className="w-full max-w-4xl h-20 md:h-32 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-[2rem] mb-8" />
                    <div className="w-5/6 md:w-2/3 max-w-2xl h-6 bg-white/5 rounded-lg mb-6" />
                    <div className="w-3/4 md:w-1/2 max-w-xl h-6 bg-white/5 rounded-lg mb-12" />
                    <div className="flex gap-4">
                      <div className="w-32 md:w-40 h-12 md:h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
                      <div className="w-32 md:w-40 h-12 md:h-14 bg-white/5 rounded-xl border border-white/10" />
                    </div>
                  </div>

                  <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-4 px-2">
                    <div className="w-48 md:w-64 h-8 bg-white/10 rounded-md mx-auto mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-end">
                           <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 mb-auto border border-emerald-500/20" />
                           <div className="w-full h-4 bg-white/10 rounded-md mb-3" />
                           <div className="w-3/4 h-3 bg-white/5 rounded-md" />
                           <div className="w-1/2 h-3 bg-white/5 rounded-md mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto mt-4 px-2">
                    <div className="md:col-span-8 aspect-[2/1] bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                      <div className="w-16 md:w-20 h-6 md:h-8 bg-emerald-500/10 rounded-md mb-auto" />
                      <div className="w-full h-3 md:h-4 bg-white/10 rounded-md mb-3" />
                      <div className="w-3/4 h-3 md:h-4 bg-white/5 rounded-md" />
                    </div>
                    <div className="md:col-span-4 aspect-square md:aspect-auto bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center justify-center hidden sm:flex">
                       <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] md:border-[8px] border-emerald-500/20 border-t-emerald-400" />
                    </div>
                  </div>
                </motion.div>

                {/* --- LOADER --- */}
                <motion.div 
                  style={{ opacity: loaderOpacity }}
                  className="absolute top-16 inset-x-0 bottom-0 z-20 flex items-center justify-center bg-[#020202] will-change-opacity"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                </motion.div>

                {/* --- PODSTRONA 2: ZAKŁADKA "O NAS" --- */}
                <motion.div 
                  style={{ y: aboutY, opacity: aboutOpacity }}
                  className="absolute top-16 left-0 w-full p-4 md:p-16 flex flex-col gap-12 md:gap-20 will-change-transform pb-32"
                >
                  <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 border-b border-white/10 pb-12 mt-8 max-w-5xl mx-auto text-center sm:text-left">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-400/50 blur-xl" />
                    </div>
                    <div className="flex-1 flex flex-col gap-4 items-center sm:items-start w-full">
                      <div className="w-3/4 sm:w-48 h-8 md:h-10 bg-white/10 rounded-xl" />
                      <div className="w-full max-w-md h-3 md:h-4 bg-white/5 rounded-md" />
                      <div className="w-5/6 max-w-sm h-3 md:h-4 bg-white/5 rounded-md" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col gap-3 md:gap-4">
                        <div className="w-full aspect-square bg-white/[0.03] rounded-2xl border border-white/5" />
                        <div className="w-3/4 h-3 md:h-4 bg-white/10 rounded-md" />
                        <div className="w-1/2 h-2 md:h-3 bg-white/5 rounded-md" />
                      </div>
                    ))}
                  </div>

                  <div className="w-full max-w-5xl mx-auto flex gap-4 md:gap-8 justify-center border-y border-white/5 py-8 md:py-12 px-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex-1 flex flex-col items-center text-center gap-2 md:gap-4">
                        <div className="w-16 md:w-24 h-6 md:h-10 bg-emerald-500/20 rounded-lg" />
                        <div className="w-full max-w-[100px] h-2 md:h-3 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 px-2 items-center">
                    <div className="w-full md:w-1/2 aspect-video bg-white/[0.02] border border-white/5 rounded-3xl" />
                    <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-4 items-center md:items-start text-center md:text-left">
                       <div className="w-2/3 h-6 md:h-8 bg-white/10 rounded-md mb-2" />
                       <div className="w-full h-3 md:h-4 bg-white/5 rounded-md" />
                       <div className="w-full h-3 md:h-4 bg-white/5 rounded-md" />
                       <div className="w-4/5 h-3 md:h-4 bg-white/5 rounded-md" />
                       <div className="w-32 h-10 md:h-12 bg-emerald-500/20 rounded-xl mt-4 border border-emerald-500/30" />
                    </div>
                  </div>
                </motion.div>

                {/* --- PODSTRONA 3: ZAKŁADKA "OFERTA" --- */}
                <motion.div 
                  style={{ y: offerY, opacity: offerOpacity }}
                  className="absolute top-16 left-0 w-full p-4 md:p-16 flex flex-col gap-12 md:gap-16 will-change-transform pb-32"
                >
                  <div className="w-full max-w-5xl mx-auto mt-8">
                    <div className="w-full h-40 md:h-64 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-[2rem] flex flex-col justify-center px-6 md:px-12 mb-8 md:mb-12 relative overflow-hidden text-center md:text-left">
                      <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-emerald-400/20 blur-[80px]" />
                      <div className="w-32 md:w-48 h-6 md:h-8 bg-white/10 rounded-lg mb-4 mx-auto md:mx-0" />
                      <div className="w-full max-w-lg h-3 md:h-4 bg-white/5 rounded-md mb-2 mx-auto md:mx-0" />
                      <div className="w-3/4 max-w-md h-3 md:h-4 bg-white/5 rounded-md mx-auto md:mx-0" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-6 md:p-8 rounded-3xl border flex flex-col gap-4 md:gap-6 ${i === 2 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${i === 2 ? 'bg-emerald-500/20' : 'bg-white/5'}`} />
                          <div className="w-full h-5 md:h-6 bg-white/10 rounded-md" />
                          <div className="flex flex-col gap-2 md:gap-3 flex-1">
                            <div className="w-full h-2 md:h-3 bg-white/5 rounded-sm" />
                            <div className="w-full h-2 md:h-3 bg-white/5 rounded-sm" />
                            <div className="w-4/5 h-2 md:h-3 bg-white/5 rounded-sm" />
                          </div>
                          <div className={`w-full h-10 md:h-12 rounded-xl mt-4 ${i === 2 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5'}`} />
                        </div>
                      ))}
                    </div>

                    <div className="w-full mt-12 md:mt-24 px-2">
                      <div className="w-48 md:w-64 h-6 md:h-8 bg-white/10 rounded-md mb-6 md:mb-8 mx-auto md:mx-0" />
                      <div className="flex flex-col gap-3 md:gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-white/[0.04] transition-colors">
                             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 shrink-0" />
                             <div className="flex-1 flex flex-col gap-2 md:gap-3">
                                <div className="w-1/3 h-3 md:h-4 bg-white/10 rounded-md" />
                                <div className="w-2/3 max-w-sm h-2 md:h-3 bg-white/5 rounded-md" />
                             </div>
                             <div className="w-16 md:w-24 h-8 md:h-10 bg-emerald-500/10 rounded-lg border border-emerald-500/20 hidden sm:block" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* --- ANIMOWANY KURSOR --- */}
                <motion.div 
                  style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }} 
                  className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform"
                >
                  <MousePointer2 size={32} className="text-white fill-emerald-500 stroke-[1.5]" />
                </motion.div>

                {/* Mgła dla głębi makiety */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-30 pointer-events-none" />
              </div>
            </motion.div>

            {/* Pływająca wskazówka scrolla */}
            <motion.div 
              style={{ opacity: useTransform(smoothMain, [0, 0.05, 0.1], [1, 1, 0]) }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby testować</span>
              <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
            </motion.div>

          </div>
        </section>

        {/* --- BENTO GRID (ZALETY DLA STRON B2B) --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Fundament skalowania</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Profesjonalna strona to nie wydatek, to Twój najciężej pracujący handlowiec. Zabezpieczamy Twój biznes technologicznie i wizerunkowo.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
              {/* KARTA 1 */}
              <div className="md:col-span-12 h-full">
                <Reveal delay={0.1}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 relative z-10 border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
                      <Target size={32} />
                    </div>
                    <div className="relative z-10 flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                        Pełna skalowalność
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                        Otrzymujesz system gotowy na rozbudowę. Niezależnie czy za rok dodasz sklep, portal pracowniczy czy platformę B2B – technologia, którą wdrażamy, nie zablokuje Twojego rozwoju.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 2 */}
              <div className="md:col-span-6 h-full">
                <Reveal delay={0.2}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 relative z-10 border border-cyan-500/20 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-500">
                      <Database size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">Własny System CMS</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Zarządzaj ofertą, dodawaj wpisy i edytuj teksty bez dotykania kodu. Otrzymujesz potężny, ale banalnie prosty w obsłudze panel administracyjny na własność.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 3 */}
              <div className="md:col-span-6 h-full">
                <Reveal delay={0.3}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 relative z-10 border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
                      <Search size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">Architektura pod SEO</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Kodujemy zgodnie z rygorystycznymi wytycznymi Google. Twoja platforma od pierwszego dnia jest strukturalnie gotowa na dominację w wynikach wyszukiwania.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 4 */}
              <div className="md:col-span-12 h-full">
                <Reveal delay={0.4}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 relative z-10 border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 relative z-10 text-white group-hover:text-emerald-400 transition-colors">Status Lidera (Autorytet)</h3>
                    <p className="text-slate-400 text-lg max-w-3xl relative z-10 leading-relaxed">
                      Zbyt wielu klientów odrzuca ofertę tylko dlatego, że strona firmy wygląda na przestarzałą. Dostarczamy kinowy, elitarny design, dzięki któremu Twoja marka natychmiast budzi zaufanie godne lidera rynku.
                    </p>
                  </div>
                </Reveal>
              </div>
              
            </div>
          </section>
        </div>

        {/* --- SEKCJA ANIMACJI 2 (SCROLL LOCK ZAKRESU PRAC) --- */}
        <section ref={scopeRef} className="relative h-[300vh] bg-[#050505] z-30">
          
          <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 h-full pt-24 md:pt-40">
              
              {/* Lewa strona - Nieruchomy nagłówek */}
              <div className="lg:w-5/12 text-center lg:text-left shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 mx-auto lg:mx-0">
                  <CheckCircle2 size={14} /> Zakres prac
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Co dokładnie <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    otrzymujesz?
                  </span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Przewijaj w dół, aby zobaczyć pełen pakiet wdrożeniowy. Nie musisz martwić się o technikalia – projektujemy narzędzie gotowe do zbierania klientów.
                </p>
              </div>

              {/* Prawa strona - Scrollowane karty */}
              <div className="lg:w-7/12 relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)] pb-32">
                
                {/* Kontener kart animowany za pomocą Scroll Progress */}
                <motion.div 
                  style={{ y: scopeCardsY }}
                  className="flex flex-col gap-6 w-full absolute top-0 left-0 pb-[20vh]"
                >
                  {[
                    { title: "Kinowy projekt graficzny", desc: "Zaprojektowany od zera, ukierunkowany na maksymalizację konwersji i budowanie prestiżu marki." },
                    { title: "Płynne animacje i efekty", desc: "Wdrożenie interakcji opartych na scrollu (Reveal, Parallax), które ożywiają stronę." },
                    { title: "Zbieranie leadów", desc: "Zoptymalizowany, zabezpieczony formularz kontaktowy podpięty pod Twój adres e-mail." },
                    { title: "Perfekcyjne RWD", desc: "Ręczne dopasowanie każdego piksela do ekranów smartfonów i tabletów (Mobile-First)." },
                    { title: "Google Core Web Vitals", desc: "Optymalizacja wydajności dla natychmiastowego ładowania." },
                    { title: "Pomoc wdrożeniowa", desc: "Wsparcie w wyborze szybkiego hostingu, podpięciu domeny i darmowego certyfikatu SSL." }
                  ].map((item, i) => (
                    
                    // Niezawodny "pop-in" - raz wyzwolony zostaje na zawsze!
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }} // Margin powoduje aktywację odrobinę wcześniej
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-start gap-6 group"
                    >
                      {/* WIELKA PRZEŹROCZYSTA CYFRA ZAMKNIĘTA W PRAWYM DOLNYM ROGU BOXA */}
                      <div className="absolute -bottom-6 right-0 text-[160px] md:text-[200px] font-black text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                        0{i + 1}
                      </div>

                      {/* Ikona i Treść */}
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] border border-emerald-500/20">
                        <CheckCircle2 size={20} />
                      </div>

                      <div className="relative z-10 flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 leading-relaxed text-base md:text-lg">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* --- STOPKA I CTA --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}