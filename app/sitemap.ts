import { MetadataRoute } from 'next';
import { projects } from './data/projects';
import { blogPosts } from './data/posts';
import { SITE } from '@/lib/seo-data';

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
  { url: '/uslugi/design', priority: 0.7, freq: 'monthly' as const },
  // Aktywne podstrony usług (slugi zaktualizowane 2026-05-28 - restrukturyzacja oferty)
  { url: '/uslugi/strony-www/one-page', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/strona-firmowa', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/strona-szyta-na-miare', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/sklep-internetowy', priority: 0.9, freq: 'weekly' as const },
  { url: '/uslugi/strony-www/system-crm', priority: 0.85, freq: 'weekly' as const },
  { url: '/uslugi/design/ui-ux', priority: 0.85, freq: 'monthly' as const },
  { url: '/uslugi/automatyzacje-ai/chatboty-ai', priority: 0.9, freq: 'weekly' as const },
  // POMIJAMY: /uslugi/marketing oraz /uslugi/marketing/audyt-wydajnosci-seo
  // bo zwracają null (puste strony). Dodaj tutaj gdy będą uzupełnione.
];

// Data builda - używana jako fallback gdy nie mamy lepszej informacji o ostatniej zmianie.
const BUILD_DATE = new Date();

// Stała data dla treści które rzadko się zmieniają (zapobiega oznaczaniu wszystkiego "dzisiaj").
const STATIC_DATE = new Date('2026-01-15');

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Strony statyczne (główna struktura)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${DOMAIN}/`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${DOMAIN}/uslugi`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${DOMAIN}/realizacje`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${DOMAIN}/blog`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${DOMAIN}/o-nas`, lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${DOMAIN}/kontakt`, lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${DOMAIN}/polityka-prywatnosci`, lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 2. Podstrony usług (hardcoded, sprawdzone)
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_PAGES.map((s) => ({
    url: `${DOMAIN}${s.url}`,
    lastModified: STATIC_DATE,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  // 3. Strony case study (tylko hasCaseStudy: true - bo tylko one mają realny content)
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.hasCaseStudy)
    .map((project) => ({
      url: `${DOMAIN}/realizacje/${project.slug}`,
      lastModified: new Date(`${project.year}-01-01`), // realny rok projektu
      changeFrequency: 'yearly',
      priority: 0.6,
    }));

  // 4. Posty bloga (lastModified = data publikacji)
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
}
