'use client';

import type { MouseEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import type { Locale } from '@/lib/i18n/locale';
import type { ImpactDict } from '@/lib/i18n/home/impact';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ImpactBackdrop } from './impact/backdrop';
import { StackLayout } from './impact/stack';

// Sekcja "Dlaczego Avenly" (4 korzyści) - układ STOS WARSTW + wizualizacje KONSTELACJE (wybór
// właściciela 2026-09-26). Pliki:
// - impact/shader.tsx - shadery kart (warstwice + VIZ_GLSL z konstelacją) i ShaderCanvas,
// - impact/viz.tsx    - konstelacje (nakładki z podpisami, sceny dla shadera, historie krok po kroku),
// - impact/stack.tsx  - układ stosu (karty przyklejone jedna na drugiej),
// - impact/backdrop.tsx - tło sekcji: mapa warstwic w odcieniu karty na ekranie,
// - lib/i18n/home/impact.ts - teksty PL / EN.

export const Impact = ({ t, locale = 'pl' }: { t: ImpactDict; locale?: Locale }) => {
  const reduced = useReducedMotion() ?? false;
  const lenis = useLenis();

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: reduced ? 0 : customDelay, ease: [0.16, 1, 0.3, 1] }, // expo-out jak reszta strony
    }),
  };

  const onOffer = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const elem = document.getElementById('oferta');
      if (elem && lenis) {
        lenis.scrollTo(elem, { offset: -100, duration: 1.5, lock: false, force: true });
      }
    }
  };

  return (
    // overflow-x-clip (NIE hidden): overflow: hidden łamie position: sticky kart stosu.
    <section aria-label={t.sectionAriaLabel} className="im-sec relative w-full py-24 lg:py-32 bg-[#050505] overflow-x-clip">
      <ImpactBackdrop />
      <div className="container mx-auto px-6 relative z-10">
        {/* NAGŁÓWEK - etykieta sekcji (SectionLabel), tytuł w pisowni zdaniowej, jednolity akcent */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <motion.div custom={0} variants={fadeInUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
            <p className="im-label"><SectionLabel>{t.badge}</SectionLabel></p>
            <h2 className="im-title">
              {t.headingLine1}<br />
              <span className="im-accent">{t.headingAccent}</span>
            </h2>
            <p className="im-lead">
              {t.leadLine1}<br className="hidden md:inline" />{' '}
              {t.leadPre}<strong>{t.leadStrong}</strong>{t.leadPost}
            </p>
          </motion.div>
        </div>

        <StackLayout t={t} locale={locale} reduced={reduced} onOffer={onOffer} />
      </div>
    </section>
  );
};
