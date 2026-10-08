import { Instrument_Serif } from 'next/font/google';

// Krój MARKI KLIENTA w przykładowym sklepie w kadrze (podstrona „Sklep internetowy”, chat 10). Właściciel 2026-10-02:
// „chcę, żeby też było pokazane, że to nie template sklep, tylko customowy pod markę” - sklep w kadrze ma własną
// typografię (szeryfowy krój nagłówków), a nie Inter strony Avenly. Tylko na tej podstronie, bez preloadu (tekst
// w kadrze nigdy nie jest LCP), jedna odmiana + kursywa. Klasa `.variable` na korzeniu podstrony ustawia --sk-serif.
export const brandSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--sk-serif',
  preload: false,
});
