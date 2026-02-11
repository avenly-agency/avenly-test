import { MetadataRoute } from 'next';
import { services } from './data/services'; 
import { projects } from './data/projects'; 

// 👇 TO JEST KLUCZOWE - DODAJ TĘ LINIĘ:
export const dynamic = 'force-static';

const DOMAIN = 'https://avenly.pl'; 

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Podstawowe strony statyczne
  const staticRoutes = [
    '',
    '/uslugi',
    '/realizacje',
    '/o-nas',
    '/kontakt',
    '/polityka-prywatnosci',
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Generowanie stron KATEGORII usług
  const categoryRoutes = services.map((category) => ({
    url: `${DOMAIN}/uslugi/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Generowanie stron KONKRETNYCH USŁUG
  const serviceRoutes = services.flatMap((category) => 
    category.cards.map((card) => {
        return {
            url: `${DOMAIN}${card.href}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        };
    })
  );

  // 4. Generowanie stron PROJEKTÓW
  const projectRoutes = projects.map((project) => ({
    url: `${DOMAIN}/realizacje/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Łączymy wszystko w jedną tablicę
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...serviceRoutes,
    ...projectRoutes,
  ];
}