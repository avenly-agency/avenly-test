import { projects } from '@/app/data/projects';
import type { Locale } from '@/lib/i18n/locale';

/**
 * i18n dla portfolio: dane realizacji + słownik UI listy /realizacje i case study.
 *
 * Zasady (wzorzec: lib/i18n/services.ts):
 * - PL = źródło 1:1 (import z app/data/projects.ts + teksty z komponentów bajt w bajt).
 * - EN = kopia z przetłumaczonymi stringami treści (category, description,
 *   challenge, solution, etykiety statystyk). Struktura IDENTYCZNA: slug/title/
 *   obrazy/linki/techStack/hasCaseStudy/openChat bez zmian.
 * - Import danych TYLKO w server page LUB w komponencie klienckim po locale;
 *   dane to czyste stringi (zero JSX/ikon), więc client może je importować sam.
 *
 * Podstrona /realizacje (praca równoległa, etap 2 - chat 5, 2026-09-29) NIE używa już pola `category`
 * do filtra (dawne dopasowanie po fragmentach tekstu): kategorię filtra, nazwę wyświetlaną, akcent,
 * domenę, skrót i zakres każdej realizacji daje `workByLocale` niżej (fakty jak w sekcji Realizacje
 * na stronie głównej - lib/i18n/home/realizacje.ts). `category` zostaje dla danych strukturalnych
 * i martwego Portfolio.tsx.
 */

/** Typ danych realizacji - jedno źródło prawdy to app/data/projects.ts. */
export type ProjectsData = typeof projects;

// ─── DANE REALIZACJI PER LOCALE ────────────────────────────────────────────────
// EN budowane przez map po PL: spread zachowuje wszystkie pola strukturalne
// verbatim, override podmienia wyłącznie stringi treści (zero rozjazdu z PL).

type ProjectStrings = {
  category: string;
  description: string;
  challenge: string;
  solution: string;
  stats: { label: string; value: string }[];
};

const EN_PROJECT: Record<string, Partial<ProjectStrings>> = {
  mcentrumfizjoterapia: {
    category: 'Website',
    description: 'A new physiotherapy brand launch: a fast website built for local search and appointment booking through Booksy.',
    challenge:
      'Entering the local market as a brand new name. The clinic needed visibility in search and an image that builds trust from the very first visit to the site.',
    solution:
      'The clinic got a fast website built for local search. Thanks to near instant loading and structured data, it reached the number one spot in local search results within a month, and booking through Booksy made appointments easier for new and returning patients.',
    stats: [
      { label: 'Appointment booking', value: 'Booksy' },
      { label: 'Load time', value: '<1s' },
      { label: 'Search ranking', value: 'No. 1' },
    ],
  },
  'grawerstwo-kardys': {
    // 'e-commerce' → bucket Sklepy (getCategoryStyle + matchesFilter)
    category: 'E-commerce store',
    description:
      'A company website, an online store and a panel for managing the website and store, for an engraving workshop in business since 1990.',
    challenge:
      'A workshop from Mielec with over 30 years of experience serves two very different worlds: industry (stamps, dies, injection molds, marking) and individual customers (trophies, keepsakes, rubber stamps). Online, however, it had an outdated WordPress site and a store that had stopped working and hadn’t brought in orders for a long time. It needed one place that shows the full scale of the offer, lets customers order products online and does not add to the owner’s workload.',
    solution:
      'The workshop got three connected parts. The company website, in Polish and English, guides industrial and individual customers separately, shows past work and collects quote requests. The online store lets customers pick a product and pay online (BLIK, card or fast transfer via Przelewy24), with a customer account, order history and one-click reorders. It all runs on a panel where the workshop manages products, orders and portfolio items on its own, with no developer involved.',
    stats: [
      { label: 'Website, store and panel', value: '3 in 1' },
      { label: 'Language versions', value: 'PL / EN' },
      { label: 'Online sales', value: '24/7' },
    ],
  },
  'klub-sportowy': {
    category: 'Website',
    description: 'A modernized volleyball club website, a club management app and ongoing social media management.',
    challenge:
      'A third-division club with its own volleyball academy already had a WordPress website, but it needed one that keeps up with the season: fans look for fixtures and the squad, parents for academy sign-ups, and sponsors for a clear partnership offer. The board and coaches also needed one place for fees, training and attendance, and the club wanted consistent, regular communication on social media.',
    solution:
      'The club got a modernized website in place of its previous WordPress one: a look in the club colors, the next match and fixtures on the first screen, player profiles, academy sign-ups split into four age groups and a dedicated area for sponsors. Next to it runs a club app where the board, coaches, players and parents handle fees, the training calendar, attendance and messaging. We also run the club’s social media day to day (Facebook, Instagram, TikTok): match previews and reports, academy recruitment and sponsor communication, all in one style with the website.',
    stats: [
      { label: 'Website and club app', value: 'Web + app' },
      { label: 'Channels managed', value: '3' },
      { label: 'Academy groups', value: '4' },
    ],
  },
  'wirtualny-asystent-ai': {
    category: 'AI & bots',
    description:
      'The AI assistant on the Avenly website - it answers questions about the offer at any hour and hands the team ready inquiries.',
  },
};

