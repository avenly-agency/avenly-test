'use client';

import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { css, flag, seg } from './shared';
import './poster.css';

// O NAS - „PLAKAT”: sekcja, która pojawia się po wjeździe w gwiazdę (koniec wejścia „Panorama”). Prefiks on-po-.
// WYBÓR WŁAŚCICIELA 2026-10-12 („wybieram plakat, dostosuj do mobile”) z propozycji Z głębi / Plakat / Cięcie zdania /
// Tunel / dotychczasowa kolumna (pozostałe: docs/archiwum/o-nas-2026-10/endings.*).
// Kadr jak plakat filmu: etykieta, ogromny nagłówek na całą szerokość wrappera (słowa wysuwają się spod maski jedno
// po drugim razem z przewijaniem), w stopce kadru opis przy lewej krawędzi wrappera i przycisk przy prawej.
// Telefon: nagłówek w stosie krótkich linii (rozmiar z szerokości i z wysokości małego okna), opis i przycisk pod
// nim, całość między nawigacją a bąblem czatu.
// Zasada z rundy 13: sekcja pojawia się dopiero PO przelocie przez ostatni powidok gwiazdy. Scena wejścia woła
// zarejestrowanego „malarza” z `v` = ile vh przewinięto od tego momentu (ujemne = jeszcze trwa wjazd).
// Bez JS / ograniczony ruch: zwykły blok - etykieta, h1, opis, przycisk.

/** O ile vh plakat wydłuża przypiętą scenę wejścia (choreografia słów + postój; także dłuższe zdania EN). */
export const POSTER_EXTRA = 95;
export type PosterPaint = (v: number) => void;

const STEP = 5.5, WORD = 16; // vh między startami kolejnych słów i droga jednego słowa

/** Krycie + widoczność i lekki wjazd z dołu, bez przestrzelenia. */
const rise = (el: Element | null, o: number, dy = 18) => {
  css(el, 'opacity', o.toFixed(3));
  css(el, 'visibility', o < 0.002 ? 'hidden' : 'visible');
  css(el, 'transform', o >= 0.9995 ? 'none' : `translate3d(0, ${((1 - o) * dy).toFixed(2)}px, 0)`);
};
/** Słowa w maskach (pary z twardą spacją zostają razem - dzielimy tylko po zwykłej spacji). */
const maskWords = (s: string) => s.split(' ').map((w, i) => (
  <Fragment key={i}><span className="on-mask on-po-m"><span className="on-po-w">{w}</span></span>{' '}</Fragment>
));

export function Poster({ t, locale, register }: {
  t: ONasDict['intro']; locale: Locale; register: (fn: PosterPaint | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null), label = useRef<HTMLDivElement>(null), tail = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLElement[] | null>(null);
  useEffect(() => {
    register((v) => {
      const el = root.current;
      if (!el) return;
      const ws = (words.current ??= Array.from(el.querySelectorAll<HTMLElement>('.on-po-w')));
      const after = 6 + ws.length * STEP; // opis rusza, gdy ostatnie słowo jest w drodze
      css(el, 'visibility', v > 0 ? 'visible' : 'hidden');
      flag(el, 'data-on', v > after); // klikalny, gdy treść stoi
      rise(label.current, seg(v, 0, 10), 10);
      ws.forEach((w, i) => {
        const e = seg(v, 2 + i * STEP, 2 + i * STEP + WORD);
        css(w, 'transform', e >= 0.9995 ? 'none' : `translateY(${((1 - e) * 112).toFixed(2)}%)`);
      });
      rise(tail.current, seg(v, after, after + 16));
    });
    return () => register(null);
  }, [register]);
  // inny tekst nagłówka (przełącznik wersji w dev) = inne słowa w maskach - lista słów od nowa
  useEffect(() => { words.current = null; }, [t.title, t.titleAccent]);
  return (
    <div ref={root} className="on-po">
      <div ref={label} className="on-label"><SectionLabel align="start">{t.label}</SectionLabel></div>
      <h1 id="on-h1" className="on-po-h">
        <span className="on-po-s">{maskWords(t.title)}</span>{' '}
        <span className="on-po-s im-accent">{maskWords(t.titleAccent)}</span>
      </h1>
      <div ref={tail} className="on-po-tail">
        <p className="on-lead">{t.lead}</p>
        <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="on-cta">
          {t.cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
