'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  Zap,
  Layers,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export function ChatbotsAIClient() {
  // ── SCROLL LOCK: WEBSITE + WIDGET ─────────────────────────────────────────
  const chatRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: chatProg } = useScroll({
    target: chatRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(chatProg, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Intro
  const scale   = useTransform(smooth, [0, 0.03], [0.85, 1]);
  const rotateX = useTransform(smooth, [0, 0.03], [8, 0]);
  const opacity = useTransform(smooth, [0, 0.02], [0.3, 1]);
  const progressBar = useTransform(smooth, [0.03, 0.96], ['0%', '100%']);

  // Chat bubble
  const bubbleOp    = useTransform(smooth, [0.05, 0.13, 0.30, 0.38], [0, 1, 1, 0]);
  const bubbleSc    = useTransform(smooth, [0.05, 0.13], [0.4, 1]);
  const badgeOp     = useTransform(smooth, [0.20, 0.28], [0, 1]);
  const badgeSc     = useTransform(smooth, [0.20, 0.28], [0, 1]);

  // Chat window
  const winOp = useTransform(smooth, [0.32, 0.42], [0, 1]);
  const winSc = useTransform(smooth, [0.32, 0.42], [0.8, 1]);
  const winY  = useTransform(smooth, [0.32, 0.42], [14, 0]);

  // Messages
  const m1Op      = useTransform(smooth, [0.44, 0.50], [0, 1]);
  const dots1Op   = useTransform(smooth, [0.50, 0.54, 0.57, 0.61], [0, 1, 1, 0]);
  const m2Op      = useTransform(smooth, [0.57, 0.63], [0, 1]);
  const u1Op      = useTransform(smooth, [0.65, 0.70], [0, 1]);
  const dots2Op   = useTransform(smooth, [0.70, 0.73, 0.76, 0.80], [0, 1, 1, 0]);
  const botRepOp  = useTransform(smooth, [0.76, 0.82], [0, 1]);
  const emailInOp = useTransform(smooth, [0.84, 0.89], [0, 1]);
  const emailW    = useTransform(smooth, [0.89, 0.95], ['0%', '100%']);
  const successOp = useTransform(smooth, [0.93, 0.98], [0, 1]);

  const scrollIndOp = useTransform(smooth, [0, 0.05, 0.12], [1, 1, 0]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-clip">

      {/* TŁO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[900px] bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.09),transparent_70%)]" />
      </div>

      <main className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
              <MessageCircle size={13} /> Wirtualny Asystent
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Rozmawia z klientem.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                Natychmiast.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Asystent AI wbudowany w Twoją stronę — odpowiada na pytania, kwalifikuje potrzeby i przekazuje gotowe leady do CRM. Przez całą dobę. Bez jednego pracownika.
            </p>
          </Reveal>
        </section>

        {/* ── SCROLL LOCK — STRONA + WIDGET ─────────────────────────────────── */}
        <section ref={chatRef} className="relative h-[700vh] z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">

            <motion.div
              style={{ scale, opacity, rotateX, perspective: '1200px' }}
              className="relative w-full max-w-6xl h-[78vh] md:h-[86vh] rounded-[2rem] md:rounded-[3rem] bg-[#070707] border border-white/[0.07] shadow-[0_0_120px_-30px_rgba(20,184,166,0.15),0_0_0_1px_rgba(20,184,166,0.04)] overflow-hidden will-change-transform"
            >

              {/* Progress line — top edge */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-white/[0.04] z-50">
                <motion.div
                  style={{ width: progressBar }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 will-change-transform"
                />
              </div>

              {/* ── WIREFRAME STRONY INTERNETOWEJ ── */}
              <div className="absolute inset-0 pt-0.5 flex flex-col bg-[#020202]">

                {/* Navbar */}
                <div className="h-12 md:h-14 border-b border-white/[0.05] flex items-center justify-between px-5 md:px-10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-teal-400 rounded-sm" />
                    </div>
                    <div className="w-20 h-3 bg-white/10 rounded hidden sm:block" />
                  </div>
                  <div className="hidden md:flex gap-5 items-center">
                    <div className="w-14 h-2.5 bg-teal-400/50 rounded shadow-[0_0_8px_rgba(45,212,191,0.3)]" />
                    <div className="w-14 h-2.5 bg-white/15 rounded" />
                    <div className="w-14 h-2.5 bg-white/15 rounded" />
                    <div className="w-14 h-2.5 bg-white/15 rounded" />
                  </div>
                  <div className="w-20 md:w-24 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                    <div className="w-12 h-2 bg-white/20 rounded" />
                  </div>
                </div>

                {/* Hero content */}
                <div className="px-5 md:px-10 pt-6 md:pt-10 pb-5 md:pb-8 flex-shrink-0">
                  <div className="w-28 h-4 md:h-5 bg-teal-500/15 rounded-full mb-4 md:mb-5" />
                  <div className="w-full max-w-md h-7 md:h-11 bg-gradient-to-r from-white/10 to-white/[0.07] rounded-xl mb-3" />
                  <div className="w-3/4 max-w-xs h-7 md:h-11 bg-gradient-to-r from-white/8 to-white/[0.05] rounded-xl mb-4 md:mb-6" />
                  <div className="w-64 h-2.5 bg-white/5 rounded mb-2" />
                  <div className="w-48 h-2.5 bg-white/5 rounded mb-5 md:mb-8" />
                  <div className="flex gap-3">
                    <div className="w-28 md:w-32 h-9 md:h-11 bg-gradient-to-r from-teal-600/30 to-cyan-600/20 border border-teal-500/20 rounded-xl" />
                    <div className="w-24 md:w-28 h-9 md:h-11 bg-white/5 border border-white/8 rounded-xl" />
                  </div>
                </div>

                {/* Feature cards */}
                <div className="px-5 md:px-10 grid grid-cols-3 gap-3 md:gap-4 flex-shrink-0">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 md:h-28 bg-white/[0.02] border border-white/[0.04] rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col justify-between"
                    >
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl ${i === 0 ? 'bg-teal-500/15' : 'bg-white/5'}`} />
                      <div>
                        <div className="w-3/4 h-2 bg-white/10 rounded mb-1.5" />
                        <div className="w-1/2 h-1.5 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fade to bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none" />
              </div>

              {/* ── CHAT BUBBLE ── */}
              <motion.div
                style={{ opacity: bubbleOp, scale: bubbleSc }}
                className="absolute bottom-5 right-5 md:bottom-7 md:right-7 z-50 origin-bottom-right"
              >
                <div className="relative w-11 h-11 md:w-13 md:h-13">
                  <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-[0_0_28px_rgba(34,211,238,0.55)] cursor-pointer">
                    <MessageCircle size={18} className="text-white" />
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping" />
                  {/* Notification badge */}
                  <motion.div
                    style={{ opacity: badgeOp, scale: badgeSc }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-[#020202]"
                  >1</motion.div>
                </div>
              </motion.div>

              {/* ── CHAT WINDOW ── */}
              <motion.div
                style={{ opacity: winOp, scale: winSc, y: winY }}
                className="absolute bottom-5 right-5 md:bottom-7 md:right-7 z-50 w-[252px] md:w-[292px] origin-bottom-right"
              >
                <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/[0.1] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(34,211,238,0.06)] overflow-hidden">

                  {/* Widget header */}
                  <div className="h-11 bg-gradient-to-r from-teal-900/30 to-cyan-900/20 border-b border-white/[0.06] flex items-center px-3.5 gap-2.5">
                    <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)] shrink-0">
                      <Bot size={11} className="text-white" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0d0d0d]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white leading-none mb-0.5">Asystent AI</div>
                      <div className="text-[8px] text-emerald-400 font-mono">● online · odpowiada błyskawicznie</div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/5 border border-white/10" />
                      <div className="w-3.5 h-3.5 rounded-full bg-white/5 border border-white/10" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-3 flex flex-col gap-2.5">

                    {/* M1 bot */}
                    <motion.div style={{ opacity: m1Op }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white" />
                      </div>
                      <div className="max-w-[82%] bg-white/[0.05] border border-white/[0.07] rounded-xl rounded-bl-sm px-2.5 py-2">
                        <div className="w-32 h-2 bg-white/20 rounded mb-1.5" />
                        <div className="w-24 h-1.5 bg-white/[0.12] rounded" />
                      </div>
                    </motion.div>

                    {/* Dots 1 */}
                    <motion.div style={{ opacity: dots1Op }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/50 to-teal-500/50 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white/60" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-bl-sm px-2.5 py-2 flex gap-1 items-center h-7">
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.div key={d} className="w-1 h-1 rounded-full bg-cyan-400"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.85, delay: d, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* M2 bot */}
                    <motion.div style={{ opacity: m2Op }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white" />
                      </div>
                      <div className="max-w-[82%] bg-white/[0.05] border border-white/[0.07] rounded-xl rounded-bl-sm px-2.5 py-2">
                        <div className="flex gap-1.5 items-center mb-1.5">
                          <div className="w-2 h-2 rounded-full bg-cyan-500/50 shrink-0" />
                          <div className="w-24 h-2 bg-white/[0.18] rounded" />
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.08] rounded" />
                      </div>
                    </motion.div>

                    {/* User M1 */}
                    <motion.div style={{ opacity: u1Op }} className="flex justify-end">
                      <div className="max-w-[75%] bg-gradient-to-br from-cyan-600/30 to-teal-600/20 border border-cyan-500/15 rounded-xl rounded-br-sm px-2.5 py-2">
                        <div className="w-20 h-2 bg-white/30 rounded mb-1.5" />
                        <div className="w-14 h-1.5 bg-white/15 rounded" />
                      </div>
                    </motion.div>

                    {/* Dots 2 */}
                    <motion.div style={{ opacity: dots2Op }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/50 to-teal-500/50 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white/60" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-bl-sm px-2.5 py-2 flex gap-1 items-center h-7">
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.div key={d} className="w-1 h-1 rounded-full bg-teal-400"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.85, delay: d, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Bot reply */}
                    <motion.div style={{ opacity: botRepOp }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white" />
                      </div>
                      <div className="max-w-[82%] flex flex-col gap-1.5">
                        <div className="bg-white/[0.05] border border-white/[0.07] rounded-xl rounded-bl-sm px-2.5 py-2">
                          <div className="w-full h-2 bg-white/15 rounded mb-1.5" />
                          <div className="w-4/5 h-1.5 bg-white/10 rounded" />
                        </div>
                        <div className="flex gap-1.5 pl-0.5">
                          {['Zadzwoń teraz', 'Napisz'].map((l) => (
                            <div key={l} className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] text-cyan-300 whitespace-nowrap">{l}</div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Email input */}
                    <motion.div style={{ opacity: emailInOp }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
                        <Bot size={9} className="text-white" />
                      </div>
                      <div className="flex-1 relative bg-white/[0.04] border border-cyan-500/20 rounded-xl px-2.5 py-2 flex items-center gap-1.5 overflow-hidden">
                        <div className="w-2 h-2 rounded-sm bg-cyan-500/40 shrink-0" />
                        <motion.div
                          style={{ width: emailW }}
                          className="h-2 bg-cyan-400/50 rounded border-r border-cyan-400 will-change-transform"
                        />
                      </div>
                    </motion.div>

                    {/* Success */}
                    <motion.div style={{ opacity: successOp }} className="flex gap-1.5 items-end">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                        <CheckCircle2 size={9} className="text-white" />
                      </div>
                      <div className="max-w-[82%] bg-gradient-to-br from-emerald-900/20 to-teal-900/15 border border-emerald-500/20 rounded-xl rounded-bl-sm px-2.5 py-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle2 size={8} className="text-emerald-400 shrink-0" />
                          <div className="w-24 h-2 bg-emerald-400/40 rounded" />
                        </div>
                        <div className="w-20 h-1.5 bg-white/8 rounded" />
                      </div>
                    </motion.div>

                  </div>

                  {/* Input bar */}
                  <div className="h-10 border-t border-white/[0.06] flex items-center px-2.5 gap-2 bg-[#0a0a0a]">
                    <div className="flex-1 h-6 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center px-2 gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-white/15" />
                      <div className="w-16 h-1.5 bg-white/8 rounded" />
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M9 5L1 1L2.8 5L1 9L9 5Z" fill="white" />
                      </svg>
                    </div>
                  </div>

                </div>
              </motion.div>

            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              style={{ opacity: scrollIndOp }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-teal-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby aktywować asystenta</span>
              <div className="w-px h-12 bg-gradient-to-b from-teal-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── EDITORIAL FEATURES ─────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">

            <Reveal>
              <div className="flex items-baseline gap-4 mb-16 md:mb-24">
                <span className="text-[10px] uppercase tracking-[0.3em] text-teal-500/60 font-mono">02</span>
                <h2 className="text-3xl md:text-4xl font-bold">Dlaczego warto</h2>
              </div>
            </Reveal>

            {[
              {
                icon: Zap,
                title: 'Nigdy nie daje sygnału zajętości.',
                body: 'Formularze kontaktowe czekają. Telefon milknie po godzinach pracy. Asystent AI odpowiada w ciągu 2 sekund — o 3 w nocy, w niedzielę, w święto. Żaden klient nie odchodzi bez odpowiedzi.',
              },
              {
                icon: Layers,
                title: 'Wie, co sprzedajesz. W szczegółach.',
                body: 'Zanim go wdrożymy, karmimy go Twoją bazą wiedzy — cenniki, opisy produktów, FAQ, case studies. Odpowiada dokładnie na temat, bez fantazjowania. Jakbyś zatrudnił konsultanta, który nauczył się wszystkiego na pamięć.',
              },
              {
                icon: TrendingUp,
                title: 'Zamienia rozmowę w lead.',
                body: 'Nie czeka, aż klient sam kliknie "wyślij". W odpowiednim momencie rozmowy pyta o dane kontaktowe i automatycznie zapisuje gotowy lead do Twojego CRM lub na e-mail. Zero ręcznej pracy.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="border-t border-white/[0.06] py-14 md:py-20 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 group hover:border-teal-500/20 transition-colors duration-700 cursor-default">
                    <div className="flex flex-col gap-5">
                      <span className="text-[72px] md:text-[96px] font-black text-white/[0.03] leading-none group-hover:text-white/[0.06] transition-colors duration-700 select-none">
                        0{i + 1}
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/15 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-500">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold leading-snug group-hover:text-teal-400 transition-colors duration-500 max-w-xs">
                        {f.title}
                      </h3>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-slate-400 text-lg leading-relaxed max-w-xl">{f.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            {/* Closing border */}
            <div className="border-t border-white/[0.06]" />
          </section>
        </div>

        {/* ── JAK TO DZIAŁA — 4-STEP GRID ───────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">

            <Reveal>
              <div className="flex items-baseline gap-4 mb-14 md:mb-20">
                <span className="text-[10px] uppercase tracking-[0.3em] text-teal-500/60 font-mono">03</span>
                <h2 className="text-3xl md:text-4xl font-bold">Od zlecenia do działania</h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.06] rounded-3xl overflow-hidden">
                {[
                  {
                    step: '01',
                    title: 'Projekt dialogu',
                    body: 'Mapujemy typowe pytania klientów i ścieżki rozmów. Definiujemy cele — sprzedaż, support lub lead gen.',
                  },
                  {
                    step: '02',
                    title: 'Trening na wiedzy',
                    body: 'Dostarczasz dokumenty, opisy i FAQ. Chatbot uczy się Twojej marki, produktów i tonu komunikacji.',
                  },
                  {
                    step: '03',
                    title: 'Wdrożenie w 1 dzień',
                    body: 'Jeden snippet kodu na stronę. Widget jest gotowy, dopasowany wizualnie do Twojego serwisu.',
                  },
                  {
                    step: '04',
                    title: 'Ciągła optymalizacja',
                    body: 'Co miesiąc analizujemy rozmowy, uzupełniamy wiedzę bota i poprawiamy konwersję na podstawie danych.',
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#050505] p-7 md:p-10 hover:bg-[#0a0a0a] transition-colors duration-500 group"
                  >
                    <span className="text-teal-400 text-[10px] font-mono tracking-[0.2em] mb-5 block">{s.step}</span>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-500">
                      {s.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}
