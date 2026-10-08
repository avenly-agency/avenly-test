import type { Locale } from '@/lib/i18n/locale';
import { aiSceneCopy, type AiSceneCopy } from './system-crm-ai';
import { eyesCopy, type EyesCopy } from './system-crm-eyes';
import { heroPointsCopy, type HeroPointsCopy } from './system-crm-hero-points';
import { leadCopy, type LeadCopy } from './system-crm-lead';
import { modsCopy, type ModsCopy } from './system-crm-mods';

/**
 * Słownik podstrony /uslugi/strony-www/system-crm (AppWebClient - makieta 800vh
 * pulpit → klienci → zadania + bento + zakres prac + CTA).
 *
 * Zasady (wzorzec: lib/i18n/home/hero.ts):
 * - PL = tekst 1:1 bajt w bajt ze źródła (przed ekstrakcją do słownika).
 * - EN = natywne copy marketingowe (benefit voice you/your, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk, "Free consultation").
 * - Wartości liczbowe/waluta makiety (np. '1 240', '129 zł', '#001') zostają
 *   zaszyte w komponencie - są neutralne językowo, nie ma ich w słowniku.
 *   Tłumaczymy wyłącznie stringi z treścią słowną (etykiety, statusy, przyciski).
 * - Import TYLKO w server page; słownik wędruje do klienta jako props (RSC payload).
 */

export interface MockDict {
  // ── EKRAN 1: PULPIT ──
  dashEyebrow: string;
  dashGreeting: string;
  dashGreetingSub: string;
  newRecord: string;
  statUsers: string;
  statConversion: string;
  statTasks: string;
  statRevenue: string;
  chartTitle: string;
  chartSub: string;
  days: string[];
  recentActivity: string;
  activityItem: string;
  activityTime: string;
  recentOrders: string;
  seeAll: string;
  ordersCols: string[];
  orderClient: string;
  orderPaid: string;

  // ── EKRAN 2: KLIENCI ──
  clientsEyebrow: string;
  clientsTitle: string;
  addClient: string;
  clientsFilters: string[];
  clientsCols: string[];
  clientName: string;
  clientCompanyShort: string;
  clientEmail: string;
  clientStatus: string;
  clientsPagination: string;

  // ── EKRAN 3: ZADANIA ──
  tasksEyebrow: string;
  tasksTitle: string;
  tasksColumns: string[];
  taskTag: string;
  taskTitle: string;
  taskDate: string;

  // ── SHELL makiety ──
  urls: string[];
  demoBadge: string;
  scrollHint: string;
}

export interface ScopeItem {
  title: string;
  desc: string;
}

export interface AppWebDict {
  // ── HERO ──
  heroBadge: string;
  heroH1Line1: string;
  heroH1Line2: string;
  heroLead: string;

  // ── MAKIETA (wire + blue) ──
  mock: MockDict;

  // ── "MAKIETA = FRAGMENT" ──
  fragmentBadge: string;
  fragmentH2Line1: string;
  fragmentH2Line2Pre: string;
  fragmentH2Accent: string;
  fragmentP: string;
  fragmentRow1: string[];
  fragmentRow2: string[];
  fragmentPill: string;

  // ── BENTO ──
  bentoH2: string;
  bentoP: string;
  bentoCard1H3: string;
  bentoCard1P: string;
  bentoCard2H3: string;
  bentoCard2P: string;
  bentoCard3H3: string;
  bentoCard3P: string;
  bentoCard4H3: string;
  bentoCard4P: string;
  bentoCard4Btn: string;

  // ── ZAKRES PRAC ──
  scopeBadge: string;
  scopeH2Pre: string;
  scopeH2Accent: string;
  scopeP: string;
  scopeItems: ScopeItem[];

  // ── CTA CARD ──
  ctaBadge: string;
  ctaH2Pre: string;
  ctaH2Accent: string;
  ctaP: string;
  ctaBtnPrimary: string;
  ctaBtnSecondary: string;
}

