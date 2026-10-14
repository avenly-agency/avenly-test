import type { Metadata } from 'next';
import { SystemCrm } from '../../../../../(pl)/uslugi/strony-www/system-crm/SystemCrm';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { systemCrmCopy } from '@/lib/i18n/uslugi/system-crm';

// Title within about 60 characters with the brand, description within about 160; AI named plainly as an option.
const SERVICE = {
  name: 'CRM system and AI automations',
  title: 'CRM system built around your process',
  description:
    'No more spreadsheets and sticky notes. Inquiries, clients, tasks and calendar in one CRM system built around your process. AI is optional. Free consultation.',
  path: '/en/services/websites/crm-system',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/system-crm', 'en'),
  keywords: ['CRM system for business', 'custom CRM system', 'bespoke CRM', 'CRM for small business', 'AI automations for business'],
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

export default function SystemCrmServiceEn() {
  return (
    <>
      <ServicePageSchema
        locale="en"
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Websites"
        categoryPath="/en/services/websites"
        serviceType="Custom CRM & Business Automation Development"
      />
      <SystemCrm t={systemCrmCopy.en} locale="en" />
    </>
  );
}
