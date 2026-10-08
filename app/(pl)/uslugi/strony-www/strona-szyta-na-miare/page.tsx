import type { Metadata } from 'next';
import { CustomWebsite } from './CustomWebsite';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { customCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { i18nAlternates } from '@/lib/i18n/locale';

// Nazwa usługi od 2026-10-06: „Strona interaktywna” (właściciel: „trzeba zmienić nazwę szyta na miarę, bo każda firma
// tak pisze i jest to cringe”). Adres podstrony i nazwy plików zostają do końca pracy równoległej (potem zmiana z 301).
const SERVICE = {
  name: 'Strona interaktywna',
  description:
    'To już nie tylko strona, to uczucie. Projekt od pierwszej kreski, płynny ruch i nastrój Twojej marki, który klient zapamiętuje. Strona kodowana od zera, bez gotowych szablonów.',
  path: '/uslugi/strony-www/strona-szyta-na-miare',
};

export const metadata: Metadata = {
  title: 'Strona interaktywna - to już nie tylko strona, to uczucie',
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['strona interaktywna', 'interaktywna strona internetowa', 'strona internetowa z animacjami', 'strona premium dla marki', 'indywidualny projekt strony', 'strona Next.js', 'animacje na stronie internetowej'],
  openGraph: {
    title: 'Strona interaktywna - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
