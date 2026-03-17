'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Smartphone, 
  Globe,
  FastForward,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export default function OnePageFancyService() {
  // --- ANIMACJA 1: MAKIETA PRZEGLĄDARKI ---
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

  const scale = useTransform(smoothMain, [0, 0.15], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.15], [15, 0]);
  const opacity = useTransform(smoothMain, [0, 0.1], [0.3, 1]);
  // Lekko wydłużony dystans y, aby uwzględnić stopkę w makiecie
  const contentY = useTransform(smoothMain, [0.15, 0.9], ["0%", "-78%"]);
  const progressBar = useTransform(smoothMain, [0.15, 0.9], ["0%", "100%"]);

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
  
  // Przesuwanie kart z zakresu prac od dołu do góry w trakcie scrolla
  const scopeCardsY = useTransform(smoothScope, [0, 1], ["40vh", "-75%"]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-clip">
      
      {/* TŁO KINOWE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>

      <main className="relative z-10">
        
        {/* --- HERO SECTION --- */}
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

        {/* --- SEKCJA ANIMACJI 1 (MAKIETA SCROLL LOCK) --- */}
        <section ref={targetRef} className="relative h-[400vh] z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">
            
            <motion.div 
              style={{ scale, opacity, rotateX, perspective: "1200px" }}
              className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.25)] flex flex-col overflow-hidden will-change-transform"
            >
              
              {/* Pasek narzędzi przeglądarki */}
              <div className="relative h-14 bg-[#111] border-b border-white/5 px-6 flex items-center justify-between z-30 shrink-0">
                <div className="flex gap-2 shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                
                {/* Poprawiony LINK (Nie załamie się na mobile) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[65%] md:w-1/2 max-w-md h-8 bg-black/50 rounded-full border border-white/5 flex items-center justify-center px-4 overflow-hidden">
                   <span className="text-blue-500/50 mr-1 text-[11px] sm:text-xs font-mono shrink-0">https://</span>
                   <span className="text-slate-500 font-mono tracking-wider text-[11px] sm:text-xs truncate">
                     twoja-przyszla-strona.pl
                   </span>
                </div>
                
                {/* Pasek postępu od scrolla */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div 
                    style={{ width: progressBar }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>

              {/* Okno wyświetlania zawartości makiety */}
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

                  {/* DODANA Sekcja 5: WIREFRAME STOPKI */}
                  <div className="w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-32 h-8 bg-white/10 rounded-lg" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                    </div>
                  </div>

                </motion.div>

                {/* Mgła dla głębi makiety */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>

            {/* Pływająca wskazówka scrolla */}
            <motion.div 
              style={{ opacity: useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]) }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
            </motion.div>

          </div>
        </section>

        {/* --- BENTO GRID (ZALETY) --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Narzędzie do zadań specjalnych</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Kiedy potrzebujesz szybkiej weryfikacji pomysłu, dedykowanego landing page'a lub wizytówki wspierającej reklamy – One-Page sprawdza się najlepiej.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
              {/* KARTA 1 */}
              <div className="md:col-span-12 h-full">
                <Reveal delay={0.1}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-[#0a0a0a] to-[#111] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-20 -top-20 text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-700 rotate-12">
                      <Target size={300} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 relative z-10">
                      <Target size={32} />
                    </div>
                    <div className="relative z-10 flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-4">Laserowe skupienie</h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Projektujemy jedną, spójną ścieżkę wizualną. Idealnie wspiera to kampanie reklamowe, gdzie liczy się zatrzymanie uwagi i natychmiastowe wypełnienie formularza przez klienta.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 2 */}
              <div className="md:col-span-6 h-full">
                <Reveal delay={0.2}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 mb-8 relative z-10 group-hover:bg-indigo-500/20 transition-colors">
                      <FastForward size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Błyskawiczna weryfikacja</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Zbieraj leady i testuj rynek znacznie szybciej, zanim zdecydujesz się na rozbudowaną platformę internetową. Czas to Twój zysk.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 3 */}
              <div className="md:col-span-6 h-full">
                <Reveal delay={0.3}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 mb-8 relative z-10 group-hover:bg-purple-500/20 transition-colors">
                      <Smartphone size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Idealne pod Mobile</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Płynne przewijanie to naturalny odruch. Twoja oferta staje się wciągającą opowieścią na ekranie każdego smartfona, gdzie przebywa 80% kupujących.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 4 */}
              <div className="md:col-span-12 h-full">
                <Reveal delay={0.4}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-[#050505] border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 shadow-[0_0_40px_-15px_rgba(59,130,246,0.15)] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                    <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <Zap size={40} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 relative z-10 text-white">Kompaktowa wydajność</h3>
                    <p className="text-slate-400 text-lg max-w-2xl relative z-10 leading-relaxed">
                      Lekka struktura gwarantuje natychmiastowe ładowanie. To kluczowy czynnik, który znacząco obniża koszty kliknięć (CPC) w reklamach i zapobiega ucieczce klientów.
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 mx-auto lg:mx-0">
                  <CheckCircle2 size={14} /> Zakres prac
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Co dokładnie <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
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
                      className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-start gap-6 group"
                    >
                      {/* WIELKA PRZEŹROCZYSTA CYFRA ZAMKNIĘTA W PRAWYM DOLNYM ROGU BOXA */}
                      <div className="absolute -bottom-6 right-0 text-[160px] md:text-[200px] font-black text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                        0{i + 1}
                      </div>

                      {/* Ikona i Treść */}
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] border border-blue-500/20">
                        <CheckCircle2 size={20} />
                      </div>

                      <div className="relative z-10 flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
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
          <section className="border-t border-white/10 pt-20 pb-20 mt-12">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}