const projectsEn: ProjectsData = projects.map((project) => ({
  ...project,
  ...EN_PROJECT[project.slug],
})) as ProjectsData;

/** Dane realizacji per locale. pl = źródło, en = kopia z przetłumaczonymi treściami. */
export const projectsByLocale: Record<Locale, ProjectsData> = {
  pl: projects,
  en: projectsEn,
};

// ─── KARTY REALIZACJI (/realizacje, case study) ─────────────────────────────────
// Nazwa wyświetlana, filtr, akcent, domena, skrót i zakres każdej realizacji. Fakty jak w sekcji
// Realizacje na stronie głównej (lib/i18n/home/realizacje.ts - tylko odczyt): RKS = strona + aplikacja
// klubowa + social media, Kardyś = punkt wyjścia to przestarzała strona na WordPressie i sklep bez
// zamówień (bez personalizacji graweru), asystent AI nie ma case study - otwiera czat. Bez metryk.
// Nazwy jak w sekcji na stronie głównej (decyzja właściciela: „Mcentrumfizjoterapia”, „Klub Sportowy RKS”).

export type WorkFilter = 'www' | 'shops' | 'ai';

export interface WorkItem {
  slug: string;
  /** Nazwa wyświetlana (proper noun, jak w sekcji Realizacje na stronie głównej). */
  name: string;
  filter: WorkFilter;
  /** Rodzaj realizacji, pisownia zdaniowa (np. „Strona, sklep i panel”). */
  kind: string;
  /** Kolor realizacji (barwy marki klienta) jako „r g b” 0-255 - akcent, nie kolor marki Avenly. */
  accent: string;
  /** Domena strony klienta (link zewnętrzny) albo null. */
  domain: string | null;
  /** Skrót na kartę listy. */
  summary: string;
  /** Zakres prac (lista na karcie i w case study). */
  scope: string[];
}

/** Kolejność na podstronie = kolejność sekcji Realizacje na stronie głównej (decyzja właściciela, Sesja 31). */
export const WORK_ORDER = ['klub-sportowy', 'grawerstwo-kardys', 'wirtualny-asystent-ai', 'mcentrumfizjoterapia'] as const;

type WorkBase = Pick<WorkItem, 'name' | 'filter' | 'accent' | 'domain'>;
const WORK_BASE: Record<(typeof WORK_ORDER)[number], WorkBase> = {
  'klub-sportowy': { name: 'Klub Sportowy RKS', filter: 'www', accent: '226 58 50', domain: 'klubsportowyrks.pl' },
  'grawerstwo-kardys': { name: 'Grawerstwo Józef Kardyś', filter: 'shops', accent: '219 164 92', domain: 'grawerstwomielec.pl' },
  'wirtualny-asystent-ai': { name: 'Wirtualny Asystent AI', filter: 'ai', accent: '59 130 246', domain: null },
  mcentrumfizjoterapia: { name: 'Mcentrumfizjoterapia', filter: 'www', accent: '251 146 60', domain: 'mcentrumfizjoterapia.pl' },
};

