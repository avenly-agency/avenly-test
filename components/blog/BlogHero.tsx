'use client';

import { motion, Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function BlogHero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
    >
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        Blog Avenly
      </motion.div>

      <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
        Wiedza, która <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">napędza twój rozwój</span>.
      </motion.h1>

      <motion.p variants={item} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
        Poznaj najnowsze trendy w technologii, designie i marketingu.
        Praktyczne poradniki i analizy, które pomogą Ci wyprzedzić konkurencję.
      </motion.p>
    </motion.div>
  );
}
