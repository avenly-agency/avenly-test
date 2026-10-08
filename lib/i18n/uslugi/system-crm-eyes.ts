/**
 * Słownik sekcji „Każdy widzi to, co powinien” na podstronie „System CRM” - wersja „Klucz” (eyes-key.tsx), wybrana
 * przez właściciela 2026-10-04 („Trzy okna” i „Tryptyk” usunięte). Same dane, bez funkcji i JSX. Dane przykładowego systemu (role, zadania, zlecenie,
 * liczby) biorą sceny z głównego słownika (`systemCrmCopy`: `roles`, `film.roles`, `app`, `team`).
 * Zasady (PRODUCT.md): głos korzyści, sentence case, bez myślników em / en, bez wymyślonych wyników.
 * Twarde spacje w PL dokłada koordynator.
 */

export interface EyesCopy {
  /** Nagłówek sekcji = punkt Oferty (bez kropki - kropkę w kolorze podstrony dokłada komponent). */
  title: string;
  lead: string;
  /** Co widzi dana rola - krótka linia przy nazwie roli w nagłówku widoku. */
  sees: { owner: string; office: string; staff: string };
  /** „Klucz”: licznik otwartych modułów - „3 {of} 6 {open}”. Narrator tej wersji = `film.roles` z głównego słownika. */
  key: { of: string; open: string };
}

export const eyesCopy: { pl: EyesCopy; en: EyesCopy } = {
  pl: {
    // punkt Oferty
    title: 'Każdy widzi to, co powinien',
    // tylko role wewnątrz firmy (właściciel 2026-10-05: widoku klienta nie można obiecać w każdym systemie)
    lead: 'Ty ustalasz, kto ma dostęp do czego. Tutaj właściciel widzi całą firmę, biuro zlecenia i terminy, a pracownik tylko swoje zadania.',
    sees: { owner: 'cała firma', office: 'zlecenia, klienci i terminy', staff: 'tylko jego zadania na dziś' },
    key: { of: 'z', open: 'otwarte' },
  },
  en: {
    title: 'Everyone sees what they should',
    lead: 'You decide who gets access to what. Here the owner sees the whole business, the office sees jobs and dates, and an employee sees only his own tasks.',
    sees: { owner: 'the whole company', office: 'jobs, clients and dates', staff: 'only his tasks for today' },
    key: { of: 'of', open: 'open' },
  },
};
