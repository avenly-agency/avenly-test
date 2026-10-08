import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik podstrony /uslugi/strony-www/strona-firmowa (CorporateWebsiteClient).
 * Zasady jak w lib/i18n/home/hero.ts:
 * - PL = tekst 1:1 z komponentu sprzed ekstrakcji (bajt w bajt),
 * - EN = copy wg PRODUCT.md (benefit voice, sentence case, bez em/en dashes,
 *   zero fabrykowanych metryk, "Bezpłatna konsultacja" → "Free consultation").
 *
 * WIREFRAME → BLUEPRINT: pola oznaczone (shared) są renderowane w OBU warstwach
 * makiety - tekst determinuje wymiary placeholdera, więc MUSI być identyczny co do
 * znaku w wireframe i blueprint. Pola *Wireframe / tablice blueprintowe (np.
 * homeServiceCards, aboutStats) odwzorowują istniejący (celowy) rozdział, gdzie
 * wireframe powtarza jedną etykietę a blueprint ma zróżnicowane treści.
 */

export interface CorporateDict {
  // ── HERO ───────────────────────────────────────────────────────────────────
  heroBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;

  // ── MAKIETA: pasek URL (pojedyncze instancje) ───────────────────────────────
  urlHome: string;
  urlAbout: string;
  urlOffer: string;

  // ── MAKIETA PAGE 1 - HOME (shared wireframe+blueprint, chyba że zaznaczono) ──
  homeHeadingLine1: string;      // shared
  homeHeadingLine2: string;      // shared
  homeLead1: string;             // shared
  homeLead2: string;             // shared
  homeCtaPrimary: string;        // shared
  homeCtaSecondary: string;      // shared
  homeServicesHeading: string;   // shared
  homeServiceWireframe: string;  // wireframe ×3 (jedna etykieta)
  homeServiceCards: [string, string, string]; // blueprint (zróżnicowane)
  homeServiceDesc: string;       // shared
  homePromoBadge: string;        // shared
  homePromoHeading: string;      // shared
  homePromoDesc: string;         // shared

  // ── MAKIETA PAGE 2 - O NAS ──────────────────────────────────────────────────
  aboutLogoLabel: string;        // blueprint only
  aboutHeading: string;          // shared
  aboutLead1: string;            // shared
  aboutLead2: string;            // shared
  aboutFotoLabel: string;        // blueprint only ("FOTO {i}")
  aboutTeamName: string;         // shared
  aboutTeamRole: string;         // shared
  aboutStatWireframeNum: string;   // wireframe ×3
  aboutStatWireframeLabel: string; // wireframe ×3
  aboutStats: { num: string; label: string }[]; // blueprint (zróżnicowane)
  aboutImageLabel: string;       // blueprint only
  aboutSectionHeading: string;   // shared
  aboutSectionLead1: string;     // shared
  aboutSectionLead2: string;     // shared
  aboutSectionCta: string;       // shared

  // ── MAKIETA PAGE 3 - OFERTA ─────────────────────────────────────────────────
  offerHeading: string;          // shared
  offerLead1: string;            // shared
  offerLead2: string;            // shared
  offerPackageName: string;      // shared (wireframe ×3 == blueprint ×3)
  offerFeature1: string;         // shared
  offerFeature2: string;         // shared
  offerFeature3: string;         // shared
  offerPackageCta: string;       // shared
  offerListHeading: string;      // shared
  offerListItemName: string;     // shared (×4)
  offerListItemDesc: string;     // shared (×4)
  offerListItemCta: string;      // shared (×4)

  // ── MAKIETA: overlays ───────────────────────────────────────────────────────
  demoBadge: string;
  scrollHint: string;

  // ── SEKCJA "MAKIETA = FRAGMENT" ─────────────────────────────────────────────
  fragmentBadge: string;
  fragmentHeadingPre: string;
  fragmentHeadingAccent: string;
  fragmentLead: string;
  fragmentRow1: string[];
  fragmentRow2: string[];
  fragmentPill: string;

  // ── BENTO ───────────────────────────────────────────────────────────────────
  bentoBadge: string;
  bentoHeadingPre: string;
  bentoHeadingAccent: string;
  bentoLead: string;
  bentoCard1Title: string;
  bentoCard1Desc: string;
  bentoCard2Title: string;
  bentoCard2Desc: string;
  bentoCard3AriaScore: string;
  bentoCard3Title: string;
  bentoCard3Desc: string;
  bentoCard4Title: string;
  bentoCard4Desc: string;
  bentoCard4Cta: string;

