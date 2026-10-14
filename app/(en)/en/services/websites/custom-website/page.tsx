import type { Metadata } from 'next';
import { CustomWebsite } from '../../../../../(pl)/uslugi/strony-www/strona-szyta-na-miare/CustomWebsite';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { customCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { i18nAlternates } from '@/lib/i18n/locale';

// Description kept to about 160 characters, without facts shared by every website service ("coded from scratch,
// no ready made themes" - PRODUCT.md, Copy Voice 11) and without "premium" in the keywords (Copy Voice 10).
const SERVICE = {
  name: 'Interactive website',
  title: 'Interactive website - not just a website, a feeling',
  description:
    'It’s not just a website anymore, it’s a feeling. Designed from the first stroke, with smooth motion and your brand’s mood that clients remember.',
  path: '/en/services/websites/custom-website',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/strona-szyta-na-miare', 'en'),
  keywords: ['interactive website', 'animated website', 'custom web design', 'Next.js website', 'website animations'],
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

export default function CustomWebsitePageEn() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Websites"
        categoryPath="/en/services/websites"
        serviceType="Custom Web Development"
        locale="en"
      />
      <CustomWebsite t={customCopy.en} locale="en" />
    </>
  );
}
