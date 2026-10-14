import type { Metadata } from 'next';
import { OnePage } from '../../../../../(pl)/uslugi/strony-www/one-page/OnePage';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { onePageCopy } from '@/lib/i18n/uslugi/one-page';

// Description kept to about 160 characters. The "in 3-5 days" term was confirmed by the owner on 2026-10-02.
const SERVICE = {
  name: 'One page website',
  title: 'One page website - one page, one goal',
  description:
    'From the first screen your client knows what you offer and writes to you before they change their mind. Live in 3-5 days. Free consultation.',
  path: '/en/services/websites/one-page',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/one-page', 'en'),
  keywords: ['one page website', 'landing page', 'one page quote', 'landing page for ad campaign', 'business card website'],
  // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so it is given in full.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Avenly',
    url: `${SERVICE.path}/`,
    title: SERVICE.title,
    description: SERVICE.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - interactive agency', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SERVICE.title,
    description: SERVICE.description,
    images: ['/og-default.png'],
  },
};

export default function OnePageServiceEn() {
  return (
    <>
      <ServicePageSchema
        locale="en"
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Websites"
        categoryPath="/en/services/websites"
        serviceType="Web Development - Landing Page"
      />
      <OnePage t={onePageCopy.en} locale="en" />
    </>
  );
}
