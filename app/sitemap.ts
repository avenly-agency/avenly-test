import { MetadataRoute } from 'next';
import { projects } from './data/projects';
import { blogPosts } from './data/posts';
import { SITE } from '@/lib/seo-data';
import { toEnPath } from '@/lib/i18n/locale';

export const dynamic = 'force-static';

const DOMAIN = SITE.url;

/**
 * Realne, ISTNIEJĄCE URL-e usług.
 * NIE iterujemy po `services.ts` - tam są niezgodne href-y prowadzące do 404
 * (np. `/uslugi/design/design-stron-internetowych` zamiast `/uslugi/design/ui-ux`).
 * Lepiej trzymać tu hardcoded listę zsynchronizowaną z faktyczną strukturą `app/uslugi/`.
 */
const SERVICE_PAGES = [
  // Kategorie
  { url: '/uslugi/strony-www', priority: 0.85, freq: 'weekly' as const },
  // /uslugi/design i /uslugi/design/ui-ux USUNIĘTE 2026-10-01 (projekt UI/UX nie jest już osobną usługą; 301 w public/_redirects).
  // Aktywne podstrony usług (slugi zaktualizowane 2026-05-28 - restrukturyzacja oferty)
  { url: '/uslugi/strony-www/one-page', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/strona-firmowa', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/strona-szyta-na-miare', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/sklep-internetowy', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/system-crm', priority: 0.85, freq: 'weekly' as const },
  { url: '/uslugi/automatyzacje-ai/chatboty-ai', priority: 0.9, freq: 'weekly' as const },
  // POMIJAMY: /uslugi/marketing oraz /uslugi/marketing/audyt-wydajnosci-seo
  // bo zwracają null (puste strony). Dodaj tutaj gdy będą uzupełnione.
];

// Data builda - używana jako fallback gdy nie mamy lepszej informacji o ostatniej zmianie.
const BUILD_DATE = new Date();

// Stała data dla treści które rzadko się zmieniają (zapobiega oznaczaniu wszystkiego "dzisiaj").
const STATIC_DATE = new Date('2026-01-15');

// hreflang alternates dla par PL↔EN (te same slugi, EN pod /en).
// Używane TYLKO dla stron które realnie mają obie wersje (blog i polityka
// prywatności są PL-only - bez alternates i bez wpisów /en).
const langAlternates = (plPath: string) => ({
  languages: {
    'pl-PL': `${DOMAIN}${plPath || '/'}`,
    en: `${DOMAIN}${toEnPath(plPath || '/')}`,
    'x-default': `${DOMAIN}${plPath || '/'}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Strony statyczne (główna struktura). `translated` = ma wersję /en.
  const staticPages = [
    { path: '', lastModified: BUILD_DATE, freq: 'weekly' as const, priority: 1.0, translated: true },
    { path: '/uslugi', lastModified: BUILD_DATE, freq: 'monthly' as const, priority: 0.9, translated: true },
    { path: '/realizacje', lastModified: BUILD_DATE, freq: 'monthly' as const, priority: 0.85, translated: true },
    { path: '/blog', lastModified: BUILD_DATE, freq: 'weekly' as const, priority: 0.8, translated: false },
    { path: '/o-nas', lastModified: STATIC_DATE, freq: 'yearly' as const, priority: 0.7, translated: true },
    { path: '/kontakt', lastModified: STATIC_DATE, freq: 'yearly' as const, priority: 0.7, translated: true },
    { path: '/polityka-prywatnosci', lastModified: STATIC_DATE, freq: 'yearly' as const, priority: 0.3, translated: false },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.flatMap((p) => {
    const alternates = p.translated ? langAlternates(p.path) : undefined;
    const plEntry = {
      url: `${DOMAIN}${p.path || '/'}`,
      lastModified: p.lastModified,
      changeFrequency: p.freq,
      priority: p.priority,
      ...(alternates ? { alternates } : {}),
    };
    if (!p.translated) return [plEntry];
    return [
      plEntry,
      { ...plEntry, url: `${DOMAIN}${toEnPath(p.path || '/')}`, priority: Math.max(0.3, p.priority - 0.2) },
    ];
  });

  // 2. Podstrony usług (hardcoded, sprawdzone) - PL + EN z alternates
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_PAGES.flatMap((s) => {
    const base = {
      lastModified: STATIC_DATE,
      changeFrequency: s.freq,
      alternates: langAlternates(s.url),
    };
    return [
      { ...base, url: `${DOMAIN}${s.url}`, priority: s.priority },
      { ...base, url: `${DOMAIN}${toEnPath(s.url)}`, priority: Math.max(0.3, s.priority - 0.2) },
    ];
  });

  // 3. Strony case study (tylko hasCaseStudy: true - bo tylko one mają realny content)
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.hasCaseStudy)
    .flatMap((project) => {
      const path = `/realizacje/${project.slug}`;
      const base = {
        lastModified: new Date(`${project.year}-01-01`), // realny rok projektu
        changeFrequency: 'yearly' as const,
        alternates: langAlternates(path),
      };
      return [
        { ...base, url: `${DOMAIN}${path}`, priority: 0.6 },
        { ...base, url: `${DOMAIN}${toEnPath(path)}`, priority: 0.4 },
      ];
    });

  // 4. Posty bloga (lastModified = data publikacji)
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
}
