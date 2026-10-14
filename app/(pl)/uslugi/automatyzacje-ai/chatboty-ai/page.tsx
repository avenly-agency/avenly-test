import type { Metadata } from 'next';
import { Chatboty } from './Chatboty';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { chatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Chatboty AI',
  title: 'Chatbot AI, który odpowiada klientom od razu',
  description:
    'Setki pytań każdego dnia. Żadne bez odpowiedzi. Asystent AI zna Twoją ofertę, odpowiada klientom także w nocy i przekazuje Ci gotowe zapytania. Wycena w 24 h.',
  path: '/uslugi/automatyzacje-ai/chatboty-ai',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/automatyzacje-ai/chatboty-ai', 'pl'),
  keywords: ['chatbot AI', 'chatbot na stronę', 'wdrożenie chatbota AI', 'wycena chatbota AI', 'asystent AI dla firmy', 'agencja AI Polska'],
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

export default function ChatbotsAIPage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Automatyzacja AI"
        categoryPath="/uslugi"
        serviceType="AI Chatbot Development"
      />
      <Chatboty t={chatbotsCopy.pl} />
    </>
  );
}
