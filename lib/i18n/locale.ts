/**
 * i18n core - PL (główny, na roocie) + EN (prefiks /en).
 *
 * Architektura (static export, bez middleware):
 * - Polski: obecne URL-e bez zmian (app/(pl)/...) - NIE ruszamy zaindeksowanych ścieżek.
 * - Angielski: lustrzane drzewo pod /en (app/(en)/en/...), te same slugi.
 * - Route groups = dwa root layouty = poprawny <html lang> w statycznym HTML.
 * - Słowniki per strona/sekcja w lib/i18n/*, importowane TYLKO w server page
 *   i podawane do komponentów klienckich przez props - w bundlu JS nie ma
 *   żadnego słownika, w RSC payload jest wyłącznie wybrany język.
 */

export type Locale = 'pl' | 'en';

export const LOCALES: Locale[] = ['pl', 'en'];
export const DEFAULT_LOCALE: Locale = 'pl';

/** Czy pathname należy do drzewa EN (usePathname nie ma trailing slash). */
export const isEnPathname = (pathname: string | null): boolean =>
  !!pathname && (pathname === '/en' || pathname.startsWith('/en/'));

export const localeFromPathname = (pathname: string | null): Locale =>
  isEnPathname(pathname) ? 'en' : 'pl';

/**
 * Mapa segmentów PL → EN (przetłumaczone slugi w drzewie /en).
 * Segment nieobecny w mapie zostaje bez zmian (one-page, design, ui-ux,
 * slugi projektów/postów). Katalogi w app/(en)/en/ MUSZĄ odpowiadać tej mapie.
 */
const PL_TO_EN_SEGMENT: Record<string, string> = {
  'o-nas': 'about-us',
  kontakt: 'contact',
  uslugi: 'services',
  'strony-www': 'websites',
  'strona-firmowa': 'company-website',
  'strona-szyta-na-miare': 'custom-website',
  'sklep-internetowy': 'online-store',
  'system-crm': 'crm-system',
  'automatyzacje-ai': 'ai-automation',
  'chatboty-ai': 'ai-chatbots',
  realizacje: 'work',
};

const EN_TO_PL_SEGMENT: Record<string, string> = Object.fromEntries(
  Object.entries(PL_TO_EN_SEGMENT).map(([pl, en]) => [en, pl]),
);

const mapSegments = (path: string, map: Record<string, string>): string => {
  const [purePath, suffix = ''] = path.split(/(?=[?#])/, 2);
  const mapped = purePath
    .split('/')
    .map((seg) => map[seg] ?? seg)
    .join('/');
  return mapped + suffix;
};

/** Ścieżka PL → odpowiednik EN. '/' → '/en/', '/o-nas' → '/en/about-us'. */
export const toEnPath = (plPath: string): string =>
  plPath === '/' ? '/en/' : `/en${mapSegments(plPath, PL_TO_EN_SEGMENT)}`;

/** Ścieżka EN → odpowiednik PL. '/en' i '/en/' → '/', '/en/about-us' → '/o-nas'. */
export const toPlPath = (enPath: string): string => {
  if (enPath === '/en' || enPath === '/en/') return '/';
  const stripped = enPath.startsWith('/en/') ? enPath.slice(3) : enPath;
  return mapSegments(stripped, EN_TO_PL_SEGMENT);
};

/**
 * Ścieżki bez wersji EN w v1 (blog PL-only, polityka prywatności po polsku).
 * Toggle z tych stron prowadzi na EN homepage zamiast w 404.
 */
const EN_UNTRANSLATED_PREFIXES = ['/blog', '/polityka-prywatnosci', '/uslugi/marketing', '/nie-znaleziono'];

/** Link do tej samej strony w drugim języku (dla toggle'a w Navbarze). */
export const switchLocalePath = (pathname: string | null): string => {
  const p = pathname || '/';
  if (isEnPathname(p)) return toPlPath(p);
  if (EN_UNTRANSLATED_PREFIXES.some((prefix) => p.startsWith(prefix))) return '/en/';
  return toEnPath(p);
};

/** Prefiksuje wewnętrzny href zgodnie z locale ('/kontakt' → '/en/kontakt'). */
export const localizeHref = (href: string, locale: Locale): string => {
  if (locale === 'pl') return href;
  if (!href.startsWith('/')) return href; // kotwice #, external
  return toEnPath(href);
};

/**
 * Metadata alternates dla przetłumaczonej pary stron (hreflang + canonical).
 * Wołaj TYLKO na stronach które realnie mają obie wersje. x-default → polska
 * (język główny). Ścieżki podawaj w wariancie PL, bez domeny (metadataBase
 * dokleja SITE.url), z trailing slash zgodnym z konfiguracją.
 */
export const i18nAlternates = (plPath: string, locale: Locale) => {
  const enPath = toEnPath(plPath);
  return {
    canonical: locale === 'pl' ? plPath : enPath,
    languages: {
      'pl-PL': plPath,
      en: enPath,
      'x-default': plPath,
    },
  };
};
