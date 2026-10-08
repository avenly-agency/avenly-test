'use client';

import type { Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { createChoice, useChoice, ProposalSwitcher } from '@/components/utils/proposals';
import { OnIntro } from './intro';
import { LOOKS, type Look } from './intro-looks';
import { KorektaAccent, KorektaPage } from './variants/korekta';
import { ListPage } from './variants/list';
import { RelayPage } from './variants/relay';
import { ManifestPage } from './variants/manifest';
import './o-nas.css'; // style strony we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md)

// Strona O nas (/o-nas, /en/about-us). Praca równoległa, etap 2 (chat 1): cztery propozycje
// z przełącznikiem widocznym tylko w `npm run dev`. Po wyborze właściciela zostaje jedna,
// reszta (pliki w ./variants, style w o-nas.css, pola słownika) do usunięcia.
// Wspólne otwarcie (./intro.tsx, decyzje właściciela 2026-09-29): napis AVENLY, przelot kamery
// w literę i plansza tytułowa z nagłówkiem strony; niżej jeden żywy motyw na propozycję.
// Bez GSAP, bez rozmyć i szkła.

const LAYOUTS = [
  { id: 'korekta', label: 'Korekta' },
  { id: 'list', label: 'List' },
  { id: 'relay', label: 'Bez pośredników' },
  { id: 'manifest', label: 'Manifest' },
] as const;
type Layout = (typeof LAYOUTS)[number]['id'];
const layoutChoice = createChoice<Layout>('avenly-o-nas-layout', LAYOUTS, 'korekta');
// Wejście (napis AVENLY + pole światła) - osobny przełącznik, łączy się z każdym układem.
const lookChoice = createChoice<Look>('avenly-o-nas-intro', LOOKS, 'kropka');
const DEV = process.env.NODE_ENV !== 'production';

export function ONasClient({ t, locale = 'pl' }: { t: ONasDict; locale?: Locale }) {
  const layout = useChoice(layoutChoice);
  const look = useChoice(lookChoice);
  return (
    <div className="on" data-layout={layout}>
      <OnIntro t={t} locale={locale} look={look} accent={layout === 'korekta' ? <KorektaAccent t={t} /> : undefined} />
      {layout === 'korekta' && <KorektaPage key="korekta" t={t} />}
      {layout === 'list' && <ListPage key="list" t={t} />}
      {layout === 'relay' && <RelayPage key="relay" t={t} />}
      {layout === 'manifest' && <ManifestPage key="manifest" t={t} />}
      {DEV && (
        <div className="on-switch">
          <ProposalSwitcher label="Wejście" items={LOOKS} value={look} pick={lookChoice.set} />
          <ProposalSwitcher label="Układ" items={LAYOUTS} value={layout} pick={layoutChoice.set} />
        </div>
      )}
    </div>
  );
}
