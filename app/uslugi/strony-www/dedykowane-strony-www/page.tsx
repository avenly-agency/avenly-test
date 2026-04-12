import type { Metadata } from 'next';
import { DedicatedWebsiteClient } from './DedicatedWebsiteClient';

export const metadata: Metadata = {
  title: 'Dedykowane Strony WWW — Custom Web Development & Panele Klienta | Avenly',
  description: 'Zaawansowane platformy internetowe, panele klienta i aplikacje webowe szyte na miarę. Architektura Headless, React, Next.js — technologia liderów dla Twojego biznesu.',
  alternates: { canonical: '/uslugi/strony-www/dedykowane-strony-www' },
};

export default function DedicatedWebsitesPage() {
  return <DedicatedWebsiteClient />;
}
