import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji Impact (homepage, bento 4 kart "Dlaczego Avenly"). WZORZEC jak hero.ts:
 * - interface XxxDict z samymi stringami / zagnieżdżonymi obiektami stringów,
 * - export xxxDict: Record<Locale, XxxDict>,
 * - EN = copy marketingowe wg PRODUCT.md (benefit voice, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk).
 * - 2026-09-28: copy wg zasady "chwyt, potem konkret" - tytuł karty = chwyt (kategorię mówi
 *   już zakładka `kickers`), opis = konkret; lead zapowiada 4 karty w ich kolejności.
 *
 * Uwaga: lead jest rozbity na fragmenty, bo w JSX zawiera <br /> i <strong>
 * (słownik trzyma czysty tekst, znaczniki zostają w komponencie).
 */

export interface ImpactDict {
  sectionAriaLabel: string;
  badge: string;
  headingLine1: string;
  headingAccent: string;
  leadLine1: string;
  leadPre: string;
  leadStrong: string;
  leadPost: string;
  card1Title: string;
  card1Desc: string;
  /** Konstelacja w dużym kafelku (dekoracja, aria-hidden): 3 etapy od ruchu do klienta. */
  card1Flow: [string, string, string];
  card2Title: string;
  card2Desc: string;
  /** Konstelacja asystenta: pytania klientów → asystent → do Ciebie (krótko - wąski kafel od 1024 px). */
  card2Flow: [string, string, string];
  /** Link do podstrony chatbotów (dawny tag wersalikami). */
  card2Tag: string;
  card3CounterAria: string;
  /** Podpis pod wynikiem 98/100. */
  card3CounterLabel: string;
  card3Title: string;
  card3Desc: string;
  card4Title: string;
  card4Desc: string;
  /** Konstelacja bezpieczeństwa: odwiedzający, atak, tarcza (Cloudflare), Twoja strona. */
  card4Flow: [string, string, string, string];
  card4Cta: string;
  /** Kategoria korzyści w nagłówku-zakładce karty stosu (widoczna też, gdy karta jest przykryta). */
  kickers: [string, string, string, string];
  /** Napisy kroków pod wizualizacjami (viz.tsx STORY) - krótko, jeden krok = jedno zdanie
      czytane w ok. 3 s; kolejność = kolejność kroków. Fakty z oferty, bez metryk poza 98/100. */
  story: {
    card1: [string, string, string];
    card2: [string, string, string];
    card3: [string, string];
    card4: [string, string, string];
  };
}

export const impactDict: Record<Locale, ImpactDict> = {
  pl: {
    sectionAriaLabel: 'Korzyści współpracy',
    badge: 'Dlaczego Avenly?',
    headingLine1: 'Twój biznes.',
    headingAccent: 'Wersja 2.0',
    leadLine1: 'Ładny wygląd to dopiero początek.',
    leadPre: 'Twoja strona ',
    leadStrong: 'sprzedaje, odpowiada klientom, jest widoczna w Google',
    leadPost: ' i działa bez przerw.',
    card1Title: 'Z odwiedzającego w klienta',
    card1Desc: 'Nie płacisz za ładną wizytówkę. Dostajesz stronę, która od pierwszego ekranu prowadzi klienta prosto do zapytania.',
    card1Flow: ['Ruch na stronie', 'Zapytanie', 'Nowy klient'],
    card2Title: 'Żadne pytanie nie czeka do rana',
    card2Desc: 'Asystent AI zna Twoją ofertę i odpowiada klientom od razu, o każdej porze. Ty dostajesz gotowe zapytania i wchodzisz do rozmowy, gdy jesteś potrzebny.',
    card2Flow: ['Pytania klientów', 'Asystent AI', 'Do Ciebie'],
    card2Tag: 'Chatboty AI',
    card3CounterAria: 'Wynik 98 na 100 w PageSpeed',
    card3CounterLabel: 'Wynik PageSpeed',
    card3Title: 'Szybkość, którą widzi Google',
    card3Desc: 'Google bierze szybkość pod uwagę, gdy układa wyniki, a klienci wychodzą z wolnych stron, zanim się załadują. Twoja ładuje się od razu.',
    card4Title: 'Działa, kiedy klient jej szuka',
    card4Desc: 'Awaria to klient, który trafia na pustą stronę i idzie do konkurencji. Hosting na Cloudflare zatrzymuje ataki i trzyma Twoją stronę online, a Ty masz spokój.',
    card4Flow: ['Odwiedzający', 'Atak', 'Cloudflare', 'Twoja strona'],
    card4Cta: 'Sprawdź ofertę',
    kickers: ['Sprzedaż', 'Obsługa klienta', 'Widoczność w Google', 'Ciągłość działania'],
    story: {
      card1: ['Klient trafia na Twoją stronę', 'Zostawia zapytanie', 'Zostaje Twoim klientem'],
      card2: ['Klienci pytają o ceny i terminy', 'Asystent AI odpowiada od razu, o każdej porze', 'Gotowe zapytanie trafia do Ciebie'],
      card3: ['Google mierzy, jak szybko ładuje się strona', 'Wynik: 98 na 100'],
      card4: ['Klienci wchodzą na stronę przez Cloudflare', 'Cloudflare zatrzymuje atak', 'Twoja strona działa bez przerw'],
    },
  },
  en: {
    sectionAriaLabel: 'Benefits of working together',
    badge: 'Why Avenly?',
    headingLine1: 'Your business.',
    headingAccent: 'Version 2.0',
    leadLine1: 'Good looks are just the start.',
    leadPre: 'Your website ',
    leadStrong: 'sells, answers clients, shows up on Google',
    leadPost: ' and keeps running without interruptions.',
    card1Title: 'From visitor to client',
    card1Desc: "You're not paying for a pretty business card. You get a website that leads clients from the first screen straight to an inquiry.",
    card1Flow: ['Website traffic', 'Inquiry', 'New client'],
    card2Title: 'No question waits until morning',
    card2Desc: "The AI assistant knows your offer and answers clients right away, at any hour. You get ready inquiries and step in when you're needed.",
    card2Flow: ['Client questions', 'AI assistant', 'To you'],
    card2Tag: 'AI chatbots',
    card3CounterAria: 'PageSpeed score of 98 out of 100',
    card3CounterLabel: 'PageSpeed score',
    card3Title: 'Speed that Google notices',
    card3Desc: 'Google takes speed into account when it ranks results, and clients leave slow sites before they load. Yours loads right away.',
    card4Title: 'Online whenever clients look',
    card4Desc: 'Downtime is a client who finds a blank page and goes to a competitor. Hosting on Cloudflare stops attacks and keeps your website online, so you have peace of mind.',
    card4Flow: ['Visitors', 'Attack', 'Cloudflare', 'Your website'],
    card4Cta: 'See our offer',
    kickers: ['Sales', 'Customer service', 'Google visibility', 'Business continuity'],
    story: {
      card1: ['A visitor lands on your website', 'They send an inquiry', 'They become your client'],
      card2: ['Clients ask about prices and dates', 'The AI assistant replies instantly, any time of day', 'A ready inquiry lands with you'],
      card3: ['Google measures how fast your website loads', 'Score: 98 out of 100'],
      card4: ['Visitors reach your website through Cloudflare', 'Cloudflare stops the attack', 'Your website keeps running'],
    },
  },
};
