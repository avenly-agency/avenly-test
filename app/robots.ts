import { MetadataRoute } from 'next';

// 👇 DODAJ TĘ LINIĘ:
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    // Zmień na swoją domenę
    sitemap: 'https://avenly.pl/sitemap.xml', 
  };
}