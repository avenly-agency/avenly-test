import { MetadataRoute } from 'next';

// To jest super ważne na Hostingerze (generuje statyczny plik przy buildzie)
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      // 👇 Tutaj poprawna blokada AI (zamiast Content-Signal)
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://avenly.pl/sitemap.xml',
  };
}