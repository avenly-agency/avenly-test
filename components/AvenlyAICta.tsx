'use client';

import { Bot, Sparkles } from 'lucide-react';

export const AvenlyAICta = () => {
  const openVoiceflow = () => {
    // Sprawdzamy czy widget Voiceflow jest dostępny w oknie przeglądarki
    if ((window as any).voiceflow?.chat?.open) {
      (window as any).voiceflow.chat.open();
    } else {
      // Fallback: przewiń do sekcji kontakt, jeśli czat nie działa
      const contactSection = document.getElementById('kontakt');
      if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#080808]">
        {/* Tło Gradientowe */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-blue-900/10 to-transparent opacity-60" />
        <div className="absolute -right-20 -top-20 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-500/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />

        {/* Padding responsywny: p-6 (mobile), p-14 (desktop) */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-14 gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-5 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] shrink-0">
                    <Bot size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        Masz pytania?
                        <Sparkles size={18} className="text-blue-400" />
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                        Nie musisz czekać na maila. Nasz asystent <span className="text-blue-300 font-medium">Avenly AI</span> zna szczegóły techniczne i wyceni wstępnie Twój projekt.
                    </p>
                </div>
            </div>
            
            <button 
                onClick={openVoiceflow}
                className="w-full md:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-white text-black font-bold hover:bg-blue-50 hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] whitespace-nowrap flex items-center justify-center gap-2"
            >
                <Bot size={20} />
                Zapytaj Avenly AI
            </button>
        </div>
    </div>
  );
};