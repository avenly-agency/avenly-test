import { HomeClient } from '@/components/home/HomeClient';
import { homeDict } from '@/lib/i18n/home';

// EN homepage - ten sam HomeClient, slownik en. Metadata dziedziczona
// z app/(en)/layout.tsx (canonical /en/ + hreflang pl/en/x-default).
export default function HomeEn() {
  return <HomeClient t={homeDict.en} locale="en" />;
}
