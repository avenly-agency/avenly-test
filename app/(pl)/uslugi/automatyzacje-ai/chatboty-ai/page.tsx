import type { Metadata } from 'next';
import { Chatboty } from './Chatboty';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { chatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Chatboty AI',
  description:
    'Asystent AI na Twojej stronie zna Twoją ofertę, odpowiada klientom od razu, także w nocy, i przekazuje Ci gotowe zapytania.',
  path: '/uslugi/automatyzacje-ai/chatboty-ai',
};

export const metadata: Metadata = {
  title: 'Chatboty AI - asystent, który odpowiada klientom od razu',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/automatyzacje-ai/chatboty-ai', 'pl'),
  keywords: ['chatbot AI', 'chatbot na stronę', 'wdrożenie chatbota AI', 'wycena chatbota AI', 'asystent AI dla firmy', 'agencja AI Polska'],
  openGraph: {
    title: 'Chatboty AI - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
