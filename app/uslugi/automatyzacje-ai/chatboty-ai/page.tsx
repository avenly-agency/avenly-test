import type { Metadata } from 'next';
import { ChatbotsAIClient } from './ChatbotsAIClient';

export const metadata: Metadata = {
  title: 'Chatboty AI — Automatyzacja sprzedaży i obsługi klienta | Avenly',
  description:
    'Chatbot AI działający 24/7 na Twojej stronie — kwalifikuje leady, prowadzi rozmowy i integruje się z CRM. Żadnych formularzy, żadnych opóźnień.',
  alternates: { canonical: '/uslugi/automatyzacje-ai/chatboty-ai' },
};

export default function ChatbotsAIPage() {
  return <ChatbotsAIClient />;
}
