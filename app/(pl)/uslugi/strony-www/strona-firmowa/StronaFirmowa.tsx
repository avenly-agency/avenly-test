'use client';

import type { Locale } from '@/lib/i18n/locale';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { createChoice, ProposalSwitcher, useChoice } from '@/components/utils/proposals';
import { Dock } from '../../_usluga/dock';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { Cards } from './cards';
import { Film } from './film';
import { SiteMap, type MapVersion } from './map';
import { Scope } from './scope';
import './strona-firmowa.css'; // style podstrony we własnym pliku (praca równoległa), prefiks sf-

// Podstrona usługi „Strona firmowa” - przebudowa na wzorcu one-page (praca równoległa, etap 3 - chat 8, fala 2).
// POZIOM 2 hierarchii podstron usług: kadr pokazuje STRUKTURĘ (strona z menu i podstronami, każda usługa ma swoje
// miejsce), dwie przypięte sceny z kamerą, kliknięcia w kadrze. Szkielet: app/(pl)/uslugi/_usluga/ (tylko używany).
//   1. Film      (film.tsx)  - „PIĘTRA” (wybór właściciela 2026-10-02 z: Przelot / Piętra / Trzy wejścia): pierwszy ekran
//                              ze stosem pięter w rzucie aksonometrycznym + przypięta scena, w której kamera zjeżdża
//                              w głąb przez podstrony usług do kontaktu; zapytanie przychodzi z nazwą usługi,
//   2. Mapa      (map.tsx)   - druga przypięta scena: „3 podstrony to dopiero początek” - strona rośnie o kolejne
//                              podstrony, kamera odjeżdża. RUNDA 2: cztery wersje sceny (przełącznik w panelu na dole
//                              ekranu, tylko dev): Wieża / Mapa / Konstelacja / Menu. RUNDA 6: sekcja jako KARTY na całą
//                              sekcję (pages.tsx + makiety mini.tsx), najechanie pokazuje podstronę z bliska - cztery
//                              wersje w przełączniku: Stół / Siatka / Harmonijka / Taśma,
//   3. Stos      (cards.tsx) - „Fundament skalowania”: cztery karty z rysunkami w języku Oferty i światem linii w tle,
//   4. Zakres    (scope.tsx) - lista „co otrzymujesz” z terminem na linii wymiarowej + pokaz każdego punktu w kadrze,
//   zakończenie - „Zacznijmy od rozmowy.” (szkielet).
// Teksty: z pierwotnej wersji podstrony (`corporateDict`), zmiany w tabeli „było -> jest” w notatkach.
// Notatki: docs/podstrony/usluga-strona-firmowa.md. Stary CorporateWebsiteClient.tsx zostaje na dysku, nieimportowany.

// Runda 6: cztery wersje sekcji z kartami (cała sekcja + najechanie). Nowy klucz, żeby dawny wybór z przeglądarki
// właściciela ich nie przykrył. Wersje z rundy 2 (Wieża / Mapa / Konstelacja / Menu) są w map.tsx, poza przełącznikiem.
const MAPS = [
  { id: 'stol', label: 'Stół' },
  { id: 'siatka', label: 'Siatka' },
  { id: 'harmonijka', label: 'Harmonijka' },
  { id: 'tasma', label: 'Taśma' },
] as const satisfies ReadonlyArray<{ id: MapVersion; label: string }>;
const mapChoice = createChoice<MapVersion>('avenly-firmowa-mapa-3', MAPS, 'stol');
const DEV = process.env.NODE_ENV !== 'production';

export function StronaFirmowa({ t, locale = 'pl' }: { t: CompanyCopy; locale?: Locale }) {
  const map = useChoice(mapChoice);
  return (
    <ServiceShell className="sf">
      <Film t={t} locale={locale} />
      <SiteMap key={map} t={t.map} site={t.site} version={map} />
      <Cards t={t.cases} />
      <Scope t={t.scope} site={t.site} />
      <ServiceEnding t={t.ending} locale={locale} />
      {DEV && (
        <Dock>
          <ProposalSwitcher label="3 podstrony to dopiero początek" items={MAPS} value={map} pick={mapChoice.set} />
        </Dock>
      )}
    </ServiceShell>
  );
}
