'use client';

import { Bot, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getServiceTheme } from '@/lib/service-theme';

export const AvenlyAICta = () => {
  const openVoiceflow = () => {
    window.dispatchEvent(new Event("avenly:open-chat"));
  };

  const pathname = usePathname();
  const theme = getServiceTheme(pathname);

  return (
    <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#080808]">
        {/* Tło Gradientowe - per theme color */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(${theme.rgb}, 0.20), rgba(${theme.rgb}, 0.10), transparent)`,
          }}
        />
        <div
          className="absolute -right-20 -top-20 w-50 md:w-75 h-50 md:h-75 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"
          style={{ backgroundColor: `rgba(${theme.rgb}, 0.10)` }}
        />

        {/* Padding responsywny: p-6 (mobile), p-14 (desktop) */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-14 gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-5 md:gap-6">
                <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br ${theme.gradFrom600} ${theme.gradTo600} flex items-center justify-center shrink-0`}
                    style={{ boxShadow: `0 0 30px -5px ${theme.glowRgba}` }}
                >
                    <Bot size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        Masz pytania?
                        <Sparkles size={18} className={theme.text400} />
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                        Nie musisz czekać na maila. Nasz asystent <span className={`${theme.text300} font-medium`}>Avenly AI</span> zna szczegóły techniczne i wyceni wstępnie Twój projekt.
                    </p>
                </div>
            </div>

            <button
                onClick={openVoiceflow}
                className={`w-full md:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-white text-black font-bold ${theme.hoverBg50} hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] whitespace-nowrap flex items-center justify-center gap-2`}
            >
                <Bot size={20} />
                Zapytaj Avenly AI
            </button>
        </div>
    </div>
  );
};
