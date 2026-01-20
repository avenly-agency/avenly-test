'use client';

import { useRef } from 'react';

export const StatsSpotlight = ({ stats }: { stats: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const cards = containerRef.current.getElementsByClassName("stat-card");
    
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 group/grid"
    >
        {stats.map((stat, i) => (
            <div 
                key={i} 
                // To są style z sekcji "O nas" (pancerny border + glow)
                className="stat-card group relative rounded-2xl bg-white/10 p-[1px] overflow-hidden transition-all duration-300"
            >
                {/* GLOW LAYER (Światło za myszką) */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover/grid:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.8), transparent 40%)`
                    }}
                />

                {/* CONTENT LAYER (Czarne tło) */}
                <div className="relative h-full rounded-[calc(1rem-1px)] bg-[#050505]/95 p-6 backdrop-blur-xl z-10 flex flex-col justify-center border border-white/5">
                    {/* Wewnętrzny delikatny glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[calc(1rem-1px)]" />
                    
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
                            {stat.value}
                        </div>
                        <div className="text-[10px] md:text-xs text-blue-400 uppercase tracking-widest font-bold">
                            {stat.label}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};