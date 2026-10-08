import type { ReactElement } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';

// Wspólny kontrakt scen podstrony „System CRM” (runda 3 - sceny piszą osobne pliki, składa je SystemCrm.tsx).
// Każda scena renderuje CAŁĄ swoją sekcję (<section> z nagłówkiem) - scena przypięta może trzymać nagłówek
// w przyklejonym ekranie. Sceny nie są interaktywne (decyzja właściciela 2026-10-04): steruje nimi przewijanie.

export interface SceneProps<X> {
  /** Główny słownik podstrony (przykładowa firma, zespół, zlecenia, role, branże, moduły, zadania AI). */
  t: SystemCrmCopy;
  /** Własne teksty sceny (osobny plik słownika sceny). */
  x: X;
  locale: Locale;
  /** id nagłówka sekcji (h2) - do aria-labelledby na <section>. Scena główna używa h1 z ServiceHead (id „sv-h1”). */
  headId: string;
}

export interface SceneVersion<X> {
  /** Krótki identyfikator wersji (zapis wyboru w localStorage), np. „kurtyna”. */
  id: string;
  /** Polska nazwa wersji w panelu przełączników. */
  label: string;
  Scene: (p: SceneProps<X>) => ReactElement;
}
