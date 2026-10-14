'use client';

import type { ONasDict } from '@/lib/i18n/o-nas';
import './principles-kit.css'; // prefiks on-pk-

// „W CO WIERZYMY” - KLOCKI SCENY „ŚWIATŁO” (principles-light.tsx, wybór właściciela 2026-10-14). Powstały dla pięciu
// propozycji z tego dnia (pozostałe wersje i pełna wersja tego pliku ze słowami w maskach `Words`:
// docs/archiwum/o-nas-2026-10/zasady-wersje/). Teksty mają jeden zestaw elementów (nagłówek h2 + lista zasad h3):
// bez ruchu / bez JS to zwykły blok z klasami on-pk- (principles-kit.css), pełny ruch układa te same elementy w scenę.

export type Pr = ONasDict['principles'];
export const pad = (n: number) => String(n).padStart(2, '0');
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Smoothstep - ruch dojeżdża i staje (bez odbicia). */
export const sm = (v: number) => { const x = clamp01(v); return x * x * (3 - 2 * x); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Oś przypiętej sceny w vh przewinięcia: postój na nagłówku (h0), potem dla każdej zasady przejście (move) i postój
    (hold). `cam(sv)` = 0 na nagłówku, k na zasadzie k (1..n), wartości pośrednie w przejściu (smoothstep). */
export const axis = (n: number, h0: number, move: number, hold: number) => ({
  len: h0 + n * (move + hold),
  cam: (sv: number) => {
    let c = 0;
    for (let j = 1; j <= n; j++) {
      const a = h0 + (j - 1) * (move + hold);
      if (sv <= a) break;
      c = j - 1 + sm((sv - a) / move);
    }
    return c;
  },
});
