import { HomeClient } from '@/components/home/HomeClient';
import { homeDict } from '@/lib/i18n/home';

// Server page - slownik PL idzie do klienta przez props (RSC payload),
// nie w bundlu JS. Cala logika/lazy-loading w HomeClient.
export default function Home() {
  return <HomeClient t={homeDict.pl} locale="pl" />;
}
