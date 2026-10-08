import type { Locale } from '@/lib/i18n/locale';

// ═══ NOWA PODSTRONA (praca równoległa, etap 3 - chat 9, od 2026-10-02): `CustomCopy` / `customCopy` na końcu pliku. ═══
// Stary `dedicatedDict` niżej ZOSTAJE jako źródło tekstów (decyzja właściciela 2026-10-02: „copywriting niech biorą
// z pierwotnych wersji stron”); nic go już nie importuje poza starym DedicatedWebsiteClient.tsx (też nieużywany).
// Usuwa je koordynator za zgodą właściciela po zamknięciu podstrony. Notatki: docs/podstrony/usluga-strona-szyta-na-miare.md.

/**
 * Słownik podstrony /uslugi/strony-www/strona-szyta-na-miare.
 *
 * Zasady (wzorzec: lib/i18n/home/hero.ts):
 * - PL = tekst 1:1 bajt w bajt z komponentu sprzed ekstrakcji.
 * - EN = natywne copy marketingowe (benefit voice you/your, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk, "Free consultation").
 * - Import WYŁĄCZNIE w server page - słownik wędruje do klienta jako props.
 *
 * MAKIETA (mock): teksty makiety są renderowane w OBU warstwach reveal
 * (wireframe + blueprint) przez te same funkcje homePage/offerPage/... z tym
 * samym `d: MockDict` - jedno pole = identyczny tekst w obu warstwach, więc
 * wymiary placeholderów są pixel-perfect zgodne (tekst determinuje layout).
 */

// ─── MAKIETA ───────────────────────────────────────────────────────────────────
export interface MockDict {
  scrollHint: string;
  demoBadge: string;
  /** 5 tras w pasku adresu (login + panel dzielą /panel → 4 unikalne + duplikat). */
  urls: [string, string, string, string, string];
  btnPrimary: string;
  btnMore: string;
  category: string;
  label: string;
  sectionHeading: string;
  projectWord: string;
  serviceWord: string;
  home: {
    eyebrowHero: string;
    h1a: string;
    h1b: string;
    lead: string;
    trust: string;
    eyebrow01: string;
    sec01Desc: string;
    learnMore: string;
    eyebrow02: string;
    elements: [string, string, string];
    elementDesc: string;
    eyebrow03: string;
    works: string;
    quote: string;
    quoteAuthor: string;
    cta: string;
  };
  offer: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lead: string;
    packages: [string, string, string];
    priceFrom: string;
    currency: string;
    packageFeature: string;
    choosePackage: string;
    processEyebrow: string;
    processHeading: string;
    processStep: string;
    processStepDesc: string;
    scopeEyebrow: string;
    scopeHeading: string;
    scopeItem: string;
    scopeItemDesc: string;
    cta: string;
  };
  works: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lead: string;
    projectName: string;
    caseDesc: string;
    caseStudy: string;
    cta: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
  };
  panel: {
    studio: string;
    saved: string;
    collections: string;
    nav: [string, string, string, string, string];
    itemCount: string;
    addService: string;
    itemDesc: string;
    statusLive: string;
    statusDraft: string;
  };
}

// ─── PODSTRONA ───────────────────────────────────────────────────────────────────
export interface DedicatedDict {
  hero: {
    badge: string;
    h1a: string;
    h1b: string;
    lead: string;
  };
  fragment: {
    badge: string;
    headingPre: string;
    headingAccent: string;
    headingPost: string;
    para: string;
    marqueeRow1: string[];
    marqueeRow2: string[];
    closingBadge: string;
  };
  bento: {
    heading: string;
    para: string;
    cards: [
      { title: string; desc: string },
      { title: string; desc: string },
      { title: string; desc: string },
      { title: string; desc: string },
    ];
    card4Btn: string;
  };
  scope: {
    badge: string;
    headingPre: string;
    headingAccent: string;
    para: string;
    cards: { title: string; desc: string }[];
  };
  cta: {
    badge: string;
    headingPre: string;
    headingAccent: string;
    para: string;
    btnPrimary: string;
    btnSecondary: string;
  };
  mock: MockDict;
}

