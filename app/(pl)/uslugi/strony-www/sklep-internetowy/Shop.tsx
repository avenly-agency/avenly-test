'use client';

import { useMemo } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ShopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { createChoice, ProposalSwitcher, useChoice } from '@/components/utils/proposals';
import { Dock } from '../../_usluga/dock';
import { ServiceEnding, ServiceShell } from '../../_usluga/parts';
import { BrandCrowd } from './brand';
import { BuyDuo, BuyFrame, BuyStrip } from './buy';
import { Cases } from './cases';
import { brandSerif } from './fonts';
import { Night } from './night';
import { Scope } from './scope';
import './sklep.css'; // style podstrony we własnym pliku (praca równoległa), prefiks sk-

// Podstrona usługi „Sklep internetowy” - przebudowa na wzorcu one-page (praca równoległa, etap 3, fala 2 - chat 10).
// Poziom 2-3 na osi „sprzedaż”: sceną jest ZAKUP (produkt -> koszyk -> płatność -> paczka -> zamówienie u właściciela),
// a sklep w kadrze da się kliknąć. Szkielet wspólny: app/(pl)/uslugi/_usluga/ (tylko używamy).
//   1. Zakup    (buy.tsx)   - pierwszy ekran + przypięta scena; RUNDA 1: trzy propozycje do wyboru (panel na dole ekranu),
//   2. Nie szablon. Twoja marka. (brand.tsx) - „Na tle szablonów” (wybór właściciela 2026-10-02): ściana szablonów
//      w perspektywie, kamera wlatuje w sklep marki,
//   2b. Sklep, który nie gubi klienta (cases.tsx) - STOS czterech kart z rysunkami i scenkami (wybór właściciela
//       2026-10-02: „wybieram stos”; propozycja „Lejek” usunięta),
//   3. Gotowy na każdą skalę (night.tsx) - przypięta scena: to samo zamówienie oczami właściciela (panel nocą),
//   4. Co dokładnie otrzymujesz? (scope.tsx) - zakres z terminem na linii wymiarowej i pokazem w kadrze,
//   zakończenie - „Zacznijmy od rozmowy.” (szkielet).
// Stary ShopClient.tsx i `shopDict` zostają na dysku jako źródło tekstów (nieimportowane).
// Notatki: docs/podstrony/usluga-sklep-internetowy.md.

const SCENES = [
  { id: 'witryna', label: 'Witryna' },
  { id: 'duet', label: 'Dwa ekrany' },
  { id: 'tasma', label: 'Taśma' },
] as const;
type Scene = (typeof SCENES)[number]['id'];
const sceneChoice = createChoice<Scene>('avenly-sklep-scena', SCENES, 'witryna');
const DEV = process.env.NODE_ENV !== 'production';

// RUNDA 11 - COPYWRITING sekcja po sekcji (właściciel 2026-10-02: „teraz copywriting sekcja po sekcji, zaczynaj od
// hero, propozycje ulepszenia”). Propozycje tekstu HERO (nagłówek + opis) do przełączania w panelu na dole ekranu:
// tylko dev i tylko PL - produkcja i EN pokazują tekst ze słownika. Po wyborze tekst trafia do słownika
// (lib/i18n/uslugi/sklep-internetowy.ts, PL + EN), a przełącznik znika.
// Nagłówek musi mieścić się w DWÓCH wierszach na telefonie: dłuższy wiersz do 8,3 em (dzielnik w sklep.css) -
// wszystkie propozycje zmierzone (7,5-8,1 em). Twarde spacje wpisane ręcznie (słownikowe typo() tu nie działa).
const HERO = [
  { id: 'obecny', label: 'Obecny' },
  { id: 'spisz', label: 'Gdy śpisz' },
  { id: 'wraca', label: 'Się wraca' },
  { id: 'kroki', label: 'Bez kroków' },
  { id: 'marka', label: 'Pod markę' },
] as const;
type HeroView = (typeof HERO)[number]['id'];
const heroChoice = createChoice<HeroView>('avenly-sklep-hero-tekst', HERO, 'spisz');
const HERO_COPY: Record<Exclude<HeroView, 'obecny'>, { title: string; lead: string }> = {
  spisz: {
    title: 'Sprzedajesz, nawet gdy śpisz',
    lead: 'Klient wybiera, płaci BLIK-iem lub kartą i\u00a0dostaje potwierdzenie. Ty rano widzisz zamówienia w\u00a0jednym panelu.',
  },
  wraca: {
    title: 'Sklep, do\u00a0którego się\u00a0wraca',
    lead: 'Wygląda jak Twoja marka i\u00a0prowadzi klienta prosto do zakupu. Płatność BLIK-iem lub kartą, zamówienia w\u00a0jednym panelu.',
  },
  kroki: {
    title: 'Zakupy bez zbędnych kroków',
    lead: 'Produkt, koszyk, dostawa, płatność. Klient przechodzi je bez zakładania konta, a\u00a0Ty dostajesz opłacone zamówienie.',
  },
  marka: {
    title: 'Sklep szyty pod Twoją markę',
    lead: 'Nie szablon, jaki ma tysiąc innych firm. Własny wygląd, prosty zakup i\u00a0płatność BLIK-iem lub kartą.',
  },
};

export function Shop({ t: dict, locale = 'pl' }: { t: ShopCopy; locale?: Locale }) {
  const scene = useChoice(sceneChoice);
  const hero = useChoice(heroChoice);
  const t = useMemo<ShopCopy>(
    () => (DEV && locale === 'pl' && hero !== 'obecny' ? { ...dict, head: { ...dict.head, ...HERO_COPY[hero] } } : dict),
    [dict, locale, hero],
  );
  return (
    <ServiceShell className={`sk ${brandSerif.variable}`}>
      {scene === 'witryna' && <BuyFrame key="witryna" t={t} locale={locale} />}
      {scene === 'duet' && <BuyDuo key="duet" t={t} locale={locale} />}
      {scene === 'tasma' && <BuyStrip key="tasma" t={t} locale={locale} />}
      <BrandCrowd t={t} />
      <Cases t={t.cases} />
      <Night t={t} />
      <Scope t={t} />
      <ServiceEnding t={t.ending} locale={locale} />
      {DEV && (
        <Dock>
          <ProposalSwitcher label="Scena zakupu" items={SCENES} value={scene} pick={sceneChoice.set} />
          {locale === 'pl' && <ProposalSwitcher label="Hero - tekst" items={HERO} value={hero} pick={heroChoice.set} />}
        </Dock>
      )}
    </ServiceShell>
  );
}
