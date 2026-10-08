import type { Metadata } from 'next';
import { Catalog } from '../../../(pl)/uslugi/_katalog/Catalog';
import { buildCatalog } from '../../../(pl)/uslugi/_katalog/model';
import { i18nAlternates } from '@/lib/i18n/locale';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Services - websites, online stores, CRM systems and AI chatbots',
  description:
    'Websites, online stores, CRM systems and AI chatbots. Clients judge your business before they get in touch. Here you decide what they see.',
  // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so it is given in full.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Avenly',
    url: '/en/services/',
    title: 'From a website to a system - Avenly services',
    description: 'Clients judge your business before they get in touch. Here you decide what they see.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - interactive agency', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'From a website to a system - Avenly services',
    description: 'Clients judge your business before they get in touch. Here you decide what they see.',
    images: ['/og-default.png'],
  },
  alternates: i18nAlternates('/uslugi', 'en'),
};

export default function ServicesPageEn() {
  const m = buildCatalog('en', 'hub');
  return (
    <>
      <JsonLd data={breadcrumbSchema(m.crumbs)} />
      <Catalog m={m} />
    </>
  );
}