export const dedicatedDict: Record<Locale, DedicatedDict> = {
  pl: {
    hero: {
      badge: 'Next.js · premium · bez ograniczeń',
      h1a: 'Strona Szyta',
      h1b: 'na Miarę.',
      lead: 'Dla marek, dla których „wystarczająco dobrze" to za mało. Witryna na miarę Twojego prestiżu, z opcjonalnym panelem CMS i funkcjami bez ograniczeń.',
    },
    fragment: {
      badge: 'Makieta = fragment',
      headingPre: 'Możliwości ',
      headingAccent: 'nie mają limitu',
      headingPost: '.',
      para: 'Makieta pokazuje kilka ekranów. Twoja strona dostaje funkcje na miarę Twojego prestiżu - poniżej tylko próbka tego, co jest możliwe.',
      marqueeRow1: ['Custom animacje scroll', 'Panel CMS (Sanity / Strapi)', 'Strefa klienta', 'Integracje API', 'Płatności online', 'Wielojęzyczność', 'Wyszukiwarka full-text', 'Dashboard analityczny', 'Newsletter + automatyzacje', 'Headless commerce'],
      marqueeRow2: ['Logowanie / SSO', 'Rezerwacje online', 'Kalkulatory ofert', 'Czat na żywo', 'Tryb ciemny', 'PWA / tryb offline', 'Mapa interaktywna', 'Filtry i warianty', 'Webhooki / n8n'],
      closingBadge: '+ cokolwiek wymyślisz',
    },
    bento: {
      heading: 'Technologia liderów',
      para: 'Ta sama technologia, na której działa Netflix i TikTok, pracuje teraz na Twój biznes. Szybka, odporna i gotowa na każdą skalę.',
      cards: [
        { title: 'Architektura Headless', desc: 'Rozdzielona warstwa treści i wyglądu sprawia, że Twoja strona jest szybsza i bezpieczniejsza niż zwykłe witryny. Najwyższy standard pod maską.' },
        { title: 'Integracje bez granic', desc: 'Płatności, ERP, CRM - Twoja strona dogaduje się z każdym narzędziem, którego używa Twój biznes.' },
        { title: 'Czuć każdy detal', desc: 'Każde przewinięcie, najazd i przejście jest dopracowane. To suma detali sprawia, że Twoja strona wygląda na droższą niż konkurencja.' },
        { title: 'Zero czekania', desc: 'Każda sekunda ładowania to klient, który ucieka. Twoja strona ładuje się natychmiast, więc nie tracisz nikogo na starcie.' },
      ],
      card4Btn: 'Zacznijmy',
    },
    scope: {
      badge: 'Zakres Wdrożenia',
      headingPre: 'Od konceptu',
      headingAccent: 'po wdrożenie.',
      para: 'Inżynieryjne podejście do budowy zaawansowanej platformy.',
      cards: [
        { title: 'Architektura i Logika', desc: 'Zaczynamy od mapowania procesów biznesowych i doboru odpowiedniego stosu technologicznego (Backend/Frontend).' },
        { title: 'Prototypowanie (UX)', desc: 'Tworzymy klikalne makiety aplikacji i strony, aby zweryfikować użyteczność przed kodowaniem.' },
        { title: 'Nowoczesny Frontend', desc: 'Budujemy responsywne, komponentowe widoki w React, gwarantujące płynne i błyskawiczne działanie interfejsu.' },
        { title: 'Potężny backend', desc: 'Łączymy bazy danych, budujemy bezpieczne API i integrujemy systemy zewnętrzne. Panel CMS do samodzielnej edycji - opcjonalnie.' },
        { title: 'Quality Assurance (QA)', desc: 'Rygorystyczne testy automatyczne i manualne, sprawdzające bezpieczeństwo oraz wydajność kodu pod obciążeniem.' },
        { title: 'Deploy i utrzymanie', desc: 'Publikujemy projekt na szybkiej, niezawodnej infrastrukturze chmurowej i zapewniamy stałe wsparcie techniczne.' },
      ],
    },
    cta: {
      badge: 'Wolny termin w tym miesiącu',
      headingPre: 'Gotowy na cyfrową',
      headingAccent: 'Dominację?',
      para: 'Zbudujmy stronę, która wyróżni Cię na tle konkurencji. Darmowa konsultacja, zero zobowiązań.',
      btnPrimary: 'Bezpłatna konsultacja',
      btnSecondary: 'Napisz do nas',
    },
    mock: {
      scrollHint: 'Scrolluj, aby testować',
      demoBadge: 'Makieta · Demo',
      urls: ['twoja-marka.pl', 'twoja-marka.pl/oferta', 'twoja-marka.pl/realizacje', 'twoja-marka.pl/panel', 'twoja-marka.pl/panel'],
      btnPrimary: 'Główny przycisk',
      btnMore: 'Zobacz więcej',
      category: 'Kategoria',
      label: 'Etykieta',
      sectionHeading: 'Nagłówek sekcji',
      projectWord: 'Projekt',
      serviceWord: 'Usługa',
      home: {
        eyebrowHero: 'Premium ⁄ 2026',
        h1a: 'Twoja marka',
        h1b: 'w nowym świetle.',
        lead: 'Krótki opis wartości, jednym zdaniem, które buduje pierwsze wrażenie.',
        trust: 'Zaufali nam',
        eyebrow01: '01 - Sekcja',
        sec01Desc: 'Krótki opis sekcji w dwóch zdaniach. Druga myśl, która rozwija kontekst i prowadzi dalej.',
        learnMore: 'Dowiedz się więcej',
        eyebrow02: '02 - Zakres',
        elements: ['Element pierwszy', 'Element drugi', 'Element trzeci'],
        elementDesc: 'Krótki opis elementu w jednym lub dwóch zdaniach.',
        eyebrow03: '03 - Realizacje',
        works: 'Wybrane projekty',
        quote: 'Tu znajdzie się krótka opinia. Mocny cytat, który buduje zaufanie do marki.',
        quoteAuthor: '- Imię Nazwisko, Stanowisko',
        cta: 'Zaczynamy?',
      },
      offer: {
        eyebrow: 'Oferta',
        titleA: 'Tytuł oferty',
        titleB: 'w jednym zdaniu.',
        lead: 'Krótki opis oferty w dwóch zdaniach. Co znajdzie odbiorca i dlaczego warto.',
        packages: ['Pakiet I', 'Pakiet II', 'Pakiet III'],
        priceFrom: 'od 0 000',
        currency: 'zł',
        packageFeature: 'Element pakietu',
        choosePackage: 'Wybierz pakiet',
        processEyebrow: 'Proces',
        processHeading: 'Jak pracujemy',
        processStep: 'Etap procesu',
        processStepDesc: 'Krótki opis kroku w jednym zdaniu.',
        scopeEyebrow: 'Zakres',
        scopeHeading: 'Co obejmuje',
        scopeItem: 'Element oferty',
        scopeItemDesc: 'Krótki opis w jednym zdaniu.',
        cta: 'Porozmawiajmy o szczegółach',
      },
      works: {
        eyebrow: 'Realizacje',
        titleA: 'Wybrane',
        titleB: 'projekty.',
        lead: 'Krótki opis sekcji realizacji. Co łączy prezentowane projekty i jaki dają efekt.',
        projectName: 'Nazwa projektu',
        caseDesc: 'Krótki opis realizacji w dwóch zdaniach. Wyzwanie, podejście i rezultat.',
        caseStudy: 'Zobacz case study',
        cta: 'Twój projekt może być następny',
      },
      login: {
        title: 'Panel',
        subtitle: 'Zaloguj się, aby kontynuować',
        email: 'Adres e-mail',
        password: 'Hasło',
        submit: 'Zaloguj się',
      },
      panel: {
        studio: 'Studio',
        saved: 'Zapisano',
        collections: 'Kolekcje',
        nav: ['Usługi', 'Realizacje', 'Wpisy', 'Media', 'Ustawienia'],
        itemCount: '4 pozycje',
        addService: '+ Dodaj usługę',
        itemDesc: 'Krótki opis pozycji',
        statusLive: 'Live',
        statusDraft: 'Szkic',
      },
    },
  },
  en: {
    hero: {
      badge: 'Next.js · premium · no limits',
      h1a: 'Custom built',
      h1b: 'website.',
      lead: 'For brands where "good enough" is not enough. A website built to match your prestige, with an optional CMS panel and features without limits.',
    },
    fragment: {
      badge: 'Mockup = a fragment',
      headingPre: 'The possibilities ',
      headingAccent: 'have no limit',
      headingPost: '.',
      para: 'The mockup shows a few screens. Your website gets features built to match your prestige - below is only a sample of what is possible.',
      marqueeRow1: ['Custom scroll animations', 'CMS panel (Sanity / Strapi)', 'Client area', 'API integrations', 'Online payments', 'Multilingual', 'Full-text search', 'Analytics dashboard', 'Newsletter + automations', 'Headless commerce'],
      marqueeRow2: ['Login / SSO', 'Online bookings', 'Quote calculators', 'Live chat', 'Dark mode', 'PWA / offline mode', 'Interactive map', 'Filters and variants', 'Webhooks / n8n'],
      closingBadge: '+ whatever you imagine',
    },
    bento: {
      heading: 'Technology of the leaders',
      para: 'The same technology that powers Netflix and TikTok now works for your business. Fast, resilient and ready for any scale.',
      cards: [
        { title: 'Headless architecture', desc: 'Separating content from presentation makes your website faster and safer than ordinary sites. The highest standard under the hood.' },
        { title: 'Integrations without limits', desc: 'Payments, ERP, CRM - your website talks to every tool your business uses.' },
        { title: 'You feel every detail', desc: 'Every scroll, hover and transition is refined. It is the sum of details that makes your website look more premium than the competition.' },
        { title: 'Zero waiting', desc: 'Every second of loading is a customer walking away. Your website loads instantly, so you lose no one at the start.' },
      ],
      card4Btn: "Let's start",
    },
    scope: {
      badge: 'Scope of delivery',
      headingPre: 'From concept',
      headingAccent: 'to delivery.',
      para: 'An engineering approach to building an advanced platform.',
      cards: [
        { title: 'Architecture and logic', desc: 'We start by mapping your business processes and choosing the right technology stack (backend/frontend).' },
        { title: 'Prototyping (UX)', desc: 'We create clickable mockups of the app and site to validate usability before coding.' },
        { title: 'Modern frontend', desc: 'We build responsive, component based views in React that guarantee a smooth and instant interface.' },
        { title: 'Powerful backend', desc: 'We connect databases, build secure APIs and integrate external systems. A CMS panel for self editing is optional.' },
        { title: 'Quality assurance (QA)', desc: 'Rigorous automated and manual tests that check the security and performance of the code under load.' },
        { title: 'Deployment and maintenance', desc: 'We publish your project on fast, reliable cloud infrastructure and provide ongoing technical support.' },
      ],
    },
    cta: {
      badge: 'A free slot this month',
      headingPre: 'Ready for digital',
      headingAccent: 'domination?',
      para: "Let's build a website that sets you apart from the competition. Free consultation, zero obligations.",
      btnPrimary: 'Free consultation',
      btnSecondary: 'Write to us',
    },
    mock: {
      scrollHint: 'Scroll to test',
      demoBadge: 'Mockup · Demo',
      urls: ['your-brand.com', 'your-brand.com/offer', 'your-brand.com/work', 'your-brand.com/panel', 'your-brand.com/panel'],
      btnPrimary: 'Primary button',
      btnMore: 'See more',
      category: 'Category',
      label: 'Label',
      sectionHeading: 'Section heading',
      projectWord: 'Project',
      serviceWord: 'Service',
      home: {
        eyebrowHero: 'Premium ⁄ 2026',
        h1a: 'Your brand',
        h1b: 'in a new light.',
        lead: 'A short value statement in one sentence that builds the first impression.',
        trust: 'Trusted by',
        eyebrow01: '01 - Section',
        sec01Desc: 'A short section description in two sentences. A second thought that expands the context and leads further.',
        learnMore: 'Learn more',
        eyebrow02: '02 - Scope',
        elements: ['First element', 'Second element', 'Third element'],
        elementDesc: 'A short description of the element in one or two sentences.',
        eyebrow03: '03 - Work',
        works: 'Selected projects',
        quote: 'A short testimonial goes here. A strong quote that builds trust in the brand.',
        quoteAuthor: '- Name Surname, Position',
        cta: 'Shall we start?',
      },
      offer: {
        eyebrow: 'Offer',
        titleA: 'Offer title',
        titleB: 'in one sentence.',
        lead: 'A short offer description in two sentences. What the visitor finds and why it is worth it.',
        packages: ['Package I', 'Package II', 'Package III'],
        priceFrom: 'from 0 000',
        currency: 'PLN',
        packageFeature: 'Package item',
        choosePackage: 'Choose package',
        processEyebrow: 'Process',
        processHeading: 'How we work',
        processStep: 'Process step',
        processStepDesc: 'A short step description in one sentence.',
        scopeEyebrow: 'Scope',
        scopeHeading: 'What it includes',
        scopeItem: 'Offer item',
        scopeItemDesc: 'A short description in one sentence.',
        cta: "Let's talk about the details",
      },
      works: {
        eyebrow: 'Work',
        titleA: 'Selected',
        titleB: 'projects.',
        lead: 'A short description of the work section. What connects the featured projects and the effect they deliver.',
        projectName: 'Project name',
        caseDesc: 'A short case description in two sentences. The challenge, the approach and the result.',
        caseStudy: 'See case study',
        cta: 'Your project could be next',
      },
      login: {
        title: 'Panel',
        subtitle: 'Sign in to continue',
        email: 'Email address',
        password: 'Password',
        submit: 'Sign in',
      },
      panel: {
        studio: 'Studio',
        saved: 'Saved',
        collections: 'Collections',
        nav: ['Services', 'Work', 'Posts', 'Media', 'Settings'],
        itemCount: '4 items',
        addService: '+ Add service',
        itemDesc: 'A short item description',
        statusLive: 'Live',
        statusDraft: 'Draft',
      },
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
// NOWA PODSTRONA - przebudowa 2026-10 (praca równoległa, etap 3, chat 9; poziom 3 hierarchii: „pełne widowisko”).
// Teksty z pierwotnej wersji (`dedicatedDict` wyżej) rozłożone w nowych scenach. Zmienione tylko to, co musi:
// obietnice CMS / panelu / strefy klienta / headless (PRODUCT.md, „Co obiecujemy w ofercie”), „weryfikacja
// użyteczności”, przycisk „Bezpłatna konsultacja”, zapis (sentence case, bez myślników, „i” zamiast „+”).
// Tabela „było -> jest”: docs/podstrony/usluga-strona-szyta-na-miare.md.
// Nagłówek = chwyt usługi z Oferty (słowa właściciela: „To już nie tylko strona, to uczucie.”), podpisy filmu =
// scenka Oferty (`servicesSectionDict.items`, zaakceptowane 2026-09-28). Zakończenie wspólne dla podstron usług.
// TERMIN: wartość tymczasowa („ustalamy z Tobą”) - liczba dopiero po potwierdzeniu właściciela.
// NAZWA USŁUGI od 2026-10-06: „Strona interaktywna” / „Interactive website” (właściciel: „szyta na miarę” pisze każda
// firma - „cringe”). Nie wracać do „szyta na miarę” w tekstach. Nazwa pliku i adres podstrony zostają na razie bez zmian.
// PL: twarde spacje (U+00A0) dokłada `typo()`. Import w server page; słownik wędruje do klienta jako props.

export interface CustomCopy {
  /** Nagłówek: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). */
  head: { title: string; lead: string; cta: string; proof: string[] };
  /** Przykładowa strona firmy w kadrze („twoja-marka.pl”) - cztery ekrany: pierwszy ekran / oferta / realizacje /
      kontakt, każdy z ruchem z najwyższej półki (nastrój / ruch / głębia / gest). Teksty z dawnej makiety (`mock`):
      mówią, co stoi w danym miejscu. `cardLead` = zdanie pod kartą usługi, `cases*` / `case*` = ekran realizacji
      (runda 6, 2026-10-05). */
  site: {
    domain: string; brand: string; nav: string[]; navCta: string;
    h1a: string; h1b: string; lead: string; cta: string; more: string;
    worksEyebrow: string; worksTitle: string; project: string; category: string; caseCta: string; cardLead: string;
    casesEyebrow: string; caseName: string; caseLead: string; caseOpen: string;
    endTitle: string; quote: string; quoteBy: string; endCta: string;
  };
  /** Scena 1 (film): trzy akty = scenka Oferty (`steps`). `states` = nazwa UJĘCIA w pasku adresu (cztery: akt
      „Ruch” ma dwa ujęcia - jazdę w bok wzdłuż oferty i lot w głąb przez realizacje), `sample` = etykieta makiety
      („Przykładowa strona” - decyzja właściciela: makieta ma być czytelna jako makieta), `hint` = zaproszenie do
      zabawy w kadrze. Bez podpisów porównujących usługi (właściciel 2026-10-02:
      „nie chcę, żebyś bezpośrednio porównywał firmową do szytej na miarę”). */
  film: {
    states: string[]; stepsAria: string; steps: string[];
    sample: string;
    hint: string; hintTouch: string;
  };
  /** Scena 2: „Możliwości nie mają limitu.” - nić prowadzi przez gwiazdy z funkcjami. */
  stars: { title: string; titleAccent: string; lead: string; items: string[]; more: string; aria: string };
  /** Scena 3: „Technologia liderów.” - stos trzech kart z rysunkami (czwarty kafel dawnego bento ma własną scenę). */
  cases: { title: string; titleAccent: string; lead: string; items: { tag: string; title: string; text: string; caption: string }[] };
  /** Scena 4: „Czuć każdy detal.” - kształt z linii odpowiada na przewinięcie, najazd i kliknięcie (`steps` = podpisy gestów). */
  detail: {
    title: string; titleAccent: string; text: string; steps: string[]; stepsAria: string;
    /** Runda 2: podpisy gestów dla propozycji „Litery” i „Próbki” (po wyborze właściciela zostaje jeden zestaw w `steps`). */
    stepsLetters: string[]; stepsSamples: string[];
  };
  /** Scena 5: zakres z terminem na linii wymiarowej + pokaz w kadrze. */
  scope: {
    title: string; titleAccent: string;
    items: { title: string; text: string }[];
    termLabel: string; termValue: string;
    demo: { accept: string; chips: string[]; checks: string[]; live: string };
  };
  ending: { title: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd („i w”)
      .replace(/(\d) (h|s|dni|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_CUSTOM: CustomCopy = {
  head: {
    title: 'To już nie tylko strona, to uczucie',
    lead: 'Dla marek, dla których „wystarczająco dobrze” to za mało. Witryna na miarę Twojego prestiżu, z funkcjami bez ograniczeń.',
    cta: 'Bezpłatna konsultacja',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
  },
  site: {
    domain: 'twoja-marka.pl',
    brand: 'Twoja marka',
    nav: ['Oferta', 'Realizacje', 'Kontakt'],
    navCta: 'Zobacz więcej',
    h1a: 'Twoja marka',
    h1b: 'w nowym świetle.',
    lead: 'Krótki opis wartości, jednym zdaniem, które buduje pierwsze wrażenie.',
    cta: 'Główny przycisk',
    more: 'Zobacz więcej',
    worksEyebrow: 'Oferta',
    worksTitle: 'Twoje usługi',
    project: 'Usługa',
    category: 'Kategoria',
    caseCta: 'Zobacz ofertę',
    cardLead: 'Krótki opis w jednym zdaniu.',
    casesEyebrow: 'Realizacje',
    caseName: 'Projekt',
    caseLead: 'Krótki opis realizacji w dwóch zdaniach. Wyzwanie, podejście i rezultat.',
    caseOpen: 'Zobacz case study',
    endTitle: 'Zaczynamy?',
    quote: 'Tu znajdzie się krótka opinia. Mocny cytat, który buduje zaufanie do marki.',
    quoteBy: 'Imię Nazwisko, Stanowisko',
    endCta: 'Porozmawiajmy o szczegółach',
  },
  film: {
    states: ['Nastrój', 'Ruch', 'Głębia', 'Gest'],
    stepsAria: 'Co czuje klient na stronie interaktywnej',
    steps: [
      'Klient od pierwszej chwili czuje nastrój Twojej marki.',
      'Ruch płynnie prowadzi jego wzrok.',
      'Strona odpowiada na każdy gest klienta.',
    ],
    sample: 'Przykładowa strona',
    hint: 'Twoja kolej. Porusz kursorem i kliknij w kadrze.',
    hintTouch: 'Twoja kolej. Dotknij kadru.',
  },
  stars: {
    title: 'Możliwości',
    titleAccent: 'nie mają limitu.',
    lead: 'Makieta pokazuje kilka ekranów. Twoja strona dostaje funkcje na miarę Twojego prestiżu. Poniżej tylko próbka tego, co jest możliwe.',
    items: [
      'Custom animacje scroll', 'Integracje API', 'Płatności online', 'Wielojęzyczność', 'Wyszukiwarka full-text', 'Dashboard analityczny',
      'Newsletter i automatyzacje', 'Logowanie / SSO', 'Rezerwacje online', 'Kalkulatory ofert', 'Czat na żywo', 'Tryb ciemny',
      'PWA / tryb offline', 'Mapa interaktywna', 'Filtry i warianty', 'Webhooki / n8n',
    ],
    more: '+ cokolwiek wymyślisz',
    aria: 'Przykładowe funkcje strony interaktywnej',
  },
  cases: {
    title: 'Technologia',
    titleAccent: 'liderów.',
    lead: 'Ta sama technologia, na której działa Netflix i TikTok, pracuje teraz na Twój biznes. Szybka, odporna i gotowa na każdą skalę.',
    items: [
      // karty mówią tylko o tym, co daje TEN poziom (właściciel 2026-10-02: „Kod pisany od zera… to się zalicza do każdej
      // usługi stron u nas, więc to jest takie napisanie oczywistości, która jest w poprzednich”) - NIE wracać do kodu
      // od zera, szablonów / wtyczek ani samej szybkości ładowania jako wyróżnika tej usługi
      { tag: 'Sceny', title: 'Sceny pisane dla Twojej marki', text: 'Żywe tła, światło, które idzie za kursorem, obrazy zmieniające się z przewijaniem. Każda scena powstaje tylko dla Twojej marki, więc klient nie zobaczy jej nigdzie indziej.', caption: 'Każda scena powstaje tylko dla Twojej strony.' },
      { tag: 'Integracje', title: 'Integracje bez granic', text: 'Płatności, ERP, CRM. Twoja strona dogaduje się z każdym narzędziem, którego używa Twój biznes.', caption: 'Strona wymienia dane z Twoimi narzędziami.' },
      { tag: 'Płynność', title: 'Zero czekania', text: 'Rozbudowane sceny wczytują się dopiero wtedy, gdy są potrzebne. Nawet strona pełna ruchu otwiera się od razu, więc nie tracisz nikogo na starcie.', caption: 'Klient klika i od razu widzi stronę.' },
    ],
  },
  detail: {
    title: 'Czuć każdy',
    titleAccent: 'detal.',
    text: 'Każde przewinięcie, najazd i przejście jest dopracowane. To suma detali sprawia, że Twoja strona wygląda na droższą niż konkurencja.',
    steps: [
      'Przewijasz, a kształt płynie razem z Tobą.',
      'Zbliżasz kursor albo palec, a linie wychodzą Ci naprzeciw.',
      'Klikasz albo stukasz, a kształt przechodzi w nowy.',
    ],
    stepsAria: 'Trzy gesty, na które odpowiada kształt',
    stepsLetters: [
      'Przewijasz, a litery falują razem z Tobą.',
      'Zbliżasz kursor albo palec, a litery wychodzą Ci naprzeciw.',
      'Klikasz albo stukasz, a przez nagłówek przechodzi fala.',
    ],
    stepsSamples: [
      'Przewijasz, a strona płynie razem z Tobą.',
      'Zbliżasz kursor albo palec, a przycisk wychodzi Ci naprzeciw.',
      'Klikasz albo stukasz, a karta płynnie przechodzi w nowy widok.',
    ],
  },
  scope: {
    title: 'Od konceptu',
    titleAccent: 'po wdrożenie.',
    items: [
      { title: 'Architektura i logika', text: 'Zaczynamy od mapowania procesów biznesowych i doboru odpowiedniego stosu technologicznego (backend / frontend).' },
      { title: 'Prototypowanie (UX)', text: 'Tworzymy klikalne makiety strony. Wygląd akceptujesz, zanim zaczniemy ją budować.' },
      { title: 'Nowoczesny frontend', text: 'Budujemy responsywne, komponentowe widoki w React, gwarantujące płynne i błyskawiczne działanie interfejsu.' },
      { title: 'Integracje', text: 'Łączymy bazy danych, budujemy bezpieczne API i integrujemy systemy zewnętrzne.' },
      { title: 'Quality assurance (QA)', text: 'Rygorystyczne testy automatyczne i manualne, sprawdzające bezpieczeństwo oraz wydajność kodu pod obciążeniem.' },
      { title: 'Deploy i utrzymanie', text: 'Publikujemy projekt na szybkiej, niezawodnej infrastrukturze chmurowej i zapewniamy stałe wsparcie techniczne.' },
    ],
    termLabel: 'Termin',
    termValue: 'ustalamy z Tobą',
    demo: { accept: 'Akceptuję', chips: ['Płatności', 'CRM', 'ERP'], checks: ['Bezpieczeństwo', 'Wydajność'], live: 'Strona działa' },
  },
  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy stronę do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_CUSTOM: CustomCopy = {
  head: {
    title: 'It’s not just a website anymore, it’s a feeling',
    lead: 'For brands where “good enough” is not enough. A website built to match your prestige, with features without limits.',
    cta: 'Free consultation',
    proof: ['Free', 'no strings attached', 'reply within 24 h'],
  },
  site: {
    domain: 'your-brand.com',
    brand: 'Your brand',
    nav: ['Offer', 'Work', 'Contact'],
    navCta: 'See more',
    h1a: 'Your brand',
    h1b: 'in a new light.',
    lead: 'A short value statement in one sentence that builds the first impression.',
    cta: 'Primary button',
    more: 'See more',
    worksEyebrow: 'Offer',
    worksTitle: 'Your services',
    project: 'Service',
    category: 'Category',
    caseCta: 'See the offer',
    cardLead: 'A short description in one sentence.',
    casesEyebrow: 'Work',
    caseName: 'Project',
    caseLead: 'A short case description in two sentences. The challenge, the approach and the result.',
    caseOpen: 'See case study',
    endTitle: 'Shall we start?',
    quote: 'A short testimonial goes here. A strong quote that builds trust in the brand.',
    quoteBy: 'Name Surname, Position',
    endCta: 'Let’s talk about the details',
  },
  film: {
    states: ['Mood', 'Motion', 'Depth', 'Gesture'],
    stepsAria: 'What a client feels on an interactive website',
    steps: [
      'From the first moment, clients feel your brand’s mood.',
      'Motion smoothly guides their eye.',
      'The site responds to every gesture.',
    ],
    sample: 'Sample website',
    hint: 'Your turn. Move the cursor and click inside the frame.',
    hintTouch: 'Your turn. Tap the frame.',
  },
  stars: {
    title: 'The possibilities',
    titleAccent: 'have no limit.',
    lead: 'The mockup shows a few screens. Your website gets features built to match your prestige. Below is only a sample of what is possible.',
    items: [
      'Custom scroll animations', 'API integrations', 'Online payments', 'Multilingual', 'Full-text search', 'Analytics dashboard',
      'Newsletter and automations', 'Login / SSO', 'Online bookings', 'Quote calculators', 'Live chat', 'Dark mode',
      'PWA / offline mode', 'Interactive map', 'Filters and variants', 'Webhooks / n8n',
    ],
    more: '+ whatever you imagine',
    aria: 'Sample features of an interactive website',
  },
  cases: {
    title: 'Technology',
    titleAccent: 'of the leaders.',
    lead: 'The same technology that powers Netflix and TikTok now works for your business. Fast, resilient and ready for any scale.',
    items: [
      { tag: 'Scenes', title: 'Scenes written for your brand', text: 'Living backgrounds, light that follows the cursor, images that change as you scroll. Every scene is made only for your brand, so clients will not see it anywhere else.', caption: 'Every scene is made only for your website.' },
      { tag: 'Integrations', title: 'Integrations without limits', text: 'Payments, ERP, CRM. Your website talks to every tool your business uses.', caption: 'The site exchanges data with your tools.' },
      { tag: 'Smoothness', title: 'Zero waiting', text: 'Rich scenes load only when they are needed. Even a website full of motion opens right away, so you lose no one at the start.', caption: 'A client clicks and sees the page right away.' },
    ],
  },
  detail: {
    title: 'You feel every',
    titleAccent: 'detail.',
    text: 'Every scroll, hover and transition is refined. It is the sum of details that makes your website look more premium than the competition.',
    steps: [
      'You scroll and the shape flows with you.',
      'You bring the cursor or a finger closer and the lines come to meet you.',
      'You click or tap and the shape turns into a new one.',
    ],
    stepsAria: 'Three gestures the shape responds to',
    stepsLetters: [
      'You scroll and the letters ripple with you.',
      'You bring the cursor or a finger closer and the letters come to meet you.',
      'You click or tap and a wave runs through the heading.',
    ],
    stepsSamples: [
      'You scroll and the page flows with you.',
      'You bring the cursor or a finger closer and the button comes to meet you.',
      'You click or tap and the card smoothly turns into a new view.',
    ],
  },
  scope: {
    title: 'From concept',
    titleAccent: 'to delivery.',
    items: [
      { title: 'Architecture and logic', text: 'We start by mapping your business processes and choosing the right technology stack (backend / frontend).' },
      { title: 'Prototyping (UX)', text: 'We create clickable mockups of the site. You approve the look before we start building it.' },
      { title: 'Modern frontend', text: 'We build responsive, component based views in React that guarantee a smooth and instant interface.' },
      { title: 'Integrations', text: 'We connect databases, build secure APIs and integrate external systems.' },
      { title: 'Quality assurance (QA)', text: 'Rigorous automated and manual tests that check the security and performance of the code under load.' },
      { title: 'Deployment and maintenance', text: 'We publish your project on fast, reliable cloud infrastructure and provide ongoing technical support.' },
    ],
    termLabel: 'Timeline',
    termValue: 'set together with you',
    demo: { accept: 'Approved', chips: ['Payments', 'CRM', 'ERP'], checks: ['Security', 'Performance'], live: 'Site is live' },
  },
  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the website to it.',
    cta: 'Free consultation',
  },
};

export const customCopy: Record<Locale, CustomCopy> = { pl: typo(PL_CUSTOM), en: EN_CUSTOM };
