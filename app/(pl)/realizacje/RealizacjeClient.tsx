'use client';

import { useRef, useState } from 'react';
import { projectsByLocale, workByLocale, type RealizacjeDict, type WorkFilter } from '@/lib/i18n/projects';
import type { Locale } from '@/lib/i18n/locale';
import { ListHero } from './_rl/hero';
import { AllLabel, Depth, Plates, Rows } from './_rl/versions';
import { Sky } from './_rl/sky';
import { useIntro, useLiveRoot, useNavOffset, useReducedPref } from './_rl/shared';
import './_rl/realizacje.css'; // style podstrony we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Lista realizacji (/realizacje i /en/work). Praca równoległa, etap 2 - chat 5 (notatki: docs/podstrony/realizacje.md).
// Nagłówek (pierwszy ekran: tekst pośrodku, wokół kadry w głębi z żywymi stronami klientów, strzałka - _rl/hero.tsx), pod nim realizacje jako
// Plansze (_rl/versions.tsx; wybór właściciela 2026-09-30) w kadrach z czarnego szkła, na końcu „Wszystkie realizacje”:
// siatka z filtrem kategorii - filtr pojawia się dopiero razem z nią (runda 7, właściciel) i przykleja się pod nawigacją,
// dopóki siatka jest na ekranie.
// KLIMAT podstrony = mgławica (_rl/sky.tsx - zamysł sekcji Realizacje ze strony głównej, nie jej układ; wybrana też jako
// tło nagłówka): jedno płótno za całą treścią, ujęcie otwierające, blask i barwy podążają za realizacją na ekranie,
// kursor = czarna dziura (soczewka), kliknięcie = fala.
// Żywy motyw: w kadrach są CAŁE strony klientów i przewijają się razem z Twoim przewijaniem. Dawny kafel
// „Masz pytania?” = przycisk czatu w nagłówku i pusty kadr „Twoja firma może być następna” na końcu listy.
// Wszystkie propozycje wybrane (runda 11) - bez przełączników; kolejne propozycje: panel na dole ekranu (_rl/dock.tsx).

const FILTERS: ('all' | WorkFilter)[] = ['all', 'www', 'shops', 'ai'];

export default function RealizacjeClient({ t, locale }: { t: RealizacjeDict; locale: Locale }) {
  const reduced = useReducedPref();
  const [cat, setCat] = useState<'all' | WorkFilter>('all');
  const rootRef = useRef<HTMLDivElement>(null);
  useLiveRoot(rootRef);
  useNavOffset(rootRef);
  const onSky = useIntro(rootRef);

  const projects = projectsByLocale[locale];
  const all = workByLocale[locale];
  const items = cat === 'all' ? all : all.filter((w) => w.filter === cat);
  // przypięte plansze przy ograniczonym ruchu = zwykłe rzędy bez ruchu
  const Showcase = reduced ? Rows : Plates;

  return (
    <div ref={rootRef} className="rl">
      {/* bez JS wszystko widać od razu (kolejność wejścia czeka na data-go / data-cards) */}
      <noscript><style>{'.rl .rl-line,.rl .rl-in,.rl .rl-hk-in{animation:none!important;transform:none!important;opacity:1!important}'}</style></noscript>
      <Sky onReady={onSky} />
      <ListHero t={t} locale={locale} all={all} reduced={reduced} />

      <section className="rl-list" aria-labelledby="rl-list-h">
        <h2 id="rl-list-h" className="sr-only">{t.gridTitle}</h2>
        <Showcase items={all} all={all} projects={projects} t={t} locale={locale} reduced={reduced} />
      </section>

      {/* Wszystkie realizacje: etykieta, filtr (dopiero tutaj - przyklejony pod nawigacją, dopóki siatka jest na ekranie), siatka. */}
      <section className="rl-all" aria-labelledby="rl-all-h">
        <AllLabel t={t} id="rl-all-h" />
        <div className="rl-filter">
          <div className="rl-filter-bar" role="group" aria-label={t.filterAria}>
            {FILTERS.map((f) => (
              <button key={f} type="button" className="rl-filter-btn" aria-pressed={cat === f} onClick={() => setCat(f)}>
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>
        {items.length === 0 && <p className="rl-empty">{t.emptyState}</p>}
        {/* key = filtr: po zmianie karty montują się od nowa (wstają z głębi jeszcze raz) */}
        <Depth key={cat} items={items} all={all} projects={projects} t={t} locale={locale} reduced={reduced} />
      </section>
      {/* koniec podstrony gaśnie do czerni stopki (mgławica jest przyklejona do okna) */}
      <div className="rl-sky-end" aria-hidden="true" />
    </div>
  );
}
