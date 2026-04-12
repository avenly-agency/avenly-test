import type { Metadata } from 'next';
import { CorporateWebsiteClient } from './CorporateWebsiteClient';

export const metadata: Metadata = {
  title: 'Profesjonalna Strona Firmowa — WordPress Premium, CMS & SEO | Avenly',
  description:
    'Profesjonalna strona firmowa B2B klasy premium. WordPress, własny CMS, Core Web Vitals, wielojęzyczność i pełna architektura SEO. Zbuduj autorytet online z Avenly.',
  openGraph: {
    title: 'Profesjonalna Strona Firmowa — Avenly',
    description:
      'Ultra-szybka, bezpieczna witryna B2B z własnym CMS-em. Zoptymalizowana pod Core Web Vitals i gotowa na tysiące odwiedzin.',
  },
  alternates: {
    canonical: '/uslugi/strony-www/profesjonalna-strona-firmowa',
  },
};

export default function ProfessionalWebsitePage() {
  return <CorporateWebsiteClient />;
}