type WorkText = Pick<WorkItem, 'kind' | 'summary' | 'scope'>;
const buildWork = (texts: Record<(typeof WORK_ORDER)[number], WorkText>): WorkItem[] =>
  WORK_ORDER.map((slug) => ({ slug, ...WORK_BASE[slug], ...texts[slug], scope: [...texts[slug].scope] }));

export const workByLocale: Record<Locale, WorkItem[]> = {
  pl: buildWork({
    'klub-sportowy': {
      kind: 'Strona i aplikacja klubowa',
      // 2026-10-08 (właściciel: „strona klubu z terminarzem” to niedopowiedzenie): skrót i zakres mówią o skali - pełna modernizacja strony + aplikacja
      summary: 'Zmodernizowana strona i własna aplikacja klubu: kibic śledzi mecze, rodzic zapisuje dziecko do akademii, a klub prowadzi składki, treningi i obecności w jednej aplikacji.',
      scope: ['Pełna modernizacja strony klubu', 'Aplikacja do zarządzania klubem', 'Zapisy online do akademii', 'Prowadzenie social mediów klubu'],
    },
    'grawerstwo-kardys': {
      kind: 'Strona, sklep i panel',
      summary: 'Zamiast przestarzałej strony i sklepu bez zamówień: nowa strona, sklep z płatnościami online i jeden panel do zarządzania.',
      scope: ['Strona firmowa PL / EN', 'Sklep z płatnościami online', 'Konto klienta i ponowne zamówienia', 'Panel do zarządzania stroną i sklepem'],
    },
    'wirtualny-asystent-ai': {
      kind: 'Asystent AI',
      summary: 'Działa na tej stronie, w prawym dolnym rogu. Zna ofertę Avenly, odpowiada o każdej porze i przekazuje zespołowi gotowe zapytania.',
      scope: ['Odpowiedzi o ofercie', 'Gotowe zapytania dla zespołu', 'Historia rozmów w CRM'],
    },
    mcentrumfizjoterapia: {
      kind: 'Strona WWW',
      summary: 'Nowy gabinet, którego w okolicy nikt jeszcze nie znał. Strona zbudowana pod lokalne wyszukiwanie, z wizytą umawianą przez Booksy.',
      scope: ['Wizerunek nowej marki', 'Lokalne SEO', 'Rezerwacje online przez Booksy'],
    },
  }),
  en: buildWork({
    'klub-sportowy': {
      kind: 'Website and club app',
      summary: 'A modernized website and the club’s own app: fans follow the matches, parents sign their kids up for the academy, and the board and coaches run fees, training and attendance in one place.',
      scope: ['Full club website modernization', 'Club management app', 'Online academy sign-ups', 'Club social media management'],
    },
    'grawerstwo-kardys': {
      kind: 'Website, store and panel',
      summary: 'Instead of an outdated site and a store with no orders: a new website, a store with online payments and one panel to manage it all.',
      scope: ['Company website PL / EN', 'Store with online payments', 'Customer accounts and repeat orders', 'Website and store management panel'],
    },
    'wirtualny-asystent-ai': {
      kind: 'AI assistant',
      summary: 'It runs on this very site, in the bottom right corner. It knows Avenly’s offer, answers at any hour and hands the team ready inquiries.',
      scope: ['Answers about the offer', 'Ready inquiries for the team', 'Chat history in the CRM'],
    },
    mcentrumfizjoterapia: {
      kind: 'Website',
      summary: 'A new clinic nobody in the area knew yet. A website built for local search, with appointments booked through Booksy.',
      scope: ['New brand presence', 'Local SEO', 'Online booking through Booksy'],
    },
  }),
};

// ─── SŁOWNIK UI (/realizacje lista + /realizacje/[slug] case study) ─────────────