  // ── ZAKRES PRAC ─────────────────────────────────────────────────────────────
  scopeBadge: string;
  scopeHeadingPre: string;
  scopeHeadingAccent: string;
  scopeLead: string;
  scopeItems: { title: string; desc: string }[];

  // ── CTA ─────────────────────────────────────────────────────────────────────
  ctaBadge: string;
  ctaHeadingPre: string;
  ctaHeadingAccent: string;
  ctaLead: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const corporateDict: Record<Locale, CorporateDict> = {
  pl: {
    heroBadge: 'Wielostronicowa · Next.js · szybka',
    heroTitle: 'Strona firmowa,',
    heroTitleAccent: 'która buduje zaufanie.',
    heroLead:
      'Kompletna wizytówka Twojego biznesu: oferta, o nas, realizacje, kontakt. Profesjonalna, szybka i dopracowana w każdym detalu.',

    urlHome: 'twoja-korporacja.pl',
    urlAbout: 'twoja-korporacja.pl/o-nas',
    urlOffer: 'twoja-korporacja.pl/oferta',

    homeHeadingLine1: 'Nagłówek Twojej Firmy',
    homeHeadingLine2: 'druga linia nagłówka',
    homeLead1: 'Krótki opis tego co oferujesz klientowi w jednym zdaniu.',
    homeLead2: 'Druga linia rozszerzająca propozycję wartości.',
    homeCtaPrimary: 'Główny CTA',
    homeCtaSecondary: 'Drugi CTA',
    homeServicesHeading: 'Nagłówek sekcji',
    homeServiceWireframe: 'Usługa pierwsza',
    homeServiceCards: ['Usługa pierwsza', 'Usługa druga', 'Usługa trzecia'],
    homeServiceDesc: 'Krótki opis usługi',
    homePromoBadge: 'BADGE',
    homePromoHeading: 'Nagłówek wyróżnika promo',
    homePromoDesc: 'Krótki opis dodatkowy promo card',

    aboutLogoLabel: 'LOGO',
    aboutHeading: 'Nasza historia od 2010',
    aboutLead1: 'Kim jesteśmy i czym się zajmujemy każdego dnia.',
    aboutLead2: 'Wartości którymi kierujemy się.',
    aboutFotoLabel: 'FOTO',
    aboutTeamName: 'Imię Nazwisko',
    aboutTeamRole: 'Stanowisko',
    aboutStatWireframeNum: '+150',
    aboutStatWireframeLabel: 'Etykieta',
    aboutStats: [
      { num: '+150', label: 'Klientów' },
      { num: '14 lat', label: 'Doświadczenia' },
      { num: '50+', label: 'Projektów' },
    ],
    aboutImageLabel: 'ZDJĘCIE / VIDEO',
    aboutSectionHeading: 'Nagłówek sekcji',
    aboutSectionLead1: 'Pierwsza linia opisu sekcji.',
    aboutSectionLead2: 'Druga linia opisu.',
    aboutSectionCta: 'Dowiedz się więcej',

    offerHeading: 'Tytuł oferty premium',
    offerLead1: 'Pierwsza linia opisu oferty dla klienta.',
    offerLead2: 'Druga linia z dodatkowym kontekstem.',
    offerPackageName: 'Pakiet Standard',
    offerFeature1: 'Pierwsza funkcja pakietu',
    offerFeature2: 'Druga funkcja pakietu',
    offerFeature3: 'Trzecia funkcja',
    offerPackageCta: 'Wybierz pakiet',
    offerListHeading: 'Inne dostępne usługi',
    offerListItemName: 'Nazwa usługi',
    offerListItemDesc: 'Krótki opis usługi w jednym zdaniu',
    offerListItemCta: 'Zamów',

    demoBadge: 'Makieta · Demo',
    scrollHint: 'Scrolluj, aby testować',

    fragmentBadge: 'Makieta = fragment',
    fragmentHeadingPre: '3 podstrony to dopiero',
    fragmentHeadingAccent: 'początek',
    fragmentLead:
      'To tylko przykładowy układ. Twoja strona dostaje podstrony i sekcje dobrane pod Twoją firmę, nie pod gotowy szablon.',
    fragmentRow1: [
      'Blog firmowy', 'FAQ', 'Cennik', 'Portfolio', 'Referencje',
      'Galeria zdjęć', 'Newsletter', 'Kariera', 'Aktualności', 'Wydarzenia',
    ],
    fragmentRow2: [
      'Kalkulator usług', 'Sekcja zespół', 'Integracja Google Maps', 'Polityka prywatności',
      'Multi-język', 'System rezerwacji', 'Formularze custom', 'Pasek opinii',
      'Logo klientów', 'Strefa pobrań',
    ],
    fragmentPill: '+ co potrzebujesz',

    bentoBadge: 'Solidna podstawa',
    bentoHeadingPre: 'Fundament',
    bentoHeadingAccent: 'Skalowania',
    bentoLead:
      'Profesjonalna strona to nie wydatek - to Twój najciężej pracujący handlowiec. Twój biznes jest zabezpieczony technologicznie i wizerunkowo.',
    bentoCard1Title: 'Pełna Skalowalność',
    bentoCard1Desc:
      'Otrzymujesz system gotowy na rozbudowę. Niezależnie czy za rok dodasz sklep, portal pracowniczy czy platformę B2B - technologia nie zablokuje Twojego wzrostu.',
    bentoCard2Title: 'Gotowa na kolejny krok',
    bentoCard2Desc:
      'Twoja strona nie kończy się na premierze. Kiedy biznes nabiera tempa, jest gotowa rozbudować się o kolejne podstrony, funkcje, a z czasem nawet sklep.',
    bentoCard3AriaScore: '99 punktów PageSpeed',
    bentoCard3Title: 'Architektura pod SEO',
    bentoCard3Desc:
      'Twoja strona jest zbudowana tak, jak lubi Google: szybka i czysta technicznie. Dzięki temu łatwiej Cię znaleźć i łatwiej wspinasz się w wynikach.',
    bentoCard4Title: 'Wyglądasz na lidera',
    bentoCard4Desc:
      'Zbyt wielu klientów odrzuca ofertę, bo strona wygląda na przestarzałą. Zyskujesz kinowy design, dzięki któremu Twoja marka budzi zaufanie od pierwszej sekundy.',
    bentoCard4Cta: 'Zacznijmy',

    scopeBadge: 'Zakres prac',
    scopeHeadingPre: 'Co dokładnie',
    scopeHeadingAccent: 'otrzymujesz?',
    scopeLead: 'Przewijaj w dół, aby zobaczyć pełen pakiet wdrożeniowy.',
    scopeItems: [
      { title: 'Kinowy projekt graficzny', desc: 'Projekt od zera, nastawiony na konwersję i prestiż Twojej marki.' },
      { title: 'Płynne animacje i efekty', desc: 'Subtelne animacje na scrollu, które ożywiają stronę i przykuwają uwagę klienta.' },
      { title: 'Zbieranie leadów', desc: 'Zoptymalizowany, zabezpieczony formularz kontaktowy podpięty bezpośrednio pod Twój adres e-mail.' },
      { title: 'Perfekcyjne na telefonie', desc: 'Każdy piksel dopasowany do smartfonów i tabletów, z myślą najpierw o telefonie.' },
      { title: 'Google Core Web Vitals', desc: 'Optymalizacja wydajności dla natychmiastowego ładowania i perfekcyjnych wyników PageSpeed.' },
      { title: 'Pomoc wdrożeniowa', desc: 'Wsparcie w wyborze hostingu, podpięciu domeny i konfiguracji darmowego certyfikatu SSL.' },
    ],

    ctaBadge: 'Wolny termin w tym miesiącu',
    ctaHeadingPre: 'Gotowy na cyfrową',
    ctaHeadingAccent: 'Dominację?',
    ctaLead: 'Zbudujmy stronę, na którą Twoja firma zasługuje. Darmowa konsultacja, zero zobowiązań.',
    ctaPrimary: 'Bezpłatna konsultacja',
    ctaSecondary: 'Napisz do nas',
  },
  en: {
    heroBadge: 'Multipage · Next.js · fast',
    heroTitle: 'A company website',
    heroTitleAccent: 'that builds trust.',
    heroLead:
      'A complete showcase of your business: services, about, work and contact. Professional, fast and polished down to the last detail.',

    urlHome: 'your-company.com',
    urlAbout: 'your-company.com/about',
    urlOffer: 'your-company.com/offer',

    homeHeadingLine1: 'Your company headline',
    homeHeadingLine2: 'second headline line',
    homeLead1: 'A short description of what you offer clients in one sentence.',
    homeLead2: 'A second line expanding your value proposition.',
    homeCtaPrimary: 'Primary CTA',
    homeCtaSecondary: 'Secondary CTA',
    homeServicesHeading: 'Section heading',
    homeServiceWireframe: 'First service',
    homeServiceCards: ['First service', 'Second service', 'Third service'],
    homeServiceDesc: 'Short service description',
    homePromoBadge: 'BADGE',
    homePromoHeading: 'Promo highlight heading',
    homePromoDesc: 'Short extra description for the promo card',

    aboutLogoLabel: 'LOGO',
    aboutHeading: 'Our story since 2010',
    aboutLead1: 'Who we are and what we do every day.',
    aboutLead2: 'The values that guide us.',
    aboutFotoLabel: 'PHOTO',
    aboutTeamName: 'First Last',
    aboutTeamRole: 'Position',
    aboutStatWireframeNum: '+150',
    aboutStatWireframeLabel: 'Label',
    aboutStats: [
      { num: '+150', label: 'Clients' },
      { num: '14 years', label: 'Experience' },
      { num: '50+', label: 'Projects' },
    ],
    aboutImageLabel: 'PHOTO / VIDEO',
    aboutSectionHeading: 'Section heading',
    aboutSectionLead1: 'First line of the section description.',
    aboutSectionLead2: 'Second line of the description.',
    aboutSectionCta: 'Learn more',

    offerHeading: 'Premium offer title',
    offerLead1: 'First line of the offer description for the client.',
    offerLead2: 'Second line with extra context.',
    offerPackageName: 'Standard package',
    offerFeature1: 'First package feature',
    offerFeature2: 'Second package feature',
    offerFeature3: 'Third feature',
    offerPackageCta: 'Choose package',
    offerListHeading: 'Other available services',
    offerListItemName: 'Service name',
    offerListItemDesc: 'Short service description in one sentence',
    offerListItemCta: 'Order',

    demoBadge: 'Mockup · Demo',
    scrollHint: 'Scroll to explore',

    fragmentBadge: 'Mockup = a fragment',
    fragmentHeadingPre: '3 pages are just the',
    fragmentHeadingAccent: 'beginning',
    fragmentLead:
      'This is just a sample layout. Your website gets pages and sections chosen for your company, not for a ready made template.',
    fragmentRow1: [
      'Company blog', 'FAQ', 'Pricing', 'Portfolio', 'Testimonials',
      'Photo gallery', 'Newsletter', 'Careers', 'News', 'Events',
    ],
    fragmentRow2: [
      'Service calculator', 'Team section', 'Google Maps integration', 'Privacy policy',
      'Multi-language', 'Booking system', 'Custom forms', 'Reviews bar',
      'Client logos', 'Download area',
    ],
    fragmentPill: '+ whatever you need',

    bentoBadge: 'Solid foundation',
    bentoHeadingPre: 'The foundation for',
    bentoHeadingAccent: 'scaling',
    bentoLead:
      'A professional website is not a cost, it is your hardest working salesperson. Your business stays protected, both technically and in how it is perceived.',
    bentoCard1Title: 'Full scalability',
    bentoCard1Desc:
      'You get a system ready to grow. Whether you add a store, an employee portal or a B2B platform next year, the technology never blocks your growth.',
    bentoCard2Title: 'Ready for the next step',
    bentoCard2Desc:
      'Your website does not end at launch. As your business picks up speed, it is ready to grow with new pages, features and even a store down the line.',
    bentoCard3AriaScore: '99 PageSpeed points',
    bentoCard3Title: 'SEO ready architecture',
    bentoCard3Desc:
      'Your website is built the way Google likes it: fast and technically clean. That makes you easier to find and helps you climb the rankings.',
    bentoCard4Title: 'You look like the leader',
    bentoCard4Desc:
      'Too many clients walk away because a website looks dated. You get a cinematic design that makes your brand feel trustworthy from the first second.',
    bentoCard4Cta: 'Let us start',

    scopeBadge: 'Scope of work',
    scopeHeadingPre: 'What exactly do you',
    scopeHeadingAccent: 'get?',
    scopeLead: 'Scroll down to see the full launch package.',
    scopeItems: [
      { title: 'Cinematic visual design', desc: 'A design built from scratch, focused on conversion and the prestige of your brand.' },
      { title: 'Smooth animations and effects', desc: 'Subtle scroll animations that bring the site to life and keep visitors engaged.' },
      { title: 'Lead capture', desc: 'An optimized, secure contact form wired straight to your email address.' },
      { title: 'Flawless on mobile', desc: 'Every pixel tuned for phones and tablets, with a mobile first mindset.' },
      { title: 'Google Core Web Vitals', desc: 'Performance tuning for instant loading and top PageSpeed scores.' },
      { title: 'Launch support', desc: 'Help choosing hosting, connecting your domain and setting up a free SSL certificate.' },
    ],

    ctaBadge: 'A free slot this month',
    ctaHeadingPre: 'Ready for digital',
    ctaHeadingAccent: 'dominance?',
    ctaLead: 'Let us build the website your company deserves. Free consultation, zero obligations.',
    ctaPrimary: 'Free consultation',
    ctaSecondary: 'Write to us',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
// NOWA PODSTRONA (przebudowa 2026-10, praca równoległa etap 3 - chat 8, poziom 2 hierarchii podstron usług).
// `CompanyCopy` / `companyCopy` zasila StronaFirmowa.tsx. Stary `corporateDict` wyżej ZOSTAJE jako źródło tekstów
// (decyzja właściciela 2026-10-02: „copywriting niech biorą z pierwotnych wersji stron”) - usuwa go koordynator za
// zgodą właściciela po zamknięciu podstrony. Teksty: nagłówki, opisy, karty i punkty zakresu z `corporateDict`
// w pierwotnym brzmieniu; zmienione tylko to, co musi (tabela „było -> jest” w docs/podstrony/usluga-strona-firmowa.md):
// bez WordPressa / panelu CMS, przycisk „Bezpłatna konsultacja”, sentence case, bez myślników em / en, zakończenie
// wspólne dla podstron usług. Podpisy nowych scen: zaakceptowane zdania Oferty (lib/i18n/services.ts) i ton reszty.
// Termin realizacji NIEPOTWIERDZONY (do właściciela) - `scope.termValue` jest zaślepką.
// PL: twarde spacje (U+00A0) po jednoliterowych słowach i między liczbą a jednostką dokłada `typo()`.

export interface CompanyCopy {
  /** Nagłówek: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). Znak nowej linii w `title` = łamanie
      na komputerze (jak w pierwotnej wersji: „Strona firmowa,” / „która buduje zaufanie.”); na telefonie zwykła spacja. */
  head: { title: string; lead: string; cta: string; proof: string[] };
  /** Zaprojektowana, przykładowa strona firmowa klienta w kadrach („twojafirma.pl”): strona główna, trzy podstrony
      usług (każda w swoim kolorze), O nas, Kontakt. Teksty mówią, co stoi w danym miejscu - przykład, nie realizacja. */
  site: {
    domain: string; brand: string;
    nav: { services: string; about: string; work: string; contact: string }; navCta: string;
    /** Segmenty adresów podstron (pasek adresu kadru). */
    paths: { services: string; about: string; contact: string };
    services: { name: string; slug: string; text: string }[];
    home: { eyebrow: string; title: string; lead: string; cta: string; link: string; servicesTitle: string; servicesLead: string };
    service: { lead: string; points: { title: string; text: string }[]; cta: string; aside: string };
    about: { title: string; lead: string; teamName: string; teamRole: string; stats: { num: string; label: string }[] };
    contact: {
      title: string; lead: string; lines: string[]; reviewsTitle: string; review: string; reviewBy: string;
      fields: { label: string; value: string }[]; submit: string; sent: string;
    };
    foot: string;
  };
  /** Scena 1 (film „Piętra”): droga klienta przez stronę z podstronami - menu -> zjazd przez podstrony usług ->
      kontakt z wybraną usługą -> zapytanie z jej nazwą. */
  film: {
    stepsAria: string; steps: string[];
    note: { title: string; time: string; about: string; from: string };
  };
  /** Scena 2: „3 podstrony to dopiero początek” - strona rośnie o kolejne podstrony, kamera odjeżdża.
      `hint` / `hintTouch` = podpowiedź przy kartach (najechanie / dotknięcie karty pokazuje podstronę z bliska);
      kolejność `items` jest związana z układami makiet w mini.tsx (`EXTRA`); `close` / `prev` / `next` = przyciski
      podglądu karty na telefonie (pages.tsx: Viewer). */
  map: { title: string; titleAccent: string; lead: string; home: string; items: string[]; more: string; caption: string; hint: string; hintTouch: string; close: string; prev: string; next: string };
  /** Scena 3 (stos): cztery karty „Fundament skalowania” z rysunkami. `tag` = hasło na zakładce, `caption` = podpis rysunku. */
  cases: { title: string; titleAccent: string; lead: string; items: { tag: string; title: string; text: string; caption: string }[] };
  /** Scena 4 (zakres): lista + pokaz w kadrze, termin na linii wymiarowej. */
  scope: { title: string; titleAccent: string; items: { title: string; text: string }[]; termLabel: string; termValue: string };
  ending: { title: string; text: string; cta: string };
}

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd („i w”)
      .replace(/(\d) (h|s|dni|lat|godzin[a-z]*|podstron[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_COMPANY: CompanyCopy = {
  head: {
    title: 'Strona firmowa,\nktóra buduje zaufanie',
    lead: 'Kompletna wizytówka Twojego biznesu: oferta, o nas, realizacje, kontakt. Profesjonalna, szybka i dopracowana w każdym detalu.',
    cta: 'Bezpłatna konsultacja',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
  },
  site: {
    domain: 'twojafirma.pl',
    brand: 'Twoja firma',
    nav: { services: 'Usługi', about: 'O nas', work: 'Realizacje', contact: 'Kontakt' },
    navCta: 'Zapytaj o wycenę',
    paths: { services: 'uslugi', about: 'o-nas', contact: 'kontakt' },
    services: [
      { name: 'Usługa pierwsza', slug: 'usluga-pierwsza', text: 'Krótki opis usługi' },
      { name: 'Usługa druga', slug: 'usluga-druga', text: 'Krótki opis usługi' },
      { name: 'Usługa trzecia', slug: 'usluga-trzecia', text: 'Krótki opis usługi' },
    ],
    home: {
      eyebrow: 'Twoja branża, Twoje miasto',
      title: 'Nagłówek Twojej firmy.',
      lead: 'Krótki opis tego, co oferujesz klientowi, w jednym zdaniu.',
      cta: 'Poznaj ofertę',
      link: 'Skontaktuj się',
      servicesTitle: 'Usługi',
      servicesLead: 'Każda ma własną podstronę.',
    },
    service: {
      lead: 'Tu opowiadasz o tej usłudze swoim językiem.',
      points: [
        { title: 'Dla kogo', text: 'Komu ta usługa pomaga najbardziej.' },
        { title: 'Jak to działa', text: 'Współpraca krok po kroku.' },
        { title: 'Ile kosztuje', text: 'Cennik albo widełki, bez niespodzianek.' },
      ],
      cta: 'Zapytaj o tę usługę',
      aside: 'Odpowiadamy w jeden dzień roboczy.',
    },
    about: {
      title: 'Nasza historia od 2010',
      lead: 'Kim jesteśmy i czym się zajmujemy każdego dnia.',
      teamName: 'Imię Nazwisko',
      teamRole: 'Stanowisko',
      stats: [
        { num: '+150', label: 'Klientów' },
        { num: '14 lat', label: 'Doświadczenia' },
        { num: '50+', label: 'Projektów' },
      ],
    },
    contact: {
      title: 'Napisz, oddzwonimy.',
      lead: 'Wybierz usługę, resztę ustalimy w rozmowie.',
      lines: ['ul. Twoja 1, Twoje miasto', 'pon-pt, 9:00-17:00'],
      reviewsTitle: 'Opinie Google',
      review: 'Tu stanie opinia Twojego klienta, słowo w słowo.',
      reviewBy: 'Imię i nazwisko',
      fields: [
        { label: 'Imię', value: 'Marta' },
        { label: 'Telefon', value: '600 100 200' },
        { label: 'Usługa', value: 'Usługa trzecia' },
      ],
      submit: 'Wyślij zapytanie',
      sent: 'Wysłane',
    },
    foot: 'Adres, telefon i godziny na każdej podstronie',
  },
  film: {
    stepsAria: 'Jak działa strona firmowa',
    steps: [
      'Klient wybiera z menu usługę, której potrzebuje. Nie musi jej szukać.',
      'Każda usługa ma własną podstronę. Treść opowiada o ofercie Twoim językiem.',
      'Zapytanie przychodzi z nazwą usługi. Wiesz, o co chodzi, zanim oddzwonisz.',
    ],
    note: { title: 'Nowe zapytanie', time: 'przed chwilą', about: 'Pyta o:', from: 'Marta, 600 100 200' },
  },
  map: {
    title: '3 podstrony to dopiero',
    titleAccent: 'początek.',
    lead: 'To tylko przykładowy układ. Twoja strona dostaje podstrony i sekcje dobrane pod Twoją firmę, nie pod gotowy szablon.',
    home: 'Strona główna',
    items: [
      'Blog firmowy', 'FAQ', 'Cennik', 'Portfolio', 'Referencje',
      'Galeria zdjęć', 'Newsletter', 'Kariera', 'Aktualności', 'Wydarzenia',
      'Kalkulator usług', 'Sekcja zespół', 'Integracja Google Maps', 'Polityka prywatności',
      'Multi-język', 'System rezerwacji', 'Formularze custom', 'Pasek opinii',
      'Logo klientów', 'Strefa pobrań',
    ],
    more: '+ co potrzebujesz',
    caption: 'Każda nowa podstrona dołącza do tej samej strony i trafia do menu.',
    hint: 'Najedź na kartę, a zobaczysz podstronę z bliska.',
    hintTouch: 'Dotknij karty, a zobaczysz podstronę z bliska.',
    close: 'Zamknij podgląd',
    prev: 'Poprzednia podstrona',
    next: 'Następna podstrona',
  },
  cases: {
    title: 'Fundament',
    titleAccent: 'skalowania.',
    lead: 'Profesjonalna strona to nie wydatek - to Twój najciężej pracujący handlowiec. Twój biznes jest zabezpieczony technologicznie i wizerunkowo.',
    items: [
      { tag: 'Rozbudowa', title: 'Pełna skalowalność', text: 'Otrzymujesz system gotowy na rozbudowę. Niezależnie czy za rok dodasz sklep, portal pracowniczy czy platformę B2B - technologia nie zablokuje Twojego wzrostu.', caption: 'Sklep, portal i platforma dołączają do tej samej strony.' },
      { tag: 'Kolejny krok', title: 'Gotowa na kolejny krok', text: 'Twoja strona nie kończy się na premierze. Kiedy biznes nabiera tempa, jest gotowa rozbudować się o kolejne podstrony, funkcje, a z czasem nawet sklep.', caption: 'Nowa podstrona powstaje i dołącza do menu.' },
      { tag: 'Google', title: 'Architektura pod SEO', text: 'Twoja strona jest zbudowana tak, jak lubi Google: szybka i czysta technicznie. Dzięki temu łatwiej Cię znaleźć i łatwiej wspinasz się w wynikach.', caption: 'Każda podstrona to osobny wynik w wyszukiwarce.' },
      { tag: 'Wizerunek', title: 'Wyglądasz na lidera', text: 'Zbyt wielu klientów odrzuca ofertę, bo strona wygląda na przestarzałą. Zyskujesz kinowy design, dzięki któremu Twoja marka budzi zaufanie od pierwszej sekundy.', caption: 'Ta sama firma, zupełnie inne pierwsze wrażenie.' },
    ],
  },
  scope: {
    title: 'Co dokładnie',
    titleAccent: 'otrzymujesz?',
    items: [
      { title: 'Kinowy projekt graficzny', text: 'Projekt od zera, nastawiony na konwersję i prestiż Twojej marki.' },
      { title: 'Płynne animacje i efekty', text: 'Subtelne animacje na scrollu, które ożywiają stronę i przykuwają uwagę klienta.' },
      { title: 'Zbieranie leadów', text: 'Zoptymalizowany, zabezpieczony formularz kontaktowy podpięty bezpośrednio pod Twój adres e-mail.' },
      { title: 'Perfekcyjne na telefonie', text: 'Każdy piksel dopasowany do smartfonów i tabletów, z myślą najpierw o telefonie.' },
      { title: 'Google Core Web Vitals', text: 'Optymalizacja wydajności dla natychmiastowego ładowania i perfekcyjnych wyników PageSpeed.' },
      { title: 'Pomoc wdrożeniowa', text: 'Wsparcie w wyborze hostingu, podpięciu domeny i konfiguracji darmowego certyfikatu SSL.' },
    ],
    termLabel: 'Start',
    termValue: 'w ? dni',
  },
  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy stronę do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_COMPANY: CompanyCopy = {
  head: {
    title: 'A company website\nthat builds trust',
    lead: 'A complete showcase of your business: services, about, work and contact. Professional, fast and polished down to the last detail.',
    cta: 'Free consultation',
    proof: ['Free', 'no strings attached', 'reply within 24 h'],
  },
  site: {
    domain: 'yourcompany.com',
    brand: 'Your company',
    nav: { services: 'Services', about: 'About', work: 'Work', contact: 'Contact' },
    navCta: 'Ask for a quote',
    paths: { services: 'services', about: 'about', contact: 'contact' },
    services: [
      { name: 'Service one', slug: 'service-one', text: 'Short service description' },
      { name: 'Service two', slug: 'service-two', text: 'Short service description' },
      { name: 'Service three', slug: 'service-three', text: 'Short service description' },
    ],
    home: {
      eyebrow: 'Your industry, your city',
      title: 'Your company headline.',
      lead: 'A short description of what you offer clients, in one sentence.',
      cta: 'See the offer',
      link: 'Get in touch',
      servicesTitle: 'Services',
      servicesLead: 'Each one has its own page.',
    },
    service: {
      lead: 'Here you describe this service in your own words.',
      points: [
        { title: 'Who it is for', text: 'Who this service helps the most.' },
        { title: 'How it works', text: 'Working together, step by step.' },
        { title: 'What it costs', text: 'A price list or a range, no surprises.' },
      ],
      cta: 'Ask about this service',
      aside: 'We reply within one business day.',
    },
    about: {
      title: 'Our story since 2010',
      lead: 'Who we are and what we do every day.',
      teamName: 'First Last',
      teamRole: 'Position',
      stats: [
        { num: '+150', label: 'Clients' },
        { num: '14 years', label: 'Experience' },
        { num: '50+', label: 'Projects' },
      ],
    },
    contact: {
      title: 'Write to us, we call back.',
      lead: 'Pick a service, we sort out the rest in a call.',
      lines: ['1 Your Street, Your City', 'Mon-Fri, 9:00-17:00'],
      reviewsTitle: 'Google reviews',
      review: 'Your client’s review goes here, word for word.',
      reviewBy: 'Full name',
      fields: [
        { label: 'Name', value: 'Martha' },
        { label: 'Phone', value: '600 100 200' },
        { label: 'Service', value: 'Service three' },
      ],
      submit: 'Send inquiry',
      sent: 'Sent',
    },
    foot: 'Address, phone and hours on every page',
  },
  film: {
    stepsAria: 'How a company website works',
    steps: [
      'Your client picks the service they need from the menu. No hunting for it.',
      'Every service has its own page. The content talks about your offer in your words.',
      'The inquiry arrives with the service name. You know what it is about before you call back.',
    ],
    note: { title: 'New inquiry', time: 'just now', about: 'Asking about:', from: 'Martha, 600 100 200' },
  },
  map: {
    title: '3 pages are just the',
    titleAccent: 'beginning.',
    lead: 'This is just a sample layout. Your website gets pages and sections chosen for your company, not for a ready made template.',
    home: 'Home page',
    items: [
      'Company blog', 'FAQ', 'Pricing', 'Portfolio', 'Testimonials',
      'Photo gallery', 'Newsletter', 'Careers', 'News', 'Events',
      'Service calculator', 'Team section', 'Google Maps integration', 'Privacy policy',
      'Multi-language', 'Booking system', 'Custom forms', 'Reviews bar',
      'Client logos', 'Download area',
    ],
    more: '+ whatever you need',
    caption: 'Every new page joins the same website and lands in the menu.',
    hint: 'Hover a card to see the page up close.',
    hintTouch: 'Tap a card to see the page up close.',
    close: 'Close preview',
    prev: 'Previous page',
    next: 'Next page',
  },
  cases: {
    title: 'The foundation for',
    titleAccent: 'scaling.',
    lead: 'A professional website is not a cost, it is your hardest working salesperson. Your business stays protected, both technically and in how it is perceived.',
    items: [
      { tag: 'Growth', title: 'Full scalability', text: 'You get a system ready to grow. Whether you add a store, an employee portal or a B2B platform next year, the technology never blocks your growth.', caption: 'A store, a portal and a platform join the same website.' },
      { tag: 'Next step', title: 'Ready for the next step', text: 'Your website does not end at launch. As your business picks up speed, it is ready to grow with new pages, features and even a store down the line.', caption: 'A new page is built and joins the menu.' },
      { tag: 'Google', title: 'SEO ready architecture', text: 'Your website is built the way Google likes it: fast and technically clean. That makes you easier to find and helps you climb the rankings.', caption: 'Every page is a separate search result.' },
      { tag: 'Image', title: 'You look like the leader', text: 'Too many clients walk away because a website looks dated. You get a cinematic design that makes your brand feel trustworthy from the first second.', caption: 'The same company, a completely different first impression.' },
    ],
  },
  scope: {
    title: 'What exactly do you',
    titleAccent: 'get?',
    items: [
      { title: 'Cinematic visual design', text: 'A design built from scratch, focused on conversion and the prestige of your brand.' },
      { title: 'Smooth animations and effects', text: 'Subtle scroll animations that bring the site to life and keep visitors engaged.' },
      { title: 'Lead capture', text: 'An optimized, secure contact form wired straight to your email address.' },
      { title: 'Flawless on mobile', text: 'Every pixel tuned for phones and tablets, with a mobile first mindset.' },
      { title: 'Google Core Web Vitals', text: 'Performance tuning for instant loading and top PageSpeed scores.' },
      { title: 'Launch support', text: 'Help choosing hosting, connecting your domain and setting up a free SSL certificate.' },
    ],
    termLabel: 'Launch',
    termValue: 'in ? days',
  },
  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the website to it.',
    cta: 'Free consultation',
  },
};

export const companyCopy: Record<Locale, CompanyCopy> = { pl: typo(PL_COMPANY), en: EN_COMPANY };
