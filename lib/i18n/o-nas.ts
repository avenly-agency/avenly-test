import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik strony /o-nas (PL) i /en/about-us (EN) - przebudowa od zera 2026-10-09 („zrób totalnie od zera i zrób
 * cinematic bazując na nowym logo”). Sceny wyrastają z nowego logo (AVENLY przecięte linią z gwiazdą):
 *   intro      - wejście „Panorama z cięciem”: gwiazda tnie ogromne logo, kamera jedzie z nią, potem wjazd
 *                w gwiazdę i „Plakat” z nagłówkiem, opisem i przyciskiem (poster.tsx). Nagłówek h1 zmieniony
 *                2026-10-13 przy przeglądzie tekstów (dawny „Nie jesteśmy kolejną korporacją. Jesteśmy Twoim
 *                partnerem.” to hasło z docinkiem pod adresem innych firm - PRODUCT.md, Copy Voice 9 i 12; dawna
 *                i jeszcze jedna wersja do porównania: przełącznik w ONasClient.tsx, tylko dev). Opis pod nagłówkiem
 *                mówi, kim jesteśmy i co robimy (słowa, których szuka się w Google: agencja interaktywna, strony
 *                internetowe, sklepy, systemy CRM, chatboty AI) - od 2026-10-13 (runda 29) opis jest jednym
 *                zdaniem o pierwszym spotkaniu klienta z firmą (właściciel: dawny opis „to jest po prostu
 *                wymienienie”); nazwy usług zostały w opisie strony dla wyszukiwarek (layout.tsx),
 *   clients    - sekcja po plakacie „Dla kogo pracujemy” (temat wybrany 2026-10-13, scena „Portal” -
 *                sec-clients-portal.tsx; nagłówek zmieniony tego samego dnia po uwadze właściciela, że dawny
 *                „Pracujemy z firmami takimi jak Twoja” „seems off” - inne wersje nagłówka do porównania są
 *                w przełączniku w pliku sceny; od rundy 29 nagłówek nie wylicza rodzajów firm ani ich liczby -
 *                właściciel: „teraz są trzy, ale potem może być więcej”); odrzucone tematy i dawny blok `direct` („Bez pośredników”) są
 *                w docs/archiwum/o-nas-2026-10/,
 *   offer      - „Co robimy” (2026-10-14, w miejscu usuniętej sekcji „Nasz znak” - konstrukcji logo; właściciel:
 *                „sekcje nasz znak wywala (…) przekmin co by pasowało”, temat wybrał z trzech propozycji): usługi
 *                po kolei w kadrze ze stołem rysunków Oferty (offer.tsx). Nazwy, zdania i podpisy kroków z Oferty
 *                (lib/i18n/services.ts - zaakceptowane 2026-09-28), poza Systemem CRM: bez „szytym” (właściciel
 *                2026-10-06: „frajersko brzmi”) i z AI nazwanym wprost jako opcja (2026-10-05: zdanie „jeśli chcesz,
 *                AI zrobi…” czyta jak zapewnienie). Nagłówek nie wylicza usług (PRODUCT.md, Copy Voice 16),
 *   principles - pięć zasad jako ściana ciemnych słów, które zapala gwiazda z logo (scena „Światło”, wybór
 *                właściciela 2026-10-14; dawne „Stacje na linii” i inne wersje w archiwum),
 *   faq, ending.
 * - Głos „my” (jedyny wyjątek od głosu korzyści - PRODUCT.md), EN „we”; sentence case, bez myślników em / en,
 *   bez rozstrzelonych wersalików, jedyne CTA „Bezpłatna konsultacja”.
 * - Liczby tylko obronne: odpowiedź w 24 h. Bez wyniku PageSpeed (właściciel 2026-10-14: „fake info, bo nie zawsze
 *   będzie tyle” - o szybkości piszemy bez liczb). Teksty w większości z poprzedniej
 *   wersji podstrony (archiwum: docs/archiwum/o-nas-2026-09/).
 * - `faq` = źródło prawdy dla akordeonu i danych strukturalnych FAQPage (PL przez re-export w faq-data.ts).
 *
 * Import WYŁĄCZNIE w server page / layout - słownik wędruje do klienta jako props.
 */

export interface ONasFaq {
  question: string;
  answer: string;
}

