import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji "Realizacje" (homepage, 2. sekcja pod hero) - wariant 8b "Kurtyna"
 * z handoffu claude-design/design_handoff_avenly_realizacje. Wzorzec jak hero.ts:
 * same stringi, JSX/klasy/geometria w komponencie i CSS (.rz-* w globals.css).
 * Import WYŁĄCZNIE przez lib/i18n/home/index.ts (server page → props).
 *
 * Kolejność `items` = tablica ORDER niżej (decyzja właściciela), dane po kluczu projektu
 * (fakty z app/data/projects.ts). Bez roku w panelach (decyzja właściciela).
 * Obrazy: kadry 16:9 generowane przez scripts/realizacje-images.mjs (public/portfolio/stage)
 * z masterów Full HD @2x w assets/screenshots (zrzuty stron na żywo; AI = avenly.pl z otwartym czatem).
 * Copy bez myślnika em (PRODUCT.md). Podpowiedź desktop opisuje automat + klik (bez scroll-locka
 * z makiety - decyzja właściciela), dotyk: swipe lub wybór z indeksu.
 */

export interface RealizacjeItem {
  /** Nazwa w indeksie (proper noun - jak `title` w projects.ts, nietłumaczone). */
  name: string;
  /** Kategoria - tylko dla czytników ekranu / SEO (sr-only w linku). */
  category: string;
  /** Ścieżka PL - komponent lokalizuje przez localizeHref. */
  href: string;
  /** Slug plików w public/portfolio/stage/ ({slug}-{w}.webp, {slug}-thumb-{w}.webp). */
  image: string;
  /** Dostępne szerokości kadru (srcset) - patrz skrypt generujący. */
  widths: number[];
  /** alt kadru na scenie (opisowy, dla SEO obrazów). */
  alt: string;
  /** Barwy mgławicy tła: [jasna, głęboka] w RGB 0-1 (kolory marki danej realizacji). */
  tint: [RGB, RGB];
  /** Panele obok kadru (desktop) / blok pod indeksem (flow). */
  info: RealizacjeInfo;
}

export type RGB = [number, number, number];

/** Treść paneli bocznych - wyłącznie fakty z realizacji (app/data/projects.ts; RKS także dokumentacja
    projektu rksweb: strona + aplikacja klubowa app.klubsportowyrks.pl), bez metryk (PRODUCT.md). */
export interface RealizacjeInfo {
  /** Krótki opis projektu (lewy panel). */
  summary: string;
  /** Zakres prac (prawy panel). */
  scope: string[];
  /** Technologie - jak techStack w projects.ts (bez pozycji nietechnicznych). */
  tech: string[];
  /** Domena strony klienta (link zewnętrzny) albo null. */
  site: string | null;
  /** Etykieta głównego linku (do case study / usługi). */
  cta: string;
  /** Dodatkowy przycisk otwierający czat Avenly AI (tylko asystent). */
  chat?: string;
}

export interface RealizacjeLabels {
  scope: string;
  tech: string;
  /** aria-label linku zewnętrznego: `${siteAria} ${domena}`. */
  siteAria: string;
}

export interface RealizacjeDict {
  /** Nagłówek sekcji (h2) - etykieta "Realizacje". */
  label: string;
  /** Tytuł sekcji pod etykietą (duży, wyśrodkowany nad kadrem). */
  lede: string;
  /** Podpowiedź chrome (desktop, mysz): kadry zmieniają się same, klik wybiera. */
  hint: string;
  /** Podpowiedź chrome (dotyk / okno bez pinowania). */
  hintTouch: string;
  /** aria-label nawigacji indeksu. */
  navLabel: string;
  /** aria-label linku przy aktywnej pozycji: `${openPrefix} ${name}`. */
  openPrefix: string;
  /** Nazwa listy w JSON-LD ItemList. */
  listName: string;
  /** Etykiety paneli bocznych. */
  labels: RealizacjeLabels;
  /** Dokładnie 4 pozycje. */
  items: RealizacjeItem[];
}

const STAGE_WIDTHS = [720, 1200, 1800, 2400, 3200];

type ItemKey = 'rks' | 'kardys' | 'asystent' | 'mcentrum';

