import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik strony /o-nas (PL) i /en/about-us (EN).
 * - Zero JSX: ikony, klasy i animacje żyją w app/(pl)/o-nas/*.
 * - /o-nas to JEDYNA strona w głosie "my" (PRODUCT.md), EN w głosie "we"; sentence case, bez
 *   myślników em / en, bez rozstrzelonych wersalików, jedyne CTA "Bezpłatna konsultacja".
 * - Liczby tylko obronne: 98/100 PageSpeed (nasze realizacje), odpowiedź w 24 h, strona firmowa
 *   w około dwa tygodnie (z FAQ właściciela). Bez "100% zaangażowania" i "ROI".
 * - `faq` = źródło prawdy dla akordeonu i danych strukturalnych FAQPage (PL przez re-export
 *   w app/(pl)/o-nas/faq-data.ts, EN w layoutcie /en/about-us). Struktura pól zostaje.
 * - Praca równoległa etap 2 (PRACA-ROWNOLEGLA.md, chat 1): pola `korekta`, `letter`, `relay`
 *   i `manifest` należą do propozycji z przełącznikiem - po wyborze właściciela zostaje jedno.
 *
 * Import WYŁĄCZNIE w server page / layout - słownik wędruje do klienta jako props.
 */

export interface ONasFaq {
  question: string;
  answer: string;
}

/** Fragment listu: zwykły tekst albo przypis do tekstu tuż przed nim (numer nadaje komponent). */
export type ONasLetterPart = string | { note: string };

export interface ONasDict {
  /** Podpowiedź pod napisem AVENLY na wejściu strony. */
  scrollHint: string;
  /** Podpis na pierwszym ekranie (propozycje wejścia Plakat i Szafir): lewa i prawa krawędź. */
  introCaption: { left: string; right: string };
  label: string;
  title: string;
  titleAccent: string;
  lead: string;
  cta: string;
  /** Liczby obronne (propozycje List i Bez pośredników). */
  facts: {
    heading: string;
    items: { value: string; label: string }[];
  };
  /** Propozycja "Korekta": skreślone przyzwyczajenia agencji → to, co robimy. */
  korekta: {
    /** Druga linia h1: `before` + skreślone `struck` + `accent`. */
    before: string;
    struck: string;
    accent: string;
    heading: string;
    lead: string;
    rows: { from: string; to: string; desc: string }[];
  };
  /** Propozycja "List": list od założycieli z przypisami na marginesie. */
  letter: {
    heading: string;
    paragraphs: ONasLetterPart[][];
    notesLabel: string;
    signature: string;
    role: string;
  };
  /** Propozycja "Bez pośredników": droga wiadomości w dużej agencji i u nas. */
  relay: {
    heading: string;
    headingAccent: string;
    lead: string;
    agency: string;
    studio: string;
    roles: string[];
    you: string;
    us: string;
    reply: string;
    steps: string[];
    pause: string;
    play: string;
  };
  /** Propozycja "Manifest": zdania zapalają się słowo po słowie przy czytaniu. */
  manifest: {
    heading: string;
    lines: { pre: string; accent: string; post: string }[];
  };
  craft: {
    heading: string;
    lead: string;
    items: { title: string; desc: string }[];
  };
  faqSection: {
    heading: string;
    lead: string;
    askTitle: string;
    askDesc: string;
    askButton: string;
  };
  faq: ONasFaq[];
}

