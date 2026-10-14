import type { Metadata } from 'next';
import { CustomWebsite } from './CustomWebsite';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { customCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { i18nAlternates } from '@/lib/i18n/locale';

// Nazwa usługi od 2026-10-06: „Strona interaktywna” (właściciel: „trzeba zmienić nazwę szyta na miarę, bo każda firma
// tak pisze i jest to cringe”). Adres podstrony i nazwy plików zostają do końca pracy równoległej (potem zmiana z 301).
// Opis do ok. 160 znaków, bez rzeczy wspólnych dla wszystkich usług stron („kodowana od zera, bez szablonów” -
// PRODUCT.md, Copy Voice 11) i bez słowa „premium” w słowach kluczowych (Copy Voice 10).
const SERVICE = {
  name: 'Strona interaktywna',
  title: 'Strona interaktywna - nie tylko strona, to uczucie',
  description:
    'To już nie tylko strona, to uczucie. Projekt od pierwszej kreski, płynny ruch i nastrój Twojej marki, który klient zapamiętuje. Bezpłatna konsultacja.',
  path: '/uslugi/strony-www/strona-szyta-na-miare',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['strona interaktywna', 'interaktywna strona internetowa', 'strona internetowa z animacjami', 'indywidualny projekt strony', 'strona Next.js', 'animacje na stronie internetowej'],
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: `${SERVICE.path}/`,
    title: SERVICE.title,
    description: SERVICE.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SERVICE.title,
    description: SERVICE.description,
    images: ['/og-default.png'],
  },
};

export default function StronaSzytaNaMiarePage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Custom Web Development"
      />
      <CustomWebsite t={customCopy.pl} />
    </>
  );
}
