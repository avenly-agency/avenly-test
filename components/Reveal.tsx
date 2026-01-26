'use client';

import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const Reveal = ({ children, width = "100%", delay = 0.2 }: Props) => {
  return (
    // overflow: visible jest ważny, żeby nie ucinało cieni (np. na przyciskach)
    <div style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 }, // Element jest niżej i niewidoczny
          visible: { opacity: 1, y: 0 }, // Element wjeżdża na miejsce
        }}
        initial="hidden"
        whileInView="visible" // Automatycznie odpala gdy element wejdzie w widok
        viewport={{ once: true, margin: "-50px" }} // Margines, żeby animacja nie startowała zbyt wcześnie na samym dole ekranu
        transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};