export const oNasDict: Record<Locale, ONasDict> = {
  pl: {
    scrollHint: 'Scrolluj w dół',
    introCaption: { left: 'Agencja interaktywna', right: 'Polska, od 2026' },
    label: 'O nas',
    title: 'Nie jesteśmy kolejną korporacją.',
    titleAccent: 'Jesteśmy Twoim partnerem.',
    lead: 'Projektujemy i piszemy strony, sklepy i asystentów AI. Każdy detal ma jeden cel: więcej klientów i mniej Twojej pracy.',
    cta: 'Bezpłatna konsultacja',
    facts: {
      heading: 'Liczby, które da się sprawdzić',
      items: [
        { value: '98/100', label: 'Tyle nasze realizacje mają w Google PageSpeed' },
        { value: '24 h', label: 'Najdłużej tyle czekasz na naszą odpowiedź' },
        { value: '2 tyg.', label: 'Zwykle tyle trwa realizacja strony firmowej' },
      ],
    },
    korekta: {
      before: 'Jesteśmy Twoim',
      struck: 'wykonawcą',
      accent: 'partnerem.',
      heading: 'Co robimy inaczej',
      lead: 'Kilka rzeczy, do których przyzwyczaiły Cię agencje. U nas ich nie znajdziesz.',
      rows: [
        {
          from: 'Gotowy szablon',
          to: 'Projekt od zera',
          desc: 'Każdą stronę projektujemy i piszemy pod Twoją firmę. Zanim powstanie kod, widzisz projekt, także w wersji na telefon.',
        },
        {
          from: 'Odpowiedź po tygodniu',
          to: 'Odpowiedź w 24 h',
          desc: 'Na każdą wiadomość odpowiadamy w ciągu doby. Rozmawiasz z nami, a nie z systemem zgłoszeń.',
        },
        {
          from: 'Ładna, ale wolna',
          to: '98/100 w PageSpeed',
          desc: 'Tyle nasze realizacje mają w Google PageSpeed. Strona ładuje się szybko, także na telefonie.',
        },
        {
          from: 'Znikamy po oddaniu',
          to: 'Zostajemy po wdrożeniu',
          desc: 'Na życzenie dbamy o aktualizacje, bezpieczeństwo i rozwój strony. Zawsze masz do kogo napisać.',
        },
        {
          from: 'Obietnice bez pokrycia',
          to: 'Sprawdzalne fakty',
          desc: 'Nie wymyślamy wzrostów ani procentów. Mówimy, co zrobimy, ile to potrwa i co z tego masz.',
        },
      ],
    },
    letter: {
      heading: 'Kilka słów od nas',
      paragraphs: [
        [
          'Avenly założyliśmy w 2026 roku z prostego powodu: zbyt wiele firm ma strony, które nic dla nich nie robią. Ładują się za wolno, nie odpowiadają na pytania klientów i nie prowadzą do zapytania.',
        ],
        [
          'Dlatego każdą stronę projektujemy od zera',
          { note: 'Projekt strony, także w wersji na telefon, akceptujesz przed kodowaniem.' },
          ' i pilnujemy, żeby była szybka',
          { note: '98/100 w Google PageSpeed, tyle mają nasze realizacje.' },
          '. Klient od pierwszego ekranu ma wiedzieć, co zrobić dalej.',
        ],
        [
          'Rozmawiasz bezpośrednio z nami. Na wiadomości odpowiadamy w ciągu doby',
          { note: 'Pon-pt, 9:00-17:00. Napisz na kontakt@avenly.pl.' },
          ', a po wdrożeniu nie znikamy',
          { note: 'Opcjonalna opieka: aktualizacje, bezpieczeństwo i rozwój strony.' },
          '.',
        ],
        ['Jeśli szukasz partnera, a nie kolejnego wykonawcy, porozmawiajmy.'],
      ],
      notesLabel: 'Przypisy',
      signature: 'Michał i Bartek',
      role: 'Założyciele Avenly',
    },
    relay: {
      heading: 'Bez pośredników.',
      headingAccent: 'Prosto do nas.',
      lead: 'Rozmawiasz z osobami, które projektują i piszą Twoją stronę. Tak wygląda droga jednej wiadomości.',
      agency: 'Duża agencja',
      studio: 'Avenly',
      roles: ['Ty', 'Opiekun klienta', 'Kierownik projektu', 'Grafik', 'Programista'],
      you: 'Ty',
      us: 'Avenly',
      reply: 'Odpowiedź w 24 h',
      steps: [
        'W dużej agencji Twoja wiadomość przechodzi przez kilka osób.',
        'U nas trafia prosto do tych, którzy robią Twoją stronę.',
        'Odpowiedź dostajesz w ciągu 24 godzin.',
      ],
      pause: 'Zatrzymaj animację',
      play: 'Wznów animację',
    },
    manifest: {
      heading: 'W co wierzymy',
      lines: [
        { pre: 'Każdą stronę projektujemy ', accent: 'od zera,', post: ' pod Twoją firmę i Twoich klientów.' },
        { pre: 'Pilnujemy szybkości. Nasze realizacje mają ', accent: '98/100', post: ' w Google PageSpeed.' },
        { pre: 'Odpowiadamy ', accent: 'w ciągu 24 godzin.', post: ' Rozmawiasz z nami, a nie z systemem zgłoszeń.' },
        { pre: 'Nie obiecujemy liczb, ', accent: 'których nie da się sprawdzić.', post: '' },
        { pre: 'Po wdrożeniu ', accent: 'zostajemy.', post: ' Twoja strona ma pracować latami, nie tylko w dniu premiery.' },
      ],
    },
    craft: {
      heading: 'Co robimy',
      lead: 'Od pierwszej rozmowy po stronę, która pracuje na Twoją firmę.',
      items: [
        {
          title: 'Plan',
          desc: 'Zaczynamy od Twojej firmy i Twoich klientów. Sprawdzamy konkurencję i układamy stronę tak, żeby prowadziła do zapytania.',
        },
        {
          title: 'Projekt',
          desc: 'Widzisz projekt strony lub sklepu, zanim ruszy kod, także w wersji na telefon. Poprawki wprowadzamy, zanim cokolwiek zaprogramujemy.',
        },
        {
          title: 'Kod',
          desc: 'Piszemy stronę od zera: szybką, bezpieczną i wygodną na każdym ekranie. Bez gotowych szablonów.',
        },
        {
          title: 'AI i automatyzacje',
          desc: 'Asystent AI na stronie odpowiada klientom o każdej porze. Na życzenie automatyzujemy też powtarzalną pracę w Twojej firmie.',
        },
      ],
    },
    faqSection: {
      heading: 'Częste pytania',
      lead: 'Krótko i konkretnie. Nie ma tu Twojego pytania? Zapytaj asystenta AI albo napisz do nas.',
      askTitle: 'Inne pytanie?',
      askDesc: 'Asystent AI odpowie od razu, o każdej porze.',
      askButton: 'Zapytaj asystenta',
    },
    faq: [
      {
        question: 'Czy mogę dostać fakturę?',
        answer:
          'Tak. Rozliczamy się przez platformę Useme, więc za wykonaną usługę dostajesz pełnoprawną fakturę.',
      },
      {
        question: 'Jak wygląda wsparcie po wdrożeniu?',
        answer:
          'Nie znikamy po oddaniu projektu. Na życzenie prowadzimy opiekę techniczną: aktualizacje, bezpieczeństwo i rozwój strony. Na zgłoszenia odpowiadamy w ciągu 24 godzin.',
      },
      {
        question: 'Ile trwa realizacja projektu?',
        answer:
          'Strona firmowa powstaje zwykle w około dwa tygodnie. Rozbudowany sklep internetowy: od 2 do 6 tygodni.',
      },
    ],
  },
  en: {
    scrollHint: 'Scroll down',
    introCaption: { left: 'Interactive agency', right: 'Poland, since 2026' },
    label: 'About us',
    title: 'We are not another corporation.',
    titleAccent: 'We are your partner.',
    lead: 'We design and build websites, online stores and AI assistants. Every detail serves one goal: more customers and less work for you.',
    cta: 'Free consultation',
    facts: {
      heading: 'Numbers you can check',
      items: [
        { value: '98/100', label: 'What our projects score in Google PageSpeed' },
        { value: '24 h', label: 'The longest you wait for our reply' },
        { value: '2 wks', label: 'How long a company website usually takes' },
      ],
    },
    korekta: {
      before: 'We are your',
      struck: 'contractor',
      accent: 'partner.',
      heading: 'What we do differently',
      lead: 'A few things agencies got you used to. You will not find them here.',
      rows: [
        {
          from: 'A ready-made template',
          to: 'Designed from scratch',
          desc: 'We design and build every site for your business. Before any code is written, you see the design, including the mobile version.',
        },
        {
          from: 'A reply next week',
          to: 'A reply within 24 h',
          desc: 'We answer every message within a day. You talk to us, not to a ticketing system.',
        },
        {
          from: 'Pretty but slow',
          to: '98/100 in PageSpeed',
          desc: 'That is what our projects score in Google PageSpeed. Your site loads fast, on phones too.',
        },
        {
          from: 'Gone after handover',
          to: 'Here after launch',
          desc: 'On request we take care of updates, security and new features. You always know who to write to.',
        },
        {
          from: 'Promises without proof',
          to: 'Facts you can check',
          desc: 'We do not invent growth figures or percentages. We tell you what we will do, how long it takes and what you get.',
        },
      ],
    },
    letter: {
      heading: 'A few words from us',
      paragraphs: [
        [
          'We founded Avenly in 2026 for a simple reason: too many businesses have websites that do nothing for them. They load too slowly, leave customer questions unanswered and never lead to an enquiry.',
        ],
        [
          'That is why we design every site from scratch',
          { note: 'You approve the design, including the mobile version, before any code is written.' },
          ' and make sure it is fast',
          { note: '98/100 in Google PageSpeed, the score of our projects.' },
          '. From the very first screen, a visitor should know what to do next.',
        ],
        [
          'You talk to us directly. We reply to messages within a day',
          { note: 'Mon-Fri, 9:00-17:00. Write to kontakt@avenly.pl.' },
          ', and we do not disappear after launch',
          { note: 'Optional care: updates, security and new features.' },
          '.',
        ],
        ['If you are looking for a partner rather than another contractor, let us talk.'],
      ],
      notesLabel: 'Notes',
      signature: 'Michał and Bartek',
      role: 'Founders of Avenly',
    },
    relay: {
      heading: 'No middlemen.',
      headingAccent: 'Straight to us.',
      lead: 'You talk to the people who design and build your site. This is the path of a single message.',
      agency: 'A large agency',
      studio: 'Avenly',
      roles: ['You', 'Account manager', 'Project manager', 'Designer', 'Developer'],
      you: 'You',
      us: 'Avenly',
      reply: 'Reply within 24 h',
      steps: [
        'In a large agency your message passes through several people.',
        'With us it goes straight to the people who build your site.',
        'You get a reply within 24 hours.',
      ],
      pause: 'Pause the animation',
      play: 'Resume the animation',
    },
    manifest: {
      heading: 'What we believe in',
      lines: [
        { pre: 'We design every site ', accent: 'from scratch,', post: ' for your business and your customers.' },
        { pre: 'We care about speed. Our projects score ', accent: '98/100', post: ' in Google PageSpeed.' },
        { pre: 'We reply ', accent: 'within 24 hours.', post: ' You talk to us, not to a ticketing system.' },
        { pre: 'We never promise numbers ', accent: 'that cannot be checked.', post: '' },
        { pre: 'After launch ', accent: 'we stay.', post: ' Your site should work for years, not just on launch day.' },
      ],
    },
    craft: {
      heading: 'What we do',
      lead: 'From the first conversation to a site that works for your business.',
      items: [
        {
          title: 'Plan',
          desc: 'We start with your business and your customers. We look at the competition and shape the site so it leads to an enquiry.',
        },
        {
          title: 'Design',
          desc: 'You see the design of your site or store before any code is written, including the mobile version. Changes happen before we build anything.',
        },
        {
          title: 'Code',
          desc: 'We build your site from scratch: fast, secure and comfortable on every screen. No ready-made templates.',
        },
        {
          title: 'AI and automation',
          desc: 'An AI assistant on your site answers customers at any hour. On request we also automate repetitive work in your business.',
        },
      ],
    },
    faqSection: {
      heading: 'Frequently asked questions',
      lead: 'Short and to the point. Your question is not here? Ask the AI assistant or write to us.',
      askTitle: 'Another question?',
      askDesc: 'The AI assistant answers right away, at any hour.',
      askButton: 'Ask the assistant',
    },
    faq: [
      {
        question: 'Can I get an invoice?',
        answer:
          'Yes. We settle payments through the Useme platform, so you receive a fully valid invoice for the service.',
      },
      {
        question: 'What does support look like after launch?',
        answer:
          'We do not disappear after handover. On request we provide technical care: updates, security and new features. We respond to requests within 24 hours.',
      },
      {
        question: 'How long does a project take?',
        answer:
          'A company website usually takes about two weeks. A larger online store: 2 to 6 weeks.',
      },
    ],
  },
};
