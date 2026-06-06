'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';
import { ScanSearch, Zap, Brain, CalendarCheck, MessageSquare, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/app/icon.png';

// ── Język wizualny 1:1 z prawdziwym chatbotem (components/chatbot/Chatbot.tsx) ──
const USER_GRAD = 'linear-gradient(135deg, #2f5beb, #4f46e5)';
const USER_BUBBLE: React.CSSProperties = {
  background: USER_GRAD,
  color: '#fff',
  borderRadius: '1.25rem 1.25rem 0.375rem 1.25rem',
  boxShadow: '0 14px 44px -10px rgba(59,130,246,0.55)',
};
const AI_BUBBLE: React.CSSProperties = {
  background: 'rgba(8,14,34,0.8)',
  border: '1px solid rgba(59,130,246,0.15)',
  color: '#e2e8f0',
  borderRadius: '1.25rem 1.25rem 1.25rem 0.375rem',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 14px 44px -16px rgba(0,0,0,0.85)',
};
const GLASS_PILL: React.CSSProperties = {
  background: 'rgba(4,8,24,0.7)',
  border: '1px solid rgba(59,130,246,0.2)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
};

type Msg = { role: 'user' | 'assistant'; text: string };

const SCRIPT: Msg[] = [
  { role: 'user', text: 'Ile kosztuje sklep internetowy?' },
  { role: 'assistant', text: 'Sklep z BLIK, kurierami i panelem do zarządzania zaczyna się od ok. 6 000 zł. Chcesz orientacyjną wycenę pod swój asortyment?' },
  { role: 'user', text: 'Tak, mam ~200 produktów.' },
  { role: 'assistant', text: 'Jasne - dobiorę wariant z integracją hurtowni i zarezerwuję termin bezpłatnej konsultacji. 🚀' },
];

// Każdy krok railu odpowiada jednej wiadomości czatu → zapala się, gdy demo to "udowadnia".
const STEPS = [
  { icon: ScanSearch, label: 'Rozpoznaje intencję klienta', meta: '' },
  { icon: Zap, label: 'Odpowiada w czasie rzeczywistym', meta: 'w sekundy' },
  { icon: Brain, label: 'Pamięta kontekst rozmowy', meta: 'PL · EN · DE' },
  { icon: CalendarCheck, label: 'Domyka temat: wycena i termin', meta: 'gotowe' },
];

function Avatar({ size = 24 }: { size?: number }) {
  return (
    <Image src={logoImg} alt="Avenly AI" width={size} height={size} className="rounded-full shrink-0 ring-1 ring-blue-500/30 shadow-sm shadow-blue-500/20" />
  );
}

// Sekwencer rozmowy - JEDEN zegar napędzający i czat (prawa), i status rail (lewa).
function useConversation(active: boolean, reduce: boolean) {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (!active) return;
    if (reduce) { setVisible(SCRIPT.length); return; }
    setVisible(0); setTyping(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const step = () => {
      if (i >= SCRIPT.length) return;
      if (SCRIPT[i].role === 'assistant') {
        setTyping(true);
        timers.push(setTimeout(() => {
          setTyping(false);
          setVisible((v) => Math.max(v, i + 1));
          i += 1;
          timers.push(setTimeout(step, 950));
        }, 1200));
      } else {
        setVisible((v) => Math.max(v, i + 1));
        i += 1;
        timers.push(setTimeout(step, 700));
      }
    };
    timers.push(setTimeout(step, 450));
    return () => timers.forEach(clearTimeout);
  }, [active, reduce]);
  return { visible, typing };
}

// Schodkowe wejście elementów railu (eyebrow → kroki pojawiają się po kolei)
const railContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const railList: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const railItem: Variants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

