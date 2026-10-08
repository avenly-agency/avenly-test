import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji Testimonials (homepage). WZORZEC jak hero.ts:
 * - interface XxxDict z samymi stringami / zagnieżdżonymi obiektami-tablicami stringów,
 * - export xxxDict: Record<Locale, XxxDict>,
 * - EN = copy marketingowe wg PRODUCT.md (benefit voice, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk).
 *
 * Bez oceny "5,0" i gwiazdek (2026-09-28, decyzja właściciela: słaby social proof). Opinie NIE
 * zasilają już JSON-LD (2026-09-30: Review bez AggregateRating = błąd w Search Console,
 * szczegóły w components/sections/Testimonials.tsx).
 * Opinie są PRAWDZIWE (profil Google): treść i autorzy bez zmian, także literówki
 * (cytujemy słowo w słowo). Imiona autorów identyczne w obu językach.
 *
 * `keyWord` = słowo, które występuje w KAŻDEJ opinii danego języka (sekcja zakreśla je w cytatach).
 * Po dodaniu nowej opinii sprawdź, czy to nadal prawda. Zdanie "Wspólne słowo w każdej opinii: polecam."
 * usunięte 2026-09-28 (właściciel: brzmiało źle) - zakreślenie w cytatach zostaje.
 *
 * `date` to data względna skopiowana z Google w styczniu 2026 - dziś nieaktualna,
 * więc sekcja jej nie wyświetla (do uzupełnienia prawdziwą datą).
 */

export interface TestimonialsReview {
  name: string;
  date: string;
  text: string;
}

export interface TestimonialsDict {
  badge: string;
  headingLead: string;
  headingAccent: string;
  /** Podtytuł pod nagłówkiem sekcji. */
  lead: string;
  /** Słowo zakreślane w cytatach. */
  keyWord: string;
  /** Źródło pod każdą opinią. */
  sourceLabel: string;
  /** Dopisek o dosłownym cytowaniu (tłumaczy też literówki w opiniach). */
  verbatimNote: string;
  ctaProfile: string;
  /** Dopisek dla czytników ekranu przy linku zewnętrznym. */
  newTab: string;
  /** Cudzysłowy właściwe dla języka (PL: „…”, EN: “…”). */
  quoteOpen: string;
  quoteClose: string;
  reviews: TestimonialsReview[];
}

export const testimonialsDict: Record<Locale, TestimonialsDict> = {
  pl: {
    badge: 'Opinie',
    headingLead: 'Nie wierz nam na słowo.',
    headingAccent: 'Uwierz klientom.',
    lead: 'Tak o współpracy z Avenly piszą klienci w Google.',
    keyWord: 'polecam',
    sourceLabel: 'Opinia w Google',
    verbatimNote: 'Cytaty bez skrótów i poprawek.',
    ctaProfile: 'Sprawdź opinie w Google',
    newTab: '(otwiera się w nowej karcie)',
    quoteOpen: '„',
    quoteClose: '”',
    reviews: [
      {
        name: 'Maciej Piekarski',
        date: 'tydzień temu',
        text: 'Świetnie współpracowało mi się z tą firmą. Profesjonalne podejście do klienta. Spełniła moje wszystkie oczekiwania. Polecam!',
      },
      {
        name: 'Perwee NLB',
        date: '2 miesiące temu',
        text: 'Szybka i profesjonalna pomoc z strony wlasciciela Avenly bardzo przyjemna rozmowa w trakcie dogadywania szczegółów. Usluga wykonana zgodnie z oczekiwaniami oraz obietnicami zlozonymi przez wykonawcow projektu - Pozdrawiam i polecam Perwee NLB STREFA',
      },
    ],
  },
  en: {
    badge: 'Reviews',
    headingLead: "Don't take our word for it.",
    headingAccent: 'Take theirs.',
    lead: 'Here’s what clients write on Google about working with Avenly.',
    keyWord: 'recommend',
    sourceLabel: 'Google review',
    verbatimNote: 'Quotes translated from Polish, nothing left out.',
    ctaProfile: 'Check the reviews on Google',
    newTab: '(opens in a new tab)',
    quoteOpen: '“',
    quoteClose: '”',
    reviews: [
      {
        name: 'Maciej Piekarski',
        date: 'a week ago',
        text: 'Working with this company was great. A professional approach to the client. They met all my expectations. Highly recommend!',
      },
      {
        name: 'Perwee NLB',
        date: '2 months ago',
        text: 'Fast and professional help from the owner of Avenly, a very pleasant conversation while working out the details. The service was delivered in line with expectations and the promises made by the project team. Regards, and I recommend Perwee NLB STREFA',
      },
    ],
  },
};
