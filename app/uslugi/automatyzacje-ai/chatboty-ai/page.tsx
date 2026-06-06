import type { Metadata } from 'next';
import { ChatbotsAIClient } from './ChatbotsAIClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'Chatboty AI',
  description:
    'Chatbot AI działający 24/7 na Twojej stronie - kwalifikuje leady, prowadzi rozmowy i integruje się z CRM. Żadnych formularzy, żadnych opóźnień.',
  path: '/uslugi/automatyzacje-ai/chatboty-ai',
};

export const metadata: Metadata = {
  title: 'Chatboty AI - Automatyzacja Sprzedaży i Obsługi Klienta 24/7',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['chatbot AI', 'chatbot GPT na stronę', 'wdrożenie chatbota AI', 'wycena chatbota AI', 'asystent AI dla firmy', 'agencja AI Polska', 'Voiceflow Polska'],
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
      <ChatbotsAIClient />
    </>
  );
}
