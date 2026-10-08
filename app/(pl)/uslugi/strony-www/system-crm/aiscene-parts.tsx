'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { Steps, setSteps } from '../../_usluga/parts';
import { lin, seg, usePin, useSeen } from '../../_usluga/shared';

// Części sceny „Tory” sekcji „AI to opcja, nie obowiązek” (aiscene-lanes.tsx; style cr6- w aiscene.css). Jedna
// wybrana wersja sekcji - właściciel 2026-10-04: „wybieram tory, ale zrób ładniej to” (wersje „Dwa dni”
// i „Do akceptacji” usunięte razem z plikami):
//   PinShell - przypięta scena sterowana przewijaniem. Nagłówek sekcji stoi w przyklejonym ekranie; na początku drogi
//              (najazd kamery, --cam 0-1) odjeżdża w górę i gaśnie, a okno systemu wjeżdża spod niego na cały ekran
//              i pojawia się narrator (jedno zdanie naraz - Steps ze szkieletu pod .cr-narr). Dalej opowieść
//              (q 0-1) - rozgrywa ją scena w `onFrame`. Okno, które nie mieści się w wysokości sceny, jest
//              pomniejszane (--fit, nigdy powyżej 1 - tekst zostaje ostry) i wyśrodkowane w polu sceny (--slack).
//              Atrybut data-pin na sekcji = scena jest przypięta i w ruchu (wszystkie stany „przed” w CSS są pod nim),
//   Reel     - bęben: napis zmienia się prawdziwym ruchem w pionie (położenie podaje zmienna CSS --rp); to, co się
//              w scenie POJAWIA, wchodzi „rozejściem” (.cr-bloom, decyzja właściciela 2026-10-05) - bez linii światła
//              i przycięć prostą krawędzią,
//   useStill - scena stoi: ograniczony ruch albo ekran za niski, żeby okno z torami zmieściło się w nim czytelnie
//              (telefon trzymany poziomo, bardzo niski telefon). Wysokość to svh z miarki .cr6-svh - nie zmienia się
//              przy chowaniu paska adresu, więc scena nie przeskakuje między trybami w czasie przewijania,
//   put / flag / wipe - zapis do DOM tylko przy zmianie wartości i sprzątanie po scenie.
// Bez JS / gdy scena stoi: zwykła sekcja, scena w stanie końcowym (reguły podstawowe w CSS), zdania jako lista.

/** Część drogi przypiętej sceny, którą zajmuje najazd kamery; reszta to opowieść (q). */
const CAM = 0.14;
/** Najmniejsza skala dopasowania okna do wysokości sceny (pismo 14 px zostaje wtedy powyżej 12 px). */
const MIN_FIT = 0.86;
const RM = '(prefers-reduced-motion: reduce)';
/** Tory jeden pod drugim (telefon, tablet) - ten sam warunek co w aiscene.css i aiscene-lanes.tsx. */
const STACK = '(max-width: 1023.98px)';
/** Najniższy ekran (svh w px), na którym scena jest przypięta. Telefon / tablet: kolejka sześciu kart, linia między
    torami, dwa nagłówki i pasek okna mają razem co najmniej ok. 435 px, a miejsce na okno to wysokość ekranu minus
    208 px - poniżej 625 px pismo po dopasowaniu schodziłoby wyraźnie pod 12 px. Komputer: próg jak dotąd. */
const MIN_SVH_STACK = 625, MIN_SVH_WIDE = 521;

const subRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
/** true = bez przypięcia i bez ruchu. `probe` = miarka wysokości ekranu (.cr6-svh, renderuje ją PinShell).
    Serwer, pierwszy render i czas do pierwszego pomiaru: true - sekcja jest wtedy zwykłą sekcją w stanie końcowym. */
export const useStill = (probe: RefObject<HTMLElement | null>) => {
  const reduced = useSyncExternalStore(subRM, () => window.matchMedia(RM).matches, () => false);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    const m = window.matchMedia(STACK);
    const check = () => setFits(el.offsetHeight >= (m.matches ? MIN_SVH_STACK : MIN_SVH_WIDE));
    // pierwszy pomiar przychodzi z obserwatora; potem tylko przy zmianie svh (obrót, zmiana okna) i układu torów
    const ro = new ResizeObserver(check);
    ro.observe(el);
    m.addEventListener('change', check);
    return () => { ro.disconnect(); m.removeEventListener('change', check); };
  }, [probe]);
  return reduced || !fits;
};

export const put = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
export const flag = (el: HTMLElement, name: string, on: boolean) => { if (el.hasAttribute(name) !== on) el.toggleAttribute(name, on); };
/** Scena stoi: zdejmuje to, co zapisała (zmienne CSS i atrybuty) - zostaje stan końcowy z CSS. */
export const wipe = (el: HTMLElement | null, keys: string[], attrs: string[] = []) => {
  if (!el) return;
  keys.forEach((k) => el.style.removeProperty(k));
  attrs.forEach((a) => el.removeAttribute(a));
};

