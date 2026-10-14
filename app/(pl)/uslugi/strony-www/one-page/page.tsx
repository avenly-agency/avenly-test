import type { Metadata } from 'next';
import { OnePage } from './OnePage';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { onePageCopy } from '@/lib/i18n/uslugi/one-page';

// Opis do ok. 160 znaków (dłuższy Google ucina). Termin „Start w 3-5 dni” potwierdzony przez właściciela 2026-10-02.
const SERVICE = {
  name: 'Strona one-page',
  title: 'Strona one-page - jedna strona, jeden cel',
  description:
    'Klient od pierwszego ekranu wie, co oferujesz, i pisze do Ciebie, zanim zdąży się rozmyślić. Start w 3-5 dni. Bezpłatna konsultacja.',
  path: '/uslugi/strony-www/one-page',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/one-page', 'pl'),
  keywords: ['strona one-page', 'landing page', 'wycena one page', 'strona pod kampanię reklamową', 'strona wizytówka'],
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

export default function OnePageService() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Web Development - Landing Page"
      />
      <OnePage t={onePageCopy.pl} />
    </>
  );
}
