'use client';

import type { Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { Ending } from './ending';
import { Faq } from './faq';
import { HeroPan } from './heroes';
import { Offer } from './offer';
import { PageSky } from './page-sky';
import { PrinciplesLight } from './principles-light';
import { SecClientsPortal } from './sec-clients-portal';
import { Sky } from './sky';
import { useMode } from './shared';
import './o-nas.css'; // style podstrony we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md), prefiks on-

// O NAS - przebudowa od zera 2026-10-09 na nowym logo (AVENLY przecięte linią z gwiazdą), sceny sterowane
// przewijaniem. Układ strony (właściciel liczy „sekcje” tak, jak pojawiają się na ekranie):
//   1. wejście „Panorama z cięciem” (heroes.tsx) - wybór właściciela 2026-10-09, potwierdzony 2026-10-12,
//   2. sekcja po wjeździe w gwiazdę = „Plakat” (poster.tsx, część tej samej przypiętej sceny) - wybór 2026-10-12,
//   3. „Dla kogo pracujemy” w wersji „Portal” (sec-clients-portal.tsx) - temat i wersja wybrane 2026-10-13
//      („portal zajebisty”): nagłówek jako pierwsze ujęcie sceny, w kadrze prawdziwe strony klientów otwierane przez
//      gwiazdę z logo (jak wjazd w gwiazdę w wejściu),
//   4. „Co robimy” (offer.tsx) - od 2026-10-14 w miejscu usuniętej sekcji „Nasz znak” (konstrukcja logo; właściciel:
//      „sekcje nasz znak wywala i w jej miejsce dajemy nową sekcję”; temat wybrał z trzech): usługi po kolei w kadrze
//      ze stołem rysunków Oferty (od rundy 37 jedno ujęcie na cały ekran z pasem tytułowym). Wersje „Naszego znaku”:
//      docs/archiwum/o-nas-2026-10/nasz-znak/.
//   5. Zasady = „Światło” (principles-light.tsx, wybór 2026-10-14: „światło jest git”): ściana ciemnych słów, które
//      zapala gwiazda z logo; pozostałe wersje: docs/archiwum/o-nas-2026-10/zasady-wersje/.
//   6. FAQ = akordeon (faq.tsx, wybór 2026-10-14: „chodziło mi o akordeon, żebyś zrobił ładnie równo (…) badge trzeba
//      usunąć, dorównać”); pozostałe wersje („Rozmowa”, „Karty”, „Okno asystenta”, „Półka”, „Linia z gwiazdą”):
//      docs/archiwum/o-nas-2026-10/pytania-wersje/.
//   7. Zakończenie = „Przez gwiazdę” (ending.tsx, wybór 2026-10-14: „ostatnia to przez gwiazdę wybieram”); pozostałe
//      wersje: docs/archiwum/o-nas-2026-10/zakonczenie-wersje/.
// Niewybrane wejścia, wersje całej podstrony, propozycje sekcji po wjeździe, odrzucone tematy sekcji 3 i pozostałe
// wersje „Dla kogo pracujemy”: docs/archiwum/o-nas-2026-10/.
// Od 2026-10-14 podstrona nie ma przełączników propozycji (panel dock.tsx zostaje w katalogu na następne rundy).
// SEKCJE 1-3 (wejście, „Plakat”, „Dla kogo pracujemy”) ZAMKNIĘTE 2026-10-13 („zamykamy temat pierwszej oraz drugiej
// sekcji”): teksty tylko ze słownika, bez przełączników. Inne wersje tekstów: docs/podstrony/o-nas.md, rundy 29 i 31.
// TŁO: jedna mgławica na całą podstronę (page-sky.tsx, od 2026-10-13 - właściciel: „tła jakoś dziwne są: jest u góry,
// potem jest jakieś inne, potem następną sekcję jeszcze inne”): płótno przyklejone do okna za całą treścią, blask idzie
// za elementem z data-sky (gwiazda wejścia, kadr „Portalu”), barwa za jego data-tint. Sceny nie mają już własnych teł
// ani własnej czerni. Nieruchome niebo z gwiazd (sky.tsx) zostaje tylko dla ograniczonego ruchu i braku JS.
// Tryby: data-live (pełny ruch), data-still (ograniczony ruch - zwykła strona w stanie końcowym); przed hydratacją
// treść schowana (bez mignięcia układu statycznego), bez JS pokazuje ją <noscript>. Notatki: docs/podstrony/o-nas.md.

const NOSCRIPT = '.on-body,.on-sky{opacity:1!important;animation:none!important}';

export function ONasClient({ t, locale }: { t: ONasDict; locale: Locale }) {
  const mode = useMode();
  const live = mode === 'live';
  const ready = mode !== null;
  return (
    <div className="on" data-live={live ? '' : undefined} data-still={mode === 'still' ? '' : undefined}>
      <noscript><style>{NOSCRIPT}</style></noscript>
      {live ? <PageSky /> : <Sky live={false} />}
      <div className="on-body">
        <HeroPan t={t.intro} locale={locale} live={live} />
        <SecClientsPortal t={t.clients} locale={locale} live={live} />
        <Offer t={t.offer} locale={locale} live={live} />
        <PrinciplesLight t={t.principles} live={live} />
        <Faq t={t.faqSection} faq={t.faq} live={live} ready={ready} />
        <Ending t={t.ending} locale={locale} live={live} />
      </div>
    </div>
  );
}
