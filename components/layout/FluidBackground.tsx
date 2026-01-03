'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const FluidBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // LOGIKA RUCHU (Scroll powoduje przesuwanie kul)
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "90%"]); // Kula 1 zjeżdża w dół
  const x1 = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);  // Kula 1 leci w prawo
  
  const y2 = useTransform(scrollYProgress, [0, 1], ["100%", "10%"]); // Kula 2 wjeżdża do góry
  const x2 = useTransform(scrollYProgress, [0, 1], ["90%", "20%"]);  // Kula 2 leci w lewo

  return (
    <div ref={ref} className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#050505]">
      
      {/* 1. Statyczny Noise (Ten sam co był w Hero, teraz na całą stronę) */}
      <div className="absolute inset-0 opacity-[0.03] z-[1]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 2. KULA LEWA (Blue) - PARAMETRY Z TWOJEGO "DOBREGO" KODU */}
      <motion.div 
        style={{ top: y1, left: x1 }}
        animate={{
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 20, -10, 0],
            opacity: [0.6, 0.9, 0.6], // TWOJE OPACITY
        }}
        transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        // TWOJE KOLORY (Blue-500/60)
        className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-blue-500/60 blur-[100px] md:blur-[130px] rounded-full mix-blend-screen -translate-x-1/2 -translate-y-1/2"
      />

      {/* 3. KULA PRAWA (Indigo) - PARAMETRY Z TWOJEGO "DOBREGO" KODU */}
      <motion.div 
        style={{ top: y2, left: x2 }}
        animate={{
            scale: [1, 1.1, 0.95, 1],
            rotate: [0, -20, 10, 0],
            opacity: [0.5, 0.8, 0.5], // TWOJE OPACITY
        }}
        transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
        }}
        // TWOJE KOLORY (Indigo-500/60)
        className="absolute w-[50vw] h-[50vw] md:w-[45vw] md:h-[45vw] bg-indigo-500/60 blur-[100px] md:blur-[120px] rounded-full mix-blend-screen -translate-x-1/2 -translate-y-1/2"
      />

    </div>
  );
};