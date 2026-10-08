'use client';

import { useSyncExternalStore } from 'react';
import { useReducedPref } from '../../_usluga/shared';

// SPOKOJNY TRYB scen podstrony sklepu: ograniczony ruch ALBO niski ekran (telefon trzymany bokiem, do 520 px wysokości).
// Przypięte sceny potrzebują wysokości okna - w 390 px kadr sceny miał niecałe 100 px. W spokojnym trybie podstrona
// pokazuje wersję bez przypięcia (ta sama, co przy ograniczonym ruchu): kadry w zwykłym układzie, sklep dalej da się
// klikać (przyciski przełączają ekrany od razu), kroki jako lista. W sklep.css ten sam próg: każdy blok ruchu ma
// warunek `(prefers-reduced-motion: no-preference) and (min-height: 521px)`.
const SHORT = '(max-height: 520px)';
const sub = (cb: () => void) => {
  const m = window.matchMedia(SHORT);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

export const useCalm = () => {
  const reduced = useReducedPref();
  const short = useSyncExternalStore(sub, () => window.matchMedia(SHORT).matches, () => false);
  return reduced || short;
};
