import type { Metadata } from 'next';
import { AppWebClient } from './AppWebClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'System CRM i automatyzacje AI',
  description:
    'Dedykowane systemy CRM, portale klienta, panele B2B i narzędzia wewnętrzne - z automatyzacjami AI, które przejmują żmudną, ręczną pracę. Oprogramowanie szyte pod Twój proces, z autentykacją, rolami i integracjami.',
  path: '/uslugi/strony-www/system-crm',
};

export const metadata: Metadata = {
  title: 'System CRM i automatyzacje AI - dedykowane systemy dla firm',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['system CRM na zamówienie', 'custom CRM', 'automatyzacje AI dla firm', 'portal klienta', 'system B2B', 'software house Polska'],
  openGraph: {
    title: 'System CRM i automatyzacje AI - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
  },
};

export default function SystemCrmPage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Custom CRM & Business Automation Development"
      />
      <AppWebClient />
    </>
  );
}