/** Kolejność 01-04 = decyzja właściciela (Sesja 31): RKS → Kardyś → Wirtualny Asystent AI →
    Mcentrumfizjoterapia. Zmiana kolejności = tylko ta tablica (dane niżej są po kluczu). */
const ORDER: ItemKey[] = ['rks', 'kardys', 'asystent', 'mcentrum'];

/** Dane wspólne dla języków. `tint` = barwy mgławicy [jasna, głęboka] z identyfikacji realizacji
    (RKS czerwień klubu, Kardyś mosiądz tabliczek + karmazyn marki, Mcentrum pomarańcz,
    asystent błękit Avenly). Nazwa = proper noun (jak `title` / `client` w projects.ts). */
const BASE: Record<ItemKey, {
  name: string; href: string; image: string; tint: [RGB, RGB]; tech: string[]; site: string | null;
}> = {
  rks: { name: 'Klub Sportowy RKS', href: '/realizacje/klub-sportowy', image: 'klub-sportowy', tint: [[0.86, 0.16, 0.13], [0.34, 0.03, 0.08]], tech: ['Next.js', 'Supabase', 'Resend', 'Cloudflare'], site: 'klubsportowyrks.pl' },
  kardys: { name: 'Grawerstwo Józef Kardyś', href: '/realizacje/grawerstwo-kardys', image: 'grawerstwo-kardys', tint: [[0.86, 0.62, 0.30], [0.42, 0.05, 0.08]], tech: ['Next.js', 'Supabase', 'Przelewy24', 'Cloudflare'], site: 'grawerstwomielec.pl' },
  asystent: { name: 'Wirtualny Asystent AI', href: '/uslugi/automatyzacje-ai/chatboty-ai', image: 'wirtualny-asystent-ai', tint: [[0.20, 0.40, 0.96], [0.20, 0.10, 0.52]], tech: ['Claude AI', 'Next.js', 'TypeScript'], site: null },
  mcentrum: { name: 'Mcentrumfizjoterapia', href: '/realizacje/mcentrumfizjoterapia', image: 'mcentrumfizjoterapia', tint: [[1.0, 0.52, 0.08], [0.40, 0.16, 0.02]], tech: ['CMS', 'Booksy', 'Cloudflare'], site: 'mcentrumfizjoterapia.pl' },
};

type ItemText = { category: string; alt: string; summary: string; scope: string[]; cta: string; chat?: string };

const build = (texts: Record<ItemKey, ItemText>): RealizacjeItem[] =>
  ORDER.map((key) => {
    const b = BASE[key];
    const tx = texts[key];
    return {
      name: b.name,
      category: tx.category,
      href: b.href,
      image: b.image,
      widths: [...STAGE_WIDTHS],
      alt: tx.alt,
      tint: [[...b.tint[0]], [...b.tint[1]]] as [RGB, RGB],
      info: {
        summary: tx.summary,
        scope: tx.scope,
        tech: [...b.tech],
        site: b.site,
        cta: tx.cta,
        ...(tx.chat ? { chat: tx.chat } : {}),
      },
    };
  });

