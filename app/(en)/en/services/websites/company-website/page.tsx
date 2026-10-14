import type { Metadata } from 'next';
import { StronaFirmowa } from '../../../../../(pl)/uslugi/strony-www/strona-firmowa/StronaFirmowa';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { companyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { i18nAlternates } from '@/lib/i18n/locale';

// Title = the page heading; description kept to about 160 characters.
const SERVICE = {
  name: 'Company website',
  title: 'Company website that builds trust',
  description:
    'Your company looks as solid online as it works every day. Every service has its own page, so clients land straight on the one they need. Free consultation.',
  path: '/en/services/websites/company-website',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/strona-firmowa', 'en'),
  keywords: ['company website', 'website for a company', 'professional business website', 'multipage website', 'company website quote'],
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