/** Bęben. Czytnik ekranu dostaje tylko pozycję końcową (stan po odegraniu sceny); `hidden` = cały bęben jest ozdobą. */
export const Reel = ({ items, className, hidden }: { items: string[]; className?: string; hidden?: boolean }) => (
  <span className={className ? `cr6-reel ${className}` : 'cr6-reel'} aria-hidden={hidden ? true : undefined}>
    <span className="cr6-reel-in">
      {items.map((x, i) => <span key={i} aria-hidden={!hidden && i < items.length - 1 ? true : undefined}>{x}</span>)}
    </span>
  </span>
);

export const PinShell = ({ t, headId, len, steps, cuts, onFrame, still, probe, children }: {
  t: SystemCrmCopy;
  headId: string;
  /** Długość drogi sceny w vh. */
  len: number;
  /** Zdania narratora (jedno naraz). */
  steps: string[];
  /** Progi q (0-1), od których zaczyna się kolejne zdanie (o jeden mniej niż zdań). */
  cuts: number[];
  /** Klatka opowieści: q = postęp po najeździe kamery (0-1). Pisze wprost do DOM. */
  onFrame: (q: number) => void;
  /** Scena stoi (wynik `useStill` - liczy go scena, bo sama też sprząta po sobie). */
  still: boolean;
  /** Miarka wysokości ekranu dla `useStill`. */
  probe: RefObject<HTMLElement | null>;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const stepEls = useRef<HTMLElement[]>([]);
  useSeen(headRef, 0.3);

  useEffect(() => {
    const root = ref.current, head = headRef.current, obj = objRef.current, fit = fitRef.current;
    if (!root || !head || !obj || !fit) return;
    stepEls.current = Array.from(root.querySelectorAll<HTMLElement>('.cr6-narr .sv-step'));
    if (still) {
      wipe(root, ['--cam', '--head-h', '--fit', '--slack'], ['data-far', 'data-flat']);
      stepEls.current.forEach((li) => wipe(li, ['--f'], ['data-on']));
      return;
    }
    // okno startuje tuż pod nagłówkiem (jego wysokość zna tylko pomiar), nigdy nie jest wyższe niż miejsce w scenie
    // i stoi w nim wyśrodkowane (--slack = wolne miejsce nad oknem po pomniejszeniu)
    const measure = () => {
      put(root, '--head-h', `${head.offsetHeight}px`);
      const room = obj.clientHeight, h = fit.offsetHeight;
      const k = h > 0 ? Math.min(1, Math.max(MIN_FIT, room / h)) : 1;
      put(root, '--fit', k.toFixed(4));
      // pełne piksele: okno w skali 1 nie może stać na połówce piksela (rozmyty tekst)
      put(root, '--slack', `${Math.max(0, Math.round((room - h * k) / 2))}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(head); ro.observe(obj); ro.observe(fit);
    return () => ro.disconnect();
  }, [still]);

  usePin(ref, (p, el) => {
    const cam = seg(p, 0.012, CAM);
    put(el, '--cam', cam.toFixed(4));
    // nagłówek po odjeździe jest niewidoczny - nie może zasłaniać sceny ani łapać zaznaczenia
    flag(el, 'data-far', cam > 0.6);
    // po najeździe okno stoi bez przekształceń 3D - tekst rastrowany ostro
    flag(el, 'data-flat', cam > 0.999);
    const q = lin(p, CAM, 1);
    let active = 0;
    while (active < cuts.length && q >= cuts[active]) active++;
    setSteps(stepEls.current, active, steps.map((_, i) => lin(q, i === 0 ? 0 : cuts[i - 1], i < cuts.length ? cuts[i] : 1)));
    onFrame(q);
  }, !still);

  return (
    <section
      ref={ref} className="cr6 cr6-pin" data-pin={still ? undefined : ''}
      style={{ '--len': len } as CSSProperties} aria-labelledby={headId}
    >
      <i ref={probe} className="cr6-svh" aria-hidden="true" />
      <div className="cr6-stage">
        <div className="container mx-auto px-6 cr6-in">
          <div ref={headRef} className="cr6-head">
            <h2 id={headId} className="im-title sv-h2">{t.ai.title}<span className="im-accent">.</span></h2>
            <p className="im-lead cr-sec-lead">{t.ai.lead}</p>
          </div>
          <div ref={objRef} className="cr6-obj">
            <div ref={fitRef} className="cr6-fit">
              <div className="cr6-tilt">{children}</div>
            </div>
          </div>
          <div className="cr6-narr cr-narr" style={{ '--n': steps.length } as CSSProperties}>
            <Steps items={steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
