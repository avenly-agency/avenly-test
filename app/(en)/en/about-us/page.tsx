import { ONasClient } from '../../../(pl)/o-nas/ONasClient';
import { oNasDict } from '@/lib/i18n/o-nas';

export default function AboutPageEn() {
  return <ONasClient t={oNasDict.en} locale="en" />;
}