// ════════════ STATUS RAIL - duży, zapala się w rytm czatu (demo = dowód) ════════════
function StatusRail({ visible, typing }: { visible: number; typing: boolean }) {
  const n = STEPS.length;
  const fill = visible <= 1 ? 0 : Math.min(1, (visible - 1) / (n - 1));
  return (
    <motion.div variants={railContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="lg:h-[500px] flex flex-col py-2">
      <motion.div variants={railItem} className="flex items-center gap-2.5 mb-6">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
        </span>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-blue-300/70">Asystent na żywo · co dzieje się pod maską</span>
      </motion.div>

      <motion.ol variants={railList} className="relative flex flex-col gap-6 lg:flex-1 lg:gap-0 lg:justify-between">
        {/* Tor pionowy + animowane wypełnienie łączące aktywne węzły */}
        <span aria-hidden="true" className="absolute left-6 top-6 bottom-6 w-px bg-white/10" />
        <motion.span
          aria-hidden="true"
          className="absolute left-6 top-6 bottom-6 w-px origin-top bg-gradient-to-b from-blue-400 to-indigo-500"
          animate={{ scaleY: fill }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {STEPS.map((s, i) => {
          const active = i < visible;
          const working = i === visible && typing;
          const Icon = s.icon;
          return (
            <motion.li key={i} variants={railItem} className="relative flex items-center gap-4">
              <span
                className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
                style={active
                  ? { background: USER_GRAD, boxShadow: '0 6px 22px -4px rgba(59,130,246,0.5)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.18)' }}
              >
                {working && <span className="absolute inset-0 rounded-2xl border border-blue-400/60 animate-ping" />}
                <Icon size={20} className={active ? 'text-white' : working ? 'text-blue-300' : 'text-slate-500'} />
              </span>
              <div className="flex-1 flex items-center gap-3">
                <span className={`text-sm md:text-base lg:text-lg transition-colors duration-300 ${active ? 'text-white font-semibold' : working ? 'text-blue-200' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {active && s.meta && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-[11px] font-mono px-2.5 py-1 rounded-full text-blue-300 shrink-0"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(79,70,229,0.3)' }}
                  >
                    {s.meta}
                  </motion.span>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.div>
  );
}

// ════════════ PODGLĄD ASYSTENTA - FLOATING (steruje go stan z rodzica) ════════════
function FloatingChat({ visible, typing }: { visible: number; typing: boolean }) {
  const offsets = ['md:-translate-x-5', 'md:translate-x-7', 'md:-translate-x-3', 'md:translate-x-5'];

  return (
    <div className="relative mx-auto max-w-md h-[500px] flex flex-col gap-4 py-2">
      <div aria-hidden="true" className="absolute -z-10 top-1/4 -left-12 w-60 h-60 rounded-full bg-blue-600/10 blur-[90px]" />
      <div aria-hidden="true" className="absolute -z-10 bottom-1/5 -right-12 w-60 h-60 rounded-full bg-indigo-600/10 blur-[100px]" />

      {/* Status pill - reaguje na stan rozmowy */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45 }}
        className="self-center inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
        style={GLASS_PILL}
      >
        <Avatar size={20} />
        <span className="text-sm font-bold tracking-tighter text-white">AVENLY<span className="text-blue-400">.</span> AI</span>
        <span className="flex items-center gap-1.5 ml-0.5 text-[11px] text-blue-300/55">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${typing ? 'bg-blue-400' : 'bg-emerald-400'}`} />
          {typing ? 'pisze…' : 'Online'}
        </span>
      </motion.div>

      {/* Bąbelki - stała wysokość (sekcja nie zmienia rozmiaru), narastają od dołu, nadmiar maskowany */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col justify-end gap-3.5">
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
        {SCRIPT.slice(0, visible).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} ${offsets[i % offsets.length]}`}
          >
            <div className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed" style={m.role === 'user' ? USER_BUBBLE : AI_BUBBLE}>
              {m.role === 'assistant' && (
                <span className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300/60">
                  <Avatar size={14} />Avenly AI
                </span>
              )}
              {m.text}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex justify-start md:-translate-x-3"
          >
            <div className="px-4 py-3 flex gap-1.5 items-center" style={AI_BUBBLE}>
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: `${d * 0.12}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input pill */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="self-stretch flex gap-2 items-center px-2 py-2 rounded-full"
        style={GLASS_PILL}
      >
        <span className="flex-1 pl-3 text-sm text-blue-300/35 select-none">Zapytaj Avenly AI…</span>
        <span className="w-9 h-9 flex items-center justify-center rounded-full text-white shrink-0" style={{ background: USER_GRAD, boxShadow: '0 4px 16px -4px rgba(59,130,246,0.5)' }}>
          <Send size={14} />
        </span>
      </motion.div>
    </div>
  );
}

export function AiConsultant() {
  const reduce = useReducedMotion() ?? false;
  const proofRef = useRef<HTMLDivElement>(null);
  const inView = useInView(proofRef, { once: true, margin: '-120px' });
  const { visible, typing } = useConversation(inView, reduce);

  const handleOpenChat = () => {
    window.dispatchEvent(new Event('avenly:open-chat'));
  };

  return (
    <section className="py-16 md:py-24 bg-[#050505] relative overflow-hidden" aria-labelledby="ai-consultant-heading">

      {/* --- TŁO DEKORACYJNE --- */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* --- NAGŁÓWEK (góra, wyśrodkowany) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-6">
            <Image src={logoImg} alt="" width={14} height={14} className="rounded-full" />
            Napędzane przez Avenly AI
          </div>

          <h2 id="ai-consultant-heading" className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Zatrudnij pracownika, <br />
            który <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">nigdy nie śpi.</span>
          </h2>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Twój konsultant AI odpowiada klientom całą dobę, w kilku językach, i od razu kwalifikuje potrzeby.
            Zyskujesz więcej domkniętych rozmów i odciążasz zespół.
          </p>
        </motion.div>

        {/* --- DOWÓD: status rail (większy) OBOK modalu czatu --- */}
        <div ref={proofRef} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <StatusRail visible={visible} typing={typing} />
          </div>

          <div className="relative">
            <FloatingChat visible={visible} typing={typing} />
          </div>
        </div>

        {/* --- CTA (dół, wyśrodkowany - po dowodzie) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-14 md:mt-20"
        >
          <Link href="/uslugi/automatyzacje-ai/chatboty-ai/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
              Zobacz chatboty AI
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <button
            onClick={handleOpenChat}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-full hover:bg-white/5 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <MessageSquare size={18} className="text-blue-400 group-hover:text-blue-300" />
            Przetestuj konsultanta
          </button>
        </motion.div>

      </div>
    </section>
  );
}
