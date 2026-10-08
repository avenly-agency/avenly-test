import type { Metadata } from 'next';
import { SystemCrm } from '../../../../../(pl)/uslugi/strony-www/system-crm/SystemCrm';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { systemCrmCopy } from '@/lib/i18n/uslugi/system-crm';

const SERVICE = {
  name: 'CRM system and AI automations',
  description:
    'A CRM system built around your process: inquiries, clients, tasks and calendar in one place. Everyone in the company sees what they should. AI automations are an optional extra you add when you want.',
  path: '/en/services/websites/crm-system',
};

export const metadata: Metadata = {
  title: 'CRM system built around your process, with optional AI automations',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/system-crm', 'en'),
  keywords: ['custom CRM system', 'custom CRM', 'AI automations for business', 'B2B system', 'software house Poland'],
  openGraph: {
    title: 'CRM system built around your process - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
