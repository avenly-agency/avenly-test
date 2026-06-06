import type { Metadata } from 'next';
import { CorporateWebsiteClient } from './CorporateWebsiteClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'Strona firmowa',
  description:
    'Profesjonalna, wielostronicowa strona firmowa z prostym panelem CMS. Sam dodajesz podstrony, blog i ofertę, bez pomocy programisty. Błyskawiczne ładowanie, integracja z Google Maps, opiniami Google i wielojęzyczność.',
  path: '/uslugi/strony-www/strona-firmowa',
};

export const metadata: Metadata = {
  title: 'Strona firmowa - Profesjonalna wielostronicowa witryna z CMS',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['strona firmowa', 'profesjonalna strona dla firmy', 'wielostronicowa strona internetowa', 'strona z CMS', 'strona B2B', 'Core Web Vitals'],
  openGraph: {
    title: 'Strona firmowa - Avenly',
    description: 'Wielostronicowa strona firmowa z prostym panelem CMS. Sam edytujesz treści, bez programisty.',
    url: SERVICE.path,
    type: 'website',
  },
};

export default function StronaFirmowaPage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Corporate Website Development"
      />
      <CorporateWebsiteClient />
    </>
  );
}
