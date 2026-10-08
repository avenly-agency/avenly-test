import { servicesByLocale, servicesSectionDict } from '@/lib/i18n/services';
import { catalogDict, type CatalogDict, type CatalogPageHead, type CatalogScope } from '@/lib/i18n/uslugi/kategorie';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ArtId } from '@/components/sections/services/shared';

// Model katalogu usług (/uslugi, /uslugi/strony-www i wersje EN; /uslugi/design usunięte 2026-10-01 razem z usługą
// „Projekt UI/UX” - decyzja właściciela). Budowany w server page,
// do klienta idą same teksty (ikony z app/data/services.ts nie przechodzą przez granicę RSC).
// Kolejność, kategorie i adresy = app/data/services.ts (jak Oferta na stronie głównej), teksty usług
// = servicesSectionDict.items (Oferta), teksty katalogu = catalogDict.

export interface CatalogItem {
  /** Stabilny klucz = polska ścieżka podstrony (href z app/data/services.ts). */
  key: string;
  n: number;
  /** Adres zlokalizowany. */
  href: string;
  /** Podstrona jeszcze nie istnieje (audyt) - "Wkrótce", bez linku. */
  soon: boolean;
  cat: string;
  catLabel: string;
  name: string;
  /** Pierwsze zdanie `line` (chwyt) i reszta (konkret). */
  hook: string;
  body: string;
  /** Opis na kaflu katalogu: własny tekst katalogu (catalogDict.tiles) albo chwyt z Oferty. */
  tile: string;
  /** Trzy konkrety = legenda 1-3 (numery jak na rysunku). */
  points: string[];
  /** Podpisy trzech kroków scenki rysunku. */
  story: string[];
  /** Akcent usługi "r g b" - jasny odcień koloru jej podstrony (jak w Ofercie). */
  acc: string;
  /** Rysunek usługi z Oferty (components/sections/services/drawings.tsx). */
  art: ArtId;
}

export interface CatalogModel {
  locale: Locale;
  scope: CatalogScope;
  head: CatalogPageHead;
  t: CatalogDict;
  items: CatalogItem[];
  /** Kategorie do filtra (kolejność jak w danych). */
  cats: { id: string; label: string }[];
  allHref: string;
  ctaHref: string;
  /** Ścieżka - tylko dane strukturalne (BreadcrumbList); widocznej ścieżki nie ma (właściciel, runda 7). */
  crumbs: { name: string; url: string }[];
}

/** Wygląd usług - te same akcenty i rysunki co LOOK w components/sections/services/shared.tsx (Oferta). */
const LOOK: Record<string, { acc: string; art: ArtId }> = {
  '/uslugi/strony-www/one-page': { acc: '147 197 253', art: 'onepage' },
  '/uslugi/strony-www/strona-firmowa': { acc: '110 231 183', art: 'company' },
  '/uslugi/strony-www/strona-szyta-na-miare': { acc: '253 164 175', art: 'custom' },
  '/uslugi/strony-www/sklep-internetowy': { acc: '252 211 77', art: 'store' },
  '/uslugi/strony-www/system-crm': { acc: '125 211 252', art: 'crm' },
  '/uslugi/automatyzacje-ai/chatboty-ai': { acc: '253 186 116', art: 'chat' },
  '/uslugi/marketing/audyt-wydajnosci-seo': { acc: '94 234 212', art: 'audit' },
};

const SCOPE_CATEGORY: Record<CatalogScope, string | null> = { hub: null, www: 'dev' };

/** "Chwyt. Konkret." -> [chwyt, konkret] (pierwsze zdanie i reszta). */
const splitLine = (line: string): [string, string] => {
  const m = line.match(/^(.+?[.!?])\s+(.+)$/);
  return m ? [m[1], m[2]] : [line, ''];
};

export const buildCatalog = (locale: Locale, scope: CatalogScope): CatalogModel => {
  const t = catalogDict[locale];
  const offer = servicesSectionDict[locale];
  const only = SCOPE_CATEGORY[scope];
  const all = servicesByLocale[locale].flatMap((c) =>
    c.cards.map((card) => {
      const copy = offer.items[card.href];
      const [hook, body] = splitLine(copy?.line ?? card.desc);
      const look = LOOK[card.href] ?? { acc: '147 197 253', art: 'onepage' as ArtId };
      const soon = card.href.startsWith('/uslugi/marketing');
      return {
        key: card.href,
        n: 0,
        href: soon ? '' : localizeHref(card.href, locale),
        soon,
        cat: c.id,
        catLabel: offer.categories[c.id] ?? c.label,
        name: copy?.name ?? card.title,
        hook,
        body,
        tile: t.tiles[card.href] ?? hook,
        points: copy?.points ?? card.features.slice(0, 3),
        story: copy?.story ?? [],
        acc: look.acc,
        art: look.art,
      };
    }),
  );
  // Numeracja w obrębie strony (01, 02 ...).
  const items = (only ? all.filter((it) => it.cat === only) : all).map((it, n) => ({ ...it, n }));
  const m: CatalogModel = {
    locale,
    scope,
    head: t.pages[scope],
    t,
    items,
    cats: servicesByLocale[locale].filter((c) => !only || c.id === only).map((c) => ({ id: c.id, label: offer.categories[c.id] ?? c.label })),
    allHref: localizeHref('/uslugi', locale),
    ctaHref: localizeHref('/kontakt', locale),
    crumbs: [],
  };
  m.crumbs = catalogCrumbs(m);
  return m;
};

const slash = (u: string) => (u.endsWith('/') ? u : `${u}/`);

/** Dane do BreadcrumbList (lib/schemas.ts). */
export const catalogCrumbs = (m: CatalogModel) => {
  const home = { name: m.t.breadcrumbHome, url: localizeHref('/', m.locale) };
  const hub = { name: m.t.breadcrumbServices, url: m.allHref };
  const list = m.scope === 'hub' ? [home, hub]
    : [home, hub, { name: m.head.label, url: localizeHref('/uslugi/strony-www', m.locale) }];
  return list.map((c) => ({ ...c, url: slash(c.url) }));
};