export const appWebDict: Record<Locale, AppWebDict> = {
  pl: {
    heroBadge: 'CRM · Automatyzacje AI · B2B',
    heroH1Line1: 'Systemy CRM',
    heroH1Line2: 'pod Twój proces.',
    heroLead:
      'Masz proces, którego nie ogarnia żaden gotowy program? Zyskujesz system szyty dokładnie pod niego - CRM, portal klienta, panel B2B czy narzędzie wewnętrzne, które automatyzuje powtarzalną pracę z pomocą AI.',

    mock: {
      dashEyebrow: 'Pulpit',
      dashGreeting: 'Dzień dobry, Anno',
      dashGreetingSub: 'Oto co wydarzyło się w Twoim systemie dzisiaj.',
      newRecord: '+ Nowy rekord',
      statUsers: 'Użytkownicy',
      statConversion: 'Konwersja',
      statTasks: 'Zadania',
      statRevenue: 'Przychód',
      chartTitle: 'Aktywność w czasie',
      chartSub: 'Ostatnie 30 dni',
      days: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
      recentActivity: 'Ostatnia aktywność',
      activityItem: 'Nowe zdarzenie w systemie',
      activityTime: '2 godziny temu',
      recentOrders: 'Ostatnie zamówienia',
      seeAll: 'Zobacz wszystkie',
      ordersCols: ['ID', 'Klient', 'Status', 'Kwota'],
      orderClient: 'Klient',
      orderPaid: 'Opłacone',

      clientsEyebrow: 'Klienci',
      clientsTitle: 'Baza klientów',
      addClient: '+ Dodaj klienta',
      clientsFilters: ['Wszyscy', 'Aktywni', 'Nowi', 'VIP'],
      clientsCols: ['Nazwa', 'E-mail', 'Status', 'Wartość'],
      clientName: 'Imię Nazwisko',
      clientCompanyShort: 'firma.pl',
      clientEmail: 'kontakt@firma.pl',
      clientStatus: 'Aktywny',
      clientsPagination: '1-7 z 248',

      tasksEyebrow: 'Zadania',
      tasksTitle: 'Tablica projektu',
      tasksColumns: ['Backlog', 'W toku', 'Review', 'Gotowe'],
      taskTag: 'Feature',
      taskTitle: 'Tytuł zadania do wykonania',
      taskDate: '12 maj',

      urls: ['app.twoja-firma.pl/pulpit', 'app.twoja-firma.pl/klienci', 'app.twoja-firma.pl/zadania'],
      demoBadge: 'Makieta · Demo',
      scrollHint: 'Scrolluj, aby zobaczyć aplikację',
    },

    fragmentBadge: 'Makieta = fragment',
    fragmentH2Line1: 'Trzy ekrany to początek',
    fragmentH2Line2Pre: 'aplikacja ',
    fragmentH2Accent: 'rośnie z Tobą',
    fragmentP:
      'Makieta pokazuje kilka widoków. Twój system dostaje dokładnie te moduły, których potrzebujesz - a to, co widzisz niżej, to dopiero zajawka.',
    fragmentRow1: [
      'Autentykacja & role (RBAC)',
      'Panel administracyjny',
      'Strefa klienta B2B',
      'Integracje API (REST/GraphQL)',
      'Płatności online',
      'Powiadomienia e-mail/push',
      'Eksport CSV/PDF',
      'Dashboard analityczny',
      'Automatyzacje AI',
      'Multi-tenant',
    ],
    fragmentRow2: [
      'Logowanie SSO / OAuth',
      'Kalendarz & rezerwacje',
      'Wyszukiwarka full-text',
      'Czat na żywo',
      'Tryb offline (PWA)',
      'Audyt logów',
      'Webhooki',
      'Wersjonowanie danych',
      'Import danych',
      'Raporty na żądanie',
    ],
    fragmentPill: '+ cokolwiek wymyślisz',

    bentoH2: 'Technologia dopasowana do biznesu',
    bentoP:
      'Nie sprzedajemy gotowych szablonów. Projektujemy architekturę systemu od zera, automatyzując powtarzalne procesy z pomocą AI i myśląc o Twoich planach na przyszłość.',
    bentoCard1H3: 'React & Next.js - stos liderów',
    bentoCard1P:
      'Twój zespół pracuje w narzędziu, które odpowiada natychmiast - bo stoi na tym samym stosie co Vercel, Airbnb i Discord.',
    bentoCard2H3: 'Własna baza danych',
    bentoCard2P:
      'Pełna własność i kontrola nad danymi. Baza zaprojektowana pod Twój proces, którą rozbudowujesz bez limitów i opłat za każdy rekord.',
    bentoCard3H3: 'Bezpieczeństwo i role',
    bentoCard3P:
      'System uprawnień z rolami użytkowników, szyfrowanie danych i audyt logów. Twoje dane są chronione na każdym poziomie.',
    bentoCard4H3: 'Automatyzacje AI',
    bentoCard4P:
      'Wbudowujemy automatyzacje AI dokładnie tam, gdzie ich potrzebujesz. Powtarzalne procesy dzieją się same, a zespół skupia się na tym, co ważne.',
    bentoCard4Btn: 'Zacznijmy',

    scopeBadge: 'Zakres prac',
    scopeH2Pre: 'Od pomysłu',
    scopeH2Accent: 'do wdrożenia.',
    scopeP: 'Narzędzie zbudowane wokół Twoich procesów biznesowych.',
    scopeItems: [
      { title: 'Analiza wymagań', desc: 'Mapujemy procesy biznesowe i przekładamy je na specyfikację techniczną. Wiesz dokładnie, co budujesz.' },
      { title: 'Projekt UX/UI', desc: 'Klikalne makiety w Figmie. Testujesz przepływy użytkownika, zanim powstanie choć jedna linia kodu.' },
      { title: 'Interfejs', desc: 'Responsywny, dopracowany interfejs - reaguje natychmiast, bez przeładowań stron.' },
      { title: 'Logika i dane', desc: 'Bezpieczny silnik, który spina aplikację z Twoimi systemami (ERP, CRM, płatności) i pilnuje dostępu do danych.' },
      { title: 'Testy i QA', desc: 'Automatyczne testy jednostkowe i integracyjne. Błędy wykrywamy, zanim aplikacja trafi do Twojego zespołu.' },
      { title: 'Deploy & wsparcie', desc: 'Wdrożenie na szybką, niezawodną infrastrukturę chmurową, CI/CD i stałe wsparcie techniczne.' },
    ],

    ctaBadge: 'Wolny termin w tym miesiącu',
    ctaH2Pre: 'Gotowy na cyfrową',
    ctaH2Accent: 'Dominację?',
    ctaP: 'Zbudujmy system, który zdejmie z Twojego zespołu powtarzalną pracę. Darmowa konsultacja, zero zobowiązań.',
    ctaBtnPrimary: 'Bezpłatna konsultacja',
    ctaBtnSecondary: 'Napisz do nas',
  },

  en: {
    heroBadge: 'CRM · AI automations · B2B',
    heroH1Line1: 'CRM systems',
    heroH1Line2: 'built for your process.',
    heroLead:
      'Have a process that no off the shelf tool can handle? You get a system built exactly around it - a CRM, client portal, B2B panel or internal tool that automates repetitive work with AI.',

    mock: {
      dashEyebrow: 'Dashboard',
      dashGreeting: 'Good morning, Anna',
      dashGreetingSub: 'Here is what happened in your system today.',
      newRecord: '+ New record',
      statUsers: 'Users',
      statConversion: 'Conversion',
      statTasks: 'Tasks',
      statRevenue: 'Revenue',
      chartTitle: 'Activity over time',
      chartSub: 'Last 30 days',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      recentActivity: 'Recent activity',
      activityItem: 'New event in the system',
      activityTime: '2 hours ago',
      recentOrders: 'Recent orders',
      seeAll: 'See all',
      ordersCols: ['ID', 'Client', 'Status', 'Amount'],
      orderClient: 'Client',
      orderPaid: 'Paid',

      clientsEyebrow: 'Clients',
      clientsTitle: 'Client database',
      addClient: '+ Add client',
      clientsFilters: ['All', 'Active', 'New', 'VIP'],
      clientsCols: ['Name', 'E-mail', 'Status', 'Value'],
      clientName: 'Full Name',
      clientCompanyShort: 'company.com',
      clientEmail: 'contact@company.com',
      clientStatus: 'Active',
      clientsPagination: '1-7 of 248',

      tasksEyebrow: 'Tasks',
      tasksTitle: 'Project board',
      tasksColumns: ['Backlog', 'In progress', 'Review', 'Done'],
      taskTag: 'Feature',
      taskTitle: 'Task title to complete',
      taskDate: '12 May',

      urls: ['app.your-company.com/dashboard', 'app.your-company.com/clients', 'app.your-company.com/tasks'],
      demoBadge: 'Mockup · Demo',
      scrollHint: 'Scroll to explore the app',
    },

    fragmentBadge: 'Mockup = a fragment',
    fragmentH2Line1: 'Three screens are the start',
    fragmentH2Line2Pre: 'your app ',
    fragmentH2Accent: 'grows with you',
    fragmentP:
      'The mockup shows a few views. Your system gets exactly the modules you need - and what you see below is only a taste.',
    fragmentRow1: [
      'Authentication & roles (RBAC)',
      'Admin panel',
      'B2B client area',
      'API integrations (REST/GraphQL)',
      'Online payments',
      'E-mail/push notifications',
      'CSV/PDF export',
      'Analytics dashboard',
      'AI automations',
      'Multi-tenant',
    ],
    fragmentRow2: [
      'SSO / OAuth login',
      'Calendar & booking',
      'Full-text search',
      'Live chat',
      'Offline mode (PWA)',
      'Log audit',
      'Webhooks',
      'Data versioning',
      'Data import',
      'On-demand reports',
    ],
    fragmentPill: '+ whatever you imagine',

    bentoH2: 'Technology matched to your business',
    bentoP:
      'We do not sell ready made templates. We design the system architecture from scratch, automate repetitive processes with AI and plan around where you are heading next.',
    bentoCard1H3: 'React & Next.js - the leaders stack',
    bentoCard1P:
      'Your team works in a tool that responds instantly - because it runs on the same stack as Vercel, Airbnb and Discord.',
    bentoCard2H3: 'Your own database',
    bentoCard2P:
      'Full ownership and control of your data. A database designed around your process that you extend without limits or per record fees.',
    bentoCard3H3: 'Security and roles',
    bentoCard3P:
      'A permission system with user roles, data encryption and log auditing. Your data is protected at every level.',
    bentoCard4H3: 'AI automations',
    bentoCard4P:
      'We build AI automations exactly where you need them. Repetitive processes run on their own while your team focuses on what matters.',
    bentoCard4Btn: "Let's start",

    scopeBadge: 'Scope of work',
    scopeH2Pre: 'From idea',
    scopeH2Accent: 'to launch.',
    scopeP: 'A tool built around your business processes.',
    scopeItems: [
      { title: 'Requirements analysis', desc: 'We map your business processes and turn them into a technical specification. You know exactly what you are building.' },
      { title: 'UX/UI design', desc: 'Clickable mockups in Figma. You test the user flows before a single line of code exists.' },
      { title: 'Interface', desc: 'A responsive, polished interface - it reacts instantly, with no page reloads.' },
      { title: 'Logic and data', desc: 'A secure engine that connects the app with your systems (ERP, CRM, payments) and guards access to your data.' },
      { title: 'Testing and QA', desc: 'Automated unit and integration tests. We catch bugs before the app reaches your team.' },
      { title: 'Deploy & support', desc: 'Deployment to fast, reliable cloud infrastructure, CI/CD and ongoing technical support.' },
    ],

    ctaBadge: 'One slot open this month',
    ctaH2Pre: 'Ready for digital',
    ctaH2Accent: 'Dominance?',
    ctaP: 'Let us build a system that takes repetitive work off your team. Free consultation, no obligations.',
    ctaBtnPrimary: 'Free consultation',
    ctaBtnSecondary: 'Write to us',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// NOWA PODSTRONA (praca równoległa, etap 3 - chat 11, od 2026-10-04). `appWebDict` wyżej to pierwotna wersja:
// zostaje na dysku jako ŹRÓDŁO TEKSTÓW (nieimportowany), usuwa go koordynator za zgodą właściciela.
// System CRM to inna usługa niż strony WWW (właściciel 2026-10-04: „CRM i chatboty mają być inne, bo to inna usługa”):
// podstrona jest próbką narzędzia - odwiedzający dotyka działającego, PRZYKŁADOWEGO systemu.
// RUNDA 1: cztery pomysły na całą podstronę (przełącznik w panelu na dole ekranu, tylko dev) - każdy ma własne teksty:
//   mess    „Porządek”     - rozrzucone kartki, arkusz i skrzynka trafiają do jednego systemu,
//   board   „Tablica”      - odwiedzający sam prowadzi zlecenie przez etapy, a system odpowiada,
//   roles   „Role”         - ten sam system oczami właściciela, pracownika i klienta,
//   builder „Twój proces”  - system układa się pod branżę, etapy da się wpisać po swojemu.
// Zasady (PRODUCT.md): głos korzyści, sentence case, bez myślników em / en, jedno CTA „Bezpłatna konsultacja”,
// AI wyłącznie jako opcja („na życzenie”), dane przykładowe (wymyślona firma, bez prawdziwych klientów i wyników).
// PL: twarde spacje po jednoliterowych słowach dokłada `typo()`. Notatki: docs/podstrony/usluga-system-crm.md.

export interface CrmRow { t: string; s: string }
export type CrmSection = 'inq' | 'cli' | 'task' | 'cal';
export type CrmRole = 'owner' | 'office' | 'staff';

export interface SystemCrmCopy {
  /** Nagłówek: zdanie bez kropki (kropkę w kolorze podstrony dokłada komponent). */
  head: { title: string; lead: string; cta: string; proof: string[] };
  /** Przykładowa firma w oknie systemu (wymyślona - pracownia mebli na wymiar). */
  app: { name: string; sub: string; badge: string };
  /** Zespół przykładowej firmy; kolejność stała: biuro, pomiary i montaż, stolarnia. */
  team: { name: string; role: string }[];
  /** Dane przykładowego systemu w scenie głównej: sekcje i ich wiersze (`to` = sekcja, do której należą `rows`). */
  mess: {
    sections: { id: CrmSection; label: string }[];
    items: { id: string; to: CrmSection; rows: CrmRow[] }[];
  };
  /** Tablica zleceń przykładowej firmy: etapy i jedno przykładowe zlecenie. */
  board: {
    stages: string[]; stagesAria: string;
    card: { title: string; client: string; src: string; task: string };
  };
  /** Role w sekcji „Każdy widzi to, co powinien” - WYŁĄCZNIE role wewnątrz firmy: właściciel, biuro, pracownik
      (właściciel 2026-10-05: widok klienta na własne zlecenie to nie jest coś, co można obiecać w każdym systemie).
      `vDone` / `stDone` = wartość po odhaczeniu montażu przez pracownika, `who` = indeks w `team`. */
  roles: {
    roles: { id: CrmRole; label: string; who: string }[];
    modules: string[]; locked: string;
    owner: {
      title: string; listTitle: string;
      stats: { l: string; v: string; vDone: string }[];
      rows: { t: string; c: string; who: number; st: string; stDone?: string }[];
    };
    /** Widok biura: lista zleceń (te same wiersze co u właściciela) i dzisiejsze terminy. */
    office: { title: string; calTitle: string; cal: string[] };
    staff: { title: string; tasks: CrmRow[] };
    /** Dane mini-ekranu OPCJONALNEGO modułu „Portal klienta” w sekcji modułów (mods-ui.tsx) - to nie jest rola. */
    portal: { title: string; order: string; stages: string[]; note: string; noteDone: string; docsTitle: string; docs: string[] };
  };
  /** „Bębny”: branże z własnymi modułami, etapami i kartami (karta i stoi w etapie i). */
  builder: {
    modulesAria: string;
    trades: { id: string; label: string; modules: string[]; stages: string[]; cards: { t: string; f: string }[] }[];
  };
  /** Narratorzy scen: etykieta listy zdań dla czytników ekranu i zdania sekcji ról („Klucz”). */
  film: { stepsAria: string; roles: string[] };
  /** Sekcja „Bębny” (cztery branże w jednym układzie): tytuł tylko dla czytników ekranu - widoczny nagłówek i opis
      usunięte na prośbę właściciela 2026-10-04. */
  fit: { title: string };
  /** Sekcja modułów („Trzy ekrany to początek. System rośnie z Tobą.” - z pierwotnej wersji podstrony). */
  grow: {
    title: string; titleAccent: string; lead: string; count: string; more: string;
    modules: { name: string; text: string }[];
  };
  /** Sekcja „AI na życzenie”: `ai` przy zadaniu = to zadanie może przejąć AI (opcja, nie pewnik). */
  ai: {
    title: string; lead: string; switch: string; you: string; ai: string; note: string;
    tasks: { t: string; ai: boolean }[];
  };
  ending: { title: string; text: string; cta: string };
  /** Własne teksty scen (każda scena ma osobny plik `system-crm-<scena>.ts`, tu są tylko składane). */
  x: SystemCrmScenes;
}

/** Teksty scen (osobne pliki `system-crm-<scena>.ts`). Po wyborach właściciela z 2026-10-04: scena główna „Z punktów”,
    role „Klucz”, AI „Tory”; sekcje „Nic już nie ginie” i moduły mają nowe propozycje rundy 4. Słowniki odrzuconych
    scen usunięte. */
export interface SystemCrmScenes {
  heroPoints: HeroPointsCopy; lead: LeadCopy; eyes: EyesCopy; mods: ModsCopy; ai: AiSceneCopy;
}
type BaseCopy = Omit<SystemCrmCopy, 'x'>;

/** Twarde spacje: po jednoliterowych słowach („w”, „i”, „z”, „o”, „a”, „u”) i między liczbą a jednostką. */
const typo = <T,>(v: T): T => {
  if (typeof v === 'string') {
    return v
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ')
      .replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2 ') // drugi przebieg: dwa jednoliterowe słowa pod rząd („i w”)
      .replace(/(\d) (h|s|m|dni|godzin[a-z]*)(?![a-ząćęłńóśźż])/g, '$1 $2') as T;
  }
  if (Array.isArray(v)) return v.map(typo) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typo(x)])) as T;
  return v;
};