export interface ONasDict {
  intro: {
    label: string;
    title: string;
    titleAccent: string;
    lead: string;
    cta: string;
  };
  /** Sekcja po plakacie „Dla kogo pracujemy” (temat wybrany 2026-10-13): rodzaje firm i ich realizacje
      (krótkie kopie faktów z lib/i18n/projects.ts; `image` = nazwa zrzutu w public/portfolio/stage/). */
  clients: {
    heading: string;
    headingAccent: string;
    lead: string;
    more: string;
    /** `domain` = adres strony klienta na pasku kadru (jak w lib/i18n/projects.ts). */
    /** `alt` = opis zrzutu strony klienta (obraz w kadrze sceny i w trybie bez ruchu). */
    items: { type: string; name: string; line: string; href: string; image: string; domain: string; alt: string }[];
    yours: { type: string; line: string; cta: string; frame: string; domain: string };
  };
  /** Sekcja „Co robimy” (offer.tsx): nagłówek jako pierwsza pozycja sceny (hasło, zdanie w akcencie, opis), potem
      usługi. `href` = polska ścieżka podstrony usługi (link lokalizuje komponent; klucz rysunku i kolorów w offer.tsx),
      `story` = podpisy trzech kroków scenki rysunku, `fig` = skrót „Rys.” przed numerem rysunku. */
  offer: {
    heading: string;
    headingAccent: string;
    lead: string;
    details: string;
    fig: string;
    items: { href: string; name: string; line: string; story: [string, string, string] }[];
  };
  /** Zasady - scena „Światło” (principles-light.tsx, wybór właściciela 2026-10-14). Bez plakietki sekcji (jak „Portal”
      i „Co robimy”) - dawne pole `label` („W co wierzymy” / „What we believe in”) usunięte razem z nieużywanymi
      wersjami sekcji (docs/archiwum/o-nas-2026-10/zasady-wersje/). */
  principles: {
    heading: string;
    headingAccent: string;
    /** Zdanie pod nagłówkiem (nagłówek jest pierwszą pozycją sceny, nie osobnym blokiem nad nią). */
    lead: string;
    items: { title: string; desc: string }[];
  };
  /** Pytania (akordeon, faq.tsx): nagłówek bez plakietki od 2026-10-14, „Inne pytanie?” jako ostatni wiersz listy.
      Teksty zasad i FAQ po przeglądzie copy z właścicielem 2026-10-14 (docs/podstrony/o-nas.md, runda 45);
      pytania w kolejności rozmowy z klientem: cena, termin, obecna strona, faktura (odpowiedzi ogólne, bez nazw
      klientów - właściciel: „mentiona nie chcę, daj jakoś uniwersalnie”). Modernizacja = zawsze nowa strona od zera
      na miejscu starej (właściciel 2026-10-14). */
  faqSection: {
    heading: string;
    lead: string;
    askTitle: string;
    askDesc: string;
    askButton: string;
  };
  faq: ONasFaq[];
  ending: { heading: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd
      .replace(/(\d) (h|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL: ONasDict = {
  intro: {
    label: 'O nas',
    title: 'Dbamy o to, co Twoi klienci',
    titleAccent: 'zobaczą jako pierwsze.',
    lead: 'Twoja strona to pierwsze spotkanie klienta z Twoją firmą. Pilnujemy, żeby nie było ostatnie.',
    cta: 'Bezpłatna konsultacja',
  },
  clients: {
    heading: 'Różne branże, różne potrzeby.',
    headingAccent: 'Następna może być Twoja firma.',
    lead: 'Żadna z tych stron nie przypomina pozostałych. Każda powstała dla jednej konkretnej firmy i dziś na nią pracuje.',
    more: 'Zobacz realizację',
    items: [
      {
        type: 'Klub sportowy',
        name: 'Klub Sportowy RKS',
        line: 'Zmodernizowaliśmy stronę klubu i zbudowaliśmy aplikację do składek, treningów i obecności.',
        href: '/realizacje/klub-sportowy',
        image: 'klub-sportowy',
        domain: 'klubsportowyrks.pl',
        alt: 'Strona internetowa Klubu Sportowego RKS',
      },
      {
        type: 'Pracownia grawerska',
        name: 'Grawerstwo Józef Kardyś',
        line: 'Nowa strona i sklep z płatnościami online. Właściciel prowadzi całość z jednego panelu.',
        href: '/realizacje/grawerstwo-kardys',
        image: 'grawerstwo-kardys',
        domain: 'grawerstwomielec.pl',
        alt: 'Strona i sklep internetowy pracowni Grawerstwo Józef Kardyś',
      },
      {
        type: 'Gabinet fizjoterapii',
        name: 'Mcentrumfizjoterapia',
        line: 'Strona zbudowana pod lokalne wyszukiwanie w Google. Pacjent umawia wizytę przez Booksy.',
        href: '/realizacje/mcentrumfizjoterapia',
        image: 'mcentrumfizjoterapia',
        domain: 'mcentrumfizjoterapia.pl',
        alt: 'Strona internetowa gabinetu Mcentrumfizjoterapia',
      },
    ],
    yours: {
      type: 'Twoja firma',
      line: 'Opowiedz nam o niej, a zadbamy o to, co zobaczą Twoi klienci.',
      cta: 'Bezpłatna konsultacja',
      frame: 'Miejsce na Twoją stronę',
      domain: 'twojafirma.pl',
    },
  },
  offer: {
    heading: 'Od pierwszego wrażenia',
    headingAccent: 'po porządek w firmie.',
    lead: 'Każda z tych usług ma jedno zadanie: pracować na Twoją firmę także wtedy, gdy Ty zajmujesz się czymś innym.',
    details: 'Zobacz szczegóły',
    fig: 'Rys.',
    items: [
      {
        href: '/uslugi/strony-www/one-page',
        name: 'Strona one-page',
        line: 'Jedna strona, jeden cel. Klient od pierwszego ekranu wie, co oferujesz, i pisze do Ciebie, zanim zdąży się rozmyślić.',
        story: ['Klient od razu wie, co oferujesz, i klika.', 'Kilka pól i formularz jest gotowy.', 'Zapytanie w tej samej chwili ląduje u Ciebie.'],
      },
      {
        href: '/uslugi/strony-www/strona-firmowa',
        name: 'Strona firmowa',
        line: 'Twoja firma wygląda w sieci tak solidnie, jak pracuje na co dzień. Klient bez szukania trafia do usługi, której potrzebuje.',
        story: ['Każda usługa dostaje własną podstronę.', 'Treść opowiada o ofercie Twoim językiem.', 'Klient trafia na nią prosto z menu.'],
      },
      {
        href: '/uslugi/strony-www/strona-szyta-na-miare',
        name: 'Strona interaktywna',
        line: 'To już nie tylko strona, to uczucie. Projekt od pierwszej kreski, płynny ruch i nastrój Twojej marki, który klient zapamiętuje.',
        story: ['Klient od pierwszej chwili czuje nastrój Twojej marki.', 'Ruch płynnie prowadzi jego wzrok.', 'Strona odpowiada na każdy gest klienta.'],
      },
      {
        href: '/uslugi/strony-www/sklep-internetowy',
        name: 'Sklep internetowy',
        line: 'Sklep, który sprzedaje także wtedy, gdy Ty odpoczywasz. Klient płaci BLIK-iem lub kartą, a zamówienia czekają na Ciebie w jednym panelu.',
        story: ['Klient wybiera produkt i wrzuca go do koszyka.', 'Płaci tak, jak lubi: BLIK-iem albo kartą.', 'Paczka już jedzie, a Ty masz kolejne zamówienie.'],
      },
      {
        href: '/uslugi/strony-www/system-crm',
        name: 'System CRM',
        line: 'Koniec z arkuszami i karteczkami. Całą firmę widzisz w jednym systemie zbudowanym pod Twój proces, a AI to opcja, nie obowiązek.',
        story: ['Wpada zapytanie i nic już nie ginie.', 'Opcjonalnie AI przejmuje ręczną robotę.', 'Klient dostaje maila, a Ty masz wolną głowę.'],
      },
      {
        href: '/uslugi/automatyzacje-ai/chatboty-ai',
        name: 'Chatboty AI',
        line: 'Twój najlepszy sprzedawca pracuje także w nocy. Asystent AI zna Twoją ofertę, odpowiada klientom od razu i przekazuje Ci gotowe zapytania.',
        story: ['Klient pyta o ofertę o drugiej w nocy.', 'Asystent odpowiada w kilka sekund, konkretnie.', 'Rano gotowe zapytanie czeka w Twojej skrzynce.'],
      },
    ],
  },
  principles: {
    heading: 'Tak pracujemy',
    headingAccent: 'z każdą firmą.',
    lead: 'Bez względu na to, czy to jedna strona, czy cały system.',
    items: [
      {
        title: 'Projekt od zera.',
        desc: 'Każdą stronę tworzymy pod Twoją firmę. Zanim ją zbudujemy, zobaczysz i zaakceptujesz jej wygląd, także na telefonie.',
      },
      {
        title: 'Strona bez czekania.',
        desc: 'Dbamy o to, żeby strona wczytywała się od razu i klient nie czekał na Twoją ofertę. Tak samo szybko działa na telefonie.',
      },
      {
        title: 'Odpowiedź w 24 h.',
        desc: 'Na każdą wiadomość odpowiadamy w ciągu doby. Zawsze wiesz, na jakim etapie jest Twój projekt.',
      },
      {
        title: 'Konkretnie od początku.',
        desc: 'Zanim zaczniemy, wiesz, co zrobimy, ile to potrwa i ile będzie kosztować.',
      },
      {
        title: 'Zostajemy po wdrożeniu.',
        desc: 'Na życzenie dbamy o aktualizacje, bezpieczeństwo i rozwój strony. Zawsze masz do kogo napisać.',
      },
    ],
  },
  faqSection: {
    heading: 'Częste pytania',
    lead: 'O to klienci pytają nas najczęściej.',
    askTitle: 'Inne pytanie?',
    askDesc: 'Asystent AI odpowie od razu, o każdej porze.',
    askButton: 'Zapytaj asystenta',
  },
  faq: [
    {
      question: 'Ile kosztuje strona?',
      answer:
        'Płacisz za to, czego Twoja firma naprawdę potrzebuje. Po bezpłatnej konsultacji w ciągu 24 godzin wiesz dokładnie, ile to kosztuje i kiedy będzie gotowe.',
    },
    {
      question: 'Ile trwa realizacja projektu?',
      answer:
        'Zależy od zakresu. Strona firmowa powstaje zwykle w około dwa tygodnie, a rozbudowany sklep internetowy w około 2-6 tygodni. Dokładny termin podajemy razem z wyceną.',
    },
    {
      question: 'Czy możecie odświeżyć moją obecną stronę?',
      answer: 'Tak. Modernizacja oznacza u nas nową stronę zbudowaną od zera na miejscu obecnej. Klienci wchodzą pod ten sam adres, a trafiają na zupełnie nową stronę.',
    },
    {
      question: 'Czy mogę dostać fakturę?',
      answer: 'Tak, oczywiście. Za każdą usługę wystawiamy fakturę.',
    },
  ],
  ending: {
    heading: 'Zacznijmy od rozmowy.',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy najlepsze rozwiązanie dla Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN: ONasDict = {
  intro: {
    label: 'About us',
    title: 'We take care of what your customers',
    titleAccent: 'see first.',
    lead: 'Your website is where a customer first meets your business. We make sure it is not the last time.',
    cta: 'Free consultation',
  },
  clients: {
    heading: 'Different industries, different needs.',
    headingAccent: 'Your business could be next.',
    lead: 'None of these websites looks like the others. Each was built for one specific business and works for it today.',
    more: 'See the project',
    items: [
      {
        type: 'Sports club',
        name: 'Klub Sportowy RKS',
        line: 'We modernized the club website and built an app for fees, training sessions and attendance.',
        href: '/realizacje/klub-sportowy',
        image: 'klub-sportowy',
        domain: 'klubsportowyrks.pl',
        alt: 'Website of the RKS sports club',
      },
      {
        type: 'Engraving workshop',
        name: 'Grawerstwo Józef Kardyś',
        line: 'A new website and a store with online payments. The owner runs it all from one panel.',
        href: '/realizacje/grawerstwo-kardys',
        image: 'grawerstwo-kardys',
        domain: 'grawerstwomielec.pl',
        alt: 'Website and online store of the Grawerstwo Józef Kardyś workshop',
      },
      {
        type: 'Physiotherapy practice',
        name: 'Mcentrumfizjoterapia',
        line: 'A website built for local search on Google. Patients book appointments through Booksy.',
        href: '/realizacje/mcentrumfizjoterapia',
        image: 'mcentrumfizjoterapia',
        domain: 'mcentrumfizjoterapia.pl',
        alt: 'Website of the Mcentrumfizjoterapia physiotherapy practice',
      },
    ],
    yours: {
      type: 'Your business',
      line: 'Tell us about it and we will take care of what your clients see.',
      cta: 'Free consultation',
      frame: 'A place for your website',
      domain: 'yourbusiness.com',
    },
  },
  offer: {
    heading: 'From the first impression',
    headingAccent: 'to a well-run business.',
    lead: 'Each of these services has one job: to work for your business, even while you are busy with something else.',
    details: 'See details',
    fig: 'Fig.',
    items: [
      {
        href: '/uslugi/strony-www/one-page',
        name: 'One page website',
        line: 'One page, one goal. From the first screen your client knows what you offer and writes to you before they can change their mind.',
        story: ['Your client instantly gets your offer and clicks.', 'A few fields and the form is ready.', 'The inquiry lands with you the very same moment.'],
      },
      {
        href: '/uslugi/strony-www/strona-firmowa',
        name: 'Company website',
        line: 'Your business looks as solid online as it works every day. Clients reach the service they need without searching.',
        story: ['Every service gets its own subpage.', 'The content tells your offer in your voice.', 'Clients reach it straight from the menu.'],
      },
      {
        href: '/uslugi/strony-www/strona-szyta-na-miare',
        name: 'Interactive website',
        line: 'It is not just a website anymore, it is a feeling. Designed from the first stroke, with smooth motion and your brand’s mood that clients remember.',
        story: ['From the first moment, clients feel your brand’s mood.', 'Motion smoothly guides their eye.', 'The site responds to every gesture.'],
      },
      {
        href: '/uslugi/strony-www/sklep-internetowy',
        name: 'Online store',
        line: 'A store that keeps selling while you rest. Customers pay by BLIK or card, and orders wait for you in one panel.',
        story: ['A customer picks a product and drops it in the cart.', 'They pay the way they like: BLIK or card.', 'The parcel is on its way, and you have another order.'],
      },
      {
        href: '/uslugi/strony-www/system-crm',
        name: 'CRM system',
        line: 'No more spreadsheets and sticky notes. You see your whole business in one system built around your process, and AI is an option, not a must.',
        story: ['A new inquiry arrives and nothing gets lost.', 'Optionally, AI takes over the manual work.', 'Your client gets an email, and your mind is free.'],
      },
      {
        href: '/uslugi/automatyzacje-ai/chatboty-ai',
        name: 'AI chatbots',
        line: 'Your best salesperson now works nights too. The AI assistant knows your offer, answers clients right away and hands you ready inquiries.',
        story: ['A client asks about your offer at 2 a.m.', 'The assistant answers in seconds, to the point.', 'In the morning, a ready inquiry waits in your inbox.'],
      },
    ],
  },
  principles: {
    heading: 'This is how we work',
    headingAccent: 'with every business.',
    lead: 'Whether it is a single website or a whole system.',
    items: [
      {
        title: 'Designed from scratch.',
        desc: 'We create every website for your business. Before we build it, you see and approve its design, on mobile too.',
      },
      {
        title: 'No waiting.',
        desc: 'We make sure your website loads right away, so customers never wait for your offer. It is just as fast on a phone.',
      },
      {
        title: 'A reply within 24 h.',
        desc: 'We answer every message within a day. You always know what stage your project is at.',
      },
      {
        title: 'Clear from the start.',
        desc: 'Before we begin, you know what we will do, how long it will take and how much it will cost.',
      },
      {
        title: 'Here after launch.',
        desc: 'On request we take care of updates, security and new features. You always know who to write to.',
      },
    ],
  },
  faqSection: {
    heading: 'Frequently asked questions',
    lead: 'These are the questions clients ask us most often.',
    askTitle: 'Another question?',
    askDesc: 'The AI assistant answers right away, at any hour.',
    askButton: 'Ask the assistant',
  },
  faq: [
    {
      question: 'How much does a website cost?',
      answer:
        'You pay for what your business actually needs. After a free consultation, within 24 hours you know exactly how much it costs and when it will be ready.',
    },
    {
      question: 'How long does a project take?',
      answer:
        'It depends on the scope. A company website usually takes about two weeks, a larger online store about 2 to 6 weeks. We give you the exact timeline together with the quote.',
    },
    {
      question: 'Can you refresh my current website?',
      answer: 'Yes. For us, modernization means a new website built from scratch in place of your current one. Customers visit the same address and land on a completely new website.',
    },
    {
      question: 'Can I get an invoice?',
      answer: 'Yes, of course. We issue an invoice for every service.',
    },
  ],
  ending: {
    heading: "Let's start with a conversation.",
    text: 'Tell us about your business and we will find the best solution for it.',
    cta: 'Free consultation',
  },
};

export const oNasDict: Record<Locale, ONasDict> = { pl: typo(PL), en: EN };
