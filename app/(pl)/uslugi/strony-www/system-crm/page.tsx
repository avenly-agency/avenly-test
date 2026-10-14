import type { Metadata } from 'next';
import { SystemCrm } from './SystemCrm';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { systemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { i18nAlternates } from '@/lib/i18n/locale';

// Opis i tytuł: AI wyłącznie jako OPCJA (właściciel 2026-10-05: „AI jest opcjonalne, a nie zapewnienie, że będzie”;
// PRODUCT.md, „Co obiecujemy w ofercie”), bez widoku klienta jako obietnicy, bez żargonu
// („autentykacja”, „panele B2B”). Nazwa usługi jak w Ofercie na stronie głównej.
// Tytuł do ok. 60 znaków z marką, opis do ok. 160 (dłuższe Google ucina); AI nazwane wprost jako opcja.
const SERVICE = {
  name: 'System CRM i automatyzacje AI',
  title: 'System CRM zbudowany pod Twój proces',
  description:
    'Koniec z arkuszami i karteczkami. Zapytania, klienci, zadania i kalendarz w jednym systemie CRM pod Twój proces. AI jako opcja. Bezpłatna konsultacja.',
  path: '/uslugi/strony-www/system-crm',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/system-crm', 'pl'),
  keywords: ['system CRM dla firmy', 'system CRM na zamówienie', 'dedykowany system CRM', 'CRM dla małej firmy', 'automatyzacje AI dla firm'],
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: `${SERVICE.path}/`,
    title: SERVICE.title,
    description: SERVICE.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SERVICE.title,
    description: SERVICE.description,
    images: ['/og-default.png'],
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
