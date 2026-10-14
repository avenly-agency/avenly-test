'use client';

import { useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { css, flag, useEnter } from './shared';
import './scene-kit.css'; // prefiks on-k-

// KLOCKI SCEN O NAS w układzie „Portalu” (wybrany przez właściciela 2026-10-13: tekst po lewej, po prawej cały kadr).
// Powód (2026-10-13, runda 29): osobny nagłówek nad sceną właściciel ocenił dwa razy - przy „Dla kogo pracujemy”
// („jakoś tak seems off”) i przy zasadach („znowu te headingi wyglądają mediocre”). Dlatego nagłówek sekcji jest
// PIERWSZĄ POZYCJĄ TEKSTU sceny (albo pierwszym kafelkiem siatki / lewą kolumną sekcji), a obok od pierwszej chwili stoi
// obraz - sekcja nie zaczyna się samym tekstem na pustym niebie.
//   Scene  - przypięty ekran 100lvh z kompozycją w 100svh (jak wejście i „Portal”), bez własnego tła,
//   Intro  - etykieta „Gwiazda”, h2 spod maski, opis (wejście na czas, gdy nagłówek pojawi się na ekranie),
//   swap   - wymiana pozycji tekstu: jedna naraz, poprzednia odchodzi w górę, następna wchodzi z dołu.

const d = (n: number) => ({ '--d': n }) as CSSProperties;

/** Przypięta scena. `len` = długość przewijania w vh. */
export function Scene({ pin, len, children }: { pin: RefObject<HTMLDivElement | null>; len: number; children: ReactNode }) {
  return (
    <div ref={pin} className="on-k-pin" style={{ '--len': len } as CSSProperties}>
      <div className="on-k-stick">
        <div className="on-k-fit">{children}</div>
      </div>
    </div>
  );
}

/** Nagłówek sekcji wewnątrz sceny / kolumny / siatki (nie osobny blok nad nią). */
export function Intro({ id, label, title, accent, lead, live, className }: {
  id: string; label?: string; title: string; accent?: string; lead?: string; live: boolean; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, live, 0.1);
  return (
    <header ref={ref} className={className ? `on-k-intro ${className}` : 'on-k-intro'}>
      {/* plakietka „Gwiazda” tylko na życzenie - sceny i FAQ od 2026-10-14 jej nie mają */}
      {label && <div className="on-label on-in" style={d(0)}><SectionLabel align="start">{label}</SectionLabel></div>}
      <h2 id={id} className="on-h2">
        <span className="on-mask"><span className="on-rise" style={d(1)}>{title}</span></span>
        {accent && <>{' '}<span className="on-mask"><span className="on-rise im-accent" style={d(2)}>{accent}</span></span></>}
      </h2>
      {lead && <p className="on-lead on-in" style={d(4)}>{lead}</p>}
    </header>
  );
}

/** Pozycja tekstu sceny: `tin` 0-1 wejście z dołu, `out` 0-1 odejście w górę. Pisze tylko przy zmianie. */
export const swap = (el: Element | null | undefined, tin: number, out: number, dy = 26) => {
  const o = tin * (1 - out);
  css(el, 'opacity', o.toFixed(3));
  css(el, 'visibility', o < 0.002 ? 'hidden' : 'visible');
  css(el, 'transform', o >= 0.9995 ? 'none' : `translate3d(0, ${((1 - tin) * dy - out * dy).toFixed(2)}px, 0)`);
  flag(el, 'data-on', o > 0.6);
};
