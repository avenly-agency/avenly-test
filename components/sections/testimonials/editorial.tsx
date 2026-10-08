'use client';

import type { TestimonialsDict } from '@/lib/i18n/home/testimonials';
import { OpHead, ProfileLink, Words, nn, useReveal } from './shared';

// Sekcja "Opinie" - REDAKCJA (wybór właściciela 2026-09-27 z 4 propozycji; potem "podrasuj, dodaj
// animowane cudzysłowy ze Sceny i duszy, żeby nie była miałka"). Opinie złożone jak rozkładówka
// magazynu: pierwsza opinia jako wielki cytat, druga w węższej szpalcie. Cała część z cytatami stoi
// "w cudzysłowie": linia nad nią zaczyna się rysowanym znakiem “, linia pod nią kończy się znakiem ”
// (po narysowaniu co kilka sekund obiega je ostra plamka światła). Wspólne słowo obu opinii
// ("polecam") jest zakreślone w cytatach. Każda strefa wchodzi, gdy sama pojawi się na ekranie.
// Bez JS / reduced motion: od razu całość, bez plamki. 2026-09-28: bez ogromnego "5,0" i gwiazdek
// (decyzja właściciela: słaby social proof) i bez zdania "Wspólne słowo w każdej opinii" - nagłówek
// w jednej kolumnie.

// Znak cudzysłowu w polu 40 × 68: okrągła główka u dołu i ogonek zwężający się do ostrza w prawo do
// góry (kształt szeryfowy); dwa obok siebie = “, obrócone o 180° = ”.
const MARK = 'M5 48C5 26 16 11 34 4C24 10 17 20 16.5 33.6A15 15 0 1 1 5 48Z';

const QuoteMark = ({ close = false }: { close?: boolean }) => (
  <svg className={`op-ed-mark${close ? ' op-ed-mark--close' : ''}`} viewBox="0 0 84 68" aria-hidden="true" focusable="false">
    <g transform={close ? 'rotate(180 42 34)' : undefined}>
      {[0, 44].map((x) => (
        <g key={x} transform={x ? `translate(${x} 0)` : undefined}>
          <path className="op-ed-mark-ink" d={MARK} pathLength={1} />
          <path className="op-ed-mark-trace" d={MARK} pathLength={1} />
        </g>
      ))}
    </g>
  </svg>
);

/** Linia redakcyjna ze znakiem cudzysłowu: “ na początku (nad cytatami) albo ” na końcu (pod nimi). */
const MarkRule = ({ close = false }: { close?: boolean }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`op-ed-rule${close ? ' op-ed-rule--end' : ''}`} aria-hidden="true">
      {!close && <QuoteMark />}
      <i className="op-ed-line" />
      {close && <QuoteMark close />}
    </div>
  );
};

export const EditorialTestimonials = ({ t }: { t: TestimonialsDict }) => {
  const top = useReveal<HTMLDivElement>();
  const quotes = useReveal<HTMLDivElement>();
  const foot = useReveal<HTMLDivElement>();

  return (
    <div className="op-ed container mx-auto px-6">
      <div ref={top} className="op-ed-top">
        <OpHead t={t} align="start" className="op-ed-head" />
      </div>

      <MarkRule />

      <div ref={quotes} className="op-ed-quotes">
        {t.reviews.map((r, i) => (
          <figure key={r.name} className={`op-ed-q${i === 0 ? ' op-ed-q--lead' : ''}`}>
            <p className="op-ed-idx" aria-hidden="true">{nn(i)}</p>
            <blockquote className="op-ed-text">
              <p><Words text={r.text} open={t.quoteOpen} close={t.quoteClose} mark={t.keyWord} /></p>
            </blockquote>
            <figcaption className="op-ed-by">
              <i aria-hidden="true" />
              <cite>{r.name}</cite>
              <span className="op-ed-src">{t.sourceLabel}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <MarkRule close />

      <div ref={foot} className="op-ed-foot">
        <p className="op-ed-note">{t.verbatimNote}</p>
        <ProfileLink t={t} />
      </div>
    </div>
  );
};
