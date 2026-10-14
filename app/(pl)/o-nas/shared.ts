'use client';

import { useEffect, useSyncExternalStore, type RefObject } from 'react';

// Drobiazgi podstrony O nas (przebudowa 2026-10-09, prefiks on-). Postęp przypiętych scen i pętla klatek przewijania
// pochodzą ze szkieletu podstron usług (tylko używamy - _usluga/shared.tsx): liczą się w klatce Lenisa, bez schodków.
export { usePin, useFrame, seg, lin, clamp01, openChat } from '../uslugi/_usluga/shared';

const RM = '(prefers-reduced-motion: reduce)';
const subRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

export type Mode = 'live' | 'still' | null;
/** 'live' = pełny ruch (sceny przypięte do przewijania), 'still' = ograniczony ruch (zwykła strona w stanie końcowym),
    null = serwer i hydratacja (treść schowana do pierwszej klatki po hydratacji; bez JS pokazuje ją <noscript>). */
export const useMode = (): Mode =>
  useSyncExternalStore<Mode>(subRM, () => (window.matchMedia(RM).matches ? 'still' : 'live'), () => null);

/** Interpolacja liniowa. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Atrybut tylko przy zmianie (geometria SVG pisana co klatkę). */
export const attr = (el: Element | null | undefined, name: string, v: string) => {
  if (el && el.getAttribute(name) !== v) el.setAttribute(name, v);
};

/** Zapis właściwości stylu tylko przy zmianie (sceny piszą co klatkę - bez zbędnych przeliczeń stylu). */
export const css = (el: Element | null | undefined, prop: string, v: string) => {
  if (!el) return;
  const s = (el as HTMLElement).style;
  if (s.getPropertyValue(prop) !== v) s.setProperty(prop, v);
};

/** Atrybut-flaga (obecny / brak) tylko przy zmianie. */
export const flag = (el: Element | null | undefined, name: string, on: boolean) => {
  if (!el || el.hasAttribute(name) === on) return;
  if (on) el.setAttribute(name, ''); else el.removeAttribute(name);
};

/** Tekst tylko przy zmianie. */
export const text = (el: Element | null | undefined, v: string) => {
  if (el && el.textContent !== v) el.textContent = v;
};

/** Element wszedł na ekran (raz): atrybut data-in. Wejście gra potem samo, na czas (zasada właściciela: odsłona bez
    przypięcia rusza przy wejściu elementu na ekran i gra do końca - nie zostaje w połowie). */
export const useEnter = (ref: RefObject<HTMLElement | null>, on: boolean, amount = 0.2) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.setAttribute('data-in', ''); io.disconnect(); } },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, on, amount]);
};

/** Interpolacja klatek kluczowych kamery (smoothstep między sąsiednimi klatkami). */
export const keyframes = <K extends string>(p: number, keys: ({ p: number } & Record<K, number>)[], props: K[]) => {
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].p) i++;
  const a = keys[i], b = keys[i + 1];
  const x = Math.min(1, Math.max(0, (p - a.p) / Math.max(1e-6, b.p - a.p)));
  const e = x * x * (3 - 2 * x);
  const out = {} as Record<K, number>;
  for (const k of props) out[k] = a[k] + (b[k] - a[k]) * e;
  return out;
};
