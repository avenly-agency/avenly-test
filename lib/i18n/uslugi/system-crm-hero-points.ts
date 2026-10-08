// Słownik sceny głównej „Z punktów” podstrony „System CRM” (scena wybrana przez właściciela 2026-10-04; plik sceny:
// app/(pl)/uslugi/strony-www/system-crm/hero-points.tsx). Od 2026-10-05 okno systemu pojawia się „rozejściem”
// zamiast linii światła - zdania narratora o niej nie mówiły, więc teksty zostają bez zmian.
// Same dane, bez funkcji i JSX. Reszta napisów sceny pochodzi z głównego słownika podstrony
// (`systemCrmCopy`): nagłówek, okno przykładowej firmy, zespół, nazwy modułów i etapów, wiersze zapytań, zadań
// i kalendarza. Tu są tylko zdania narratora oraz dane, których główny słownik nie ma: karty zleceń i tydzień
// w kalendarzu - ułożone tak, żeby zgadzały się z wierszami z `mess` (wycena stołu do piątku, pomiar w czwartek).
// Zasady (PRODUCT.md): głos korzyści, sentence case, bez myślników em / en, dane przykładowe (wymyślona firma).
// Twarde spacje w PL dokłada koordynator podstrony.

export interface HeroPointsCard {
  /** Nazwa zlecenia. */
  t: string;
  /** Klient. */
  c: string;
  /** Kto prowadzi: indeks w `team` głównego słownika (0 biuro, 1 pomiary i montaż, 2 stolarnia). */
  who: number;
  /** Krótki stan albo termin. */
  note: string;
}

export interface HeroPointsCopy {
  /** Zdania narratora sceny (jedno naraz), dokładnie trzy. */
  steps: string[];
  /** Karty zleceń w kolejnych etapach (`board[i]` = etap i z `board.stages` głównego słownika). */
  board: HeroPointsCard[][];
  /** Tydzień w kalendarzu: skróty dni i znaczniki terminów (`day` = indeks dnia w `days`). */
  cal: { days: string[]; marks: { day: number; label: string }[] };
}

export const heroPointsCopy: { pl: HeroPointsCopy; en: HeroPointsCopy } = {
  pl: {
    steps: [
      'Zapytania, klienci, terminy. Dziś każda z tych rzeczy leży gdzie indziej.',
      'System zbiera je w jednym miejscu.',
      // zdania Oferty: „Koniec z arkuszami i karteczkami.” + „Całą firmę widzisz w jednym systemie…”
      'Koniec z arkuszami i karteczkami. Całą firmę widzisz w jednym systemie.',
    ],
    board: [
      [{ t: 'Kuchnia na wymiar', c: 'Ewa M.', who: 0, note: 'ze strony' }],
      [
        { t: 'Stół dębowy', c: 'Jan Nowak', who: 2, note: 'do piątku' },
        { t: 'Zabudowa recepcji', c: 'Biuro Linia', who: 1, note: 'pomiar w czwartek' },
      ],
      [{ t: 'Szafa wnękowa 2,4 m', c: 'Anna K.', who: 2, note: 'w stolarni' }],
      [{ t: 'Regał na książki', c: 'Jan Nowak', who: 1, note: 'zamontowany' }],
    ],
    cal: {
      days: ['pon', 'wt', 'śr', 'czw', 'pt'],
      marks: [{ day: 3, label: '10:00' }, { day: 4, label: 'wycena' }],
    },
  },
  en: {
    steps: [
      'Inquiries, clients, deadlines. Today each of them lives somewhere else.',
      'The system gathers them in one place.',
      'No more spreadsheets and sticky notes. You see the whole business in one system.',
    ],
    board: [
      [{ t: 'Custom kitchen', c: 'Eve M.', who: 0, note: 'from the website' }],
      [
        { t: 'Oak table', c: 'John Novak', who: 2, note: 'by Friday' },
        { t: 'Reception desk', c: 'Linia Office', who: 1, note: 'measuring on Thursday' },
      ],
      [{ t: 'Fitted wardrobe, 2.4 m', c: 'Anna K.', who: 2, note: 'in the workshop' }],
      [{ t: 'Bookshelf', c: 'John Novak', who: 1, note: 'fitted' }],
    ],
    cal: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      marks: [{ day: 3, label: '10:00' }, { day: 4, label: 'quote' }],
    },
  },
};
