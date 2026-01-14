import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Przykładowo, jeśli kiedyś dodasz panel admina
    },
    // Zmień poniższy adres na swoją prawdziwą domenę!
    sitemap: 'https://avenly.pl/sitemap.xml', 
  };
}