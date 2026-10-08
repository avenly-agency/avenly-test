import { Geist_Mono } from 'next/font/google';

/**
 * Geist Mono - JEDNA deklaracja dla całego serwisu (next/font deduplikuje pliki, ale
 * jedna instancja = jeden zestaw @font-face w CSS). Używany wyłącznie w sekcjach
 * z chrome'em mono: Hero (linia dowodów, etykiety konstelacji) i Realizacje (chrome,
 * numery indeksu). preload:false - tekst mono nigdy nie jest LCP, font dociąga się
 * bez blokowania. Klasa `.variable` na sekcji ustawia --font-geist-mono lokalnie.
 */
export const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: false,
});