export interface RealizacjeDict {
  // Lista - nagłówek (wyśrodkowany, bez etykiety - runda 8)
  h1Lead: string;
  h1Accent: string;
  lead: string;
  /** Krótki opis pod tytułem nagłówka (runda 10). */
  leadShort: string;
  /** Biały przycisk (jedyne CTA serwisu). */
  cta: string;
  /** Drugi przycisk - otwiera czat (dawny kafel „Masz pytania?” pod siatką). */
  chat: string;
  chatAria: string;
  /** Linia dowodów pod przyciskami. */
  proof: string[];
  // Lista - filtr (klucze stabilne, wartości = widoczne etykiety)
  filters: { all: string; www: string; shops: string; ai: string };
  filterAria: string;
  gridTitle: string;
  /** Strzałka przewijania na dole nagłówka - nazwa dla czytników ekranu. */
  cueTitle: string;
  emptyState: string;
  // Karta projektu
  cardCaseStudy: string;
  cardChat: string;
  cardService: string;
  /** aria: `${prefix} ${name}` na linku rozciągniętym na kartę. */
  cardLinkAriaPrefix: string;
  /** aria linku zewnętrznego: `${siteAria} ${domena}`. */
  siteAria: string;
  /** alt kadru: `${prefix} ${name}`. */
  cardAltPrefix: string;
  techLabel: string;
  scopeLabel: string;
  /** Karta domykająca siatkę (gdy zostaje wolne miejsce) - wygląda jak kolejna realizacja z pustym kadrem. */
  nextKind: string;
  /** Adres wpisywany w pasku pustego kadru. */
  nextDomain: string;
  nextTitle: string;
  nextText: string;
  /** Etykieta siatki wszystkich realizacji po planszach (wersja „Plansze”). */
  allTitle: string;
  /** Nazwa (dla czytników) spisu realizacji w nagłówku - wersje „Spis” i „Konstelacja”. */
  heroIndexAria: string;
  // Case study (bez linku „Wróć” - decyzja właściciela 2026-09-29: bez ścieżek i powrotów na podstronach poza blogiem)
  viewOnline: string;
  /** Dopisek dla czytników ekranu przy linku do strony klienta. */
  newTabHint: string;
  statsLabel: string;
  liveLabel: string;
  liveHint: string;
  /** Nazwa (dla czytników) części z historią realizacji: punkt wyjścia, rozwiązanie, w skrócie. */
  storyAria: string;
  challengeLabel: string;
  solutionLabel: string;
  midCtaTitle: string;
  galleryLabel: string;
  galleryAltPrefix: string;
  nextProject: string;
  breadcrumbHome: string;
  breadcrumbList: string;
  // Case study - metadata (budowane w generateMetadata z pól projektu)
  metaTitleSuffix: string;
  /** `${description} ${metaProjectFor} ${client} (${year}). ${metaTech} ${stack}.` */
  metaProjectFor: string;
  metaTech: string;
  /** OG alt: `${metaOgAltPrefix} ${title} ${metaOgAltFor} ${client}`. */
  metaOgAltPrefix: string;
  metaOgAltFor: string;
}

