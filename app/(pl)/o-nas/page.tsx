import { ONasClient } from './ONasClient';
import { oNasDict } from '@/lib/i18n/o-nas';

export default function AboutPage() {
  return <ONasClient t={oNasDict.pl} locale="pl" />;
}
