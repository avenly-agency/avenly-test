'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden selection:bg-blue-500/30 text-white">
      
      {/* --- TŁO --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          {/* Siatka w tle */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* GLITCH TEXT EFFECT */}
        <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[12rem] md:text-[16rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none"
        >
            404
        </motion.h1>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative -mt-12 md:-mt-20"
        >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Houston, mamy problem.
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10">
                Strona, której szukasz, zaginęła w cyberprzestrzeni lub została przeniesiona do innej galaktyki.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-2">
                        <Home size={18} />
                        Wróć do bazy
                    </button>
                </Link>
                <Link href="/kontakt">
                    <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2">
                        <ArrowLeft size={18} />
                        Zgłoś awarię
                    </button>
                </Link>
            </div>
        </motion.div>

      </div>
    </div>
  );
}