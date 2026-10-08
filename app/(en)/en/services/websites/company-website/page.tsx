import type { Metadata } from 'next';
import { StronaFirmowa } from '../../../../../(pl)/uslugi/strony-www/strona-firmowa/StronaFirmowa';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { companyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Company website',
  description:
    'A multipage company website that builds trust: services, about, work and contact. Every service has its own page, plus Google reviews, a map with directions and language versions. A design from scratch, fast loading.',
  path: '/en/services/websites/company-website',
};

export const metadata: Metadata = {
  title: 'Company website - a multipage site that builds trust',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/strona-firmowa', 'en'),
  keywords: ['company website', 'professional business website', 'multipage website', 'website for a company', 'B2B website', 'Core Web Vitals'],
  openGraph: {
    title: 'Company website - Avenly',
    description: 'A multipage company website: every service has its own page, so clients land straight on the one they need.',
    url: SERVICE.path,
    type: 'website',
  },
};

export default function CompanyWebsitePageEn() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Websites"
        categoryPath="/en/services/websites"
        serviceType="Corporate Website Development"
        locale="en"
      />
      <StronaFirmowa t={companyCopy.en} locale="en" />
    </>
  );
}
