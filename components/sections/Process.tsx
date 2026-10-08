'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ProcessDict } from '@/lib/i18n/home/process';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { RibbonProcess } from './process/ribbon';
import { RibbonBackdrop } from './process/backdrop';
import './process/process.css'; // style sekcji we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Sekcja "Proces" (#proces - kotwica na wrapperze w HomeClient). Wybory właściciela 2026-09-27:
// układ = WSTĘGA ("genialna i piękna"), materiał = SZKŁO, tło = GŁĘBIA (szklane wstęgi w oddali).
// process/ribbon.tsx (wstęga + kroki), process/backdrop.tsx (tło), process/silk.ts (szkło, skręt).
export const Process = ({ t, locale = 'pl' }: { t: ProcessDict; locale?: Locale }) => {
  const reduced = useReducedMotion() ?? false;
  return (
    // overflow-x-clip (nie hidden): nic nie wystaje w poziomie, a przyklejone tło działa.
    <section className="pr" aria-label={t.sectionAriaLabel}>
      <RibbonBackdrop reduced={reduced} />
      <div className="pr-layer container mx-auto px-6">
        <header className="pr-head">
          <p className="im-label"><SectionLabel>{t.badge}</SectionLabel></p>
          <h2 className="im-title">
            {t.headingLead}<span className="im-accent">{t.headingAccent}</span>
          </h2>
          <p className="im-lead">{t.lead}</p>
        </header>
      </div>
      <RibbonProcess t={t} reduced={reduced} />
      {/* Zakończenie: jedyne CTA serwisu (PRODUCT.md) - wstęga schodzi prosto na przycisk. */}
      <div className="pr-layer container mx-auto px-6">
        <div className="pr-cta">
          <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="pr-btn">
            {t.cta}
            <ArrowRight aria-hidden="true" />
          </Link>
          <p className="pr-cta-lead">{t.ctaLead}</p>
        </div>
      </div>
    </section>
  );
};
