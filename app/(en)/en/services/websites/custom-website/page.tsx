import type { Metadata } from 'next';
import { CustomWebsite } from '../../../../../(pl)/uslugi/strony-www/strona-szyta-na-miare/CustomWebsite';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { customCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Interactive website',
  description:
    'It’s not just a website anymore, it’s a feeling. Designed from the first stroke, with smooth motion and your brand’s mood that clients remember. Coded from scratch, with no ready made themes.',
  path: '/en/services/websites/custom-website',
};

export const metadata: Metadata = {
  title: 'Interactive website - not just a website, a feeling',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/strona-szyta-na-miare', 'en'),
  keywords: ['interactive website', 'animated website', 'premium brand website', 'custom web design', 'Next.js website', 'website animations'],
  openGraph: {
    title: 'Interactive website - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
