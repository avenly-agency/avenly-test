import { MetadataRoute } from 'next';
// 👇 Upewnij się, że ścieżka do Twojego pliku z danymi jest poprawna
import { services } from './data/services'; 
import { projects } from './data/projects'; // Opcjonalnie: jeśli chcesz też projekty

const DOMAIN = 'https://avenly.pl'; // 👇 Zmień na swoją domenę

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

  // 2. Generowanie stron KATEGORII usług (np. /uslugi/design)
  const categoryRoutes = services.map((category) => ({
    url: `${DOMAIN}/uslugi/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Generowanie stron KONKRETNYCH USŁUG (np. /uslugi/design/ui-ux)
  // Musimy "spłaszczyć" strukturę: przechodzimy przez kategorie -> karty
  const serviceRoutes = services.flatMap((category) => 
    category.cards.map((card) => {
        // Wyciągamy slug usługi z linku (np. z "/uslugi/design/ui-ux" bierzemy końcówkę)
        // Zakładam, że w data/services card.href to pełny link np. "/uslugi/design/ui-ux"
        // Jeśli card.href jest relatywny, trzeba to dostosować. 
        // Tutaj bezpiecznie używamy pełnego URL.
        
        return {
            url: `${DOMAIN}${card.href}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        };
    })
  );

  // 4. (Opcjonalnie) Generowanie stron PROJEKTÓW / REALIZACJI
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