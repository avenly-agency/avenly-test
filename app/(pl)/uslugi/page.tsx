import type { Metadata } from 'next';
import { Catalog } from './_katalog/Catalog';
import { buildCatalog } from './_katalog/model';
import { i18nAlternates } from '@/lib/i18n/locale';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Usługi - strony WWW, sklepy, systemy CRM i chatboty AI',
  description:
    'Strony WWW, sklepy internetowe, systemy CRM i chatboty AI. Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.',
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: '/uslugi/',
    title: 'Od strony po system - usługi Avenly',
    description: 'Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Od strony po system - usługi Avenly',
    description: 'Klient ocenia Twoją firmę, zanim się odezwie. Tu decydujesz, co wtedy zobaczy.',
    images: ['/og-default.png'],
  },
  alternates: i18nAlternates('/uslugi', 'pl'),
};

export default function ServicesPage() {
  const m = buildCatalog('pl', 'hub');
  return (
    <>
      <JsonLd data={breadcrumbSchema(m.crumbs)} />
      <Catalog m={m} />
    </>
  );
}
