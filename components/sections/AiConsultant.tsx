'use client';

import { motion } from 'framer-motion';
import { Bot, Zap, Globe, BarChart3, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Przykładowa rozmowa do animacji
const CHAT_SEQUENCE = [
  { id: 1, role: 'user', text: "Hej, szukam systemu do rezerwacji wizyt." },
  { id: 2, role: 'ai', text: "Cześć! 👋 Jasne, mogę Ci w tym pomóc. Interesuje Cię integracja z kalendarzem Google czy system dedykowany?" },
  { id: 3, role: 'user', text: "Wolałbym coś dedykowanego pod moją klinikę." },
  { id: 4, role: 'ai', text: "Rozumiem. Mamy gotowy moduł dla branży medycznej. Chcesz zobaczyć demo? 🚀" }
];

export function AiConsultant() {
  
  // Funkcja otwierająca widget Voiceflow
  const handleOpenChat = () => {
    // Sprawdzamy czy Voiceflow jest załadowany na stronie
    if ((window as any).voiceflow) {
      (window as any).voiceflow.chat.open();
    } else {
      console.warn("Widget Voiceflow nie jest jeszcze załadowany.");
      // Opcjonalnie: Tutaj możesz dodać alert, jeśli skryptu jeszcze nie ma
    }
  };

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden" aria-labelledby="ai-consultant-heading">
      
      {/* --- TŁO DEKORACYJNE --- */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
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

            <h2 id="ai-consultant-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Zatrudnij pracownika, <br />
              który <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">nigdy nie śpi.</span>
            </h2>

            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Twój nowy konsultant AI obsługuje klientów 24/7, mówi w 50 językach i nigdy nie bierze urlopu. 
              Zwiększ konwersję i odciąż dział obsługi klienta dzięki inteligentnej automatyzacji.
            </p>

            {/* Lista korzyści */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: Zap, label: "Odpowiedź w 0.2 sekundy" },
                { icon: Globe, label: "Obsługa 50+ języków" },
                { icon: BarChart3, label: "+40% do konwersji" },
                { icon: CheckCircle2, label: "Dostępność 24/7/365" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Przycisk 1: Kontakt */}
              <Link href="/kontakt">
                <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                  Wdróż AI u siebie
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              {/* Przycisk 2: Otwórz Czat (Voiceflow) */}
              <button 
                onClick={handleOpenChat}
                className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-full hover:bg-white/5 hover:border-blue-500/50 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <MessageSquare size={18} className="text-blue-400 group-hover:text-blue-300" />
                Przetestuj Konsultanta
              </button>
            </div>
          </motion.div>


          {/* --- PRAWA STRONA: SYMULACJA UI --- */}
          <div className="relative">
             {/* Efekt Glow pod telefonem */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl transform rotate-3 scale-95" />

            {/* Kontener Telefonu/Chatu */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-w-md mx-auto"
            >
                {/* Header Chatu */}
                <div className="bg-[#111] p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                <Bot size={20} />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Avenly AI Assistant</h3>
                            <p className="text-xs text-blue-400">Online • Odpisuje natychmiast</p>
                        </div>
                    </div>
                    {/* Kliknięcie w ikonę chatu w headerze symulacji też może otwierać prawdziwy czat */}
                    <div onClick={handleOpenChat} className="p-2 rounded-full hover:bg-white/5 cursor-pointer transition-colors">
                        <MessageSquare size={18} className="text-slate-500 hover:text-white" />
                    </div>
                </div>

                {/* Obszar Wiadomości */}
                <div className="p-6 h-[400px] flex flex-col gap-4 overflow-hidden relative">
                     {/* Gradient maskujący na górze */}
                     <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />

                     {CHAT_SEQUENCE.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 1.5 + 0.5, duration: 0.4 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg
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
                        transition={{ delay: CHAT_SEQUENCE.length * 1.5 + 1, duration: 0.5 }}
                        className="flex items-center gap-1 mt-auto ml-2"
                     >
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></span>
                     </motion.div>
                </div>

                {/* Input (Atrapa - po kliknięciu otwiera prawdziwy czat) */}
                <div className="p-4 border-t border-white/5 bg-[#111] cursor-pointer" onClick={handleOpenChat}>
                    <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-3 group hover:border-blue-500/30 transition-colors">
                        <span className="text-slate-500 text-sm group-hover:text-slate-400">Zapytaj o wycenę...</span>
                        <div className="ml-auto w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
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