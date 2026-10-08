import type { Metadata } from 'next';
import { Catalog } from '../../../../(pl)/uslugi/_katalog/Catalog';
import { buildCatalog } from '../../../../(pl)/uslugi/_katalog/model';
import { i18nAlternates } from '@/lib/i18n/locale';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Websites - one page, company sites, online stores and CRM systems',
  description:
    'One page, company and interactive websites, online stores and CRM systems. Clients look you up online before they call. Your website decides whether they do.',
  // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so it is given in full.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Avenly',
    url: '/en/services/websites/',
    title: 'A website that grows with you - Avenly websites',
    description: 'Clients look you up online before they call. Your website decides whether they do.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - interactive agency', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A website that grows with you - Avenly websites',
    description: 'Clients look you up online before they call. Your website decides whether they do.',
    images: ['/og-default.png'],
  },
  alternates: i18nAlternates('/uslugi/strony-www', 'en'),
};

export default function WebCategoryPageEn() {
  const m = buildCatalog('en', 'www');
  return (
    <>
      <JsonLd data={breadcrumbSchema(m.crumbs)} />
      <Catalog m={m} />
    </>
  );
}
