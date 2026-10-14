import type { Metadata } from 'next';
import { Chatboty } from '../../../../../(pl)/uslugi/automatyzacje-ai/chatboty-ai/Chatboty';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { chatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'AI chatbots',
  title: 'An AI chatbot that answers your clients right away',
  description:
    'Hundreds of questions a day. None left unanswered. An AI assistant knows your offer, answers clients at night too and hands you ready inquiries. Quote in 24 h.',
  path: '/en/services/ai-automation/ai-chatbots',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/automatyzacje-ai/chatboty-ai', 'en'),
  keywords: ['AI chatbot', 'chatbot for website', 'AI chatbot development', 'AI chatbot quote', 'AI assistant for business', 'AI agency Poland'],
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
