/**
 * Teksty sceny „Tory” w sekcji „AI to opcja, nie obowiązek” na podstronie „System CRM”
 * (praca równoległa, etap 3; komponent: aiscene-lanes.tsx). JEDNA wybrana wersja sekcji - decyzja właściciela
 * z 2026-10-04: „wybieram tory, ale zrób ładniej to”. Teksty wersji „Dwa dni” i „Do akceptacji” usunięte.
 *
 * Nagłówek, opis, nazwy torów („Robisz Ty” / „Robi AI”), znacznik „Opcja: AI”, zdanie „AI przygotowuje,
 * Ty akceptujesz.” i sześć zadań przychodzą z głównego słownika podstrony (`systemCrmCopy.ai`). Tu są tylko napisy
 * samej sceny: skąd przyszło każde zadanie, stany zadania i zdania narratora.
 *
 * TELEFON (rachunek w aiscene.css): linia `details` i stany mają ok. 215 px na ekranie 320 px - do ok. 34 znaków;
 * zdania narratora mają ok. 250 px szerokości na 390 px i ok. 220 px na 320-360 px - do ok. 70 znaków, żeby zostały
 * w trzech liniach (dłuższe zdanie nachodziłoby na okno z torami).
 *
 * Zasady (PRODUCT.md): AI zawsze jako OPCJA („jeśli chcesz”, „na życzenie”), system działa w pełni bez AI, decyzje
 * (wycena, kolejność prac) zostają u człowieka; głos korzyści, sentence case, bez myślników em / en, bez wymyślonych
 * wyników. Dane przykładowe: wymyślona „Pracownia Dąb” (klientka Anna K., pomiar w czwartek o 10:00).
 * Same dane - bez funkcji i JSX. Twarde spacje w PL dokłada koordynator podstrony (`typo()` w głównym słowniku).
 */

export interface AiSceneCopy {
  /** Linia pod tytułem każdego z sześciu zadań (kolejność = `systemCrmCopy.ai.tasks`): skąd zadanie przyszło
      i kogo albo czego dotyczy. Krótko - na telefonie musi się zmieścić w jednej linii karty. */
  details: string[];
  /** Stany zadania na torze AI: do zrobienia -> przygotowane, czeka na akceptację -> zaakceptowane przez człowieka. */
  todo: string;
  ready: string;
  approved: string;
  /** Stan zadania, którego AI nie przejmuje (decyzja człowieka). */
  yours: string;
  /** Zdania narratora (jedno naraz); ostatnie zdanie sceny to `systemCrmCopy.ai.note`. */
  steps: string[];
}

export const aiSceneCopy: { pl: AiSceneCopy; en: AiSceneCopy } = {
  pl: {
    details: [
      'Ze strony · Anna K., szafa 2,4 m',
      'Z maila · Biuro Linia',
      'Ze zlecenia · Jan Nowak',
      'Z kalendarza · czwartek, 10:00',
      'Ze spotkania · Biuro Linia',
      'Z tablicy zleceń · ten tydzień',
    ],
    todo: 'Do zrobienia',
    ready: 'Do akceptacji',
    approved: 'Zaakceptowane',
    yours: 'Twoja decyzja',
    steps: [
      'System działa w pełni bez AI. Wszystkie zadania są po Twojej stronie.',
      'Automatyzacje AI to opcja. Dokładasz je tylko wtedy, gdy chcesz.',
      'Wtedy żmudne zadania jedno po drugim przechodzą na tor AI.',
      'Decyzje zostają u Ciebie: wycena i to, co robicie najpierw.',
    ],
  },
  en: {
    details: [
      'From the website · Anna K.',
      'From an email · Linia Office',
      'From a job · John Novak',
      'From the calendar · Thursday, 10:00',
      'From a meeting · Linia Office',
      'From the job board · this week',
    ],
    todo: 'To do',
    ready: 'To approve',
    approved: 'Approved',
    yours: 'Your call',
    steps: [
      'The system works fully without AI. Every task is on your side.',
      'AI automations are an option. You add them only if you want to.',
      'Then the tedious tasks move to the AI lane, one by one.',
      'The decisions stay with you: the quote and what comes first.',
    ],
  },
};
