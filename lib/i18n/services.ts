import { services } from '@/app/data/services';
import type { Locale } from '@/lib/i18n/locale';

/**
 * i18n dla danych usług + słownik sekcji Services (Oferta na homepage; z jej tekstów korzysta też katalog /uslugi).
 *
 * Zasady (wzorzec: lib/i18n/home/hero.ts):
 * - PL = tekst 1:1 bajt w bajt ze źródeł (app/data/services.ts + komponenty).
 * - EN = natywne copy marketingowe (benefit voice you/your, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk, "Free consultation").
 * - Struktura danych (id/slug/href/icon/kolory) IDENTYCZNA w obu locale -
 *   tłumaczymy WYŁĄCZNIE stringi.
 * - Import TYLKO w server page; słownik wędruje do klienta jako props.
 */

/** Typ danych usług - jedno źródło prawdy to app/data/services.ts (PL + struktura). */
export type ServicesData = typeof services;

// ─── DANE USŁUG PER LOCALE ─────────────────────────────────────────────────────
// EN budowane przez map po PL: spread zachowuje icon/href/id/slug/kolory verbatim,
// override podmienia wyłącznie stringi (zero rozjazdu struktury z PL).

type CategoryStrings = { label: string; description: string; longDescription: string };
type CardStrings = {
  title: string;
  desc: string;
  fullDescription: string;
  features: string[];
  techStack?: string[];
};

const EN_CATEGORY: Record<string, CategoryStrings> = {
  dev: {
    label: 'Websites',
    description:
      'From simple landing pages, through multi page company sites, all the way to dedicated systems.',
    longDescription: 'We build enterprise grade software...',
  },
  ai: {
    label: 'AI automation',
    description:
      'Hire technology instead of more employees. Repetitive tasks handle themselves.',
    longDescription: 'Artificial intelligence changes the game...',
  },
  marketing: {
    label: 'Marketing & sales',
    description:
      'Even the best product needs an audience. You get precise traffic that turns into customers.',
    longDescription: 'Data driven marketing is our specialty...',
  },
};