const PL_COPY: BaseCopy = {
  head: {
    // z pierwotnej wersji: „Systemy CRM” + „pod Twój proces.”
    title: 'Systemy CRM pod Twój proces',
    // z pierwotnej wersji, bez żargonu („panel B2B”, „narzędzie wewnętrzne”) i z AI jako opcją (PRODUCT.md)
    // właściciel 2026-10-06: słowo „szyty” brzmi źle („frajersko”) - nie używać go w tekstach tej podstrony
    lead: 'Masz proces, którego nie ogarnia żaden gotowy program? Zyskujesz system zbudowany dokładnie pod niego. Opcjonalnie dołożymy do niego automatyzacje AI.',
    cta: 'Bezpłatna konsultacja',
    // właściciel 2026-10-06: linia „Bezpłatnie · bez zobowiązań · odpowiedź w 24 h” usunięta z tej podstrony (pusty
    // akapit ze szkieletu chowa reguła .sv.cr .sv-proof w system-crm.css) - nie przywracać
    proof: [],
  },
  app: { name: 'Pracownia Dąb', sub: 'meble na wymiar', badge: 'Przykładowy system' },
  team: [
    { name: 'Ola', role: 'biuro' },
    { name: 'Marek', role: 'pomiary i montaż' },
    { name: 'Tomek', role: 'stolarnia' },
  ],
  mess: {
    sections: [
      { id: 'inq', label: 'Zapytania' },
      { id: 'cli', label: 'Klienci' },
      { id: 'task', label: 'Zadania' },
      { id: 'cal', label: 'Kalendarz' },
    ],
    items: [
      {
        id: 'sheet', to: 'cli',
        rows: [{ t: 'Anna K.', s: 'szafa wnękowa' }, { t: 'Jan Nowak', s: 'stół dębowy' }, { t: 'Biuro Linia', s: 'zabudowa recepcji' }],
      },
      { id: 'note1', to: 'task', rows: [{ t: 'Oddzwonić do Anny K.', s: 'dziś · Ola' }] },
      { id: 'mail', to: 'inq', rows: [{ t: 'Kuchnia na wymiar', s: 'ze strony · nowe' }] },
      { id: 'note2', to: 'task', rows: [{ t: 'Wycena: stół dębowy', s: 'do piątku · Tomek' }] },
      { id: 'phone', to: 'inq', rows: [{ t: 'Prośba o kontakt', s: 'telefon · nowe' }] },
      { id: 'cal', to: 'cal', rows: [{ t: 'Pomiar u klienta', s: 'czwartek, 10:00 · Marek' }] },
    ],
  },
  board: {
    stages: ['Zapytanie', 'Wycena', 'Realizacja', 'Gotowe'],
    stagesAria: 'Etapy zlecenia',
    card: { title: 'Szafa wnękowa 2,4 m', client: 'Anna K.', src: 'zapytanie ze strony', task: 'Wycena wysłana do klientki' },
  },
  roles: {
    roles: [
      { id: 'owner', label: 'Właściciel', who: 'Ty' },
      { id: 'office', label: 'Biuro', who: 'Ola' },
      { id: 'staff', label: 'Pracownik', who: 'Marek' },
    ],
    modules: ['Pulpit', 'Zlecenia', 'Klienci', 'Kalendarz', 'Finanse', 'Ustawienia'],
    locked: 'niedostępne w tej roli',
    owner: {
      title: 'Dziś w firmie',
      listTitle: 'Zlecenia',
      stats: [
        { l: 'Nowe zapytania', v: '2', vDone: '2' },
        { l: 'W realizacji', v: '5', vDone: '4' },
        { l: 'Zakończone w tym tygodniu', v: '3', vDone: '4' },
      ],
      rows: [
        { t: 'Szafa wnękowa 2,4 m', c: 'Anna K.', who: 1, st: 'Montaż dziś', stDone: 'Gotowe' },
        { t: 'Kuchnia na wymiar', c: 'Jan Nowak', who: 2, st: 'W stolarni' },
        { t: 'Zabudowa recepcji', c: 'Biuro Linia', who: 0, st: 'Wycena' },
      ],
    },
    office: {
      title: 'Zlecenia',
      calTitle: 'Dziś w kalendarzu',
      cal: ['10:00 · montaż szafy u Anny K.', '14:30 · pomiar kuchni u Jana Nowaka'],
    },
    staff: {
      title: 'Marek, zadania na dziś',
      tasks: [
        { t: 'Montaż szafy u Anny K.', s: '10:00 · ul. Lipowa 4' },
        { t: 'Pomiar kuchni u Jana Nowaka', s: '14:30' },
        { t: 'Odbiór okuć z hurtowni', s: 'po drodze' },
      ],
    },
    portal: {
      title: 'Twoje zlecenie',
      order: 'Szafa wnękowa 2,4 m',
      stages: ['Zapytanie', 'Wycena', 'Produkcja', 'Montaż', 'Gotowe'],
      note: 'Montaż dziś o 10:00. Przyjedzie Marek.',
      noteDone: 'Szafa zamontowana. Dziękujemy!',
      docsTitle: 'Dokumenty',
      docs: ['Wycena.pdf', 'Projekt.pdf'],
    },
  },
  builder: {
    modulesAria: 'Moduły systemu',
    trades: [
      {
        id: 'meble', label: 'Pracownia mebli',
        modules: ['Zlecenia', 'Klienci', 'Kalendarz pomiarów', 'Magazyn płyt'],
        stages: ['Zapytanie', 'Pomiar', 'Produkcja', 'Montaż'],
        cards: [
          { t: 'Kuchnia na wymiar', f: 'Jan Nowak · ze strony' },
          { t: 'Szafa wnękowa', f: 'Anna K. · czwartek, 10:00' },
          { t: 'Stół dębowy', f: 'Biuro Linia · w stolarni' },
          { t: 'Garderoba', f: 'Ewa M. · montaż w piątek' },
        ],
      },
      {
        id: 'warsztat', label: 'Warsztat samochodowy',
        modules: ['Zlecenia', 'Pojazdy', 'Stanowiska', 'Części'],
        stages: ['Przyjęcie', 'Diagnoza', 'Naprawa', 'Odbiór'],
        cards: [
          { t: 'Skoda Octavia', f: 'przegląd przed zimą' },
          { t: 'Ford Focus', f: 'stuki w zawieszeniu' },
          { t: 'Toyota Yaris', f: 'wymiana rozrządu' },
          { t: 'Opel Astra', f: 'gotowy do odbioru' },
        ],
      },
      {
        // moduły jak w aplikacji klubowej z realizacji (składki, kalendarz treningów, obecności) - bez nazwy klubu
        id: 'klub', label: 'Klub sportowy',
        modules: ['Zawodnicy', 'Kalendarz treningów', 'Obecności', 'Składki'],
        stages: ['Zapis', 'Grupa', 'Składka', 'Treningi'],
        cards: [
          { t: 'Kuba, 9 lat', f: 'zapis przez stronę' },
          { t: 'Zosia, 11 lat', f: 'grupa młodzików' },
          { t: 'Antek, 13 lat', f: 'składka za październik' },
          { t: 'Hania, 10 lat', f: 'obecność: 8 z 8' },
        ],
      },
      {
        id: 'sklep', label: 'Sklep internetowy',
        modules: ['Zamówienia', 'Produkty', 'Klienci', 'Zwroty'],
        stages: ['Nowe', 'Opłacone', 'Spakowane', 'Wysłane'],
        cards: [
          { t: 'Zamówienie 1042', f: 'kubek i misa' },
          { t: 'Zamówienie 1041', f: 'płatność przyjęta' },
          { t: 'Zamówienie 1040', f: 'czeka na kuriera' },
          { t: 'Zamówienie 1039', f: 'paczkomat' },
        ],
      },
    ],
  },
  film: {
    stepsAria: 'Co dzieje się w scenie',
    roles: [
      'Właściciel widzi całą firmę na jednym ekranie.',
      'Biuro widzi zlecenia, klientów i terminy. Finanse zostają zamknięte.',
      'Pracownik widzi tylko swoje zadania. Właśnie odhacza montaż.',
      // końcówka = punkt Oferty („Każdy widzi to, co powinien”)
      'U właściciela liczby już to wiedzą. Każdy widzi to, co powinien.',
    ],
  },
  fit: {
    title: 'Zbudowany pod Twój proces',
  },
  grow: {
    // z pierwotnej wersji: „Trzy ekrany to początek / aplikacja rośnie z Tobą”
    title: 'Trzy ekrany to początek.',
    titleAccent: 'System rośnie z Tobą.',
    lead: 'Twój system dostaje dokładnie te moduły, których potrzebujesz. Kolejne dokładasz, gdy przyjdzie na nie czas.',
    count: 'Włączone moduły',
    more: '+ to, czego potrzebuje Twoja firma',
    modules: [
      { name: 'Zlecenia', text: 'Każde zapytanie i zamówienie w jednym miejscu.' },
      { name: 'Klienci', text: 'Historia kontaktu pod jednym nazwiskiem.' },
      { name: 'Kalendarz', text: 'Terminy i rezerwacje bez podwójnych wpisów.' },
      { name: 'Zadania', text: 'Każdy wie, co ma dziś zrobić.' },
      { name: 'Role i uprawnienia', text: 'Każdy widzi to, co powinien.' },
      { name: 'Powiadomienia', text: 'Mail do klienta wychodzi sam, we właściwej chwili.' },
      { name: 'Raporty', text: 'Liczby z całej firmy bez przepisywania do arkusza.' },
      { name: 'Portal klienta', text: 'Klient sam sprawdza status swojego zlecenia.' },
    ],
  },
  ai: {
    // właściciel 2026-10-05: „AI jest opcjonalne, a nie zapewnienie, że będzie” - sekcja mówi wprost o opcji
    title: 'AI to opcja, nie obowiązek',
    lead: 'System działa w pełni bez AI. Jeśli zechcesz, dołożymy automatyzacje, które przejmą żmudne, powtarzalne zadania.',
    switch: 'Opcja: AI',
    you: 'Robisz Ty',
    ai: 'Robi AI',
    note: 'AI przygotowuje, Ty akceptujesz.',
    tasks: [
      { t: 'Odpisać na nowe zapytanie', ai: true },
      { t: 'Przepisać dane klienta z maila', ai: true },
      { t: 'Ustalić wycenę z klientem', ai: false },
      { t: 'Przypomnieć o jutrzejszym pomiarze', ai: true },
      { t: 'Streścić notatki ze spotkania', ai: true },
      { t: 'Zdecydować, co robimy najpierw', ai: false },
    ],
  },
  // wspólne zakończenie podstron usług (słowa właściciela), dopasowane jednym słowem
  ending: {
    title: 'Zacznijmy od rozmowy',
    text: 'Opowiedz nam o swojej firmie, a dopasujemy system do Twojego biznesu.',
    cta: 'Bezpłatna konsultacja',
  },
};

