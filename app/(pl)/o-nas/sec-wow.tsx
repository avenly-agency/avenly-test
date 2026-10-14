'use client';

import type { CSSProperties, ReactNode, RefObject } from 'react';
import { BRAND_TINT, type Tint } from './page-sky';
import './sec-wow.css';

// „DLA KOGO PRACUJEMY” - rama sceny „Portal” i barwy klientów (2026-10-13). Właściciel po czterech pierwszych wersjach
// sekcji: „niby spoko, ale potrzebuję czegoś pasującego i oddającego taki efekt wow jak wszędzie” - brakowało im żywej
// mgławicy w barwach klienta, światła i szkła.
// Od tego samego dnia mgławica jest JEDNA na całą podstronę (page-sky.tsx; właściciel: „tła jakoś dziwne są: jest
// u góry, potem jest jakieś inne, potem następną sekcję jeszcze inne”): scena nie ma już własnego płótna, własnej czerni
// ani wygaszeń krawędzi. Kadr sceny ma atrybut data-sky (blask staje wokół niego), a jego data-tint zmienia się
// z klientem na ekranie: czerwień RKS → złoto Kardysia → pomarańcz Mcentrum → błękit marki przy „Twojej firmie”.
// Tu zostały: przypięta rama sceny (ekran 100lvh, kompozycja w 100svh - jak wejście) oraz barwy i akcenty klientów
// (te same liczby co lib/i18n/home/realizacje.ts i lib/i18n/projects.ts).

/** Barwy mgławicy [jasna, głęboka] klientów - jak `tint` w sekcji Realizacje na stronie głównej. */
const TINTS: Record<string, Tint> = {
  'klub-sportowy': [[0.86, 0.16, 0.13], [0.34, 0.03, 0.08]],
  'grawerstwo-kardys': [[0.86, 0.62, 0.30], [0.42, 0.05, 0.08]],
  mcentrumfizjoterapia: [[1.0, 0.52, 0.08], [0.40, 0.16, 0.02]],
};
/** Akcent klienta jako „r g b” (drobne detale: obwódka kadru, strzałka linku) - jak `accent` w lib/i18n/projects.ts. */
const ACCENTS: Record<string, string> = {
  'klub-sportowy': '226 58 50',
  'grawerstwo-kardys': '219 164 92',
  mcentrumfizjoterapia: '251 146 60',
};
/** Barwa mgławicy pozycji (bez nazwy = „Twoja firma” - kolor marki). */
export const tintOf = (slug?: string): Tint => (slug && TINTS[slug]) || BRAND_TINT;
export const accentOf = (slug?: string) => (slug && ACCENTS[slug]) || '59 130 246';

type DivRef = RefObject<HTMLDivElement | null>;

/** Przypięta scena: ekran 100lvh, kompozycja `fit` 100svh. `len` = długość przewijania w vh. Bez własnego tła -
    za sceną stoi mgławica podstrony. */
export function WowStage({ pin, stage, fit, len, children }: {
  pin: DivRef; stage: DivRef; fit: DivRef; len: number; children: ReactNode;
}) {
  return (
    <div ref={pin} className="on-4-pin" style={{ '--len': len } as CSSProperties}>
      <div ref={stage} className="on-4-stick">
        <div ref={fit} className="on-4-fit">{children}</div>
      </div>
    </div>
  );
}
