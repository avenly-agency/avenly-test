'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ArrowUpRight } from 'lucide-react';
import { FcGoogle } from "react-icons/fc"; // Ikona Google w kolorze
import Image from 'next/image';
import Link from 'next/link';

// DANE OPINII (Tutaj wklej prawdziwe treści z Google Maps)
const reviews = [
  {
    id: 1,
    name: "Maciej Piekarski", // Zmień na prawdziwe imię
    date: "tydzień temu",
    stars: 5,
    text: "Świetnie współpracowało mi się z tą firmą. Profesjonalne podejście do klienta. Spełniła moje wszystkie oczekiwania. Polecam!",
    initials: "MP", // Do awatara, jeśli nie masz zdjęcia
  },
  {
    id: 2,
    name: "Perwee NLB", // Zmień na prawdziwe imię
    date: "2 miesiące temu",
    stars: 5,
    text: "Szybka i profesjonalna pomoc z strony wlasciciela Avenly bardzo przyjemna rozmowa w trakcie dogadywania szczegółów. Usluga wykonana zgodnie z oczekiwaniami oraz obietnicami zlozonymi przez wykonawcow projektu - Pozdrawiam i polecam Perwee NLB STREFA",
    initials: "PN", // Do awatara, jeśli nie masz zdjęcia
  }
];

export const Testimonials = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      
      {/* TŁO DEKORACYJNE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col items-center text-center mb-16">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
           >
              <Star size={12} fill="currentColor" />
              Zaufanie Klientów
           </motion.div>
           
           <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
           >
              Co mówią o nas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Partnerzy Biznesowi?
              </span>
           </motion.h2>
        </div>

        {/* GRID OPINII */}
        {/* Używamy max-w-4xl i centrowania, bo są tylko 2 opinie. 
            Jak będzie więcej, zmień grid-cols-1 md:grid-cols-2 na lg:grid-cols-3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Ikona cytatu w tle */}
              <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12 rotate-180 group-hover:text-blue-500/10 transition-colors" />

              <div>
                {/* Gwiazdki */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Treść */}
                <p className="text-slate-300 leading-relaxed mb-8 relative z-10">
                  &quot;{review.text}&quot;
                </p>
              </div>

              {/* Stopka autora */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                {/* Awatar (Initials) */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
                  {review.initials}
                </div>
                
                <div>
                  <h4 className="text-white font-bold text-sm">{review.name}</h4>
                  <div className="flex items-center gap-2">
                    <FcGoogle size={14} />
                    <span className="text-xs text-slate-500">Opinia Google • {review.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA - ZOSTAW OPINIĘ */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
        >
            <Link 
                href="https://www.google.com/search?hl=pl&authuser=4&sxsrf=ANbL-n4_Dj5ouwzlPtWTQBfgkDkMID5EiQ:1768411940244&q=Avenly&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQ4PrWAsOBw8i-AdENLDMltPyDfnixmqcoeh5B8zB5N_Xy6umInAzO7tr22xmuyk4yXqH7M%3D&uds=ALYpb_mEM8gY9NEgOivIwhaEBbWUwxFOjCVFdTOsh8L5T8WVn81-xdUIVD8rxXLGYn-Q6zPJdnxoUppquz3vpQBLul3HisvdFxGwoZauBn-pxflujIOdCZA&aic=0" 
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium group cursor-pointer"
            >
                <FcGoogle size={20} />
                Zobacz profil firmy i zostaw opinię
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
        </motion.div>

      </div>
    </section>
  );
};