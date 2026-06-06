'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ArrowUpRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE } from '@/lib/seo-data';

// DANE OPINII (Tutaj wklej prawdziwe treści z Google Maps)
const reviews = [
  {
    id: 1,
    name: 'Maciej Piekarski',
    date: 'tydzień temu',
    stars: 5,
    text: 'Świetnie współpracowało mi się z tą firmą. Profesjonalne podejście do klienta. Spełniła moje wszystkie oczekiwania. Polecam!',
    initials: 'MP',
  },
  {
    id: 2,
    name: 'Perwee NLB',
    date: '2 miesiące temu',
    stars: 5,
    text: 'Szybka i profesjonalna pomoc z strony wlasciciela Avenly bardzo przyjemna rozmowa w trakcie dogadywania szczegółów. Usluga wykonana zgodnie z oczekiwaniami oraz obietnicami zlozonymi przez wykonawcow projektu - Pozdrawiam i polecam Perwee NLB STREFA',
    initials: 'PN',
  },
];

const GOOGLE_PROFILE = 'https://www.google.com/search?hl=pl&authuser=4&sxsrf=ANbL-n4_Dj5ouwzlPtWTQBfgkDkMID5EiQ:1768411940244&q=Avenly&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQ4PrWAsOBw8i-AdENLDMltPyDfnixmqcoeh5B8zB5N_Xy6umInAzO7tr22xmuyk4yXqH7M%3D&uds=ALYpb_mEM8gY9NEgOivIwhaEBbWUwxFOjCVFdTOsh8L5T8WVn81-xdUIVD8rxXLGYn-Q6zPJdnxoUppquz3vpQBLul3HisvdFxGwoZauBn-pxflujIOdCZA&aic=0';

// JSON-LD: Reviews + AggregateRating dla agencji (pokazuje gwiazdki w SERP)
const reviewsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    reviewCount: reviews.length,
  },
  review: reviews.map((r) => ({
    '@type': 'Review',
    reviewRating: { '@type': 'Rating', ratingValue: r.stars.toString(), bestRating: '5' },
    author: { '@type': 'Person', name: r.name },
    reviewBody: r.text,
    datePublished: '2026-01-01',
    publisher: { '@type': 'Organization', name: 'Google' },
  })),
};

function Stars({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label="5 na 5 gwiazdek">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className="text-amber-400 fill-amber-400" />
      ))}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
      {initials}
    </div>
  );
}

export const Testimonials = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">

      {/* JSON-LD: gwiazdki opinii w SERP. Niewidoczne - czytane tylko przez Google */}
      <JsonLd id="ld-testimonials" data={reviewsJsonLd} />

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
            Zaufanie klientów
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
              partnerzy biznesowi?
            </span>
          </motion.h2>
        </div>

        {/* SPLIT - kotwica zaufania + zróżnicowane cytaty */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center max-w-6xl 3xl:max-w-7xl 4xl:max-w-[88rem] mx-auto mb-14"
        >
          {/* Kotwica */}
          <div className="lg:col-span-2 flex flex-col items-center text-center lg:items-start lg:text-left gap-6">
            <div className="flex items-end gap-4">
              <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-[0.8] tracking-tight">5,0</span>
              <div className="flex flex-col gap-1.5 pb-1.5">
                <Stars />
                <span className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">średnia ocen</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
              Zweryfikowane opinie prosto z profilu Google. Każdy klient poleca dalszą współpracę.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
              <FcGoogle size={18} /> Google Reviews
            </div>
          </div>

          {/* Cytaty - zróżnicowane (NIE identyczne karty) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className={`relative overflow-hidden p-7 md:p-8 rounded-3xl ${i === 0 ? 'bg-[#0b1020] border border-blue-500/25' : 'bg-[#0a0a0a] border border-white/10'}`}
              >
                {i === 0 && <div aria-hidden="true" className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />}
                <Quote aria-hidden="true" className="relative w-8 h-8 text-blue-500/25 mb-4 rotate-180" />
                <p className={`relative text-slate-200 leading-relaxed mb-6 ${i === 0 ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="relative flex items-center gap-3">
                  <Avatar initials={r.initials} />
                  <div>
                    <cite className="block text-white font-semibold text-sm not-italic">{r.name}</cite>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><FcGoogle size={12} /> {r.date}</span>
                  </div>
                  <Stars size={13} className="ml-auto hidden sm:inline-flex" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA - ZOSTAW OPINIĘ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Link
            href={GOOGLE_PROFILE}
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
