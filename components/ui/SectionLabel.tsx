import type { ReactNode } from 'react';

// Etykiety sekcji strony głównej ("Realizacje", "Dlaczego Avenly?", "Proces", "Opinie" ...).
// Wybór właściciela (2026-09-26) spośród 4 propozycji (Gwiazda, Pigułka, Rozdział, Horyzont):
// GWIAZDA - czteroramienne gwiazdki jak "klejnoty" nieba w hero i cienkie linie gasnące na zewnątrz.
// Zasady (PRODUCT.md): zwykły Inter w pisowni zdaniowej, bez rozstrzelonych wersalików i mono, bez
// pulsujących kropek i rozmytych poświat. Tekst etykiety zostaje zwykłym tekstem (czytniki
// ekranu), grafika jest aria-hidden.

const STAR = 'M5 0C5.35 3.3 6.7 4.65 10 5C6.7 5.35 5.35 6.7 5 10C4.65 6.7 3.3 5.35 0 5C3.3 4.65 4.65 3.3 5 0Z';

/** Etykieta sekcji. `align="start"` = etykieta przy lewej krawędzi (gwiazdka, nazwa i linia
    w prawo - bez linii po lewej i drugiej gwiazdki). Rozmiar dziedziczy z rodzica. */
export const SectionLabel = ({ children, align = 'center' }: { children: ReactNode; align?: 'center' | 'start' }) => (
  <span className={`sl${align === 'start' ? ' sl--start' : ''}`}>
    <i className="sl-line" aria-hidden="true" />
    <svg className="sl-star" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d={STAR} /></svg>
    <span className="sl-text">{children}</span>
    <svg className="sl-star sl-star--r" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d={STAR} /></svg>
    <i className="sl-line sl-line--r" aria-hidden="true" />
  </span>
);
