'use client';

import type { Locale } from '@/lib/i18n/locale';
import type { OnePageCopy } from '@/lib/i18n/uslugi/one-page';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { Cases } from './cases';
import { Film } from './film';
import { Scope } from './scope';
import './one-page.css'; // style podstrony we własnym pliku (praca równoległa), prefiks one-

// Podstrona usługi „Strona one-page” - PILOT przebudowy podstron usług (praca równoległa, etap 3 - chat 7).
// Szkielet wspólny dla 7 podstron: app/(pl)/uslugi/_usluga/ (korzeń z kolorem podstrony, tło-mgławica, wejście z czerni,
// nagłówek z kropką, szkic z pomiaru treści, podpisy kroków, zakończenie). Tu: sceny i teksty one-page.
// RUNDA 4 (2026-10-01) - nowy koncept po odrzuceniu „Okazu” (właściciel: za mało widowiska, mockup z samych kresek,
// układ jak dokument, sam pomysł nie leży; wzór ruchu: „zrób wszystkie” - Plansze z Realizacji, Panorama z Bloga,
// rysunki z Oferty, hero; w kadrze: zaprojektowana strona one-page). Podstrona = krótki film w trzech scenach:
//   1. Film     (film.tsx)  - pierwszy ekran + przypięta scena z kamerą: kadr ze szkicem podjeżdża i rośnie, szkic
//                             zamienia się w kolorową stronę klienta, strona przewija się do formularza, zapytanie leci,
//   2. Kiedy wystarczy jedna strona (cases.tsx) - STOS czterech kart z rysunkami, które rysują się razem
//                             z przewijaniem (wybór właściciela z czterech wersji: „stos jest fajny”),
//   3. Zakres   (scope.tsx) - lista „co dostajesz”, a obok przyklejony kadr, w którym każdy punkt sam się pokazuje,
//   zakończenie - „Zacznijmy od rozmowy.” i przycisk (szkielet).
// ZAMKNIĘTE 2026-10-02 (właściciel: „super, podstrona dopięta”). Wybory właściciela: kadr w hero „duży, za krawędź
// ekranu”, karty stosu „Lakier” na czerni z minimalną przezroczystością i światem linii w tle, opowieść filmu = droga
// klienta przez gotową stronę (szkic tylko jako obraz). To WZORZEC dla fali 2 - kolejne podstrony kopiują stąd wzorce
// z własnym prefiksem, tego katalogu nie zmieniają.
// Notatki: docs/podstrony/usluga-one-page.md. Dawny OnePageClient.tsx usunięty 2026-10-02 za zgodą właściciela.

export function OnePage({ t, locale = 'pl' }: { t: OnePageCopy; locale?: Locale }) {
  return (
    <ServiceShell className="one">
      <Film t={t} locale={locale} />
      <Cases t={t.cases} />
      <Scope t={t.scope} site={t.site} />
      <ServiceEnding t={t.ending} locale={locale} />
    </ServiceShell>
  );
}