const EN_CARD: Record<string, CardStrings> = {
  '/uslugi/strony-www/one-page': {
    title: 'One page website',
    desc: 'One page, one goal. All the key information on a single, fast and persuasive site - perfect for ad campaigns and projects just getting started.',
    fullDescription:
      'The ideal solution for startups, freelancers and ad campaigns. A one page website is a condensed dose of information that guides your client along a simple path: from learning about the offer, through trust, to getting in touch. We code them in Next.js - they load in a fraction of a second, look great on phones and are optimized for conversion.',
    features: [
      'Fast turnaround (3-5 days)',
      'Fully responsive (RWD)',
      'Contact form section',
      'Basic SEO optimization',
      'Google Maps integration',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Cloudflare'],
  },
  '/uslugi/strony-www/strona-firmowa': {
    title: 'Company website',
    desc: 'A complete, multi page website for your business. Every service gets its own subpage, so clients reach what they need without searching.',
    fullDescription:
      'A professional, multi page company website on a modern, fast stack. Every service has its own subpage, and the code is tuned for Core Web Vitals and SEO. You get integrations with maps, Google reviews, forms and everything else you need.',
    features: [
      'Custom visual design',
      'A subpage for every service',
      'Google Maps and Google reviews integration',
      'Core Web Vitals optimization',
      'Multi language support',
      'Contact form',
    ],
    techStack: ['Next.js', 'SEO', 'Cloudflare'],
  },
  '/uslugi/strony-www/strona-szyta-na-miare': {
    title: 'Interactive website',
    desc: 'The top shelf. Designed from the first stroke and coded from scratch in Next.js - blazing fast, with smooth motion and your brand\'s mood.',
    fullDescription:
      'A premium option for brands that want to stand out. The frontend is coded from scratch in Next.js + Tailwind, with no ready made theme limits and no attack prone plugins. We combine performance, full design freedom and smooth animations that guide your client\'s eye.',
    features: [
      'Unique design coded from scratch',
      'Blazing fast loading',
      'Your brand\'s mood from the first stroke',
      'Smooth animations and scroll bound effects',
      'Maximum security (zero PHP, zero plugins)',
      'Full scalability and custom integrations',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Cloudflare'],
  },
  '/uslugi/strony-www/sklep-internetowy': {
    title: 'Online store',
    desc: 'A store that keeps selling while you rest. Payments by BLIK and card, shipping by courier or to a parcel locker, plus an order panel anyone can handle.',
    fullDescription:
      'A fast online store coded in Next.js and matched to your products. Customers pay by BLIK, card or Przelewy24, choose shipping by courier or to a parcel locker, and orders wait for you in one panel.',
    features: [
      'Przelewy24 / Stripe / BLIK integration',
      'Product filtering and variants',
      'Fast shopping cart',
      'Shipping by courier or to a parcel locker',
      'Order management panel',
      'Easy shopping on a phone',
    ],
    techStack: ['Next.js', 'Przelewy24', 'Cloudflare'],
  },
  '/uslugi/strony-www/system-crm': {
    title: 'CRM system and AI automation',
    desc: 'Dedicated CRM systems, client portals and B2B panels, and on request AI automation that takes over the tedious, manual work. Built around your process, not a template.',
    fullDescription:
      'For businesses with an internal process that needs digitizing - a CRM system, client portal, management panel or internal tool. We build the frontend in React/Next.js and the backend in Node.js + Supabase/Postgres, with full authentication (login, roles, permissions), your own business logic and integrations (email, calendar, third party provider APIs). This is NOT an off the shelf SaaS - it is a system coded exactly around your processes, where on request AI automation takes over repetitive, manual work.',
    features: [
      'Custom UI tailored to your company processes',
      'Authentication, roles, permissions',
      'Database (Supabase / Postgres) with encrypted storage',
      'Integrations (email, calendar, external APIs)',
      'Admin panel for operators',
      'Enterprise grade scalability and security',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Supabase / Postgres', 'Tailwind CSS', 'Cloudflare'],
  },
  '/uslugi/automatyzacje-ai/chatboty-ai': {
    title: 'AI chatbots',
    desc: 'Customer service 24/7 with no human needed.',
    fullDescription:
      'The AI assistant knows your offer, understands context and answers your clients at any hour, in many languages. Ready inquiries go straight to you.',
    features: [
      'Customer service 24/7',
      'Integration with your company knowledge base',
      'Multi language support',
      'Sales lead capture',
      'Personalized responses',
    ],
  },
  '/uslugi/marketing/audyt-wydajnosci-seo': {
    title: 'Performance & SEO audit',
    desc: '',
    fullDescription:
      'A quick review of your current website. You see what slows it down and what gets in its way in Google, and you get a list of things to fix.',
    features: [
      'Technical site review',
      'Loading speed',
      'A list of fixes',
    ],
  },
};

const servicesEn: ServicesData = services.map((category) => ({
  ...category,
  ...EN_CATEGORY[category.id],
  cards: category.cards.map((card) => ({
    ...card,
    ...EN_CARD[card.href],
  })),
})) as ServicesData;

/** Dane usług per locale. pl = źródło, en = głęboka kopia z przetłumaczonymi stringami. */
export const servicesByLocale: Record<Locale, ServicesData> = {
  pl: services,
  en: servicesEn,
};

// ─── SEKCJA "USŁUGI" NA HOMEPAGE (components/sections/Services.tsx) ─────────────

/** Teksty jednej usługi w nowej sekcji Oferta (klucz = `href` karty z app/data/services.ts). */
export interface OfferItemCopy {
  /** Nazwa w pisowni zdaniowej (dane w app/data/services.ts mają Title Case, ale są współdzielone). */
  name: string;
  /** Krótka nazwa (skala "Stroik"). */
  short: string;
  /** Jedno zdanie korzyści. */
  line: string;
  /** Trzy konkrety z listy funkcji usługi (bez nowych obietnic i metryk). */
  points: string[];
  /** Podpisy trzech kroków scenki na rysunku (co usługa robi dla klienta, krok po kroku). */
  story: [string, string, string];
}

export interface ServicesSectionDict {
  headingLead: string;
  headingAccent: string;
  lead: string;
  /** Prefiks CTA desktop, renderowany jako `${seeMorePrefix} ${category.label}`. */
  seeMorePrefix: string;
  /** Etykieta linku "więcej" w karuzeli mobilnej. */
  moreLabel: string;

  // ── Sekcja Oferta, układ "Plan" (2026-09-27, praca równoległa - chat 3; components/sections/
  //    services/*). Pola wyżej (headingLead ... moreLabel) należały do dawnego układu - dziś nieużywane,
  //    zostawione do decyzji przy konsolidacji (zasada: nie usuwać istniejących pól wspólnego słownika).
  label: string;
  title: string;
  titleAccent: string;
  intro: string;
  /** Nazwy kategorii (klucz = `id` kategorii z app/data/services.ts). */
  categories: Record<string, string>;
  /** Teksty usług (klucz = `href` karty). */
  items: Record<string, OfferItemCopy>;
  details: string;
  soon: string;
  all: string;
  undecided: string;
  cta: string;
  listAria: string;
  legendAria: string;
  /** Podpis rysunku ("Rys. 4"). */
  figLabel: string;
}

export const servicesSectionDict: Record<Locale, ServicesSectionDict> = {
  pl: {
    headingLead: 'Nasze',
    headingAccent: 'usługi',
    lead: 'Strategia, design i wdrożenie u jednego zespołu. Oszczędzasz czas i dostajesz spójny, gotowy produkt.',
    seeMorePrefix: 'Zobacz',
    moreLabel: 'Więcej',

    label: 'Oferta',
    title: 'Jeden zespół. ',
    titleAccent: 'Cała Twoja obecność online.',
    intro: 'Nie szukasz osobno grafika, programisty i kogoś od AI. Projekt, kod i automatyzacje powstają w jednym miejscu, więc wszystko do siebie pasuje.',
    categories: {
      dev: 'Strony WWW',
      ai: 'Automatyzacja AI',
      marketing: 'Marketing i sprzedaż',
    },
    items: {
      '/uslugi/strony-www/one-page': {
        name: 'Strona one-page',
        short: 'One-page',
        line: 'Jedna strona, jeden cel. Klient od pierwszego ekranu wie, co oferujesz, i pisze do Ciebie, zanim zdąży się rozmyślić.',
        points: ['Startujesz w 3-5 dni', 'Zapytania prosto do Ciebie', 'Wygodna na każdym telefonie'],
        story: ['Klient od razu wie, co oferujesz, i klika.', 'Kilka pól i formularz jest gotowy.', 'Zapytanie w tej samej chwili ląduje u Ciebie.'],
      },
      '/uslugi/strony-www/strona-firmowa': {
        name: 'Strona firmowa',
        short: 'Firmowa',
        line: 'Twoja firma wygląda w sieci tak solidnie, jak pracuje na co dzień. Klient bez szukania trafia do usługi, której potrzebuje.',
        points: ['Podstrona dla każdej usługi', 'Opinie Google i mapa dojazdu', 'Każdy klient w swoim języku'],
        story: ['Każda usługa dostaje własną podstronę.', 'Treść opowiada o ofercie Twoim językiem.', 'Klient trafia na nią prosto z menu.'],
      },
      '/uslugi/strony-www/strona-szyta-na-miare': {
        name: 'Strona interaktywna',
        short: 'Interaktywna',
        line: 'To już nie tylko strona, to uczucie. Projekt od pierwszej kreski, płynny ruch i nastrój Twojej marki, który klient zapamiętuje.',
        points: ['Projekt od pierwszej kreski', 'Ruch, który prowadzi wzrok', 'Nastrój Twojej marki'],
        story: ['Klient od pierwszej chwili czuje nastrój Twojej marki.', 'Ruch płynnie prowadzi jego wzrok.', 'Strona odpowiada na każdy gest klienta.'],
      },
      '/uslugi/strony-www/sklep-internetowy': {
        name: 'Sklep internetowy',
        short: 'Sklep',
        line: 'Sklep, który sprzedaje także wtedy, gdy Ty odpoczywasz. Klient płaci BLIK-iem lub kartą, a zamówienia czekają na Ciebie w jednym panelu.',
        points: ['BLIK, karta i Przelewy24', 'Kurier lub paczkomat', 'Zamówienia w jednym panelu'],
        story: ['Klient wybiera produkt i wrzuca go do koszyka.', 'Płaci tak, jak lubi: BLIK-iem albo kartą.', 'Paczka już jedzie, a Ty masz kolejne zamówienie.'],
      },
      '/uslugi/strony-www/system-crm': {
        name: 'System CRM i automatyzacje AI',
        short: 'CRM i AI',
        line: 'Koniec z arkuszami i karteczkami. Całą firmę widzisz w jednym systemie szytym pod Twój proces, a na życzenie AI przejmie żmudne zadania.',
        points: ['Każdy widzi to, co powinien', 'Spięty z pocztą i kalendarzem', 'Opcjonalnie automatyzacje AI'],
        story: ['Wpada zapytanie i nic już nie ginie.', 'Jeśli chcesz, AI zrobi ręczną robotę za Ciebie.', 'Klient dostaje maila, a Ty masz wolną głowę.'],
      },
      '/uslugi/automatyzacje-ai/chatboty-ai': {
        name: 'Chatboty AI',
        short: 'Chatbot AI',
        line: 'Twój najlepszy sprzedawca pracuje także w nocy. Asystent AI zna Twoją ofertę, odpowiada klientom od razu i przekazuje Ci gotowe zapytania.',
        points: ['Zna Twoją ofertę na pamięć', 'Rozmawia w wielu językach', 'Gotowe zapytania w skrzynce'],
        story: ['Klient pyta o ofertę o drugiej w nocy.', 'Asystent odpowiada w kilka sekund, konkretnie.', 'Rano gotowe zapytanie czeka w Twojej skrzynce.'],
      },
      '/uslugi/marketing/audyt-wydajnosci-seo': {
        name: 'Audyt wydajności i SEO',
        short: 'Audyt',
        line: 'Szybki przegląd Twojej obecnej strony. Sprawdzasz, co ją spowalnia i co przeszkadza jej w Google, i dostajesz listę rzeczy do poprawy.',
        points: ['Przegląd techniczny strony', 'Szybkość ładowania', 'Lista rzeczy do poprawy'],
        story: ['Twoja strona przechodzi przegląd.', 'Wychodzą błędy i wolne elementy.', 'Poprawiasz je po kolei, według listy.'],
      },
    },
    details: 'Zobacz szczegóły',
    soon: 'Wkrótce',
    all: 'Cała oferta',
    undecided: 'Nie wiesz, co wybrać?',
    cta: 'Bezpłatna konsultacja',
    listAria: 'Usługi',
    legendAria: 'Co dostajesz',
    figLabel: 'Rys.',
  },
  en: {
    headingLead: 'Our',
    headingAccent: 'services',
    lead: 'Strategy, design and delivery from one team. You save time and get a consistent, ready to use product.',
    seeMorePrefix: 'See',
    moreLabel: 'More',

    label: 'Services',
    title: 'One team. ',
    titleAccent: 'Your whole online presence.',
    intro: 'No need to find a designer, a developer and an AI specialist separately. Design, code and automation come from one place, so everything fits together.',
    categories: {
      dev: 'Websites',
      ai: 'AI automation',
      marketing: 'Marketing and sales',
    },
    items: {
      '/uslugi/strony-www/one-page': {
        name: 'One page website',
        short: 'One page',
        line: 'One page, one goal. From the first screen your client knows what you offer and writes to you before they can change their mind.',
        points: ['Live in 3-5 days', 'Inquiries straight to you', 'Easy on every phone'],
        story: ['Your client instantly gets your offer and clicks.', 'A few fields and the form is ready.', 'The inquiry lands with you the very same moment.'],
      },
      '/uslugi/strony-www/strona-firmowa': {
        name: 'Company website',
        short: 'Company',
        line: 'Your business looks as solid online as it works every day. Clients reach the service they need without searching.',
        points: ['A subpage for every service', 'Google reviews and directions', 'Every client in their language'],
        story: ['Every service gets its own subpage.', 'The content tells your offer in your voice.', 'Clients reach it straight from the menu.'],
      },
      '/uslugi/strony-www/strona-szyta-na-miare': {
        name: 'Interactive website',
        short: 'Interactive',
        line: 'It\'s not just a website anymore, it\'s a feeling. Designed from the first stroke, with smooth motion and your brand\'s mood that clients remember.',
        points: ['Designed from the first stroke', 'Motion that guides the eye', 'Your brand\'s mood'],
        story: ['From the first moment, clients feel your brand\'s mood.', 'Motion smoothly guides their eye.', 'The site responds to every gesture.'],
      },
      '/uslugi/strony-www/sklep-internetowy': {
        name: 'Online store',
        short: 'Store',
        line: 'A store that keeps selling while you rest. Customers pay by BLIK or card, and orders wait for you in one panel.',
        points: ['BLIK, card and Przelewy24', 'Courier or parcel locker', 'All orders in one panel'],
        story: ['A customer picks a product and drops it in the cart.', 'They pay the way they like: BLIK or card.', 'The parcel is on its way, and you have another order.'],
      },
      '/uslugi/strony-www/system-crm': {
        name: 'CRM system and AI automation',
        short: 'CRM and AI',
        line: 'No more spreadsheets and sticky notes. You see your whole business in one system built around your process, and on request AI takes over tedious tasks.',
        points: ['Everyone sees what they should', 'Connected to email and calendar', 'Optional AI automation'],
        story: ['A new inquiry arrives and nothing gets lost.', 'If you want, AI does the manual work for you.', 'Your client gets an email, and your mind is free.'],
      },
      '/uslugi/automatyzacje-ai/chatboty-ai': {
        name: 'AI chatbots',
        short: 'AI chatbot',
        line: 'Your best salesperson now works nights too. The AI assistant knows your offer, answers clients right away and hands you ready inquiries.',
        points: ['Knows your offer by heart', 'Speaks many languages', 'Ready inquiries in your inbox'],
        story: ['A client asks about your offer at 2 a.m.', 'The assistant answers in seconds, to the point.', 'In the morning, a ready inquiry waits in your inbox.'],
      },
      '/uslugi/marketing/audyt-wydajnosci-seo': {
        name: 'Performance and SEO audit',
        short: 'Audit',
        line: 'A quick review of your current website. You see what slows it down and what gets in its way in Google, and you get a list of things to fix.',
        points: ['Technical site review', 'Loading speed', 'A list of fixes'],
        story: ['Your site gets a review.', 'Errors and slow elements come to light.', 'You fix them one by one from the list.'],
      },
    },
    details: 'See details',
    soon: 'Coming soon',
    all: 'All services',
    undecided: 'Not sure what to pick?',
    cta: 'Free consultation',
    listAria: 'Services',
    legendAria: 'What you get',
    figLabel: 'Fig.',
  },
};

// Katalog usług (/uslugi i strony kategorii) ma własny słownik: lib/i18n/uslugi/kategorie.ts (catalogDict),
// a nazwy, zdania korzyści, legendę i kroki usług bierze z servicesSectionDict (wyżej). Dawny servicesHubDict
// (ServicesHub.tsx) usunięty 2026-09-29 (praca równoległa, chat 2).
