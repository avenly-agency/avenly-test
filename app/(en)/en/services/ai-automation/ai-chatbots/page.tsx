import type { Metadata } from 'next';
import { Chatboty } from '../../../../../(pl)/uslugi/automatyzacje-ai/chatboty-ai/Chatboty';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { chatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'AI chatbots',
  description:
    'An AI assistant on your website knows your offer, answers clients right away, at night too, and hands you ready inquiries.',
  path: '/en/services/ai-automation/ai-chatbots',
};

export const metadata: Metadata = {
  title: 'AI chatbots - an assistant that answers your clients right away',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/automatyzacje-ai/chatboty-ai', 'en'),
  keywords: ['AI chatbot', 'chatbot for website', 'AI chatbot development', 'AI chatbot quote', 'AI assistant for business', 'AI agency Poland'],
  openGraph: {
    title: 'AI chatbots - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
  },
};

export default function ChatbotsAIPageEn() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="AI automation"
        categoryPath="/en/services"
        serviceType="AI Chatbot Development"
        locale="en"
      />
      <Chatboty t={chatbotsCopy.en} locale="en" />
    </>
  );
}