export const realizacjeDict: Record<Locale, RealizacjeDict> = {
  pl: {
    h1Lead: 'Dowód,',
    h1Accent: 'nie obietnice.',
    lead: 'Prawdziwe strony prawdziwych firm. Każdą możesz otworzyć i sprawdzić sam, a przy każdej zobaczysz, od czego firma zaczynała i co dziś dla niej działa.',
    leadShort: 'Te strony pracują dziś dla prawdziwych firm. Zobacz, co widzą ich klienci.',
    cta: 'Bezpłatna konsultacja',
    chat: 'Porozmawiaj z asystentem',
    chatAria: 'Otwórz czat z asystentem AI Avenly',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
    filters: {
      all: 'Wszystkie',
      www: 'Strony WWW',
      shops: 'Sklepy',
      ai: 'AI i boty',
    },
    filterAria: 'Filtruj realizacje według kategorii',
    gridTitle: 'Lista realizacji',
    cueTitle: 'Przewiń do realizacji',
    emptyState: 'W tej kategorii nie ma jeszcze realizacji.',
    cardCaseStudy: 'Zobacz realizację',
    cardChat: 'Porozmawiaj z asystentem',
    cardService: 'Zobacz chatboty AI',
    cardLinkAriaPrefix: 'Zobacz realizację:',
    siteAria: 'Otwórz w nowej karcie stronę',
    cardAltPrefix: 'Strona realizacji:',
    techLabel: 'Technologia',
    scopeLabel: 'Zakres',
    nextKind: 'Twoja realizacja',
    nextDomain: 'twojafirma.pl',
    nextTitle: 'Twoja firma może być następna.',
    nextText: 'Opowiedz nam o niej, a zadbamy o to, co zobaczą Twoi klienci.',
    allTitle: 'Wszystkie realizacje',
    heroIndexAria: 'Realizacje na tej stronie',
    viewOnline: 'Zobacz stronę online',
    newTabHint: 'otwiera się w nowej karcie',
    statsLabel: 'W skrócie',
    liveLabel: 'Strona na żywo',
    liveHint: 'Przewijaj, a przejdziesz całą stronę od góry do dołu.',
    storyAria: 'Historia realizacji',
    challengeLabel: 'Punkt wyjścia',
    solutionLabel: 'Rozwiązanie',
    midCtaTitle: 'Chcesz podobny efekt w swojej firmie?',
    galleryLabel: 'Galeria projektu',
    galleryAltPrefix: 'Galeria:',
    nextProject: 'Następna realizacja',
    breadcrumbHome: 'Avenly',
    breadcrumbList: 'Realizacje',
    metaTitleSuffix: 'case study',
    metaProjectFor: 'Realizacja dla:',
    metaTech: 'Technologie:',
    metaOgAltPrefix: 'Realizacja:',
    metaOgAltFor: 'dla',
  },
  en: {
    h1Lead: 'Proof,',
    h1Accent: 'not promises.',
    lead: 'Real websites of real businesses. You can open each one and check it yourself, and for each you will see where the business started and what works for it today.',
    leadShort: 'These websites work for real businesses today. See what their customers see.',
    cta: 'Free consultation',
    chat: 'Talk to the assistant',
    chatAria: 'Open the Avenly AI assistant chat',
    proof: ['Free', 'no commitment', 'a reply within 24 h'],
    filters: {
      all: 'All',
      www: 'Websites',
      shops: 'Stores',
      ai: 'AI and bots',
    },
    filterAria: 'Filter projects by category',
    gridTitle: 'Project list',
    cueTitle: 'Scroll to the projects',
    emptyState: 'No projects in this category yet.',
    cardCaseStudy: 'View project',
    cardChat: 'Talk to the assistant',
    cardService: 'See AI chatbots',
    cardLinkAriaPrefix: 'View project:',
    siteAria: 'Open in a new tab:',
    cardAltPrefix: 'Project site:',
    techLabel: 'Stack',
    scopeLabel: 'Scope',
    nextKind: 'Your project',
    nextDomain: 'yourbusiness.com',
    nextTitle: 'Your business could be next.',
    nextText: "Tell us about it and we'll take care of what your customers see.",
    allTitle: 'All projects',
    heroIndexAria: 'Projects on this page',
    viewOnline: 'View the live site',
    newTabHint: 'opens in a new tab',
    statsLabel: 'At a glance',
    liveLabel: 'The live site',
    liveHint: 'Keep scrolling to go through the whole site from top to bottom.',
    storyAria: 'Project story',
    challengeLabel: 'Where it started',
    solutionLabel: 'The solution',
    midCtaTitle: 'Want a similar result for your business?',
    galleryLabel: 'Project gallery',
    galleryAltPrefix: 'Gallery:',
    nextProject: 'Next project',
    breadcrumbHome: 'Avenly',
    breadcrumbList: 'Work',
    metaTitleSuffix: 'case study',
    metaProjectFor: 'Project for:',
    metaTech: 'Technologies:',
    metaOgAltPrefix: 'Project:',
    metaOgAltFor: 'for',
  },
};