const EN_COPY: BaseCopy = {
  head: {
    title: 'CRM systems built for your process',
    lead: 'Have a process that no off the shelf tool can handle? You get a system built exactly around it. AI automations are an optional extra.',
    cta: 'Free consultation',
    proof: [],
  },
  app: { name: 'Oak Workshop', sub: 'custom furniture', badge: 'Example system' },
  team: [
    { name: 'Emma', role: 'office' },
    { name: 'Mark', role: 'measuring and fitting' },
    { name: 'Tom', role: 'workshop' },
  ],
  mess: {
    sections: [
      { id: 'inq', label: 'Inquiries' },
      { id: 'cli', label: 'Clients' },
      { id: 'task', label: 'Tasks' },
      { id: 'cal', label: 'Calendar' },
    ],
    items: [
      {
        id: 'sheet', to: 'cli',
        rows: [{ t: 'Anna K.', s: 'fitted wardrobe' }, { t: 'John Novak', s: 'oak table' }, { t: 'Linia Office', s: 'reception desk' }],
      },
      { id: 'note1', to: 'task', rows: [{ t: 'Call Anna K. back', s: 'today · Emma' }] },
      { id: 'mail', to: 'inq', rows: [{ t: 'Custom kitchen', s: 'from the website · new' }] },
      { id: 'note2', to: 'task', rows: [{ t: 'Quote: oak table', s: 'by Friday · Tom' }] },
      { id: 'phone', to: 'inq', rows: [{ t: 'Callback request', s: 'phone · new' }] },
      { id: 'cal', to: 'cal', rows: [{ t: 'Measuring at the client', s: 'Thursday, 10:00 · Mark' }] },
    ],
  },
  board: {
    stages: ['Inquiry', 'Quote', 'In progress', 'Done'],
    stagesAria: 'Job stages',
    card: { title: 'Fitted wardrobe, 2.4 m', client: 'Anna K.', src: 'inquiry from the website', task: 'Quote sent to the client' },
  },
  roles: {
    roles: [
      { id: 'owner', label: 'Owner', who: 'You' },
      { id: 'office', label: 'Office', who: 'Emma' },
      { id: 'staff', label: 'Employee', who: 'Mark' },
    ],
    modules: ['Dashboard', 'Jobs', 'Clients', 'Calendar', 'Finance', 'Settings'],
    locked: 'not available in this role',
    owner: {
      title: 'Today in the company',
      listTitle: 'Jobs',
      stats: [
        { l: 'New inquiries', v: '2', vDone: '2' },
        { l: 'In progress', v: '5', vDone: '4' },
        { l: 'Finished this week', v: '3', vDone: '4' },
      ],
      rows: [
        { t: 'Fitted wardrobe, 2.4 m', c: 'Anna K.', who: 1, st: 'Fitting today', stDone: 'Done' },
        { t: 'Custom kitchen', c: 'John Novak', who: 2, st: 'In the workshop' },
        { t: 'Reception desk', c: 'Linia Office', who: 0, st: 'Quote' },
      ],
    },
    office: {
      title: 'Jobs',
      calTitle: 'Today in the calendar',
      cal: ['10:00 · wardrobe fitting at Anna K.', '14:30 · kitchen measuring at John Novak'],
    },
    staff: {
      title: 'Mark, tasks for today',
      tasks: [
        { t: 'Fit the wardrobe at Anna K.', s: '10:00 · 4 Lipowa St' },
        { t: 'Measure the kitchen at John Novak', s: '14:30' },
        { t: 'Pick up fittings from the supplier', s: 'on the way' },
      ],
    },
    portal: {
      title: 'Your order',
      order: 'Fitted wardrobe, 2.4 m',
      stages: ['Inquiry', 'Quote', 'Production', 'Fitting', 'Done'],
      note: 'Fitting today at 10:00. Mark is coming.',
      noteDone: 'Wardrobe fitted. Thank you!',
      docsTitle: 'Documents',
      docs: ['Quote.pdf', 'Design.pdf'],
    },
  },
  builder: {
    modulesAria: 'System modules',
    trades: [
      {
        id: 'meble', label: 'Furniture workshop',
        modules: ['Jobs', 'Clients', 'Measuring calendar', 'Board stock'],
        stages: ['Inquiry', 'Measuring', 'Production', 'Fitting'],
        cards: [
          { t: 'Custom kitchen', f: 'John Novak · from the website' },
          { t: 'Fitted wardrobe', f: 'Anna K. · Thursday, 10:00' },
          { t: 'Oak table', f: 'Linia Office · in the workshop' },
          { t: 'Walk in closet', f: 'Eve M. · fitting on Friday' },
        ],
      },
      {
        id: 'warsztat', label: 'Car repair shop',
        modules: ['Jobs', 'Vehicles', 'Bays', 'Parts'],
        stages: ['Check in', 'Diagnosis', 'Repair', 'Pick up'],
        cards: [
          { t: 'Skoda Octavia', f: 'pre winter check' },
          { t: 'Ford Focus', f: 'knocking suspension' },
          { t: 'Toyota Yaris', f: 'timing belt replacement' },
          { t: 'Opel Astra', f: 'ready for pick up' },
        ],
      },
      {
        id: 'klub', label: 'Sports club',
        modules: ['Players', 'Training calendar', 'Attendance', 'Fees'],
        stages: ['Sign up', 'Group', 'Fee', 'Training'],
        cards: [
          { t: 'Jake, age 9', f: 'signed up on the website' },
          { t: 'Sophie, age 11', f: 'junior group' },
          { t: 'Tony, age 13', f: 'fee for October' },
          { t: 'Hannah, age 10', f: 'attendance: 8 of 8' },
        ],
      },
      {
        id: 'sklep', label: 'Online store',
        modules: ['Orders', 'Products', 'Customers', 'Returns'],
        stages: ['New', 'Paid', 'Packed', 'Shipped'],
        cards: [
          { t: 'Order 1042', f: 'mug and bowl' },
          { t: 'Order 1041', f: 'payment received' },
          { t: 'Order 1040', f: 'waiting for the courier' },
          { t: 'Order 1039', f: 'parcel locker' },
        ],
      },
    ],
  },
  film: {
    stepsAria: 'What happens in the scene',
    roles: [
      'The owner sees the whole business on one screen.',
      'The office sees jobs, clients and dates. Finance stays locked.',
      'An employee sees only his own tasks. He is ticking the fitting off.',
      'The owner’s numbers already know. Everyone sees what they should.',
    ],
  },
  fit: {
    title: 'Built for your process',
  },
  grow: {
    title: 'Three screens are the start.',
    titleAccent: 'The system grows with you.',
    lead: 'Your system gets exactly the modules you need. You add the next ones when their time comes.',
    count: 'Modules on',
    more: '+ whatever your company needs',
    modules: [
      { name: 'Jobs', text: 'Every inquiry and order in one place.' },
      { name: 'Clients', text: 'The whole contact history under one name.' },
      { name: 'Calendar', text: 'Dates and bookings with no double entries.' },
      { name: 'Tasks', text: 'Everyone knows what to do today.' },
      { name: 'Roles and permissions', text: 'Everyone sees what they should.' },
      { name: 'Notifications', text: 'The email to your client goes out by itself, at the right moment.' },
      { name: 'Reports', text: 'Numbers from the whole company with no retyping into a spreadsheet.' },
      { name: 'Client portal', text: 'Clients check the status of their job themselves.' },
    ],
  },
  ai: {
    title: 'AI is an option, not a requirement',
    lead: 'The system works fully without AI. If you want, we add automations that take over tedious, repetitive tasks.',
    switch: 'Option: AI',
    you: 'You do',
    ai: 'AI does',
    note: 'AI prepares, you approve.',
    tasks: [
      { t: 'Reply to a new inquiry', ai: true },
      { t: 'Copy client details from an email', ai: true },
      { t: 'Agree the quote with the client', ai: false },
      { t: 'Remind about tomorrow’s measuring', ai: true },
      { t: 'Sum up the meeting notes', ai: true },
      { t: 'Decide what comes first', ai: false },
    ],
  },
  ending: {
    title: 'Let’s start with a conversation',
    text: 'Tell us about your business and we will fit the system to it.',
    cta: 'Free consultation',
  },
};

const scenes = (l: Locale): SystemCrmScenes => ({
  heroPoints: heroPointsCopy[l], lead: leadCopy[l], eyes: eyesCopy[l], mods: modsCopy[l], ai: aiSceneCopy[l],
});

export const systemCrmCopy: Record<Locale, SystemCrmCopy> = {
  pl: typo({ ...PL_COPY, x: scenes('pl') }),
  en: { ...EN_COPY, x: scenes('en') },
};