export const realizacjeDict: Record<Locale, RealizacjeDict> = {
  pl: {
    label: 'Realizacje',
    lede: 'Projekty, które już działają',
    hint: 'Kliknij miniaturę, żeby zobaczyć projekt',
    hintTouch: 'Przesuń kadr lub wybierz projekt',
    navLabel: 'Wybrane realizacje',
    openPrefix: 'Otwórz realizację:',
    listName: 'Wybrane realizacje Avenly',
    labels: { scope: 'Zakres', tech: 'Technologia', siteAria: 'Otwórz w nowej karcie stronę' },
    items: build({
      rks: {
        category: 'strona WWW i aplikacja',
        alt: 'Strona główna klubu sportowego RKS',
        // 2026-10-08 (właściciel: „strona klubu z terminarzem” to niedopowiedzenie, „wszędzie”): pełna modernizacja strony z WordPressa
        summary: 'Kompletne zaplecze cyfrowe klubu siatkarskiego z III ligi: w pełni zmodernizowana strona klubu oraz aplikacja, w której zarząd, trenerzy, zawodnicy i rodzice prowadzą składki, treningi, obecności i komunikację.',
        scope: ['Pełna modernizacja strony klubu', 'Aplikacja do zarządzania klubem', 'Składki, kalendarz i obecności', 'Zapisy online do akademii', 'Prowadzenie social mediów klubu'],
        cta: 'Zobacz realizację',
      },
      kardys: {
        category: 'strona, sklep i panel',
        alt: 'Strona główna sklepu internetowego Grawerstwo Józef Kardyś',
        summary: 'Pracownia działa od 1990 roku, ale w sieci miała przestarzałą stronę na WordPressie i sklep, który przestał działać i od dawna nie przynosił zamówień. Dziś ma nową stronę, sklep z płatnościami online i jeden panel do zarządzania stroną i sklepem.',
        scope: ['Nowa strona firmowa PL / EN', 'Nowy sklep internetowy', 'Płatności BLIK, kartą i przelewem', 'Konto klienta i ponowne zamówienia', 'Panel do zarządzania stroną i sklepem'],
        cta: 'Zobacz realizację',
      },
      asystent: {
        category: 'AI i boty',
        alt: 'Okno czatu z wirtualnym asystentem AI Avenly',
        summary: 'Działa na tej stronie, w prawym dolnym rogu. Zna ofertę Avenly, odpowiada o każdej porze i przekazuje zespołowi gotowe zapytania.',
        scope: ['Odpowiedzi o ofercie', 'Gotowe zapytania dla zespołu', 'Historia rozmów w CRM'],
        cta: 'Zobacz chatboty AI',
        chat: 'Porozmawiaj z asystentem',
      },
      mcentrum: {
        category: 'strona WWW',
        alt: 'Strona główna gabinetu fizjoterapii Mcentrumfizjoterapia',
        summary: 'Start nowej marki gabinetu fizjoterapii. Szybka strona zbudowana pod lokalne wyszukiwanie, z rezerwacją wizyt przez Booksy.',
        scope: ['Wizerunek nowej marki', 'Lokalne SEO', 'Rezerwacje online'],
        cta: 'Zobacz realizację',
      },
    }),
  },
  en: {
    label: 'Our work',
    lede: 'Projects that are already live',
    hint: 'Click a thumbnail to see the project',
    hintTouch: 'Swipe the frame or pick a project',
    navLabel: 'Selected work',
    openPrefix: 'Open project:',
    listName: 'Selected work by Avenly',
    labels: { scope: 'Scope', tech: 'Stack', siteAria: 'Open in a new tab:' },
    items: build({
      rks: {
        category: 'website and app',
        alt: 'Home page of the RKS sports club',
        summary: 'The complete digital backbone of a third-division volleyball club: a fully modernized club website, plus an app where the board, coaches, players and parents handle fees, training, attendance and messaging.',
        scope: ['Full club website modernization', 'Club management app', 'Fees, calendar and attendance', 'Online academy sign-ups', 'Club social media management'],
        cta: 'View project',
      },
      kardys: {
        category: 'website, store and panel',
        alt: 'Home page of the Grawerstwo Józef Kardyś online store',
        summary: 'The workshop has been in business since 1990, yet online it had an outdated WordPress site and a store that had stopped working and hadn\'t brought in orders for a long time. Today it has a new website, a store with online payments and one panel to manage both.',
        scope: ['New company website PL / EN', 'New online store', 'BLIK, card and bank transfer payments', 'Customer accounts and repeat orders', 'Website and store management panel'],
        cta: 'View project',
      },
      asystent: {
        category: 'AI and bots',
        alt: 'Chat window of the Avenly virtual AI assistant',
        summary: 'It runs on this very site, in the bottom right corner. It knows Avenly\'s offer, answers at any hour and hands the team ready inquiries.',
        scope: ['Answers about the offer', 'Ready inquiries for the team', 'Chat history in the CRM'],
        cta: 'See AI chatbots',
        chat: 'Talk to the assistant',
      },
      mcentrum: {
        category: 'website',
        alt: 'Home page of the Mcentrumfizjoterapia physiotherapy clinic',
        summary: 'A new physiotherapy brand launch. A fast website built for local search, with appointment booking through Booksy.',
        scope: ['New brand presence', 'Local SEO', 'Online booking'],
        cta: 'View project',
      },
    }),
  },
};
