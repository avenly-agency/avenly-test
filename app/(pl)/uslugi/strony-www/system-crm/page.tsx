import type { Metadata } from 'next';
import { SystemCrm } from './SystemCrm';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { systemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { i18nAlternates } from '@/lib/i18n/locale';

// Opis i tytuł: AI wyłącznie jako OPCJA (właściciel 2026-10-05: „AI jest opcjonalne, a nie zapewnienie, że będzie”;
// PRODUCT.md, „Co obiecujemy w ofercie”), bez widoku klienta jako obietnicy, bez żargonu
// („autentykacja”, „panele B2B”). Nazwa usługi jak w Ofercie na stronie głównej.
const SERVICE = {
  name: 'System CRM i automatyzacje AI',
  description:
    'System CRM zbudowany pod Twój proces: zapytania, klienci, zadania i kalendarz w jednym miejscu. Każdy w firmie widzi to, co powinien. Automatyzacje AI są opcją, którą dokładasz, gdy zechcesz.',
  path: '/uslugi/strony-www/system-crm',
};

export const metadata: Metadata = {
  title: 'System CRM zbudowany pod Twój proces, opcjonalnie z automatyzacjami AI',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/system-crm', 'pl'),
  keywords: ['system CRM na zamówienie', 'custom CRM', 'automatyzacje AI dla firm', 'system B2B', 'software house Polska'],
  openGraph: {
    title: 'System CRM zbudowany pod Twój proces - Avenly',
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
      <SystemCrm t={systemCrmCopy.pl} />
    </>
  );
}
