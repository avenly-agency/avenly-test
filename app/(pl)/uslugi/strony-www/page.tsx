import type { Metadata } from 'next';
import { Catalog } from '../_katalog/Catalog';
import { buildCatalog } from '../_katalog/model';
import { i18nAlternates } from '@/lib/i18n/locale';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Strony WWW - one-page, firmowe, sklepy i systemy CRM',
  description:
    'Strona one-page, firmowa, interaktywna, sklep internetowy i system CRM. Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.',
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: '/uslugi/strony-www/',
    title: 'Strona, która rośnie z firmą - strony WWW Avenly',
    description: 'Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strona, która rośnie z firmą - strony WWW Avenly',
    description: 'Klient sprawdza Cię w sieci, zanim zadzwoni. Od Twojej strony zależy, czy to zrobi.',
    images: ['/og-default.png'],
  },
  alternates: i18nAlternates('/uslugi/strony-www', 'pl'),
};

export default function WebCategoryPage() {
  const m = buildCatalog('pl', 'www');
  return (
    <>
      <JsonLd data={breadcrumbSchema(m.crumbs)} />
      <Catalog m={m} />
    </>
  );
}
