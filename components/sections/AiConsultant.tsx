'use client';

import { motion } from 'framer-motion';
import { Bot, Zap, Globe, BarChart3, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const CHAT_SEQUENCE = [
  { id: 1, role: 'user', text: "Hej, jak możecie usprawnić mój biznes?" },
  { id: 2, role: 'ai', text: "Cześć! 👋 Wdrażamy inteligentnych asystentów, którzy automatyzują obsługę klienta i sprzedaż. Co jest Twoim priorytetem?" },
  { id: 3, role: 'user', text: "Chcę, żeby klienci szybciej dostawali odpowiedzi." },
  { id: 4, role: 'ai', text: "Jasne. Nasz AI-Agent odpowiada w czasie rzeczywistym, 24/7, na każdym kanale. 🚀" }
];

export function AiConsultant() {
  
  const handleOpenChat = () => {
    if ((window as any).voiceflow) {
      (window as any).voiceflow.chat.open();
    } else {
      console.warn("Widget Voiceflow nie jest jeszcze załadowany.");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#050505] relative overflow-hidden" aria-labelledby="ai-consultant-heading">
      
      {/* --- TŁO DEKORACYJNE --- */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* --- LEWA STRONA: COPYWRITING --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-6">
              <Bot size={14} />
              Powered by Voiceflow
            </div>

            <h2 id="ai-consultant-heading" className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Zatrudnij pracownika, <br />
              który <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">nigdy nie śpi.</span>
            </h2>

            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
              Twój nowy konsultant AI obsługuje klientów 24/7, mówi w wielu językach i nigdy nie bierze urlopu. 
              Zwiększ satysfakcję klientów i odciąż swój zespół dzięki inteligentnej automatyzacji.
            </p>

            {/* Lista korzyści */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: Zap, label: "Odpowiedź w 0.2 sekundy" },
                { icon: Globe, label: "Wsparcie wielojęzyczne" },
                { icon: BarChart3, label: "Wzrost efektywności" },
                { icon: CheckCircle2, label: "Dostępność 24/7/365" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500 shrink-0">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/kontakt" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                  Wdróż AI u siebie
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button 
                onClick={handleOpenChat}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-full hover:bg-white/5 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageSquare size={18} className="text-blue-400 group-hover:text-blue-300" />
                Przetestuj Konsultanta
              </button>
            </div>
          </motion.div>


          {/* --- PRAWA STRONA: SYMULACJA UI --- */}
          <div className="relative mt-8 lg:mt-0">
             {/* Efekt Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl transform rotate-3 scale-95" />

            {/* Kontener Telefonu/Chatu */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-md mx-auto"
            >
                {/* Header */}
                <div className="bg-[#111] p-4 md:p-6 border-b border-white/5 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                <Bot size={18} className="md:w-5 md:h-5" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Avenly AI Assistant</h3>
                            <p className="text-[10px] md:text-xs text-blue-400">Online • Odpisuje natychmiast</p>
                        </div>
                    </div>
                    <div onClick={handleOpenChat} className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors">
                        <MessageSquare size={18} className="text-slate-500 hover:text-white" />
                    </div>
                </div>

                {/* Obszar Wiadomości - ZMNIEJSZONA WYSOKOŚĆ NA DESKTOPIE */}
                {/* ZMIANA TUTAJ: md:h-[360px] (było 400px) */}
                <div className="p-4 md:p-6 h-[350px] md:h-[360px] flex flex-col justify-end gap-3 md:gap-4 overflow-hidden relative">
                     
                     {/* Gradient maskujący na górze */}
                     <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

                     {CHAT_SEQUENCE.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.8 + 0.3, duration: 0.4 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} shrink-0 z-0`}
                        >
                            <div className={`
                                max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-lg
                                ${msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-[#1a1a1a] text-slate-200 border border-white/5 rounded-bl-none'}
                            `}>
                                {msg.text}
                            </div>
                        </motion.div>
                     ))}

                     {/* Animacja "Pisania..." */}
                     <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: CHAT_SEQUENCE.length * 0.8 + 0.6, duration: 0.5 }}
                        className="flex items-center gap-1 ml-2 mt-1 shrink-0"
                     >
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-600 rounded-full animate-bounce"></span>
                     </motion.div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-[#111] cursor-pointer relative z-20" onClick={handleOpenChat}>
                    <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-3 group hover:border-blue-500/30 transition-colors">
                        <span className="text-slate-500 text-xs md:text-sm group-hover:text-slate-400">Zapytaj o wdrożenie...</span>
                        <div className="ml-auto w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}