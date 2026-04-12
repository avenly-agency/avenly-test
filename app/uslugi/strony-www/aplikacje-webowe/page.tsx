import type { Metadata } from 'next';
import { AppWebClient } from './AppWebClient';

export const metadata: Metadata = {
  title: 'Aplikacje Webowe — CRM, Portale Klienta & Systemy B2B | Avenly',
  description: 'Dedykowane aplikacje webowe i systemy CRM szyte na miarę. React, Next.js, własna baza danych — oprogramowanie, które automatyzuje Twój biznes i skaluje się bez ograniczeń.',
  alternates: { canonical: '/uslugi/strony-www/aplikacje-webowe' },
};

export default function AppWebPage() {
  return <AppWebClient />;
}
