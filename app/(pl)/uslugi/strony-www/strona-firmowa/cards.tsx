'use client';

import { useRef, type CSSProperties } from 'react';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { Depth } from './depth';
import { Drawing, setPlay } from './drawings';
import { clamp01, useFrame, useReducedPref } from '../../_usluga/shared';
import './cards.css'; // style sceny we własnym pliku, prefiksy sf-b- (karta, stos), sf-b-k- (linie rysunku), sf-l- (scenki)

// SCENA 3 - „Fundament skalowania.”: cztery karty (teksty kafli z pierwotnej podstrony), każda z rysunkiem technicznym
// w języku Oferty (drawings.tsx): linie RYSUJĄ SIĘ RAZEM Z PRZEWIJANIEM (--d 0-1 na karcie; kolejność linii --i),
// a po narysowaniu rysunek gra swoją scenkę w pętli 8 s.
// Mechanika 1:1 ze stosu one-page (wzorzec fali 2 - docs/podstrony/usluga-one-page.md, kopia, nic nie importujemy):
// karty nasuwają się jedna na drugą, przykryta cofa się w głąb (--dp) i zostaje po niej zakładka z numerem i hasłem;
// --h (wysoka karta przykleja się dopiero, gdy widać jej dół), --cut (odcięcie części przykrytej - karta jest lekko
// przezroczysta), stała TAB = --sf-tab w cards.css (zmieniać razem).
// Karta: rysunek wprost na karcie po prawej na całej jej wysokości; po lewej zakładka u góry, nazwa i opis u dołu,
// pod rysunkiem jego podpis. Tło karty: czerń + GŁĘBIA (depth.tsx): za rysunkiem żyje świat świecących linii
// w kolorze podstrony, w każdej karcie INNA scena dobrana do treści - Kratownica / Tarasy / Echo / Kryształ.
// Decyzje właściciela z pilota (NIE otwierać na nowo): bez fazy krawędzi, pasów odbicia, bliku w rogu, cienia
// i unoszenia rysunku, bez osobnych boxów pod rysunkiem, bez efektów najechania.
// Bez JS / ograniczony ruch: karty jedna pod drugą, rysunki w całości, bez scenek i bez WebGL.

type Item = CompanyCopy['cases']['items'][number];
const nn = (i: number) => String(i + 1).padStart(2, '0');
/** Wysokość zakładki = krok stosu (o tyle niżej przykleja się każda następna karta). Zmieniać razem z --sf-tab w CSS. */
const TAB = 60;

const Card = ({ it, i, n }: { it: Item; i: number; n: number }) => (
  <li className="sf-b-card" style={{ '--i': i } as CSSProperties}>
    <span className="sf-b-card-bg" aria-hidden="true"><Depth scene={i} /></span>
    <p className="sf-b-meta">
      <span className="sf-b-n" aria-hidden="true"><b>{nn(i)}</b><i> / {nn(n - 1)}</i></span>
      <span className="sf-b-tag">{it.tag}</span>
    </p>
    <div className="sf-b-body">
      <h3 className="sf-b-t">{it.title}</h3>
      <p className="sf-b-d">{it.text}</p>
    </div>
    <figure className="sf-b-art" aria-hidden="true">
      <Drawing index={i} />
      <figcaption>{it.caption}</figcaption>
    </figure>
  </li>
);

export const Cards = ({ t }: { t: CompanyCopy['cases'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const farRef = useRef(false);

  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    const set = (node: HTMLElement, k: string, v: string) => { if (node.style.getPropertyValue(k) !== v) node.style.setProperty(k, v); };
    const vh = window.innerHeight;
    // wydajność (2026-10-05): sekcja daleko od ekranu nic nie liczy - po wyjściu z zasięgu jeszcze jedno pełne
    // przeliczenie (stany końcowe, scenki zatrzymane), potem cisza do powrotu; lista kart pobierana raz
    const sr = el.getBoundingClientRect();
    const far = sr.bottom - frac < -vh || sr.top - frac > vh * 2;
    if (far && farRef.current) return;
    farRef.current = far;
    if (!cardsRef.current.length || !cardsRef.current[0].isConnected) cardsRef.current = Array.from(el.querySelectorAll<HTMLElement>('.sf-b-card'));
    const cards = cardsRef.current;
    // wszystkie odczyty układu PRZED zapisami (dawniej offsetHeight po zapisie zmiennych wymuszał przeliczenie co kartę)
    const rects = cards.map((c) => c.getBoundingClientRect());
    const heights = cards.map((c) => c.offsetHeight);
    cards.forEach((node, i) => {
      const cr = rects[i];
      // wysokość karty dla przyklejenia (wysoka karta przykleja się dopiero, gdy widać jej dół)
      set(node, '--h', `${heights[i]}px`);
      // rysunek rysuje się, gdy karta wjeżdża od dołu
      const d = clamp01((vh * 0.9 - (cr.top - frac)) / (vh * 0.5));
      set(node, '--d', d.toFixed(3));
      // głębokość: ile następnych kart już się nasunęło (1 = następna stoi o zakładkę niżej)
      let depth = 0;
      for (let j = i + 1; j < cards.length; j++) depth += clamp01(1 - (rects[j].top - cr.top - TAB * (j - i)) / (cr.height * 0.9));
      set(node, '--dp', depth.toFixed(3));
      // karty są lekko przezroczyste: część przykrytą przez następną kartę odcinamy (--cut = widoczna wysokość karty
      // w jej własnych px, przed skalą), żeby przez kartę na wierzchu było widać niebo, a nie treść karty pod spodem
      let cut = Infinity;
      for (let j = i + 1; j < cards.length; j++) cut = Math.min(cut, rects[j].top - cr.top);
      const own = cr.height > 0 ? (cut + 1) * (heights[i] / cr.height) : Infinity;
      set(node, '--cut', own < heights[i] ? `${Math.max(0, own).toFixed(1)}px` : '99999px');
      // scenka rysunku gra, gdy karta jest narysowana, na ekranie i nieprzykryta
      const play = d > 0.985 && depth < 0.6 && cr.bottom > 0 && cr.top < vh;
      if ((node.dataset.play === '1') !== play) { node.dataset.play = play ? '1' : '0'; setPlay(node.querySelector('.sf-b-svg'), play); }
    });
  }, !reduced);

  return (
    <section ref={ref} className="sf-b" aria-labelledby="sf-b-h">
      <div className="container mx-auto px-6">
        <h2 id="sf-b-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
        <p className="im-lead sf-b-lead">{t.lead}</p>
        <ol className="sf-b-track">
          {t.items.map((it, i) => <Card key={it.title} it={it} i={i} n={t.items.length} />)}
        </ol>
      </div>
    </section>
  );
};
