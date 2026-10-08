import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik KATALOGU USŁUG: /uslugi oraz strona kategorii /uslugi/strony-www (+ EN).
 * Praca równoległa, etap 2 - chat 2 (PRACA-ROWNOLEGLA.md). Notatki: docs/podstrony/uslugi.md.
 *
 * Nazwy usług, zdania korzyści (`line`), trzy konkrety (`points` = legenda 1-3 rysunku) i podpisy kroków
 * scenki (`story`) katalog bierze z `servicesSectionDict.items` (lib/i18n/services.ts - Oferta na stronie
 * głównej), bo boxy usług pokazują te same animowane rysunki co Oferta. Tu są tylko teksty samego katalogu.
 *
 * Zasady copy (PRODUCT.md): głos korzyści, chwyt, potem konkret, pisownia zdaniowa, bez myślników
 * em / en, jedyne CTA "Bezpłatna konsultacja", liczby tylko obronne (odpowiedź w 24 h, 3-5 dni),
 * bez obietnic bez pokrycia (CMS / WordPress, integracja z kurierami, AI jako pewnik).
 */

// Zakres 'design' (/uslugi/design) usunięty 2026-10-01 - projekt UI/UX nie jest już osobną usługą (decyzja właściciela).
export type CatalogScope = 'hub' | 'www';

export interface CatalogPageHead {
  /** Nazwa strony - ostatni element ścieżki w danych strukturalnych (BreadcrumbList); widocznej etykiety nie ma. */
  label: string;
  /** H1 = jedno zdanie BEZ kropki na końcu - kropkę w kolorze marki dokłada Catalog.tsx (jak w logo „AVENLY.”;
      układ „Kropka”, wybór właściciela 2026-09-30). */
  title: string;
  lead: string;
}

export interface CatalogDict {
  pages: Record<CatalogScope, CatalogPageHead>;

  /** Nagłówek siatki kart (h2, tylko dla czytników ekranu). */
  gridTitle: string;

  /** Opis pod nazwą usługi na KAFLU katalogu (klucz = `href` karty z app/data/services.ts). Tylko dla usług, które
      właściciel kazał zmienić (2026-10-01); pozostałe kafle biorą pierwsze zdanie `line` z Oferty. Oferta na stronie
      głównej zostaje przy swoich tekstach. Do 2 linii na komputerze (ok. 95 znaków). */
  tiles: Record<string, string>;

  details: string;
  soon: string;
  allServices: string;
  cta: string;
  undecided: string;
  undecidedBody: string;
  /** Podpisy trzech kroków scenki na rysunku boxu „Nie wiesz, co wybrać?” (cta-art.tsx). */
  undecidedStory: string[];
  ctaNote: string;
  legendAria: string;

  /** Filtr kategorii nad kartami (/uslugi). */
  filterAll: string;
  filterAria: string;

  breadcrumbHome: string;
  breadcrumbServices: string;
}

export const catalogDict: Record<Locale, CatalogDict> = {
  pl: {
    pages: {
      hub: {
        label: 'Usługi',
        title: 'Od strony po system',
        lead: 'Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.',
      },
      www: {
        label: 'Strony WWW',
        title: 'Strona, która rośnie z\u00A0firmą',
        lead: 'Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.',
      },
    },

    gridTitle: 'Każda usługa w działaniu',

    tiles: {
      '/uslugi/strony-www/one-page': 'Wszystko, co klient chce wiedzieć przed kontaktem, mieści się na jednej stronie.',
      '/uslugi/automatyzacje-ai/chatboty-ai': 'Asystent zna Twoją ofertę i odpisuje od razu, więc klient nie czeka do rana.',
      '/uslugi/marketing/audyt-wydajnosci-seo': 'Dowiadujesz się, co spowalnia Twoją stronę i co przeszkadza jej w Google.',
    },

    details: 'Zobacz szczegóły',
    soon: 'Wkrótce',
    allServices: 'Wszystkie usługi',
    cta: 'Bezpłatna konsultacja',
    undecided: 'Nie wiesz, co wybrać?',
    undecidedBody: 'Znasz swoją firmę i to wystarczy. Opowiedz nam o niej, a dopasujemy najlepsze rozwiązanie dla Twojego biznesu.',
    undecidedStory: ['Opowiadasz o firmie i celu.', 'Usługi dobrane do Twojego celu.', 'Dostajesz plan z wyceną i terminem.'],
    ctaNote: 'Bez zobowiązań, odpowiedź w 24 h.',
    legendAria: 'Co dostajesz',

    filterAll: 'Wszystkie',
    filterAria: 'Filtruj usługi według kategorii',

    breadcrumbHome: 'Strona główna',
    breadcrumbServices: 'Usługi',
  },
  en: {
    pages: {
      hub: {
        label: 'Services',
        title: 'From a website to a system',
        lead: 'Clients judge your business before they get in touch. Here you decide what they see.',
      },
      www: {
        label: 'Websites',
        title: 'A website that grows with you',
        lead: 'Clients look you up online before they call. Your website decides whether they do.',
      },
    },

    gridTitle: 'Every service in action',

    tiles: {
      '/uslugi/strony-www/one-page': 'Everything a client wants to know before getting in touch fits on one page.',
      '/uslugi/automatyzacje-ai/chatboty-ai': "The assistant knows your offer and replies right away, so clients don't wait until morning.",
      '/uslugi/marketing/audyt-wydajnosci-seo': 'You find out what slows your site down and what holds it back in Google.',
    },

    details: 'See details',
    soon: 'Coming soon',
    allServices: 'All services',
    cta: 'Free consultation',
    undecided: 'Not sure what to pick?',
    undecidedBody: "You know your business, and that's enough. Tell us about it and we'll find the best fit for your business.",
    undecidedStory: ['You describe your business and your goal.', 'Services matched to your goal.', 'You get a plan with a quote and a timeline.'],
    ctaNote: 'No strings attached. A reply within 24 hours.',
    legendAria: 'What you get',

    filterAll: 'All',
    filterAria: 'Filter services by category',

    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
  },
};
