import type { Metadata } from 'next';
import { OnePage } from '../../../../../(pl)/uslugi/strony-www/one-page/OnePage';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { onePageCopy } from '@/lib/i18n/uslugi/one-page';

const SERVICE = {
  name: 'One page website',
  description:
    'One page, one goal. From the first screen your client knows what you offer and writes to you through the form. A design from scratch, easy on every phone, fast loading.',
  path: '/en/services/websites/one-page',
};

export const metadata: Metadata = {
  title: 'One page website - one page, one goal',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/one-page', 'en'),
  keywords: ['one page website', 'landing page', 'one page quote', 'landing page for ad campaign', 'business card website'],
  openGraph: {
    title: 'One page website - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
